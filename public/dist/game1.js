SmartApps=function(r,n){"use strict";var l,s;let o=r.Blockchain;var c,i=o.address();return r.tokenGame1={},r.tokenGame1.getBalt=async()=>{var r=[];return await l.getTokenOwner(c).call().then(async t=>{for(var e=0;e<t.length;e++)await l.getOptions(t[e]).call().then(a=>{a={tokenId:t[e],name:a.ClassName,Class:a.Class,Lever:a.Lever,Bullet:a.Bullet,BulletClass:a.BulletClass,Speed:a.Speed,Score:a.Score,Groups:a.Groups};r.push(a)})}),r},r.tokenGame1.getPlayer=async a=>{var t={};return await axios.get("https://api.starsbattle.co/nft/"+a).then(a=>{t=a.data[0]}),t},r.tokenGame1.upLever=async(t,e,a)=>{let r=0;return await axios.post("https://api.starsbattle.co/uplever",{tokenid:t,score:e,bullet:a,wallet:c}).then(async a=>{"update"==a.data.status&&(a=a.data.hash,await l.upLeverStart(t,e,a).send({gas:13e4,data:c}).then(a=>{a.transactionHash&&(r=1)}))}),r},r.tokenGame1.getMarketPlate=async a=>{var r=[];return await s.getMarketStars(a).call().then(a=>{for(var t=0;t<a.length;t++){var e={name:""!=a[t].name?a[t].name:"Stars CX 1",price:0<a[t].price?o.fromWei(a[t].price):1e3,lever:0<a[t].lever?a[t].lever:1,class:0<a[t].class?a[t].class:1,bullet:0<a[t].bullet?a[t].bullet:1e3,bulletclass:0<a[t].bulletclass?a[t].bulletclass:1,speed:0<a[t].speed?a[t].speed:7};r.push(e)}}),r},r.tokenGame1.keccak256=a=>o.keccak256(a),r.tokenGame1.buyMarketPlate=async a=>{var t=(await s.MarketPlaceItemOf(a).call()).price;if(0==t)return o.notify("Item not avalible"),!1;await r.tokenSmart.allowance(i.AddressContractNFTFactory)<t&&await r.tokenSmart.approve(i.AddressContractNFTFactory,t),await s.buyStars(a).send({gas:5e5}).then(a=>{console.log(a)})},r.tokenGame1.getBulletMarket=async a=>{var r=[];return await s.getBulletMarket(a).call().then(a=>{for(var t=0;t<a.length;t++){var e={id:t,name:a[t].name,price:o.fromWei(a[t].price),bullet:a[t].bullet};r.push(e)}}),r},r.tokenGame1.buyBullet=async(t,e)=>{var a=(await s.MarketPlaceBulletOf(e).call()).price;if(0==a)return o.notify("Item not avalible"),!1;await r.tokenSmart.allowance(i.AddressContractNFTFactory)<a&&await r.tokenSmart.approve(i.AddressContractNFTFactory,a),await s.MarketPlaceBulletOf(e).call().then(async a=>{0<a.price?await s.buyBullet(t,e).send({gas:3e5}).then(async a=>{o.notify("Item Update"),await axios.post("https://api.starsbattle.co/nft",{tokenid:t}).then(()=>{n.location.href="/app/my"})}):o.notify("Item not support")})},r.tokenGame1.buyVip=async(t,e)=>{var a=(await s.VipOf(e).call()).price;if(0==a)return o.notify("Item not avalible"),!1;await r.tokenSmart.allowance(i.AddressContractNFTFactory)<a&&await r.tokenSmart.approve(i.AddressContractNFTFactory,a),await s.VipOf(e).call().then(async a=>{0<a.id?await s.buyVip(t,e).send({gas:3e5}).then(a=>{o.notify("VIP Update")}):o.notify("VIP Item not support")})},r.tokenGame1.Init=async()=>{await o.init(),l=await o.loadContractGame1(),s=await o.loadContractNFTFactory(),c=await o.getLoginWallet()},r.components.docReady.push(r.tokenGame1.Init),r}(SmartApps,(jQuery,window));