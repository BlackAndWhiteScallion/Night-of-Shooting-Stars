'use strict';
game.import('character',function(lib,game,ui,get,ai,_status){
	return {
		name:'secret',
		connect:true,
		character:{
			renko:['female','0',3,['xingdu','sihuan'],[],[],'0'],
			meribel:['female','0',3,['xijian','rumeng'],[],[],'1'],
		},
		characterIntro:{
            renko:'从幻想乡外界进来的女高中生，秘封俱乐部成员之一。为了通过世界的缝隙而穿越去其他世界而行动着。<b>画师：An2a</b>',
            meribel:'从幻想乡外界进来的女高中生，秘封俱乐部成员之一。似乎能够看见和感觉到世界的缝隙？<b>画师：An2a</b>',
		},       
		perfectPair:{
		},
        skill:{
            xingdu:{
            	audio:2,
            	trigger:{player:'phaseBegin'},
            	frequent:true,
            	content:function(){
            		'step 0'
            		var cards = get.cards(2);
            		player.viewCards('牌堆顶的两张牌',cards);
            		for(var i=0;i<cards.length;i++){
                        ui.cardPile.insertBefore(cards[i],ui.cardPile.firstChild);
                    }
            		player.chooseBool('是否将本回合的摸牌改为从牌堆底摸？');
            		'step 1'
            		if (result.bool){
            			player.addTempSkill('xingdu_1');
            		}
            		player.draw();
            	},
            },
            xingdu_1:{
            	trigger:{player:'drawBegin'},
            	direct:true,
            	content:function(){
            		trigger.cancel();
            		var cards = [];
            		for (var i = 1; i <= trigger.num; i ++){
            			if (ui.cardPile.childNodes.length == 0){
							var card = get.cards(1);
                            ui.cardPile.insertBefore(card,ui.cardPile.firstChild);
            			}
            			cards.push(ui.cardPile.childNodes[ui.cardPile.childNodes.length-i]);
            		}
            		player.gain(cards);
            		player.$draw(cards,'nobroadcast');
            	},
            },
            sihuan:{
            	audio:2,
            	group:'dshift',
            	enable:'phaseUse',
            	filter:function(event,player){
            		if (player.hasSkill('sihuan_1') && player.hasSkill('sihuan_2') && player.hasSkill('sihuan_3') && player.hasSkill('sihuan_4')) return false;
            		return player.countCards('hej');
            	},
            	filterCard:function(){
            		return true;
            	},
            	prompt:'弃置一张牌发动【似幻】？',
            	discard:false,
            	content:function(){
            		'step 0'
            		var list = [];
            		if (!player.hasSkill('sihuan_1')) list.push('灵力值视为5，直到回合结束');
            		if (!player.hasSkill('sihuan_2') && game.hasPlayer(function(current){
            			return current.storage._tanpai || current.storage._tanyibian;
            		})) list.push('弃置有异变牌的一名角色一张牌');
            		if (!player.hasSkill('sihuan_3')) list.push('摸一张技能牌和一张【灵涌】');
            		if (!player.hasSkill('sihuan_4') && game.hasPlayer(function(current){
            			return current.isTurnedOver();
            		})) list.push('将弃置牌交给一名符卡发动中的角色');
            		if (!list.length) event.finish();
            		event.list = list;

            		player.chooseControlList(event.list,function(event,player){
                        if (game.hasPlayer(function(current){
                            return current.isTurnedOver() && get.attitude(player, current) > 0;  
                        }) && event.list.contains('将弃置牌交给一名符卡发动中的角色')) return event.list.indexOf('将弃置牌交给一名符卡发动中的角色')
                        if (game.hasPlayer(function(current){
                            return current.storage._tanpai || current.storage._tanyibian && get.attitude(player, current) < 0;  
                        }) && event.list.contains('弃置有异变牌的一名角色一张牌')) return event.list.indexOf('弃置有异变牌的一名角色一张牌')
                        if (!player.countCards('j', {name:'lingyong'})){
                            if (event.list.contains('摸一张技能牌和一张【灵涌】')) return event.list.indexOf('摸一张技能牌和一张【灵涌】');
                            else return event.list.indexOf('灵力值视为5，直到回合结束');
                        } 
                        if (event.list.contains('摸一张技能牌和一张【灵涌】')) return event.list.indexOf('摸一张技能牌和一张【灵涌】');
                        return 'cancel2';
                    });
                    'step 1'
                    if (result.control){
                    	if (event.list[result.index] == '灵力值视为5，直到回合结束'){
                    		player.addTempSkill('sihuan_1');
                    	} else if (event.list[result.index] == '弃置有异变牌的一名角色一张牌'){
                    		player.addTempSkill('sihuan_2');
                    		event.control = 'sihuan_2';
                    		player.chooseTarget('弃置有异变牌的一名角色一张牌',function(card,player,target){
								return target.storage._tanpai || target.storage._tanyibian;
							}).set('ai',function(target){
								return -get.attitude(_status.event.player,target);
							});
                    	} else if (event.list[result.index] == '摸一张技能牌和一张【灵涌】'){
                    		player.addTempSkill('sihuan_3');
                    		for(var i=0;i<ui.skillPile.childNodes.length;i++){
			                  if (ui.skillPile.childNodes[i].name == 'lingyong'){
			                    player.gain(ui.skillPile.childNodes[i]);
			                    break;
			                  } else if (i == ui.skillPile.childNodes.length -1){
			                      player.say('哎，技能牌堆里居然没有【灵涌】？');                      
			                  }
			                }
			                player.gain(ui.skillPile.childNodes[0],'draw2');
                    	} else if (event.list[result.index] == '将弃置牌交给一名符卡发动中的角色') {
                    		player.addTempSkill('sihuan_4');
                    		event.control = 'sihuan_4';
                    		player.chooseTarget('将'+get.translation(cards[0])+'交给一名符卡发动中的角色',function(card,player,target){
								return target.isTurnedOver();
							}).set('ai',function(target){
								return get.attitude(_status.event.player,target);
							});
                    	}
                    }
                    'step 2'
                    if (event.control && event.control == 'sihuan_4') player.discard(cards[0]);
                    if (result.targets){
                    	if (event.control == 'sihuan_2'){
                    		player.discardPlayerCard(result.targets[0],'hej',true);
                    	} else if (event.control == 'sihuan_4'){
                    		result.targets[0].gain(cards[0],player);
							player.$give(cards[0],result.targets[0]);
                    	}
                    }
            	},
            	ai:{
					basic:{
						order:7
					},
					result:{
						player:function(player){
                            if (!player.hasSkill('sihuan_3')) return 1;
                            return 0;
                        },
					},
				}
            },
            sihuan_1:{
            	init:function(player){
            		player.maxlili = 5;
            		player.lili = 5;
            		player.update();
            	},
            	onremove:function(player){
            		player.maxlili = 0;
            		player.lili = 0;
            		player.update();
            	},
            	direct:true,
            	trigger:{player:'changeliliBefore'},
            	content:function(){
            		trigger.cancel();
            	},
            },
            sihuan_2:{
            },
            sihuan_3:{
            },
            sihuan_4:{
            },
            xijian:{
            	audio:2,
            	trigger:{player:'phaseEnd'},
            	frequent:true,
            	content:function(){
            		'step 0'
            		if (ui.cardPile.childNodes.length == 0){
						var cards = get.cards(1);
                        ui.cardPile.insertBefore(cards,ui.cardPile.firstChild);
        			}
            		var card = ui.cardPile.childNodes[ui.cardPile.childNodes.length-1];
            		player.viewCards('牌堆底的牌',card);
            		event.card = card;
                    var list = ['将这张牌交给一名角色'];
                    if (game.hasPlayer(function(current){
                        if (lib.card[event.card.name].notarget == true) return false;
                        return player.canUse(event.card, current);
                    }))
            		player.chooseControl(list,function(event,player){
            			if (get.type(card) == 'equip') return '使用这张牌';
            			return '将这张牌交给一名角色';
					});
            		'step 1'
            		if (result.control){
            			if (result.control == '使用这张牌'){
                            player.gain(event.card);
            				player.chooseToUse('隙见：使用'+get.translation(event.card),{name:event.card.name, suit:event.card.suit, number:event.card.number},function(card,player,target){
								return player.canUse(event.card,target);
                                //return true;
							});
            			} else if (result.control == '将这张牌交给一名角色'){
            				player.chooseTarget('将'+get.translation(event.card)+'交给一名角色').set('ai',function(target){
								return get.attitude(_status.event.player,target);
							});
                            player.addTempSkill('sihuan_2');
            			}
            		}
            		'step 2'
            		if (result.targets && player.hasSkill('sihuan_2')){
            			result.targets[0].gain(event.card,player);
						player.$give(event.card,result.targets[0]);
						if (result.targets[0].name == 'renko') game.trySkillAudio('xijian',result.targets[0],true,3);
            		}
            	},
            },
            rumeng:{
            	audio:2,
            	group:['dshift','rumeng_2'],
            	trigger:{player:'gainliliBegin'},
            	forced:true,
            	filter:function(event,player){
            		return event.getParent().name != 'rumeng';
            	},
            	content:function(){
            		if (player.maxlili < 5) player.gainMaxlili();
            		player.gainlili();
            	}
            },
            rumeng_2:{
            	trigger:{player:'phaseBeginStart'},
            	filter:function(event,player){
            		return player.maxlili > 4;
            	},
            	content:function(){
            		player.addSkill('mengjing');
            		player.useSkill('mengjing');
            		player.maxlili -= 4;
            		player.update();
            		player.removeSkill('rumeng');
            	},
                check:function(event,player){
                    return player.hp < 2;
                },
            },
            dshift:{
            	audio:1,
            	trigger:{player:'phaseBegin'},
            	forced:true,
            	content:function(){
            		'step 0'
            		player.chooseTarget('选择跨入幻想之门的角色',[2,2], true,function(card,player,target){
						return player.canUse({name:'huanxiang'},target);
					}).set('ai',function(target){
                        if (player.name == 'renko' && target.name == 'meribel') return 99999;
                        if (target.name == 'renko' && player.name == 'meribel') return 99999; 
						var att=get.attitude(_status.event.player,target);
						return att/3;
					});
					'step 1'
					if (result.bool){
						player.useCard({name:'huanxiang'}, result.targets);
					}
					player.removeSkill('dshift');
            	}
            },
        },
        translate:{
        	renko:'莲子',
        	xingdu:'星读',
        	xingdu_info:'准备阶段，你可以观看牌堆顶的两张牌，然后你可以令你的摸牌改为从牌堆底摸，直到回合结束；选择完成后，摸一张牌。',
        	xingdu_audio1:'嗯……好像是这个方向？',
        	xingdu_audio2:'哎哎哎，不太对吧？',
        	sihuan:'似幻',
        	sihuan_info:'你的第一个准备阶段，须视为使用一张目标数为2的【幻想之门】；出牌阶段，你可以弃置一张牌并选择一项，一回合每项限一次： 1. 灵力值视为５，直到回合结束；2. 弃置一名有异变牌的角色一张牌；3. 摸一张技能牌和一张【灵涌】；4. 将之交给一名符卡发动中的角色。',
        	sihuan_audio1:'啊，我来试试这个！',
        	sihuan_audio2:'这又是什么神奇的操作！',
        	renko_die:'这地方还蛮好玩的嘛，梅莉？',
        	meribel:'梅莉',
        	xijian:'隙见',
        	xijian_info:'结束阶段，你可以观看牌堆底的一张牌，然后选择一项：将之交给一名角色，或使用之。',
        	xijian_audio1:'这里好像……',
        	xijian_audio2:'应该就是这里了吧。',
        	xijian_audio3:'啊，谢谢你梅莉！',
        	rumeng:'如梦',
        	rumeng_info:'你的第一个准备阶段，须视为使用一张目标数为2的【幻想之门】；你以此技能以外的效果获得灵力时，增加1点灵力上限并获得1点灵力（上限至多为5）；你可以扣减4点灵力上限，然后无视消耗发动【梦境与现实的诅咒】；符卡结束时，失去此技能。',
        	meribel_die:'嗯……？这是哪里？莲子？',
        	dshift_audio1:'撒，该是时候进入幻想了！',
        },
      };
});