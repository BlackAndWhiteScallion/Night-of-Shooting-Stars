game.import('card',function(lib,game,ui,get,ai,_status){
	return {
		name:'random',
		connect:false,
        card:{
            holysword:{
                fullskin:true,
                type:'equip',
                subtype:'equip1',
                cost:5,
                ai:{
                    basic:{
                        equipValue:10
                    }
                },
                skills:['ziheng_skill','jinu_skill','lianji_skill'],
            },
            spell_wuyashenxiang:{
                type:'trick',
                subtype:'support',
                fullimage:true,
                enable:true,
                cost:-1,
                filterTarget:function(card,player,target){
                    return target==player;
                },
                selectTarget:-1,
                content:function(){
                    'step 0'
                    player.chooseControl('法术牌','基本牌').ai=function(){
                        return Math.random()<0.5?'法术牌':'基本牌';
                    }
                    'step 1'
                    var list=[];
                    var bool=(result.control=='法术牌');
                    for(var i in lib.card){
                        if(bool){
                            if(lib.card[i].type=='trick'){
                                list.push(i);
                            }
                        }
                        else{
                            if(lib.card[i].type=='basic'){
                                list.push(i);
                            }
                        }
                    }
                    list=list.randomGets(3);
                    var cards=[];
                    for(var i=0;i<list.length;i++){
                        cards.push(game.createCard(list[i]));
                    }
                    player.chooseCardButton(cards,'选择一张加入手牌',true);
                    'step 2'
                    player.gain(result.links,'draw');
                },
                ai:{
                    order:2,
                    value:5,
                    useful:5,
                    result:{
                        player:1
                    },
                }
            },
            spell_xiaoshi:{
                type:'trick',
                subtype:'disrupt',
                fullimage:true,
                enable:true,
                cost:-2,
                selectTarget:1,
                filterTarget:function(card,player,target){
                    return true;
                },
                content:function(){
                    'step 0'
                    target.gain(target.getCards('e'),'gain2');
                    'step 1'
                    var dh=target.countCards('h')-player.countCards('h');
                    if(dh>0){
                        target.discard(target.getCards('h').randomGets(dh));
                    }
                },
                ai:{
                    order:1,
                    value:1,
                    useful:1,
                    result:{
                        target:function(player,target){
                            if(target.countCards('he')>=player.countCards('h')) return -1;
                            return 0;
                        }
                    }
                }
            },
            spell_piaoqie:{
                type:'trick',
                subtype:'disrupt',
                fullimage:true,
                enable:true,
                cost:-1,
                filterTarget:function(card,player,target){
                    return target!=player && target.countCards('h');
                },
                selectTarget:1,
                content:function(){
                    var cards=target.getCards('h').randomGets(2);
                    var list=[];
                    for(var i=0;i<cards.length;i++){
                        list.push(game.createCard(cards[i]));
                    }
                    if(list.length){
                        player.gain(list,'draw');
                    }
                },
                ai:{
                    order:0.5,
                    result:{
                        player:1
                    }
                }
            },
            gw_xinsheng:{
                type:'trick',
                subtype:'disrupt',
                fullimage:true,
                enable:function(card,player){
                    return game.hasPlayer(function(current){
                        return !current.isUnseen();
                    });
                },
                selectTarget:1,
                filterTarget:function(){
                    return true;
                },
                contentBefore:function(){
                    player.$skill('新生','legend','metal', true);
                    game.delay(2);
                },
                content:function(){
                    'step 0'
                    event.aitarget=target;
                    var list=[];
                    for(var i in lib.character){
                        if(!lib.filter.characterDisabled(i)&&!lib.filter.characterDisabled2(i)){
                            list.push(i);
                        }
                    }
                    var players=game.players.concat(game.dead);
                    for(var i=0;i<players.length;i++){
                        list.remove(players[i].name);
                        list.remove(players[i].name1);
                        list.remove(players[i].name2);
                    }
                    var dialog=ui.create.dialog('选择一张角色牌','hidden');
                    dialog.add([list.randomGets(12),'character']);
                    player.chooseButton(dialog,true).ai=function(button){
                        if(get.attitude(player,event.aitarget)>0){
                            return get.rank(button.link,true);
                        }
                        else{
                            return -get.rank(button.link,true);
                        }
                    };
                    'step 1'
                    event.nametarget=result.links[0];
                    var hp=target.hp;
                    target.reinit(target.name,event.nametarget);
                    target.hp=Math.min(hp,target.maxHp);
                    target.update();
                    player.line(target,'green');
                    'step 3'
                    game.triggerEnter(target);
                },
                contentAfter:function(){
                    var evt=_status.event.getParent('phaseUse');
                    if(evt&&evt.name=='phaseUse'){
                        evt.skipped=true;
                    }
                },
                ai:{
                    value:8,
                    useful:[6,1],
                    result:{
                        player:1
                    },
                    order:0.5,
                }
            },
            gw_zumoshoukao:{
                type:'trick',
                fullimage:true,
                subtype:'disrupt',
                enable:true,
                filterTarget:function(card,player,target){
                    return !target.hasSkill('fengyin');
                },
                content:function(){
                    target.addTempSkill('fengyin');
                },
                ai:{
                    value:[4.5,1],
                    useful:[4,1],
                    result:{
                        target:function(player,target){
                            var threaten=get.threaten(target,player,true);
                            if(target.hasSkill('fengyin')){
                                return 0;
                            }
                            if(target.hasSkillTag('maixie_hp')){
                                threaten*=1.5;
                            }
                            return -threaten;
                        }
                    },
                    order:9.5,
                }
            },
            gw_youer:{
                type:'trick',
                subtype:'disrupt',
                enable:true,
                fullimage:true,
                filterTarget:function(card,player,target){
                    return target!=player&&target.countCards('h')>0;
                },
                content:function(){
                    'step 0'
                    var cards=target.getCards('h');
                    target.lose(cards,ui.special);
                    target.storage.gw_youer=cards;
                    target.addSkill('gw_youer');
                    'step 1'
                    player.draw();
                },
                ai:{
                    basic:{
                        order:10,
                        value:7,
                        useful:[3,1],
                    },
                    result:{
                        target:function(player,target){
                            if(target.hasSkillTag('noh')) return 3;
                            var num=-Math.sqrt(target.countCards('h'));
                            if(player.hasSha()&&player.canUse('sha',target)){
                                num-=2;
                            }
                            return num;
                        },
                    },
                }
            },
            sv_dshift:{
                audio:true,
                fullimage:true,
                type:'trick',
                subtype:'support',
                enable:true,
                cost:-4,
                selectTarget:-1,
                filterTarget:function(card,player,target){
                    return target==player && player.lili > 4;
                },
                modTarget:true,
                content:function(){
                    target.addSkill('chaoyue_skill');
                },
                ai:{
                    basic:{
                        order:1,
                        useful:7,
                        value:9.2
                    },
                    result:{
                        target:3,
                    },
                    tag:{
                        draw:2
                    }
                }
            },
            sv_alterfate:{
                audio:true,
                fullimage:true,
                type:'trick',
                subtype:'support',
                enable:true,
                selectTarget:-1,
                filterTarget:function(card,player,target){
                    return target==player;
                },
                modTarget:true,
                content:function(){
                    var num = target.countCards('h');
                    target.discard(target.getCards('h'));
                    target.draw(num);
                },
                ai:{
                    basic:{
                        order:3,
                        useful:4,
                        value:4
                    },
                    result:{
                        target:0.5,
                    },
                    tag:{
                        draw:1
                    }
                }
            },
            sv_harvest:{
                fullimage:true,
                type:'equip',
                subtype:'equip5',
                ai:{
                    basic:{
                        equipValue:4
                    }
                },
                cost:-1,
                skills:['harvest_skill']
            },
            yugioh_megamorph:{
                fullimage:true,
                type:'equip',
                subtype:'equip5',
                ai:{
                    basic:{
                        equipValue:4
                    }
                },
                skills:['megamorph_skill']
            },
            yugioh_mirror:{
                audio:true,
                fullimage:true,
                type:'trick',
                subtype:'defense',
                notarget:true,
                content:function(){
                    var evt=event.getParent('sha');
                    event.cancel();
                    evt.cancel();
                    evt.player.discard(evt.player.getCards('h'));
                    
                },
                ai:{
                    basic:{
                        useful:[6,4],
                        value:[6,4],
                    },
                    result:{player:1},
                    expose:0.2
                }
            },
            yugioh_goldsarc:{
                audio:true,
                fullimage:true,
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
					var cards = [];
					for(var i=0;i<ui.cardPile.childNodes.length;i++){
						cards.push(ui.cardPile.childNodes[i]);
					}
					target.chooseCardButton(1, '将一张牌移除，回合开始时获得', cards).set('filterButton',function(button){
						return true;
					}).set('ai',function(button){
                        return get.value(button.link) > 8;
					});
					'step 1'
					if (result.bool){
                        target.storage.gold_sarc=result.links[0];
                        ui.cardPile.remove(result.links[0]);
                        target.addSkill('gold_sarc');
                        game.notify(get.translation(player)+'的【封印的黄金柜】移除了'+get.translation(result.links[0]));
					}
                },
                ai:{
                    basic:{
                        order:3,
                        useful:4,
                        value:4
                    },
                    result:{
                        target:0.5,
                    },
                    tag:{
                        draw:1
                    }
                }
            },
            uno_skip:{
                audio:true,
                fullskin:true,
                type:'trick',
                subtype:'disrupt',
                enable:true,
                selectTarget:-1,
                filterTarget:function(card,player,target){
                    return target == player.nextSeat;
                },
                content:function(){
                    target.addSkill('skipfirst');
                },
                ai:{
                    basic:{
                        order:5,
                        useful:5,
                        value:5,
                    },
                    result:{
                        target:function(player,target){
                            return -2;
                        }
                    },
                }
            },
            uno_plus2:{
                audio:true,
                fullskin:true,
                type:'trick',
                subtype:'disrupt',
                enable:true,
                selectTarget:-1,
                filterTarget:function(card,player,target){
                    return target == player.nextSeat;
                },
                content:function(){
                    target.draw(2);
                },
                ai:{
                    basic:{
                        order:5,
                        useful:5,
                        value:5,
                    },
                    result:{
                        target:function(player,target){
                            return 2;
                        }
                    },
                }
            },
            uno_reverse:{
                audio:true,
                fullskin:true,
                type:'trick',
                subtype:'disrupt',
                enable:true,
                selectTarget:-1,
                filterTarget:function(card,player,target){
                    return true;
                },
                content:function(){
                    if (target.previousSeat == target.next){
                        target.next = target.nextSeat;
                    } else {
                        target.next = target.previousSeat;
                    }
                },
                ai:{
                    wuxie:function(target,card,player,viewer){
                        return -5; 
                    },
                    basic:{
                        order:5,
                        useful:1,
                        value:1,
                    },
                    result:{
                        target:function(player,target){
                            return 1;
                        }
                    },
                    tag:{
                        multitarget:1
                    }
                }
            },
        },
        skill:{
            skipfirst:{
				direct:true,
				trigger:{player:'phaseBegin'},
				content:function(){
					trigger.cancel();
					player.removeSkill('skipfirst');
				},
            },
            _yugioh_mirror:{
                direct:true,
                trigger:{target:'shaBegin'},
                /*
                filter:function(event, player){
                    return player.countCards('h', {name:'yugioh_mirror'});
                },*/
                content:function(){
                    var next = player.chooseToUse({
						filterCard:function(card,player){
							if(card.name!='yugioh_mirror') return false;
							var mod=game.checkMod(card,player,'unchanged','cardEnabled',player.get('s'));
							if(mod!='unchanged') return mod;
							return true;
						},
						prompt:'【轰！】来了，是否使用【反射镜力】？',});
						//filterCard:{name:'shan'}, selectCard:[1,1]});
					next.set('ai1',function(){
						var target=_status.event.player;
						var evt=_status.event.getParent();
						if (target.hp > 10) return -1;
						//if(ai.get.damageEffect(target,evt.player,target,evt.card.nature)>=0) return -1;
						return 1;
					});
                }
            },
            sv_harvest:{
                forced:true,
                trigger:{
					player:"phaseEnd",
				},
				filter:function (event,player){
					return player.countUsed()>2;
                },
                content:function(){
                    player.draw();
                }
            },
            yugioh_megamorph:{
                audio:2,
				forced:true,
				trigger:{source:'damageBegin'},
				content:function(){
					if (trigger.player.hp > player.hp){
                        trigger.num ++; 
                    } else if (trigger.player.hp < player.hp){
                        trigger.num --;
                    }
                },
                ai:{
					effect:{
						player:function(card,player,target,current){
							if(get.tag(card,'damage') && target.hp <= player.hp){
								return 'zeroplayertarget';
							}
                        },
                        /*
						player:function(card,player,target,current){
							if(get.type(card)=='trick'&&get.tag(card,'damage')){
								return 'zeroplayertarget';
							}
                        }
                        */
					}
				}
            },
            yugioh_goldsarc:{
                trigger:{player:'phaseBegin',player:'dieBegin'},
				forced:true,
				audio:false,
				mark:true,
				intro:{
					content:'cards'
                },
                content:function(){
                    if(player.storage.gold_sarc){
						if(trigger.name=='phase'){
							player.gain(player.storage.gold_sarc);
						}
						else{
							player.$throw(player.storage.gold_sarc,1000);
							for(var i=0;i<player.storage.gold_sarc.length;i++){
								player.storage.gold_sarc[i].discard();
							}
							game.log(player,'弃置了',player.storage.gold_sarc);
						}
					}
					delete player.storage.gold_sarc;
					player.removeSkill('gold_sarc');
                },
            },
            gw_youer:{
				trigger:{global:'phaseEnd',player:'dieBegin'},
				forced:true,
				audio:false,
				mark:true,
				intro:{
					content:'cards'
				},
				content:function(){
					if(player.storage.gw_youer){
						if(trigger.name=='phase'){
							player.gain(player.storage.gw_youer);
						}
						else{
							player.$throw(player.storage.gw_youer,1000);
							for(var i=0;i<player.storage.gw_youer.length;i++){
								player.storage.gw_youer[i].discard();
							}
							game.log(player,'弃置了',player.storage.gw_youer);
						}
					}
					delete player.storage.gw_youer;
					player.removeSkill('gw_youer');
                },
            },
        },
        translate:{
            holysword:'天赐圣剑',
            holysword_info:'锁定技，你视为拥有【连击】【激怒】【制衡】的效果。',
            spell_wuyashenxiang:'乌鸦神像',
            spell_wuyashenxiang_info:'出牌阶段，对自己使用；目标选择一项：法术牌或基本牌，然后从三张该种类的牌中获得一张。',
            spell_xiaoshi:'消失',
            spell_xiaoshi_info:'出牌阶段，对一名角色使用；其收回装备区内的所有牌，并弃置其若干张手牌，直到其手牌数与你相等',
            spell_piaoqie:'剽窃',
            spell_piaoqie_info:'出牌阶段，对一名角色使用；复制其两张手牌，加入你的手牌',
            gw_xinsheng:'新生',
            gw_xinsheng_info:'出牌阶段，对一名角色使用；你随机观看12张角色牌，选择一张替代目标角色牌（保留当前体力值和灵力值，且不大于新上限），然后结束出牌阶段',
            gw_zumoshoukao:'阻魔手铐',
            gw_zumoshoukao_info:'出牌阶段，对一名角色使用；目标技能失效，直到回合结束',
            gw_youer:'诱饵',
            gw_youer_bg:'饵',
            gw_youer_info:'出牌阶段，对一名其他角色使用；目标将所有手牌移出游戏，你摸一张牌；回合结束后目标将以此法失去的牌收回手牌',
            sv_dshift:'次元超越',
            sv_dshift_info:'出牌阶段，对灵力大于4的你使用；目标在本回合结束后，进行一个额外的回合。',
            sv_alterfate:'崭新命运',
            sv_alterfate_info:'出牌阶段，对你使用；目标弃置所有手牌，并摸等量的牌。',
            sv_harvest:'丰年祭',
            sv_harvest_info:'锁定技，结束阶段，若你本回合使用了至少3张牌，摸一张牌。',
            uno_plus2:'+2',
            uno_plus2_info:'出牌阶段，对你的下家使用；目标摸2张牌。',
            uno_reverse:'反转',
            uno_reverse_info:'出牌阶段，对所有角色使用；目标的上家与下家调换。（出现bug一概不包修）',
            uno_skip:'跳过',
            uno_skip_info:'出牌阶段，对你的下家使用；跳过目标下一个回合。',
            yugioh_goldsarc:'封印的黄金盒',
            yugioh_goldsarc_info:'出牌阶段，对你使用；目标从牌堆移除一张牌：其的回合开始时，其获得该牌。',
            yugioh_megamorph:'巨大化',
            yugioh_megamorph_info:'锁定技，你对一名角色造成伤害时，若你的体力值小于其，该伤害+1；若你的体力值大于其，该伤害-1。',
            yugioh_mirror:'反射镜力',
            yugioh_mirror_info:'你成为【轰！】的目标时，令该【轰！】无效，并弃置来源所有手牌。',
        },
		list:[
		],
	};
});