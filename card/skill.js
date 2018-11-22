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
    			audio:2,
    			trigger:{player:'phaseDrawEnd'},
    			direct:true,
    			content:function(){
    				"step 0"
    				player.chooseToDiscard(true);
    				"step 1"
    				if(result.bool==false){
    					player.draw();
    				}
    			}
			},
			shengdun_skill:{
				audio:2,
    			filter:function(event,player){
    				return event.player==player&&event.card&&lib.card[event.card].subtype&&(lib.card[event.card].subtype=='attack');
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
    			priority:10,
    			trigger:{target:'useCardToBefore'},
    			content:function(){
    				"step 0"
    				player.chooseToCompare(trigger.player);
    				"step 1"
    				if(result.bool&&trigger.player.countCards('he')){
    					trigger.untrigger();
    					trigger.finish();
    				}
    			},
    			ai:{
    				expose:0.3
    			}
			},
			qusan_skill:{
				audio:2,
    			filter:function(event,player){
    				return event.player==player&&event.card&&(get.type(event.card)=='trick');
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
    			priority:10,
    			trigger:{target:'useCardToBefore'},
    			content:function(){
    				"step 0"
    				player.chooseToCompare(trigger.player);
    				"step 1"
    				if(result.bool&&trigger.player.countCards('he')){
    					trigger.untrigger();
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
    				return event.num>0 && event.num>=player.hp;
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
					trigger.untrigger();
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
    				game.log(trigger.player,'的判定牌的花色改为'+get.translate("heart"));
    			},
			},
			jinu_skill:{
    			audio:2,
    			trigger:{player:'damageEnd'},
    			direct:true,
    			content:function(){
    				"step 0"
    				player.chooseTarget(get.prompt('jinu'),function(card,player,target){
    					return player!=target && target.countCards('ej')>0;
    				}).ai=function(target){
    				}
    				"step 1"
    				if(result.bool){
    					player.discardPlayerCard('ej',result.target,true);
    					/*
    					for (var i = 0; i <= player.num('j'); i ++){
							var card=player.get('j',i);
							if(card&&card.name == ('jinu')){
								player.discard(card);
								break;
							}
						}
						*/	
    				}
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

			},
		},
		translate:{
			skill:'技能',
			qicheng:'？？',
			qicheng_bg:'骑',
			qicheng_info:'你是怎么摸到这张牌的？',
			ziheng:'制衡',
			ziheng_bg:'制',
			ziheng_info:'摸牌阶段结束时，你可以重铸一张牌。',
			shengdun:'圣盾',
			shengdun_bg:'盾',
			shengdun_skill:'',
			shengdun_info:'你成为攻击牌的目标后，可以与来源拼点；若你赢，弃置此牌，该牌对你无效。',
			qusan:'驱散',
			qusan_bg:'散',
			qusan_skill:'',
			qusan_info:'你成为法术牌的目标后，可以并与来源拼点；若你赢，弃置此牌，该牌对你无效。',
			shenyou:'神佑',
			shenyou_bg:'神',
			shenyou_info:'锁定技，你的判定牌生效前，你弃置此牌，令之视为红桃；你受到伤害时，若伤害大于你的体力值，你弃置此牌，防止该伤害。',
			jinu:'激怒',
			jinu_bg:'怒',
			jinu_info:'你受到伤害后，可以弃置伤害来源场上一张牌',
			lianji:'连击',
			lianji_bg:'连',
			lianji_info:'锁定技，出牌阶段，你可以额外使用一张【轰！】',
			qianxing:'潜行',
			qianxing_bg:'潜',
			qianxing_skill:'',
		},
		list:[
			//["diamond",1,'sakura'],
			//["diamond",0,'qicheng'],
			["diamond",0,'ziheng'],
			["diamond",0,'ziheng'],
			["diamond",0,'shenyou'],
			["diamond",0,'shenyou'],
			["diamond",0,'shengdun'],
			["diamond",0,'shengdun'],
			["diamond",0,'qusan'],
			["diamond",0,'qusan'],
		],
	};
});
