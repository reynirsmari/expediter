// Compiles src/app.jsx to app.js so the browser doesn't have to load
// Babel (3 MB) and translate JSX on every launch.
// Usage: node build.js
const fs = require("fs");
const path = require("path");
const Babel = require("./tools/babel.min.js");

const src = path.join(__dirname, "src", "app.jsx");
const out = path.join(__dirname, "app.js");

const { code } = Babel.transform(fs.readFileSync(src, "utf8"), {
  presets: [["react", { runtime: "classic" }]],
  comments: false,
  compact: false,
});

fs.writeFileSync(
  out,
  "// Generated from src/app.jsx by build.js — edit the source, then run: node build.js\n" + code + "\n"
);
console.log(`Wrote ${path.relative(process.cwd(), out)} (${fs.statSync(out).size} bytes)`);
