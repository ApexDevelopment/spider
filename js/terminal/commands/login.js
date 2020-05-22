/* jshint esversion: 6 */

module.exports = {
	usage: "<token>",
	description: "Logs in as a bot user with the given token.",
	more: [
		"A bot token can be obtained from your app's page at https://discord.com/developers/applications",
		"Logging in with a user token is against Discord's ToS.",
		"Only log in with a token for an application you have permission to access."
	],
	examples: [
		"login ABCDEFGHijkLMNOPQ.RSTUVW.XYZ"
	],
	run: function(spider, args) {
		if (args.length == 0) {
			spider.println("{orange}You must provide a token.{/orange}");
			return;
		}

		spider.println("{yellow}Attempting login...{/yellow}");
		spider.client.login(args[0]);
	}
};