/* jshint esversion: 6 */
// A utility for color processing.

const nord = require("./nord.js");
let convert = require("color-convert");
let deltaE = require("delta-e");

module.exports = {
	// Finds the nearest Nord color to a supplied color.
	// In text mode, it does not use nord0-nord2 because they would be difficult to read.
	toNordPalette: function(hexStr, isText = false) {
		let labArray = convert.hex.lab(hexStr);
		let lab = {
			L: labArray[0],
			A: labArray[1],
			B: labArray[2]
		};

		// Delta-E has a max distance of 100.
		let minDistance = 101;
		// If for some reason this algorithm fails we fall back to the brightest one.
		let closestColor = nord.nord6;
		// Skip nord0-nord2 if we are working with a text foreground color.
		let i = isText ? 3 : 0;

		for (i; i <= 15; i++) {
			const colorName = "nord" + i;
			let nordHexString = nord[colorName];
			let nordLabArray = convert.hex.lab(nordHexString);
			let nordLab = {
				L: nordLabArray[0],
				A: nordLabArray[1],
				B: nordLabArray[2]
			};

			let distance = deltaE.getDeltaE00(lab, nordLab);

			if (distance < minDistance) {
				minDistance = distance;
				closestColor = nordHexString;
			}
		}

		return closestColor;
	}
};