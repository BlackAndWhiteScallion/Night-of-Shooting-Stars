'use strict';
game.import('mode',function(lib,game,ui,get,ai,_status){
	return {
		name:'versus',
		init:function(){
		},
		start:function(){
			"step 0"
			_status.mode=get.config('versus_mode');
			if(_status.brawl&&_status.brawl.submode){
				_status.mode=_status.brawl.submode;
			}
			if(lib.config.test_game){
				_status.mode='standard';
			}
			"step 1"
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
			if(_status.connectMode){
				game.waitForPlayer(function(){
					switch(lib.configOL.versus_mode){
						case '1v1':lib.configOL.number=2;break;
						case '2v2':lib.configOL.number=4;break;
						case '3v3':lib.configOL.number=6;break;
						case '4v4':lib.configOL.number=8;break;
					}
				});
			}
			else if(_status.mode=='four'){
				game.prepareArena(8);
			}
			else if(_status.mode=='two'){
				game.prepareArena(4);
			}
			else if(_status.mode=='endless'){
				game.prepareArena(2);
			}
			else if(_status.mode=='three'){
				if(!get.config('enable_all_cards')){
					game.fixedPile=true;
				}
				ui.create.cardsAsync();
				game.finishCards();
			}
			else{
				if(lib.storage.choice==undefined) game.save('choice',20);
				if(lib.storage.zhu==undefined) game.save('zhu',true);
				if(lib.storage.noreplace_end==undefined) game.save('noreplace_end',true);
				if(get.config('first_less')==undefined) game.saveConfig('first_less',true,true);
				if(lib.storage.autoreplaceinnerhtml==undefined) game.save('autoreplaceinnerhtml',true);
				if(lib.storage.single_control==undefined) game.save('single_control',true);
				if(lib.storage.number==undefined) game.save('number',3);
				if(lib.storage.versus_reward==undefined) game.save('versus_reward',3);
				if(lib.storage.versus_punish==undefined) game.save('versus_punish','弃牌');
				if(lib.storage.replace_number==undefined) game.save('replace_number',3);

				switch(lib.storage.seat_order){
					case '交叉':lib.storage.cross_seat=true;lib.storage.random_seat=false;break;
					case '随机':lib.storage.cross_seat=false;lib.storage.random_seat=true;break;
					default:lib.storage.cross_seat=false;lib.storage.random_seat=false;
				}
				game.save('only_zhu',true);
				ui.wuxie.hide();
				ui.create.cardsAsync();
				game.finishCards();
			}
			// game.delay();
			"step 2"
			if (lib.config.auto_auto && !_status.auto){
				ui.click.auto();
			}
			lib.setPopped(ui.rules,function(){
				var uiintro=ui.create.dialog('hidden');
				if (get.config('versus_mode') == 'two'){
 					uiintro.add('<div class="text left">把对面两个击坠就赢啦！<br> 先手第一回合少摸一张牌。</div>');
				} else if (get.config('versus_mode') == 'three'){
					uiintro.add('<div class="text left">把对面三个击坠就赢啦！<br>每轮进行回合的角色由你选择，已经选择的角色不能再选择，都行动完了才可以再次选择。</div>');
				} else if (get.config('versus_mode') == 'four'){
					uiintro.add('<div class="text left">把对面主帅击坠就赢啦！</div>');
				} else if (get.config('versus_mode') == 'standard'){
					uiintro.add('<div class="text left">别忘了，左上角[选项]里还有更多的设置。</div>')
				}
				uiintro.add(ui.create.div('.placeholder.slim'))
				return uiintro;
			},400);
			if(_status.connectMode){
				if(lib.configOL.versus_mode=='1v1'){
					game.randomMapOL('hidden');
				}
				else{
					game.randomMapOL();
				}
			}
			else if(_status.mode=='four'){
				_status.fouralign=[0,1,2,3,4];
				var list=[
					['zhong','ezhong','ezhong','zhong','zhong','ezhong','ezhong','zhong'],
					['zhong','ezhong','zhong','ezhong','ezhong','zhong','ezhong','zhong'],
					['zhong','ezhong','ezhong','zhong','ezhong','zhong','zhong','ezhong'],
					['zhong','ezhong','zhong','ezhong','zhong','ezhong','zhong','ezhong'],
					['zhong','ezhong','ezhong','zhong','ezhong','zhong','ezhong','zhong'],
				][_status.fouralign.randomRemove()];
				var rand1=Math.floor(Math.random()*4);
				var rand2=Math.floor(Math.random()*4);
				for(var i=0;i<list.length;i++){
					if(list[i]=='zhong'){
						if(rand1==0){
							list[i]='zhu';
						}
						rand1--;
					}
					else{
						if(rand2==0){
							list[i]='ezhu';
						}
						rand2--;
					}
				}

				for(var i in lib.skill){
					if(lib.skill[i].changeSeat){
						lib.skill[i]={};
						if(lib.translate[i+'_info']){
							lib.translate[i+'_info']='此模式下不可用';
						}
					}
				}

				var side=Math.random()<0.5;
				var num=Math.floor(Math.random()*8);
				list=list.splice(8-num).concat(list);
				_status.firstAct=game.players[num];
				for(var i=0;i<8;i++){
					if(list[i][0]=='e'){
						game.players[i].side=side;
						game.players[i].identity=list[i].slice(1);
					}
					else{
						game.players[i].side=!side;
						game.players[i].identity=list[i];
					}
					if(game.players[i].identity=='zhu'){
						game[game.players[i].side+'Zhu']=game.players[i];
						game.players[i].isZhu=true;
					}
					game.players[i].setIdentity(game.players[i].identity);
					game.players[i].node.identity.dataset.color=get.translation(game.players[i].side+'Color');
					game.players[i].getId();
				}
				game.chooseCharacterFour();
			}
			else if(_status.mode=='two'){
				for(var i=0;i<game.players.length;i++){
					game.players[i].getId();
				}
				game.chooseCharacterTwo();
			}
			else if(_status.mode=='endless'){
				game.chooseCharacterEndless();
			}
			else if(_status.mode=='three'){
				game.chooseCharacterThree();
			}
			else{
				game.chooseCharacter();
			}
			if(!_status.connectMode&&_status.brawl&&_status.brawl.chooseCharacterBefore){
				_status.brawl.chooseCharacterBefore();
			}
			"step 3"
			var players=get.players(lib.sort.position);
			var info=[];
			for(var i=0;i<players.length;i++){
				info.push({
					name:players[i].name,
					name2:players[i].name2,
					identity:players[i].node.identity.firstChild.innerHTML,
					color:players[i].node.identity.dataset.color
				});
			}
			_status.videoInited=true;
			if(_status.mode=='four'||_status.connectMode||
				_status.mode=='two'||_status.mode=='endless'){
				info.push(false);
			}
			else if(_status.mode=='three'){
				info.push(true);
			}
			else{
				info.push(lib.storage.single_control&&game.players.length>=4);
			}
			game.addVideo('init',null,info);
			event.trigger('gameStart');
			if(_status.connectMode){
				if(_status.mode=='1v1'){
					_status.first_less=true;
					game.gameDraw(_status.firstChoose.next);
					game.phaseLoop(_status.firstChoose.next);
				}
				else if(_status.mode=='2v2'||_status.mode=='3v3'){
					_status.first_less=true;
					game.gameDraw(_status.firstChoose);
					if(lib.configOL.replace_handcard){
						game.replaceHandcards(_status.firstChoose.previous);
					}
					game.phaseLoop(_status.firstChoose);
				}
				else if(_status.mode=='4v4'){
					game.gameDraw(_status.firstAct,function(player){
						if(player==_status.firstAct.previousSeat){
							return 5;
						}
						return 4;
					});
					game.replaceHandcards(_status.firstAct.previous,_status.firstAct.previous.previous);
					game.phaseLoop(_status.firstAct);
				}
				event.finish();
			}
			else{
				if(_status.mode=='two'){
					_status.first_less=true;
					_status.first_less_forced=true;
					var firstChoose=_status.firstAct;
					game.gameDraw(firstChoose);
					if(get.config('replace_handcard_two')){
						game.replaceHandcards(firstChoose.previous);
					}
					game.phaseLoop(firstChoose);
				}
				else if(_status.mode=='endless'){
					_status.first_less=true;
					_status.first_less_forced=true;
					var firstChoose=_status.firstAct;
					game.gameDraw(firstChoose);
					game.phaseLoop(firstChoose);
				}
				else if(_status.mode=='four'){
					game.gameDraw(_status.firstAct,function(player){
						if(player==_status.firstAct.previousSeat){
							return 5;
						}
						return 4;
					});
					if(game.me==_status.firstAct.previous||game.me==_status.firstAct.previous.previous){
						game.me.chooseBool('是否置换手牌？');
						event.replaceCard=true;
					}
				}
				else if(_status.mode=='three'){
					var firstAct;
					if(_status.color){
						firstAct=game.enemyZhu;
					}
					else{
						firstAct=game.friendZhu;
					}
					game.gameDraw(firstAct,4);
					game.addGlobalSkill('autoswap');
					if(lib.config.show_handcardbutton){
						ui.versushs=ui.create.system('手牌',null,true);
						lib.setPopped(ui.versushs,game.versusHoverHandcards,220);
					}
					game.phaseLoopThree(firstAct);
				}
				else{
					var firstAct;
					if(lib.storage.zhu){
						_status.currentSide=true;
						firstAct=(_status.currentSide==game.me.side)?game.friendZhu:game.enemyZhu;
					}
					else{
						if(!lib.storage.cross_seat&&!lib.storage.random_seat&&lib.storage.number>1){
							for(var i=0;i<game.players.length-1;i++){
								if(game.players[i].side!=game.players[i+1].side){
									var actcount;
									if(Math.random()<0.5){
										actcount=i;
									}
									else{
										if(i>=lib.storage.number){
											actcount=i-lib.storage.number;
										}
										else{
											actcount=i+lib.storage.number;
										}
									}
									if(actcount>0){
										actcount--;
									}
									else{
										actcount=game.players.length-1;
									}
									firstAct=game.players[actcount];
									break;
								}
							}
						}
						else{
							firstAct=game.players[Math.floor(Math.random()*game.players.length)];
						}
					}
					game.gameDraw(firstAct,4);
					_status.first_less=true;
					_status.round=0;
					if(lib.storage.single_control){
						game.addGlobalSkill('autoswap');
						if(game.players.length>2&&lib.config.show_handcardbutton){
							ui.versushs=ui.create.system('手牌',null,true);
							lib.setPopped(ui.versushs,game.versusHoverHandcards,220);
						}
					}
					_status.enemyCount=ui.create.system('杀敌: '+get.cnNumber(0,true),null,true);
					_status.friendCount=ui.create.system('阵亡: '+get.cnNumber(0,true),null,true);

					lib.setPopped(_status.friendCount,game.versusHoverFriend);
					lib.setPopped(_status.enemyCount,game.versusHoverEnemy);

					if(lib.storage.zhu){
						game.versusPhaseLoop(firstAct);
					}
					else{
						game.versusPhaseLoop(firstAct);
					}
				}
				if(_status.mode!='four'){
					event.finish();
				}
			}
			"step 4"
			if(event.replaceCard&&result.bool){
				var hs=game.me.getCards('h');
				for(var i=0;i<hs.length;i++){
					hs[i].discard(false);
				}
				game.me.directgain(get.cards(hs.length));
			}
			if(_status.ladder){
				lib.storage.ladder.current-=40;
				_status.ladder_tmp=true;
				game.save('ladder',lib.storage.ladder);
				game.addGlobalSkill('versus_ladder');
			}
			game.phaseLoop(_status.firstAct);
		},
		game:{
			getLadderName:function(score){
				if(score<900) return '平民';
				if(score<1000) return '卫士五';
				if(score<1100) return '卫士四';
				if(score<1200) return '卫士三';
				if(score<1300) return '卫士二';
				if(score<1400) return '卫士一';
				if(score<1500) return '校尉三';
				if(score<1600) return '校尉二';
				if(score<1700) return '校尉一';
				if(score<1800) return '中郎将三';
				if(score<1900) return '中郎将二';
				if(score<2000) return '中郎将一';
				if(score<2100) return '大将五';
				if(score<2200) return '大将四';
				if(score<2300) return '大将三';
				if(score<2400) return '大将二';
				if(score<2500) return '大将一';
				return '枭雄';
			},
			checkOnlineResult:function(player){
				return game.players[0].side==player.side;
			},
			getRoomInfo:function(uiintro){
				if(lib.configOL.versus_mode=='1v1'){
					uiintro.add('<div class="text chat">侯选人数：'+lib.configOL.choice_num+'人');
					uiintro.add('<div class="text chat">替补人数：'+lib.configOL.replace_number+'人');
				}
				else if(lib.configOL.versus_mode=='2v2'||lib.configOL.versus_mode=='3v3'){
					uiintro.add('<div class="text chat">四号位换牌：'+(lib.configOL.replace_handcard?'开启':'关闭'));
				}
				uiintro.add('<div class="text chat">出牌时限：'+lib.configOL.choose_timeout+'秒');
				/*
				if(lib.configOL.banned.length){
					last=uiintro.add('<div class="text chat">禁用武将：'+get.translation(lib.configOL.banned));
				}
				if(lib.configOL.bannedcards.length){
					last=uiintro.add('<div class="text chat">禁用卡牌：'+get.translation(lib.configOL.bannedcards));
				}
				last.style.paddingBottom='8px';
				*/
			},
			getVideoName:function(){
				var str=get.translation(game.me.name);
				if(game.me.name2){
					str+='/'+get.translation(game.me.name2);
				}
				var str2;
				switch(_status.mode){
					case 'two':str2='欢乐成双';break;
					case 'endless':str2='无尽模式';break;
					case 'three':str2='统率三军';break;
					case 'four':str2='对决 - 4v4';break;
					default:str2='对决 - '+lib.storage.number+'v'+lib.storage.number
				}
				return [str,str2];
			},
			addRecord:function(bool){
				if(typeof bool=='boolean'){
					var data=lib.config.gameRecord.versus.data;
					var identity=get.cnNumber(lib.storage.number)+'人';
					if(!data[identity]){
						data[identity]=[0,0];
					}
					if(bool){
						data[identity][0]++;
					}
					else{
						data[identity][1]++;
					}
					var list=['两人','三人','四人'];
					var str='';
					for(var i=0;i<list.length;i++){
						if(data[list[i]]){
							str+=list[i]+'：'+data[list[i]][0]+'胜'+' '+data[list[i]][1]+'负<br>';
						}
					}
					lib.config.gameRecord.versus.str=str;
					game.saveConfig('gameRecord',lib.config.gameRecord);
				}
			},
			chooseCharacterTwo:function(){
				var next=game.createEvent('chooseCharacter',false);
				next.showConfig=true;
				next.setContent(function(){
					'step 0'
					ui.arena.classList.add('choose-character');
					for(var i in lib.skill){
						if(lib.skill[i].changeSeat){
							lib.skill[i]={};
							if(lib.translate[i+'_info']){
								lib.translate[i+'_info']='此模式下不可用';
							}
						}
					}
					var bool=Math.random()<0.5;
					var bool2=Math.random()<0.5;
					var ref=game.players[0];

					ref.side=bool;
					ref.next.side=bool2;
					ref.next.next.side=!bool;
					ref.previous.side=!bool2;

					var firstChoose=game.players.randomGet();
					if(firstChoose.next.side==firstChoose.side){
						firstChoose=firstChoose.next;
					}
					_status.firstAct=firstChoose;
					for(var i=0;i<4;i++){
						firstChoose.node.name.innerHTML=get.verticalStr(get.cnNumber(i+1,true)+'号位');
						firstChoose=firstChoose.next;
					}

					for(var i=0;i<game.players.length;i++){
						if(game.players[i].side==game.me.side){
							game.players[i].node.identity.firstChild.innerHTML='友';
						}
						else{
							game.players[i].node.identity.firstChild.innerHTML='敌';
						}
						game.players[i].node.identity.dataset.color=game.players[i].side+'zhu';
					}
					var list=[];
					for(i in lib.character){
						if(!lib.filter.characterDisabled(i)){
							list.push(i);
						}
					}
					var choose=[];
					event.list=list;

					var addSetting=function(dialog){
						dialog.add('选择座位').classList.add('add-setting');
						var seats=document.createElement('table');
						seats.classList.add('add-setting');
						seats.style.margin='0';
						seats.style.width='100%';
						seats.style.position='relative';
						for(var i=1;i<=game.players.length;i++){
							var td=ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
							td.innerHTML=get.cnNumber(i,true);
							td.link=i-1;
							seats.appendChild(td);
							if(get.distance(_status.firstAct,game.me,'absolute')===i-1){
								td.classList.add('bluebg');
							}
							td.addEventListener(lib.config.touchscreen?'touchend':'click',function(){
								if(_status.dragged) return;
								if(_status.justdragged) return;
								if(get.distance(_status.firstAct,game.me,'absolute')==this.link) return;
								var current=this.parentNode.querySelector('.bluebg');
								if(current){
									current.classList.remove('bluebg');
								}
								this.classList.add('bluebg');
								_status.firstAct=game.me;
								for(var i=0;i<this.link;i++){
									_status.firstAct=_status.firstAct.previous;
								}
								var firstChoose=_status.firstAct;
								firstChoose.next.side=!firstChoose.side;
								firstChoose.next.next.side=!firstChoose.side;
								firstChoose.previous.side=firstChoose.side;
								for(var i=0;i<game.players.length;i++){
									if(game.players[i].side==game.me.side){
										game.players[i].node.identity.firstChild.innerHTML='友';
									}
									else{
										game.players[i].node.identity.firstChild.innerHTML='敌';
									}
									game.players[i].node.identity.dataset.color=game.players[i].side+'zhu';
								}
								for(var i=0;i<4;i++){
									firstChoose.node.name.innerHTML=get.verticalStr(get.cnNumber(i+1,true)+'号位');
									firstChoose=firstChoose.next;
								}
							});
						}
						dialog.content.appendChild(seats);
						if(game.me==game.zhu){
							seats.previousSibling.style.display='none';
							seats.style.display='none';
						}

						dialog.add(ui.create.div('.placeholder.add-setting'));
						dialog.add(ui.create.div('.placeholder.add-setting'));
						if(get.is.phoneLayout()) dialog.add(ui.create.div('.placeholder.add-setting'));
					};
					var removeSetting=function(){
						var dialog=_status.event.dialog;
						if(dialog){
							dialog.style.height='';
							delete dialog._scrollset;
							var list=Array.from(dialog.querySelectorAll('.add-setting'));
							while(list.length){
								list.shift().remove();
							}
							ui.update();
						}
					};
					event.addSetting=addSetting;
					event.removeSetting=removeSetting;

					var characterChoice;
					if(_status.brawl&&_status.brawl.chooseCharacter){
						characterChoice=_status.brawl.chooseCharacter(list,game.me);
					}
					else{
						characterChoice=list.randomGets(7);
					}
					var basenum=1;
					var basestr='选择角色';
					if(get.config('two_assign')){
						basenum=2;
						basestr='选择你和队友的角色';
						event.two_assign=true;
					}
					if(get.config('replace_character_two')){
						basestr+='（含一名替补角色）';
						_status.replacetwo=true;
						game.additionaldead=[];
						basenum*=2;
					}
					var dialog=ui.create.dialog(basestr,[characterChoice,'character']);
					game.me.chooseButton(true,dialog,basenum).set('onfree',true);
					if(!_status.brawl||!_status.brawl.noAddSetting){
						if(get.config('change_identity')){
							addSetting(dialog);
						}
					}

					ui.create.cheat=function(){
						_status.createControl=ui.cheat2;
						ui.cheat=ui.create.control('更换',function(){
							if(ui.cheat2&&ui.cheat2.dialog==_status.event.dialog){
								return;
							}
							var buttons=ui.create.div('.buttons');
							var node=_status.event.dialog.buttons[0].parentNode;
							_status.event.dialog.buttons=ui.create.buttons(list.randomGets(7),'character',buttons);
							_status.event.dialog.content.insertBefore(buttons,node);
							buttons.animate('start');
							node.remove();
							game.uncheck();
							game.check();
						});
						delete _status.createControl;
					};
					if(lib.onfree){
						lib.onfree.push(function(){
							event.dialogxx=ui.create.characterDialog('heightset');
							if(ui.cheat2){
								ui.cheat2.animate('controlpressdownx',500);
								ui.cheat2.classList.remove('disabled');
							}
						});
					}
					else{
						event.dialogxx=ui.create.characterDialog('heightset');
					}
					ui.create.cheat2=function(){
						ui.cheat2=ui.create.control('自由选将',function(){
							if(this.dialog==_status.event.dialog){
								this.dialog.close();
								_status.event.dialog=this.backup;
								this.backup.open();
								delete this.backup;
								game.uncheck();
								game.check();
								if(ui.cheat){
									ui.cheat.animate('controlpressdownx',500);
									ui.cheat.classList.remove('disabled');
								}
							}
							else{
								this.backup=_status.event.dialog;
								_status.event.dialog.close();
								_status.event.dialog=_status.event.parent.dialogxx;
								this.dialog=_status.event.dialog;
								this.dialog.open();
								game.uncheck();
								game.check();
								if(ui.cheat){
									ui.cheat.classList.add('disabled');
								}
							}
						});
						ui.cheat2.classList.add('disabled');
					}
					if(!_status.brawl||!_status.brawl.chooseCharacterFixed){
						if(!ui.cheat&&get.config('change_choice')){
							ui.create.cheat();
						}
						if(!ui.cheat2&&get.config('free_choose')){
							ui.create.cheat2();
						}
					}
					'step 1'
					if(ui.cheat){
						ui.cheat.close();
						delete ui.cheat;
					}
					if(ui.cheat2){
						ui.cheat2.close();
						delete ui.cheat2;
					}
					for(var i=0;i<result.links.length;i++){
						game.addRecentCharacter(result.links[i]);
					}
					game.me.init(result.links[0]);
					if(_status.replacetwo){
						game.me.replacetwo=result.links[1];
					}
					event.list.remove(game.me.name);
					for(var i=0;i<game.players.length;i++){
						if(game.players[i]!=game.me){
							if(_status.brawl&&_status.brawl.chooseCharacter){
								var list=_status.brawl.chooseCharacter(event.list,game.players[i]);
								game.players[i].init(list.randomGet());
								event.list.remove(game.players[i].name);
								if(_status.replacetwo){
									game.players[i].replacetwo=list.randomGet(game.players[i].name);
									event.list.remove(game.players[i].replacetwo);
								}
							}
							else{
								if(event.two_assign&&game.players[i].side==game.me.side){
									if(_status.replacetwo){
										game.players[i].init(result.links[2]);
										game.players[i].replacetwo=result.links[3];
									}
									else{
										game.players[i].init(result.links[1]);
									}
								}
								else{
									game.players[i].init(event.list.randomRemove());
									if(_status.replacetwo){
										game.players[i].replacetwo=event.list.randomRemove();
									}
								}
							}
						}
					}
					setTimeout(function(){
						ui.arena.classList.remove('choose-character');
					},500);

					if(get.config('two_phaseswap')){
						game.addGlobalSkill('autoswap');
						if(lib.config.show_handcardbutton){
							ui.versushs=ui.create.system('手牌',null,true);
							lib.setPopped(ui.versushs,game.versusHoverHandcards,220);
						}
					}
				});
			},
			chooseCharacterEndless:function(){
				var next=game.createEvent('chooseCharacter',false);
				next.showConfig=true;
				next.setContent(function(){
					'step 0'
					ui.arena.classList.add('choose-character');
					for(var i in lib.skill){
						if(lib.skill[i].changeSeat){
							lib.skill[i]={};
							if(lib.translate[i+'_info']){
								lib.translate[i+'_info']='此模式下不可用';
							}
						}
					}

					var firstChoose=game.players.randomGet();
					_status.firstAct=firstChoose;

					firstChoose.side=false;
					firstChoose.next.side=true;

					for(var i=0;i<game.players.length;i++){
						if(game.players[i].side==game.me.side){
							game.players[i].node.identity.firstChild.innerHTML='友';
						}
						else{
							game.players[i].node.identity.firstChild.innerHTML='敌';
						}
						game.players[i].node.identity.dataset.color=game.players[i].side+'zhu';
					}
					var list=[];
					for(i in lib.character){
						if(!lib.filter.characterDisabled(i)){
							list.push(i);
						}
					}
					var choose=[];
					event.list=list;
					_status.endlessListAll=list.slice(0);

					var characterChoice=list.randomGets(6);
					var dialog=ui.create.dialog('选择角色',[characterChoice,'character']);
					game.me.chooseButton(true,dialog).set('onfree',true);

					ui.create.cheat=function(){
						_status.createControl=ui.cheat2;
						ui.cheat=ui.create.control('更换',function(){
							if(ui.cheat2&&ui.cheat2.dialog==_status.event.dialog){
								return;
							}
							var buttons=ui.create.div('.buttons');
							var node=_status.event.dialog.buttons[0].parentNode;
							_status.event.dialog.buttons=ui.create.buttons(list.randomGets(7),'character',buttons);
							_status.event.dialog.content.insertBefore(buttons,node);
							buttons.animate('start');
							node.remove();
							game.uncheck();
							game.check();
						});
						delete _status.createControl;
					};
					if(lib.onfree){
						lib.onfree.push(function(){
							event.dialogxx=ui.create.characterDialog('heightset');
							if(ui.cheat2){
								ui.cheat2.animate('controlpressdownx',500);
								ui.cheat2.classList.remove('disabled');
							}
						});
					}
					else{
						event.dialogxx=ui.create.characterDialog('heightset');
					}
					ui.create.cheat2=function(){
						ui.cheat2=ui.create.control('自由选将',function(){
							if(this.dialog==_status.event.dialog){
								this.dialog.close();
								_status.event.dialog=this.backup;
								this.backup.open();
								delete this.backup;
								game.uncheck();
								game.check();
								if(ui.cheat){
									ui.cheat.animate('controlpressdownx',500);
									ui.cheat.classList.remove('disabled');
								}
							}
							else{
								this.backup=_status.event.dialog;
								_status.event.dialog.close();
								_status.event.dialog=_status.event.parent.dialogxx;
								this.dialog=_status.event.dialog;
								this.dialog.open();
								game.uncheck();
								game.check();
								if(ui.cheat){
									ui.cheat.classList.add('disabled');
								}
							}
						});
						ui.cheat2.classList.add('disabled');
					}
					if(!_status.brawl||!_status.brawl.chooseCharacterFixed){
						if(!ui.cheat&&get.config('change_choice')){
							ui.create.cheat();
						}
						if(!ui.cheat2&&get.config('free_choose')){
							ui.create.cheat2();
						}
					}
					'step 1'
					if(ui.cheat){
						ui.cheat.close();
						delete ui.cheat;
					}
					if(ui.cheat2){
						ui.cheat2.close();
						delete ui.cheat2;
					}
					for(var i=0;i<result.links.length;i++){
						game.addRecentCharacter(result.links[i]);
					}
					game.me.init(result.links[0]);
					event.list.remove(game.me.name);
					for(var i=0;i<game.players.length;i++){
						if(game.players[i]!=game.me){
							game.players[i].init(event.list.randomRemove());
							if(_status.replacetwo){
								game.players[i].replacetwo=event.list.randomRemove();
							}
						}
					}
					_status.endlessList=event.list;
					setTimeout(function(){
						ui.arena.classList.remove('choose-character');
					},500);
				});
			},
			chooseCharacterFour:function(){
				var next=game.createEvent('chooseCharacter',false);
				next.showConfig=true;
				next.ai=function(player,list,list2){
					if(player.identity=='zhu'){
						list2.randomSort();
						var choice;
						if(Math.random()-0.8<0&&list2.length){
							choice=list2[0];
						}
						else{
							choice=list[0];
						}
						player.init(choice);
						player.hp++;
						player.maxHp++;
						player.update();
					}
					else if(Math.random()<0.5){
						var choice=0;
						for(var i=0;i<list.length;i++){
							if(lib.character[list[i]][1]==game[player.side+'Zhu'].group){
								choice=i;break;
							}
						}
						player.init(list[choice]);
					}
					else{
						player.init(list[0]);
					}
					this.list.remove(player.name);
					this.list2.remove(player.name);
				}
				next.setContent(function(){
					"step 0"
					ui.arena.classList.add('choose-character');
					var i;
					var list;
					var list2=[];

					event.list=[];
					event.filterChoice=function(name){
						if(get.config('enable_all')) return false;
						return !lib.choiceFour.contains(name);
					}
					for(i in lib.character){
						if(event.filterChoice(i)) continue;
						if(lib.filter.characterDisabled(i)) continue;
						event.list.push(i);
						if(lib.character[i][4]&&lib.character[i][4].contains('zhu')){
							list2.push(i);
						}
					}
					if(_status.brawl&&_status.brawl.chooseCharacterFilter){
						event.list=_status.brawl.chooseCharacterFilter(event.list);
					}
					event.list.randomSort();
					event.list2=list2;
					event.four_assign=get.config('four_assign');
					if(!event.four_assign){
						event.current=_status.firstAct;
					}
					else{
						event.current=_status.firstAct.next;
					}
					event.flipassign=true;
					if(_status.firstAct.side){
						for(var i=0;i<game.players.length;i++){
							game.players[i].side=!game.players[i].side;
							game.players[i].node.identity.dataset.color=get.translation(game.players[i].side+'Color');
						}
					}
					for(var i=0;i<game.players.length;i++){
						if(!game.players[i].node.name_seat){
							game.players[i].node.name_seat=ui.create.div('.name.name_seat',get.verticalStr(lib.translate['unknown'+get.distance(_status.firstAct,game.players[i],'absolute')]),game.players[i]);
							game.players[i].node.name_seat.style.opacity=1;
						}
					}
					if(get.config('ladder')){
						var date=new Date();
						if(!lib.storage.ladder){
							lib.storage.ladder={
								current:900,
								top:900,
								month:date.getMonth()
							};
							game.save('ladder',lib.storage.ladder);
						}
						else if(date.getMonth()!=lib.storage.ladder.month&&get.config('ladder_monthly')){
							lib.storage.ladder.month=date.getMonth();
							lib.storage.ladder.current=900;
							game.save('ladder',lib.storage.ladder);
						}
						ui.ladder=ui.create.system(game.getLadderName(lib.storage.ladder.current),null,true);
						lib.setPopped(ui.ladder,function(uiintro){
							var uiintro=ui.create.dialog('hidden');
							uiintro.add('<div class="text center">当前分数：<div style="width:40px;text-align:left;font-family:xinwei">'+(lib.storage.ladder.current+(_status.ladder_tmp?40:0))+'</div></div>');
							uiintro.add('<div class="text center">历史最高：<div style="width:40px;text-align:left;font-family:xinwei">'+lib.storage.ladder.top+'</div></div>');
							uiintro.content.lastChild.style.paddingBottom='8px';
							return uiintro;
						},180);
						_status.ladder=true;
						_status.ladder_mmr=0;
					}
					event.addSetting=function(){
						var cs=function(link,node){
							game.swapPlayer(node._link);
							_status.rechoose=true;
							for(var i=0;i<game.players.length;i++){
								game.players[i].uninit();
								if(game.players[i].node.name_seat) game.players[i].node.name_seat.style.display='';
								game.players[i].classList.remove('selectedx');
							}
							game.resume();
						};
						if(!event.seatsbutton){
							event.seatsbutton=[
								ui.create.control('一号位',cs),
								ui.create.control('一号位',cs),
								ui.create.control('一号位',cs),
								ui.create.control('换边',function(){
									if(_status.firstAct.side==game.me.side){
										cs(null,{_link:_status.firstAct.nextSeat});
									}
									else{
										cs(null,{_link:_status.firstAct});
									}
								})
							];
						}
						var seats=[];
						for(var i=0;i<game.players.length;i++){
							if(game.players[i]!=game.me&&game.players[i].side==game.me.side){
								seats.add([1+get.distance(_status.firstAct,game.players[i],'absolute'),game.players[i]]);
							}
							seats.sort(function(a,b){
								return a[0]-b[0];
							});
						}
						for(var i=0;i<event.seatsbutton.length;i++){
							if(i<seats.length){
								event.seatsbutton[i].firstChild.innerHTML=get.cnNumber(seats[i][0],true)+'号位';
								event.seatsbutton[i].firstChild._link=seats[i][1];
							}
						}
					};
					if(!get.config('four_assign')&&!get.config('four_phaseswap')){
						if(get.config('change_identity')){
							event.addSetting();
						}
						if(get.config('fouralign')&&!event.fouralignbutton){
							event.fouralignbutton=ui.create.control('变阵',function(){
								if(!_status.fouralign.length||(_status.fouralign.length==1&&_status.fouralign[0]==0)){
									_status.fouralign=[0,1,2,3,4];
								}
								var list=[
									['zhong','ezhong','ezhong','zhong','zhong','ezhong','ezhong','zhong'],
									['zhong','ezhong','zhong','ezhong','ezhong','zhong','ezhong','zhong'],
									['zhong','ezhong','ezhong','zhong','ezhong','zhong','zhong','ezhong'],
									['zhong','ezhong','zhong','ezhong','zhong','ezhong','zhong','ezhong'],
									['zhong','ezhong','ezhong','zhong','ezhong','zhong','ezhong','zhong'],
								][_status.fouralign.shift()];
								var rand1=Math.floor(Math.random()*4);
								var rand2=Math.floor(Math.random()*4);
								for(var i=0;i<list.length;i++){
									if(list[i]=='zhong'){
										if(rand1==0){
											list[i]='zhu';
										}
										rand1--;
									}
									else{
										if(rand2==0){
											list[i]='ezhu';
										}
										rand2--;
									}
								}

								var side=Math.random()<0.5;
								var num=game.players.indexOf(_status.firstAct);
								list=list.splice(8-num).concat(list);

								for(var i=0;i<8;i++){
									if(list[i][0]=='e'){
										game.players[i].side=side;
										game.players[i].identity=list[i].slice(1);
									}
									else{
										game.players[i].side=!side;
										game.players[i].identity=list[i];
									}
									if(game.players[i].identity=='zhu'){
										game[game.players[i].side+'Zhu']=game.players[i];
										game.players[i].isZhu=true;
									}
									game.players[i].setIdentity(game.players[i].identity);
									game.players[i].node.identity.dataset.color=get.translation(game.players[i].side+'Color');
									if(game.players[i].node.name_seat){
										game.players[i].node.name_seat.remove();
										delete game.players[i].node.name_seat;
									}
								}

								_status.rechoose=true;
								for(var i=0;i<game.players.length;i++){
									game.players[i].uninit();
									if(game.players[i].node.name_seat) game.players[i].node.name_seat.style.display='';
									game.players[i].classList.remove('selectedx');
								}
								game.resume();
							});
						}
					}
					"step 1"
					if(event.current==game.me||(event.four_assign&&event.current.side==game.me.side)){
						var dialog=event.xdialog;
						if(!dialog){
							if(get.config('expand_dialog')){
								dialog=event.xdialog||ui.create.characterDialog('heightset',event.filterChoice,'expandall');
							}
							else{
								dialog=event.xdialog||ui.create.characterDialog('heightset',event.filterChoice,'precharacter');
							}
						}
						var names=[];
						for(var i=0;i<game.players.length;i++){
							if(game.players[i].name){
								names.push(game.players[i].name);
							}
						}
						for(var i=0;i<dialog.buttons.length;i++){
							if(names.contains(dialog.buttons[i].link)){
								dialog.buttons[i].classList.add('unselectable');
								dialog.buttons[i].classList.add('noclick');
							}
						}
						game.me.chooseButton(dialog,true).set('onfree',true).closeDialog=false;
						event.xdialog=dialog;
						dialog.static=true;
						event.current.classList.add('selectedx');
						game.delay(0.5);
					}
					else{
						event.ai(event.current,event.list.randomGets(3),event.list2);
						event.current.node.name_seat.style.display='none';
						if(!event.four_assign){
							event.current=event.current.next;
							event.redo();
						}
					}
					"step 2"
					if(_status.rechoose){
						delete _status.rechoose;
						event.goto(0);
						var dialog=event.xdialog;
						if(dialog){
							for(var i=0;i<dialog.buttons.length;i++){
								dialog.buttons[i].classList.remove('unselectable');
								dialog.buttons[i].classList.remove('noclick');
							}
						}
						return;
					}
					if(event.seatsbutton){
						for(var i=0;i<event.seatsbutton.length;i++){
							event.seatsbutton[i].close();
						}
						delete event.seatsbutton;
					}
					event.current.classList.remove('selectedx');
					if(event.current.side==game.me.side){
						event.current.init(result.buttons[0].link);
						event.list.remove(event.current.name);
						event.list2.remove(event.current.name);
						if(event.current.identity=='zhu'){
							event.current.hp++;
							event.current.maxHp++;
							event.current.update();
						}
						event.current.node.name_seat.remove();
					}
					if(event.four_assign){
						for(var i=0;i<game.players.length;i++){
							if(!game.players[i].name) break;
						}
						if(i<game.players.length){
							var side=event.current.side;
							event.current=_status.firstAct.next;
							if(event.flipassign){
								for(var iwhile=0;iwhile<8;iwhile++){
									event.current=event.current.next;
									if(event.current.side!=side&&!event.current.name){
										break;
									}
								}
							}
							else{
								for(var iwhile=0;iwhile<8;iwhile++){
									event.current=event.current.previous;
									if(event.current.side==side&&!event.current.name){
										break;
									}
								}
							}
							event.flipassign=!event.flipassign;
							event.goto(1);
						}
					}
					else{
						for(var i=0;i<game.players.length;i++){
							if(!game.players[i].name){
								event.ai(game.players[i],event.list.splice(0,3),event.list2);
								game.players[i].node.name_seat.remove();
							}
						}
					}
					"step 3"
					if(get.config('four_phaseswap')){
						game.addGlobalSkill('autoswap');
						if(lib.config.show_handcardbutton){
							ui.versushs=ui.create.system('手牌',null,true);
							lib.setPopped(ui.versushs,game.versusHoverHandcards,220);
						}
					}
					if(event.xdialog){
						event.xdialog.close();
					}
					game.addRecentCharacter(game.me.name,game.me.name2);
					ui.control.style.transitionDuration='0s';
					ui.refresh(ui.control);
					ui.arena.classList.remove('choose-character');
					setTimeout(function(){
						ui.control.style.transitionDuration='';
					},500);
					lib.init.onfree();
					delete _status.fouralign;
					if(event.fouralignbutton){
						event.fouralignbutton.close();
						delete event.fouralignbutton;
					}
				});
			},
			chooseCharacterThree:function(){
				var next=game.createEvent('chooseCharacter',false);
				next.setContent(function(){
					'step 0'
					if(lib.config.continue_name_versus_three){
						event.friendlist=lib.config.continue_name_versus_three.friend;
						event.enemylist=lib.config.continue_name_versus_three.enemy;
						_status.color=lib.config.continue_name_versus_three.color;
						game.additionaldead=[];
						game.saveConfig('continue_name_versus_three');
						event.goto(2);
						lib.init.onfree();
					}
					else{
						game.chooseCharacterDouble(function(i){
							if(get.config('enable_all_three')){
								if(lib.filter.characterDisabled(i)) return false;
								return !lib.filter.characterDisabled(i);
							}
							else{
								return lib.choiceThree.contains(i);
							}
						},function(i){
							return i==1?'主帅':'前锋';
						});
					}
					"step 1"
					game.addRecentCharacter.apply(this,result.friend);
					event.friendlist=result.friend;
					event.enemylist=result.enemy;
					"step 2"
					_status.friendBackup=event.friendlist.slice(0);
					_status.enemyBackup=event.enemylist.slice(0);
					_status.coinCoeff=get.coinCoeff(event.friendlist);

					ui.create.players(6);
					for(var i=0;i<game.players.length;i++){
						game.players[i].getId();
						game.players[i].node.action.innerHTML='行动';
					}
					ui.arena.setNumber(7);
					for(var i=0;i<game.players.length;i++){
						game.players[i].dataset.position=parseInt(game.players[i].dataset.position)+1;
					}
					game.singleHandcard=true;
					ui.arena.classList.add('single-handcard');
					ui.window.classList.add('single-handcard');
					ui.fakeme=ui.create.div('.fakeme.avatar');
					_status.prepareArena=true;
					ui.create.me();
					ui.me.appendChild(ui.fakeme);

					game.friend=[];
					game.enemy=[];

					for(var i in lib.skill){
						if(lib.skill[i].changeSeat){
							lib.skill[i]={};
							if(lib.translate[i+'_info']){
								lib.translate[i+'_info']='固定位置时不可用';
							}
						}
					}
					for(i=0;i<game.players.length;i++){
						if(i<3){
							game.friend.push(game.players[i]);
						}
						else{
							game.enemy.push(game.players[i]);
						}
					}
					game.friendZhu=game.players[1];
					game.enemyZhu=game.players[4];
					for(var i=0;i<3;i++){
						game.friend[i].side=_status.color;
						game.enemy[i].side=!_status.color;
						if(game.friendZhu==game.friend[i]){
							game.friend[i].identity='zhu';
							game.friend[i].setIdentity(_status.color+'Zhu');
						}
						else{
							game.friend[i].identity='zhong';
							game.friend[i].setIdentity(_status.color+'Zhong');
						}
						if(game.enemyZhu==game.enemy[i]){
							game.enemy[i].identity='zhu';
							game.enemy[i].setIdentity(!_status.color+'Zhu');
						}
						else{
							game.enemy[i].identity='zhong';
							game.enemy[i].setIdentity(!_status.color+'Zhong');
						}
						game.friend[i].init(event.friendlist[i]);
						game.enemy[i].init(event.enemylist[i]);
						game.friend[i].node.identity.dataset.color=get.translation(_status.color+'Color');
						game.enemy[i].node.identity.dataset.color=get.translation(!_status.color+'Color');
					}
					game.friendZhu.maxHp++;
					game.friendZhu.hp++;
					game.friendZhu.update();

					game.enemyZhu.maxHp++;
					game.enemyZhu.hp++;
					game.enemyZhu.update();

					game.onSwapControl();
				});
			},
			chooseCharacter:function(){
				var next=game.createEvent('chooseCharacter',false);
				next.showConfig=true;
				next.setContent(function(){
					"step 0"
					if(lib.config.continue_name_versus){
						_status.friend=lib.config.continue_name_versus.friend;
						_status.enemy=lib.config.continue_name_versus.enemy;
						_status.color=lib.config.continue_name_versus.color;
						game.additionaldead=[];
						event.goto(1);
						game.saveConfig('continue_name_versus');
						lib.init.onfree();
						return;
					}
					event.check=function(){
						this.dialog.classList.add('fullwidth');
						this.dialog.classList.add('fullheight');
						this.dialog.classList.add('noslide');
						for(var i=0;i<this.dialog.buttons.length;i++) this.dialog.buttons[i].style.opacity=1;
						this.dialog.add('选项');
						this.dialog.versus_zhu=this.dialog.add(ui.create.switcher('versus_zhu',lib.storage.zhu)).querySelector('.toggle');
						// this.dialog.versus_only_zhu=this.dialog.add(ui.create.switcher('versus_only_zhu',lib.storage.only_zhu)).querySelector('.toggle');
						this.dialog.versus_main_zhu=this.dialog.add(ui.create.switcher('versus_main_zhu',lib.storage.main_zhu)).querySelector('.toggle');
						if(lib.storage.zhu){
							// this.dialog.versus_only_zhu.parentNode.classList.remove('disabled');
							this.dialog.versus_main_zhu.parentNode.classList.remove('disabled');
						}
						else{
							// this.dialog.versus_only_zhu.parentNode.classList.add('disabled');
							this.dialog.versus_main_zhu.parentNode.classList.add('disabled');
						}
						// this.dialog.versus_cross_seat=this.dialog.add(ui.create.switcher('versus_cross_seat',lib.storage.cross_seat)).querySelector('.toggle');
						// this.dialog.versus_random_seat=this.dialog.add(ui.create.switcher('versus_random_seat',lib.storage.random_seat)).querySelector('.toggle');
						this.dialog.versus_noreplace_end=this.dialog.add(ui.create.switcher('versus_noreplace_end',lib.storage.noreplace_end)).querySelector('.toggle');
						this.dialog.versus_assign_enemy=this.dialog.add(ui.create.switcher('versus_assign_enemy',lib.storage.assign_enemy)).querySelector('.toggle');
						this.dialog.versus_single_control=this.dialog.add(ui.create.switcher('versus_single_control',lib.storage.single_control)).querySelector('.toggle');
						this.dialog.versus_first_less=this.dialog.add(ui.create.switcher('versus_first_less',get.config('first_less'))).querySelector('.toggle');
						this.dialog.versus_reward=this.dialog.add(ui.create.switcher('versus_reward',[0,1,2,3,4],lib.storage.versus_reward)).querySelector('.toggle');
						this.dialog.versus_punish=this.dialog.add(ui.create.switcher('versus_punish',['弃牌','无','摸牌'],lib.storage.versus_punish)).querySelector('.toggle');
						this.dialog.versus_seat_order=this.dialog.add(ui.create.switcher('seat_order',['对阵','交叉','随机'],lib.storage.seat_order)).querySelector('.toggle');
						this.dialog.versus_number=this.dialog.add(ui.create.switcher('versus_number',[1,2,3],lib.storage.number)).querySelector('.toggle');
						this.dialog.replace_number=this.dialog.add(ui.create.switcher('replace_number',[0,1,2,3,5,7,9,17],lib.storage.replace_number)).querySelector('.toggle');
						this.dialog.choice=this.dialog.add(ui.create.switcher('choice',[12,16,20,24,40,'∞'],lib.storage.choice)).querySelector('.toggle');

						// if(lib.storage.cross_seat){
						// 	this.dialog.versus_random_seat.parentNode.classList.add('disabled');
						// }
						// else{
						// 	this.dialog.versus_random_seat.parentNode.classList.remove('disabled');
						// 	if(lib.storage.random_seat){
						// 		this.dialog.versus_cross_seat.parentNode.classList.add('disabled');
						// 	}
						// 	else{
						// 		this.dialog.versus_cross_seat.parentNode.classList.remove('disabled');
						// 	}
						// }
					};
					event.confirm=function(){
						var dialog=event.dialog;
						var num=lib.storage.number+lib.storage.replace_number;
						_status.friend.splice(num);
						_status.enemy.splice(num);
						dialog.close();
						if(ui.confirm) ui.confirm.close();
						game.resume();
					};
					ui.control.style.transition='all 0s';
					if(get.is.phoneLayout()){
						ui.control.style.top='calc(100% - 80px)';
					}
					else if(game.layout=='newlayout'){
						ui.control.style.top='calc(100% - 30px)';
					}
					else{
						ui.control.style.top='calc(100% - 70px)';
					}
					_status.friend=[];
					_status.enemy=[];
					game.additionaldead=[];
					_status.color=Math.random()<0.5;
					var i,list=[];
					for(i in lib.character){
						if(lib.config.forbidversus.contains(i)) continue;
						if(lib.filter.characterDisabled(i)) continue;
						list.push(i);
					}
					var groupSort=function(name){
						if(lib.character[name][1]=='wei') return 0;
						if(lib.character[name][1]=='shu') return 1;
						if(lib.character[name][1]=='wu') return 2;
						if(lib.character[name][1]=='qun') return 3;
					}
					var sortByGroup=function(a,b){
						var del=groupSort(a)-groupSort(b);
						if(del!=0) return del;
						if(a.indexOf('_')!=-1){
							a=a.slice(a.indexOf('_')+1);
						}
						if(b.indexOf('_')!=-1){
							b=b.slice(b.indexOf('_')+1);
						}
						return a>b?1:-1;
					}
					if(lib.storage.choice=='∞'){
						list.sort(sortByGroup);
					}
					else{
						list.randomSort();
					}
					_status.list=list;
					var choice=(lib.storage.choice=='∞')?list.length:lib.storage.choice;
					event.dialog=ui.create.dialog('选择角色',[list.slice(0,choice),'character']);
					event.dialog.classList.add('fixed');
					// for(var i=0;i<event.dialog.buttons.length;i++){
					// 	event.dialog.buttons[i].style.transform='scale(0.95)';
					// }
					event.check();
					ui.create.cheat=function(){
						_status.createControl=event.fill;
						ui.cheat=ui.create.control('更换',function(){
							if(_status.choosefinished){
								return;
							}
							if(lib.storage.choice=='∞'){
								list.sort(sortByGroup);
							}
							else{
								list.randomSort();
							}
							_status.friend.length=0;
							_status.enemy.length=0;
							var choice=(lib.storage.choice=='∞')?list.length:lib.storage.choice;

							ui.dialog.content.firstChild.innerHTML='选择角色';
							var buttons=ui.create.div('.buttons');
							var node=_status.event.dialog.buttons[0].parentNode;
							_status.event.dialog.buttons=ui.create.buttons(list.slice(0,choice),'character',buttons);
							_status.event.dialog.content.insertBefore(buttons,node);
							buttons.animate('start');
							node.remove();

							// event.check();
						});
						delete _status.createControl;
					}
					if(!ui.cheat&&get.config('change_choice'))
					ui.create.cheat();
					if(lib.config.test_game){
						setTimeout(function(){
							event.switchToAuto();
						},500);
					}
					event.switchToAuto=function(){
						delete _status.choosefinished;
						event.fill.close();
						var buttons=_status.event.dialog.buttons.slice(0);
						buttons.randomSort();
						for(var i=0;i<buttons.length;i++){
							if(buttons[i].classList.contains('glow')||buttons[i].classList.contains('selectedx')){
								buttons.splice(i,1);i--;
							}
						}
						var dialog=_status.event.dialog;
						var max=dialog.versus_number.link+dialog.replace_number.link;
						for(var i=0;i<buttons.length;i++){
							if(_status.friend.length<max){
								_status.friend.push(buttons[i].link);
							}
							else if(_status.enemy.length<max){
								_status.enemy.push(buttons[i].link);
							}
							else{
								break;
							}
						}
						_status.friend.splice(max);
						_status.enemy.splice(max);
						dialog.close();
						if(ui.confirm) ui.confirm.close();
						game.resume();
					};
					event.fill=ui.create.control('补全',event.switchToAuto);
					event.custom.replace.button=function(button){
						if(_status.choose_enemy){
							if(button.classList.contains('glow')||button.classList.contains('selectedx')||_status.choosefinished) return;
							_status.choose_enemy=false;
							if(!_status.color){
								button.classList.add('selectedx');
								// button.style.transform='rotate(-3deg)';
							}
							else{
								button.classList.add('glow');
								// button.style.transform='rotate(-3deg)';
							}
							_status.enemy.push(button.link);
							var buttons=_status.event.dialog.buttons.slice(0);
							for(var i=0;i<buttons.length;i++){
								if(buttons[i].classList.contains('glow')||buttons[i].classList.contains('selectedx')){
									buttons.splice(i,1);i--;
								}
							}
						}
						else{
							if(button.classList.contains('glow')||button.classList.contains('selectedx')||_status.choosefinished) return;
							if(_status.color){
								button.classList.add('selectedx');
								// button.style.transform='rotate(-3deg)';
							}
							else{
								button.classList.add('glow');
								// button.style.transform='rotate(-3deg)';
							}
							_status.friend.push(button.link);
							var buttons=_status.event.dialog.buttons.slice(0);
							for(var i=0;i<buttons.length;i++){
								if(buttons[i].classList.contains('glow')||buttons[i].classList.contains('selectedx')){
									buttons.splice(i,1);i--;
								}
							}
							if(lib.storage.assign_enemy){
								_status.choose_enemy=true;
							}
							else{
								var button2=buttons[Math.floor(Math.random()*buttons.length)];
								if(_status.color){
									button2.classList.add('glow');
									// button2.style.transform='rotate(-3deg)';
								}
								else{
									button2.classList.add('selectedx');
									// button2.style.transform='rotate(-3deg)';
								}
								_status.enemy.push(button2.link);
								_status.event.dialog.content.firstChild.innerHTML='对方选择了'+get.translation(button2.link);
							}
						}
					};
					event.custom.add.window=function(){
						var dialog=_status.event.dialog;
						if(_status.friend.length==_status.enemy.length&&_status.friend.length>=dialog.versus_number.link+dialog.replace_number.link){
							event.fill.firstChild.innerHTML='开始';
							_status.choosefinished=true;
							if(ui.cheat){
								ui.cheat.close();
								delete ui.cheat;
							}
						}
						game.save('zhu',dialog.versus_zhu.link);
						if(lib.storage.zhu){
							// dialog.versus_only_zhu.parentNode.classList.remove('disabled');
							dialog.versus_main_zhu.parentNode.classList.remove('disabled');
						}
						else{
							// dialog.versus_only_zhu.parentNode.classList.add('disabled');
							dialog.versus_main_zhu.parentNode.classList.add('disabled');
						}
						// game.save('only_zhu',dialog.versus_only_zhu.link);
						game.save('main_zhu',dialog.versus_main_zhu.link);
						game.save('assign_enemy',dialog.versus_assign_enemy.link);
						game.save('seat_order',dialog.versus_seat_order.link);
						// game.save('cross_seat',dialog.versus_cross_seat.link);
						game.save('noreplace_end',dialog.versus_noreplace_end.link);
						game.save('single_control',dialog.versus_single_control.link);
						switch(lib.storage.seat_order){
							case '交叉':lib.storage.cross_seat=true;lib.storage.random_seat=false;break;
							case '随机':lib.storage.cross_seat=false;lib.storage.random_seat=true;break;
							default:lib.storage.cross_seat=false;lib.storage.random_seat=false;
						}
						game.saveConfig('first_less',dialog.versus_first_less.link,true);
						game.save('number',dialog.versus_number.link);
						game.save('versus_reward',dialog.versus_reward.link);
						game.save('versus_punish',dialog.versus_punish.link);
						game.save('replace_number',dialog.replace_number.link);
						game.save('choice',dialog.choice.link);
						var count,i;
						if(dialog.buttons.length>lib.storage.choice){
							count=dialog.buttons.length-lib.storage.choice;
							var removed=[];
							for(i=dialog.buttons.length-1;i>=0&&count>0;i--){
								if(dialog.buttons[i].classList.contains('target')==false&&
									dialog.buttons[i].classList.contains('glow')==false){
									dialog.buttons[i].remove();
									_status.list.remove(dialog.buttons[i].link);
									removed.push(dialog.buttons[i].link)
									dialog.buttons.splice(i,1);
									count--;
								}
							}
							for(i=0;i<removed.length;i++) _status.list.splice(lib.storage.choice,0,removed[i]);
						}
						else if(dialog.buttons.length<lib.storage.choice||lib.storage.choice=='∞'){
							var list=_status.list;
							var choice=(lib.storage.choice=='∞')?list.length:lib.storage.choice;
							var buttons=dialog.querySelector('.buttons');
							var button;
							for(i=dialog.buttons.length;i<choice;i++){
								button=ui.create.button(list[i],'character',buttons).animate('zoom')
								dialog.buttons.push(button);
								button.style.opacity=1;
							}
						}
					};
					game.pause();
					lib.init.onfree();
					"step 1"
					_status.friendBackup=_status.friend.slice(0);
					_status.enemyBackup=_status.enemy.slice(0);

					_status.friendDied=[];
					_status.enemyDied=[];
					_status.totalCount=_status.friend.length;
					_status.coinCoeff=get.coinCoeff(_status.friend);

					// ui.auto.show();
					ui.wuxie.show();
					ui.control.style.display='none';
					setTimeout(function(){
						ui.control.style.top='';
						ui.control.style.display='';
						ui.control.style.transition='';
					},500);
					if(ui.cheat){
						ui.cheat.close();
						delete ui.cheat;
					}
					delete _status.list;
					var num=lib.storage.number;
					ui.create.players(num*2);
					for(var i=0;i<game.players.length;i++){
						game.players[i].getId();
						game.players[i].node.action.innerHTML='行动';
					}
					if(lib.storage.single_control&&game.players.length>=4){
						ui.arena.setNumber(parseInt(ui.arena.dataset.number)+1);
						for(var i=0;i<game.players.length;i++){
							game.players[i].dataset.position=parseInt(game.players[i].dataset.position)+1;
						}
						game.singleHandcard=true;
						ui.arena.classList.add('single-handcard');
						ui.window.classList.add('single-handcard');
						ui.fakeme=ui.create.div('.fakeme.avatar');
						// ui.fakeme.line=lib.element.player.line;
						// ui.fakemebg=ui.create.div('.avatar',ui.fakeme).hide();
					}
					_status.prepareArena=true;
					ui.create.me();
					if(ui.fakeme){
						ui.me.appendChild(ui.fakeme);
					}
					var position,i;
					if(lib.storage.zhu&&lib.storage.only_zhu) position=Math.ceil(num/2)-1;
					else position=Math.floor(Math.random()*num)
					game.friend=[];
					game.enemy=[];
					if(lib.storage.random_seat){
						var players=game.players.slice(0);
						game.friend.push(game.me);
						players.remove(game.me);
						for(i=0;i<num-1;i++){
							game.friend.push(players.randomRemove());
						}
						for(i=0;i<num;i++){
							game.enemy.push(players.randomRemove());
						}
					}
					else{
						for(var i in lib.skill){
							if(lib.skill[i].changeSeat){
								lib.skill[i]={};
								if(lib.translate[i+'_info']){
									lib.translate[i+'_info']='固定位置时不可用';
								}
							}
						}
						if(lib.storage.cross_seat){
							for(i=0;i<game.players.length;i++){
								if(i%2==0){
									game.friend.push(game.players[i]);
								}
								else{
									game.enemy.push(game.players[i]);
								}
							}
						}
						else{
							for(i=0;i<position;i++){
								game.friend.push(game.players[i-position+num*2]);
							}
							for(i=position;i<num;i++){
								game.friend.push(game.players[i-position]);
							}
							for(i=0;i<num;i++){
								game.enemy.push(game.players[num-position+i]);
							}
						}
					}
					if(((position==Math.ceil(num/2)-1&&lib.storage.zhu)||(lib.storage.zhu&&lib.storage.single_control))){
						var dialog=ui.create.dialog('按顺序选择出场角色',[_status.friend,'character']);
						game.me.chooseButton(dialog,num,true);
					}
					if(lib.storage.random_seat&&lib.storage.zhu){
						if(lib.storage.only_zhu){
							game.friendZhu=game.me;
						}
						else{
							game.friendZhu=game.friend.randomGet();
						}
						game.enemyZhu=game.enemy.randomGet();
					}
					for(i=0;i<num;i++){
						game.friend[i].side=_status.color;
						game.enemy[i].side=!_status.color;
						if(lib.storage.random_seat&&lib.storage.zhu){
							if(game.friendZhu==game.friend[i]){
								game.friend[i].identity='zhu';
								game.friend[i].setIdentity(_status.color+'Zhu');
							}
							else{
								game.friend[i].identity='zhong';
								game.friend[i].setIdentity(_status.color+'Zhong');
							}
							if(game.enemyZhu==game.enemy[i]){
								game.enemy[i].identity='zhu';
								game.enemy[i].setIdentity(!_status.color+'Zhu');
							}
							else{
								game.enemy[i].identity='zhong';
								game.enemy[i].setIdentity(!_status.color+'Zhong');
							}
						}
						else{
							if(game.me==game.friend[i]&&lib.storage.zhu){
								game.friend[i].identity='zhu';
								game.friend[i].setIdentity(_status.color+'Zhu');
								game.friendZhu=game.friend[i];
							}
							else{
								game.friend[i].identity='zhong';
								game.friend[i].setIdentity(_status.color+'Zhong');

							}
							if(lib.storage.zhu&&get.distance(game.enemy[i],game.me,'pure')==num){
								game.enemy[i].identity='zhu';
								game.enemy[i].setIdentity(!_status.color+'Zhu');
								game.enemyZhu=game.enemy[i];
							}
							else{
								game.enemy[i].identity='zhong';
								game.enemy[i].setIdentity(!_status.color+'Zhong');
							}
						}
						game.friend[i].node.identity.dataset.color=get.translation(_status.color+'Color');
						game.enemy[i].node.identity.dataset.color=get.translation(!_status.color+'Color');
						// game.friend[i].node.identity.style.backgroundColor=get.translation(_status.color+'Color');
						// game.enemy[i].node.identity.style.backgroundColor=get.translation(!_status.color+'Color');
					}
					if(lib.storage.zhu&&!game.enemyZhu){
						game.enemy[0].identity='zhu';
						game.enemy[0].setIdentity(!_status.color+'Zhu');
						game.enemyZhu=game.enemy[0];
					}
					"step 2"
					var num=lib.storage.number;
					if(result&&result.buttons){
						var list=[];
						for(i=0;i<result.buttons.length;i++){
							list.push(result.buttons[i].link);
							_status.friend.remove(result.buttons[i].link);
						}
						_status.friend=list.concat(_status.friend);
					}
					for(i=0;i<num;i++){
						game.friend[i].init(_status.friend[i]);
						game.enemy[i].init(_status.enemy[i]);

						game.friend[i].node.identity.dataset.color=get.translation(_status.color+'Color');
						game.enemy[i].node.identity.dataset.color=get.translation(!_status.color+'Color');
					}
					if(lib.storage.zhu&&lib.storage.main_zhu){
						game.friendZhu.maxHp++;
						game.friendZhu.hp++;
						game.friendZhu.update();

						game.enemyZhu.maxHp++;
						game.enemyZhu.hp++;
						game.enemyZhu.update();
					}
					_status.friend.splice(0,num);
					_status.enemy.splice(0,num);
					if(lib.storage.single_control&&game.players.length>=4){
						// ui.fakemebg.show();
						game.onSwapControl();
					}
				});
			},
			chooseCharacterOL:function(){
				switch(lib.configOL.versus_mode){
					case '1v1':game.chooseCharacterOL1();break;
					case '2v2':game.chooseCharacterOL2();break;
					case '3v3':game.chooseCharacterOL3();break;
					case '4v4':game.chooseCharacterOL4();break;
				}
			},
			chooseCharacterOL4:function(){
				var next=game.createEvent('chooseCharacter',false);
				next.setContent(function(){
					"step 0"
					var list=[
						['zhong','ezhong','ezhong','zhong','zhong','ezhong','ezhong','zhong'],
						['zhong','ezhong','zhong','ezhong','ezhong','zhong','ezhong','zhong'],
						['zhong','ezhong','ezhong','zhong','ezhong','zhong','zhong','ezhong'],
						['zhong','ezhong','zhong','ezhong','zhong','ezhong','zhong','ezhong'],
						['zhong','ezhong','ezhong','zhong','ezhong','zhong','ezhong','zhong'],
					].randomGet();
					var rand1=Math.floor(Math.random()*4);
					var rand2=Math.floor(Math.random()*4);
					for(var i=0;i<list.length;i++){
						if(list[i]=='zhong'){
							if(rand1==0){
								list[i]='zhu';
							}
							rand1--;
						}
						else{
							if(rand2==0){
								list[i]='ezhu';
							}
							rand2--;
						}
					}

					var side=Math.random()<0.5;
					var map={};
					var num=Math.floor(Math.random()*8);
					list=list.splice(8-num).concat(list);
					_status.firstAct=game.players[num];
					event.current=_status.firstAct.next;
					for(var i=0;i<8;i++){
						if(list[i][0]=='e'){
							game.players[i].side=side;
							game.players[i].identity=list[i].slice(1);
						}
						else{
							game.players[i].side=!side;
							game.players[i].identity=list[i];
						}
						map[game.players[i].playerid]=[game.players[i].side,game.players[i].identity];
					}
					if(_status.firstAct.side){
						for(var i=0;i<game.players.length;i++){
							game.players[i].side=!game.players[i].side;
							map[game.players[i].playerid]=[game.players[i].side,game.players[i].identity];
						}
					}
					game.broadcastAll(function(current){
						for(var i=0;i<game.players.length;i++){
							game.players[i].node.name_seat=ui.create.div('.name.name_seat',get.verticalStr(lib.translate['unknown'+get.distance(current,game.players[i],'absolute')]),game.players[i]);
							game.players[i].node.name_seat.style.opacity=1;
						}
					},_status.firstAct);

					var filterChoice=function(name){
						if(name=='zuoci'||name=='miheng') return true;
						if(!lib.choiceFour.contains(name)){
							return true;
						}
						if(lib.characterPack.refresh&&lib.characterPack.refresh[name]){
							if(!lib.configOL.characterPack.contains('refresh')) return true;
							return false;
						}
						if(lib.characterPack.standard&&lib.characterPack.standard[name]){
							if(!lib.configOL.characterPack.contains('standard')) return true;
							if(lib.configOL.characterPack.contains('refresh')&&lib.characterPack.refresh['re_'+name]) return true;
							return false;
						}
						if(lib.characterPack.shenhua&&lib.characterPack.shenhua[name]){
							if(!lib.configOL.characterPack.contains('shenhua')) return true;
							return false;
						}
						if(lib.characterPack.sp&&lib.characterPack.sp[name]){
							if(!lib.configOL.characterPack.contains('sp')) return true;
							return false;
						}
						if(lib.characterPack.yijiang&&lib.characterPack.yijiang[name]){
							if(!lib.configOL.characterPack.contains('yijiang')) return true;
							return false;
						}
						return true;
					}
					event.flipassign=true;
					event.videoId=lib.status.videoId++;
					var func=function(filter,id,selected,map,choiceFour){
						lib.choiceFour=choiceFour;
						var dialog=ui.create.characterDialog('heightset',filter,'expandall').open();
						dialog.videoId=id;
						for(var i in map){
							var player=lib.playerOL[i];
							if(player){
								player.side=map[i][0];
								player.identity=map[i][1];
								player.setIdentity();
								player.node.identity.dataset.color=get.translation(player.side+'Color');
								if(player.identity=='zhu'){
									game[player.side+'Zhu']=player;
									player.isZhu=true;
								}
							}
						}
						ui.arena.classList.add('choose-character');
					};
					event.map=map;
					event.selected=[];
					game.broadcastAll(func,filterChoice,event.videoId,event.selected,map,lib.choiceFour);
					_status.onreconnect=[func,filterChoice,event.videoId,event.selected,map,lib.choiceFour];
					"step 1"
					game.broadcastAll(function(player){
						player.classList.add('selectedx');
					},event.current);
					event.current.chooseButton(true).set('filterButton',function(button){
						return !_status.event.selected.contains(button.link);
					}).set('ai',function(button){
						if(_status.event.player.identity=='zhu'){
							if(Math.random()<0.8){
								var info=lib.character[button.link];
								if(!info[4]||!info[4].contains('zhu')){
									return 0;
								}
							}
						}
						var seed=_status.event.seed;
						var rank=get.rank(button.link,true);
						if(seed>0.4){
							return (rank>=6)?Math.random():-Math.random();
						}
						else if(seed>0.1){
							return (rank>=4&&rank<6)?Math.random():-Math.random();
						}
						else{
							return (rank<4)?Math.random():-Math.random();
						}
					}).set('selected',_status.event.selected).set('dialog',event.videoId).set('seed',Math.random());
					"step 2"
					event.selected.push(result.links[0]);
					game.broadcastAll(function(player,name,zhu){
						player.classList.remove('selectedx');
						player.init(name);
						if(player.node.name_seat){
							player.node.name_seat.remove();
						}
					},event.current,result.links[0]);
					if(event.current.identity=='zhu'){
						event.current.hp++;
						event.current.maxHp++;
						event.current.update();
					}
					event.current.classList.remove('selectedx');
					for(var i=0;i<game.players.length;i++){
						if(!game.players[i].name) break;
					}
					if(i<game.players.length){
						var side=event.current.side;
						event.current=_status.firstAct.next;
						if(event.flipassign){
							for(var iwhile=0;iwhile<8;iwhile++){
								event.current=event.current.next;
								if(event.current.side!=side&&!event.current.name){
									break;
								}
							}
						}
						else{
							for(var iwhile=0;iwhile<8;iwhile++){
								event.current=event.current.previous;
								if(event.current.side==side&&!event.current.name){
									break;
								}
							}
						}
						event.flipassign=!event.flipassign;
						event.goto(1);
					}
					"step 3"
					_status.onreconnect=[function(){
						for(var i=0;i<game.players.length;i++){
							var player=game.players[i];
							if(player.identity=='zhu'){
								game[player.side+'Zhu']=player;
								player.isZhu=true;
							}
						}
					}]
					game.broadcastAll(function(id){
						var dialog=get.idDialog(id);
						if(dialog){
							dialog.close();
						}
						setTimeout(function(){
							ui.arena.classList.remove('choose-character');
						},500);
					},event.videoId);
				});
			},
			chooseCharacterOL3:function(){
				var next=game.createEvent('chooseCharacterOL',false);
				next.setContent(function(){
					'step 0'
					game.additionaldead=[];
					game.broadcastAll(function(ref,bool){
						ui.arena.classList.add('choose-character');
						for(var i=0;i<6;i++){
							ref.side=bool;
							ref=ref.next;
							bool=!bool;
						}
						for(var i=0;i<game.players.length;i++){
							if(game.players[i].side==game.me.side){
								game.players[i].node.identity.firstChild.innerHTML='友';
							}
							else{
								game.players[i].node.identity.firstChild.innerHTML='敌';
							}
							game.players[i].node.identity.dataset.color=game.players[i].side+'zhu';
						}
					},game.players[0],Math.random()<0.5);
					if(game.me.side==undefined){
						game.me.side=game.players[0].side;
					}
					_status.onreconnect=[function(){
						var players=game.players.concat(game.dead);
						for(var i=0;i<players.length;i++){
							if(players[i].side==game.me.side){
								players[i].node.identity.firstChild.innerHTML='友';
							}
							else{
								players[i].node.identity.firstChild.innerHTML='敌';
							}
						}
					}];
					var list=get.charactersOL();
					var choose=[];
					event.list=list;
					for(var i=0;i<game.players.length;i++){
						choose.push([game.players[i],['选择出场和备用武将',[list.randomRemove(5),'character']],2,true]);
					}
					game.me.chooseButtonOL(choose,function(player,result){
						if(game.online||player==game.me) player.init(result.links[0]);
					});
					'step 1'
					for(var i in result){
						if(result[i]=='ai'){
							result[i]=event.list.randomRemove(2);
						}
						else{
							result[i]=result[i].links;
						}
					}
					game.broadcastAll(function(result,func1,func2){
						setTimeout(function(){
							ui.arena.classList.remove('choose-character');
						},500)
						_status.friendDied=[];
						_status.enemyDied=[];

						_status.friend=[];
						_status.enemy=[];

						_status.enemyCount=ui.create.system('杀敌: '+get.cnNumber(0,true),null,true);
						_status.friendCount=ui.create.system('阵亡: '+get.cnNumber(0,true),null,true);

						lib.setPopped(_status.friendCount,func1);
						lib.setPopped(_status.enemyCount,func2);

						for(var i in result){
							if(!lib.playerOL[i].name){
								lib.playerOL[i].init(result[i][0]);
							}
							if(lib.playerOL[i].side==game.me.side){
								_status.friend.push(result[i][1]);
							}
							else{
								_status.enemy.push(result[i][1]);
							}
						}
					},result,game.versusHoverFriend,game.versusHoverEnemy);
					_status.onreconnect=[function(list1,list2,list3,list4,side,func1,func2){
						if(side!=game.me.side){
							var tmp;
							tmp=list1;
							list1=list2;
							list2=tmp;
							tmp=list3;
							list3=list4;
							list4=tmp;
						}
						_status.friendDied=list1;
						_status.enemyDied=list2;

						_status.friend=list3;
						_status.enemy=list4;

						_status.enemyCount=ui.create.system('杀敌: '+get.cnNumber(_status.enemyDied.length,true),null,true);
						_status.friendCount=ui.create.system('阵亡: '+get.cnNumber(_status.friendDied.length,true),null,true);

						lib.setPopped(_status.friendCount,func1);
						lib.setPopped(_status.enemyCount,func2);

						for(var i=0;i<game.players.length;i++){
							if(game.players[i].side==game.me.side){
								game.players[i].node.identity.firstChild.innerHTML='友';
							}
							else{
								game.players[i].node.identity.firstChild.innerHTML='敌';
							}
						}
					},_status.friendDied,_status.enemyDied,
						_status.friend,_status.enemy,game.me.side,
						game.versusHoverFriend,game.versusHoverEnemy];
				});
			},
			chooseCharacterOL2:function(){
				var next=game.createEvent('chooseCharacterOL',false);
				next.setContent(function(){
					'step 0'
					game.broadcastAll(function(ref,bool,bool2){
						ref.side=bool;
						ref.next.side=bool2;
						ref.next.next.side=!bool;
						ref.previous.side=!bool2;
						for(var i=0;i<game.players.length;i++){
							if(game.players[i].side==game.me.side){
								game.players[i].node.identity.firstChild.innerHTML='友';
							}
							else{
								game.players[i].node.identity.firstChild.innerHTML='敌';
							}
							game.players[i].node.identity.dataset.color=game.players[i].side+'zhu';
						}
						ui.arena.classList.add('choose-character');
					},game.players[0],Math.random()<0.5,Math.random()<0.5);
					_status.onreconnect=[function(){
						var players=game.players.concat(game.dead);
						for(var i=0;i<players.length;i++){
							if(players[i].side==game.me.side){
								players[i].node.identity.firstChild.innerHTML='友';
							}
							else{
								players[i].node.identity.firstChild.innerHTML='敌';
							}
						}
					}];
					var firstChoose=game.players.randomGet();
					if(firstChoose.next.side==firstChoose.side){
						firstChoose=firstChoose.next;
					}
					_status.firstChoose=firstChoose;
					var list=get.charactersOL();
					var choose=[];
					event.list=list;
					for(var i=0;i<game.players.length;i++){
						var str = '选择角色（'+lib.translate['unknown'+get.distance(firstChoose, game.players[i],'absolute')]+'）';
						if(lib.configOL.free_choose){
							if (game.players[i].nickname || player == game.me){
								choose.push([game.players[i],[str,[list,'character']],true]);
							} else {
								choose.push([game.players[i],[str,[list.randomGets(7),'character']],true]);
							}
						} else {
							choose.push([game.players[i],[str,[list.randomRemove(7),'character']],true]);
						}
					}
					game.me.chooseButtonOL(choose,function(player,result){
						if(game.online||player==game.me) player.init(result.links[0]);
					});
					'step 1'
					for(var i in result){
						if(result[i]=='ai'){
							result[i]=event.list.randomRemove();
						}
						else{
							result[i]=result[i].links[0];
						}
						if(!lib.playerOL[i].name){
							lib.playerOL[i].init(result[i]);
						}
					}
					game.broadcast(function(result){
						for(var i in result){
							if(!lib.playerOL[i].name){
								lib.playerOL[i].init(result[i]);
							}
						}
						setTimeout(function(){
							ui.arena.classList.remove('choose-character');
						},500)
					},result);
					setTimeout(function(){
						ui.arena.classList.remove('choose-character');
					},500)
				});
			},
			chooseCharacterOL1:function(){
				var next=game.createEvent('chooseCharacterOL',false);
				next.setContent(function(){
					'step 0'
					game.additionaldead=[];
					var list=get.charactersOL();
					list=list.randomGets(parseInt(lib.configOL.choice_num));
					event.videoId=lib.status.videoId++;
					if(Math.random()<0.5){
						event.choosing=game.players[0];
					}
					else{
						event.choosing=game.players[1];
					}
					var createDialog=function(list,id,list1,list2){
						var dialog=ui.create.dialog('选择角色',[list,'character']);
						dialog.classList.add('fullwidth');
						dialog.classList.add('fullheight');
						dialog.classList.add('noslide');
						dialog.classList.add('fixed');
						dialog.videoId=id;
						if(list2&&list2){
							ui.arena.classList.add('playerhidden');
							for(var i=0;i<dialog.buttons.length;i++){
								var button=dialog.buttons[i];
								if(list1.contains(button.link)){
									button.classList.add('selectedx');
								}
								else if(list2.contains(button.link)){
									button.classList.add('glow');
								}
							}
						}
						else{
							if(list1!=game.me){
								dialog.content.firstChild.innerHTML='等待对手选择';
							}
						}
					};
					game.broadcastAll(createDialog,list,event.videoId,event.choosing);
					game.players[0].storage.versuslist=[];
					game.players[1].storage.versuslist=[];
					event.selected=[];
					_status.firstChoose=event.choosing;
					event.num=(parseInt(lib.configOL.replace_number)+1)*2;
					_status.onreconnect=[createDialog,list,event.videoId,
						_status.firstChoose.storage.versuslist,
						_status.firstChoose.next.storage.versuslist];
					game.broadcastAll(function(player){
						player.setIdentity('truezhu');
						player.next.setIdentity('falsezhu');
					},_status.firstChoose);
					'step 1'
					var next=event.choosing.chooseButton(event.videoId,1,true);
					next.set('filterButton',function(button){
						if(_status.event.selected.contains(button.link)) return false;
						return true;
					});
					next.set('selected',event.selected);
					next.set('ai',function(){
						return Math.random();
					});
					'step 2'
					event.choosing.storage.versuslist.push(result.links[0]);
					game.broadcastAll(function(link,choosing,first,id){
						var dialog=get.idDialog(id);
						if(dialog){
							if(choosing==game.me){
								choosing='你';
							}
							else{
								choosing='对手';
							}
							dialog.content.firstChild.innerHTML=choosing+'选择了'+get.translation(link);
							for(var i=0;i<dialog.buttons.length;i++){
								if(dialog.buttons[i].link==link){
									if(first){
										dialog.buttons[i].classList.add('selectedx');
									}
									else{
										dialog.buttons[i].classList.add('glow');
									}
								}
							}
						}
					},result.links[0],event.choosing,event.choosing==_status.firstChoose,event.videoId);
					event.selected.push(result.links[0]);
					event.choosing=event.choosing.next;
					event.num--;
					if(event.num){
						event.goto(1);
					}
					'step 3'
					game.delay(2)
					'step 4'
					game.broadcastAll(function(id){
						ui.arena.classList.remove('playerhidden');
						var dialog=get.idDialog(id);
						if(dialog){
							dialog.close();
						}
					},event.videoId);

					_status.friendDied=[];
					_status.enemyDied=[];

					_status.friend=game.players[0].storage.versuslist;
					_status.enemy=game.players[1].storage.versuslist;

					delete game.players[0].storage.versuslist;
					delete game.players[1].versuslist;

					_status.enemyCount=ui.create.system('杀敌: '+get.cnNumber(0,true),null,true);
					_status.friendCount=ui.create.system('阵亡: '+get.cnNumber(0,true),null,true);

					lib.setPopped(_status.friendCount,game.versusHoverFriend);
					lib.setPopped(_status.enemyCount,game.versusHoverEnemy);

					game.me.side=true;
					game.players[0].side=true;
					game.players[1].side=false;

					var func=function(list1,list2,list3,list4,func1,func2,playerid){
						if(game.me.playerid==playerid){
							game.me.side=true;
							game.me.next.side=false;
						}
						else{
							game.me.side=false;
							game.me.next.side=true;
						}

						if(game.me.side){
							_status.enemyDied=list1;
							_status.friendDied=list2;

							_status.enemy=list3;
							_status.friend=list4;
						}
						else{
							_status.friendDied=list1;
							_status.enemyDied=list2;

							_status.friend=list3;
							_status.enemy=list4;
						}

						_status.enemyCount=ui.create.system('杀敌: '+get.cnNumber(_status.enemyDied.length,true),null,true);
						_status.friendCount=ui.create.system('阵亡: '+get.cnNumber(_status.friendDied.length,true),null,true);

						lib.setPopped(_status.friendCount,func1);
						lib.setPopped(_status.enemyCount,func2);
					};
					_status.onreconnect=[func,_status.enemyDied,_status.friendDied,
						_status.enemy,_status.friend,game.versusHoverFriend,game.versusHoverEnemy,game.players[0].playerid];
					game.broadcast(func,_status.enemyDied,_status.friendDied,
						_status.enemy,_status.friend,game.versusHoverFriend,game.versusHoverEnemy,game.players[0].playerid);

					var list=[[game.players[0],['选择出场角色',[_status.friend,'character']]],[game.players[1],['选择出场角色',[_status.enemy,'character']]]];
					game.me.chooseButtonOL(list,function(player,result){
						if(game.online||player==game.me) player.init(result.links[0]);
					});
					'step 5'
					var result1;
					var friend=result[game.players[0].playerid];
					if(friend&&friend.links&&friend.links.length){
						result1=friend.links[0];
					}
					else{
						result1=_status.friend.randomGet();
					}
					var result2;
					var enemy=result[game.players[1].playerid];
					if(enemy&&enemy.links&&enemy.links.length){
						result2=enemy.links[0];
					}
					else{
						result2=_status.enemy.randomGet();
					}
					if(!game.players[0].name) game.players[0].init(result1);
					if(!game.players[1].name) game.players[1].init(result2);
					_status.friend.remove(result1);
					_status.enemy.remove(result2);
					game.broadcast(function(result1,result2){
						if(game.me.side){
							if(!game.me.name) game.me.init(result1);
							if(!game.me.next.name) game.me.next.init(result2);
							_status.friend.remove(result1);
							_status.enemy.remove(result2);
						}
						else{
							if(!game.me.name) game.me.init(result2);
							if(!game.me.next.name) game.me.next.init(result1);
							_status.friend.remove(result2);
							_status.enemy.remove(result1);
						}
					},result1,result2);
				});
			},
			phaseLoopThree:function(player){
				var next=game.createEvent('phaseLoop');
				next.player=player;
				next.swap=function(player){
					if(player.side==game.me.side){
						return game.enemyZhu;
					}
					else{
						return game.me;
					}
				};
				next.setContent(function(){
					'step 0'
					player.classList.add('acted');
					player.phase();
					'step 1'
					if(player.identity!='zhu'){
						for(var i=0;i<game.players.length;i++){
							if(game.players[i].side==player.side&&game.players[i].identity!='zhu'&&
								game.players[i]!=player&&!game.players[i].classList.contains('acted')){
								game.players[i].classList.add('acted');
								game.players[i].phase();
								break;
							}
						}
					}
					'step 2'
					var target=event.swap(player);
					var swap=[],swap2=[];
					for(var i=0;i<game.players.length;i++){
						if(game.players[i].isOut()) continue;
						if(!game.players[i].classList.contains('acted')){
							if(game.players[i].side==target.side){
								swap.push(game.players[i]);
							}
							else{
								swap2.push(game.players[i]);
							}
						}
					}
					if(swap.length==0){
						if(swap2.length){
							target=event.swap(target);
							swap=swap2;
						}
						else{
							for(var i=0;i<game.players.length;i++){
								if(game.players[i].isOut()) continue;
								game.players[i].classList.remove('acted');
							}
							delete _status.roundStart;
							event.redo();
							game.delay();
							return;
						}
					}
					if(swap.length==1){
						event.directresult=swap[0];
					}
					else{
						var rand=Math.random();
						var next=target.chooseTarget('选择行动的角色',true,function(card,player,target2){
							return target2.side==target.side&&!target2.classList.contains('acted');
						});
						next._triggered=null;
						next.includeOut=true;
						next.ai=function(target2){
							var num=0;
							if(target2.countCards('j')){
								num-=5;
							}
							if(target2.identity!='zhu'){
								for(var i=0;i<game.players.length;i++){
									if(game.players[i].identity!='zhu'&&game.players[i]!=target2&&
									game.players[i].side==target2.side&&game.players[i].countCards('j')){
										num-=2;
									}
								}
							}
							if(rand<1/3){
								num+=1/(target2.hp+1);
							}
							else if(rand<2/3){
								num+=target2.countCards('h')/5;
							}
							return num;
						}
					}
					'step 3'
					if(event.directresult){
						event.player=event.directresult;
						delete event.directresult;
					}
					else if(result.bool){
						event.player=result.targets[0];
					}
					event.goto(0);
				});
			},
			versusPhaseLoop:function(player){
				var next=game.createEvent('phaseLoop');
				next.player=player;
				next.setContent(function(){
					"step 0"
					if(lib.storage.zhu){
						player.classList.add('acted');
					}
					player.phase();
					"step 1"
					if(lib.storage.zhu){
						_status.currentSide=!_status.currentSide;
						_status.round++;
						if(_status.round>=2*Math.max(game.friend.length,game.enemy.length)){
							_status.round=0;
							for(var i=0;i<game.players.length;i++){
								game.players[i].classList.remove('acted');
							}
							delete _status.roundStart;
						}
						var list=(_status.currentSide==game.me.side)?game.friend.slice(0):game.enemy.slice(0);
						for(var i=0;i<list.length;i++){
							if(list[i].classList.contains('acted')||list[i].isOut()){
								list.splice(i,1);i--;
							}
						}
						if(list.length==0) event.redo();
						else if(list.length==1||(game.me!=game.friendZhu&&!lib.storage.single_control)||_status.currentSide!=game.me.side){
							list.sort(function(a,b){
								if(a.countCards('j')>b.countCards('j')) return 1;
								return a.hp-b.hp;
							})
							event.player=list[0];
							event.goto(0);
						}
						else{
							game.me.chooseTarget('选择要行动的角色',true,function(card,player,target){
								return (target.classList.contains('acted')==false&&target.side==game.me.side);
							}).includeOut=true;
						}
					}
					else{
						event.player=event.player.next;
						event.goto(0);
					}
					"step 2"
					event.player=result.targets[0];
					event.goto(0);
				});
			},
			replacePlayerOL:function(player){
				var next=game.createEvent('replacePlayer');
				next.source=player;
				next.setContent('replacePlayerOL');
			},
			replacePlayer:function(player){
				var next=game.createEvent('replacePlayer');
				next.source=player;
				next.setContent('replacePlayer');
			},
			replacePlayerTwo:function(player,character){
				var next=game.createEvent('replacePlayerTwo');
				next.source=player;
				next.character=character;
				next.setContent('replacePlayerTwo');
			},
			versusClickToSwap:function(e){
				if(_status.dragged) return;
				if(this.link==game.me){
					if(!this.classList.contains('buttonclick')){
						this.animate('buttonclick');
					}
				}
				else if(_status.event.player==game.me&&!_status.auto){
					game.me.popup('请稍后再换人');
					e.stopPropagation();
				}
				else{
					game.modeSwapPlayer(this.link);
				}
			},
			versusHoverEnemy:function(){
				var uiintro=ui.create.dialog('hidden');

				if(_status.enemyDied.length){
					uiintro.add('已阵亡');
					uiintro.add([_status.enemyDied,'character']);
				}

				uiintro.add('未上场');
				if(_status.enemy.length){
					uiintro.add([_status.enemy,'character']);
				}
				else{
					uiintro.add('（无）')
				}

				return uiintro;
			},
			versusHoverFriend:function(){
				var uiintro=ui.create.dialog('hidden');

				if(_status.friendDied.length){
					uiintro.add('已阵亡');
					uiintro.add([_status.friendDied,'character']);
				}

				uiintro.add('未上场');
				if(_status.friend.length){
					uiintro.add([_status.friend,'character']);
				}
				else{
					uiintro.add('（无）')
				}

				return uiintro;
			},
			versusHoverHandcards:function(){
				var uiintro=ui.create.dialog('hidden');
				var added=false;
				for(var i=0;i<game.players.length;i++){
					if(game.players[i].name&&game.players[i].side==game.me.side&&game.players[i]!=game.me){
						added=true;
						uiintro.add(get.translation(game.players[i]));
						var cards=game.players[i].getCards('h');
						if(cards.length){
							uiintro.addSmall(cards,true);
						}
						else{
							uiintro.add('（无）');
						}
					}
				}
				if(added) return uiintro;
			},
			versusCheckEnemy:function(){
				_status.clicked=true;
				if(ui.intro){
					ui.intro.close();
					if(ui.intro.source=='versusCheckEnemy'){
						delete ui.intro;
						ui.control.show();
						game.resume2();
						return;
					}
				}
				game.pause2();
				ui.control.hide();
				ui.intro=ui.create.dialog();
				ui.intro.source='versusCheckEnemy';

				if(_status.enemyDied.length){
					ui.intro.add('已阵亡');
					ui.intro.add([_status.enemyDied,'character']);
				}

				ui.intro.add('未上场');
				if(_status.enemy.length){
					ui.intro.add([_status.enemy,'character']);
				}
				else{
					ui.intro.add('（无）')
				}
			},
			versusCheckFriend:function(){
				_status.clicked=true;
				if(ui.intro){
					ui.intro.close();
					if(ui.intro.source=='versusCheckFriend'){
						delete ui.intro;
						ui.control.show();
						game.resume2();
						return;
					}
				}
				game.pause2();
				ui.control.hide();
				ui.intro=ui.create.dialog();
				ui.intro.source='versusCheckFriend';




				if(_status.friendDied.length){
					ui.intro.add('已阵亡');
					ui.intro.add([_status.friendDied,'character']);
				}

				ui.intro.add('未上场');
				if(_status.friend.length){
					ui.intro.add([_status.friend,'character']);
				}
				else{
					ui.intro.add('（无）')
				}
			},
			versusSwapPlayer:function(){
				if(ui.intro){
					ui.intro.close();
					if(ui.intro.source=='versusSwapPlayer'){
						delete ui.intro;
						ui.control.show();
						game.resume2();
						return;
					}
				}
				if((_status.event.player==game.me&&_status.paused)||_status.paused2){
					game.me.popup('请稍后再换人');
				}
				else{
					_status.clicked=true;
					if(ui.intro){
						ui.intro.close();
						if(ui.intro.source==this.parentNode){
							delete ui.intro;
							ui.control.show();
							game.resume2();
							return;
						}
					}
					game.pause2();
					ui.control.hide();
					ui.intro=ui.create.dialog();
					ui.intro.source='versusSwapPlayer';
					var players=[];
					for(var i=0;i<game.players.length;i++){
						if(game.players[i].side==game.me.side&&game.players[i]!=game.me){
							players.push(game.players[i]);
						}
					}
					ui.intro.add(players,true);
					var buttons=ui.intro.querySelectorAll('.button');
					for(var i=0;i<buttons.length;i++){
						buttons[i].addEventListener(lib.config.touchscreen?'touchend':'click',game.versusClickToSwap);
					}
				}
			},
			switchAutoreplace:function(e){
				e.stopPropagation();
				this.classList.toggle('on');
				game.save('autoreplaceinnerhtml',this.classList.contains('on'));
			},
			onSwapControl:function(){
				game.addVideo('onSwapControl');
				var name=game.me.name;
				if(ui.fakeme&&ui.fakeme.current!=name){
					ui.fakeme.current=name;
					if(ui.versushighlight&&ui.versushighlight!=game.me){
						ui.versushighlight.classList.remove('current_action');
					}
					ui.versushighlight=game.me;
					game.me.classList.add('current_action');

					ui.fakeme.style.backgroundImage=game.me.node.avatar.style.backgroundImage;
				}
			},
			modeSwapPlayer:function(player){
				if(_status.mode=='three'||(_status.mode=='standard'&&lib.storage.single_control)){
					game.swapControl(player);
					game.onSwapControl();
				}
				else{
					game.swapPlayer(player);
				}
			},
			updateLineMe:function(opacity,player){
				if(!player){
					player=game.me;
				}
				ui.lineme.width=ui.window.offsetWidth;
				ui.lineme.height=ui.window.offsetHeight;

				var ctx=ui.linemectx;
				ctx.shadowBlur=5;
				ctx.shadowColor='rgba(0,0,0,0.3)';
				ctx.fillStyle='white';
				if(typeof opacity!='number'){
					opacity=0.5;
				}
				ctx.strokeStyle='rgba(255,255,255,'+opacity+')';
				ctx.lineWidth=3;
				ctx.setLineDash([8,2]);

				ctx.beginPath();

				var startx,endx,pos;
				var endy=game.me.offsetHeight/2+game.me.offsetTop+ui.arena.offsetTop;
				var starty=ui.me.offsetTop+ui.arena.offsetTop+ui.me.offsetHeight/2;
				if(game.me.offsetLeft+game.me.offsetWidth/2<=ui.arena.offsetWidth/2){
					startx=ui.me.offsetLeft+ui.arena.offsetLeft;
					endx=game.me.offsetLeft+ui.arena.offsetLeft;
					pos=-1;
				}
				else{
					startx=ui.me.offsetLeft+ui.arena.offsetLeft+ui.me.offsetWidth;
					endx=game.me.offsetWidth+game.me.offsetLeft+ui.arena.offsetLeft;
					pos=1;
				}
				ctx.moveTo(startx,starty);
				startx+=pos*ui.arena.offsetLeft/2;
				ctx.quadraticCurveTo(startx,starty,startx,starty-(starty-endy)/2);
				ctx.quadraticCurveTo(startx,endy,endx,endy);
				ctx.stroke();
			},
		},
		choiceThree:[

		],
		choiceFour:[

		],
		translate:{
			zhu:'主',
			zhong:'忠',
			truezhu:"帅",
			falsezhu:"将",
			trueZhu:"帅",
			falseZhu:"将",
			trueZhong:"兵",
			falseZhong:"卒",
			trueColor:"zhu",
			falseColor:"wei",
			
			zhu2:'主公',
			zhong2:'忠臣',
			truezhu:'主帅',
			falsezhu:'大将',
			trueZhong:'大兵',
			falseZhong:'小卒',
			zhu_win:'<u>胜利条件：</u>所有自机与路人坠机',
			zhu_lose:'<u>失败条件：</u>黑幕坠机',
			zhong_win:'<u>胜利条件：</u>黑幕胜利',
			zhong_lose:'<u>失败条件：</u>黑幕坠机',
			fan_win:'<u>胜利条件：</u>黑幕坠机',
			fan_lose:'<u>失败条件：</u>所有自机与路人坠机',
			nei_win:'<u>胜利条件：</u>所有其他角色坠机',
			nei_lose:'<u>失败条件：</u>你坠机',
			
			versus_zhu_config:'启用主将',
			versus_only_zhu_config:'只当主将',
			versus_main_zhu_config:'主将死亡后结束',
			versus_assign_enemy_config:'指定对手',
			versus_cross_seat_config:'交叉座位',
			versus_random_seat_config:'随机座位',
			versus_noreplace_end_config:'无替补时结束',
			versus_single_control_config:'单人控制',
			seat_order_config:'座位排列',
			versus_first_less_config:'先手少摸牌',
			versus_reward_config:'杀敌摸牌',
			versus_punish_config:'杀死队友',
			versus_number_config:'对阵人数',
			replace_number_config:'替补人数',
			choice_config:'候选人数',

		},
		skill:{
		},
		card:{
		},
		element:{
			content:{
				replacePlayer:function(){
					"step 0"
					var list=(source.side==game.me.side)?_status.friend:_status.enemy;
					if(list.length==0){
						// if(game.friend.contains(source)){
						// 	game.over(false);
						// }
						// else{
						// 	game.over(true);
						// }
						game.friend.remove(source);
						game.enemy.remove(source);
						if(game.friend.length==0) game.over(false);
						else if(game.enemy.length==0) game.over(true);
						if(game.friendZhu&&game.friendZhu.classList.contains('dead')&&game.friend.length){
							game.friendZhu=game.friend[0];
							game.friendZhu.setIdentity(_status.color+'Zhu');
						}
						if(game.enemyZhu&&game.enemyZhu.classList.contains('dead')&&game.enemy.length){
							game.enemyZhu=game.enemy[0];
							game.enemyZhu.setIdentity(!_status.color+'Zhu');
						}
						event.finish();
						return;
					}
					if(source.side==game.me.side&&list.length>1&&(game.me==game.friendZhu||(lib.storage.zhu&&lib.storage.single_control))&&
						!_status.auto){
						event.dialog=ui.create.dialog('选择替补角色',[list,'character']);
						event.filterButton=function(){return true;};
						event.player=game.me;
						event.forced=true;
						event.custom.replace.confirm=function(){
							event.character=ui.selected.buttons[0].link;
							event.dialog.close();
							if(ui.confirm) ui.confirm.close();
							delete event.player;
							game.resume();
						}
						game.check();
						game.pause();
					}
					else{
						event.character=list[Math.floor(Math.random()*list.length)];
					}
					"step 1"
					game.uncheck();
					_status.friend.remove(event.character);
					_status.enemy.remove(event.character);
					source.revive(null,false);
					game.additionaldead.push({
						name:source.name,
						stat:source.stat
					});
					game.addVideo('reinit',source,[event.character,get.translation(source.side+'Color')]);
					source.uninit();
					source.init(event.character);
					game.log(source,'出场');
					source.node.identity.dataset.color=get.translation(source.side+'Color');
					source.draw(4);
					_status.event.parent.parent.parent.untrigger(false,source);
					var evt=_status.event.parent.parent.parent;
					for(var i=0;i<100;i++){
						evt=evt.parent;
						if(evt.player==source){
							evt.finish();
						}
						if(evt.name=='phase'){
							break;
						}
					}
					if(lib.storage.single_control){
						game.onSwapControl();
					}
					game.triggerEnter(source);
					"step 2"
					// if(_status.currentPhase==source){
					// 	source.skip('phase');
					// }
				},
				replacePlayerTwo:function(){
					'step 0'
					game.delay();
					'step 1'
					source.revive(null,false);
					game.additionaldead.push({
						name:source.name,
						stat:source.stat
					});
					game.addVideo('reinit',source,[event.character,get.translation(source.side+'Color')]);
					source.uninit();
					source.init(event.character);
					game.log(source,'出场');
					// source.node.identity.dataset.color=source.side+'zhu';
					source.draw(4);
					_status.event.parent.parent.parent.untrigger(false,source);
					var evt=_status.event.parent.parent.parent;
					for(var i=0;i<100;i++){
						evt=evt.parent;
						if(evt.player==source){
							evt.finish();
						}
						if(evt.name=='phase'){
							break;
						}
					}
					game.triggerEnter(source);
				},
				replacePlayerOL:function(){
					'step 0'
					game.delay();
					'step 1'
					if(event.source.side==game.me.side){
						if(_status.friend.length==1){
							event.directresult=_status.friend[0];
						}
						else if(event.source==game.me){
							if(_status.auto){
								event.directresult=_status.friend.randomGet();
							}
						}
						else{
							if(!event.source.isOnline()){
								event.directresult=_status.friend.randomGet();
							}
						}
					}
					else{
						if(_status.enemy.length==1){
							event.directresult=_status.enemy[0];
						}
						else{
							if(!event.source.isOnline()){
								event.directresult=_status.enemy.randomGet();
							}
						}
					}
					if(!event.directresult){
						if(event.source==game.me){
							event.dialog=ui.create.dialog('选择替补角色',[_status.friend,'character']);
							event.filterButton=function(){return true};
							event.player=game.me;
							event.forced=true;
							event.custom.replace.confirm=function(){
								event.directresult=ui.selected.buttons[0].link;
								event.dialog.close();
								if(ui.confirm) ui.confirm.close();
								delete event.player;
								game.resume();
							}
							event.switchToAuto=function(){
								event.directresult=_status.friend.randomGet();
								event.dialog.close();
								if(ui.confirm) ui.confirm.close();
								delete event.player;
							};
							game.check();
							game.pause();
						}
						else{
							event.source.send(function(player){
								if(_status.auto){
									_status.event._result=_status.friend.randomGet();
								}
								else{
									var next=game.createEvent('replacePlayer');
									next.source=player;
									next.setContent(function(){
										event.dialog=ui.create.dialog('选择替补角色',[_status.friend,'character']);
										event.filterButton=function(){return true};
										event.player=event.source;
										event.forced=true;
										event.custom.replace.confirm=function(){
											event.result=ui.selected.buttons[0].link;
											event.dialog.close();
											if(ui.confirm) ui.confirm.close();
											delete event.player;
											game.resume();
											game.uncheck();
										}
										event.switchToAuto=function(){
											event.result=_status.friend.randomGet();
											event.dialog.close();
											if(ui.confirm) ui.confirm.close();
											delete event.player;
											game.uncheck();
										};
										game.check();
										game.pause();
									});
								}
								game.resume();
							},event.source);
							event.source.wait();
							game.pause();
						}
					}
					'step 2'
					game.uncheck();
					if(!event.directresult){
						if(event.resultOL){
							event.directresult=event.resultOL[source.playerid];
						}
						if(!event.directresult||event.directresult=='ai'){
							if(source.side==game.me.side){
								event.directresult=_status.friend.randomGet();
							}
							else{
								event.directresult=_status.enemy.randomGet();
							}
						}
					}
					var name=event.directresult;
					var color=source.node.identity.dataset.color;
					game.additionaldead.push({
						name:source.name,
						stat:source.stat
					});

					game.broadcastAll(function(source,name,color){
						_status.friend.remove(name);
						_status.enemy.remove(name);
						source.revive(null,false);
						source.uninit();
						source.init(name);
						source.node.identity.dataset.color=color;
						if(source==game.me){
							ui.arena.classList.remove('selecting');
						}
					},source,name,color);
					game.log(source,'出场');

					source.draw(4);
					_status.event.parent.parent.parent.untrigger(false,source);
					game.addVideo('reinit',source,[name,color]);
					game.triggerEnter(source);
				},
			},
			player:{
				gainZhibao:function(num,source){
					if(source){
						if(num===true||num>source.storage.longchuanzhibao){
							num=source.storage.longchuanzhibao;
						}
					}
					else{
						if(typeof num!='number'){
							num=1;
						}
					}
					if(!num||typeof num!='number') return this;

					this.storage.longchuanzhibao+=num;
					this.updateMark('longchuanzhibao');

					if(source){
						source.storage.longchuanzhibao-=num;
						source.updateMark('longchuanzhibao');
						game.log(this,'从',source,'处获得了'+get.cnNumber(num)+'个','#y龙船至宝');
					}
					else{
						game.log(this,'获得了'+get.cnNumber(num)+'个','#y龙船至宝');
					}

					if(source&&source.side!=this.side){
						this.draw(num,'nodelay');
						var that=this;
						var friend=game.findPlayer(function(current){
							return current.side==that.side&&current!=that;
						});
						if(friend){
							friend.draw(num,'nodelay');
						}
					}

					var map={wei:0,shu:0,wu:0,qun:0};
					for(var i=0;i<game.players.length;i++){
						var current=game.players[i];
						map[current.side]+=current.storage.longchuanzhibao;
					}
					for(var i=0;i<game.players.length;i++){
						var current=game.players[i];
						if(map[current.side]>=4){
							current.classList.add('current_action');
						}
						else{
							current.classList.remove('current_action');
						}
					}
					return this;
				},
				dieAfter:function(source){
					if(_status.connectMode){
						if(_status.mode=='1v1'||_status.mode=='3v3'){
							game.broadcastAll(function(dead){
								if(dead.side==game.me.side){
									_status.friendDied.push(dead.name);
									_status.friendCount.innerHTML='阵亡: '+get.cnNumber(_status.friendDied.length,true);
								}
								else{
									_status.enemyDied.push(dead.name);
									_status.enemyCount.innerHTML='杀敌: '+get.cnNumber(_status.enemyDied.length,true);
								}
							},this);
							if(this.side==game.me.side){
								if(_status.friend.length==0){
									game.over(false);
									return;
								}
							}
							else{
								if(_status.enemy.length==0){
									game.over(true);
									return;
								}
							}
							game.replacePlayerOL(this);
						}
						else if(_status.mode=='2v2'){
							if(_status.replacetwo){
								// later ?
							}
							var friend;
							for(var i=0;i<game.players.length;i++){
								if(game.players[i].side==this.side){
									friend=game.players[i];break;
								}
							}
							if(friend){
								var next=game.createEvent('versusDraw');
								next.setContent(function(){
									'step 0'
									player.chooseBool('是否摸一张牌？');
									'step 1'
									if(result.bool){
										player.draw();
									}
								});
								next.player=friend;
							}
							else{
								game.over(this.side!=game.me.side);
							}
						}
						else if(_status.mode=='4v4'){
							if(this.identity=='zhu'){
								game.over(this.side!=game.me.side);
							}
							else{
								if(source){
									if(source.side==this.side){
										if(source.identity=='zhu'){
											source.discard(source.getCards('he'));
										}
									}
									else{
										var num1=0,num2=1;
										for(var i=0;i<game.players.length;i++){
											if(game.players[i].side==source.side){
												num1++;
											}
											else{
												num2++;
											}
										}
										source.draw(2+Math.max(0,num2-num1));
									}
								}
								var side1=[],side2=[];
								for(var i=0;i<game.players.length;i++){
									if(game.players[i].side){
										side1.push(game.players[i]);
									}
									else{
										side2.push(game.players[i]);
									}
								}
								if(side1.length==1){
									side1[0].showGiveup();
								}
								if(side2.length==1){
									side2[0].showGiveup();
								}
							}
							return;
						}
					}
					else{
						if(_status.mode=='four'){
							if(this.identity=='zhu'){
								game.over(this.side!=game.me.side);
							}
							else{
								if(source){
									if(source.side==this.side){
										if(source.identity=='zhu'){
											source.discard(source.getCards('he'));
										}
									}
									else{
										var num1=0,num2=1;
										for(var i=0;i<game.players.length;i++){
											if(game.players[i].side==source.side){
												num1++;
											}
											else{
												num2++;
											}
										}
										source.draw(2+Math.max(0,num2-num1));
									}
								}
								var side1=[],side2=[];
								for(var i=0;i<game.players.length;i++){
									if(game.players[i].side){
										side1.push(game.players[i]);
									}
									else{
										side2.push(game.players[i]);
									}
								}
								if(game.me.side){
									if(side1.length<=side2.length-2){
										game.me.showGiveup();
									}
								}
								else{
									if(side1.length>=side2.length+2){
										game.me.showGiveup();
									}
								}
							}
							return;
						}
						else if(_status.mode=='two'){
							var friend;
							for(var i=0;i<game.players.length;i++){
								if(game.players[i].side==this.side){
									friend=game.players[i];break;
								}
							}
							if(_status.replacetwo){
								if(this.replacetwo){
									if(source){
										if(source.side==this.side){
											var he=source.getCards('he');
											if(he.length){
												source.discard(he);
											}
										}
										else{
											source.draw(3);
										}
									}
									game.replacePlayerTwo(this,this.replacetwo);
									delete this.replacetwo;
								}
								else if(friend&&friend.replacetwo){
									if(source){
										if(source.side==this.side){
											var he=source.getCards('he');
											if(he.length){
												source.discard(he);
											}
										}
										else{
											source.draw(3);
										}
									}
									game.replacePlayerTwo(this,friend.replacetwo);
									delete friend.replacetwo;
								}
								else{
									game.over(this.side!=game.me.side);
								}
							}
							else{
								if(friend){
									var next=game.createEvent('versusDraw');
									next.setContent(function(){
										'step 0'
										player.chooseBool('是否摸一张牌？');
										'step 1'
										if(result.bool){
											player.draw();
										}
									});
									next.player=friend;
								}
								else{
									game.over(this.side!=game.me.side);
								}
							}
							return;
						}
						else if(_status.mode=='three'){
							if(this.identity=='zhu'){
								if(game.friend.contains(this)){
									game.over(false);
								}
								else{
									game.over(true);
								}
							}
							else{
								if(this==game.me){
									game.modeSwapPlayer(game.friendZhu);
								}
								game.friend.remove(this);
								game.enemy.remove(this);
								if(source){
									source.draw(2);
								}
							}
							return;
						}
						if(this.side==game.me.side){
							_status.friendDied.push(this.name);
							_status.friendCount.innerHTML='阵亡: '+get.cnNumber(_status.friendDied.length,true);
						}
						else{
							_status.enemyDied.push(this.name);
							_status.enemyCount.innerHTML='杀敌: '+get.cnNumber(_status.enemyDied.length,true);
						}

						var list=(this.side==game.me.side)?_status.friend:_status.enemy;
						if((list.length==0&&lib.storage.noreplace_end)||
						(lib.storage.zhu&&lib.storage.main_zhu&&this.identity=='zhu'&&game.players.length>2)){
							if(game.friend.contains(this)){
								game.over(false);
							}
							else{
								game.over(true);
							}
						}
						else if(game.friend.length==1&&this==game.friend[0]&&_status.friend.length==0){
							game.over(false);
						}
						else if(game.enemy.length==1&&this==game.enemy[0]&&_status.enemy.length==0){
							game.over(true);
						}
						else{
							if(source){
								if(source.side!=this.side){
									if(lib.storage.versus_reward){
										source.draw(lib.storage.versus_reward);
									}
								}
								else{
									if(lib.storage.versus_punish=='弃牌'){
										source.discard(source.getCards('he'));
									}
									else if(lib.storage.versus_punish=='摸牌'&&lib.storage.versus_reward){
										source.draw(lib.storage.versus_reward);
									}
								}
							}
							else{
								game.delay();
							}
							game.replacePlayer(this);
						}
					}
				}
			}
		},
		get:{
			rawAttitude:function(from,to){
				if(from.side==to.side){
					if(to.identity=='zhu'){
						if(_status.connectMode){
							if(_status.mode=='4v4') return 7;
						}
						else{
							if(lib.storage.main_zhu||_status.mode=='four') return 7;
						}
					}
					return 6;
				}
				else{
					if(to.identity=='zhu'){
						if(_status.connectMode){
							if(_status.mode=='4v4') return -10;
						}
						else{
							if(lib.storage.main_zhu||_status.mode=='four') return -10;
						}
					}
					return -6;
				}
			},
		},
		help:{
		}
	};
});
