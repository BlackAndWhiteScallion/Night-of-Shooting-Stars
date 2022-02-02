'use strict';

game.import('mode',function(lib,game,ui,get,ai,_status){
	return {
		name:'stg',
		start:function(){
			"step 0"
			ui.backgroundMusic.pause();
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
			// 已通关红魔乡的话会解锁EX关卡
			if ((lib.config.gameRecord.stg && lib.config.gameRecord.stg.data['stg_scarlet'] && lib.config.gameRecord.stg.data['stg_scarlet'][0] > 0)
			 || lib.config.connect_nickname == '路人Orz'){
				lib.characterPack.mode_stg['stg_scarlet_ex'] = ['female','0',0,['boss_chiyan_ex'],['boss'],'zhu'];
			}
			// 这里是加载角色的地方
			for(var i in lib.characterPack.mode_stg){
				lib.character[i]=lib.characterPack.mode_stg[i];
				if(!lib.character[i][4]){
					lib.character[i][4]=[];
				}
			}
			for(var i in lib.cardPack.mode_stg){
			 	lib.card[i]=lib.cardPack.mode_stg[i];
			}
			for(var i in lib.skill){
				if(lib.skill[i].changeSeat){
					lib.skill[i]={};
					if(lib.translate[i+'_info']){
						lib.translate[i+'_info']='此模式下不可用';
					}
				}
			}
			lib.translate.restart='返回';
			lib.init.css(lib.assetURL+'layout/mode','boss');
			game.delay(0.1);
			"step 1"
			var bosslist=ui.create.div('#bosslist.hidden');
			event.bosslist=bosslist;
			lib.setScroll(bosslist);
			// bosslist.ontouchmove = ui.click.touchScroll;
			// bosslist.style.WebkitOverflowScrolling='touch';
			if(!lib.config.touchscreen&&lib.config.mousewheel){
				bosslist._scrollspeed=30;
				bosslist._scrollnum=10;
				bosslist.onmousewheel=ui.click.mousewheel;
			}
			// var bosslistlinks={};
			// var toggleBoss=function(bool){
			// 	game.saveConfig(this._link.config._name,bool,true);
			// 	var node=bosslistlinks[this._link.config._name];
			// 	if(bool){
			// 		node.style.display='';
			// 	}
			// 	else{
			// 		node.style.display='none';
			// 	}
			// };
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
			// boss选择
			var list=[];
			for(var i in lib.character){
				var info=lib.character[i];
				if(info[4].contains('boss')){
					var player=ui.create.player(bosslist).init(i);
					if(lib.characterPack.mode_stg[i]&&get.config(i+'_boss_config')==false){
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
					//player.node.identity.dataset.color=info[5];
					// bosslistlinks[cfg]=player;
					player.classList.add('bossplayer');

					if(lib.storage.current==i){
						event.current=player;
						player.classList.add('highlight');
						_status.bosschoice=i;
						if(!lib.config.continue_name_boss&&lib.boss[i]&&lib.boss[i].control){
							_status.bosschoice=lib.boss[i].control();
							_status.bosschoice.name=i;
							_status.bosschoice.link=lib.boss[i].controlid||i;
						}
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
			lib.setPopped(ui.rules,function(){
				var uiintro=ui.create.dialog('hidden');

					uiintro.add('<div class="text left">选择一个大关，然后选择你喜欢的自机来挑战 </div>');
					uiintro.add('<div class="text left"><a href = "https://mp.weixin.qq.com/s/owQpDcBP0_OFPSlZMecPYQ" target="_blank">了解更多闯关技巧</a></div>');
					uiintro.add(ui.create.div('.placeholder.slim'))

				return uiintro;
			},400);
			_status.bosschoice = event.current;
			ui.create.div(bosslist);
			lib.card.list = lib.card.list.concat([[null,0,'stg_chongci'],[null,0,'stg_chongci'],[null,0,'stg_juedi'],[null,0,'stg_juedi'],[null,0,'stg_zhuanzhu'],[null,0,'stg_zhuanzhu']]);
			ui.create.cardsAsync();
			game.finishCards();
			//game.addGlobalSkill('autoswap');
			ui.arena.setNumber(8);
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
			// 选将
			if(lib.config.continue_name_boss){
				event.noslide=true;
				lib.init.onfree();
			}
			else{
				game.chooseCharacter(function(target){
					console.log('choose');
					if(event.current){
						event.current.classList.remove('highlight');
					}
					event.current=target;
					game.save('current',target.name);
					target.classList.add('highlight');
					if(_status.bosschoice){
						var name=target.name;
						if(lib.boss[target.name]&&lib.boss[target.name].controlid){
							name=lib.boss[target.name].controlid;
						}
					}
					if(lib.boss[target.name]&&lib.boss[target.name].control){
						_status.createControl=ui.control.firstChild;
						_status.bosschoice=lib.boss[target.name].control();
						_status.bosschoice.name=target.name;
						_status.bosschoice.link=lib.boss[target.name].controlid||target.name;
						if(ui.cheat2&&ui.cheat2.dialog==_status.event.dialog){
							_status.bosschoice.classList.add('disabled');
						}
						delete _status.createControl;
					}
					var list=[];
					for (var j = 0; j < lib.forbidstg.length; j ++){
						if (lib.forbidstg[j][0] == target.name){
							list = lib.forbidstg[j].slice(1);
						}
					}
					var dialog = document.getElementById("choosecharacter");
					var r = dialog.getElementsByClassName("button");
					for (var i = r.length - 1; i >= 0; --i){
						r[i].delete();
					}
					dialog.add([list,'character']);
					var b = dialog.getElementsByClassName("button");
					for (var f = b.length - 1; f >= 0; --f){
						b[f].classList.add('selectable');
					}
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
			game.bossinfo=lib.boss.global;
			for(var i in lib.boss[event.current.name]){
				game.bossinfo[i]=lib.boss[event.current.name][i];
			}

			setTimeout(function(){
				ui.control.classList.remove('bosslist');
			},500);
			var boss=ui.create.player();
			boss.getId();
			game.boss=boss;
			boss.init(event.current.name);
			boss.side=true;
			if(!event.noslide){
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
			// 玩家加入游戏
			for(var i=0;i<result.links.length;i++){
				var player=ui.create.player();
				player.getId();
				player.init(result.links[i]).animate('start');
				player.setIdentity('cai');
				player.identity='cai';
				player.side=false;
				game.players.push(player);
				// 如果玩家选择的是BOSS
				if(result.boss){
					if(game.bossinfo.minion){
						player.dataset.position=i+3;
					}
					else{
						player.dataset.position=(i+1)*2;
					}
				}
				// 如果玩家选择的不是BOSS
				else{
					player.dataset.position=i;
				}
				ui.arena.appendChild(player);
			}
			// boss加入游戏:BOSS的UI座位位置（8人场，BOSS对应位置）
			if(result.boss){
				game.players.unshift(boss);
				boss.dataset.position=0;
			}
			else{
				game.players.push(boss);
				boss.dataset.position=4;
			}
			// BOSS随从加入游戏
			if(game.bossinfo.minion){
				// 如果玩家不是BOSS，BOSS放到6号位
				/*
				if(!result.boss){
					boss.dataset.position=6;
				}
				*/
				for(var i in game.bossinfo.minion){
					var player=ui.create.player();
					player.getId();
					player.init(game.bossinfo.minion[i]);
					if(boss.bossinginfo){
						player.animate('bossing');
						player.node.hp.animate('start');
						player.style.transition='all 0s';
					}
					else{
						player.animate('start');
					}
					player.setIdentity('zhong');
					player.identity='zhong';
					player.side=true;
					game.players.push(player);
					// parseInt 就是那个2和8
					var num=parseInt(i);
					// 如果玩家是boss（0号位），那么分别安排到1和7位
					if(result.boss){
						player.dataset.position=num-1;
					}
					// 如果玩家不是boss，2号位安排到7，8号位安排到5。
					else{
						if(num==2){
							//player.dataset.position=7;
							player.dataset.position=3;
						}
						else{
							//player.dataset.position=num-3;
							player.dataset.position=5;
						}
					}
					ui.arena.appendChild(player);
					if(boss.bossinginfo){
						var rect=player.getBoundingClientRect();
						player.style.transform='translate('+(boss.bossinginfo[0]-rect.left-rect.width/2)+'px,'+(boss.bossinginfo[1]-rect.top-rect.height/2)+'px) scale(1.1)';
						ui.refresh(player);
						player.style.transition='';
						player.style.transform='';
					}
				}
			}
			ui.create.me();
			if (!ui.arena.classList.contains('decadeUI') && !get.is.newLayout()){
				ui.fakeme=ui.create.div('.avatar',ui.me);
			}
			if(game.me!==boss){
				//game.singleHandcard=true;
				//ui.arena.classList.add('single-handcard');
				//ui.window.classList.add('single-handcard');
				//game.onSwapControl();
				/*
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
				}*/
			}
			else{
				ui.fakeme.style.display='none';
			}

			lib.setPopped(ui.create.system('残机',null,true),function(){
				var uiintro=ui.create.dialog('hidden');

				uiintro.add('残机');
				var table=ui.create.div('.bosschongzheng');

				var tr,td,added=false;

				added=true;
				
				tr=ui.create.div(table);
				td=ui.create.div(tr);
				//td.innerHTML=get.translation(game.dead[i]);
				//td=ui.create.div(tr);
				
				if(game.me.storage.fuhuo){
					td.innerHTML='剩余'+game.me.storage.fuhuo+'个残机';
				}
				else{
					td.innerHTML='不剩残机了'
				}

				if(!added){
					uiintro.add('<div class="text center">没有残机了/div>');
					uiintro.add(ui.create.div('.placeholder.slim'))
				}
				else{
					uiintro.add(table);
				}

				return uiintro;
			},180);

			ui.boss = ui.create.system('剩余符卡',null,true);
			lib.setPopped(ui.boss,function(){
				var uiintro=ui.create.dialog('hidden');
				var str = '';
				if (!game.me.storage || !game.me.storage.reskill){ 
					str = 'BOSS没有符卡';
				} else if (game.me.storage.reskill){
					str = 'BOSS剩余'+game.me.storage.reskill.length+'张符卡';
				} 
				uiintro.add('<div class="text center">'+str+'</div>');
				uiintro.add(ui.create.div('.placeholder.slim'))

				return uiintro;
			},180);
			ui.boss.style.display = 'none';

			lib.setPopped(ui.rules,function(){
				var uiintro=ui.create.dialog('hidden');

					uiintro.add('<div class="text left">1. 击坠敌人后，来源摸一张牌，获得1点灵力 <br> 2. 准备阶段，场上敌人数小于2，会刷出下一个敌人 <br> 3. 通关时，获得一张【拔雾开天】，并重置牌堆 <br> 4.手牌上限+X（X为已通关卡数量） </div>');
					uiintro.add('<div class="text left"><a href = "https://mp.weixin.qq.com/s/owQpDcBP0_OFPSlZMecPYQ" target="_blank">了解更多闯关技巧</a></div>');
					uiintro.add(ui.create.div('.placeholder.slim'))

				return uiintro;
			},400);

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

			event.bosslist.delete();

			game.arrangePlayers();
			// 跳过行动部分
			/*
			for(var i=0;i<game.players.length;i++){
				game.players[i].node.action.innerHTML='行动';
			}
			*/

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
			delete lib.boss;
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
			var musicloop = function(){
				if (lib.config.currentMusic == lib.config.musiccchange.length) return;
				if (lib.config.musiccchange[lib.config.currentMusic][0] != lib.config.musiccchange[lib.config.currentMusic+1][0]) return;
				if (ui.backgroundMusic.currentTime >= lib.config.musiccchange[lib.config.currentMusic+1][1]){
					game.swapMusic();
				}
			};
			ui.backgroundMusic.addEventListener("timeupdate", musicloop);
			event.trigger('gameStart');
			game.gameDraw(game.boss,game.bossinfo.gameDraw||4);
			game.bossPhaseLoop();
			setTimeout(function(){
				ui.updatehl();
			},200);
		},
		element:{
			player:{
				dieAfter:function(source){
					if(this!=game.boss && this!= game.me){
						if (source){
							source.draw();
							if (get.config('die_lili')){
								source.gainlili();
							}
						}
						this.hide();
						game.addVideo('hidePlayer',this);
						game.players.remove(this);
						this.delete();
					}
					if (this == game.boss && !game.me.storage.reinforce.length){
						ui.cardPile.innerHTML='';
            			ui.discardPile.innerHTML='';
						ui.create.cardsAsync();
						ui.boss.style.display = 'none';
						game.me.levelOver();
					}
					if(game.bossinfo.checkResult&&game.bossinfo.checkResult(this)===false){
						return;
					}
					if(this==game.boss ||!game.hasPlayer(function(current){
						return !current.side;
					})){
						game.checkResult();
					}
				},
				levelOver:function(){
					if (_status.bosschoice.name == 'stg_scarlet'){
						this.gain(game.createCard('stg_bawu'));
					}
					var players = game.players;
					for (var i = game.players.length; i >= 0; i --){
						if (!game.players[i]){
							
						} else if (game.players[i].identity != 'cai'){
							console.log(game.players[i]);
							game.players[i].hide();
							game.addVideo('hidePlayer',game.players[i]);
							game.players[i].delete();
							game.players.remove(game.players[i]);
						}
					}
					game.swapMusic(true);
					setTimeout(function(){
						ui.backgroundMusic.pause();
					}, 1);
				},
			}
		},
		card:{
			stg_yinyangyu:{
				fullskin:true,
				type:'equip',
				subtype:'equip4',
				modeimage:'stg',
				unique:true,
				ai:{
					basic:{
						equipValue:6,
					}
				},
				skills:['stg_yinyangyu_skill']
			},
			stg_needle:{
				fullskin:true,
				type:'equip',
				subtype:'equip4',
				modeimage:'stg',
				unique:true,
				ai:{
					basic:{
						equipValue:6,
					}
				},
				skills:['stg_needle_skill']
			},
			stg_bagua:{
				fullskin:true,
				type:'equip',
				subtype:'equip4',
				modeimage:'stg',
				unique:true,
				ai:{
					basic:{
						equipValue:6
					}
				},
				skills:['stg_bagua_skill']
			},
			stg_missile:{
				fullskin:true,
				type:'equip',
				subtype:'equip4',
				modeimage:'stg',
				unique:true,
				ai:{
					basic:{
						equipValue:6
					}
				},
				skills:['stg_missile_skill']
			},
			stg_deck:{
				fullskin:true,
				type:'equip',
				subtype:'equip4',
				modeimage:'stg',
				unique:true,
				ai:{
					basic:{
						equipValue:6
					}
				},
				skills:['stg_deck_skill']
			},
			stg_watch:{
				fullskin:true,
				type:'equip',
				subtype:'equip4',
				modeimage:'stg',
				unique:true,
				ai:{
					basic:{
						equipValue:6
					}
				},
				skills:['stg_watch_skill']
			},
			stg_louguan:{
				fullskin:true,
				type:'equip',
				subtype:'equip4',
				modeimage:'stg',
				ai:{
					basic:{
						equipValue:6
					}
				},
				skills:['stg_louguan_skill']
			},
			stg_bailou:{
				fullskin:true,
				type:'equip',
				subtype:'equip4',
				modeimage:'stg',
				ai:{
					basic:{
						equipValue:6
					}
				},
				skills:['stg_bailou_skill']
			},
			stg_waterbook:{
				fullskin:true,
				type:'equip',
				subtype:'equip4',
				modeimage:'stg',
				ai:{
					basic:{
						equipValue:6
					}
				},
				skills:['stg_waterbook_skill']
			},
			stg_firebook:{
				fullskin:true,
				type:'equip',
				subtype:'equip4',
				modeimage:'stg',
				ai:{
					basic:{
						equipValue:6
					}
				},
				skills:['stg_firebook_skill']
			},
			stg_dirtbook:{
				fullskin:true,
				type:'equip',
				subtype:'equip4',
				modeimage:'stg',
				ai:{
					basic:{
						equipValue:6
					}
				},
				skills:['stg_dirtbook_skill']
			},
			stg_goldbook:{
				fullskin:true,
				type:'equip',
				subtype:'equip4',
				modeimage:'stg',
				ai:{
					basic:{
						equipValue:6
					}
				},
				skills:['stg_goldbook_skill']
			},
			stg_woodbook:{
				fullskin:true,
				type:'equip',
				subtype:'equip4',
				modeimage:'stg',
				ai:{
					basic:{
						equipValue:6
					}
				},
				skills:['stg_woodbook_skill']
			},
			stg_mingyun:{
				audio:true,
				fullskin:true,
				type:'jinji',
				modeimage:'stg',
				selectTarget:-1,
				filterTarget:function(card,player,target){
					return target==player;
				},
				modTarget:true,
				content:function(){
					'step 0'
					player.$skill('命运之光',null,null,true);
					var cards=[];
					for(var i=0;i<ui.cardPile.childNodes.length;i++){
						cards.push(ui.cardPile.childNodes[i]);
					}
					player.chooseCardButton('命运之光：获得牌堆中的一张牌',cards).set('filterButton',function(button){
						return true;
					});
					'step 1'
					if (result.bool){
                        player.gain(result.links[0]);
                        player.$gain2(result.links[0]);
                    }
				},
				ai:{
					basic:{
						order:1,
						useful:[4,2],
						value:[4,2],
					},
					result:{
						target:function(player,target){
							return 2;
						}
					},
					tag:{
						draw:1
					}
				}
			},
			stg_bawu:{
				audio:true,
				fullskin:true,
				type:'trick',
				subtype:'support',
				modeimage:'stg',
				enable:true,
				selectTarget:-1,
				filterTarget:function(card,player,target){
					return target==player && (target.identity == 'cai' || target.identity == 'fan');
				},
				modTarget:true,
				contentBefore:function(){
					player.$skill('拔雾开天');
				},
				content:function(){
					'step 0'
					if (target.name == 'remilia'){
						target.say('等下，我为什么要解我自己的雾？');
					} else {
						target.chooseControl('回复1点体力，获得圣盾','获得1点灵力，获得连击', true).set('ai',function(){
							return '回复1点体力，获得圣盾';
						}).set('prompt','拔雾开天：选择一项：');
					}
					'step 1'
					if (result.control == '回复1点体力，获得圣盾'){
						target.recover();
						player.drawSkill('shengdun');
					} else if (result.control == '获得1点灵力，获得连击'){
						target.gainlili();
						player.drawSkill('lianji');
					}
				},
				ai:{
					basic:{
						order:3,
						useful:4,
						value:9.2
					},
					result:{
						target:3,
					},
					tag:{
						recover:1,
					}
				}
			},
			stg_lingji:{
				audio:true,
				fullskin:true,
				notarget:true,
				type:'trick',
				modeimage:'stg',
				subtype:'defense',
				enable:true,
				selectTarget:-1,
				filterTarget:function(card, player, target){
					return target == player;
				},
				contentBefore:function(){
					game.playAudio('effect', 'slash');
					player.$skill('灵击');
				},
				content:function(){
					var players = game.filterPlayer().remove(target);
					for (var i = 0; i < players.length; i ++){
						players[i].addTempSkill('lunadial2');
					}
					target.addTempSkill('mianyi');
					var e = event.getParent('useSkill');
					if (e && e.skill && e.skill == 'stg_lingji'){
						var trigger = event.getParent('damage');
						trigger.cancel();
					}
					game.log('灵击：防止本回合所有伤害');
				},
				ai:{
					basic:{
						useful:[6,4],
						value:[6,4],
					},
					result:{player:1},
					expose:0.2
				},
			},
			stg_fengyin:{
				modeimage:'stg',
				audio:true,
				fullskin:true,
				type:'trick',
				subtype:'support',
				enable:true,
				selectTarget:-1,
				filterTarget:function(card,player,target){
					return target==player;
				},
				modTarget:true,
				content:function(){
					'step 0'
					var list = [];
					for (var i in lib.card){
						if(lib.card[i].mode&&lib.card[i].mode.contains(lib.config.mode)==false) continue;
						if(lib.card[i].forbid&&lib.card[i].forbid.contains(lib.config.mode)) continue;
						if(lib.card[i].type == 'jinji'){
							list.add(i);
						}
					}
					for(var i=0;i<list.length;i++){
						list[i]=[get.type(list[i]),'',list[i]];
					}
					if(list.length){
                        target.chooseButton(['创建并获得一张禁忌牌',[list,'vcard']]).set('ai',function(button){
                            var player=_status.event.player;
                            var recover=0,lose=1,players=game.filterPlayer();
                            for(var i=0;i<players.length;i++){
                                if(!players[i].isOut()){
                                    if (get.attitude(player, players[i]) >= 0) recover ++;
                                    if (get.attitude(player, players[i]) < 0 ){
                                        if (players[i].hp == 1 && get.effect(players[i],{name:'juedou'},player,player)) return (button.link[2] == 'juedou')?2:-1;
                                        lose ++;
                                    }
                                }
                            }
                            if (recover - 2 >= lose) return (button.link[2] == 'reidaisai')?2:-1;
                            return get.value({name:button.link[2]});
                        });
                    }
					'step 1'
					if (result.links){
						target.gain(game.createCard(result.links[0][2]));
                    }
				},
				ai:{
					basic:{
						order:1,
						useful:[4,2],
						value:[4,2],
					},
					result:{
						target:function(player,target){
							if (!target.getStat('damage') && get.attitude(player, target) > 0) return -1;
							return target.getStat('damage');
						}
					},
					tag:{
						draw:0.5
					}
				}
			},
			stg_pohuai:{
				modeimage:'stg',
				audio:true,
				fullskin:true,
				type:'jinji',
				enable:true,
				selectTarget:1,
				filterTarget:function(card,player,target){
					return true;
				},
				content:function(){
					player.$skill('破坏之果',null,null,true);
					var num = 0;
					for(var j=0;j<target.stat.length;j++){
						if(target.stat[j].kill!=undefined) num+=target.stat[j].kill;
					}
					if (target.countCards('h') > num){
						target.chooseToDiscard(target.countCards('h') - num, 'h', true);
					} else {
						target.draw(num - target.countCards('h'));
					}
					if (target.lili < num){
						target.gainlili(num - target.lili);
					} else {
						target.loselili(target.lili - num);
					}
				},
				ai:{
					basic:{
						order:2,
						useful:[4,2],
						value:[4,2],
					},
					result:{
						target:function(player,target){
							var num = 0;
							for(var j=0;j<target.stat.length;j++){
								if(target.stat[j].kill!=undefined) num+=target.stat[j].kill;
							}
							return num - target.countCards('h');
						}
					},
					tag:{
						draw:0.5
					}
				}
			},
			stg_louxie:{
				modeimage:'stg',
				audio:true,
				fullskin:true,
				type:'trick',
				subtype:'support',
				enable:true,
				selectTarget:-1,
				bonus:1,
				filterTarget:function(card,player,target){
					return target==player;
				},
				modTarget:true,
				content:function(){
					player.gain(game.createCard('stg_jiejie'));
				},
				ai:{
					basic:{
						order:1,
						useful:[4,2],
						value:[4,2],
					},
					result:{
						target:function(player,target){
							return 1;
						}
					},
					tag:{
						draw:0.5
					}
				}
			},
			stg_sidie:{
				modeimage:'stg',
				audio:true,
				fullskin:true,
				type:'jinji',
				enable:true,
				selectTarget:1,
				filterTarget:function(card,player,target){
					return player==game.me && game.me.storage.fuhuo;
				},
				modTarget:true,
				content:function(){
					game.me.storage.fuhuo--;
					target.loseHp(3);
				},
				ai:{
					basic:{
						order:1,
						useful:[4,2],
						value:[4,2],
					},
					result:{
						target:function(player,target){
							return -1;
						}
					},
					tag:{
						draw:0.5
					}
				}
			},
			stg_zhuanzhu:{
				audio:true,
				fullskin:true,
				type:'delay',
				modeimage:'stg',
				skills:['stg_zhuanzhu_skill'],
				filterTarget:function(card,player,target){
					return true;
				},
				judge:function(card){
					return 0;
				},
				effect:function(){
				},
				ai:{
					basic:{
						value:8,
					},
					result:{target:1},
					expose:0.2
				},
			},
			stg_chongci:{
				audio:true,
				fullskin:true,
				type:'delay',
				modeimage:'stg',
				skills:['stg_chongci_skill'],
				filterTarget:function(card,player,target){
					return true;
				},
				judge:function(card){
					return 0;
				},
				effect:function(){
				},
				ai:{
					basic:{
						value:5,
					},
					result:{target:1},
					expose:0.2
				},
			},
			stg_juedi:{
				audio:true,
				fullskin:true,
				type:'delay',
				modeimage:'stg',
				skills:['stg_juedi_skill'],
				filterTarget:function(card,player,target){
					return true;
				},
				judge:function(card){
					return 0;
				},
				effect:function(){
				},
				ai:{
					basic:{
						value:12,
					},
					result:{target:1},
					expose:0.2
				},
			},
			stg_jiejie:{
				audio:true,
				fullskin:true,
				type:'delay',
				modeimage:'stg',
				skills:['stg_jiejie_skill'],
				filterTarget:function(card,player,target){
					return true;
				},
				judge:function(card){
					return 0;
				},
				effect:function(){
				},
				ai:{
					basic:{
						value:12,
					},
					result:{target:1},
					expose:0.2
				},
			},
		},
		characterPack:{
			mode_stg:{
				stg_scarlet:['male','0',0,['boss_chiyan'],['boss'],'zhu'],
				stg_cherry:['male', '0', 0, ['boss_cherry'], ['boss'], 'zhu'],
				//stg_next:['male','0',0,[],['boss'],'zhu'],
				stg_maoyu:['male','2',2,[],['hiddenboss','bossallowed']],
				stg_yousei:['female','1',1,[],['hiddenboss','bossallowed']],
				stg_maid:['female','2',1,['saochu'],['hiddenboss','bossallowed']],
				stg_bookshelf:['female','3',5,['juguang'],['hiddenboss','bossallowed']],
				stg_bat:['female','1',1,['xixue'],['hiddenboss','bossallowed']],
				stg_ghost:['female', '2', 1, ['stg_ghost_skill'], ['hiddenboss', 'bossallowed']],
				stg_puppet:['female', '1', 1, ['stg_shanghai_skill'], ['hiddenboss', 'bossallowed']],
				stg_shanghai:['female', '2', 1, ['stg_shanghai_shanghai_skill'], ['hiddenboss', 'bossallowed']],
				//stg_bunny:['female','2',2,[],['hiddenboss','bossallowed']],
			}
		},
		cardPack:{
			mode_stg:['stg_yinyangyu','stg_bagua','stg_missile','stg_needle','stg_deck','stg_watch',
			'stg_firebook','stg_waterbook','stg_woodbook','stg_dirtbook','stg_goldbook', 'stg_mingyun', 'stg_bawu', 'stg_lingji',
			'stg_fengyin', 'stg_pohuai', 'stg_juedi', 'stg_chongci', 'stg_zhuanzhu', 'stg_sidie', 'stg_louxie',
			'stg_jiejie', 'stg_bailou', 'stg_louguan'],
		},
		init:function(){
			for(var i in lib.characterPack.mode_stg){
				if(lib.characterPack.mode_stg[i][4].contains('hiddenboss')) continue;
				lib.mode.boss.config[i+'_boss_config']={
					name:get.translation(i),
					init:true,
					unfrequent:true,
				}
			}
		},
		game:{
			reserveDead:true,
			addBossFellow:function(position,name,cards){
				var fellow=game.addFellow(position,name,'zoominanim');
				fellow.directgain(get.cards(cards));
				fellow.side=true;
				fellow.identity='zhong';
				fellow.setIdentity('zhong');
				game.addVideo('setIdentity',fellow,'zhong');
			},
			addRecord:function(bool){
				if(typeof bool=='boolean'){
					if (get.config('practice_mode')) return;
					if (!lib.config.gameRecord.stg) lib.config.gameRecord["stg"] = {data:{}};
					var data=lib.config.gameRecord.stg.data;
					var name = _status.bosschoice.name;
					if(!data[name]){
						data[name]=[0,0,0,0];
					}
					if(bool){
						data[name][0]++;
						if (data[name][1] == 0 || data[name][1] > game.phaseNumber){
							data[name][1] = game.phaseNumber;
							data[name][2] = game.me.storage.fuhuo;
						}
					}
					else{
						data[name][3]++;
					}
					var list = [];
					for(var i in lib.character){
						var info=lib.character[i];
						if(info[4] && info[4].contains('boss')){
							list.push(i);
						}
					}
					var str='';
					for(var i=0;i<list.length;i++){
						if(data[list[i]]){
							str+=lib.translate[list[i]] + ': <br> 通关次数：'+data[list[i]][0]+'  最快纪录：'+data[list[i]][1]+'回合   剩余残机：'+data[list[i]][2]+'<br>挑战失败次数：'+ data[list[i]][3]+'<br>';
						}
					}
					lib.config.gameRecord.stg.str=str;
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
				//game.addVideo('bossSwap',player,boss.name);
				boss.dataset.position = 4;
				/*
				if(game.me==player){
					game.swapControl(boss);
				}
				*/
				ui.boss.style.display = 'initial';
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
				boss.draw(game.bossinfo.gameDraw(game.boss));

				if (game.me.storage.skill){
					for (var i = 0; i < game.me.storage.skill.length; i ++){
						boss.addSkill(game.me.storage.skill[i]);
					}
				}
				if (game.me.storage.unskill){
					for (var i = 0; i < game.me.storage.unskill.length; i ++){
						boss.removeSkill(game.me.storage.unskill[i]);
					}
				}
				if (!game.me.storage.musicchange){
					ui.backgroundMusic.pause();
					game.swapMusic(true);
				} else delete game.me.storage.musicchange;
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
			// 游戏回合顺序
			bossPhaseLoop:function(){
				var next=game.createEvent('phaseLoop');
				// boss先行
				if(game.bossinfo.loopFirst){
					next.player=game.bossinfo.loopFirst();
				}
				else{
					//next.player=game.boss;
					// 因为不能选boss,由玩家视角先动。
					next.player=game.me;
				}
				_status.looped=true;
				next.setContent(function(){
					"step 0"
					if(player.identity=='zhu'&&game.boss!=player){
						player=game.boss;
					}
					player.phase();
					"step 1"
					if(game.bossinfo.loopType==2){
						_status.roundStart=true;
						if(event.player==game.boss){
							if(!_status.last||_status.last.nextSeat==game.boss){
								event.player=game.boss.nextSeat;
							}
							else{
								event.player=_status.last.nextSeat;
							}
						}
						else{
							_status.last=player;
							event.player=game.boss;
							if(player.nextSeat==game.boss){
								delete _status.roundStart;
							}
						}
					}
					else{
						event.player=event.player.nextSeat;
					}
					event.goto(0);
				});
			},
			chooseCharacter:function(func){
				var next=game.createEvent('chooseCharacter',false);
				//next.showConfig=true;
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
					console.log(lib.config.current);
					console.log(_status.bosschoice.name);
					// 这里应该是选角色页面
					// 要怎么做，才能获得当前BOSS呢？
					var list=[];
					event.list=list;
					for (var j = 0; j < lib.forbidstg.length; j ++){
						if (lib.forbidstg[j][0] == _status.bosschoice.name){
							list = lib.forbidstg[j].slice(1);
						}
					}
					//list.randomSort();
					var dialog=ui.create.dialog('选择自机角色','hidden');
					dialog.id = 'choosecharacter';
					dialog.classList.add('fixed');
					ui.window.appendChild(dialog);
					dialog.classList.add('bosscharacter');
					dialog.classList.add('modeshortcutpause');
					dialog.classList.add('withbg');
					// dialog.add('0/3');
					dialog.add([list,'character']);
					dialog.noopen=true;
					var next=game.me.chooseButton(dialog,true).set('onfree',true);
					next._triggered=null;
					next.custom.replace.target=event.customreplacetarget;
					next.selectButton=1;
					// next.custom.add.button=function(){
					// 	if(ui.cheat2&&ui.cheat2.backup) return;
					// 	_status.event.dialog.content.childNodes[1].innerHTML=
					// 	ui.selected.buttons.length+'/3';
					// };
					event.changeDialog=function(){
						if(ui.cheat2&&ui.cheat2.dialog==_status.event.dialog){
							return;
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
						ui.cheat2=ui.create.control('自由选自机',function(){
							if(this.dialog==_status.event.dialog){

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
								if(_status.bosschoice){
									_status.bosschoice.animate('controlpressdownx',500);
									_status.bosschoice.classList.remove('disabled');
								}
							}
							else{
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
								if(_status.bosschoice){
									_status.bosschoice.classList.add('disabled');
								}
							}
						});
						if(lib.onfree){
							ui.cheat2.classList.add('disabled');
						}
						delete _status.createControl;
					}
					if(!ui.cheat2&&get.config('free_choose'))
					ui.create.cheat2();

					"step 1"
					if(ui.cheat2){
						ui.cheat2.close();
						delete ui.cheat2;
					}
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
			swapMusic:function(increment){
				if (increment) lib.config.currentMusic = lib.config.currentMusic + 1;
				ui.backgroundMusic.pause();
				setTimeout(function(){
					game.playBackgroundMusic(lib.config.musiccchange[lib.config.currentMusic][0], false, true);
					ui.backgroundMusic.currentTime=lib.config.musiccchange[lib.config.currentMusic][1];
				}, 0);
			},
			playConvo:function(lines){
				var num = 0;
				var step1 = function(){
					var dialog = ui.create.dialog();
					var player = ui.create.div('.avatar', dialog).setBackground(lines[num][0],'character');
					dialog.style.minHeight = '120px';
					dialog.add('<div><div style="width:260px;margin-left:120px;font-size:18px;">'+lines[num][1]+'</div></div>');
					player.style.float = 'left';
					ui.auto.hide();
					dialog.open();
					ui.create.control('继续',function(){
						ui.dialog.close();
						while(ui.controls.length) ui.controls[0].close();
						num ++;
						if (num >= lines.length){
							game.resume();
						} else {
							step1();
						}
					});
					ui.create.control('跳过',function(){
						ui.dialog.close();
						while(ui.controls.length) ui.controls[0].close();
						game.resume();
					});
				};
				game.pause();
				step1();
			},
		},
		boss:{
			stg_scarlet:{
				//chongzheng:0,
				//loopType:2,
				checkResult:function(player){
					if(player==game.boss&&game.boss.name!='remilia'){
						return false;
					}
				},
				init:function(){
					//lib.init.layout('newlayout');
					var list=['reidaisai', 'saiqianxiang', 'caifang'];
					var map={
						reidaisai:'stg_lingji',
						saiqianxiang:'stg_mingyun',
						caifang:'stg_bawu',
					};
					for(var i=0;i<list.length;i++){
						if (!lib.card[list[i]].forbid) lib.card[list[i]].forbid = ['stg'];
						else lib.card[list[i]].forbid.push('stg');
						game.removeCard(list[i], map[list[i]]);
					}
					game.addGlobalSkill('stg_mingyun');
					game.addGlobalSkill('stg_mingyun2');
					game.addGlobalSkill('stg_lingji');
					_status.additionalReward=function(){
						return 500;
					}
					ui.background.setBackgroundImage('image/background/yongyuan.jpg');
					game.playBackgroundMusic('music_default');
					ui.backgroundMusic.currentTime=137;
					ui.backgroundMusic.play();
					game.me.storage.reinforce = ['stg_yousei','stg_yousei','rumia'];
					//game.me.storage.reinforce = ['rumia'];
					if (game.me.name == 'reimu'){
						game.me.storage.dialog = [
							['reimu','好舒服呢','因为每次白天出来妖怪都很少这次才试着在夜里出来的……','不过该往哪边走都搞不清楚了这么暗',
								'但是……夜里的境内还真够浪漫呢','','呃，你谁啊？','','人类在一片漆黑的地方本来就看不到东西啊(刚刚见过吗？)',''
								,'那种人你就算抓来吃了也无所谓啊','','不过，你很碍事呢','','良药苦口这句话你有听过吗？','end'],
							['rumia','就是说啊～还会出现妖怪，真是受不了啊','','刚刚不是见过了吗你难不成是夜盲症吗？','','是吗？我好像也看到过只在夜里才活动的人呢'
							,'','是——这样吗？','','在我眼前的就是吃了也没关系的人类？','']
						];
					} else if (game.me.name == 'marisa'){
						game.me.storage.dialog = [
							['marisa','这种心情，是要怎么说来着……？','要是那家伙呢肯定会说“感觉真不错呢”','我可是不喜欢夜晚，只有奇怪的家伙而已','',
							'谁也没有说是你啊。','','不过，干嘛把手伸得这么直啊。','','看上去像是“人类采用了十进制”','end'],
							['rumia','你说谁是奇怪的家伙啊','','那个嘛，当然。','','看上去像不像是“圣人被钉在十字架上”？',''],
						];
					}
					game.me.storage.tongguan = 0;
					game.me.storage.stage = 'boss_chiyan2x';
					game.me.storage.fuhuo = 1;
					if (get.config('practice_mode')){
						game.me.storage.fuhuo = 10;
					}
					game.me.storage.unskill = ['yuezhi'];
					lib.config.musiccchange=[
						['music_default', 137],
						['music_default', 397],
						['music_default', 693],
						['music_default', 1039],
						['music_default', 1338],
						['music_default', 1688],
						['music_default', 2331],
						['music_default', 2715],
						['music_default', 3105],
						['music_default', 3463],
						['music_default', 3621],
						['music_default', 3980],
					];
					lib.config.currentMusic = 0;
					/* 这里是把牌换成红魔乡风格的。需要一个法子检测皮肤有没有下载。
					for (var i1 in lib.config.skinSet[1]){
						if (lib.config.skinSet[1][i1] == 0){
							delete lib.config.skin[i1];
						} else {
							lib.config.skin[i1] = lib.config.skinSet[1][i1];
						}
					}
					for(var f=0;f<ui.cardPile.childElementCount;f++){
						ui.cardPile.childNodes[f].node.image.setBackground(ui.cardPile.childNodes[f].name, 'card');
					}
					*/
					game.me.addSkill('revive');
					game.me.addSkill('reinforce');
					if (lib.config.connect_nickname == '黑白葱') game.me.addSkill('finalspark');
					game.me.addSkill('handcard_max');
				},
				gameDraw:function(player){
					if (player == game.boss) return 4;
					if (player == game.me) return 4;
					return 0;
				},
			},
			stg_scarlet_ex:{
				checkResult:function(player){
					if(player==game.boss&&game.boss.name!='flandre'){
						return false;
					}
				},
				init:function(){
					//lib.init.layout('newlayout');
					var list=['reidaisai', 'saiqianxiang', 'caifang'];
					var map={
						reidaisai:'stg_lingji',
						saiqianxiang:'stg_pohuai',
						caifang:'stg_fengyin',
					};
					for(var i=0;i<list.length;i++){
						if (!lib.card[list[i]].forbid) lib.card[list[i]].forbid = ['stg'];
						else lib.card[list[i]].forbid.push('stg');
						game.removeCard(list[i], map[list[i]]);
					}
					game.addGlobalSkill('stg_lingji');
					game.addGlobalSkill('stg_pohuai');
					_status.additionalReward=function(){
						return 500;
					}
					ui.background.setBackgroundImage('image/background/stg_basement.jpg');
					
					game.me.storage.reinforce = ['stg_yousei','stg_yousei','patchouli','stg_maid','stg_maid','stg_maid','flandre'];
					//game.me.storage.reinforce = ['flandre'];
					if (game.me.name == 'reimu'){
						game.me.storage.dialog = [
							['reimu','今天比平常还要热呢。这么激烈的攻击难道就是因为刚才的女孩子变得奇怪了的缘故？','','还有其他奇怪的家伙在啊？','谁？上次来的时候我感觉好像你不在的……',
								'','啊啊，没错','','啊啊，是人类啊人类是比红茶还要复杂的东西呢……至少大部分人都是呢','','啊－？',''
								,'对于你来说，人类要由谁来宰杀呢？','','姐姐大人？你是说那个叫蕾普莉卡的恶魔？','',
								'那家伙的话，我觉得她绝对不会做料理的呢','','我有话想对小妹你说你家姐姐大人经常跑到我家神社里去很烦人呢,能不能帮我说说她啊','',
								'不要','','是需要注意人物呢，过去是不是做了什么事啊？','','还真是问题儿童呢','','玩什么？','','啊啊，模式化游戏呢。那个可是我得意的领域哦','end'],
							['flandre','太天真了！那里的红白！','','在是在，没看到而已。不过，你难道是人类？','','不隐瞒一下吗？在我看来人类就和饮料没什么分别'
							,'','看，所谓的鸡','','就算是不懂得宰杀的人也能饱尝其美味','','这个呢？首先不可能是让姐姐大人来做的……','','蕾米莉亚！是蕾米莉亚姐姐大人啊',
							'','不会做','','我知道啊，我也打算去……','','被阻止了，外面下着暴雨没法走','','什么都不可能做的。我在这495年间，一次都没有外出过啊','','飞到那边有游戏用的玩具……',
							'','弹幕游戏',''],];
					} else if (game.me.name == 'marisa'){
						game.me.storage.dialog = [
							['marisa','究竟怎么了？这洋馆现在蕾米莉亚应该在神社里的啊。为啥，这里的攻击还是这么激烈呢？','','我啥也没叫','你什么人？','','啊啊，我？是啊，博丽灵梦，是个巫女','',
							'你是…什么东西？（是不是当护士会更合适呢？）','','都在？','','真好，我每星期只能休息两天','','姐姐大人？你是妹妹','','不是蛮不错的吗。你看你看，就好好给你看个够吧','',
							'你出多少？','','一个的话，连人命也买不起啊','end'],
							['flandre','你叫了什么吗？','','问别人姓名之前要……','','我叫芙兰朵露哦魔理沙小姐（当巫女有点勉强呢）','','我一直都在这个家里。包括你混进这个家的时候',''
							,'一直都在地下休息啊，大概495年左右','','我一直都有和姐姐大人保持联络的从她那里听说了','','我也想到外面的世界去，看看所谓的人长得什么样子','','能陪我一起玩吗？',
							'','一个硬币',''],
						];
					}
					game.me.storage.tongguan = 0;
					game.me.storage.fuhuo = 0;
					if (get.config('practice_mode')){
						game.me.storage.fuhuo = 10;
					}
					lib.character['flandre'] = ['female','5',4,['kuangyan', 'flaninit'],[]];
					lib.skill['kuangyan'].trigger = {player:'phaseUseBegin'};
					lib.translate['kuangyan'] = '狂宴（改）';
					lib.translate['kuangyan_info'] = '出牌阶段开始时，你可以弃置攻击范围内的所有其他角色各一张牌；然后，对其中没有手牌的角色各造成1点弹幕伤害；你发动此技能后，此技能改为锁定技，直到一名角色坠机。';
					game.me.storage.reskill = ['fourof','starbow','chiyan_ex_win'];
					lib.character['patchouli'] = ['female','4',3,['qiyao','riyin','silent'],[]];
					game.me.addSkill('revive');
					game.me.addSkill('reinforce');
					lib.config.musiccchange = [
						['magicalgirl', 0],
						['death', 0],
					];
					lib.config.currentMusic=0;
					/* 这里是把牌换成红魔乡风格的。需要一个法子检测皮肤有没有下载。
					for (var i1 in lib.config.skinSet[1]){
						if (lib.config.skinSet[1][i1] == 0){
							delete lib.config.skin[i1];
						} else {
							lib.config.skin[i1] = lib.config.skinSet[1][i1];
						}
					}
					for(var f=0;f<ui.cardPile.childElementCount;f++){
						ui.cardPile.childNodes[f].node.image.setBackground(ui.cardPile.childNodes[f].name, 'card');
					}
					*/
					game.playBackgroundMusic('magicalgirl');
					ui.backgroundMusic.play();
					//ui.backgroundMusic.removeEventListener("timeupdate", swapMusic, true);
					if (lib.config.connect_nickname == '黑白葱')  game.me.addSkill('finalspark');
					game.me.addSkill('handcard_max');
				},
				gameDraw:function(player){
					if (player.name == 'flandre') return 0;
					if (player == game.boss) return 0;
					if (player == game.me) return 4;
					return 0;
				},
			},
			stg_cherry:{
				checkResult:function(player){
					if(player==game.boss&& (game.boss.name!='yuyuko' || !game.boss.hasSkill('stg_fanhun'))){
						return false;
					}
				},
				init:function(){
					//lib.init.layout('newlayout');
					var list=['reidaisai', 'saiqianxiang', 'caifang'];
					var map={
						reidaisai:'stg_lingji',
						saiqianxiang:'stg_sidie',
						caifang:'stg_louxie',
					};
					for(var i=0;i<list.length;i++){
						if (!lib.card[list[i]].forbid) lib.card[list[i]].forbid = ['stg'];
						else lib.card[list[i]].forbid.push('stg');
						game.removeCard(list[i], map[list[i]]);
					}
					ui.create.card(ui.skillPile).init([null, 0, 'stg_jiejie']);
					ui.create.card(ui.skillPile).init([null, 0, 'stg_jiejie']);
					game.addGlobalSkill('stg_lingji');
					game.addGlobalSkill('stg_sidie');
					game.addGlobalSkill('stg_cherry_effect');
					_status.additionalReward=function(){
						return 500;
					}
					ui.background.setBackgroundImage('image/background/baka.jpg');

					lib.character['cirno'] = ['female', '2', 2, ['jidong', 'bingbi']];
					game.me.storage.reinforce = ['stg_yousei','stg_yousei', 'cirno', 'stg_yousei', 'letty'];
					//game.me.storage.reinforce = ['rumia'];
					if (game.me.name == 'reimu'){
						game.me.storage.dialog = [
							['reimu','真冷~','真希望老天能注意点啊','要是平常，现在早就是睡觉的季节了',
								'','不管是不是，对于你们来说不都是永眠吗？','','虽然也有人这么做，不过不是我','','啊～啊、春眠也没办法让自己暖和起来啊'
								,'','闭嘴，像你这种人睡着了，天气就能稍微暖和点了！','end'],
							['letty','春眠不觉晓、是吗？','','不过说起来，人类不冬眠吗？分明是哺乳类','','那就让我来赐你一眠。安详的春眠'
							,'','变暖和的话就会睡着这一点上和我们一样的。还有，马醉木的花也差不多','']
						];
					} else if (game.me.name == 'marisa'){
						game.me.storage.dialog = [
							['marisa','为什么，我会在这种地方？','冬天里在雪山上很容易遇难的','','因为冬天里没有山是不积雪的。',
							'','我是很普通的','','是啊。本来这个时候，应该是人类们在樱花树下沉眠的季节了','','振作点，在这寒冷的地方睡着是会冻死的','end'],
							['letty','为什么会容易遇难，你知道吗？','','果然，你也是遇难者？','','可怜的人啊，已经被冻得神志不清了','','今年的冬季很长啊。我也差不多想要去春眠了呢',''],
						];
					} else if (game.me.name == 'sakuya'){
						game.me.storage.dialog = [
							['sakuya','啊啊真是的，就算打倒再多这样的杂鱼也没任何意义！还是尽快让黑幕登场才好','','你就是黑幕啊<br>那么，快点','',
							'在这种地方的话黑幕也好普通也好<br>都关系不大了的说～说起来，现在什么不普通你知道么？','','哎呀没错','','没错。<br>果然，你这家伙就是黑幕啊','end'],
							['letty','黑幕～','','先稍微等一下！虽然我是黑幕不过是普通的','','比起历年来，雪的结晶都要大不少大概３倍左右','','还有一件事就是脑子不好使的女仆在空中飞',''],
						];
					}
					game.me.storage.tongguan = 0;
					game.me.storage.stage = 'boss_cherry2';
					game.me.storage.fuhuo = 1;
					if (get.config('practice_mode')){
						game.me.storage.fuhuo = 10;
					}
					game.me.storage.unskill = ['baofengxue'];
					lib.config.musiccchange=[
						['music_cherry', 226],
						['music_cherry', 570],
						['music_cherry', 733],
						['music_cherry', 935],
						['music_cherry', 1093],
						['music_cherry', 1314],
						['music_cherry', 1602],
						['music_cherry', 2154],
						['music_cherry', 2563],
						['music_cherry', 2729],
						['music_cherry', 2902],
						['music_cherry', 3079],
						['music_cherry', 3383],    // 反魂蝶BGM
						['music_cherry', 3548],
					];
					lib.config.currentMusic = 0;
					/* 这里是把牌换成妖妖梦风格的。需要一个法子检测皮肤有没有下载。
					for (var i1 in lib.config.skinSet[0]){
						if (lib.config.skinSet[0][i1] == 0){
							delete lib.config.skin[i1];
						} else {
							lib.config.skin[i1] = lib.config.skinSet[0][i1];
						}
					}
					for(var f=0;f<ui.cardPile.childElementCount;f++){
						ui.cardPile.childNodes[f].node.image.setBackground(ui.cardPile.childNodes[f].name, 'card');
					}
					*/
					game.swapMusic();
					game.me.addSkill('revive');
					game.me.addSkill('reinforce');
					if (lib.config.connect_nickname == '黑白葱') game.me.addSkill('finalspark');
					game.me.addSkill('handcard_max');
				},
				gameDraw:function(player){
					if (player == game.boss) return 4;
					if (player == game.me) return 4;
					return 0;
				},
			},
			global:{
				loopType:1,
				chongzheng:6
			},
		},
		skill:{
			stg_mingyun:{
				direct:true,
				trigger:{player:'drawAfter'},
				filter:function(event,player){
					if (!_status.event.getParent('phaseDraw')) return false;
					for (var i = 0; i < event.num; i ++){
						if (player.countCards('h') < i){
							return false;
						}
						if (player.getCards('h')[i].name == 'stg_mingyun'){
							return true;
						}
					}
					return false;
				},
				content:function(){
					player.chooseToUse(function(card){
						return card.name == 'stg_mingyun';
					},'这……这就是命运的指示？');
				},
			},
			stg_mingyun2:{
				audio:2,
				trigger:{global:'judge'},
				filter:function(event,player){
					return player.countCards('h',{name:'stg_mingyun'})>0;
				},
				direct:true,
				content:function(){
					"step 0"
					player.chooseCard(get.translation(trigger.player)+'的'+(trigger.judgestr||'')+'判定为'+
					get.translation(trigger.player.judging[0])+'，'+'是否打出命运之光替换之','h',function(card){
						return card.name == 'stg_mingyun';
					}).set('ai',function(card){
						var trigger=_status.event.getTrigger();
						var player=_status.event.player;
						var judging=_status.event.judging;
						var result=trigger.judge(card)-trigger.judge(judging);
						var attitude=get.attitude(player,trigger.player);
						if(attitude==0||result==0) return 0;
						if(attitude>0){
							return result;
						}
						else{
							return -result;
						}
					}).set('judging',trigger.player.judging[0]);
					"step 1"
					if(result.bool){
						player.respond(result.cards,'highlight');
					}
					else{
						event.finish();
					}
					"step 2"
					if(result.bool){
						player.$skill('命运之光');
						player.logSkill('_stg_mingyun2');
						player.$gain2(trigger.player.judging[0]);
						player.gain(trigger.player.judging[0]);
						trigger.player.judging[0]=result.cards[0];
						if(!get.owner(result.cards[0],'judge')){
							trigger.position.appendChild(result.cards[0]);
						}
						game.log(trigger.player,'的判定牌改为',result.cards[0]);
					}
					"step 3"
					game.delay(2);
				},
				ai:{
					tag:{
						rejudge:1
					}
				}
			},
			stg_lingji:{
				trigger:{player:'damageBefore'},
				direct:true,
				filter:function(event,player){
					return player.countCards('h', {name:'stg_lingji'});
				},
				content:function(){
					'step 0'
					var next = player.chooseToUse({
						filterCard:function(card,player){
							if(card.name!='stg_lingji') return false;
							var mod=game.checkMod(card,player,'unchanged','cardEnabled',player.get('s'));
							if(mod!='unchanged') return mod;
							return true;
						},
						prompt:'是否使用【灵击】无效该伤害？',});
					next.set('ai1',function(){
						var target=_status.event.player;
						var evt=_status.event.getParent();
						var sks=target.get('s');
						return 1;
					});
				},
			},
			stg_pohuai:{
				enable:'chooseToUse',
				filterCard:function(card){
					return card.name=='stg_pohuai';
				},
				viewAsFilter:function(player){
					return player.countCards('h',{name:'stg_pohuai'})>0;
				},
				viewAs:{name:'danmakucraze'},
				prompt:'将【破坏之果】当【弹幕狂欢】使用',
				check:function(card){return 5-get.value(card)},
			},
			// 拿复活币复活。game.me.storage.fuhuo 是复活币的数量。
			revive:{
				trigger:{player:'dieBefore'},
				direct:true,
				filter:function(event,player){
					return player.storage.fuhuo;
				},
				content:function(){
					event.cards=player.getDiscardableCards(player, 'hej');
                    //player.$throw(event.cards,1000);
                    player.discard(event.cards);
                    //game.log(player,'弃置了',event.cards);
					game.playAudio('effect','die_female');
					if (player.isTurnedOver()){
						player.turnOver();
					}
					player.node.turnedover.innerHTML = '';
					player.node.turnedover.setBackgroundImage('');
                    player.node.turnedover.style.opacity=0.7;
					game.delay(3);
					setTimeout(function(){
						game.log(player,'消耗了1个残机复活');
						player.node.turnedover.style.opacity=0;
						player.hp = player.maxHp;
						player.lili = 2;
						player.update();
						player.storage.fuhuo --;
						player.draw(4);
						trigger.cancel();
					}, 1000);
				},
			},
			_revive_boss:{
				trigger:{player:'dieBefore'},
				direct:true,
				locked:true,
				fixed:true,
				filter:function(event,player){
					return game.me.storage.reskill && game.me.storage.reskill.length > 0 && player == game.boss;
				},
				content:function(){
					game.log(player,'进入下一个阶段！');
					if (player.maxHp <= 0){
						player.maxHp = 1;
					}
					player.hp = player.maxHp;
					player.lili = player.maxlili;
					player.update();
					player.addSkill(game.me.storage.reskill[0]);
					game.me.storage.reskill.remove(game.me.storage.reskill[0]);
					trigger.cancel();
				},
			},
			// 增援：game.me.storage.reinforce是增援列表（最后一个自动是BOSS），game.me.storage.stage是给boss的，换场景使用的技能
			reinforce:{
				trigger:{player:'phaseBefore'},
				direct:true,
				priority:1000,
				filter:function(event,player){
					var num = 0;
					for (var i = 0; i < game.players.length; i ++){
						if (game.players[i].identity == 'zhu' || game.players[i].identity == 'zhong') num ++;
					}
					return game.me.storage.reinforce.length && num < 2;
				},
				content:function(){
					var num = [1, 2, 3, 5, 6, 7];
					for (var i = 0; i < game.players.length; i ++){
						if (game.players[i].identity == 'zhu' || game.players[i].identity == 'zhong') num.splice(num.indexOf(parseInt(game.players[i].dataset.position)), 1);
					}
					if (game.me.storage.reinforce.length > 1){
						game.addBossFellow(num.randomGet(),game.me.storage.reinforce[0],parseInt(lib.character[game.me.storage.reinforce[0]][1]));
						game.me.storage.reinforce.remove(game.me.storage.reinforce[0]);
					} else {	
						game.boss.addSkill('boss_chiyan2');
					}
				},
			},
			// 手牌上限+关卡数
			// 同时，装备不能弃置/获得也在这里进行。
			handcard_max:{
				alter:true,
				intro:{
					content:function(storage, player){
						return '手牌上限+'+(player.storage.tongguan || 0)+"<br>你的宝具牌不能被弃置/获得。";
					}
				},
				mod:{
					maxHandcard:function(player,num){
						/*
						var nums = 0;
						for (var i = 0; i < game.players.length; i ++){
							if (game.players[i].identity == 'zhu' || game.players[i].identity == 'zhong') nums ++;
						}
						if (nums != 0) return num;
						return Infinity;
						*/
						return num + (player.storage.tongguan || 0);
					},
					canBeDiscarded:function(card,player,target,event){
						if(get.is.altered('handcard_max')&&get.subtype(card) == 'equip4') return false;
					},
					cardDiscardable:function(card,player,target,event){
						if(get.is.altered('handcard_max')&&get.subtype(card) == 'equip4') return false;
					},
					canBeGained:function(card,player,target,event){
						if(get.is.altered('handcard_max')&&get.subtype(card) == 'equip4') return false;
					},
					cardGainable:function(card,player,target,event){
						if(get.is.altered('handcard_max')&&get.subtype(card) == 'equip4') return false;
					},
				},
			},
			// 直接秒一个人
			finalspark:{
				enable:'phaseUse',
				selectTarget:1,
				filterTarget:function(){
					return true;
				},
				content:function(){
					targets[0].damage(10);
				}
			},
			// 红魔乡 （正常），直到1951行
			// 第一关
			boss_chiyan:{
				trigger:{global:'gameStart'},
				forced:true,
				popup:false,
				unique:true,
				fixed:true,
				content:function(){
					"step 0"
					player.hide();
					game.addVideo('hidePlayer',player);
					player.delete();
					game.players.remove(player);
					game.dead.remove(player);
					event.target = game.me; 
					"step 1"
					var list = [];
					if (event.target.name == 'marisa'){
						list = ['stg_missile', 'stg_bagua'];
						event.target.removeSkill('stardust');
					} else if (event.target.name == 'reimu'){
						list = ['stg_needle','stg_yinyangyu'];
						event.target.removeSkill('mengxiang');
					}
					for(var i=0;i<list.length;i++){
						list[i]=['','',list[i]];
					}
					if (list.length){
						event.target.chooseButton(['选择本次闯关使用的装备',[list,'vcard']], true);
					}
					"step 2"
					if (result.bool){
						event.target.equip(game.createCard(result.links[0][2]));
						event.target.maxequip ++;
					}
					"step 3"
					// 制作关卡开始的对话框
					var dialog=ui.create.dialog("第一关<br><br>梦幻夜行绘卷");
					dialog.open();
	                game.pause();
	                var control=ui.create.control('走起！',function(){
	                    dialog.close();
	                    control.close();
	                    game.resume();
	                });
	                lib.init.onfree();
				},
			},
			// 关底对话
			boss_chiyan2:{
				mode:['stg'],
				trigger:{player:'dieBegin'},
				silent:true,
				unique:true,
				fixed:true,
				init:function(event,character){
					var a = [];					// 创建一个对话人数数量长的数列，用于记录玩家和敌人对话位置
					if (!game.me.storage.dialog){	// 没对话就刷出boss然后直接跳过
						if (game.me.storage.reinforce[0]){
							game.changeBoss(game.me.storage.reinforce[0]);
							game.me.storage.reinforce.remove(game.me.storage.reinforce[0]);
							game.me.addSkill(game.me.storage.stage);
						}
						return ;
					}
					for (var h = 0; h < game.me.storage.dialog.length; h++){
						a.push(1);
					}
					var name = game.me.name;		// 记录当前检测名字的
					var j = 0;						// 记录当前检测谁的对话的
					var step1=function(){
						// 读取当前对话
						var dialog = ui.create.dialog();
						for (var i = 0; i < game.me.storage.dialog.length; i ++){
							if (game.me.storage.dialog[i][0] == name){
								// '' = 只有两个人的时候，切换说话人物
								if (game.me.storage.dialog[i][a[j]] === ''){
									a[j] ++;
									if (name == game.boss.name){
										j = 0;		// 切换到主角
										name = game.me.name;
									} else {
										j ++;		// 切换到boss
										// 没boss的话把boss刷出来
										if (game.me.storage.reinforce[0] && game.boss.name != game.me.storage.reinforce[0]){
											game.changeBoss(game.me.storage.reinforce[0]);
											game.me.storage.reinforce.remove(game.me.storage.reinforce[0]);
										}
										name = game.boss.name;
									}
									i = -1;		// 换完了之后从头再来一次
								// 有多少个人的时候，一个数字 = 切换对话人物（切换到dialog[数字]）
								} else if (Number.isInteger(game.me.storage.dialog[i][a[j]])){
									name = game.me.storage.dialog[game.me.storage.dialog[i][a[j]]][0];		// 切换到记录的数字的位置的[0]
									a[j] ++;
									j = game.me.storage.dialog[i][a[j] - 1];
									// 如果是boss的话把boss刷出来
									if (game.me.storage.reinforce[0] && name == game.me.storage.reinforce[0] && game.boss.name != game.me.storage.reinforce[0]){
										game.changeBoss(game.me.storage.reinforce[0]);
										game.me.storage.reinforce.remove(game.me.storage.reinforce[0]);
									} 
									if (!game.findPlayer(function(current){
										return current.name == name;
									})){
										if (game.findPlayer(function(current){
											return current.dataset.position == 3;
										})){
											game.addBossFellow(5, name, 0);
										} else {
											game.addBossFellow(3, name, 0);
										}
									}
									i = -1;		// 换完了之后从头再来一次
								} else if (game.me.storage.dialog[i][a[j]] == 'end'){
									game.resume();
									return;
								} else {
									var player = ui.create.div('.avatar',dialog).setBackground(name,'character');
									dialog.style.minHeight = '120px';
									dialog.add('<div><div style="width:260px;margin-left:120px;font-size:18px;">'+game.me.storage.dialog[i][a[j]]+'</div></div>');
									player.style.float = 'left';
									//dialog.style.overflow = 'auto';
									a[j] ++;
								}
							}
						}
						ui.auto.hide();
						dialog.open();
						ui.create.control('继续',function(){
							ui.dialog.close();
							while(ui.controls.length) ui.controls[0].close();
							// 检查是否还剩对话
							var num1 = -1;
							for (var i = 0; i < game.me.storage.dialog.length; i ++){
								// 如果对话结束就继续游戏，要不然的话继续对话
								if (game.me.storage.dialog[i][0] == name){
									num1 = i;
									if (game.me.storage.dialog[i][a[j]] == 'end') num1 = -2;
									break;
								}
							}
							// 如果玩家使用的角色并没有对话，跳出boss然后直接跳过所有对话
							if (num1 == -1){
								if (game.me.storage.reinforce[0]){
									game.changeBoss(game.me.storage.reinforce[0]);
									game.me.storage.reinforce.remove(game.me.storage.reinforce[0]);
								}
								game.resume();
							}
							// 已经结束的话，结束对话流程然后游戏继续
							else if (num1 == -2){
								// 如果对话人多的话就把额外的人给删掉
								if (game.me.storage.dialog.length > 2){
									for (var i = 2; i < game.me.storage.dialog.length; i ++){
										for (var k = 0; k < game.players.length; k ++){
											if (game.players[k].name == game.me.storage.dialog[i][0]){
												game.players[k].hide();
												game.addVideo('hidePlayer', game.players[k]);
												game.players[k].delete();
												game.players.remove(game.players[k]);
												k = 10;
											}
										}	
									}
								}
								game.resume();
							}
							else step1();
						});
						ui.create.control('跳过',function(){
							ui.dialog.close();
							while(ui.controls.length) ui.controls[0].close();
							// 如果跳过的时候，boss还没刷出来的话，把boss刷出来
							if (game.me.storage.reinforce[0]){
								game.changeBoss(game.me.storage.reinforce[0]);
								game.me.storage.reinforce.remove(game.me.storage.reinforce[0]);
							}
							// 如果跳过的时候，刷出来了对话露脸的人，把那些人刷掉
							if (game.me.storage.dialog.length > 2){
								for (var i = 2; i < game.me.storage.dialog.length; i ++){
									for (var k = 0; k < game.players.length; k ++){
										console.log(game.players[k]);
										console.log(game.me.storage.dialog[i]);
										if (game.players[k].name == game.me.storage.dialog[i][0]){
											game.players[k].hide();
											game.addVideo('hidePlayer', game.players[k]);
											game.players[k].delete();
											game.players.remove(game.players[k]);
											k = 10;
										}
									}	
								}
							}
							game.resume();
						});
					};
					game.pause();
					if (!game.me.storage.dialog){
						if (game.me.storage.reinforce[0]){
							game.changeBoss(game.me.storage.reinforce[0]);
							game.me.storage.reinforce.remove(game.me.storage.reinforce[0]);
						}
						game.resume();
					} else { 
						step1(); 
					}
					game.me.addSkill(game.me.storage.stage);
				},
				filter:function(event,player){
					return player==game.boss;
				},
				content:function(){
					player.hide();
					game.addVideo('hidePlayer',player);
				}
			},
			// 第二关
			boss_chiyan2x:{
				trigger:{global:'dieAfter'},
				forced:true,
				priority:-10,
				//fixed:true,
				//globalFixed:true,
				unique:true,
				filter:function(event){
					if(lib.config.mode!='stg') return false;
					return event.player==game.boss;
				},
				content:function(){
					'step 0'
					game.boss.hide();
					game.addVideo('hidePlayer',game.boss);
					game.delay();
					'step 1'
					var line;
					if (game.me.name == 'reimu'){
						line = '不过就算说是良药<br>如果不试试的话又怎么知道';
					} else if (game.me.name == 'marisa'){
						line = '就算是这样的家伙<br>打倒了的话春度也应该能增加一点吧？';
					}
					var dialog = ui.create.dialog();
					dialog.add('<div><div style="width:260px;margin-left:120px;font-size:18px">'+line+'</div></div>');
					var playerui =ui.create.div('.avatar',dialog).setBackground(game.me.name,'character');
					dialog.open();
	                game.pause();
	                var control=ui.create.control('下一关',function(){
	                    dialog.close();
	                    control.close();
	                    game.resume();
	                });
					lib.init.onfree();
	                'step 2'
					var dialog=ui.create.dialog("第二关<br><br>湖上的魔精");
					dialog.open();
	                game.pause();
	                var control=ui.create.control('走起！',function(){
	                    dialog.close();
	                    control.close();
	                    game.resume();
	                });
	                lib.init.onfree();
	                'step 3'
					game.addBossFellow(3,'stg_yousei',1);
					game.addBossFellow(5,'stg_maoyu',2);
					'step 4'
					while(_status.event.name!='phaseLoop'){
						_status.event=_status.event.parent;
					}
					game.me.storage.tongguan ++; 
					game.me.storage.reinforce = ['daiyousei','stg_yousei','cirno'];
					game.me.storage.stage = 'boss_chiyan3x';
					if (game.me.name == 'reimu'){
						game.me.storage.dialog = [
							['reimu','这座湖原来是如此宽广的吗？浓雾遮天视野不良真麻烦啊。难不成我是路痴？','',
								'啊啦是吗？那么，带个路吧？这附近有岛对不对？','','靶子？这还真是令人吃惊啊',''],
							['cirno','如果迷路，定是妖精所为','','你啊 可别吓着了喔，在你面前可是有个强敌呢!','','开什么玩笑啊~','像你这样的人，就和英吉利牛肉一起冰冻冷藏起来吧！！'
							,'end'],
						];
					} else if (game.me.name == 'marisa'){
						game.me.storage.dialog = [
							['marisa','我记着岛屿明明是在这附近来着…难道说那个岛屿移动了不成？',
							'而且……现在可是夏天呢为什么天气会这么冷的说？','','是你吧。让天这么冷','',
							'寒酸的家伙','','不对的地方有很多很多哦？','end'],
							['cirno','不会再让你回到陆地上了啊！','','这比热不是要好得多吗？','','听起来好像哪里不对...',''
							],
						];
					}
					game.me.removeSkill('boss_chiyan2x');
					game.me.storage.unskill = ['perfect'];
					ui.background.setBackgroundImage('image/background/baka.jpg');
					lib.character['daiyousei'][1] = '2';
					game.resetSkills();
					_status.paused=false;
					_status.event.player=game.me;
					_status.event.step=0;
					_status.roundStart=game.me;
					ui.backgroundMusic.play();
					//game.phaseNumber=0;
					//game.roundNumber=0;
					if(game.bossinfo){
						game.bossinfo.loopType=1;
					}
				}
			},
			// 第三关
			boss_chiyan3x:{
				trigger:{global:'dieAfter'},
				forced:true,
				priority:-10,
				//fixed:true,
				//globalFixed:true,
				unique:true,
				filter:function(event){
					if(lib.config.mode!='stg') return false;
					return event.player==game.boss;
				},
				content:function(){
					'step 0'
					game.boss.hide();
					game.addVideo('hidePlayer',game.boss);
					game.delay();
					'step 1'
					var line;
					if (game.me.name == 'reimu'){
						line = '啊啊，越来越冷了啊这样会得空调病的啊';
					} else if (game.me.name == 'marisa'){
						line = '啊啊，短袖对身体不好赶快去找个能招待我喝茶的房子好了嗯，就这么办';
					}
					var dialog = ui.create.dialog();
					dialog.add('<div><div style="width:260px;margin-left:120px;font-size:18px">'+line+'</div></div>');
					var playerui =ui.create.div('.avatar',dialog).setBackground(game.me.name,'character');;
					dialog.open();
	                game.pause();
	                var control=ui.create.control('下一关',function(){
	                    dialog.close();
	                    control.close();
	                    game.resume();
	                });
	                lib.init.onfree();
	                'step 2'
					var dialog=ui.create.dialog("第三关<br><br>红色之境");
					dialog.open();
	                game.pause();
	                var control=ui.create.control('走起！',function(){
	                    dialog.close();
	                    control.close();
	                    game.resume();
	                });
	                lib.init.onfree();
	                'step 3'
					game.addBossFellow(5,'stg_maid',2);
					game.addBossFellow(3,'stg_maoyu',2);
					'step 4'
					while(_status.event.name!='phaseLoop'){
						_status.event=_status.event.parent;
					}
					game.me.storage.tongguan ++; 
					game.me.storage.reinforce = ['stg_maid','meiling'];
					game.me.storage.stage = 'boss_chiyan4x';
					if (game.me.name == 'reimu'){
						game.me.storage.dialog = [
							['reimu','','你是不会往啥都没有的地方逃的对吧？','','顺便问下，你是什么人？','','	我只是个当巫女的普通人来着啊',''
							,'不要传谣了！','end'],
							['meiling','啊啦，就算你跟着我过来这边也是什么都没有的啊？','','嗯——逃的时候就只想着逃的事情了',''
							,'哎—普通人哟你是普通之外的说','','那可真是太好了','确实有……巫女是吃了也没问题的人类之类的传说呢……',''],
						];
					} else if (game.me.name == 'marisa'){
						game.me.storage.dialog = [
							['marisa','好久不见了呢。','','就在刚才吧？','','好了，不要碍事了','你就是这里看门的吧？','','果然，你是看门的吧？',
							'','也就是说，普通人呢','那就让我给你点惩罚吧～',''],
							['meiling','咦？我们什么时候开始成了熟人？','','呜呜，遇到奇怪的人了啊。','','正因为是门卫才要碍你的事啊','',
							'只是个做门卫的普通人哦。','','你这家伙，究竟受的什么教育啊～','end'],
						];
					}
					game.me.removeSkill('boss_chiyan3x');
					game.me.storage.unskill = ['jicai'];
					game.me.storage.reskill = ['shogon'];
					game.resetSkills();
					_status.paused=false;
					_status.event.player=game.me;
					_status.event.step=0;
					_status.roundStart=game.me;
					ui.backgroundMusic.play();
					//game.phaseNumber=0;
					//game.roundNumber=0;
					ui.background.setBackgroundImage('image/background/stg_scarlet.jpg');
					if(game.bossinfo){
						game.bossinfo.loopType=1;
					}
				}
			},
			// 第四关
			boss_chiyan4x:{
				trigger:{global:'dieAfter'},
				forced:true,
				priority:-10,
				//fixed:true,
				//globalFixed:true,
				unique:true,
				filter:function(event){
					if(lib.config.mode!='stg') return false;
					return event.player==game.boss;
				},
				content:function(){
					'step 0'
					game.boss.hide();
					game.addVideo('hidePlayer',game.boss);
					game.delay();
					event.list = [];
					if (game.me.name == 'reimu'){
						event.list = ['那么，领路就拜托你了哦'];
					} else if (game.me.name == 'marisa'){
						event.list = ['果然，和普通人战斗，不符合我的性格呢。'];
					}
					'step 1'
					var dialog = ui.create.dialog();
					dialog.add('<div><div style="width:260px;margin-left:120px;font-size:18px">'+event.list[0]+'</div></div>');
					var playerui =ui.create.div('.avatar',dialog).setBackground(game.me.name,'character');
					dialog.open();
	                game.pause();
                	var control=ui.create.control('下一关',function(){
	                    dialog.close();
	                    control.close();
	                    game.resume();
	                });
	                lib.init.onfree();
	                'step 2'
					var dialog=ui.create.dialog("第四关<br><br>漆黑之馆");
					dialog.open();
	                game.pause();
	                var control=ui.create.control('走起！',function(){
	                    dialog.close();
	                    control.close();
	                    game.resume();
	                });
	                lib.init.onfree();
	                'step 3'
					game.addBossFellow(3,'stg_maid',2);
					game.addBossFellow(5,'stg_bookshelf',0);
					'step 4'
					while(_status.event.name!='phaseLoop'){
						_status.event=_status.event.parent;
					}
					game.me.storage.tongguan ++; 
					game.me.storage.fuhuo ++;
					game.log(game.me,'获得了一个残机！');
					game.notify(get.translation(game.me) + '获得了一个残机');
					game.me.storage.reinforce = ['koakuma','patchouli'];
					game.me.storage.stage = 'boss_chiyan5x';
					if (game.me.name == 'reimu'){
						game.me.storage.dialog = [
							['reimu','这家人屋里都不安窗户的吗？','而且从外面看的时候感觉有这么大吗？','',
							'书房？（红白？）','','我那里就算年中无休也一个参拜客也没有哦','','说起来在这么暗的屋子里能读书吗？',
							'','所以说～我才不是夜盲症什么的','切，才不是想说这个呢','你就是这里的主人吗？','','放出的雾太多了，很令人困扰啊',''],
							['patchouli','那边的红白！','不准在我的书房里捣乱','','这里的书价值能比得上你家神社５年份的香火钱呢','',
							'嘛你的神社也就只有那种程度的价值了','','我可不是像你一样的夜盲症患者','','你找大小姐有什么事？','',
							'那么，就绝对不可以让你去见大小姐了','end'],
						];
					} else if (game.me.name == 'marisa'){
						game.me.storage.dialog = [
							['marisa','哇啊，好多书啊','等一下全都爽快地借走','','就要拿','','（书里有这个？）','',
							'不是因为房间太暗了吗？','','要说的话是缺维生素A','','我不缺，我什么都很充足呢','','我是很美味的哦',''],
							['patchouli','不要拿','','让我看看，如何把眼前的黑色给消极地处理掉…','','嗯～，最近，眼睛不太好了'
							,'','是不是身体里铁不足啊','','那你呢？','','那我就不客气了，可以吗','','让我看看，简单又能除去素材腥味的烹饪法是…','end'],
						];
					}
					game.me.removeSkill('boss_chiyan4x');
					game.me.storage.unskill = ['xianzhe'];
					game.me.storage.reskill=['patchyspell'];
					game.resetSkills();
					_status.paused=false;
					_status.event.player=game.me;
					_status.event.step=0;
					_status.roundStart=game.me;
					ui.background.setBackgroundImage('image/background/stg_library.jpg');
					ui.backgroundMusic.play();
					//game.phaseNumber=0;
					//game.roundNumber=0;
					if(game.bossinfo){
						game.bossinfo.loopType=1;
					}
				}
			},
			// 第五关
			boss_chiyan5x:{
				trigger:{global:'dieAfter'},
				forced:true,
				priority:-10,
				//fixed:true,
				//globalFixed:true,
				unique:true,
				filter:function(event){
					if(lib.config.mode!='stg') return false;
					return event.player==game.boss;
				},
				content:function(){
					'step 0'
					game.boss.hide();
					game.addVideo('hidePlayer',game.boss);
					game.delay();
					event.list = [];
					event.string = game.me.name;
					if (game.me.name == 'reimu'){
						event.list = ['不许碍事'];
					} else if (game.me.name == 'marisa'){
						event.string = game.boss.name;
						event.list = ['呜呜，因为贫血<br>所以魔法咏唱不下去了'];
					}
					'step 1'
					var dialog = ui.create.dialog();
					dialog.add('<div><div style="width:260px;margin-left:120px;font-size:18px">'+event.list[0]+'</div></div>');
					var playerui =ui.create.div('.avatar',dialog).setBackground(event.string,'character');
					dialog.open();
	                game.pause();
                	var control=ui.create.control('下一关',function(){
	                    dialog.close();
	                    control.close();
	                    game.resume();
	                });
	                lib.init.onfree();
					'step 2'
					var dialog=ui.create.dialog("第五关<br><br>红月之下潇洒的从者");
					dialog.open();
	                game.pause();
	                var control=ui.create.control('走起！',function(){
	                    dialog.close();
	                    control.close();
	                    game.resume();
	                });
	                lib.init.onfree();
	                'step 3'
					game.addBossFellow(3,'stg_maid',2);
					game.addBossFellow(4,'stg_maid',2);
					game.addBossFellow(5,'stg_maid',2);
					'step 4'
					while(_status.event.name!='phaseLoop'){
						_status.event=_status.event.parent;
					}
					game.me.storage.tongguan ++; 
					game.me.storage.reinforce = ['stg_maid','sakuya'];
					game.me.storage.stage = 'boss_chiyan6x';
					if (game.me.name == 'reimu'){
						game.me.storage.dialog = [
							['reimu','','你—看上去不是这里的主人呢','','（看样子如果说是去打倒她的的话她就不会让我过了呢）','',
							'被软禁了吗？','','那问不暗的你也行啦','在这一带放出大雾的是你们对吧？','那个很烦人啊你们有什么目的？','',
							'我可不喜欢那样能请你们住手么？','','那就叫她出来','','我要是在这里大闹一场的话她会不会出来呢？',''],
							['sakuya','啊—没法继续扫除了！','这不是会惹大小姐生气吗！！','','怎么回事？是大小姐的客人吗？','',
							'不让你过去的哦','大小姐很少见人的','','大小姐喜欢暗的地方','','阳光很碍事啊大小姐就喜欢昏昏暗暗的','',
							'这个请你去和大小姐商量','','喂，我没有理由让主人遇到危险的对吧？','','但是，你是见不到大小姐的',
							'为此，即使要停止时间我也要拖延你的脚步','end'],
						];
					} else if (game.me.name == 'marisa'){
						game.me.storage.dialog = [
							['marisa','','竟然会出现女仆啊','抓住她的话，会不会扯上华盛顿公约呢？','','不要你可怜','','啊啊，那好像也不错呢',
							'','不会呢','','（被发现了啊）不如说是负责修缮的','','负责恋爱就属于中学部了吗','','也就是说，我要是打倒你的话就能成为女仆长了呢。',
							'','啊，相当正常嘛那种事情','','end'],
							['sakuya','啊—这样就没法打扫了！','这不是会惹大小姐生气吗！！','','啊啊，魔法使可是受《生类怜悯令》保护呢。',
							'','是吗？','难道你也被这个洋馆雇佣了吗？','','不过，你看起来也不像会打扫卫生的样子呢。','',
							'那你是负责什么的？负责恋爱的？','','那是什么啊又不是在小学里','','好了，还是赶快让我着手工作吧。',
							'忘了说了，我呢，是这里的女仆长——咲夜。','','嘴上那么说最后惨败的人，','我见过的就比钍衰变链的数目还要多呢','','你的时间也是属于我的…古旧魔女胜利的希望，是零。','end'],
						];
					}
					game.me.removeSkill('boss_chiyan5x');
					game.me.storage.skill = ['sakuyainit'];
					game.me.storage.unskill = ['world'];
					game.me.storage.reskill=['perfectSquare'];
					ui.background.setBackgroundImage('image/background/stg_scarletstairs.jpg');
					game.resetSkills();
					_status.paused=false;
					_status.event.player=game.me;
					_status.event.step=0;
					_status.roundStart=game.me;
					ui.backgroundMusic.play();
					//game.phaseNumber=0;
					//game.roundNumber=0;
					if(game.bossinfo){
						game.bossinfo.loopType=1;
					}
				}
			},
			// 第六关
			boss_chiyan6x:{
				trigger:{global:'dieAfter'},
				forced:true,
				priority:-10,
				//fixed:true,
				//globalFixed:true,
				unique:true,
				filter:function(event){
					if(lib.config.mode!='stg') return false;
					return event.player==game.boss;
				},
				content:function(){
					'step 0'
					game.boss.hide();
					game.addVideo('hidePlayer',game.boss);
					game.delay();
					event.list = [];
					event.string = game.me.name;
					if (game.me.name == 'reimu'){
						event.string = game.boss.name;
						event.list = ['好强……但是，大小姐的话也许'];
					} else if (game.me.name == 'marisa'){
						event.list = ['就算不是女仆，<br>是不是也能当女仆长啊？'];
					}
					'step 1'
					var dialog = ui.create.dialog();
					dialog.add('<div><div style="width:260px;margin-left:120px;">'+event.list[0]+'</div></div>');
					var playerui =ui.create.div('.avatar',dialog).setBackground(event.string,'character');
					dialog.open();
	                game.pause();
                	var control=ui.create.control('下一关',function(){
	                    dialog.close();
	                    control.close();
	                    game.resume();
	                });
	                lib.init.onfree();
					'step 2'
					var dialog=ui.create.dialog("最终关<br><br>在乐土上洒下血雨");
					dialog.open();
	                game.pause();
	                var control=ui.create.control('走起！',function(){
	                    dialog.close();
	                    control.close();
	                    game.resume();
	                });
	                lib.init.onfree();
	                'step 3'
					game.addBossFellow(3,'stg_bat',1);
					game.addBossFellow(4,'stg_bat',1);
					game.addBossFellow(5,'stg_bat',1);
					game.addBossFellow(6,'stg_bat',1);
					'step 4'
					while(_status.event.name!='phaseLoop'){
						_status.event=_status.event.parent;
					}
					game.me.storage.tongguan ++; 
					game.me.storage.fuhuo ++;
					game.log(game.me,'获得了一个残机！');
					game.notify(get.translation(game.me) + '获得了一个残机');
					game.me.storage.reinforce = ['sakuya','remilia'];
					if (game.me.name == 'reimu'){
						game.me.storage.dialog = [ 
							['reimu','差不多也该现出你的原形了吧？','大小姐？','','刚才的女仆原来是人类啊','','一个人的话又不是大量屠杀所以没关系','',
							'是啊是啊，给人添麻烦了呢你','','总而言之，从这里离开成吗？','','我是说要你从这世上离开','',
							'当护卫的那个女仆是你雇来的对吧？','像你这样的深闺大小姐一招就能打倒！','','你难道很强么？','',
							'……似乎很有一手的样子呢','','既然月亮如此鲜红','','看来会成为永远之夜呢',''],
							['remilia','果然，人类还是不中用啊','','你这家伙，是杀人犯呢','','脑子秀逗呢。而且理由不明','','这里是我的城哦？','要离开也该是你离开才对。','',
							'真是没办法呢','虽然现在，已经吃得饱饱的了……','','咲夜是个优秀的扫除者','托她的福，这里一颗头都没掉过哦','','谁知道呢。我又不怎么到外面去',
							'因为我对阳光很没辙','','在如此鲜红的月亮之下我真的会杀掉你哦','','看来会成为欢愉之夜呢','','end'],
						];
					} else if (game.me.name == 'marisa'){
						game.me.storage.dialog = [
							['marisa','来了来了有寒气在奔走，这股妖气','为什么越是强大的家伙越要隐藏？','','…你看起来没有脑子呐',
							'','你就是，那个吧？','那什么阳光啦、难闻的蔬菜和银的什么之类的，','明明是夜的支配者哪来这么多弱点…','',
							'好像很有趣呢，你果然有喝吧？那个','','你到现在吸了多少人的血了？','','13块我是和食主义者','','是吗，不过我可是饿了哦。','',
							'啊啊，是这样吗','刚才那是植物的名字，「亚阿相界」','','是快乐的人类哦','','似乎会成为清凉之夜呢',''],
							['remilia','有能力的鹰不藏尾巴…呢','','只有人啊','需要脑之类的单纯的化学思考中枢。','','就是啊，是病弱的女孩呢','',
							'那是当然的了。不过饭量小所以每次都会剩下','','你能记得清楚到今天为止自己吃过的面包的数量吗？','','那，你是来干嘛的？',
							'我现在是已经吃饱了…','','…要吃的话，也无所谓。','','人类真是快乐啊。','还是说，你根本就不是人类比较好呢？','','呵呵呵，因为月亮也如此之红吗？','','似乎会是酷暑之夜呢','end'],
						];
					}
					game.me.removeSkill('boss_chiyan6x');
					game.me.storage.unskill = ['feise','feise_start'];
					game.me.storage.reskill=['gungirs','gens'];
					game.resetSkills();
					_status.paused=false;
					_status.event.player=game.me;
					_status.event.step=0;
					_status.roundStart=game.me;
					ui.backgroundMusic.play();
					ui.background.setBackgroundImage('image/background/stg_scarlet.jpg');
					//game.phaseNumber=0;
					//game.roundNumber=0;
					if(game.bossinfo){
						game.bossinfo.loopType=1;
					}
				}
			},
			chiyan_win:{
				trigger:{player:'dieBefore'},
				direct:true,
				content:function(){
					game.boss.hide();
					var clear=function(){
							ui.dialog.close();
							while(ui.controls.length) ui.controls[0].close();
					};
					var clear2=function(){
						ui.auto.show();
						ui.arena.classList.remove('only_dialog');
					};
					var step1=function(){
						ui.create.dialog('<div><div style="width:260px;margin-left:120px;font-size:18px">就这样，红雾异变的黑幕被击退了。没过几天，红雾就从幻想乡彻底的散去了。恭喜你闯关成功！');
						ui.create.div('.avatar',ui.dialog).setBackground('akyuu','character');
						ui.create.control('呼……累死人了',step3);
					}
					var step3=function(){
						clear();
						if (lib.config.gameRecord.stg && lib.config.gameRecord.stg.data['stg_scarlet'] && lib.config.gameRecord.stg.data['stg_scarlet'][0] > 1){
							step5();
						} else {
							ui.create.dialog('<div><div style="width:260px;margin-left:120px;font-size:18px">总之呢，作为通关奖励解锁了在其他模式中使用蕾米莉亚（神枪符卡）和带了五本魔导书的魔导书架。这些可以在左上角[扩展]打开或关闭。</div></div><div><div style="width:260px;margin-left:120px;font-size:8px">将联机昵称改为“路人”可以不通关也解锁这些角色哟。</div></div>');
							ui.create.div('.avatar',ui.dialog).setBackground('akyuu','character');
							ui.create.control('不错不错',step4);
						}
					};
					var step4=function(){
						clear();
						ui.create.dialog('<div><div style="width:260px;margin-left:120px;font-size:18px">还会继续更新更多关卡的。下次再见？</div></div>');
						ui.create.div('.avatar',ui.dialog).setBackground('akyuu','character');
						ui.create.control('下次再见！',step6);
					};
					var step5=function(){
						clear();
						ui.create.dialog('<div><div style="width:260px;margin-left:120px;font-size:18px">下次欺负蕾米的时候轻一点啊人家也是很累的。</div></div>');
						ui.create.div('.avatar',ui.dialog).setBackground('akyuu','character');
						ui.create.control('哎，好吧',step6);
					};
					var step6=function(){
						clear();
						clear2();
						game.resume();
					};
					game.pause();
					step1();
				}
			},
			cherry_win:{
				trigger:{player:'dieBefore'},
				direct:true,
				content:function(){
					game.boss.hide();
					var clear=function(){
							ui.dialog.close();
							while(ui.controls.length) ui.controls[0].close();
					};
					var clear2=function(){
						ui.auto.show();
						ui.arena.classList.remove('only_dialog');
					};
					var step1=function(){
						ui.create.dialog('<div><div style="width:260px;margin-left:120px;font-size:18px">春雪异变的黑幕终究被击退了。虽然迟了，但是春天还是慢慢的回到了幻想乡。恭喜你闯关成功！');
						ui.create.div('.avatar',ui.dialog).setBackground('akyuu','character');
						ui.create.control('这次是真的累死了',step3);
					}
					var step3=function(){
						clear();
						if (get.config('practice_mode') || (lib.config.gameRecord.stg && lib.config.gameRecord.stg.data['stg_cherry'] && lib.config.gameRecord.stg.data['stg_cherry'][0] > 1)){
							step5();
						} else {
							ui.create.dialog('<div><div style="width:260px;margin-left:120px;font-size:18px">总之呢，作为通关奖励解锁了在其他模式中使用蕾米莉亚（神枪符卡）和带了五本魔导书的魔导书架。这些可以在左上角[扩展]打开或关闭。</div></div><div><div style="width:260px;margin-left:120px;font-size:8px">将联机昵称改为“路人”可以不通关也解锁这些角色哟。</div></div>');
							ui.create.div('.avatar',ui.dialog).setBackground('akyuu','character');
							ui.create.control('不错不错',step4);
						}
					};
					var step4=function(){
						clear();
						ui.create.dialog('<div><div style="width:260px;margin-left:120px;font-size:18px">异变不会就这么终结的。下次再见？</div></div>');
						ui.create.div('.avatar',ui.dialog).setBackground('akyuu','character');
						ui.create.control('下次再见！',step6);
					};
					var step5=function(){
						clear();
						ui.create.dialog('<div><div style="width:260px;margin-left:120px;font-size:18px">幽幽子大人平常蛮无聊的，所以请多来玩玩！</div></div>');
						ui.create.div('.avatar',ui.dialog).setBackground('akyuu','character');
						ui.create.control('哎，好的',step6);
					};
					var step6=function(){
						clear();
						clear2();
						game.resume();
					};
					game.pause();
					step1();
				}
			},
			// 红魔乡EX
			boss_chiyan_ex:{
				trigger:{global:'gameStart'},
				forced:true,
				popup:false,
				unique:true,
				fixed:true,
				content:function(){
					"step 0"
					player.hide();
					game.addVideo('hidePlayer',player);
					player.delete();
					game.players.remove(player);
					game.dead.remove(player);
					event.target = game.me; 
					"step 1"
					var list = [];
					if (event.target.name == 'marisa'){
						list = ['stg_missile', 'stg_bagua'];
						event.target.removeSkill('stardust');
					} else if (event.target.name == 'reimu'){
						list = ['stg_needle','stg_yinyangyu'];
						event.target.removeSkill('mengxiang');
					}
					for(var i=0;i<list.length;i++){
						list[i]=['','',list[i]];
					}
					if (list.length){
						event.target.chooseButton(['选择本次闯关使用的装备',[list,'vcard']], true);
					}
					"step 2"
					if (result.bool){
						event.target.equip(game.createCard(result.links[0][2]));
						event.target.maxequip ++;
					}
					"step 3"
					// 制作关卡开始的对话框
					var dialog=ui.create.dialog("EX面<br><br>东方红魔狂");
					dialog.open();
	                game.pause();
	                var control=ui.create.control('走起！',function(){
	                    dialog.close();
	                    control.close();
	                    game.resume();
	                });
	                lib.init.onfree();
				},
			},
			flaninit:{
				init:function(player){
					game.me.storage.reskill = ['fourof','starbow','chiyan_ex_win'];
					player.equip(game.createCard('laevatein'));
					game.addBossFellow(2,'stg_bat',0);
					game.addBossFellow(3,'stg_bat',0);
					game.addBossFellow(5,'stg_bat',0);
					game.addBossFellow(6,'stg_bat',0);
					if (game.me.name == 'marisa'){
						//game.pause();
						lib.skill['kuangyan'].audio = 1;
						lib.translate['kuangyan_audio1'] = '那你就，不要指望能续关了！'
						setTimeout(function(){
							player.useSkill('kuangyan');
							//game.resume();
						}, 2500);
					} else {
						lib.skill['kuangyan'].audio = 0;
					}
					lib.skill['kuangyan'].forced = true;
				},
			},
			// EX 胜利
			chiyan_ex_win:{
				trigger:{player:'dieBefore'},
				direct:true,
				init:function(player){
					var list = game.filterPlayer();
					for (var i = 0; i < list.length; i ++){
						if (list[i] == game.boss){
							list[i].classList.remove('turnedover');
							list[i].removeSkill('starbow');
							list[i].removeSkill('starbow1');
							list[i].addSkill('zhihou');
							list[i].useSkill('zhihou');
						}
					}
				},
				content:function(){
					//player.addSkill('death_win');
					/*
					lib.skill['die'] = {
						init:function(player){
							game.over(true);
						},
					},
					*/
					lib.translate['flandre_die'] = '';
					game.me.storage.stage = 'die';
					if (game.me.name == 'reimu'){
						game.me.storage.dialog = [
							['reimu','看吧？这就是侍奉神灵的人所拥有的力量！','','！？不过，你分明就已经没那个力气了呢','','我随时都来陪你玩算我求你了，不要来神社里玩',
								'','你这的食物是绝对不能拿到人类那里去的','','无糖食品也一样！','所以好孩子的话现在就乖乖地回家睡觉','','那不回去也无所谓了，是坏孩子的话','不过我差不多要回去了'
								,'','···神社里还放着一个坏孩子在那儿呢','','就是你和你姐姐啦！！','end'],
							['flandre','你以为靠那个就能赢了好戏才不过刚开始啊！','','是，受不了，连烟都冒不了','','哎呀，我本来还想带些蛋糕和红茶作为礼物去的呢'
							,'','因为控制甜食？','','……这里是我家哦？','','坏孩子不用回家也可以','','坏孩子，你说的是谁？',''],
						];
					} else if (game.me.name == 'marisa'){
						game.me.storage.dialog = [
							['marisa','啊，满足了吧！','','啊啊、可能是骗人的','不过，我今天也该回去了','','？！剩你一个人了的话就会去上吊吗？','',
							'She went and hanged herself and then there were none.','','一个有名的童谣','','在刚才的攻击中，你消失的时候吧','','没命中，真不好意思呐。很遗憾，我擅长的就是躲避弹幕呢','',
							'上吊的尸体很丑陋的老老实实地按照那首童谣来啊','','喂喂，真的不知道啊？','She got marriedand then there were none...','','给你介绍那个神社的女孩哦','end'],
							['flandre','不敢相信，我竟然会输了……','','但是结果最后还是剩下我一个了','','为什么？',''
							,'那些你都是从谁那里听说的啊','','我本来预定好最后的那一个人就是你哦？','','She died by the bulletand then there were none.','','算了，无所谓了反正即使上吊我也不会死',
							'','本来歌里唱的？','','和谁？',''],
						];
					}
					player.addSkill('boss_chiyan2');
					player.useSkill('boss_chiyan2');
				}
			},
			// 妖妖梦（正常）
			boss_cherry:{
				trigger:{global:'gameStart'},
				forced:true,
				popup:false,
				unique:true,
				fixed:true,
				content:function(){
					"step 0"
					lib.setPopped(ui.rules,function(){
						var uiintro=ui.create.dialog('hidden');
		
							uiintro.add('<div class="text left">1. 击坠敌人后，来源摸一张牌，获得1点灵力 <br> 2. 准备阶段，场上敌人数小于2，会刷出下一个敌人 <br> 3. 每造成7点伤害，获得一张【森罗结界】 <br> 4.手牌上限+X（X为已通关卡数量） </div>');
							uiintro.add('<div class="text left"><a href = "https://mp.weixin.qq.com/s/owQpDcBP0_OFPSlZMecPYQ" target="_blank">了解更多闯关技巧</a></div>');
							uiintro.add(ui.create.div('.placeholder.slim'))
		
						return uiintro;
					},400);
					player.hide();
					game.addVideo('hidePlayer',player);
					player.delete();
					game.players.remove(player);
					game.dead.remove(player);
					event.target = game.me; 
					"step 1"
					var list = [];
					if (event.target.name == 'marisa'){
						list = ['stg_missile', 'stg_bagua'];
						event.target.removeSkill('stardust');
					} else if (event.target.name == 'reimu'){
						list = ['stg_needle','stg_yinyangyu'];
						event.target.removeSkill('mengxiang');
					} else if (event.target.name == 'sakuya'){
						list = ['stg_watch', 'stg_deck'];
						event.target.removeSkill('world');
					}
					for(var i=0;i<list.length;i++){
						list[i]=['','',list[i]];
					}
					if (list.length){
						event.target.chooseButton(['选择本次闯关使用的装备',[list,'vcard']], true);
					}
					"step 2"
					if (result.bool){
						event.target.equip(game.createCard(result.links[0][2]));
						event.target.maxequip ++;
					}
					"step 3"
					// 制作关卡开始的对话框
					var dialog=ui.create.dialog("第一关<br><br>白银之春");
					dialog.open();
	                game.pause();
	                var control=ui.create.control('走起！',function(){
	                    dialog.close();
	                    control.close();
	                    game.resume();
	                });
	                lib.init.onfree();
				},
			},
			boss_cherry2:{
				trigger:{global:'dieAfter'},
				forced:true,
				priority:-10,
				//fixed:true,
				//globalFixed:true,
				unique:true,
				filter:function(event){
					if(lib.config.mode!='stg') return false;
					return event.player==game.boss;
				},
				content:function(){
					'step 0'
					game.boss.hide();
					game.addVideo('hidePlayer',game.boss);
					game.delay();
					'step 1'
					if (game.me.name == 'reimu'){
						game.playConvo([['reimu', '也没有变得多暖和呢。刚才要是再稍微攻击得激烈一点就好了']]);
					} else if (game.me.name == 'marisa'){
						game.playConvo([['marisa', '就算是这样的家伙，打倒了的话春度也应该能增加一点吧？']]);
					} else if (game.me.name == 'sakuya'){
						game.playConvo([['sakuya', '黑幕，好弱啊。得赶快去找下一个黑幕了～']]);
					}
	                'step 2'
					var dialog=ui.create.dialog("第二关<br><br>迷途之家的黑猫");
					dialog.open();
	                game.pause();
	                var control=ui.create.control('走起！',function(){
	                    dialog.close();
	                    control.close();
	                    game.resume();
	                });
	                lib.init.onfree();
	                'step 3'
					game.addBossFellow(3,'stg_yousei',1);
					game.addBossFellow(5,'stg_yousei',1);
					'step 4'
					while(_status.event.name!='phaseLoop'){
						_status.event=_status.event.parent;
					}
					game.me.storage.tongguan ++; 
					lib.character['chen'][3] = ['shihuo', 'mingdong'];
					game.me.storage.reinforce = ['stg_maoyu', 'stg_ghost', 'stg_yousei', 'chen'];
					game.me.storage.stage = 'boss_cherry3';
					if (game.me.name == 'reimu'){
						game.me.storage.dialog = [
							['reimu','怎么，这种地方也会有人家吗？','','终结？','','那个，什么终结？','','是吗。','不过，的确，说到迷途之家, 据说把这里的东西拿回去能让人变幸运….',
							'', '那好，掠夺开始～～', '', '迷路了的话就无法再回去…这个设定哪去了？'],
							['chen','在这里迷路的话就是终结！','','先不管那些，欢迎来到迷途之家～','','迷路的话就是终结，无法再回去了。',
							'','会的哦～','', '你说什么？！', '这里可是我们的村庄哦, 人类能给我们出去吗？', 'end'],
						];
					} else if (game.me.name == 'marisa'){
						game.me.storage.dialog = [
							['marisa','啊啊烦死了。', '这里貌似是某些和人类类似的东西住的地方。像猫呀狗呀狐狸呀什么的','',
							'……是「枪打出头鸟」、吗？','', '不关四只脚的生物什么事','','虽然说根本没有所谓的路','', '这样啊，风向改变了啊。怪不得', '',
							'怪不得', 'end'],
							['chen','应呼飞出...','','那个，有什么事？','','听起来好像哪里不对...','', '来到这个迷途之家的话，不就说明你迷路了吗～？','',
								'因为刚才起就一直吹雪导致视线不良，而且风向也经常改变呢～', '', '已经找不到回去的路了吧', '', 
							],
						];
					} else if (game.me.name == 'sakuya'){
						game.me.storage.dialog = [
							['sakuya','真的，已经到春天了吗？怎么想都觉得奇怪','','你又不是人','','这种日子呀，猫应该老老实实的在被炉里缩成一团',
							'', '（原来是迷信呀……）', '', '老老实实地被驱逐到收容所去，如何？', '极乐净土的世界看起来也很温暖', '', '想试试看呢～', 'end'],
							['chen','觉得奇怪的话就找个人问问！','','也是，反正被问了也不会回答你的','','相信那样的迷信是不行的！',
							'','毕竟，野猫要怎么办才好呀','', '人类？把我们？', '做不到啦，绝对做不到啦。那种生物还想和我们对抗什么的', ''],
						];
					}
					game.me.removeSkill('boss_cherry2');
					ui.background.setBackgroundImage('image/background/town.jpg');
					game.resetSkills();
					_status.paused=false;
					_status.event.player=game.me;
					_status.event.step=0;
					_status.roundStart=game.me;
					ui.backgroundMusic.play();
					//game.phaseNumber=0;
					//game.roundNumber=0;
					if(game.bossinfo){
						game.bossinfo.loopType=1;
					}
				}
			},
			boss_cherry3:{
				trigger:{global:'dieAfter'},
				forced:true,
				priority:-10,
				//fixed:true,
				//globalFixed:true,
				unique:true,
				filter:function(event){
					if(lib.config.mode!='stg') return false;
					return event.player==game.boss;
				},
				content:function(){
					'step 0'
					game.boss.hide();
					game.addVideo('hidePlayer',game.boss);
					game.delay();
					'step 1'
					var line;
					if (game.me.name == 'reimu'){
						game.playConvo([['reimu', '总之，先在附近找点轻巧的日用品啦～～'],
									]);
					} else if (game.me.name == 'marisa'){
						game.playConvo([['marisa', '怪不得我会遇上这种没用的家伙'],
									]);
					} else if (game.me.name == 'sakuya'){
						game.playConvo([['sakuya', '南无～极乐净土一定是一个温暖且幸福的地方，不会错啦～'],
									]);
					}
	                'step 2'
					var dialog=ui.create.dialog("第三关<br><br>人偶租界之夜");
					dialog.open();
	                game.pause();
	                var control=ui.create.control('走起！',function(){
	                    dialog.close();
	                    control.close();
	                    game.resume();
	                });
	                lib.init.onfree();
	                'step 3'
					game.addBossFellow(3,'stg_puppet',1);
					game.addBossFellow(5,'stg_puppet',1);
					'step 4'
					while(_status.event.name!='phaseLoop'){
						_status.event=_status.event.parent;
					}
					game.me.storage.tongguan ++; 
					lib.character['alice'][3] = ['huanfa', 'alicedie'];
					game.me.storage.reinforce = ['alice','stg_puppet','stg_puppet', 'alice'];
					game.me.storage.stage = 'boss_cherry4';
					if (game.me.name == 'reimu'){
						game.me.storage.dialog = [
							['reimu','夜里好冷啊，视线也是最差的','','哎呀，虽然可能的确是不足','','刚刚才见过面的吧？','',
							'有段时间巨人？', '', '先不管那些，春度是什么？', '', '太高了也不好呢。不过为什么这次的冬天会这么久？','',
							'就是说和你没关系？', '', '那，再见', '', '谁会和你这种七色魔法笨蛋是旧友', ''],
							['alice','会冷的话是因为你的春度不足的缘故啦～难道不是吗？','','有段时间没见了','','不是，不是那个意思','',
							'不记得我了吗？...算了，反正也无所谓', '', '就是说，你头脑里究竟有多春的程度啊', '', '因为有个收集春度的家伙在',
							'', '当然没关系', '', '等等！', '明明好不容易遇见旧友, 见面礼就只有你的性命吗？', '', '巫女到底不过二色', '这种力量连我的二成八分六厘都不到','end'],
						]; 
					} else if (game.me.name == 'marisa'){
						game.me.storage.dialog = [
							['marisa','总感觉，这里蛮爽的', '', '很好的','','比起温室魔法使不是要好吗？','','啊？欢迎来到边境','',
							'让春天还有这样的雪天气的，到底是谁啊','', '是吗', '不过，看起来一点点春的话，应该还是有的', '',],
							['alice','像这样的杀戮之夜真的好吗？','','毕竟，你是个野生魔法使','','是都市派魔法使','', '农村春天寒冷得让人讨厌', '',
							'顺便说句，不是因为我的原因', '', '我也这么想，你那一点点的春能交给我吗？', 'end',
							],
						];
					} else if (game.me.name == 'sakuya'){
						game.me.storage.dialog = [
							['sakuya','总觉得，好像在浪费时间的样子...','我们家大小姐没关系吗？', '', '有关心自己的说。','','备用的衣服只带了三件而已。自己。',
								'', '还有，就是备用的飞刀也', '', '你看起来好像烦恼很少的样子，真好啊', '', '这个，还真是斩钉截铁。', '对了，那里那个没烦恼的。', '',
								'把这附近的春夺走的家伙，那个播撒冬日的家伙是谁？', '', '在什么地方？', '', '怎样都不好', 'end'
							],
							['alice','有时间关心别人的话是不是先关心下自己？','','在关心自己什么？','','带来了啊', '',
								'带了吗？','','失礼啊！不是很少，我根本就没有烦恼！', '', '什么？', '', '大概，有点线索', '', 
								'那种琐碎的小事，怎样都好', '',
							],
						];	
					}
					game.me.removeSkill('boss_cherry3');
					ui.background.setBackgroundImage('image/background/snow.jpg');
					game.resetSkills();
					_status.paused=false;
					_status.event.player=game.me;
					_status.event.step=0;
					_status.roundStart=game.me;
					ui.backgroundMusic.play();
					//game.phaseNumber=0;
					//game.roundNumber=0;
					if(game.bossinfo){
						game.bossinfo.loopType=1;
					}
				}
			},
			boss_cherry4:{
				trigger:{global:'dieAfter'},
				forced:true,
				priority:-10,
				//fixed:true,
				//globalFixed:true,
				unique:true,
				filter:function(event){
					if(lib.config.mode!='stg') return false;
					return event.player==game.boss;
				},
				content:function(){
					'step 0'
					game.boss.hide();
					game.addVideo('hidePlayer', game.boss);
					game.delay();
					'step 1'
					if (game.me.name == 'reimu'){
						game.playConvo([['reimu', '说起春度的话，是不是就是指那些樱花的花瓣？'],
										['alice', '你不是知道所以才搜集的吗？'], 
										['reimu', '不是的，这个，也对'],
									]);
					} else if (game.me.name == 'marisa'){
						game.playConvo([['marisa', '冬天一直这么喧闹吗？'],
										['marisa', '基本上，普通人类这时候不会出现在外面'],
										['alice', '不要把我和普通的人类相提并论'], 
										['marisa', '是异常的人类吗？'],
										['alice', '是普通的非人类！！'],
									]);
					} else if (game.me.name == 'sakuya'){
						game.playConvo([['sakuya', '说，引起这次骚动的真凶究竟是什么家伙？'],
										['alice', '在下风方向有个萧条的神社'],
										['alice', '那里住着一位满脑子都是春的巫女，就是那家伙没错'], 
										['sakuya', '我觉得恐怕不对'],
										['alice', '不开玩笑了。'],
										['alice', '你在收集樱花的同时，难道没有注意到春已经在靠近了吗？'],
										['sakuya', '...往上风的方向'],
										['alice', '我还什么都没说……']
									]);
					}
	                'step 2'
					var dialog=ui.create.dialog("第四关<br><br>云上的樱花结界");
					dialog.open();
	                game.pause();
	                var control=ui.create.control('走起！',function(){
	                    dialog.close();
	                    control.close();
	                    game.resume();
	                });
	                lib.init.onfree();
	                'step 3'
					game.addBossFellow(3,'stg_yousei',1);
					game.addBossFellow(5,'stg_yousei',1);
					'step 4'
					while(_status.event.name!='phaseLoop'){
						_status.event=_status.event.parent;
					}
					game.me.storage.tongguan ++; 
					game.me.storage.fuhuo ++;
					game.notify(get.translation(game.me) + '获得了一个残机');
					game.log(game.me,'获得了一个残机！');
					lib.character["lilywhite"][3].push("lilywhitedieafter");
					game.me.storage.reinforce = ['stg_yousei','stg_yousei','lilywhite', 'stg_yousei', 'stg_yousei', 'stg_ghost'];
					//game.me.storage.reinforce = ['lunasa'];
					game.me.storage.reskill=['dahezou'];
					game.me.storage.stage = 'boss_cherry5';
					if (game.me.name == 'reimu'){
						game.me.storage.dialog = [
							['reimu','不过说起来，连云端之上都是樱花飞舞是怎么一回事呀？', '......', '要是平常的话，早该有人出来回答了。', 1,
							'好像失去干劲了呢。', 1, '不行哦，我还有事情要办，所以不能回去。', 1, '不管怎么样，这个门的里面怎么看都像是目的地呢～', 2,
							'我估计，八成是你们搞错了?', '等等，你们是什么人？这里又是哪儿？', 3, '我也想去赏樱呀～', 2, '被幽灵邀请………这个，还真是不太想呀～', 1,
							'' ],
							['lunasa', '啊啊，知道了', '你看，就是那个啦。', '这附近一到这个季节气压就会...', '下降', 0, '......', 0,
							'谁也没想说那些事情。', '我不过是想说上升气流而已。', 0, '上升气流。', 3, '但是，你不会演奏……', 0, '是杂音就要消灭掉！', 3, '欢迎随时帮忙哦', 'end'],
							['merlin', '那个，是谁？', 1, '等下房子里会有一场赏樱会，我们要在那里做盛大的表演。', 1, '你也没被邀请……', 0],
							['lyrica', '是我们的天敌呢~', 0, '我们是骚灵演奏队～是受邀请而来的。', 2, '加油呀～', 1],
						];
					} else if (game.me.name == 'marisa'){
						game.me.storage.dialog = [
							['marisa', '这个结界很厉害啊，要是外行的话完全没法解开哦', '究竟藏了些什么东西', 1, 
							'"芝麻开门"...',1,'虽然无所谓，还是问下，你是谁呀？', 1, '啊啊，无所谓', '反正，打倒你了，门就会自动开了吧？', 2,
							'朋友呀', 1, '这个，有点仓促，不过看在朋友的交情上把这个结界给解开吧', 2, '不管怎么看，你们都不能把这个结界解开的样子呢', 1, '帮忙嘛，不需要啦', 'end'],
							['lyrica','嘿嘿嘿～','商业机密', 0, '那么做，是打不开这个结界的', 0, '反正无所谓', 0, '朋友哦～', 3, '交情～', 0, '那么演奏开始～姐姐，要上了！', 3, '呜～', 2],
							['lunasa', '莉莉卡的朋友？', 0, '代价是听过之后就回去哦，因为朋友的交情', 1, '知道了啦，我们随时准备帮忙', 0],
							['merlin', '那真是太好了, 莉莉卡终于也能交到朋友了', 0, '在那之前能先听我们演奏一曲吗？ 看在朋友的交情上', 2, '她是你的朋友呀，偶尔也用用独奏来解决吧', 1],
						];
					} else if (game.me.name == 'sakuya'){
						game.me.storage.dialog = [
							['sakuya', '上空竟然如此的温暖，感动得都要流泪了', 1, '那么，这里是哪里？你是？', 1, '也对，那么你很强吗？', 1, '',
							'向上风方向前进，最后到达这里而已，风貌似沉淀在这里了的样子', 3, '嗯？', 2, '说什么呢，等一下这里要举行赏樱会吗？', 1,
							'那似乎很有趣啊', 3, '要我来负责呀', 1, '我希望能没事呢～', 2, '人肉！', 'end'],
							['merlin', '真的呢～', '这片云层下面都还是狂风暴雪的说。', 0, '问题要一个一个的来～', 0, '我很普通啦。', 
							'虽然问不问无所谓，你是谁？', 0, '嘛，要办个小型的宴会吗？', 0, '要开赏樱会哦～', 3, '听了我的演奏之后还能没事的食物是不存在的', 0,
							],
							['lyrica', '宴会的时间～', 1, '赏樱会的前夜祭哦', 0, '狗肉，狗肉～', 0],
							['lunasa', '离宴会还早', 0, '因为在那之前似乎能弄到宴会的原料呢', 2, '你是负责食物的', 0],
						];
					}
					game.me.removeSkill('boss_cherry4');
					ui.background.setBackgroundImage('image/background/snow.jpg');
					game.resetSkills();
					_status.paused=false;
					_status.event.player=game.me;
					_status.event.step=0;
					_status.roundStart=game.me;
					ui.backgroundMusic.play();
					//game.phaseNumber=0;
					//game.roundNumber=0;
					if(game.bossinfo){
						game.bossinfo.loopType=1;
					}
				}
			},
			boss_cherry5:{
				trigger:{global:'dieAfter'},
				forced:true,
				priority:-10,
				//fixed:true,
				//globalFixed:true,
				unique:true,
				filter:function(event){
					if(lib.config.mode!='stg') return false;
					return event.player==game.boss;
				},
				content:function(){
					'step 0'
					game.boss.hide();
					game.addVideo('hidePlayer',game.boss);
					game.delay();
					'step 1'
					var line;
					if (game.me.name == 'reimu'){
						game.playConvo([['reimu', '太好了，赏樱权确保！'],
										['lunasa', '难道，目的是赏樱劫持？'],
										['reimu', '总感觉有点不对劲…………'],
									]);
					} else if (game.me.name == 'marisa'){
						game.playConvo([['marisa', '那么，把门打开吧？'],
										['lyrica', '这个门打不开啊'],
										['marisa', '你们，不是进去过了吗？'],
										['lyrica', '我们是从那上面飞过去的啊'],
										['marisa', '~~~哈'],
									]);
					} else if (game.me.name == 'sakuya'){
						game.playConvo([['sakuya', '怎样，我已经没太多的时间在这里耗了'],
							['merlin', '离赏樱的时间还早呢'],
							['sakuya', '虽然赏樱也很不错，不过前提是春天呢'],
							['merlin', '春的话，房子里到处都是啦'],
							['sakuya', '这种程度的结界，很简单就能钻过去了呀'],
						]);
					}
	                'step 2'
					var dialog=ui.create.dialog("第五关<br><br>白玉楼阶梯的幻斗");
					dialog.open();
	                game.pause();
	                var control=ui.create.control('走起！',function(){
	                    dialog.close();
	                    control.close();
	                    game.resume();
	                });
	                lib.init.onfree();
	                'step 3'
					game.addBossFellow(3,'stg_ghost', 2);
					'step 4'
					while(_status.event.name!='phaseLoop'){
						_status.event=_status.event.parent;
					}
					game.me.storage.tongguan ++; 
					game.me.storage.reinforce = ['stg_ghost', 'youmu', 'stg_ghost', 'stg_ghost', 'youmu'];
					lib.character["youmu"][3] = ['yishan', 'youmudieafter'];
					game.me.storage.reskill = ['mingfa', 'tianshangjian'];
					game.me.storage.stage = 'boss_cherry6';
					if (game.me.name == 'reimu'){
						game.me.storage.dialog = [
							['reimu','','…虽然还不是很确定，难道说这里是…','',
								'冥界？我果然还是被邀请来了啊…','','不过话说回来','普通的人类也能这么普通地出入这里，不是太危险了吗。', '',
								'那种结界很普通地被打破了哦', '', '这幽灵话真多', '', '你吐槽的居然是那个吗？', '', '半吊子幽灵的话真多', '',
								'如果死在冥界，也会逝往冥界呢', '', '这里难道不是地狱吗？', ''],
							['youmu','我说怎么大家那么吵闹的。','原来是有活人来这里啊', '',
							'曾经活着的人所住的地方哦','','你还没有被邀请来这里呢。','','你这家伙不是打破结界进来的吗！', '',
							'就是为了不让别人进来，所以才张开结界的吧。比如写有「不要攀爬，危险」的铁塔，小孩子是不会去爬的','怎么可以随便就破坏结界，随便说很危险呢','',
							'','我有一半不是幽灵啊！','','不管怎样，再收集一点点春的话', '这里的西行妖就可以完全盛开了', '就用你身上的那一点春来为盛开再加把劲吧', '',
							'听到我的话了吗？你要被斩于此地了哦', '', '你只会逝往地狱！', '', '…妖怪所锻造的这把楼观剑，无法斩断的东西，几乎不存在！', 'end'],
						];
					} else if (game.me.name == 'marisa'){
						game.me.storage.dialog = [
							['marisa','变得相当暖和了呀','','我是尸体的话就不会喧哗吗？',
							'而且……现在可是夏天呢为什么天气会这么冷的说？','','是你吧。让天这么冷','','显然，我活着咯。','',
							'可是这里很暖和，不错呀。','','尸体优雅赏樱的画面想想也很美丽','', '西行妖？', '', '我有种想见见的感觉了。', '', 
							'但是，好不容易收集到的春，可没打算要交出来', '', '索性就，干脆让我把你收集的春全部夺过来，让那个妖怪樱花树盛开。', '',
							'我也是', ''],
							['youmu','我说怎么大家那么吵闹的','原来是有活人来这里呀','','不会啊。人类来到这个白玉楼本身，就应该已经死了才对。','',
							'你自己越过了那个结界。','那种愚蠢使得灵骚动起来。', '', '那是因为这里收集了幻想乡的春。普通的樱花比平时还要更加艳丽地绽放。','',
							'不过现在西行妖盛开还是不足啊……','','我家引以为荣的妖怪樱', '', '不管怎样，再收集一点点春的话，这西行妖就可以盛开了。',
							'就用你身上的那一点春，来为盛开再加把劲吧', '', '来为盛开再加把劲！', '', '我收集的春不会交出来的！', '', 
							'···妖怪所锻造的这把楼观剑，无法斩断的东西，基本不存在！', 'end'
							],
						];
					} else if (game.me.name == 'sakuya'){
						game.me.storage.dialog = [
							['sakuya', '出来', '', '好像终于到要找的地方了。', '整整花了一天呀。', '', '死无对证', '老老实实地把春还回来', '', '差一点也不行', '',
							'都说了不行哦', '', '你有在听吗？', '就为了这种东西，我可是受苦受冻了', '', '算了不说了', '死无对证', '', '我的飞刀也能斩断幽灵吗？', '',],
							['youmu', '我说怎么大家那么吵闹的，原来是有活人来这里呀', '', '来到这里还能如此的不慌不忙', '这里是白玉楼，是死者们住的地方。', '用活人考虑问题的方法来对待这里是会遭遇不幸的',
							'', '就差一点了哦。', '', '仅仅差一点西行妖就能盛开了。', '普通的春的话是绝对不可能盛开的。', '', '有了你手中的那一点点春之后，西行妖一定就可以盛开了！',
							'', '这里不是很暖和吗？', '', '死无对证', '把你那些春全部交出来！', '', '妖怪所锻造的这把楼观剑，无法斩断的东西，只有一点！', 'end'
							],
						];
					}
					game.me.removeSkill('boss_cherry5');
					ui.background.setBackgroundImage('image/background/stg_stairs.jpg');
					game.resetSkills();
					_status.paused=false;
					_status.event.player=game.me;
					_status.event.step=0;
					_status.roundStart=game.me;
					ui.backgroundMusic.play();
					//game.phaseNumber=0;
					//game.roundNumber=0;
					if(game.bossinfo){
						game.bossinfo.loopType=1;
					}
				}
			},
			boss_cherry6:{
				trigger:{global:'dieAfter'},
				forced:true,
				priority:-10,
				//fixed:true,
				//globalFixed:true,
				unique:true,
				filter:function(event){
					if(lib.config.mode!='stg') return false;
					return event.player==game.boss;
				},
				content:function(){
					'step 0'
					game.boss.hide();
					game.addVideo('hidePlayer',game.boss);
					game.delay();
					'step 1'
					if (game.me.name == 'reimu'){
						game.playConvo([['reimu', '这里不是已经很春了吗'],
										['reimu', '你们到底想做些什么呀？'],
										['youmu', '大小姐今年想要樱花盛开，不过想要西行妖盛开的话'],
										['youmu', '仅仅这点程度的春根本…'],
										['reimu', '难道盛开后会发生什么好事不成'],
									]);
					} else if (game.me.name == 'marisa'){
						game.playConvo([['marisa', '那么，就把我带到那个妖怪樱花树那里吧。'],
										['youmu', '不管怎样只要西行妖能盛开的话就无所谓'],
										['youmu', '虽然这样说，总觉得有点没法接受……'], 
										['marisa', '谁想让它盛开了？'],
										['marisa', '我只是想赏樱罢了。'],
									]);
					} else if (game.me.name == 'sakuya'){
						game.playConvo([['sakuya', '太好了，看来幽灵也能斩呀。因为是银的？'],
										['youmu', '我有一半不是幽灵，不过，西行寺小姐可是完全的灵体'],
										['youmu', '那样陈旧的武器，会起到作用吗？'], 
										['sakuya', '我说，为什么话题转进到和那个大小姐对打了啊。'],
									]);
					}
	                'step 2'
					var dialog=ui.create.dialog("最终关<br><br>冥界大小姐的尸骸");
					dialog.open();
	                game.pause();
	                var control=ui.create.control('走起！',function(){
	                    dialog.close();
	                    control.close();
	                    game.resume();
	                });
	                lib.init.onfree();
	                'step 3'
					game.addBossFellow(3,'stg_ghost',2);
					'step 4'
					while(_status.event.name!='phaseLoop'){
						_status.event=_status.event.parent;
					}
					game.me.storage.tongguan ++; 
					game.me.storage.fuhuo ++;
					game.notify(get.translation(game.me) + '获得了一个残机');
					game.log(game.me,'获得了一个残机！');
					game.me.storage.reinforce = ['stg_ghost', 'youmu', 'yuyuko'];
					game.me.storage.reskill=['hualing', 'wangwo', 'stg_fanhun'];
					lib.character['youmu'][3] = ["yishan", "liudaojian", "youmudieafter2"];
					lib.character['yuyuko'][3] = ["youdie", "moyin"];
					lib.skill['youdie'].forced = true;
					if (game.me.name == 'reimu'){
						game.me.storage.dialog = [
							['reimu','啊啊不行了！光是死灵都玩腻了','', '！？','','好了，我是为什么而来的呢？现在被这美丽的樱花迷住了啊','',
							'啊，是吗？那么，就来赏樱吧', '', '对了对了，我想起来了', '', '我是要在自己的神社里赏樱来着啊', '', '所以说，虽然是很美丽的樱花，不过', '能把你们收集的春还回来吗？', '',
							'是什么呀，那个西行妖', '', '就因为是特意封印起来的吧。', '那样的话，是不是不要解开会更好呢？也不知道究竟是封印了什么', '', '算了不说这个，要是封印解开了会怎么样呢？', '',
							'…', '', '出于兴趣使其复活，那可不行啊，还不知道是谁', '', '怎么能把返魂跟死混为一谈。', '要是复活了什么麻烦的东西怎么办呀?', '', '我就算是死了也还能赏樱呢', '', 
							'好了，玩笑到此结束，', '现在就请把幻想乡的春都还回来吧', '', '在一开始的第2位就说了', '', '回归于花下好了，春之亡灵！', ''],
							['yuyuko','随便就侵入到人家的庭院里, 还四处抱怨的家伙～','','真奇怪','嘛，虽然我这里的话的确是只有死灵而已', '',
							'是来赏樱的吗？地方还有空出来的呢', '', '但是，你没有被邀请啊', '', '想起什么？', '', '…', '', '就差一点了哦。', '再有一点，西行妖就能盛开了',
							'', '我们家的妖怪樱树', '这种程度的春的话，是没法解开这个樱花树的封印的哦', '', '这种话越过结界的你说得出口吗？', '', '很漂亮的盛开～', '', '同时，好像会有什么人会复活…',''
							, '哎呀，我是可以出于兴趣就把人或妖怪诱向死亡的哦', '', '不试试看的话怎么知道的。', '不管怎么说，没有被邀请的你站在这里，就和死亡没什么分别了，或者说，在这里这件事本身就是死亡',
							'', '要是有了你身上所仅有的那一点点的春的话，', '就能看到真正的樱花……托什么人之福呢', '', '一开始就那么说不就好了', '', '最后的最后才是最重要的哦', '', '沉眠于花下好了，红白之蝶！', 'end'],
						];
					} else if (game.me.name == 'marisa'){
						game.me.storage.dialog = [
							['marisa','不管走到何处都是盛开的呀～','','！','', '是你吧。让天这么冷','',
							'我拿来了。那个，最后一点的春','','怎么会，我还不想在这样偏远的地方了却余生', '', '你有在听我说吗？',
							'', '说什么让人摸不着头脑的话呀？', '', '所以说，让你那么做的话会发生什么好事吗？', '', '不能白白给你', '',
							'在刚刚，好像打倒了一群热闹的家伙来到这里的样子………', '', '啊啊，这附近到处充斥着尸臭的气息呀', '',
							'啊啊，难闻呀。这种让人郁闷的春天还是第一次啊', '', '失礼呀，谁用眼睛来闻气味！', '',
							'冥界里的音速比较缓慢，那种音速缓慢的地方开春也早不了啊', '', '刚才能跟上是很好……', '', '把让人郁闷的春天还回来咯，死人小姐！'],
							['yuyuko','还没有，还差一点点哦～','','再稍微有一点春的话','西行妖也能完全绽放了','','哎呀，你是妖梦的后继者吗？',
							'', '那，是代用品？', '', '有在听呀。', '你是说死的时候想死在樱花树之下对吗？', '不管如何，我怎么都要解开西行妖的封印！',
							'', '不知道', '', '让你赏樱如何，我们这里的赏樱很热闹很有趣哦', '', '不管怎么说，冥界的樱花对人类来说都是稀罕物吧？', '',
							'哎呀，你用眼睛来闻气味啊', '', '失礼哦。在这里的那些春，可都是你们住的幻想乡里的春哦', '', '对话跑题了跑题了～', '',
							'那太遗憾了，现在把空气的温度提高一些然后说话吧', '', '但是，好不容易的', '', '最后一点的春我都拿走了哦，黑色之魔！', 'end'
							],
						];
					} else if (game.me.name == "sakuya"){
						game.me.storage.dialog = [
							['sakuya', '冥界里……', '难道就没有「死无对证」这句话吗？', '', '！', '', '华丽难道不是因为夺走了幻想乡的春的缘故？',
							'', '就是喜欢才会生气呀。', '为什么要夺走幻想乡的春度？', '', '……刚才的死人说你似乎想和我战斗', '', 
							'那个樱花树，不是枯萎了么？', '', '没兴趣。', '比起这里，我更在意来这里花了整整一天的时间', '', '订正刚才的话，不是想来到这里',
							'是为了让幻想乡进入春天才来的', '', '不要说樱花了，连侧金盏花都还没开', '', '不会麻烦', '说到底，家里的大小姐也不可能会心脏不好', '',
							'遗憾？', '算了，花的事情到此为止。', '我也差不多想要过温暖的日子了，能把温暖的日子还回来吗？', '', '不过亡骸毕竟不美丽', '', 
							'必定在地上举办赏樱会，公主的亡骸！', '',
							],
							['yuyuko', '哎呀～当然，没有那种话啦','', '冥界可一直都是热闹华丽的地方哦～', '', '哎呀，你讨厌春天？', '',
								'春的话其实是怎样都好', '但是，还有一点点不足哦', '', '再有一点点，最后的樱花树，西行妖就能绽放了。', 
								'只要它一绽放，一切疑问就能解开了', '', '再一点似乎就能绽放了呀。', '妖梦她，一定是想用你手中的那一点点春让它开花呢～'
								, '', '哎呀，那我立刻送你回去吧。', '你还没有被邀请', '', '哎呀，地上的樱花还没有开放吗？', '', '那样的话，心脏病发的时候可就麻烦了',
								'', '那真是太遗憾了呢', '', '亡骸就是要集中在一个地方才会美丽哦～', '春和樱花也一样……', '', '所以说呢', '', '必定把封印解开给你看，恶魔的走狗！', 'end'
							],
						];
					}
					game.me.removeSkill('boss_cherry6');
					ui.background.setBackgroundImage('image/background/stg_sakura.jpg');
					game.resetSkills();
					_status.paused=false;
					_status.event.player=game.me;
					_status.event.step=0;
					_status.roundStart=game.me;
					ui.backgroundMusic.play();
					//game.phaseNumber=0;
					//game.roundNumber=0;
					if(game.bossinfo){
						game.bossinfo.loopType=1;
					}
				}
			},
			/////////////////////////////// 这里开始是正经的角色技能 ////////////////////////////////////////////////////
			shogon:{
				init:function(event,character){
					var players = game.players;
					for (var i = 0; i<game.players.length; i ++){
						
						if (game.players[i].identity == 'zhong'){
							game.players[i].hide();
							game.addVideo('hidePlayer',game.players[i]);
							game.players[i].delete();
							game.players.remove(game.players[i]);
							//game.dead.remove(game.players[i]);
						}
					}
					game.addBossFellow(6,'stg_maid',2);
					game.addBossFellow(2,'stg_maid',2);
					game.boss.addSkill('jicai');
					lib.skill['jicai'].skillAnimation = true;
					lib.skill['jicai'].cost = 0;
					game.boss.useSkill('jicai');
					lib.skill['jicai'].infinite = true;
				},	
			},
			patchyspell:{
				init:function(event,character){
					if (game.me.name == 'reimu'){
						game.boss.addSkill('mercury');
						game.boss.useSkill('mercury');
					} else if (game.me.name == 'marisa'){
						game.boss.addSkill('emerald');
						game.boss.useSkill('emerald');
					} else {
						game.boss.addSkill('waterfairy');
						game.boss.useSkill('waterfairy');
					}
					game.boss.equip(game.createCard('book'));
				},
			},
			mercury:{
				audio:2,
                cost:0,
                infinite:true,
                 spell:['mercury1'],
                 trigger:{},
                  init:function(player){
                  	var target = game.findPlayer(function(current){
                  		return current.name == 'stg_bookshelf';
                  	});
                  	if (!target) target = player;
                  	if (target){
                  		target.equip(game.createCard('stg_goldbook'));
                  		target.equip(game.createCard('stg_waterbook'));
                  	}
                  },
                  content:function(){
                      player.loselili(lib.skill.mercury.cost);
                      player.turnOver();
                  },
			},
			mercury1:{
				trigger:{player:['useCard','respondAfter']},
				frequent:true,
				filter:function(event,player){
					if(_status.currentPhase==player) return false;
					if(!event.cards) return false;
					if(event.cards.length!=1) return false;
					if(lib.filter.autoRespondSha.call({player:player})) return false;
					return get.color(event.cards[0])=='black';
				},
				content:function(){
					'step 0'
					player.chooseTarget(get.prompt('mercury'),function(card,player,target){
							return true;
						}).set('ai',function(target){
							return get.attitude(_status.event.player,target) < 0;
						});
					'step 1'
					if (result.target){
						result.target.loseHp();
					}
				}
			},
			emerald:{
				audio:2,
                cost:0,
                infinite:true,
                spell:['emerald1'],                
                init:function(player){
                  	var target = game.findPlayer(function(current){
                  		return current.name == 'stg_bookshelf';
                  	});
                  	if (!target) target = player;
                  	if (target){
                  		target.equip(game.createCard('stg_goldbook'));
                  		target.equip(game.createCard('stg_dirtbook'));
                  	}
                  },
                  content:function(){
                      player.loselili(lib.skill.emerald.cost);
                      player.turnOver();
                  },
			},
			emerald1:{
				global:'emerald2',
			},
			emerald2:{
				alter:true,
				mod:{
					canBeDiscarded:function(card,player,target,event){
						if(get.is.altered('emerald2')&&get.subtype(card) == 'equip'&& game.hasPlayer(function(current){
							return current.hasSkill('emerald1') && current.isFriendsOf(player);
						})) return false;
					},
					cardDiscardable:function(card,player,target,event){
						if(get.is.altered('emerald2')&&get.subtype(card) == 'equip'&& game.hasPlayer(function(current){
							return current.hasSkill('emerald1') && current.isFriendsOf(player);
						})) return false;
					},
					canBeGained:function(card,player,target,event){
						if(get.is.altered('emerald2')&&get.subtype(card) == 'equip'&& game.hasPlayer(function(current){
							return current.hasSkill('emerald1') && current.isFriendsOf(player);
						})) return false;
					},
					cardGainable:function(card,player,target,event){
						if(get.is.altered('emerald2')&&get.subtype(card) == 'equip' && game.hasPlayer(function(current){
							return current.hasSkill('emerald1') && current.isFriendsOf(player);
						})) return false;
					},
				},
			},
			waterfairy:{
				audio:2,
                cost:0,
                infinite:true,
                 spell:['waterfairy1'],
                   init:function(player){
                  	var target = game.findPlayer(function(current){
                  		return current.name == 'stg_bookshelf';
                  	});
                  	if (!target) target = player;
                  	if (target){
                  		target.equip(game.createCard('stg_woodbook'));
                  		target.equip(game.createCard('stg_waterbook'));
                  	}
                  },
                  content:function(){
                      player.loselili(lib.skill.waterfairy.cost);
                      player.turnOver();
                  },
			},
			waterfairy1:{
				direct:true,
				trigger:{player:'phaseEnd'},
				content:function(){
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i ++){
						players[i].draw(players[i].getHandcardLimit() - players[i].countCards('h'));
					}
				},
			},
			sakuyainit:{
				init:function(player){
					player.equip(game.createCard('stg_watch'));
	                player.equip(game.createCard('stg_deck'));
	                player.addSkill('handcard_max');

				},
			},
			perfectSquare:{
				audio:2,
				infinite:true,
				cost:0,
				spell:['perfectSquare1','perfectSquare2'],
				init:function(player){
	                  player.useSkill('perfectSquare');
				},
				content:function(){
                      player.loselili(lib.skill.perfectSquare.cost);
                      player.turnOver();
                  },
			},
			perfectSquare1:{
				audio:2,
				forced:true,
				trigger:{global:'useCardtoBefore'},
				filter:function(event,player){
					return event.player.countUsed()>=player.lili && event.player != player;
				},
				content:function(){
					trigger.cancel();
				},
			},
			perfectSquare2:{
				forced:true,
				trigger:{player:'phaseEnd'},
				content:function(){
					player.loselili();
				},
			},
			gungirs:{
				audio:2,
				infinite:true,
				cost:0,
				trigger:{player:'phaseBegin'},
				spell:['gungirs1'],
				init:function(player){
					if (get.mode()=='stg'){
						player.useSkill('gungirs');
						game.addBossFellow(2,'stg_bat',1);
						game.addBossFellow(8,'stg_bat',1);
					}
				},
				content:function(){
					player.equip(game.createCard('gungnir'));
					player.turnOver();
				},
			},
			gungirs1:{
				direct:true,
				trigger:{player:'loseAfter'},
				filter:function(event,player){
					return !player.countCards('e', {name:'gungnir'});
				},
				content:function(){
					player.equip(game.createCard('gungnir'));
				},
			},
			gens:{
				init:function(player){
					player.classList.remove('turnedover');
					player.removeSkill('gungirs');
					player.removeSkill('gungirs1');
					player.addSkill('feise');
					lib.skill['feise'].skillAnimation = true;
					lib.skill['feise'].cost = 0;
					player.useSkill('feise');
					player.addSkill('feise2');
					player.addSkill('chiyan_win');
					player.addIncident(game.createCard('scarlet','zhenfa',''));
					player.removeSkill('scarlet_win');
					lib.skill['feise'].infinite = true;
				},
			},
			saochu:{
				audio:2,
				forced:true,
				trigger:{player:'phaseEnd'},
				filter:function(){
					return true;
				},
				content:function(){
					'step 0'
					if (player.countCards('hej') > 0) player.chooseToDiscard(true);
					'step 1'
					player.draw();
				},
				mod:{
					maxHandcard:function(player,num){
						return num +1;
					},
				},
			},
			juguang:{
				audio:2,
				forced:true,
				trigger:{player:'phaseBegin'},
				init:function(player){
					player.maxequip+=2;
					player.equip(game.createCard('stg_woodbook'));
					player.equip(game.createCard('stg_firebook'));
					player.equip(game.createCard('stg_goldbook'));
					player.equip(game.createCard('stg_waterbook'));
					player.equip(game.createCard('stg_dirtbook'));
				},
				content:function(){
					"step 0"
					player.skip('phaseUse');
					player.skip('phaseDraw');
					player.skip('phaseDiscard');
					player.chooseTarget(get.prompt('juguang'),true,function(card,player,target){
						return player.canUse({name:'sha'},target,false);
					}).set('ai',function(target){
						return get.effect(target,{name:'sha'},_status.event.player);
					});
					"step 1"
					if(result.bool){
						player.loselili();
						player.logSkill('juguang',result.targets);
						player.useCard({name:'sha'},result.targets[0],false);
					}
				},
				check:function(event,player){
					return player.lili > 1 && !player.countCards('h', {name:'sha'});
				},
			},
			stg_needle_skill:{
				init:function(player){
					player.addSkill('fengmo');
				},
				mod:{
					maxHandcard:function(player,num){
						return num+1;
					}
				},
				trigger:{player:'shaBegin'},
				group:'stg_needle_2',
				forced:true,
				filter:function(){
					return true;
				},
				content:function(){
					trigger.target.addTempSkill('fengyin','shaAfter');
				},
			},
			stg_needle_2:{
				trigger:{player:'phaseDrawBegin'},
				forced:true,
				filter:function(event,player){
					if (player.hp < player.maxHp) return true;
					return false;
				},
				content:function(){
					trigger.num++;
				},
				ai:{
					threaten:1.3
				}
			},
			stg_yinyangyu_skill:{
				init:function(player){
					player.addSkill('mengxiang');
					lib.skill['mengxiang'].skillAnimation = true;
					ui.background.delete();
				},
				enable:['chooseToUse','chooseToRespond'],
				hiddenCard:function(player,name){
                    return name == 'shan';
                },
                filter:function(event,player){
                    return player.countCards('he') > 0;
                },
                chooseButton:{
                    dialog:function(event,player){
						var list = [];
						var packs = lib.config.all.cards.diff(lib.config.cards);
                        for (var i in lib.card){
                            if(lib.card[i].mode&&lib.card[i].mode.contains(lib.config.mode)==false) continue;
							if(lib.card[i].forbid&&lib.card[i].forbid.contains(lib.config.mode)) continue;
							if (packs){
								var f = false;
								for (var j = 0; j < packs.length; j ++){
									if (lib.cardPack[packs[j]].contains(i)){
										f = true;
										break;
									}
								}
								if (f) continue;
							}
                            if(lib.card[i].type == 'basic' && event.filterCard({name:i},player,event)){
                                list.add(i);
                            }
						}
                        for(var i=0;i<list.length;i++){
                            list[i]=[get.type(list[i]),'',list[i]];
                        }
                        return ui.create.dialog([list,'vcard']);
                    },
                    check:function(button){
                        return (button.link[2]=='tao')?1:-1;
                    },
                    backup:function(links,player){
                        return {
                            filterCard:function(card,player){
                                return get.type(card) != 'basic';
                            },
                            position:'he',
                            selectCard:1,
                            popname:true,
                            viewAs:{name:links[0][2]},
                            onuse:function(result,player){
                    			player.addTempSkill('stg_yinyangyu_duang');
                			},
                        }
                    },
                    prompt:function(links,player){
                        return '将一张非基本牌当作'+get.translation(links[0][2])+'使用/打出';
                    }
                },
                ai:{
                	save:true,
                	skillTagFilter:function(player){
                        return player.countCards('he')>0;
                    },
                },
			},
			stg_yinyangyu_duang:{
				trigger:{source:'damageBegin'},
				forced:true,
				filter:function(event,player){
					return event.card&&event.card.name=='sha'&&event.cards&&
						event.cards.length==1&&event.cards[0].name=='stg_yinyangyu';
				},
				content:function(){
					trigger.num++;
				}
			},
			stg_bagua_skill:{
				init:function(player){
					player.addSkill('masterspark');
				},
				trigger:{source:'damageEnd'},
				forced:true,
				content:function(){
					player.gainlili();
				},
			},
			stg_missile_skill:{
				group:'missile_count',
				init:function(player){
					player.addSkill('stardust');
					lib.skill['stardust'].skillAnimation=true;
				},
				trigger:{player:'phaseEnd'},
				filter:function(event,player){
					return player.hasSkill('missile_ready');
				},
				content:function(){
					'step 0'
					player.chooseTarget('魔法飞弹：视为使用一张【轰！】',function(card,player,target){
						return player.canUse({name:'sha'},target,false);
					}).set('ai',function(target){
						return get.effect(target,{name:'sha'},_status.event.player);
					});
					"step 1"
					if(result.bool){
						player.logSkill('stg_missile',result.targets);
						player.useCard({name:'sha'},result.targets[0],false);
					}
				},
				prompt:'魔法飞弹：你可以视为使用一张【轰！】',
			},
			missile_count:{
				trigger:{player:'useCardAfter'},
				direct:true,
				priority:-10,
				filter:function(event,player){
					return event.card.name == 'sha';
				},
				content:function(){
					player.addTempSkill('missile_ready');
				}
			},
			missile_ready:{
			},
			stg_chongci_skill:{
				forced:true,
				trigger:{source:'damageBegin'},
				filter:function(event, player){
					return player.countUsed() == 1;
				},
				content:function(){
					trigger.num ++;
				},
			},
			stg_zhuanzhu_skill:{
				trigger:{target:'shaBegin'},
				filter:function(event, player){
					return player.countCards('hej');
				},
				content:function(){
					'step 0'
    				player.chooseCard('hej', [1,3]);
    				"step 1"
    				if(result.bool){
    					player.recast(result.cards);
    				}
				}
			},
			stg_juedi_skill:{
				forced:true,
				trigger:{player:'damageBefore'},
				filter:function(event, player){
					return !player.storage.fuhuo && player == game.me;
				},
				content:function(){
					trigger.cancel();
					event.str=get.translation(player.name)+'的【绝地】防止了伤害';
					game.notify(event.str);
				},
				mod:{
					maxHandcard:function(player, num){
						if (player.hp == 1) return Infinity;
					}
				}
			},
			stg_deck_skill:{
				init:function(player){
					if (player.identity != 'zhu') player.addSkill('world');
				},
				trigger:{global:'gainAfter'},
				usable:1,
				filter:function(event,player){
					return (player != event.player && !(event.player == _status.currentPhase && _status.event.getParent('phaseDraw')));
				},
				content:function(){
					player.discardPlayerCard(trigger.player, 'hej', true);
				},
			},
			stg_watch_skill:{
				init:function(player){
					if (player.identity != 'zhu') player.addSkill('privateSquare');
				},
				forced:true,
				trigger:{source:'damageAfter'},
				filter:function(event, player){
					return true;
				},
				content:function(){
					player.addTempSkill('stg_watch_stop');
				},
			},
			stg_watch_stop:{
				direct:true,
				trigger:{player:['damageBefore','loseHpBefore','loseliliBefore']},
				filter:function(event,player){
					return event.num > 0;
				},
				content:function(){
					this.trigger.num = 0;
					trigger.cancel();
				},
			},
			doll:{
				audio:2,
				cost:2,
				spell:['doll2'],
				trigger:{player:'phaseBegin'},
				filter:function(event,player){
					return player.lili > lib.skill.doll.cost;
				},
				content:function(){
                      player.loselili(lib.skill.doll.cost);
                      player.turnOver();
                  },
			},
			doll2:{
				audio:2,
				trigger:{player:'phaseEnd'},
				filter:function(event,player){
					return true;
				},
				content:function(){
					event.count = 0;
					'step 0'
					player.chooseTarget(get.prompt('doll'),function(card,player,target){
						return player.canUse({name:'sha'},target,false);
					});
					"step 1"
					if(result.bool){
						player.logSkill('doll',result.targets);
						player.useCard({name:'sha'},result.targets[0],false);
						event.count++;
						if (!event.count > 2) event.goto(0);
					}
				}
			},
			privateSquare:{
				audio:2,
				cost:2,
				roundi:true,
				
				spell:['private2', 'private3'],
				trigger:{player:'phaseBegin'},
				filter:function(event,player){
					return player.lili > lib.skill.privateSquare.cost;
				},
				content:function(){
					if(lib.config.background_audio){
						setTimeout(function(){
							game.playAudio('effect','timestop');
							ui.backgroundMusic.pause();
						}, 1000);
					}
					player.loselili(lib.skill.privateSquare.cost);
					player.turnOver();
                },
			},
			private2:{
				audio:2,
				forced:true,
				trigger:{player:'phaseAfter'},
				content:function(){
					ui.backgroundMusic.play();
					player.insertPhase();
				},
			},
			private3:{
				direct:true,
				trigger:{source:'damageBegin',player:'loseliliBefore'},
				content:function(){
					trigger.num = 0;
					trigger.cancel();
				},
			},
			masterspark:{
				audio:2,
                cost:1,
                spell:['spark1'],
                trigger:{player:'phaseBegin'},
                filter:function(event,player){
                    return player.lili > lib.skill.masterspark.cost;
                },
                content:function(){
                    player.loselili(lib.skill.masterspark.cost);
					game.playBackgroundMusic('marisa');
                    lib.config.musicchange = 'off';
                    player.turnOver();
                  },
                check:function(event,player){
                  return player.lili > 3;
                },
			},
			spark1:{
				trigger:{source:'damageBegin'},
				filter:function(event){
					return event.nature != 'thunder';
				},
				forced:true,
				content:function(){
					trigger.num+=(player.lili-1);
					player.loselili(player.lili-1);
				}
			},
			fengmo:{
                audio:2,
                cost:2,
                spell:['fengmo1'],
                
                trigger:{player:'phaseBegin'},
                filter:function(event,player){
                    return player.lili > lib.skill.fengmo.cost;
                },
                content:function(){
                    player.loselili(lib.skill.fengmo.cost);
                    player.turnOver();
                  },
                check:function(event,player){
                  return player.lili > 3;
                },
			},
			fengmo1:{
				init:function(player){
					var players = game.filterPlayer();
					players.remove(player);
					for (var i = 0; i < players.length; i++){
						players[i].addTempSkill('fengyin');
						players[i].addTempSkill('unequip');
						player.discardPlayerCard(players[i],'hej',[1,1],true);
						players[i].addTempSkill('lunadial2');
					}
				},
				onremove:function(player){
					var players = game.filterPlayer();
					players.remove(player);
					for (var i = 0; i < players.length; i++){
						players[i].removeSkill('fengyin');
						players[i].removeSkill('unequip');
						players[i].removeSkill('lunadial2');
					}
				},
			},
			stg_firebook_skill:{
				global:'firebook1',
			},
			firebook1:{
				mod:{
					cardUsable:function(card,player,num){
						if(card.name=='sha') return num+game.countPlayer(function(current){
							if(current.identity != player.identity) return false;
							if(current.hasSkill('stg_firebook_skill')) return true;
						});
					}
				},
			},
			stg_waterbook_skill:{
				global:'waterbook1',
			},
			waterbook1:{
				enable:['chooseToUse','chooseToRespond'],
				filterCard:function(card){
					return get.color(card)=='black';
				},
				viewAs:{name:'shan'},
				viewAsFilter:function(player){
					if(!player.countCards('h',{color:'black'})) return false;
					return game.hasPlayer(function(current){
						return current.isFriendsOf(player) && current.hasSkill('stg_waterbook_skill');
					});
				},
				prompt:'将一张黑色手牌当【躲～】使用/打出',
				check:function(){return 1},
				ai:{
					respondShan:true,
					skillTagFilter:function(player){
						if(!player.countCards('h',{color:'black'})) return false;
					},
					effect:{
						target:function(card,player,target,current){
							if(get.tag(card,'respondShan')&&current<0) return 0.6
						}
					}
				}
			},
			stg_woodbook_skill:{
				global:'woodbook1',
			},
			woodbook1:{
				mod:{
					maxHandcard:function(player,num){
						return num+game.countPlayer(function(current){
							return current.hasSkill('stg_woodbook_skill') && current.isFriendsOf(player);
						});
					}
				},
			},
			stg_dirtbook_skill:{
				forced:true,
				trigger:{global:'dieEnd'},
				filter:function(event,player){
					return event.player.identity != player.identity && event.player.countCards('hej');
				},
				content:function(){
					player.gainPlayerCard('hej',trigger.player,true);
				}
			},
			stg_goldbook_skill:{
				global:'goldbook1',
			},
			goldbook1:{
				direct:true,
				trigger:{player:'phaseDrawBegin'},
				filter:function(event,player){
					return game.countPlayer(function(current){
							return current.hasSkill('stg_goldbook_skill') && current.isFriendsOf(player);
						}) > 0;
				},
				content:function(){
					trigger.num+=game.countPlayer(function(current){
							return current.hasSkill('stg_goldbook_skill') && current.isFriendsOf(player);
						});
				},
			},
			xixue:{
				trigger:{source:'damageEnd'},
				forced:true,
				filter:function(event,player){
					return game.hasPlayer(function(current){
						return current.name == 'remilia' || current.name == 'flandre';
					});
				},
				content:function(){
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i ++){
						if (players[i].name == 'remilia' || players[i].name == 'flandre'){
							players[i].gainlili();
							if (players[i].lili == players[i].maxlili || players[i].isTurnedOver()) players[i].draw();
						}
					}
				},
			},
			silent:{
				audio:2,
				infinite:true,
				cost:0,
				trigger:{player:'phaseBegin'},
				spell:['silent1'],
				init:function(player){
					if (get.mode()=='stg'){
						game.pause();
						setTimeout(function(){
							if (game.me.name == 'reimu'){
								player.say('什么啊，怎么又来了？');
								setTimeout(function(){
									player.say('今天哮喘也没怎么犯，就让你看看我珍藏的魔法吧！');
									setTimeout(function(){
										game.resume();
									}, 2500);
				                }, 2500);
							}
							else if (game.me.name == 'marisa'){
								player.say('什么啊，你又来了啊？');
								setTimeout(function(){
									player.say('现在不说这个——不论对你还是对妹妹大人，今天都是厄日！');
				                	setTimeout(function(){
										game.resume();
									}, 2500);
				                }, 2500);
							} else {
								player.say('虽然不知道你是做什么来的……');
								setTimeout(function(){
									player.say('但是你可是挑了错误的时间出现在错误的地方了！');
				                	setTimeout(function(){
										game.resume();
									}, 2500);
				                }, 2500);
							}
						}, 0);
						player.useSkill('silent');
						game.me.storage.reskill = ['royal'];
						game.me.storage.reinforce = [];
						player.equip(game.createCard('book'));
						ui.boss.style.display = 'initial';
						player.dataset.position = 4;
					}
				},
				content:function(){
					player.turnOver();
					game.boss = player;
				},
			},
			silent1:{
				audio:2,
				trigger:{player:'phaseEnd'},
				forced:true,
				content:function(){
					'step 0'
                    player.chooseTarget('月光炮目标是？',function(card,player,target){
                        return player != target;
                     }).set('ai',function(target){
                        return -get.attitude(target,player);
                     });
                     'step 1'
                     if (result.bool && result.targets){
						player.line(result.targets, 'green');
                        event.target = result.targets[0];
                        event.target.chooseControl('受到1点弹幕伤害','下一次对'+get.translation(player)+'造成的伤害-1').set('ai',function(){
                            return '下一次对'+get.translation(player)+'造成的伤害-1';
    					});
                     }
                     'step 2'
                     if (result.control == '受到1点弹幕伤害'){
                     	event.target.damage();
                     } else if (result.control == '下一次对'+get.translation(player)+'造成的伤害-1'){
                     	event.target.addSkill('silent_negate');
                     }
				},
			},
			silent_negate:{
				forced:true,
				trigger:{source:'damageBegin'},
				filter:function(event){
					return event.player.hasSkill('silent1');
				},
				content:function(){
					trigger.num--;
					player.removeSkill('silent_negate');
				},
			},
			royal:{
				audio:2,
				infinite:true,
				cost:0,
				trigger:{player:'phaseBeginStart'},
				spell:['royal1', 'royal_die'],
				init:function(player){
					if (get.mode() == 'stg'){
						player.classList.remove('turnedover');
						player.removeSkill('silent');
						player.removeSkill('silent1');
						player.useSkill('royal');
					}
				},
				content:function(){
					player.turnOver();
				},
			},
			royal1:{
				audio:2,
				forced:true,
				trigger:{player:'phaseBegin'},
				content:function(){
					"step 0"
	                  event.current=player.next;
	                  event.players=game.filterPlayer().remove(player);
	                  player.line(event.players,'fire');
	                 "step 1"
						var next=event.current.chooseToRespond({name:'sha'});
						next.set('ai',function(card){
							var evt=_status.event.getParent();
							if(get.damageEffect(evt.target,evt.player,evt.target)>=0) return 0;
							return 11-get.value(card);
						});
						next.autochoose=lib.filter.autoRespondSha;
						"step 2"
						if(result.bool==false){
							event.current.damage();
						}
	                  if(event.current.next!=player){
	                      event.current=event.current.next;
	                      game.delay(0.5);
	                      event.goto(1);
	                  }
				},
			},
			royal_die:{
				trigger:{player:'dieBefore'},
				fixed:true,
				direct:true,
				filter:function(){
					return get.mode() == 'stg';
				},
				content:function(){
					game.me.storage.reinforce = ['stg_maid', 'stg_maid','stg_maid','flandre'];
					game.me.recover(game.me.maxHp);
					game.me.storage.fuhuo ++;
					game.notify(get.translation(game.me) + '获得了一个残机');
					game.log(game.me,'获得了一个残机！');
					ui.boss.style.display = 'none';
					/*
					this.hide();
					game.addVideo('hidePlayer',this);
					game.players.remove(this);
					this.delete();
					*/
				}
			},
			fourof:{
				audio:2,
				infinite:true,
				cost:0,
				//trigger:{player:'phaseBegin'},
				spell:['fourof1'],
				init:function(player){
					player.useSkill('fourof');
				},
				content:function(){
					player.turnOver();
				},
			},
			fourof1:{
				init:function(event,character){
					var list = game.filterPlayer();
					for (var i = 0; i < list.length; i ++){
						if (list[i].identity == 'zhong') list[i].die();
					}
					lib.character['flandre'] = ['female','0',2,['kuangyan','flandimmune'],[]];
					game.addBossFellow(2,'flandre',0);
					game.addBossFellow(5,'flandre',0);
					game.addBossFellow(7,'flandre',0);
				},
				content:function(){

				},
			},
			flandimmune:{
				direct:true,
				trigger:{source:'damageBegin'},
				group:['flandie'],
				filter:function(event,player){
					return event.player.name == 'flandre';
				},
				content:function(){
					trigger.cancel();
				}
			},
			flandie:{
				trigger:{player:'dieBefore'},
				direct:true,
				filter:function(){
					return get.mode() == 'stg';
				},
				content:function(){
					game.me.recover();
				}
			},
			starbow:{
				audio:2,
				cost:0,
				infinite:true,
				spell:['starbow1'],
				init:function(player){
					var list = game.filterPlayer();
					for (var i = 0; i < list.length; i ++){
						if (list[i].name == 'flandre' && !list[i].hasSkill('starbow')){
							if (list[i].lili == 0) list[i].gainlili();
							list[i].classList.remove('turnedover');
							list[i].removeSkill('fourof');
							list[i].removeSkill('fourof1');
							list[i].addSkill('starbow');
							list[i].useSkill('starbow');
						}
					}
					if (!player.hasSkill('starbow1') && player == game.boss){
						player.classList.remove('turnedover');
						player.removeSkill('fourof');
						player.removeSkill('fourof1');
						player.useSkill('starbow');			
					}
				},
				content:function(){
					player.turnOver();
				},
				intro:{
                    content:function(storage,player){
                        if (!storage) return null;
                        return '所有角色不能使用'+get.translation(storage)+'花色的牌';
                    }
                },
			},
			starbow1:{
				trigger:{player:'phaseBegin'},
				global:'starbow2',
				group:'starbow3',
				forced:true,
				filter:function(){
					return true;
				},
				content:function(){
					'step 0'
					player.judge();
					'step 1'
					player.storage.starbow = get.suit(result.card);
					player.syncStorage('starbow');
					player.markSkill('starbow');
				},
			},
			starbow2:{
				mod:{
					cardEnabled:function(card,player){
						if(_status.event.skill!='starbow3'&& game.hasPlayer(function(current){
                            return current.storage.starbow && get.suit(card) == current.storage.starbow;
                        })) return false;
					},
					cardUsable:function(card,player){
						if(_status.event.skill!='starbow3'&& game.hasPlayer(function(current){
                            return current.storage.starbow && get.suit(card) == current.storage.starbow;
                        })) return false;
					},
					cardRespondable:function(card,player){
						if(_status.event.skill!='starbow3'&& game.hasPlayer(function(current){
                            return current.storage.starbow && get.suit(card) == current.storage.starbow;
                        })) return false;
					},
					cardSavable:function(card,player){
						if(_status.event.skill!='starbow3'&& game.hasPlayer(function(current){
                            return current.storage.starbow && get.suit(card) == current.storage.starbow;
                        })) return false;
					},
				},
			},
			starbow3:{
				audio:2,
				enable:['chooseToUse','chooseToRespond'],
				filterCard:function(card,player){
					return player.storage.starbow && get.suit(card) == player.storage.starbow;
				},
				viewAs:{name:'sha'},
				check:function(){return 1},
				ai:{
					effect:{
						target:function(card,player,target,current){
							if(get.tag(card,'respondSha')&&current<0) return 0.6
						}
					},
					respondSha:true,
					order:4,
					useful:-1,
					value:-1
				}
			},
			stg_cherry_effect:{
				forced:true,
				trigger:{source:'damageAfter'},
				filter:function(event, player){
					//if (player.countCards('j', {name:'stg_jiejie'}) > 0) return false;
					var data = 0;
					for(var j=0;j<player.stat.length;j++){
						if(player.stat[j].damage != undefined) data += player.stat[j].damage;
					}
					var og = data - event.num;
					return event.num > 0 && og != 0 && Math.floor(data/7) > Math.floor(og/7);
				},
				content:function(){
					game.log('【森罗结界】发动！');
					player.gain(game.createCard('stg_jiejie'));
				},
			},
			stg_sidie:{
				trigger:{source:'damageBefore'},
				filter:function(event, player){
					return player.countCards('h', {name:'stg_sidie'}) > 0;
				},
				content:function(){
					trigger.cancel();
					player.showCards(player.getCards('h',{name:'stg_sidie'}));
					trigger.player.loseHp(trigger.num);
				},
				prompt2:'你可以展示【死蝶之佑】，防止该伤害，改为其失去等量体力',
			},
			stg_jiejie_skill:{
				group:'stg_jiejie_skill2',
				forced:true,
				trigger:{player:'damageBefore'},
				init:function(){
					game.playAudio('effect', 'border');
				},
				filter:function(event, player){
					return event.num > 0;
				},
				content:function(){
					"step 0"
					game.playAudio('effect', 'bonus');
    				var cards = player.getCards('j');
					for (var i = 0; i <= cards.length; i ++){
						if(cards[i]&&cards[i].name == 'stg_jiejie'){
							player.discard(cards[i]);
							break;
						}
					}
					trigger.cancel();
					event.str=get.translation(player.name)+'的【森罗结界】防止了伤害';
					game.notify(event.str);
				},
			},
			stg_jiejie_skill2:{
				trigger:{player:'phaseBegin'},
				forced:true,
				filter:function(event, player){
					return true;
				},
				content:function(){
					"step 0"
    				var cards = player.getCards('j');
					for (var i = 0; i <= cards.length; i ++){
						if(cards[i]&&cards[i].name == 'stg_jiejie'){
							player.discard(cards[i]);
							break;
						}
					}
					"step 1"
					game.playAudio('effect', 'bonus');
					player.draw(2);
				},
			},
			stg_shanghai_skill:{
				init:function(player){
					player.drawSkill();
				},
			},
			stg_shanghai_shanghai_skill:{
				group:'stg_shanghai_skill',
				mod:{
					maxHandcard:function(player,num){
						return num + 1;
					},
				}
			},
			stg_ghost_skill:{
				trigger:{player:'damageBefore'},
				forced:true,
				group:'stg_ghost_skill2',
				filter:function(event, player){
					return (!event.nature || event.nature != 'thunder') && player.lili > 0;
				},
				content:function(){
					trigger.nature = 'thunder';
				},
			},
			stg_ghost_skill2:{
				trigger:{player:'phaseEnd'},
				forced:true,
				content:function(){
					player.loselili(1);
				},
			},
			alicedie:{
				trigger:{player:'dieBefore'},
				direct:true,
				content:function(){
					lib.character['alice'][3] = ['huanfa', 'mocai', 'alicespawn'];
					game.me.storage.reskill = ['shanghai_alice'];
				},
			},
			alicespawn:{
				init:function(){
					game.addBossFellow(2, 'stg_puppet', 1);
					game.addBossFellow(6, 'stg_puppet', 1);
				}
			},
			shanghai_alice:{
				audio:2,
				infinite:true,
				cost:0,
				spell:['shanghai_alice1', 'shanghai_alice2'],
				init:function(player){
					player.useSkill('shanghai_alice');
				},
				content:function(){
					player.loselili(lib.skill.shanghai_alice.cost);
					player.turnOver();
				}
			},
			shanghai_alice1:{
				audio:2,
				init:function(){
					game.addBossFellow(3, 'stg_shanghai', 2);
					game.addBossFellow(5, 'stg_shanghai', 2);
				},
				forced:true,
				/*
				trigger:{global:'die'},
				filter:function(event){
					return event.player.countCards('he') > 0;
				},
				content:function(){
					event.togain = trigger.player.getCards('he');
					if (!player.storage.huanfa) player.storage.huanfa=[];
					player.storage.huanfa = player.storage.huanfa.concat(event.togain);
					player.syncStorage('huanfa');
					player.markSkill('huanfa');
					game.addVideo('gain2',player,get.cardsInfo([event.togain]));
					game.log(player,'将',result.cards.length,'张牌置为“手办”');
				},
				*/
			},
			shanghai_alice2:{
				audio:2,
				trigger:{player:'phaseBegin'},
				forced:true,
				filter:function(event){
					return !game.countPlayer(function(current){
						if (current.name == 'stg_shanghai'){
							return true;
						}
						return false;
					});
				},
				content:function(){
					game.addBossFellow(3, 'stg_shanghai', 2);
					game.addBossFellow(5, 'stg_shanghai', 2);
				},
			},
			dahezou:{
				audio:2,
				infinite:true,
				cost:0,
				spell:['dahezou_skill1'],
				init:function(player){
					if (player == game.boss){
						if (game.boss.name == 'lunasa'){
							lib.character["merlin"][3] = ["mingguan", "dahezou"];
							lib.character["lyrica"][3] = ["mingjian", "dahezou"];
							game.addBossFellow(3, 'merlin', 3);
							game.addBossFellow(5, 'lyrica', 3);
						} else if (game.boss.name == 'merlin'){
							lib.character["lunasa"][3] = ["shenxuan", "dahezou"];
							lib.character["lyrica"][3] = ["mingjian", "dahezou"];
							game.addBossFellow(3, 'lunasa', 3);
							game.addBossFellow(5, 'lyrica', 3);
						} else if (game.boss.name == 'lyrica'){
							lib.character["lunasa"][3] = ["shenxuan", "dahezou"];
							lib.character["merlin"][3] = ["mingguan", "dahezou"];
							game.addBossFellow(3, 'lunasa', 3);
							game.addBossFellow(5, 'merlin', 3);
						}
					}
					player.useSkill('dahezou');
				},
				content:function(){
					player.loselili(lib.skill.dahezou.cost);
					player.turnOver();
				}
			},
			dahezou_skill1:{
				trigger:{global:'shaBegin'},
				filter:function(event, player){
					return player.countCards('h') > 0 && (!player.storage.mingzhi || player.storage.mingzhi.length < player.countCards('h')) && !event.directHit;
				},
				content:function(){
					"step 0"
					player.chooseCard('h', function(card){
						var player=_status.event.player;
						return (!player.storage.mingzhi || !player.storage.mingzhi.contains(card)) && get.color(card) == get.color(trigger.card);
					});
					"step 1"
					if (result.bool){
						player.mingzhiCard(result.cards[0]);
						if(typeof trigger.shanRequired=='number'){
							trigger.shanRequired+=1;
						}
						else{
							trigger.shanRequired=1;
						}
					}
				},
				check:function(event, player){
					return -get.attitude(player,event.target);
				}
			},
			stg_louguan_skill:{
				trigger:{source:'damageEnd'},
				audio:2,
				filter:function(event){
					return (event.card && get.subtype(event.card) == 'attack' && event.nature != 'thunder' && event.player.isAlive() && event.player.countCards('hej'));
				},
				content:function(){
					"step 0"
					if (trigger.player.num('h')) player.discardPlayerCard('h',trigger.player,true);
					"step 1"
					if (trigger.player.num('e')) player.discardPlayerCard('e',trigger.player,true);
					"step 2"
					if (trigger.player.num('j')) player.discardPlayerCard('j',trigger.player,true);
				},
			},
			stg_bailou_skill:{
				group:'stg_bailou_skill1',
				audio:2,
				enable:['chooseToRespond','chooseToUse'],
				filterCard:function(card,player){
					return get.bonus(card) && get.bonus(card) > 0;
				},
				position:'he',
				viewAs:{name:'sha'},
				prompt:'将一张有灵力的牌当【轰！】使用或打出',
				check:function(card){return 4-get.value(card)},
				ai:{
					skillTagFilter:function(player){
						if(!player.countCards('he',function(card){
							return get.bonus(card) > 0;	
						})) return false;
					},
					respondSha:true,
				},
			},
			stg_bailou_skill1:{
				trigger:{source:'damageEnd'},
				forced:true,
				filter:function(event){
					return event.nature != 'thunder' && event.player.isAlive();
				},
				content:function(){
					trigger.player.damage('thunder');
				},
				ai:{
					thunderDamage:1,
				},
			},
			mingfa:{
				audio:2,
				infinite:true,
				cost:0,
				spell:['mingfa_skill'],
				init:function(player){
					player.useSkill('mingfa');
				},
				content:function(){
					player.loselili(lib.skill.mingfa.cost);
					player.turnOver();
				}
			},
			mingfa_skill:{
				audio:2,
				global:'mingfa_skill1',
				trigger:{global:'phaseEnd'},
				forced:true,
				filter:function(event, player){
					return event.player == game.me;
				},
				content:function(){
					if (trigger.player.storage.mingfa){
						trigger.player.storage.mingfa = false;
					} else {
						trigger.player.loseHp();
					}
				},
			},
			mingfa_skill1:{
				direct:true,
				trigger:{source:'damageEnd'},
				filter:function(event, player){
					return player == game.me && event.player.hasSkill('mingfa_skill');
				},
				content:function(){
					player.storage.mingfa = true;
				},
			},
			tianshangjian:{
				audio:2,
				infinite:true,
				cost:0,
				spell:['tianshangjian_skill'],
				init:function(player){
					player.classList.remove('turnedover');
					player.removeSkill('mingfa');
					player.removeSkill('mingfa_skill');
					player.useSkill('tianshangjian');
				},
				content:function(){
					player.loselili(lib.skill.tianshangjian.cost);
					player.turnOver();
				},
			},
			tianshangjian_skill:{
				audio:2,
				trigger:{player:"phaseEnd"},
				content:function(){
					'step 0'
					var list = [];
					var packs = lib.config.all.cards.diff(lib.config.cards);
					for (var i in lib.card){
						if(lib.card[i].mode&&lib.card[i].mode.contains(lib.config.mode)==false) continue;
						if(lib.card[i].forbid&&lib.card[i].forbid.contains(lib.config.mode)) continue;
						//if(lib.card[i].type == 'trick' || lib.card[i].type == 'basic' || lib.card[i].type == "jinji" || lib.card[i].type == "equip"){
						if (packs){
							var f = false;
							for (var j = 0; j < packs.length; j ++){
								if (lib.cardPack[packs[j]].contains(i)){
									f = true;
									break;
								}
							}
							if (f) continue;
						}
						if (lib.translate[i] && (lib.card[i].subtype == 'attack' || lib.card[i].subtype == "defense")){
							if (player.storage.tianshangjian_skill_2){
								for (var j = 0; j < player.storage.tianshangjian_skill_2.length; j ++){
									if (player.storage.tianshangjian_skill_2[j].name == i){
										break;
									}
									if (j == player.storage.tianshangjian_skill_2.length - 1){
										list.add(i);
									}
								}
							} else {
								list.add(i);
							}
						}
					}
					player.chooseButton(['选择不让使用打出的牌',[list,'vcard']], true).set('filterButton',function(button){
							return true;
						}).set('ai',function(button){
							return button.link[2] == _status.event.rand;
						}).set('rand', list.randomGet());
					'step 1'
					if(result.bool){
						player.addSkill('tianshangjian_skill_2');
						game.log(get.translation(player)+'声明了'+get.translation(result.links[0][2]));
						game.notify(get.translation(player)+'声明了'+get.translation(result.links[0][2]));
						if (!player.storage.tianshangjian_skill_2) player.storage.tianshangjian_skill_2=[];
						player.showCards(result.links);
						player.storage.tianshangjian_skill_2.add(game.createCard(result.links[0][2], '',''));
						//player.storage.tianjian.add(game.createCard(result.links[0][2],'',''));
						player.markSkill('tianshangjian_skill_2');
						player.syncStorage('tianshangjian_skill_2');							
					}
				},
			},
			tianshangjian_skill_2:{
				trigger:{global:'useCardBefore'},
				intro:{
					content:'cards'
				},
				forced:true,
				filter:function(event, player){
					if (!player.storage.tianshangjian_skill_2) return false;
					for (var i = 0; i < player.storage.tianshangjian_skill_2.length; i ++){
						if (player.storage.tianshangjian_skill_2[i].name == event.card.name)
						return true;
					}
				},
				content:function(){
					trigger.player.loseHp();
				},
			},
			liudaojian:{
				audio:2,
				infinite:true,
				cost:0,
				spell:['liudaojian_skill'],
				trigger:{player:['phaseBegin']},
				init:function(player){
					//这里需要对话
					player.equip(game.createCard('stg_bailou'));
					player.useSkill('liudaojian');
				},
				content:function(){
					player.loselili(lib.skill.liudaojian.cost);
					player.turnOver();
				}
			},
			liudaojian_skill:{
				audio:2,
				/*enable:'chooseToUse',
				filter:function(event, player){
					return _status.event.getParent('phaseUse');
				}, */
				enable:'phaseUse',
				filterCard:function(card){
					return card.name == "sha";
				},
				viewAs:{name:'stg_lingji'},
				viewAsFilter:function(player){
					if(!player.countCards('h',{name:'sha'})) return false;
				},
				prompt:'将一张【轰！】当【灵击】使用',
				check:function(card){
					if(_status.event.type=='dying') return 1;
					return 4-get.value(card);
				},
				ai:{
					skillTagFilter:function(player){
						if(!player.countCards('h',{name:'sha'})) return false;
					},
					threaten:1.5,
				}
			},
			hualing:{
				audio:2,
				infinite:true,
				cost:0,
				spell:['hualing_skill'],
				init:function(player){
					setTimeout(function(){
						ui.background.setBackgroundImage('image/background/stg_yuyuko.jpg');
					}, 1000);
					player.useSkill('hualing');
				},
				content:function(){
					player.loselili(lib.skill.hualing.cost);
					player.turnOver();
				}
			},
			hualing_skill:{
				audio:2,
				trigger:{global:'phaseBegin'},
				forced:true,
				filter:function(event, player){
					return event.player == game.me & !game.countPlayer(function(current){
						return current.name == 'stg_ghost';
					});
				},
				content:function(){
					game.addBossFellow(3, 'stg_ghost', 2);
				},
			},
			wangwo:{
				audio:2,
				infinite:true,
				cost:0,
				spell:['wangwo_skill'],
				init:function(player){
					player.classList.remove('turnedover');
					player.removeSkill('hualing');
					player.removeSkill('hualing_skill');
					player.useSkill('wangwo');
				},
				content:function(){
					player.loselili(lib.skill.wangwo.cost);
					player.turnOver();
				}
			},
			wangwo_skill:{
				trigger:{global:'phaseEnd'},
				forced:true,
				filter:function(event, player){
					return event.player == game.me;
				},
				content:function(){
					"step 0"
					event.num = player.maxHp - player.hp + 1;
					"step 1"
					player.line(trigger.player, 'pink');
					trigger.player.chooseControl('弃两张牌', '失去1点体力', '受到2点灵击伤害', true);
					"step 2"
					if (result.control == "弃两张牌"){
						trigger.player.chooseToDiscard('hej', 2, true);
					} else if (result.control == "失去1点体力"){
						trigger.player.loseHp();
					} else if (result.control == "受到2点灵击伤害"){
						trigger.player.damage(2, "thunder");
					}
					"step 3"
					event.num --;
					if (event.num > 0){
						event.goto(1);
					}
				},
			},
			stg_fanhun:{
				audio:2,
				infinite:true,
				cost:0,
				spell:['stg_fanhun_skill', 'stg_fanhun_skill2'],
				init:function(player){
					player.hide();
					ui.backgroundMusic.pause();
					game.pause();
					player.classList.remove('turnedover');
					player.removeSkill('wangwo');
					player.removeSkill('wangwo_skill');
					ui.background.setBackgroundImage('image/background/stg_sakura.jpg');
					player.node.avatar.setBackgroundImage('image/mode/stg/character/stg_yuyuko.jpg');
					setTimeout(function(){
						game.swapMusic(true);
						ui.backgroundMusic.play();
						player.show();
						player.useSkill('stg_fanhun');
						player.addSkill('cherry_win');
						ui.background.setBackgroundImage('image/background/stg_tree.jpg');
						game.resume();
					}, 2000);
				},
				content:function(){
					player.loselili(lib.skill.stg_fanhun.cost);
					player.turnOver();
				}
			},
			stg_fanhun_skill:{
				init:function(player){
                    player.nodying=true;
					if (player.hp <= 0) player.hp=0;
					player.maxHp = 0;
                    player.update();
                },
                onremove:function(player){
                    delete player.nodying;
                    if (player.hp <= 0) {
						player.hp=0;
						player.die();
                    }
				},
				trigger:{player:'phaseDiscardAfter'},
				content:function(){
					player.loselili();
					player.draw();
				},
			},
			stg_fanhun_skill2:{
				audio:2,
				direct:true,
				trigger:{player:['damageBefore','loseHpBefore','loseliliBefore']},
				filter:function(event,player){
					return event.num > 0 && event.parent.skill != 'stg_fanhun_skill';
				},
				content:function(){
					trigger.num = 0;
					//trigger.cancel();
				},
			},
			lilywhitedieafter:{
				trigger:{player:'dieBefore'},
				direct:true,
				init:function(player){
					// 这里调背景
					game.me.storage.reinforce = [];
					player.dataset.position = 4;
					setTimeout(function(){
						ui.background.setBackgroundImage('image/background/stg_sky.jpg');
					}, 0);
				},
				content:function(){
					game.me.storage.reinforce.push('stg_yousei', 'stg_yousei', 'stg_ghost');
					if (game.me.name == 'reimu'){
						game.me.storage.reinforce.push('lunasa');
						lib.character["lunasa"][3] = ["shenxuan", "zhenhun"];
					} else if (game.me.name == 'marisa'){
						game.me.storage.reinforce.push('lyrica');
						lib.character["lyrica"][3] = ["mingjian", "huanzou"];
					} else if (game.me.name == 'sakuya'){
						game.me.storage.reinforce.push('merlin');
						lib.character["merlin"][3] = ["mingguan", "kuangxiang"];
					} else {
						game.me.storage.reinforce.push('lunasa');
						lib.character["lunasa"][3] = ["shenxuan", "zhenhun"];
					}
					setTimeout(function(){
						ui.background.setBackgroundImage('image/background/stg_barrier.jpg');	
					}, 0);
					// 死后顺便也调背景
				},
			},
			youmuinit:{
				group:'handcard_max',
				init:function(player){
					player.equip(game.createCard('stg_louguan'));
	                player.equip(game.createCard('stg_bailou'));
				},
			},
			youmudieafter:{
				trigger:{player:'dieBefore'},
				direct:true,
				init:function(player){
					if (get.mode()=='stg'){
						game.pause();
						setTimeout(function(){
								player.say('你是，人类呢。');
								setTimeout(function(){
									player.say('来的正好。把你手里的那一点春');
				                	setTimeout(function(){
										player.say('全部都交出来！');
										game.resume();
									}, 2500);
				                }, 2500);
						}, 0);
						game.me.storage.reinforce = [];
						player.dataset.position = 4;
					}
				},
				content:function(){
					game.me.storage.reinforce.push('stg_ghost', 'stg_ghost', 'youmu');
					lib.character["youmu"][3] = ['youmuinit', 'yishan'];
				},
			},
			youmudieafter2:{
				trigger:{player:'dieBefore'},
				direct:true,
				init:function(player){
					if (get.mode()=='stg'){
						game.pause();
						setTimeout(function(){
							player.say('如果你再继续向前，即使你被大小姐杀掉我也不管啦！');
							setTimeout(function(){
								game.resume();
							}, 2000);
						}, 0);
						game.me.storage.reinforce = [];
						player.dataset.position = 4;
					}
				},
				content:function(){
					game.me.storage.reinforce.push('yuyuko');
				},
			},
		},
		forbidstg:[
			['stg_scarlet', 'reimu', 'marisa'],
			['stg_scarlet_ex', 'reimu', 'marisa'],
			['stg_cherry', 'reimu', 'marisa', 'sakuya'],
			['stg_cherry_ex', 'reimu', 'marisa', 'sakuya'],
		],
		translate:{
			zhu:'BOSS',
			cai:'自',
			zhong:'从',

			cai2:'自机',
			zhong2:'从属',
			zhu2:'Boss',
			cai_win:'<u>胜利条件：</u>最终关的BOSS，最大的黑幕坠机！',
			cai_lose:'<u>失败条件：</u>你坠机',
			zhong_win:'<u>胜利条件：</u>自机坠机',
			zhong_lose:'<u>失败条件：</u>无',
			zhu_win:'<u>胜利条件：</u>那个该死的自机快点坠机！',
			zhu_lose:'<u>失败条件：</u>最终的黑幕坠机',
			
			handcard_max:'手牌上限',
			stg_scarlet:'红魔乡',
			stg_scarlet_ex:'红魔乡EX',
			stg_next:'敬请期待',
			stg_maoyu:'毛玉',
			stg_yousei:'妖精',
			stg_maid:'妖精女仆',
			stg_bookshelf:'魔导书塔',
			stg_bat:'蝙蝠',
			_tanpai:'明置异变',
			_tanpai_bg:'变',

			saochu:'扫除',
			saochu_info:'锁定技，你的手牌上限+1；结束阶段：若你有牌，弃置一张牌；然后，无论是否弃置了牌，摸一张牌。',
			juguang:'聚光',
			juguang_info:'锁定技，跳过你的所有阶段，消耗1点灵力，视为使用一张【轰！】；你的装备上限+2。',
			xixue:'吸血',
			xixue_info:'锁定技，你造成伤害后：令蕾米莉亚获得1点灵力；然后若其灵力等于上限，或其为符卡状态，令其摸一张牌。',
			revive_boss:'阶段切换！',
			stg_needle:'封魔针',
			stg_needle_skill:'封魔针',
			stg_needle_info:'锁定技，你的手牌上限+1；若你已受伤，你的摸牌数+1；你使用【轰！】指定目标后，目标的技能无效，直到结算完毕。',
			stg_yinyangyu:'鬼神阴阳玉',
			stg_yinyangyu_skill:'鬼神阴阳玉',
			stg_yinyangyu_info:'你可以将一张非基本牌（可以为此牌）当作一种基本牌使用；你将此牌当作的【轰！】造成弹幕伤害时，该伤害+1。',
			stg_missile:'魔法飞弹',
			stg_missile_skill:'魔法飞弹',
			stg_missile_info:'结束阶段，若你本回合使用过【轰！】，你可以视为使用一张【轰！】。',
			stg_bagua:'八卦炉MKII',
			stg_bagua_skill:'八卦炉MKII',
			stg_bagua_info:'锁定技，你造成伤害后，获得1点灵力。',
			masterspark:'极限火花',
			spark1:'极限火花',
			masterspark_info:'符卡技（1）你造成弹幕伤害时，将灵力值消耗至1：令该伤害+X（X为消耗灵力量）。',
			finalspark:'最终火花',
			fengmo:'封魔阵',
			fengmo_info:'符卡技（2）符卡发动时，弃置所有其他角色各一张牌；其他角色不能使用/打出手牌，技能和装备技能无效。',
			stg_watch:'血月时针',
			stg_watch_skill:'血月时针',
			stg_watch_info:'【时静】中的“3”视为“手牌上限”；你造成伤害后，防止你的灵力和体力扣减，直到回合结束。',
			stg_deck:'魔术卡片',
			stg_deck_skill:'魔术卡片',
			stg_deck_info:'一回合一次，一名其他角色在其摸牌阶段外获得牌后，你可以弃置其一张牌。',
			doll:'杀人人偶',
			doll_info:'符卡技（2）结束阶段，你可以视为使用一张【轰！】；然后你可以重复此流程两次。',
			privateSquare:'个人空间',
			privateSquare_info:'符卡技（2）<永续>防止你造成的伤害；防止你的灵力扣减；当前回合结束后，进行一个额外的回合。',
			stg_firebook:'火魔导书',
			stg_firebook_info:'锁定技，与你阵营相同的角色使用【轰！】的次数上限+1。',
			stg_waterbook:'水魔导书',
			waterbook1:'水魔导书',
			stg_waterbook_info:'与你阵营相同的角色可以将一张黑色手牌当做【躲～】使用/打出。',
			stg_woodbook:'木魔导书',
			stg_woodbook_info:'锁定技，与你阵营相同的角色的手牌上限+2。',
			stg_dirtbook:'土魔导书',
			stg_dirtbook_info:'锁定技，与你阵营不同的角色坠机后，获得其因坠机弃置的一张牌。',
			stg_goldbook:'金魔导书',
			stg_goldbook_info:'锁定技，与你阵营相同的角色摸牌阶段额外摸一张牌。',
			stg_mingyun:'命运之光',
			stg_mingyun_info:'你于摸牌阶段摸到此牌后，对你使用；目标观看牌堆，获得其中一张牌。<br><u>追加效果：一张判定牌生效前，你可以打出此牌替换之。</u>',
			stg_lingji:'灵击',
			stg_lingji_info:'出牌阶段，或你受到伤害时，对你使用；目标以外的角色不能使用/打出手牌，防止目标受到的伤害，直到回合结束。',
			stg_bawu:'拔雾开天',
			stg_bawu_info:'出牌阶段，对自机身份的你使用；目标选择一项：回复1点体力并摸一张【圣盾】，或获得1点灵力并摸一张【连击】。',
			stg_pohuai:'破坏之果',
			stg_pohuai_info:'出牌阶段，对一名角色使用；目标将手牌数和灵力值调整至X（X为目标本局游戏击坠的角色数）。<br><u>追加效果：你可以将此牌当作【弹幕狂欢】使用。</u>',
			stg_fengyin:'封印解除',
			stg_fengyin_info:'出牌阶段，对自己使用；目标创建并获得一张禁忌牌。',
			stg_chongci:'冲刺',
			stg_chongci_skill:'冲刺',
			stg_chongci_info:'锁定技，出牌阶段，你使用的第一张牌造成的伤害+1。',
			stg_juedi:'绝地',
			stg_juedi_skill:'冲刺',
			stg_juedi_info:'锁定技，若你的体力值为1，你的手牌上限视为无限；若你的残机数为0，防止你受到的所有伤害。',
			stg_zhuanzhu:'专注',
			stg_zhuanzhu_skill:'专注',
			stg_zhuanzhu_info:'一回合一次，你成为【轰！】的目标时，你可以重铸至多3张牌。',

			mercury:'金＆水符「水银之毒」',
			mercury_audio1:'金＆水符「水银之毒」。',
			mercury_audio2:'对付你这种家伙，必须得用些特别的手段了！',
			mercury_info:'符卡技（0）<极意>你于回合外使用/打出黑色牌后，可以令一名角色失去1点体力。',
			emerald:'土＆金符「翡翠巨石」',
			emerald_audio1:'土＆金符「翡翠巨石」。',
			emerald_audio2:'住手啊！……你个变态。',
			emerald_info:'符卡技（0）<极意>与你相同阵营的角色的装备牌不能被弃置/获得。',
			waterfairy:'水＆木符「水精灵」',
			waterfairy_audio1:'水＆木符「水精灵」。',
			waterfairy_audio2:'你，就别想从这里出去了。',
			waterfairy_info:'符卡技（0）<极意>结束阶段，所有角色将手牌数补至手牌上限。',

			perfectSquare:'时符「完美空间」',
			perfectSquare_audio1:'时符「完美空间」!',
			perfectSquare_audio2:'这里的一切都在我的掌控之中!',
			perfectSquare_info:'符卡技（0）<极意>其他角色每回合使用牌时，若其本回合已使用过X张牌，取消该牌（X为你的灵力）；结束阶段，你消耗1点灵力。',
			mode_stg_card_config:'STG卡牌',
			mode_stg_character_config:'STG角色',

			gungirs:'神枪「冈格尼尔」',
			gungirs_audio1:'神枪「冈格尼尔」!',
			gungirs_audio2:'诸神之王的神器，必中的永恒之枪……尝尝它的力量吧？',
			gungirs_info:'符卡技（0）<极意> 符卡发动时，你创建并装备一张【冈格尼尔】；你失去装备区内的【冈格尼尔】后，创建一张【冈格尼尔】并装备之。',
		
			boss_chiyan:'红雾异变',
			boss_chiyan_info:'幻想乡被红雾包围了，去红雾源头的洋馆找出元凶吧！ <br><br> 关卡数：6 <br><br> 残机：1       第3关和第5关后追加1个<br><br>特殊规则：通关时，获得一张【拔雾开天】。',

			boss_chiyan_ex:'红魔乡EX关卡',
			boss_chiyan_ex_info:'异变结束后，蕾米来到博丽神社玩，然后因为回不去而赖着不走了。<br>去红魔馆检查一下情况（来把蕾米赶走）吧！<br><br> 关卡数：1 <br><br> 残机：0       道中击破后追加1个。',
			silent:'月符「寂静月神」',
			silent_info:'符卡技（0）<极意>结束阶段，你令一名其他角色选择一项：受到1点弹幕伤害，或令其对你造成的下一次伤害值-1。',
			silent1:'月符「寂静月神」',
			silent_audio1:'月符「寂静月神」！',
			silent_audio2:'在月光的审判下，忏悔吧！',
			silent1_audio1:'月亮之光！',
			silent2_audio2:'感受月亮纯洁无瑕的魔力吧！',

			royal:'日符「皇家烈焰」',
			royal1:'日符「皇家烈焰」',
			royal_info:'符卡技（0）<极意>准备阶段，所有其他角色选择一项：打出一张【轰！】，或受到1点弹幕伤害。',
			royal_audio1:'日符「皇家烈焰」！',
			royal_audio2:'在太阳的制裁下，消失吧！',
			royal1_audio1:'太阳之光！',
			royal1_audio2:'吃下太阳无穷无尽的力量吧！',
			patchouli_die:'居然连这都……',

			fourof:'禁忌「四重存在」',
			fourof_info:'符卡技（0）<极意>符卡发动时，召唤3个分身；这些分身的【狂宴】视为锁定技，防止这些分身对你或其他分身造成的伤害，且这些分身坠机时，玩家回复1点体力。',
			starbow:'禁弹「星弧破碎」',
			starbow1:'禁弹「星弧破碎」',
			starbow3:'禁弹「星弧破碎」',
			starbow_info:'符卡技（0）<极意>准备阶段，你进行一次判定：其他角色不能使用/打出判定牌花色的牌，你的判定牌花色的牌均视为【轰！】，直到符卡结束或你的准备阶段。',
		
			stg_cherry:'妖妖梦',
			boss_cherry:'春雪异变',
			boss_cherry_info:'都5月份了，怎么还在下大雪？这是谁干的好事？ <br><br> 关卡数：6 <br><br> 残机：1       第3关和第5关后追加1个<br><br>特殊规则：每造成7点伤害，获得一张【森罗结界】。<br> 注：长按/悬浮角色可以查看已造成伤害值',

			stg_louxie:'春光漏泄',
			stg_louxie_info:'出牌阶段，对自己使用；获得一张【森罗结界】。',

			stg_sidie:'死蝶之佑',
			stg_sidie_info:'出牌阶段，对一名角色使用；你减少一个残机，令目标失去3点体力。<br><u>追加效果：你造成伤害时，可以展示此牌，防止该伤害，改为令受伤角色失去1点体力。</u>',

			stg_ghost:'幽灵',
			stg_ghost_skill:'残念',
			stg_ghost_skill_info:'锁定技，你受到弹幕伤害时，若你有灵力，改为灵击伤害；结束阶段，你消耗1点灵力。',

			stg_puppet:'人形',
			stg_shanghai:'上海',
			stg_shanghai_skill:'变装',
			stg_shanghai_skill_info:'锁定技，你入场时，摸一张技能牌。',
			stg_shanghai_shanghai_skill:'变装·改',
			stg_shanghai_shanghai_skill_info:'锁定技，你入场时，摸一张技能牌；你的手牌上限+1。',

			shanghai_alice:'诅咒「魔彩光的上海人形」',
			shanghai_alice_info:'符卡技（0）<极意>符卡发动时，或准备阶段，若场上没有上海人形，召唤2个上海人形。',

			dahezou:'大合葬「灵车大协奏曲」',
			dahezou_info:'符卡技（0）<极意>一名角色使用【轰！】指定目标后，你可以明置一张与之相同颜色的手牌，令该【轰！】需要一张额外的【躲~】才能抵消。',

			stg_jiejie:'森罗结界',
			stg_jiejie_info:'锁定技，你受到伤害时，弃置此牌，防止该伤害；准备阶段，弃置此牌，摸两张牌。',
			stg_jiejie_skill2:'森罗结界（摸牌）',

			stg_bailou:'破魂之白楼',
			stg_bailou_skill:'破魂之白楼',
			stg_bailou_skill1:'破魂之白楼',
			stg_bailou_info:'你可以将有灵力的牌当做【轰！】使用；锁定技，你造成弹幕伤害后，对受伤角色造成1点灵击伤害。',
			stg_louguan:'断命之楼观',
			stg_louguan_skill:'断命之楼观',
			stg_louguan_info:'你使用【轰！】造成弹幕伤害后，可以弃置受伤角色所有区域各一张牌。',

			mingfa:'畜趣剑「无为无策之冥罚」',
			mingfa_info:'符卡技（0）<极意>锁定技，自机的结束阶段，若其本回合没有对你造成伤害，其失去1点体力。',
			tianshangjian:'天上剑「天人之五衰」',
			tianshangjian_skill_2:'妖梦声明的牌',
			tianshangjian_info:'符卡技（0）<极意>结束阶段，你可以声明一种攻击牌或防御牌；一名角色使用声明的牌时，其失去1点体力。',

			liudaojian:'六道剑「一念无量劫」',
			liudaojian_info:'符卡技（0）<极意>出牌阶段，你可以将一张【轰！】当作【灵击】使用。',

			hualing:'华灵「扬羽蝶」',
			hualing_info:'符卡技（0）<极意>自机的准备阶段，若场上没有幽灵，召唤一只幽灵。',

			wangwo:'樱符「完全墨染的樱花 -亡我-」',
			wangwo_info:'符卡技（0）<极意>自机的结束阶段，其选择X项（X为你已受伤值+1）：失去1点体力；弃置两张牌；或受到2点灵击伤害。',

			stg_fanhun:'反魂蝶-三分咲',
			stg_fanhun_info:' 符卡技（0）<极意>防止你坠机；你不能获得灵力；弃牌阶段结束时，你消耗1点灵力，并摸一张牌；你不能以此法以外的方式扣减灵力。',
		},
		get:{
			rawAttitude:function(from,to){
				var num=(to.identity=='zhong')?10:10;
				return (from.side===to.side?num:-num);
			}
		}
	};
});
