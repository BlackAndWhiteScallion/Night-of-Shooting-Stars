'use strict';
game.import('character',function(lib,game,ui,get,ai,_status){
	return {
		name:'scarlet',
		connect:true,
		character:{
			rumia:['female','4',4,['heiguan','yuezhi']],
            meiling:['female','2',4,['xingmai','dizhuan','jicai']],
            koakuma:['female','4',3,['qishu','anye']],
            patchouli:['female','2',3,['qiyao','riyin','xianzhe']],
		},
		characterIntro:{
			diaochan:'中国古代四大美女之一，有闭月羞花之貌。司徒王允之义女，由王允授意施行连环计，离间董卓、吕布，借布手除卓。后貂蝉成为吕布的妾。',
		},
		perfectPair:{
			xiahoudun:['xiahouyuan'],
		},
		skill:{
			heiguan:{
    			audio:2,
    			trigger:{player:'phaseUseBegin'},
    			//prompt:'选择一些灵力小于你，并且相邻的角色，和他们依次拼点：若你赢，视为对其使用一张【轰！】；若没赢，你须选择：消耗1点灵力，或取消其他目标并结束出牌阶段。',
    			filter:function(event,player){
    				return player.countCards('h')>0;
    			},
    			content:function(){
    				"step 0"
    				player.chooseTarget(get.prompt('heiguan'),[1,8],function(card,player,target){
    					for (var i=0; i<ui.selected.targets.length;i++){
							if (get.distance(ui.selected.targets[i],target)<=1) break;    						
    					}
						return target.countCards('h')>0&&player!=target&&target.lili<player.lili;
					}).set('ai',function(target){
					});
					"step 1"
    				if(result.bool){
    					player.logSkill('heiguan',result.targets);
    					event.targets=result.targets;
    				}
    				else{
    					event.finish();
    				}
    				"step 2"
    				if(event.targets.length){
    					var target=event.targets.shift();
    					event.current=target;
    					player.chooseToCompare(target);
    				}
    				else{
    					event.finish();
    				}
    				"step 3"
    				if(result.bool){
    					player.useCard({name:'sha'},event.current);
    					event.goto(2);
    				} else {
    					var choice = ['end_phase'];
		    			if (player.lili > 0){
		    				choice.push('lose_lili');
		    			}
		    			player.chooseControl(choice).set('ai',function(){
		    				return 'end_phase';
    					});
    				}
    				"step 4"
    				if (result.control == "lose_lili"){
    					player.loselili();
    					event.goto(2);
    				} 
    				else {
    					trigger.finish();
    					trigger.untrigger();
    					event.finish();
    				}
    			},
    			ai:{
    				expose:0.1
    			}
    		},
    		yuezhi:{
    			audio:2,
    			cost:2,
    			spell:['yuezhi2'],
    			roundi:true,
    			trigger:{player:'phaseBegin'},
    			filter:function(event,player){
    				return player.lili > lib.skill.yuezhi.cost;
    			},
    			content:function(){
    				player.loselili(lib.skill.yuezhi.cost);
    				for(var i=0;i<lib.skill.yuezhi.spell.length;i++){
    					player.addSkill(lib.skill.yuezhi.spell[i]);
    				}
    				player.turnOver();
    			},
    		},
    		yuezhi2:{
    			global:'yuezhi3',
    			unique:true,
    			onremove:function(player){
    				game.log('ddd');
    			}
    		},
    		yuezhi3:{
				mod:{
					attackFrom:function(from,to,distance){
						// 数场上符合条件的角色，不错
						return distance + 10*game.countPlayer(function(current){
							if(current==from) return false;
							if(!current.hasSkill('yuezhi2')) return false;
							if(current.lili > get.distance(current,from,'global')) return true;
						});
					}
				},
    		},
            xingmai:{
                enable:'chooseToUse',
                hiddenCard:function(player,name){
                    return name == 'shan';
                },
                filter:function(event,player){
                    return (player.num('he',{name:'sha'}) > 0);
                },
                chooseButton:{
                    dialog:function(){
                        var list = [];
                        for (var i in lib.card){
                            if(lib.card[i].mode&&lib.card[i].mode.contains(lib.config.mode)==false) continue;
                            if(lib.card[i].forbid&&lib.card[i].forbid.contains(lib.config.mode)) continue;
                            if(lib.card[i].type == 'basic'){
                                list.add(i);
                            }
                        }
                        for(var i=0;i<list.length;i++){
                            list[i]=[get.type(list[i]),'',list[i]];
                        }
                        return ui.create.dialog([list,'vcard']);
                    },
                    filter:function(button,player){
                        return lib.filter.filterCard({name:button.link[2]},player,_status.event.getParent());
                    },
                    check:function(button){
                        var player=_status.event.player;
                        var recover=0,lose=1,players=game.filterPlayer();
                        for(var i=0;i<players.length;i++){
                            if(!players[i].isOut()){
                                if(players[i].hp<players[i].maxHp){
                                    if(get.attitude(player,players[i])>0){
                                        if(players[i].hp<2){
                                            lose--;
                                            recover+=0.5;
                                        }
                                        lose--;
                                        recover++;
                                    }
                                    else if(get.attitude(player,players[i])<0){
                                        if(players[i].hp<2){
                                            lose++;
                                            recover-=0.5;
                                        }
                                        lose++;
                                        recover--;
                                    }
                                }
                                else{
                                    if(get.attitude(player,players[i])>0){
                                        lose--;
                                    }
                                    else if(get.attitude(player,players[i])<0){
                                        lose++;
                                    }
                                }
                            }
                        }
                        return (button.link[2]=='wuzhong')?1:-1;
                    },
                    backup:function(links,player){
                        return {
                            filterCard:function(card,player){
                                return (card.name == 'sha');
                            },
                            position:'he',
                            selectCard:1,
                            audio:2,
                            popname:true,
                            viewAs:{name:links[0][2]},
                            onuse:function(result,player){
                                player.removeSkill('xingmai');
                                player.addSkill('xingmai2');
                            }
                        }
                    },
                    prompt:function(links,player){
                        return '将一张手牌当作'+get.translation(links[0][2])+'使用';
                    }
                },
            },
            xingmai2:{
                audio:2,
                enable:['chooseToRespond','chooseToUse'],
                filterCard:function(card,player){
                    return get.type(card)=='basic';
                },
                position:'he',
                viewAs:{name:'sha'},
                viewAsFilter:function(player){
                    if(!player.countCards('he',{type:'basic'})) return false;
                },
                prompt:'将一张基本牌当杀使用或打出',
                check:function(card){return 4-get.value(card)},
                onuse:function(result,player){
                    player.removeSkill('xingmai2');
                    player.addSkill('xingmai');
                },
                ai:{
                    skillTagFilter:function(player){
                       if(!player.countCards('he',{type:'basic'})) return false;
                    },
                    respondSha:true,
                }
            }, 
            dizhuan:{
                audio:2,
                trigger:{global:'shaBefore'},
                direct:true,
                priority:5,
                usable:1,
                group:'dizhuan2',
                filter:function(event,player){
                    if(player.countCards('he')==0) return false;
                    if(player == event.target) return false;
                    return get.distance(player,event.target,'attack')<=1 && lib.filter.targetEnabled(event.card,event.player,player);
                },
                content:function(){
                    "step 0"
                    var next=player.chooseToDiscard('你可以发动"地转",把目标转移给你。');
                    next.set('ai',function(card){
                                var player=_status.event.player;
                                var trigger=_status.event.getTrigger();
                                if(get.attitude(player,trigger.player)>0){
                                    return 9-get.value(card);
                                }
                                if(player.countCards('h',{name:'shan'})) return -1;
                                return 7-get.value(card);
                            });
                    next.logSkill='dizhuan';
                    "step 1"
                    if(result.bool){
                        //player.logskill(event.name, result.targets);
                        trigger.targets.remove(result.targets[0]);
                        //trigger.targets.push(player);
                        trigger.target=player;
                        player.storage.dizhuan = 1;
                    }
                    else{
                        event.finish();
                    }
                    "step 2"
                    trigger.untrigger();
                    trigger.trigger('useCardToBefore');
                    trigger.trigger('shaBefore');
                    game.delay();
                },
            },
            dizhuan2:{
                audio:2,
                trigger:{player:'damageEnd'},
                forced:true,
                direct:true,
                filter:function(event,player){
                    return (player.storage.dizhuan == 1);
                },
                content:function(){
                    player.gainlili();
                    player.storage.dizhuan = 0;
                },
            },
            jicai:{
                audio:2,
                cost:2,
                spell:['jicai2'],
                roundi:true,
                trigger:{player:'phaseBegin'},
                filter:function(event,player){
                    return player.lili > lib.skill.jicai.cost;
                },
                content:function(){
                    player.loselili(lib.skill.jicai.cost);
                    for(var i=0;i<lib.skill.jicai.spell.length;i++){
                        player.addSkill(lib.skill.jicai.spell[i]);
                    }
                    player.turnOver();
                },
            },
            jicai2:{
                audio:2,
                trigger:{player:['useCard', 'respond']},
                frequent:true,
                filter:function(event){
                    if (!get.suit(event.card)) return false;
                    return game.countPlayer(function(current){
                        if (current.num('e',{suit:get.suit(event.card)}) > 0) return true;
                    } > 0);
                },
                content:function(){
                    "step 0"
                    player.chooseTarget(1,get.prompt('jicai'),function(card,player,target){
                        return target.num('e',{suit:get.suit(trigger.card)});
                    }).set('ai',function(target){
                        return -get.attitude(_status.event.player,target);
                    });
                    "step 1"
                    if(result.bool){
                        player.logSkill('jicai',result.targets);
                        event.targets=result.targets;
                        player.discardPlayerCard(event.targets[0],'e',1,function(card,player,target){
                            return get.suit(card) == get.suit(trigger.card);
                        });
                    }
                },
                prompt:'选择一名角色，扔掉他的牌',
                ai:{
                }
            },
            qiyao:{
                trigger:{player:'phaseUseEnd'},
                group:'qiyao2',
                frequent:true,
                popup:false,
                filter:function(event,player){
                    return true;
                },
                content:function(){
                    'step 0'
                    if (player.storage.qiyao.length == 1 && player.countCards('he') > 0){
                        player.addTempSkill('qiyao3');
                        player.chooseToUse(function(card){
                            if(!lib.filter.cardEnabled(card,_status.event.player,_status.event)){
                                return false;
                            }
                            var type=get.type(card,'trick');
                            return type=='trick';
                        },'是否使用一张法术牌？').set('logSkill','qiyao');
                    }
                    player.storage.qiyao=[];
                },
                audio:2,
                init:function(player){player.storage.qiyao=[]},
            },
            qiyao2:{
                trigger:{player:'useCard'},
                priority:-1,
                silent:true,
                forced:true,
                filter:function(event,player){
                    if(_status.currentPhase!=player) return false;
                    return true;
                },
                content:function(){
                    if (!player.storage.qiyao){player.storage.qiyao = []};
                    if (!player.storage.qiyao.contains(get.type(trigger.card))){
                        player.storage.qiyao.add(get.type(trigger.card));
                    }
                }
            },
            qiyao3:{
                enable:'chooseToUse',
                filter:function(event,player){
                    return player.countCards('he')>0;
                },
                chooseButton:{
                    dialog:function(){
                        var list = [];
                        for (var i in lib.card){
                            if(lib.card[i].mode&&lib.card[i].mode.contains(lib.config.mode)==false) continue;
                            if(lib.card[i].forbid&&lib.card[i].forbid.contains(lib.config.mode)) continue;
                            if(lib.card[i].type == 'trick'){
                                list.add(i);
                            }
                        }
                        for(var i=0;i<list.length;i++){
                            list[i]=['法术','',list[i]];
                        }
                        return ui.create.dialog([list,'vcard']);
                    },
                    filter:function(button,player){
                        return lib.filter.filterCard({name:button.link[2]},player,_status.event.getParent());
                    },
                    check:function(button){
                        var player=_status.event.player;
                        var recover=0,lose=1,players=game.filterPlayer();
                        for(var i=0;i<players.length;i++){
                            if(!players[i].isOut()){
                                if(players[i].hp<players[i].maxHp){
                                    if(get.attitude(player,players[i])>0){
                                        if(players[i].hp<2){
                                            lose--;
                                            recover+=0.5;
                                        }
                                        lose--;
                                        recover++;
                                    }
                                    else if(get.attitude(player,players[i])<0){
                                        if(players[i].hp<2){
                                            lose++;
                                            recover-=0.5;
                                        }
                                        lose++;
                                        recover--;
                                    }
                                }
                                else{
                                    if(get.attitude(player,players[i])>0){
                                        lose--;
                                    }
                                    else if(get.attitude(player,players[i])<0){
                                        lose++;
                                    }
                                }
                            }
                        }
                        return (button.link[2]=='wuzhong')?1:-1;
                    },
                    backup:function(links,player){
                        return {
                            filterCard:function(card,player){
                                return true;
                            },
                            position:'he',
                            selectCard:1,
                            audio:2,
                            popname:true,
                            viewAs:{name:links[0][2]},
                        }
                    },
                    prompt:function(links,player){
                        return '将一张手牌当作'+get.translation(links[0][2])+'使用';
                    }
                },
            },
            riyin:{
                trigger:{global:'useCardToBefore'},
                forced:true,
                popup:false,
                priority:15,
                filter:function(event,player){
                    if (!event.target) return false;
                    return event.target.storage._mubiao > 0;
                },
                content:function(){
                    player.addTempSkill('riyin2','useCardAfter');
                },
            },
            riyin2:{
                audio:2,
                enable:'chooseToUse',
                filter:function(event,player){
                    return true;
                },
                filterCard:function(card){
                    return true;
                },
                viewAsFilter:function(player){
                    return player.countCards('he')>0;
                },
                viewAs:{name:'wuxie'},
                prompt:'将一张牌当魔法障壁使用',
                selectCard:1,
                check:function(card){return 8-get.value(card)},
                threaten:1.2
            },
            xianzhe:{
                audio:2,
                cost:0,
                spell:['xianzhe2'],
                roundi:false,
                trigger:{player:'phaseBegin'},
                filter:function(event,player){
                    return player.lili > lib.skill.xianzhe.cost;
                },
                content:function(){
                    player.loselili(lib.skill.xianzhe.cost);
                    player.turnOver();
                },
            },
            xianzhe2:{
                enable:'chooseToUse',
                hiddenCard:function(player,name){
                    return true;
                },
                filter:function(event,player){
                    return (player.num('he') > 0) && player.lili > 0;
                },
                chooseButton:{
                        dialog:function(){
                            var list = [];
                            for (var i in lib.card){
                                if(lib.card[i].mode&&lib.card[i].mode.contains(lib.config.mode)==false) continue;
                                if(lib.card[i].forbid&&lib.card[i].forbid.contains(lib.config.mode)) continue;
                                if(lib.card[i].type == 'trick'){
                                    list.add(i);
                                }
                            }
                            for(var i=0;i<list.length;i++){
                                list[i]=['法术','',list[i]];
                            }
                            return ui.create.dialog([list,'vcard']);
                        },
                        filter:function(button,player){
                            if (player.storage.xianzhe && player.storage.xianzhe.contains(button.link[2])) return false;
                            return lib.filter.filterCard({name:button.link[2]},player,_status.event.getParent());
                        },
                        check:function(button){
                            var player=_status.event.player;
                            var recover=0,lose=1,players=game.filterPlayer();
                            for(var i=0;i<players.length;i++){
                                if(!players[i].isOut()){
                                    if(players[i].hp<players[i].maxHp){
                                        if(get.attitude(player,players[i])>0){
                                            if(players[i].hp<2){
                                                lose--;
                                                recover+=0.5;
                                            }
                                            lose--;
                                            recover++;
                                        }
                                        else if(get.attitude(player,players[i])<0){
                                            if(players[i].hp<2){
                                                lose++;
                                                recover-=0.5;
                                            }
                                            lose++;
                                            recover--;
                                        }
                                    }
                                    else{
                                        if(get.attitude(player,players[i])>0){
                                            lose--;
                                        }
                                        else if(get.attitude(player,players[i])<0){
                                            lose++;
                                        }
                                    }
                                }
                            }
                            return (button.link[2]=='wuzhong')?1:-1;
                        },
                        backup:function(links,player){
                            return {
                                filterCard:function(card,player){
                                    return true;
                                },
                                position:'he',
                                selectCard:1,
                                audio:2,
                                popname:true,
                                viewAs:{name:links[0][2]},
                                onuse:function(result,player){
                                    player.loselili();
                                    if (!player.storage.xianzhe) player.storage.xianzhe = [];
                                    player.storage.xianzhe.add(links[0][2]);
                                }
                            }
                        },
                        prompt:function(links,player){
                            return '将一张手牌当作'+get.translation(links[0][2])+'使用';
                        }
                    },
            },
            qishu:{
                audio:2,
                trigger:{player:['phaseJudgeBefore','phaseDrawBefore','phaseUseBefore','phaseDiscardBefore']},
                usable:1,
                popup:false,
                filter:function(event,player){
                    return player.lili > 0;
                },
                content:function(){
                    "step 0"
                    player.chooseTarget(1,get.prompt('qishu')+get.translation(trigger.name),function(card,player,target){
                        return target != player;
                    }).set('ai',function(target){
                    });
                    "step 1"
                    if(result.bool){
                        player.loselili();
                        result.targets[0].addTempSkill('qishu2');
                        result.targets[0].storage.qishu = trigger.name;
                        trigger.untrigger();
                        trigger.finish();
                    } else {
                        event.finish();
                    }
                },
                prompt:function(){
                    var str = "你可以消耗1点灵力，并跳过";
                    return str;
                },
            },
            qishu2:{
                trigger:{global:'phaseAfter'},
                filter:function(event,player){
                    return true;
                },
                content:function(){
                    player.gainlili();
                    if (player.storage.qishu == "phaseDraw"){
                        player.phaseDraw();
                    } else if (player.storage.qishu == "phaseUse") {
                        player.phaseUse();
                    } else if (player.storage.qishu == "phaseDiscard"){
                        player.phaseDiscard();
                    }
                    player.storage.qishu = null;
                },
            },
            anye:{
                audio:2,
                trigger:{target:'useCardToBegin'},
                forced:true,
                priority:15,
                check:function(event,player){
                    return get.effect(event.target,event.card,event.player,player)<0;
                },
                filter:function(event,player){
                    if(!event.target) return false;
                    if(event.player==player&&event.target==player) return false;
                    if(player.storage._mubiao == 0) return false;
                    if(player==_status.currentPhase) return false;
                    return (get.type(event.card)=='trick');
                },
                content:function(){
                    trigger.untrigger();
                    trigger.finish();
                },
                ai:{
                    effect:{
                        target:function(card,player,target,current){
                            if(get.type(card)=='trick'&&player!=target) return 'zeroplayertarget';
                        },
                    }
                }
            },
            
        },
		translate:{
			rumia:'露米娅',
			heiguan:'黑棺',
			heiguan_info:'出牌阶段开始时，你可以指定灵力值小于你的任意名连续角色；你与这些角色各依次拼点；若你赢，视为你对其使用一张“轰！”；否则，你选择一项：取消其他目标并结束该阶段，或消耗1点灵力。',
			lose_lili:'消耗灵力',
            gain_lili:'获得灵力',
			end_phase:'结束出牌阶段',
			yuezhi:'月之阴暗面',
			yuezhi_info:'符卡技（2）<永续>你攻击范围内的所有其他角色的攻击范围视为0。',
            meiling:'红美铃',
            xingmai:'星脉',
            xingmai2:'星脉',
            xingmai_info:'你可以将一张“轰！”当作一种基本牌使用或打出；然后，调换描述中“一张‘轰！’”与“一种基本牌”的位置。',
            xingmai2_info:'你可以将一种基本牌当作一张“轰！”使用或打出；然后，调换描述中“一张‘轰！’”与“一种基本牌”的位置。',
            dizhuan:'地转',
            dizhuan_info:'一回合一次，你攻击范围内的一名其他角色成为“轰！”的目标时，你可以弃置一张牌，然后将目标转移给你；你受到以此法转移的牌造成的弹幕伤害后，获得1点灵力。',
		    jicai:'极彩风暴',
            jicai_info:'符卡技（2）<永续>你使用/打出牌时，可以弃置场上一张与之相同花色的牌。',
            patchouli:'帕秋莉',
            qiyao:'七曜',
            qiyao3:'七曜',
            qiyao_info:'出牌阶段结束时，若你本阶段内只使用过一种类型的牌，你可以将一张牌当作一种法术牌使用。',
            riyin:'日阴',
            riyin2:'日阴',
            riyin_info:'一名角色成为牌的目标后，若该角色本回合在此牌前成为过牌的目标，你可以将一张牌当作【魔法障壁】使用。',
            xianzhe:'贤者之石',
            xianzhe2:'贤者之石',
            xianzhe_info:'符卡技（0）你可以消耗1点灵力，将一张牌当作你本回合没有使用过的一种法术牌使用。',
            koakuma:'小恶魔',
            qishu:'奇术',
            qishu_info:'一回合一次，你可以消耗1点灵力，并跳过一个阶段，然后指定一名其他角色；若如此做，结束阶段，该角色获得1点灵力，并进行一个额外的以此法跳过的阶段。',
            anye:'暗夜',
            anye_info:'锁定技，一回合一次，回合外，你成为法术牌的目标后，若你本回合在此牌前成为过牌的目标，该牌对你无效。',
        },
	};
});
