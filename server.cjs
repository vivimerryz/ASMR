const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const askAI = require('./openai-request.cjs');
const port = 8790;
let busy = false;
const files = { '/': ['index.html','text/html'], '/app.js':['app.js','text/javascript'], '/storage.js':['storage.js','text/javascript'], '/style.css':['style.css','text/css'] };
http.createServer(async (req,res) => {
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Cache-Control','no-store');
  if (req.method === 'GET' && files[req.url]) {
    const [file,type] = files[req.url];
    res.writeHead(200, {'Content-Type':type + '; charset=utf-8'});
    return res.end(fs.readFileSync(path.join(__dirname,'web',file)));
  }
  if (req.method !== 'POST' || req.url !== '/api/calm') { res.writeHead(404); return res.end('Not found'); }
  const json = (status,data) => {res.writeHead(status,{'Content-Type':'application/json'});res.end(JSON.stringify(data));};
  if (req.headers.origin !== `http://localhost:${port}` && req.headers.origin !== `http://127.0.0.1:${port}`) return json(403,{error:'Please open the app on this computer.'});
  if (busy) return json(429,{error:'Please wait for the current reply.'});
  try {
    let body = ''; for await (const chunk of req) {body += chunk; if (body.length > 8000) return json(413,{error:'Please write a shorter message.'});}
    const {message} = JSON.parse(body);
    if (typeof message !== 'string' || !message.trim() || message.length > 500) return json(400,{error:'Please type a feeling, up to 500 characters.'});
    busy = true;
    try {json(200,{reply:await askAI(message.trim())});} finally {busy=false;}
  } catch {json(502,{error:'The AI could not answer just now. Please check the key in .env and your internet connection, then try Next again.'});}
}).listen(port,'127.0.0.1',()=>console.log(`ASMR Stress Reliever: http://localhost:${port}`));
