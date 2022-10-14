/* jshint esversion: 6 */

module.exports = {
	usage: "",
	description: "Lists accessible guilds/channels from the current location.",
	more: [
		"When nothing is selected, this will list cached guilds.",
		"When a guild is selected, it will list cached channels in that guild."
	],
	run: function(spider) {
		let out = "";

		if (spider.state.guild) {
			out += "Available channels:\n";

			let copy = spider.state.guild.channels.cache.clone();
			let [categories, loose] = copy.partition(channel => channel.type == "GUILD_CATEGORY");
			loose.sweep(channel => channel.parent != null && channel.parent != undefined);

			categories.sort((channelA, channelB) => channelA.name.localeCompare(channelB.name));
			loose.sort((channelA, channelB) => channelA.name.localeCompare(channelB.name));

			// Only print uncategorized label if there are uncategorized channels to see
			if (loose.size > 0) {
				out += `{lightblue}<Uncategorized>{/lightblue}\n`;
			}
			
			loose.each((channel, id) => {
				out += `${channel.name} {green}[${id}]{/green}\n`;
			});
			
			categories.each((cat) => {
				out += `\n{lightblue}<${cat.name}>{/lightblue}\n`;
				cat.children.each((channel, id) => {
					out += `${channel.name} {green}[${id}]{/green}\n`;
				});
			});
		}
		else {
			out += "Available guilds:\n";

			spider.client.guilds.cache.forEach((guild, id) => {
				out += `${guild.name} {green}[${id}]{/green}\n`;
			});
		}

		spider.println(out);
	}
};