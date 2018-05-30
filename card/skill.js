'use strict';
game.import('card',function(lib,game,ui,get,ai,_status){
	return {
		name:'skill',
		card:{
			qicheng:{
				audio:true,
				fullskin:true,
				type:'delay',
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
    			trigger:{player:'phaseDrawBegin'},
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
    				return event.player!=player&&event.card&&(lib.card[event.card].subtype=='attack');
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
    				return event.player!=player&&event.card&&(get.type(event.card)=='trick');
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
			shenyou_skill:{
				audio:2,
    			trigger:{player:'judge'},
    			filter:function(event,player){
    				return player.countCards('he',{color:'black'})>0;
    			},
    			direct:true,
    			content:function(){
    				"step 0"
    				player.chooseCard(get.translation(trigger.player)+'的'+(trigger.judgestr||'')+'判定为'+
    				get.translation(trigger.player.judging[0])+'，'+get.prompt('guidao'),'he',function(card){
    					return get.color(card)=='black';
    				}).set('ai',function(card){
    					var trigger=_status.event.getTrigger();
    					var player=_status.event.player;
    					var judging=_status.event.judging;
    					var result=trigger.judge(card)-trigger.judge(judging);
    					var attitude=get.attitude(player,trigger.player);
    					if(attitude==0||result==0) return 0;
    					if(attitude>0){
    						return result;
    					}
    					else{
    						return -result;
    					}
    				}).set('judging',trigger.player.judging[0]);
    				"step 1"
    				if(result.bool){
    					player.respond(result.cards,'highlight');
    				}
    				else{
    					event.finish();
    				}
    				"step 2"
    				if(result.bool){
    					player.logSkill('guidao');
    					player.$gain2(trigger.player.judging[0]);
    					player.gain(trigger.player.judging[0]);
    					trigger.player.judging[0]=result.cards[0];
    					if(!get.owner(result.cards[0],'judge')){
    						trigger.position.appendChild(result.cards[0]);
    					}
    					game.log(trigger.player,'的判定牌改为',result.cards[0]);
    				}
    				"step 3"
    				game.delay(2);
    			},
			},
			jinu_skill:{

			},
			lianji_skill:{
				mod:{
					cardUsable:function(card,player,num){
						if(card.name=='sha') return 2;
					}
				},
			},
		},
		translate:{
			skill:'技能',
			qicheng:'骑乘',
			qicheng_bg:'骑',
			qicheng_info:'d',
			ziheng:'制衡',
			ziheng_bg:'制',
			ziheng_info:'摸牌阶段结束时，你可以重铸该阶段摸的一张牌。',
		},
		list:[
			//["diamond",1,'sakura'],
			["diamond",0,'qicheng'],
			["diamond",0,'ziheng'],
		],
	};
});
