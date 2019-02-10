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
            sakuya:['female','2',3,['huanzang','shijing','world']],
            remilia:['female','5',4,['mingyun','feise','feise_start']],
            flandre:['female','1',4,['kuangyan','zhihou']],
		},
		characterIntro:{
		  rumia:'以吃人为生的一只宵暗妖怪。天真浪漫还有点笨蛋的萝莉。她可以以自己为中心制造一个完全黑暗的地带，但是她在其中也看不见，其他人也看不见她，结果她还经常会撞树上。<br> <b>画师：こけこっこ</b>',
          meiling:'红魔馆的门卫。擅长中国功夫，据说还会放元气弹？因为红魔馆的门卫好像就她一个人24小时值班，所以几乎24小时都可以看到她在门口打盹……<br> <b>画师：もねてぃ</b>',
          koakuma:'红魔馆图书馆的管理员（？）。没有名字没有设定没有官方插画，留下来的只有小恶魔这一个称呼，和对她的主人帕秋莉大人的忠贞不渝。<br> <b>画师：Dhiea</b>',
          patchouli:'全名帕秋莉·萝雷姬。红魔馆图书馆的馆长（？）。持有贤者之石，并会操纵全七种元素魔法的大魔女。但是同时也是个怎么都不肯出门的病弱家里蹲。<br> <b>画师：忘川の泉眼</b>',
          sakuya:'全名十六夜咲夜。红魔馆的女仆长。持有操控时间和空间的能力，并用来做家务，因此被称作“完美而潇洒的女仆长”。似乎和蕾米过去有什么孽缘……？<br> <b>画师：ds</b>',
          remilia:'全名蕾米莉亚·斯卡雷特。红魔馆的女主人。已经活了500年的萝莉吸血鬼，持有传说中的神枪冈格尼尔，和影响他人命运的能力……但是总是被红魔馆的其他人欺负着玩。<br> <b>画师：こぞう</b>',
          flandre:'全名芙兰朵露·斯卡雷特。是蕾米小5岁的妹妹。破坏力在幻想乡里是数一数二的，但是因为精神不稳定，被姐姐关在了红魔馆的地下室495年。最近好像渐渐和解了，加入了调戏姐姐的红魔馆大家里。<br> <b>画师：黑果冻dog</b>',
        },
		perfectPair:{
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
                        var range = false;
    					for (var i=0; i<ui.selected.targets.length;i++){
							if (get.distance(ui.selected.targets[i],target)<=1) range = true; 						
    					}
                        if (ui.selected.targets.length == 0) range = true;
						return range && target.countCards('h')>0&&player!=target&&target.lili<player.lili;
					}).set('ai',function(target){
					   return get.attitude(player,target) <= 0;
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
		    				if (player.countCards('h') > player.hp) return 'lose_lili';
                            if (player.lili > 2) return 'lose_lili';
                            return 'end_phase';
    					});
    				}
    				"step 4"
    				if (result.control == "lose_lili"){
    					player.loselili();
    					event.goto(2);
    				} 
    				else {
                        game.log(get.translation(player)+'跳过了出牌阶段');
    					trigger.finish();
    					trigger.untrigger();
    					event.finish();
    				}
    			},
    			ai:{
    				expose:0.1,
                    threaten:0.5,
    			},
    		},
    		yuezhi:{
    			audio:2,
    			cost:2,
    			spell:['yuezhi2'],
    			roundi:true,
    			trigger:{player:'phaseBegin'},
                check:function(event,player){
                    if (player.hp < 3) return true;
                    return false;
                },
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
                audio:2,
                enable:['chooseToUse','chooseToRespond'],
                hiddenCard:function(player,name){
                    return name == 'shan';
                },
                filter:function(event,player){
                    return (player.num('h',{name:'sha'}) > 0);
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
                        var player=_status.event.player;
                        var card={name:button.link[2]};
                        if(game.hasPlayer(function(current){
                            return player.canUse(card,current)&&get.effect(current,card,player,player)>0;
                        })){
                            switch(button.link[2]){
                                case 'tao':return 5;
                                case 'sha': return 2.9;
                            }
                        }
                        return 0;
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
                            },
                        }
                    },
                    prompt:function(links,player){
                        return '将一张轰！当作'+get.translation(links[0][2])+'使用/打出';
                    }
                },
                ai:{
                    order:3,
                    result:{
                        target:0.5,
                        player:0.5,
                    },
                    skillTagFilter:function(player){
                        return player.countCards('h',{name:'sha'})>0;
                    },
                    save:true,
                },
            },
            xingmai2:{
                audio:2,
                enable:['chooseToRespond','chooseToUse'],
                filterCard:function(card,player){
                    return get.type(card)=='basic';
                },
                selectCard:1,
                position:'he',
                viewAs:{name:'sha'},
                viewAsFilter:function(player){
                    if(!player.countCards('he',{type:'basic'})) return false;
                },
                prompt:'将一张基本牌当轰！使用或打出',
                check:function(card){return 4-get.value(card)},
                onuse:function(result,player){
                    player.removeSkill('xingmai2');
                    player.addSkill('xingmai');
                },
                onrespond:function(result,player){
                    player.removeSkill('xingmai');
                    player.addSkill('xingmai2');
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
                //priority:5,
                group:'dizhuan2',
                filter:function(event,player){
                    if(player.countCards('he')==0) return false;
                    if(player == event.target) return false;
                    return get.distance(player,event.target,'attack')<=1 && lib.filter.targetEnabled(event.card,event.player,player);
                },
                content:function(){
                    "step 0"
                    var next=player.chooseCard('你可以发动"地转",把目标转移给你。');
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
                    if(result.cards){
                        //player.logskill(event.name, result.targets);
                        trigger.targets[0].gain(result.cards);
                        trigger.targets.remove(trigger.targets[0]);
                        //trigger.targets.push(player);
                        trigger.target=player;
                    }
                    else{
                        event.finish();
                    }
                    "step 2"
                    game.log(get.translation(trigger.card)+'转移给了'+get.translation(player));
                    trigger.untrigger();
                    trigger.trigger('useCardToBefore');
                    trigger.trigger('shaBefore');
                    game.delay();
                },
                check:function(event,player){
                    if (player.num('h') < 2) return false;
                    if (player.hp < event.target.hp) return false;
                    return get.attitude(player,event.target)>0;
                },
            },
            dizhuan2:{
                audio:2,
                trigger:{player:'damageEnd'},
                forced:true,
                filter:function(event,player){
                    return (event.card&&event.card.name=='sha');
                },
                content:function(){
                    player.gainlili();
                },
                ai:{
                    maixie_defend:true,
                },
            },
            jicai:{
                audio:2,
                cost:2,
                spell:['jicai2'],
                roundi:true,
                trigger:{player:'phaseBegin'},
                check:function(event,player){
                    if (player.countCards('h') > 3 && player.lili > 3) return true;
                    return false;
                },
                filter:function(event,player){
                    return player.lili > lib.skill.jicai.cost;
                },
                content:function(){
                    player.loselili(lib.skill.jicai.cost);
                    player.turnOver();
                },
            },
            jicai2:{
                audio:2,
                trigger:{player:['useCard', 'respond']},
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
                check:function(){return true;},
            },
            qiyao:{
                audio:0,
                trigger:{player:'phaseBegin'},
                content:function(){
                    'step 0'
                    var list = ['phaseDraw', 'phaseUse', 'phaseDiscard'];
                    if (player.lili == 0) list.remove('phaseDiscard');
                    for (var i = 0; i < list.length; i ++){
                        if (player.skipList.contains(list[i])){
                            list.remove(list[i]);
                            i --;
                        } else list[i] = get.translation(list[i] + '_qiyao');
                    }
                    if (list.length == 0) event.finish();
                    event.list = list;
                    player.chooseControlList(event.list,function(event,player){
                        if (event.list[0] == '跳过摸牌阶段，视为使用一种法术牌') return 0;
                        if (event.list[0] == '跳过出牌阶段，将一张牌当作一种法术牌使用'){
                            if (player.skipList.contains('phaseDiscard')) return 0;
                            if (player.lili > 1  && player.countCards('h','sha') < 2) return 1;
                            else return 'cancel2';
                        }
                        return event.list.length - 1;
                    });
                    'step 1'
                    if (result.control){
                        if (event.list[result.index] == '跳过摸牌阶段，视为使用一种法术牌'){
                            player.skip('phaseDraw');
                            game.trySkillAudio('qiyao',player,true,1);
                            player.useSkill('qiyao2');
                        } else if (event.list[result.index] == '跳过出牌阶段，将一张牌当作一种法术牌使用'){
                            player.skip('phaseUse');
                            game.trySkillAudio('qiyao',player,true,2);
                            player.addTempSkill('qiyao3');
                            player.chooseToUse(function(card){
                                if(!lib.filter.cardEnabled(card,_status.event.player,_status.event)){
                                    return false;
                                }
                                var type=get.type(card,'trick');
                                return type=='trick';
                            },'是否使用一张法术牌？').set('logSkill','qiyao');
                        } else if (event.list[result.index] == '跳过弃牌阶段并消耗1点灵力，强化你本回合使用的所有法术牌'){
                            player.skip('phaseDiscard');
                            player.loselili();
                            game.trySkillAudio('qiyao',player,true,3);
                            player.addTempSkill('qiyao4');
                        } else {
                            event.finish();
                        }
                    }
                    'step 2'
                    event.goto(0);
                },
            },
            qiyao2:{
                direct:true,
                content:function(){
                    'step 0'
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
                    if(list.length){
                        player.chooseButton(['视为使用一张法术牌',[list,'vcard']]).set('ai',function(button){
                            var player=_status.event.player;
                            var card={name:button.link[2]};
                            return get.value(card);
                        });
                    }
                    'step 1'
                    if(result&&result.bool&&result.links[0]){
                        var card = {name:result.links[0][2]};
                        event.fakecard=card;
                        player.chooseTarget(function(card,player,target){
                            return player.canUse(event.fakecard,target,true);
                        },true,'选择'+get.translation(card.name)+'的目标').set('ai',function(target){
                            return 1;
                        });
                    } else {
                        event.finish();
                    }       
                    'step 2'
                    if(result.bool&&result.targets&&result.targets.length){
                        player.useCard(event.fakecard,result.targets);
                    }
                },
                ai:{
                    order:6,
                    result:{
                        player:function(player){
                            return 1;
                        }
                    },
                    threaten:1,
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
                        return '将一张牌当作'+get.translation(links[0][2])+'使用';
                    },
                },
                ai:{
                    order:1,
                    result:{
                        player:function(player){
                            return 1;
                        }
                    },
                    threaten:1,
                }
            },
            qiyao4:{
                forced:true,
                popup:false,
                priority:1000,
                trigger:{player:'useCard'},
                filter:function(event,player){
                    if (!lib.card[event.card.name].enhance || player.hasSkill('xianzhe')) return false;
                    return event.card.type == 'trick'; 
                },
                content:function(){
                    game.log('【七曜】效果：强化一次'+get.translation(event.card));
                    if (!player.storage._enhance){
                        player.storage._enhance = 1;
                    } else {
                        player.storage._enhance += 1;
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
                cost:1,
                spell:['xianzhe2','xianzhe_enhance'],
                roundi:false,
                trigger:{player:'phaseBegin'},
                filter:function(event,player){
                    return player.lili > lib.skill.xianzhe.cost;
                },
                content:function(){
                    player.loselili(lib.skill.xianzhe.cost);
                    player.turnOver();
                },
                check:function(event,player){
                    return player.lili > 3;
                },
            },
            xianzhe_enhance:{
                audio:2,
                trigger:{player:'useCard'},
                filter:function(event,player){
                    return player.lili > 1 && event.card.type == 'trick';
                },
                content:function(){
                    player.loselili();
                    if (!player.storage._enhance){
                        player.storage._enhance = 1;
                    } else {
                        player.storage._enhance += 1;
                    }
                },
                mod:{
                    wuxieRespondable:function(card,player,target){
                        if (card.type == 'trick' && player.storage._enhance) return false;
                    }
                },
            },
            xianzhe2:{
                direct:true,
                trigger:{player:'useCardAfter'},
                onremove:function(player){
                    delete player.storage.xianzhe;
                },
                filter:function(event,player){
                    return event.card.type == 'trick';
                },
                content:function(){
                    if (player.storage.xianzhe){
                        if (player.canUse({name:player.storage.xianzhe}, trigger.targets)){
                            player.useCard({name:player.storage.xianzhe}, trigger.targets);
                        }
                    }
                    if (player.storage._enhance){
                        player.storage.xianzhe = trigger.card.name;
                    }
                },
            },
            qishu:{
                audio:2,
                trigger:{player:'phaseBegin'},
                usable:1,
                filter:function(event,player){
                    return player.lili > 0;
                },
                content:function(){
                    "step 0"
                    var list = ['phaseDraw', 'phaseUse', 'phaseDiscard'];
                    for (var i in list){
                        if (player.skipList.contains(i)) list.remove(i);    
                    }
                    player.chooseControl(list, function(event,player){
                        if (player.getCards('h').length < 2 && player.getCards('h').length + 2 > player.hp) return 'phaseDiscard';
                        if (player.getCards('h').length > player.hp) return 'phaseDraw';
                        return 'phaseUse';
                    });
                    "step 1"
                    if (result.control){
                        player.storage.qishu = result.control;
                        player.chooseTarget(1,"选择一名角色，令其获得1点灵力并执行一个额外的"+get.translation(result.control),function(card,player,target){
                            return target != player;
                        }).set('ai',function(target){
                            if (player.storage.qishu == 'phaseDiscard'){
                                if (get.attitude(player,target)<0 && target.getCards('h') > target.hp) return target;
                                return get.attitude(player,target)<0;
                            } else {
                                return get.attitude(player,target)>0;
                            }
                        });
                    }
                    "step 2"
                    if(result.bool && result.targets){
                        player.loselili();
                        result.targets[0].addSkill('qishu2');
                        result.targets[0].storage.qishu = player.storage.qishu;
                        player.skip(player.storage.qishu);
                        delete player.storage.qishu;
                    } else {
                        event.finish();
                    }
                },
                check:function(event,player){
                    return player.lili > 1;
                },
            },
            qishu2:{
                trigger:{global:'phaseAfter'},
                direct:true,
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
                    player.removeSkill('qishu2');
                },
            },
            anye:{
                audio:2,
                trigger:{target:'useCardToBegin'},
                forced:true,
                usable:1,
                priority:15,
                check:function(event,player){
                    return get.effect(event.target,event.card,event.player,player)<0;
                },
                filter:function(event,player){
                    if(!event.target) return false;
                    if(event.player==player&&event.target==player) return false;
                    if(!player.storage._mubiao) return false;
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
            huanzang:{
                audio:2,
                group:['huanzang_1','huanzang_2'],
                trigger:{target:'useCardToBegin'},
                filter:function(event,player){
                    if (!get.suit(event.card) && !get.number(event.card)) return false;
                    if(event.targets&&event.targets.length>1) return false;
                    if (event.player == player) return false;
                    return player.countCards('he',{suit:get.suit(event.card)}) || player.countCards('he', {number:get.number(event.card)});
                },
                content:function(){
                    'step 0'
                    var eff=get.effect(player,trigger.card,trigger.player,trigger.player);
                    player.chooseToDiscard(get.prompt('huanzang'),function(card){
                        return (get.suit(card) == get.suit(trigger.card) || get.number(card) == get.number(trigger.card));
                    }).set('ai',function(card){
                        if(_status.event.eff<0){
                            return 7-get.value(card);
                        }
                        return 0;
                    }).set('eff',eff);
                    'step 1'
                    if (result.bool){
                        trigger.cancel();
                    }
                },
                check:function(){
                    return true;
                },
            },
            huanzang_1:{
                audio:'huanzang',
                trigger:{global:['useCardToBefore']},
                filter:function(event,player){
                    if (!event.card) return false;
                    if (_status.currentPhase!=player) return false;
                    if (event.card.name == 'shan') return false;
                    if (event.player == player) return false;
                    if(event.targets&&event.targets.length>1) return false;
                    return (player.countCards('he',{suit:get.suit(event.card)}) || player.countCards('he', {number:get.number(event.card)}));
                },
                content:function(){
                    'step 0'
                    player.chooseToDiscard(get.prompt('huanzang'),function(card){
                        return (get.suit(card) == get.suit(trigger.card) || get.number(card) == get.number(trigger.card));
                    }, true).set('ai',function(card){
                        return 0;
                    });
                    'step 1'
                    if (result.bool){
                        trigger.cancel();
                    }
                },
                check:function(event,player){
                    return -get.attitude(player, event.player);
                },
            },
            huanzang_2:{
                audio:'huanzang',
                trigger:{global:'shaMiss'},
                filter:function(event,player){
                    if (!event.responded) return false;
                    if (get.itemtype(event.responded.cards)!='cards') return false;
                    if (_status.currentPhase!=player) return false;
                    if (event.responded.cards.length > 1) return false;
                    return (player.countCards('he',{suit:event.responded.cards[0].suit}) || player.countCards('he', {number:event.responded.cards[0].number}));
                },
                content:function(){
                    "step 0"
                    var next=player.chooseToDiscard(get.prompt('huanzang'),'he',function(card){
                        return (get.suit(card) == get.suit(trigger.responded.cards[0]) || get.number(card) == get.number(trigger.responded.cards[0]));
                    }, true);
                    next.set('ai',function(card){
                        return -1;
                    });
                    "step 1"
                    if(result.bool){
                        trigger.untrigger();
                        trigger.trigger('shaHit');
                        trigger._result.bool=false;
                    }
                },
                check:function(event,player){
                    return -get.attitude(player, event.player);
                },
            },
            shijing:{
                group:['shijing_mark', 'shijing_mark2'],
                trigger:{player:'phaseEnd'},
                intro:{
                    content:'cards'
                },
                filter:function(event,player){
                    return player.lili > 0 && player.storage.shijing;
                },
                content:function(){
                    'step 0'
                    event.num = 3 - player.countCards('h');
                    if (player.countCards('e',{name:'stg_watch'})) event.num++;
                    if (event.num < 0) event.finish();
                    player.chooseCardButton(player.storage.shijing,'获得'+event.num+'张牌',[1,event.num],true).ai=function(button){
                        var val=get.value(button.link);
                        if(val<0) return -10;
                        return val;
                    }
                    'step 1'
                    player.loselili(); 
                    player.gain(result.links)._triggered=null;
                    for(var i=0;i<result.links.length;i++){
                        ui.discardPile.remove(result.links[i]);
                    }
                },
                check:function(event,player){
                    return player.lili > 1 && player.countCards('h') < 3;
                },
            },
            shijing_mark:{
                trigger:{global:'loseEnd'},
                direct:true,
                filter:function(event,player){
                    if (_status.currentPhase!=player) return false;
                    for(var i=0;i<event.cards.length;i++){
                        if (get.type(event.cards[i]) == 'equip' && event.getParent().name == 'useCard') continue;
                        if(get.position(event.cards[i])==ui.discardPile){
                            return true;
                        }
                    }
                    return false;
                },
                content:function(){
                    for (var i = 0; i < trigger.cards.length; i ++){
                        if (!player.storage.shijing) player.storage.shijing = [trigger.cards[i]];
                        else player.storage.shijing.push(trigger.cards[i]); 
                    }
                    player.markSkill('shijing');
                    player.syncStorage('shijing');
                },
            },
            shijing_mark2:{
                trigger:{player:'phaseAfter'},
                direct:true,
                priority:-100,
                filter:function(event,player){
                    return _status.currentPhase == player && player.storage.shijing;
                },
                content:function(){
                    player.storage.shijing = [];
                    player.syncStorage('shijing');
                    player.unmarkSkill('shijing');
                },
            },
            world:{
                audio:2,
                cost:1,
                roundi:true,
                spell:['world_skill'],
                trigger:{player:'phaseBegin'},
                filter:function(event,player){
                    return player.lili > lib.skill.world.cost;
                },
                content:function(){
                    player.loselili(lib.skill.world.cost);
                    player.turnOver();
                },
                check:function(event,player){
                    return player.lili > 3;
                },
            },
            world_skill:{
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
                    player.chooseTarget(get.prompt('world'),function(card,player,target){
                        return target.countCards('hej');
                    }).set('ai',function(target){
                        return get.attitude(player,target)<0;
                    });
                    'step 1'
                    if (result.bool){
                        player.discardPlayerCard(result.targets[0],'hej',true);
                    }
                    'step 2'
                    if (result.cards && result.cards[0].type != 'delay'){
                        if (trigger.player.canUse(result.cards[0],trigger.target,false,true)) trigger.player.useCard(result.cards[0],trigger.target);
                    }
                },
                check:function(event,player){
                    return -get.attitude(player, event.player) && get.attitude(player, event.target);
                },
            },
            mingyun:{
                audio:2,
                trigger:{player:['phaseUseBegin','damageEnd']},
                filter:function(event,player){
                    if (event.name == 'damage') return event.nature != 'thunder';
                    return true;
                },
                content:function(){
                    "step 0"
                    var num = player.getAttackRange();
                    if (num != 0){
                        player.chooseCardButton(num,true,get.cards(num),'按顺序将卡牌置于牌堆顶（先选择的在上）').set('ai',function(button){
                            return get.value(button.link);
                        });
                    }
                      'step 1'
                      if(result.bool){
                        var list=result.links.slice(0);
                        while(list.length){
                          ui.cardPile.insertBefore(list.pop(),ui.cardPile.firstChild);
                        }
                      }
                    "step 2"
                    player.addTempSkill('mingyun2');
                },
                check:function(event,player){
                    if (event.name == 'damage') return true;
                    return player.getAttackRange() > 2;
                },
            },
            mingyun2:{
                trigger:{global:'useCardToBegin'},
                direct:true,
                filter:function(event, player){
                    return !event.skill || event.skill != 'mingyun2';
                },
                content:function(){
                    "step 0"
                    trigger.cancel();
                    trigger.player.judge();
                    "step 1"
                     if (trigger.target && trigger.player.canUse(result.card,trigger.target,false,true)){
                        trigger.player.useCard(result.card,trigger.target,'mingyun2');
                     }
                }
            },
            feise:{
                audio:2,
                cost:4,
                roundi:true,
                spell:['feise2'],
                trigger:{player:'phaseBegin'},
                filter:function(event,player){
                    return player.lili > lib.skill.feise.cost;
                },
                content:function(){
                    player.loselili(lib.skill.feise.cost);
                    player.turnOver();
                },
                check:function(){
                    return false;
                },
            },
            feise_start:{
                trigger:{player:'phaseBeginStart'},
                direct:true,
                content:function(){
                    if (player.lili > lib.skill.feise.cost) player.useSkill('feise');
                    player.removeSkill('feise_start');
                },
            },
            feise2:{
                audio:2,
                global:'feise3',
                globalSilent:true,
                trigger:{global:'phaseEnd'},
                filter:function(event,player){
                    return event.player!=player&&event.player.hasSkill('feise4');
                },
                content:function(){
                    player.line(trigger.player,'red');
                    trigger.player.damage();
                },
                check:function(event,player){
                    return get.attitude(player,event.player) < 0;
                },
            },
            feise3:{
                trigger:{player:'useCard'},
                filter:function(event,player){
                    return _status.currentPhase==player&&event.targets&&(event.targets.length>1||event.targets[0]!=player);
                },
                forced:true,
                popup:false,
                content:function(){
                    player.addTempSkill('feise4');
                },
                mod:{
                    attackFrom:function(from,to,distance){
                        return distance-3*game.countPlayer(function(current){
                            if(current.hasSkill('feise2')) return true;
                            if (from.identityShown == false) return false;
                            if(current.identity=='unknown'||current.identity=='ye') return false;
                            if (current.identity=='zhu'&&from.identity=='zhong') return true;
                            if(current.identity!=from.identity) return false;
                        });
                    }
                },
            },
            feise4:{},
            kuangyan:{
                audio:2,
                group:['kuangyan2'],
                trigger:{player:['phaseUseBegin','damageEnd']},
                filter:function(event,player){
                    if (event.name == 'damage') return event.nature != 'thunder';
                    return true;
                },
                content:function(){
                    "step 0"
                    event.players=game.filterPlayer(function(current){
                        return current!=player&&get.distance(player,current,'attack')<=1;
                    });
                    event.num=0;
                    player.line(event.players,'green');
                    "step 1"
                    if(event.num<event.players.length){
                        var target=event.players[event.num];
                        player.discardPlayerCard(target,'hej',[1,1],true);
                        event.num++;
                        event.redo();
                    }
                    "step 2"
                    for (var i = 0; i < event.players.length; i ++){
                        if (event.players[i].countCards('h') == 0) event.players[i].damage();
                    }
                    'step 3'
                    lib.skill['kuangyan'].forced = true;
                },
                check:function(){
                    return true;
                },
            },
            kuangyan2:{
                trigger:{global:'dieEnd'},
                forced:true,
                direct:true,
                content:function(){
                    lib.skill['kuangyan'].forced = false;
                }
            },
            zhihou:{
                audio:2,
                cost:0,
                spell:['zhihou2'],
                infinite:true,
                trigger:{player:'phaseBegin'},
                filter:function(event,player){
                    return player.lili > player.hp;
                },
                content:function(){
                    player.loselili(player.hp);
                    player.addIncident(game.createCard('death','zhenfa',''));
                    player.turnOver();
                },
                check:function(event,player){
                    return player.lili - player.hp >= 2;
                },
            },
            zhihou2:{
                group:['zhihou3'],
                audio:4,
                forced:true,
                trigger:{source:'damageEnd'},
                filter:function(event,player){
                    return event.nature != 'thunder';
                },
                content:function(){
                    'step 0'
                    player.chooseControl('弃牌','扣灵力','技能无效','扣上限',function(){
                        var num = Math.floor(Math.random()*3);
                        if (num == 0) return '弃牌';
                        if (num == 1) return '扣灵力';
                        if (num == 2) return '扣上限';
                        return '弃牌';
                    }).set('prompt','想要和'+get.translation(trigger.player)+'怎么玩呢？');
                    'step 1'
                    if (result.bool){
                        if (result.control == '弃牌'){
                            var list = [];
                            if (trigger.player.getCards('h')) list.push('手牌区');
                            if (trigger.player.getCards('e')) list.push('装备区');
                            if (trigger.player.getCards('j')) list.push('技能牌区');
                            player.chooseControl(list,true,function(){
                                return list[Math.floor(Math.random()*list.length)];
                            }).set('prompt','想要撕掉'+get.translation(trigger.player)+'哪里的所有牌呢？');
                        } else if (result.control == '扣灵力'){
                            trigger.player.lili = 1;
                        } else if (result.control == '扣上限'){
                            trigger.player.loseMaxHp();
                            if (trigger.player.storage.zhihou) 
                                trigger.player.storage.zhihou += 1;
                            else 
                                trigger.player.storage.zhihou = 1;
                        } else if (result.control == '技能无效'){
                            trigger.player.addTempSkill('fengyin');
                        }
                        trigger.player.update();
                    }
                    'step 2'
                    if (result.bool){
                        var cards;
                        if (result.control == '手牌区') cards = trigger.player.getCards('h');
                        if (result.control == '装备区') cards = trigger.player.getCards('e');
                        if (result.control == '技能牌区') cards = trigger.player.getCards('j');
                        trigger.player.discard(cards);
                    }
                },
            },
            zhihou3:{
                forced:true,
                trigger:{player:'dieEnd'},
                content:function(){
                    var players = game.filterPlayer();
                    for (var i = 0; i < players.length; i ++){
                        if (players[i].storage.zhihou) players[i].addMaxHp(players[i].storage.zhihou);
                    }
                }
            },
        },
		translate:{
			rumia:'露米娅',
			heiguan:'黑棺',
			heiguan_info:'出牌阶段开始时，你可以指定灵力值小于你的任意名连续角色；你与这些角色各依次拼点；若你赢，视为你对其使用一张“轰！”；否则，你选择一项：取消其他目标并结束该阶段，或消耗1点灵力。',
			heiguan_audio1:'是这样吗？',
            heiguan_audio2:'破道九十，黑棺！',
            gain_lili:'获得灵力',
			end_phase:'结束出牌阶段',
			yuezhi:'月之阴暗面',
			yuezhi_info:'符卡技（2）<永续>你攻击范围内的所有其他角色的攻击范围视为0。',
            yuezhi_audio1:'别以为就这样结束了！',
            yuezhi_audio2:'隐隐透出浑浊的纹章，桀骜不驯张狂的才能；潮涌·否定·麻痹·一瞬，阻碍长眠。爬行的铁之公主，不断自残的泥制人偶，结合·反弹·延伸至地面，知晓自身的无力吧！',
            rumia_die:'看来是这样呢。',
            meiling:'红美铃',
            xingmai:'星脉',
            xingmai2:'星脉',
            xingmai_info:'你可以将一张“轰！”当作一种基本牌使用或打出；然后，调换描述中“一张‘轰！’”与“一种基本牌”的位置。',
            xingmai2_info:'你可以将一种基本牌当作一张“轰！”使用或打出；然后，调换描述中“一张‘轰！’”与“一种基本牌”的位置。',
            xingmai_audio1:'Zzzz……',
            xingmai_audio2:'早睡早起方能……还是晚起好了……',
            xingmai2_audio1:'啊？什么时候开始打架的？',
            xingmai2_audio2:'元气弹！',
            dizhuan:'地转',
            dizhuan_info:'你攻击范围内的一名其他角色成为“轰！”的目标时，你可以弃置一张牌，然后将目标转移给你；你受到以此法转移的牌造成的弹幕伤害后，获得1点灵力。',
		    dizhuang_audio1:'你的对手在这里！',
            dizhuang_audio2:'你在往哪里打呢！',
            jicai:'极彩风暴',
            jicai_info:'符卡技（2）<永续>你使用/打出牌时，可以弃置场上一张与之相同花色的牌。',
            jicai_audio1:'华符「极彩风暴」！',
            jicai_audio2:'哈啊——————————————————————————————',
            jicai2_audio1:'木大木大木大！',
            jicai2_audio2:'欧拉欧拉欧拉欧拉欧拉！',
            meiling_die:'好吧好吧……还是你强一些呢。',
            patchouli:'帕秋莉',
            qiyao:'七曜',
            qiyao_info:'准备阶段，你可以选择任意项：跳过弃牌阶段并消耗1点灵力，强化你本回合使用的下一张牌；跳过摸牌阶段，视为使用一种法术牌；跳过出牌阶段，将一张牌当作法术牌使用；你不能以此法使用同名牌。',
            qiyao3:'七曜',
            qiyao_audio1:'就稍微用点手段吧。',
            qiyao_audio2:'无趣。',
            qiyao_audio3:'……',
            phaseUse_qiyao:'跳过出牌阶段，将一张牌当作一种法术牌使用',
            phaseDraw_qiyao:'跳过摸牌阶段，视为使用一种法术牌',
            phaseDiscard_qiyao:'跳过弃牌阶段并消耗1点灵力，强化你本回合使用的所有法术牌',
            riyin:'日阴',
            riyin2:'日阴',
            riyin_info:'一名角色成为牌的目标后，若该角色本回合在此牌前成为过牌的目标，你可以将一张牌当作【请你住口！】使用。',
            riyin2_audio1:'不行。',
            riyin2_audio2:'请你安静下来。',
            xianzhe:'贤者之石',
            xianzhe2:'贤者之石',
            xianzhe_info:'符卡技（1）你的法术牌视为拥有“强化（-1）：可以为此牌额外指定一名目标；此牌不能成为【魔法障壁】的目标。”',
            xianzhe_audio1:'火水木金土符「贤者之石」。',
            xianzhe_audio2:'见识一下真正的魔法吧。',
            patchouli_die:'只是今天哮喘发作了而已……',
            koakuma:'小恶魔',
            qishu:'奇术',
            qishu_info:'准备阶段，你可以消耗1点灵力，并跳过一个阶段，然后指定一名其他角色；若如此做，回合结束后，该角色获得1点灵力，并进行一个以此法跳过的阶段。',
            qishu_audio1:'我、我来给你帮忙啦！',
            qishu_audio2:'这种事情我还是做得到的！',
            anye:'暗夜',
            anye_info:'锁定技，一回合一次，回合外，你成为法术牌的目标后，若你本回合在此牌前成为过牌的目标，该牌对你无效。',
            anye_audio1:'不行！',
            anye_audio2:'不要这么喧哗呀……呜咕……',
            koakuma_die:'帕秋莉大人~~~~',
            sakuya:'咲夜',
            huanzang:'幻葬',
            huanzang_1:'幻葬',
            huanzang_2:'幻葬',
            huanzang_audio1:'啊？这玩笑可不好笑啊。',
            huanzang_audio2:'呵，多谢款待了。',
            huanzang_info:'你成为其他角色的牌的唯一目标后，或其他角色于你的回合内使用牌指定目标后，你可以弃置一张相同花色/点数的牌：令该牌对目标无效。',
            shijing:'时静',
            shijing_audio1:'时间不是不等人，它只是不等你而已。',
            shijing_audio2:'我好像少拿东西了，你就等我一会儿吧？',
            shijing_info:'结束阶段，你可以消耗1点灵力：获得本回合进入弃牌堆的牌，直到你的手牌数等于3。',
            world:'咲夜的世界',
            world_info:'符卡技（1）<永续>一回合一次，当前回合角色使用攻击牌指定目标时，若该牌不是以此法使用，你可以消耗1点灵力：取消目标，并弃置一名角色的一张牌；若弃置牌可以对目标使用，来源将弃置牌对目标使用。',
            world_audio1:'「咲夜的世界」！',
            world_audio2:'ザ・ワールド！',
            world_skill:'咲夜的世界',
            world_skill_audio1:'在我的世界里想要做什么呢。',
            world_skill_audio2:'你是勇气可嘉呢，还是单纯是个笨蛋呢？',
            sakuya_die:'啊啊……我还是回去好了。',
            remilia:'蕾米莉亚',
            mingyun:'命运',
            mingyun2:'命运',
            mingyun_info:'出牌阶段开始时，或你受到弹幕伤害后，你可以：摸X张牌，并将等量牌置于牌堆顶（X为攻击范围），然后，直到结束阶段：一名角色使用其手牌指定唯一目标时，若该牌不是以此法使用，其取消目标并判定：若判定牌可以对目标使用，其将判定牌对目标使用。',
            feise:'绯色幻想乡',
            feise2:'绯色幻想乡',
            feise_info:'符卡技（4）<永续><u>你的第一回合开始时，若灵力足够：须发动此符卡；</u>你和与你同阵营的角色攻击范围+3；其他角色的结束阶段，若其对其以外的角色使用过牌，你可以：对其造成1点弹幕伤害。',
            flandre:'芙兰朵露',
            kuangyan:'狂宴',
            kuangyan_audio1:'嗯？捏一下这个，你就会爆炸吗？',
            kuangyan_audio2:'这么就碎掉的话，一点也不好玩呢……',
            kuangyan_info:'出牌阶段开始时，或你受到弹幕伤害后，你可以弃置攻击范围内的所有其他角色各一张牌；然后，对其中没有手牌的角色各造成1点弹幕伤害；你发动此技能后，此技能改为锁定技，直到一名角色坠机。',
            zhihou:'之后就一个人都没有了吗？',
            zhihou_info:'符卡技（X）<极意>（X 为你的体力值）你视为持有【皆杀】异变牌；你造成弹幕伤害后，选择一项：令受伤角色：1. 将灵力调整至1；2. 所有技能无效，直到结束阶段；3. 弃置其一个有牌的区域内所有牌；4. 扣减1点体力上限，直到此符卡结束。',
            zhihou_audio1:'秘弹「之后就一个人都没有了吗？」!',
            zhihou_audio2:'哈哈哈哈哈哈！太好玩了，太好玩了！',
            zhihou2_audio1:'就算玩坏也没有关系的吧！',
            zhihou2_audio2:'继续继续继续继续跳舞吧！',
            zhihou2_audio3:'这真的是太棒了！<b>太棒了！<u>太棒了！</b></u>',
            zhihou2_audio4:'呐，如果对你用这个会怎么样呢？',
            flandre_die:'结果，最后还是只剩下我一个了……',
        },
	};
});
