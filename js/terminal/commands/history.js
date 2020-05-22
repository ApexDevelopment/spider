/* jshint esversion: 6 */

let { formatMessage } = require("../../format");

module.exports = {
	usage: "[limit]",
	description: "Shows the message history of the current channel.",
	more: [
		"Bots have limited access to message history. Only cached messages will be shown.",
		"This means messages that were sent while Spider was running. This is a Discord API security feature.",
		"{green}limit{/green} is the maximum number of messages that will be shown."
	],
	examples: [
		"history 100"
	],
	run: function(spider, args) {
		let limit = 10;

		if (args.length != 0) {
			// TODO: Check arg
			limit = parseInt(args[0]);
		}

		if (!spider.state.textChannel) {
			spider.println("{orange}You must select a text channel.{/orange}");
			return;
		}

		let messages = spider.state.textChannel.messages.cache.last(limit);
		let out = `Last ${messages.length} messages:\n`;

		for (let message of messages) {
			out += formatMessage(message) + "\n";
		}

		spider.println(out);
	}
};