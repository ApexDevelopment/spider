/* jshint esversion: 6 */

let { remote } = require("electron");

module.exports = {
	usage: "",
	description: "Exits Spider.",
	more: [
		"Logs out, destroys the client, and closes the Spider window."
	],
	run: function(spider) {
		spider.client.destroy();
		remote.getCurrentWindow().close();
	}
};