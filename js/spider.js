/* jshint esversion: 6 */
/* global navigator, document */

console.log("Spider init");

let client = new (require("discord.js").Client)();
let { remote } = require("electron");
let color = require("./js/color.js");
let $ = require("jquery");
let spiderState = {
	guild: null,
	textChannel: null,
	monitor: []
};

$("#close").click(() => {
	let window = remote.getCurrentWindow();
	window.close();
});

$("#max").click(() => {
	let window = remote.getCurrentWindow();

	if (!window.isMaximized()) {
		window.maximize();
	}
	else {
		window.unmaximize();
	}
});

$("#min").click(() => {
	let window = remote.getCurrentWindow();
	window.minimize();
});

let tags = [ "light", "bold", "extrabold", "red", "orange", "yellow", "green", "lightblue", "blue", "darkblue", "violet" ];

let app = document.getElementById("app");
let term = document.getElementById("terminal");
let input = document.createElement("textarea");
let outputBuffer = "";
let inputBuffer = "";

input.className = "inputline";
app.appendChild(input);
input.focus();

function getPrompt() {
	return `/${spiderState.guild ? spiderState.guild.name : ""}${spiderState.textChannel ? ">" + spiderState.textChannel.name : ""}> `;
}

function updateTerm() {
	let cursor = "<span class=\"blinken\"></span>";
	let text = outputBuffer + getPrompt() + inputBuffer;
	term.innerHTML = text + cursor;
	document.getElementsByClassName("blinken")[0].scrollIntoView();
}

function colorize(str) {
	// Sanitize
	str = str.replace(/</g, "&lt;");
	str = str.replace(/>/g, "&gt;");

	// Dynamic tags
	{
		let start = new RegExp("{color=(#[0-9a-z]{6})}", "g");
		let end = new RegExp("{/color}", "g");
		str = str.replace(start, "<span style=\"color:$1;\">");
		str = str.replace(end, "</span>");
	}

	// Normal tags
	for (let i = 0; i < tags.length; i++) {
		let start = new RegExp("{" + tags[i] + "}", "g");
		let end = new RegExp("{/" + tags[i] + "}", "g");
		str = str.replace(start, "<span class=\"" + tags[i] + "\">");
		str = str.replace(end, "</span>");
	}

	return str;
}

function formatMessage(message) {
	let nordColor = `#${color.toNordPalette(message.member.displayHexColor, true)}`;
	return `{color=${nordColor}}<${message.author.tag}>{/color} ${message.cleanContent}`;
}

function stdout(str) {
	outputBuffer += colorize(str);
	updateTerm();
}

let commands = {
	"help": {
		usage: "[command]",
		description: "Lists all commands or gets help for a specific command.",
		run: function(args) {
			let out = "\nKey: <required> [optional]\n\n";

			if (args.length == 0) {
				for (let cmd in commands) {
					out += cmd + " ".repeat(12 - cmd.length) + commands[cmd].description + "\n";
				}
			}
			else {
				const cmd = args[0].toLowerCase();

				if (commands[cmd]) {
					out += cmd + " " + commands[cmd].usage + " - " + commands[cmd].description + "\n";
				}
				else {
					out = `{orange}Can't get help for '${args[0]}'.{/orange}\n`;
				}
			}

			stdout(out + "\n");
		}
	},
	"clear": {
		usage: "",
		description: "Clears the console screen.",
		run: function() {
			outputBuffer = "";
			updateTerm();
		}
	},
	"login": {
		usage: "<token>",
		description: "Logs in as a bot user with the given token.",
		run: function(args) {
			if (args.length == 0) {
				stdout("{orange}You must provide a token.{/orange}\n");
				return;
			}

			stdout("{yellow}Attempting login...{/yellow}\n");
			client.login(args[0]);
		}
	},
	"say": {
		usage: "<message>",
		description: "Sends a message in the currently selected channel.",
		run: function(args) {
			const message = args.join(" ");

			if (spiderState.textChannel) {
				spiderState.textChannel.send(message);
			}
			else {
				stdout("{orange}No text channel is currently selected.{/orange}\n");
			}
		}
	},
	"cd": {
		usage: "<location>",
		description: "Changes into a new guild or location. Works sort of like cd in a terminal.",
		run: function(args) {
			if (args.length == 0) {
				stdout("{orange}You must specify a location.{/orange}\n");
				return;
			}

			const loc = args.join(" ");

			if (loc == "/") {
				spiderState.textChannel = null;
				spiderState.guild = null;
			}
			else if (loc == "..") {
				if (spiderState.textChannel) {
					spiderState.textChannel = null;
				}
				else if (spiderState.guild) {
					spiderState.guild = null;
				}
				else {
					stdout("Cannot go up any further.\n");
				}
			}
			// eslint-disable-next-line no-empty
			else if (loc == ".") {}
			else if (spiderState.guild) {
				// CD into a channel
				let guild = spiderState.guild;
				let channel = guild.channels.resolve(loc);

				if (!channel) {
					channel = guild.channels.cache.find(channel => channel.name.startsWith(loc));
				}

				if (!channel) {
					stdout(`{orange}No channel found with name or ID '${loc}'{/orange}\n`);
				}
				else {
					spiderState.textChannel = channel;
				}
			}
			else {
				// CD into a guild
				let guild = client.guilds.resolve(loc);

				if (!guild) {
					guild = client.guilds.cache.find(guild => guild.name.startsWith(loc));
				}

				if (!guild) {
					stdout(`{orange}No guild found with name or ID '${loc}'{/orange}\n`);
				}
				else {
					spiderState.guild = guild;
				}
			}
		}
	},
	"ls": {
		usage: "",
		description: "Lists accessible guilds/channels from the current location.",
		run: function() {
			let out = "\n";

			if (spiderState.guild) {
				out += "Available channels:\n";

				spiderState.guild.channels.cache.forEach((channel, id) => {
					out += `${channel.name} {green}[${id}]{/green}\n`;
				});
			}
			else {
				out += "Available guilds:\n";

				client.guilds.cache.forEach((guild, id) => {
					out += `${guild.name} {green}[${id}]{/green}\n`;
				});
			}

			stdout(out + "\n");
		}
	},
	"history": {
		usage: "[limit]",
		description: "Shows the message history of the current channel.",
		run: function(args) {
			let limit = 10;

			if (args.length != 0) {
				// TODO: Check arg
				limit = parseInt(args[0]);
			}

			if (!spiderState.textChannel) {
				stdout("{orange}You must select a text channel.{/orange}\n");
				return;
			}

			let messages = spiderState.textChannel.messages.cache.last(limit);
			let out = `\nLast ${messages.length} messages:\n`;

			for (let message of messages) {
				out += formatMessage(message) + "\n";
			}

			stdout(out + "\n");
		}
	},
	"monitor": {
		usage: "",
		description: "Keeps listening for messages in a channel even after you deselect it.",
		run: function() {
			if (!spiderState.textChannel) {
				stdout("{orange}You must select a text channel.{/orange}\n");
				return;
			}

			if (spiderState.monitor.includes(spiderState.textChannel.id)) {
				spiderState.monitor.splice(spiderState.monitor.indexOf(spiderState.textChannel.id), 1);
				stdout(`Stopped monitoring {green}${spiderState.guild.name}>${spiderState.textChannel.name}{/green}.\n`);
			}
			else {
				spiderState.monitor.push(spiderState.textChannel.id);
				stdout(`Now monitoring {green}${spiderState.guild.name}>${spiderState.textChannel.name}{/green}.\n`);
			}
		}
	}
};

function dispatch() {
	let splitLine = inputBuffer.split(" ");
	let cmd = splitLine[0];
	splitLine.splice(0, 1);

	inputBuffer += "\n";
	outputBuffer += getPrompt() + inputBuffer;
	inputBuffer = "";
	updateTerm();

	if (commands[cmd]) {
		try {
			commands[cmd].run(splitLine);
		}
		catch (err) {
			stdout("{orange}An error occurred:\n" + err + "{/orange}\n\n");
		}
	}
	else {
		stdout("{orange}Unknown command. Type 'help' for a list of commands.{/orange}\n");
	}
}

function isInputKey(code) {
	return [32, 190, 192, 189, 187, 220, 221, 219, 222, 186, 188, 191].includes(code);
}

function handleInput(e) {
	e.preventDefault();

	input.value = "";

	if (e.keyCode >= 48 && e.keyCode <= 90 || isInputKey(e.keyCode)) {
		if (!e.ctrlKey) {
			inputBuffer += e.key;
		}
		else if (e.key == "v") {
			navigator.clipboard.readText().then((text) => {
				inputBuffer += text;
				updateTerm();
			});
		}
	}
	else if (e.keyCode == 13) {
		dispatch();
	}
	else if (e.keyCode == 9) {
		inputBuffer += "\t";
	}
	else if (e.key == "Backspace") {
		inputBuffer = inputBuffer.substr(0, inputBuffer.length - 1);
	}

	updateTerm();
}

$(document).click(() => {
	input.focus();
});

$(term).click(input.focus);
input.addEventListener("keydown", handleInput);

client.on("ready", () => {
	stdout(`{green}Login as ${client.user.tag} successful!{/green}\n`);
});

client.on("message", (msg) => {
	if (spiderState.monitor.includes(msg.channel.id) || spiderState.textChannel.id === msg.channel.id) {
		stdout(`{green}${msg.guild.name}>${msg.channel.name}{/green} ${formatMessage(msg)}\n`);
	}
});

stdout("Welcome to Spider.\nTo get started, type 'login <your-bot-token>' or 'help' to learn more.\n");
updateTerm();
console.log("Done");