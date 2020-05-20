/* jshint esversion: 6 */

module.exports = {
	usage: "<message>",
	description: "Sends a message in the currently selected channel.",
	run: function(spider, args) {
		const message = args.join(" ");

		if (spider.state.textChannel) {
			spider.state.textChannel.send(message);
		}
		else {
			spider.println("{orange}No text channel is currently selected.{/orange}");
		}
	}
};