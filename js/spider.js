/* jshint esversion: 6 */
/* global Terminal */

console.log("Spider init");

let { remote } = require("electron");
let $ = require("jquery");

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

console.log("Done");

/*let term = new Terminal({
	theme: {
		background: "#2e3440"
	}
});*/

//term.open(document.getElementById("terminal"));
//term.write("Hello from Spider.");