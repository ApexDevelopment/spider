/* jshint esversion: 6 */

const open = require("open");
const { app, BrowserWindow } = require("electron");
const nord = require("./js/nord.js");

function createWindow() {
	let window = new BrowserWindow({
		backgroundColor: "#" + nord[0],
		titleBarStyle: "hidden",
		title: "Spider",
		frame: false,
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true
		}
	});

	window.webContents.on("new-window", (e, url) => {
		e.preventDefault();
		open(url);
	});

	window.loadFile("index.html");
}

/**
 * This app will never navigate away from index.html, so it's safe to disable
 * this override even though Spider relies on non-context-aware native modules.
 * It won't have any effect on this app, but I like flipping switches and
 * pressing buttons so sue me
 */
app.allowRendererProcessReuse = true;

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

app.whenReady().then(createWindow);