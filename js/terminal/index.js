/* jshint esversion: 6 */
/* global document, navigator */

let path = require("path");
let Client = require("discord.js").Client;
let { formatMessage } = require("../format.js");

function isInputKey(code) {
	return [32, 190, 192, 189, 187, 220, 221, 219, 222, 186, 188, 191].includes(code);
}

class Terminal {
	constructor(parent) {
		this.tags = [ "light", "bold", "extrabold", "red", "orange", "yellow", "green", "lightblue", "blue", "darkblue", "violet" ];
		this.inputBuffer = "";
		this.outputBuffer = "";
		this.cursorPos = 0;
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

		const commandPath = path.join(__dirname, "commands");
		this.commands = {};

		require("fs").readdirSync(commandPath).forEach((entry) => {
			const cmdName = path.parse(entry).name;
			this.commands[cmdName] = require(path.join(commandPath, entry));
		});

		this.input.addEventListener("keydown", (e) => {
			this.handleInput(e);
		});

		this.client.on("ready", () => {
			this.println(`{green}Logged in as ${this.client.user.tag}.{/green}`);
		});

		this.client.on("message", (msg) => {
			if (this.state.monitor.hasOwnProperty(msg.channel.id) || this.state.textChannel.id === msg.channel.id) {
				this.println(`{green}${msg.guild.name}>${msg.channel.name}{/green} ${formatMessage(msg)}`);
			}
		});

		this.println("Welcome to Spider.\nTo get started, type {green}login <bot-token>{/green} or {green}help{/green} to learn more.");
	}

	get prompt() {
		let state = this.state;
		return `<span class="yellow">/${state.guild ? state.guild.name : ""}${state.textChannel ? ">" + state.textChannel.name : ""}></span> `;
	}

	focus() {
		this.input.focus();
	}

	update() {
		let cursor = "<span class=\"blinken\"></span>";
		let text = this.outputBuffer + this.prompt + this.inputBuffer.substring(0, this.cursorPos) + cursor + this.inputBuffer.substring(this.cursorPos, this.inputBuffer.length);
		this.term.innerHTML = text;
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
		let cmd = splitLine.shift();

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

	typeAtCursor(text) {
		this.inputBuffer = this.inputBuffer.substring(0, this.cursorPos) + text + this.inputBuffer.substring(this.cursorPos, this.inputBuffer.length);
		this.cursorPos += text.length;
		this.update();
	}

	handleInput(e) {
		e.preventDefault();

		this.input.value = "";

		if (e.keyCode >= 48 && e.keyCode <= 90 || isInputKey(e.keyCode)) {
			if (!e.ctrlKey) {
				this.typeAtCursor(e.key);
			}
			else if (e.key == "v") {
				navigator.clipboard.readText().then((text) => {
					this.typeAtCursor(text);
				});
			}
		}
		else if (e.keyCode == 37) {
			// Left arrow
			if (this.cursorPos > 0) {
				this.cursorPos--;
				this.update();
			}
		}
		else if (e.keyCode == 39) {
			// Right arrow
			if (this.cursorPos < this.inputBuffer.length) {
				this.cursorPos++;
				this.update();
			}
		}
		else if (e.keyCode == 13) {
			this.cursorPos = 0;
			this.dispatch();
		}
		else if (e.keyCode == 9) {
			this.typeAtCursor("\t");
		}
		else if (e.key == "Backspace" && this.cursorPos > 0) {
			this.inputBuffer = this.inputBuffer.substring(0, this.cursorPos - 1) + this.inputBuffer.substring(this.cursorPos, this.inputBuffer.length);
			this.cursorPos--;
		}
		else if (e.key == "Delete" && this.cursorPos < this.inputBuffer.length) {
			this.inputBuffer = this.inputBuffer.substring(0, this.cursorPos) + this.inputBuffer.substring(this.cursorPos + 1, this.inputBuffer.length);
		}

		this.update();
	}
}

module.exports = Terminal;