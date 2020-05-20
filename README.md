# About Spider
Spider is a Discord bot admin tool for monitoring, controlling, and micromanaging your Discord bot user. It provides a terminal-like interface for executing commands on your bot user that can interact with Discord guilds, users and the rest of the API. It is written in Node.js using Electron and Discord.js.

![Image from Gyazo](https://i.gyazo.com/ceb5ab469f6af5f4de9f0f081787d1a1.gif)

# Running It
To run it, you have to have Node.js+NPM and Electron installed (you can get Electron by running ``npm i -g electron``). Make sure you also do ``npm install`` to get all the dependencies. Once that finishes, either run ``electron .`` or ``npm run start`` to run Spider.

# Building It
Ensure all dependencies are installed and run ``npm run build`` to build it for your environment or ``npm run build-all`` to build for all targets. Executables will be in the `out` directory.