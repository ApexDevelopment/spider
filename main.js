/* jshint esversion: 6 */

const { app, BrowserWindow } = require("electron");

function createWindow() {
	let window = new BrowserWindow({
		backgroundColor: "#2e3440",
		titleBarStyle: "hidden",
		title: "Spider",
		frame: false,
		// transparent: process.platform === "darwin",
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