'use strict';
game.import('character',function(lib,game,ui,get,ai,_status){
	return {
		name:'d3',
		connect:false,
		character:{
			//zigui:['female','5',5,["shijianliushi","always_win","xinjianfuka1"]],
			zigui:['female','5',5,["shijianliushi"]],
			zither:['female','2',3,["zhisibuyu","chenshihuanxiang"]],
			actress:['female','3',3,["ye’sbian","schrÖdinger"]],
			bullygang:['male','1',3,["huanshu","zuanqu","aidoulu"]],
			yukizakura:['female','3',3,["fenxue","ys_luoying"]],
			hemerocalliscitrinabaroni:['female','3',3,["yinyangliuzhuan","daofaziran"]],
			wingedtiger:['female','1',4,["wt_zongqing","wt_feihu"],["des:ＲＢＱＲＢＱ"]],
			pear:['female','3',4,['guaiqiao','aaaaa']],
			icetea:['female', '0', 5, ['chouka', 'kejing', 'renli'],[],[],'10'],
		},
		characterIntro:{
			zigui:'咕咕咕~',
			zither:'<font color=\"#FF1116\"><b>天下疆域，风雨水土，终将归我所有，<br /><br />你便是成了灰，化了骨，也只能是<br /><br /><font size="4"><b>我的灰，我的骨。</b></font></b></font>',
			bullygang:'白嫖到最后一无所有',
			actress:'月が綺麗ですね<sub>……</sub>',
			hemerocalliscitrinabaroni:'今天你平衡了么？<br />我可以帮你好好<font size="5"><b>平衡</b></font>（物理）一下',
			pear:'凤梨倒了~',
			yukizakura:'信仰鸽子的幻想乡巫女',
			icetea:'一个单机的抽卡玩家……',
		},	   
		perfectPair:{
		},
		skill:{
			always_win:{
				fixed:true,
				trigger:{global:'gameStart'},
				content:function(){
					game.incidentover(player, 'scarlet');
				}
			},
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
							ui.create.dialog('<div><div style="width:100%;text-align:right;font-size:18px">你是'+lib.config.connect_nickname+'吧？<br>欢迎来到东方流星夜！<br>我是新手导师子规！');
							ui.create.div('.avatar',ui.dialog).setBackground('zigui','character');
						}
						ui.create.control('老师好！',step2);
					}
					var step15 = function(){
						clear();
						var dialog = '';
						if (lib.config.connect_nickname == '黑白葱'){
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
					player:"shaBefore"
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
					player.loselili(2);
					'step 1'
					player.chooseCard('请使用一张基本牌或法术牌','h',function(card){
						return get.type(card) == 'basic' || get.type(card) == 'trick' && lib.filter.cardEnabled({name:card.name},player,_status.event);
					}).set('ai',function(card){
						return 1;
					});
					'step 2'
					if(result.bool&&result.cards.length){
						var players=game.filterPlayer();
						var list = [];
						for (var i = 0; i < players.length; i++){
							if (lib.filter.targetEnabled2(result.cards[0],player,players[i])) list.push(players[i]);
						}
						players.remove(player);
						player.useCard(result.cards[0],list,false);
					}
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
			huanshu:{
				audio:2,
				trigger:{player:'chooseToRespondBegin'},
				filter:function(event,player){
					var list = [];
                    for (var i in lib.card){
                        if(lib.card[i].mode&&lib.card[i].mode.contains(lib.config.mode)==false) continue;
                        if(lib.card[i].forbid&&lib.card[i].forbid.contains(lib.config.mode)) continue;
                        if(lib.card[i].type == 'basic'){
                            list.add(i);
                        }
                    }
                    var h = false;
                    for (var i = 0; i < list.length; i ++){
                    	if (event.filterCard({name:list[i]},player) && lib.filter.cardRespondable({name:list[i]},player)) h = true;
                    }
					var e = 0;
					var j = 0;
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i ++){
						if (players[i].countCards('e') > 0) e ++;
						if (players[i].countCards('j') > 0) j ++;
					}
					if (e < 2 && j < 2) return false;
					return !player.hasSkill('huanshu2') && h;
				},
				//这些东西哪怕在filter里都不发动
				//if(event.responded) return false;
				//if(!event.filterCard({name:'shan'},player,event)&&!!event.filterCard({name:'sha'},player,event)) return false;
				//if(player.hasSkill('zhenshan2')) return false;
				//var nh=player.countCards('h');
				//return game.hasPlayer(function(current){
				//	return current!=player&&current.countCards('h')<nh;
				//});
				content:function(){
					'step 0'
					player.chooseTarget('幻术：选择两名角色，交换这些角色相同区域内的一张牌',[2,2],function(card,player,target){	
						if (ui.selected.targets.length > 0){
							var check = false;
							if (ui.selected.targets[0].countCards('e') > 0 && target.countCards('e') > 0) check = true;
							if (ui.selected.targets[0].countCards('j') > 0 && target.countCards('j') > 0) check = true;
							return check;
						} else {
							return target.countCards('ej') > 0;
						}
					}, true).ai=function(target){
						//return get.attitude(player,target);
						return 1;
					}
					'step 1'
					if (result.bool){
						event.targets = result.targets;
						var str = '';
						if (event.targets[1].countCards('e') > 0) str += 'e';
						if (event.targets[1].countCards('j') > 0) str += 'j';
						player.choosePlayerCard(event.targets[0],str,true);
					}
					'step 2'
					if (result.bool){
						event.card1 = result.cards[0];
						var str = '';
						if (get.type(event.card1) == 'equip') str = 'e';
						if (get.type(event.card1) == 'delay') str = 'j';
						player.choosePlayerCard(event.targets[1],str,true);
					}
					'step 3'
					if(result.bool){
						event.targets[0].lose(event.card1,ui.special).set('type','gain');
						event.targets[1].lose(result.cards,ui.special).set('type','gain');
						if (get.type(event.card1) == 'equip') event.targets[1].equip(event.card1);
						else event.targets[1].addJudge(event.card1);
						if (get.type(result.cards[0]) == 'equip') event.targets[0].equip(result.cards[0]);
						else event.targets[0].addJudge(result.cards[0]);
						player.logSkill('huanshu',event.targets);
						player.addTempSkill('huanshu2',{player:'phaseBegin'});
						trigger.untrigger();
						trigger.responded=true;
						if(trigger.filterCard({name:'shan'})){
							trigger.result={bool:true,card:{name:'shan'}}
						}
						else{
							trigger.result={bool:true,card:{name:'sha'}}
						}
					}
				},
				group:'huanshu_use',
			},
			huanshu2:{},
			huanshu_use:{
				hiddenCard:function(player,name){
                    return name == 'shan';
                },
				enable:'chooseToUse',
				filter:function(event,player){
					var e = 0;
					var j = 0;
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i ++){
						if (players[i].countCards('e') > 0) e ++;
						if (players[i].countCards('j') > 0) j ++;
					}
					if (e < 2 && j < 2) return false;
					return !player.hasSkill('huanshu2');
				},
				chooseButton:{
					dialog:function(event,player){
						var list = [];
                        for (var i in lib.card){
                            if(lib.card[i].mode&&lib.card[i].mode.contains(lib.config.mode)==false) continue;
                            if(lib.card[i].forbid&&lib.card[i].forbid.contains(lib.config.mode)) continue;
                            if(lib.card[i].type == 'basic'){
                                list.add(i);
                            }
                        }
                        for(var i=0;i<list.length;i++){
                            list[i]=[get.type(list[i]),'',list[i]];
                        }
                        return ui.create.dialog([list,'vcard']);
					},
					check:function(button){
						var player=_status.event.player;
						var card={name:button.link[2],nature:button.link[3]};
						if(game.hasPlayer(function(current){
							return player.canUse(card,current)&&get.effect(current,card,player,player)>0;
						})){
							if(card.name=='sha'){
								return 2.9;
							}
							else if(card.name=='tao'){
								return 4;
							}
						}
						return 1;
					},
					filter:function(button,player){
                        return _status.event.getParent().filterCard({name:button.link[2]},player) && player.getCardUsable(button.link[2]);
                        //return lib.filter.filterCard({name:button.link[2]},player,_status.event.getParent()) && !player.storage.muqi.contains(button.link[2]);
                    },
					backup:function(links,player){
						return {
							filterCard:function(){return false},
							viewAs:{name:links[0][2],nature:links[0][3]},
							selectCard:-1,
							popname:true,
							log:false,
							audio:'huanshu',
							precontent:function(){
								'step 0'
								player.chooseTarget('幻术：选择两名角色，交换这些角色相同区域内一张牌',[2,2],function(card,player,target){	
									if (ui.selected.targets.length > 0){
										var check = false;
										if (ui.selected.targets[0].countCards('e') > 0 && target.countCards('e') > 0) check = true;
										if (ui.selected.targets[0].countCards('j') > 0 && target.countCards('j') > 0) check = true;
										return check;
									} else {
										return target.countCards('ej') > 0;
									}
								}, true).ai=function(target){
									//return get.attitude(player,target);
									return 1;
								}
								'step 1'
								if (result.bool){
									event.targets = result.targets;
									var str = '';
									if (event.targets[1].countCards('e') > 0) str += 'e';
									if (event.targets[1].countCards('j') > 0) str += 'j';
									player.choosePlayerCard(event.targets[0],str,true);
								}
								'step 2'
								if (result.bool){
									event.card1 = result.cards[0];
									var str = '';
									if (get.type(event.card1) == 'equip') str = 'e';
									if (get.type(event.card1) == 'delay') str = 'j';
									player.choosePlayerCard(event.targets[1],str,true);
								}
								'step 3'
								if(result.bool){
									event.targets[0].lose(event.card1,ui.special).set('type','gain');
									event.targets[1].lose(result.cards,ui.special).set('type','gain');
									if (get.type(event.card1) == 'equip') event.targets[1].equip(event.card1);
									else event.targets[1].addJudge(event.card1);
									if (get.type(result.cards[0]) == 'equip') event.targets[0].equip(result.cards[0]);
									else event.targets[0].addJudge(result.cards[0]);
									player.logSkill('huanshu',event.targets);
									player.addTempSkill('huanshu2',{player:'phaseBegin'});
								}
							},
						}
					},
					prompt:function(links,player){
						return '选择'+get.translation(links[0][2])+'的目标';
					}
				},
				ai:{
					order:function(){
						var player=_status.event.player;
						var event=_status.event;
						var nh=player.countCards('h');
						if(game.hasPlayer(function(current){
							return get.attitude(player,current)>0&&current.countCards('h')<nh;
						})){
							if(event.type=='dying'){
								if(event.filterCard({name:'tao'},player,event)){
									return 0.5;
								}
							}
							else{
								if(event.filterCard({name:'tao'},player,event)){
									return 4;
								}
								if(event.filterCard({name:'sha'},player,event)){
									return 2.9;
								}
							}
						}
						return 0;
					},
					save:true,
					respondSha:true,
					skillTagFilter:function(player,tag,arg){
						if(player.hasSkill('huanshu2')) return false;
						var nh=player.countCards('h');
						return game.hasPlayer(function(current){
							return current!=player&&current.countCards('h')<nh;
						});
					},
					result:{
						player:function(player){
							if(_status.event.type=='dying'){
								return get.attitude(player,_status.event.dying);
							}
							else{
								return 1;
							}
						}
					},
				},
			},
			zuanqu:{
				audio:2,
				unique:true,
				trigger:{player:'gainAfter'},
				direct:true,
				usable:4,
				forced:true,
				filter:function(event,player){
					if(event.parent.parent.name=='phaseUse') return false;
					return event.cards&&event.cards.length>0
				},
				content:function(){
					"step 0"
					event.cards=trigger.cards.slice(0);
					"step 1"
					player.gainlili();
				},
			},
			aidoulu:{
				spell:["aidoulu_2"],
				cost:4,
				audio:2,
				priority:5,
				roundi:true,
				trigger:{player:'phaseBeginStart'},
				filter:function(event,player){
					return player.lili > lib.skill.aidoulu.cost;
				},
				check:function(event,player){
					return false;
				},
				content:function(){
					player.loselili(lib.skill.aidoulu.cost);
					player.turnOver();
				},
			},
			aidoulu_2:{
				audio:2,
				trigger:{global:'phaseBegin'},
				check:function(event,player){
					return game.hasPlayer(function(current){
						return get.attitude(player,current)<0;
					});
				},
				content:function(){
					trigger.player.addTempSkill('aidoulu_3');
					trigger.player.recover();
				},
				prompt2:'令当前回合角色回复1点体力，且其本回合使用【轰】造成的伤害+1',
			},
			aidoulu_3:{
				trigger:{source:'damageBegin'},
				filter:function(event){
					return event.card&&event.card.name=='sha'&&event.notLink();
				},
				forced:true,
				content:function(){
					trigger.num++;
				},
				ai:{
					damageBonus:true
				},
			},
			fenxue:{
				audio:2,
				enable:'phaseUse',
				usable:1,
				filterTarget:function(card,player,target){
					if(player==target) return false;
					if(target.group=='unknown') return false;
					var color_num = [];
					var players = game.filterPlayer();
					var cards = [];
					for(var i=0;i<players.length;i++){
						cards = players[i].getCards('e');
						for(var j=0;j<cards.length;j++){
							if (!color_num.contains(get.suit(cards[j]))) color_num.push(get.suit(cards[j]));
						}
					}
					if(ui.selected.targets.length >= Math.max(1, color_num.length)) return false;//(color_num.length == 0 && ui.selected.targets.length >= 1)||(color_num.length != 0 && ui.selected.targets.length >= color_num.length)
					return target.countCards('he')>0;
				},
				filter:function(event,player){
					return player.countCards('he')>0;
				},
				filterCard:true,
				position:'he',
				selectTarget:[1,Infinity],
				check:function(card){
					if(get.suit(card)=='heart') return 8-get.value(card);
					return 5-get.value(card);
				},
				content:function(){
					"step 0"
					player.discardPlayerCard(targets[num],'hej');
					"step 1"
					if(result.bool&&result.links&&result.links.length){
						if(get.suit(result.links[0])=='heart') targets[num].draw();
					}
					"step 2"
					if (num != targets.length - 1) event.goto(4);
					"step 3"
					if(get.suit(cards[0])=='heart') player.draw();
					"step 4"
					game.delay();
				},
				ai:{
					result:{
						target:-1
					},
					threaten:1.2,
					order:3
				},
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
						if (list.contains('获得本回合进入弃牌堆的一张与弃置的牌花色不同的牌')) return '获得本回合进入弃牌堆的一张与弃置的牌花色不同的牌';
						return '对一名角色造成1点灵击伤害';
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
				trigger:{global:'phaseAfter'},
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

			yinyangliuzhuan:{
				audio:"ext:d3:2",
				group:["kangjizhihui","huangxueyuye"],
				trigger:{
				},
				check:function (event,player){},
				content:function (){},
			},
			kangjizhihui:{
				audio:2,
				trigger:{global:'phaseUseEnd'},
				filter:function(event,player){
					if(event.player.countCards('h')>event.player.hp&&event.player.countGainableCards(player,'h')&&event.player!=player) return true;
					return false;
				},
				content:function(){
					"step 0"
					player.gainPlayerCard(get.prompt('kangjizhihui',trigger.player),trigger.player,get.buttonValue,'h').set('logSkill',['kangjizhihui',trigger.player]);
				},
				check:function(event, player){
					return -get.attitude(player,event.player);
				},
			},
			huangxueyuye:{
				audio:2,
				trigger:{global:'phaseUseEnd'},
				filter:function(event,player){
					if(event.player.countCards('h')<event.player.hp&&player.countGainableCards(event.player,'h')&&event.player!=player) return true;
					return false;
				},
				content:function(){
					"step 0"
					player.chooseCard('交给'+get.translation(trigger.player)+'一张手牌',true).set('ai',function(card){
						return 5-get.value(card);
					});
					"step 1"
					if(result.bool){
						trigger.player.gain(result.cards[0],player);
						player.$give(1,trigger.player);
					}
				},
				check:function(event, player){
					return get.attitude(player,event.player) > 0 && player.countCards('h') > 2;
				},
			},
			daofaziran:{
				spell:["daofaziran2"],
				cost:2,
				roundi:true,
				audio:2,
				trigger:{player:'phaseBegin'},
				filter:function(event,player){
					return player.lili > lib.skill.daofaziran.cost;
				},
				check:function(event,player){
					return false;
				},
				content:function(){
					player.loselili(lib.skill.daofaziran.cost);
					player.turnOver();
				},
			},
			daofaziran2:{
				audio:"ext:d3:true",
				trigger:{global:'phaseDiscardBegin'},
				filter:function(event,player){
					//if(event.player.getHandcardLimit()==0) return false;
					return true;
				},
				content:function (){
					"step 0"
					var list = [];
					var target = trigger.player;
					list.push('令'+get.translation(target)+'手牌上限+1');
					if (target.getHandcardLimit()!=0){
						list.push('令'+get.translation(target)+'手牌上限-1');
					}
					var choice = get.attitude(player,target);
					player.chooseControl(list,function(){
                                    if (choice >= 0) return '令'+get.translation(target)+'手牌上限+1';
                                    else return '令'+get.translation(target)+'手牌上限-1';
                              }).set('choice',choice);
					"step 1"
					if(result.control=='令'+get.translation(trigger.player)+'手牌上限+1'){
						trigger.player.addTempSkill('wy_fatian', 'phaseEnd');
					}
					else{
						trigger.player.addTempSkill('wy_xiangdi', 'phaseEnd');
					}
					"step 2"
					if(trigger.player.countCards('h')==trigger.player.getHandcardLimit()){
						var maxhand = player.getHandcardLimit()
						if(player.countCards('h')>maxhand){
							player.discardPlayerCard(player,'h',player.countCards('h')-maxhand,true);
						}else{
							player.draw(maxhand-player.countCards('h'));
						}
					}
				},
			},
			wy_fatian:{
				mod:{
					maxHandcard:function(player,num){
						return num + 1;
					}
				}
			},
			wy_xiangdi:{
				mod:{
					maxHandcard:function(player,num){
						return num - 1;
					}
				}
			},
			guaiqiao:{
				unique:true,
				global:'guaiqiao2',
				zhuSkill:true,
			},
			guaiqiao2:{
				enable:'phaseUse',
				discard:false,
				line:true,
				prepare:'give',
				filter:function(event,player){
					if (!player.countCards('h') > 0) return false;
					return game.hasPlayer(function(target){
						return target!=player&&target.hasSkill('guaiqiao',player);
					});
				},
				filterTarget:function(card,player,target){
					return target!=player&&target.hasSkill('guaiqiao',player);
				},
				usable:1,
				content:function(){
					'step 0'
					game.trySkillAudio('guaiqiao2',target,true);
					target.gain(player.getCards('h'),player);
					target.chooseControl('令'+get.translation(player)+'获得1点灵力','令'+get.translation(player)+'摸一张牌',function(event,player){
						return '令'+get.translation(player)+'摸一张牌';
					}, true);
					'step 1'
					if(result.control=='令'+get.translation(player)+'获得1点灵力'){
						player.gainlili();
					}
					else{
						player.draw();
					}
				},
				ai:{
					expose:0.3,
					order:10,
					result:{
						target:5,
						player:function(player,target){
							if (lib.config.pear_nobrain) return 1000000;
                            if (player.countCards('h') <= 3){
                            	return 0;
                            } else
                            	return -10000;
                        }
					},
				},
				check:function(event,player){
					return player.countCards('h') < 3;
				},
			},
			aaaaa:{
				audio:2,
				trigger:{player:'gainAfter'},
				filter:function(event,player){
					return event.cards.length >= 2 && player.lili > 0;
				},
				content:function(){
					player.loselili();
					player.recast(trigger.cards);
				},
				check:function(event,player){
					var v = 0;
					for (var i = 0; i < event.cards.length; i ++){
						v += get.value(event.cards[i]);
					}
					return v / event.cards.length < 4;
				},
			},
			chouka:{
				audio:2,
				enable:'phaseUse',
				usable:1,
				filter:function(event, player){
					return player.lili > 0;
				},
				content:function(){
					'step 0'
					var list = [];
					for (var i = 0; i < player.lili; i ++){
						list.push(i+1);
					}
					player.chooseControl(list,function(){
							return player.lili-2;
					}).set('prompt','消耗任意点灵力');
					'step 1'
					if (result.control){
						player.loselili(result.control);
						event.num = result.control;
					}
					'step 2'
					if (event.num){
						player.judge(function(card){
							if(get.number(card) == 1 || get.number(card) > 10) return 1;
							return -1;
						});
					}
					'step 3'
					if(result.number){
						if (get.number(result.card) == 1 || get.number(result.card) > 10){
							game.trySkillAudio('chouka',player,true,3);
							player.recover();
						}
					}
					event.num --;
					if (event.num > 0)event.goto(2);
				},
				ai:{
					order:3,
					result:{
						player:1,
					}
				},
			},
			kejing:{
				audio:2,
				trigger:{player:'phaseUseBegin'},
				filter:function(event, player){
					return player.countCards('h') || player.hp > 0;
				},
				content:function(){
					'step 0'
					player.chooseToDiscard([1, Infinity],'h','你可以弃置任意张手牌，获得等量灵力').set('ai',function(card){
							if (player.lili > 6) return false;
							return 7-get.value(card);
						});
					'step 1'
					if (result.bool){
						player.gainlili(result.cards.length);
					}
					var list = [];
					for (var i = 0; i < player.hp; i ++){
						list.push(i);
					}
					player.chooseControl(list, function(){
						if (player.hp > 3 && player.lili < 7) return 1;
						return 0;
					}).set('prompt','你可以失去任意点体力，获得等量灵力');
					'step 2'
					if (result.control){
						player.loseHp(result.control);
						player.gainlili(result.control);
					}
				},
				check:function(){
					return true;
				},
			},
			renli:{
				audio:0,
				trigger:{player:'judgeEnd'},
				forced:true,
				init:function(player){
					player.storage.renli=[];
				},
				intro:{
					content:'card',
				},
				filter:function(event,player){
					if(get.owner(event.result.card)){
						return false;
					}
					if(event.nogain&&event.nogain(event.result.card)){
						return false;
					}
					return get.number(event.result.card);
				},
				content:function(){
					'step 0'
					var numbers = [];
					for (var i = 0; i < player.storage.renli.length; i ++){
						numbers.push(get.number(player.storage.renli[i]));
					}
					if (!numbers.contains(get.number(trigger.result.card))){
						game.trySkillAudio('renli',player,true,1);
						trigger.result.card.goto(ui.special);
						player.storage.renli.push(trigger.result.card);
						trigger.result.node.moveDelete(player);
						game.broadcast(function(cardid,player){
							var node=lib.cardOL[cardid];
							if(node){
								node.moveDelete(player);
							}
						},trigger.result.node.cardid,player);
						game.addVideo('gain2',player,get.cardsInfo([trigger.result.node]));
						player.markSkill('renli');
						game.addVideo('storage',player,['renli',get.cardsInfo(player.storage.renli),'cards']);
					} else {
						game.trySkillAudio('renli',player,true,2);
						player.gain(trigger.result.card);
						player.$gain2(trigger.result.card);
					}
					'step 1'
					if (player.storage.renli.length == 13){
						player.$skill('人理守护',null,null,true);
						game.trySkillAudio('renli',player,true,3);
						if (player == game.me){
							game.over(true);
						} else {
							game.over(false);
						}
					}
				}
			},
		},
		translate:{
			zigui:'子规',
			zigui_die:'太过分了！太过分了！',
			zither:'听琴',
			zither_die:'一丝遗憾，未灭……',
			actress:'伶',
			wingedtiger:'飞虎',
			bullygang:'豪曹',
			bullygang_die:'静下心来听我唱歌不好么，跳那么傻的舞然后看起来比我还要累的样子，不要用满是汗的爪子来摸我的手啊，恶心死个人了',
			
			yukizakura:'雪樱',
			yukizakura_die:'樱花，继续飘落……',
			hemerocalliscitrinabaroni:'忘忧',
			hemerocalliscitrinabaroni_die:'鸿蒙初开，天地初判，混沌分割，洪荒始衍。',
			wingedtiger_die:'在此，施撒所有的诅咒将会永世伴随着妳们，妾身就是有着如此之大的怨念啊！',
			pear:'凤离',

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
			cshx1:"尘世幻想",
			cshx1_info:"你使用牌无距离限制",
			zhongzhenbuyu_audio1:'对或是错，决定的人是我。',
			zhongzhenbuyu_audio2:'听命于我，否则自行了断。',
			shizhibuyu_audio1:'是对是错，由我自己决定。',
			shizhibuyu_audio2:'服从我吧，或者，去死吧！',
			chenshihuanxiang_audio1:'谁都别想逃，谁都逃不掉！',
			chenshihuanxiang_audio2:'一切，终将，归我所有！',

			"ye’sbian":"夜之彼岸",
			"ye’sbian_info":"当你造成或受到弹幕伤害后，你可以消耗1点灵力：展示受伤角色或伤害来源的所有手牌，获得其所有黑色牌。",
			"schrÖdinger":"活猫心脏",
			"schrÖdinger_info":"锁定技，你坠机时，展示所有其他角色的手牌：若有角色有【葱】，该角色坠机。",
			"ye’sbian_audio1":'亡鸦不渡寒潭。',
			"ye’sbian_audio2":'永不复还。',
			"schrÖdinger_audio1":'合拢的嘴，泄密的心……',
			"schrÖdinger_audio2":'它还在楼上跳个不停。',
			huanshu:'幻术',
			huanshu_info:'你可以交换场上两张装备牌或两张技能牌的位置，视为你使用/打出了一张基本牌；然后，此技能无效，直到你的回合开始。',
			huanshu_audio1:'只有红茶可以吗？',
			huanshu_audio2:'别乱动！别乱动！',
			huanshu2:'幻术',
			huanshu_use:'幻术',
			zuanqu:'赚取',
			zuanqu_info:'锁定技，当你于出牌阶段外获得牌后，你获得1点灵力。',
			zuanqu_audio1:'这个可以有！',
			zuanqu_audio2:'114！514！',
			aidoulu:'偶像',
			aidoulu_2:'偶像（贴效果）',
			aidoulu_audio1:'你NP，不是，灵力满了！',
			aidoulu_audio2:'啊啊啊啊！啊，嗷嗷，啊啊啊啊啊！（迫真）',
			aidoulu_info:'符卡技（4）<永续>一名角色的回合开始时，你可以令其回复1点体力，且直到回合结束，该角色使用【轰】造成的伤害+1。',
			fenxue:"纷雪",
			fenxue_info:"一回合一次，出牌阶段，你可以依次弃置至多X名角色与你的各一张牌，以此法弃置红桃牌的角色各摸一张牌（X为场上牌的花色数且至少为1）",
			ys_luoying:"落樱",
			ys_luoying_info:"符卡技（1）<永续>当你因弃置而失去手牌时，你可以选择一项：获得一张本回合进入弃牌堆的与之花色不同的牌；或对一名角色造成1点灵击伤害。",
			ys_luoying_3:"落樱",
			ys_fenxue_audio1:"雪花像绽放的礼花 天地间肆意的飘洒 纵情在一霎那~<sup>♪</sup>",
			ys_fenxue_audio2:"又到了《ホワイトアルバム》的季节呢",
			ys_luoying_audio1:"呐，樱花每秒下落的速度，你知道吗？",
			ys_luoying_audio2:"落红不是无情物",
			yinyangliuzhuan:'阴阳流转',
			yinyangliuzhuan_info:'一名角色的出牌阶段结束时，若其手牌数：大于体力值，你可以获得其一张手牌；小于体力值，你可以交给其一张手牌。',
			kangjizhihui:'阴阳流转',
			kangjizhihui_info:'你可以获得当前回合角色一张手牌。',
			huangxueyuye:'阴阳流转',
			huangxueyuye_info:'你可以交给当前回合角色一张手牌。',
			daofaziran:'道法自然',
			daofaziran_info:'符卡技（2）<永续>一名角色的弃牌阶段开始时，你可以令其手牌上限+1或-1，然后若其手牌数等于上限，你将手牌数调整至上限。',
			daofaziran2:'道法自然',
			wy_fatian:'法天',
			wy_fatian_info:'你的手牌上限+1',
			wy_xiangdi:'象地',
			wy_xiangdi_info:'你的手牌上限-1',
			kangjizhihui_audio1:'阳动而行，阴止而藏；阳动而出，阴随而入。',
			kangjizhihui_audio2:'鸿渐于陆，其羽可用为仪，吉。',
			huangxueyuye_audio1:'阳动而行，阴止而藏；阳动而出，阴随而入。',
			huangxueyuye_audio2:'鸿渐于陆，其羽可用为仪，吉。',
			daofaziran_audio1:'易有太极,始生两仪。两仪生四象,四象生八卦。',
			daofaziran_audio2:'道生一，一生二，二生三，三生万物。',
			wt_zongqing:"纵情",
			wt_zongqing_info:"准备阶段，你可以将灵力补至体力上限的点数；若如此做，你减1点体力上限。",
			wt_zongqing_audio1:'把妳的不开心说出来让我们高兴高兴',
			wt_zongqing_audio2:'zZＺ',
			wt_feihu:"设计不错但下一秒就是我的",
			wt_feihu_info:"<font color=\"red\"><b>限定技，</b></font>出牌阶段开始时，你声明一名其他角色的符卡，比如“新建符卡1”；若如此做，你获得声明技能的拷贝。",
			wt_feihu_audio1:'你们就只能拿出这么点东西来吗',
			wt_feihu_audio2:'真好啊，真好呢（嘲讽意）',
			wt_feihu_audio3:'我跟你讲，这个符卡超好用的',
			guaiqiao:'乖巧',
			guaiqiao2:'乖巧（给牌）',
			guaiqiao_info:'一回合一次，其他角色的出牌阶段，其可以交给你所有手牌，然后你选择一项：令其：获得1点灵力，或摸一张牌。',
			guaiqiao2_audio1:'还是好饿，嘤嘤嘤。',
			guaiqiao2_audio2:'主人对我最好了，嘻嘻。',
			aaaaa:'你们怎么可以这样嘛',
			aaaaa_info:'你获得牌时，若你获得了至少两张牌，你可消耗1点灵力，重铸这些牌。',
			aaaaa_audio1:'哼唧',
			aaaaa_audio2:'什么嘛 真是的',
			icetea:'冰茶',
			chouka:'抽卡',
			chouka_info:'一回合一次，出牌阶段，你可以消耗任意点灵力，并进行等量次判定：若判定牌点数为字母，你回复1点体力。',
			chouka_audio1:'英灵桑，求求你来我迦吧',
			chouka_audio2:'你是我唯一想要的卡',
			chouka_audio3:'又抽到一张好卡呢',
			kejing:'氪金',
			kejing_info:'出牌阶段开始时，你可以弃置任意张手牌，或失去任意点体力，并获得等量的灵力。',
			kejing_audio1:'玄能救非，氪必改命',
			kejing_audio2:'再来一单，一定出货',
			renli:'人理守护',
			renli_bg:'英',
			renli_info:'锁定技，你的判定牌生效后：若你没有与之相同点数的“英灵”，将之置于你的角色牌上，称为“英灵”；否则，你获得之；若你拥有13张“英灵”，你单独胜利。',
			renli_audio1:'啊，出货了出货了',
			renli_audio2:'流星夜，卸载！',
			renli_audio3:'抽卡就能出货的世界不是很值得守护么',
			icetea_die:'就算死我也要氪给你看',
		},
	};
});