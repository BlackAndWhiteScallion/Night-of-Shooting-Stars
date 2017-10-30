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
			var list=[];
			for(var i in lib.character){
				var info=lib.character[i];
				if(info[4].contains('boss')){
					// var cfg=i+'_bossconfig';
					// if(get.config(cfg)==undefined){
					// 	game.saveConfig(cfg,true,true);
					// }
					// lib.translate[cfg+'_config']=lib.translate[i];
					// lib.mode.boss.config[cfg]={
					// 	name:get.translation(i),
					// 	onclick:toggleBoss,
					// 	init:true,
					// }
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
			ui.create.cardsAsync();
			game.finishCards();
			game.addGlobalSkill('autoswap');
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

			event.bosslist.delete();

			game.arrangePlayers();
			for(var i=0;i<game.players.length;i++){
				game.players[i].node.action.innerHTML='行动';
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
			game.gameDraw(game.boss);
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
		characterPack:{
			mode_boss:{
				boss_reimu:['female','0',8,['lingji','bianshen_reimu'],['boss']],
				boss_reimu2:['female','',4,['lingji','mengxiangtiansheng'],['hiddenboss']],
			}
		},
		cardPack:{
			mode_boss:{
				honghuangzhili:{
					type:'trick',
					enable:true,
					fullskin:true,
					filterTarget:true,
					content:function(){
						if(target.group=='shen'){
							target.addSkill('honghuangzhili');
							if(target.countCards('he')){
								player.gainPlayerCard(target,'he',true);
							}
						}
						else{
							target.turnOver();
						}
					},
					ai:{
						order:4,
						value:10,
						result:{
							target:function(player,target){
								if(target.group=='shen'){
									if(target.countCards('he')) return -2;
									return 0;
								}
								else{
									if(target.isTurnedOver()) return 4;
									return -3;
								}
							}
						}
					}
				}
			}
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
				var next=game.createEvent('phaseLoop');
				next.player=game.boss;
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
			onSwapControl:function(){
				if(game.me==game.boss) return;
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
					var dialog=ui.create.dialog('选择参战角色','hidden');
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

					event.asboss=ui.create.control('应战',function(){
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
			boss_reimu2:{
				loopType:1,
			},
			global:{
				loopType:2,
				chongzheng:6,
			},
		},
		skill:{
			lingji:{
    			audio:2,
    			trigger:{player:'damageAfter',source:'damageAfter'},
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
    					player.gain(result.card);
    				}
    			}
    		},
    		bianshen_reimu:{
    			audio:1,
    			trigger:{player:['damageAfter','gainliliAfter']},
    			forced:true,
    			filter:function(event,player){
    				return (player.lili == 5) || (player.hp <= 4);
    			},
    			content:function(){
					var lili=player.lili;
					player.init('boss_reimu2');
					player.lili=lili;
					player.update();
    			}
    		},
    		mengxiangtiansheng:{
    			audio:2,
    			trigger:{player:['phaseBegin','phaseEnd']},
    			frequent:true,
    			filter:function(event,player){
    				return player.lili > 0;
    			},
    			content:function(){
    				var players=get.players(player);
					players.remove(player);
    				player.useCard({name:'sha'},players);
    			}
    		},
		},
		translate:{
			zhu:'魔王',
			cai:'盟',
			zhong:'从',

			boss_reimu:'灵梦',
			boss_reimu2:'灵梦',
			lingji:'灵击',
			lingji_info:'锁定技，你造成或受到弹幕伤害后，须判定；若为红色，你获得1点灵力；否则，你获得判定牌。',
			bianshen_reimu:'阶段转换',
			bianshen_reimu_info:'体力值变为4，或灵力值变为5。',
			mengxiangtiansheng:'梦想天生',
			mengxiangtiansheng_info:'准备阶段，或结束阶段，你可以消耗1点灵力，视为对所有其他角色使用了一张【轰！】。',
			mode_boss_character_config:'挑战武将',
		},
		get:{
			rawAttitude:function(from,to){
				return (from.side===to.side?6:-6);
			}
		}
	};
});
