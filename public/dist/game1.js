SmartApps=function(s,o){"use strict";var l,c;let i=s.Blockchain;var n,p=i.address();return s.tokenGame1={},s.tokenGame1.getTest=async a=>{a=await l.paramsOf(a).call();console.log(a)},s.tokenGame1.getBalt=async()=>{var r=[];return await l.getTokenOwner(n).call().then(async t=>{for(var e=0;e<t.length;e++)await axios.get("https://api.starsbattle.co/layer/"+t[e]).then(a=>{a=a.data,a={tokenId:t[e],name:a.name,Class:a.Class,Lever:a.Lever,Bullet:a.Bullet,BulletClass:a.BulletClass,Speed:a.Speed,Score:a.Score,Groups:a.Groups};r.push(a)})}),0==r.length&&(o.location.href="/app/marketplace"),r},s.tokenGame1.getPlayer=async a=>{var t={};return await axios.get("https://api.starsbattle.co/layer/"+a).then(a=>{t=a.data}),t},s.tokenGame1.upLever=async(a,t,e)=>{let r=0;return await axios.post("https://api.starsbattle.co/uplever",{tokenid:a,score:t,bullet:e,wallet:n}).then(async a=>{"update"==a.data.status&&(a=a.data.hash,await l.upLeverStart(a).send({gas:3e5,data:n}).then(a=>{a.transactionHash&&(r=1)}))}),r},s.tokenGame1.getMarketPlate=async a=>{var r=[];return await c.getMarketStars(a+1).call().then(a=>{for(var t,e=0;e<a.length;e++)0<e&&(t={id:e,name:""!=a[e].name?a[e].name:"Stars CX 1",price:0<a[e].price?i.fromWei(a[e].price):1e3,lever:0<a[e].lever?a[e].lever:1,class:0<a[e].class?a[e].class:1,bullet:0<a[e].bullet?a[e].bullet:1e3,bulletclass:0<a[e].bulletclass?a[e].bulletclass:1,speed:0<a[e].speed?a[e].speed:7},r.push(t))}),r},s.tokenGame1.keccak256=a=>i.keccak256(a),s.tokenGame1.buyMarketPlate=async a=>{var t=(await c.MarketPlaceItemOf(a).call()).price;if(0==t)return i.notify("Item not avalible"),!1;await s.tokenSmart.allowance(p.AddressContractNFTFactory)<t&&await s.tokenSmart.approve(p.AddressContractNFTFactory,t),await c.buyStars(a).send({gas:5e5}).then(a=>{console.log(a)})},s.tokenGame1.getBulletMarket=async a=>{var r=[];return await c.getBulletMarket(a).call().then(a=>{for(var t=0;t<a.length;t++){var e={id:t+1,name:a[t].name,price:i.fromWei(a[t].price),bullet:a[t].bullet};r.push(e)}}),r},s.tokenGame1.buyBullet=async(t,e,r,l)=>{var a=(await c.MarketPlaceBulletOf(e).call()).price;if(0==a)return i.notify("Item not avalible"),!1;var n=0;return 1==await s.tokenSmart.approve(p.AddressContractNFTFactory,a)&&await c.MarketPlaceBulletOf(e).call().then(async a=>{0<a.price?await c.buyBullet(t,e,r).send({gas:3e5}).then(async a=>{i.notify("Item Update"),1==l?n=1:(await axios.post("https://api.starsbattle.co/nft",{tokenid:t}),o.location.href="/app/my")}):i.notify("Item not support")}),n},s.tokenGame1.buyVip=async(t,e)=>{var a=(await c.VipOf(e).call()).price;if(0==a)return i.notify("Item not avalible"),!1;await s.tokenSmart.allowance(p.AddressContractNFTFactory)<a&&await s.tokenSmart.approve(p.AddressContractNFTFactory,a),await c.VipOf(e).call().then(async a=>{0<a.id?await c.buyVip(t,e).send({gas:3e5}).then(a=>{i.notify("VIP Update")}):i.notify("VIP Item not support")})},s.tokenGame1.Init=async()=>{await i.init(),l=await i.loadContractGame1(),c=await i.loadContractNFTFactory(),n=await i.getLoginWallet()},s.components.docReady.push(s.tokenGame1.Init),s}(SmartApps,(jQuery,window));