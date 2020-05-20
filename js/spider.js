/* jshint esversion: 6 */
/* global document */

console.log("Spider init");

let { remote } = require("electron");
let $ = require("jquery");
let Terminal = require("./js/terminal");
let title = $("#title");

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

let term = new Terminal(document.getElementById("app"));

term.client.on("ready", () => {
	title.text(`Spider [${term.client.user.username}]`);
});

$().click(() => {
	term.focus();
});

console.log("Done");