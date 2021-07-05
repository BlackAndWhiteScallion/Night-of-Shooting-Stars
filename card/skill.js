'use strict';
game.import('card',function(lib,game,ui,get,ai,_status){
	return {
		name:'skill',
		connect:true,
		card:{
			qicheng:{
				audio:true,
				fullskin:true,
				type:'delay',
				vanish:true,
				skills:['qicheng_skill'],
				filterTarget:function(card,player,target){
					return true;
				},
				judge:function(card){
					return 0;
				},
				effect:function(){
				},
				ai:{
					basic:{
						useful:0,
						value:0,
					},
					result:{target:1},
					expose:0.2
				},
			},
			ziheng:{
				audio:true,
				fullskin:true,
				type:'delay',
				filterTarget:function(card,player,target){
					return true;
				},
				judge:function(card){
					return 0;
				},
				effect:function(){
				},
				ai:{
					basic:{
						useful:5,
						value:5,
					},
					result:{target:1},
				},
				skills:['ziheng_skill']
			},
			shengdun:{
				audio:true,
				fullskin:true,
				type:'delay',
				filterTarget:function(card,player,target){
					return true;
				},
				judge:function(card){
					return 0;
				},
				effect:function(){
				},
				ai:{
					basic:{
						useful:4,
						value:4,
					},
					result:{target:1},
				},
				skills:['shengdun_skill']
			},
			qusan:{
				audio:true,
				fullskin:true,
				type:'delay',
				filterTarget:function(card,player,target){
					return true;
				},
				judge:function(card){
					return 0;
				},
				effect:function(){
				},
				ai:{
					basic:{
						useful:4,
						value:4,
					},
					result:{target:1},
				},
				skills:['qusan_skill']
			},
			shenyou:{
				audio:true,
				fullskin:true,
				type:'delay',
				filterTarget:function(card,player,target){
					return true;
				},
				judge:function(card){
					return 0;
				},
				effect:function(){
				},
				ai:{
					basic:{
						useful:8,
						value:8,
					},
					result:{target:1},
				},
				skills:['shenyou_skill_1','shenyou_skill_2']
			},
			jinu:{
				audio:true,
				fullskin:true,
				type:'delay',
				filterTarget:function(card,player,target){
					return true;
				},
				judge:function(card){
					return 0;
				},
				effect:function(){
				},
				ai:{
					/*
					maixie:true,
					maixie_hp:true,
					*/
					maixie_defend:true,
					basic:{
						useful:4,
						value:4,
					},
					result:{target:1},
				},
				skills:['jinu_skill']
			},
			lianji:{
				audio:true,
				fullskin:true,
				type:'delay',
				filterTarget:function(card,player,target){
					return true;
				},
				judge:function(card){
					return 0;
				},
				effect:function(){
				},
				ai:{
					basic:{
						useful:6,
						value:6,
					},
					result:{target:1},
				},
				skills:['lianji_skill']
			},	
			qianxing:{
				audio:true,
				fullskin:true,
				type:'delay',
				filterTarget:function(card,player,target){
					return true;
				},
				judge:function(card){
					return 0;
				},
				effect:function(){
				},
				ai:{
					basic:{
						useful:7,
						value:function(card, player){
							// 不知道怎么检测是下一名回合角色，选择死亡。
							if (player.hasSkill('qianxing_skill2')) return 100;
							else return 5;
						},
					},
					result:{target:1},
				},
				skills:['qianxing_skill']
			},	
			lingyong:{
				audio:true,
				fullskin:true,
				type:'delay',
				filterTarget:function(card,player,target){
					return true;
				},
				judge:function(card){
					return 0;
				},
				effect:function(){
				},
				ai:{
					basic:{
						useful:3,
						value:function(card, player){
							if (player.lili > 1) return 4;
							else return 100;
						},
						equipValue:10,
					},
					result:{target:1},
				},
				skills:['lingyong_skill']
			},
		},
		skill:{
			qicheng_skill:{
				init:function(player){
    				player.maxequip++;
    			},
				mod:{
					globalFrom:function(from,to,distance){
						return distance-1;
					},
				},
				onremove:function(player){
					player.maxequip--;
					if (player.num('e',{type:'equip'})>player.maxequip){
                        player.chooseToDiscard(1,{type:'equip'},'e',true);
                    }
    			},
			},
			ziheng_skill:{
    			trigger:{player:'phaseDrawEnd'},
    			content:function(){
    				"step 0"
    				player.chooseCard('hej');
    				"step 1"
    				if(result.bool){
    					player.recast(result.cards);
    				}
    			}
			},
			shengdun_skill:{
    			filter:function(event,player){
    				return event.card&&lib.card[event.card.name].subtype&&(lib.card[event.card.name].subtype=='attack')&&event.player.countCards('h')&&player.countCards('h')&&event.player!=player;
    			},
    			logTarget:'player',
    			check:function(event,player){
    				if(get.attitude(player,event.player)>0){
    					return false;
    				}
    				if(get.tag(event.card,'respondSha')){
    					if(player.countCards('h',{name:'sha'})==0){
    						return true;
    					}
    				}
    				else if(get.tag(event.card,'respondShan')){
    					if(player.countCards('h',{name:'shan'})==0){
    						return true;
    					}
    				}
    				else if(get.tag(event.card,'damage')){
    					if(player.countCards('h')<2) return true;
    				}
    				else if(event.card.name=='shunshou'&&player.hp>2){
    					return true;
    				}
    				return false;
    			},
    			trigger:{target:'useCardToBefore'},
				cardAnimation:17,
    			content:function(){
    				"step 0"
    				player.chooseToCompare(trigger.player);
    				"step 1"
    				if(result.bool){
    					var cards = player.getCards('j');
						for (var i = 0; i <= cards.length; i ++){
							if(cards[i]&&cards[i].name == 'shengdun'){
								player.discard(cards[i]);
								break;
							}
						}
						trigger.cancel();
    					trigger.finish();
						event.str=get.translation(player.name)+'的【圣盾】取消了'+get.translation(trigger.card);
						game.notify(event.str);
    				}
    			},
    			ai:{
    				expose:0.3
    			}
			},
			qusan_skill:{
    			filter:function(event,player){
    				return event.card&&(get.type(event.card)=='trick')&&event.player.countCards('h')&&player.countCards('h')&&event.player!=player;
    			},
    			logTarget:'player',
    			check:function(event,player){
    				if(get.attitude(player,event.player)>0){
    					return false;
    				}
    				if(get.tag(event.card,'respondSha')){
    					if(player.countCards('h',{name:'sha'})==0){
    						return true;
    					}
    				}
    				else if(get.tag(event.card,'respondShan')){
    					if(player.countCards('h',{name:'shan'})==0){
    						return true;
    					}
    				}
    				else if(get.tag(event.card,'damage')){
    					if(player.countCards('h')<2) return true;
    				}
    				else if(event.card.name=='shunshou'&&player.hp>2){
    					return true;
    				}
    				return false;
    			},
    			trigger:{target:'useCardToBefore'},
    			content:function(){
    				"step 0"
    				player.chooseToCompare(trigger.player);
    				"step 1"
    				if(result.bool){
    					var cards = player.getCards('j');
						for (var i = 0; i <= cards.length; i ++){
							if(cards[i]&&cards[i].name == 'qusan'){
								player.discard(cards[i]);
								break;
							}
						}
    					trigger.cancel();
    					trigger.finish();
    					event.str=get.translation(player.name)+'的【驱散】取消了'+get.translation(trigger.card);
						game.notify(event.str);
    				}
    			},
    			ai:{
    				expose:0.3
    			}
			},
			shenyou_skill_1:{
				audio:2,
				skillAnimation:11,
    			trigger:{player:'damageBefore'},
    			forced:true,
    			filter:function(event,player){
    				return event.num>0 && event.num>=player.hp && event.nature != 'thunder';
    			},
    			content:function(){
    				"step 0"
    				var cards = player.getCards('j');
					for (var i = 0; i <= cards.length; i ++){
						if(cards[i]&&cards[i].name == 'shenyou'){
							player.discard(cards[i]);
							break;
						}
					}
					trigger.cancel();
					event.str=get.translation(player.name)+'的【神佑】防止了伤害';
					game.notify(event.str);
    			},
			},
			shenyou_skill_2:{
				audio:2,
				forced:true,
    			trigger:{player:'judge'},
    			filter:function(event,player){
    				return true;
    			},
    			content:function(){
    				"step 0"
    				trigger.player.judging[0].suit = "heart";
    				"step 1"
    				var cards = player.getCards('j');
					for (var i = 0; i <= cards.length; i ++){
						if(cards[i]&&cards[i].name == 'shenyou'){
							player.discard(cards[i]);
							break;
						}
					}
    				game.log('神佑：',trigger.player,'的判定牌的花色改为'+get.translation("heart"));
					event.str=get.translation(player.name)+'的【神佑】将判定牌改为了红桃花色';
					game.notify(event.str);
    			},
			},
			jinu_skill:{
    			audio:2,
				cardAnimation:11,
    			trigger:{player:'damageEnd'},
    			filter:function(event,player){
    				return event.source && event.source.countCards('ej') && event.nature != 'thunder';
    			},
    			content:function(){
    				player.discardPlayerCard('ej',trigger.source,true);
    			},
    			check:function(event,player){
					return -get.attitude(player, event.source);
				},
			},
			lianji_skill:{
				mod:{
					cardUsable:function(card,player,num){
						if(card.name=='sha') return num+player.countCards('j', {name:'lianji'});
					}
				},
			},
			qianxing_skill:{
				trigger:{player:'phaseEnd'},
				filter:function(event, player){
					return !player.hasSkill('qianxing_skill2');
				},
				content:function(){
					'step 0'
					player.addSkill('qianxing_skill2');
					game.notify(get.translation(player)+'发动了【潜行】');
				},
				onremove:function(player){
					player.removeSkill('qianxing_skill2');
				},
				check:function(event,player){
					return player.hp < 3 || player.countCards('h') < 2;
				},
			},
			qianxing_skill2:{
				mark:true,
				intro:{
					content:'不能成为攻击牌的目标',
				},
				init:function(player){
					player.$effect('qianxing_skill', 6);
				},
				mod:{
					targetEnabled:function(card,player,target,now){
						if(target.countCards('j',{name:'qianxing'})>0){
							if(lib.card[card.name].subtype=='attack') return false;
						}
					}
				},
				trigger:{player:'phaseBegin'},
				forced:true,
				content:function(){
					player.removeSkill('qianxing_skill2');
					var cards = player.getCards('j');
					for (var i = 0; i < cards.length; i ++){
						if(cards[i]&&cards[i].name == 'qianxing'){
							player.discard(cards[i]);
							break;
						}
					}
				},
				/*
				ai:{
					skillTagFilter:function(player,tag){
						if(tag=='noh'){
							if(player.countCards('h')!=1) return false;
						}
					}
				}
				*/
			},
			lingyong_skill:{
				mod:{
					attackFrom:function(from,to,distance){
						// 数场上符合条件的角色，不错
						if (from.lili < 2) return distance - 2;
						return distance;
					}
				},
			},
		},
		translate:{
			skill:'技能牌',
			//qicheng:'？？',
			//qicheng_bg:'骑',
			qicheng_info:'你是怎么摸到这张牌的？',
			ziheng:'制衡',
			ziheng_bg:'制',
			ziheng_skill:'制衡',
			ziheng_info:'摸牌阶段结束时，你可以重铸一张牌。',
			shengdun:'圣盾',
			shengdun_bg:'盾',
			shengdun_skill:'圣盾',
			shengdun_info:'你成为其他角色的攻击牌的目标后，可以与来源拼点；若你赢，弃置此牌，该牌对你无效。',
			qusan:'驱散',
			qusan_bg:'散',
			qusan_skill:'驱散',
			qusan_info:'你成为其他角色的法术牌的目标后，可以与来源拼点；若你赢，弃置此牌，该牌对你无效。',
			shenyou:'神佑',
			shenyou_bg:'神',
			shenyou_skill_1:'神佑（抵伤）',
			shenyou_skill_2:'神佑（改判）',
			shenyou_info:'锁定技，你的判定牌生效前，你弃置此牌，令之视为红桃；你受到伤害时，若伤害大于你的体力值，你弃置此牌，防止该伤害。',
			jinu:'激怒',
			jinu_bg:'怒',
			jinu_skill:'激怒',
			jinu_info:'你受到伤害后，可以弃置伤害来源场上一张牌',
			lianji:'连击',
			lianji_bg:'连',
			lianji_info:'锁定技，出牌阶段，你可以额外使用一张【轰！】',
			qianxing:'潜行',
			qianxing_bg:'潜',
			qianxing_skill:'潜行',
			qianxing_info:'结束阶段，你可以令你获得以下效果：若你有【潜行】，你不能成为攻击牌的目标；准备阶段，弃置此牌。',
			qianxing_skill2:'潜行（弃置）',
			lingyong:'灵涌',
			lingyong_info:'锁定技，你造成的伤害不会因没有灵力而防止；你的攻击范围至少为2。',
		},
		list:[
			[null,0,'ziheng'],
			[null,0,'ziheng'],
			[null,0,'shenyou'],
			[null,0,'shenyou'],
			[null,0,'shengdun'],
			[null,0,'shengdun'],
			[null,0,'qusan'],
			[null,0,'qusan'],
			[null,0,'jinu'],
			[null,0,'jinu'],
			[null,0,'lianji'],
			[null,0,'lianji'],
			[null,0,'qianxing'],
			[null,0,'qianxing'],
			[null,0,'lingyong'],
			[null,0,'lingyong'],
		],
	};
});
