/* jshint esversion: 6 */

module.exports = {
	usage: "",
	description: "Opens the Chrome Developer Tools for debugging.",
	run: function() {
		require("electron").remote.getCurrentWindow().toggleDevTools();
	}
};