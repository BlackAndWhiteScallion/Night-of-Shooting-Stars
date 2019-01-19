'use strict';
game.import('character',function(lib,game,ui,get,ai,_status){
	return {
		name:'d3',
		connect:false,
		character:{
			zigui:['female','5',5,[]],
			zither:['female','2',3,["zhisibuyu","chenshihuanxiang"]],
		},
		characterIntro:{
			zigui:'咕咕咕~',
			zither:'心火怎甘扬汤止沸',
		},       
		perfectPair:{
		},
            skill:{
				zhisibuyu:{
					audio:"ext:d3:true",
					group:["zhongzhenbuyu","shizhibuyu"],
					trigger:{
					},
					check:function (event,player){},
					content:function (){},
				},
				zhongzhenbuyu:{
					audio:2,
					trigger:{
					player:"shaBefore",
					},
					check:function (event,player){
						return true;
					},
					content:function (){
						"step 0"
						var list = [];
						var target = trigger.target;
						if (target.countCards('he') > 0){
							list.push('令'+get.translation(player)+'获得你一张牌');
						}
						list.push('不可响应此【轰！】');
						target.chooseControl(list,function(event,target){
							if (target.countCards('he') == 0 && list.contains('不可响应此【轰！】')) return '不可响应此【轰！】';
						});
						"step 1"
						if(result.control=='不可响应此【轰！】'){
							trigger.directHit=true;
						}
						else{
							player.gainPlayerCard('he',trigger.target,true);
							trigger.cancel();
						}
					},
				},
				shizhibuyu:{
					audio:2,
					trigger:{
						player:"useCardToBefore",
					},
					priority:9,
					forced:false,
					filter:function (event){
						return (get.type(event.card)=='trick'&&event.card.name!='wuxie'&&get.type(event.card)!='delay');
					},
					content:function (event,player){
						if (get.type(event.card)=='trick' && (event.card.name!='wuxie' && get.type(event.card)!='delay'))return;
						"step 0"
						var list = [];
						var target = trigger.target
						if (target.countCards('he') > 0){
							list.push('令'+get.translation(player)+'获得你一张牌');
						}
						list.push('不可响应此法术');
						target.chooseControl(list,function(event,target){
											if (target.countCards('he') == 0 && list.contains('不可响应此法术')) return '不可响应此法术';
										});
						"step 1"
						if(result.control=='不可响应此法术'){
							trigger.target.addTempSkill('yuyi0', 'useCardToBegin');
						}
						else{
							player.gainPlayerCard('he',trigger.target,true);
							trigger.cancel();
						}
					}
				},
				chenshihuanxiang:{
					audio:2,
					trigger:{
						player:"phaseUseBegin",
					},
					check:function (event,player){
						if (player.countCards('h') < 1 || player.lili < 2) return false;
						return true;
					},
					content:function (event,player){
						'step 0'
						player.loselili(2)
						'step 1'
						player.addTempSkill('cshx0');
						'step 2'
						player.chooseToUse(function(card){
							if(!lib.filter.cardEnabled(card,_status.event.player,_status.event)){
								return false;
							}
							var type=get.type(card,'trick');
							return type=='basic'||type=='trick';
						},'请使用一张基本牌或法术牌',true).set('logSkill','chenshihuanxiang');
						'step 3'
						player.removeSkill('cshx0');
						event.finish();
					},
				},
				yuyi0:{
					unique:true,
					intro:{
						content:function (storage){
							return '不能使用法术牌';
						},
					},
					mark:true,
					onremove:true,
					mod:{
					cardEnabled:function(card,player){
						if(get.type(card)=='trick') return false;
					},
						cardUsable:function (card,player){
						if(get.type(card)=='trick') return false;
						},
						cardRespondable:function (card,player){
						if(get.type(card)=='trick') return false;
					},
					cardSavable:function(card,player){
						if(get.type(card)=='trick') return false;
						},
					},
				},
				cshx0:{
					audio:"ext:d3:2",
					forced:true,
					direct:true,
					trigger:{
						player:"useCard",
					},
					check:function (event,player){
						var type=get.type(event.card);
						return type=='basic'||type=='trick';
					},
					content:function (){
						'step 0'
						if(_status.currentPhase==player&&trigger.card.name=='sha') {
							if(player.stat[player.stat.length-1].card.sha>0){
								player.stat[player.stat.length-1].card.sha--;
							}
						}
					'step 1'
						var trigger=_status.event.getTrigger();
						var player=_status.event.player
						var info=get.info(trigger.card);
						if(trigger.targets&&!info.multitarget){
							var players=game.filterPlayer();
							var list = [];
							for(var i=0;i<players.length;i++){
								if(lib.filter.targetEnabled2(trigger.card,player,players[i])&&players[i]!=player&&!trigger.targets.contains(players[i])){
									list.push(players[i]);
								}
							}
							return trigger.targets.addArray(list);
							event.finish();
						}
					},
				},
            },
            translate:{
            	zigui:'子规',
            	zigui_die:'太过分了！太过分了！',
            	zither:'听琴',
            	zither_die:'此生无怨无悔',
				zhisibuyu:"至死不渝",
				zhisibuyu_info:"当你使用【轰！】或法术牌指定一名角色为目标时，你可以令该角色选择一项：令你获得其一张牌，然后此牌对其无效；或不能对之使用牌。",
					zhongzhenbuyu:"至死不渝",
				zhongzhenbuyu_info:"当妳使用【轰！】指定一名角色为目标时，妳可以令该角色选择一项：令妳获得其一张牌，然后此【杀】对其无效；或不能对此【杀】使用牌。",
					shizhibuyu:"至死不渝",
				shizhibuyu_info:"当妳使用法术牌指定一名角色为目标时，妳可以令所有目标角色选择一项：令妳获得其一张牌，然后此法术对其无效；或本回合不能法术牌。",
					chenshihuanxiang:"尘世幻想",
				chenshihuanxiang_info:"出牌阶段开始时，你可以消耗2点灵力，你使用一张基本牌或法术牌；若如此做，此牌需额外指定所有其他角色为目标。",
				yuyi0:"渝移",
				yuyi0_info:"妳本回合不能法术牌",
				cshx0:"尘世幻想",
				cshx0_info:"妳使用的牌额外指定所有其他角色为目标",
				zhongzhenbuyu_audio1:'我绝不会放弃，绝对不会！',
				zhongzhenbuyu_audio2:'你，是敌人还是朋友？',
				shizhibuyu_audio1:'我绝不会放弃，绝对不会！',
				shizhibuyu_audio2:'你，是敌人还是朋友？',
				chenshihuanxiang_audio1:'这是我自己选择的道路！',
				chenshihuanxiang_audio2:'妳们谁都别想置身事外',
            },
      };
});