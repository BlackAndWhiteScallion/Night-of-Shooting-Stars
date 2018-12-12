'use strict';
game.import('character',function(lib,game,ui,get,ai,_status){
	return {
		name:'imperishable',
		connect:true,
		character:{
			wriggle:['female','4',3,['yingguang','yechong']],
                  mystia:['female','4',3,[]],
                  keine:['female','3',4,['jiehuo','richuguo']],
                  reimu:['female','2',3,['yinyang','mengdie','mengxiang']],
                  marisa:['female','2',3,[]],
                  tewi:['female','3',3,[]],
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
                        audio:4,
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
                              player.loselili();
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
                              return get.value(event.card) >= 5;
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
                            check:function(event, player){
                              return player.hp < 2;
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
                        group:['yinyang2'],
                        audio:2,
                        trigger:{global:'phaseEnd'},
                        frequent:true,
                        filter:function(event,player){
                              return player.storage.yinyang;
                        },
                        check:function(event,player){
                              if (player.getCards('h').length <= (player.maxHp - player.hp) && event.player.getCards('hej').length) return get.attitude(_status.event.player,trigger.target)<0;
                              return true;
                        },
                        content:function(){
                              'step 0'
                              var controls=['draw_card'];
                              if(trigger.player.countCards('hej')){
                                    controls.push('spin_card');
                              }
                              player.chooseControl(controls).set('ai',function(){
                                    var trigger=_status.event.getTrigger();
                                    if(trigger.player.countCards('hej')&&get.attitude(_status.event.player,trigger.target)<0){
                                          return 'spin_card';
                                    }
                                    else{
                                          return 'draw_card';
                                    }
                              }).set('prompt',get.prompt('yinyang'));
                              "step 1"
                              if(result.control=='draw_card'){
                                    player.draw();
                              }
                              else if(result.control=='spin_card'&&trigger.player.countCards('he')){
                                    //player.discardPlayerCard(trigger.target,'he',true).logSkill=['moukui',trigger.target];
                                    player.choosePlayerCard(trigger.player,'hej', 1 ,get.prompt('yinyang',trigger.player));
                              }
                              'step 2'
                              if (result.bool&&result.links.length){
                                    trigger.player.showCards(result.links[0]);
                                    if (get.type(result.links[0]) == 'delay'){
                                      ui.skillPile.appendChild(result.links[0]);
                                    } else {
                                      ui.cardPile.appendChild(result.links[0]);
                                      if (!player.storage.bot) player.storage.bot = result.links[0];
                                      else player.storage.bot.insertBefore(result.links[0]); 
                                    }
                                    trigger.player.lose(result.links[0]);
                              }
                              player.storage.yinyang = false;
                        },
                  },
                  yinyang2:{
                        trigger:{player:['damageEnd','useCard']},
                        direct:true,
                        popup:false,
                        filter:function(event,player){
                              if (event.name == 'damage'){
                                    return event.nature != 'thunder';
                              }
                              return true;
                        },
                        content:function(){
                            player.storage.yinyang = true;
                        },
                  },
                  mengdie:{
                      skillAnimation:true,
                      audio:2,
                      unique:true,
                      priority:-10,
                      derivation:'huanjing',
                      trigger:{player:'phaseBeginStart'},
                      forced:true,
                      filter:function(event,player){
                        if(player.storage.mengdie) return false;
                        return player.countCards('h')<=(player.maxHp-player.hp);
                      },
                      content:function(){
                        "step 0"
                        player.awakenSkill('mengdie');
                        player.gainlili(player.maxlili-player.lili);
                        "step 1"
                        player.storage.mengdie=true;
                        player.update();
                        player.addSkill('huanjing');
                      }
                  },
                  mengxiang:{
                      audio:2,
                      cost:2,
                      spell:['mengxiang1'],
                      trigger:{player:['phaseBegin']},
                      filter:function(event,player){
                          return player.lili > lib.skill.mengxiang.cost;
                      },
                      content:function(){
                          player.loselili(lib.skill.mengxiang.cost);
                          player.turnOver();
                      },
                  },
                  mengxiang1:{
                    trigger:{player:'useCardtoBegin'},
                    filter:true,
                    content:function(){
                      'step 0'
                      var list = [];
                      if (trigger.target.storage._tanpai){
                          list.push('damage & discard');
                      } else {
                        if (trigger.target.countCards('hej')){
                          list.push('discard');
                        }
                        list.push('lilidamage');
                      }
                      trigger.target.chooseControl(list).set('prompt',get.prompt('mengxiang'));
                      'step 1'
                      if (result.control != 'lilidamage'){
                        if (trigger.target.countCards('hej')){
                          player.chooseToDiscard(true,'hej');
                        }
                      }
                      if (result.control != 'discard'){
                        trigger.target.damage('thunder');
                      }
                    }
                  },
            },
            translate:{
                  wriggle:'莉格露',
                  yingguang:'萤光',
                  yingguang_audio1:'一闪一闪亮晶晶~♬',
                  yingguang_audio2:'满天都是小星星~♩',
                  yingguang_audio3:'挂在天上放光明~♬',
                  yingguang_audio4:'好像许多小眼睛~♩',
                  yingguang_info:'一回合一次，你使用牌后，可以展示技能牌堆顶一张牌，然后将之交给一名角色。',
                  yechong:'夜虫风暴',
                  yechong_info:'符卡技（2）无视【萤光】中的“一回合一次”；结束阶段，你弃置所有角色各一张牌；然后，对所有以此法失去技能牌，且牌数不小于你的角色造成1点灵击伤害。',
                  yechong_audio1:'蠢符「夜虫风暴」~',
                  yechong_audio2:'那么，用星星把你淹死吧？',
                  wriggle_die:'用杀虫剂是犯规啦！',
                  keine:'慧音',
                  jiehuo:'解惑',
                  jiehuo_info:'一回合一次，一名角色的出牌阶段，一张牌因你使用/打出进入弃牌堆时，可以消耗1点灵力，令一名角色获得之。',
                  jiehuo_audio1:'这是这张牌的正确使用方式，知道了吗？',
                  jiehuo_audio2:'这是下次考试的知识点，一定要记住。',
                  richuguo:'日出国的天子',
                  richuguo_info:'符卡技（3）【限定】【永续】你可以弃置三张不同的类型的牌来代替符卡消耗；准备阶段，你可以指定一名角色，重置其体力值，灵力值，和手牌数；你进入决死状态时，重置此符卡技。',
                  richuguo_audio1:'「日出国之天子」！',
                  richuguo_audio2:'我不允许这种事情的存在！',
                  keine_die:'要是是满月，怎么会输给你们呢……',
                  reimu:'灵梦',
                  yinyang:'阴阳',
                  yinyang_audio1:'',
                  yinyang_audio2:'',
                  spin_card:'将当前角色一张牌置入牌堆底',
                  yinyang_info:'一名角色的结束阶段，若你本回合使用过牌，或受到过弹幕伤害，你可以选择一项：摸一张牌；或展示当前回合角色的一张牌，并将之置于牌堆底。',
                  mengdie:'梦蝶',
                  mengdie_audio1:'',
                  mengdie_audio2:'',
                  mengdie_info:'觉醒技，准备阶段，若你的手牌数不大于你已受伤值，你将灵力值补至上限，并获得〖幻境〗',
                  mengxiang:'梦想封印',
                  mengxiang_info:'符卡技（2）【永续】你使用牌指定目标后，可以选择一项：令目标角色：受到1点灵击伤害；或弃置一张牌；若其有明置异变牌，改为选择两项。',
                  mengxiang_audio1:'灵符「梦想封印」！',
                  mengxiang_audio2:'以博丽巫女之名，我会退治你这个异变！',
                  reimu_die:'',
            },
      };
});