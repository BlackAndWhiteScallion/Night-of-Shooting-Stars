'use strict';
game.import('character',function(lib,game,ui,get,ai,_status){
	return {
		name:'d3',
		connect:false,
		character:{
			zigui:['female','5',5,["shijianliushi","xinjianfuka1"]],
			zither:['female','2',3,["zhisibuyu","chenshihuanxiang"]],
			actress:['female','3',3,["ye’sbian","schrÖdinger"]],
			wingedtiger:['female','1',4,["wt_zongqing","wt_feihu"],["des:ＲＢＱＲＢＱ"]],
		},
		characterIntro:{
			zigui:'咕咕咕~',
			zither:'心火怎甘扬汤止沸',
		},	   
		perfectPair:{
		},
			skill:{
				shijianliushi:{
					audio:"ext:d3:true",
				},
				xinjianfuka1:{
					spell:["xinjianfuka2"],
					cost:4,
					audio:"ext:d3:true",
					trigger:{player:'phaseBegin'},
					filter:function(event,player){
						return player.lili > lib.skill.xinjianfuka1.cost;
					},
					check:function(event,player){
						return false;
					},
					content:function(){
						player.loselili(lib.skill.xinjianfuka1.cost);
						player.turnOver();
					},
				},
				xinjianfuka2:{
				},
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
					filter:function (event,player){
						if (player.countCards('h') < 1 || player.lili < 2) return false;
						return true;
					},
					check:function (event,player){
					if (player.countCards('h') < 3 || player.lili < 3) return false;
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
					content:function(){
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
				"ye’sbian":{
					audio:0,
					trigger:{player:'damageEnd',source:'damageEnd'},
					filter:function(event, player){
						if(event._notrigger.contains(event.player)||event.nature == 'thunder') return false;
						return event.num&&event.source&&event.player&&event.player.isAlive()&&event.source.isAlive()&&event.source!=event.player;
					},
					check:function(event,player){
						if(event.player==player) return -get.attitude(player,event.source);
						return -get.attitude(player,event.player);
					},
					content:function(){
						"step 0"
						event.target = trigger.player;
						if(trigger.player==player) event.target = trigger.source;
						player.loselili();
						"step 1"
						event.target.showHandcards();
						"step 2"
						player.gain(target.getCards('he',{color:'black'}),target,true);
						"step 3"
						game.delay();
					},
					ai:{
						maixie:true,
						maixie_hp:true
					}
				},
				"schrÖdinger":{
					audio:0,
					trigger:{
						player:'dieBegin',
					},
					forced:true,
					content:function(){
						"step 0"
						var players=game.filterPlayer();
						for(var i=0;i<players.length;i++){
							if(players[i]==player)continue;
							players[i].showHandcards();
							if(players[i].countCards('he',{name:'tao'}))players[i].addSkill('schrÖdinger_2');
						}
					}
				},
				"schrÖdinger_2":{
					audio:'ext:d3:2',
					trigger:{
						global:'dieAfter',
					},
					forced:true,
					content:function(){
						"step 0"
						player.die();
						game.trySkillAudio('schrÖdinger',player,true,Math.ceil(2*Math.random()));
						player.removeSkill('schrÖdinger_2');
					}
				},
				wt_zongqing:{
					audio:"ext:d3:2",
					trigger:{
						player:"phaseBegin",
					},
					check:function (event,player){
						if (player.isTurnedOver()) return false;
						if (player.maxHp == 0 && player.lili > 4) return false;
						if (player.lili >= player.maxHp) return false;
						return true;
					},
					content:function (){
						'step 0'
						player.gainlili(player.maxHp - player.lili);
						player.loseMaxHp();
					},
				},
				wt_feihu:{
					audio:0,
					init:function(player){
						player.storage.wt_feihu=false;
					},
					filter:function(event,player){
						if(player.storage.wt_feihu) return false;
						return true;
					},
					trigger:{player:'phaseUseBegin'},
					content:function (event,player){
						if(event.triggername=='phaseUseBegin'){
							'step 0'
							var list = [];
							var players = game.filterPlayer();
							for (var i = 0; i < players.length; i ++){
								var skills = players[i].getSkills(true)
								for(var j = 0;j < skills.length;j++){
									if (lib.skill[players[i].skills[j]] && lib.skill[players[i].skills[j]].spell){
										list.push(players[i].skills[j]);
									}
								}
							}
							'step 0'
							player.awakenSkill('wt_feihu');
							player.storage.wt_feihu=true;
							if(list.length==0)return false;
							player.chooseControl(list).set('prompt','选择获得一项技能');
							'step 1'
							player.addSkill(result.control);
							if(list.length<4){
								game.trySkillAudio('wt_feihu',player,true,1);
							} else if(Math.random()<0.75){
								game.trySkillAudio('wt_feihu',player,true,2);
							}else{
								game.trySkillAudio('wt_feihu',player,true,3);
							}
						}
					},
				},
			},
			translate:{
				zigui:'子规',
				zigui_die:'太过分了！太过分了！',
				zither:'听琴',
				zither_die:'此生无怨无悔……',
				actress:'伶',
				wingedtiger:'飞虎',
				wingedtiger_die:'在此，施撒所有的诅咒将会永世伴随着妳们，妾身就是有着如此之大的怨念啊！',
				
				shijianliushi:"时逝",
				shijianliushi_info:"这个技能组我过几天再写吧。",
				xinjianfuka1:"新建符卡１",
				xinjianfuka1_info:"符卡技（4）<font color=\"black\"><b>应该是个很厉害的大招吧</b></font>",
				xinjianfuka2:"新建符卡１",
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
				"ye’sbian":"夜之彼岸",
				"ye’sbian_info":"当你造成或受到弹幕伤害后，你可以消耗1点灵力：展示受伤角色或伤害来源的所有手牌，获得其所有黑色牌。",
				"schrÖdinger":"活猫心脏",
				"schrÖdinger_info":"锁定技，你坠机时，展示所有其他角色的手牌：若有角色有【葱】，该角色坠机。",
				"ye’sbian_audio1":'亡鸦不渡寒潭。',
				"ye’sbian_audio2":'永不复还。',
				"schrÖdinger_audio1":'合拢的嘴，泄密的心……',
				"schrÖdinger_audio2":'它还在楼上跳个不停。',
				wt_zongqing:"纵情",
				wt_zongqing_info:"准备阶段，你可以将灵力补至体力上限的点数；若如此做，你减1点体力上限。",
				wt_zongqing_audio1:'把妳的不开心说出来让我们高兴高兴',
				wt_zongqing_audio2:'zZＺ',
				wt_feihu:"设计不错但下一秒就是我的",
				wt_feihu_info:"<font color=\"red\"><b>限定技，</b></font>出牌阶段开始时，你声明一名其他角色的符卡，比如“新建符卡1”；若如此做，你获得声明技能的拷贝。",
				wt_feihu_audio1:'你们就只能拿出这么点东西来吗',
				wt_feihu_audio2:'真好啊，真好呢（嘲讽意）',
				wt_feihu_audio3:'我跟你讲，这个符卡超好用的',
			},
	};
});