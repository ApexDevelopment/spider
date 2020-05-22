/* jshint esversion: 6 */

module.exports = {
	usage: "<message>",
	description: "Sends a message in the currently selected channel.",
	more: [
		"Self-explanatory. Requires a text channel to be selected."
	],
	examples: [
		"say I am a bot, but I'm being controlled by a human!"
	],
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