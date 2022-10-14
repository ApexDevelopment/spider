/* jshint esversion: 6 */

let path = require("path");
let subCommandPath = path.join(__dirname, "sub");
let subCommands = {};

require("fs").readdirSync(subCommandPath).forEach((entry) => {
	const cmdName = path.parse(entry).name;
	subCommands[cmdName] = require(path.join(subCommandPath, entry));
});

module.exports = {
	usage: "<create|delete|edit|grant|revoke> <options>",
	description: "Allows creating/deleting/modifying roles as well as granting or revoking them.",
	more: [
		"This command is used for managing a guild's roles. Executing {green}role{/green} on its own does nothing.",
		"It requires the bot user to have the MANAGE_ROLES permission for the guild (or ADMINISTRATOR).",
		"Just like a user, the bot cannot modify, grant, or revoke its own highest role or roles that have a higher priority than its own highest role."
	],
	examples: (() => {
		let ex = [];

		for (let cmd in subCommands) {
			ex.push(subCommands[cmd].examples[0]);
		}

		return ex;
	})(),
	subCommands: subCommands,
	run: function(spider, args) {
		if (args.length == 0) {
			spider.println("waga baba bobo\n{orange}You must specify an action. See{/orange} help role {orange}for more information.{/orange}");
			return;
		}

		const cmd = args.shift();

		if (subCommands[cmd]) {
			subCommands[cmd].run(spider, args);
		}
		else {
			spider.println("{orange}Unknown action. See{/orange} help role {orange}for more information.{/orange}");
		}
	}
};