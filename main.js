/* jshint esversion: 6 */

const open = require("open");
const { app, BrowserWindow, ipcMain } = require("electron");
const nord = require("./js/nord.js");

function appExit() {
	if (process.platform !== "darwin") {
		app.quit();
	}
}

function createWindow() {
	let window = new BrowserWindow({
		backgroundColor: "#" + nord[0],
		titleBarStyle: "hidden",
		title: "Spider",
		frame: false,
		width: 800,
		height: 600,
		webPreferences: {
			contextIsolation: false,
			nodeIntegration: true
		}
	});

	window.webContents.setWindowOpenHandler(({ url }) => {
		open(url);
		return { action: "deny" };
	});

	window.webContents.on("focus", () => {
		window.webContents.send("focus");
	});

	ipcMain.on("request-close", (event) => {
		const window = BrowserWindow.fromWebContents(event.sender);
		window.close();
	});

	ipcMain.on("request-minimize", (event) => {
		const window = BrowserWindow.fromWebContents(event.sender);
		window.minimize();
	});

	ipcMain.on("request-maximize", (event) => {
		const window = BrowserWindow.fromWebContents(event.sender);
		if (!window.isMaximized()) {
			window.maximize();
		}
		else {
			window.unmaximize();
		}
	});

	ipcMain.on("request-devtools", (event) => {
		const window = BrowserWindow.fromWebContents(event.sender);
		window.webContents.toggleDevTools();
	});

	window.loadFile("index.html");
}

/**
 * Discord.js is non-context-aware.
 * This means that we need to disable the renderer process reuse
 * optimization from Chromium that Electron uses.
 * We shouldn't be using this optimization anyway, since we never
 * navigate to a new page in the renderer process.
 */
app.allowRendererProcessReuse = false;

app.on("window-all-closed", appExit);

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

app.whenReady().then(createWindow);