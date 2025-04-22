const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");

const pages = path.resolve(path.join(__dirname, 'src'));
let port = parseInt(process.env.PORT) || 8000;

function serr(res, err) {
  res.writeHead(500, { 'Content-Type': 'text/plain' });
  res.end('server error \nan error occurred in the server');
  console.log(`ERROR: an error occurred generating response: ${err}`);
}

async function serve_html(res, file_name) {
  fs.readFile(path.join(pages, file_name), (err, data) => {
    if (err) {
      serr(res, err);
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
      console.log(`INFO: response 200 OK ${file_name}`);
    }
  });
}

async function serve_img(res, file_name) {
  fs.readFile(path.join(pages, file_name), (err, data) => {
    if (err) {
      serr(res, err);
    } else {
      res.writeHead(200, { 'Content-Type': `image/${path.extname(file_name).split('.')[1]}` });
      res.end(data);
      console.log(`INFO: response 200 OK ${file_name}`);
    }
  });
}

async function server(req, res) {
  console.log(`\n\nINFO: request ${req.method} ${req.url}`);
  switch (req.url) {
    case '/': await serve_html(res, 'menu.html'); break;
    case '/main': await serve_html(res, 'main.html'); break;
    case '/G1': await serve_html(res, 'Gfx1.html'); break;
    case '/G2': await serve_html(res, 'Gfx2.html'); break;
    case '/G3': await serve_html(res, 'Gfx3.html'); break;
    case '/G4': await serve_html(res, 'Gfx4.html'); break;
    case '/G5': await serve_html(res, 'Gfx5.html'); break;
    case '/G6': await serve_html(res, 'Gfx6.html'); break;
    case '/G7': await serve_html(res, 'Gfx7.html'); break;
    case '/G8': await serve_html(res, 'Gfx8.html'); break;

    // Favicons and manifest
    case '/favicon.ico': await serve_img(res, 'favicon.ico'); break;
    case '/gfx1.png': await serve_img(res, 'gfx1.png'); break;
    case '/gfx2.png': await serve_img(res, 'gfx2.png'); break;
    case '/gfx3.png': await serve_img(res, 'gfx3.png'); break;
    case '/gfx4.png': await serve_img(res, 'gfx4.png'); break;
    case '/gfx5.png': await serve_img(res, 'gfx5.png'); break;
    case '/site.webmanifest':
      fs.readFile(path.join(pages, 'site.webmanifest'), (err, data) => {
        if (err) {
          serr(res, err);
        } else {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end(data);
        }
      });
      break;

    default:
      fs.readFile(path.join(pages, '404.html'), (err, data) => {
        if (err) {
          serr(res, err);
        } else {
          console.error(`${req.url} NOT FOUND`);
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(data);
          console.log(`INFO: response 404 NOT_FOUND 404.html`);
        }
      });
  }
}

if (isNaN(port)) {
  console.warn(`WARNING: invalid port ${port}`);
  port = 8000;
}

const s = http.createServer(server);
s.listen(port, () => {
  console.log(`INFO: server started at https://${os.hostname()}`);
  console.log(`INFO: server listening at port ${port}`);
  console.log(`INFO: view website at https://${os.hostname()}:${port}`);
});

process.on('SIGINT', () => {
  console.log('INFO: server shutting down...');
  s.close(() => process.exit(1));
});
