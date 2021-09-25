SmartApps=function(o,c){"use strict";var n,i;let p=o.Blockchain;var l,u=p.address();return o.tokenGame1={},o.tokenGame1.getBalt=async()=>{var r=[];return await n.getTokenOwner(l).call().then(async t=>{for(var e=0;e<t.length;e++)await axios.get("https://api.starsbattle.co/layer/"+t[e]).then(a=>{a=a.data,a={tokenId:t[e],name:a.name,Class:a.Class,Lever:a.Lever,Bullet:a.Bullet,BulletClass:a.BulletClass,Speed:a.Speed,Score:a.Score,Groups:a.Groups};r.push(a)})}),r},o.tokenGame1.getPlayer=async a=>{var t={};return await axios.get("https://api.starsbattle.co/layer/"+a).then(a=>{t=a.data}),t},o.tokenGame1.upLever=async(a,t,e)=>{let r=0;return await axios.post("https://api.starsbattle.co/uplever",{tokenid:a,score:t,bullet:e,wallet:l}).then(async a=>{"update"==a.data.status&&(a=a.data.hash,await n.upLeverStart(a).send({gas:3e5,data:l}).then(a=>{console.log(a),a.transactionHash&&(r=1)}))}),r},o.tokenGame1.getMarketPlate=async a=>{var r=[];return await i.getMarketStars(a).call().then(a=>{for(var t=0;t<a.length;t++){var e={name:""!=a[t].name?a[t].name:"Stars CX 1",price:0<a[t].price?p.fromWei(a[t].price):1e3,lever:0<a[t].lever?a[t].lever:1,class:0<a[t].class?a[t].class:1,bullet:0<a[t].bullet?a[t].bullet:1e3,bulletclass:0<a[t].bulletclass?a[t].bulletclass:1,speed:0<a[t].speed?a[t].speed:7};r.push(e)}}),r},o.tokenGame1.keccak256=a=>p.keccak256(a),o.tokenGame1.buyMarketPlate=async a=>{var t=(await i.MarketPlaceItemOf(a).call()).price;if(0==t)return p.notify("Item not avalible"),!1;await o.tokenSmart.allowance(u.AddressContractNFTFactory)<t&&await o.tokenSmart.approve(u.AddressContractNFTFactory,t),await i.buyStars(a).send({gas:5e5}).then(a=>{console.log(a)})},o.tokenGame1.getBulletMarket=async a=>{var r=[];return await i.getBulletMarket(a).call().then(a=>{for(var t=0;t<a.length;t++){var e={id:t,name:a[t].name,price:p.fromWei(a[t].price),bullet:a[t].bullet};r.push(e)}}),r},o.tokenGame1.buyBullet=async(t,e,r,n)=>{var a=(await i.MarketPlaceBulletOf(e).call()).price;if(0==a)return p.notify("Item not avalible"),!1;var l=await o.tokenSmart.allowance(u.AddressContractNFTFactory),s=r;return l<a&&await o.tokenSmart.approve(u.AddressContractNFTFactory,a),await i.MarketPlaceBulletOf(e).call().then(async a=>{0<a.price?await i.buyBullet(t,e).send({gas:3e5}).then(async a=>{p.notify("Item Update"),1==n?s=r+a:c.location.href="/app/my"}):p.notify("Item not support")}),s},o.tokenGame1.buyVip=async(t,e)=>{var a=(await i.VipOf(e).call()).price;if(0==a)return p.notify("Item not avalible"),!1;await o.tokenSmart.allowance(u.AddressContractNFTFactory)<a&&await o.tokenSmart.approve(u.AddressContractNFTFactory,a),await i.VipOf(e).call().then(async a=>{0<a.id?await i.buyVip(t,e).send({gas:3e5}).then(a=>{p.notify("VIP Update")}):p.notify("VIP Item not support")})},o.tokenGame1.Init=async()=>{await p.init(),n=await p.loadContractGame1(),i=await p.loadContractNFTFactory(),l=await p.getLoginWallet()},o.components.docReady.push(o.tokenGame1.Init),o}(SmartApps,(jQuery,window));