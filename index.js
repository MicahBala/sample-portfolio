const path = require("path");
const fs = require("fs");
const http = require("http");

const server = http.createServer((request, response) => {
  let filePath = path.join(
    __dirname,
    "public",
    request.url === "/" ? "index.html" : request.url
  );

  let contentType = getContentType(filePath) || "text/html";
  let pageNotFound = path.join(__dirname, "public", "pagenotfound.html");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        fs.readFile(pageNotFound, "utf8", (err, content) => {
          response.writeHead(200, { "Content-Type": contentType });
          response.end(content);
        });
      } else {
        response.writeHead(500);
        response.end("Internal server error.");
      }
    }
    if (!err) {
      response.writeHead(200, { "Content-Type": contentType });
      response.end(data);
    }
  });
});

const getContentType = (filePath) => {
  let extName = path.extname(filePath);

  if (extName === ".js") {
    return "text/javascript";
  }

  if (extName === ".css") {
    return "text/css";
  }

  if (extName === ".png") {
    return "image/png";
  }

  if (extName === ".jpg") {
    return "image/jpg";
  }
};

const port = 5001;

server.listen(port, () => console.log(`Server running on port ${port}`));
