/* jshint esversion: 6 */

let { ipcRenderer } = require("electron");

module.exports = {
	usage: "",
	description: "Opens the Chrome Developer Tools for debugging.",
	more: [
		"Self-explanatory. Good for tracking down errors in my code."
	],
	run: function() {
		ipcRenderer.send("request-devtools");
	}
};