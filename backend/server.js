const http = require("http");
const fs = require("fs");
const path = require("path");

const DATA_DIR = "/data";
const CSV_FILE = path.join(DATA_DIR, "contacts.csv");

const IP_CACHE = {};

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }

  if (req.method === "POST" && req.url === "/contact") {
    // Issue 4: 5秒以内に同じIPアドレスからリクエストがあった場合に拒否する
    const ip = req.connection.remoteAddress;

    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        // Issue 5: 電話番号を受け取る
        const { name, email, message } = JSON.parse(body);

        let line = `${new Date().toISOString()}`;
        line += `,${escapeCsv(name)}`;
        line += `,${escapeCsv(email)}`;
        line += `,${escapeCsv(message)}`;
        // Issue 5: 電話番号とIPアドレスを追加する
        line += `\n`;

        fs.appendFileSync(CSV_FILE, line, "utf8");

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true }));
      } catch (error) {
        console.error(error);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: "Invalid JSON" }));
      }
    });
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, error: "Not found" }));
  }
});

function escapeCsv(value) {
  if (typeof value !== "string") return "";
  const escaped = value.replace(/"/g, '""');
  if (/[",\r\n]/.test(escaped)) {
    return `"${escaped}"`;
  }
  return escaped || "";
}

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
