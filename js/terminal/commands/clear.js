/* jshint esversion: 6 */

module.exports = {
	usage: "",
	description: "Clears the console screen.",
	more: [
		"What more do you want from me?"
	],
	run: function(spider) {
		spider.clear();
	}
};