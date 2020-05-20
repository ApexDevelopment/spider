/* jshint esversion: 6 */

module.exports = {
	usage: "[command]",
	description: "Lists all commands or gets help for a specific command.",
	run: function(spider, args) {
		let out = "";

		if (args.length == 0) {
			for (let cmd in spider.commands) {
				out += cmd + " ".repeat(12 - cmd.length) + spider.commands[cmd].description + "\n";
			}
		}
		else {
			out += "\nKey: <required> [optional]\n\n";
			const cmd = args[0].toLowerCase();

			if (spider.commands[cmd]) {
				out += cmd + " " + spider.commands[cmd].usage + " - " + spider.commands[cmd].description + "\n";
			}
			else {
				out = `{orange}Can't get help for '${args[0]}'.{/orange}\n`;
			}
		}

		spider.println(out);
	}
};