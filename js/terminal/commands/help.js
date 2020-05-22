/* jshint esversion: 6 */

module.exports = {
	usage: "[command]",
	description: "Lists all commands or gets help for a specific command.",
	more: [
		"This works on sub-commands as well. See {green}help role create{/green}, for example."
	],
	examples: [
		"help",
		"help login",
		"help role create"
	],
	run: function(spider, args) {
		let out = "";

		if (args.length == 0) {
			for (let cmd in spider.commands) {
				out += cmd + " ".repeat(12 - cmd.length) + spider.commands[cmd].description + "\n";
			}
		}
		else {
			out += "Key: <required> [optional]\n\n";
			let chain = [ args.shift().toLowerCase() ];
			let cmd = spider.commands[chain[0]];

			while (args.length > 0) {
				let next = args.shift().toLowerCase();

				if (!cmd.subCommands || !cmd.subCommands[next]) {
					spider.println(`${chain[chain.length - 1]} {orange}has no sub-command with that name.{/orange}`);
					return;
				}

				cmd = cmd.subCommands[next];
				chain.push(next);
			}

			chain = chain.join(" ");

			if (cmd) {
				out += `Usage: ${chain} ${cmd.usage}\nDescription: ${cmd.description}\nMore information:\n${cmd.more.join("\n")}\n`;

				if (cmd.usage != "") {
					out += `\nExamples:\n${cmd.examples.join("\n")}\n`;
				}
			}
			else {
				out = `{orange}Can't get help for '${args[0]}'.{/orange}\n`;
			}
		}

		spider.println(out);
	}
};