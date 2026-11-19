const fs = require('fs');

for (const name of ['1.jpg', '2.jpg', '3.jpg']) {
  const buf = fs.readFileSync('public/' + name);
  // JPEG dimensions reader
  let i = 4;
  let width = 0, height = 0;
  while (i < buf.length) {
    if (buf[i] === 0xFF && (buf[i+1] === 0xC0 || buf[i+1] === 0xC2)) {
      height = buf.readUInt16BE(i + 5);
      width = buf.readUInt16BE(i + 7);
      break;
    }
    i++;
  }
  console.log(`${name}: ${width}x${height}, size=${buf.length} bytes`);
}
