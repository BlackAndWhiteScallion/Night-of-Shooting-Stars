'use strict';
game.import('mode',function(lib,game,ui,get,ai,_status){
	return {
		name:'boss',
		start:function(){
			"step 0"
			var playback=localStorage.getItem(lib.configprefix+'playback');
			if(playback){
				ui.create.me();
				ui.arena.style.display='none';
				ui.system.style.display='none';
				_status.playback=playback;
				localStorage.removeItem(lib.configprefix+'playback');
				var store=lib.db.transaction(['video'],'readwrite').objectStore('video');
				store.get(parseInt(playback)).onsuccess=function(e){
					if(e.target.result){
						game.playVideoContent(e.target.result.video);
					}
					else{
						alert('播放失败：找不到录像');
						game.reload();
					}
				}
				event.finish();
				return;
			}
			for(var i in lib.characterPack.mode_boss){
				lib.character[i]=lib.characterPack.mode_boss[i];
				if(!lib.character[i][4]){
					lib.character[i][4]=[];
				}
			}
			for(var i in lib.cardPack.mode_boss){
				lib.card[i]=lib.cardPack.mode_boss[i];
			}
			for(var i in lib.skill){
				if(lib.skill[i].changeSeat){
					lib.skill[i]={};
					if(lib.translate[i+'_info']){
						lib.translate[i+'_info']='此模式下不可用';
					}
				}
			}
			if (_status.connectMode){
				event.current = {};
				event.current.name = lib.configOL.boss;
				event.goto(2);
			}
			lib.setPopped(ui.rules,function(){
				var uiintro=ui.create.dialog('hidden');
					uiintro.add('<div class="text left">选3个角色，挑战大魔王！<br>也可以作为大魔王揍3个角色。<br>最右边两个是另类挑战，建议尝试。</div>');
					uiintro.add('<div class="text left"><a href = "https://mp.weixin.qq.com/s/eEbCgLswPGXEhzl702FZzQ" target="_blank">了解更多的魔王</a></div>');
					uiintro.add(ui.create.div('.placeholder.slim'))
				return uiintro;
			},400);
			lib.translate.restart='返回';
			lib.init.css(lib.assetURL+'layout/mode','boss');
			game.delay(0.1);
			"step 1"
			var bosslist=ui.create.div('#bosslist.hidden');
			event.bosslist=bosslist;
			bosslist.ontouchmove = ui.click.touchScroll;
			bosslist.style.WebkitOverflowScrolling='touch';
			if(!lib.config.touchscreen&&lib.config.mousewheel){
				bosslist._scrollspeed=30;
				bosslist._scrollnum=10;
				bosslist.onmousewheel=ui.click.mousewheel;
			}
			var onpause=function(){
				ui.window.classList.add('bosspaused');
			}
			var onresume=function(){
				ui.window.classList.remove('bosspaused');
			}
			game.onpause=onpause;
			game.onpause2=onpause;
			game.onresume=onresume;
			game.onresume2=onresume;
			ui.create.div(bosslist);

			event.current=null;
			var list=[];
			for(var i in lib.character){
				var info=lib.character[i];
				if(info[4].contains('boss')){
					var player=ui.create.player(bosslist).init(i);
					if(lib.characterPack.mode_boss[i]&&get.config(i+'_boss_config')==false){
						player.style.display='none';
					}
					if(player.hp==0){
						player.node.hp.style.display='none';
					}
					player.node.lili.style.display='none';
					list.push(player);
					player.node.hp.classList.add('text');
					player.node.hp.dataset.condition='';
					player.node.hp.innerHTML=info[2];
					if(info[2]==Infinity){
						player.node.hp.innerHTML='∞';
					}
					player.setIdentity(player.name);
					player.node.identity.dataset.color=info[5];
					// bosslistlinks[cfg]=player;
					player.classList.add('bossplayer');

					if(lib.storage.current==i){
						event.current=player;
						player.classList.add('highlight');
					}

					// if(!get.config(cfg)){
					// 	player.style.display='none';
					// }
				}
			}
			if(!list.length){
				alert('没有可挑战的BOSS');
				event.finish();
				lib.init.onfree();
				_status.over=true;
				return;
			}
			if(!event.current){
				event.current=bosslist.childNodes[1];
				event.current.classList.add('highlight');
			}
			ui.create.div(bosslist);
			ui.control.style.transitionProperty='opacity';
			ui.control.classList.add('bosslist');
			setTimeout(function(){
				ui.control.style.transitionProperty='';
			},1000);

			ui.window.appendChild(bosslist);

			setTimeout(function(){
				if(event.current){
					var left=event.current.offsetLeft-(ui.window.offsetWidth-180)/2;
					if(bosslist.scrollLeft<left){
						bosslist.scrollLeft=left;
					}
				}
				bosslist.show();
			},200);
			game.me=ui.create.player();
			if(lib.config.continue_name_boss){
				event.noslide=true;
				lib.init.onfree();
			}
			else{
				game.chooseCharacter(function(target){
					if(event.current){
						event.current.classList.remove('highlight');
					}
					event.current=target;
					game.save('current',target.name);
					target.classList.add('highlight');
				});
			}
			if(lib.config.test_game){
				event.current.classList.remove('highlight');
				if(event.current.nextSibling&&event.current.nextSibling.classList.contains('player')){
					event.current=event.current.nextSibling;
				}
				else{
					event.current=event.current.parentNode.childNodes[1];
				}
				game.save('current',event.current.name);
			}
			"step 2"
			// 换掉牌堆里的冰域和令避
			ui.create.cardsAsync();
			game.finishCards();
			game.addGlobalSkill('autoswap');
			ui.arena.setNumber(8);
			var list=['bingyu', 'lingbi', 'caifang', 'reidaisai'];
			var map={
				bingyu:'shenlin',
				lingbi:'dianche',
				caifang:'tancheng',
				reidaisai:'reidaisai2',
			};
			for(var i=0;i<list.length;i++){
				if (!lib.card[list[i]].forbid) lib.card[list[i]].forbid = ['boss'];
				else lib.card[list[i]].forbid.push('boss');
				game.removeCard(list[i], map[list[i]]);
			}
			lib.skill['saiqian_skill3'].viewAs = {name:'reidaisai2'};
			game.bossinfo=lib.boss.global;
			for(var i in lib.boss[event.current.name]){
				game.bossinfo[i]=lib.boss[event.current.name][i];
			}
			delete lib.boss;

			setTimeout(function(){
				ui.control.classList.remove('bosslist');
			},500);
			var boss=ui.create.player();
			boss.getId();
			game.boss=boss;
			boss.init(event.current.name);
			boss.side=true;
			if (status.connectMode){
				event.current = boss;
				ui.window.appendChild(boss);
				ui.arena.appendChild(boss);
			}
			else if(!event.noslide){
				var rect=event.current.getBoundingClientRect();
				boss.animate('bossing');
				boss.node.hp.animate('start');
				boss.bossinginfo=[rect.left+rect.width/2,rect.top+rect.height/2];
				boss.style.transition='all 0s';
				boss.node.equips.style.opacity='0';
			}
			else{
				boss.animate('start');
			}
			boss.setIdentity('zhu');
			boss.identity='zhu';
			if(lib.config.continue_name_boss){
				result=lib.config.continue_name_boss;
				game.saveConfig('continue_name_boss');
			}
			//result.links = ['reimu', 'reimu', 'reimu'];
			for(var i=0;i<result.links.length;i++){
				var player=ui.create.player();
				player.getId();
				player.init(result.links[i]).animate('start');
				player.setIdentity('cai');
				player.identity='cai';
				player.side=false;
				game.players.push(player);
				if(result.boss){
					player.dataset.position=(i+1)*2;
				}
				else{
					player.dataset.position=i+1;
				}
				ui.arena.appendChild(player);
			}
			if(result.boss){
				game.players.unshift(boss);
				boss.dataset.position=0;
			}
			else{
				game.players.push(boss);
				boss.dataset.position=7;
			}
			ui.create.me();
			ui.fakeme=ui.create.div('.fakeme.avatar',ui.me);
			if(game.me!==boss){
				game.singleHandcard=true;
				ui.arena.classList.add('single-handcard');
				ui.window.classList.add('single-handcard');
				game.onSwapControl();

				if(lib.config.show_handcardbutton){
					lib.setPopped(ui.create.system('手牌',null,true),function(){
						var uiintro=ui.create.dialog('hidden');

						var players=game.players.concat(game.dead);
						for(var i=0;i<players.length;i++){
							if(players[i].side==game.me.side&&players[i]!=game.me){
								uiintro.add(get.translation(players[i]));
								var cards=players[i].getCards('h');
								if(cards.length){
									uiintro.addSmall(cards,true);
								}
								else{
									uiintro.add('（无）');
								}
							}
						}

						return uiintro;
					},220);
				}
			}
			else{
				ui.fakeme.style.display='none';
			}
			if(game.bossinfo.chongzheng){
				lib.setPopped(ui.create.system('重整',null,true),function(){
					var uiintro=ui.create.dialog('hidden');

					uiintro.add('重整');
					uiintro.add('');
					var table=ui.create.div('.bosschongzheng');

					var tr,td,added=false;
					for(var i=0;i<game.dead.length;i++){
						if(typeof game.dead[i].storage.boss_chongzheng!=='number') continue;
						added=true;
						tr=ui.create.div(table);
						td=ui.create.div(tr);
						td.innerHTML=get.translation(game.dead[i]);
						td=ui.create.div(tr);
						if(game.dead[i].maxHp>0){
							td.innerHTML='剩余'+(game.bossinfo.chongzheng-game.dead[i].storage.boss_chongzheng)+'回合';
						}
						else{
							td.innerHTML='无法重整'
						}
					}

					if(!added){
						uiintro.add('<div class="text center">（无重整角色）</div>');
						uiintro.add(ui.create.div('.placeholder.slim'))
					}
					else{
						uiintro.add(table);
					}

					return uiintro;
				},180);
			}
			ui.single_swap=ui.create.system('换人',function(){
				var players=get.players(game.me);
				players.remove(game.boss);
				if(players.length>1){
					if(ui.auto.classList.contains('hidden')){
						game.me.popup('请稍后换人');
						return;
					}
					if(_status.event.isMine()){
						ui.click.auto();
						setTimeout(function(){
							ui.click.auto();
						},500);
					}
					game.modeSwapPlayer(players[1]);
				}
			},true);
			if(get.config('single_control')||game.me==game.boss){
				ui.single_swap.style.display='none';
			}

			ui.arena.appendChild(boss);
			if(boss.bossinginfo){
				var rect=boss.getBoundingClientRect();
				boss.style.transform='translate('+(boss.bossinginfo[0]-rect.left-rect.width/2)+'px,'+(boss.bossinginfo[1]-rect.top-rect.height/2)+'px) scale(1.1)';
				ui.refresh(boss);
				boss.style.transition='';
				boss.style.transform='';
				delete boss.bossinginfo;
				setTimeout(function(){
					boss.node.equips.style.opacity='';
				},500);
			}

			lib.setPopped(ui.rules,function(){
				var uiintro=ui.create.dialog('hidden');
					uiintro.add('<div class="text left"></div>');
				if (game.bossinfo.loopType == 2){
					uiintro.add('<div class="text left">回合顺序：魔王→勇者→魔王</div>');
					if (get.config('free_turn')){
						uiintro.add('<div class="text left">进行回合的勇者由你选择</div>');
					}
				} else {
					uiintro.add('<div class="text left">回合顺序：魔王→勇者→勇者→勇者→魔王</div>');
				}
				if (game.bossinfo.chongzheng !== false){
					uiintro.add('<div class="text left">勇者坠机后进入重整状态<br>重整需要'+game.bossinfo.chongzheng+'个回合');
				} else {
					uiintro.add('<div class="text left">这个魔王不可以重整！');
				}
				uiintro.add(ui.create.div('.placeholder.slim'))
				return uiintro;
			},400);
			event.bosslist.delete();

			game.arrangePlayers();
			for(var i=0;i<game.players.length;i++){
				game.players[i].node.action.innerHTML='玩家';
			}

			var players=get.players(lib.sort.position);
			var info=[];
			for(var i=0;i<players.length;i++){
				info.push({
					name:players[i].name,
					identity:players[i].identity,
					position:players[i].dataset.position
				});
			}
			_status.videoInited=true,
			info.boss=(game.me==game.boss);
			game.addVideo('init',null,info);
			if(game.bossinfo.init){
				game.bossinfo.init();
			}
			"step 3"
			if(get.config('single_control')){
				for(var i=0;i<game.players.length;i++){
					if(game.players[i].side==game.me.side){
						game.addRecentCharacter(game.players[i].name);
					}
				}
			}
			else{
				game.addRecentCharacter(game.me.name);
			}
			event.trigger('gameStart');
			game.gameDraw(game.boss,game.bossinfo.gameDraw||4);
			game.bossPhaseLoop();
			setTimeout(function(){
				ui.updatehl();
			},200);
		},
		element:{
			player:{
				dieAfter:function(){
					if(this!=game.boss){
						this.storage.boss_chongzheng=0;
						if(!this.node.dieidentity && game.bossinfo.chongzheng){
							this.storage.boss_chongzheng = game.bossinfo.chongzheng;
							var node=ui.create.div('.damage.dieidentity',this.storage.boss_chongzheng.toString(),this);
							ui.refresh(node);
							node.style.opacity=1;
							this.node.dieidentity=node;
							var trans=this.style.transform;
							if(trans){
								if(trans.indexOf('rotateY')!=-1){
									this.node.dieidentity.style.transform='rotateY(180deg)';
								}
								else if(trans.indexOf('rotateX')!=-1){
									this.node.dieidentity.style.transform='rotateX(180deg)';
								}
								else{
									this.node.dieidentity.style.transform='';
								}
							}
							else{
								this.node.dieidentity.style.transform='';
							}
						}
					}
					if(game.bossinfo.checkResult&&game.bossinfo.checkResult(this)===false){
						return;
					}
					if(this==game.boss||!game.hasPlayer(function(current){
						return !current.side;
					})){
						game.checkResult();
					}
				},
			}
		},
		card:{
			dianche:{
				audio:true,
				fullskin:true,
				type:'jinji',
				enable:true,
				modeimage:'boss',
				selectTarget:1,
				filterTarget:function(card,player,target){
					return player != target;
				},	
				contentBefore:function(){
					player.$skill('废线电车',null,null,true);
				},
				content:function(){
					'step 0'
					target.chooseControl(['弃置三张牌','你与'+get.translation(player)+'以外角色各弃置两张牌'],function(event,player){
							if (target.identity == 'zhu') return '你与'+get.translation(player)+'以外角色各弃置两张牌';
							else{
								if (player.countCards('hej') < 3) return '弃置三张牌';
								else return '你与'+get.translation(player)+'以外角色各弃置两张牌';
							}
							return '弃置三张牌';
						});
					'step 1'
					if(result.control){
						if(result.control=='弃置三张牌'){
							target.chooseToDiscard(3, true);
						} else {
							var players = game.filterPlayer();
							for (var i = 0; i < players.length; i ++){
								if (players[i] == player || players[i] == target) continue;
								players[i].chooseToDiscard(2, true);
							}
						}
					}
				},
				ai:{
					basic:{
						order:5,
						useful:5,
						value:5,
					},
					result:{
						target:function(player,target){
							if (game.countPlayer(function(current){
								if (get.attitude(target, current) >= 0 && target != current) return 1;
								return 0;
							})) return -3;
							return 2;
						},
					},
					tag:{
						loseCard:1.5,
					}
				}
			},
			shenlin:{
				audio:true,
				fullskin:true,
				type:'jinji',
				enable:true,
				modeimage:'boss',
				selectTarget:1,
				filterTarget:function(card,player,target){
					return game.dead.contains(target);
				},	
				contentBefore:function(){
					player.$skill('神灵复苏',null,null,true);
					targets[0].lili = 1;
					targets[0].revive(1);
				},
				content:function(){
					'step 0'
					targets[0].discard(targets[0].getCards('h'));
					targets[0].draw();
				},
				ai:{
					die:true,
					basic:{
						order:5,
						useful:5,
						value:5,
					},
					result:{
						target:function(player,target){
							if (game.countPlayer(function(current){
								if (get.attitude(target, current) >= 0 && target != current) return 1;
								return 0;
							})) return -3;
							return 2;
						},
					},
					tag:{
						loseCard:1.5,
					}
				}
			},
			tancheng:{
				audio:true,
				fullskin:true,
				type:'trick',
				subtype:'disrupt',
				enable:true,
				modeimage:'boss',
				selectTarget:-1,
				filterTarget:function(card,player,target){
					return target != player;
				},
				content:function(){
					'step 0'
					target.showCards(target.get('h'));
					'step 1'
					player.chooseCard('你可以用一张牌交换'+get.translation(target)+'一张不同类型的牌', 1, function(card){
						return target.countCards('h') > target.countCards('h', {type: get.type(card)})
					}).ai=function(card){
						var val=get.value(card);
						if(val<0) return 10;
						return -val;
					};
					"step 2"
					if(result.bool){
						event.card = result.cards[0];
						target.gain(result.cards);
					}
					else{
						event.finish();
					}
					"step 3"
					player.chooseCardButton(target.get('h'),'获得一张牌',1,true).set('filterButton',function(button){
						return get.type(button.link) != get.type(event.card);
					}).ai=function(button){
						var val=get.value(button.link);
						if(val<0) return -10;
						return val;
					}
					if(player==game.me&&!event.isMine()){
						game.delay(0.5);
					}
					"step 4"
					player.gain(result.links);
				},
				ai:{
					wuxie:function(target,card,player,viewer){
						if (game.countPlayer(function(current){
							return ai.get.attitude(viewer,current)<=0;
						}) == 1){
							return 0;
						};
						if (ai.get.attitude(viewer,target)<=0 && target.countCards('e',function(card){
							return get.bonus(card) > 0;	
						})){
							if(Math.random()<0.5) return 0;
							return 1;
						}
						return 0; 
					},
					basic:{
						order:5,
						useful:1,
						value:1,
					},
					result:{
						target:function(player,target){
							return -0.5;
						},
						player:function(player, target){
							return 1;
						},
					},
					tag:{
						multitarget:1
					}
				}
			},
			reidaisai2:{
				audio:true,
				fullskin:true,
				type:'trick',
				subtype:'support',
				enable:true,
				modeimage:'boss',
				selectTarget:[1, Infinity],
				filterTarget:function(card,player,target){
					return target.identity != player.identity;
				},
				contentBefore:function(){
					if (player.name == 'sanae'){
						player.say('守矢神社例大祭开始啦！我们可比那个穷酸的神社好玩多了！');
					}
				},
				content:function(){
					'step 0'
					target.draw();
				},
				contentAfter:function(){
					'step 0'
					player.draw(targets.length + 1);
					'step 1'
					player.chooseCardTarget({
						selectCard:[1,Infinity],
						position:'hej',
						filterTarget:function(card,player,target){
							return player != target;
						},
						ai1:function(card){
							/*
							var player=_status.event.player;
							var check=_status.event.check;
							if(check<1) return 0;
							if(player.hp>1&&check<2) return 0;
							*/
							if (player.countCards('e',function(card){
								return get.bonus(card) > 0;	
							})){
								return get.bonus(card) > 0;
							}
							return get.unuseful(card)+9;
						},
						ai2:function(target){
							return ai.get.attitude(_status.event.player,target);
						},
						prompt:'你可以分出去任意张牌（点取消停止给牌）'
					});
					'step 2'
					if(result.targets&&result.targets[0]){
						result.targets[0].gain(result.cards);
						player.$give(result.cards.length,result.targets[0]);
						event.goto(1);
					}
				},
				ai:{
					wuxie:function(target,card,player,viewer){
						if (game.countPlayer(function(current){
							return ai.get.attitude(viewer,current)<=0;
						}) == 1){
							return 0;
						};
						if (ai.get.attitude(viewer,target)<=0 && target.countCards('e',function(card){
							return get.bonus(card) > 0;	
						})){
							if(Math.random()<0.5) return 0;
							return 1;
						}
						return 0; 
					},
					basic:{
						order:5,
						useful:1,
						value:1,
					},
					result:{
						target:function(player,target){
							return 1;
						},
						player:function(player,target){
							return 2;
						},
					},
					tag:{
						multitarget:1
					}
				}
			},
		},
		characterPack:{
			mode_boss:{
				boss_cirno:['female', '0', 9, ['jidong', 'bianshen_cirno'], ['boss'], 'wei','9'],
				boss_cirno2:['female', '0', 4, ['jiqiang','zuanshi','jubing'], ['hiddenboss'], 'wei', '9'],
				boss_reimu:['female','0',8,['lingji','bianshen_reimu'],['boss'], 'shu'],
				boss_reimu2:['female','0',4,['lingji','mengxiangtiansheng'],['hiddenboss'], 'shu'],
				boss_zhaoyun:['male','0',1,['boss_juejing','longhun'],['shu','boss','bossallowed'],'shen'],
				boss_nianshou:['male','0',10000,['boss_nianrui','boss_qixiang','skipfirst','boss_damagecount'],['boss'],'shu','10000'],
				//boss_saitama:['male','0',Infinity,['punch','serious','skipfirst','boss_turncount'],['boss'],'shen','1'],
				boss_saitama:['male','0',Infinity,['punch','skipfirst','boss_turncount'],['boss'],'shen'],
			},
		},
		characterIntro:{
			boss_reimu:'啊，真是一个好天气啊……如果今天能有赛钱的话就更好了……咦，我赛钱箱呢？<br>画师：萩原',
			boss_reimu2:'不要在灵梦面前提钱，不要动灵梦的赛钱箱，不要对博丽神社做任何事情。<br>——来自造成了目前整个事态的某个魔法师的灵梦三戒律<br>画师：Ran',
			boss_cirno:'要我说几遍啊，我不是什么⑨！我是幻想乡最强的！<br>画师：原悠衣',
			boss_cirno2:'虽然成功的获得了超越常人的力量，但是这力量对于超越常人的家伙们来说……还是⑨级别的。<br>画师：しがらき',
			boss_nianshou:'比起加一堆没人想要的大杂烩设定，把本来欢乐的活动变成一个累死人的掀桌活动，还是回到最开始的简单欢乐日子好。',
			boss_zhaoyun:'幻想乡是一切皆有可能的地方。<br>即使是那个只存在于传说中的男人……！',
			boss_saitama:'买菜时因走错路偶然路过幻想乡的光头<br>………等等，什么？<br>画师：',
		},
		cardPack:{
			mode_boss:['dianche', 'shenlin', 'reidaisai2', 'tancheng'],
		},
		init:function(){
			for(var i in lib.characterPack.mode_boss){
				if(lib.characterPack.mode_boss[i][4].contains('hiddenboss')) continue;
				lib.mode.boss.config[i+'_boss_config']={
					name:get.translation(i),
					init:true,
					unfrequent:true,
				}
			}
		},
		game:{
			reserveDead:true,
			addBossFellow:function(position,name){
				var fellow=game.addFellow(position,name,'zoominanim');
				fellow.directgain(get.cards(4));
				fellow.side=true;
				fellow.identity='zhong';
				fellow.setIdentity('zhong');
				game.addVideo('setIdentity',fellow,'zhong');
			},
			addRecord:function(bool){
				if(typeof bool=='boolean'){
					if (!lib.config.gameRecord.boss) lib.config.gameRecord["boss"] = {data:{}};
					var data=lib.config.gameRecord.boss.data;
					var identity=game.me.identity;
					var name = game.boss.name;
					var boss = game.boss;
					if(!data[name]){
						if (boss.hasSkill('boss_damagecount') || boss.hasSkill('boss_turncount')){
							data[name] = [0];
						} else {
							data[name]=[0,0,0,0];
						}
					}
					if (boss.hasSkill('boss_damagecount') && _status.damageCount > data[name][0]){
						data[name][0] = _status.damageCount;
					} else if (boss.hasSkill('boss_turncount') && game.roundNumber) {
						data[name][0] = game.roundNumber;
					} else {
						if(bool){
							if (identity == 'cai'){
								data[name][2]++;
							} else {
								data[name][0]++;
							}
						}
						else{
							if (identity == 'cai'){
								data[name][3]++;
							} else {
								data[name][1]++;
							}
						}
					}
					var list = [];
					for(var i in lib.character){
						var info=lib.character[i];
						if(info[4].contains('boss') || info[4].contains('hiddenboss')){ 
							list.push(i);
						}
					}
					var str='';
					for(var i=0;i<list.length;i++){
						if(data[list[i]]){
							if (lib.character[list[i]][3].contains('boss_damagecount')){
								str+= lib.translate[list[i]] + ': <br> 最高伤害：'+ data[list[i]][0] + '<br>';
							} else if (lib.character[list[i]][3].contains('boss_turncount')){
								str+= lib.translate[list[i]] + ': <br> 最大轮次数：'+ data[list[i]][0] + '<br>';
							} else {
								str+=lib.translate[list[i]] + ': <br> 魔王：'+data[list[i]][0]+'胜 '+data[list[i]][1]+'负<br> 勇者：'+data[list[i]][2]+'胜  '+data[list[i]][3]+'负 <br>';
							}
						}
					}
					lib.config.gameRecord.boss.str=str;
					game.saveConfig('gameRecord',lib.config.gameRecord);
				}
			},
			changeBoss:function(name,player){
				if(!player){
					if(game.additionaldead){
						game.additionaldead.push(game.boss);
					}
					else{
						game.additionaldead=[game.boss];
					}
					player=game.boss;
					delete game.boss;
				}

				player.delete();
				game.players.remove(player);
				game.dead.remove(player);
				var boss=ui.create.player();
				boss.getId();
				boss.init(name);
				boss.side=true;
				game.addVideo('bossSwap',player,(game.boss?'_':'')+boss.name);
				boss.dataset.position=player.dataset.position;
				if(game.me==player){
					game.swapControl(boss);
				}
				game.players.push(boss.animate('zoominanim'));
				game.arrangePlayers();
				if(!game.boss){
					game.boss=boss;
					boss.setIdentity('zhu');
					boss.identity='zhu';
				}
				else{
					boss.setIdentity('zhong');
					boss.identity='zhong';
				}
				ui.arena.appendChild(boss);
				boss.directgain(get.cards(4));
			},
			checkResult:function(){
				if(game.boss==game.me){
					game.over(game.boss.isAlive());
				}
				else{
					game.over(!game.boss.isAlive());
				}
			},
			getVideoName:function(){
				var str=get.translation(game.me.name);
				if(game.me.name2){
					str+='/'+get.translation(game.me.name2);
				}
				var str2='挑战';
				if(game.me!=game.boss){
					str2+=' - '+get.translation(game.boss);
				}
				var name=[str,str2];
				return name;
			},
			// 这里是回合顺序的地方
			bossPhaseLoop:function(){
				// 创建回合顺序，默认player为boss
				// player指的就是当前回合角色了。
				var next=game.createEvent('phaseLoop');
				next.player=game.boss;
				_status.looped=true;
				next.setContent(function(){
					"step 0"
					if (result.bool) result.bool = false;
					// 如果player重整，退出重整
					// 这个重整的只有下面用，简单来说，轮到boss的回合了，boss头上的chongzheng是false
					// 1->1的情况下，一名角色重整流程后，会把boss头上的chongzheng变成true
					// 换句话来说，使用这个chongzheng可以检测本轮是否重整过了。
					if(player.chongzheng){
						player.chongzheng=false;
					}
					// 如果玩家不是重整（而是死亡）
					// player.storage.boss_chongzheng就是重整回合的计数了
					else if(game.dead.length && player == game.boss){
						// 计数+1，血量补到0，如果血上限大于0，且这个BOSS让重整的话，开始重整
						var players = game.dead;
						for (var i = 0; i < players.length; i ++){
							if(players[i].hp<0) players[i].hp=0;
							if(players[i].maxHp>0&&game.bossinfo.chongzheng){
								// 重整顺序：回血，摸牌
								players[i].storage.boss_chongzheng--;
								game.log(players[i],'还有'+players[i].storage.boss_chongzheng+'回合回归');
								players[i].node.dieidentity.innerHTML=players[i].storage.boss_chongzheng.toString();
								if(players[i].hp<players[i].maxHp){
									players[i].hp++;
								}
								else{
									var card=get.cards()[0];
									var sort=lib.config.sort_card(card);
									var position=sort>0?players[i].node.handcards1:players[i].node.handcards2;
									card.fix();
									card.animate('start');
									position.insertBefore(card,position.firstChild);
								}
								players[i].node.hp.show();
								players[i].node.count.show();
								players[i].update();
								if(players[i].storage.boss_chongzheng<=0){
									players[i].revive(players[i].hp);
								}
							}
						}
					}
					else{
						// 如果player是主（boss）并且boss不是player，把player改成boss
						// 不太懂怎么用，什么情况会触发这个条件？
						if(player.identity=='zhu'&&game.boss!=player){
							player=game.boss;
						}
						// 不在重整状态的玩家进行一个回合
						// 在这里加入让玩家选顺序应该就可以
						if (get.config('free_turn') && player != game.boss && game.me != game.boss && player.isAlive() && game.bossinfo.loopType==2){
							game.me.chooseTarget('选择下一名进行回合的我方角色',function(card,player,target){
                              return target.identity == 'cai';
                              }).set('ai',function(target){
                                    return get.attitude(game.me,target);
                              });
						}
					}
					"step 1"
					//console.log(player);
					if (result.bool){
						//console.log(result.targets[0]);
						result.targets[0].phase();
					} else {
						player.phase();
					}
					"step 2"
					// step 1就已经是回合结束后了，进入下一个回合了。
					// 如果当前为1→1
					if(game.bossinfo.loopType==2){
						// 轮次开始（？）
						_status.roundStart=true;
						// 如果当前回合角色是boss
						if(event.player==game.boss){
							if(!_status.last||_status.last.nextSeat==game.boss){
								event.player=game.boss.nextSeat;
							}
							else{
								event.player=_status.last.nextSeat;
							}
						}
						else{
							// 如果当前玩家已死亡（BOSS死亡会自动游戏结束，所以只检测盟军方），改为进入下一个盟军的回合。
							if (player.isDead()){
								event.player = player.nextSeat;
								if (player.nextSeat == game.boss) event.player = game.boss.nextSeat;
							} else {
								_status.last=player;
								event.player=game.boss;
								if(player.nextSeat==game.boss){
									delete _status.roundStart;
								}
							}
						}
					}
					// 如果是3->1就进入下一个座位的角色的回合
					else{
						event.player=event.player.nextSeat;
					}
					// 进入下一个回合
					event.goto(0);
				});
			},
			onSwapControl:function(){
				//if(game.me==game.boss) return;
				game.addVideo('onSwapControl');
				var name=game.me.name;
				if(ui.fakeme&&ui.fakeme.current!=name){
					ui.fakeme.current=name;
					if(ui.versushighlight&&ui.versushighlight!=game.me){
						ui.versushighlight.classList.remove('current_action');
					}
					ui.versushighlight=game.me;
					game.me.classList.add('current_action');
					// game.me.line(ui.fakeme,{opacity:0.5,dashed:true});

					ui.fakeme.style.backgroundImage=game.me.node.avatar.style.backgroundImage;
					// ui.fakeme.style.backgroundSize='cover';
				}
				ui.updatehl();
			},
			modeSwapPlayer:function(player){
				var bool=(game.me==game.boss||player==game.boss);
				game.swapControl(player);
				game.onSwapControl();
				if(!bool) return;
				if(game.me==game.boss){
					game.singleHandcard=false;
					ui.arena.classList.remove('single-handcard');
					ui.window.classList.remove('single-handcard');
					ui.fakeme.style.display='none';
					game.me.dataset.position=0;
					game.me.nextSeat.dataset.position=2;
					game.me.nextSeat.nextSeat.dataset.position=4;
					game.me.nextSeat.nextSeat.nextSeat.dataset.position=6;
				}
				else{
					game.singleHandcard=true;
					ui.arena.classList.add('single-handcard');
					ui.window.classList.add('single-handcard');
					ui.fakeme.style.display='';
					game.boss.dataset.position=7;
					game.boss.nextSeat.dataset.position=1;
					game.boss.nextSeat.nextSeat.dataset.position=2;
					game.boss.nextSeat.nextSeat.nextSeat.dataset.position=3;
					if(game.me&&game.me.node.handcards2.childNodes.length){
						while(game.me.node.handcards2.childNodes.length){
							game.me.node.handcards1.appendChild(game.me.node.handcards2.firstChild);
						}
					}
				}
			},
			chooseCharacter:function(func){
				var next=game.createEvent('chooseCharacter',false);
				next.showConfig=true;
				next.customreplacetarget=func;
				next.ai=function(player,list){
					if(get.config('double_character')){
						player.init(list[0],list[1]);
					}
					else{
						player.init(list[0]);
					}
				}
				next.setContent(function(){
					"step 0"
					var i;
					var list=[];
					event.list=list;
					for(i in lib.character){
						if(lib.character[i][4].contains('minskin')) continue;
						if(lib.character[i][4].contains('boss')) continue;
						if(lib.character[i][4].contains('hiddenboss')) continue;
						if(lib.character[i][4]&&lib.character[i][4].contains('forbidai')) continue;
						if(lib.config.forbidboss.contains(i)) continue;
						if(lib.filter.characterDisabled(i)) continue;
						list.push(i);
					}
					list.randomSort();
					var dialog=ui.create.dialog('选择3名参战角色','hidden');
					dialog.classList.add('fixed');
					ui.window.appendChild(dialog);
					dialog.classList.add('bosscharacter');
					dialog.classList.add('withbg');
					// dialog.add('0/3');
					dialog.add([list.slice(0,20),'character']);
					dialog.noopen=true;
					var next=game.me.chooseButton(dialog,true).set('onfree',true);
					next._triggered=null;
					next.custom.replace.target=event.customreplacetarget;
					next.selectButton=[3,3];
					// next.custom.add.button=function(){
					// 	if(ui.cheat2&&ui.cheat2.backup) return;
					// 	_status.event.dialog.content.childNodes[1].innerHTML=
					// 	ui.selected.buttons.length+'/3';
					// };
					event.changeDialog=function(){
						if(ui.cheat2&&ui.cheat2.dialog==_status.event.dialog){
							return;
						}
						if(game.changeCoin){
							game.changeCoin(-3);
						}
						list.randomSort();

						var buttons=ui.create.div('.buttons');
						var node=_status.event.dialog.buttons[0].parentNode;
						_status.event.dialog.buttons=ui.create.buttons(list.slice(0,20),'character',buttons);
						_status.event.dialog.content.insertBefore(buttons,node);
						buttons.animate('start');
						node.remove();

						game.uncheck();
						game.check();
					};
					ui.create.cheat=function(){
						_status.createControl=ui.cheat2||event.asboss;
						ui.cheat=ui.create.control('更换',event.changeDialog);
						delete _status.createControl;
					};
					var createCharacterDialog=function(){
						event.dialogxx=ui.create.characterDialog();
						event.dialogxx.classList.add('bosscharacter');
						event.dialogxx.classList.add('withbg');
						event.dialogxx.classList.add('fixed');
						if(ui.cheat2){
							ui.cheat2.animate('controlpressdownx',500);
							ui.cheat2.classList.remove('disabled');
						}
					};
					if(lib.onfree){
						lib.onfree.push(createCharacterDialog);
					}
					else{
						createCharacterDialog();
					}
					ui.create.cheat2=function(){
						_status.createControl=event.asboss;
						ui.cheat2=ui.create.control('自由选将',function(){
							if(this.dialog==_status.event.dialog){
								if(game.changeCoin){
									game.changeCoin(50);
								}
								this.dialog.close();
								_status.event.dialog=this.backup;
								ui.window.appendChild(this.backup);
								delete this.backup;
								game.uncheck();
								game.check();
								if(ui.cheat){
                                    ui.cheat.animate('controlpressdownx',500);
									ui.cheat.classList.remove('disabled');
								}
							}
							else{
								if(game.changeCoin){
									game.changeCoin(-10);
								}
								this.backup=_status.event.dialog;
								_status.event.dialog.close();
								_status.event.dialog=_status.event.parent.dialogxx;
								this.dialog=_status.event.dialog;
								ui.window.appendChild(this.dialog);
								game.uncheck();
								game.check();
								if(ui.cheat){
									ui.cheat.classList.add('disabled');
								}
							}
						});
						if(lib.onfree){
							ui.cheat2.classList.add('disabled');
						}
						delete _status.createControl;
					}
					if(!ui.cheat&&get.config('change_choice'))
					ui.create.cheat();
					if(!ui.cheat2&&get.config('free_choose'))
					ui.create.cheat2();

					event.asboss=ui.create.control('我要当魔王！',function(){
						event.boss=true;
						event.enemy=[];
						for(var i=0;i<ui.selected.buttons.length;i++){
							event.enemy.push(ui.selected.buttons[i].link);
							event.list.remove(ui.selected.buttons[i].link);
						}
						while(event.enemy.length<3){
							event.enemy.push(event.list.randomRemove());
						}
						game.uncheck();
						if(ui.confirm){
							ui.confirm.close();
						}
						game.resume();
					});
					"step 1"
					if(ui.cheat){
						ui.cheat.close();
						delete ui.cheat;
					}
					if(ui.cheat2){
						ui.cheat2.close();
						delete ui.cheat2;
					}
					event.asboss.close();
					if(event.boss){
						event.result={
							boss:true,
							links:event.enemy
						};
					}
					else{
						event.result={
							boss:false,
							links:result.links
						};
						_status.coinCoeff=get.coinCoeff(result.links);
					}
				});
				return next;
			},
		},
		boss:{
			boss_cirno:{
				loopType:2,
				gameDraw:function(player){
					return player==game.boss?9:4;
				}
			},
			boss_cirno2:{
				loopType:1,
			},
			boss_reimu:{
				loopType:2,
				gameDraw:function(player){
					return player==game.boss?8:4;
				},
			},
			boss_reimu2:{
				loopType:1,
			},
			boss_nianshou:{
				loopType:1,
				chongzheng:0,
				init:function(){
					game.boss.node.action.classList.add('freecolor');
					game.boss.node.action.style.opacity=1;
					game.boss.node.action.style.letterSpacing='4px';
					game.boss.node.action.style.marginRight=0;
					game.boss.node.action.style.fontFamily='huangcao';
					game.boss.node.action.innerHTML='';
					_status.additionalReward=function(){
						return Math.round(Math.pow(_status.damageCount,2.4))*2;
					}
					var time=360;
					var interval=setInterval(function(){
						if(_status.over){
							clearInterval(interval);
							return;
						}
						var sec=time%60;
						if(sec<10){
							sec='0'+sec;
						}
						game.boss.node.action.innerHTML=Math.floor(time/60)+':'+sec;
						if(time<=0){
							delete _status.additionalReward;
							if(typeof _status.coin=='number'){
								if(game.me==game.boss){
									_status.coin+=Math.round(Math.pow(_status.damageCount,2.4));
								}
								else{
									_status.coin+=Math.round(Math.pow(_status.damageCount,1.8));
								}
							}
							game.forceOver(true);
							clearInterval(interval);
						}
						time--;
					},1000);
					_status.damageCount=0;
					ui.damageCount=ui.create.system('伤害: 0',null,true);
					lib.setPopped(ui.rules,function(){
						var uiintro=ui.create.dialog('hidden');
							uiintro.add('<div class="text left">[选项→游戏]里可以提高游戏速度<br>关掉[回合顺序自选]和[单人控制]也可以显著提升游戏速度<br>不要想了，快点打上去！<br>勇者坠机后进入重整状态<br>重整需要0个回合</div>');
							uiintro.add(ui.create.div('.placeholder.slim'))
						return uiintro;
					},400);
					game.boss.say('嗷呜~~~~');
				}
			},
			boss_patchy1:{
				loopType:2,
				gameDraw:function(player){
					return player==game.boss?8:4;
				},
				init:function(){
					game.loadModeAsync('stg',function(mode){
						for(var i in mode.translate){
							lib.translate[i]=lib.translate[i]||mode.translate[i];
							//lib.translate[i]=mode.translate[i];
						}
						for(var i in mode.skill){
							if(lib.skill[i]) console.log(i);
							//console.log(i);
							lib.skill[i]=mode.skill[i];
							game.finishSkill(i);
						}
						if(get.mode()!='stg'){
							lib.skill['juguang'].forced = false;
						}
						for(var i in mode.card){
							if(lib.card[i]) console.log(i);
							//console.log(i);
							lib.card[i]=mode.card[i];
							game.finishCards();
						}
					});
				}
			},
			boss_patchy2:{
				loopType:1,
			},
			boss_zhaoyun:{
				loopType:1,
				init:function(){
					//lib.backgroundmusicURL = ui.backgroundMusic.src;
					game.playBackgroundMusic('boss');
				},
			},
			boss_saitama:{
				loopType:2,
				chongzheng:false,
				init:function(){
                    if (ui.cardPileNumber.style.display=='none'){
						ui.cardPileNumber.style.display='initial';
					}
					ui.cardPileNumber.style.color='red';
					game.boss.say('？<br>我走哪儿来了？');
					ui.backgroundMusic.src = '';
					lib.config.background_music = '';
					lib.setPopped(ui.rules,function(){
						var uiintro=ui.create.dialog('hidden');
							uiintro.add('<div class="text left">[选项→魔王]里可以打开单人控制<br>光头在回合外不会使用牌<br>不要放弃治疗啊！<br>这个魔王不可以重整</div>');
							uiintro.add(ui.create.div('.placeholder.slim'))
						return uiintro;
					},400);
				},
				gameDraw:function(player){
					return player==game.boss?4:4;
				},
			},
			global:{
				loopType:2,
				chongzheng:5,
			},
		},
		skill:{
			_dianche:{
				enable:'phaseUse',
				filter:function(event,player){
					return player.countCards('h', {name:'dianche'}) && player.countCards('hej') > 1;  
				},
				selectCard:2,
				discard:false,
				line:true,
				position:'hej',
				selectTarget:1,
				prepare:function(cards,player,targets){
					player.$give(cards.length,targets[0]);
				},
				filterTarget:function(card,player,target){
					return target != player;
				},
				filterCard:function(card,player){
					if(ui.selected.cards.length){
						if (ui.selected.cards[0].name == 'dianche') return true;
						return card.name == 'dianche';
					} else{
						return true;
					}
					return false;
				},
				content:function(){
					target.gain(cards);
				},
				complexCard:true,
				prompt:'你可以将废线电车和一张牌交给一名其他角色。',
				ai:{
					expose:0.3,
					order:1,
					result:{
						target:function(player,target){
							if (target.countCards('h') <= target.getHandcardLimit()) return 1;
							else return 0.5;
						},
						player:function(player,target){
							if (player.countCards('h') > player.getHandcardLimit()) return 0;
							else return -0.5;
						}
					}
				}
			},
			_shenlin_use:{
				onChooseToUse:function(event){
					if (!game.dead || game.dead.length == 0) return ;
					if (event.player.countCards('h', {name:'shenlin'}) || event.player.hasSkill('kedan') && game.players.length < 4){
						game.players.addArray(game.dead);
					} else if (game.countPlayer(function(current){
						return game.dead.contains(current);
					})){
						game.players.remove(game.dead);
					}
				},
			},
			_shenlin:{
				trigger:{player:'damageAfter'},
				filter:function(event,player){
					return player.countCards('h', {name:'shenlin'});
				},
				content:function(){
					var cards = player.getCards('h');
					for (var i = 0; i <= cards.length; i ++){
						if(cards[i]&&cards[i].name == 'shenlin'){
							player.discard(cards[i]);
							break;
						}
					}
					player.addTempSkill('mianyi');		
				},
			},
			lingji:{
    			audio:2,
    			trigger:{player:'damageAfter',source:'damageAfter'},
				group:['saiqian_use','saiqian_die'],
    			forced:true,
    			filter:function(event,player){
    				return event.nature != 'thunder';
    			},
    			content:function(){
    				"step 0"
    				player.judge(function(card){
						return get.color(card)=='red'?1:-1;
    				});;
    				"step 1"
    				if(result.bool){
    					player.gainlili();
    				}
    				else{
    					player.gain(result.card, 'draw2');
    				}
    			}
    		},
			saiqian_use:{
				direct:true,
				trigger:{global:'useCard'},
				filter:function(event, player){
					return event.player != player && event.card.name == 'saiqianxiang';
				},
				content:function(){
					player.say('我的赛钱箱！你要是敢对它做什么奇怪的事情……');
				}
			},
			saiqian_die:{
				direct:true,
				trigger:{global:'loseEnd'},
				filter:function(event,player){
					if (event.player == player) return false;
					for (var i = 0; i < event.cards.length; i ++){
						if (event.cards[i].name == 'saiqianxiang' && get.position(event.cards[i])=='d') return true;
					}
					return false;
				},
				content:function(){
					game.pause();
					player.say('啊啊啊啊啊啊啊啊，你对我的赛钱箱做了什么！！！！！！');
					setTimeout(function(){
						player.say('你，我要把你变成十八层地狱底层的锅底废油！');
						setTimeout(function(){
							game.resume();
							player.maxlili = 10;
							player.gainlili(2000);
							plaer.update();
						}, 2500);
					}, 2500);
				},
			},
    		bianshen_reimu:{
    			audio:1,
    			trigger:{player:['damageAfter','gainliliAfter','loseHpAfter']},
    			forced:true,
    			skillAnimation:true,
    			init:function(player){
					player.lili = 0;
				},
    			filter:function(event,player){
    				return (player.lili >= 5) || (player.hp <= 4);
    			},
    			content:function(){
					var lili=player.lili;
					var maxlili = player.maxlili;
					player.init('boss_reimu2');
					player.$skill('到此为止了！',null,null,true);
					player.lili=lili;
					player.maxlili=maxlili;
					player.update();
					while(_status.event.name!='phaseLoop'){
						_status.event=_status.event.parent;
					}
					game.resetSkills();
					setTimeout(function(){
						game.playBackgroundMusic('reimu');
					},500);
					_status.paused=false;
					_status.event.player=player;
					_status.event.step=0;
					if(game.bossinfo){
						game.bossinfo.loopType=1;
						_status.roundStart=game.boss;
					}
    			}
    		},
    		mengxiangtiansheng:{
    			audio:2,
    			trigger:{player:['phaseBegin','phaseEnd']},
    			filter:function(event,player){
    				return player.lili > 0;
    			},
    			content:function(){
    				var players=game.filterPlayer();
    				for (var i = 0; i < players.length; i++){
    					if (!player.canUse('sha',players[i], false)) players.remove(players[i]);
    				}
					players.remove(player);
					player.loselili(); 
    				player.useCard({name:'sha'},players,false);
    			},
    			check:function(event,player){
    				return player.lili > 1; 
    			},
    		},
    		bianshen_cirno:{
    			audio:1,
    			trigger:{player:['damageAfter','gainAfter','loseHpAfter']},
    			forced:true,
    			skillAnimation:true,
    			init:function(player){
					player.lili = 0;
				},
    			filter:function(event,player){
    				return player.hp <= 4 || player.countCards('h') > game.countPlayer(function(current){
						if(current != player) return current.countCards('h');
					});
    			},
    			content:function(){
					var lili=player.lili;
					player.init('boss_cirno2');
					player.$skill('最强的来了！',null,null,true);
					player.lili=lili;
					player.update();
					while(_status.event.name!='phaseLoop'){
						_status.event=_status.event.parent;
					}
					game.resetSkills();
					setTimeout(function(){
						game.playBackgroundMusic('cirno');
					},500);
					_status.paused=false;
					_status.event.player=player;
					_status.event.step=0;
					if(game.bossinfo){
						game.bossinfo.loopType=1;
						_status.roundStart=game.boss;
					}
    			}
			},
			jiqiang:{
				global:'jiqiang1',
				trigger:{global:'phaseEnd'},
				forced:true,
				filter:function(event,player){
					return event.player.countCards('h') < player.countCards('h');
				},
				content:function(){
					trigger.player.damage('thunder');
					player.draw();
					player.chooseToUse(trigger.player, -1,'冰柱机枪：你可以对'+get.translation(trigger.player)+'使用一张牌');
				}
			},
			jiqiang1:{
				mod:{
					maxHandcard:function(player,num){
						return num - game.countPlayer(function(current){
							if(current != player && current.hasSkill('jiqiang')) return 2;
						});
					}
				},
			},
			zuanshi:{
				forced:true,
				trigger:{player:'phaseUseBegin'},
				group:'zuanshi1',
				global:'zuanshi2',
				init:function(player){
					player.storage.zuanshi = [];
				},
				intro:{
					content:function(storage){
						var str = '视为【轰！】的牌：';
						if (storage){
							for (var i = 0; i < storage.length; i ++){
								if (!str.includes(get.translation(storage[i]))) str += get.translation(storage[i]) + ',';
							}
						}
						return str; 
					},
				},
				content:function(){
					'step 0'
					player.storage.zuanshi = [];
					var num = player.countCards('h', {name:'sha'});
					player.draw(num);
				},
				mod:{
					maxHandcard:function(player,num){
						return num + player.storage.zuanshi.length;
					},
				},
			},
			zuanshi1:{
				direct:true,
				trigger:{player:'gainBegin'},
				filter:function(event,player){
					if (!event.getParent('zuanshi')) return false;
					return true;
				},
				content:function(){
					player.showCards(trigger.cards);
					for(var i=0;i<trigger.cards.length;i++){
						player.storage.zuanshi.push(trigger.cards[i].name);
					}
					player.markSkill('zuanshi');
				},
			},
			zuanshi2:{
				mod:{
					cardEnabled:function(card,player){
						if(_status.event.skill==undefined&&game.hasPlayer(function(current){
							return current.hasSkill('zuanshi') && current.storage.zuanshi.contains(card.name) && card.name != 'sha';
						})) return false;
					},
					cardUsable:function(card,player){
						if(_status.event.skill==undefined&&game.hasPlayer(function(current){
							return current.hasSkill('zuanshi') && current.storage.zuanshi.contains(card.name) && card.name != 'sha';
						})) return false;
					},
					cardRespondable:function(card,player){
						if(_status.event.skill==undefined&&game.hasPlayer(function(current){
							return current.hasSkill('zuanshi') && current.storage.zuanshi.contains(card.name) && card.name != 'sha';
						})) return false;
					},
					cardSavable:function(card,player){
						if(_status.event.skill==undefined&&game.hasPlayer(function(current){
							return current.hasSkill('zuanshi') && current.storage.zuanshi.contains(card.name) && card.name != 'sha';
						})) return false;
					},
				},
				enable:["chooseToUse",'chooseToRespond'],
				filterCard:function(card){
					return game.hasPlayer(function(current){
						return current.hasSkill('zuanshi') && current.storage.zuanshi.contains(card.name);
					});
				},
				viewAs:{name:"sha"},
				prompt:"将【钻石风暴】指定的牌名当【轰！】使用",
			},
			jubing:{
				trigger:{player:'phaseBegin'},
				forced:true,
				limited:true,
				skillAnimation:true,
				mark:true,
				filter:function(event,player){
					return player.hp == 1;
				},
				content:function(){
					player.awakenSkill('jubing');
					var list = game.filterPlayer();
					list.remove(player);
					for (var i = 0; i < list.length; i ++){
						list[i].damage(9, 'thunder');
					};
				},
			},
    		boss_damagecount:{
				mode:['boss'],
				global:'boss_damagecount2',
				direct:true,
				trigger:{player:'phaseBegin'},
				content:function(){
					player.skip('phaseUse');
				},
			},
			boss_damagecount2:{
				trigger:{source:'damageEnd'},
				silent:true,
				filter:function(event,player){
					if(!ui.damageCount) return false;
					return event.num>0&&player.isFriendOf(game.me)&&event.player.isEnemyOf(game.me);
				},
				content:function(){
					_status.damageCount+=trigger.num;
					ui.damageCount.innerHTML='伤害: '+_status.damageCount;
				}
			},
    		boss_nianrui:{
				trigger:{player:'phaseDrawBegin'},
				forced:true,
				content:function(){
					trigger.num+=2;
				},
				ai:{
					threaten:1.6
				}
			},
			boss_qixiang:{
				group:['boss_qixiang1','boss_qixiang2'],
				ai:{
					effect:{
						target:function(card,player,target,current){
							if(card.name=='lebu'&&card.name=='bingliang') return 0.8;
						}
					}
				}
			},
			boss_qixiang1:{
				trigger:{player:'judge'},
				forced:true,
				filter:function(event,player){
					if(event.card){
						if(event.card.viewAs){
							return event.card.viewAs=='lebu';
						}
						else{
							return event.card.name=='lebu';
						}
					}
				},
				content:function(){
					player.addTempSkill('boss_qixiang3','judgeAfter');
				}
			},
			boss_qixiang2:{
				trigger:{player:'judge'},
				forced:true,
				filter:function(event,player){
					if(event.card){
						if(event.card.viewAs){
							return event.card.viewAs=='bingliang';
						}
						else{
							return event.card.name=='bingliang';
						}
					}
				},
				content:function(){
					player.addTempSkill('boss_qixiang4','judgeAfter');
				}
			},
			boss_qixiang3:{
				mod:{
					suit:function(card,suit){
						if(suit=='diamond') return 'heart';
					}
				}
			},
			boss_qixiang4:{
				mod:{
					suit:function(card,suit){
						if(suit=='spade') return 'club';
					}
				}
			},
			boss_juejing:{
				trigger:{player:'phaseDrawBefore'},
				forced:true,
				content:function(){
					trigger.cancel();
				},
				ai:{
					noh:true,
				},
				group:'boss_juejing2'
			},
			boss_juejing2:{
				trigger:{player:'loseEnd'},
				forced:true,
				filter:function(event,player){
					return player.countCards('h')<4;
				},
				content:function(){
					player.draw(4-player.countCards('h'));
				}
			},
			longhun:{
			group:['longhun1','longhun2','longhun3','longhun4'],
				ai:{
					skillTagFilter:function(player,tag){
						switch(tag){
							case 'respondSha':{
								if(player.countCards('he',{suit:'diamond'})<Math.max(1,player.hp)) return false;
								break;
							}
							case 'respondShan':{
								if(player.countCards('he',{suit:'club'})<Math.max(1,player.hp)) return false;
								break;
							}
							case 'save':{
								if(player.countCards('he',{suit:'heart'})<Math.max(1,player.hp)) return false;
								break;
							}
						}
					},
					maixie:true,
					save:true,
					respondSha:true,
					respondShan:true,
					effect:{
						target:function(card,player,target){
							if(get.tag(card,'recover')&&target.hp>=1) return [0,0];
							if(!target.hasFriend()) return;
							if((get.tag(card,'damage')==1||get.tag(card,'loseHp'))&&target.hp>1) return [0,1];
						}
					},
					threaten:function(player,target){
						if(target.hp==1) return 2;
						return 0.5;
					},
				}
			},
			longhun1:{
				audio:true,
				enable:['chooseToUse','chooseToRespond'],
				prompt:function(){
					return '将'+get.cnNumber(Math.max(1,_status.event.player.hp))+'张红桃牌当作桃使用';
				},
				position:'he',
				check:function(card,event){
					if(_status.event.player.hp>1) return 0;
					return 10-get.value(card);
				},
				selectCard:function(){
					return Math.max(1,_status.event.player.hp);
				},
				viewAs:{name:'tao'},
				filter:function(event,player){
					return player.countCards('he',{suit:'heart'})>=player.hp;
				},
				filterCard:function(card){
					return get.suit(card)=='heart';
				}
			},
			longhun2:{
				audio:true,
				enable:['chooseToUse','chooseToRespond'],
				prompt:function(){
					return '将'+get.cnNumber(Math.max(1,_status.event.player.hp))+'张方片当作火杀使用或打出';
				},
				position:'he',
				check:function(card,event){
					if(_status.event.player.hp>1) return 0;
					return 10-get.value(card);
				},
				selectCard:function(){
					return Math.max(1,_status.event.player.hp);
				},
				viewAs:{name:'sha',nature:'fire'},
				filter:function(event,player){
					return player.countCards('he',{suit:'diamond'})>=player.hp;
				},
				filterCard:function(card){
					return get.suit(card)=='diamond';
				}
			},
			longhun3:{
				audio:true,
				enable:['chooseToUse','chooseToRespond'],
				prompt:function(){
					return '将'+get.cnNumber(Math.max(1,_status.event.player.hp))+'张黑桃牌当作【请你住口！】使用';
				},
				position:'he',
				check:function(card,event){
					if(_status.event.player.hp>1) return 0;
					return 7-get.value(card);
				},
				selectCard:function(){
					return Math.max(1,_status.event.player.hp);
				},
				viewAs:{name:'wuxie'},
				viewAsFilter:function(player){
					return player.countCards('he',{suit:'spade'})>=player.hp;
				},
				filterCard:function(card){
					return get.suit(card)=='spade';
				}
			},
			longhun4:{
				audio:true,
				enable:['chooseToUse','chooseToRespond'],
				prompt:function(){
					return '将'+get.cnNumber(Math.max(1,_status.event.player.hp))+'张梅花牌当作闪打出';
				},
				position:'he',
				check:function(card,event){
					if(_status.event.player.hp>1) return 0;
					return 10-get.value(card);
				},
				selectCard:function(){
					return Math.max(1,_status.event.player.hp);
				},
				viewAs:{name:'shan'},
				filterCard:function(card){
					return get.suit(card)=='club';
				}
			},
			punch:{
				audio:2,
				forced:true,
				trigger:{source:'damageBegin'},
				content:function(){
					trigger.num += Number.MAX_SAFE_INTEGER;
				},
				mod:{
					cardEnabled:function(card,player){
						if(card.name == 'huazhi') return false;
					},
					cardUsable:function(card,player){
						if(card.name == 'huazhi') return false;
					},
				},
			},
			// 用来从玩家游戏开始的技能
			skipfirst:{
				direct:true,
				trigger:{player:'phaseBegin'},
				content:function(){
					trigger.cancel();
					player.removeSkill('skipfirst');
				},
			},
			serious:{
				audio:2,
				forced:true,
				trigger:{player:'phaseEnd'},
				content:function(){
					player.draw(game.roundNumber);
					if (player.maxlili < game.roundNumber){
						player.gainMaxlili(game.roundNumber - player.maxlili);
					}
					player.gainlili(game.roundNumber - player.lili);
				},
			},
			// 无限血的家伙回合外没有理由出牌
			boss_turncount:{
				mode:['boss'],
				/*
				mod:{
					cardEnabled:function(card,player){
						if(player != _status.currentPhase) return false;
					},
					cardUsable:function(card,player){
						if(player != _status.currentPhase) return false;
					},
					cardRespondable:function(card,player){
						if(player != _status.currentPhase) return false;
					},
					cardSavable:function(card,player){
						if(player != _status.currentPhase) return false;
					},
				},
				*/
			},
		},
		translate:{
			mode_boss_card_config:'魔王模式',
			zhu:'魔王',
			cai:'勇者',
			zhong:'从',
			dianche:'废线电车',
			_dianche:'废线电车（给牌）',
			dianche_info:'出牌阶段，对一名其他角色使用；其选择一项：弃置三张牌，或你与其以外的角色各弃置两张牌。<br><u>追加效果：出牌阶段，你可以将此牌和一张牌交给一名其他角色。</u>',
			shenlin:'神灵复苏',
			_shenlin:'神灵复苏（护盾）',
			shenlin_info:'出牌阶段，对一名坠机/重整中的角色使用；该角色以1体力/1灵力/1手牌重新加入游戏。<br><u>追加效果：你受到伤害后，可以弃置此牌：防止你受到的伤害，直到回合结束。</u>',
			reidaisai2:'例大祭',
			reidaisai2_info:'出牌阶段，对任意名与你身份不同的角色使用；目标摸一张牌，你摸X张牌（X为目标数+1），然后你可以将任意张牌交给任意名其他角色。',
			tancheng:'坦诚相待',
			tancheng_info:'出牌阶段，对所有其他角色使用；目标展示所有手牌，然后你可以用一张牌交换其中一张与之不同类型的牌。',
			boss_reimu:'灵梦',
			boss_reimu2:'灵梦',
			lingji:'灵击',
			lingji_info:'锁定技，你造成或受到弹幕伤害后，须判定；若为红色，你获得1点灵力；否则，你获得判定牌。',
			bianshen_reimu:'二阶段转换',
			bianshen_reimu_info:'体力值变为4时，或灵力值变为5时。',
			mengxiangtiansheng:'梦想天生',
			mengxiangtiansheng_info:'准备阶段，或结束阶段，你可以消耗1点灵力，视为对所有其他角色使用了一张【轰！】。',
			boss_cirno:'琪露诺',
			boss_cirno2:'琪露诺',
			bianshen_cirno:'二阶段转换',
			bianshen_cirno_info:'体力值变为4时，或你获得牌后，手牌数大于其他角色手牌数总和。',
			jiqiang:"冰柱机枪",
			jiqiang_info:'锁定技，所有其他角色的手牌上限-2；一名其他角色的回合结束时，若其手牌数小于你，摸一张牌，对其造成1点灵击伤害，然后你可以对其使用一张牌。',
			zuanshi:'钻石风暴',
			zuanshi_info:'锁定技，出牌阶段开始时，你摸X张牌并展示（X为你手牌中【轰！】的数量）：直到你的回合开始，与这些牌同名的牌均视为【轰！】，且你的手牌上限+X。',
			zuanshi2:'钻石风暴（转化【轰！】）',
			jubing:'巨冰破碎',
			jubing_info:'限定技，锁定技，准备阶段，若你的体力为1，你对所有其他角色造成9点灵击伤害。',
			boss_nianshou:'年兽',
			boss_nianrui:'年瑞',
			boss_nianrui_info:'锁定技，摸牌阶段，你额外摸两张牌。',
			boss_qixiang:'祺祥',
			boss_qixiang1:'祺祥',
			boss_qixiang2:'祺祥',
			boss_qixiang_info:'乐不思蜀判定时，你的方块判定牌视为红桃；兵粮寸断判定时，你的黑桃判定牌视为草花',
			boss_damagecount:'沙袋挑战',
			boss_damagecount_info:'锁定技，跳过你的出牌阶段。<br>你在6分钟之内可以对我造成多少伤害呢？',
			mode_boss_character_config:'挑战角色',
			boss_zhaoyun:'高达一号',
			boss_juejing:'绝境',
			boss_juejing2:'绝境',
			boss_juejing_info:'锁定技，摸牌阶段开始时，你不摸牌；锁定技，你失去牌时，若你的手牌数小于4，你将手牌补至四张',
			longhun:'龙魂',
			longhun1:'龙魂♥︎',
			longhun2:'龙魂♦︎',
			longhun3:'龙魂♠︎',
			longhun4:'龙魂♣︎',
			longhun_info:'你可以将同花色的X张牌按下列规则使用或打出：红桃当【葱】，方块当具火焰伤害的【轰！】，梅花当【躲～】，黑桃当【请你住口！】（X为你的体力且至少为1）',
			boss_saitama:'斗篷光头',
			punch:'普通的技能',
			punch_audio1:'啊，用力过猛了。',
			punch_audio2:'今天是星期几来着……',
			punch_info:'锁定技，你造成伤害时，该伤害……啊，怎么又是一拳就打死了啊？！',
			serious:'认真一点吧',
			serious_audio1:'你们好像很厉害的样子。',
			serious_audio2:'稍微认真一点吧？',
			serious_info:'锁定技，结束阶段，你摸X张牌，并将灵力和灵力上限补至X（X为游戏轮次数）。',
			boss_saitama_die:'啊……就是这种感觉……',
			boss_turncount:'存活挑战',
			boss_turncount_info:'锁定技，回合外你不能使用/打出牌。<br>你在游戏失败前，能够撑多少轮呢？<br><br>注：建议在左上角[选项-开始-魔王]中将[单人控制]选项打开',
		},
		get:{
			rawAttitude:function(from,to){
				return (from.side===to.side?10:-10);
			}
		}
	};
});
