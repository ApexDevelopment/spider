/* jshint esversion: 6 */

const { app, BrowserWindow } = require("electron");
const nord = require("./js/nord.js");

function createWindow() {
	let window = new BrowserWindow({
		backgroundColor: "#" + nord.nord0,
		titleBarStyle: "hidden",
		title: "Spider",
		frame: false,
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true
		}
	});

	window.loadFile("index.html");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});