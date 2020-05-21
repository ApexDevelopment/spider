/* jshint esversion: 6*/
const nord = require("./nord.js");
let color = require("./color.js");

module.exports = {
	formatMessage: function(message) {
		let nordColor = `#${color.toNordPalette(message.member.displayHexColor, true)}`;
		return `{color=${nordColor}}<${message.member.displayName}>{/color} {color=#${nord[4]}}(${message.author.tag}){/color} ${message.cleanContent}`;
	}
};