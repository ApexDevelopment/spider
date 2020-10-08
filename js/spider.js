/* jshint esversion: 6 */
/* global document */

console.log("Spider init");

const storage = require("electron-json-storage");
let { remote } = require("electron");
let $ = require("jquery");
let Terminal = require("./js/terminal");
let title = $("#title");

// Stoplight buttons' event handlers
$("#close").click(() => {
	let window = remote.getCurrentWindow();
	window.close();
});

$("#max").click(() => {
	let window = remote.getCurrentWindow();

	if (!window.isMaximized()) {
		window.maximize();
	}
	else {
		window.unmaximize();
	}
});

$("#min").click(() => {
	let window = remote.getCurrentWindow();
	window.minimize();
});

// Create the terminal
let spider = new Terminal(storage, document.getElementById("app"));

// Set the title bar text to display the bot's username
spider.client.on("ready", () => {
	title.text(`Spider [${spider.client.user.username}]`);
});

// Make sure the terminal never loses focus
remote.getCurrentWindow().on("focus", () => {
	spider.focus();
});

spider.input.addEventListener("blur", () => {
	spider.focus();
});

console.log("Done");