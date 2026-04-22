// @Name：PingMe 自动化签到+视频奖励（Loon版）
// @Author：怎么肥事（Loon适配）
//
// [Script]
// http-request ^https?:\/\/api\.pingmeapp\.net\/app\/queryBalanceAndBonus script-path=https://raw.githubusercontent.com/164857430/My-CF-IPs/refs/heads/main/PingMe.js, requires-body=false, tag=PingMe抓包
// cron "55 */2 * * *" script-path=https://raw.githubusercontent.com/164857430/My-CF-IPs/refs/heads/main/PingMe.js, tag=PingMe签到
//
// [MITM]
// hostname = api.pingmeapp.net

var scriptName = 'PingMe';
var storeKey = 'pingme_accounts_v1';
var SECRET = '0fOiukQq7jXZV2GRi9LGlO';
var MAX_VIDEO = 5;
var VIDEO_DELAY = 8000;
var ACCOUNT_GAP = 3500;
var IOS_VERSIONS = ['17.5.1','17.6.1','17.4.1','17.2.1','16.7.8','17.6','17.3.1','18.0.1','17.1.2','16.6.1'];
var IOS_SCALES = ['2.00','3.00','3.00','2.00','3.00'];
var IPHONE_MODELS = ['iPhone14,3','iPhone13,3','iPhone15,3','iPhone16,1','iPhone14,7','iPhone13,2','iPhone15,2','iPhone12,1'];
var CFN_VERS = ['1410.0.3','1494.0.7','1568.100.1','1209.1','1474.0.4','1568.200.2'];
var DARWIN_VERS = ['22.6.0','23.5.0','23.6.0','24.0.0','22.4.0'];

function MD5(string) {
  function RotateLeft(lValue, iShiftBits) { return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits)); }
  function AddUnsigned(lX, lY) {
    var lX4=lX&0x40000000,lY4=lY&0x40000000,lX8=lX&0x80000000,lY8=lY&0x80000000;
    var lResult=(lX&0x3FFFFFFF)+(lY&0x3FFFFFFF);
    if(lX4&lY4)return lResult^0x80000000^lX8^lY8;
    if(lX4|lY4)return(lResult&0x40000000)?(lResult^0xC0000000^lX8^lY8):(lResult^0x40000000^lX8^lY8);
    return lResult^lX8^lY8;
  }
  function F(x,y,z){return(x&y)|((~x)&z);}
  function G(x,y,z){return(x&z)|(y&(~z));}
  function H(x,y,z){return x^y^z;}
  function I(x,y,z){return y^(x|(~z));}
  function FF(a,b,c,d,x,s,ac){a=AddUnsigned(a,AddUnsigned(AddUnsigned(F(b,c,d),x),ac));return AddUnsigned(RotateLeft(a,s),b);}
  function GG(a,b,c,d,x,s,ac){a=AddUnsigned(a,AddUnsigned(AddUnsigned(G(b,c,d),x),ac));return AddUnsigned(RotateLeft(a,s),b);}
  function HH(a,b,c,d,x,s,ac){a=AddUnsigned(a,AddUnsigned(AddUnsigned(H(b,c,d),x),ac));return AddUnsigned(RotateLeft(a,s),b);}
  function II(a,b,c,d,x,s,ac){a=AddUnsigned(a,AddUnsigned(AddUnsigned(I(b,c,d),x),ac));return AddUnsigned(RotateLeft(a,s),b);}
  function ConvertToWordArray(str) {
    var lMessageLength=str.length,lNumberOfWords_temp1=lMessageLength+8;
    var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1%64))/64;
    var lNumberOfWords=(lNumberOfWords_temp2+1)*16;
    var lWordArray=[],i;
    for(i=0;i<lNumberOfWords-1;i++)lWordArray[i]=0;
    var lBytePosition=0,lByteCount=0;
    while(lByteCount<lMessageLength){
      var lWordCount=(lByteCount-(lByteCount%4))/4;
      lBytePosition=(lByteCount%4)*8;
      lWordArray[lWordCount]|=str.charCodeAt(lByteCount)<<lBytePosition;
      lByteCount++;
    }
    var lWordCount2=(lByteCount-(lByteCount%4))/4;
    lBytePosition=(lByteCount%4)*8;
    lWordArray[lWordCount2]|=0x80<<lBytePosition;
    lWordArray[lNumberOfWords-2]=lMessageLength<<3;
    lWordArray[lNumberOfWords-1]=lMessageLength>>>29;
    return lWordArray;
  }
  function WordToHex(lValue) {
    var r='',i,b,t;
    for(i=0;i<=3;i++){b=(lValue>>>(i*8))&255;t='0'+b.toString(16);r+=t.substr(t.length-2,2);}
    return r;
  }
  var x=ConvertToWordArray(string);
  var a=0x67452301,b=0xEFCDAB89,c=0x98BADCFE,d=0x10325476;
  var S11=7,S12=12,S13=17,S14=22,S21=5,S22=9,S23=14,S24=20;
  var S31=4,S32=11,S33=16,S34=23,S41=6,S42=10,S43=15,S44=21;
  for(var k=0;k<x.length;k+=16){
    var AA=a,BB=b,CC=c,DD=d;
    a=FF(a,b,c,d,x[k+0],S11,0xD76AA478);d=FF(d,a,b,c,x[k+1],S12,0xE8C7B756);c=FF(c,d,a,b,x[k+2],S13,0x242070DB);b=FF(b,c,d,a,x[k+3],S14,0xC1BDCEEE);
    a=FF(a,b,c,d,x[k+4],S11,0xF57C0FAF);d=FF(d,a,b,c,x[k+5],S12,0x4787C62A);c=FF(c,d,a,b,x[k+6],S13,0xA8304613);b=FF(b,c,d,a,x[k+7],S14,0xFD469501);
    a=FF(a,b,c,d,x[k+8],S11,0x698098D8);d=FF(d,a,b,c,x[k+9],S12,0x8B44F7AF);c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
    a=FF(a,b,c,d,x[k+12],S11,0x6B901122);d=FF(d,a,b,c,x[k+13],S12,0xFD987193);c=FF(c,d,a,b,x[k+14],S13,0xA679438E);b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
    a=GG(a,b,c,d,x[k+1],S21,0xF61E2562);d=GG(d,a,b,c,x[k+6],S22,0xC040B340);c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);b=GG(b,c,d,a,x[k+0],S24,0xE9B6C7AA);
    a=GG(a,b,c,d,x[k+5],S21,0xD62F105D);d=GG(d,a,b,c,x[k+10],S22,0x02441453);c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);b=GG(b,c,d,a,x[k+4],S24,0xE7D3FBC8);
    a=GG(a,b,c,d,x[k+9],S21,0x21E1CDE6);d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);c=GG(c,d,a,b,x[k+3],S23,0xF4D50D87);b=GG(b,c,d,a,x[k+8],S24,0x455A14ED);
    a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);d=GG(d,a,b,c,x[k+2],S22,0xFCEFA3F8);c=GG(c,d,a,b,x[k+7],S23,0x676F02D9);b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
    a=HH(a,b,c,d,x[k+5],S31,0xFFFA3942);d=HH(d,a,b,c,x[k+8],S32,0x8771F681);c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
    a=HH(a,b,c,d,x[k+1],S31,0xA4BEEA44);d=HH(d,a,b,c,x[k+4],S32,0x4BDECFA9);c=HH(c,d,a,b,x[k+7],S33,0xF6BB4B60);b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
    a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);d=HH(d,a,b,c,x[k+0],S32,0xEAA127FA);c=HH(c,d,a,b,x[k+3],S33,0xD4EF3085);b=HH(b,c,d,a,x[k+6],S34,0x04881D05);
    a=HH(a,b,c,d,x[k+9],S31,0xD9D4D039);d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);b=HH(b,c,d,a,x[k+2],S34,0xC4AC5665);
    a=II(a,b,c,d,x[k+0],S41,0xF4292244);d=II(d,a,b,c,x[k+7],S42,0x432AFF97);c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);b=II(b,c,d,a,x[k+5],S44,0xFC93A039);
    a=II(a,b,c,d,x[k+12],S41,0x655B59C3);d=II(d,a,b,c,x[k+3],S42,0x8F0CCC92);c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);b=II(b,c,d,a,x[k+1],S44,0x85845DD1);
    a=II(a,b,c,d,x[k+8],S41,0x6FA87E4F);d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);c=II(c,d,a,b,x[k+6],S43,0xA3014314);b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
    a=II(a,b,c,d,x[k+4],S41,0xF7537E82);d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);c=II(c,d,a,b,x[k+2],S43,0x2AD7D2BB);b=II(b,c,d,a,x[k+9],S44,0xEB86D391);
    a=AddUnsigned(a,AA);b=AddUnsigned(b,BB);c=AddUnsigned(c,CC);d=AddUnsigned(d,DD);
  }
  return(WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d)).toLowerCase();
}

function getUTCSignDate() {
  var now=new Date();
  function pad(n){return String(n).padStart(2,'0');}
  return now.getUTCFullYear()+'-'+pad(now.getUTCMonth()+1)+'-'+pad(now.getUTCDate())+' '+pad(now.getUTCHours())+':'+pad(now.getUTCMinutes())+':'+pad(now.getUTCSeconds());
}
function normalizeHeaderNameMap(headers) {
  var out={};
  Object.keys(headers||{}).forEach(function(k){out[k]=headers[k];});
  return out;
}
function parseRawQuery(url) {
  var query=(url.split('?')[1]||'').split('#')[0],rawMap={};
  query.split('&').forEach(function(pair){
    if(!pair)return;
    var idx=pair.indexOf('=');
    if(idx<0)return;
    rawMap[pair.slice(0,idx)]=pair.slice(idx+1);
  });
  return rawMap;
}
function fingerprintOf(paramsRaw) {
  var drop={sign:1,signDate:1,timestamp:1,ts:1,nonce:1,random:1,reqTime:1,reqId:1,requestId:1};
  var base=Object.keys(paramsRaw||{}).filter(function(k){return !drop[k];}).sort().map(function(k){return k+'='+paramsRaw[k];}).join('&');
  return MD5(base).slice(0,12);
}
function loadStore() {
  var raw=$persistentStore.read(storeKey);
  if(!raw)return{version:1,accounts:{},order:[]};
  try{var obj=JSON.parse(raw);if(!obj.accounts)obj.accounts={};if(!Array.isArray(obj.order))obj.order=Object.keys(obj.accounts);return obj;}
  catch(e){return{version:1,accounts:{},order:[]};}
}
function saveStore(store) {
  $persistentStore.write(JSON.stringify(store),storeKey);
}
function pickItem(arr,seed){return arr[seed%arr.length];}
function buildUA(baseUA,seed) {
  var iosVer=pickItem(IOS_VERSIONS,seed),scale=pickItem(IOS_SCALES,seed+1);
  var model=pickItem(IPHONE_MODELS,seed+2),cfn=pickItem(CFN_VERS,seed+3),darwin=pickItem(DARWIN_VERS,seed+4);
  if(baseUA&&typeof baseUA==='string'){
    var ua=baseUA,changed=false;
    if(/iOS \d+(\.\d+){0,2}/.test(ua)){ua=ua.replace(/iOS \d+(\.\d+){0,2}/,'iOS '+iosVer);changed=true;}
    if(/Scale\/\d+(\.\d+)?/.test(ua)){ua=ua.replace(/Scale\/\d+(\.\d+)?/,'Scale/'+scale);changed=true;}
    if(/iPhone\d+,\d+/.test(ua)){ua=ua.replace(/iPhone\d+,\d+/,model);changed=true;}
    if(/CFNetwork\/[\d.]+/.test(ua)){ua=ua.replace(/CFNetwork\/[\d.]+/,'CFNetwork/'+cfn);changed=true;}
    if(/Darwin\/[\d.]+/.test(ua)){ua=ua.replace(/Darwin\/[\d.]+/,'Darwin/'+darwin);changed=true;}
    if(changed)return ua;
  }
  return 'PingMe/1.0.0 ('+model+'; iOS '+iosVer+'; Scale/'+scale+') CFNetwork/'+cfn+' Darwin/'+darwin;
}
function buildSignedParamsRaw(capture) {
  var params={};
  Object.keys(capture.paramsRaw||{}).forEach(function(k){if(k!=='sign'&&k!=='signDate')params[k]=capture.paramsRaw[k];});
  params.signDate=getUTCSignDate();
  var signBase=Object.keys(params).sort().map(function(k){return k+'='+params[k];}).join('&');
  params.sign=MD5(signBase+SECRET);
  return params;
}
function buildUrl(path,capture) {
  var params=buildSignedParamsRaw(capture);
  var qs=Object.keys(params).map(function(k){return k+'='+encodeURIComponent(params[k]);}).join('&');
  return 'https://api.pingmeapp.net/app/'+path+'?'+qs;
}
function buildHeaders(capture,ua) {
  var headers=Object.assign({},capture.headers||{});
  ['Content-Length','content-length',':authority',':method',':path',':scheme'].forEach(function(k){delete headers[k];});
  Object.keys(headers).forEach(function(k){if(k.toLowerCase()==='user-agent')delete headers[k];});
  headers['Host']='api.pingmeapp.net';
  headers['Accept']=headers['Accept']||'application/json';
  headers['User-Agent']=ua;
  return headers;
}
function sleep(ms){return new Promise(function(r){setTimeout(r,ms);});}
function httpFetch(options) {
  return new Promise(function(resolve,reject){
    var handler=function(err,resp,body){if(err)return reject({error:err});resolve({status:resp.status,headers:resp.headers,body:body});};
    if((options.method||'GET').toUpperCase()==='POST'){
      $httpClient.post({url:options.url,headers:options.headers,body:options.body||''},handler);
    }else{
      $httpClient.get({url:options.url,headers:options.headers},handler);
    }
  });
}

function runAccount(acc,index,total) {
  var tag='[账号'+(index+1)+'/'+total+' '+(acc.alias||acc.id)+']';
  var ua=buildUA(acc.baseUA,acc.uaSeed);
  var headers=buildHeaders(acc.capture,ua);
  var msgs=[tag];
  function fetchApi(path){return httpFetch({url:buildUrl(path,acc.capture),method:'GET',headers:headers});}
  function doVideoLoop(count) {
    var i=0;
    function next() {
      if(i>=count)return Promise.resolve();
      return new Promise(function(resolve){
        setTimeout(function(){
          i++;
          fetchApi('videoBonus').then(function(res){
            try{
              var d=JSON.parse(res.body);
              if(d.retcode===0){
                var bonus=(d.result&&d.result.bonus)||'?';
                msgs.push('🎬 视频'+i+'：+'+bonus+' Coins');
                resolve(next());
              }else{
                msgs.push('⏸ 视频'+i+'：'+d.retmsg);
                resolve();
              }
            }catch(e){msgs.push('❌ 视频'+i+'：解析失败');resolve();}
          }).catch(function(err){msgs.push('❌ 视频'+i+'：'+(err.error||'请求失败'));resolve();});
        },i===0?1500:VIDEO_DELAY);
      });
    }
    return next();
  }
  return fetchApi('queryBalanceAndBonus').then(function(res){
    try{var d=JSON.parse(res.body);if(d.retcode===0)msgs.push('💰 余额：'+d.result.balance+' Coins');else msgs.push('⚠️ 查询：'+d.retmsg);}
    catch(e){msgs.push('❌ 查询：解析失败');}
    return fetchApi('checkIn');
  }).then(function(res){
    try{
      var d=JSON.parse(res.body);
      if(d.retcode===0){
        var hint=((d.result&&d.result.bonusHint)||d.retmsg||'').replace(/\n/g,' ');
        msgs.push('✅ 签到：'+hint);
      }else{
        msgs.push('⚠️ 签到：'+d.retmsg);
      }
    }catch(e){msgs.push('❌ 签到：解析失败');}
    return doVideoLoop(MAX_VIDEO);
  }).then(function(){return fetchApi('queryBalanceAndBonus');}).then(function(res){
    try{var d=JSON.parse(res.body);if(d.retcode===0)msgs.push('💰 最新余额：'+d.result.balance+' Coins');}catch(e){}
    return msgs.join('\n');
  }).catch(function(err){
    msgs.push('❌ 异常：'+(err.error||String(err)));
    return msgs.join('\n');
  });
}

// 入口判断：抓包 or 定时
if(typeof $request !== 'undefined' && $request) {
  var paramsRaw=parseRawQuery($request.url);
  var headersMap=normalizeHeaderNameMap($request.headers||{});
  var baseUA='';
  Object.keys(headersMap).forEach(function(k){if(k.toLowerCase()==='user-agent')baseUA=headersMap[k];});
  var store=loadStore();
  var fp=fingerprintOf(paramsRaw);
  var nowTs=Date.now();
  var existed=!!store.accounts[fp];
  var uaSeed=existed?store.accounts[fp].uaSeed:store.order.length;
  var alias=existed?store.accounts[fp].alias:'账号'+(store.order.length+1);
  store.accounts[fp]={id:fp,alias:alias,uaSeed:uaSeed,baseUA:baseUA,capture:{url:$request.url,paramsRaw:paramsRaw,headers:headersMap},createdAt:existed?store.accounts[fp].createdAt:nowTs,updatedAt:nowTs};
  if(!existed)store.order.push(fp);
  saveStore(store);
  var total=store.order.length;
  $notification.post(scriptName,existed?'🔄 账号参数已更新':'✅ 新账号已入库',alias+'（id:'+fp+'）\n当前账号总数：'+total);
  $done({});

} else {
  var store2=loadStore();
  var ids=store2.order.filter(function(id){return store2.accounts[id];});
  if(!ids.length){
    $notification.post(scriptName,'⚠️ 未抓到任何账号','请先打开 PingMe 触发抓包');
    $done();
  }else{
    var total2=ids.length,results=[];
    var chain=Promise.resolve();
    ids.forEach(function(id,idx){
      chain=chain
        .then(function(){return runAccount(store2.accounts[id],idx,total2);})
        .then(function(text){results.push(text);})
        .then(function(){return idx<ids.length-1?sleep(ACCOUNT_GAP):null;});
    });
    chain.then(function(){
      $notification.post(scriptName,'🎉 全部完成 ('+total2+'个账号)',results.join('\n———\n'));
      $done();
    }).catch(function(err){
      $notification.post(scriptName,'❌ 任务异常',results.join('\n———\n')+'\n'+(err.error||String(err)));
      $done();
    });
  }
}
