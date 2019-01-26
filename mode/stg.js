'use strict';
game.import('mode',function(lib,game,ui,get,ai,_status){
	return {
		name:'stg',
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
			for(var i in lib.characterPack.mode_stg){
				lib.character[i]=lib.characterPack.mode_stg[i];
				if(!lib.character[i][4]){
					lib.character[i][4]=[];
				}
			}
			// for(var i in lib.cardPack.mode_stg){
			// 	lib.card[i]=lib.cardPack.mode_stg[i];
			// }
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
			ui.create.div(bosslist);
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
						/*
						if(_status.bosschoice.link!=name){
							lib.boss[_status.bosschoice.name].control('cancel',_status.bosschoice);
							_status.bosschoice.classList.remove('disabled');
							_status.bosschoice.close();
							delete _status.bosschoice;
						}
						else{
							return;
						}
						*/
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
			ui.fakeme=ui.create.div('.avatar',ui.me);
			if(game.me!==boss){
				//game.singleHandcard=true;
				//ui.arena.classList.add('single-handcard');
				//ui.window.classList.add('single-handcard');
				//game.onSwapControl();

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
					td.innerHTML='剩余'+game.me.storage.fuhuo+'次复活机会';
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

			lib.setPopped(ui.create.system('规则',null,true),function(){
				var uiintro=ui.create.dialog('hidden');

					uiintro.add('<div class="text center">1. 击坠敌人后，摸一张牌，获得1点灵力 <br> 2. 自己准备阶段，场上敌人数小于2，会刷出下一个敌人 <br> 3. 通关时，摸一张技能牌，回复1点体力 <br> 4.手牌上限+X（X为已通关卡数量） </div>');
					uiintro.add(ui.create.div('.placeholder.slim'))

				return uiintro;
			},180);

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
					if(this!=game.boss && this!= game.me){
						game.me.draw();
						game.me.gainlili();
						//game.me.gain(ui.skillPile.childNodes[0],'draw2');
						this.hide();
						game.addVideo('hidePlayer',this);
						game.players.remove(this);
						this.delete();
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
			stg_yinyangyu:{
				fullskin:true,
				type:'equip',
				subtype:'equip4',
				ai:{
					basic:{
						equipValue:6
					}
				},
				skills:['stg_yinyangyu_skill']
			},
			stg_needle:{
				fullskin:true,
				type:'equip',
				subtype:'equip4',
				ai:{
					basic:{
						equipValue:6
					}
				},
				skills:['stg_needle_skill']
			},
			stg_bagua:{
				fullskin:true,
				type:'equip',
				subtype:'equip4',
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
				ai:{
					basic:{
						equipValue:6
					}
				},
				skills:['stg_watch_skill']
			},
			stg_waterbook:{
				fullskin:true,
				type:'equip',
				subtype:'equip4',
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
				ai:{
					basic:{
						equipValue:6
					}
				},
				skills:['stg_woodbook_skill']
			},
		},
		characterPack:{
			mode_stg:{
				stg_scarlet:['male','0',0,['boss_chiyan'],['boss'],'zhu'],
				//stg_next:['male','0',0,[],['boss'],'zhu'],
				stg_maoyu:['male','2',2,[],['hiddenboss','bossallowed']],
				stg_yousei:['female','1',1,[],['hiddenboss','bossallowed']],
				stg_maid:['female','2',1,['saochu'],['hiddenboss','bossallowed']],
				stg_bookshelf:['female','5',5,['juguang'],['hiddenboss','bossallowed']],
				stg_bat:['female','1',1,[],['hiddenboss','bossallowed']],
				//stg_bunny:['female','2',2,[],['hiddenboss','bossallowed']],
			}
		},
		cardPack:{
			mode_stg:['stg_yinyangyu','stg_bagua','stg_missile','stg_needle','stg_deck','stg_watch',
			'stg_firebook','stg_waterbook','stg_woodbook','stg_dirtbook','stg_goldbook'],
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
				var num = 3;
				for (var i = 0; i < game.players.length; i ++){
					if (game.players[i].identity == 'zhu' || game.players[i].identity == 'zhong'){
						if (num == game.players[i].dataset.position){
							num += 1;
						} else {
							num = Math.min(num, game.players[i].dataset.position);
						}
					}
				}
				//boss.dataset.position=player.dataset.position;
				boss.dataset.position = num;
				/*
				if(game.me==player){
					game.swapControl(boss);
				}
				*/
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
					if(player.chongzheng){
						player.chongzheng=false;
					}
					else if(player.isDead()){
						if(player.hp<0) player.hp=0;
						player.storage.boss_chongzheng++;
						if(player.maxHp>0&&game.bossinfo.chongzheng){
							if(player.hp<player.maxHp){
								player.hp++;
							}
							else if(player.countCards('h')<4){
								var card=get.cards()[0];
								var sort=lib.config.sort_card(card);
								var position=sort>0?player.node.handcards1:player.node.handcards2;
								card.fix();
								card.animate('start');
								position.insertBefore(card,position.firstChild);
							}
							player.update();
							if(player.storage.boss_chongzheng>=game.bossinfo.chongzheng){
								player.revive(player.hp);
							}
						}
						if(game.bossinfo.loopType==2){
							game.boss.chongzheng=true;
						}
					}
					else{
						if(player.identity=='zhu'&&game.boss!=player){
							player=game.boss;
						}
						player.phase();
					}
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
					// 这里应该是选角色页面
					// 要怎么做，才能获得当前BOSS呢？
					var i;
					var list=[];
					event.list=list;
					for(i in lib.character){
						//if(lib.character[i][4].contains('minskin')) continue;
						if(lib.character[i][4].contains('boss')) continue;
						if(lib.character[i][4].contains('hiddenboss')) continue;
						//if(lib.character[i][4]&&lib.character[i][4].contains('forbidai')) continue;
						//if(lib.config.forbidboss.contains(i)) continue;
						if(lib.filter.characterDisabled(i)) continue;
						for (var j = 0; j < lib.forbidstg.length; j ++){
							if (lib.forbidstg[j].contains(lib.storage.current)){
								if (lib.forbidstg[j].contains(i)){
									list.push(i);
								}
							}
						}
						//list.push(i);
					}
					list.randomSort();
					var dialog=ui.create.dialog('选择自机角色','hidden');
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
								if(_status.bosschoice){
									_status.bosschoice.animate('controlpressdownx',500);
									_status.bosschoice.classList.remove('disabled');
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
					_status.additionalReward=function(){
						return 500;
					}
					game.me.storage.reinforce = ['stg_yousei','stg_yousei','rumia'];
					//game.me.storage.reinforce = ['rumia'];
					if (game.me.name == 'reimu'){
						game.me.storage.dialog = [
							['reimu','好舒服呢','因为每次白天出来妖怪都很少<br>这次才试着在夜里出来的……','不过该往哪边走都搞不清楚了<br>这么暗',
								'但是……<br>夜里的境内还真够浪漫呢','','呃，你谁啊？','','人类在一片漆黑的地方<br>本来就看不到东西啊<br>(刚刚见过吗？)',''
								,'那种人你就算抓来吃了也无所谓啊','','不过，你很碍事呢','','良药苦口<br>这句话你有听过吗？','end'],
							['rumia','就是说啊～<br>还会出现妖怪，真是受不了啊','','刚刚不是见过了吗<br>你难不成是夜盲症吗？','','是吗？我好像也看到过<br>只在夜里才活动的人呢'
							,'','是——这样吗？','','在我眼前的就是吃了<br>也没关系的人类？','']
						];
					} else if (game.me.name == 'marisa'){
						game.me.storage.dialog = [
							['marisa','这种心情，<br>是要怎么说来着……？','要是那家伙呢<br>肯定会说“感觉真不错呢”','我可是不喜欢夜晚，<br><br>只有奇怪的家伙而已','',
							'谁也没有说是你啊。','','不过，干嘛把手伸得这么直啊。','','看上去像是<br>“人类采用了十进制”','end'],
							['rumia','你说谁是奇怪的家伙啊','','那个嘛，当然。','','看上去像不像是<br>“圣人被钉在十字架上”？',''],
						];
					}
					game.me.storage.tongguan = 0;
					game.me.storage.stage = 'boss_chiyan2x';
					game.me.storage.fuhuo = 2;
					game.me.addSkill('revive');
					game.me.addSkill('reinforce');
					game.me.addSkill('finalspark');
					game.me.addSkill('handcard_max');
				},
				gameDraw:function(player){
					if (player == game.boss) return 0;
					if (player == game.me) return 4;
					return 1;
				},
			},
			global:{
				loopType:1,
				chongzheng:6
			},
		},
		skill:{
			// 拿复活币复活。game.me.storage.fuhuo 是复活币的数量。
			revive:{
				trigger:{player:'dieBefore'},
				direct:true,
				filter:function(event,player){
					return player.storage.fuhuo;
				},
				content:function(){
					event.cards=player.getDiscardableCards('hej');
                    //player.$throw(event.cards,1000);
                    player.discard(event.cards);
                    //game.log(player,'弃置了',event.cards);
					game.playAudio('effect','die_female');
					if (player.isTurnedOver()){
						player.turnOver();
					}
					player.node.turnedover.setBackgroundImage('');
                    player.node.turnedover.style.opacity=0.7;
					game.delay(3);
					setTimeout(function(){
						game.log(get.translation(player)+'消耗了1个残机复活');
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
			revive_boss:{
				trigger:{player:'dieBefore'},
				direct:true,
				filter:function(event,player){
					return game.me.storage.reskill && game.me.storage.reskill.length > 0;
				},
				content:function(){
					game.log(get.translation(player)+'进入下一个阶段！');
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
					var num = 0;
					for (var i = 0; i < game.players.length; i ++){
						if (game.players[i].identity == 'zhu' || game.players[i].identity == 'zhong') num = game.players[i].dataset.position;
					}
					if (num == 0){
						if (game.me.storage.reinforce.length > 1){
							game.addBossFellow(3,game.me.storage.reinforce[0],parseInt(lib.character[game.me.storage.reinforce[0]][1]));
							game.me.storage.reinforce.remove(game.me.storage.reinforce[0]);
						} else {
							game.boss.dataset.position = 4;
							game.boss.addSkill('boss_chiyan2');
						}
					} else {
						if (game.me.storage.reinforce.length > 1){
							if (num == 3) num = 4;
							else if (num == 4) num = 5;
							else if (num == 5) num = 3; 
							game.addBossFellow(num,game.me.storage.reinforce[0],parseInt(lib.character[game.me.storage.reinforce[0]][1]));
							game.me.storage.reinforce.remove(game.me.storage.reinforce[0]);
						} else {
							if (num == 3) num = 4;
							else if (num == 4) num = 5;
							else if (num == 5) num = 3; 
							game.boss.dataset.position = num;
							game.boss.addSkill('boss_chiyan2');
						}
					}
				},
			},
			// 手牌上限+关卡数
			// 同时，装备不能弃置/获得也在这里进行。
			handcard_max:{
				mark:true,
				alter:true,
				intro:{
					content:function(storage, player){
						return '手牌上限+'+player.storage.tongguan;
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
						return num + player.storage.tongguan;
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
					targets[0].damage(Number.MAX_SAFE_INTEGER);
				}
			},
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
					if (list != []){
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
			// 第二关
			boss_chiyan2:{
				mode:['stg'],
				trigger:{player:'dieBegin'},
				silent:true,
				unique:true,
				fixed:true,
				init:function(event,character){
					var a = [1,1];					// 记录玩家和敌人对话位置
					var name = game.me.name;		// 记录当前检测名字的
					var j = 0;						// 记录当前检测谁的对话的
					var step1=function(){
						// 读取当前对话
						var dialog = ui.create.dialog();
						for (var i = 0; i < game.me.storage.dialog.length; i ++){
							if (game.me.storage.dialog[i][0] == name){
								if (game.me.storage.dialog[i][a[j]] == ''){
									a[j] ++;
									if (name == game.boss.name){
										j = 0;
										name = game.me.name;
									} else {
										j ++;
										if (game.me.storage.reinforce[0] && game.boss.name != game.me.storage.reinforce[0]){
											game.changeBoss(game.me.storage.reinforce[0]);
											game.me.storage.reinforce.remove(game.me.storage.reinforce[0]);
										}
										name = game.boss.name;
									}
									i = -1;
								} else if (game.me.storage.dialog[i][a[j]] == 'end'){
									game.resume();
									return;
								} else {
									var player = ui.create.div('.avatar',dialog).setBackground(name,'character');
									dialog.add('<div><div style="width:100%;text-align:right;font-size:18px">'+game.me.storage.dialog[i][a[j]]+'</div></div>');
									a[j] ++;
								}
							}
						}
						ui.auto.hide();
						dialog.open();
						ui.create.control('继续',function(){
							ui.dialog.close();
							while(ui.controls.length) ui.controls[0].close();
							var num1 = -1;
							for (var i = 0; i < game.me.storage.dialog.length; i ++){
								if (game.me.storage.dialog[i][0] == name){
									num1 = i;
									if (game.me.storage.dialog[i][a[j]] == 'end') num1 = -2;
									break;
								}
							}
							if (num1 == -1){
								if (game.me.storage.reinforce[0]){
									game.changeBoss(game.me.storage.reinforce[0]);
									game.me.storage.reinforce.remove(game.me.storage.reinforce[0]);
								}
								game.resume();
							}
							else if (num1 == -2) game.resume();
							else step1();
						});
					};
					game.pause();
					step1(); 
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
						line = '不过就算说是良药<br>如果不喝了试试的话又怎么知道';
					} else if (game.me.name == 'marisa'){
						line = '难道说，<br>除了人类以外都不是十指吗';
					}
					var dialog = ui.create.dialog();
					dialog.add('<div><div style="width:100%;text-align:right;font-size:18px">'+line+'</div></div>');
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
					var players = game.players;
					for (var i = 0; i<game.players.length; i ++){
						game.players[i].classList.remove('turnedover');
						if (game.players[i].identity != 'cai'){
							game.players[i].hide();
							game.addVideo('hidePlayer',game.players[i]);
							game.players[i].delete();
							game.players.remove(game.players[i]);
							//game.dead.remove(game.players[i]);
						}
					}
					'step 3'
					game.me.gain(ui.skillPile.childNodes[0],'draw2');
					game.me.recover();
					var dialog=ui.create.dialog("第二关<br><br>湖上的魔精");
					dialog.open();
	                game.pause();
	                var control=ui.create.control('走起！',function(){
	                    dialog.close();
	                    control.close();
	                    game.resume();
	                });
	                lib.init.onfree();
	                'step 4'
					game.addBossFellow(3,'stg_yousei',1);
					game.addBossFellow(5,'stg_maoyu',2);
					'step 5'
					while(_status.event.name!='phaseLoop'){
						_status.event=_status.event.parent;
					}
					game.me.storage.tongguan ++; 
					game.me.storage.reinforce = ['daiyousei','stg_yousei','cirno'];
					game.me.storage.stage = 'boss_chiyan3x';
					if (game.me.name == 'reimu'){
						game.me.storage.dialog = [
							['reimu','这座湖原来是如此宽广的吗？<br>浓雾遮天视野不良真麻烦啊。<br>难不成我是路痴？','',
								'啊啦是吗？那么，带个路吧？<br>这附近有岛对不对？','','靶子？<br>这还真是令人吃惊啊',''],
							['cirno','如果迷路，定是妖精所为','','你啊 可别吓着了喔，<br>在你面前可是有个强敌呢!','','开什么玩笑啊~','像你这样的人，<br>就和英吉利牛肉一起<br>冰冻冷藏起来吧！！'
							,'end'],
						];
					} else if (game.me.name == 'marisa'){
						game.me.storage.dialog = [
							['marisa','我记着岛屿明明是在这附近来着…<br>难道说那个岛屿移动了不成？',
							'而且……<br>现在可是夏天呢<br>为什么天气会这么冷的说？','','是你吧。让天这么冷','',
							'寒酸的家伙','','不对的地方有很多很多哦？','end'],
							['cirno','不会再让你回到陆地上了啊！','','这比热不是要好得多吗？','','听起来好像哪里不对...',''
							],
						];
					}
					game.me.removeSkill('boss_chiyan2x');
					game.boss.removeSkill('boss_chiyan2');
					game.me.storage.unskill = ['perfect'];
					lib.character['daiyousei'][1] = '2';
					game.resetSkills();
					_status.paused=false;
					_status.event.player=game.me;
					_status.event.step=0;
					_status.roundStart=game.me;
					game.phaseNumber=0;
					game.roundNumber=0;
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
						line = '啊啊，越来越冷了啊<br>这样会得空调病的啊';
					} else if (game.me.name == 'marisa'){
						line = '啊啊，短袖对身体不好<br><br>赶快去找个能招待我喝茶的房子好了<br>嗯，就这么办';
					}
					var dialog = ui.create.dialog();
					dialog.add('<div><div style="width:100%;text-align:right;font-size:18px">'+line+'</div></div>');
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
					for (var i = 0; i<game.players.length; i ++){
						game.players[i].classList.remove('turnedover');
						if (game.players[i].identity != 'cai'){
							game.players[i].hide();
							game.addVideo('hidePlayer',game.players[i]);
							game.players[i].delete();
							game.players.remove(game.players[i]);
							//game.dead.remove(game.players[i]);
						}
					}
					game.me.gain(ui.skillPile.childNodes[0],'draw2');
					game.me.recover();
					'step 3'
					var dialog=ui.create.dialog("第三关<br><br>红色之境");
					dialog.open();
	                game.pause();
	                var control=ui.create.control('走起！',function(){
	                    dialog.close();
	                    control.close();
	                    game.resume();
	                });
	                lib.init.onfree();
	                'step 4'
					game.addBossFellow(5,'stg_maid',2);
					game.addBossFellow(3,'stg_maoyu',2);
					'step 5'
					while(_status.event.name!='phaseLoop'){
						_status.event=_status.event.parent;
					}
					game.me.storage.tongguan ++; 
					game.me.storage.reinforce = ['stg_maid','meiling'];
					game.me.storage.stage = 'boss_chiyan4x';
					if (game.me.name == 'reimu'){
						game.me.storage.dialog = [
							['reimu','','你是不会往<br>啥都没有的地方逃的<br>对吧？','','顺便问下，你是什么人？','','	我只是个当巫女的普通人来着啊',''
							,'不要传谣了！','end'],
							['meiling','啊啦，就算你跟着我过来<br>这边也是什么都没有的啊？','','嗯——<br>逃的时候就只想着逃的事情了',''
							,'哎—普通人哟<br>你是普通之外的说','','那可真是太好了','确实有……<br>巫女是吃了也没问题的人类<br>之类的传说呢……',''],
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
					game.me.storage.skill = ['revive_boss'];
					game.me.storage.unskill = ['jicai'];
					game.me.storage.reskill = ['shogon'];
					game.resetSkills();
					_status.paused=false;
					_status.event.player=game.me;
					_status.event.step=0;
					_status.roundStart=game.me;
					game.phaseNumber=0;
					game.roundNumber=0;
					if(game.bossinfo){
						game.bossinfo.loopType=1;
					}
				}
			},
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
						event.list = ['果然，和普通人战斗，<br>不符合我的性格呢。'];
					}
					'step 1'
					var dialog = ui.create.dialog();
					dialog.add('<div><div style="width:100%;text-align:right;font-size:18px">'+event.list[0]+'</div></div>');
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
					for (var i = 0; i<game.players.length; i ++){
						game.players[i].classList.remove('turnedover');
						if (game.players[i].identity != 'cai'){
							game.players[i].hide();
							game.addVideo('hidePlayer',game.players[i]);
							game.players[i].delete();
							game.players.remove(game.players[i]);
							//game.dead.remove(game.players[i]);
						}
					}
					game.me.gain(ui.skillPile.childNodes[0],'draw2');
					game.me.recover();
					'step 3'
					var dialog=ui.create.dialog("第四关<br><br>漆黑之馆");
					dialog.open();
	                game.pause();
	                var control=ui.create.control('走起！',function(){
	                    dialog.close();
	                    control.close();
	                    game.resume();
	                });
	                lib.init.onfree();
	                'step 4'
					game.addBossFellow(3,'stg_maid',2);
					game.addBossFellow(5,'stg_bookshelf',0);
					'step 5'
					var target=game.findPlayer(function(current){
								return current.name == 'stg_bookshelf';
							});
					if(target){
						target.equip(game.createCard('stg_woodbook'));
						target.equip(game.createCard('stg_firebook'));
						target.equip(game.createCard('stg_goldbook'));
						target.equip(game.createCard('stg_waterbook'));
						target.equip(game.createCard('stg_dirtbook'));
					}
					'step 6'
					while(_status.event.name!='phaseLoop'){
						_status.event=_status.event.parent;
					}
					game.me.storage.tongguan ++; 
					game.me.storage.reinforce = ['koakuma','patchouli'];
					game.me.storage.stage = 'boss_chiyan5x';
					if (game.me.name == 'reimu'){
						game.me.storage.dialog = [
							['reimu','这家人屋里都不安窗户的吗？','而且从外面看的时候<br>感觉有这么大吗？','',
							'书房？（红白？）','','我那里就算年中无休<br>也一个参拜客也没有哦','','说起来在这么暗的屋子里<br>能读书吗？',
							'','所以说～我才不是夜盲症什么的','切，才不是想说这个呢','你就是这里的主人吗？','','放出的雾太多了，<br>很令人困扰啊'],
							['patchouli','那边的红白！','不准在我的书房里捣乱','','这里的书价值能比得上<br>你家神社５年份的香火钱呢','',
							'嘛你的神社<br>也就只有那种程度的价值了','','我可不是像你一样的<br>夜盲症患者','','你找大小姐有什么事？','',
							'那么，<br>就绝对不可以让你去见大小姐了','end'],
						];
					} else if (game.me.name == 'marisa'){
						game.me.storage.dialog = [
							['marisa','哇啊，好多书啊','等一下全都爽快地借走','','就要拿','','（书里有这个？）','',
							'不是因为房间太暗了吗？','','要说的话是缺维生素A','','我不缺，<br>我什么都很充足呢','','我是很美味的哦',''],
							['patchouli','不要拿','','让我看看，如何把眼前的<br>黑色给消极地处理掉…','','嗯～，<br>最近，眼睛不太好了'
							,'','是不是身体里铁不足啊','','那你呢？','','那我就不客气了，可以吗','','让我看看，简单又能<br>除去素材腥味的烹饪法是…','end'],
						];
					}
					game.me.removeSkill('boss_chiyan4x');
					game.me.storage.skill = ['revive_boss'];
					game.me.storage.unskill = ['xianzhe'];
					game.me.storage.reskill=['patchyspell'];
					game.resetSkills();
					_status.paused=false;
					_status.event.player=game.me;
					_status.event.step=0;
					_status.roundStart=game.me;
					game.phaseNumber=0;
					game.roundNumber=0;
					if(game.bossinfo){
						game.bossinfo.loopType=1;
					}
				}
			},
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
					dialog.add('<div><div style="width:100%;text-align:right;font-size:18px">'+event.list[0]+'</div></div>');
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
					for (var i = 0; i<game.players.length; i ++){
						game.players[i].classList.remove('turnedover');
						if (game.players[i].identity != 'cai'){
							game.players[i].hide();
							game.addVideo('hidePlayer',game.players[i]);
							game.players[i].delete();
							game.players.remove(game.players[i]);
							//game.dead.remove(game.players[i]);
						}
					}
					game.me.gain(ui.skillPile.childNodes[0],'draw2');
					game.me.recover();
					'step 3'
					var dialog=ui.create.dialog("第五关<br><br>红月之下潇洒的从者");
					dialog.open();
	                game.pause();
	                var control=ui.create.control('走起！',function(){
	                    dialog.close();
	                    control.close();
	                    game.resume();
	                });
	                lib.init.onfree();
	                'step 4'
					game.addBossFellow(3,'stg_maid',2);
					game.addBossFellow(4,'stg_maid',2);
					game.addBossFellow(5,'stg_maid',2);
					'step 5'
					while(_status.event.name!='phaseLoop'){
						_status.event=_status.event.parent;
					}
					game.me.storage.tongguan ++; 
					game.me.storage.reinforce = ['stg_maid','sakuya'];
					game.me.storage.stage = 'boss_chiyan6x';
					if (game.me.name == 'reimu'){
						game.me.storage.dialog = [
							['reimu','','你—<br>看上去不是这里的主人呢','','（看样子如果说是去打倒她的的话<br>她就不会让我过了呢）','',
							'被软禁了吗？','','那问不暗的你也行啦','在这一带放出大雾的<br>是你们对吧？','那个很烦人啊<br>你们有什么目的？','',
							'我可不喜欢那样<br>能请你们住手么？','','那就叫她出来','','我要是在这里大闹一场的话<br>她会不会出来呢？'],
							['sakuya','啊—没法继续扫除了！','这不是会惹大小姐生气吗！！','','怎么回事？<br>是大小姐的客人吗？','',
							'不让你过去的哦','大小姐很少见人的','','大小姐喜欢暗的地方','','阳光很碍事啊<br>大小姐就喜欢昏昏暗暗的','',
							'这个请你去和大小姐商量','','喂，我没有理由让主人<br>遇到危险的对吧？','','但是，<br>你是见不到大小姐的',
							'为此，即使要停止时间<br>我也要拖延你的脚步','end'],
						];
					} else if (game.me.name == 'marisa'){
						game.me.storage.dialog = [
							['marisa','','竟然会出现女仆啊','抓住她的话，会不会<br>扯上华盛顿公约呢？','','不要你可怜','','啊啊，那好像也不错呢',
							'','不会呢','','（被发现了啊）<br>不如说是负责修缮的','','负责恋爱就属于中学部了吗','','也就是说，<br>我要是打倒你的话<br>就能成为女仆长了呢。',
							'','啊，相当正常嘛<br>那种事情','','end'],
							['sakuya','啊—这样就没法打扫了！','这不是会惹大小姐生气吗！！','','啊啊，魔法使可是<br>受《生类怜悯令》保护呢。',
							'','是吗？','难道你也<br>被这个洋馆雇佣了吗？','','不过，你看起来也不像<br>会打扫卫生的样子呢。','',
							'那你是负责什么的？<br>负责恋爱的？','','那是什么啊<br>又不是在小学里','','好了，还是赶快<br>让我着手工作吧。',
							'忘了说了，<br>我呢，<br>是这里的女仆长——咲夜。','','嘴上那么说最后惨败的人，','我见过的<br>就比钍衰变链的数目还要多呢','','你的时间也是属于我的…<br>古旧魔女胜利的希望，是零。','end'],
						];
					}
					game.me.removeSkill('boss_chiyan5x');
					game.me.storage.skill = ['revive_boss'];
					game.me.storage.unskill = ['world'];
					game.me.storage.reskill=['perfectSquare'];
					game.resetSkills();
					_status.paused=false;
					_status.event.player=game.me;
					_status.event.step=0;
					_status.roundStart=game.me;
					game.phaseNumber=0;
					game.roundNumber=0;
					if(game.bossinfo){
						game.bossinfo.loopType=1;
					}
				}
			},
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
					dialog.add('<div><div style="width:100%;text-align:right;font-size:18px">'+event.list[0]+'</div></div>');
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
					for (var i = 0; i<game.players.length; i ++){
						game.players[i].classList.remove('turnedover');
						if (game.players[i].identity != 'cai'){
							game.players[i].hide();
							game.addVideo('hidePlayer',game.players[i]);
							game.players[i].delete();
							game.players.remove(game.players[i]);
							//game.dead.remove(game.players[i]);
						}
					}
					game.me.gain(ui.skillPile.childNodes[0],'draw2');
					game.me.recover();
					'step 3'
					var dialog=ui.create.dialog("最终关<br><br>在乐土上洒下血雨");
					dialog.open();
	                game.pause();
	                var control=ui.create.control('走起！',function(){
	                    dialog.close();
	                    control.close();
	                    game.resume();
	                });
	                lib.init.onfree();
	                'step 4'
					game.addBossFellow(3,'stg_bat',1);
					game.addBossFellow(4,'stg_bat',1);
					game.addBossFellow(5,'stg_bat',1);
					game.addBossFellow(6,'stg_bat',1);
					'step 5'
					while(_status.event.name!='phaseLoop'){
						_status.event=_status.event.parent;
					}
					game.me.storage.tongguan ++; 
					game.me.storage.reinforce = ['sakuya','remilia'];
					if (game.me.name == 'reimu'){
						game.me.storage.dialog = [ 
							['reimu','差不多也该<br>现出你的原形了吧？','大小姐？','','刚才的女仆原来是人类啊','','一个人的话又不是大量屠杀<br>所以没关系','',
							'是啊是啊，给人添麻烦了呢你','','总而言之，从这里离开成吗？','','我是说要你从这世上离开','',
							'当护卫的那个女仆<br>是你雇来的对吧？','像你这样的深闺大小姐<br>一招就能打倒！','','你难道很强么？','',
							'……似乎很有一手的样子呢','','既然月亮如此鲜红','','看来会成为永远之夜呢',''],
							['remilia','果然，<br>人类还是不中用啊','','你这家伙，是杀人犯呢','','脑子秀逗呢。而且理由不明','','这里是我的城哦？','要离开也该是你离开才对。','',
							'真是没办法呢','虽然现在，已经吃得饱饱的了……','','咲夜是个优秀的扫除者','托她的福，这里一颗头都没掉过哦','','谁知道呢。我又不怎么到外面去',
							'因为我对阳光很没辙','','在如此鲜红的月亮之下<br>我真的会杀掉你哦','','看来会成为欢愉之夜呢','','end'],
						];
					} else if (game.me.name == 'marisa'){
						game.me.storage.dialog = [
							['marisa','来了来了<br>有寒气在奔走，这股妖气','为什么越是强大的家伙越要隐藏？','','…你看起来没有脑子呐',
							'','你就是，那个吧？','那什么阳光啦、<br>难闻的蔬菜<br>和银的什么之类的，','明明是夜的支配者<br>哪来这么多弱点…','',
							'好像很有趣呢，你果然有喝吧？那个','','你到现在吸了多少人的血了？','','13块<br>我是和食主义者','','是吗，不过我可是饿了哦。','',
							'啊啊，是这样吗','刚才那是植物的名字，<br>「亚阿相界」','','是快乐的人类哦','','似乎会成为清凉之夜呢',''],
							['remilia','有能力的鹰不藏尾巴…呢','','只有人啊','需要脑之类的单纯的化学<br>思考中枢。','','就是啊，是病弱的女孩呢','',
							'那是当然的了。<br>不过饭量小所以每次都会剩下','','你能记得清楚到今天为止<br>自己吃过的面包的数量吗？','','那，你是来干嘛的？',
							'我现在是已经吃饱了…','','…要吃的话，也无所谓。','','人类真是快乐啊。','还是说，你根本就不是人类<br>比较好呢？','','呵呵呵，因为月亮也如此之红吗？','','似乎会是酷暑之夜呢','end'],
						];
					}
					game.me.removeSkill('boss_chiyan6x');
					game.me.storage.skill = ['revive_boss'];
					game.me.storage.unskill = ['feise'];
					game.me.storage.reskill=['gungirs','gens'];
					game.resetSkills();
					_status.paused=false;
					_status.event.player=game.me;
					_status.event.step=0;
					_status.roundStart=game.me;
					game.phaseNumber=0;
					game.roundNumber=0;
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
						game.players[i].classList.remove('turnedover');
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
					lib.skill['jicai'].cost = 1;
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
                  init:function(event,player){
                  	var target = game.findPlayer(function(current){
                  		return current.name == 'stg_bookshelf';
                  	});
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
                init:function(event,player){
                  	var target = game.findPlayer(function(current){
                  		return current.name == 'stg_bookshelf';
                  	});
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
							return current.hasSkill('emerald1') && current.identity == player.identity;
						})) return false;
					},
					cardDiscardable:function(card,player,target,event){
						if(get.is.altered('emerald2')&&get.subtype(card) == 'equip'&& game.hasPlayer(function(current){
							return current.hasSkill('emerald1') && current.identity == player.identity;
						})) return false;
					},
					canBeGained:function(card,player,target,event){
						if(get.is.altered('emerald2')&&get.subtype(card) == 'equip'&& game.hasPlayer(function(current){
							return current.hasSkill('emerald1') && current.identity == player.identity;
						})) return false;
					},
					cardGainable:function(card,player,target,event){
						if(get.is.altered('emerald2')&&get.subtype(card) == 'equip' && game.hasPlayer(function(current){
							return current.hasSkill('emerald1') && current.identity == player.identity;
						})) return false;
					},
				},
			},
			waterfairy:{
				audio:2,
                cost:0,
                infinite:true,
                 spell:['waterfairy1'],
                   init:function(event,player){
                  	var target = game.findPlayer(function(current){
                  		return current.name == 'stg_bookshelf';
                  	});
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
						players[i].draw(players[i].maxHandcard() - players[i].countCards('h'));
					}
				},
			},
			perfectSquare:{
				audio:2,
				infinite:true,
				cost:0,
				spell:['perfectSquare1','perfectSquare2'],
				init:function(player){
					player.equip(game.createCard('stg_watch'));
                      player.equip(game.createCard('stg_deck'));
                      player.removeSkill('privateSquare');
                      player.removeSkill('doll');
                      player.useSkill('perfectSquare');
                      player.addSkill('handcard_max');
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
				spell:['gungirs1'],
				init:function(player){
					player.equip(game.createCard('gungnir'));
					player.useSkill('gungirs');
					game.addBossFellow(2,'stg_bat',1);
					game.addBossFellow(8,'stg_bat',1);
				},
				content:function(){
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
					player.removeSkill('gungirs');
					player.removeSkill('gungirs1');
					player.addSkill('feise');
					lib.skill['feise'].cost = 0;
					player.useSkill('feise');
					player.addIncident(game.createCard('scarlet','zhenfa',''));
					player.removeSkill('scarlet_win');
					lib.skill['feise'].infinite = true;
				},
				trigger:{player:'turnOverBefore'},
				content:function(){
					trigger.cancel();
				}
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
						return num ++;
					},
				},
			},
			juguang:{
				audio:2,
				forced:true,
				trigger:{player:'phaseBegin'},
				init:function(player){
					player.maxequip+=2;
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
						player.logSkill('juguang',result.targets);
						player.useCard({name:'sha'},result.targets[0],false);
					}
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
				forced:true,
				filter:function(){
					return true;
				},
				content:function(){
					trigger.target.addTempSkill('fengyin','shaAfter');
					trigger.target.addTempSkill('unequip','shaAfter');
				},
			},
			stg_yinyangyu_skill:{
				init:function(player){
					player.addSkill('mengxiang');
				},
				enable:'chooseToUse',
				usable:1,
				hiddenCard:function(player,name){
                    return name == 'shan' || name == 'tao';
                },
                filter:function(event,player){
                    return player.countCards('he') > 0;
                },
                chooseButton:{
                    dialog:function(event,player){
                        var list = [];
                        for (var i in lib.card){
                            if(lib.card[i].mode&&lib.card[i].mode.contains(lib.config.mode)==false) continue;
                            if(lib.card[i].forbid&&lib.card[i].forbid.contains(lib.config.mode)) continue;
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
                            usable:1,
                            popname:true,
                            viewAs:{name:links[0][2]},
                        }
                    },
                    prompt:function(links,player){
                        return '将一张非基本牌当作'+get.translation(links[0][2])+'使用/打出';
                    }
                },
			},
			stg_bagua_skill:{
				init:function(player){
					player.addSkill('masterspark');
				},
				enable:'phaseUse',
				usable:1,
				filter:function(event,player){
					// 这段是检测次数限制的
					if(!lib.filter.filterCard({name:'sha'},player,event)){
						return false;
					}
					return true;
				},
				filterTarget:function(card,player,target){
					return player.canUse('sha',target);
				},
				content:function(){
					target.addTempSkill('unequip','shaAfter');
					player.useCard({name:'sha'},target);
				},
			},
			stg_missile_skill:{
				group:'missile_count',
				init:function(player){
					player.addSkill('stardust');
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
			},
			missile_count:{
				trigger:{player:'shaAfter'},
				direct:true,
				priority:-10,
				content:function(){
					player.addTempSkill('missile_ready');
				}
			},
			missile_ready:{
			},
			stg_deck_skill:{
				init:function(player){
					player.addSkill('doll');
				},
				trigger:{player:'phaseEnd'},
				filter:function(event,player){
					return game.hasPlayer(function(current){
						return current.storage._mubiao;
					});
				},
				content:function(){
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i ++){
						if (players[i].storage._mubiao && players[i] != player){
							player.discardPlayerCard(players[i], 'hej', true);
						}
					}
				},
			},
			stg_watch_skill:{
				init:function(player){
					player.addSkill('privateSquare');
				},
				forced:true,
				trigger:{source:'damageEnd'},
				filter:function(){
					return true;
				},
				content:function(){
					player.addTempSkill('stg_watch_stop');
				},
			},
			stg_watch_stop:{
				direct:true,
				trigger:{player:['changelili','changeHp']},
				filter:function(event,player){
					return event.num < 0;
				},
				content:function(){
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
                      player.loselili(lib.skill.privateSquare.cost);
                      player.turnOver();
                  },
			},
			private2:{
				audio:2,
				forced:true,
				trigger:{player:'phaseAfter'},
				content:function(){
					player.insertPhase();
				},
			},
			private3:{
				direct:true,
				trigger:{source:'damageBegin',player:'changelili'},
				content:function(){
					trigger.cancel();
				},
			},
			masterspark:{
				audio:2,
                cost:0,
                spell:['spark1'],
                roundi:true,
                trigger:{player:'phaseBegin'},
                filter:function(event,player){
                    return player.lili > lib.skill.masterspark.cost;
                },
                content:function(){
                    player.loselili(lib.skill.masterspark.cost);
                    player.turnOver();
                  },
                check:function(event,player){
                  return player.lili > 3;
                },
			},
			spark1:{
				trigger:{player:'shaBegin'},
				forced:true,
				filter:function(event,player){
					return player.lili > 1;
				},
				content:function(){
					player.storage.spark = player.lili -1;
					player.loselili(player.lili-1);
					player.addTempSkill('spark2','shaAfter');
				},
			},
			spark2:{
				trigger:{source:'damageBegin'},
				filter:function(event){
					return event.card&&(event.card.name=='sha')&&event.notLink();
				},
				forced:true,
				content:function(){
					trigger.num+=player.storage.spark;
					delete player.storage.spark;
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
					}
				},
				onremove:function(player){
					var players = game.filterPlayer();
					players.remove(player);
					for (var i = 0; i < players.length; i++){
						players[i].removeSkill('fengyin');
						players[i].removeSkill('unequip');
					}
				},
			},
			stg_firebook_skill:{
				global:'firebook1',
			},
			firebook1:{
				trigger:{player:'shaBegin'},
				usable:1,
				forced:true,
				filter:function(event,player){
					return game.hasPlayer(function(current){
						return current.identity == player.identity && current.hasSkill('stg_firebook_skill');
					});
				},
				content:function(){
					player.getStat().card.sha--;
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
						return current.identity == player.identity && current.hasSkill('stg_waterbook_skill');
					});
				},
				prompt:'将一张黑色手牌当【没中】使用/打出',
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
							return current.hasSkill('stg_woodbook_skill') && current.identity == player.identity;
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
							return current.hasSkill('stg_goldbook_skill') && current.identity == player.identity;
						}) > 0;
				},
				content:function(){
					trigger.num+=game.countPlayer(function(current){
							return current.hasSkill('stg_goldbook_skill') && current.identity == player.identity;
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
							if (players[i].lili == players[i].maxlili) players[i].draw();
						}
					}
				},
			},
		},
		forbidstg:[
			['stg_scarlet', 'reimu', 'marisa'],
			['stg_sakura', 'reimu', 'marisa', 'sakuya'],
		],
		translate:{
			zhu:'BOSS',
			cai:'自',
			zhong:'从',

			handcard_max:'手牌上限',
			stg_scarlet:'红魔乡',
			stg_next:'敬请期待',
			stg_maoyu:'毛玉',
			stg_yousei:'妖精',
			stg_maid:'妖精女仆',
			stg_bookshelf:'魔导书塔',
			stg_bat:'蝙蝠',

			saochu:'扫除',
			saochu_info:'锁定技，你的手牌上限+1；结束阶段：若你有牌，弃置一张牌；然后，无论是否弃置了牌，摸一张牌。',
			juguang:'聚光',
			juguang_info:'锁定技，跳过你的所有阶段，视为使用一张【轰！】；你的装备上限+1。',
			xixue:'吸血',
			xixue_info:'锁定技，你造成伤害后：令蕾米莉亚获得1点灵力；然后若其灵力等于上限，令其摸一张牌。',
			stg_needle:'封魔针',
			stg_needle_info:'锁定技，你的手牌上限+1；你使用【轰！】指定目标后，目标的技能和装备技能无效，直到结算完毕。',
			stg_yinyangyu:'鬼神阴阳玉',
			stg_yinyangyu_skill:'鬼神阴阳玉',
			stg_yinyangyu_info:'一回合一次，你可以将一张非基本牌（可以为此牌）当作一种基本牌使用/打出；你将此牌当作的【轰！】造成弹幕伤害时，该伤害+1。',
			stg_missile:'魔法飞弹',
			stg_missile_skill:'魔法飞弹',
			stg_missile_info:'结束阶段，若你本回合使用过【轰！】，你可以视为使用一张【轰！】。',
			stg_bagua:'八卦炉MKII',
			stg_bagua_skill:'八卦炉MKII',
			stg_bagua_info:'一回合一次，出牌阶段，你可以视为使用一张【轰！】；该【轰！】指定目标后，目标的装备技能无效，直到结算完毕。',
			masterspark:'极限火花',
			masterspark_info:'符卡技（0）你使用【轰！】指定目标后，将灵力值消耗至1：若如此做，该【轰！】造成伤害时，该伤害+X（X为消耗灵力量）。',
			fengmo:'封魔阵',
			fengmo_info:'符卡技（2）符卡发动时，弃置所有其他角色各一张牌；其他角色的技能和装备技能无效。',
			stg_watch:'血月时针',
			stg_watch_skill:'血月时针',
			stg_watch_info:'【时静】中的“3”视为“4”；你造成伤害后，防止你的灵力和体力扣减，直到回合结束。',
			stg_deck:'魔术卡片',
			stg_deck_skill:'魔术卡片',
			stg_deck_info:'结束阶段，你可以弃置任意名本回合成为过牌的目标的角色各一张牌。	',
			stg_firebook:'火魔导书',
			stg_firebook_info:'锁定技，与你阵营相同的角色于其出牌阶段使用的第一张【轰！】不计次数。',
			stg_waterbook:'水魔导书',
			waterbook1:'水魔导书',
			stg_waterbook_info:'与你阵营相同的角色可以将一张黑色手牌当做【没中】使用/打出。',
			stg_woodbook:'木魔导书',
			stg_woodbook_info:'锁定技，与你阵营相同的角色的手牌上限+2。',
			stg_dirtbook:'土魔导书',
			stg_dirtbook_info:'锁定技，与你阵营不同的角色坠机后，获得其因坠机弃置的一张牌。',
			stg_goldbook:'金魔导书',
			stg_goldbook_info:'锁定技，与你阵营相同的角色摸牌阶段额外摸一张牌。',

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

		},
		get:{
			rawAttitude:function(from,to){
				var num=(to.identity=='zhong')?5:6;
				return (from.side===to.side?num:-num);
			}
		}
	};
});
