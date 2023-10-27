const path = require("path");
const fs = require("fs");
const packageJson = require("../package.json");
const dist = path.join(__dirname, "dist");

if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist);
}

fs.writeFileSync(
  path.join(dist, "package.json"),
  JSON.stringify(
    {
      ...packageJson,
      scripts: {},
    },
    null,
    2
  ),
  "utf-8"
);
