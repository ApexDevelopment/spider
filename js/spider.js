/* global document, Terminal */

let $ = require("jquery");

let term = new Terminal();
term.open(document.getElementById("terminal"));
term.write("Hello from Spider.");