import {chromium,firefox,webkit} from 'playwright';
export async function launch(engine){
 if(!['chromium','firefox','webkit'].includes(engine))throw Error('Unknown browser engine '+engine);
 if(process.env.SERVERLESS_CHROMIUM==='1'){
  if(engine!=='chromium')throw Error('SERVERLESS_CHROMIUM requires BROWSER=chromium');
  const {default:serverless}=await import('@sparticuz/chromium');
  return chromium.launch({headless:true,executablePath:await serverless.executablePath(),args:serverless.args});
 }
 return ({chromium,firefox,webkit}[engine]).launch({headless:true,...(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{})});
}
