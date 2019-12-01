'use strict';
game.import('character',function(lib,game,ui,get,ai,_status){
	return {
		name:'sakura',
		connect:true,
		character:{
			letty:['female','3',4,['shuangjiang','baofengxue']],
            chen:['female','3',3,['mingdong','shihuo','shuanggui']],
            lilywhite:['female','5',3,['chunxiao','mengya']],
            merlin:['female','3',3,['mingguan','kuangxiang','hezou']],
            lunasa:['female','2',3,['shenxuan','zhenhun','hezou']],
            lyrica:['female','4',3,['mingjian','huanzou','hezou']],
            alice:['female','2',3,['huanfa','mocai','hanghourai']],
            youmu:['female','3',4,['yishan','yinhuashan']],
            yuyuko:['female','1',3,['youdie','moyin','fanhundie']],
            ran:['female','2',3,['jiubian','shiqu','tianhugongzhu']],
            yukari:['female','1',3,['huanjing','mengjie','mengjing']],
		},
		characterIntro:{
			letty:'全名蕾蒂·霍瓦特洛克。在冬天才会出来的雪女。能力是操纵寒气，也可以强化冬天的效果。<br> <b>画师：国家飯</b>',
            chen:'一只妖怪猫化作的，八云蓝的式神。因为是式神的式神所以比较弱，习性也更接近猫而不是妖怪。能力是使用妖术的能力。<br> <b>设计：安定   画师：水佾</b>',
            lilywhite:'在春天才会出现的，宣告春天到来的妖精。<br> <b>设计：安定   画师：oninoko</b>',
            lunasa:'全名露娜萨·普莉兹姆利巴。骚灵三姐妹中的大姐，因此也担任乐团的领队。有些阴沉，但又不喜欢拐弯抹角，且很容易较真的性子。使用乐器为小提琴，演奏的曲调带有令观众镇静，低落，甚至忧郁的效果。<br><b>画师：中島楓</b>',
            merlin:'全名梅露兰·普莉兹姆利巴。骚灵三姐妹中的二姐。很是开朗，但是感觉上有点神经质。力量上是姐妹中最强的。使用乐器为小号，演奏的曲调带有令观众激动，激昂，甚至抓狂的效果。<br><b>画师：中島楓</b>',
            lyrica:'全名莉莉卡·普莉兹姆利巴。骚灵三姐妹中的三妹。聪明，但是总是想用小聪明去赚姐姐们的便宜。使用乐器为键盘，打击乐器也可以使用。<br><b>画师：中島楓</b>',
            alice:'全名爱丽丝·玛格特罗伊德。住在魔法森林中，以操纵人偶出名的魔法使。因为是人偶使，大部分人不太敢接近，所以比较孤僻的样子。顺便也有着收集各种道具的坏习惯。<br><b>画师：藤原</b>',
            youmu:'全名魂魄妖梦。冥界白玉楼的庭师（同时也是女仆，厨师，剑术指导）。是半人半幽灵的混血，因此持有更长的寿命和更强的身体能力。使用楼观剑和白楼剑的二刀流剑豪。<br><b>画师：daiaru</b>',
            yuyuko:'全名西行寺幽幽子。冥界白玉楼的大小姐。冥界的管理者，可以控制死亡，也可以控制已死的幽灵。已经成为亡灵千年以上，并且没有生前的记忆，因而很是乐天和无忧无虑。<br><b>画师：.SIN</b>',
            ran:'全名八云蓝。八云紫的式神，传说中的九尾妖狐。因为紫长期睡觉，还需要冬眠，所以工作从日常打理到大结界的维护都是蓝来进行。<br> <b>设计：无限连的陆伯言  画师：ルリア</b>',
            yukari:'全名八云紫。持有如同GM权限的控制境界的能力，力量深不可测。幻想乡的创始人之一。大部分时候都在睡觉，或者是用隙间做些很逗比的事情。<br> <b>画师：Shionty</b>',
		},       
		perfectPair:{
		},
		skill:{
            shuangjiang:{
                audio:2,
                group:['shuangjiang2','shuangjiang3'],
                trigger:{player:['useCard', 'phaseEnd']},
                filter:function(event,player){
                    
                    if (event.name =='useCard' && !player.hasSkill('baofengxue2')) return false; 
                    return game.hasPlayer(function(target){
                        return target!=player&&!target.storage.shuang && target.storage._mubiao;
                    });
                },
                content:function(){
                    'step 0'
                    var players = game.filterPlayer();
                    var p = [];
                    for (var i = 0; i < players.length; i ++){
                        if (!players[i].storage.shuang && players[i].storage._mubiao) p.push(players[i]);
                    }
                    var num = 0;
                    for (var i = 0; i < players.length; i++){
                        if (get.attitude(player, players[i]) > 0) num --;
                        if (get.attitude(player,players[i]) < 0) num ++;
                    }
                    player.chooseTarget(p.length,('霜降：是否对所有亮的角色各造成1点灵击伤害'),function(card,player,target){
                            return p.contains(target);
                          }).set('num',num).set('ai',function(target){
                              return _status.event.num > 0;
                          }); 
                    'step 1'
                    if(result.bool){
                        player.logSkill('shuangjiang',result.targets);
                        for (var i = 0; i < result.targets.length; i ++){
                            result.targets[i].damage('thunder');
                        }
                    }
                },
                check:function(){
                    return true;
                },
                ai:{
                    tag:{
                        thunderdamage:1,
                    },
                    effect:{
                        player:function(card,player,target,current){
							if(get.tag(card,'respond') && target.storage._mubiao && !target.storage.shuang && target.countCards('h') > 2 && target.lili != 0){
								return -1;
							}
						}
                    }
                },
            },
            shuangjiang2:{
                trigger:{global:['useCard','respond']},
                direct:true,
                filter:function(event,player){
                    return _status.currentPhase.hasSkill('shuangjiang');
                },
                content:function(){
                    if (trigger.player){
                        trigger.player.storage.shuang = 1;
                    }
                },
            },
            shuangjiang3:{
                trigger:{player:'phaseAfter'},
                direct:true,
                content:function(){
                    var players = game.filterPlayer();
                     for (var i = 0; i < players.length; i ++){
                        delete players[i].storage.shuang;
                    }
                }
            },
            baofengxue:{
                audio:2,
                cost:2,
                spell:['baofengxue2'],
                trigger:{player:'phaseBegin'},
                filter:function(event,player){
                    return player.lili > lib.skill.baofengxue.cost;
                },
                check:function(event,player){
                    if(player.countCards('h')>2 && player.lili > 3) return true;
                    return false;
                },
                content:function(){
                    player.loselili(lib.skill.baofengxue.cost);
                    player.turnOver();
                },
                intro:{
                    content:function(storage,player){
                        if (!storage) return null;
                        var str = '';
                        for (var i = 0; i < player.storage.baofengxue.length; i ++){
                              str += get.translation(player.storage.baofengxue[i]) + ',';
                        }
                        return '所有角色不能使用'+str+'花色的牌';
                    }
                },
            },
            baofengxue2:{
                audio:2,
                trigger:{player:'useCard'},
                global:'baofengxue3',
                direct:true,
                filter:function(event){
                    //return (get.suit(event.card));
                    return true;
                },
                init:function(player){
                    player.storage.baofengxue = [];
                    player.markSkill('baofengxue');
                },
                onremove:function(player){
                    player.storage.baofengxue = [];
                    player.unmarkSkill('baofengxue');
                },
                content:function(){
                    if (get.suit(trigger.card) && !player.storage.baofengxue.contains(get.suit(trigger.card))) player.storage.baofengxue.push(get.suit(trigger.card));
                    player.useSkill('shuangjiang');
                },
                ai:{
                    threaten:1.4,
                    noautowuxie:true,
                }
            },
            baofengxue3:{
                mod:{
                    cardEnabled:function(card,player){
                        if (game.hasPlayer(function(current){
                                return current.storage.baofengxue && current.storage.baofengxue.contains(get.suit(card));
                            })) return false;
                    },
                    cardUsable:function(card,player){
                        if (game.hasPlayer(function(current){
                                return current.storage.baofengxue && current.storage.baofengxue.contains(get.suit(card));
                            })) return false;
                    },
                    cardRespondable:function(card,player){
                        if (game.hasPlayer(function(current){
                                return current.storage.baofengxue && current.storage.baofengxue.contains(get.suit(card));
                            })) return false;
                    },
                    cardSavable:function(card,player){
                        if (game.hasPlayer(function(current){
                                return current.storage.baofengxue && current.storage.baofengxue.contains(get.suit(card));
                            })) return false;
                    }
                },
                intro:{
                    content:function(suit){
                        return '不能使用或打出'+get.translation(suit)+'的牌';
                    }
                },
            },
            mingdong:{
                trigger:{target:'useCardToBegin'},
                usable:1,
                frequent:true,
                audio:2,
                intro:{
                    content:function(storage,player){
                        return '可以将法术牌当作'+lib.translate[player.storage.mingdong];
                    }
                },
                hiddenCard:function(player,name){
                    return name == "shan" || name == 'tao';
                },
                content:function(){
                    'step 0'
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
                    player.chooseButton(['选择【鸣动】这回合可以转化的牌',[list,'vcard']]).set('ai',function(button){
                        if (get.tag(trigger.card, 'respondShan')) return button.link[2] == 'shan';
                        if (get.tag(trigger.card, 'respondSha')) return button.link[2] == 'sha';
                        return button.link[2] == 'tao';
                    });
                    'step 1'
                    if (result.bool){
                        var name=result.links[0][2];
                        player.storage.mingdong = name;
                        player.addTempSkill('mingdong2');
                        player.markSkill('mingdong');
                        lib.skill.mingdong2.viewAs = {name:name};
                        game.log(player,'选择了',lib.translate[name]);
                    }
                },
            },
            mingdong2:{
                audio:3,
                enable:['chooseToRespond','chooseToUse'],
                hiddenCard:function(player,name){
                    return name == "shan" || name == "tao";
                },
                filter:function(event,player){
                    return player.countCards('h',{type:'trick'})>0;
                },
                filterCard:function(card,player){
                    return get.type(card)=='trick';
                },
                position:'h',
                check:function(card){return 4-get.value(card)},
                onremove:function(player){
                    delete player.storage.mingdong;
                    player.unmarkSkill('mingdong');
                },
                ai:{
                    respondSha:true,
                    respondShan:true,
                    order:4,
                    useful:-1,
                    value:-1
                },
            },
            shihuo:{
                trigger:{player:'gainliliAfter'},
                usable:1,
                audio:2,
                direct:true,
                filter:function(event, player){
                    return event.num > 0;
                },
                content:function(){
                    'step 0'
                    player.chooseTarget('令一名角色获得1点灵力',function(card,player,target){
                        return true;
                    }).set('ai',function(target){
                        return get.attitude(_status.event.player,target) && target.lili != target.maxlili;
                    });
                    'step 1'
                    if(result.bool){
                        player.logSkill('shihuo',result.targets);
                        result.targets[0].gainlili();
                        if (result.targets[0].name == 'ran'){
                            game.trySkillAudio('shihuo',result.targets[0],true,3);
                        }
                        if (result.targets[0].name == 'yukari'){
                            game.trySkillAudio('shihuo',result.targets[0],true,4);
                        }
                    }
                },
                prompt:'是否发动【式获】喵？',
            },
            shuanggui:{
                audio:2,
                cost:2,
                spell:['shuanggui2','shuanggui3'],
                roundi:true,
                trigger:{player:'phaseBegin'},
                check:function(event,player){
                    if (player.countCards('h') > player.getHandcardLimit() && player.hp > 2) return false;
                    if (player.lili > 3) return true;
                    return false;
                },
                filter:function(event,player){
                    return player.lili > lib.skill.shuanggui.cost;
                },
                content:function(){
                    'step 0'
                    player.loselili(lib.skill.shuanggui.cost);
                    player.turnOver();
                    player.chooseTarget([1,1],'令一名角色与你一同摸一张牌',function(card,player,target){
                        return target != player;
                    },true).set('ai',function(target){
                        return get.attitude(_status.event.player,target);
                    });
                    'step 1'
                    if (result.bool){
                        player.logSkill('shuanggui',result.targets);
                        player.draw();
                        result.targets[0].draw();
                        result.targets[0].addTempSkill('shuanggui4');
                    }
                },
            },
            shuanggui2:{

            },
            shuanggui3:{
                audio:2,
                trigger:{global:'loseliliBefore'},
                forced:true,
                filter:function(event,player){
                    return event.player.hasSkill('shuanggui4');
                },
                content:function(){
                    player.loselili(event.num);
                    event.num = 0;
                },
                onremove:function(){
                    for(var i=0;i<game.players.length;i++){
                        if(game.players[i].hasSkill('shuanggui4')){
                            game.players[i].removeSkill('shuanggui4');
                        }
                    }
                },
            },
            shuanggui4:{
                mark:true,
                intro:true,
            },
            huanfa:{
                trigger:{player:'phaseDiscardBegin'},
                audio:2,
                init:function(player){
                    if (!player.storage.huanfa) player.storage.huanfa=[];
                },
                intro:{
                    mark:function(dialog,content,player){
                        if(content&&content.length){
                            if(player==game.me||player.isUnderControl()){
                                dialog.addAuto(content);
                            }
                            else{
                                return '共有'+get.cnNumber(content.length)+'张‘手办’';
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
                filter:function(event,player){
                    if (player.storage.huanfa.length > game.filterPlayer.length) return false;
                    return player.countCards('he') > 0; 
                },
                content:function(){
                    'step 0'
                    player.chooseCard('he',[1,2],'将一至两张牌置为“手办”').set('ai',function(card){
                        return get.value(card);
                    });
                    'step 1'
                    if(result.cards&&result.cards.length){
                        player.lose(result.cards,ui.special);
                        player.storage.huanfa=player.storage.huanfa.concat(result.cards);
                        player.syncStorage('huanfa');
                        player.markSkill('huanfa');
                        game.log(player,'将',result.cards.length,'张牌置为“手办”');
                        player.draw(result.cards.length);
                    }
                },
                prompt:'是否准备一些人偶？',
            },
            mocai:{
                audio:2,
                priority:5,
                trigger:{global:'useCardToBefore'},
                filter:function(event,player){
                    if (get.distance(player,event.target,'attack')>1) return false;
                    if (player.storage.huanfa.length == 0) return false;
                    return (get.subtype(event.card) == 'attack');
                },
                check:function(event,player){
                    return get.attitude(player,event.target)>0;
                },
                content:function(){
                    'step 0'
                    player.chooseControlList(get.prompt('mocai'),'给目标一张“手办”','给目标找一张技能牌',function(event,player){
                        return 0;
                    },true);
                    'step 1'
                    if (result.control){
                        event.index=result.index;
                        player.chooseCardButton('选择一张“手办”',player.storage.huanfa, 1, true).ai=function(button){
                            return get.value(button.link);
                        };
                    } else {
                        event.finish();
                    }
                    'step 2'
                    if (result.links && result.links.length > 0){
                        player.storage.huanfa.remove(result.links[0]);
                        player.syncStorage('huanfa');
                        if (!player.storage.huanfa.length) player.unmarkSkill('huanfa');
                        if (event.index == 0){
                            trigger.target.gain(result.links[0],'log');
                            player.$give(1,trigger.target);
                            if (get.type(result.links[0]) == 'equip' && trigger.target.countCards('e') < trigger.target.maxequip){
                                event.card = result.links[0];
                                player.chooseBool('是否将'+get.translation(result.links[0])+'置入'+get.translation(trigger.target)+'的装备区内？').set('choice',get.bonus(result.links[0])<=0);
                            }
                        } else {
                            var cards = [];
                            for(var i=0;i<3;i++){
                                cards.push(ui.skillPile.childNodes[i]);
                            }
                            player.chooseCardButton(cards,'选择一张技能牌交给'+get.translation(trigger.target),1,true);
                        }
                    }
                    'step 3'
                    if (event.index == 1 && result.links) trigger.target.gain(result.links[0]);
                    if (event.index == 0 && result.bool && event.card) trigger.target.equip(event.card);
                },
            },
            hanghourai:{
                audio:2,
                spell:['hanghourai1'],
                cost:2,
                roundi:true,
                trigger:{player:'phaseBegin'},
                filter:function(event,player){
                    return player.lili > lib.skill.hanghourai.cost;
                },
                content:function(){
                    'step 0'
                    player.loselili(lib.skill.hanghourai.cost);
                    player.turnOver();
                    player.chooseCard('he',[1,player.countCards('he')],'将任意张牌置为“手办”').set('ai',function(card){
                        return get.value(card);
                    });
                    'step 1'
                    if (result.bool && result.cards.length){
                        player.lose(result.cards,ui.special);
                        player.storage.huanfa=player.storage.huanfa.concat(result.cards);
                        player.syncStorage('huanfa');
                        player.markSkill('huanfa');
                        game.log(player,'将',result.cards.length,'张牌置为“手办”');
                        player.draw(result.cards.length);
                    }
                },
                check:function(event,player){
                    return player.lili > 3 && player.storage.huanfa.length + player.countCards('h') >= 3;
                }
            },
            hanghourai1:{
                audio:2,
                trigger:{global:'phaseEnd'},
                filter:function(event,player){
                    return player.storage.huanfa.length > 0;
                },
                content:function(){
                    'step 0'
                    trigger.target = _status.currentPhase;
                    player.chooseCardButton(player.storage.huanfa,'选择一张“手办”交给'+get.translation(trigger.target),1,true).ai=function(button){
                        return get.value(button.link);
                    };
                    'step 1'
                    if (result.bool && result.links.length){
                        event.card = result.links[0];
                        trigger.target.gain(event.card);
                        player.storage.huanfa.remove(event.card);
                        player.syncStorage('huanfa');
                        var players = game.filterPlayer();
                        var f = [];
                        for (var i = 0; i < players.length; i++){
                            if (trigger.target.canUse(event.card, players[i])) f.push(players[i]);
                        }
                        if (f.length == 0) event.finish();
                        else {
                            player.chooseTarget(('选择'+get.translation(trigger.target)+'使用'+get.translation(event.card)+'的目标'),function(card,player,target){
                                return f.contains(target);
                            }).set('ai', function(target){
                                return get.effect(target,event.card,player, player);
                            });
                        }
                    }
                    'step 2'
                    if (result.bool && result.targets.length){
                        trigger.target.useCard(event.card,result.targets);
                    }
                },
                check:function(event,player){
                    return get.attitude(player,event.player)>0;
                },
            },
            chunxiao:{
                audio:2,
                trigger:{player:'phaseBegin'},
                filter:function(event,player){
                    return player.lili >= player.hp;
                },
                check:function(event,player){
                    return game.countPlayer(function(current){
                        if (get.attitude(player, current) < 0) return -2;
                        else return 2;
                    }) > 0;
                },
                content:function(){
                    "step 0"
                    event.current=player;
                    event.players=game.filterPlayer();
                    event.num=0;
                    player.line(event.players,'green');
                    "step 1"
                    if(event.num<event.players.length){
                        var target=event.players[event.num];
                        target.draw();
                        if (target.name == 'lilyblack') game.trySkillAudio('chunxiao',player,true,3);
                        event.num++;
                        event.redo();
                    }
                    "step 2"
                    event.current.chooseTarget([1,1],true,'春晓：弃置与你最近的一名角色一张牌',function(card,player,target){
                        if(player==target) return false;
                        if(get.distance(player,target)<=1) return true;
                        if(game.hasPlayer(function(current){
                            return current!=player&&get.distance(player,current)<get.distance(player,target);
                        })){
                        return false;
                    }
                        return target.countCards('hej');
                    }).set('ai',function(target){
                        return -get.attitude(_status.event.player,target);
                    }); 
                    "step 3"
                    if(result.bool){
                        event.current.line(result.targets,'green');
                        event.targets=result.targets;
                        event.current.discardPlayerCard(event.targets[0],'hej',[1,1],true);
                    }
                    if(event.current.next!=player){
                        event.current=event.current.next;
                        game.delay(0.5);
                        event.goto(1);
                    }
                },
                prompt:'春天来了！春天来了！',
            },
            mengya:{
                audio:2,
                enable:'phaseUse',
                usable:2,
                filter:function(event,player){
                    return !(player.lili == 0 && player.num('hej') == 0);
                },
                content:function(){
                    var choice = [];
                    if (player.lili != 0){
                        choice.push('消耗1点灵力，摸一张牌');
                    }
                    if (player.lili != player.maxlili && player.num('hej') != 0){
                        choice.push('获得1点灵力，弃一张牌');
                    }
                    'step 0'
                    player.chooseControl(choice).set('ai',function(){
                        if (player.num('h') > player.hp && player.lili < 3) return '获得1点灵力，弃一张牌';
                        if (player.num('h') > player.hp) return 0;
                        return '消耗1点灵力，摸一张牌';
                    });
                    'step 1'
                    if (result.control == '获得1点灵力，弃一张牌'){
                        player.chooseToDiscard(1,true,'hej');
                        player.gainlili();
                    } else if (result.control == '消耗1点灵力，摸一张牌') {
                        player.loselili();
                        player.draw();
                    }
                },
                ai:{
                    basic:{
                        order:8
                    },
                    result:{
                        player:function(player,target){
                            return 1;
                        },
                    }
                }
            },
            shenxuan:{
                global:['shenxuan_viewAs'],
                enable:'phaseUse',
                usable:1,
                audio:2,
                filter:function(event,player){
                    return player.getCards('h');
                },
                content:function(event,player){
                    'step 0'
                    player.chooseCard('选择今天的乐谱明置吧？','h',function(card){
                        if (player.storage.mingzhi) return !player.storage.mingzhi.contains(card);
                        else return true;
                    }).set('ai',function(card){
                        return get.value(card);
                    });
                    'step 1'
                    if (result.bool){
                        player.mingzhiCard(result.cards[0]); 
                    }
                },
                ai:{
                    order:5,
                    result:{
                        player:function(player,target){
                            return 1;
                        }
                    }
                },
            },
            shenxuan_viewAs:{
                enable:'chooseToUse',
                usable:1,
                audio:1,
                filter:function(event,player){
                    if (player.countCards('h','sha')== 0) return false;
                    return game.hasPlayer(function(target){
                        return target.hasSkill('shenxuan') && target.storage.mingzhi && get.distance(target,player,'attack')<=1;
                    });
                },
                chooseButton:{
                    dialog:function(event,player){
                        var players = game.filterPlayer();
                        var list = [];
                        for (var i = 0; i < players.length; i ++){
                            if (players[i].hasSkill('shenxuan') && players[i].storage.mingzhi.length && get.distance(players[i],player,'attack')<=1){
                                for (var j = 0; j < players[i].storage.mingzhi.length; j ++){
                                    if (get.type(players[i].storage.mingzhi[j]) != 'equip') list.push(players[i].storage.mingzhi[j].name);
                                }
                            }
                        }
                        for(var i=0;i<list.length;i++){
                            list[i]=[get.type(list[i]),'',list[i]];
                        }
                        return ui.create.dialog([list,'vcard']);
                    },
                    filter:function(button,player){
                        return _status.event.getParent().filterCard({name:button.link[2]},player);
                    },
                    check:function(button){
                        return get.value({name:button.link[2]});
                    },
                    backup:function(links,player){
                        return {
                            filterCard:{name:'sha'},
                            selectCard:1,
                            audio:2,
                            popname:true,
                            viewAs:{name:links[0][2]},
                        }
                    },
                    prompt:function(links,player){
                        return '将一张【轰！】当作'+get.translation(links[0][2])+'使用';
                    },
                    ai:{
                        order:6,
                        result:{
                            player:function(player){
                                return 0.5;
                            }
                        },
                    }
                },
                ai:{
                    order:4,
                    result:{
                        player:function(player){
                            var num=0;
                            var cards=player.getCards('h');
                            if(cards.length>=3&&player.hp>=3) return 0;
                            for(var i=0;i<cards.length;i++){
                                num+=Math.max(0,get.value(cards[i],player,'raw'));
                            }
                            num/=cards.length;
                            num*=Math.min(cards.length,player.hp);
                            return 12-num;
                        }
                    },
                    threaten:1.6,
                }
            },
            zhenhun:{
                trigger:{global:'phaseEnd'},
                group:['zhenhun_mark','zhenhun_remove'],
                //mark:true,
                direct:true,
                audio:2,
                intro:{content:'cards'},
                filter:function(event,player){
                    return (player.storage.zhenhun && player.storage.zhenhun.length) || (player.storage.mingzhi && player.storage.mingzhi.length);
                },
                content:function(){
                    'step 0'
                    var list = ['cancel2'];
                    if (player.storage.zhenhun && player.storage.zhenhun.length) list.push('获得弃置的一张牌');
                    if (player.storage.mingzhi && player.storage.mingzhi.length && _status.currentPhase != player) list.push('将明置牌交给当前回合角色');
                    event.list = list;
                    'step 1'
                    if (event.list.length == 1) event.finish();
                    player.chooseControl(event.list,function(event,player){
                        if (event.list.contains('获得弃置的一张牌')) return '获得弃置的一张牌';
                        if (player.storage.mingzhi.length > 1 && get.attitude(player, _status.currentPhase) > 0) return '将明置牌交给当前回合角色';
                        return 'cancel2';
                    }).set('prompt',get.prompt('zhenhun'));
                    "step 2"
                    event.control = result.control;
                    if(result.control=='获得弃置的一张牌'){
                        player.chooseCardButton(player.storage.zhenhun,'获得本回合因弃置进入弃牌堆的一张牌',1,true).ai=function(button){
                            var val=get.value(button.link);
                            if(val<0) return -10;
                            return val;
                        }
                    } else if (result.control == '将明置牌交给当前回合角色'){
                        player.chooseCardTarget({
                            filterCard:function(card,player){
                                return player.storage.mingzhi.contains(card) || get.position(card) == 'e' || get.position(card) == 'j';
                            },
                            filterTarget:function(card,player,target){
                                return player!=target && target == _status.currentPhase;
                            },
                            forced:true,
                            position:'hej',
                            prompt:'将一张明置牌交给当前回合角色',
                            ai1:function(card){
                                return 7-get.useful(card);
                            },
                        });
                    } else if (result.control == 'cancel2'){
                        event.finish();
                    }
                    "step 3"
                    player.logSkill('zhenhun');
                    if (result.bool && event.control == '获得弃置的一张牌'){
                        if (result.links.length){
                            player.$gain(result.links);
                            player.gain(result.links[0],'log');
                            player.mingzhiCard(result.links[0]);
                        }
                    }
                    if (result.bool && event.control == '将明置牌交给当前回合角色'){
                        if(result.targets&&result.targets[0]){
                            result.targets[0].gain(result.cards,player);
                            player.$give(result.cards,result.targets[0]);
                        }
                    }
                    /*
                    event.list.remove(event.control);
                    if (!event.list.length || event.list.length > 2) event.finish();
                    else event.goto(1);
                    */
                },
            },
            zhenhun_mark:{
                direct:true,
                popup:false,
                forced:true,
                trigger:{global:'discardAfter'},
                filter:function(event,player){
                    if (_status.currentPhase != event.player) return false;
                    for(var i=0;i<event.cards.length;i++){
                        if(get.position(event.cards[i])=='d'){
                            return true;
                        }
                    }
                    return false;
                },
                content:function(){
                    "step 0"
                    if(trigger.delay==false) game.delay();
                    "step 1"
                    if (!player.storage.zhenhun) player.storage.zhenhun = [];
                    for(var i=0;i<trigger.cards.length;i++){
                        if(get.position(trigger.cards[i])=='d'){
                            player.storage.zhenhun.push(trigger.cards[i]);
                        }
                    }
                    player.markSkill('zhenhun');
                    player.syncStorage('zhenhun');
                },
            },
            zhenhun_remove:{
                popup:false,
                forced:true,
                trigger:{global:'phaseAfter'},
                content:function(){
                    player.storage.zhenhun = [];
                    player.unmarkSkill('zhenhun');
                },
            },
            hezou:{
                audio:2,
                cost:2,
                group:['hezou_2'],
                spell:['hezou_skill'],
                trigger:{player:'phaseBegin'},
                filter:function(event,player){
                    return player.lili > lib.skill.hezou.cost;
                },
                content:function(){
                    player.loselili(lib.skill.hezou.cost);
                    player.turnOver();
                },
                check:function(){
                    return false;
                }
            },
            hezou_2:{
                audio:'hezou_skill',
                trigger:{target:'useCardToBegin'},
                cost:2,
                spell:['hezou_skill'],
                filter:function(event,player){
                    if (event.card.name != 'sha') return false;
                    return player.lili > lib.skill.hezou.cost && !player.isTurnedOver();
                },
                content:function(){
                    'step 0'
                    player.loselili(lib.skill.hezou.cost);
                    player.turnOver();
                    var players = game.filterPlayer();
                    for (var i = 0; i < players.length; i ++){
                        if (!trigger.player.canUse('sha',players[i])) players.remove(players[i]);
                        if (players[i] == player) players.remove(player);
                    }
                    var list = ['该【轰！】无效'];
                    if (players.length != 0) list.push('追加目标');
                    player.chooseControl(list,function(event,player){
                        return '该【轰！】无效';
                    });
                    'step 1'
                    if (result.control){
                        if (result.control == '该【轰！】无效'){
                            game.log('棱镜协奏曲：【轰！】对',player,'无效');
                            trigger.cancel();
                            event.finish();
                        } else if (result.control == '追加目标'){
                            player.chooseTarget('棱镜把【轰！】反射给一到两名角色',[1,2],function(card,player,target){
                                return trigger.player.canUse('sha',target);
                            }).set('ai',function(target){
                                var att=get.attitude(_status.event.player,target);
                                return -att;
                            });
                        }
                    }
                    'step 2'
                    if (result.bool && result.targets){
                        for (var j = 0; j < result.targets.length; j ++) trigger.targets.push(result.targets[j]);
                    }
                },
                check:function(){
                    return true;
                }
            },
            hezou_skill:{
                trigger:{target:'useCardToBegin'},
                audio:2,
                audioname:['merlin','lyrica'],
                filter:function(event,player){
                    return event.card.name == 'sha';
                },
                content:function(){
                    'step 0'
                    var players = game.filterPlayer();
                    for (var i = 0; i < players.length; i ++){
                        if (!trigger.player.canUse('sha',players[i])) players.remove(players[i]);
                        if (players[i] == player) players.remove(player);
                    }
                    var list = ['该【轰！】无效'];
                    if (players.length != 0) list.push('追加目标');
                    player.chooseControl(list,function(event,player){
                        return '该【轰！】无效';
                    });
                    'step 1'
                    if (result.control){
                        if (result.control == '该【轰！】无效'){
                            game.log('棱镜协奏曲：【轰！】对',player,'无效');
                            trigger.cancel();
                            event.finish();
                        } else if (result.control == '追加目标'){
                            player.chooseTarget('棱镜把【轰！】反射给一到两名角色',[1,2],function(card,player,target){
                                return trigger.player.canUse('sha',target);
                            }).set('ai',function(target){
                                var att=get.attitude(_status.event.player,target);
                                return -att;
                            });
                        }
                    }
                    'step 2'
                    if (result.bool && result.targets){
                        for (var j = 0; j < result.targets.length; j ++) trigger.targets.push(result.targets[j]);
                    }
                },
                ai:{
                    effect:{
                        target:function(card,player,target,current){
                            if(card.name == 'sha'&&player!=target) return 'zeroplayertarget';
                        },
                    }
                }
            },
            mingguan:{
                global:['mingguan_viewAs'],
                enable:'phaseUse',
                audio:2,
                usable:1,
                filter:function(event,player){
                    return player.getCards('h');
                },
                content:function(event,player){
                    'step 0'
                    player.chooseCard('把演奏的曲目明置出来吧？','h',function(card){
                        if (player.storage.mingzhi) return !player.storage.mingzhi.contains(card);
                        else return true;
                    }).set('ai',function(card){
                        return get.value(card);
                    });
                    'step 1'
                    if (result.bool){
                        player.mingzhiCard(result.bool[0]);
                    }
                },
                ai:{
                    order:1,
                    result:{
                        player:function(player,target){
                            return 0.5;
                        }
                    }
                }
            },
            mingguan_viewAs:{
                audio:2,
                enable:'phaseUse',
                viewAs:{name:'sha'},
                filter:function(event,player){
                    return game.hasPlayer(function(target){
                        return target.hasSkill('mingguan') && target.storage.mingzhi && get.distance(target,player,'attack')<=1;
                    });
                },
                filterCard:function(card,player){
                    var players = game.filterPlayer();
                    var list = [];
                    for (var i = 0; i < players.length; i ++){
                        if (players[i].hasSkill('mingguan') && get.distance(players[i],player,'attack')<=1 && players[i].storage.mingzhi){
                            for (var j = 0; j < players[i].storage.mingzhi.length; j++) list.push(players[i].storage.mingzhi[j].name);
                        }
                    }
                    return list.contains(card.name);
                },
                check:function(card){
                    return 5-get.value(card);
                },
                mod:{
                    cardEnabled:function(card,player){
                        var players = game.filterPlayer();
                        var list = [];
                        for (var i = 0; i < players.length; i ++){
                            if (players[i].hasSkill('mingguan') && get.distance(players[i],player,'attack')<=1 && players[i].storage.mingzhi){
                                for (var j = 0; j < players[i].storage.mingzhi.length; j++) list.push(players[i].storage.mingzhi[j].name);
                            }
                        }
                        if(card.name != 'sha' && list.contains(card.name)&&_status.event.skill!='mingguan_viewAs') return false;
                    },
                    cardUsable:function(card,player){
                        var players = game.filterPlayer();
                        var list = [];
                        for (var i = 0; i < players.length; i ++){
                            if (players[i].hasSkill('mingguan') && get.distance(players[i],player,'attack')<=1 && players[i].storage.mingzhi){
                                for (var j = 0; j < players[i].storage.mingzhi.length; j++) list.push(players[i].storage.mingzhi[j].name);
                            }
                        }
                        if(card.name != 'sha' && list.contains(card.name)&&_status.event.skill!='mingguan_viewAs') return false;
                    },
                    cardRespondable:function(card,player){
                        var players = game.filterPlayer();
                        var list = [];
                        for (var i = 0; i < players.length; i ++){
                            if (players[i].hasSkill('mingguan') && get.distance(players[i],player,'attack')<=1 && players[i].storage.mingzhi){
                                for (var j = 0; j < players[i].storage.mingzhi.length; j++) list.push(players[i].storage.mingzhi[j].name);
                            }
                        }
                        if(card.name != 'sha' && list.contains(card.name)&&_status.event.skill!='mingguan_viewAs') return false;
                    },
                    cardSavable:function(card,player){
                        var players = game.filterPlayer();
                        var list = [];
                        for (var i = 0; i < players.length; i ++){
                            if (players[i].hasSkill('mingguan') && get.distance(players[i],player,'attack')<=1 && players[i].storage.mingzhi){
                                for (var j = 0; j < players[i].storage.mingzhi.length; j++) list.push(players[i].storage.mingzhi[j].name);
                            }
                        }
                        if(card.name != 'sha' && list.contains(card.name)&&_status.event.skill!='mingguan_viewAs') return false;
                    },
                },
                ai:{
                    basic:{
                        order:10
                    }
                }
            },
            kuangxiang:{
                audio:2,
                trigger:{global:'shaBefore'},
                filter:function(event,player){
                    if (event.target == player) return player.countCards('hej') > 1;
                    if (player.countCards('hej') < 1 || event.target.countCards('hej') < 1) return false; 
                    return player.lili >= event.target.lili;
                },
                content:function(){
                    'step 0'
                    player.choosePlayerCard(trigger.target,'hej',true);
                    'step 1'
                    if (result.bool){
                        trigger.target.recast(result.cards[0]);
                        player.choosePlayerCard(player,'hej',true);
                    }
                    'step 2'
                    if (result.bool){
                        player.recast(result.cards[0]);
                        player.logSkill(event.name,result.targets);
                        if (!trigger.targets.contains(player)){
                            trigger.targets.remove(trigger.target);
                            trigger.target=player;
                            trigger.targets.push(player);
                        }
                    }
                },
                check:function(event,player){
                    if (event.target == player) return true;
                    return get.attitude(player,event.target)>0 && event.target.hp < player;
                },
            },
            mingjian:{
                audio:2,
                global:['mingjian3'],
                group:'mingjian2',
                enable:'phaseUse',
                usable:1,
                filter:function(event,player){
                    return player.getCards('h');
                },
                content:function(event,player){
                    'step 0'
                    player.chooseCard('明置出今天演奏的东西吧……','h',function(card){
                        if (player.storage.mingzhi) return !player.storage.mingzhi.contains(card);
                        else return true;
                    }).set('ai',function(card){
                        return get.useful(card);
                    });
                    'step 1'
                    if (result.bool){
                        player.mingzhiCard(result.cards[0]);
                    }
                },
                ai:{
                    order:10,
                    result:{
                        player:function(player,target){
                            return 1;
                        }
                    }
                }
            },
            mingjian2:{
                audio:2,
                enable:'phaseUse',
                filterCard:true,
                selectCard:1,
                usable:1,
                discard:false,
                prepare:'give',
                filterTarget:function(card,player,target){
                    return player!=target;
                },
                check:function(card){
                    return 7-get.value(card);
                },
                content:function(){
                    target.gain(cards,player);
                    target.mingzhiCard(cards[0]);
                    if (target.name == 'merlin'){
                        game.trySkillAudio('mingjian',player,true,4);
                    }
                    if (target.name == 'lunasa'){
                        game.trySkillAudio('mingjian',player,true,3);
                    }
                },
                prompt:'把乐谱明置出来给别人去演奏吧？',
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
                }
            },
            mingjian3:{
                direct:true,
                trigger:{global:['equipAfter','gainAfter','loseEnd']},
                filter:function(event,player){
                    return event.player == player || event.player.hasSkill('mingjian') && event.player != player;
                },
                onremove:function(player){
                    var target = game.findPlayer(function(current){
                        return current.hasSkill('mingjian') && current!=player;
                    });
                },
                content:function(){
                    var target = game.findPlayer(function(current){
                        return current.hasSkill('mingjian') && current!=player;
                    });
                    if (target){
                        if (trigger.name == 'equip'){
                            var info=get.info(trigger.card);
                            if (trigger.player == target && player.storage.mingzhi){
                                if(info.skills){
                                    for(var j=0;j<info.skills.length;j++){
                                        player.addSkill(info.skills[j]);
                                    }
                                }
                            } else if (trigger.player == player && player.storage.mingzhi){
                                if(info.skills){
                                    for(var j=0;j<info.skills.length;j++){
                                        target.addSkill(info.skills[j]);
                                    }
                                }
                            }
                        } else if (trigger.name == 'gain'){
                            if (player.storage.mingzhi && trigger.player == player && player != target){
                                var es=target.getCards('e');
                                for(var j=0;j<es.length;j++){
                                   var info=get.info(es[j]);
                                   if(info.skills){
                                        for(var h=0;h<info.skills.length;h++){
                                            player.addSkill(info.skills[h]);
                                        }
                                    }
                                }
                                var ef=player.getCards('e');
                                for(var j=0;j<ef.length;j++){
                                   var info=get.info(ef[j]);
                                   if(info.skills){
                                        for(var h=0;h<info.skills.length;h++){
                                            target.addSkill(info.skills[h]);
                                        }
                                    }
                                }
                            }
                        } else if (trigger.name == 'lose'){
                            for (var i = 0; i < trigger.cards.length; i ++){
                                if (trigger.cards[i].original == 'h' && trigger.player == player && !player.storage.mingzhi){
                                    var es=target.getCards('e');
                                    for(var j=0;j<es.length;j++){
                                       var info=get.info(es[j]);
                                       if(info.skills){
                                            for(var h=0;h<info.skills.length;h++){
                                                player.removeSkill(info.skills[h]);
                                            }
                                        }
                                    }
                                    var ef=player.getCards('e');
                                    for(var j=0;j<ef.length;j++){
                                       var info=get.info(ef[j]);
                                       if(info.skills){
                                            for(var h=0;h<info.skills.length;h++){
                                                target.removeSkill(info.skills[h]);
                                            }
                                        }
                                    }
                                }
                                if (trigger.cards[i].original == 'e'){
                                    var info=get.info(trigger.cards[i]);
                                    if (trigger.player == player && player.storage.mingzhi){
                                        if(info.skills){
                                            for(var j=0;j<info.skills.length;j++){
                                                target.removeSkill(info.skills[j]);
                                            }
                                        }
                                    } else if (trigger.player == target && player.storage.mingzhi){
                                        if(info.skills){
                                            for(var j=0;j<info.skills.length;j++){
                                                player.removeSkill(info.skills[j]);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
            },
            huanzou:{
                audio:2,
                group:'huanzou2',
                trigger:{global:['useCardBefore','respondBefore']},
                filter:function(event,player){
                    if (!event.player.storage.mingzhi) return false;
                    if (event.target == event.player && get.type(event.card) == 'equip') return false;
                    return event.player.storage.mingzhi.contains(event.card);
                },
                content:function(){
                    trigger.player.draw();
                },
                check:function(event,player){
                    return get.attitude(player,event.player) > 0;
                },
                prompt:function(event){
                    return '幻奏：是否让'+get.translation(event.player)+'摸一张牌？';
                },
            },
            huanzou2:{
                audio:'huanzou',
                trigger:{global:'discardBefore'},
                filter:function(event,player){
                    if(_status.currentPhase==event.player){
                        for(var i=0;i<event.cards.length;i++){
                            if(event.cards[i].original == 'e' || event.cards[i].original == 'j' || event.player.storage.mingzhi && event.player.storage.mingzhi.contains(event.cards[i])) return true;
                        }
                    }
                    return false;
                },
                content:function(){
                    trigger.player.draw();
                },
                check:function(event,player){
                    return get.attitude(player,event.player) > 0;
                },
                prompt:function(event){
                    return '是否让'+get.translation(event.player)+'摸一张牌？';
                },
            },
            yishan:{
                audio:2,
                direct:true,
                trigger:{player:'useCardAfter'},
                usable:1,
                filter:function(event,player){
                    return (event.card.name=='sha');
                },
                content:function(){
                    "step 0"
                    player.chooseTarget('要【一闪】斩断哪个倒霉人？',function(card,player,target){
                        if(player==target) return false;
                        return player.canUse({name:'sha'},target,false);
                    }).set('ai',function(target){
                        return get.effect(target,{name:'sha'},player, player);
                    });
                    "step 1"
                    if(result.bool){
                        player.logSkill('yishan',result.targets);
                        result.targets[0].draw();
                        if(lib.config.background_audio){
                            game.playAudio('effect','slash');
                        }
                        if (result.targets[0].name == 'yuyuko'){
                            game.trySkillAudio('yishan',player,true,3);
                        }
                        player.useCard({name:'sha'},result.targets[0],false);
                    }
                },
                check:function(){
                    return true;
                }
            },
            yinhuashan:{
                audio:3,
                cost:1,
                spell:['yinhuashan2'],
                trigger:{player:'phaseBegin'},
                filter:function(event,player){
                    return player.lili > lib.skill.yinhuashan.cost;
                },
                content:function(){
                    player.loselili(lib.skill.yinhuashan.cost);
                    player.turnOver();
                },
                check:function(event,player){
                    return player.countCards('h','sha') && player.lili > 3;
                },
            },
            yinhuashan2:{
                audio:7,
                trigger:{player:'useCard'},
                filter:function(event,player){
                    return (event.card.name=='sha' && player.lili > 0);
                },
                check:function(event,player){
                    return player.lili > 1;
                },
                content:function(){
                    "step 0"
                    var choice = ["重置一闪"];
                    if (game.hasPlayer(function(target){
                        return target!=player&&player.canUse(trigger.card,target)&&trigger.targets.contains(target)==false;
                    })){
                        choice.push('extra_target');
                    }
                    player.chooseControl(choice).set('ai',function(){
                        return '重置一闪';
                    });

                    "step 1"
                    player.loselili();
                    if (result.control == "重置一闪"){
                        if (player.storage.counttrigger) player.storage.counttrigger['yishan'] = 0;
                    } else {
                        player.chooseTarget('选择【轰！】的一名额外目标',function(card,player,target){
                            if(player==target) return false;
                            var trigger=_status.event.getTrigger();
                            return player.canUse(trigger.card,target)&&trigger.targets.contains(target)==false;
                        }).set('ai',function(target){
                            var trigger=_status.event.getTrigger();
                            var player=_status.event.player;
                            return get.effect(target,trigger.card,player,player)+1;
                        });
                    }
                    "step 2"
                    if(result.bool){
                        game.log(result.targets[0],'成为了',trigger.card,'的额外目标');
                        trigger.targets.push(result.targets[0]);
                    }
                    else{
                        event.finish();
                    }
                },
            },
            youdie:{
                audio:2,
                trigger:{player:'phaseEnd'},
                filter:function(event,player){
                    return player.countCards('hej');
                },
                content:function(){
                    "step 0"
                    player.chooseToDiscard('hej', true);
                    "step 1"
                    if(result.bool){
                        var nmax=100000;
                        var targets=[];
                        var players=game.filterPlayer();
                        players.remove(player);
                        for(var i=0;i<players.length;i++){
                            var nh2=players[i].hp;
                            if(nh2<nmax){
                                nmax=nh2;
                                targets.length=0;
                                targets.push(players[i]);
                            }
                            else if(nh2==nmax){
                                targets.push(players[i]);
                            }
                        }
                        player.line(targets,'pink');
                        for (var j=0;j<targets.length;j++){
                            targets[j].loseHp();
                        }
                    }
                },
                check:function(event,player){
                    var nmax=100000;
                    var players=game.filterPlayer();
                    players.remove(player);
                    for(var i=0;i<players.length;i++){
                        var nh2=players[i].hp;
                        if(nh2<nmax){
                            nmax=nh2;
                        }
                    }
                    return game.countPlayer(function(current){
                        if (current != player && current.hp == nmax){
                            if (get.attitude(player, current)) return -3;
                            else if (current.hp == 1) return 3;
                            else return 2;
                        }
                        return 0;
                    });
                },
                ai:{
                    threaten:1,
                },
            },
            moyin:{
                trigger:{global:'dyingBegin'},
                priority:15,
                audio:2,
                filter:function(event,player){
                    //return event.player.hp<=0;
                    return true;
                },
                content:function(){
                    "step 0"
                    player.chooseTarget('让一些人摸一张牌，然后她们不能为'+get.translation(trigger.player)+'回复体力',[1,player.maxHp-player.hp+1],function(card,player,target){
                        return true;
                    },function(target){
                        if (get.attitude(player, trigger.player) > 0){
                            if (get.attitude(target, trigger.player) > 0){
                                if (target.hasSkillTag('save') || target.countCards('h', 'tao')) return -10;
                                return get.attitude(player, target);
                            }
                        } else {
                            if (get.attitude(target, trigger.player) < 0){
                                if (target.hasSkillTag('save') || target.countCards('h', 'tao')) return 10;
                            }
                        }
                        return get.attitude(_status.event.player,target);
                    });
                    "step 1"
                    if(result.bool){
                        player.logSkill('moyin',result.targets);
                        event.targets=result.targets;
                    }
                    else{
                        event.finish();
                    }
                    "step 2"
                    for (var i = 0; i < event.targets.length; i ++){
                        event.targets[i].draw();
                        event.targets[i].addTempSkill('moyin2','dyingAfter');
                    }
                },
                ai:{
                    threaten:1.2
                }
            },
            moyin2:{
                trigger:{global:'recoverBegin'},
                mark:true,
                forced:true,
                intro:{
                    content:'防止所有回复',
                },
                filter:function(event,player){
                    return event.source == player;
                },
                content:function(){
                    game.log('墨樱：',player,'的回复无效');
                    trigger.num = 0;
                    trigger.cancel();
                    trigger.finish();
                },
                ai:{
                    effect:function(card,player){
                        if(get.tag(card,'recover')){
                            return 'zeroplayertarget';
                        }
                    }
                },
            },
            fanhundie:{
                audio:1,
                cost:1,
                spell:['fanhundie2'],
                group:'fanhundie_die',
                trigger:{player:'phaseBegin'},
                filter:function(event,player){
                    return player.lili > lib.skill.fanhundie.cost;
                },
                content:function(){
                    player.loselili(lib.skill.fanhundie.cost);
                    player.turnOver();
                },
                check:function(event,player){
                    return game.countPlayer(function(current){
                        return current.countCards('h') == 1 && -get.attitude(player, current);
                    }) || player.maxHp - player.hp >= 2;
                },
            },
            fanhundie_die:{
                audio:1,
                cost:1,
                enable:'chooseToUse',
                spell:['fanhundie2'],
              filter:function(event,player){
                 if(event.type!='dying') return false;
                 if(player!=event.dying) return false;
                 return player.lili > lib.skill.fanhundie.cost;
              },
              content:function(){
                  player.loselili(lib.skill.fanhundie.cost);
                  player.turnOver();
              },
              check:function(){
                return true;
              },
              ai:{
                order:1,
                  skillTagFilter:function(player){
                    if(player.hp>0) return false;
                  },
                  save:true,
                  result:{
                    player:function(player){
                      if(player.hp==0) return 10;
                      if(player.hp<=2&&player.countCards('he')<=1) return 10;
                      return 0;
                    }
                  },
                  threaten:function(player,target){
                    return 0.6;
                  }
              },
            },
            fanhundie2:{
                audio:2,
                trigger:{global:'phaseEnd'},
                init:function(player){
                      player.nodying=true;
                      if (player.hp <= 0) player.hp=0;
                      player.update();
                    },
                    onremove:function(player){
                      delete player.nodying;
                      if (player.hp <= 0) {
                        player.hp=0;
                        player.dying({});
                      }
                      player.update();
                    },
                filter:function(event,player){
                    return true;
                },
                content:function(){
                    "step 0"
                    event.num=player.maxHp-player.hp;
                    "step 1"
                    player.chooseTarget('反魂蝶：弃置一名角色一张牌',[1,1],function(card,player,target){
                        return target.countCards('hej')>0;
                        //return true;
                    },function(target){
                        if (target.countCards('h') == 1 && -get.attitude(player,target)) return 10;
                        return -get.attitude(player,target);
                    });
                    "step 2"
                    if(result.bool){
                        event.target = result.targets[0];                        
                        player.choosePlayerCard(event.target,'hej',true).set('ai',function(card){
                            if (event.target.countCards('h') == 1) return get.position(card) == 'h';
                            return ;
                        });
                    }
                    "step 3"
                    if(result.links){
                        var num = event.target.countCards('h');
                        if (event.target.getCards('h').contains(result.links[0]) && num == 1) event.target.loseHp();
                        event.target.discard(result.links);
                    }
                    if(event.num>1 && player.lili > 1){
                        event.num--;
                        player.loselili();
                        event.goto(1);
                    }
                },
                check:function(event, player){
                    return true;
                },
                ai:{
                    order:4,
                    result:{
                        target:-1
                    },
                },
            },
            jiubian:{
                group:['jiubian2','jiubian3'],
                enable:'chooseToUse',
                hiddenCard:function(player,name){
                    return name == 'wuxie';
                },
                filter:function(event,player){
                    return (player.num('h',{name:'tao'}) > 0);
                },
                chooseButton:{
                    dialog:function(event,player){
                        var list = [];
                        for (var i in lib.card){
                            if(lib.card[i].mode&&lib.card[i].mode.contains(lib.config.mode)==false) continue;
                            if(lib.card[i].forbid&&lib.card[i].forbid.contains(lib.config.mode)) continue;
                            if(lib.card[i].type == 'trick'){
                                list.add(i);
                            }
                        }
                        for(var i=0;i<list.length;i++){
                            list[i]=[get.type(list[i]),'',list[i]];
                        }
                        return ui.create.dialog([list,'vcard']);
                    },
                    filter:function(button,player){
                        return _status.event.getParent().filterCard({name:button.link[2]},player);
                        //return lib.filter.filterCard({name:button.link[2]},player,_status.event.getParent()) && !player.storage.muqi.contains(button.link[2]);
                    },
                    check:function(button){
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
                        return (button.link[2]=='wuzhong')?1:-1;
                    },
                    backup:function(links,player){
                        return {
                            filterCard:function(card,player){
                                return (card.name == 'tao');
                            },
                            position:'h',
                            selectCard:1,
                            audio:2,
                            popname:true,
                            viewAs:{name:links[0][2]},
                        }
                    },
                    prompt:function(links,player){
                        return '将一张葱当作'+get.translation(links[0][2])+'使用';
                    }
                },
                ai:{
                    order:1,
                    result:{
                        player:0.5,
                    },
                },
            },
            jiubian2:{
                enable:'chooseToUse',
                audio:2,
                filter:function(event,player){
                    return true;
                },
                filterCard:function(card){
                    return get.type(card)=='trick';
                },
                position:'h',
                viewAs:{name:'tao'},
                prompt:'将一张法术牌当葱喂出去',
                check:function(card){return 15-get.value(card)},
                ai:{
                    skillTagFilter:function(player){
                        return player.countCards('h',{type:'trick'})>0&&_status.currentPhase!=player;
                    },
                    threaten:1.3,
                    save:true,
                    respondTao:true,
                }
            },
            jiubian3:{
                trigger:{player:'useCard'},
                audio:2,
                filter:function(event,player){
                    if (event.targets.length > 1) return false;
                    return event.skill=='jiubian_backup'||event.skill=='jiubian2';
                },
                content:function(){
                    'step 0'
                    player.chooseTarget('是否改变'+get.translation(trigger.card)+'的来源或目标？',function(card,player,target){
                        return target.canUse(trigger.card, trigger.targets[0]) || player.canUse(trigger.card, target);
                    }).set('ai',function(target){
                        return get.attitude(_status.event.player,target);
                    });
                    'step 1'
                    if (result.bool && result.targets.length){
                        event.target = trigger.targets[0];
                        var list = [];
                        if (result.targets[0].canUse(trigger.card, trigger.targets[0])){
                            list.push('来源');
                        }
                        if (player.canUse(trigger.card, result.targets[0])){
                            list.push('目标');
                        }
                        player.chooseControl(list,function(){
                            return '来源';
                        }).set('prompt','令'+get.translation(result.targets[0])+'成为'+get.translation(trigger.card)+'的：');
                    }
                    'step 2'
                    if (result.bool && result.control){
                        if (result.control == '来源'){
                            game.delay();
                            trigger.untrigger();
                            trigger.player=event.target;
                            trigger.trigger('useCard');
                            game.log(event.target,'成为了',trigger.card,'的使用者');
                        } else if (result.control == '目标'){
                            delete trigger.targets;
                            trigger.targets = [event.target];
                        }
                    }
                },
                check:function(event,player){
                    return false;
                },
            },
            shiqu:{
                audio:2,
                usable:1,
                enable:'phaseUse',
                filter:function(event,player){
                    return player.countCards('hej')>0;
                },
                filterCard:function(card){
                    return true;
                },
                selectCard:1,
                position:'hej',
                check:function(card){
                    if (get.bonus(card) > 0) return 10;
                    return 6-get.useful(card);
                },
                content:function(){
                    'step 0'
                    player.recast(cards[0]); 
                    if (get.bonus(cards[0]) > 0){
                        player.chooseTarget('令一名角色获得'+get.bonus(cards[0])+'点灵力',1,function(card,player,target){
                            return true;
                        }).set('ai',function(target){
                            var att=get.attitude(_status.event.player,target);
                            if(att>2){
                                return 5-target.lili >= get.bonus(cards[0]);
                            }
                            return att/3;
                        });
                    }
                    'step 1'
                    if (result.targets){
                        result.targets[0].gainlili(get.bonus(cards[0]));
                        if (result.targets[0].name == 'yukari') game.trySkillAudio('shiqu',result.targets[0],true,3);
                        if (result.targets[0].name == 'chen') game.trySkillAudio('shiqu',result.targets[0],true,4);
                        if (result.targets[0] != player){
                            result.targets[0].addTempSkill('shiqu2',{player:'phaseBegin'});
                            player.addTempSkill('shiqu2',{player:'phaseBegin'});
                        }
                    }
                },
                discard:false,
                lose:false,
                ai:{
                    basic:{
                        order:1
                    },
                    result:{
                        player:0.5,
                    },
                }
            },
            shiqu2:{
                mark:true,
                intro:{
                    content:'可以与蓝py',
                },
                trigger:{player:'loseliliBefore'},
                filter:function(event,player){
                    if (event.getParent().name == 'shiqu2') return false;
                    var players = game.filterPlayer();
                    for (var i = 0; i < players.length; i ++){
                        if (players[i].hasSkill('shiqu2') && players[i] != player) return true;
                    }
                    return false;
                },
                content:function(){
                    'step 0'
                    player.chooseTarget('让蓝帮你支付灵力？',1,function(card,player,target){
                            return target != player && target.hasSkill('shiqu2');
                        }).set('ai',function(target){
                            return get.attitude(_status.event.player,target) && target.lili > _status.event.player.lili;
                        });
                    'step 1'
                    if (result.bool && result.targets.length){
                        result.targets[0].removeSkill('shiqu2');
                        result.targets[0].loselili(trigger.num);
                        result.targets[0].addTempSkill('shiqu2',{player:'phaseBegin'});
                        trigger.cancel();
                    }
                },
                check:function(event,player){
                    return true;
                },
            },
            tianhugongzhu:{
                audio:2,
                cost:3,
                spell:['tianhugongzhu_1'],
                trigger:{player:'phaseBegin'},
                roundi:true,
                check:function(event,player){
                    if (player.countCards('h') > player.hp) return false;
                    return player.hp < player.maxHp;
                },
                filter:function(event,player){
                    return player.lili > lib.skill.tianhugongzhu.cost;
                },
                content:function(){
                    'step 0'
                    player.loselili(lib.skill.tianhugongzhu.cost);
                    player.turnOver();
                    player.chooseTarget([1,1],'令一名角色与你一同回复1点体力',function(card,player,target){
                        return target != player;
                    },true).set('ai',function(target){
                        return get.attitude(_status.event.player,target) && target.hp < target.maxHp;
                    });
                    'step 1'
                    if (result.bool){
                        player.logSkill('tianhugongzhu',result.targets);
                        result.targets[0].recover();
                        player.recover();
                        result.targets[0].addTempSkill('tianhugongzhu_2');
                    }
                },
            },
            tianhugongzhu_1:{
            },
            tianhugongzhu_2:{
                audio:2,
                trigger:{player:'loseliliBefore'},
                filter:function(event,player){
                    return player.hp > event.num;
                },
                content:function(){
                    player.loseHp(trigger.num);
                    trigger.cancel();
                },
                check:function(){
                    return false;
                },
                prompt2:'你可以失去体力，代替消耗灵力值',
            },
            huanjing:{
                trigger:{global:'phaseBegin'},
                audioname:['reimu'],
                audio:2,
                filter:function(event,player){
                    return player.countCards('hej') && !game.dead.contains(event.player);
                },
                check:function(event,player){
                    if(player.countCards('hej')<3) return false;
                    var card = ui.cardPile.childNodes[ui.cardPile.childNodes.length-1];
                    /*
                    if (get.subtype(card) == 'attack' || get.subtype(card) == 'disrupt') return get.attitude(player,event.player) < 0;
                    if (get.type(card) == 'equip' || get.subtype(card) == 'support') return get.attitude(player,event.player) > 0;
                    */
                    if (!card) return false;
                    if (player.canUse(card,event.player)) return get.effect(event.player,{name:card.name}, player, player) > 0;
                    return false;
                },
                content:function(){
                    'step 0'
                    player.chooseToDiscard(true,'hej',get.prompt('huanjing')).ai=function(){
                        return true;
                    }
                    'step 1'
                    if(result.bool){
                        var current = _status.currentPhase;
                        if (current.name == 'yuyuko' && player.name == 'yukari') game.trySkillAudio('huanjing',current,true,3);
                        if (current.name == 'renko' && player.name == 'yukari' ) game.trySkillAudio('huanjing',player,true,4);
                        if (current.name == 'meribel' && player.name == 'yukari') game.trySkillAudio('huanjing',current,true,5);
                        if (current.name == 'reimu' && player.name == 'yukari') game.trySkillAudio('huanjing',current,true,6);
                        event.cards = [];
                        event.cards.push(ui.cardPile.childNodes[ui.cardPile.childNodes.length-1]);
                        player.showCards(event.cards[0]);
                        if (get.type(event.cards[0]) != 'equip'){
                            //if (!player.canUse(event.cards[0],current,false)) return false;
                            if (!lib.filter.targetEnabled2(event.cards[0],player,current)){
                                player.discard(event.cards[0]);
                            } else {
                                player.useCard(event.cards[0],current,false); 
                            }
                        } else if (get.type(event.cards[0]) == 'equip'){
                            current.equip(event.cards[0]);
                        }
                    }
                }
            },
            mengjie:{
                trigger:{player:'phaseUseBegin', target:'useCardToBegin'},
                audio:2,
                filter:function(event,player){
                    if (event.card) return get.subtype(event.card) == 'attack';
                    else return true;
                },
                content:function(event,player){
                    "step 0"
                    if(player.isUnderControl()){
                        game.modeSwapPlayer(player);
                    }
                    var cards=[];
                    for (var i = 3; i > 0; i--){
                        if (ui.cardPile.childNodes.length < i){
                            var card = get.cards(i);
                            //ui.cardPile.insertBefore(card,ui.cardPile.firstChild);
                        }
                        cards.push(ui.cardPile.childNodes[ui.cardPile.childNodes.length-i]);
                    }
                    event.cards=cards; 
                    var switchToAuto=function(){
                        _status.imchoosing=false;
                        if(event.dialog) event.dialog.close();
                        if(event.control) event.control.close();
                        var top=[];
                        var stopped=false;
                        var bottom;
                        if(!stopped){
                            cards.sort(function(a,b){
                                return get.value(b,player)-get.value(a,player);
                            });
                            while(cards.length){
                                if(get.value(cards[0],player)<=5) break;
                                top.unshift(cards.shift());
                            }
                        }
                        bottom=cards;
                        for(var i=0;i<top.length;i++){
                            ui.cardPile.insertBefore(top[i],ui.cardPile.firstChild);
                        }
                        for(var i=0;i<bottom.length;i++){
                            ui.cardPile.appendChild(bottom[i]);
                        }
                        player.popup(get.cnNumber(top.length)+'上'+get.cnNumber(bottom.length)+'下');
                        game.log(player,'将'+get.cnNumber(top.length)+'张牌置于牌堆顶');
                        game.delay(2);
                    };
                    var chooseButton=function(online,player,cards){
                        var event=_status.event;
                        player=player||event.player;
                        cards=cards||event.cards;
                        event.top=[];
                        event.bottom=[];
                        event.status=true;
                        event.dialog=ui.create.dialog('牌堆底的牌（底部从右到左）<br>按顺序选择置于牌堆顶的牌（先选择的在上）',cards);
                        for(var i=0;i<event.dialog.buttons.length;i++){
                            event.dialog.buttons[i].classList.add('pointerdiv');
                        }
                        event.switchToAuto=function(){
                            event._result='ai';
                            event.dialog.close();
                            event.control.close();
                            _status.imchoosing=false;
                        },
                        event.control=ui.create.control('ok','pileTop','pileBottom',function(link){
                            var event=_status.event;
                            if(link=='ok'){
                                if(online){
                                    event._result={
                                        top:[],
                                        bottom:[]
                                    }
                                    for(var i=0;i<event.top.length;i++){
                                        event._result.top.push(event.top[i].link);
                                    }
                                    for(var i=0;i<event.bottom.length;i++){
                                        event._result.bottom.push(event.bottom[i].link);
                                    }
                                }
                                else{
                                    var i;
                                    for(i=0;i<event.top.length;i++){
                                        ui.cardPile.insertBefore(event.top[i].link,ui.cardPile.firstChild);
                                    }
                                    for(i=0;i<event.bottom.length;i++){
                                        ui.cardPile.appendChild(event.bottom[i].link);
                                    }
                                    for(i=0;i<event.dialog.buttons.length;i++){
                                        if(event.dialog.buttons[i].classList.contains('glow')==false&&
                                            event.dialog.buttons[i].classList.contains('target')==false)
                                        ui.cardPile.appendChild(event.dialog.buttons[i].link);
                                    }
                                    player.popup(get.cnNumber(event.top.length)+'上'+get.cnNumber(event.cards.length-event.top.length)+'下');
                                    game.log(player,'将'+get.cnNumber(event.top.length)+'张牌置于牌堆顶');
                                }
                                event.dialog.close();
                                event.control.close();
                                game.resume();
                                _status.imchoosing=false;
                            }
                            else if(link=='pileTop'){
                                event.status=true;
                                event.dialog.content.childNodes[0].innerHTML='按顺序选择置于牌堆顶的牌';
                            }
                            else{
                                event.status=false;
                                event.dialog.content.childNodes[0].innerHTML='按顺序选择置于牌堆底的牌';
                            }
                        })
                        for(var i=0;i<event.dialog.buttons.length;i++){
                            event.dialog.buttons[i].classList.add('selectable');
                        }
                        event.custom.replace.button=function(link){
                            var event=_status.event;
                            if(link.classList.contains('target')){
                                link.classList.remove('target');
                                event.top.remove(link);
                            }
                            else if(link.classList.contains('glow')){
                                link.classList.remove('glow');
                                event.bottom.remove(link);
                            }
                            else if(event.status){
                                link.classList.add('target');
                                event.top.unshift(link);
                            }
                            else{
                                link.classList.add('glow');
                                event.bottom.push(link);
                            }
                        }
                        event.custom.replace.window=function(){
                            for(var i=0;i<_status.event.dialog.buttons.length;i++){
                                _status.event.dialog.buttons[i].classList.remove('target');
                                _status.event.dialog.buttons[i].classList.remove('glow');
                                _status.event.top.length=0;
                                _status.event.bottom.length=0;
                            }
                        }
                        game.pause();
                        game.countChoose();
                    };
                    event.switchToAuto=switchToAuto;

                    if(event.isMine()){
                        chooseButton();
                        event.goto(2);
                    }
                    else if(event.isOnline()){
                        event.player.send(chooseButton,true,event.player,event.cards);
                        event.player.wait();
                        game.pause();
                    }
                    else{
                        event.switchToAuto();
                        event.goto(2);
                    }
                    "step 1"
                    if(event.result=='ai'||!event.result){
                        event.switchToAuto();
                    }
                    else{
                        var top=event.result.top||[];
                        var bottom=event.result.bottom||[];
                        for(var i=0;i<top.length;i++){
                            ui.cardPile.insertBefore(top[i],ui.cardPile.firstChild);
                        }
                        for(i=0;i<bottom.length;i++){
                            ui.cardPile.appendChild(bottom[i]);
                        }
                        for(i=0;i<event.cards.length;i++){
                            if(!top.contains(event.cards[i])&&!bottom.contains(event.cards[i])){
                                ui.cardPile.appendChild(event.cards[i]);
                            }
                        }
                        player.popup(get.cnNumber(top.length)+'上'+get.cnNumber(event.cards.length-top.length)+'下');
                        game.log(player,'将'+get.cnNumber(top.length)+'张牌置于牌堆顶');
                        game.delay(2);
                    }
                    "step 2"
                    if (player!=_status.currentPhase){
                        player.chooseBool('是否发动【梦界】摸一张牌？').set('choice',true);
                    }
                    'step 3'
                    if (result.bool){
                        player.draw();
                    }
                },
            },
            mengjing:{
                audio:2,
                cost:4,
                spell:['mengjing2'],
                roundi:true,
                trigger:{player:'phaseBeginStart'},
                filter:function(event,player){
                    return player.lili > lib.skill.mengjing.cost;
                },
                content:function(){
                    player.loselili(lib.skill.mengjing.cost);
                    player.turnOver();
                },
                check:function(){
                    return false;
                },
            },
            mengjing2:{
                forced:true,
                trigger:{player:'phaseBegin'},
                content:function(){
                    'step 0'
                    player.chooseTarget([1,1],'选择一名角色一同与你进入幻想与现实的隙间中——',function(card,player,target){
                        return target != player;
                    },true).set('ai',function(target){
                        return get.attitude(_status.event.player,target);
                    });
                    'step 1'
                    if (result.bool){
                        player.logSkill('mengjing',result.targets);
                        var players = game.filterPlayer();
                        players.remove(result.targets[0]);
                        players.remove(player);
                        for (var i = 0; i < players.length; i ++){
                            players[i].addSkill('chuwai');
                        }
                    }
                },
                onremove:function(player){
                    var players = game.players;
                    for (var i = 0; i < players.length; i ++){
                        players[i].removeSkill('chuwai');
                    }
                },
            },
        },
		translate:{
            letty:'蕾蒂',
            shuangjiang:'霜降',
            shuangjiang_info:'结束阶段，你可以对本回合成为过牌的目标，且没有使用/打出过牌的所有角色造成1点灵击伤害。',
            shuangjiang_audio1:'冬天来了！……阿嚏！',
            shuangjiang_audio2:'怎么，这就觉得太冷了吗？',
            baofengxue:'暴风雪之眼',
            baofengxue2:'暴风雪之眼',
            baofengxue3:'暴风雪之眼',
            baofengxue_audio1:'这是我新的符卡！',
            baofengxue_audio2:'感受一下自然的力量吧！',
            baofengxue_info:'符卡技（2）你使用一张牌时，可以令其他角色不能使用/打出与之相同花色的牌，直到结束阶段；【霜降】中的“结束阶段”视为“你使用牌时，和结束阶段”。',
            letty_die:'（擦鼻涕）这种天气算哪门子的冬天啊。',
            chen:'橙',
            mingdong:'鸣动',
            mingdong2:'鸣动',
            mingdong_info:'一回合一次，你成为牌的目标后，你可以声明一种基本牌：你可以将法术牌当作该牌使用或打出，直到回合结束。',
            mingdong_audio1:'喵？',
            mingdong_audio2:'喵喵？',
            mingdong_audio3:'喵喵喵？',
            shihuo:'式获',
            shihuo_info:'一回合一次，你获得1点灵力值后，可以令一名角色获得1点灵力值。',
            shihuo_audio1:'喵呜~',
            shihuo_audio2:'喵帕斯！……喵？',
            shihuo_audio3:'橙也渐渐懂事起来了啊w',
            shihuo_audio4:'（揉揉橙）',
            shuanggui:'青鬼赤鬼',
            shuanggui_audio1:'鬼符「青鬼赤鬼」!',
            shuanggui_audio2:'不要因为我是猫就小看我了喵！',
            shuanggui4:'鬼',
            shuanggui_info:'符卡技（2）<永续>准备阶段，你指定一名其他角色，与其各摸一张牌；该角色需要消耗灵力时，须改为消耗你的灵力。',
            chen_die:'蓝大人不会放过你的！',
            alice:'爱丽丝',
            huanfa:'幻法',
            huanfa_bg:'手',
            huanfa_info:'弃牌阶段开始时，若“手办”数小于场上角色数，你可以将一至两张牌扣置于角色牌上，称为“手办”，并摸等量张牌。',
            huanfa_audio1:'表演正在准备中，请稍微片刻。',
            huanfa_audio2:'嗯？已经等不及了么？',
            mocai:'魔彩',
            mocai_audio1:'上海，该开始表演啦。',
            mocai_audio2:'哎，蓬莱把【躲～】拿哪儿去了？',
            mocai_info:'你攻击范围内的一名角色成为攻击牌的目标后，你可以选择一项：将一张“手办”置于其区域内；或弃置一张“手办”，观看技能牌堆顶的三张牌，并将其中一张交给目标。',
            hanghourai:'上吊的蓬莱人形',
            hanghourai_audio1:'诅咒「上吊的蓬莱人偶」!',
            hanghourai_audio2:'表演现在才刚刚开始哟！',
            hanghourai1:'上吊的蓬莱人形',
            hanghourai1_audio1:'你只不过是一名演员而已。',
            hanghourai1_audio2:'一切都是我的掌控之中。',
            hanghourai_info:'符卡技（2）<永续> 符卡发动时，你可以将任意张手牌扣置为“手办”，并摸等量牌；一名角色的结束阶段，你可以交给其一张“手办”；若其可以使用该牌，你令其使用之，目标由你指定。',
            alice_die:'谢谢大家观赏。',
            lilywhite:'莉莉白',
            chunxiao:'春晓',
            chunxiao_info:'准备阶段，若你的灵力值不小于体力值，你可以令所有角色各摸一张牌，然后各弃置与其最近的一名角色一张牌。',
            chunxiao_audio1:'春天到了！',
            chunxiao_audio2:'<u><b>春！天！到！了！</u></b>',
            chunxiao_audio3:'是你！春天对决，来吧！',
            mengya:'萌芽',
            mengya_info:'一回合两次，出牌阶段，你可以选择一项：获得1点灵力，然后弃置一张牌；或消耗1点灵力，然后摸一张牌。',
            mengya_audio1:'春天是万物复苏的季节！',
            mengya_audio2:'春天是风调雨顺的季节！',
            lilywhite_die:'哎，立春早就过掉了？',
            lunasa:'露娜萨',
            shenxuan:'神弦',
            shenxuan_audio1:'（🎻）',
            shenxuan_audio2:'仔细的聆听吧，这神魂飘荡的旋律。',
            shenxuan_info:'一回合一次，出牌阶段，你可以明置一张手牌；每名角色一回合一次，其可以将一张【轰！】当作与你一张非装备明置手牌同名的牌使用/打出。',
            shenxuan_viewAs:'神弦（转化）',
            zhenhun:'镇魂',
            zhenhun_info:'一名角色的结束阶段，你可以选择一项：1. 获得其本回合因弃置而进入弃牌堆的一张牌，并明置之；2. 交给一名其一张明置牌。',
            zhenhun_audio1:'这是献给你的镇魂曲。',
            zhenhun_audio2:'……别这样看我啦，我不会一把大火烧死你的。<br> 至于掉所有人血的话……',
            lunasa_die:'呜咕咕咕咕……',
            merlin:'梅露兰',
            mingguan:'冥管',
            mingguan_audio1:'（🎺）',
            mingguan_audio2:'♪(´ε｀ )',
            mingguan_viewAs:'冥管（转化）', 
            mingguan_info:'一回合一次，出牌阶段，你可以明置一张手牌；你攻击范围内的角色的与你的明置手牌同名的手牌均视为【轰！】。',
            kuangxiang:'狂想',
            kuangxiang_audio1:'这就是献给你的狂想曲~！',
            kuangxiang_audio2:'ヽ(ﾟ∀ﾟ*)ﾉ━━━ｩ♪',
            kuangxiang_info:'一回合一次，灵力值不大于你的一名角色成为【轰！】的目标时，你可以重铸你与其各一张牌；然后，若目标不包括你，将目标转移给你。',
            merlin_die:'°(°ˊДˋ°) °',
            lyrica:'莉莉卡',
            mingjian:'冥键',
            mingjian2:'冥键（给别人）',
            mingjian_audio1:'（🎹）',
            mingjian_audio2:'钢琴可是乐器之王哟~',
            mingjian_audio3:'大姐，我不会演奏这个曲子，帮下忙呗~',
            mingjian_audio4:'二姐，那个人欺负我，可以揍她吗~',
            mingjian_info:'一回合各一次，出牌阶段，你可以明置一张手牌，或将一张牌交给一名其他角色并明置；你视为拥有所有有明置手牌的其他角色的装备技能；有明置手牌的其他角色视为拥有你的装备技能。',
            huanzou:'幻奏',
            huanzou_audio1:'这是献给你的幻奏曲。',
            huanzou_audio2:'不客气哟。',
            huanzou_info:'一名角色因使用，打出，或在自己回合内弃置而失去一张明置牌时，你可以令其摸一张牌。',
            lyrica_die:'下次我带姐姐一起来！',
            hezou:'棱镜协奏曲',
            hezou_2:'棱镜协奏曲',
            hezou_skill:'棱镜协奏曲',
            hezou_skill_audio1:'合葬「棱镜协奏曲」。',
            hezou_skill_audio2:'这就是我们三姐妹的羁绊！',
            hezou_skill_merlin_audio1:'ლ(╹◡╹ლ)来啊辣鸡ლ(╹◡╹ლ)',
            hezou_skill_merlin_audio2:'合葬「棱镜协奏曲」~♪',
            hezou_skill_lyrica_audio1:'唔，姐姐们，来帮下忙？',
            hezou_skill_lyrica_audio2:'合葬「棱镜协奏曲」——！',
            hezou_info:'符卡技（2）<瞬发>你成为一张【轰！】的目标时，可以选择一项：令之对你无效；或为之额外指定两名目标。',
            youmu:'妖梦',
            yishan:'一闪',
            yishan_info:'一回合一次，你使用【轰！】结算完毕后，你可以令一名角色摸一张牌，视为对其使用一张无视装备的【轰！】。',
            yishan_audio1:'一刀两断！',
            yishan_audio2:'斩！',
            yishan_audio3:'幽幽子大人！不是叫您不要吃那个了吗！',
            yinhuashan:'六根清静斩',
            yinhuashan2:'六根清静斩',
            yinhuashan_info:'符卡技（1）你使用【轰！】指定目标时，可以消耗1点灵力，并选择一项：额外指定一名目标角色，或重置【一闪】。',
            yinhuashan_audio1:'妖怪锻造的这把剑，斩不断的东西根本没有！',
            yinhuashan_audio2:'我的名字是魂魄妖梦！幽幽子大人之剑！',
            yinhuashan_audio3:'空观剑「六根清净斩」!',
            // 众所周知，六根有七个是常识
            yinhuashan2_audio1:'斩眼根！',
            yinhuashan2_audio2:'斩耳根！',
            yinhuashan2_audio3:'斩鼻根！',
            yinhuashan2_audio4:'斩舌根！',
            yinhuashan2_audio5:'斩身根！',
            yinhuashan2_audio6:'斩意根！',
            yinhuashan2_audio7:'斩命根！',
            'refresh':'重置',
            'extra_target':'额外目标',
            youmu_die:'幽幽子大人的晚饭又要延后了……',
            yuyuko:'幽幽子',
            youdie:'幽蝶',
            youdie_info:'结束阶段，你可以弃置一张牌，令其他角色中所有体力值最低的角色各失去1点体力。',
            youdie_audio1:'走远了呢~',
            youdie_audio2:'很快就要再见哟~',
            moyin:'墨樱',
            moyin2:'墨樱',
            moyin2_bg:'死',
            moyin_info:'一名角色进入决死状态时，你可以令至多X名角色各摸一张牌；若如此做，此次决死结算中，防止这些角色为来源的回复体力（X为你已受伤值+1）。',
            moyin_audio1:'biu~',
            moyin_audio2:'死神小姐，快来收尸了哟~',
            fanhundie:'反魂蝶',
            fanhundie_die:'反魂蝶',
            fanhundie_audio1:'应该能不体会自身悲惨的境遇就度过每一日吧 如果是在那个没有出家风俗的世界的话',
            fanhundie2:'反魂蝶',
            fanhundie_info:'符卡技（1）<终语>你不会坠机；当前回合的结束阶段，你可以：弃置一名角色的一张牌，其以此法失去最后的手牌后，其失去1点体力；然后你须消耗1点灵力并重复此流程，直到灵力为1，或重复第X次（X为你已受伤值）。',
            yuyuko_die:'啊——那就这样了吧。',
            ran:'蓝',
            jiubian:'九变',
            jiubian2:'九变（法术→葱）',
            jiubian3:'九变（变更目标/来源）',
            jiubian_info:'你可以将一张法术牌当作【葱】，或将一张【葱】当作一种法术牌使用；你以此法使用牌指定目标时，可以指定一名角色，将目标或来源改为其。',
            jiubian_backup_audio1:'我可不知道什么72变的猴子。',
            jiubian_backup_audio2:'没事，不费吹灰之力。',
            jiubian2_audio1:'别担心，我来助你一尾之力。',
            jiubian2_audio2:'没事没事，我在呢（摸摸）。',
            shiqu:'式取',
            shiqu_info:'一回合一次，出牌阶段，你可以重铸一张牌；若该牌有灵力，你可以令一名角色获得等量的灵力；若如此做，直到你的准备阶段：你或其需要消耗灵力时，可以改为由对方消耗灵力。',
            shiqu_audio1:'先说清楚，这可不是什么结婚宣言啊？',
            shiqu_audio2:'我想想……',
            shiqu_audio3:'蓝可真是不错呢，谢谢。',
            shiqu_audio4:'谢谢你蓝大人！',
            shiqu2:'式取（py）',
            shiqu2_bg:'式',
            tianhugongzhu:'天狐公主 -illusion-',
            tianhugongzhu_audio1:'传说中的四大魔兽，九尾妖狐——见识一下力量吧？',
            tianhugongzhu_audio2:'有的事情，即使是最强的魔兽也受不了啊……',
            tianhugongzhu_info:'符卡技（3）<永续>准备阶段，你指定一名其他角色，与其各回复1点体力；该角色需要消耗灵力时，可以改为失去等量的体力值。',
            tianhugongzhu_2:'天狐公主（氪血）',
            ran_die:'紫大人不会放过你的！',
            yukari:'紫',
            huanjing:'幻境',
            huanjing_info:'一名角色的准备阶段，你可以弃置一张牌，然后展示牌堆底的牌；若该角色可以成为该牌的目标，将之对其使用；若为装备牌，将之置于其装备区内；否则，弃置之。',
            pileTop:'牌堆顶',
            pileBottom:'牌堆底',
            huanjing_audio1:'来，见识一下隙间的尽头吧？',
            huanjing_audio2:'下面的应该不是【决斗】来着？',
            huanjing_audio3:'紫，这次又想搞什么事了？',
            huanjing_audio4:'你这次可是跑到了个不该来的地方呢。',
            huanjing_audio5:'啊，是你——',
            huanjing_audio5:'紫你很烦啊，怎么又来了？',
            mengjie:'梦界',
            mengjie_info:'出牌阶段开始时，或你成为攻击牌的目标后，你可以观看牌堆底的三张牌，并可以将其中任意张置于牌堆顶；若此时为回合外，你可以摸一张牌。',
            mengjie_audio1:'呼呼呼呼呼——',
            mengjie_audio2:'嗯？说好的要尊重老人呢？',
            mengjing:'梦境与现实的诅咒',
            mengjing_info:'符卡技（4）<永续>准备阶段，你指定一名其他角色；你与其以外的所有角色视为不在游戏内；所有角色的胜利条件无效。',
            yukari_die:'刚睡醒真的没劲……继续回去睡了……',
        },
	};
});
