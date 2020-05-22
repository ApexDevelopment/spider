/* jshint esversion: 6 */

module.exports = {
	usage: "[channel]",
	description: "Starts monitoring for messages in a channel.",
	more: [
		"Keeps listening for messages even when a channel is deselected.",
		"Can be toggled on or off by running the command again.",
		"If no argument is provided, it monitors the current channel."
	],
	examples: [
		"monitor",
		"monitor 660219795295305738",
		"monitor introductions"
	],
	run: function(spider, args) {
		let monitor = spider.state.monitor;

		if (args.length == 0) {
			if (!spider.state.textChannel) {
				spider.println("{orange}You must select a text channel.{/orange}");
				return;
			}

			if (monitor.hasOwnProperty(spider.state.textChannel.id)) {
				delete monitor[spider.state.textChannel.id];
				spider.println(`Stopped monitoring {green}${spider.state.guild.name}>${spider.state.textChannel.name}{/green}.`);
			}
			else {
				monitor[spider.state.textChannel.id] = spider.state.textChannel;
				spider.println(`Now monitoring {green}${spider.state.guild.name}>${spider.state.textChannel.name}{/green}.`);
			}
		}
		else {
			const loc = args.join(" ");
			let channel = spider.client.channels.resolve(loc);

			if (!channel && spider.state.guild.channels) {
				channel = spider.state.guild.channels.find(channel => channel.name.startsWith(loc));
			}

			if (!channel) {
				spider.println(`{orange}No channel found with name or ID '${loc}'{/orange}`);
			}
			else if (monitor.hasOwnProperty(channel.id)) {
				delete monitor[channel.id];
				spider.println(`Stopped monitoring {green}${channel.name}{/green}.`);
			}
			else {
				monitor[channel.id] = channel;
				spider.println(`Now monitoring {green}${channel.name}{/green}.`);
			}
		}
	}
};