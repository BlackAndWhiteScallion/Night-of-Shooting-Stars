game.import('character',function(lib,game,ui,get,ai,_status){
	return {
		name:'randomOL',
		connect:true,
		character:{
			homura:['female', '2', 3, ['time3', 'time', 'homuraworld']],
			diva:['female', '3', 3, ['duzou', 'lunwu', 'tiaoxian'], ['forbidai']]
		},
		characterIntro:{
			homura:'问题：如果你目睹你最喜欢的人死亡，要她死多少次你才会疯掉？<br><b>出自：魔法少女小圆 画师：Capura.L</b>',
			diva:'<br><b>出自：约会大作战 画师：干物A太</b>',
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
			time4:{
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
					order:2,
					result:{
						player:1,
					}
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
			time4_audio1:'有时候一想，这东西还真是方便啊。',
			time4_audio2:'早就预料这种情况了！',
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
		},
	};
});