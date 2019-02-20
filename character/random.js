'use strict';
game.import('character',function(lib,game,ui,get,ai,_status){
	return {
		name:'random',
		connect:true,
		character:{
			kanade:['female','3',3,['zhongzou','moxin']],
			//illyasviel:['female','1',3,['huanzhao','wuxian','quintette_fire']],
			shigure:['female','2',4,['kc_yuzhi','zuoshibaozhan']],
			arisa:['female','2',3,['yaowu','huanrao','sliver_arrow']],
			yudachi:['female','2',4,['hongxi','solomon']],
			megumin:['female','4',3,['honglian','sbrs_liansuo','explosion']],
			satone:['female','2',3,['guyin','tianze']],
			nero:['female','2',4,['muqi','AestusDomusAurea']],
			kurumi:['female','2',3,['kedan','shishu','shishi']],
		},
		characterIntro:{
			illyasviel:'在日本的动漫中十分常见的那种使用特殊能力帮助他人或对抗恶役的女孩子',
			shigure:'白露级驱逐舰2号舰，名是从前代神风级驱逐舰10号舰所继承。<br>出自：舰队collection <b>画师：konomi★きのこのみ</b>',
			yudachi:'白露级驱逐舰4号舰，以初春级为基础，加固了舰体，提高了稳定性。<br>出自：舰队collection <b>画师：ﾏｸｰ</b>',
			megumin:'以“艺术就是爆炸”为人生信条的小萝莉红魔法师。<br>出自：为美好的世界献上祝福！<b>画师：seki</b>',
			satone:'索菲亚琳·SP·撒旦七世，传说中的魔法魔王少女，可以召唤天使！<br>出自：中二病也要谈恋爱！ <b>画师：あかつき聖</b>',
			kanade:'啊，是天使，我死了——<br>死后世界的学校中的学生会长，标准的无口萌妹。<br>出自：Angel Beats! <b>画师：sua(スア)</b>',
			arisa:'守护森林的妖精弓手。（不过森林里的东西比她要恐怖多了）<br>出自：暗影之诗 <b>画师：黒井ススム</b>',
			nero:'古罗马的皇帝，比起皇帝更像个偶像，奢华浪费和浮夸无人能出其右。<br>出自:Fate/Extra <b>画师：demercles</b>',
		},	   
		perfectPair:{
		},
		skill:{
			zhongzou:{
				audio:2,
				trigger:{global:'phaseEnd'},
				group:["zhongzou_2","zhongzou_3",'zhongzou_5'],
				/*init:function(player){
					player.addSkill('zhongzou_4');
				},*/
				filter:function(event,player){
					if (player.lili <= 0) return false;
					return game.hasPlayer(function(current){
						return current.storage.zhongzou == true;
					});
				},
				content:function(){
					'step 0'
					player.loselili();
					var targets = [];
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i ++){
						if (players[i].storage.zhongzou == true) targets.push(players[i]);
					}
					if (targets.length) player.useCard({name:'sha'},targets,false);
				},
				check:function(event,player){
					var num = 0;
					num += game.countPlayer(function(current){
						return current.storage.zhongzou && get.attitude(player,current) < 0;
					});
					num -= game.countPlayer(function(current){
						return current.storage.zhongzou && get.attitude(player,current) > 0;
					});
					return player.lili > 1 && num > 0;
				},
				prompt:function(){
					var player=_status.event.player;
					var list=game.filterPlayer(function(current){
						return current.storage.zhongzou;
					});
					var str='是否发动【终奏】消耗1点灵力对'+get.translation(list)+'视为使用一张【轰！】？';
					return str;
				},
			},
			zhongzou_2:{
				trigger:{global:'damageEnd'},
				filter:function(event,player){
					if (!event.source) return false;
					return !event.card||get.subtype(event.card)!='attack';
				},
				direct:true,
				content:function(){
					trigger.source.storage.zhongzou = true;
				},
			},
			zhongzou_3:{
				trigger:{global:'useCard'},
				filter:function(event, player){
					return event.targets.length;
				},
				direct:true,
				content:function(){
					lib.skill['zhongzou_4'].trigger = {global:trigger.card.name + 'Cancelled'};
					player.removeSkill('zhongzou_4')
					player.addSkill('zhongzou_4');
				},
			},
			zhongzou_4:{
				direct:true,
				//trigger:{global:'shaCancelled'},
				trigger:{},
				content:function(){
					trigger.target.storage.zhongzou = true;
					player.removeSkill('zhongzou_4');
					/*
					if (trigger.targets){
						for (var i = 0; i < trigger.targets.length; i ++){
							trigger.targets[i].storage.zhongzou = true;
						}
					}*/
					//delete lib.skill['zhongzou_4'].trigger;
				},
			},
			zhongzou_5:{
				direct:true,
				trigger:{global:'phaseAfter'},
				content:function(){
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i ++){
						players[i].storage.zhongzou = false;
					}
				}
			},
			moxin:{
				trigger:{global:'phaseEnd'},
				//direct:true,
				filter:function(event,player){
					return event.player.isAlive()&&(!event.player.countUsed('sha')&&!event.player.getStat('damage'));
				},
				check:function(event,player){
					return get.attitude(player,event.player) >= 0;
				},
				content:function(){
					'step 0'
					var list = [];
					if (trigger.player.lili<trigger.player.maxlili){
						list.push('当前回合角色恢复灵力');
					}
					list.push('交给当前回合角色一张牌');
					player.chooseControl(list,function(event,player){
						if (!_status.currentPhase.isTurnedOver() && _status.currentPhase.lili < 3) return '当前回合角色恢复灵力';
						return '摸一张牌，交给当前回合角色一张牌';
					});
					'step 1'
					if (result.control == '当前回合角色恢复灵力'){
						trigger.player.gainlili();
					} else if (result.control == '摸一张牌，交给当前回合角色一张牌'){
						player.draw();
						if (trigger.player != player){
							player.chooseCard('交给'+get.translation(trigger.player)+'一张手牌',true).set('ai',function(card){
								return 5-get.value(card);
							});
						}
					}
					'step 2'
					if(result.bool){
						trigger.player.gain(result.cards[0]);
						player.$give(1,trigger.player);
					}
				},
			},
			huanzhao:{
				unique:true,
				forbid:['guozhan'],
				init:function(player){
					player.storage.huanzhao={
						list:[],
						shown:[],
						owned:{},
						player:player,
					}
				},
				get:function(player,num){
					if(typeof num!='number') num=1;
					var list=[];
					while(num--){
						var name=player.storage.huanzhao.list.randomRemove();
						var skills=lib.character[name][3].slice(0);
						for(var i=0;i<skills.length;i++){
							var info=lib.skill[skills[i]];
							if(info.unique&&!info.gainable){
								skills.splice(i--,1);
							}
						}
						player.storage.huanzhao.owned[name]=skills;
						// player.popup(name);
						game.log(player,'获得了一个化身');
						list.push(name);
					}
					if(player.isUnderControl(true)){
						var cards=[];
						for(var i=0;i<list.length;i++){
							var cardname='huanzhao_card_'+list[i];
							lib.card[cardname]={
								fullimage:true,
								image:'character:'+list[i]
							}
							lib.translate[cardname]=lib.translate[list[i]];
							cards.push(game.createCard(cardname,'',''));
						}
						player.$draw(cards);
					}
				},
				group:['huanzhao1','huanzhao2'],
				intro:{
					content:function(storage,player){
						var str='';
						var slist=storage.owned;
						var list=[];
						for(var i in slist){
							list.push(i);
						}
						if(list.length){
							str+=get.translation(list[0]);
							for(var i=1;i<list.length;i++){
								str+='、'+get.translation(list[i]);
							}
						}
						var skill=player.additionalSkills.huanzhao[0];
						if(skill){
							str+='<p>当前技能：'+get.translation(skill);
						}
						return str;
					},
					mark:function(dialog,content,player){
						var slist=content.owned;
						var list=[];
						for(var i in slist){
							list.push(i);
						}
						if(list.length){
							dialog.addSmall([list,'character']);
						}
						if(!player.isUnderControl(true)){
							for(var i=0;i<dialog.buttons.length;i++){
								if(!content.shown.contains(dialog.buttons[i].link)){
									dialog.buttons[i].node.group.remove();
									dialog.buttons[i].node.hp.remove();
									dialog.buttons[i].node.intro.remove();
									dialog.buttons[i].node.name.innerHTML='未<br>知';
									dialog.buttons[i].node.name.dataset.nature='';
									dialog.buttons[i].style.background='';
									dialog.buttons[i]._nointro=true;
									dialog.buttons[i].classList.add('menubg');
								}
							}
						}
						if(player.additionalSkills.huanzhao){
							var skill=player.additionalSkills.huanzhao[0];
							if(skill){
								dialog.add('<div><div class="skill">【'+get.translation(skill)+
								'】</div><div>'+lib.translate[skill+'_info']+'</div></div>');
							}
						}
					}
				},
				mark:true
			},
			huanzhao1:{
				trigger:{global:'gameStart',player:'enterGame'},
				forced:true,
				popup:false,
				priority:10,
				filter:function(event,player){
					return !player.storage.huanzhaoinited;
				},
				content:function(){
					for(var i in lib.character){
						if(lib.filter.characterDisabled2(i)) continue;
						var add=false;
						for(var j=0;j<lib.character[i][3].length;j++){
							var info=lib.skill[lib.character[i][3][j]];
							if(!info){
								continue;
							}
							if(info.gainable||!info.unique){
								add=true;break;
							}
						}
						if(add){
							player.storage.huanzhao.list.push(i);
						}
					}
					for(var i=0;i<game.players.length;i++){
						player.storage.huanzhao.list.remove([game.players[i].name]);
						player.storage.huanzhao.list.remove([game.players[i].name1]);
						player.storage.huanzhao.list.remove([game.players[i].name2]);
					}
					lib.skill.huanzhao.get(player,2);
					player.storage.huanzhaoinited=true;
					event.trigger('huanzhaoStart');
				}
			},
			huanzhao2:{
				audio:2,
				trigger:{player:['phaseBeginStart','phaseEnd','huanzhaoStart']},
				filter:function(event,player,name){
					if(name=='phaseBeginStart'&&game.phaseNumber==1) return false;
					return true;
				},
				priority:50,
				forced:true,
				popup:false,
				content:function(){
					'step 0'
					event.trigger('playercontrol');
					'step 1'
					var slist=player.storage.huanzhao.owned;
					var list=[];
					for(var i in slist){
						list.push(i);
					}
					event.switchToAuto=function(){
						var currentbutton=event.dialog.querySelector('.selected.button');
						if(!currentbutton){
							currentbutton=event.dialog.buttons[0];
							currentbutton.classList.add('selected');
						}
						event.clickControl(player.storage.huanzhao.owned[currentbutton.link].randomGet());
					}

					event.clickControl=function(link,type){
						if(link!='cancel2'){
							var currentname;
							if(type=='ai'){
								currentname=event.currentname;
							}
							else{
								currentname=event.dialog.querySelector('.selected.button').link;
							}
							player.storage.huanzhao.shown.add(currentname);
							var mark=player.marks.huanzhao;
							if(trigger.name=='game'||trigger.name=='enterGame'){
								mark.hide();
								// mark.style.transform='scale(0.8)';
								mark.style.transition='all 0.3s';
								setTimeout(function(){
									mark.style.transition='all 0s';
									ui.refresh(mark);
									mark.setBackground(currentname,'character');
									if(mark.firstChild){
										mark.firstChild.remove();
									}
									setTimeout(function(){
										mark.style.transition='';
										mark.show();
										// mark.style.transform='';
									},50);
								},500);
							}
							else{
								if(mark.firstChild){
									mark.firstChild.remove();
								}
								mark.setBackground(currentname,'character');
							}
							if(!player.additionalSkills.huanzhao||!player.additionalSkills.huanzhao.contains(link)){
								player.addAdditionalSkill('huanzhao',link);
								player.logSkill('huanzhao2');
								player.flashAvatar('huanzhao',currentname);
								game.log(player,'获得技能','【'+get.translation(link)+'】');
								player.popup(link);

								if(event.dialog&&event.dialog.buttons){
									for(var i=0;i<event.dialog.buttons.length;i++){
										if(event.dialog.buttons[i].classList.contains('selected')){
											var name=event.dialog.buttons[i].link;
											player.sex=lib.character[name][0];
											player.group=lib.character[name][1];
											// player.node.identity.style.backgroundColor=get.translation(player.group+'Color');
											break;
										}
									}
								}

								// if(event.triggername=='phaseBegin'){
								// 	(function(){
								// 		var skills=[link];
								// 		var list=[];
								// 		game.expandSkills(skills);
								// 		var triggerevent=event._trigger;
								// 		var name='phaseBegin';
								// 		for(i=0;i<skills.length;i++){
								// 			var trigger=get.info(skills[i]).trigger;
								// 			if(trigger){
								// 				var add=false;
								// 				if(player==triggerevent.player&&trigger.player){
								// 					if(typeof trigger.player=='string'){
								// 						if(trigger.player==name) add=true;
								// 					}
								// 					else if(trigger.player.contains(name)) add=true;
								// 				}
								// 				if(trigger.global){
								// 					if(typeof trigger.global=='string'){
								// 						if(trigger.global==name) add=true;
								// 					}
								// 					else if(trigger.global.contains(name)) add=true;
								// 				}
								// 				if(add&&player.isOut()==false) list.push(skills[i]);
								// 			}
								// 		}
								// 		for(var i=0;i<list.length;i++){
								// 			game.createTrigger('phaseBegin',list[i],player,triggerevent);
								// 		}
								// 	}());
								// }
							}
						}
						if(type!='ai'){
							// ui.auto.show();
							event.dialog.close();
							event.control.close();
							game.resume();
						}
					};
					if(event.isMine()){
						event.dialog=ui.create.dialog('选择获得一项技能',[list,'character']);
						for(var i=0;i<event.dialog.buttons.length;i++){
							event.dialog.buttons[i].classList.add('pointerdiv');
						}
						if(trigger.name=='game'){
							event.control=ui.create.control();
						}
						else{
							event.control=ui.create.control(['cancel2']);
						}
						event.control.custom=event.clickControl;
						event.control.replaceTransition=false;
						// ui.auto.hide();
						game.pause();
						for(var i=0;i<event.dialog.buttons.length;i++){
							event.dialog.buttons[i].classList.add('selectable');
						}
						event.custom.replace.button=function(button){
							if(button.classList.contains('selected')){
								button.classList.remove('selected');
								if(trigger.name=='game'){
									event.control.style.opacity=0;
								}
								else{
									event.control.replace(['cancel2']);
								}
							}
							else{
								for(var i=0;i<event.dialog.buttons.length;i++){
									event.dialog.buttons[i].classList.remove('selected');
								}
								button.classList.add('selected');
								event.control.replace(slist[button.link]);
								if(trigger.name=='game'&&getComputedStyle(event.control).opacity==0){
									event.control.style.transition='opacity 0.5s';
									ui.refresh(event.control);
									event.control.style.opacity=1;
									event.control.style.transition='';
									ui.refresh(event.control);
								}
								else{
									event.control.style.opacity=1;
								}
							}
							event.control.custom=event.clickControl;
						}
						event.custom.replace.window=function(){
							for(var i=0;i<event.dialog.buttons.length;i++){
								if(event.dialog.buttons[i].classList.contains('selected')){
									event.dialog.buttons[i].classList.remove('selected');
									if(trigger.name=='game'){
										event.control.style.opacity=0;
									}
									else{
										event.control.replace(['cancel2']);
									}
									event.control.custom=event.clickControl;
									return;
								}
							}
						}
					}
					else{
						var skills=[];
						var map={};
						for(var i=0;i<list.length;i++){
							var sub=player.storage.huanzhao.owned[list[i]];
							skills.addArray(sub);
							for(var j=0;j<sub.length;j++){
								map[sub[j]]=list[i];
							}
						}
						var add=player.additionalSkills.huanzhao;
						if(typeof add=='string'){
							add=[add];
						}
						if(Array.isArray(add)){
							for(var i=0;i<add.length;i++){
								skills.remove(add[i]);
							}
						}
						var cond='out';
						if(event.triggername=='phaseBegin'){
							cond='in';
						}
						skills.randomSort();
						skills.sort(function(a,b){
							return get.skillRank(b,cond)-get.skillRank(a,cond);
						});
						var choice=skills[0];
						event.currentname=map[choice];
						event.clickControl(choice,'ai');
					}
				}
			},
			xinsheng:{
				audio:2,
				unique:true,
				forbid:['guozhan'],
				trigger:{player:'damageEnd'},
				frequent:true,
				filter:function(event,player){
					return player.storage.huanzhao&&player.storage.huanzhao.list&&player.storage.huanzhao.list.length>0;
				},
				content:function(){
					for(var i=0;i<trigger.num;i++){
						lib.skill.huanzhao.get(player);
					}
				},
				ai:{
					maixie_hp:true
				}
			},
			wuxian:{
				audio:2,
				forced:true,
				trigger:{player:'phaseBegin'},
				filter:function(event,player){
					return true;
				},
				content:function(){
					"step 0"
					player.gainlili();
					"step 1"
					if(player.lili==player.maxlili){
						player.draw();
					}
				}
			},
			quintette_fire:{
				/*cost:0,
				audio:0,
				spell:["quintette_fire_2"],
				priority:10,
				trigger:{
					player:"phaseBegin",
				},
				filter:function(event,player){
					return true;//player.lili > (7 - player.storage.huanzhao.list.length);
				},
				check:function(event,player){
					return true;
				},
				content:function(){
					'step 0'
					player.loselili(7 - player.storage.huanzhao.list.length);
					player.turnOver();
				},
			},
			quintette_fire_2:{*/
				audio:2,
				trigger:{player:'phaseBegin'},
				check:function(event,player){
					for(var i=0;i<cards.length;i++){
						if(get.value(cards[i])>7) return false;
					}
					return true;
				},
				filter:function(event,player){
					return true;
				},
				content:function(){
					"step 0"
					player.chooseTarget(get.prompt('quintette_fire'),true).set('ai',function(target){
						return get.attitude(player,target);
					});
					"step 1"
					if(result.bool){
						result.targets[0].damage(3);
					}
					"step 2"
					var cards=player.getCards('h');
					player.discard(cards);
				}
			},
			kc_yuzhi:{
				audio:2,
				group:["kc_yuzhi_2"],
				forced:true,
				trigger:{global:"gameStart"},
				content:function(){
					'step 0'
					for(var i=0;i<ui.skillPile.childNodes.length;i++){
						if (ui.skillPile.childNodes[i].name == 'shenyou'){
							player.gain(ui.skillPile.childNodes[i]);
							break;
						} else if (i == ui.skillPile.childNodes.length -1){
							player.say('技能牌堆里并没有【神佑】，呵呵——');					  
						}
					}
				},
			},
			kc_yuzhi_2:{
				audio:2,
				trigger:{global:'phaseBegin'},
				filter:function(event,player){
					return (player.countCards('hej')>0);
				},
				check:function(event, player){
					//if (player.countCards('he') <= player.hp) return false;
					if (get.attitude(player, event.player) > 0) return false;
					var good_att = false;
					var players = game.filterPlayer();
					for(var i=0;i<players.length;i++){
						if (get.attitude(player, players[i])) good_att = true;
					}
					return good_att;
				},
				content:function(){
					"step 0"
					event.cards=player.getCards('hej');
					"step 1"
					if(event.cards.length>0){
						player.chooseCardButton('给出一张牌',true,event.cards,1).set('ai',function(button){
							if(ui.selected.buttons.length==0) return 1;
							return 0;
						});
					}
					"step 2"
					if(result.bool){
						event.cards.remove(result.links[0]);
						event.togive=result.links.slice(0);
						player.chooseTarget('将'+get.translation(result.links)+'交给一名其他角色',function(card,player,target){
							return player!=target;
						  }).set('ai',function(target){
						  	return get.attitude(player, target) - target.hp;
						});
					}
					"step 3"
					if(result.targets){
						result.targets[0].gain(event.togive,'draw');
						player.line(result.targets[0],'green');
						player.logSkill('kc_yuzhi',result.targets[0]);
						game.log(result.targets[0],'获得了'+get.cnNumber(event.togive.length)+'张牌');
						result.targets[0].addTempSkill('kc_yuzhi_3', 'phaseBegin');
					}
				},
			},
			kc_yuzhi_3:{
				audio:2,
				unique:true,
				mark:true,
				intro:{
					content:'成为',
				},
				onremove:true,
				trigger:{target:'shaBefore'},
				frequent:true,
				filter:function(event,player){
					//return event.card.subtype == 'attack';
					return event.card.name == 'sha';
				},
				content:function(){
					trigger.untrigger();
					trigger.finish();
				},
				check:function(){
					return true;
				},
			},
			zuoshibaozhan:{
				cost:2,
				audio:2,
				roundi:true,
				spell:["zuoshibao_2"],
				trigger:{
					player:"phaseBegin",
				},
				filter:function(event,player){
					return player.lili > lib.skill.zuoshibaozhan.cost;
				},
				check:function(event,player){
					return true;
				},
				content:function(){
					'step 0'
					player.loselili(lib.skill.zuoshibaozhan.cost);
					player.turnOver();
					'step 1'
					if(player.countCards('h')<3)player.draw(3-player.countCards('h'));
					'step 2'
					for(var i=0;i<ui.skillPile.childNodes.length;i++){
						if (ui.skillPile.childNodes[i].name == 'shenyou'){
							player.gain(ui.skillPile.childNodes[i]);
							break;
						} else if (i == ui.skillPile.childNodes.length -1){
							player.say('啊，没有【神佑】了吗……');					  
						}
					}
				},
			},
			zuoshibao_2:{
				audio:2,
				trigger:{player:['discardAfter','useCardAfter']},
				filter:function(event,player){
					if(event.name=='useCard'&&player==_status.currentPhase)return false;
					for(var i=0;i<event.cards.length;i++){
						if(get.position(event.cards[i])=='d'){
							return true;
						}
					}
					return false;
				},
				direct:true,
				popup:false,
				content:function(){
					"step 0"
					if(trigger.delay==false) game.delay();
					event.cards=[];
					for(var i=0;i<trigger.cards.length;i++){
						if(get.position(trigger.cards[i])=='d'){
							event.cards.push(trigger.cards[i]);
							ui.special.appendChild(trigger.cards[i]);
						}
					}
					"step 1"
					if(event.cards.length){
						var goon=false;
						for(var i=0;i<event.cards.length;i++){
							if(event.cards[i].name=='du'){
								goon=true;break;
							}
						}
						if(!goon){
							goon=game.hasPlayer(function(current){
								return player!=current&&get.attitude(player,current)>1;
							});
						}
						player.chooseCardButton(get.prompt('zuoshibao_2'),event.cards,[1,event.cards.length]).set('ai',function(button){
							if(!_status.event.goon||ui.selected.buttons.length) return 0;
							if(button.link.name=='du') return 2;
							return 1;
						}).set('goon',goon);
					} else{
						event.finish();
					}
					"step 2"
					if(result.bool){
						event.togive=result.links.slice(0);
						player.chooseTarget('将'+get.translation(result.links)+'交给一名角色',true,function(card,player,target){
							return target!=player;
						}).set('ai',function(target){
							if(target == player)return 0;
							var att=get.attitude(_status.event.player,target);
							if(_status.event.enemy){
								return -att;
							} else{
								if(att>2) return att/Math.sqrt(1+target.countCards('h'));
								return att/Math.sqrt(1+target.countCards('h'))/5;
							}
						}).set('enemy',get.value(event.togive[0])<0);
					} else{
						for(var i=0;i<event.cards.length;i++){
							event.cards[i].discard();
						}
						event.finish();
					}
					"step 3"
					if(result.bool){
						player.logSkill('zuoshibao_2',result.targets);
						for(var i=0;i<event.togive.length;i++){
							event.cards.remove(event.togive[i]);
						}
						result.targets[0].gain(event.togive,player);
						result.targets[0].$gain2(event.togive);
						event.goto(1);
					} else{
						for(var i=0;i<event.cards.length;i++){
							event.cards[i].discard();
						}
						event.finish();
					}
				},
				ai:{
					expose:0.1,
					effect:{
						target:function(card,player,target,current){
							if(target.hasFriend()&&get.tag(card,'discard')){
								if(current<0) return 0;
								return [1,1];
							}
						}
					}
				}
			},
			yaowu:{
				audio:2,
				trigger:{
					player:"phaseEnd",
				},
				priority:2,
				check:function(event,player){
					return true;
				},
				filter:function (event,player){
					player.countUsed()>2;
				},
				content:function(){
					'step 0'
					player.chooseTarget('令一名角色收回一张装备牌',function(card,player,target){
						return (player!=target&&target.getCards('e'));
					})
					'step 1'
					if(result.targets.length)return;
					var target1 = result.targets[0];
					target.choosePlayerCard(target1,'e',true);
					'step 2'
					if(result.links)return;
					target1.gain(result.links,'gain2');
					player.chooseTarget('选择弃置的位置',function(card,player,target){
						return (player!=target&&target.getCards('ej'));
					})
					'step 3'
					if(result.targets.length)return;
					var target2 = result.targets[0];
					player.discardPlayerCard(target2,'ej',true);
				},
			},
			huanrao:{
				audio:2,
				group:["huanrao_2"],
				enable:'phaseUse',
				viewAs:{name:'wuzhong'},
				usable:1,
				filterCard:true,
				viewAsFilter:function(player){
					return player.countCards('he')>0;
				},
				check:function(card){
					return 5-get.value(card);
				}
			},
			huanrao_2:{
				trigger:{
					target:"useCardToBegin",
				},
				direct:true,
				filter:function(event,player){
					if(event.card.name!='wuzhong'&&event.skill!='huanrao') return false;
					return true;
				},
				content:function(){
					"step 0"
					player.addTempSkill('huanrao_3')
				},
			},
			huanrao_3:{
				trigger:{player:'gainBegin'},
				forced:true,
				popup:false,
				filter:function(event,player){
					return true;
				},
				content:function(){
					player.addTempSkill('huanrao_4');
					if(!player.storage.huanrao){
						player.storage.huanrao=[];
					}
					for(var i=0;i<trigger.cards.length;i++){
						player.storage.huanrao.add(trigger.cards[i]);
					}
					player.removeSkill('huanrao_3')
				}
			},
			huanrao_4:{
				mod:{
					cardEnabled:function (card,player){
						if(_status.event.skill==undefined&&player.storage.huanrao.contains(card)) return false;
					},
					cardUsable:function (card,player){
						if(_status.event.skill==undefined&&player.storage.huanrao.contains(card)) return false;
					},
					cardRespondable:function (card,player){
						if(_status.event.skill==undefined&&player.storage.huanrao.contains(card)) return false;
					},
					cardSavable:function (card,player){
						if(_status.event.skill==undefined&&player.storage.huanrao.contains(card)) return false;
					},
				},
				enable:["chooseToUse"],
				filter:function(){
					return true;
				},
				filterCard:function(card){
					var player=_status.event.player;
					return player.storage.huanrao.contains(card);
				},
				viewAs:{name:"sha"},
				prompt:"将【环绕】牌当【杀】使用",
				sub:true,
			},
			sliver_arrow:{
				audio:2,
				spell:["sliver_arrow_2"],
				cost:4,
				audio:"ext:d3:true",
				trigger:{player:'phaseBegin'},
				filter:function(event,player){
					return player.lili > lib.skill.sliver_arrow.cost;
				},
				check:function(event,player){
					return false;
				},
				content:function(){
					player.loselili(lib.skill.sliver_arrow.cost);
					player.turnOver();
				},
			},
			sliver_arrow_2:{
				audio:2,
				trigger:{player:'phaseUseBefore'},
				direct:true,
				filter:function(event,player){
					return player.countCards('h');
				},
				content:function(){
					"step 0"
					player.chooseTarget('弃置一名角色一张牌',function(card,player,target){
						return (player!=target&&target.getCards('e'));
					})
					'step 1'
					if(result.targets.length)return;
					var target = result.targets[0];
					target.addTempSkill('sliver_arrow_3');
					player.discardPlayerCard(target,'he',Math.min(target.countCards('he'),player.countCards('h')),true);
					target.removeSkill('sliver_arrow_3');
					"step 2"
					//player.skip('phaseUse');
					player.skip('phaseDiscard');
					trigger.cancel();
				}
			},
			sliver_arrow_3:{
				audio:2,
				trigger:{target:'loseEnd'},
				forced:true,
				filter:function(event,player){
					if(event.player.countCards('he')) return false;
					for(var i=0;i<event.cards.length;i++){
						if(event.cards[i].original=='h'||event.cards[i].original=='e') return true;
					}
					return false;
				},
				content:function(){
					trigger.player.damage();
					trigger.player.damage('thunder');
				},
			},
			hongxi:{
				audio:3,
				enable:['chooseToUse'],
				group:['hongxi_2'],
				filterCard:function(card,player){
					return true;
				},
				position:'he',
				viewAs:{name:'sha'},
				viewAsFilter:function(player){
					if(!player.countCards('he')) return false;
				},
				prompt:'将一张牌当【轰！】使用',
				check:function(card){return 4-get.value(card)},
				intro:{
					content:function(storage,player){
						if(player.storage.hongxi){
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
			hongxi_2:{
				audio:2,
				forced:true,
				trigger:{player:'shaBefore'},
				filter:function(event,player){
					if(event.skill!='hongxi') return false;
					if(event.triggername=='shaBefore'&&event.target.countCards('h')==0)return false;
					if(event.triggername=='damageBefore'&&event.nature == 'thunder')return false;
					return true;
				},
				logTarget:'target',
				content:function(){
					if(event.triggername=='shaBefore'){
						if(get.subtype(trigger.cards[0])=='attack'||get.subtype(trigger.cards[0])=='equip1'){//get.itemtype(trigger.card)==''){
							player.chooseToCompare(trigger.target);
							if(result.bool){
								trigger.directHit=true;
							}
							
						}
						if(get.subtype(trigger.cards[0])=='defense'||get.subtype(trigger.cards[0])=='equip2'){
							if(player.countCards('he'))player.discardPlayerCard('he',trigger.target,true);
						}
					}
					if(player.storage.hongxi){
						if(get.subtype(trigger.cards[0])=='support'||get.subtype(trigger.cards[0])=='equip3'||get.subtype(trigger.cards[0])=='equip5'){
							player.addTempSkill('hongxi_3','damageBegin');
						}
					}
				}
			},
			hongxi_3:{
				audio:2,
				forced:true,
				onremove:function (player){
					delete player.storage.hongxi;
					player.unmarkSkill('hongxi');
				},
				trigger:{source:'damageBefore'},
				filter:function(event,player){
					return event.nature != 'thunder';
				},
				content:function(){
					if(player.storage.hongxi){
						if(get.subtype(trigger.cards[0])=='support'||get.subtype(trigger.cards[0])=='equip3'||get.subtype(trigger.cards[0])=='equip5'){
							trigger.num++;
						}
					}
				}
			},
			solomon:{
				cost:2,
				audio:0,
				spell:["hongxi_3"],
				trigger:{
					player:"phaseBegin",
				},
				filter:function(event,player){
					return player.hp == 1||player.lili > lib.skill.solomon.cost;
				},
				check:function(event,player){
					return true;
				},
				content:function(){
					'step 0'
					if(player.hp == 1){
						player.loselili(0);
					} else{
						player.loselili(lib.skill.solomon.cost);
					}
					player.turnOver();
					'step 1'
					for(var i=0;i<ui.skillPile.childNodes.length;i++){
						if (ui.skillPile.childNodes[i].name == 'lianji'){
							player.gain(ui.skillPile.childNodes[i]);
							break;
						} else if (i == ui.skillPile.childNodes.length -1){
							player.say('技能牌堆里居然没有【连击】了poi？？');					  
						}
					}
					'step 2'
					game.log(player,'更改了','【轰袭】','的描述');
					player.popup('更改描述');
					player.markSkill('hongxi');
					player.storage.hongxi=true;
				},
			},
			honglian:{
				audio:2,
				trigger:{
					player:'phaseBegin',
				},
				content:function (event,player){
					'step 0'
					player.chooseTarget('选择一名靶子',true).set('ai',function(target){
						return -get.attitude(_status.event.player,target);
					}).set('enemy');
					'step 1'
					if(result.targets.length){
						player.logSkill('honglian',result.targets);
						player.addTempSkill('honglian_2');
						result.targets[0].addTempSkill('honglian_3', 'phaseBegin');
					}
				},
				ai:{
					threaten:1,
				},
			},
			honglian_2:{
				trigger:{
					source:'damageEnd',
				},
				usable:1,
				forced:true,
				filter:function(event,player){
					return (event.player.hasSkill('honglian_3'));
				},
				content:function(event,player){
					'step 0'
					var list=[];
					var players = game.filterPlayer();
					for(var i=0;i<players.length;i++){
						if(get.distance(event.player,players[i])<=player.lili)list.push(players[i]);
					}
					player.useCard({name:'sha'},list,false);
				},
			},
			honglian_3:{
				mark:true,
			},
			sbrs_liansuo:{
				trigger:{
					player:'phaseBegin',
				},
				content:function (event,player){
					'step 0'
					player.chooseTarget('选择一名靶子',true).set('ai',function(target){
						return -get.attitude(_status.event.player,target);
					}).set('enemy');
					'step 1'
					if(result.targets){
						player.logSkill('sbrs_liansuo', result.targets);
						result.targets[0].addTempSkill('sbrs_liansuo_4');
						player.addTempSkill('sbrs_liansuo_2');
					}
				},
				ai:{
					threaten:1,
				},
			},
			sbrs_liansuo_2:{
				trigger:{global:'loseAfter'},
				/*init:function(player){
					player.storage.sbrs_liansuo=false;
				},*/
				forced:true,
				filter:function(event,player){
					if(event.player.hasSkill('sbrs_liansuo_4')){
						if (event.getParent(2).name == 'discardPlayerCard' || event.getParent().name == 'gain' || event.getParent(2).name == 'gainPlayerCard'){
							return true;
						}
					}
					return false;
				},
				usable:1,
				content:function(event,player){
					'step 0'
					var list=[];
					var players = game.filterPlayer();
					for(var i=0;i<players.length;i++){
						if(get.distance(event.player,players[i])<=player.lili)list.push(players[i]);
					}
					player.useCard({name:'sha'},list,false);
				},
			},
			sbrs_liansuo_4:{
				mark:true,
				trigger:{target:'useCardToBegin'},
				filter:function(event,player){
					return event.getParent().getParent().name == 'sbrs_liansuo_2';
				},
				content:function(){
					'step 0'
					player.chooseToDiscard('he','是否弃置一张非基本牌令莲锁无效？',function(card,player){
						return get.type(card)!='basic';
					}).set('ai', function(card){
						return 8 - get.value(card);
					});
					'step 1'
					if (result.bool){
						trigger.cancel();
					}
				},
				check:function(){
					return true;	
				},
			},
			explosion:{
				cost:4,
				audio:0,
				spell:["explosion_2"],
				trigger:{
					player:"phaseBegin",
				},
				filter:function(event,player){
					return player.lili > lib.skill.explosion.cost;
				},
				check:function(event,player){
					return true;
				},
				content:function(){
					'step 0'
					player.loselili(lib.skill.explosion.cost);
					player.turnOver();
				},
				ai:{
					threaten:2,
				},
			},
			explosion_2:{
				audio:2,
				trigger:{player:'phaseUseBefore'},
				skillAnimation:true,
				forced:true,
				direct:true,
				content:function(){
					"step 0"
					player.chooseTarget(get.prompt('explosion'),true).set('ai',function(target){
						return -get.attitude(player,target);
					});
					"step 1"
					if(result.bool){
						player.logSkill('explosion',result.targets);
						result.targets[0].damage(2);
						result.targets[0].damage(2,'thunder');
						result.targets[0].discard(result.targets[0].getCards('e'));
						trigger.cancel();
					}
				}
			},
			guyin:{
				forced:true,
				group:['guyin_2','guyin_3'],
				trigger:{player:'useCard'},
				filter:function(event, player){
					 return lib.card[event.card.name].enhance;
				},
				content:function(){
					game.log(get.translation(player)+'发动【孤樱】强化了'+get.translation(trigger.card.name)+'。');
					if (!player.storage._enhance) player.storage._enhance = 1;
					else player.storage._enhance++; 
				},
			},
			guyin_2:{
				forced:true,
				trigger:{player:'useCardToBegin', target:'useCardToBegin'},
				filter:function(event,player){
					return get.type(event.card) == 'basic' && event.targets.length == 1;
				},
				content:function(){
					'step 0'
					trigger.cancel();
                    var list = [];
                    for (var i in lib.card){
                        if(lib.card[i].mode&&lib.card[i].mode.contains(lib.config.mode)==false) continue;
                        if(lib.card[i].forbid&&lib.card[i].forbid.contains(lib.config.mode)) continue;
                        if(lib.card[i].type == 'trick' && lib.card[i].subtype == get.subtype(trigger.card)){
                            list.add(i);
                        }
                    }
                    for(var i=0;i<list.length;i++){
                        list[i]=['法术','',list[i]];
                    }
                    if(list.length){
                        trigger.player.chooseButton(['视为使用一张法术牌',[list,'vcard']]).set('ai',function(button){
                            var player=_status.event.player;
                            var card={name:button.link[2]};
                            return get.value(card);
                        });
                    } else {
                    	event.finish();
                    }
                    'step 1'
                    if(result&&result.bool&&result.links[0]){
                        var card = {name:result.links[0][2]};
                        event.fakecard=card;
                        if (trigger.player.canUse(event.fakecard,trigger.targets[0],true)){
                        	trigger.player.useCard(event.fakecard, trigger.targets[0]);
                    	}
                    } else {
                        event.finish();
                    }       
				},
			},
			guyin_3:{
				audio:2,
				enable:'chooseToUse',
				filterCard:function(card){
					return card.name == 'shan';
				},
				viewAsFilter:function(player){
					return player.countCards('h',{name:'shan'})>0;
				},
				viewAs:{name:'wuxie'},
				prompt:'将一张【没中】当【请你住口！】使用',
				check:function(card){return 8-get.value(card)},
				threaten:1.2,
				mod:{
					cardEnabled:function(card,player){
						if(card.name=='shan'&&_status.event.skill!='guyin_3') return false;
					},
					cardUsable:function(card,player){
						if(card.name=='shan'&&_status.event.skill!='guyin_3') return false;
					},
					cardRespondable:function(card,player){
						if(card.name=='shan'&&_status.event.skill!='guyin_3') return false;
					},
					cardSavable:function(card,player){
						if(card.name=='shan'&&_status.event.skill!='guyin_3') return false;
					},
				},
			},
			tianze:{
				forced:true,
				group:'tianze2',
				trigger:{player:'damageEnd'},
				filter:function(event,player){
					return event.nature != 'thunder' && event.source;
				},
				content:function(){
					trigger.source.damage('thunder', trigger.num);
				},
			},
			tianze2:{
				forced:true,
				trigger:{target:'useCardToBegin'},
				filter:function(event,player){
					return event.card && get.suit(event.card) == 'heart' && get.subtype(event.card) == 'support' && player.lili > 1;
				}, 
				content:function(){
					player.loselili();
					player.recover();
				},
			},
			muqi:{
				audio:2,
				group:'muqi2',
				enable:'chooseToUse',
				init:function(player){
					player.storage.muqi = [];
					player.node.framebg.dataset.auto='gold';
					player.node.framebg.dataset.decoration='gold';
				},
				filter:function(event,player){
                    return player.countCards('he')>1;
                },
                chooseButton:{
                    dialog:function(){
                        var list = [];
                        for (var i in lib.card){
                            if(lib.card[i].mode&&lib.card[i].mode.contains(lib.config.mode)==false) continue;
                            if(lib.card[i].forbid&&lib.card[i].forbid.contains(lib.config.mode)) continue;
                            if(lib.card[i].type == 'trick' || lib.card[i].type == 'basic'){
                                list.add(i);
                            }
                        }
                        for(var i=0;i<list.length;i++){
                            list[i]=[get.type(list[i]),'',list[i]];
                        }
                        return ui.create.dialog([list,'vcard']);
                    },
                    filter:function(button,player){
                    	return _status.event.getParent().filterCard({name:button.link[2]},player) && !player.storage.muqi.contains(button.link[2]);
                        //return lib.filter.filterCard({name:button.link[2]},player,_status.event.getParent()) && !player.storage.muqi.contains(button.link[2]);
                    },
                    check:function(button){
                        var player=_status.event.player;
                        return get.value({name:button.link[2]}) - 5;
                    },
                    backup:function(links,player){
                        return {
                            filterCard:function(card,player){
                                return true;
                            },
                            audio:2,
                            position:'he',
                            selectCard:2,
                            audio:2,
                            popname:true,
                            viewAs:{name:links[0][2]},
                            onuse:function(result,player){
                            	if (get.type(result.card.name) == 'trick') player.storage.muqi.push(result.card.name);
                            },
                        }
                    },
                    prompt:function(links,player){
                        return '将两张牌当作'+get.translation(links[0][2])+'使用';
                    },
                },
				hiddenCard:function(player,name){
                    return name == 'shan' || name == 'wuxie';
                },
                ai:{
                	save:true,
                    order:4,
                    result:{
                        player:function(player){
                            return 1;
                        }
                    },
                    threaten:1,
                }
			},
			muqi2:{
				direct:true,
				trigger:{global:'phaseAfter'},
				content:function(){
					player.storage.muqi = [];
				}
			},
			AestusDomusAurea:{
				  audio:2,
                  cost:2,
                  roundi:true,
                  spell:['ADA2','ADA3'],
                  trigger:{player:'phaseBegin'},
                  filter:function(event,player){
                      return player.lili > lib.skill.AestusDomusAurea.cost;
                  },
                  content:function(){
                      player.loselili(lib.skill.AestusDomusAurea.cost);
                      player.turnOver();
                      //console.log(player.getHandcardLimit());
                      //console.log(player.countCards('h'));
                      var num = player.getHandcardLimit() - player.countCards('h');
                      if (num > 0){
                      	player.draw(num);
                      }
                  },
                  check:function(){
                  	return true;
                  },
			},
			ADA2:{
				audio:2,
				enable:'phaseUse',
				init:function(player){
					game.pause();
					player.storage.ADA = [lib.config.background_music, ui.background.style.backgroundImage];
                    setTimeout(function(){
                    	if (lib.config.background_music != 'marisa') ui.backgroundMusic.src = '';
                    	player.say('目睹余之才华！耳闻万雷之喝彩！心怀掌权者的荣耀！');
                    	setTimeout(function(){
                    		if (lib.config.background_music != 'marisa'){
                    			ui.backgroundMusic.src = lib.assetURL+'audio/background/nero.mp3';
                    			lib.config.background_music = 'nero';
                    		}
                    		player.say('如花般怒放……开幕吧！黄金的剧场！！');
                    		setTimeout(function(){
                    			player.say('以这一轮为供奉吧……飞舞散落为华，斩开切裂为星！这才是至高的美……');
                    			setTimeout(function(){
                    				player.say('然后赞颂吧！黄金的剧场！！');
                    				player.$skill('黄金剧场',null,null,true);
                    				ui.background.setBackgroundImage('image/background/nero.jpg');
                    				game.resume();
                    			}, 1500);
                    		}, 1500);
                    	},1500);
                    },1500);
				},
				filter:function(event,player){
                    return player.countCards('h')>0;
                },
                onremove:function(player){
					ui.backgroundMusic.src = lib.assetURL+'audio/background/'+player.storage.ADA[0]+'.mp3';
					lib.config.background_music = player.storage.ADA[0];
					ui.background.style.backgroundImage = player.storage.ADA[1];
                },
                chooseButton:{
                    dialog:function(){
                        var list = [];
                        for (var i in lib.card){
                            if(lib.card[i].mode&&lib.card[i].mode.contains(lib.config.mode)==false) continue;
                            if(lib.card[i].forbid&&lib.card[i].forbid.contains(lib.config.mode)) continue;
                            if(lib.card[i].type == 'delay'){
                                list.add(i);
                            }
                        }
                        for(var i=0;i<list.length;i++){
                            list[i]=['delay','',list[i]];
                        }
                        return ui.create.dialog([list,'vcard']);
                    },
                    filter:function(button,player){
                    	return true;
                    },
                    check:function(button){
                        var player=_status.event.player;
                        return (button.link[2]=='shenyou')?1:0.5;
                    },
                    backup:function(links,player){
                        return {
                            filterCard:function(card,player){
                                return true;
                            },
                            position:'h',
                            selectCard:1,
                            audio:2,
                            popname:true,
  							content:function(event,player){
  								for(var i=0;i<ui.skillPile.childNodes.length;i++){
		                          if (ui.skillPile.childNodes[i].name == event.getParent().getParent()._result.links[0][2]){
		                            player.gain(ui.skillPile.childNodes[i]);
		                            break;
		                          } else if (i == ui.skillPile.childNodes.length -1){
		                              player.say('什么，余居然没有这种技能？');                      
		                          }
		                        }
  							}
                        }
                    },
                    prompt:function(links,player){
                        return '弃置一张牌，获得一张'+get.translation(links[0][2]);
                    },
                },
                ai:{
                    order:4,
                    result:{
                        player:function(player){
                            return 3 - player.countCards('j');
                        }
                    },
                    threaten:1,
                }
			},
			ADA3:{
				audio:2,
				trigger:{player:'turnOverBefore'},
				filter:function(event,player){
					return player.lili > 1;
				},
				content:function(){
					player.loselili();
					trigger.cancel();
				},
				prompt:'是否消耗1点灵力，让符卡不结束？',
				check:function(player){
					return true;
				},
			},
			kedan:{
				audio:2,
				group:['kedan2','kedan3'],
				enable:'chooseToUse',
				init:function(player){
					player.storage.kedan = [];
				},
				filter:function(event,player){
                    return player.countCards('he')>1;
                },
                chooseButton:{
                    dialog:function(){
                        var list = [];
                        for (var i in lib.card){
                            if(lib.card[i].mode&&lib.card[i].mode.contains(lib.config.mode)==false) continue;
                            if(lib.card[i].forbid&&lib.card[i].forbid.contains(lib.config.mode)) continue;
                            if(lib.card[i].type == 'jinji'){
                                list.add(i);
                            }
                        }
                        for(var i=0;i<list.length;i++){
                            list[i]=[get.type(list[i]),'',list[i]];
                        }
                        return ui.create.dialog([list,'vcard']);
                    },
                    filter:function(button,player){
                    	return _status.event.getParent().filterCard({name:button.link[2]},player) && !player.storage.kedan.contains(button.link[2]);
                        //return lib.filter.filterCard({name:button.link[2]},player,_status.event.getParent()) && !player.storage.muqi.contains(button.link[2]);
                    },
                    check:function(button){
                        var player=_status.event.player;
                        return get.value({name:button.link[2]}) - 5;
                    },
                    backup:function(links,player){
                        return {
                            filterCard:function(card,player){
                                return get.bonus(card) && get.bonus(card) > 0;
                            },
                            audio:2,
                            position:'he',
                            selectCard:1,
                            audio:2,
                            popname:true,
                            viewAs:{name:links[0][2]},
                            onuse:function(result,player){
                            	if (get.type(result.card.name) == 'jinji') player.storage.kedan.push(result.card.name);
                            },
                        }
                    },
                    prompt:function(links,player){
                        return '将一张牌当作'+get.translation(links[0][2])+'使用';
                    },
                },
                ai:{
                    order:4,
                    result:{
                        player:function(player){
                            return 1;
                        }
                    },
                    threaten:1,
                }
			},
			kedan2:{
				direct:true,
				trigger:{global:'phaseAfter'},
				content:function(){
					player.storage.kedan = [];
				}
			},
			kedan3:{
				trigger:{player:'useCard'},
				filter:function(event,player){
					return get.type(event.card) == 'jinji' && !player.hasSkill('kedan4');
				},
				content:function(){
					'step 0'
					player.chooseTarget('选择一名角色成为'+get.translation(trigger.card)+'的唯一目标',function(card,player,target){
						return player.canUse({name:trigger.card.name},target,false);
					}).set('ai',function(target){
						return get.effect(target,{name:trigger.card.name},_status.event.player);
					});
					"step 1"
					if(result.bool){
						player.logSkill(event.name,result.targets);
						trigger.target=result.targets[0];
						trigger.targets = [];
						trigger.targets.push(result.targets[0]);
					}
					else{
						event.finish();
					}
					"step 2"
					trigger.untrigger();
					player.addTempSkill('kedan4', 'useCardAfter');
					trigger.trigger('useCard');
					game.delay();
				},
				prompt:'是否改变禁忌牌的目标？',
			},
			kedan4:{
			},
			shishu:{
				audio:2,
				group:['shishu2','shishu3','shishu4'],
				trigger:{player:'phaseEnd'},
				filter:function(event,player){
					var players = game.filterPlayer();
					var num = 0;
					var ej = false;
					for (var i = 0; i < players.length; i ++){
						if (players[i] == player) continue;
						num += players[i].hp;
						if (!players[i].countCards('e',{bonus:0})) ej = true;
						if (players[i].countCards('e') > players[i].countCards('e',{bonus:0})) ej = true;
					}
					return num < player.storage.shishu && (ej || player.storage.shishu3);
				},
				content:function(){
					'step 0'
					var players = game.filterPlayer();
					var num = 0;
					for (var i = 0; i < players.length; i ++){
						if (players[i] == player) continue;
						num += players[i].hp;
					}
					event.num = num;
					event.num -= player.storage.shishu;
					'step 1'
					if (event.num == 0) event.finish();
					var ej = false;
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i ++){
						if (players[i] == player) continue;
						num += players[i].hp;
						if (!players[i].countCards('e',{bonus:0})) ej = true;
						if (players[i].countCards('e')> players[i].countCards('e',{bonus:0})) ej = true;
					}
					var list = [];
					if (player.storage.shishu3) list.push('翻弃牌堆');
					if (ej) list.push('从场上抢');
					if (!list[0]) event.finish();

					player.chooseControl(list,function(event,player){
						if (list['从场上抢']) return '从场上抢';
						return '翻弃牌堆';
					});
					'step 2'
					if (result.control == '从场上抢'){
						player.chooseTarget('选择一个倒霉人，抢她一张有灵力的牌',function(card,player,target){
							if(player==target) return false;
							return !target.countCards('e',{bonus:0}) || target.countCards('e')> target.countCards('e',{bonus:0});
						}).set('ai',function(target){
							return -get.attitude(player,target);
						});
					} else {
						player.chooseCardButton(player.storage.shishu3,'捡回一张牌',1,true).ai=function(button){
	                        var val=get.value(button.link);
	                        if(val<0) return -10;
	                        return val;
	                    }
					}
					'step 3'
					if (result.links){
						player.gain(result.links)._triggered=null;
	                    for(var i=0;i<result.links.length;i++){
	                        ui.discardPile.remove(result.links[i]);
	                        player.storage.shishu3.remove(result.links[i]);
	                        player.syncStorage('shishu3');
	                    }
					} else if (result.bool){
						player.gainPlayerCard(result.target,1,'ej',true).set('filterButton',function(button){
							return get.bonus(button.link) > 0;
						});
					}
					event.num --;
					if (event.num > 0) event.goto(1);
				},
			},
			shishu2:{
				direct:true,
				trigger:{player:'phaseBeginStart'},
				content:function(){
					var players = game.filterPlayer();
					var num = 0;
					for (var i = 0; i < players.length; i ++){
						if (players[i] == player) continue;
						num += players[i].hp;
					}
					player.storage.shishu = num;
				},
			},
			shishu3:{
				intro:{
					content:'cards'
				},
 				trigger:{global:'loseEnd'},
                direct:true,
                filter:function(event,player){
                    if (_status.currentPhase!=player) return false;
                    for(var i=0;i<event.cards.length;i++){
                    	if(get.type(event.cards[i]) == 'equip' && event.getParent().name == 'useCard' && event.getParent().card.name == event.cards[i].name) continue;
                        if(get.type(event.cards[i]) != 'jinji' && !get.bonus(event.cards[i]) > 0) continue;
                        if(get.position(event.cards[i])=='d'){
                            return true;
                        }
                    }
                    return false;
                },
                content:function(){
                    for (var i = 0; i < trigger.cards.length; i ++){
                    	if (get.type(trigger.cards[i]) != 'jinji' && !get.bonus(trigger.cards[i]) > 0) continue;
                        if (!player.storage.shishu3) player.storage.shishu3 = [trigger.cards[i]];
                        else player.storage.shishu3.push(trigger.cards[i]); 
                    }
                    player.markSkill('shishu3');
                    player.syncStorage('shishu3');
                },   
			},
			shishu4:{
				direct:true,
				trigger:{player:'phaseAfter'},
				content:function(){
					delete player.storage.shishu3;
					player.syncStorage('shishu3');
					player.unmarkSkill('shishu3');
				}
			},
			shishi:{
				audio:2,
                cost:4,
                spell:['shishi1','shishi2'],
                roundi:true,
                trigger:{player:'phaseBeginStart'},
                check:function(event,player){
                    return false;
                },
                filter:function(event,player){
                    return player.lili > lib.skill.shishi.cost;
                },
                content:function(){
                    player.loselili(lib.skill.shishi.cost);
                    player.turnOver();
                },
			},
			shishi1:{
				audio:2,
				trigger:{player:['changeHpBefore','changeliliBefore']},
				filter:function(event,player){
					return event.num < 0;
				},
				content:function(){
					trigger.cancel();
				},
				mod:{
					targetInRange:function(card,player,target,now){
						if(card.name=='sha') return true;
					},
					cardUsable:function(card,player,num){
						if(card.name=='sha') return Infinity;
					}
				},
			},
			shishi2:{
				audio:2,
				trigger:{source:'dieAfter'},
				forced:true,
				filter:function(event,player){
					//return !player.hasSkill('lianpo2');
					return true;
				},
				content:function(){
					player.addSkill('shishi3');
					player.insertPhase();
				}
			},
			shishi3:{
				direct:true,
				trigger:{player:'turnOverBefore'},
				content:function(){
					player.removeSkill('shishi3');
					trigger.cancel();
				},
			},
		},
		translate:{
			kanade:'奏',
			kanade_die:'赐予我生命，真的，很感谢',
			zhongzou:'终奏',
			zhongzou_info:'一名角色的结束阶段，若本回合有角色：成为过牌的目标，并因防御牌以外的方式令牌取消其或无效；或以攻击牌以外的方式造成伤害；你可以消耗1点灵力，视为对所有这些角色使用一张【轰！】。',
			zhongzou_audio1:'……(#゜-゜)',
			zhongzou_audio2:'……音速手刃。',
			moxin:'默心',
			moxin_info:'一名角色的结束阶段，若其本回合：没有使用过攻击牌，没有造成过伤害，你可以令其获得一点灵力，或摸一张牌然后交给其一张牌。',
			moxin_audio1:'(゜-゜)ノ',
			moxin_audio2:'……加油。',
			illyasviel:'伊莉雅',
			illyasviel_die:'旋转吧雪月花',
			huanzhao:'幻召',
			huanzhao_info:'游戏开始时，靠，不写了。',
			huanzhao_2:'幻召',
			huanzhao_3:'幻召',
			wuxian:'无限',
			wuxian_info:'锁定技，准备阶段，你获得1点灵力；然后：若你的灵力达到上限，你摸一张牌。',
			wuxian_2:'无限',
			wuxian_3:'无限',
			quintette_fire:'多元重奏饱和炮击',
			quintette_fire_info:'符卡技（7）<u>此符卡消耗-X（X为“梦幻”的数量）；</u>；准备阶段，你对一名角色造成3点弹幕伤害，然后弃置所有手牌。',
			quintette_fire2:'多元重奏饱和炮击',
			shigure:'时雨',
			shigure_die:'真……真能干啊……我记住你了！',
			kc_yuzhi:'雨至',
			kc_yuzhi_info:'游戏开始时，你获得一张【神佑】技能牌。一名角色的回合开始时，你可以交给一名其他角色一张牌；若如此做，直到回合结束，当该角色成为【轰！】的目标时，令之对其无效。',
			kc_yuzhi_2:'雨至',
			kc_yuzhi_3:'雨至',
			zuoshibaozhan:'佐世保的时雨',
			zuoshibaozhan_info:'符卡技（2）<永续>符卡发动时，你将手牌数补至三张并获得一张【神佑】技能牌；你的牌因弃置而进入弃牌堆，或于回合外因使用而进入弃牌堆时，你可以将之交给一名其他角色。',
			zuoshibao_2:'佐世保的时雨',
			arisa:'亚里沙',
			yaowu:'妖舞',
			yaowu_info:'结束阶段，若你本回合使用过三张或更多的牌，你可以令一名角色收回其装备区内一张牌；若如此做，你弃置场上一张牌。',
			yaowu_audio1:'对空射击！',
			yaowu_audio2:'Caladbolg！',
			huanrao:'环绕',
			huanrao_info:'出牌阶段限一次，你可以将一张牌当【灵光一闪】使用；若如此做，你本回合只能将以此法获得的牌当【杀】使用。',
			huanrao_2:'环绕',
			huanrao_3:'环绕',
			huanrao_4:'环绕',
			huanrao_4_sha:'环绕',
			huanrao_audio1:'妖精小姐，帮一下忙啦~',
			huanrao_audio2:'来来来，来一起玩了啊~',
			sliver_arrow:'白银之箭',
			sliver_arrow_info:'符卡技（4）你可以跳过出牌阶段和弃牌阶段；若如此做，你弃置一名角色X张牌（X为你的手牌数）：若你以此法弃置了其所有牌，对其造成1点弹幕伤害和1点灵击伤害。',
			silver_arrow_audio1:'我的箭会贯穿你！',
			silver_arrow_audio2:'看招，白银之箭！',
			arisa_die:'你可真强呢……',
			yudachi:'夕立',
			yudachi_die:'-转圈学狗叫<br />-poi!poi!poi!',
			hongxi:'轰袭',
			hongxi_info:'你可以将一张牌当作【轰！】使用；该【轰！】指定目标后，按照原牌属性执行对应效果：攻击／武器～与目标拼点：若你赢，该【轰！】不能成为【没中】的目标；防御／防具～弃置目标角色一张牌。',
			hongxi_2:'轰袭',
			hongxi_3:'轰袭',
			hongxi_audio1:'',
			hongxi_audio2:'',
			hongxi_audio3:'',
			solomon:'所罗门的噩梦',
			solomon_info:'符卡技（2）<u>若你的体力值为1，此符卡消耗视为0；</u>符卡发动时，你获得一张【连击】技能牌；【轰袭】追加描述“辅助／宝物／道具～令该【轰！】造成的弹幕伤害＋１”。',
			solomon_audio1:'',
			solomon_audio2:'',
			megumin:'惠惠',
			megumin_die:'和真，快来背我回去啊OAQ',
			honglian:'红链',
			honglian_info:'准备阶段，你可以选择一名角色；若如此做，你于本回合内对其造成伤害后，仅限一次地可以视为对所有与其距离X以内的角色使用一张【轰！】（X为你的灵力值）。',
			honglian_2:'红链',
			honglian_3:'红链',
			honglian_audio1:'艺术就是爆炸！',
			honglian_audio2:'一切都是为了爆发！',
			sbrs_liansuo:'莲锁',
			sbrs_liansuo_info:'准备阶段，你可以指定一名角色：本回合一次，该角色因弃置或获得而失去牌后，你视为对其距离X以内的所有角色使用一张【轰！】；目标角色可以弃置一张非基本牌来抵消该【轰！】（X为你的灵力）。',
			sbrs_liansuo_audio1:'别想跑掉！',
			sbrs_liansuo_audio2:'什么东西不爆炸一次怎么能行！',
			sbrs_liansuo_2:'莲锁',
			sbrs_liansuo_3:'莲锁',
			sbrs_liansuo_4:'莲锁（无效）',
			explosion:'EXPLOSIONNNNN！',
			explosion_info:'符卡技（4）跳过你的出牌阶段，然后对一名角色造成2点弹幕伤害，2点灵击伤害，并弃置其装备区内所有牌。',
			explosion_2:'EXPLOSIONNNNN！',
			explosion_audio1:'EXPLOSIONNNNN！',
			explosion_audio2:'EXPPLOSSSSSIIIIIIOOOOOOONNNNN！',
			satone:'七宫',
			guyin:'孤樱',
			guyin_2:'孤樱',
			guyin_3:'孤樱',
			guyin_info:'锁定技，你使用牌时，无视消耗强化之；你使用基本牌指定角色为目标时，或成为基本牌的目标时，取消你，然后来源视为对原目标使用一张与之属性相同的法术牌；你的【没中】视为【请你住口！】',
			tianze:'天则',
			tianze2:'天则',
			tianze_info:'锁定技，你受到弹幕伤害后，对伤害来源造成等量灵击伤害；你成为红桃辅助牌的目标时，须消耗1点灵力，然后回复1点体力。',
			satone_die:'咕咕咕……',
			nero:'尼禄',
			muqi:'幕启',
			muqi_backup_audio1:'没有事情是余做不到的！',
			muqi_backup_audio2:'唔姆！',
			muqi_backup_audio3:'余是不是很厉害！',
			muqi_info:'你可以将两张牌当作一种基本牌，或本回合没有使用过的一种法术牌使用。',
			AestusDomusAurea:'招荡的黄金剧场',
			AestusDomusAurea_info:'符卡技（2）【永续】准备阶段，你将手牌数补至手牌上限；出牌阶段，你可以弃置一张手牌，声明一种技能牌，然后获得之；符卡结束时，你可以消耗1点灵力，令符卡不结束。',
			ADA2:'招荡的黄金剧场',
			ADA2_backup:'招荡的黄金剧场',
			ADA3:'招荡的黄金剧场',
			ADA3_audio1:'Encore!',
			ADA3_audio2:'表演还没有结束呢！',
			nero_die:'',
			kurumi:'狂三',
			kedan:'刻弹',
			kedan_info:'你可以将一张有灵力的牌当作一种禁忌牌使用，一回合一种禁忌牌名限一次；你使用禁忌牌时，可以将目标改为“一名角色”。',
			shishu:'时溯',
			shishu3:'本回合进入弃牌堆的有灵力/禁忌牌',
			shishu_info:'结束阶段，你可以获得场上或本回合进入弃牌堆的至多Ｘ张有灵力的牌或禁忌牌（Ｘ为本回合其他角色扣减的体力总值）。',
			shishi:'食时之城',
			shishi_info:'符卡技（4）<永续>防止你扣减体力或灵力；你的攻击范围和使用【轰！】的次数限制视为无限；结束阶段，若你本回合击坠过角色，你于回合结束后进行一个额外的回合，该回合内符卡不结束。',
		},
	};
});