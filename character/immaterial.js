'use strict';
game.import('character',function(lib,game,ui,get,ai,_status){
	return {
		name:'immaterial',
		connect:true,
		character:{
			suika:['female','1',4,['cuiji','baigui']],
		},
		characterIntro:{
			suika:'全名伊吹萃香。不知道什么时候出现在幻想乡的鬼，现住在博丽神社。几乎什么时候都在喝酒。虽然是萝莉身材，但是筋力非常强大，并持有控制密度的能力。<br> <b>画师：あいに</b>',
		},       
		perfectPair:{
		},
            skill:{
            	cuiji:{
            		group:['cuiji_buff'],
            		audio:2,
            		trigger:{player:'phaseBegin',source:'damageEnd'},
            		filter:function(event,player,name){
            			if(name=='damageEnd'){
            				return event.nature != 'thunder';
            			}
            			return true;
					},
					check:function(event,player){
						if (player.isTurnedOver()) return false;
						if (player.hp == 4 && player.lili > 4) return false;
						if (player.lili == 0) return false;
						var cards=player.getCards('h');
						if(cards.length>player.hp) return true;
						return true;
					},
					content:function(){
						'step 0'
						var list = [];
						if (player.lili > 1){
							list.push('cuiji_lili');
						}
						if (player.hp > 0){
							list.push('cuiji_hp');
						}
						player.chooseControl(list,function(event,player){
							if ((player.lili > 3 || player.hp < 3) && list.contains('cuiji_lili')) return 'cuiji_lili';
							if (player.lili + 2 > player.hp) return 'cuiji_hp';
							return 'cuiji_hp'; 
						});
						'step 1'
						if(result.control=='cuiji_hp'){
							player.loseHp();
							player.gainlili(2);
						}
						else if (result.control == 'cuiji_lili'){
							player.loselili(2);
							player.recover();
						}
					},
            	},
            	cuiji_buff:{
					audio:2,
					usable:1,
					enable:['chooseToUse','chooseToRespond'],
					filter:function(event,player){
						return player.lili>player.hp;
					},
					filterCard:{color:'black'},
					viewAs:{name:'sha'},
					check:function(){return 1},
					ai:{
						effect:{
							target:function(card,player,target,current){
								if(get.tag(card,'respondSha')&&current<0) return 0.6
							}
						},
						respondSha:true,
						order:4,
						useful:-1,
						value:-1
					},
					mod:{
						cardUsable:function(card,player,num){
							if(card.name=='sha') return num + 1;
						}
					},
            	},
            	baigui:{
            		spell:['baigui1','baigui2'],
            		cost:0,
            		audio:2,
            		trigger:{player:'phaseBegin'},
            		filter:function(event,player){
                    	return player.lili > lib.skill.baigui.cost;
	                },
	                check:function(event,player){
	                	if(player.lili>2&&player.countCards('h','sha')>0) return true;
	                	return false;
					},
	                content:function(){
	                    player.loselili(lib.skill.baigui.cost);
	                    player.turnOver();
	                },
            	},
            	baigui1:{
            		audio:2,
					trigger:{player:'shaBegin'},
					forced:true,
					filter:function(event,player){
						return !event.directHit;
					},
					priority:-1,
					content:function(){
						if(typeof trigger.shanRequired=='number'){
							trigger.shanRequired+=player.lili;
						}
						else{
							trigger.shanRequired=player.lili;
						}
					}
            	},
            	baigui2:{
            		audio:2,
					trigger:{source:'damageEnd'},
					forced:true,
					filter:function(event,player){
						return event.card&&event.card.name=='sha';
					},
					content:function(){
						var burn = player.lili-1;
						player.loselili(burn);
						for (var i = 0; i < burn; i ++){
							if (trigger.player.countCards('hej')>0) player.discardPlayerCard(trigger.player,'hej',true);
						}
					}
            	},
            },
            translate:{
            	suika:'萃香',
            	cuiji:'萃集',
            	cuiji_audio1:'（吨吨吨吨——）',
            	cuiji_audio2:'Zzzzzz',
            	cuiji_buff:'萃集',
            	cuiji_buff_audio1:'DUANG！',
            	cuiji_buff_audio2:'亲身感受鬼的力量吧！',
            	cuiji_hp:'失去1点体力，获得2点灵力',
            	cuiji_lili:'消耗2点灵力，回复1点体力',
            	cuiji_info:'准备阶段，或你造成弹幕伤害后你可以选择一项：1. 失去1点体力，然后获得2点灵力；2. 消耗2点灵力值，然后回复1点体力；若你的灵力大于体力，一回合一次，你可以将一张黑色牌当作不计次数的【轰！】使用/打出。',
            	baigui:'百万鬼夜行',
            	baigui_audio1:'哈哈哈哈！「百万鬼夜行」！',
            	baigui_audio2:'你比月亮起来，哪个更硬一些啊？',
            	baigui_info:'符卡技（0）你使用攻击牌指定目标后，令目标对该牌使用的前X张防御牌无效；该牌造成弹幕伤害后，你须将灵力消耗至1，弃置受伤角色Y张牌 （X为体力值，Y为消耗的灵力值）',
            	suika_die:'那就先到这里吧。',
            },
      };
});