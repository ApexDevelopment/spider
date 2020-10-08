/* jshint esversion: 6*/
const nord = require("./nord.js");
let color = require("./color.js");

// TODO: This script could use cleanup
module.exports = {
	// TODO: Use an options object as an argument to manage how formatting works
	formatMessage: function(message, includeMetadata = true, rich = true) {
		const date = message.createdAt;
		let nordColor = `#${color.toNordPalette(message.member.displayHexColor, true)}`;
		let formatted = `${message.cleanContent}`;

		if (message.attachments.size > 0) {
			formatted += `\n${rich ? `{color=#${nord[7]}}` : ""}<Attachments>${rich ? "{/color}" : ""}`;

			if (rich) {
				message.attachments.each(attachment => formatted += `\n{link=${attachment.proxyURL}}${attachment.name ? attachment.name : "Unnamed"}{/link}`);
			}
			else {
				message.attachments.each(attachment => formatted += `\n[${attachment.name ? attachment.name : "Unnamed"}] ${attachment.proxyURL}`);
			}
		}

		formatted = formatted.trim();
		
		if (includeMetadata) {
			let meta = "";
			
			if (rich) meta += `{color=${nordColor}}`;
			meta += `<${message.member.displayName}> `;
			if (rich) meta += `{/color}{color=#${nord[3]}}`;
			meta += `(${message.author.tag}) `
				+ `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()} at ${date.toLocaleTimeString()}`;
			if (rich) meta += `{/color}`;
			meta += "\n";

			formatted = meta + formatted;
		}

		return formatted;
	}
};