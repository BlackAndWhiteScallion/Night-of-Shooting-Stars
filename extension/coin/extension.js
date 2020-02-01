'use strict';
game.import('play',function(lib,game,ui,get,ai,_status){
	return {
		name:'coin',
		init:function(){
			if(lib.config.mode!='chess'||get.config('chess_mode')!='leader'){
				_status.coin=100;
			}
			if (!lib.config.coin) game.changeCoin(100);
			lib.characterPack.mode_extension_coin={
				kejinji:['female','5',3,['chaoneng', 'chaoli', 'liyu'], ['forbidai']],
				hero:['female', '1', 4, ['weituo', 'zaguo', 'fanjian'], ['forbidai']],
				rinnosuke:['male', '1', 3, ['luguo', 'shuaimai'], []],
			};
			lib.characterIntro['kejinji']='魔法和奇迹都没有有钱好使！（本次氪金由魔法少女伊莉亚代言）<br>画师：Binato_Lulu';
			lib.characterIntro['hero']='卖圣剑了卖圣剑了！持勇者证可以半价！（本次圣剑由火焰纹章0赞助提供）<br>画师：志月';
			lib.characterIntro['rinnosuke']='幻想乡里的万事屋·香霖堂的店主。店里兜售来自外界的各种各样的新鲜东西。不包修不包换也不包退款就是了。<br>画师：';
			for(var i in lib.characterPack.mode_extension_coin){
				lib.character[i]=lib.characterPack.mode_extension_coin[i];
			}
			var skill = {
				chaoneng:{
					audio:2,
					enable:'phaseUse',
					group:['chaoneng_buff1', 'chaoneng_buff2'],
					init:function(player){
						player.storage.chaoneng1 = 0;
						player.storage.chaoneng2 = 0;
						player.storage.chaoneng3 = 0;
					},
					filter:function(event, player){
						return lib.config.coin >= 30;
					},
					content:function(){
						'step 0'
						event.list = ['30金币: 手牌上限+1 (当前为+'+player.storage.chaoneng1+')'];
						if (lib.config.coin >= 50) event.list.push('50金币：灵力上限+1');
						if (lib.config.coin >= 70) event.list.push('70金币：体力上限+1');
						if (lib.config.coin >= 100) event.list.push('100金币：摸牌数+1 (当前为+'+player.storage.chaoneng2+')');
						if (lib.config.coin >= 150) event.list.push ('150金币：【轰！】伤害+1 (当前为+'+player.storage.chaoneng3+')');
						player.chooseControlList(event.list, '想要买哪一个外挂？');
						'step 1'
						if (result.index == 0){
							game.changeCoin(-30);
							player.storage.chaoneng1 ++; 
						} else if (result.index == 1){
							game.changeCoin(-50);
							player.gainMaxlili();
						} else if (result.index == 2){
							game.changeCoin(-70);
							player.gainMaxHp();
						} else if (result.index == 3){
							game.changeCoin(-100);
							player.storage.chaoneng2 ++;
						} else if (result.index == 4){
							game.changeCoin(-150);
							player.storage.chaoneng3 ++;
						}
					},
				},
				chaoneng_buff1:{
					trigger:{player:'phaseDrawBegin'},
					direct:true,
					content:function(){
						trigger.num+=player.storage.chaoneng2;
					},
					mod:{
						maxHandcard:function(player,num){
							return num + player.storage.chaoneng1;
						}
					}
				},
				chaoneng_buff2:{
					trigger:{source:'damageBegin'},
					filter:function(event){
						return event.card&&event.card.name=='sha';
					},
					direct:true,
					content:function(){
						trigger.num+=player.storage.chaoneng3;
					},
				},
				chaoli:{
					audio:2,
					enable:'phaseUse',
					filter:function(event, player){
						return lib.config.coin >= 250;
					},
					filterTarget:function(){
						return true;
					},
					content:function(){
						game.changeCoin(-250);
						target.damage();
					},
					ai:{
						order:9,
						result:{
							target:function(player,target){
								return -2;
							}
						},
					}
				},
				liyu:{
					audio:2,
					enable:'phaseUse',
					usable:1,
					filter:function(event, player){
						return lib.config.coin >= 200;
					},
					filterTarget:function(card, player, target){
						return target != player;
					},
					content:function(){
						'step 0'
						var choices = [200];
						if (lib.config.coin >= 300) choices.push(300);
						if (lib.config.coin >= 400) choices.push(400);
						player.chooseControl(choices).set('dialog', ['贿赂给'+get.translation(target)+'多少钱？']);
						'step 1'
						if (result.control){
							var random = 0;
							game.changeCoin(-result.control);
							if (result.control == 200){
								random = 0.6;
							} else if (result.control == 300){
								random = 0.4;
							} else if (result.control == 400){
								random = 0.1;
							}
							if (target.name == 'reimu') random = 0;
							if (Math.random() > random) target.addSkill('liyu_buff');
							else game.log('利驭失败啦！');
						}
					},
				},
				liyu_buff:{
					trigger:{player:'phaseEnd'},
					direct:true,
					group:'mad',
					filter:function(){
						return true;
					},
					content:function(){
						player.removeSkill('liyu_buff');
						player.removeSkill('mad');
						player.unmarkSkill('mad');
					}
				},
				weituo:{
					audio:2,
					trigger:{player:'phaseUseBegin'},
					group:'weituo_end',
					filter:function(event, player){
						return true;
					},
					content:function(){
						'step 0'
						player.chooseControlList(get.prompt('weituo'), '你造成过至少2点伤害', '有角色回复过体力', '有其他角色获得过牌');
						'step 1'
						if (result.index == 0){
							game.log(player, '选择了委托：你造成过至少2点伤害');
							player.addTempSkill('weituo_damage');
						} else if (result.index == 1){
							game.log(player, '选择了委托：有角色回复过体力');
							player.addTempSkill('weituo_heal');
						} else if (result.index == 2){
							game.log(player, '选择了委托：有其他角色获得过牌');
							player.addTempSkill('weituo_gain');
						}
					},
				},
				weituo_damage:{
				},
				weituo_heal:{
					direct:true,
					trigger:{global:'recoverAfter'},
					content:function(){
						player.storage.weituo = true;
					}
				},
				weituo_gain:{
					direct:true,
					trigger:{global:'gainAfter'},
					filter:function(event, player){
						return event.player != player;
					},
					content:function(){
						player.storage.weituo = true;
					}
				},
				weituo_end:{
					audio:2,
					trigger:{player:'phaseEnd'},
					direct:true,
					filter:function(event,player){
						if (player.hasSkill('weituo_damage')) return player.getStat('damage') >= 2;
						return player.storage.weituo;
					},
					content:function(){
						delete player.storage.weituo;
						game.log(player, '完成了委托！');
						player.draw();
						game.changeCoin(150);
					},
				},
				zaguo:{
					audio:2,
					enable:'phaseUse',
					filter:function(event, player){
						return player.countCards('hej') > 0;
					},
					selectCard:1,
					filterCard:true,
					position:'hej',
					discard:true,
					content:function(){
						var i = Math.ceil(Math.random() * 50 + 50);
						game.changeCoin(i);
						game.log('你获得了'+i+'金币！');
					},
				},
				fanjian:{
					audio:2,
					enable:'phaseUse',
					filter:function(event, player){
						return lib.config.coin >= 400;
					},
					content:function(){
						game.changeCoin(-400);
						player.gain(game.createCard('holysword', 0, null, null, 5));
					},
				},
				shuaimai:{
					forced:true,
					global:'shuaimai_buy',
					group:'shuaimai_discard',
					trigger:{player:'loseEnd'},
					filter:function(event,player){
						return !player.countCards('h');
					},
					content:function(){
						'step 0'
						var list = [];
						for(var i in lib.card){
							if (!lib.translate[i]) continue;
							if (get.type(i) == 'zhenfa') continue;
							if (get.type(i) == 'delay') continue;
							list.push(i);
						}
						list=list.randomGets(5);
						for(var i=0;i<list.length;i++){
							player.gain(game.createCard(list[i]));
						}
						'step 1'
						player.mingzhiCard(player.getCards('h'));
					},
				},
				shuaimai_discard:{
					forced:true,
					trigger:{player:'phaseEnd'},
					content:function(){
						player.discard(player.getCards('h'));
					}
				},
				shuaimai_buy:{
					enable:'phaseUse',
					filter:function(event, player){
						return game.hasPlayer(function(current){
							return current.hasSkill('shuaimai') && (current.countCards('ej') || current.storage.mingzhi); 
						}) && lib.config.coin >= 200;
					},
					selectTarget:1,
					filterTarget:function(card, player, target){
						return target != player && target.hasSkill('shuaimai') && (target.storage.mingzhi || target.countCards('hj'))
					},
					content:function(){
						if (target == game.me){
							game.changeCoin(200);
						}
						if (player == game.me){
							game.changeCoin(-200);
						}
						player.gainPlayerCard('hej',target,true).set('filterButton',function(button){
							return target.getCards('ej').contains(button.link) || (target.storage.mingzhi && target.storage.mingzhi.contains(button.link));
						});
					},
					prompt:'选择购买商家（有【甩卖】和明置牌的角色）',
					ai:{
						order:1,
						result:{
							player:function(player,target){
								if (player.countCards('h') > 2) return -1;
								return Math.random() < 0.01?1:-1;
							},
						},
					},
				},
			};
			for (var i in skill){
				lib.skill[i] = skill[i];
			}
			var list={
				mode_extension_coin_character_config:'金币系统',
				mode_extension_coin_card_config:'金币系统',
				kejinji:'氪金姬',
				chaoneng:'钞能',
				chaoneng_info:'出牌阶段，你可以支付以下量的金币，获得对应的效果：30：你的手牌上限+1；50：你的灵力上限+1；70：你的体力上限+1；100：你于摸牌阶段额外摸一张牌；150：你使用【轰！】造成的伤害+1。',
				chaoneng_audio1:'有钱你就会变的更强！',
				chaoneng_audio2:'只有没钱的人才会觉得钱买不来幸福！',
				chaoli:'钞力',
				chaoli_info:'出牌阶段，你可以支付250金币，对一名角色造成1点弹幕伤害。',
				chaoli_audio1:'给，打自己一个耳光吧？',
				chaoli_audio2:'金币当作炮弹意外的效果不错呢~',
				liyu:'利驭',
				liyu_info:'一回合一次，你可以支付200，300，或400金币，并指定一名角色；该角色有几率攻击其队友一回合。',
				liyu_audio1:'任何人都有一个价格。',
				liyu_audio2:'这么多钱够吧？够吧？',
				kejinji_die:'你钱太少了吧！',
				hero:'勇者',
				weituo:'委托',
				weituo_info:'出牌阶段开始时，你可以选择一项条件：1.你造成过至少2点伤害；2.有角色回复过体力；3.有其他角色获得过牌；结束阶段，若你本回合达成了该条件，你摸一张牌，并获得150金币。',
				weituo_audio1:'即使是我应该也做得来这个？',
				weituo_audio2:'作为勇者就是要助人为乐吧！',
				weituo_end_audio1:'完成了完成了！太好了！',
				weituo_end_audio2:'今晚可以吃一顿好的啦~',
				zaguo:'砸锅',
				zaguo_info:'出牌阶段，你可以弃置一张牌，随机获得50~100金币。',
				zaguo_audio1:'再见了我的炒锅酱……',
				zaguo_audio2:'卖东西只能以1/4市价卖？？太过分了吧？？？',
				fanjian:'贩剑',
				fanjian_info:'出牌阶段，你可以支付400金币，创建并获得一张【天赐圣剑】（装备/武器；灵力：+5；你视为拥有【连击】【激怒】【制衡】。）',
				fanjian_audio1:'啊——终于攒出来了……',
				fanjian_audio2:'有了这个我就无敌了！',
				hero_die:'勇者不是不会输的吗！',
				rinnosuke:'霖之助',
				shuaimai:'甩卖',
				shuaimai_buy:'甩卖（买）',
				shuaimai_info:'结束阶段，你弃置所有手牌；你失去最后手牌后，创建5张任意游戏牌（包括其他模式和其他游戏的牌），获得这些牌并明置之；其他角色的出牌阶段，其可以支付200金币，获得你一张明置牌。',
			};
			for(var i in list){
				lib.translate[i]=lib.translate[i]||list[i];
			}
		},
		arenaReady:function(){
	        if(_status.video||_status.connectMode) return;
			if(lib.config.mode!='chess'||get.config('chess_mode')!='leader'){
				var str;
				if(lib.config.coin_display_playpackconfig=='text'){
					str='<span>'+lib.config.coin+'</span><span>金</span>'
				}
				else{
					str='<span style="position:absolute">㉤</span><span style="margin-left:18px;font-family:xinwei;line-height:10px">'+lib.config.coin+'</span>';
				}
				if(lib.config.coin_canvas_playpackconfig){
					ui.window.classList.add('canvas_top');
				}
				ui.coin=ui.create.system(str,null,true);
				if(lib.config.snowFall){
					game.haveFun.list.snow.bought=true;
					setTimeout(function(){
						game.haveFun.snow();
					},500);
				}
				lib.setPopped(ui.coin,function(){
					var uiintro=ui.create.dialog('hidden');
					uiintro.classList.add('coin_menu')
					uiintro.add('<div style="text-align:center;font-size:16px">打完一局就可以获得金币！击坠数越高获得的越多！</div>');
					uiintro.add('商店');
					uiintro.listen(function(e){
						e.stopPropagation();
					});
					var clickBuy=function(){
						if(this.innerHTML=='停止'){
							game.haveFun[this.name+'Stop']();
						}
						else if(this.innerHTML=='开始'){
							game.haveFun[this.name]();
						}
						else if(this.innerHTML.indexOf('金')!=-1){
							if(lib.config.coin>=this.content.cost){
								this.content.bought=true;
								game.changeCoin(-this.content.cost);
								game.haveFun[this.name]();
								if(this.content.onbuy){
									this.content.onbuy.call(this);
								}
							}
							else{
								return;
							}
						}
						ui.click.window();
					};
					for(var i in game.haveFun.list){
						var item=game.haveFun.list[i];
						uiintro.add('<div class="coin_buy">'+item.name+'<div class="menubutton">'+item.cost+'金</span></div></div>');
						var buy=uiintro.content.lastChild.lastChild.lastChild;
						if(lib.config.coin<item.cost&&!item.bought || (item.name == '圣剑' && !game.me)){
							buy.classList.add('disabled');
						}
						if(item.bought && item.name != '圣剑'){
							if(item.running){
								buy.innerHTML='停止';
								if(item.control){
									var node=item.control();
									if(node){
										buy.parentNode.appendChild(node,buy);
									}
								}
							}
							else{
								buy.innerHTML='开始';
							}
						}
						buy.name=i;
						buy.content=item;
						buy.listen(clickBuy);
					}

					if(!game.phaseNumber&&!game.online){
						uiintro.add('下注');
						uiintro.add('<div class="coin_buy">本局获胜<div class="menubutton">100金</span></div></div>');
						var bet=uiintro.content.lastChild.lastChild.lastChild;
						bet.listen(function(){
							if(_status.betWin) return;
							_status.betWin=true;
							game.changeCoin(-100);
							this.innerHTML='已下注';
						});
						if(_status.betWin){
							bet.innerHTML='已下注';
						}
					}
					else if(_status.betWin){
						uiintro.add('下注');
						uiintro.add('<div class="coin_buy">本局获胜<div class="menubutton">已下注</span></div></div>');
					}

					uiintro.classList.add('noleave');

					return uiintro;
				},220,400);
			}
	    },
		content:function(config, pack){
		},
		game:{
			changeCoin:function(num){
				if(typeof num=='number'&&ui.coin){
					game.saveConfig('coin',lib.config.coin+num);
					var str;
					if(lib.config.coin_display_playpackconfig=='text'){
						str='<span>'+lib.config.coin+'</span><span>金</span>'
					}
					else{
						str='<span style="position:absolute">㉤</span><span style="margin-left:18px;font-family:xinwei;line-height:10px">'+lib.config.coin+'</span>';
					}
					ui.coin.innerHTML=str;
				}
			},
			haveFun:{
				list:{
					firework:{
						name:'烟花',
						cost:50,
					},
					snow:{
						name:'下雪',
						cost:20,
						size:'large',
						control:function(){
							var size=ui.create.div('.menubutton');
							if(game.haveFun.list.snow.size=='small'){
								size.innerHTML='大雪';
							}
							else{
								size.innerHTML='小雪';
							}
							size.listen(game.haveFun.snowSize);
							return size;
						}
					},
					star:{
						name:'星云',
						cost:10
					},
					blink:{
						name:'闪烁',
						cost:10
					},
					sword:{
						name:'圣剑',
						cost:800
					},
				},
				alwaysSnow:function(){
					game.saveConfig('snowFall',!lib.config.snowFall);
					game.reload();
				},
				sword:function(){
					if (game.me){
						game.me.gain(game.createCard('holysword', 0, null, null, 5));
						game.me.update();
						ui.update();
					}
				},
				blink:function(){
					if(game.haveFun.list.blink.running) return;
					game.haveFun.list.blink.running=true;
					if(game.haveFun.blinkLoop){
						game.haveFun.blinkLoop();
					}
					else{
						var canvas = document.createElement("canvas");
						ui.window.appendChild(canvas);
						canvas.classList.add('fun');
						canvas.style.zIndex=20;
						var ctx = canvas.getContext("2d");

						//Make the canvas occupy the full page
						var W = ui.window.offsetWidth, H = ui.window.offsetHeight;
						canvas.width = W;
						canvas.height = H;
						lib.onresize.push(function(){
							var W = ui.window.offsetWidth, H = ui.window.offsetHeight;
							canvas.width = W;
							canvas.height = H;
						});

						var particles = [];
						var mouse = {};

						//Lets create some particles now
						var particle_count = 25;


						//finally some mouse tracking
						ui.window.addEventListener('mousemove', function(e)
						{
							//since the canvas = full page the position of the mouse
							//relative to the document will suffice
							mouse.x = e.pageX/game.documentZoom;
							mouse.y = e.pageY/game.documentZoom;
						});
						ui.window.addEventListener('touchmove',function(e){
							mouse.x = e.touches[0].clientX/game.documentZoom;
							mouse.y = e.touches[0].clientY/game.documentZoom;
						});

						var particle=function()
						{
							//speed, life, location, life, colors
							//speed.x range = -2.5 to 2.5
							//speed.y range = -15 to -5 to make it move upwards
							//lets change the Y speed to make it look like a flame
							this.speed = {x: -2.5+Math.random()*5, y: -5+Math.random()*10};
							this.speed.x/=4;
							this.speed.y/=4;
							//location = mouse coordinates
							//Now the flame follows the mouse coordinates
							if(mouse.x && mouse.y)
							{
								this.location = {x: mouse.x, y: mouse.y};
							}
							else
							{
								this.location = {x: W/2, y: H/2};
							}
							//radius range = 10-30
							this.radius = 10+Math.random()*20;
							//life range = 20-30
							this.radius/=4;
							this.life = 20+Math.random()*10;
							this.life*=4;
							this.remaining_life = this.life;
							//colors
							this.r = Math.round(Math.random()*255);
							this.g = Math.round(Math.random()*255);
							this.b = Math.round(Math.random()*255);
						}
						for(var i = 0; i < particle_count; i++)
						{
							particles.push(new particle());
						}

						var draw=function()
						{
							if(!game.haveFun.list.blink.running){
								canvas.width=W;
								canvas.height=H;
								return;
							}
							ctx.clearRect(0, 0, W, H);
							//Painting the canvas black
							//Time for lighting magic
							//particles are painted with "lighter"
							//In the next frame the background is painted normally without blending to the
							//previous frame
							ctx.globalCompositeOperation = "lighter";

							for(var i = 0; i < particles.length; i++)
							{
								var p = particles[i];
								ctx.beginPath();
								//changing opacity according to the life.
								//opacity goes to 0 at the end of life of a particle
								p.opacity = Math.round(p.remaining_life/p.life*100)/100
								//a gradient instead of white fill
								var gradient = ctx.createRadialGradient(p.location.x, p.location.y, 0, p.location.x, p.location.y, p.radius);
								gradient.addColorStop(0, "rgba("+p.r+", "+p.g+", "+p.b+", "+p.opacity+")");
								gradient.addColorStop(0.5, "rgba("+p.r+", "+p.g+", "+p.b+", "+p.opacity+")");
								gradient.addColorStop(1, "rgba("+p.r+", "+p.g+", "+p.b+", 0)");
								ctx.fillStyle = gradient;
								ctx.arc(p.location.x, p.location.y, p.radius, Math.PI*2, false);
								ctx.fill();

								//lets move the particles
								p.remaining_life--;
								p.radius-=0.2;
								p.location.x += p.speed.x;
								p.location.y += p.speed.y;

								//regenerate particles
								if(p.remaining_life < 0 || p.radius < 0)
								{
									//a brand new particle replacing the dead one
									particles[i] = new particle();
								}
							}
							requestAnimationFrame(draw);
						}

						draw();
						game.haveFun.blinkLoop=draw;
						game.haveFun.blinkStop=function(){
							game.haveFun.list.blink.running=false;
						}
					}
				},
				star:function(){
					if(game.haveFun.list.star.running) return;
					game.haveFun.list.star.running=true;
					if(game.haveFun.starLoop){
						game.haveFun.starLoop();
					}
					else{
						//******************************************************
						// Yet Another Particle Engine
						var cos = Math.cos,
						    sin = Math.sin,
						    sqrt = Math.sqrt,
						    abs = Math.abs,
						    atan2 = Math.atan2,
						    log = Math.log,
						    random = Math.random,
						    PI = Math.PI,
						    sqr = function(v){return v*v;},
						    particles = [],
						    drawScale = 1,
						    emitters = [],
						    forces  = [],
						    collidedMass = 0,
						    maxParticles = 100,
						    emissionRate = 1,
							minParticleSize = 2;

						//-------------------------------------------------------
						// Vectors, and not the kind you put stuff in
						var Vector=function(x, y, z) {
						  this.x = x || 0;
						  this.y = y || 0;
						  this.z = z || 0;
						}
						Vector.prototype = {
						  add : function(vector) {
						    this.x += vector.x;
						    this.y += vector.y;
						    this.z += vector.z;
						    return this;
						  },
						  subtract : function(vector) {
						    this.x -= vector.x;
						    this.y -= vector.y;
						    this.z -= vector.z;
						    return this;
						  },
						  multiply : function(another) {
						    this.x /= another.x;
						    this.y /= another.y;
						    this.z /= another.z;
						    return this;
						  },
						  divide : function(another) {
						    this.x /= another.x;
						    this.y /= another.y;
						    this.z /= another.z;
						    return this;
						  },
						  scale : function(factor) {
						    this.x *= factor;
						    this.y *= factor;
						    this.z *= factor;
						    return this;
						  },
						  magnitude : function () {
						    return sqrt(sqr(this.x + this.y));
						  },
						  distance : function (another) {
						    return abs(sqrt(sqr(this.x - another.x) + sqr(this.y - another.y)));
						  },
						  angle : function (angle, magnitude) {
						    if(angle && magnitude)
						      return Vector.fromAngle(angle, magnitude);
						    return atan2(this.y, this.x);
						  },
						  clone : function() {
						    return new Vector(this.x, this.y, this.z);
						  },
						  equals : function(another) {
						    return this.x === another.x&&
								this.y === another.y&&
								this.z === another.z;
						  },
						  random : function(r) {
						    this.x += (random() * r * 2) - r;
						    this.y += (random() * r * 2) - r;
						    return this;
						  }
						};
						Vector.fromAngle = function (angle, magnitude) {
						  return new Vector(
						    magnitude * cos(angle),
						    magnitude * sin(angle),
						    magnitude * sin(angle));
						};

						//******************************************************
						// A thing with mass, position, and velocity - like your mom
						var Particle=function(pt, vc, ac, mass) {
						  this.pos = pt || new Vector(0, 0);
						  this.vc = vc || new Vector(0, 0);
						  this.ac = ac || new Vector(0, 0);
						  this.mass = mass || 1;
						  this.alive = true;
						}
						Particle.prototype.move = function () {
						  this.vc.add(this.ac);
						  this.pos.add(this.vc);
						};
						Particle.prototype.reactToForces = function (fields) {
						  var totalAccelerationX = 0;
						  var totalAccelerationY = 0;

						  for (var i = 0; i < fields.length; i++) {
						    var field = fields[i];
						    var vectorX = field.pos.x - this.pos.x;
						    var vectorY = field.pos.y - this.pos.y;
						    var distance = this.pos.distance(field.pos);
						    if(distance < 1) field.grow(this);
						    if(distance < 100) this.doubleSize = true;
						    var force = G(this.forceBetween(field, distance));
						    totalAccelerationX += vectorX * force;
						    totalAccelerationY += vectorY * force;
						  }
						  this.ac = new Vector(totalAccelerationX, totalAccelerationY);

						  totalAccelerationX = 0;
						  totalAccelerationY = 0;
						  for (var i = 0; i < particles.length; i++) {
						    var field = particles[i];
						    if(field === this || !field.alive) continue;
						    var vectorX = field.pos.x - this.pos.x;
						    var vectorY = field.pos.y - this.pos.y;
						    var distance = this.pos.distance(field.pos);
						    if(distance < 1) {
						      if(this.mass >= field.mass) {
						        var massRatio = this.mass / field.mass;
						        if(particles.length <= maxParticles && this.mass>40) {
						          this.alive = false;
						          this.nova = true;
						          collidedMass += this.mass;
						        } else this.grow(field);
						      } else this.alive = false;
						    }
						    if(this.alive) {
						      var force = G(this.forceBetween(field, distance));
						      totalAccelerationX += vectorX * G(force);
						      totalAccelerationY += vectorY * G(force);
						    }
						  }

						  var travelDist = this.pos.distance(this.lastPos ? this.lastPos : this.pos);
						  this.velocity = travelDist - (this.lastDistance ? this.lastDistance : travelDist);
						  this.lastDistance = travelDist;
						  this.lastPos = this.pos.clone();

						  this.ac.add(new Vector(totalAccelerationX, totalAccelerationY));
						  this.lastPos = this.pos.clone();
						  // if(this.mass > 20) {
						  //   var chance = 1 / (this.mass - 20);
						  //   if(Math.random()>chance) {
						  //     this.supernova = true;
						  //     this.supernovaDur = 10;
						  //     this.alive = false;
						  //     if(particles.length <= maxParticles) collidedMass += this.mass;
						  //     delete this.size;
						  //   }
						  // }
						};
						Particle.prototype.grow = function (another) {
						  this.mass += another.mass;
						  this.nova = true;
						  another.alive = false;
						  delete this.size;
						};
						Particle.prototype.breakApart = function(minMass, maxParts) {
						  if(!minMass) minMass = 1;
						  if(!maxParts) maxParts = 2;
						  var remainingMass = this.mass;
						  var num = 0;
						  while(remainingMass > 0) {
						    var np = new Particle(this.pos.clone().random(this.mass), new Vector(0,0));
						    np.mass = 1 + Math.random() * (remainingMass - 1);
						    if(num>=maxParts-1) np.mass = remainingMass;
						    np.mass = np.mass < minMass ? minMass : np.mass;
						    remainingMass -= np.mass;
						    num++;
						  }
						  this.nova = true;
						  delete this.size;
						  this.alive = false;
						};
						Particle.prototype.forceBetween = function(another, distance) {
						  var distance = distance? distance : this.pos.distance(another.pos);
						  return (this.mass * another.mass) / sqr(distance);
						};

						//******************************************************
						//This certainly doesn't *sub*mit to particles, that's for sure
						var ParticleEmitter=function(pos, vc, ang) {
						  // to do config options for emitter - random, static, show emitter, emitter color, etc
						  this.pos = pos;
						  this.vc = vc;
						  this.ang = ang || 0.09;
						  this.color = "#999";
						}
						ParticleEmitter.prototype.emit = function() {
						  var angle = this.vc.angle() +
						      this.ang - (Math.random() * this.ang * 2);
						  var magnitude = this.vc.magnitude();
						  var position = this.pos.clone();
						        position.add(
						        new Vector(
						          ~~((Math.random() * 100) - 50) * drawScale,
						          ~~((Math.random() * 100) - 50) * drawScale
						        ));
						  var velocity = Vector.fromAngle(angle, magnitude);
						  return new Particle(position,velocity);
						};

						//******************************************************
						// Use it, Luke
						// to do collapse functionality into particle
						var Force=function(pos, m) {
						  this.pos = pos;
						  this.mass = m || 100;
						}
						Force.prototype.grow = function (another) {
						  this.mass += another.mass;
						  this.burp = true;
						  another.alive = false;
						};



						var G=function(data) {
						  return 0.00674 * data;
						}

						//******************************************************
						var canvas = document.createElement('canvas');
						canvas.classList.add('fun');
						ui.window.appendChild(canvas);
						var ctx = canvas.getContext('2d');
						canvas.width = ui.window.offsetWidth;
						canvas.height = ui.window.offsetHeight;
						var canvasWidth = canvas.width;
						var canvasHeight = canvas.height;
						lib.onresize.push(function() {
							canvas.width = ui.window.offsetWidth;
							canvas.height = ui.window.offsetHeight;
							canvasWidth = canvas.width;
							canvasHeight = canvas.height;
						});

						var renderToCanvas = function (width, height, renderFunction) {
						    var buffer = document.createElement('canvas');
						    buffer.width = width;
						    buffer.height = height;
						    renderFunction(buffer.getContext('2d'));
						    return buffer;
						};

						maxParticles = 500;
						emissionRate = 1;
						drawScale = 1.3;
						minParticleSize = 2;
						emitters = [
						  //br
						  new ParticleEmitter(
						    new Vector(
						      canvasWidth / 2 * drawScale + 400,
						      canvasHeight / 2 * drawScale
						      ),
						    Vector.fromAngle(2, 5),
						    1
						  ),
						  //   // bl
						  //   new ParticleEmitter(
						  //   new Vector(
						  //     canvasWidth / 2 * drawScale - 400,
						  //     canvasHeight / 2 * drawScale + 400
						  //     ),
						  //   Vector.fromAngle(1.5, 1),
						  //   1
						  // ),
						    // tl
						  new ParticleEmitter(
						    new Vector(
						      canvasWidth / 2 * drawScale - 400,
						      canvasHeight / 2 * drawScale
						      ),
						    Vector.fromAngle(5, 5),
						    1
						  ),
						  //   // tr
						  //   new ParticleEmitter(
						  //   new Vector(
						  //     canvasWidth / 2 * drawScale + 400,
						  //     canvasHeight / 2 * drawScale - 400
						  //     ),
						  //   Vector.fromAngle(4.5, 1),
						  //   1
						  // )
						];
						forces  = [
						  new Force(
						    new Vector((canvasWidth / 2 * drawScale) ,
						               (canvasHeight / 2 * drawScale)), 1800)
						];

						var loop=function() {
							if(!game.haveFun.list.star.running){
								canvas.width=ui.window.offsetWidth;
								canvas.height=ui.window.offsetHeight;
								return;
							}
							clear();
							update();
							draw();
							queue();
						}
						game.haveFun.starLoop=loop;
						game.haveFun.starStop=function(){
							game.haveFun.list.star.running=false;
						};


						var clear=function() {
						  ctx.clearRect(0, 0, canvas.width, canvas.height);
						}

						var ctr = 0;
						var c = [
						  'rgba(255,255,255,',
						  'rgba(0,150,255,',
						  'rgba(255,255,128,',
						  'rgba(255,255,255,'
						];
						var rndc=function() {
						  return c[~~(Math.random() * c.length-1)];
						}
						var c2 = 'rgba(255,64,32,';
						var addNewParticles=function() {
						  var _emit = function() {
						    var ret = 0;
						    for (var i = 0; i < emitters.length; i++) {
						      for (var j = 0; j < emissionRate; j++) {
						        var p = emitters[i].emit();
						        p.color = ( ctr % 10 === 0 )?
								  ( Math.random() * 5 <= 1 ? c2 : rndc() )
						          : rndc();
						        p.mass = ~~(Math.random() * 5);
						        particles.push(p);
						        ret += p.mass;
						        ctr++;
						      }
						    }
						    return ret;
						  };
						  if(collidedMass !== 0) {
						    while(collidedMass !== 0) {
						      collidedMass -= _emit();
						      collidedMass = collidedMass<0 ? 0 :collidedMass;
						    }
						  }
						  if (particles.length > maxParticles)
						    return;
						  _emit();
						}

						var CLIPOFFSCREEN = 1,
						    BUFFEROFFSCREEN = 2,
						    LOOPSCREEN = 3;

						var isPositionAliveAndAdjust=function(particle,check) {
						  return true;
						//   var pos = particle.pos;
						//   if(!check) check = BUFFEROFFSCREEN;
						//   if(check === CLIPOFFSCREEN) {
						//     return !(!particle.alive ||
						//              pos.x < 0 ||
						//              (pos.x / drawScale) > boundsX ||
						//              pos.y < 0 ||
						//              (pos.y / drawScale) > boundsY);
						//   } else if(check === BUFFEROFFSCREEN) {
						//     return !(!particle.alive ||
						//              pos.x < -boundsX * drawScale ||
						//              pos.x > 2 * boundsX * drawScale ||
						//              pos.y < -boundsY * drawScale ||
						//              pos.y > 2 * boundsY * drawScale);
						//   } else if(check === LOOPSCREEN) {
						//     if (pos.x < 0) pos.x = boundsX * drawScale;
						//     if ((pos.x / drawScale) > boundsX) pos.x = 0;
						//     if (pos.y < 0) pos.y = boundsY * drawScale;
						//     if ((pos.y / drawScale) > boundsY) pos.y = 0;
						//     return true;
						//   }
						}

						var plotParticles=function(boundsX, boundsY) {
						  var currentParticles = [];
						  for (var i = 0; i < particles.length; i++) {
						    var particle = particles[i];
						    particle.reactToForces(forces);
						    if(!isPositionAliveAndAdjust(particle))
						      continue;
						    particle.move();
						    currentParticles.push(particle);
						  }
						}

						var offscreenCache = {};
						var renderParticle=function(p) {
						    var position = p.pos;
						    if(!p.size) p.size = Math.floor(p.mass / 100);


						    if(!p.opacity) p.opacity = 0.05;
						    if(p.velocity > 0) {
						      if(p.opacity<=0.18)
						        p.opacity += 0.04;
						    }
						      if(p.opacity>0.08)
						        p.opacity -= 0.02;

						    var actualSize = p.size / drawScale;
						    actualSize = actualSize < minParticleSize ? minParticleSize : actualSize;
						    if(p.mass>8) actualSize *= 2;
						    if(p.nova) {
						      actualSize *= 4;
						      p.nova = false;
						    }
						    if(p.doubleSize) {
						      p.doubleSize = false;
						      actualSize *= 2;
						    }
						    // if(p.supernova) {
						    //   actualSize *= 6;
						    //   opacity = 0.15;
						    //   p.supernovaDur = p.supernovaDur - 1;
						    //   if(p.supernovaDur === 0)
						    //     p.supernova = false;
						    // }
						    var cacheKey = actualSize + '_' + p.opacity + '_' + p.color;
						    var cacheValue = offscreenCache[cacheKey];
						    if(!cacheValue) {
						      cacheValue = renderToCanvas(actualSize * 32, actualSize * 32, function(ofsContext) {
						        var opacity = p.opacity;
						        var fills = [
						          {size:actualSize/2,  opacity:1},
						          {size:actualSize,  opacity:opacity},
						          {size:actualSize * 2, opacity:opacity / 2},
						          {size:actualSize * 4, opacity:opacity / 3},
						          {size:actualSize * 8, opacity:opacity / 5},
						          {size:actualSize * 16, opacity:opacity / 16}
						        ];
						        ofsContext.beginPath();
						        for(var f in fills) {
						          f = fills[f];
						          ofsContext.fillStyle = p.color + f.opacity + ')';
						          ofsContext.arc(
						            actualSize * 16,
						            actualSize * 16,
						            f.size , 0, Math.PI*2, true);
						          ofsContext.fill();
						        }
						        ofsContext.closePath();
						      });
						      offscreenCache[cacheKey] = cacheValue;
						    }
						      var posX = p.pos.x / drawScale;
						    var posY = p.pos.y / drawScale;
						    ctx.drawImage(cacheValue, posX, posY);
						}

						var fills = [
						  {size:15,opacity:1  },
						  {size:25,opacity:0.3},
						  {size:50,opacity:0.1} ];

						var renderScene=function(ofsContext) {
						  for (var i = 0; i < forces.length; i++) {
						    var p = forces[i];
						    var position = p.pos;
						    var opacity = 1;

						    ofsContext.beginPath();
						    for(var f in fills) {
						      f = fills[f];
						      var o = p.burp === true ? 1 : f.opacity;
						      p.burp = false;
						      // ofsContext.fillStyle = 'rgba(255,255,255,' + o + ')';
						      // ofsContext.arc(position.x / drawScale,
						      //   position.y / drawScale,
						      //   f.size / drawScale, 0, Math.PI*2, true);
						      // ofsContext.fill();
						    }
						    ofsContext.closePath();
						  }

						  for (var i = 0; i < particles.length; i++) {
						    var p = particles[i];
						    renderParticle(p);
						  }
						}

						var draw=function() {
						  renderScene(ctx);
						}

						var update=function() {
						  addNewParticles();
						  plotParticles(canvas.width, canvas.height);
						}

						var queue=function() {
						  window.requestAnimationFrame(loop);
						}

						loop();

					}
				},
				snow:function(){
					game.haveFun.list.snow.running=true;
					if(game.haveFun.snowStart){
						game.haveFun.snowStart();
					}
					else{
						/*
						* 自由下雪 snowFall
						* author：xuanfeng
						* time: 2014-01-11
						*/
						// 控制下雪
						var canvas;
						var snowFall=function(snow) {
							// 可配置属性
							snow = snow || {};
							this.maxFlake = snow.maxFlake || 200;	//最多片数
							this.flakeSize = snow.flakeSize || 10;	//雪花形状
							this.fallSpeed = snow.fallSpeed || 2;	//坠落速度
							this.status = 0;	//0-初始化、1-开始下雪、2-停止下雪、3-暂停下雪、4-继续下雪
						}

						// 兼容写法
						var requestAnimationFrame = window.requestAnimationFrame ||
												window.mozRequestAnimationFrame ||
												window.webkitRequestAnimationFrame ||
												window.msRequestAnimationFrame ||
												window.oRequestAnimationFrame ||
												function(callback) { setTimeout(callback, 1000 / 60); };
						var cancelAnimationFrame = window.cancelAnimationFrame ||
												window.mozCancelAnimationFrame ||
												window.webkitCancelAnimationFrame ||
												window.msCancelAnimationFrame ||
												window.oCancelAnimationFrame;

						// 开始下雪
						snowFall.prototype.start = function(){
							if(this.status == 1 || this.status == 4){
								// 已经在下雪则不作处理
								return false;
							}
							this.status = 1;

							// 创建画布
							snowCanvas.apply(this);
							// 创建雪花形状
							createFlakes.apply(this);
							// 画雪
							drawSnow.apply(this)
						}

						// 停止下雪
						snowFall.prototype.stop = function(){
							if(this.status == 2 || this.status == 0 || !this.canvas){
								return false;
							}
							// 停止动画循环
							this.pause();
							this.status = 2;
							// 删除画布
							this.canvas.parentNode.removeChild(this.canvas);
							this.canvas = null;
						}

						// 暂停下雪
						snowFall.prototype.pause = function(){
							if(this.status == 3){
								return false;
							}
							this.status = 3;
							cancelAnimationFrame(this.loop)
						};
						// 继续下雪
						snowFall.prototype.resume = function(){
							if(this.status == 3 && this.canvas){
								this.status = 4;
								// 动画的计时控制
								var that=this;
								this.loop = requestAnimationFrame(function() {
									drawSnow.apply(that)
								});
							}
						};

						// 创建画布
						var snowCanvas=function() {
							// 添加Dom结点
							var snowcanvas = document.createElement("canvas");
							snowcanvas.classList.add('fun');
							snowcanvas.id = "snowfall";
							ui.window.appendChild(snowcanvas);
							canvas=snowcanvas;
							this.canvas = snowcanvas;
							this.ctx = snowcanvas.getContext("2d");
							// 窗口大小改变的处理
							lib.onresize.push(function() {
								snowcanvas.width = ui.window.offsetWidth;
								snowcanvas.height = ui.window.offsetHeight
							});
							snowcanvas.width = ui.window.offsetWidth;
							snowcanvas.height = ui.window.offsetHeight;
						}

						// 雪运动对象
						var flakeMove=function(canvasWidth, canvasHeight, flakeSize, fallSpeed) {
							this.x = Math.floor(Math.random() * canvasWidth); 	//x坐标
							this.y = Math.floor(Math.random() * canvasHeight);	//y坐标
							this.size = Math.random() * flakeSize + 2;			//形状
							this.maxSize = flakeSize;							 //最大形状
							this.speed = Math.random() * 1 + fallSpeed;		      //坠落速度
							this.fallSpeed = fallSpeed;						  //坠落速度
							this.velY = this.speed;							  //Y方向速度
							this.velX = 0;									    //X方向速度
							this.stepSize = Math.random() / 30;				    //步长
							this.step = 0 									    //步数
						}

						flakeMove.prototype.update = function() {
							var x = this.x,
							    y = this.y;

							// 左右摆动(余弦)
							this.velX *= 0.98;
							if (this.velY <= this.speed) {
								this.velY = this.speed
							}
							this.velX += Math.cos(this.step += 0.05) * this.stepSize;

							this.y += this.velY;
							this.x += this.velX;
							// 飞出边界的处理
							if (this.x >= canvas.width || this.x <= 0 || this.y >= canvas.height || this.y <= 0) {
								this.reset(canvas.width, canvas.height)
							}
						};

						// 飞出边界-放置最顶端继续坠落
						flakeMove.prototype.reset = function(width, height) {
							this.x = Math.floor(Math.random() * width);
							this.y = 0;
							this.size = Math.random() * snow.flakeSize + 2;
							this.speed = Math.random() * 1 + snow.fallSpeed;
							this.velY = this.speed;
							this.velX = 0;
						};

						// 渲染雪花-随机形状
						flakeMove.prototype.render = function(ctx) {
							var snowFlake = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
							snowFlake.addColorStop(0, "rgba(255, 255, 255, 0.9)");
							snowFlake.addColorStop(0.5, "rgba(255, 255, 255, 0.5)");
							snowFlake.addColorStop(1, "rgba(255, 255, 255, 0)");
							ctx.save();
							ctx.fillStyle = snowFlake;
							ctx.beginPath();
							ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
							ctx.fill();
							ctx.restore();
						};

						// 创建雪花-定义形状
						var createFlakes=function() {
							var maxFlake = this.maxFlake,
								flakes = this.flakes = [],
								canvas = this.canvas;
							for (var i = 0; i < 200; i++) {
								flakes.push(new flakeMove(canvas.width, canvas.height, this.flakeSize, this.fallSpeed))
							}
						}

						// 画雪
						var drawSnow=function() {
							var maxFlake = this.maxFlake,
								flakes = this.flakes;
							var ctx = this.ctx, canvas = this.canvas, that = this;
							// 清空雪花
							ctx.clearRect(0, 0, canvas.width, canvas.height);
							for (var e = 0; e < maxFlake; e++) {
								flakes[e].update();
								flakes[e].render(ctx);
							}
							// 一帧一帧的画
							this.loop = requestAnimationFrame(function() {
								drawSnow.apply(that);
							});
						}

						// 调用及控制方法
						var snow = new snowFall();
						game.haveFun.snowStart=function(){
							snow.start();
						}
						game.haveFun.snowStop=function(){
							game.haveFun.list.snow.running=false;
							snow.stop();
						}
						game.haveFun.snowSize=function(){
							if(game.haveFun.list.snow.size=='large'){
								game.haveFun.list.snow.size='small';
								snow.maxFlake=80;
								snow.flakeSize=3;
								snow.fallSpeed=1;
								if(this&&this.innerHTML){
									this.innerHTML='大雪';
								}
								game.saveConfig('coinSnowSize',true);
							}
							else{
								game.haveFun.list.snow.size='large';
								snow.maxFlake=200;
								snow.flakeSize=10;
								snow.fallSpeed=2;
								if(this&&this.innerHTML){
									this.innerHTML='小雪';
								}
								game.saveConfig('coinSnowSize',false);
							}
						}
						if(lib.config.coinSnowSize){
							game.haveFun.snowSize();
						}
						snow.start();
					}
				},
				firework:function(){
					if(game.haveFun.list.firework.running) return;
					game.haveFun.list.firework.running=true;
					if(game.haveFun.fireworkLoop){
						game.haveFun.fireworkLoop();
					}
					else{
						// when animating on canvas, it is best to use requestAnimationFrame instead of setTimeout or setInterval
						// not supported in all browsers though and sometimes needs a prefix, so we need a shim
						var requestAnimFrame = ( function() {
							return window.requestAnimationFrame ||
										window.webkitRequestAnimationFrame ||
										window.mozRequestAnimationFrame ||
										function( callback ) {
											window.setTimeout( callback, 1000 / 60 );
										};
						})();

						// now we will setup our basic variables for the demo
						var canvas = document.createElement( 'canvas' ),
								ctx = canvas.getContext( '2d' ),
								// full screen dimensions
								cw = ui.window.offsetWidth,
								ch = ui.window.offsetHeight,
								// firework collection
								fireworks = [],
								// particle collection
								particles = [],
								// starting hue
								hue = 120,
								// when launching fireworks with a click, too many get launched at once without a limiter, one launch per 5 loop ticks
								limiterTotal = 5,
								limiterTick = 0,
								// this will time the auto launches of fireworks, one launch per 80 loop ticks
								timerTotal = 80,
								timerTick = 0,
								mousedown = false,
								// mouse x coordinate,
								mx,
								// mouse y coordinate
								my;

						// set canvas dimensions
						canvas.width = cw;
						canvas.height = ch;
						ui.window.appendChild(canvas);
						canvas.classList.add('fun');
						lib.onresize.push(function(){
							cw=ui.window.offsetWidth;
							ch=ui.window.offsetHeight;
							canvas.width = cw;
							canvas.height = ch;
						});

						// now we are going to setup our function placeholders for the entire demo

						// get a random number within a range
						var random=function( min, max ) {
							return Math.random() * ( max - min ) + min;
						}

						// calculate the distance between two points
						var calculateDistance=function( p1x, p1y, p2x, p2y ) {
							var xDistance = p1x - p2x,
									yDistance = p1y - p2y;
							return Math.sqrt( Math.pow( xDistance, 2 ) + Math.pow( yDistance, 2 ) );
						}

						// create firework
						var Firework=function( sx, sy, tx, ty ) {
							// actual coordinates
							this.x = sx;
							this.y = sy;
							// starting coordinates
							this.sx = sx;
							this.sy = sy;
							// target coordinates
							this.tx = tx;
							this.ty = ty;
							// distance from starting point to target
							this.distanceToTarget = calculateDistance( sx, sy, tx, ty );
							this.distanceTraveled = 0;
							// track the past coordinates of each firework to create a trail effect, increase the coordinate count to create more prominent trails
							this.coordinates = [];
							this.coordinateCount = 3;
							// populate initial coordinate collection with the current coordinates
							while( this.coordinateCount-- ) {
								this.coordinates.push( [ this.x, this.y ] );
							}
							this.angle = Math.atan2( ty - sy, tx - sx );
							this.speed = 2;
							this.acceleration = 1.05;
							this.brightness = random( 50, 70 );
							// circle target indicator radius
							this.targetRadius = 1;
						}

						// update firework
						Firework.prototype.update = function( index ) {
							// remove last item in coordinates array
							this.coordinates.pop();
							// add current coordinates to the start of the array
							this.coordinates.unshift( [ this.x, this.y ] );

							// cycle the circle target indicator radius
							if( this.targetRadius < 8 ) {
								this.targetRadius += 0.3;
							} else {
								this.targetRadius = 1;
							}

							// speed up the firework
							this.speed *= this.acceleration;

							// get the current velocities based on angle and speed
							var vx = Math.cos( this.angle ) * this.speed,
									vy = Math.sin( this.angle ) * this.speed;
							// how far will the firework have traveled with velocities applied?
							this.distanceTraveled = calculateDistance( this.sx, this.sy, this.x + vx, this.y + vy );

							// if the distance traveled, including velocities, is greater than the initial distance to the target, then the target has been reached
							if( this.distanceTraveled >= this.distanceToTarget ) {
								createParticles( this.tx, this.ty );
								// remove the firework, use the index passed into the update function to determine which to remove
								fireworks.splice( index, 1 );
							} else {
								// target not reached, keep traveling
								this.x += vx;
								this.y += vy;
							}
						}

						// draw firework
						Firework.prototype.draw = function() {
							ctx.beginPath();
							// move to the last tracked coordinate in the set, then draw a line to the current x and y
							ctx.moveTo( this.coordinates[ this.coordinates.length - 1][ 0 ], this.coordinates[ this.coordinates.length - 1][ 1 ] );
							ctx.lineTo( this.x, this.y );
							ctx.strokeStyle = 'hsl(' + hue + ', 100%, ' + this.brightness + '%)';
							ctx.stroke();

							ctx.beginPath();
							// draw the target for this firework with a pulsing circle
							ctx.arc( this.tx, this.ty, this.targetRadius, 0, Math.PI * 2 );
							ctx.stroke();
						}

						// create particle
						var Particle=function( x, y ) {
							this.x = x;
							this.y = y;
							// track the past coordinates of each particle to create a trail effect, increase the coordinate count to create more prominent trails
							this.coordinates = [];
							this.coordinateCount = 5;
							while( this.coordinateCount-- ) {
								this.coordinates.push( [ this.x, this.y ] );
							}
							// set a random angle in all possible directions, in radians
							this.angle = random( 0, Math.PI * 2 );
							this.speed = random( 1, 10 );
							// friction will slow the particle down
							this.friction = 0.95;
							// gravity will be applied and pull the particle down
							this.gravity = 1;
							// set the hue to a random number +-20 of the overall hue variable
							this.hue = random( hue - 20, hue + 20 );
							this.brightness = random( 50, 80 );
							this.alpha = 1;
							// set how fast the particle fades out
							this.decay = random( 0.015, 0.03 );
						}

						// update particle
						Particle.prototype.update = function( index ) {
							// remove last item in coordinates array
							this.coordinates.pop();
							// add current coordinates to the start of the array
							this.coordinates.unshift( [ this.x, this.y ] );
							// slow down the particle
							this.speed *= this.friction;
							// apply velocity
							this.x += Math.cos( this.angle ) * this.speed;
							this.y += Math.sin( this.angle ) * this.speed + this.gravity;
							// fade out the particle
							this.alpha -= this.decay;

							// remove the particle once the alpha is low enough, based on the passed in index
							if( this.alpha <= this.decay ) {
								particles.splice( index, 1 );
							}
						}

						// draw particle
						Particle.prototype.draw = function() {
							ctx. beginPath();
							// move to the last tracked coordinates in the set, then draw a line to the current x and y
							ctx.moveTo( this.coordinates[ this.coordinates.length - 1 ][ 0 ], this.coordinates[ this.coordinates.length - 1 ][ 1 ] );
							ctx.lineTo( this.x, this.y );
							ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
							ctx.stroke();
						}

						// create particle group/explosion
						var createParticles=function( x, y ) {
							// increase the particle count for a bigger explosion, beware of the canvas performance hit with the increased particles though
							var particleCount = 30;
							while( particleCount-- ) {
								particles.push( new Particle( x, y ) );
							}
						}

						// main demo loop
						var loop=function() {
							// if(lib.config.coin_free_playpackconfig&&!_status.imchoosing){
							// 	canvas.style.display='none';
							// }
							// else{
							// 	canvas.style.display='';
							// }
							// this function will run endlessly with requestAnimationFrame
							if(!game.haveFun.list.firework.running){
								canvas.width=cw;
								canvas.height=ch;
								return;
							}
							else{
								requestAnimFrame( loop );
							}

							// increase the hue to get different colored fireworks over time
							hue += 0.5;

							// normally, clearRect() would be used to clear the canvas
							// we want to create a trailing effect though
							// setting the composite operation to destination-out will allow us to clear the canvas at a specific opacity, rather than wiping it entirely
							ctx.globalCompositeOperation = 'destination-out';
							// decrease the alpha property to create more prominent trails
							ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
							ctx.fillRect( 0, 0, cw, ch );
							// change the composite operation back to our main mode
							// lighter creates bright highlight points as the fireworks and particles overlap each other
							ctx.globalCompositeOperation = 'lighter';

							// loop over each firework, draw it, update it
							var i = fireworks.length;
							while( i-- ) {
								fireworks[ i ].draw();
								fireworks[ i ].update( i );
							}

							// loop over each particle, draw it, update it
							var i = particles.length;
							while( i-- ) {
								particles[ i ].draw();
								particles[ i ].update( i );
							}

							// launch fireworks automatically to random coordinates, when the mouse isn't down
							if( timerTick >= timerTotal ) {
								if( !mousedown ) {
									// start the firework at the bottom middle of the screen, then set the random target coordinates, the random y coordinates will be set within the range of the top half of the screen
									fireworks.push( new Firework( cw / 2, ch, random( 0, cw ), random( 0, ch / 2 ) ) );
									timerTick = 0;
								}
							} else {
								timerTick++;
							}

							// limit the rate at which fireworks get launched when mouse is down
							if( limiterTick >= limiterTotal ) {
								if( mousedown ) {
									// start the firework at the bottom middle of the screen, then set the current mouse coordinates as the target
									fireworks.push( new Firework( cw / 2, ch, mx, my ) );
									limiterTick = 0;
								}
							} else {
								limiterTick++;
							}
						}


						if(lib.config.touchscreen){
							ui.window.addEventListener( 'touchmove', function( e ) {
								mx = e.touches[0].clientX/game.documentZoom - canvas.offsetLeft;
								my = e.touches[0].clientY/game.documentZoom - canvas.offsetTop;
							});
							ui.window.addEventListener( 'touchstart', function( e ) {
								mousedown = true;
							});
							ui.window.addEventListener( 'touchend', function( e ) {
								mousedown = false;
							});
						}
						else{
							// mouse event bindings
							// update the mouse coordinates on mousemove
							ui.window.addEventListener( 'mousemove', function( e ) {
								mx = e.pageX/game.documentZoom - canvas.offsetLeft;
								my = e.pageY/game.documentZoom - canvas.offsetTop;
							});

							// toggle mousedown state and prevent canvas from being selected
							ui.window.addEventListener( 'mousedown', function( e ) {
								e.preventDefault();
								mousedown = true;
							});

							ui.window.addEventListener( 'mouseup', function( e ) {
								e.preventDefault();
								mousedown = false;
							});
						}

						// once the window loads, we are ready for some fireworks!
						game.haveFun.fireworkLoop=loop;
						game.haveFun.fireworkStop=function(){
							game.haveFun.list.firework.running=false;
						},
						loop();
					}
				}
			}
		},
	};
});
