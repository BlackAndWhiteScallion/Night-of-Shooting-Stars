'use strict';
game.import('character',function(lib,game,ui,get,ai,_status){
	return {
		name:'d3',
		connect:false,
		character:{
			//zigui:['female','5',5,["shijianliushi","xinjianfuka1"]],
			zigui:['female','5',5,["shijianliushi"]],
			zither:['female','2',3,["zhisibuyu","chenshihuanxiang"]],
			actress:['female','3',3,["ye’sbian","schrÖdinger"]],
			yukizakura:['female','3',3,["ys_fenxue","ys_luoying"]],
			wingedtiger:['female','1',4,["wt_zongqing","wt_feihu"],["des:ＲＢＱＲＢＱ"]],
		},
		characterIntro:{
			zigui:'咕咕咕~',
			zither:'<font color=\"#FF1116\"><b>天下疆域，风雨水土，终将归我所有，<br /><br />你便是成了灰，化了骨，也只能是<br /><br /><font size="4"><b>我的灰，我的骨。</b></font></b></font>',
			actress:'月が綺麗ですね<sub>……</sub>',
			yukizakura:'信仰鸽子的幻想乡巫女',
		},	   
		perfectPair:{
		},
			skill:{
				shijianliushi:{
					fixed:true,
					group:['shijianliushi2'],
					global:'shijianliushi3',
					audio:1,
					filter:function(event,player){
						return !_status.connectMode;
					},
					content:function(){
					}
				},
				// 游戏开始时，介绍游戏模式和胜利条件 
				shijianliushi2:{
					direct:true,
					trigger:{global:'gameStart'},
					global:'shijianliushi_silence',
					filter:function(event,player){
						return !_status.connectMode;
					},
					content:function(){
						var clear=function(){
							ui.dialog.close();
							while(ui.controls.length) ui.controls[0].close();
						};
						var clear2=function(){
							ui.auto.show();
							ui.arena.classList.remove('only_dialog');
						};
						var step1=function(){
							if (lib.config.connect_nickname=='黑白葱'){
								ui.create.dialog('<div><div style="width:100%;text-align:right;font-size:18px">你好啊——哎？？主人大人？？？</div>');
								ui.create.div('.avatar',ui.dialog).setBackground('zigui','character');
							}
							else {
								ui.create.dialog('<div><div style="width:100%;text-align:right;font-size:18px">你是'+lib.config.connect_nickname+'吧？<br>从阿求小姐那里听说了呢。<br>欢迎来到东方流星夜！<br>我是新手导师子规！')
								ui.create.div('.avatar',ui.dialog).setBackground('zigui','character');
							}
							ui.create.control('老师好！',step2);
						}
						var step15 = function(){
							clear();
							var dialog = '';
							if (lib.config.connect_nickname == '葱'){
								dialog = '哎，主人大人，早上好啊！';
							} else if (lib.config.connect_nickname == '伶'){
								dialog = '伶伶大人好！';
							} else {
								dialog = '你好啊，'+lib.config.connect_nickname+'!';
							}
							ui.create.dialog('<div><div style="width:100%;text-align:right;font-size:18px">'+dialog+'</div>');
							ui.create.div('.avatar',ui.dialog).setBackground('zigui','character');
							ui.create.control('老师好',step2);
						}
						var step2=function(){
							clear();
							ui.create.dialog('<div><div style="width:100%;text-align:right;font-size:18px">你现在所在的是'+lib.translate[get.mode()]+'模式！</div></div>');
							if (get.mode() == 'versus'){
								ui.dialog.add('<div><div style="width:100%;text-align:right;font-size:18px">对决模式中，两队玩家互相对抗并暴揍。</div></div>');
							} else if (get.mode() == 'identity'){
								ui.dialog.add('<div><div style="width:100%;text-align:right;font-size:18px">异变模式中，玩家们一方试图造成异变，另一方试图停止她们。</div></div>');
							} else if (get.mode() == 'old_identity'){
								ui.dialog.add('<div><div style="width:100%;text-align:right;font-size:18px">身份模式是三国杀同名模式复刻。</div></div>');
							} else if (get.mode() == 'stg'){
								ui.dialog.add('<div><div style="width:100%;text-align:right;font-size:18px">你为什么选我闯关啊！<br>闯关模式中，玩家单人连续击坠多名角色来试图突破关卡。</div></div>');
							} else if (get.mode() == 'boss'){
								ui.dialog.add('<div><div style="width:100%;text-align:right;font-size:18px">挑战模式中，三名玩家合作挑战一名BOSS角色。</div></div>');
							} else if (get.mode() == 'chess'){
								ui.dialog.add('<div><div style="width:100%;text-align:right;font-size:18px">其实……我也不知道战棋模式是什么……</div></div>');
							}
							ui.create.div('.avatar',ui.dialog).setBackground('zigui','character');
							ui.create.control('这模式要怎么玩？',step3);
						};
						var step3=function(){
							clear();
							ui.create.dialog('');
							ui.create.div('.avatar',ui.dialog).setBackground('zigui','character');
							if (get.mode() == 'versus'){
								ui.dialog.add('<div><div style="width:100%;text-align:right;font-size:18px">很简单啊，<br>只要把敌对方揍趴就行了！。</div></div>');
							} else if (get.mode() == 'identity'){
								ui.dialog.add('<div><div style="width:100%;text-align:right;font-size:18px">你的身份是'+lib.translate[game.me.identity+'2']+'。</div></div>');
								if (game.me.identity == 'fan'){
									ui.dialog.add('<div><div style="width:100%;text-align:right;font-size:18px">你需要找出黑幕来，然后<br><b>把她锤爆！</b></div></div>');
								} else if (game.me.identity == 'zhu'){
									ui.dialog.add('<div><div style="width:100%;text-align:right;font-size:18px">你要么反杀所有自机，<br>要么完成你的异变！</div></div>');
								} else if (game.me.identity == 'zhong'){
									ui.dialog.add('<div><div style="width:100%;text-align:right;font-size:18px">你要守住黑幕，<br>并反杀所有自机！</div></div>');
								} else if (game.me.identity == 'nei'){
									ui.dialog.add('<div><div style="width:100%;text-align:right;font-size:18px">你需要在游戏结束前<br>想办法完成异变！</div></div>');
								}
							} else if (get.mode() == 'old_identity'){
								ui.dialog.add('<div><div style="width:100%;text-align:right;font-size:18px">你的身份是'+lib.translate[game.me.identity+'2']+'。</div></div>');
								if (game.me.identity == 'fan'){
									ui.dialog.add('<div><div style="width:100%;text-align:right;font-size:18px">你需要打爆黑幕！</div></div>');
								} else if (game.me.identity == 'zhu'){
									ui.dialog.add('<div><div style="width:100%;text-align:right;font-size:18px">你需要不被自机打爆！</div></div>');
								} else if (game.me.identity == 'zhong'){
									ui.dialog.add('<div><div style="width:100%;text-align:right;font-size:18px">你需要祈祷黑幕不被打爆！</div></div>');
								} else if (game.me.identity == 'nei'){
									ui.dialog.add('<div><div style="width:100%;text-align:right;font-size:18px">你需要打爆其他所有人！</div></div>');
								}
							} else if (get.mode() == 'stg'){
								ui.dialog.add('<div><div style="width:100%;text-align:right;font-size:18px">来一个打爆一个就行了！</div></div>');
								ui.dialog.add('<div><div style="width:100%;text-align:right;font-size:18px">你有三次复活机会（右上角可以查看）</div></div>');
								ui.dialog.add('<div><div style="width:100%;text-align:right;font-size:18px">还有一些特殊规则也在右上角查看</div></div>');
							} else if (get.mode() == 'boss'){
								if (game.me.identity == 'zhu'){
									ui.dialog.add('<div><div style="width:100%;text-align:right;font-size:18px">你需要把所有盟军角色<br>打进重整状态。</div></div>');
								} else {
									ui.dialog.add('<div><div style="width:100%;text-align:right;font-size:18px">你们需要合作打爆boss。</div></div>');
								}
								ui.dialog.add('<div><div style="width:100%;text-align:right;font-size:18px">盟军角色坠机后会重整：<br>重整完毕后满血复活<br>重整时间在右上可以查看。</div></div>');
							} else if (get.mode() == 'chess'){
								ui.dialog.add('<div><div style="width:100%;text-align:right;font-size:18px">额……你自己探索吧！加油！</div></div>');
							}
							ui.create.control('知道了',step4);
						};
						var step4=function(){
							clear();
							ui.create.dialog('<div><div style="width:100%;text-align:right;font-size:18px">有问题的话，<br>可以在你的出牌阶段问我问题！');
							ui.create.div('.avatar',ui.dialog).setBackground('zigui','character');
							ui.create.control('嗯嗯',step5);
						};
						var step5=function(){
							clear();
							clear2();
							game.resume();
						};
						game.pause();
						if (!lib.config.new_tutorial){
							step1();
						} else {
							step15();
						}
					},
				},
				shijianliushi3:{
					direct:true,
					enable:'phaseUse',
					filter:function(event,player){
						return !_status.connectMode && player == game.me;
					},
					content:function(){
						'step 0'
						ui.arena.classList.add('only_dialog');
						event.list = ['牌和技能要怎么用，怎么查看？','那些绿色的星星是什么？','符卡技怎么用？','异变/异变牌是什么？','明置身份有什么用？','头上这些像是判定的东西是什么？','体系特殊事项？','老师我喜欢你！'];
						player.chooseControlList(event.list,'想问老师什么问题？');
						'step 1'
						if (result.index == 0){
							game.me.storage.jieshuo = ['牌和技能的描述可以在<br>卡牌/角色身上右键单击<br>或悬空1秒查看<br>双击角色还可以看到<br>角色简介，能换皮肤！','牌在需要用的时候，点一下，<br>如果有目标就选目标，<br>然后点确定就行了。',
							'技能也类似：<br>需要使用的时候是会跳选择的。','出牌阶段使用的技能，<br>会出现一个触发用按钮<br>就像这个问答的按钮！'];
						} else if (result.index == 1){
							game.me.storage.jieshuo = ['每个人身上的绿色的星星<br>就是<b>灵力值</b>啦！','灵力值是流星夜的核心体系！<br> 就是每个人身上那条绿色的星星。','灵力值的作用很多：<br>你的攻击范围等于你的灵力<br>强化牌时需要消耗灵力<br>发动符卡时需要消耗灵力',
							'加灵力的方式也不少：<br>牌堆里所有在下方有<br>“灵力：+1”的牌都是会加灵力的','如果你的灵力降到0的话<br>你不能造成任何伤害！','但是没关系<br>如果你准备和结束阶段都没灵力<br>回合结束后，你会获得1点！<br>(这个设置可以关闭)'];
						} else if (result.index == 2){
							game.me.storage.jieshuo = ['符卡技！<br>在准备阶段消耗标注量的灵力，<br>然后获得描述里的技能<br>直到回合结束！','要发动符卡必须要灵力<b>大于</b>描述<br>中的点数。<br>（3）就要4点灵力才能发动。',
							'符卡技发动还有一些注意事项：<br>符卡发动中，防止角色获得灵力。<br>角色灵力变成0时，符卡结束。','符卡技中的标签也是有效果的：<br>永续：到自己回合开始才结束<br>瞬发：可以在要用的时候再发动<br>限定：一局游戏只能发动一次<br>终语：可以在决死状态使用<br>极意：无限时间，但是一旦结束就立即坠机'];
						} else if (result.index == 3){
							game.me.storage.jieshuo = ['异变牌，就是代表有异变发动了！','异变牌上有<b>胜利条件</b>和<b>异变效果</b>。','胜利条件，只要达成了<br>你就游戏胜利了。<br>异变效果是，像技能一样，<br>赋予你的角色的效果。',
							'注意，<br>异变牌上的胜利条件和效果在<br><b>异变牌暗置</b>时是不生效的。<br>比如路人身份获得后。','异变模式中，可以随时在右上角<br>查看场上有哪些明置异变牌。'];
						} else if (result.index == 4){
							game.me.storage.jieshuo = ['异变模式中，所有角色的身份都是暗的！<br>所以，出牌阶段，你可以明置身份牌！','每个身份牌的明置有不同效果：<br>黑幕：获得一张明置异变牌<br>异变：令一名角色摸一张牌<br>自机：令一名角色选择，弃一张或明置身份<br>路人：获得一张暗置异变牌。',
							'没事，路人的暗置异变牌<br>可以在出牌阶段内明置的。','顺便，计算阵营时，没有明置身份的角色是没有阵营的。'];
						} else if (result.index == 5){
							game.me.storage.jieshuo = ['幻想乡里是没有判定牌的，<br>这些东西是技能牌！<br>技能牌是一种特殊牌！<br>技能牌有自己的牌堆，<br>并且没有花色点数种类属性。','技能牌获得后，进入技能牌区内。<br>像装备牌一样，持有技能牌的玩家，<br>可以任意使用技能牌上的技能。',
							'技能牌最多只能带3张<br>多了的话需要弃到3张。','技能牌可以被弃置，获得，<br>或者重铸。'];
						} else if (result.index == 6){
							game.me.storage.jieshuo = ['流星夜里有不少与三国杀不同，<br>但是也不足以专门划出来介绍呢……','拼点完了之后，<br>拼点双方各摸一张牌！<br>毕竟突然没牌了是坏文明？',
							'装备区里什么东西都可以装<br>就是最多装三张。','异变模式中，<br>击坠角色奖励是：<br>获得1点灵力，摸一张技能牌<br>无视双方身份和阵营哟。','强化：使用时，消耗灵力，<br>牌获得额外效果!','属性：牌上的新标签。<br>包括攻击，防御，支援，控场<br>并没有实际效果。','追加效果：游戏牌上的额外效果，<br>不计入牌的使用<br>也不消耗这张牌。',
							'明置牌：就是对所有玩家可见的牌<br>包括场上装备，技能牌，<br>和明置的手牌。','<b>禁忌牌：<br>牌堆里每种只有一张的，<br>效果独一无二，还带追加效果的<br>无比丧心病狂的卡牌！</b>'];
						} else if (result.index == 7){
							game.me.storage.jieshuo = ['QwQ？哎哎哎？','额……','那个那个……<br>如果你真的喜欢我的话!<br>就，就给我500万！<br>///w///'];
						}
						'step 2'
						var clear=function(){
							ui.dialog.close();
							while(ui.controls.length) ui.controls[0].close();
						};
						var clear2=function(){
							ui.auto.show();
							ui.arena.classList.remove('only_dialog');
						};
						var step1=function(){
							if (!game.me.storage.jieshuo) game.me.storage.jieshuo = ['没事，不急，慢慢来！'];
							//ui.create.dialog('<div><div style="width:100%;text-align:right;font-size:18px">'+game.me.storage.jieshuo[0]);
							ui.create.dialog('<div><div style="width:100%;text-align:right;font-size:18px">'+game.me.storage.jieshuo[0]+'</div></div>');
							ui.create.div('.avatar',ui.dialog).setBackground('zigui','character');
							ui.dialog.open();
							ui.create.control('继续',function(){
								clear();
								game.me.storage.jieshuo.remove(game.me.storage.jieshuo[0]);
								if (game.me.storage.jieshuo.length){
									step1();
								} else {
									game.resume();
								}
							});
						}

						game.pause();
						step1();
						ui.arena.classList.remove('only_dialog');
					}
				},
				shijianliushi4:{

				},
				shijianliushi5:{

				},
				/*
				shijianliushi_silence:{
					audio:1,
					enable:'phaseUse',
					filter:function(event,player){
						return player == game.me && lib.config.new_tutorial;
					},
					filterTarget:function(card,player,target){
						return target.hasSkill('shijianliushi');
					},
					content:function(){
						target.removeSkill('shijianliushi');
						game.trySkillAudio('shijianliushi',target,true,1);
						/*
						var count = 5;
						for (var i in lib.skill){
							target.addSkill(lib.skill[i]);
							count --;
							if (count == 0) break;
						}
						
					},
				},*/
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
					audio:2,
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
					audio:2,
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
					audio:2,
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
					audio:2,
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
							event.list = [];
							var players = game.filterPlayer();
							for (var i = 0; i < players.length; i ++){
								var skills = players[i].getSkills(true)
								for(var j = 0;j < skills.length;j++){
									if (lib.skill[players[i].skills[j]] && lib.skill[players[i].skills[j]].spell){
										event.list.push(players[i].skills[j]);
									}
								}
							}
							'step 1'
							player.awakenSkill('wt_feihu');
							player.storage.wt_feihu=true;
							if(event.list.length==0)return false;
							player.chooseControl(event.list).set('prompt','选择获得一项技能');
							'step 2'
							player.addSkill(result.control);
							if(event.list.length<4){
								game.trySkillAudio('wt_feihu',player,true,1);
							} else if(Math.random()<0.75){
								game.trySkillAudio('wt_feihu',player,true,2);
							}else{
								game.trySkillAudio('wt_feihu',player,true,3);
							}
						}
					},
				},
								ys_fenxue:{
					audio:2,
					enable:['chooseToUse'],
					group:['ys_fenxue_2'],
					usable:1,
					filterCard:function(card,player){
						return true;
					},
					position:'he',
					viewAs:{name:'guohe'},
					viewAsFilter:function(player){
						if(!player.countCards('he')) return false;
					},
					prompt:'将一张牌当【疾风骤雨】使用',
					check:function(card){return 4-get.value(card)},
					intro:{
						content:function(storage,player){
							if(player.storage.ys_fenxue){
								return '你可以将一张牌当【轰！】使用；此【轰！】指定目标后，你根据转化牌的种类执行下列效果：<br />攻击或武器～你与目标角色同时进行一次拼点：若你赢至少一次，此【轰！】不能成为【没中】的目标；防御或防具～你弃置目标角色各一张牌；辅助、宝物或道具～此【轰！】造成的弹幕伤害＋１。';
							}
						}
					},
					ai:{
						skillTagFilter:function(player){
							if(!player.countCards('he')) return false;
						},
					}
				},
				ys_fenxue_2:{
					forced:true,
					trigger:{player:'useCard'},
					filter:function(event, player){
						if (player.lili > 1 && event.skill =='ys_fenxue' && lib.card[event.card.name].enhance)return true;
						return false;
					},
					content:function(){
						game.log(get.translation(player)+'发动【纷雪】强化了'+get.translation(trigger.card.name)+'。');
						if (!player.storage._enhance) player.storage._enhance = 1;
						else player.storage._enhance++; 
					},
				},
				ys_luoying:{
					cost:1,
					audio:2,
					roundi:true,
					spell:["ys_luoying_2","ys_luoying_3","ys_luoying_4"],
					trigger:{
						player:"phaseBegin",
					},
					filter:function(event,player){
						return player.lili > lib.skill.ys_luoying.cost;
					},
					check:function(event,player){
						return true;
					},
					content:function(){
						'step 0'
						player.loselili(lib.skill.ys_luoying.cost);
						player.turnOver();
					},
					ai:{
						threaten:2,
					},
				},
				ys_luoying_2:{
					/*intro:{
						content:'cards'
					},*/
					trigger:{global:'loseEnd'},
					direct:true,
					filter:function(event,player){
						for(var i=0;i<event.cards.length;i++){
							if(get.position(event.cards[i])=='d') return true;
						}
						return false;
					},
					content:function(event,player){
						for (var i = 0; i < trigger.cards.length; i ++){
							if (!get.suit(trigger.cards[i])) continue;
							if (!player.storage.ys_luoying_2) player.storage.ys_luoying_2 = [trigger.cards[i]];
							else player.storage.ys_luoying_2.push(trigger.cards[i]); 
						}
					},   
				},
				ys_luoying_3:{
					trigger:{player:'discardAfter'},
					/*init:function(player){
						player.storage.ys_luoying_3=false;
					},*/
					filter:function(event,player){
						/*for (var i = 0; i < player.storage.ys_luoying_2.length; i ++){
							if (!get.suit(player.storage.ys_luoying_2[i])) continue;
							for (var j = 0; j < event.cards.length; j ++){
								if (get.suit(player.storage.ys_luoying_2[i]) != event.cards[j]) {
									return true;
								}
							}
						}
						return false;*/
						return true;
					},
					content:function(event,player){
						"step 0"
						var list = [];
						var dif_suit = false;
						for (var i = 0; i < player.storage.ys_luoying_2.length; i ++){
							if (!get.suit(player.storage.ys_luoying_2[i])) continue;
							for (var j = 0; j < trigger.cards.length; j ++){
								if (get.suit(player.storage.ys_luoying_2[i]) != get.suit(trigger.cards[j])) {
									dif_suit = true;
									if (!player.storage.ys_luoying_3) player.storage.ys_luoying_3 = [player.storage.ys_luoying_2[i]];
									else player.storage.ys_luoying_3.push(player.storage.ys_luoying_2[i]); 
									break;
								}
							}
						}
						if (dif_suit){
							list.push('获得本回合进入弃牌堆的一张与弃置的牌花色不同的牌');//'+get.translation(trigger.card.name)+'
						}
						list.push('对一名角色造成1点灵击伤害');
						player.chooseControl(list,function(event,player){
							if (player.countCards('he') == 0 && list.contains('对一名角色造成1点灵击伤害')) return '对一名角色造成1点灵击伤害';
						});
						"step 1"
						if(result.control=='对一名角色造成1点灵击伤害'){
							event.goto(4);
						}
						"step 2"
						player.chooseCardButton(player.storage.ys_luoying_3,'捡回一张牌',1,true).ai=function(button){
							var val=get.value(button.link);
							if(val<0) return -10;
							return val;
						}
						"step 3"
						if (result.links){
							player.gain(result.links)._triggered=null;
							for(var i=0;i<result.links.length;i++){
								ui.discardPile.remove(result.links[i]);
								player.storage.ys_luoying_2.remove(result.links[i]);
							}
						}
						event.goto(6);
						"step 4"
						player.chooseTarget('选择一名角色',true).set('ai',function(target){
							return -get.attitude(_status.event.player,target);
						}).set('enemy');
						"step 5"
						if(result.targets){
							result.targets[0].damage(1,'thunder');
						}
						"step 6"
						player.storage.ys_luoying_3 = [];
						player.syncStorage('ys_luoying_3');
					},
				},
				ys_luoying_4:{
					trigger:{player:'phaseAfter'},
					direct:true,
					filter:function(event,player){
						return true;
					},
					content:function(){
						"step 0"
						player.storage.ys_luoying_2 = [];
						player.syncStorage('ys_luoying_2');
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
				yukizakura:'雪樱',
				yukizakura_die:'樱花，继续飘落……',
				wingedtiger_die:'在此，施撒所有的诅咒将会永世伴随着妳们，妾身就是有着如此之大的怨念啊！',
				
				shijianliushi:"时逝",
				//shijianliushi_info:"这个技能组我过几天再写吧。",
				shijianliushi3:'老师，我有问题！',
				shijianliushi_silence:'子规闭嘴！',
				shijianliushi_audio1:'!@#$#*@%(%*@！',
				xinjianfuka1:"新建符卡１",
				//xinjianfuka1_info:"符卡技（4）<font color=\"black\"><b>应该是个很厉害的大招吧</b></font>",
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
				ys_fenxue:"纷雪",
				ys_fenxue_info:"一回合一次，出牌阶段，你可以将一张手牌当【疾风骤雨】使用，若你的灵力大于1点，强化之",
				ys_luoying:"落樱",
				ys_luoying_info:"符卡技（1）【永续】当你因弃置而失去手牌时，你可以选择一项：获得一张本回合进入弃牌堆的与之花色不同的牌；或对一名角色造成1点灵击伤害。",
				ys_luoying_3:"落樱",
				ys_fenxue_audio1:"雪花像绽放的礼花 天地间肆意的飘洒 纵情在一霎那~<sup>♪</sup>",
				ys_fenxue_audio2:"又到了《ホワイトアルバム》的季节呢",
				ys_luoying_audio1:"呐，樱花每秒下落的速度，你知道吗？",
				ys_luoying_audio2:"落红不是无情物",
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