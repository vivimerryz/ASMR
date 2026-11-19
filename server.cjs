const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const askAI = require('./openai-request.cjs');
const port = 8790;
let busy = false;
const files = { '/audio/haircut.wav':['audio/haircut.wav','audio/wav'], '/audio/light-brushing.ogg':['audio/light-brushing.ogg','audio/ogg'], '/audio/keyboard-scratching.wav':['audio/keyboard-scratching.wav','audio/wav'], '/audio/squishy-fruit.wav':['audio/squishy-fruit.wav','audio/wav'], '/audio/cracker-chewing.wav':['audio/cracker-chewing.wav','audio/wav'], '/audio/crunchy-eating.wav':['audio/crunchy-eating.wav','audio/wav'], '/': ['index.html','text/html'], '/app.js':['app.js','text/javascript'], '/storage.js':['storage.js','text/javascript'], '/sounds.js':['sounds.js','text/javascript'], '/resources.js':['resources.js','text/javascript'], '/style.css':['style.css','text/css'] };
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
    const {message, choices} = JSON.parse(body);
    if (typeof message !== 'string' || !message.trim() || message.length > 500) return json(400,{error:'Please type a feeling, up to 500 characters.'});
    busy = true;
    if (!Array.isArray(choices) || choices.length > 30 || choices.some(c => !c || typeof c.id !== 'string' || typeof c.name !== 'string' || typeof c.type !== 'string')) return json(400,{error:'Please refresh and try again.'});
    try {json(200,await askAI(message.trim(),choices));} finally {busy=false;}
  } catch {json(502,{error:'The AI could not answer just now. Please check the key in .env and your internet connection, then try Next again.'});}
}).listen(port,'127.0.0.1',()=>console.log(`ASMR Stress Reliever: http://localhost:${port}`));



