/* jshint esversion: 6 */

// TODO: List what channels are being monitored.
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
		let guild = spider.state.guild;
		let channel = null;

		if (args.length == 0) {
			// Monitor currently selected channel
			channel = spider.state.textChannel;

			if (!channel) {
				spider.println("{orange}You must select a text channel.{/orange}");
				return;
			}
		}
		else {
			// Search in guild for a channel to monitor
			if (!guild) {
				spider.println("{orange}You must select a server to search in first.{/orange}");
				return;
			}

			const loc = args.join(" ");
			channel = spider.client.channels.resolve(loc);

			if (!channel && guild.channels) {
				channel = guild.channels.cache.find(channel => channel.name.startsWith(loc));
			}

			if (!channel) {
				spider.println(`{orange}No channel found with name or ID '${loc}'{/orange}`);
				return;
			}
		}

		if (monitor.includes(channel.id)) {
			monitor.splice(monitor.indexOf(channel.id), 1);
			spider.println(`Stopped monitoring {green}${guild.name}>${channel.name}{/green}.`);
		}
		else {
			monitor.push(channel.id);

			spider.storage.set(spider.client.user.id.toString(), {monitor}, (err) => {
				if (err) {
					console.log(err);
					spider.println("{orange}Failed to save monitored channels to storage.{/orange}");
				}
			});
			
			spider.println(`Now monitoring {green}${guild.name}>${channel.name}{/green}.`);
		}
	}
};