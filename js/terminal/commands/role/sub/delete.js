/* jshint esversion: 6 */

module.exports = {
	usage: "<role> [reason]",
	description: "Deletes a role with the specified name or ID.",
	more: [
		"The bot cannot delete its own highest role or roles with a priority higher than its own highest role."
	],
	examples: [
		"role delete 529587834953400350",
		"role delete Moderators We had to downsize."
	],
	run: function(spider, args) {
		if (args.length == 0) {
			spider.println("{orange}Missing role.{/orange}");
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

		let role = args.shift();
		let reason = args.length > 0 ? args.join(" ") : "Executed from Spider console.";

		guild.roles.fetch(role, false).then((r) => {
			r.delete(reason).then(() => {
				spider.println("{green}Role successfully deleted!{/green}");
			}).catch((err) => {
				spider.println(`{orange}Role could not be deleted:\n${err}{/orange}\n`);
			});
		}).catch(() => {
			let r = guild.roles.cache.find(r => r.name.startsWith(role));

			if (!r) {
				spider.println(`{orange}No role with name or ID '${role}'{/orange}`);
				return;
			}

			r.delete(reason).then(() => {
				spider.println("{green}Role successfully deleted!{/green}");
			}).catch((err) => {
				spider.println(`{orange}Role could not be deleted:\n${err}{/orange}\n`);
			});
		});
	}
};