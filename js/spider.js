/* jshint esversion: 6 */
/* global document */

console.log("Spider init");

const storage = require("electron-json-storage");
let { ipcRenderer } = require("electron");
let $ = require("jquery");
let Terminal = require("./js/terminal");
let title = $("#title");

// Stoplight buttons' event handlers
$("#close").click(() => {
	ipcRenderer.send("request-close");
});

$("#max").click(() => {
	ipcRenderer.send("request-maximize");
});

$("#min").click(() => {
	ipcRenderer.send("request-minimize");
});

// Create the terminal
let spider = new Terminal(storage, document.getElementById("app"));

// Set the title bar text to display the bot's username
spider.client.on("ready", () => {
	title.text(`Spider [${spider.client.user.username}]`);
});

// Make sure the terminal never loses focus
ipcRenderer.on("focus", () => {
	spider.focus();
});

spider.input.addEventListener("blur", () => {
	spider.focus();
});

console.log("Done");