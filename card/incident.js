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
				vanish:true,
				selectTarget:-1,
				filterTarget:function(card,player,target){
					return target==player;
				},
				modTarget:true,
				content:function(){
					target.addSkill('scarlet_normal');
					target.addSkill('scarlet_win');
				},
			},
			sakura:{
				type:'zhenfa',
				fullskin:true,
				enable:true,
				vanish:true,
				selectTarget:-1,
				filterTarget:function(card,player,target){
					return target == player;
				},
				modTarget:true,
				content:function(){
					target.addSkill('sakura_normal');
					target.addSkill('sakura_win');
				}
			},
			imperishable:{
				type:'zhenfa',
				fullskin:true,
				enable:true,
				vanish:true,
				selectTarget:-1,
				filterTarget:function(card,player,target){
					return target == player;
				},
				modTarget:true,
				content:function(){
					target.addSkill('imperishable_normal');
					target.addSkill('imperishable_win');
				}
			},
			phantasmagoria:{
				type:'zhenfa',
				fullskin:true,
				enable:true,
				vanish:true,
				selectTarget:-1,
				filterTarget:function(card,player,target){
					return target == player;
				},
				modTarget:true,
				content:function(){
					target.addSkill('phantasmagoria_normal');
					target.addSkill('phantasmagoria_win');
				}
			},
			immaterial:{
				type:'zhenfa',
				fullskin:true,
				enable:true,
				vanish:true,
				selectTarget:-1,
				filterTarget:function(card,player,target){
					return target == player;
				},
				modTarget:true,
				content:function(){
					target.addSkill('immaterial_normal');
					target.addSkill('immaterial_win');
				}
			},
			sb:{
				type:'zhenfa',
				fullskin:true,
				enable:true,
				vanish:true,
				selectTarget:-1,
				filterTarget:function(card,player,target){
					return target == player;
				},
				modTarget:true,
				content:function(){
					target.addSkill('sb_normal');
					target.addSkill('sb_win');
				}
			},
			nine:{
				type:'zhenfa',
				fullskin:true,
				enable:true,
				vanish:true,
				selectTarget:-1,
				filterTarget:function(card,player,target){
					return target == player;
				},
				modTarget:true,
				content:function(){
					target.addSkill('nine_normal');
					target.addSkill('nine_win');
				}
			},
			death:{
				type:'zhenfa',
				fullskin:true,
				enable:true,
				vanish:true,
				selectTarget:-1,
				filterTarget:function(card,player,target){
					return target == player;
				},
				modTarget:true,
				content:function(){
					target.addSkill('death_normal');
					target.addSkill('death_win');
				}
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
    		sakura_normal:{
    			trigger:{global:'dying'},
				forced:true,
				check:function(){
					return false;
				},
				filter:function(event,player){
					return true;
				},
				content:function(){
					player.gainlili();
				},
    		},
    		sakura_win:{
				forced:true,
    			trigger:{player:'phaseBegin'},
    			filter:function(event,player){
    				for(var i=0;i<game.players.length;i++){
                        if(game.players[i].isOut()||game.players[i]==player) continue;
                        if(game.players[i].lili<player.lili) return false;
                    	if(game.players[i].hp<player.hp) return false;
                    }
    				return true;
    			},
    			direct:true,
    			content:function(){
    				game.over(true);
    			}	
    		},
    		imperishable_normal:{
    			trigger:{global:'loseEnd'},
    			forced:true,
    			filter:function(event,player){
    				return event.player.countCards('j') == 0;
    			},
    			content:function(){
					trigger.player.gain(ui.skillPile.childNodes[0],'draw2');
    			},
    		},
    		imperishable_win:{
    			trigger:{player:'phaseBegin'},
    			forced:true,
    			mark:true,
    			init:function (player){
    				player.storage.imperishable = 0;
    			},
    			intro:{
    				mark:function(dialog,content,player){
    					return '第'+get.cnNumber(content.length)+'回合';;
    				},
    				content:function(content,player){
						return '第'+get.cnNumber(content.length)+'回合';

					}
    			},
    			filter:function(event,player){
    				return true;
    			},
    			content:function(){
    				player.storage.imperishable += 1;
    				player.syncStorage('imperishable');
    				player.markSkill('imperishable');
    				if (player.storage.imperishable == 7) game.over(true);
    			},
    		},
    		phantasmagoria_normal:{

    		},
    		phantasmagoria_win:{

    		},
    		immaterial_normal:{

    		},
    		immaterial_win:{

    		},
    		sb_normal:{

    		},
    		sb_win:{

    		},
    		nine_normal:{

    		},
    		nine_win:{

    		},
    		death_normal:{

    		},
    		death_win:{

    		},
		},
		translate:{
			incident:'异变',
			scarlet:'红月',
			scarlet_info:'<u>胜利条件：</u>准备阶段，你的体力值和灵力值均为场上最高（没有之一）。<br/><u>异变效果：</u>与你同阵营的角色的攻击范围+1。',
			scarlet_normal:'【红月】异变效果',
			scarlet_normal_info:'<u>与你同阵营的角色的攻击范围+1。</u>',
			sakura:'散樱',
			sakura_info:'<u>胜利条件：</u>准备阶段，你的体力值和手牌数均为场上最低（没有之一）。<br/><u>异变效果：</u>一名角色进入决死状态时，你获得1点灵力。',
			sakura_normal:'',
			sakura_normal_info:'<u>与你同阵营的角色的攻击范围+1。</u>',
			imperishable:'永夜',
			imperishable_info:'',
			imperishable_normal:'',
			imperishable_normal_info:'',
			phantasmagoria:'花映',
			phantasmagoria_info:'',
			phantasmagoria_normal:'',
			phantasmagoria_normal_info:'',
			immaterial:'萃梦',
			immaterial_info:'',
			immaterial_normal:'',
			immaterial_normal_info:'',
			sb:'文花',
			sb_info:'',
			sb_normal:'',
			sb_normal_info:'',
			nine:'笨蛋',
			nine_info:'',
			nine_normal:'',
			nine_normal_info:'',
			death:'皆杀',
			death_normal:'',
			death_normal_info:'',
		},
		list:[
			//["diamond",1,'sakura'],
		],
	};
});
