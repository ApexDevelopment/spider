/* jshint esversion: 6 */

module.exports = {
	usage: "",
	description: "Keeps listening for messages in a channel even after you deselect it.",
	run: function(spider) {
		if (!spider.state.textChannel) {
			spider.println("{orange}You must select a text channel.{/orange}");
			return;
		}

		if (spider.state.monitor.includes(spider.state.textChannel.id)) {
			spider.state.monitor.splice(spider.state.monitor.indexOf(spider.state.textChannel.id), 1);
			spider.println(`Stopped monitoring {green}${spider.state.guild.name}>${spider.state.textChannel.name}{/green}.`);
		}
		else {
			spider.state.monitor.push(spider.state.textChannel.id);
			spider.println(`Now monitoring {green}${spider.state.guild.name}>${spider.state.textChannel.name}{/green}.`);
		}
	}
};