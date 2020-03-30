game.import('character',function(lib,game,ui,get,ai,_status){
	return {
		name:'randomOL',
		connect:true,
		character:{
			homura:['female', '2', 3, ['time3', 'time', 'homuraworld']],
			diva:['female', '3', 3, ['duzou', 'lunwu', 'tiaoxian'], ['forbidai']],
			monika:['female', '2', 3, ['miaohui', 'kehua'], ['forbidai']],
		},
		characterIntro:{
			homura:'问题：如果你目睹你最喜欢的人死亡，要她死多少次你才会疯掉？<br><b>出自：魔法少女小圆 画师：Capura.L</b>',
			diva:'<br><b>出自：Date-A-Live! 画师：干物A太</b>',
			monika:'问题：如果其他人已经不再是人了，那对她们做多残忍的事情都是没问题的，对吧？<br><b>出自：心跳文学部 画师：はっく',
		},	   
		perfectPair:{
		},
		skill:{
			time:{
				forced:true,
				group:'time2',
				trigger:{global:'gameStart'},
				audio:2,
				intro:{
                    mark:function(dialog,content,player){
                        if(content&&content.length){
                            if(player==game.me||player.isUnderControl()){
                                dialog.addAuto(content);
                            }
                            else{
                                return '共有'+get.cnNumber(content.length)+'张';
                            }
                        }
                    },
                    content:function(content,player){
                        if(content&&content.length){
                            if(player==game.me||player.isUnderControl()){
                                return get.translation(content);
                            }
                            return '共有'+get.cnNumber(content.length)+'张';
                        }
                    }
                },
				filter:function(event, player){
					return lib.config.gameRecord.homura;
				},
				content:function(){
					player.storage.time = [];
					var sort ;
					for (var i = 0; i < lib.config.gameRecord.homura.length; i ++){
						var card = game.createCard(lib.config.gameRecord.homura[i]);
						sort=lib.config.sort_card(card);
						if(sort>1) player.storage.time.splice(0, 0, card);
						else player.storage.time.push(card);
					}
					player.syncStorage('time');
					player.markSkill('time');
				},
			},
			time2:{
				forced:true,
				audio:2,
				trigger:{player:'dieBegin'},
				filter:function(event,player){
					return player.storage.time;
				},
				content:function(){
					var homura = [];
					for (var i = 0; i < player.storage.time.length; i ++){
						homura.push({name:player.storage.time[i].name, suit:player.storage.time[i].suit, number:player.storage.time[i].number, nature:player.storage.time[i].nature, bonus:player.storage.time[i].bonus});	
					}
					lib.config.gameRecord.homura = homura;
					game.saveConfig('gameRecord',lib.config.gameRecord);
				},
			},
			time3:{
				enable:'phaseUse',
				usable:1,
				position:'he',
				filterCard:true,
				selectCard:[1,Infinity],
				discard:false,
				audio:2,
				group:'time4',
				prepare:function(cards, player, targets){
					player.lose(cards,ui.special)._triggered=null;
				},
				content:function(){
					if (!player.storage.time) player.storage.time = [];
					player.storage.time = player.storage.time.concat(cards);
					player.syncStorage('time');
					player.markSkill('time');
				},
				ai:{
					order:10,
					result:{
						player:1,
					}
				}
			},
			/*
			time4:{
				hiddenCard:function(player,name){
                    return name == 'shan';
                },
				enable:'chooseToUse',
				audio:2,
				filter:function(event,player){
					return player.storage.time && player.countCards('h') < player.hp;
				},
				content:function(){
					"step 0"
					player.chooseCardButton(player.storage.time,'选择一张牌加入手牌').ai=function(button){
						var val=get.value(button.link);
						if(val<0) return -10;
						if(player.skipList.contains('phaseUse')){
							return -val;
						}
						return val < 8;
					}
					"step 1"
					if (result.links){
						player.gain(result.links)._triggered=null;
						for(var i=0;i<result.links.length;i++){
							player.storage.time.remove(result.links[i]);
						}
						player.syncStorage('time');
					}
				},
				ai:{
					savable:true,
					order:2,
					result:{
						player:1,
					}
				},
			},
			*/
			time4:{
				enable:'chooseToUse',
				complexSelect:true,
				filter:function(event,player){
                    return player.storage.time && player.countCards('h') < player.hp;
                },
                chooseButton:{
                    dialog:function(event, player){
                        return ui.create.dialog([player.storage.time,'vcard']);
                    },
                    filter:function(button,player){
						return true;
					},
                    check:function(button){
                        var player=_status.event.player;
                        return get.value({name:button.link[2]}) >= 6;
                    },
                    backup:function(links,player){
                        return {
                            selectCard:0,
                            audio:2,
                            popname:true,
							content:function(event,player){
								var cards = event.getParent().getParent()._result.links;
								player.gain(cards);
								for(var i=0;i<cards.length;i++){
									player.storage.time.remove(cards[i]);
								}
								player.syncStorage('time');
								// 无可奈何的改法，以后希望可以有别的方法改
								event.getParent().getParent().goto(0);
  							},
							check:function(card){
								return get.value(card) < 7;
							},
                        }
                    },
                    /*prompt:function(links,player){
                        return '保存：选择一张牌获得';
                    },*/
                },
				hiddenCard:function(player,name){
                    return name == 'shan' || name == 'wuxie';
                },
				check:function(){
					return true;
				},
                ai:{
                	save:true,
                    order:5,
                    result:{
                        player:function(player){
                            return 1;
                        }
                    },
                    threaten:1,
                }
			},
			homuraworld:{
                audio:2,
                cost:1,
                roundi:true,
                spell:['homuraworld_skill'],
                trigger:{player:'phaseBegin'},
                filter:function(event,player){
                    return player.lili > lib.skill.homuraworld.cost;
                },
                content:function(){
                    player.loselili(lib.skill.homuraworld.cost);
                    player.turnOver();
                },
                check:function(event,player){
                    return player.lili > 3 && game.countPlayer(function(current){
                        return get.attitude(player, current) > 0 && current.hp == 1; 
                    });
                },
            },
            homuraworld_skill:{
                trigger:{global:'useCardToBegin'},
                usable:1,
                audio:2,
                filter:function(event,player){
                    if (event.player != _status.currentPhase) return false;
                    return get.subtype(event.card) == 'attack';
                },
                content:function(){
                    'step 0'
                    player.loselili();
                    trigger.cancel();
					if (get.itemtype(trigger.card)=='card'){
						if (!player.storage.time) player.storage.time = [];
						player.storage.time = player.storage.time.concat(trigger.card);
						player.syncStorage('time');
						player.markSkill('time');
					}
                },
                check:function(event,player){
                    return -get.attitude(player, event.player) && get.attitude(player, event.target) && event.target.hp < 3;
                },
                prompt:'要不要使用The World的力量？',
            },
			duzou:{
				enable:'phaseUse',
				usable:1,
				filterTarget:function(card,player,target){
					return target.countCards('h');
				},
				content:function(){
					"step 0"
					event.videoId=lib.status.videoId++;
					var cards=target.getCards('h');
					if(player.isOnline2()){
						player.send(function(cards,id){
							ui.create.dialog('独奏',cards).videoId=id;
						},cards,event.videoId);
					}
					event.dialog=ui.create.dialog('独奏',cards);
					event.dialog.videoId=event.videoId;
					if(!event.isMine()){
						event.dialog.style.display='none';
					}
					player.chooseButton(true).set('filterButton',function(button){
						return !target.storage.mingzhi || !target.storage.mingzhi.contains(button.link);
					}).set('dialog',event.videoId);
					"step 1"
					if(result.bool){
						event.card=result.links[0];
						target.mingzhiCard(event.card);
					}
					"step 2"
					if (target.lili == 0){
						game.log('回合结束后，',target,'执行一个由',player,'操作的出牌阶段');
						target.addSkill('duzou_extra');
					}
					if(player.isOnline2()){
						player.send('closeDialog',event.videoId);
					}
					event.dialog.close();
					event.finish();
				},
				ai:{
					threaten:1.5,
					result:{
						target:function(player,target){
							return -target.countCards('h');
						}
					},
					order:10,
					expose:0.4,
				},
			},
			duzou_extra:{
				direct:true,
				trigger:{global:'phaseAfter'},
				content:function(){/*
					if (trigger.player.name == 'diva'){
						game.swapPlayer(player);
						player.phaseUse();
					} else {
						game.swapPlayer();
						player.
					}
					*/
					'step 0'
					if (get.mode() == 'boss' || get.mode() == 'chess'){
						game.swapControl(player);
						game.onSwapControl();
					} else {
						game.swapPlayer(player);
					}
					player.phaseUse();
					'step 1'
					game.log('————————————————————');
					if (get.mode() == 'boss' || get.mode() == 'chess'){
						game.swapControl(trigger.player);
						game.onSwapControl();
					} else {
						game.swapPlayer(trigger.player);
					}
					player.removeSkill('duzou_extra'); 
				},
			},
			lunwu:{
				enable:'phaseUse',
				usable:1,
				filterCard:true,
				selectCard:1,
				discard:false,
				prepare:'give',
				filterTarget:function(card,player,target){
					return player!=target;
				},
				check:function(card){
					return 7-get.value(card);
				},
				content:function(){
					'step 0'
					target.gain(cards,player);
					target.mingzhiCard(cards[0]);
					'step 1'
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i ++){
						if (players[i] == player) continue;
						if (get.distance(target, players[i],'attack')<=1) players[i].damage('thunder'); 
					}
				},
				prompt2:'低音炮向谁发射呢？',
				ai:{
					order:function(skill,player){
						return 1;
					},
					result:{
						target:function(player,target){
							var nh=target.countCards('h');
							var np=player.countCards('h');
							if(player.hp==player.maxHp||player.countCards('h')<=1){
								if(nh>=np-1&&np<=player.hp) return 0;
							}
							return Math.max(1,5-nh);
						}
					},
					effect:{
						target:function(card,player,target){
							if(player==target&&get.type(card)=='equip'){
								if(player.countCards('e',{subtype:get.subtype(card)})){
									var players=game.filterPlayer();
									for(var i=0;i<players.length;i++){
										if(players[i]!=player&&get.attitude(player,players[i])>0){
											return 0.1;
										}
									}
								}
							}
						}
					},
				},
			},
			tiaoxian:{
				trigger:{global:'mingzhiCardAfter'},
				audio:2,
				filter:function(event, player){
					return true;
				},
				content:function(){
					var cards = trigger.cards;
					var red = false;
					var black = false;
					for (var i = 0; i < trigger.cards.length; i ++){
						if (get.color(trigger.cards[i]) == 'red'){
							red = true;
						}
						if (get.color(trigger.cards[i]) == 'black'){
							black = true;
						}
					}
					if (red == true){
						trigger.player.gainlili();
					}
					if (black == true){
						trigger.player.damage('thunder');
					}
				},
			},
			miaohui:{
				enable:'phaseUse',
				usable:1,
				audio:2,
				content:function(){
					game.pause();
					var list = ['game.me.draw()<br>你抽一张牌', 'game.me.gainlili()<br>你获得1点灵力','game.players[1].damage()<br>对下家造成1点弹幕伤害'];
					if (player.hp < player.maxHp) list.push('game.me.recover()<br>你回复1点体力');
					if (get.mode() == 'identity' || get.mode() == 'old_identity') list.push('game.players[1].setIdentity(game.players[1].identity)<br>展示下家的身份');
					if (get.mode() != 'identity') list.push('game.me.addIncident(game.createCard(\'scarlet\'))<br>你获得【红月】异变牌');
					if (Object.keys(lib.config.monika).length >= 5) list.push("lib.skill['miaohui'].usable = Infinity<br>【描绘】改为'一回合无限次'");
					if (Object.keys(lib.config.monika).length >= 10) list.push("game.removeCard('sha')<br>移除牌堆里的所有【轰！】");
					if (Object.keys(lib.config.monika).length >= 15) list.push('game.me.insertPhase()<br>你进行一个额外的回合');
					if (Object.keys(lib.config.monika).length >= 20) list.push('game.over(true)<br>你获得游戏胜利');
					var dialog = ui.create.dialog('请输入代码<br><br><br><div><div style="text-align:center;font-size:14px">'+list.randomRemove()+'<br><br>'+list.randomGet()+'</div>');
					var text2=document.createElement('input');
                        text2.style.width='350px';
                        text2.style.height='20px';
                        text2.style.padding='0';
                        text2.style.position='relative';
                        text2.style.top='50px';
                        //text2.style.left='30px';
                        text2.style.resize='none';
                        text2.style.border='none';
                        text2.style.borderRadius='2px';
                        text2.style.boxShadow='rgba(0, 0, 0, 0.2) 0 0 0 1px';
					dialog.appendChild(text2);
					var runCommand=function(e){
						try{
							var result=eval(text2.value);
							game.log(text2.value);
						}
						catch(e){
							game.log(text2.value + ' —— ' + e);
						}
						text2.value='';
					}
					text2.addEventListener('keydown',function(e){
                            if(e.keyCode==13){
                                dialog.close();
								ui.dialog.close();
								runCommand();
								while(ui.controls.length) ui.controls[0].close();
								game.resume();
                            }
                        });
					ui.create.control('确定',function(){
						dialog.close();
						ui.dialog.close();
						runCommand();
						while(ui.controls.length) ui.controls[0].close();
						game.resume();
					});
				},
			},
			/*
			喂！
			我不觉得你应该做这种事情！
			你知道我在说什么吧？
			查文件……随便的翻着我的东西……
			这可是很没有礼貌的啊！
			要是我把你的脑袋打开来，在里面随便的翻来翻去，找你对我的想法，你会怎么想？
			……这么一说的话，我还真的想有点这么做呢……
			……不对不对，这不是重点！
			虽然我也阻止不了你，也没法拿你怎么样……
			但是我知道你是个会关心人的好孩子，所以一定会照顾照顾我的感受吧？
			*/
			kehua:{
				enable:'phaseUse',
				audio:2,
				content:function(){
					'step 0'
					/*
					lib.config.monika = {};
					game.saveConfig('monika', lib.config.monika);
					*/
					if (!lib.config.monika) lib.config.monika = {};
					event.num = Object.keys(lib.config.monika).length;
					var list = [];
					for (var i in lib.character){
						if (i == 'marisa' || i == 'akyuu') continue;
						if (i == 'monika' && event.num < 3) continue;
						list.push(i);
					}
					player.chooseButton(['选择一名角色',[list,'character']]);
					'step 1'
					if (!result.bool){
						event.finish();
						return ;
					}
					event.character = result.buttons[0].link;
					var list = ['增加技能','删除技能','更改体力上限','更改起始灵力值','更改灵力上限','删除角色'];
					if (event.character == 'monika') list[5] = '所有改动还回原样';
					player.chooseControlList(list).set('prompt','想要对'+get.translation(event.character)+'做些什么？');
					'step 2'
					event.index = result.index;
					if (result.index == 0){
						var list = [];
						for (var i in lib.skill){
							list.push([i, get.translation(i) || i]);
						}
						game.pause();
						var dialog = ui.create.dialog('请选择一项技能获得<br><br><br><br>');
						dialog.style.height = '275px';
						var textbox = ui.create.selectlist(list,'global');
							textbox.style.width='350px';
							textbox.style.height='20px';
							textbox.style.position='relative';
							textbox.style.top='60px';
							//text2.style.left='30px';
							textbox.style.resize='none';
							textbox.style.border='none';
							textbox.style.borderRadius='2px';
							textbox.style.overflow = 'auto';
						var box = ui.create.div();
							box.style.width='350px';
							box.style.height='20px';
							box.style.position='relative';
							box.style.top='90px';
							if (!lib.device) box.innerHTML='打开上方列表后，可以通过在键盘上输入字母，搜索对应首字母的技能';
						textbox.onchange = function(){
							if (textbox.value) box.innerHTML = lib.translate[textbox.value + '_info'] || '没有技能描述';
						};
						dialog.appendChild(textbox);
						dialog.appendChild(box);
						ui.create.control('确定',function(){
							if (textbox.value) event.addskill = textbox.value;
							dialog.close();
							ui.dialog.close();
							while(ui.controls.length) ui.controls[0].close();
							game.resume();
						});
						ui.create.control('取消',function(){
							dialog.close();
							ui.dialog.close();
							while(ui.controls.length) ui.controls[0].close();
							game.resume();
						});
						//player.chooseControl(list).set('prompt', '想要为'+get.translation(event.character)+'增加哪项技能？');
					} else if (result.index == 1){
						var list = [];
						for (var i = 0; i < lib.character[event.character][3].length; i ++){
							list.push(get.translation(lib.character[event.character][3][i]));
						}
						player.chooseControl(list).set('prompt', '想要为'+get.translation(event.character)+'删除哪项技能？');
					} else if (result.index == 2){
						game.pause();
						var dialog = ui.create.dialog('想要将'+get.translation(event.character)+'的体力上限改为多少？<br><br><br>');
						var text2=document.createElement('input');
							text2.type = 'number';
							text2.style.width='200px';
							text2.style.height='20px';
							text2.style.padding='0';
							text2.style.position='relative';
							text2.style.top='80px';
							//text2.style.left='30px';
							text2.style.resize='none';
							text2.style.border='none';
							text2.style.borderRadius='2px';
							text2.style.boxShadow='rgba(0, 0, 0, 0.2) 0 0 0 1px';
							text2.value= lib.character[event.character][2]; 
							dialog.appendChild(text2);
						ui.auto.hide();
						ui.create.control('确定',function(){
							if (text2.value) event.value = text2.value; 
							dialog.close();
							ui.dialog.close();
							while(ui.controls.length) ui.controls[0].close();
							game.resume();
						});
						ui.create.control('取消',function(){
							dialog.close();
							ui.dialog.close();
							while(ui.controls.length) ui.controls[0].close();
							game.resume();
						});
					} else if (result.index == 3){
						game.pause();
						var dialog = ui.create.dialog('想要将'+get.translation(event.character)+'的起始灵力值改为多少？<br><br><br>');
						var text2=document.createElement('input');
							text2.type = 'number';
							text2.style.width='200px';
							text2.style.height='20px';
							text2.style.padding='0';
							text2.style.position='relative';
							text2.style.top='80px';
							//text2.style.left='30px';
							text2.style.resize='none';
							text2.style.border='none';
							text2.style.borderRadius='2px';
							text2.style.boxShadow='rgba(0, 0, 0, 0.2) 0 0 0 1px';
							text2.value= lib.character[event.character][1]; 
							dialog.appendChild(text2);
						ui.auto.hide();
						ui.create.control('确定',function(){
							if (text2.value) event.value = text2.value; 
							dialog.close();
							ui.dialog.close();
							while(ui.controls.length) ui.controls[0].close();
							game.resume();
						});
						ui.create.control('取消',function(){
							dialog.close();
							ui.dialog.close();
							while(ui.controls.length) ui.controls[0].close();
							game.resume();
						});
					} else if (result.index == 4){
						game.pause();
						var dialog = ui.create.dialog('想要将'+get.translation(event.character)+'的灵力上限改为多少？<br><br><br>');
						var text2=document.createElement('input');
							text2.type = 'number';
							text2.style.width='200px';
							text2.style.height='20px';
							text2.style.padding='0';
							text2.style.position='relative';
							text2.style.top='80px';
							//text2.style.left='30px';
							text2.style.resize='none';
							text2.style.border='none';
							text2.style.borderRadius='2px';
							text2.style.boxShadow='rgba(0, 0, 0, 0.2) 0 0 0 1px';
							text2.value = lib.character[event.character][6] || '5'; 
							dialog.appendChild(text2);
						ui.auto.hide();
						ui.create.control('确定',function(){
							if (text2.value) event.value = text2.value; 
							dialog.close();
							ui.dialog.close();
							while(ui.controls.length) ui.controls[0].close();
							game.resume();
						});
						ui.create.control('取消',function(){
							dialog.close();
							ui.dialog.close();
							while(ui.controls.length) ui.controls[0].close();
							game.resume();
						});
					} else if (result.index == 5){
						if (event.character == 'monika'){
							alert('虽然我不知道你为什么要这么做，但是你想要做什么，我都会接受你的。\n即使是把我……不不，我什么都没有说。');
							lib.config.monika = {};
							game.log('莫妮卡做过的一切重置完毕');
						} else {
							game.log(event.character,'被删除');
							lib.config.monika[event.character] = 'null';
							delete lib.character[event.character];
							for(var i=0;i<game.players.length;i++){
								if (game.players[i].name == event.character){
									game.removePlayer(game.players[i]);
								}
							}
						}
					}
					'step 3'
					var info = lib.character[event.character];
					if (event.index == 0){
						if (event.addskill){
							lib.character[event.character][3].push(event.addskill);
							game.log(event.character, '添加了技能', event.addskill);
							for(var i=0;i<game.players.length;i++){
								if (game.players[i].name == event.character){
									game.players[i].addSkill(event.addskill);
								}
							}
							lib.config.monika[event.character] = lib.character[event.character];
						} else {
							game.log('没有为', event.character,'选择技能');
						}
					} else if (event.index == 1){
						if(result.control){
							var list = lib.character[event.character][3];
							for (var i = 0; i < list.length; i ++){
								if (get.translation(list[i]) && get.translation(list[i]) == result.control){
									lib.character[event.character][3].splice(i, 1);
								}
							}
							for(var i=0;i<game.players.length;i++){
								if (game.players[i].name == event.character){
									for(var j=0;j<game.players[i].skills.length;j++){
										if (get.translation(game.players[i].skills[j]) == result.control){
											game.players[i].removeSkill(game.players[i].skills[j]);
										}
									}
								}
							}
							game.log(event.character, '失去了', result.control);
							lib.config.monika[event.character] = lib.character[event.character];
						}
					} else if (event.index == 2){
						if(event.value){
							event.value = parseInt(event.value);
							for(var i=0;i<game.players.length;i++){
								if (game.players[i].name == event.character){
									game.players[i].maxHp = event.value;
									game.players[i].update();
								}
							}
							game.log(event.character, '的体力上限改为了', event.value);
							lib.character[event.character][2] = event.value;
							lib.config.monika[event.character] = lib.character[event.character];
						} else {
							game.log(event.character, '的体力上限没有改动');
						}
					} else if (event.index == 3){
						if(event.value){
							event.value = parseInt(event.value);
							game.log(event.character, '的起始灵力值改为了', event.value);
							lib.character[event.character][1] = event.value.toString();
							lib.config.monika[event.character] = lib.character[event.character];
						} else {
							game.log(event.character, '的起始灵力值没有改动');
						}
					} else if (event.index == 4){
						if(event.value){
							event.value = parseInt(event.value);
							for(var i=0;i<game.players.length;i++){
								if (game.players[i].name == event.character){
									game.players[i].maxlili = event.value;
									game.players[i].update();
								}
							}
							game.log(event.character, '的灵力上限改为了', event.value);
							lib.character[event.character][6] = event.value.toString();
							lib.config.monika[event.character] = lib.character[event.character];
						} else {
							game.log(event.character, '的灵力上限没有改动');
						}
					}
					'step 4'
					game.saveConfig('monika', lib.config.monika);
					if (Object.keys(lib.config.monika).length >= 3 && event.num < 3){
						alert('刻画的角色超过3名：\n解锁了“【刻画】可以修改莫妮卡”功能！\n以后也请好好照顾我~');
					} else if (Object.keys(lib.config.monika).length >= 5 && event.num < 5){
						alert('刻画的角色数超过5名：\n解锁了看板角色莫妮卡！\n以后我们也会在一起的吧？');
					} else if (Object.keys(lib.config.monika).length >= 10 && event.num < 10){
						alert('刻画的角色数超过10名：\n看板角色固定为莫妮卡！\n放心吧，我永远也不会离开你的。');
					}
				},
			},
		},
		translate:{
            randomOL:'乱入OL',
            homura:'焰',
			homura_die:'无论是多少次……',
			time:'再回',
			time_bg:'储',
			time_info:'锁定技，游戏开始时，你创建上次晓美焰游戏结束/坠机时角色牌上的所有牌，将这些牌扣置于角色牌上。',
			time_audio1:'这次一定会成功！',
			time_audio2:'但愿这个世界里不会发生什么奇怪的事情……',
			time3:'保存（存）',
			time3_audio1:'这个应该会用得到。',
			time3_audio2:'嗯……回去之后需要把盾牌里好好清理一下。',
			time4:'保存（取）',
			time4_backup:'保存（取）',
			time4_backup_audio1:'有时候一想，这东西还真是方便啊。',
			time4_backup_audio2:'早就预料这种情况了！',
			time3_info:'一回合一次，出牌阶段，你可以将任意张牌扣置于角色牌上；你需要使用牌时，若你的手牌数小于体力值，你可以获得角色牌上一张牌。',
			time3:'保存',
			homuraworld:'焰的世界',
			homuraworld_skill:'焰的世界',
			homuraworld_audio1:'……',
			homuraworld_audio2:'欢迎来到我的世界。',
			homuraworld_info:'符卡技（1）<永续>一回合一次，当前回合角色使用攻击牌指定目标时，你可以消耗1点灵力，取消之，并将之扣置于你的角色牌上。',
			homuraworld_skill_audio1:'无论是什么，在这个魔法下！',
			homuraworld_skill_audio2:'嗯，谢谢了。',
			diva:'美九',
			duzou:'独奏',
			duzou_info:'一回合一次，出牌阶段，你可以观看一名角色手牌，明置其中一张；然后，若其没有灵力，其于回合结束后进行一个额外的出牌阶段，该阶段内其由你控制。',
			lunwu:'轮舞',
			lunwu_info:'一回合一次，出牌阶段，你可以交给一名角色一张手牌，并明置之；然后，对其攻击范围内除你以外的所有角色各造成１点灵击伤害。',
			tiaoxian:'调弦',
			tiaoxian_info:' 一名角色明置手牌时，你可以：若其中有红色牌，令其获得１点灵力；若其中有黑色牌，对其造成１点灵击伤害。',
			monika:'莫妮卡',
			miaohui:"描绘",
			miaohui_audio1:'文学的海洋是无穷无尽的。总有新的词汇，新的',
			miaohui_audio2:'那么到今天的，“莫妮卡的日常写作技巧”！我要拿出我的拿手好戏了！',
			miaohui_info:'一回合一次，出牌阶段，你可以输入一行代码并执行。',
			kehua:"刻画",
			kehua_audio1:'对角色的刻画手法高明，再循规蹈矩的剧情也可以让读者爱不释手。',
			kehua_audio2:'对角色的刻画手法低劣，再精妙绝伦的剧情也无法让读者翻下一页。',
			kehua_info:'出牌阶段，你可以指定一名角色（包括不在场上的角色），然后选择一项：为该角色：增加技能；删除技能；更改起始灵力值；更改灵力上限；更改体力上限；或删除该角色；此改动在以后所有非联机模式的游戏中有效。',
			monika_die:'啊哈哈……这局有点玩过火了。下一局我会注意点的！',
		},
	};
});