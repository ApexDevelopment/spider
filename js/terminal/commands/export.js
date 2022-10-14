/* jshint esversion: 6 */

let { formatMessage } = require("../../format");
let fs = require("fs");

module.exports = {
	usage: "<path>",
	description: "Saves the current channel's message history to a file, appending if the file exists.",
	more: [
		"Currently this behaves sort of like piping the output of the {green}history{/green} command to a file.",
		"Remember, this {orange}appends{/orange} to existing files."
	],
	examples: [
		"export C:\\Users\\Apex\\Desktop\\log.txt"
	],
	run: function(spider, args) {
		if (!spider.state.textChannel) {
			spider.println("{orange}You must select a text channel.{/orange}");
			return;
		}

		if (args.length == 0) {
			spider.println("{orange}You must provide a file path.{/orange}");
			return;
		}

		let out = "";
		spider.state.textChannel.messages.cache.each(message => out += `${formatMessage(message, true, false)}\n`);

		fs.writeFile(args[0], out, { encoding: "utf-8", flag: "a" }, (err) => {
			if (err) {
				spider.println("{orange}An error occurred during export. Do you have permission to access that location?{/orange}");
				return;
			}

			spider.println("{green}Channel history exported successfully.{/green}");
		});
	}
};