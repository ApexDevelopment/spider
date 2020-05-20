/* jshint esversion: 6 */

module.exports = {
	usage: "",
	description: "Lists accessible guilds/channels from the current location.",
	run: function(spider) {
		let out = "";

		if (spider.state.guild) {
			out += "Available channels:\n";

			spider.state.guild.channels.cache.forEach((channel, id) => {
				out += `${channel.name} {green}[${id}]{/green}\n`;
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