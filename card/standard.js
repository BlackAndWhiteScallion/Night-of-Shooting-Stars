'use strict';
card.standard={
	connect:true,
	card:{
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
					target:-1.5
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
			filterTarget:function(card,player,target){return player!=target},
			content:function(){
				"step 0"
				if(event.skipShan){
					event._result={bool:true};
				}
				else if(event.directHit){
					event._result={bool:false};
				}
				else{
					var next=target.chooseToRespond({name:'shan'});
					next.set('ai',function(){
						var target=_status.event.player;
						var evt=_status.event.getParent();
						var sks=target.get('s');
						if(sks.contains('leiji')||
							sks.contains('releiji')||
							sks.contains('lingbo')){
							return 1;
						}
						if(ai.get.damageEffect(target,evt.player,target,evt.card.nature)>=0) return -1;
						return 1;
					});
					next.autochoose=lib.filter.autoRespondShan;
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
			type:'basic',
			subtype:'defense',
			ai:{
				basic:{
					useful:[7,2],
					value:[7,2]
				}
			}
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
		guohe:{
			audio:true,
			fullskin:true,
			type:'trick',
			subtype:'disrupt',
			enable:true,
			selectTarget:1,
			postAi:function(targets){
				return targets.length==1&&targets[0].num('j');
			},
			filterTarget:function(card,player,target){
				if(player==target) return false;
				return (target.num('hej')>0) ;
				//&& get.distance(player,target,'attack')<=1;
			},
			content:function(){
				if(target.num('hej')){
					player.discardPlayerCard('hej',target,true);
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
		shunshou:{
			audio:true,
			fullskin:true,
			type:'trick',
			subtype:'disrupt',
			enable:true,
			range:{global:1},
			selectTarget:1,
			postAi:function(targets){
				return targets.length==1&&targets[0].num('j');
			},
			filterTarget:function(card,player,target){
				if(player==target) return false;
				return (target.num('hej')>0);
			},
			content:function(){
				if(target.num('hej')){
					player.gainPlayerCard('hej',target,true);
				}
			},
			ai:{
				wuxie:function(target,card,player,viewer){
					if(ai.get.attitude(viewer,player)>0&&ai.get.attitude(viewer,target)>0){
						return 0;
					}
				},
				basic:{
					order:7.5,
					useful:4,
					value:9
				},
				result:{
					target:function(player,target){
						if(ai.get.attitude(player,target)<=0) return (target.num('he')>0)?-1.5:1.5;
						var js=target.get('j');
						if(js.length){
							var jj=js[0].viewAs?{name:js[0].viewAs}:js[0];
							if(jj.name=='shunshou') return 3;
							if(js.length==1&&ai.get.effect(target,jj,target,player)>=0){
								return -1.5;
							}
							return 3;
						}
						return -1.5;
					},
					player:function(player,target){
						if(ai.get.attitude(player,target)<0&&!target.num('he')){
							return 0;
						}
						if(ai.get.attitude(player,target)>1){
							var js=target.get('j');
							if(js.length){
								var jj=js[0].viewAs?{name:js[0].viewAs}:js[0];
								if(jj.name=='shunshou') return 1;
								if(js.length==1&&ai.get.effect(target,jj,target,player)>=0){
									return 0;
								}
								return 1;
							}
							return 0;
						}
						return 1;
					}
				},
				tag:{
					loseCard:1,
					gain:1,
				}
			}
		},
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
				target.draw();
				target.chooseCardTarget({
					selectCard:1,
					filterTarget:function(card,player,target){
						return player != target;
					},
					ai2:function(target){
						return ai.get.attitude(_status.event.player,target);
					},
					prompt:'请选择要送人的卡牌'
				});
				if(result.targets&&result.targets[0]){
					result.targets[0].gain(result.cards);
					target.$give(result.cards.length,result.targets[0]);
				}
			},
		},
		wuzhong:{
			audio:true,
			fullskin:true,
			type:'trick',
			subtype:'support',
			enable:true,
			selectTarget:-1,
			filterTarget:function(card,player,target){
				return target==player;
			},
			modTarget:true,
			content:function(){
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
		// 还没弄完……
		caifang:{
			audio:true,
			fullskin:true,
			type:'trick',
			type:'disrupt',
			enable:true,
			chongzhu:true,
			filterTarget:function(card,player,target){
				if(player==target) return false;
				return (target.get('h').length||
					target.classList.contains('unseen')||
					target.classList.contains('unseen2'))
			},
			content:function(){
				"step 0"
				if(!player.storage.zhibi){
					player.storage.zhibi=[];
				}
				player.storage.zhibi.add(target);
				var controls=[];
				if(target.get('h').length) controls.push('手牌');
				if(target.classList.contains('unseen')) controls.push('主将');
				if(target.classList.contains('unseen2')) controls.push('副将');
				if(controls.length>1){
					target.chooseControl(controls);
				}
				if(controls.length==0) event.finish();
				"step 1"
				var content;
				var str=get.translation(target)+'的';
				if(result.control){
					if(result.control=='手牌') content=[str+'手牌',target.get('h')];
					else if(result.control=='主将') content=[str+'主将',[[target.name1],'character']];
					else content=[str+'副将',[[target.name2],'character']];
				}
				else if(target.get('h').length){
					content=[str+'手牌',target.get('h')];
				}
				else if(target.classList.contains('unseen')){
					content=[str+'主将',[[target.name1],'character']];
				}
				else{
					content=[str+'副将',[[target.name2],'character']];
				}
				player.chooseControl('ok').set('dialog',content);
			},
			ai:{
				order:9.5,
				wuxie:function(){
					return 0;
				},
				result:{
					player:function(player,target){
						if(player.num('h')<=player.hp) return 0;
						if(player.storage.zhibi&&player.storage.zhibi.contains(target)) return 0;
						return target.isUnseen()?1:0;
					}
				}
			}
		},
		danmakucraze:{
			audio:true,
			fullskin:true,
			type:'trick',
			subtype:'support',
			enable:true,
			selectTarget:-1,
			filterTarget:function(card,player,target){
				return target==player;
			},
			modTarget:true,
			content:function(){
				target.draw(1);
				target.addTempSkill('paoxiao','phaseAfter');
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
					draw:1
				}
			}
		},
		saiqianxiang:{
			fullskin:true,
			type:'equip',
			subtype:'equip5',
			ai:{
				basic:{
					equipValue:8
				}
			},
			skills:['saiqian_skill']
		},
		yinyangyu:{
			fullskin:true,
			type:'equip',
			subtype:'equip2',
			ai:{
				basic:{
					equipValue:8
				}
			},
			skills:['yinyangyu_skill']
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
					equipValue:2
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
					equipValue:2
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
					equipValue:2
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
					equipValue:2
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
		deathfan:{
			fullskin:true,
			type:'equip',
			subtype:'equip1',
			ai:{
				basic:{
					equipValue:2
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
					equipValue:2
				}
			},
			skills:['zhiyuu_skill']
		},
		book:{
			fullskin:true,
			type:'equip',
			subtype:'equip4',
			ai:{
				basic:{
					equipValue:2
				}
			},
			skills:['book_skill']
		},
		frog:{
			fullskin:true,
			type:'equip',
			subtype:'equip4',
			filterTarget:function(card,player,target){
				return true;
			},
			content:function(){
				target.damage(2,'thunder');
				target.equip(event.card);
			},
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
			subtype:'equip4',
			ai:{
				basic:{
					equipValue:2
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
					equipValue:2
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
					equipValue:2
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
					equipValue:2
				}
			},
			skills:['hourai_skill']
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
			usable:1,
			forceaudio:true,
			prompt:'请选择要供奉的牌',
			content:function(){
				target.gain(cards);
			},
			ai:{
				expose:0.3,
				order:10,
				result:{
					target:5
				}
			}
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
				return event.card.name=='sha' && event.nature != 'thunder';
			},
			content:function(){
				trigger.player.damage('thunder');
			}
		},
		yinyangyu_skill:{
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
		laevatein_skill:{
			mod:{
				cardUsable:function(card,player,num){
					if(card.name=='sha'){
						return num+20;
					}
				},
			},
			trigger:{player:'shaBefore'},
			forced:true,
			popup:false,
			check:function(event,player){
				return player.num('h','sha')>0;
			},
			filter:function(event,player){
				return _status.currentPhase==player;
			},
			content:function(){
				var target=trigger.target;
				if(target.hasSkill('laevatein3')){
					target.storage.laevatein++;
				}
				else{
					target.storage.laevatein=1;
					target.addTempSkill('laevatein3','phaseUseEnd');
				}
			}
		},
		laevatein3:{
			mod:{
				targetEnabled:function(card,player,target){
					if(card.name!='sha') return;
					if(player==_status.currentPhase&&player.get('s').contains('laevatein')){
						var num=game.checkMod(card,player,1,'cardUsable',player.get('s'))-20;
						for(var i=0;i<game.players.length;i++){
							if(game.players[i].hasSkill('laevatein3')){
								num+=1-game.players[i].storage.laevatein;
							}
						}
						return num>1;
					}
				}
			}
		},
		windfan_skill:{
			audio:true,
			enable:['chooseToRespond','chooseToUse'],
			filterCard:function(card){
				return get.color(card)=='black';
			},
			position:'he',
			viewAs:{name:'sha'},
			viewAsFilter:function(player){
				if(!player.num('he',{color:'black'})) return false;
			},
			prompt:'将一张红色牌当杀使用或打出',
			check:function(card){return 4-ai.get.value(card)},
			ai:{
				skillTagFilter:function(player){
					if(!player.num('he',{color:'black'})) return false;
				},
				respondSha:true,
			}
		},
		gungnir_skill:{
			audio:true,
			trigger:{player:'shaBegin'},
			check:function(event,player){
				return ai.get.attitude(player,event.target)<=0;
			},
			content:function(){
				"step 0"
				for (var i = 0; i <= player.num('e'); i ++){
					var card=player.get('e',i);
					if(card&&card.name == ('gungnir')){
						player.discard(card);
						break;
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
				effect:function(card,player){
					if(get.tag(card,'damage')){
						if(player.hasSkill('jueqing')) return [1,1];
						return 1.2;
					}
					if(get.tag(card,'loseHp')){
						if(player.hp<=1) return;
						return [0,0];
					}
				}
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
		zhiyuu_skill:{
			audio:true,
			fullskin:true,
			type:'trick',
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
			}
		},
		book_skill:{
			audio:2,
			trigger:{player:'phaseBegin'},
			frequent:true,
			content:function(){
				player.gainlili();
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
			audio:3,
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
				trigger.player.chooseToDiscard(1).set('ai',function(card){
					if(_status.event.eff>0){
						return 10-ai.get.value(card);
					}
					return 0;
				}).set('eff',eff);
				"step 1"
				if(result.bool==false){
					trigger.finish();
					trigger.untrigger();
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
				for (var i = 0; i <= player.num('e'); i ++){
					var card = player.get('e',i);
					if ((card) && (card.name == 'hourai')){
						player.gain(card);
						break;
					}
				}
				trigger.untrigger();
				trigger.finish();
			},
		},
		_wuxie:{
			trigger:{player:['useCardToBefore','phaseJudge']},
			priority:5,
			popup:false,
			forced:true,
			filter:function(event,player){
				if(event.name!='phaseJudge'){
					if(!event.target) return false;
					if(event.player.hasSkillTag('playernowuxie')) return false;
					if (event.target == event.source) return false;
					if(get.type(event.card)!='trick'&&!get.info(event.card).wuxieable) return false;
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
					str+='将'+(state>0?'生效':'失效')+'，是否无懈？';

					if(player.isUnderControl(true)&&!_status.auto&&!ui.tempnowuxie&&tempnowuxie){
						var translation=get.translation(card.name);
						if(translation.length>=4){
							translation=lib.translate[card.name+'_ab']||translation.slice(0,2);
						}
						ui.tempnowuxie=ui.create.control('不无懈'+translation,ui.click.tempnowuxie);
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
	},
	translate:{
		sha:'轰！',
		sha_info:'出牌阶段，对攻击范围内的一名角色使用；对目标造成1点弹幕伤害。',
		huosha:'',
		leisha:'',
		shan:'没中',
		shan_info:'你成为【轰！】的目标后，对那张牌使用；该牌对你无效。',
		tao:'葱',
		tao_info:'出牌阶段，对你使用；或角色处于决死状态时，对其使用；目标回复1点体力。',
		reidaisai:'例大祭',
		reidaisai_info:'出牌阶段，对所有角色使用。目标各摸一张牌，然后各可以交给一名角色一张牌。',
		danmakucraze:'弹幕狂欢',
		danmakucraze_info:'出牌阶段，对你使用。目标摸一张牌，且使用【轰！】不限次数，直到结束阶段。',
		wuzhong:'灵光一闪',
		wuzhong_bg:'生',
		wuzhong_info:'出牌阶段，对你使用。目标摸两张牌。',
		juedou:'决斗',
		juedou_info:'出牌阶段，对一名其他角色使用。由其开始，其与你轮流打出一张【轰！】，直到其中一方未打出【轰！】为止。未打出【轰！】的一方受到另一方对其造成的1点弹幕伤害。',
		juedou_bg:'斗',
		shunshou:'顺手牵羊',
		shunshou_info:'出牌阶段，对区域里有牌的一名其他角色使用。你获得其区域里的一张牌。',
		guohe:'疾风骤雨',
		guohe_bg:'拆',
		guohe_info:'出牌阶段，对攻击范围内的一名其他角色使用。你弃置其区域里的一张牌。',
		wuxie:'魔法障壁',
		wuxie_bg:'懈',
		wuxie_info:'一名角色指定其以外的角色为法术牌的目标后，对此牌使用。抵消此牌对一名角色产生的效果',
		penglaiyao:'蓬莱秘药',
		penglaiyao_info:'锁定技，若你的灵力值大于2，此牌不能离开装备区；结束阶段，你失去2点灵力。',
		pantsu:'蓝白胖次',
		pantsu_info:'锁定技，其他角色不能弃置或获得你的此牌以外的牌。',
		laevatein:'莱瓦丁',
		laevatein_info:'锁定技，出牌阶段，你对每名角色使用的第一张【轰！】不算次数。',
		gungnir:'冈格尼尔',
		gungnir_skill:'冈格尼尔',
		gungnir_info:'你使用【轰！】指定目标后，可以弃置此牌，令目标不能对该【轰！】使用牌。',
		louguan:'楼观剑',
		louguan_info:'锁定技，你使用【轰！】指定目标后，该角色的装备技能无效，直到该牌结算完毕。',
		ibuki:'伊吹瓢',
		ibuki_skill:'伊吹瓢',
		ibuki_info:'一回合一次，出牌阶段，你可以弃置一张攻击牌，然后获得1点灵力。',
		deathfan:'凤蝶纹扇',
		deathfan_skill:'凤蝶纹扇',
		deathfan_info:'一回合一次，出牌阶段，你可以弃置一张防御牌，然后对至多2名角色各造成1点灵击伤害。',
		windfan:'风神团扇',
		windfan_skill:'风神团扇',
		windfan_info:'你可以将一张黑色牌当做【轰！】使用/打出',
		saiqianxiang:'赛钱箱',
		saiqian_skill2:'赛钱箱',
		saiqianxiang_info:'一回合一次，其他角色的出牌阶段，其可以交给你一张牌。',
		yinyangyu:'阴阳玉',
		yinyangyu_skill:'阴阳玉',
		yinyangyu_info:'你可以将一张红色牌当做【没中】使用/打出。',
		zhiyuu:'净颇梨之镜',
		zhiyuu_skill:'净颇梨之镜',
		zhiyuu_info:'一回合一次，出牌阶段，你可以令一名角色展示一张手牌；然后你可以弃置一张与展示的牌相同花色的手牌，对其造成1点灵击伤害。',
		mirror:'八咫镜',
		mirror_skill:'八咫镜',
		mirror_info:'你成为攻击牌的目标后，可以判定：若颜色相同，令之对你无效。',
		ryuuuu:'龙宫羽衣',
		ryuuuu_info:'锁定技，你受到灵击伤害时，防止该伤害；你受到伤害后，对伤害来源造成1点灵击伤害。',
		feixiang:'绯想之剑',
		feixiang_info:'锁定技，你使用攻击牌时，获得1点灵力。',
		bailou:'白楼剑',
		bailou_info:'锁定技，你使用攻击牌造成弹幕伤害后，对受伤角色造成1点灵击伤害。',
		book:'魔导书',
		book_info:'锁定技，准备阶段，你获得1点灵力。',
		yuzhi:'蓬莱玉枝',
		yuzhi:'准备阶段，你可以观看牌堆顶的一张牌，然后可以弃置之。',
		hourai:'替身人形',
		hourai_skill:'替身人形',
		hourai_info:'你成为攻击牌的目标后，可以收回装备区中的此牌，令该牌对你无效。',
		frog:'冰镇青蛙',
		frog_info:'你使用这张牌时，可以令一名其他角色失去2点灵力。',
		magatama:'八咫琼勾玉',
		magatama_skill:'解密',
		magatama_info:'一回合一次，出牌阶段，你可以观看一名角色的手牌。',
		lunadial:'月时针',
		lunadial_skill:'The World',
		lunadial_info:'一回合一次，出牌阶段，你可以消耗1点灵力，然后令一名其他角色不能使用或打出手牌，直到结束阶段。',
		kusanagi:'草薙剑',
		kusanagi_skill:'草薙剑',
		kusanagi_info:'你使用【轰！】指定目标后，若你的灵力大于目标，可以弃置其一张牌。',
		hakkero:'八卦炉',
		hakkero_skill:'八卦炉',
		hakkero_info:'出牌阶段，你可以消耗1点灵力，视为使用一张【轰！】',
		lantern:'人魂灯',
		lantern_info:'锁定技，你成为【轰！】的目标后，若来源在你攻击范围内，其选择一项：弃置一张牌，或令该【轰！】对你无效。',
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
		["spade",12,'guohe'],
		["club",3,'guohe'],
		["club",4,'guohe'],
		["spade",9,'wuxie'],
		["spade",11,'wuxie'],
		["spade",12,'wuxie'],
		["club",7,'wuxie'],
		["club",12,'wuxie'],
		["heart",1,'reidaisai'],
		["heart",6,'reidaisai'],
		["club",13,'danmakucraze'],
		["spade",13,'danmakucraze'],
		["diamond",1,'deathfan'],
		["spade",1,'windfan',"",1],
		["club",1,'penglaiyao',"",3],
		["heart",1,'lunadial',"",1],
		["spade",2,'ibuki',"",1],
		["club",2,'hourai',"",-1],
		//["heart",3,'pantsu',"", 1],
		["diamond",5,'saiqianxiang',"",1],
		["heart",5,'yinyangyu',"",1],
		["spade",5,'hakkero',"",1],
		["club",5,'lantern',"",-1],
		["club",6,'bailou',"",-1],
		["spade",6,'louguan',"",1],
		["spade",8,'magatama',"",-1],
		["club",8,'mirror'],
		["club",9,'frog'],
		["spade",11,'book'],
		//["heart",12,'yuzhi',"",1],
		["spade",13,'kusanagi',"",1],
		["heart",13,'laevatein',"",2],
		["diamond",13,'gungnir',"",2],
		["club",13,'zhiyuu',"",1],
	],
}
