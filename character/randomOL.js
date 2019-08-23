game.import('character',function(lib,game,ui,get,ai,_status){
	return {
		name:'randomOL',
		connect:true,
		character:{
			homura:['female', '2', 3, ['time2', 'time', 'homuraworld']],
		},
		characterIntro:{
			homura:'问题：如果你目睹你最喜欢的人死亡，要她死多少次你才会疯掉？<br><b>出自：魔法少女小圆 画师：Capura.L</b>',
		},	   
		perfectPair:{
		},
		skill:{
			time:{
				forced:true,
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
					for (var i = 0; i < lib.config.gameRecord.homura.length; i ++){
						player.storage.time.push(game.createCard(lib.config.gameRecord.homura[i]))
					}
					player.syncStorage('time');
					player.markSkill('time');
				},
			},
			time2:{
				group:['time3', 'time4'],
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
				prepare:function(cards, player, targets){
					player.lose(cards,ui.special)._triggered=null;
				},
				content:function(){
					if (!player.storage.time) player.storage.time = [];
					player.storage.time = player.storage.time.concat(cards);
					player.syncStorage('time');
					player.markSkill('time');
				},
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
						return val;
					}
					"step 1"
					if (result.links){
						player.gain(result.links)._triggered=null;
						for(var i=0;i<result.links.length;i++){
							player.storage.time.remove(result.links[i]);
						}
						player.syncStorage('time');
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
		},
		translate:{
            randomOL:'乱入OL',
            homura:'焰',
			time:'再回',
			time_bg:'储',
			time_info:'锁定技，游戏开始时，你创建上次晓美焰游戏结束/坠机时角色牌上的所有牌，将这些牌扣置于角色牌上。',
			time3:'保存（存）',
			time4:'保存（取）',
			time2_info:'一回合一次，出牌阶段，你可以将任意张牌扣置于角色牌上；你需要使用牌时，若你的手牌数小于体力值，你可以获得角色牌上一张牌。',
			time2:'保存',
			homuraworld:'焰的世界',
			homuraworld_skill:'焰的世界',
			homuraworld_info:'符卡技（1）<永续>一回合一次，当前回合角色使用攻击牌指定目标时，你可以消耗1点灵力，取消之，并将之扣置于你的角色牌上。',
		},
	};
});