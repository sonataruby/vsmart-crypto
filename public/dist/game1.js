SmartApps=function(s,o){"use strict";var l,c;let i=s.Blockchain;var n,p=i.address();return s.tokenGame1={},s.tokenGame1.getTest=async a=>{var e=await l.LeverHistory("0x4bcf94e14907989227d683f8d3efce3a82ae5402",2).call();console.log(e)},s.tokenGame1.getBalt=async a=>{var r=[];return await l.getTokenOwner(n).call().then(async e=>{for(var t=0;t<e.length;t++)await axios.get("https://api.starsbattle.co/layer/"+e[t]).then(a=>{a=a.data,a={tokenId:e[t],name:a.name,Class:a.Class,Lever:a.Lever,Bullet:a.Bullet,BulletClass:a.BulletClass,Speed:a.Speed,Score:a.Score,Groups:a.Groups};r.push(a)})}),0==r.length&&null==a&&(o.location.href="/app/marketplace"),r},s.tokenGame1.getPlayer=async a=>{var e={};return await axios.get("https://api.starsbattle.co/layer/"+a).then(a=>{e=a.data}),e},s.tokenGame1.upLever=async(a,e,t)=>{let r=0;return await axios.post("https://api.starsbattle.co/uplever",{tokenid:a,score:e,bullet:t,wallet:n}).then(async a=>{"update"==a.data.status&&(a=a.data.hash,await l.upLeverStart(a).send({gas:3e5,data:n}).then(a=>{a.transactionHash&&(r=1)}))}),r},s.tokenGame1.getMarketPlate=async a=>{var r=[];return await c.getMarketStars(a+1).call().then(a=>{for(var e,t=0;t<a.length;t++)0<t&&(e={id:t,name:""!=a[t].name?a[t].name:"Stars CX 1",price:0<a[t].price?i.fromWei(a[t].price):1e3,lever:0<a[t].lever?a[t].lever:1,class:0<a[t].class?a[t].class:1,bullet:0<a[t].bullet?a[t].bullet:1e3,bulletclass:0<a[t].bulletclass?a[t].bulletclass:1,speed:0<a[t].speed?a[t].speed:7},r.push(e))}),r},s.tokenGame1.keccak256=a=>i.keccak256(a),s.tokenGame1.buyMarketPlate=async a=>{var e=(await c.MarketPlaceItemOf(a).call()).price;if(0==e)return i.notify("Item not avalible"),!1;await s.tokenSmart.allowance(p.AddressContractNFTFactory)<e&&await s.tokenSmart.approve(p.AddressContractNFTFactory,e),await c.buyStars(a).send({gas:5e5}).then(a=>{console.log(a)})},s.tokenGame1.getBulletMarket=async a=>{var r=[];return await c.getBulletMarket(a).call().then(a=>{for(var e=0;e<a.length;e++){var t={id:e+1,name:a[e].name,price:i.fromWei(a[e].price),bullet:a[e].bullet};r.push(t)}}),r},s.tokenGame1.buyBullet=async(e,t,r,l)=>{var a=(await c.MarketPlaceBulletOf(t).call()).price;if(0==a)return i.notify("Item not avalible"),!1;var n=0;return 1==await s.tokenSmart.approve(p.AddressContractNFTFactory,a)&&await c.MarketPlaceBulletOf(t).call().then(async a=>{0<a.price?await c.buyBullet(e,t,r).send({gas:3e5}).then(async a=>{i.notify("Item Update"),1==l?n=1:(s.Blockchain.Socket.emit("buybulet",{tokenid:e}),o.location.href="/app/my")}):i.notify("Item not support")}),n},s.tokenGame1.buyVip=async(a,e)=>{var t=(await c.VipOf(e).call()).price;if(0==t)return i.notify("Item not avalible"),!1;1==await s.tokenSmart.approve(p.AddressContractNFTFactory,t)&&await c.buyVip(a,e).send({gas:3e5}).then(a=>{i.notify("VIP Update")})},s.tokenGame1.Init=async()=>{await i.init(),l=await i.loadContractGame1(),c=await i.loadContractNFTFactory(),n=await i.getLoginWallet()},s.components.docReady.push(s.tokenGame1.Init),s}(SmartApps,(jQuery,window));