import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
export function serve(port=4173){
 const root=path.resolve('dist');
 const server=http.createServer(async(req,res)=>{
  try{const url=new URL(req.url,'http://localhost');let file=decodeURIComponent(url.pathname);if(file.endsWith('/'))file+='index.html';const resolved=path.resolve(root,'.'+file);if(!resolved.startsWith(root+path.sep))throw new Error('invalid path');
   const data=await readFile(resolved);res.writeHead(200,{'Content-Type':resolved.endsWith('.js')?'text/javascript':resolved.endsWith('.css')?'text/css':resolved.endsWith('.html')?'text/html':'application/json','Cache-Control':'no-store'});res.end(data);
  }catch{res.writeHead(404);res.end('Not found');}
 });
 return new Promise(resolve=>server.listen(port,'127.0.0.1',()=>resolve(server)));
}
if(process.argv[1]===fileURLToPath(import.meta.url)){await serve(Number(process.env.PORT||4173));console.log('http://127.0.0.1:'+(process.env.PORT||4173));}
