/* jshint esversion: 6*/
let color = require("./color");

module.exports = {
	formatMessage: function(message) {
		let nordColor = `#${color.toNordPalette(message.member.displayHexColor, true)}`;
		return `{color=${nordColor}}<${message.author.tag}>{/color} ${message.cleanContent}`;
	}
};