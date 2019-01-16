'use strict';
game.import('card',function(lib,game,ui,get,ai,_status){
	return {
	name:'standard',
	connect:true,
	card:{
		// 这前面几个都是给AI用的函数，检测收益用的
		damage:{
			ai:{
				result:{
					target:-1.5
				},
				tag:{
					damage:1
				}
			}
		},
		recover:{
			ai:{
				result:{
					target:1.5
				},
				tag:{
					recover:1
				}
			}
		},
		firedamage:{
			ai:{
				result:{
					target:-1.5
				},
				tag:{
					damage:1,
					fireDamage:1,
					natureDamage:1,
				}
			}
		},
		thunderdamage:{
			ai:{
				result:{
					target:-1
				},
				tag:{
					damage:1,
					thunderDamage:1,
					natureDamage:1,
				}
			}
		},
		respondShan:{
			ai:{
				result:{
					target:-1.5,
				},
				tag:{
					respond:1,
					respondShan:1,
					damage:1
				}
			}
		},
		// 到这里为止，都是给AI用的

		// 这里是杀的代码！
		// 还外带了所有杀有关时机的发动……真是
		sha:{
			audio:true,
			fullskin:true,
			nature:['thunder','fire'],
			type:'basic',
			subtype:'attack',
			enable:true,
			usable:1,
			range:{attack:1},
			selectTarget:1,
			//filterTarget:function(card,player,target){return player!=target},
			filterTarget:true,
			content:function(){
				"step 0"
				if(event.skipShan){
					event._result={bool:true};
				}
				else if(event.directHit){
					event._result={bool:false};
				}
				else{
					// 把闪从对杀打出变成了使用
					//var next=target.chooseToRespond({name:'shan'});
					var next = target.chooseToUse({
						filterCard:function(card,player){
							if(card.name!='shan') return false;
							var mod=game.checkMod(card,player,'unchanged','cardEnabled',player.get('s'));
							if(mod!='unchanged') return mod;
							return true;
						},});
					next.set('ai1',function(){
						var target=_status.event.player;
						var evt=_status.event.getParent();
						var sks=target.get('s');
						if(sks.contains('leiji')||
							sks.contains('releiji')||
							sks.contains('lingbo')){
							return 1;
						}
						//if(ai.get.damageEffect(target,evt.player,target,evt.card.nature)>=0) return -1;
						return 1;
					});
					//next.autochoose=lib.filter.autoRespondShan;
				}
				"step 1"
				if(result.bool==false){
					event.trigger('shaHit');
				}
				else{
					event.trigger('shaMiss');
					event.responded=result;
				}
				"step 2"
				if(result.bool==false&&!event.unhurt){
					target.damage(get.nature(event.card));
					event.result={bool:true}
					event.trigger('shaDamage');
				}
				else{
					event.result={bool:false}
					event.trigger('shaUnhirt');
				}
			},
			ai:{
				basic:{
					useful:[5,1],
					value:[5,1],
				},
				order:3,
				result:{
					target:function(player,target){
						if(player.hasSkill('jiu')&&!target.num('e','baiyin')){
							if(ai.get.attitude(player,target)>0){
								return -6;
							}
							else{
								return -3;
							}
						}
						return -1.5;
					},
				},
				tag:{
					respond:1,
					respondShan:1,
					damage:function(card){
						if(card.nature=='poison') return;
						return 1;
					},
					natureDamage:function(card){
						if(card.nature) return 1;
					},
					fireDamage:function(card,nature){
						if(card.nature=='fire') return 1;
					},
					thunderDamage:function(card,nature){
						if(card.nature=='thunder') return 1;
					},
					poisonDamage:function(card,nature){
						if(card.nature=='poison') return 1;
					}
				}
			}
		},
		shacopy:{
			ai:{
				basic:{
					useful:[5,1],
					value:[5,1],
				},
				order:3,
				result:{
					target:-1.5,
				},
				tag:{
					respond:1,
					respondShan:1,
					damage:function(card){
						if(card.nature=='poison') return;
						return 1;
					},
					natureDamage:function(card){
						if(card.nature) return 1;
					},
					fireDamage:function(card,nature){
						if(card.nature=='fire') return 1;
					},
					thunderDamage:function(card,nature){
						if(card.nature=='thunder') return 1;
					},
					poisonDamage:function(card,nature){
						if(card.nature=='poison') return 1;
					}
				}
			}
		},
		// 闪
		shan:{
			audio:true,
			fullskin:true,
			notarget:true,
			type:'basic',
			subtype:'defense',
			content:function(){
			},
			ai:{
				basic:{
					useful:[6,4],
					value:[6,4],
				},
				result:{player:1},
				expose:0.2
			},
		},
		// 桃
		tao:{
			fullskin:true,
			type:'basic',
			subtype:'support',
			enable:function(card,player){
				return player.hp<player.maxHp;
			},
			savable:true,
			selectTarget:-1,
			filterTarget:function(card,player,target){
				return target==player&&target.hp<target.maxHp;
			},
			modTarget:function(card,player,target){
				return target.hp<target.maxHp;
			},
			content:function(){
				target.recover();
			},
			ai:{
				basic:{
					order:function(card,player){
						if(player.hasSkillTag('pretao')) return 5;
						return 2;
					},
					useful:[8,6.5],
					value:[8,6.5],
				},
				result:{
					target:function(player,target){
						// if(player==target&&player.hp<=0) return 2;
						var nh=target.num('h');
						var keep=false;
						if(nh<=target.hp){
							keep=true;
						}
						else if(nh==target.hp+1&&target.hp>=2&&target.num('h','tao')<=1){
							keep=true;
						}
						var mode=get.mode();
						if(target.hp>=2&&keep&&target.hasFriend()){
							if(target.hp>2) return 0;
							if(target.hp==2){
								for(var i=0;i<game.players.length;i++){
									if(target!=game.players[i]&&ai.get.attitude(target,game.players[i])>=3){
										if(game.players[i].hp<=1) return 0;
										if(mode=='identity'&&game.players[i].isZhu&&game.players[i].hp<=2) return 0;
									}
								}
							}
						}
						if(target.hp<0&&target!=player&&target.identity!='zhu') return 0;
						var att=ai.get.attitude(player,target);
						if(att<3&&att>=0&&player!=target) return 0;
						var tri=_status.event.getTrigger();
						if(mode=='identity'&&player.identity=='fan'&&target.identity=='fan'){
							if(tri&&tri.name=='dying'&&tri.source&&tri.source.identity=='fan'&&tri.source!=target){
								var num=0;
								for(var i=0;i<game.players.length;i++){
									if(game.players[i].identity=='fan'){
										num+=game.players[i].num('h','tao');
										if(num>2) return 2;
									}
								}
								if(num>1&&player==target) return 2;
								return 0;
							}
						}
						if(mode=='identity'&&player.identity=='zhu'&&target.identity=='nei'){
							if(tri&&tri.name=='dying'&&tri.source&&tri.source.identity=='zhong'){
								return 0;
							}
						}
						if(mode=='stone'&&target.isMin()&&
						player!=target&&tri&&tri.name=='dying'&&player.side==target.side&&
						tri.source!=target.getEnemy()){
							return 0;
						}
						return 2;
					},
				},
				tag:{
					recover:1,
					save:1,
				}
			}
		},
		// 过河拆桥
		guohe:{
			audio:true,
			fullskin:true,
			type:'trick',
			subtype:'disrupt',
			enable:true,
			enhance:1,
			selectTarget:1,
			range:{attack:1},
			filterTarget:function(card,player,target){
				if(player==target) return false;
				return (target.num('hej')>0);
			},
			content:function(){
				if (target.num('hej')){
					player.discardPlayerCard('hej',target,true);
				}
				if (player.storage._enhance){
					for(var i=0;i<player.storage._enhance;i++){
    					if (target.num('ej')) player.discardPlayerCard('ej',target,true);
    				}
				}
			},
			ai:{
				basic:{
					order:9,
					useful:1,
					value:5,
				},
				result:{
					target:function(player,target){
						var es=target.get('e');
						var nh=target.num('h');
						var noe=(es.length==0||target.hasSkillTag('noe'));
						var noe2=(es.length==1&&es[0].name=='baiyin'&&target.hp<target.maxHp);
						var noh=(nh==0||target.hasSkillTag('noh'));
						if(noh&&noe) return 0;
						if(noh&&noe2) return 0.01;
						if(ai.get.attitude(player,target)<=0) return (target.num('he'))?-1.5:1.5;
						var js=target.get('j');
						if(js.length){
							var jj=js[0].viewAs?{name:js[0].viewAs}:js[0];
							if(jj.name=='guohe') return 3;
							if(js.length==1&&ai.get.effect(target,jj,target,player)>=0){
								return -1.5;
							}
							return 2;
						}
						return -1.5;
					},
				},
				tag:{
					loseCard:1,
				}
			}
		},
		// 顺手牵羊
		shunshou:{
			audio:true,
			fullskin:true,
			type:'trick',
			subtype:'disrupt',
			enable:true,
			selectTarget:1,
			range:{attack:1},
			postAi:function(targets){
				return targets.length==1&&targets[0].num('j');
			},
			filterTarget:function(card,player,target){
				return (target.num('hej') != 0);

			},
			content:function(){
				if(target.num('hej')){
					player.gainPlayerCard('hej',target,true);
				}
				if (!target.storage._mubiao || target.storage._mubiao == 0) player.loselili();
			},
			ai:{
				wuxie:function(target,card,player,viewer){
					if(ai.get.attitude(viewer,player)>0&&ai.get.attitude(viewer,target)>0){
						return 0;
					}
				},
				basic:{
					order:3,
					useful:4,
					value:7
				},
				result:{
					target:function(player,target){
						if(ai.get.attitude(player,target)<=0) return (target.num('hej')>0)?-1.5:1;
						return -1.5;
					},
					player:function(player,target){
						if(ai.get.attitude(player,target)<0&&!target.num('hej')){
							return 0;
						}
						if (!target.storage._mubiao) return 0.5;
						return 1;
					}
				},
				tag:{
					loseCard:1,
					gain:1,
				}
			}
		},
		// 例大祭
		reidaisai:{
			audio:true,
			fullskin:true,
			type:'trick',
			subtype:'support',
			enable:true,
			selectTarget:-1,
			filterTarget:function(card,player,target){
				return true;
			},
			content:function(){
				'step 0'
				target.draw();
				target.chooseCardTarget({
					selectCard:1,
					filterTarget:function(card,player,target){
						return player != target;
					},
					forced:true,	// 强制给出
					ai2:function(target){
						return ai.get.attitude(_status.event.player,target);
					},
					prompt:'你送给别人一张牌!'
				});
				'step 1'
				if(result.targets&&result.targets[0]){
					result.targets[0].gain(result.cards);
					target.$give(result.cards.length,result.targets[0]);
				}
			},
			ai:{
				wuxie:function(){
					if(Math.random()<0.5) return 0;
				},
				basic:{
					order:3,
					useful:1,
				},
				result:{
					target:function(player,target){
						if(get.is.versus()){
							if(target==player) return 1.5;
							return 1;
						}
						if(player.hasUnknown(2)){
							return 0;
						}
						return 2-2*get.distance(player,target,'absolute')/game.countPlayer();
					}
				},
				tag:{
					draw:1,
					multitarget:1
				}
			}
		},
		// 无中
		wuzhong:{
			audio:true,
			fullskin:true,
			type:'trick',
			subtype:'support',
			enable:true,
			enhance:1,
			selectTarget:-1,
			filterTarget:function(card,player,target){
				return target==player;
			},
			modTarget:true,
			content:function(){
				if (player.storage._enhance){
					for(var i=0;i<player.storage._enhance;i++){
    					target.gain(ui.skillPile.childNodes[0],'draw2');
    				}
				}
				target.draw(2);
			},
			ai:{
				basic:{
					order:7.2,
					useful:4,
					value:9.2
				},
				result:{
					target:2,
				},
				tag:{
					draw:2
				}
			}
		},
		// 决斗
		juedou:{
			audio:true,
			fullskin:true,
			type:'trick',
			subtype:'attack',
			enable:true,
			filterTarget:function(card,player,target){
				return target!=player;
			},
			content:function(){
				"step 0"
				if(event.turn==undefined) event.turn=target;
				"step 1"
				event.trigger('juedou');
				"step 2"
				if(event.directHit){
					event._result={bool:false};
				}
				else{
					var next=event.turn.chooseToRespond({name:'sha'});
					next.set('ai',function(card){
						var event=_status.event;
						var player=event.splayer;
						var target=event.starget;
						if(player.hasSkillTag('notricksource')) return 0;
						if(target.hasSkillTag('notrick')) return 0;
						if(event.player==target){
							if(player.hasSkill('naman')) return -1;
							if(ai.get.attitude(target,player)<0){
								return ai.get.unuseful2(card)
							}
							return -1;
						}
						else{
							if(target.hasSkill('naman')) return -1;
							if(ai.get.attitude(player,target)<0){
								return ai.get.unuseful2(card)
							}
							return -1;
						}
					});
					next.set('splayer',player);
					next.set('starget',target);
					next.autochoose=lib.filter.autoRespondSha;
					if(event.turn==target){
						next.source=player;
					}
					else{
						next.source=target;
					}
				}
				"step 3"
				if(event.target.isDead()||event.player.isDead()){
					event.finish();
				}
				else{
					if(result.bool){
						if(event.turn==target) event.turn=player;
						else event.turn=target;
						event.goto(1);
					}
					else{
						if(event.turn==target){
							target.damage();
						}
						else{
							player.damage(target);
						}
					}
				}
			},
			ai:{
				basic:{
					order:5,
					useful:1,
					value:4.5
				},
				result:{
					target:-1.5,
					player:function(player,target){
						if(ai.get.damageEffect(target,player,target)>0&&ai.get.attitude(player,target)>0&&ai.get.attitude(target,player)>0){
							return 0;
						}
						var hs1=target.get('h','sha');
						var hs2=player.get('h','sha');
						if(hs1.length>hs2.length+1){
							return -2;
						}
						var hsx=target.get('h');
						if(hsx.length>2&&hs2.length==0&&hsx[0].number<6){
							return -2;
						}
						if(hsx.length>3&&hs2.length==0){
							return -2;
						}
						if(hs1.length>hs2.length&&(!hs2.length||hs1[0].number>hs2[0].number)){
							return -2;
						}
						return -0.5;
					}
				},
				tag:{
					respond:2,
					respondSha:2,
					damage:1,
				}
			}
		},
		caifang:{
			audio:true,
			fullskin:true,
			type:'trick',
			subtype:'disrupt',
			enable:true,
			enhance:1,
			filterTarget:function(card,player,target){
				return player != target;
			},
			content:function(){
				"step 0"
				var controls=[];
				if (player.storage.enhance){
					controls.push('展示手牌并明置身份');
				} else {
					if(target.identityShown != true && get.mode()=='identity') controls.push('明置身份');	
					controls.push('展示手牌');				
				}
				target.chooseControl(controls,function(event,player){
					if (controls.contains('展示手牌并明置身份')) return '展示手牌并明置身份';
					if(controls.contains('明置身份')) return '明置身份';
					return '展示手牌';
				});
				"step 1"
				if(result.control){
					if(result.control!='明置身份'){
						//player.chooseControl('ok').set('dialog',[get.translation(target)+'的手牌',target.get('h')]);
						target.showCards(target.get('h'));
						player.draw();
					}
					if(result.control!='展示手牌') {
						if (target.identityShown != true && get.mode()=='identity') target.useSkill('_tanpai');
					}
				}
			},
			ai:{
				order:7.5,
				wuxie:function(){
					return 0;
				},
				result:{
					target:function(player,target){
						if (!target.identityShown) return -1;
						if(ai.get.attitude(player,target)<=0) return (target.num('h'))?-1.5:-0.5;
						return -get.attitude(player,target);
					}
				},
				tag:{
					draw:1
				}
			}
		},
		// 弹幕狂欢
		danmakucraze:{
			audio:true,
			fullskin:true,
			type:'trick',
			subtype:'support',
			enable:true,
			enhance:1,
			selectTarget:-1,
			filterTarget:function(card,player,target){
				return target==player;
			},
			modTarget:true,
			content:function(){
				if (player.storage._enhance){
					for(var i=0;i<player.storage._enhance;i++){
    					target.draw(1);
    				}
    				
				}
				target.addTempSkill('danmaku_skill','phaseAfter');
			},
			ai:{
				basic:{
					order:7.2,
					useful:4,
					value:5
				},
				result:{
					target:function(player,target){
						if (player.lili > 2) return 1;
						if (player.countCards('h',{name:'sha'}) < 2) return 0;
						return 1.5;
					},
				},
				tag:{
					draw:0.5
				}
			}
		},
		// 无懈可击
		wuxie:{
			audio:true,
			fullskin:true,
			type:'trick',
			subtype:'defense',
			//enhance:1,
			ai:{
				basic:{
					useful:[6,4],
					value:[6,4],
				},
				result:{player:1},
				expose:0.2
			},
			notarget:true,
			content:function(){
				event.result='wuxied';	// 效果无效（抵消）
				if(player.isOnline()){
					player.send(function(player){
						if(ui.tempnowuxie&&!player.hasWuxie()){
							ui.tempnowuxie.close();
							delete ui.tempnowuxie;
						}
					},player);
				}
				else if(player==game.me){
					if(ui.tempnowuxie&&!player.hasWuxie()){
						ui.tempnowuxie.close();
						delete ui.tempnowuxie;
					}
				}
			},
		},
		// 死境之门
		simen:{
			audio:true,
			fullskin:true,
			type:'jinji',
			enable:true,
			selectTarget:-1,
			filterTarget:function(card,player,target){
				return target!=player;
			},
			reverseOrder:true,
			content:function(){
				target.chooseToDiscard(true,'hej');
				// 洗牌堆放到技能那边吧
			},
			contentAfter:function(){
				var cards = [];
				for(var i=0;i<ui.discardPile.childNodes.length;i++){
                    var currentcard=ui.discardPile.childNodes[i];
                    currentcard.vanishtag.length=0;
                    if(get.info(currentcard).vanish||currentcard.storage.vanish){
                        currentcard.remove();
                        continue;
                    }
                    if (currentcard.name != 'simen') cards.push(currentcard);
                }
                cards.randomSort();
                for(var i = 0; i < ui.cardPile.childNodes.length;i++){
                	ui.discardPile.appendChild(ui.cardPile.childNodes[i]);
                }
                for(var i=0;i<cards.length;i++){
                    ui.cardPile.appendChild(cards[i]);
                }
                game.log("死境之门：交换弃牌堆和牌堆");
			},
			ai:{
				basic:{
					order:1,
					useful:[3,1],
					value:[3,1],
				},
				result:{
					target:function(player,target){
						var nh=target.countCards('hej');
						if(nh==0) return 0;
						if(nh==1) return -1.7
						return -1.5;
					},
				},
				tag:{
					multitarget:1,
					multineg:1,
				}
			},
		},
		// 幻想之门
		huanxiang:{
			audio:true,
			fullskin:true,
			type:'jinji',
			enable:true,
			selectTarget:-1,
			filterTarget:function(card,player,target){
				return true;
			},
			content:function(){
				target.draw();
				target.gainlili();
				target.gain(ui.skillPile.childNodes[0],'draw2');
			},
			ai:{
				basic:{
					order:3,
					useful:1,
				},
				result:{
					target:function(player,target){
						if(get.is.versus()){
							if(target==player) return 1.5;
							return 1;
						}
						if(player.hasUnknown(2)){
							return 0;
						}
						return 2-2*get.distance(player,target,'absolute')/game.countPlayer();
					}
				},
				tag:{
					draw:1,
					multitarget:1
				}
			}
		},
		// 天国之阶
		tianguo:{
			audio:true,
			fullskin:true,
			type:'jinji',
			enable:true,
			selectTarget:-1,
			filterTarget:function(card,player,target){
				return true;
			},
			content:function(){
				target.draw();
			},
			ai:{
				basic:{
					order:3,
					useful:1,
				},
				result:{
					target:function(player,target){
						if(get.is.versus()){
							if(target==player) return 1.5;
							return 1;
						}
						if(player.hasUnknown(2)){
							return 0;
						}
						return 2-2*get.distance(player,target,'absolute')/game.countPlayer();
					}
				},
				tag:{
					draw:1,
					multitarget:1
				}
			}
		},
		// 冰域之宴
		bingyu:{
			audio:true,
			fullskin:true,
			type:'jinji',
			selectTarget:-1,
			filterTarget:function(card,player,target){
				return true;
			},
			contentBefore:function(){
				player.$skill('冰域之宴');
			},
			content:function(){
				if (target == player) target.addSkill('bingyu2');
			},
			contentAfter:function(){
				player.markSkill('bingyu1');
			},
			ai:{
				basic:{
					order:1,
					useful:[3,1],
					value:[3,1],
				},
				result:{
					target:function(player,target){
						return (target.hp<2)?2:0;
					}
				},
				tag:{
					recover:0.5,
					multitarget:1
				}
			}
		},
		// 罪业边狱
		zuiye:{
			audio:true,
			fullskin:true,
			type:'jinji',
			enable:true,
			filterTarget:function(card,player,target){
				return target!=player;
			},	
			content:function(){
				var num = target.maxHp-target.hp;
				for (var i = 0; i < num; i++){
					if (target.num('hej')) player.discardPlayerCard('hej',target,true);
				}
			},
			ai:{
				basic:{
					order:9,
					useful:1,
					value:10,
				},
				result:{
					target:function(player,target){
						if (target.maxHp == target.hp) return 0;
						var es=target.get('e');
						var nh=target.num('h');
						var noe=(es.length==0||target.hasSkillTag('noe'));
						var noh=(nh==0||target.hasSkillTag('noh'));
						if(noh&&noe) return 0;
						if(ai.get.attitude(player,target)<=0) return (target.num('hej'))?-1.5:1.5;
						return -1.5;
					},
				},
				tag:{
					loseCard:1.5,
				}
			}
		},
		// 令避之间
		lingbi:{
			audio:true,
			fullskin:true,
			type:'jinji',
			selectTarget:-1,
			filterTarget:function(card,player,target){
				return true;
			},
			content:function(){
				
			},
			ai:{
				basic:{
					order:1,
					useful:[6,4],
					value:[6,4],
				},
				result:{
					target:function(player,target){
						return (target.hp<2)?2:0;
					}
				},
				tag:{
					recover:0.5,
					multitarget:1
				}
			}
		},
		// 花之祝福
		huazhi:{
			audio:true,
			fullskin:true,
			type:'jinji',
			enable:true,
			filterTarget:function(card,player,target){
				return target==player;
			},	
			content:function(){
				player.addSkill('huazhi_skill');
				if (player.lili == 0) player.gainlili(2);
			},
		},
		// 惊吓派对
		jingxia:{
			audio:true,
			fullskin:true,
			type:'jinji',
			enable:true,
			selectTarget:-1,
			filterTarget:function(card,player,target){
				return target != player;
			},
			content:function(){
				"step 0"
				player.line(target,'blue');
				player.chooseToCompare(target);
				"step 1"
				if (result.bool == true) target.damage('thunder');
			},
			ai:{
				basic:{
					order:3,
					useful:1,
				},
				result:{
					target:function(player,target){
						if(get.is.versus()){
							if(target==player) return 1.5;
							return 1;
						}
						if(player.hasUnknown(2)){
							return 0;
						}
						return 2-2*get.distance(player,target,'absolute')/game.countPlayer();
					}
				},
				tag:{
					draw:1,
					multitarget:1
				}
			}
		},
		// 赛钱箱
		saiqianxiang:{
			fullskin:true,
			type:'equip',
			subtype:'equip5',
			ai:{
				basic:{
					equipValue:4
				}
			},
			skills:['saiqian_skill','saiqian_skill3']
		},
		yinyangyu:{
			fullskin:true,
			type:'equip',
			subtype:'equip2',
			ai:{
				basic:{
					equipValue:6
				}
			},
			skills:['yinyangyu_skill_1','yinyangyu_skill_2']
		},
		louguan:{
			fullskin:true,
			type:'equip',
			subtype:'equip1',
			ai:{
				basic:{
					equipValue:2
				}
			},
			skills:['louguan_skill']
		},
		bailou:{
			fullskin:true,
			type:'equip',
			subtype:'equip1',
			ai:{
				basic:{
					equipValue:3
				}
			},
			skills:['bailou_skill']
		},
		laevatein:{
			fullskin:true,
			type:'equip',
			subtype:'equip1',
			ai:{
				basic:{
					equipValue:7
				}
			},
			skills:['laevatein_skill']
		},
		windfan:{
			fullskin:true,
			type:'equip',
			subtype:'equip1',
			ai:{
				basic:{
					equipValue:4
				}
			},
			skills:['windfan_skill']
		},
		gungnir:{
			fullskin:true,
			type:'equip',
			subtype:'equip1',
			ai:{
				basic:{
					equipValue:3
				}
			},
			skills:['gungnir_skill']
		},
		ibuki:{
			fullskin:true,
			type:'equip',
			subtype:'equip5',
			ai:{
				basic:{
					equipValue:2
				}
			},
			skills:['ibuki_skill']
		},
		pantsu:{
			fullskin:true,
			type:'equip',
			subtype:'equip5',
			ai:{
				basic:{
					equipValue:2
				}
			},
			skills:['pantsu_skill']
		},
		deathfan:{
			fullskin:true,
			type:'equip',
			subtype:'equip1',
			ai:{
				basic:{
					equipValue:4
				}
			},
			skills:['deathfan_skill']
		},
		penglaiyao:{
			fullskin:true,
			type:'equip',
			subtype:'equip5',
			ai:{
				basic:{
					equipValue:2
				}
			},
			skills:['penglaiyao_skill']
		},
		zhiyuu:{
			fullskin:true,
			type:'equip',
			subtype:'equip1',
			ai:{
				basic:{
					equipValue:4
				}
			},
			skills:['zhiyuu_skill']
		},
		book:{
			fullskin:true,
			type:'equip',
			subtype:'equip3',
			ai:{
				basic:{
					equipValue:4
				}
			},
			skills:['book_skill']
		},
		yuzhi:{
			fullskin:true,
			type:'equip',
			subtype:'equip5',
			ai:{
				basic:{
					equipValue:4
				}
			},
			skills:['yuzhi_skill']
		},
		frog:{
			fullskin:true,
			type:'equip',
			subtype:'equip3',
			filterTarget:function(card,player,target){
				return true;
			},
			content:function(){
				if (target.countCards('e') > 0){
					player.discardPlayerCard(target,'e');
				}
				target.damage(1,'thunder');
				target.equip(event.card);
			},
			skills:['frog_skill'],
			ai:{
					basic:{
						order:1,
						useful:[3,1],
						value:2,
						equipValue:0
					},
					result:{
						target:function(player,target){
							return -get.attitude(_status.event.player,target);
						}
					},
					tag:{
						thunderdamage:1
					}
				}
		},
		magatama:{
			fullskin:true,
			type:'equip',
			subtype:'equip5',
			ai:{
				basic:{
					equipValue:2
				}
			},
			skills:['magatama_skill']
		},
		mirror:{
			fullskin:true,
			type:'equip',
			subtype:'equip2',
			ai:{
				basic:{
					equipValue:7.5
				}
			},
			skills:['mirror_skill']
		},
		kusanagi:{
			fullskin:true,
			type:'equip',
			subtype:'equip1',
			ai:{
				basic:{
					equipValue:2
				}
			},
			skills:['kusanagi_skill']
		},
		lunadial:{
			fullskin:true,
			type:'equip',
			subtype:'equip3',
			ai:{
				basic:{
					equipValue:6
				}
			},
			skills:['lunadial_skill']
		},
		hakkero:{
			fullskin:true,
			type:'equip',
			subtype:'equip1',
			ai:{
				basic:{
					equipValue:3
				}
			},
			skills:['hakkero_skill']
		},
		lantern:{
			fullskin:true,
			type:'equip',
			subtype:'equip2',
			ai:{
				basic:{
					equipValue:7.5
				}
			},
			skills:['lantern_skill']
		},
		hourai:{
			fullskin:true,
			type:'equip',
			subtype:'equip2',
			ai:{
				basic:{
					equipValue:7
				}
			},
			skills:['hourai_skill']
		},
		stone:{
			fullskin:true,
			type:'equip',
			subtype:'equip5',
			ai:{
				basic:{
					equipValue:5
				}
			},
			skills:['stone_skill']
		},
	},
	skill:{
		huogong2:{},
		saiqian_skill:{
			global:'saiqian_skill2',
		},
		saiqian_skill2:{
			audio:true,
			enable:'phaseUse',
			usable:1,
			discard:false,
			line:true,
			prepare:function(cards,player,targets){
				player.$give(cards,targets[0]);
			},
			filter:function(event,player){
				if(player.num('h') == 0) return 0;
				return game.hasPlayer(function(target){
					return target!=player&&target.hasSkill('saiqian_skill',player);
				});
			},
			filterCard:function(card){
				return true;
			},
			filterTarget:function(card,player,target){
				return target!=player&&target.hasSkill('saiqian_skill',player);
			},
			forceaudio:true,
			prompt:'请选择要供奉的牌',
			content:function(){
				target.gain(cards);
			},
			ai:{
				expose:0.3,
				order:2,
				result:{
					target:1
				}
			}
		},
		saiqian_skill3:{
				enable:'chooseToUse',
				filterCard:function(card){
					return true;
				},
				position:'he',
				viewAs:{name:'reidaisai'},
				viewAsFilter:function(player){
					if(!player.countCards('he')) return false;
				},
				usable:1,
				prompt:'将一张牌当【例大祭】使用',
				check:function(card){return 3-get.value(card)}
		},
		louguan_skill:{
			trigger:{player:'useCardtoBegin'},
			forced:true,
			priority:10,
			filter:function(event){
				return event.card.name=='sha';
			},
			content:function(){
				trigger.target.addTempSkill('unequip', 'useCardAfter');
			},
		},
		bailou_skill:{
			trigger:{source:'damageEnd'},
			forced:true,
			filter:function(event){
				return (event.card && event.card.name=='sha' && event.nature != 'thunder');
			},
			content:function(){
				trigger.player.damage('thunder');
			}
		},
		yinyangyu_skill_1:{
			audio:2,
			enable:['chooseToRespond'],
			filterCard:function(card){
				return get.color(card)=='red';
			},
			viewAs:{name:'shan'},
			viewAsFilter:function(player){
				if(!player.num('he',{color:'red'})) return false;
			},
			prompt:'将一张红色手牌当闪打出',
			check:function(){return 1},
			ai:{
				respondShan:true,
				skillTagFilter:function(player){
					if(!player.num('he',{color:'red'})) return false;
				},
				result:{
					target:function(card,player,target,current){
						if(get.tag(card,'respondShan')&&current<0) return 0.6
					}
				}
			}
		},
		yinyangyu_skill_2:{
			audio:2,
			enable:['chooseToRespond','chooseToUse'],
			filterCard:function(card){
				return get.color(card)=='black';
			},
			position:'he',
			viewAs:{name:'sha'},
			viewAsFilter:function(player){
				if(!player.num('he',{color:'black'})) return false;
			},
			prompt:'将一张黑色牌当杀使用或打出',
			check:function(card){return 4-ai.get.value(card)},
			ai:{
				skillTagFilter:function(player){
					if(!player.num('he',{color:'black'})) return false;
				},
				respondSha:true,
			}
		},
		laevatein_skill:{
			trigger:{player:'shaBefore'},
			forced:true,
			popup:false,
			filter:function(event,player){
				return _status.currentPhase==player;
			},
			content:function(){
				var target=trigger.target;
				if(!target.hasSkill('laevatein3')){
					player.getStat().card.sha--;
					target.addTempSkill('laevatein3','phaseUseEnd');
				}
			}
		},
		laevatein3:{
		},
		windfan_skill:{
			audio:true,
			usable:1,
			enable:['chooseToUse'],
			filterCard:function(card){
				return get.color(card)=='red';
			},
			position:'he',
			viewAs:{name:'guohe'},
			viewAsFilter:function(player){
				if(!player.num('he',{color:'red'})) return false;
			},
			prompt:'将一张红色牌当【疾风骤雨】使用或打出',
			check:function(card){return 4-ai.get.value(card)},
			ai:{
				skillTagFilter:function(player){
					if(!player.num('he',{color:'red'})) return false;
				},
				respondSha:true,
			}
		},
		gungnir_skill:{
			audio:true,
			trigger:{player:'shaBegin'},
			check:function(event,player){
				return ai.get.attitude(player,event.target)<=0 && event.target.countCards('h') > 2;
			},
			content:function(){
				"step 0"
				var controls=['throw_gungir'];
    				if(player.lili >= 2){
    					controls.push('lose_lili');
    				}
    				player.chooseControl(controls).ai=function(){
    					if(player.lili > 3){
    						return 'lose_lili';
    					}
    					else{
    						return 'throw_gungir';
    					}
    				}
    			"step 1"
    			event.control=result.control;
    			if (event.control == 'lose_lili'){
    				player.loselili(2);
    			} else {
    				var cards = player.getCards('e');
					for (var i = 0; i <= cards.length; i ++){
						if(cards[i]&&cards[i].name == 'gungnir'){
							player.discard(cards[i]);
							break;
						}
					}
				}	
				trigger.directHit=true;
			}
		},
		ibuki_skill:{
			audio:true,
			enable:'phaseUse',
			usable:1,
			filter:function(event,player){
				return player.num('h',{subtype:'attack'})>0;
			},
			filterCard:{subtype:'attack'},
			check:function(card){
				return 8-ai.get.value(card);
			},
			position:'h',
			content:function(){
				player.gainlili();
			},
			ai:{
				order:8,
				result:{
					player:function(player){
						if(player.hp<=2) return player.num('h')==0?1:0;
						if(player.num('h',{name:'sha',color:'red'})) return 1;
						return player.num('h')<=player.hp?1:0;
					}
				},
			}
		},
		deathfan_skill:{
			audio:true,
			enable:'phaseUse',
			usable:1,
			filterTarget:true,
			selectTarget:[1,2],
			filter:function(event,player){
				return player.num('h',{subtype:'defense'})>0;
			},
			filterCard:{subtype:'defense'},
			check:function(card){
				return 8-ai.get.value(card);
			},
			position:'h',
			content:function(){
				target.damage('thunder');
			},
		},
		penglaiyao_skill:{
			audio:true,
			trigger:{player:'phaseEnd'},
			forced:true,
			content:function(){
				player.loselili(2);
			},
		},
		frog_skill:{
				enable:['chooseToUse'],
				filterCard:function(card,player){
					return card.name=='frog';
				},
				position:'e',
				viewAs:{name:'sha'},
				prompt:'将一张青蛙扔出去！',
				check:function(card){return 4-get.value(card)},
				ai:{
					skillTagFilter:function(player){
						return true;
					}
				}
		},
		zhiyuu_skill:{
			audio:true,
			fullskin:true,
			enable:'phaseUse',
			usable:1,
			filterTarget:function(card,player,target){
				if(player!=game.me&&player.num('h') == 0) return false;
				return target.num('h')>0;
			},
			content:function(){
				"step 0"
				if(target.get('h').length==0){
					event.finish();
					return;
				}
				var rand=Math.random()<0.5;
				target.chooseCard(true).ai=function(card){
					if(rand) return Math.random();
					return ai.get.value(card);
				};
				"step 1"
				event.dialog=ui.create.dialog(get.translation(target)+'展示的手牌',result.cards);
				event.videoId=lib.status.videoId++;

				game.broadcast('createDialog',event.videoId,get.translation(target)+'展示的手牌',result.cards);
				game.addVideo('cardDialog',null,[get.translation(target)+'展示的手牌',get.cardsInfo(result.cards),event.videoId]);
				event.card2=result.cards[0];
				game.log(target,'展示了',event.card2);
				player.chooseToDiscard({suit:get.suit(event.card2)},function(card){
					var evt=_status.event.getParent();
					if(ai.get.damageEffect(evt.target,evt.player,evt.player,'fire')>0){
						return 7-ai.get.value(card,evt.player);
					}
					return -1;
				}).prompt=false;
				game.delay(2);
				"step 2"
				if(result.bool){
					target.damage('thunder');
				}
				else{
					target.addTempSkill('huogong2','phaseBegin');
				}
				event.dialog.close();
				game.addVideo('cardDialog',null,event.videoId);
				game.broadcast('closeDialog',event.videoId);
			},
			ai:{
					basic:{
						order:4,
						value:[3,1],
						useful:1,
					},
					result:{
						player:function(player){
							return 3;
						},
						target:function(player,target){
							if(target.countCards('h')==0) return 0;
							if(player.countCards('h')<=1) return 0;
							if(target==player){
									return -1.5;
								if(_status.event.skill){
									var viewAs=get.info(_status.event.skill).viewAs;
								}
								return 0;
							}
							return -1.5;
						}
					},
					tag:{
						thunderDamage:1,
					}
				}
		},
		book_skill:{
			audio:2,
			trigger:{player:'phaseEnd'},
			frequent:false,
			filter:function(event,player){
				return player.lili > 0 && ui.skillPile.childNodes.length > 0;
			},
			content:function(){
				player.loselili();
				player.gain(ui.skillPile.childNodes[0],'draw2');
			},
			check:function(event, player){
				if (player.lili < 3) return false;
				if (player.countCards('j') >= 3) return false;
				return true;
			},
		},
		yuzhi_skill:{
			audio:2,
			enable:'phaseUse',
			usable:1,
			discard:false,
			filterCard:function(card){
				return true;
			},
			prepare:function(cards,player,targets){
				player.showCards(cards);
				player.storage.yuzhi = cards[0];
			},
			content:function(){
				'step 0'
				player.chooseControl('花色','点数').set('ai',function(){
						return '点数';
					}).set('prompt','想要更改哪一样？');
				'step 1'
				if (result.control){
					var list = [];
					event.control = result.control;
					if (result.control == '花色'){
						list = ['heart', 'spade', 'diamond', 'club'];
					} else if (result.control == '点数'){
						list = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];
					}
					player.chooseControl(list).set('prompt','想要改成什么？');
				}
				'step 2'
				if (result.control){
					if (event.control == '花色'){
						player.storage.yuzhisuit = result.control;
					} else if (event.control == '点数'){
						var num = result.control;
						switch(num){
                            case 'A':num=1;break;
                            case 'J':num=11;break;
                            case 'Q':num=12;break;
                            case 'K':num=13;break;
                            default:num=num;
                        }
                        player.storage.yuzhinumber = result.control;
					}
					player.addTempSkill('yuzhi_skill2');
				}
			},
		},
		yuzhi_skill2:{
			mod:{
				suit:function(card,suit){
					if(card == player.storage.yuzhi && player.storage.yuzhisuit) return player.storage.yuzhisuit;
				},
				number:function(card,number){
					if(card == player.storage.yuzhi && player.storage.yuzhinumber) return player.storage.yuzhinumber;
				},
			},
		},
		magatama_skill:{
			audio:2,
			enable:'phaseUse',
			usable:1,
			filterTarget:function(card,player,target){
				return target!=player&&target.num('h');
			},
			content:function(){
				"step 0"
				player.chooseCardButton(target,target.get('h')).set('filterButton',function(button){
					return get.color(button.link) != 'black' && get.color(button.link) !='red';
				});
			},
		},
		mirror_skill:{
			audio:2,
			trigger:{target:'useCardToBegin'},
			frequent:true,
			filter:function(event,player){
				return get.subtype(event.card) == 'attack';
			},
			content:function(){
				'step 0'
				player.judge(function(card){
					if(get.color(card) == get.color(trigger.card)) return 1;
					return 0;
				});
				'step 1'
				if(result.color){
					if(result.color==get.color(trigger.card)){
						trigger.cancel();
					}
				}
			},
		},
		lunadial_skill:{
			audio:2,
			enable:'phaseUse',
			usable:1,
			filterTarget:function(card,player,target){
				return target!=player && player.lili > 0;
			},
			content:function(){
				"step 0"
				player.loselili();
				target.addSkill('lunadial2');
			},

		},
		lunadial2:{
			trigger:{global:'phaseAfter'},
			forced:true,
			mark:true,
			audio:false,
			popup:false,
			content:function(){
				player.removeSkill('lunadial2');
			},
			mod:{
				cardEnabled:function(){
					return false;
				},
				cardUsable:function(){
					return false;
				},
				cardRespondable:function(){
					return false;
				},
				cardSavable:function(){
					return false;
				},
			},
		},
		kusanagi_skill:{
			audio:2,
			trigger:{player:'shaBegin'},
			check:function(event,player){
				return ai.get.attitude(player,event.target)<=0;
			},
			filter:function(event){
				return event.target.lili < event.player.lili && event.target.num('he') > 0;
			},
			content:function(){
				var target = trigger.target;
				if (player.lili > target.lili){
					if(target.num('he') > 0){
						player.discardPlayerCard('he',target,true);
					}
				}
			},
		},
		hakkero_skill:{
			enable:'phaseUse',
			filter:function(event,player){
				// 这段是检测次数限制的
				if(!lib.filter.filterCard({name:'sha'},player,event)){
					return false;
				}
				return player.lili > 0;
			},
			filterTarget:function(card,player,target){
				return player.canUse('sha',target) && player.lili > 0;
			},
			content:function(){
				player.loselili();
				player.useCard({name:'sha'},target);
			},
		},
		lantern_skill:{
			audio:2,
			trigger:{target:'useCardToBefore'},
			forced:true,
			filter:function(event,player){
				return event.card.name=='sha'&& get.distance(player, event.player, 'attack') <= 1 ;
			},
			content:function(){
				"step 0"
				var eff=ai.get.effect(player,trigger.card,trigger.player,trigger.player);
				player.chooseToCompare(trigger.player);
				"step 1"
				if(result.bool){
					trigger.cancel();
				}
			},
		},
		hourai_skill:{
			audio:2,
			trigger:{target:'shaBefore'},
			filter:function(event,player){
				//return event.card.subtype == 'attack';
				return event.card.name == 'sha';
			},
			content:function(){
				var cards = player.getCards('e');
				for (var i = 0; i <= cards.length; i ++){
					if(cards[i]&&cards[i].name == 'hourai'){
						player.gain(cards[i],'gain2');
						break;
					}
				}
				trigger.untrigger();
				trigger.finish();
			},
			check:function(){
				return true;
			},
		},
		stone_skill:{
    		enable:'chooseToUse',
    		filter:function(event,player){
    			return (player.num('e',{name:'stone'}) > 0);
    		},
    		usable:1,
			chooseButton:{
  				dialog:function(event,player){
    					var list = [];
    					for (var i in lib.card){
    						if(lib.card[i].mode&&lib.card[i].mode.contains(lib.config.mode)==false) continue;
							if(lib.card[i].forbid&&lib.card[i].forbid.contains(lib.config.mode)) continue;
							if(lib.card[i].type == 'trick' && event.filterCard({name:i},player,event)){
								list.add(i);
							}
    					}
    					for(var i=0;i<list.length;i++){
    						list[i]=['法术','',list[i]];
    					}
    					return ui.create.dialog([list,'vcard']);
    				},
    				/*
    				filter:function(button,player){
    					return lib.filter.filterCard({name:button.link[2]},player,_status.event.getParent());
    				},
    				*/
    				check:function(button){
    					var player=_status.event.player;
    					var recover=0,lose=1,players=game.filterPlayer();
    					for(var i=0;i<players.length;i++){
    						if(!players[i].isOut()){
    							if(players[i].hp<players[i].maxHp){
    								if(get.attitude(player,players[i])>0){
    									if(players[i].hp<2){
    										lose--;
    										recover+=0.5;
    									}
    									lose--;
    									recover++;
    								}
    								else if(get.attitude(player,players[i])<0){
    									if(players[i].hp<2){
    										lose++;
    										recover-=0.5;
    									}
    									lose++;
    									recover--;
    								}
    							}
    							else{
    								if(get.attitude(player,players[i])>0){
    									lose--;
    								}
    								else if(get.attitude(player,players[i])<0){
    									lose++;
    								}
    							}
    						}
    					}
    					return (button.link[2]=='wuzhong')?1:-1;
    				},
    				backup:function(links,player){
    					return {
    						filterCard:function(card,player){
    							if(ui.selected.cards.length){
    								if (ui.selected.cards[0].name == 'stone') return true;
    								return (card.name == 'stone');
    							} else{
    								return true;
    							}
    							return false;
    						},
    						position:'he',
    						selectCard:2,
    						complexCard:true,
    						popname:true,
    						viewAs:{name:links[0][2]},
    					}
    				},
    				prompt:function(links,player){
    					return '将两张牌（包括贤者之石）当作'+get.translation(links[0][2])+'使用';
    				}
    			},
    			ai:{
					order:6,
					result:{
						player:function(player){
							return 1;
						}
					},
					threaten:1,
				}
		},
		pantsu_skill:{
			alter:true,
			mod:{
				canBeDiscarded:function(card,player,target,event){
					if(get.is.altered('pantsu_skill')&&card.name!='pantsu'&&_status.currentPhase!=player) return false;
				},
				cardDiscardable:function(card,player,target,event){
					if(get.is.altered('pantsu_skill')&&card.name!='pantsu'&&_status.currentPhase!=player) return false;
				}
			},
		},
		bingyu1:{
			trigger:{source:'damageBefore'},
    		forced:true,
    		priority:15,
    		intro:'防止所有角色造成的所有伤害',
    		content:function(){
    			trigger.untrigger();
    			trigger.finish();
    		},
    		mod:{
    			maxHandcard:function(player,num){
    				return num+200;
    			}
    		},
    		ai:{
    			nofire:true,
    			nothunder:true,
    			nodamage:true,
    			notrick:true,
    			notricksource:true,
    			effect:{
    				target:function(card,player,target,current){
    					if(get.tag(card,'damage')){
    						return 'zeroplayertarget';
    					}
    				},
    				player:function(card,player,target,current){
    					if(get.tag(card,'damage')){
    						return 'zeroplayertarget';
    					}
    				}
    			}
    		}
		},
		bingyu2:{
			global:'bingyu1',
			trigger:{player:'phaseBegin'},
			forced:true,
			content:function(){
				var players = game.filterPlayer();
				for (var i = 0; i < players.length; i++){
					players[i].removeSkill('bingyu1');
				}
				player.removeSkill('bingyu2');
			},
		},
		_wuxie:{
			trigger:{player:['useCardToBefore','phaseJudge']},
			priority:5,
			popup:false,
			forced:true,
			filter:function(event,player){
					if(event.name!='phaseJudge'){
						var info=get.info(event.card);
						if(!event.target){
							if(info.wuxieable) return true;
							return false;
						}
						if(event.player.hasSkillTag('playernowuxie',false,event.card)) return false;
						if(get.type(event.card)!='trick'&&!info.wuxieable) return false;
					}
					return true;
				},
			content:function(){
				'step 0'
				if(trigger.multitarget){
					event.targets=trigger.targets;
				}
				event.target=trigger.target;
				if(event.triggername=='phaseJudge'){
					event.target=trigger.player;
				}
				event.sourcex=event.targets||event.target;
				if(!event.targets&&trigger.targets&&trigger.targets.length==1){
					event.sourcex2=trigger.player;
				}
				event.source=trigger.player;
				event.state=true;
				event.card=trigger.card;
				event._global_waiting=true;
				event.tempnowuxie=(trigger.targets&&trigger.targets.length>1&&!trigger.multitarget);
				event.filterCard=function(card,player){
					if(card.name!='wuxie') return false;
					var mod=game.checkMod(card,player,'unchanged','cardEnabled',player.get('s'));
					if(mod!='unchanged') return mod;
					return true;
				};
				event.send=function(player,state,isJudge,card,source,target,targets,id,id2,tempnowuxie,skillState){
					if(skillState){
						player.applySkills(skillState);
					}
					state=state?1:-1;
					var str='';
					if(isJudge){
						str+=get.translation(source)+'的';
					}
					if(isJudge){
						str+=get.translation(card,'viewAs');
					}
					else{
						str+=get.translation(card);
					}
					if((targets||target)&&!isJudge){
						str+='对'+get.translation(targets||target);
					}
					str+='将'+(state>0?'生效':'失效')+'，是否让他住口？';

					if(player.isUnderControl(true)&&!_status.auto&&!ui.tempnowuxie&&tempnowuxie){
						var translation=get.translation(card.name);
						if(translation.length>=4){
							translation=lib.translate[card.name+'_ab']||translation.slice(0,2);
						}
						ui.tempnowuxie=ui.create.control('不无效'+translation,ui.click.tempnowuxie);
						ui.tempnowuxie._origin=id2;
					}
					var next=player.chooseToUse({
						filterCard:function(card,player){
							if(card.name!='wuxie') return false;
							var mod=game.checkMod(card,player,'unchanged','cardEnabled',player.get('s'));
							if(mod!='unchanged') return mod;
							return true;
						},
						prompt:str,
						type:'wuxie',
						state:state,
						_global_waiting:true,
						ai1:function(){
							if(isJudge){
								var name=card.viewAs||card.name;
								var info=lib.card[name];
								if(info&&info.ai&&info.ai.wuxie){
									var aiii=info.ai.wuxie(source,card,source,_status.event.player,state);
									if(typeof aiii=='number') return aiii;
								}
								if(Math.abs(ai.get.attitude(_status.event.player,source))<3) return 0;
								if(source.hasSkill('guanxing')) return 0;
								if(name!='lebu'&&name!='bingliang'){
									if(source!=_status.event.player){
										return 0;
									}
								}
								var card2;
								if(name!=card.name){
									card2={name:name};
								}
								else{
									card2=card;
								}
								var eff=ai.get.effect(source,card2,source,source);
								if(eff>=0) return 0;
								return state*ai.get.attitude(_status.event.player,source);
							}
							else{
								var triggerevent=_status.event.getTrigger();
								if(triggerevent&&triggerevent.parent&&
									triggerevent.parent.postAi&&
									triggerevent.player.isUnknown(_status.event.player)){
									return 0;
								}
								var info=get.info(card);
								if(info.ai&&info.ai.wuxie){
									var aiii=info.ai.wuxie(target,card,source,_status.event.player,state);
									if(typeof aiii=='number') return aiii;
								}
								if(info.multitarget&&targets){
									var eff=0;
									for(var i=0;i<targets.length;i++){
										eff+=ai.get.effect(targets[i],card,source,_status.event.player)
									}
									return -eff*state;
								}
								if(Math.abs(ai.get.attitude(_status.event.player,target))<3) return 0;
								return -ai.get.effect(target,card,source,_status.event.player)*state;
							}
						},
						source:target,
						source2:targets,
						id:id,
						id2:id2
					});
					if(game.online){
						_status.event._resultid=id;
						game.resume();
					}
					else{
						next.nouse=true;
					}
				};
				'step 1'
				var list=[];
				event.list=list;
				event.id=get.id();
				for(var i=0;i<game.players.length;i++){
					if(game.players[i].hasWuxie()){
						list.push(game.players[i]);
					}
				}
				list.sort(function(a,b){
					return get.distance(event.source,a,'absolute')-get.distance(event.source,b,'absolute');
				});
				'step 2'
				if(event.list.length==0){
					event.finish();
					if(!event.state){
						trigger.untrigger();
						if(event.triggername=='phaseJudge'){
							trigger.cancelled=true;
						}
						else{
							trigger.finish();
						}
					}
				}
				else if(_status.connectMode&&(event.list[0].isOnline()||event.list[0]==game.me)){
					event.goto(4);
				}
				else{
					event.current=event.list.shift();
					event.send(event.current,event.state,event.triggername=='phaseJudge',
					event.card,event.source,event.target,event.targets,event.id,trigger.parent.id,event.tempnowuxie);
				}
				'step 3'
				if(result.bool){
					event.wuxieresult=event.current;
					event.wuxieresult2=result;
					event.goto(8);
				}
				else{
					event.goto(2);
				}
				'step 4'
				var id=event.id;
				var sendback=function(result,player){
					if(result&&result.id==id&&!event.wuxieresult&&result.bool){
						event.wuxieresult=player;
						event.wuxieresult2=result;
						game.broadcast('cancel',id);
						if(_status.event.id==id&&_status.event.name=='chooseToUse'&&_status.paused){
							return (function(){
								event.resultOL=_status.event.resultOL;
								ui.click.cancel();
								if(ui.confirm) ui.confirm.close();
							});
						}
					}
					else{
						if(_status.event.id==id&&_status.event.name=='chooseToUse'&&_status.paused){
							return (function(){
								event.resultOL=_status.event.resultOL;
							});
						}
					}
				};

				var withme=false;
				var withol=false;
				var list=event.list;
				for(var i=0;i<list.length;i++){
					if(list[i].isOnline()){
						withol=true;
						list[i].wait(sendback);
						list[i].send(event.send,list[i],event.state,event.triggername=='phaseJudge',
						event.card,event.source,event.target,event.targets,event.id,trigger.parent.id,event.tempnowuxie,get.skillState(list[i]));
						list.splice(i--,1);
					}
					else if(list[i]==game.me){
						withme=true;
						event.send(list[i],event.state,event.triggername=='phaseJudge',
						event.card,event.source,event.target,event.targets,event.id,trigger.parent.id,event.tempnowuxie);
						list.splice(i--,1);
					}
				}
				if(!withme){
					event.goto(6);
				}
				if(_status.connectMode){
					if(withme||withol){
						for(var i=0;i<game.players.length;i++){
							game.players[i].showTimer();
						}
					}
				}
				event.withol=withol;
				'step 5'
				if(result&&result.bool&&!event.wuxieresult){
					game.broadcast('cancel',event.id);
					event.wuxieresult=game.me;
					event.wuxieresult2=result;
				}
				'step 6'
				if(event.withol&&!event.resultOL){
					game.pause();
				}
				'step 7'
				for(var i=0;i<game.players.length;i++){
					game.players[i].hideTimer();
				}
				'step 8'
				if(event.wuxieresult){
					event.wuxieresult.useResult(event.wuxieresult2);
				}
				'step 9'
				if(event.wuxieresult){
					if(result=='wuxied'){
						event.state=!event.state;
					}
					event.goto(1);
				}
				else if(event.list.length){
					event.goto(2);
				}
				else{
					if(!event.state){
						trigger.untrigger();
						if(event.triggername=='phaseJudge'){
							trigger.cancelled=true;
						}
						else{
							trigger.finish();
						}
					}
				}
				delete event.resultOL;
				delete event.wuxieresult;
				delete event.wuxieresult2;
			}
		},
		// 死门追加效果
		_simen:{
			trigger:{player:'discardAfter'},
			forced:true,
			skillAnimation:true,
			filter:function(event,player){
    			for(var i=0;i<event.cards.length;i++){
    				if(event.cards[i].name == 'simen'){
    					return true;
    				}
    			}
    			return false;
    		},
			content:function(){
				for(var i=0;i<trigger.cards.length;i++){
    				if(trigger.cards[i].name == 'simen'){
    					game.log('死境之门启动：所有角色失去1点体力。');
    					var players=game.filterPlayer();
    					player.line(players,'black');
    					for (var j=0;j<players.length;j++){
    						players[j].loseHp();
    					}
    				}
    			}
			},
		},
		// 天国翻牌堆效果
		_tianguo:{
			trigger:{player:'useCard'},
			forced:true,
			filter:function(event,player){
    			return (event.card.name=='tianguo');
    		},
			content:function(){
				var cards = [];
				for(i=0;i<ui.discardPile.childNodes.length;i++){
                    var currentcard=ui.discardPile.childNodes[i];
                    currentcard.vanishtag.length=0;
                    if(get.info(currentcard).vanish||currentcard.storage.vanish){
                        currentcard.remove();
                        continue;
                    }
                    cards.push(currentcard);
                }
                cards.randomSort();
                for(var i=0;i<cards.length;i++){
                    ui.cardPile.appendChild(cards[i]);
                }
                game.log("天国之阶：弃牌堆加入牌堆");
            },
		},
		_tianguo2:{
			skillAnimation:true,
			trigger:{player:'drawAfter'},
			filter:function(event,player){
				if (event.result.length) {
					for(var i=0;i<event.result.length;i++){
    					if(event.result[i].name == 'tianguo'){
    						return true;
    					}
    				}
    			}
    			return false;
			},
			content:function(){
				for(var i=0;i<trigger.result.length;i++){
    				if(trigger.result[i].name == 'tianguo'){
    					game.log('天国之阶启动：所有角色回复1点体力。');
    					var players=game.filterPlayer();
    					for (var j=0;j<players.length;j++){
    						players[j].recover();
    					}
    				}
    			}
			},
			ai:{
				result:{
						target:function(player,target){
							return (target.hp<target.maxHp)?2:0;
						}
					},
					tag:{
						recover:0.5,
						multitarget:1
					}
				},
			prompt:'是否发动【天国之阶】：摸到后，可以令所有角色回复1点体力？',
		},
		// 派对当潜行
		_jingxia:{
			enable:'phaseUse',
			filter:function(event,player){
				return player.countCards('h','jingxia') > 0;
			},
			content:function(){
				'step 0'
				var cards = [];
				var hand = player.get('h');
				for (var i = 0; i < hand.length; i++){
					if (hand[i].name == 'jingxia') cards.push(hand[i]);
				}
				player.chooseCardButton('当作【潜行】放入技能牌区？',cards);
				'step 1'
				if(result.links&&result.links.length){
					player.addJudge('qianxing',result.links[0]);
					player.logSkill('_jingxia');
				}
			},
		},
		// 如果明置就有急冻
		_bingyu:{
			forced:true,
			popup:false,
			trigger:{player:'phaseBegin'},
			filter:function(event,player){
				if (!player.storage.mingzhi) return false;
				for (var i in player.storage.mingzhi){
					if (i.name == 'bingyu') return true;
				}
				return false;
			},
			content:function(){
				player.useSkill('jidong');
			},
		},
		_zuiye:{
			skillAnimation:true,
    		trigger:{source:'damageBefore'},
    		filter:function(event,player){
    			return player.countCards('h',{name:'zuiye'})>0&&event.nature != 'thunder';
    		},
    		content:function(){
    			var hand = player.getCards('h');
    			for (var i = 0; i < hand.length; i++){
    				if (hand[i].name == 'zuiye'){
    					trigger.player.gain(hand[i]);
    					trigger.num++;
    				}
    			}
    		},
    		prompt:'是否发动【罪业边狱】：将罪业边狱交给对方，令伤害+1',
			check:function(event, player){
				return -get.attitude(player, event.player);
			},
		},
		huazhi_skill:{
			trigger:{global:'phaseEnd'},
			forced:true,
			content:function(){
				var num = player.getStat('damage');
				player.draw(num);
				player.removeSkill('huazhi_skill');
			},
		},
		// 不能使用打出
		lingbi1:{
			mod:{
				cardEnabled:function(card,player){
					var players=game.filterPlayer();
					var cards = [];
					for(var i=0;i<players.length;i++){
						if (players[i].storage._lingbi2) cards = cards.concat(players[i].storage._lingbi2);
					}
					if(cards.contains(card.name)) return false;
				},
				cardUsable:function(card,player){
					var players=game.filterPlayer();
					var cards = [];
					for(var i=0;i<players.length;i++){
						if (players[i].storage._lingbi2) cards = cards.concat(players[i].storage._lingbi2);
					}
					if(cards.contains(card.name)) return false;
				},
				cardRespondable:function(card, player){
					var players=game.filterPlayer();
					var cards = [];
					for(var i=0;i<players.length;i++){
						if (players[i].storage._lingbi2) cards = cards.concat(players[i].storage._lingbi2);
					}
					if(cards.contains(card.name)) return false;
				},
				cardSavable:function(card,player){
					var players=game.filterPlayer();
					var cards = [];
					for(var i=0;i<players.length;i++){
						if (players[i].storage._lingbi2) cards = cards.concat(players[i].storage._lingbi2);
					}
					if(cards.contains(card.name)) return false;
				}
			},
		},
		// 准备阶段扔掉
		lingbi2:{
			global:'lingbi1',
			trigger:{player:'phaseBegin'},
			forced:true,
			filter:function(event,player){
				if (!player.storage._lingbi2) return false;
				return player.storage._lingbi2.length > 0;
			},
			content:function(){
				var players=game.filterPlayer();
				for(var i=0;i<players.length;i++){
					players[i].removeSkill('lingbi1');
				}
				player.removeSkill('lingbi2');
				player.storage._lingbi2 = [];
				player.unmarkSkill('_lingbi2');
			},
		},
		_lingbi:{
    		enable:'chooseToUse',
    		filterCard:function(card){
    			return card.name=='lingbi';
    		},
    		viewAsFilter:function(player){
    			return player.countCards('h',{name:'lingbi'})>0;
    		},
    		viewAs:{name:'wuxie'},
    		prompt:'将【令避之间】当【请你住口！】使用',
    		check:function(card){return 8-get.value(card)},
		},
		// 令避发动时声明卡牌
		_lingbi2:{
			skillAnimation:true,
			trigger:{player:'useCard'},
			forced:true,
			init:function(player){
				player.storage._lingbi2=[];
			},
			intro:{
				content:'cards'
			},
			filter:function(event,player){
    			return (event.card.name=='lingbi');
    		},
			content:function(){
				'step 0'
				var list = [];
    			for (var i in lib.card){
    				if(lib.card[i].mode&&lib.card[i].mode.contains(lib.config.mode)==false) continue;
					if(lib.card[i].forbid&&lib.card[i].forbid.contains(lib.config.mode)) continue;
 					//if(lib.card[i].type == 'trick' || lib.card[i].type == 'basic' || lib.card[i].type == "jinji" || lib.card[i].type == "equip"){
					if (lib.translate[i] && lib.card[i].type != 'delay' && lib.card[i].type != 'zhenfa'){
						list.add(i);
					}
    			}
				player.chooseButton(['选择不让使用打出的牌',[list,'vcard']]).set('filterButton',function(button){
    					return true;
    				}).set('ai',function(button){
    					var rand=_status.event.rand*2;
    					switch(button.link[2]){
    						case 'sha':return 5+rand[1];
    						case 'tao':return 4+rand[2];
    						case 'shan':return 4.5+rand[3];
    						case 'wuzhong':return 4+rand[4];
    						case 'shunshou':return 3+rand[5];
    						default:return rand[6];
    					}
    				}).set('rand',[Math.random(),Math.random(),Math.random(),Math.random(),
    				Math.random()],Math.random());
    			'step 1'
				if(result.bool){
					player.addSkill('lingbi2');
					if (!player.storage._lingbi2) player.storage._lingbi2=[];
					player.$gain2(result.links[0][2]);
					player.storage._lingbi2.add(result.links[0][2]);
					player.markSkill('_lingbi2');
					player.syncStorage('_lingbi2');
				}
			},
		},
		_huanxiang:{
			skillAnimation:true,
			trigger:{global:'gameDrawAfter'},
			filter:function(event,player){
				return player.countCards('h',{name:'huanxiang'}) > 0;
			},
			content:function(){
				game.log('幻想之门：游戏开始时，令所有角色摸一张牌');
				for (var i = 0; i < game.filterPlayer().length; i ++){
					game.filterPlayer()[i].draw();
				}
			},
			check:function(event,player){
				return true;
			},
			prompt:'是否发动【幻想之门】：游戏开始时，可以令所有角色摸一张牌',
		},
		danmaku_skill:{
			mod:{
				cardUsable:function(card,player,num){
					if(card.name=='sha') return num + 2;
				}
			},
		},
		_zhunbei:{
			popup:false,
			direct:true,
			trigger:{player:'phaseBegin'},
			filter:function(event,player){
				return player.countCards('h',{name:'bingyu'}) > 0|| player.countCards('h',{name:'lingbi'}) > 0;
			},
			content:function(){
				player.chooseToUse(function(card){
						return card.name == 'lingbi' || card.name == 'bingyu';
					},'可以使用一张牌');
			},
		},
	},
	translate:{
		sha:'轰！',
		sha_info:'出牌阶段，对攻击范围内的一名角色使用；对目标造成1点弹幕伤害。',
		shan:'没中',
		shan_info:'你成为【轰！】的目标后，对那张牌使用；该牌对你无效。',
		tao:'葱',
		tao_info:'出牌阶段，对你使用；或角色处于决死状态时，对其使用；目标回复1点体力。',
		reidaisai:'例大祭',
		reidaisai_info:'出牌阶段，对所有角色使用：目标各摸一张牌，然后各交给一名角色一张牌。',
		danmakucraze:'弹幕狂欢',
		danmakucraze_info:'出牌阶段，对你使用：目标使用的下两张【轰！】不计次数，直到结束阶段。</br><u>强化（1）：摸一张牌。<u>',
		wuzhong:'灵光一闪',
		wuzhong_bg:'生',
		wuzhong_info:'出牌阶段，对你使用：目标摸两张牌。</br><u>强化(1)：再摸一张技能牌。<u>',
		juedou:'决斗',
		juedou_info:'出牌阶段，对一名其他角色使用。由其开始，其与你轮流打出一张【轰！】，直到其中一方未打出【轰！】为止。未打出【轰！】的一方受到另一方对其造成的1点弹幕伤害。',
		juedou_bg:'斗',
		shunshou:'顺手牵羊',
		shunshou_info:'出牌阶段，对攻击范围内的一名角色使用：获得其区域内的一张牌，然后若你本回合没有对其使用过牌，你消耗1点灵力。',
		guohe:'疾风骤雨',
		guohe_bg:'拆',
		guohe_info:'出牌阶段，对攻击范围内的一名其他角色使用；弃置其区域内的一张牌。</br><u>强化(1)：再弃置一张装备或技能牌。<u>',
		wuxie:'请你住口！',
		wuxie_bg:'滚',
		wuxie_info:'一名角色或一张牌成为法术牌的目标后，对此牌使用。抵消此牌对一名角色产生的效果',
		caifang:'突击采访',
		caifang_info:'出牌阶段，对一名其他角色使用；其选择一项：明置身份牌，或令你观看其手牌并摸一张牌。</br><u>强化（1）：改为选择两项。<u>',
		/*
		penglaiyao:'魔力药水',
		penglaiyao_info:'结束阶段，你失去2点灵力。',
		*/
		pantsu:'蓝白胖次',
		pantsu_info:'锁定技，其他角色不能弃置或获得你的此牌以外的牌。',
		laevatein:'莱瓦丁',
		laevatein_info:'锁定技，出牌阶段，你对每名角色使用的第一张【轰！】不算次数。',
		gungnir:'冈格尼尔',
		gungnir_skill:'冈格尼尔',
		lose_lili:'消耗灵力',
		throw_gungir:'贯穿他，冈格尼尔！',
		gungnir_info:'你使用【轰！】指定目标后，可以弃置此牌，或消耗2点灵力，令目标不能对该【轰！】使用牌。',
		louguan:'楼观剑',
		louguan_info:'锁定技，你使用【轰！】指定目标后，该角色的装备技能无效，直到该牌结算完毕。',
		ibuki:'伊吹瓢',
		ibuki_skill:'伊吹瓢',
		ibuki_info:'一回合一次，出牌阶段，你可以弃置一张攻击牌，然后获得1点灵力。',
		deathfan:'凤蝶纹扇',
		deathfan_skill:'扇子咬他！',
		deathfan_info:'一回合一次，出牌阶段，你可以弃置一张防御牌，然后对至多2名角色各造成1点灵击伤害。',
		windfan:'风神团扇',
		windfan_skill:'能扇起裙子吗？',
		windfan_info:'一回合一次，你可以将一张红色牌当做【疾风骤雨】使用/打出',
		saiqianxiang:'赛钱箱',
		saiqian_skill2:'赛钱！',
		saiqian_skill3:'例大祭',
		saiqianxiang_info:'一回合一次，其他角色的出牌阶段，其可以交给你一张牌;一回合一次，你可以将一张手牌当作【例大祭】使用。',
		yinyangyu:'阴阳玉',
		yinyangyu_skill:'阴阳玉',
		yinyangyu_skill_1:'阴阳玉（没中）',
		yinyangyu_skill_2:'阴阳玉（轰！）',
		yinyangyu_info:'你可以将一张红色牌当做【没中】使用/打出; 你可以将一张黑色牌当做【轰！】使用/打出',
		zhiyuu:'净颇梨之镜',
		zhiyuu_skill:'净颇梨之镜',
		zhiyuu_info:'一回合一次，出牌阶段，你可以令一名角色展示一张手牌；然后你可以弃置一张与展示的牌相同花色的手牌，对其造成1点灵击伤害。',
		mirror:'八咫镜',
		mirror_skill:'八咫镜',
		mirror_info:'你成为攻击牌的目标后，可以判定：若颜色相同，令之对你无效。',
		/*
		ryuuuu:'龙宫羽衣',
		ryuuuu_info:'锁定技，你受到灵击伤害时，防止该伤害；你受到伤害后，对伤害来源造成1点灵击伤害。',
		*/
		feixiang:'绯想之剑',
		feixiang_info:'锁定技，你使用攻击牌时，获得1点灵力。',
		bailou:'白楼剑',
		bailou_info:'锁定技，你使用攻击牌造成弹幕伤害后，对受伤角色造成1点灵击伤害。',
		book:'魔导书',
		book_skill:'魔导书',
		book_info:'锁定技，准备阶段，你获得1点灵力。',
		yuzhi:'蓬莱玉枝',
		yuzhi:'准备阶段，你可以观看牌堆顶的一张牌，然后可以弃置之。',
		hourai:'替身人形',
		hourai_skill:'替身人形',
		hourai_info:'你成为攻击牌的目标后，可以收回装备区中的此牌，令该牌对你无效。',
		frog:'冰镇青蛙',
		frog_info:'你可以将此牌置入一名其他角色的装备区（可以替换），令一名其他角色消耗1点灵力；你可以将此牌当作【轰！】使用。',
		frog_skill:'吃我一青蛙！',
		/*
		magatama:'八咫琼勾玉',
		magatama_skill:'解密',
		magatama_info:'一回合一次，出牌阶段，你可以观看一名角色的手牌。',
		*/
		lunadial:'月时针',
		lunadial_skill:'月时针',
		lunadial_info:'一回合一次，出牌阶段，你可以消耗1点灵力，然后令一名其他角色不能使用或打出手牌，直到结束阶段。',
		/*
		kusanagi:'草薙剑',
		kusanagi_skill:'草薙剑',
		kusanagi_info:'你使用【轰！】指定目标后，若你的灵力大于目标，可以弃置其一张牌。',
		*/
		hakkero:'八卦炉',
		hakkero_skill:'八卦炉',
		hakkero_info:'出牌阶段，你可以消耗1点灵力，视为使用一张【轰！】',
		lantern:'人魂灯',
		lantern_info:'锁定技，你成为【轰！】的目标后，若来源在你攻击范围内，与其拼点；若你赢，令该【轰！】对你无效。',
		stone:'贤者之石',
		stone_info:'你可以将两张牌(包括此牌)当作一种法术牌使用。',
		stone_skill:'贤者之石',
		simen:'死境之门',
		_simen:'死境之门',
		simen_info:'出牌阶段，对所有其他角色使用：目标各弃置一张牌；全弃置完后，交换牌堆和弃牌堆。</br> <u>追加效果：此牌因弃置进入弃牌堆后，所有角色失去1点体力。</u>',
		huanxiang:'幻想之门',
		_huanxiang:'幻想之门',
		huanxiang_info:'出牌阶段，对所有角色使用：目标各摸一张牌，一张技能牌，获得1点灵力。</br> <u>追加效果：游戏开始时，你可以展示此牌，所有角色摸一张牌。</u>',
		tianguo:'天国之阶',
		_tianguo2:'天国之阶',
		_tianguo2_info:'展示天国之阶，令所有角色回复1点体力',
		tianguo_info:'出牌阶段，对所有角色使用：将弃牌堆洗入牌堆，然后目标各摸一张牌。</br> <u>追加效果：你摸到此牌时，可以展示之，所有角色回复1点体力。</u>',
		lingbi:'令避之间',
		lingbi_info:'准备阶段，对所有角色使用：你声明一张牌，目标角色不能使用该牌，直到你的回合开始，或你坠机时。</br> <u>追加效果：此牌可以当作【请你住口！】使用。</u>',
		lingbi2:'令避之间2',
		lingbi2_info:'',
		lingbi1:'令避之间',
		_lingbi:'令避之间',
		_lingbi_info:'将【令避之间】当【请你住口！】使用',
		_lingbi2:'令避之间',
		_lingbi2_bg:'避',
		lingbi1_info:'不能使用标记里的牌',
		zuiye:'罪业边狱',
		_zuiye:'罪业边狱',
		_zuiye_info:'将罪业边狱交给对方，令伤害+1',
		zuiye_info:'出牌阶段，对一名角色使用：弃置其X张牌（X为其已受伤值）。</br> <u>追加效果：你造成弹幕伤害时，可以将此牌交给受伤角色，令伤害+1。</u>',
		huazhi:'花之祝福',
		huazhi_info:'出牌阶段，对你使用：结束阶段，目标摸X张牌（X为其本回合造成的伤害点数）。</br> <u>追加效果：若你的灵力为0，使用此牌后，获得2点灵力。</u>',
		huazhi_skill:'花之祝福',
		huazhi_skill_info:'结束阶段，你摸X张牌（X为其本回合造成的伤害点数）。',
		bingyu:'冰域之宴',
		_bingyu:'冰域之宴',
		bingyu1:'冰域之宴',
		bingyu1_bg:'冰',
		bingyu_info:'准备阶段，对所有角色使用：目标不能造成伤害，手牌上限视为无限，直到你的回合开始，或你坠机时。</br> <u>追加效果：若此牌在你区域内明置，你视为持有【急冻】。</u>',
		jingxia:'惊吓派对',
		_jingxia:'惊吓派对',
		jingxia_bg:'潜',
		jingxia_info:'出牌阶段，对所有其他角色使用：与目标各拼点：若你赢，对其造成1点灵击伤害。</br> <u>追加效果：出牌阶段，可以将此牌当作【潜行】置入技能牌区。</u>',
	},
	list:[
		["spade",2,"sha"],
		["spade",5,"sha"],
		["spade",6,"sha"],
		["spade",7,"sha"],
		["spade",8,"sha"],
		["spade",9,"sha"],
		["spade",10,"sha"],
		["spade",12,"sha"],
		["club",2,"sha"],
		["club",3,"sha"],
		["club",4,"sha"],
		["club",5,"sha"],
		["club",6,"sha"],
		["club",7,"sha"],
		["club",8,"sha"],
		["club",9,"sha"],
		["club",10,"sha"],
		["club",11,"sha"],
		["club",12,"sha"],
		["heart",4,"sha",'',1],
		["heart",5,"sha",'',1],
		["heart",10,"sha",'',1],
		["heart",10,"sha",'',1],
		["heart",11,"sha",'',1],
		["diamond",6,"sha",'',1],
		["diamond",7,"sha",'',1],
		["diamond",8,"sha",'',1],
		["diamond",9,"sha",'',1],
		["diamond",10,"sha",'',1],
		["diamond",13,"sha",'',1],
		["heart",2,"shan"],
		["heart",2,"shan"],
		["heart",13,"shan"],
		["diamond",2,"shan"],
		["diamond",2,"shan"],
		["diamond",3,"shan"],
		["diamond",4,"shan"],
		["diamond",5,"shan"],
		["diamond",6,"shan"],
		["diamond",7,"shan"],
		["diamond",8,"shan"],
		["diamond",9,"shan"],
		["diamond",10,"shan"],
		["diamond",11,"shan"],
		["diamond",11,"shan"],
		["heart",3,"tao"],
		["heart",4,"tao"],
		["heart",6,"tao"],
		["heart",7,"tao"],
		["heart",8,"tao"],
		["heart",9,"tao"],
		["heart",12,"tao"],
		["diamond",12,"tao"],
		["spade",1,"juedou"],
		["club",1,"juedou"],
		["diamond",1,"juedou"],
		["heart",11,"juedou"],
		["heart",7,"wuzhong"],
		["heart",8,"wuzhong"],
		["heart",9,"wuzhong"],
		["spade",3,'shunshou'],
		["spade",4,'shunshou'],
		["diamond",3,'shunshou'],
		["diamond",4,'shunshou'],
		["spade",3,'guohe'],
		["spade",4,'guohe'],
		["spade",10,'guohe'],
		["diamond",12,'guohe'],
		["club",3,'guohe'],
		["club",4,'guohe'],
		["spade",8,'guohe'],
		["spade",9,'frog',""],
		["spade",11,'wuxie'],
		["spade",12,'wuxie'],
		["club",7,'wuxie'],
		["club",12,'wuxie'],
		["club",1,'wuxie'],
		["heart",1,'reidaisai'],
		["heart",6,'reidaisai'],
		["club",13,'danmakucraze'],
		["spade",13,'danmakucraze'],
		["club",10,'caifang'],
		["club",11,'caifang'],
		["diamond",1,'deathfan'],
		["spade",1,'windfan',"",1],
		["heart",1,'lunadial',""],
		["spade",2,'ibuki',"",1],
		["club",2,'hourai',"",-1],
		["heart",3,'pantsu',"", 1],
		["diamond",5,'saiqianxiang',"",1],
		["heart",5,'yinyangyu',"",-1],
		["spade",5,'hakkero',"",1],
		["club",5,'lantern',"",-1],
		["club",6,'bailou',"",-1],
		["spade",6,'louguan',"",1],
		["club",8,'mirror'],
		["club",9,'frog',""],
		["spade",11,'book',"",1],
		["spade",7,'stone'],
		["heart",12,'yuzhi',"",1],
		["spade",13,'book',"",1],
		["heart",13,'laevatein',"",1],
		["diamond",13,'gungnir',"",1],
		["club",13,'zhiyuu',"",1],
		["diamond",1,'bingyu'],
		["spade",2,'simen'],
		["club",3,'zuiye'],
		["spade",4,'lingbi'],
		["heart",6,'huanxiang'],
		["club",7,'jingxia'],
		["heart",8,'tianguo'],
		["diamond",9,'huazhi'],
	],
	};
});
