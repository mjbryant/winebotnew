const fs = require('fs');
const os = require('os');

const date = new Date();
const dateString = Intl.DateTimeFormat('en-GB').format(date).replaceAll('/', '-');

const backupPath = `${os.homedir()}/.winebot/${dateString}`;
if (!fs.existsSync(backupPath)) {
  fs.mkdirSync(backupPath);
}

const files = fs.readdirSync('./data/wines/');
files.forEach((f) => {
  fs.copyFileSync(`./data/wines/${f}`, `${backupPath}/${f}`);
})
