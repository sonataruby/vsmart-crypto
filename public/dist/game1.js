SmartApps=function(n,r){"use strict";var l,o;let s=n.Blockchain;var c,i=s.address();return n.tokenGame1={},n.tokenGame1.getBalt=async()=>{var n=[];return await l.getTokenOwner(c).call().then(async t=>{for(var e=0;e<t.length;e++)await axios.get("http://198.13.63.7:7000/layer/"+t[e]).then(a=>{a=a.data,a={tokenId:t[e],name:a.name,Class:a.Class,Lever:a.Lever,Bullet:a.Bullet,BulletClass:a.BulletClass,Speed:a.Speed,Score:a.Score,Groups:a.Groups};n.push(a)})}),n},n.tokenGame1.getPlayer=async a=>{var t={};return await axios.get("http://198.13.63.7:7000/nft/"+a).then(a=>{t=a.data[0]}),t},n.tokenGame1.upLever=async(a,t,e)=>{let n=0;return await axios.post("http://198.13.63.7:7000/uplever",{tokenid:a,score:t,bullet:e,wallet:c}).then(async a=>{"update"==a.data.status&&(a=a.data.hash,await l.upLeverStart(a).send({gas:3e5,data:c}).then(a=>{console.log(a),a.transactionHash&&(n=1)}))}),n},n.tokenGame1.getMarketPlate=async a=>{var n=[];return await o.getMarketStars(a).call().then(a=>{for(var t=0;t<a.length;t++){var e={name:""!=a[t].name?a[t].name:"Stars CX 1",price:0<a[t].price?s.fromWei(a[t].price):1e3,lever:0<a[t].lever?a[t].lever:1,class:0<a[t].class?a[t].class:1,bullet:0<a[t].bullet?a[t].bullet:1e3,bulletclass:0<a[t].bulletclass?a[t].bulletclass:1,speed:0<a[t].speed?a[t].speed:7};n.push(e)}}),n},n.tokenGame1.keccak256=a=>s.keccak256(a),n.tokenGame1.buyMarketPlate=async a=>{var t=(await o.MarketPlaceItemOf(a).call()).price;if(0==t)return s.notify("Item not avalible"),!1;await n.tokenSmart.allowance(i.AddressContractNFTFactory)<t&&await n.tokenSmart.approve(i.AddressContractNFTFactory,t),await o.buyStars(a).send({gas:5e5}).then(a=>{console.log(a)})},n.tokenGame1.getBulletMarket=async a=>{var n=[];return await o.getBulletMarket(a).call().then(a=>{for(var t=0;t<a.length;t++){var e={id:t,name:a[t].name,price:s.fromWei(a[t].price),bullet:a[t].bullet};n.push(e)}}),n},n.tokenGame1.buyBullet=async(t,e)=>{var a=(await o.MarketPlaceBulletOf(e).call()).price;if(0==a)return s.notify("Item not avalible"),!1;await n.tokenSmart.allowance(i.AddressContractNFTFactory)<a&&await n.tokenSmart.approve(i.AddressContractNFTFactory,a),await o.MarketPlaceBulletOf(e).call().then(async a=>{0<a.price?await o.buyBullet(t,e).send({gas:3e5}).then(async a=>{s.notify("Item Update"),await axios.post("http://198.13.63.7:7000/nft",{tokenid:t}).then(()=>{r.location.href="/app/my"})}):s.notify("Item not support")})},n.tokenGame1.buyVip=async(t,e)=>{var a=(await o.VipOf(e).call()).price;if(0==a)return s.notify("Item not avalible"),!1;await n.tokenSmart.allowance(i.AddressContractNFTFactory)<a&&await n.tokenSmart.approve(i.AddressContractNFTFactory,a),await o.VipOf(e).call().then(async a=>{0<a.id?await o.buyVip(t,e).send({gas:3e5}).then(a=>{s.notify("VIP Update")}):s.notify("VIP Item not support")})},n.tokenGame1.Init=async()=>{await s.init(),l=await s.loadContractGame1(),o=await s.loadContractNFTFactory(),c=await s.getLoginWallet()},n.components.docReady.push(n.tokenGame1.Init),n}(SmartApps,(jQuery,window));