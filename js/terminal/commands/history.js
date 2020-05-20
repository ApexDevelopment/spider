/* jshint esversion: 6 */

let { formatMessage } = require("../../format");

module.exports = {
	usage: "[limit]",
	description: "Shows the message history of the current channel.",
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