/* jshint esversion: 6 */

const matcher = /(.+)=(.+)/;

module.exports = {
	usage: "<name> [option1=value] [option2=value] ...",
	description: "Creates a new role with the specified settings.",
	more: [
		"Any options that are not supplied will use the default value that Discord gives when you make a new role.",
		"e.g. if permissions are not specified, the role will get SEND_MESSAGES, READ_MESSAGE_HISTORY, CONNECT, SPEAK, etc.",
		"See https://discord.com/developers/docs/topics/permissions for a list of permission flags."
	],
	examples: [
		"role create Newbies",
		"role create Donators color=#efdf00 reason=\"Show off our awesome supporters!\"",
		"role create Moderators hoist=true permissions=MANAGE_MESSAGES,KICK_MEMBERS"
	],
	run: function(spider, args) {
		if (args.length == 0) {
			spider.println("{orange}Missing role name.{/orange}");
			return;
		}

		if (!spider.state.guild) {
			spider.println("{orange}You must select a guild.{/orange}");
			return;
		}

		let guild = spider.state.guild;

		if (!guild.me || !guild.me.hasPermission("MANAGE_ROLES", { checkAdmin: true })) {
			spider.println("{orange}Insufficient permissions.{/orange}");
			return;
		}

		let roleData = {
			name: args.shift(),
			reason: "Executed from Spider console."
		};

		while (args.length > 0) {
			let nextArg = args.shift();

			if (nextArg.includes("=")) {
				let result = nextArg.match(matcher);
				let option = result[1].toLowerCase();
				let value = result[2];

				if (option === "permissions") {
					value = value.split(",");
				}
				else if (option === "reason" && value.startsWith("\"")) {
					let flag = true;
					value = value.substr(1);

					while (args.length > 0 && flag) {
						let nextWord = args.shift();

						if (nextWord.endsWith("\"")) {
							nextWord = nextWord.substr(0, nextWord.length - 1);
							flag = false;
						}
						else if (nextWord.includes("\"")) {
							spider.println("{orange}Syntax error: unexpected quotation mark.{/orange}");
							return;
						}

						value += " " + nextWord;
					}
				}

				roleData[option] = value;
			}
		}

		const reason = roleData.reason;
		delete roleData.reason;

		guild.roles.create({
			data: roleData,
			reason: reason
		}).then(() => {
			spider.println("{green}Role successfully created!{/green}");
		}).catch((err) => {
			spider.println(`{orange}Role could not be created:\n${err}{/orange}\n`);
		});
	}
};