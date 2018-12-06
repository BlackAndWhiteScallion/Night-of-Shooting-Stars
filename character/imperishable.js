'use strict';
game.import('character',function(lib,game,ui,get,ai,_status){
	return {
		name:'imperishable',
		connect:true,
		character:{
			wriggle:['female','4',3,['yingguang','yechong']],
                  mystia:['female','4',3,[]],
                  keine:['female','3',4,['jiehuo','richuguo']],
                  reimu:['female','2',3,[]],
                  marisa:['female','2',3,[]],
                  twi:['female','3',3,[]],
                  reisen:['female','2',4,[]],
                  eirin:['female','1',3,[]],
                  kaguya:['female','1',3,[]],
                  mokou:['female','1',4,[]],
		},
		characterIntro:{
			letty:'',
		},       
		perfectPair:{
		},
            skill:{
                  yingguang:{
                        audio:2,
                        trigger:{player:'useCard'},
                        frequent:true,
                        filter:function(event, player){
                              if (player.hasSkill('yechong1')) return true;
                              //if (player.getStat().skill.yingguang>=1) return false;
                              //if (player.getStat('skill')['yingguang'] >= 1) return false;
                              //if (get.skillCount('yingguang') >= 1) return false;
                              return true;
                        },
                        content:function(){
                              "step 0"
                              //game.log(get.skillCount('yingguang'));
                              //event.card=get.cards()[0];
                              event.card = ui.skillPile.childNodes[0];
                              //event.card = ui.skillPile.removeChild(ui.skillPile.firstChild);
                              game.broadcast(function(card){
                                    ui.arena.classList.add('thrownhighlight');
                                    card.copy('thrown','center','thrownhighlight',ui.arena).animate('start');
                              },event.card);
                              event.node=event.card.copy('thrown','center','thrownhighlight',ui.arena).animate('start');
                              ui.arena.classList.add('thrownhighlight');
                              game.addVideo('thrownhighlight1');
                              game.addVideo('centernode',null,get.cardInfo(event.card));
                              player.chooseTarget('选择获得此牌的角色',true).set('ai',function(target){
                                    var att=get.attitude(_status.event.player,target);
                                    if (target.countCards('j') > 2 && att > 0) att = 0; 
                                    return att;
                              });
                              game.delay(2);
                              "step 1"
                              if(result.targets){
                                    player.line(result.targets,'green');
                                    result.targets[0].gain(event.card,'log');
                                    event.node.moveDelete(result.targets[0]);
                                    game.addVideo('gain2',result.targets[0],[get.cardInfo(event.node)]);
                                    game.broadcast(function(card,target){
                                          ui.arena.classList.remove('thrownhighlight');
                                          if(card.clone){
                                                card.clone.moveDelete(target);
                                          }
                                    },event.card,result.targets[0]);
                              }
                              game.addVideo('thrownhighlight2');
                              ui.arena.classList.remove('thrownhighlight');
                              if (!player.hasSkill('yechong1')) player.addTempSkill('fengyin');
                        },
                        ai:{
                              threaten:1.4,
                              noautowuxie:true,
                        }
                  },
                  yechong:{
                      audio:2,
                      cost:2,
                      spell:['yechong1'],
                      trigger:{player:['phaseBegin']},
                      filter:function(event,player){
                          return player.lili > lib.skill.yechong.cost;
                      },
                      content:function(){
                          player.loselili(lib.skill.yechong.cost);
                          player.turnOver();
                      },
                  },
                  yechong1:{
                        audio:2,
                        forced:true,
                        trigger:{player:'phaseEnd'},
                        content:function(){
                              "step 0"
                              var targets=game.filterPlayer();
                              targets.remove(player);
                              targets.sort(lib.sort.seat);
                              event.targets=targets;
                              "step 1"
                              event.num=0;
                              player.line(targets,'green');
                              "step 2"
                              if(event.num<event.targets.length){
                                    if(event.targets[event.num].countCards('hej')){
                                          player.discardPlayerCard(event.targets[event.num],true);
                                    }
                              }
                              "step 3"
                              if (result.links && result.links.length){
                                    if (get.type(result.links[0]) == 'delay'){
                                          if (event.targets[event.num].countCards('hej') >= player.countCards('hej')){
                                                event.targets[event.num].damage('thunder');
                                          } 
                                    }
                              }
                              "step 4"
                              if (event.num < event.targets.length){
                                    event.num++;
                                    event.goto(2);
                              }
                        },
                  },
                  jiehuo:{
                        trigger:{player:'useCardAfter'},
                        usable:1,
                        audio:2,
                        filter:function(event,player){
                              return (get.position(event.card)=='d'&&get.itemtype(event.card)=='card'&&player.lili>0);
                        },
                        content:function(){
                              'step 0'
                               player.chooseTarget('将'+get.translation(trigger.card)+'交给一名角色',true,function(card,player,target){
                                    return true;
                                }).set('ai',function(target){
                                    if (get.bonus(trigger.card) > 0) return player;
                                    return get.attitude(_status.event.player,target);
                                });
                                'step 1'
                                if (result.targets){
                                    result.targets[0].gain(trigger.card);
                                    result.targets[0].$gain2(trigger.card);
                              }
                        },
                        check:function(event,player){
                              return get.value(event.card >= 5);
                        },
                  },
                  richuguo:{
                      audio:2,
                      cost:3,
                      spell:['yechong1','yechong2'],
                      trigger:{player:['phaseBegin']},
                        init:function(player){
                              player.storage.richuguo=true;
                        },
                        mark:true,
                        intro:{
                              content:'limited'
                        },
                            filter:function(event,player){
                              if (!player.storage.richuguo) return false;
                               var num = 0;
                               if (player.getCards('h',{type:'basic'})) num ++;
                               if (player.getCards('h',{type:'trick'})) num ++;
                               if (player.getCards('he',{type:'equip'})) num ++;
                               if (player.getCards('h'),{type:'jinji'}) num ++;
                                return (player.lili > lib.skill.richuguo.cost) || num >= 3;
                            },
                            content:function(){
                              'step 0'
                              player.chooseCard(3,'he',function(card){
                                    for (var i = 0; i < ui.selected.cards.length; i ++){
                                          if (get.type(card) == get.type(ui.selected.cards[i])) return false;
                                    }
                                    return true;
                              },'弃置3张不同种类的牌，或消耗3点灵力。');
                              'step 1'
                              if (result.cards){
                                    //player.$throw(result.cards);
                                    player.discard(result.cards);
                              } else {
                                player.loselili(lib.skill.richuguo.cost);
                              }
                              player.turnOver();
                              player.storage.richuguo=false;
                            },
                            check:function(){
                              return player.hp > 2;
                            }
                  },
                  richuguo1:{
                        trigger:{player:['phaseBegin']},
                        frequent:true,
                        content:function(){
                              'step 0'
                              player.chooseTarget(get.prompt('richuguo'),true,function(card,player,target){
                              }).ai=function(target){
                                    return 1;
                              }
                              'step 1'
                              if (result.targets){
                                    result.targets[0].hp = result.targets[0].maxhp;
                                    result.targets[0].lili = parseInt(lib.character[result.targets[0]][1])
                                    result.targets[0].draw(4-result.targets[0].getCards('h').length);
                              }
                        }
                  },
                  richuguo2:{
                        trigger:{player:'dying'},
                        forced:true,
                        content:function(){
                             player.storage.richuguo=true;
                             player.turnOver();
                        }
                  },
                  yinyang:{

                  },
                  mengdie:{

                  },
                  mengxiang:{

                  },
            },
            translate:{
                  wriggle:'莉格露',
                  yingguang:'萤光',
                  yingguang_info:'一回合一次，你使用牌后，可以展示技能牌堆顶一张牌，然后将之交给一名角色。',
                  yechong:'夜虫风暴',
                  yechong_info:'符卡技（2）无视【萤光】中的“一回合一次”；结束阶段，你弃置所有角色各一张牌；然后，对所有以此法失去技能牌，且牌数不小于你的角色造成1点灵击伤害。',
                  keine:'慧音',
                  jiehuo:'解惑',
                  jiehuo_info:'一回合一次，一名角色的出牌阶段，一张牌因你使用/打出进入弃牌堆时，可以消耗1点灵力，令一名角色获得之。',
                  richuguo:'日出国的天子',
                  richuguo_info:'符卡技（3）【限定】【永续】你可以弃置三张不同的类型的牌来代替符卡消耗；准备阶段，你可以指定一名角色，重置其体力值，灵力值，和手牌数；你进入决死状态时，重置此符卡技。',
            },
      };
});