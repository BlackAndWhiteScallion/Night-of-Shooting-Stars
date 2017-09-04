'use strict';
game.import('character',function(lib,game,ui,get,ai,_status){
	return {
		name:'scarlet',
		connect:true,
		character:{
			rumia:['female','4',4,['heiguan','yuezhi']],
		},
		characterIntro:{
			diaochan:'中国古代四大美女之一，有闭月羞花之貌。司徒王允之义女，由王允授意施行连环计，离间董卓、吕布，借布手除卓。后貂蝉成为吕布的妾。',
		},
		perfectPair:{
			xiahoudun:['xiahouyuan'],
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
    					for (var i=0; i<ui.selected.targets.length;i++){
							if (get.distance(ui.selected.targets[i],target)<=1) break;    						
    					}
						return target.countCards('h')>0&&player!=target&&target.lili<player.lili;
					}).set('ai',function(target){
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
		    				return 'end_phase';
    					});
    				}
    				"step 4"
    				if (result.control == "lose_lili"){
    					player.loselili();
    					event.goto(2);
    				} 
    				else {
    					trigger.finish();
    					trigger.untrigger();
    					event.finish();
    				}
    			},
    			ai:{
    				expose:0.1
    			}
    		},
    		yuezhi:{
    			audio:2,
    			cost:2,
    			spell:['yuezhi2'],
    			roundi:true,
    			trigger:{player:'phaseBegin'},
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
    			uninit:function(player){
    				game.log('ddd');
    			}
    		},
    		yuezhi3:{
				mod:{
					attackFrom:function(from,to,distance){
						// 数场上符合条件的角色，不错
						if (from.hasSkill('yueshi2')) return false;
						return distance + 10*game.countPlayer(function(current){
							if(current==from) return false;
							if(get.distance(current,from,'attack')<=1) return false;
							if(current.hasSkill('yuezhi2')) return true;
						});
					}
				},
    		},
		},
		translate:{
			rumia:'露米娅',
			heiguan:'黑棺',
			heiguan_info:'出牌阶段开始时，你可以指定灵力值小于你的任意名连续角色；你与这些角色各依次拼点；若你赢，视为你对其使用一张【轰！】；否则，你选择一项：取消其他目标并结束该阶段，或消耗1点灵力。',
			lose_lili:'消耗灵力',
			end_phase:'结束出牌阶段',
			yuezhi:'月之阴暗面',
			yuezhi_info:'符卡技（2）【永续】你攻击范围内的所有其他角色的攻击范围视为0。',
		},
	};
});
