/* jshint esversion: 6 */

module.exports = {
	usage: "<location>",
	description: "Changes into a new guild or location. Works sort of like cd in a terminal.",
	more: [
		"This command does not support full absolute paths. If you are currently in a channel, for example, you cannot {green}cd /Other Guild{/green}. This may be implemented later.",
		"Running {green}cd /{/green} will deselect any currently selected guild or channel. Running {green}cd ..{/green} will deselect the current channel, or if none is selected, the current guild."
	],
	examples: [
		"cd /",
		"cd My Guild",
		"cd general",
		"cd .."
	],
	run: function(spider, args) {
		if (args.length == 0) {
			spider.println("{orange}You must specify a location.{/orange}");
			return;
		}

		const loc = args.join(" ");

		if (loc == "/") {
			spider.state.textChannel = null;
			spider.state.guild = null;
		}
		else if (loc == "..") {
			if (spider.state.textChannel) {
				spider.state.textChannel = null;
			}
			else if (spider.state.guild) {
				spider.state.guild = null;
			}
			else {
				spider.println("Cannot go up any further.");
			}
		}
		// eslint-disable-next-line no-empty
		else if (loc == ".") {}
		else if (spider.state.guild) {
			// CD into a channel
			let guild = spider.state.guild;
			let channel = guild.channels.resolve(loc);

			if (!channel) {
				channel = guild.channels.cache.find(channel => channel.name.startsWith(loc));
			}

			if (!channel) {
				spider.println(`{orange}No channel found with name or ID '${loc}'{/orange}`);
			}
			else if (channel.type == "GUILD_CATEGORY") {
				spider.println(`{orange}Cannot cd into a category (though this may change in the future).{/orange}`);
			}
			else {
				spider.state.textChannel = channel;
			}
		}
		else {
			// CD into a guild
			let guild = spider.client.guilds.resolve(loc);

			if (!guild) {
				guild = spider.client.guilds.cache.find(guild => guild.name.startsWith(loc));
			}

			if (!guild) {
				spider.println(`{orange}No guild found with name or ID '${loc}'{/orange}`);
			}
			else {
				spider.state.guild = guild;
			}
		}
	}
};