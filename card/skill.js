'use strict';
game.import('card',function(lib,game,ui,get,ai,_status){
	return {
		name:'skill',
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
    				player.chooseToDiscard();
    				"step 1"
    				if(result.bool){
    					player.draw();
    				}
    			}
			},
			shengdun_skill:{
    			filter:function(event,player){
    				return event.card&&lib.card[event.card.name].subtype&&(lib.card[event.card.name].subtype=='attack')&&event.player.countCards('h')&&player.countCards('h');
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
							if(cards[i]&&cards[i].name == 'shengdun'){
								player.discard(cards[i]);
								break;
							}
						}
    					trigger.cancel();
    					trigger.finish();
    				}
    			},
    			ai:{
    				expose:0.3
    			}
			},
			qusan_skill:{
    			filter:function(event,player){
    				return event.card&&(get.type(event.card)=='trick')&&event.player.countCards('h')&&player.countCards('h');
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
    				}
    			},
    			ai:{
    				expose:0.3
    			}
			},
			shenyou_skill_1:{
				audio:2,
    			trigger:{player:'damageBefore'},
    			forced:true,
    			filter:function(event,player){
    				return event.num>0 && event.num>=player.hp && event.nature != 'thunder';
    			},
    			content:function(){
    				"step 0"
    				for (var i = 0; i <= player.num('j'); i ++){
						var card=player.get('j',i);
						if(card&&card.name == ('shenyou')){
							player.discard(card);
							break;
						}
					}
					trigger.cancel();
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
    				player.logSkill('shenyou_skill_2');
    				trigger.player.judging[0].suit = "heart";
    				for (var i = 0; i <= player.num('j'); i ++){
						var card=player.get('j',i);
						if(card&&card.name == ('shenyou')){
							player.discard(card);
							break;
						}
					}
    				game.log(trigger.player,'的判定牌的花色改为'+get.translation("heart"));
    			},
			},
			jinu_skill:{
    			audio:2,
    			trigger:{player:'damageEnd'},
    			filter:function(event,player){
    				return event.source.countCards('ej') && event.nature != 'thunder';
    			},
    			content:function(){
    				player.discardPlayerCard('ej',trigger.source,true);
    			},
    			
			},
			lianji_skill:{
				trigger:{player:'shaBegin'},
				usable:1,
				forced:true,
				content:function(){
					player.getStat().card.sha--;
				},
			},
			qianxing_skill:{
				trigger:{player:'phaseEnd'},
				content:function(){
					player.addSkill('qianxing_skill2');
				},
			},
			qianxing_skill2:{
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
					for (var i = 0; i <= player.num('j'); i ++){
						var card=player.get('j',i);
						if(card&&card.name == ('qianxing')){
							player.discard(card);
							break;
						}
					}
				},
				ai:{
					noh:true,
					skillTagFilter:function(player,tag){
						if(tag=='noh'){
							if(player.countCards('h')!=1) return false;
						}
					}
				}
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
			qicheng:'？？',
			qicheng_bg:'骑',
			qicheng_info:'你是怎么摸到这张牌的？',
			ziheng:'制衡',
			ziheng_bg:'制',
			ziheng_skill:'制衡',
			ziheng_info:'摸牌阶段结束时，你可以重铸一张牌。',
			shengdun:'圣盾',
			shengdun_bg:'盾',
			shengdun_skill:'圣盾',
			shengdun_info:'你成为攻击牌的目标后，可以与来源拼点；若你赢，弃置此牌，该牌对你无效。',
			qusan:'驱散',
			qusan_bg:'散',
			qusan_skill:'驱散',
			qusan_info:'你成为法术牌的目标后，可以并与来源拼点；若你赢，弃置此牌，该牌对你无效。',
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
			qianxing_info:'结束阶段，你可以令你获得以下效果直到你的准备阶段：若你有【潜行】，你不能成为攻击牌的目标；准备阶段，弃置此牌。',
			qianxing2_skill:'【潜行】已发动',
			qianxing2_info:'若你有【潜行】，你不能成为攻击牌的目标。',
			lingyong:'灵涌',
			lingyong_info:'锁定技，你造成的伤害不会因没有灵力而防止；你的攻击范围至少为2。',
		},
		list:[
			["diamond",0,'ziheng'],
			["diamond",0,'ziheng'],
			["diamond",0,'shenyou'],
			["diamond",0,'shenyou'],
			["diamond",0,'shengdun'],
			["diamond",0,'shengdun'],
			["diamond",0,'qusan'],
			["diamond",0,'qusan'],
			["diamond",0,'jinu'],
			["diamond",0,'jinu'],
			["diamond",0,'lianji'],
			["diamond",0,'lianji'],
			["diamond",0,'qianxing'],
			["diamond",0,'qianxing'],
			["diamond",0,'lingyong'],
			["diamond",0,'lingyong'],
		],
	};
});
