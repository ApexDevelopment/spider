/* jshint esversion: 6 */

module.exports = {
	usage: "<token>",
	description: "Logs in as a bot user with the given token.",
	run: function(spider, args) {
		if (args.length == 0) {
			spider.println("{orange}You must provide a token.{/orange}");
			return;
		}

		spider.println("{yellow}Attempting login...{/yellow}");
		spider.client.login(args[0]);
	}
};