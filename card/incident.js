'use strict';
game.import('card',function(lib,game,ui,get,ai,_status){
	return {
		name:'incident',
		card:{
			scarlet:{
				type:'zhenfa',
				audio:true,
				fullskin:true,
				enable:true,
				selectTarget:-1,
				filterTarget:function(card,player,target){
					return target==player;
				},
				modTarget:true,
				content:function(){
					target.addSkill(scarlet_normal);
					target.addSkill(scarlet_win);
				},
			},
			sakura:{
				type:'zhenfa',
				fullskin:true,
				enable:true,
				selectTarget:-1,
				filterTarget:function(card,player,target){
					return target == player;
				},
				modTarget:true,
				content:function(){
					target.addSkill(sakura_normal);
					target.addSkill(sakura_win);
				}
			},
			niaoxiangzhen:{
				type:'zhenfa',
				chongzhu:true,
				enable:true,
				filterTarget:function(card,player,target){
					if(player.identity==target.identity) return false;
					if(target.identity=='unknown'||target.identity=='ye') return false;
					return target.identity==target.next.identity||target.identity==target.previous.identity
				},
				selectTarget:-1,
				content:function(){
					"step 0"
					var next=target.chooseToRespond({name:'shan'});
					next.ai=function(card){
						if(get.damageEffect(target,player,target)>=0) return 0;
						return 1;
					};
					next.autochoose=lib.filter.autoRespondShan;
					"step 1"
					if(result.bool==false){
						target.damage();
					}
				},
				ai:{
					basic:{
						order:9,
						useful:1
					},
					result:{
						target:-1.5,
					},
					tag:{
						respond:1,
						respondShan:1,
						damage:1,
					}
				},
				mode:['guozhan'],
			},
		},
		skill:{
			scarlet_normal:{
    			global:'scarlet_normal2',
			},
			scarlet_normal2:{
				// 感觉好像会出bug……
				mod:{
					attackFrom:function(from,to,distance){
						return distance-game.countPlayer(function(current){
							if(current==from) return false;
							if(current.identity=='unknown'||current.identity=='ye') return false;
							if (current.identity=='zhu'&&from.identity=='zhong') return true;
							if(current.identity!=from.identity) return false;
							if(current.hasSkill('scarlet_normal')) return true;
						});
					}
				}
			},
			scarlet_win:{
				audio:2,
    			forced:true,
    			trigger:{player:'phaseBegin'},
    			filter:function(event,player){
    				for(var i=0;i<game.players.length;i++){
                        if(game.players[i].isOut()||game.players[i]==this) continue;
                        if(game.players[i].lili>this.lili) return false;
                    }
    				return player.isMaxHp(false);
    			},
    			direct:true,
    			content:function(){
    				game.over(true);
    			}	
    		},
		},
		translate:{
			incident:'异变',
			scarlet:'红月',
			sakura:'散樱',
			scarlet_info:'胜利条件：准备阶段，你的体力值和灵力值均为场上最高（没有之一）。<br/>异变效果：与你同阵营的角色的攻击范围+1。',
			sakura_info:'胜利条件：准备阶段，你的体力值和手牌数均为场上最低（没有之一）。<br/>异变效果：一名角色进入决死状态时，你获得1点灵力。',
			changshezhen_info:'若你处于队列中，与你同一队列的所有角色摸一张牌，否则将与你逆时针距离最近的同势力角色移至你下家',
			// pozhenjue_info:'将所有角色的顺序随机重排',
			tianfuzhen_info:'所有大势力角色弃置一张牌'
		},
		list:[
			//["diamond",1,'sakura'],
		],
	};
});
