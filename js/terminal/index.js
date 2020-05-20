/* jshint esversion: 6 */
/* global document, navigator */

let Client = require("discord.js").Client;
let $ = require("jquery");
let { formatMessage } = require("../format");

function isInputKey(code) {
	return [32, 190, 192, 189, 187, 220, 221, 219, 222, 186, 188, 191].includes(code);
}

class Terminal {
	constructor(parent) {
		this.tags = [ "light", "bold", "extrabold", "red", "orange", "yellow", "green", "lightblue", "blue", "darkblue", "violet" ];
		this.inputBuffer = "";
		this.outputBuffer = "";
		this.term = document.createElement("div");
		this.input = document.createElement("textarea");
		this.term.className = "terminal";
		this.input.className = "inputline";
		parent.appendChild(this.term);
		parent.appendChild(this.input);
		this.focus();
		this.client = new Client();

		this.state = {
			guild: null,
			textChannel: null,
			monitor: []
		};

		const commandPath = require("path").join(__dirname, "commands");
		this.commands = {};

		require("fs").readdirSync(commandPath).forEach((file) => {
			this.commands[file.split(".")[0]] = require("./commands/" + file);
		});

		$(parent).click(() => {
			this.focus();
		});

		this.input.addEventListener("keydown", (e) => {
			this.handleInput(e);
		});

		this.client.on("ready", () => {
			this.println(`{green}Logged in as ${this.client.user.tag}.{/green}`);
		});

		this.client.on("message", (msg) => {
			if (this.state.monitor.includes(msg.channel.id) || this.state.textChannel.id === msg.channel.id) {
				this.println(`{green}${msg.guild.name}>${msg.channel.name}{/green} ${formatMessage(msg)}`);
			}
		});

		this.println("Welcome to Spider.\nTo get started, type {green}login <bot-token>{/green} or {green}help{/green} to learn more.");
	}

	get prompt() {
		let state = this.state;
		return `/${state.guild ? state.guild.name : ""}${state.textChannel ? ">" + state.textChannel.name : ""}> `;
	}

	focus() {
		this.input.focus();
	}

	update() {
		let cursor = "<span class=\"blinken\"></span>";
		let text = this.outputBuffer + this.prompt + this.inputBuffer;
		this.term.innerHTML = text + cursor;
		document.getElementsByClassName("blinken")[0].scrollIntoView();
	}

	// TODO: Finish this system
	colorize(str) {
		// Sanitize
		str = str.replace(/</g, "&lt;");
		str = str.replace(/>/g, "&gt;");

		// Dynamic colors
		{
			let start = new RegExp("{color=(#[0-9a-z]{6})}", "g");
			let end = new RegExp("{/color}", "g");
			str = str.replace(start, "<span style=\"color:$1;\">");
			str = str.replace(end, "</span>");
		}

		// Normal tags
		for (let i = 0; i < this.tags.length; i++) {
			let start = new RegExp("{" + this.tags[i] + "}", "g");
			let end = new RegExp("{/" + this.tags[i] + "}", "g");
			str = str.replace(start, "<span class=\"" + this.tags[i] + "\">");
			str = str.replace(end, "</span>");
		}

		return str;
	}

	clear() {
		this.outputBuffer = "";
		this.update();
	}

	print(str) {
		this.outputBuffer += this.colorize(str);
		this.update();
	}

	println(str) {
		this.print(str + "\n");
	}

	dispatch() {
		let splitLine = this.inputBuffer.split(" ");
		let cmd = splitLine[0];
		splitLine.splice(0, 1);

		this.inputBuffer += "\n";
		this.outputBuffer += this.prompt + this.inputBuffer;
		this.inputBuffer = "";
		this.update();

		if (this.commands[cmd]) {
			try {
				this.commands[cmd].run(this, splitLine);
			}
			catch (err) {
				this.println("{orange}An error occurred:\n" + err + "{/orange}\n");
			}
		}
		else {
			this.println("{orange}Unknown command. Type 'help' for a list of commands.{/orange}");
		}
	}

	handleInput(e) {
		e.preventDefault();

		this.input.value = "";

		if (e.keyCode >= 48 && e.keyCode <= 90 || isInputKey(e.keyCode)) {
			if (!e.ctrlKey) {
				this.inputBuffer += e.key;
			}
			else if (e.key == "v") {
				navigator.clipboard.readText().then((text) => {
					this.inputBuffer += text;
					this.update();
				});
			}
		}
		else if (e.keyCode == 13) {
			this.dispatch();
		}
		else if (e.keyCode == 9) {
			this.inputBuffer += "\t";
		}
		else if (e.key == "Backspace") {
			this.inputBuffer = this.inputBuffer.substr(0, this.inputBuffer.length - 1);
		}

		this.update();
	}
}

module.exports = Terminal;