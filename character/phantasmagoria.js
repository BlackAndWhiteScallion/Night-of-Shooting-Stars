'use strict';
game.import('character',function(lib,game,ui,get,ai,_status){
	return {
		name:'phantasmagoria',
		connect:true,
		character:{
			lilyblack:['female','1',3,['chunmian','bamiao']],
                  medicine:['female','1',3,['zaidu','zhanfang','huayuan']],
                  yuuka:['female','1',4,['zanghua','xiaofeng']],
                  komachi:['female','3',4,['guihang','wujian']],
                  eiki:['female','1',4,['huiwu','caijue','shenpan']],
		},
		characterIntro:{
			lilyblack:'似乎就是莉莉白换了身衣服？<br><b>画师：Cloudy.R</b>',
                  medicine:'全名梅蒂欣·梅兰可莉。被人类抛弃，受铃兰之毒多年后妖怪化的人偶。<br><b>画师：はるとき</b>',
                  yuuka:'全名风间幽香。太阳花园之主。虽然只是种花的，但是实际战力是顶尖级别，还是战狂性格。不过最近比较满足于种花和养老。<br><b>画师：萩原</b>',
                  komachi:'全名小野塚小町。负责将死者灵魂带入冥界的，冥河上摆渡的死神。虽然是至关重要的工作，但是因为太懒怠工疑似弄出了异变来。<br><b>画师：MAY☆嵐（G.H）</b>',
                  eiki:'全名四季映姬。幻想乡的裁判长/阎魔王。负责判断死者灵魂是转生还是进入地狱永劫不复。职业病非常非常非常严重。<br><b>画师：DomotoLain</b>',
		},       
		perfectPair:{
		},
            skill:{
                  chunmian:{
                      audio:2,
                      trigger:{player:'phaseBegin'},
                      filter:function(event,player){
                          return player.lili <= player.hp;
                      },
                      check:function(event,player){
                          return true;
                      },
                      content:function(){
                          "step 0"
                          event.current=player;
                          event.players=game.filterPlayer();
                          player.line(event.players,'black');
                          "step 1"
                          if (event.current.name == 'lilywhite') game.trySkillAudio('chunmian',player,true,3);
                          event.current.chooseTarget([1,1],true,'弃置与你最近的一名其他角色一张牌',function(card,player,target){
                              // 不能选玩家
                              if(player==target) return false;
                              // 不能选“有比他离你更近”的玩家
                              if (game.hasPlayer(function(current){
                                return current != player && get.distance(player,current)<get.distance(player,target);
                              })){
                                return false;
                              } else {
                                if (target.countCards('hej') || !game.hasPlayer(function(current){
                                  return current != player && get.distance(player,current) == get.distance(player,target) && target.countCards('hej')
                                })) return true;
                              }
                              return false;
                          }).set('ai',function(target){
                              if (-get.attitude(_status.event.player,target) && target.storage.chunmian) return 100;
                              return -get.attitude(_status.event.player,target);
                          }); 
                          "step 2"
                          if(result.bool){
                              event.current.line(result.targets,'black');
                              event.targets=result.targets;
                              if (event.targets[0].countCards('hej')){
                                event.current.discardPlayerCard(event.targets[0],'hej',[1,1],true);
                                event.targets[0].storage.chunmian = 1;
                              }
                          }
                          if(event.current.next!=player){
                              event.current=event.current.next;
                              game.delay(0.5);
                              event.goto(1);
                          }
                          "step 3"
                          var players = game.filterPlayer();
                          for (var i = 0; i < players.length; i ++){
                              if (players[i].storage.chunmian){
                                    players[i].draw();
                                    players[i].storage.chunmian = 0;
                              }
                          }
                      },
                  },
                  bamiao:{
                      audio:2,
                      enable:'phaseUse',
                      usable:2,
                      filter:function(event,player){
                          return !(player.lili == player.maxlili && player.num('hej') == 0);
                      },
                      content:function(){
                          var choice = [];
                          if (player.num('hej') != 0){
                              choice.push('消耗1点灵力，弃置一张牌');
                          }
                          if (player.lili != player.maxlili){
                              choice.push('获得1点灵力，摸一张牌');
                          }
                          'step 0'
                          player.chooseControl(choice).set('ai',function(){
                              if (player.lili < 5){
                                  return '获得1点灵力，摸一张牌'; 
                              } else {
                                  return '消耗1点灵力，弃置一张牌';
                              }
                              return '获得1点灵力，摸一张牌';
                          });
                          'step 1'
                          if (result.control == '获得1点灵力，摸一张牌'){
                              player.gainlili();
                              player.draw();
                          } else if (result.control == '消耗1点灵力，弃置一张牌') {
                              player.chooseToDiscard(1,true,'hej');
                              player.loselili();
                          }
                      },
                      ai:{
                          order:8,
                          result:{
                              player:function(player,target){
                                  return 1;
                              }
                          }
                      }
                  },
                  zaidu:{
                        group:['zaidu2'],
                        audio:0,
                        trigger:{player:'phaseEnd'},
                        content:function(){
                           'step 0'
                           var prompt = '令一名灵力不大于你的角色受到1点灵击伤害';
                           if (player.storage.zaidu == 'heal') prompt = '令一名灵力不大于你的角色回复1点体力';
                           if (player.storage.zaidu == 'damage') prompt = '令一名灵力不大于你的角色受到1点弹幕伤害';
                           player.chooseTarget(prompt,function(card,player,target){
                              return target.lili <= player.lili;
                              }).set('ai',function(target){
                                    if (!player.storage.zaidu || player.storage.zaidu != 'heal') return -get.attitude(player,target);
                                    else return get.attitude(player,target);
                              });
                              "step 1"
                              if(result.bool){
                                  player.line(result.targets[0]);
                                    if (!player.storage.zaidu){
                                         result.targets[0].damage('thunder');
                                         game.trySkillAudio('zaidu',player,true,1);
                                    } else if (player.storage.zaidu == 'heal'){
                                         result.targets[0].recover(); 
                                         game.trySkillAudio('zaidu',player,true,2);
                                    } else if (player.storage.zaidu == 'damage'){ 
                                          result.targets[0].damage();
                                          game.trySkillAudio('zaidu',player,true,3);
                                    }
                              }   
                        },
                        intro:{
                              content:function(storage){
                                    if (!storage) return null;
                                    if (storage == 'heal') return '【灾毒】：回复1点体力';
                                    if (storage == 'damage') return '【灾毒】：造成1点弹幕伤害';
                              }
                        },
                        check:function(){
                          return true;
                        },
                        ai:{
                              threaten:1.5,
                        },
                  },
                  zaidu2:{
                        audio:2,
                        forced:true,
                        trigger:{player:'recoverAfter',source:'damageEnd'},
                        filter:function(event,player){
                              if (event.name == 'damage') return event.nature != 'thunder';
                              return true;
                        },   
                        content:function(){
                              player.gainlili();
                        },
                  },
                  zhanfang:{
                        skillAnimation:true,
                        audio:2,
                        unique:true,
                        priority:-10,
                        trigger:{player:'phaseBegin'},
                        forced:true,
                        filter:function(event,player){
                              return player.lili == player.maxlili;
                        },
                        content:function(){
                              "step 0"
                              player.awakenSkill('zhanfang');
                              if (player.hp == player.maxHp) {
                                    player.storage.zaidu = 'damage';
                                    lib.translate['zaidu_info'] = '结束阶段，你可以指定一名灵力不大于你的角色，令其受到1点弹幕伤害；你造成弹幕伤害后，或回复体力后，你获得1点灵力。';
                                    game.trySkillAudio('zhanfang',player,true,1);
                              } else {
                                    player.storage.zaidu = 'heal';
                                    lib.translate['zaidu_info'] = '结束阶段，你可以指定一名灵力不大于你的角色，令其回复1点体力；你造成弹幕伤害后，或回复体力后，你获得1点灵力。';
                                    game.trySkillAudio('zhanfang',player,true,2);
                              }
                              player.markSkill('zaidu');
                              player.syncStorage('zaidu');
                              player.gainMaxHp();
                              player.useSkill('huayuan');
                              player.removeSkill('zhanfang');
                              player.update();
                        }
                  },
                  huayuan:{
                        audio:2,
                        cost:2,
                        spell:['huayuan_1', 'huayuan_2'],
                        trigger:{player:['phaseBegin']},
                        roundi:function(event,player){
                              return player.isMaxHp(true);
                        },
                        filter:function(event,player){
                              return player.lili > lib.skill.huayuan.cost;
                        },
                        content:function(){
                              player.loselili(lib.skill.huayuan.cost);
                              player.turnOver();
                        },
                        check:function(event,player){
                          if (!player.storage.zaidu) return false;
                          return player.lili > 3;
                        },
                  },
                  huayuan_1:{
                        audio:2,
                        trigger:{global:'recoverBegin'},
                        usable:1,
                        content:function(){
                              'step 0'
                              player.chooseControl('令回复量-1','令回复量+1',function(event,player){
                                    if (get.attitude(player, event.player) > 0 && event.player.hp + 1 < event.player.maxHp) return '令回复量+1';
                                    return '令回复量-1';
                              });
                              'step 1'
                              if (result.control == '令回复量-1'){
                                    game.log(player,'令',trigger.player,'回复体力量-1');
                                    trigger.num--;
                              } else {
                                    game.log(player,'令',trigger.player,'回复体力量+1');
                                    trigger.num++;
                              }
                        }
                  },
                  huayuan_2:{
                        audio:2,
                        forced:true,
                        trigger:{global:['recoverAfter','damageEnd']},
                        filter:function(event,player){
                              return (event.player.hp == 0 || event.player.hp == event.player.maxHp);
                        },
                        content:function(){
                              player.draw();
                        },
                  },
                  zanghua_boom:{
                  },
            	zanghua:{
            		audio:2,
            		enable:'phaseUse',
            		filter:function(event, player){
            			return player.getCards('h') && !player.hasSkill('zanghua_boom');
            		},
            		filterTarget:function(card,player,target){
      						return player!=target&&target.countCards('h')>0;
      					},
            		content:function(){
            			"step 0"
                              player.chooseToCompare(target);
                              if (target.name == 'marisa') game.trySkillAudio('zanghua',target,true,3);
                              if (target.name == 'alice') game.trySkillAudio('zanghua', target, true, 4);
                              "step 1"
                              if (!result.tie){
                                    if(result.bool){
                                          if (player.canUse('juedou',target)) player.useCard({name:'juedou'},target);
                                    } else {
                                          if (target.canUse('juedou',player)) target.useCard({name:'juedou'},player);
                              }
                              } else {
                                    player.addTempSkill('zanghua_boom');
                              }
                              "step 2"
                              if (target.hp < player.hp) player.addTempSkill('zanghua_boom');
                        },
                        ai:{
                              result:{
                                    target:function(player,target){
                                          var hs=player.getCards('h');
                                          if(hs.length<3) return 0;
                                          var bool=false;
                                          for(var i=0;i<hs.length;i++){
                                          if(get.number(hs[i])>=9&&get.value(hs[i])<7){
                                          bool=true;
                                          break;
                                          }
                                          }
                                          if(!bool) return 0;
                                          if(target.countCards < hs.length) return -2; 
                                          return -0.5;
                                    }
                              },
                              order:7,
                        }
            	},
            	xiaofeng:{
                        audio:2,
                        cost:4,
                        spell:['xiaofeng1','xiaofeng2'],
                        trigger:{player:['phaseBegin']},
                        filter:function(event,player){
                          if (player.hp == 1) return player.lili > (lib.skill.xiaofeng.cost - 2)
                          return player.lili > lib.skill.xiaofeng.cost;
                        },
                        content:function(){
                          if (player.hp == 1) player.loselili(lib.skill.xiaofeng.cost - 2);
                          else player.loselili(lib.skill.xiaofeng.cost);
                          player.turnOver();
                          player.useCard({name:'huazhi'},player);
                        },
                        check:function(event,player){
                              return player.countCards('h') > 3 || player.countCards('hej', function(card){
                                    return get.tag(card, 'damage');
                              }) > 1;
                        },
                        ai:{
                              damage:1,
                        },
            	},
                  xiaofeng1:{
                        forced:true,
                        trigger:{source:'damageBegin'},
                        content:function(){
                              trigger.num++;
                        }
                  },
                  xiaofeng2:{
                        mod:{
                              attackFrom:function(){
                                    return -Infinity;
                              },
                              number:function(card,number){
                                    return 12;
                              }
                        },
                  },
                  guihang:{
                        group:['guihang_cost'],
                        audio:2,
                        enable:['phaseUse'],
                        mod:{
                              targetInRange:function(card){
                                    if(_status.event.skill=='guihang') return true;
                              },
                              /*
                              cardUsable:function(card,player,num){
						if(card.name=='sha' && !game.hasPlayer(function(current){
                                          return current.hasSkill('guihang_flag');
                                    })) return num + 1;
					},*/
                        },
                        filter:function(event,player){
                          return !game.hasPlayer(function(current){
                                return current.hasSkill('guihang_flag');
                          });
                        },
                        filterCard:function(card,player){
                              return true;
                        },
                        position:'he',
                        viewAs:{name:'sha'},
                        viewAsFilter:function(player){
                              if (!player.countCards('he')) return false;
                              return player.lili > 0;
                        },
                        onuse:function(result,player){
                            player.loselili();
                            if (player.getStat().card.sha) player.getStat().card.sha--;
                            else player.getStat().card.sha = 0;
                        },
                        prompt:'消耗1点灵力，将一张牌当【轰！】使用',
                        check:function(card){return 6-get.value(card)},
                        ai:{
                              ignoreviewas:true,
                              skillTagFilter:function(player, event){
                                    if (player.lili < 2) return false;
                                    if (!player.countCards('he')) return false;
                                    if (game.hasPlayer(function(current){
                                          return current.hasSkill('guihang_flag');
                                    })) return false;
                                    if (!player.hasUseTarget('sha', false, false)) return false;
                                    return lib.filter.cardEnabled({name:'sha'},player,_status.event);
                              },
                              result:{
                                    player:function(player){
                                          if (player.lili < 2) return -1;
                                          return 0.1;
                                    }
                              }
                        }
                  },
                  guihang_cost:{
                       trigger:{source:'damageAfter'},
                        forced:true,
                        filter:function(event,player){
                          return event.getParent().skill=='guihang';
                        },
                        content:function(){
                              player.discardPlayerCard('hej', trigger.player, true);
                              trigger.player.addTempSkill('guihang_flag');
                        },
                        mod:{
                              globalFrom:function(from,to,distance){
                                    if(to.hasSkill('guihang_flag')){
                                          return distance-distance + 1;
                                    }
                              },
                        },
                  },
                  guihang_flag:{
                  },
                  wujian:{
                      audio:2,
                      cost:0,
                      spell:['wujian_skill'],
                      trigger:{player:['phaseBegin']},
                      filter:function(event,player){
                          return player.lili > 1;
                      },
                      content:function(){
                        'step 0'
                        var list = [];
                        for (var i = 1; i < player.lili; i ++){
                              list.push(i);
                        }
                        // 这里AI还没写
                        // 不知道AI要怎么写
                        var choice = 0;
                        for (var i = player.lili - 1; i > 0 ; i --){
                              if (game.countPlayer(function(current){
                                    if (player == current) return 0;
                                    if (!get.distance(player, current, 'absolute') <= player.lili - i) return 0;
                                    if (get.attitude(player, current) > 0) return -2;
                                    if (get.attitude(player, current) < 0) return 2;
                              }) > 0) {
                                    choice = i - 1; 
                                    break;
                              }
                        }
                        player.chooseControl(list,function(){
                              return choice;
                        }).set('prompt','消耗任意点灵力').set('choice',choice);
                        'step 1'
                        if (result.control){
                              player.loselili(result.control);
                              player.storage.wujian = result.control;
                              player.turnOver();
                        }
                      },
                      check:function(event,player){
                        var choice = false;
                        for (var i = player.lili - 1; i > 0 ; i --){
                                if (game.countPlayer(function(current){
                                      if (player == current) return 0;
                                      if (!get.distance(player, current, 'absolute') <= player.lili - i) return 0;
                                      if (get.attitude(player, current) > 0) return -2;
                                      if (get.attitude(player, current) < 0) return 2;
                                }) > 0) {
                                      choice = true; 
                                      break;
                                }
                          }
                          return choice;
                      },
                      ai:{
                            damage:1,
                      }
                  },
                  wujian_skill:{
                        enable:'phaseUse',
                        filter:function(event,player){
                              if (!player.getStat().skill.wujian_skill) return true;
                              return player.getStat().skill.wujian_skill<player.storage.wujian;
                        },
                        content:function(){
                              'step 0'
                              event.list = [];
                              var players = game.filterPlayer();
                              for (var i = 0; i < players.length; i ++){
                                    if (get.distance(player, players[i],'attack')<=1 && players[i] != player){
                                          event.list.push(players[i]);
                                    }
                              }
                              for (var j = 0; j < event.list.length; j++){
                                    event.list[j].damage('thunder');
                              }
                              'step 1'
                              for (var j = 0; j < event.list.length; j++){
                                     if (event.list[j].lili == 0 && event.list[j].countCards('ej') > 0){
                                          player.gainPlayerCard(event.list[j],'ej', 1, true);
                                    }
                              }                                   
                        },
                        ai:{
                          basic:{
                            order:7
                          },
                          result:{
                            player:0.5,
                          },
                        }
                  },
                  huiwu:{
                    audio:0,
                    trigger:{global:'phaseEnd'},
                    filter:function(event,player){
                        return event.player.countCards('hej') > 0;
                    },
                    forced:true,
                    content:function(){
                        'step 0'
                        if (trigger.player.getStat('damage')>0){
                          var neg=get.attitude(player,trigger.player)<=0;
                            player.choosePlayerCard('hej',trigger.player,true).set('ai',function(button){
                                if(_status.event.neg){
                                  return get.buttonValue(button);
                                } else {
                                return -get.buttonValue(button);
                              }
                              }).set('neg',neg);
                            game.trySkillAudio('huiwu',player,true,get.rand(2)+1);
                        } else {               
                          trigger.player.chooseCard('hej',true,'悔悟：你须重铸一张牌').set('ai',function(card){
                            return -get.value(card);
                          });
                            game.trySkillAudio('huiwu',player,true,get.rand(2)+3);
                        }
                        'step 1'
                        if (result.bool&&result.cards.length){
                            trigger.player.recast(result.cards[0]);
                            if(trigger.player.name == 'komachi') game.trySkillAudio('huiwu',trigger.player,true,5);
                        }
                    }
              },
              caijue:{
                audio:2,
                trigger:{player:'phaseBegin'},
                group:'caijue2',
                filter:function(event,player){
                    return !player.storage.caijue;
                },
                content:function(){
                        'step 0'
                        player.chooseTarget('选择一名裁决的罪人',function(card,player,target){
                                    return target.countCards('h') > 0;
                                    }).set('ai',function(target){
                                          return get.attitude(player, target) < 0 && target.countCards('h') > 3;
                                    });
                        'step 1'
                        if (result.bool && result.targets[0]){
                              result.targets[0].showHandcards();
                              var cards = result.targets[0].getCards('h');
                              var list = [];
                              for (var i = 0; i < cards.length; i ++){
                              if (get.subtype(cards[i]) == 'attack'){
                                    list.push(cards[i]);
                              }
                        }
                        var num = list.length;
                        if (list.length > 0){
                        result.targets[0].discard(list);
                        result.targets[0].damage(Math.min(num, player.lili-1), 'thunder');
                        player.loselili(Math.min(num, player.lili-1));
                        } else {
                        player.storage.caijue = true;
                        }
                  }
                },
              },
              caijue2:{
                direct:true,
                trigger:{player:'damageEnd'},
                content:function(){
                    player.storage.caijue = false;
                },
              },   
              shenpan:{
                      skillAnimation:true,
                      audio:2,
                      cost:0,
                      spell:['shenpan_1'],
                      trigger:{player:'phaseBegin'},
                      init:function(player){
                           player.storage.shenpan=true;
                       },
                      mark:true,
                      intro:{
                           content:'limited'
                      },
                    filter:function(event,player){
                      if (!player.storage.shenpan) return false;
                      return player.lili > player.hp;
                    },
                    content:function(){
                        player.loselili(player.hp);
                        player.turnOver();
                        player.storage.shenpan=false;
                        player.syncStorage('shenpan');
                        player.unmarkSkill('shenpan');
                        player.useCard({name:'lingbi'},game.filterPlayer());
                    },
                    check:function(event, player){
                         return player.hp < 3;
                    }
              },
              shenpan_1:{
                    audio:2,
                    forced:true,
                    trigger:{player:'phaseEnd'},
                    content:function(){
                         'step 0'
                         event.num = 0;
                         'step 1'
                         var str = "选择一名";
                         if (event.num == 0) str += "体力值最高的角色";
                         else if (event.num == 1) str += '灵力值最高的角色';
                         else if (event.num == 2) str += '手牌数最高的角色';
                         else if (event.num == 3) str += '击坠角色数最高的角色';
                         str += '，对其造成1点弹幕伤害。';
                         player.chooseTarget(str,true,function(card,player,target){
                              if (event.num == 0) return target.isMaxHp(false);
                              if (event.num == 1) return target.isMaxlili(false);
                              if (event.num == 2) return target.isMaxHandcard(false);
                              if (event.num == 3){
                                   var list = [player];
                                   var players = game.filterPlayer();
                                   for (var i = 0; i < players.length; i ++){
                                        if (players[i].getStat('kill') > list[0].getStat('kill')){
                                             list = [];
                                             list.push(players[i]);
                                        } else if (players[i].getStat('kill') == list[0].getStat('kill')){
                                             list.push(players[i]);
                                        }
                                   }
                                   return list.contains(target);
                              }
                         }).set('ai',function(target){
                              return -get.attitude(_status.event.player,target);
                         });
                         'step 2'
                         if (result.targets[0]){
                              result.targets[0].damage();
                              event.num ++;
                              if (event.num == 4) event.finish();
                              event.goto(1);
                         }
                    },
              },
            },
            translate:{
                  lilyblack:'莉莉黑',
                  chunmian:'春眠',
                  chunmian_audio1:'春天马上就到了呢。',
                  chunmian_audio2:'春眠不觉晓……',
                  chunmian_audio3:'幻想乡需要迎接新的春天了！旧的春天需要革新了！',
                  chunmian_info:'准备阶段，若你的灵力值不大于体力值，你可以令所有角色各弃置与其最近的一名角色一张牌；然后，所有以此法失去牌的角色各摸一张牌。',
                  bamiao:'拔苗',
                  bamiao_audio1:'光靠自己生长，是长不出好苗子的！',
                  bamiao_audio2:'拔尖是越早做起越好的！',
                  bamiao_info:'一回合两次，出牌阶段，你可以：获得1点灵力，然后摸一张牌；或消耗1点灵力，然后弃置一张牌。',
                  lilyblack_die:'那我继续春眠去了……',
                  medicine:'梅蒂欣',
                  zaidu:'灾毒',
                  zaidu_info:'结束阶段，你可以指定一名灵力不大于你的角色，令其受到1点灵击伤害；你造成弹幕伤害后，或回复体力后，你获得1点灵力。',
                  zaidu_audio1:'即使是妖怪，也是躲不掉这个毒的。',
                  zaidu_audio2:'没事，我会保护你的。',
                  zaidu_audio3:'哈哈哈哈哈哈，无论是什么都阻挡不了我的！',
                  zaidu2_audio1:'啊……这个花的毒不错。',
                  zaidu2_audio2:'毒性好像稍微强了一些呢？',
                  zhanfang:'绽放',
                  zhanfang_audio1:'有这么多毒的话，就是世界也可以征服的吧？',
                  zhanfang_audio2:'只用毒伤害别人，是不会成长的啦……所以！',
                  zhanfang_info:'觉醒技，准备阶段，若你的灵力等于上限：若你未受伤，将【灾毒】中的“受到1点灵击伤害”改为“受到1点弹幕伤害”；否则，改为“回复1点体力”；然后，你增加１点体力上限，并发动【毒气花园】（需要消耗）。',
            	    huayuan:'毒气花园',
                  huayuan_info:'符卡技（2）<u>若你体力为场上最高（或之一），符卡视为持有【永续】。</u>一回合一次，一名角色回复体力时，你可以：防止之，或令其额外回复1点；一名角色的体力值变动后，若为0，或为上限，你摸一张牌。',
                  huayuan_audio1:'霧符「毒气花园」!',
                  huayuan_audio2:'在铃兰的花园之中，永久的沉睡吧！',
                  huayuan_1:'毒气花园',
                  huayuan_2:'毒气花园',
                  medicine_die:'哎，下次得多带点毒来。',
                  yuuka:'幽香',
            	    zanghua:'葬花',
                  zanghua_audio1:'花儿们好像对你很感兴趣呢。',
                  zanghua_audio2:'呵呵。',
                  zanghua_audio3:'幽香，这次我可不会输了！',
                  zanghua_audio4:'幽香……别低估我了。',
            	     zanghua_info:'出牌阶段，你可以与一名其他角色拼点；赢的角色视为对输的角色使用了一张【决斗】；若平局，或其体力值小于你，此技能无效，直到结束阶段。',
            	   xiaofeng:'啸风弄月',
                  xiaofeng_audio1:'幻想「花鸟风月，啸风弄月」。',
                  xiaofeng_audio2:'那么，你死后的灵魂会长出什么花来呢？',
            	   xiaofeng_info:'符卡技（4）<u>若你的体力为1，符卡消耗-2。</u>准备阶段，你视为使用一张【花之祝福】；你的攻击范围无限；你造成伤害时，令该伤害+1；你的牌点数均视为Q。',
            	     yuuka_die:'嗯，我承认你还是挺强的呢。',
                  komachi:'小町',
                  guihang:'归航',
                  guihang_audio1:'给我过来！',
                  guihang_audio2:'想在我面前跑？跑到世界尽头你也跑不掉！',
                  guihang_info:'出牌阶段，你可以消耗１点灵力，然后将一张牌当作【轰！】使用；该【轰！】不计次数且无视距离；以此法造成弹幕伤害后，弃置受伤角色一张牌，令你与其距离视为１，且此技能无效，直到回合结束。',
                  wujian:'无间之狭间',
                  wujian_skill:'无间之狭间',
                  wujian_info:'符卡技（X）（X为任意值，至少为1）一回合X次，出牌阶段，你可以对攻击范围内的所有角色各造成1点灵击伤害；然后，若其中有角色没有灵力，你获得其场上一张牌。',
                  wujian_audio1:'地狱「无间之狭间」！',
                  wujian_audio2:'地狱游览单程票！只要998！',
                  komachi_die:'被暴打可真的不能叫放松啊。',
                eiki:'映姬',
                huiwu:'悔悟',
                huiwu_audio1:'果然你是完全没有听从我的教诲。（其实也有点习惯了。）你可知道这样随随便便的攻击是不会有任何好结果的。无意义的纷争和骚乱，破坏其他人的生活，难道，你真的认为破坏其他人，对你是不会有任何后果的吗？听着，以后一定要收拾你的情绪——我还会再回来检查你的表现的。',
                huiwu_audio2:'都说了不要这么打架了，怎么就听不进去？你真的只会这么毫无华丽感的打架？我来教你：首先你需要发动你的符卡技，记得要大声喊名字，其次你需要有规律的发弹幕，记得数量要多，但是不要会压死人，完全不可能突破的弹幕就没有战斗的意义了。双方互相往对方身上用杀招是没有人想要见到的。最后，记住给你的弹幕加入只属于你的特色！',
                huiwu_audio3:'虽然说进行弹幕对战是不可避免的，甚至是幻想乡中必要的一环，但是这并不代表斗争就是好的。斗争只会让你们越来越意气用事，越来越控制不住自己，这对任何人都是没有任何好处的。因此，你们要学会控制自己的情绪，不要让弹幕战变成你的重心。只有多多反思和思考，才能成为更好的人，更好的自己。',
                huiwu_audio4:'嗯，无论是什么时候，即使是在激烈战斗的中心，也是值得花几分钟，集中精神，稳定情绪。事态已如此，慌只会让你的攻击变的无力和没用。要冷静的考虑，找出关键点，突破点，再向着那个方向进发吧。再说了，在你坠机后躺地上了，有的是时间让你慢慢慌的。',
                huiwu_audio5:'（还好映姬大人没发现我戴了耳塞……）',
                huiwu_info:'锁定技，一名角色的回合结束时，其须重铸一张牌；若其本回合造成过伤害，该牌由你指定。',
                caijue:'裁决',
                caijue_info:'准备阶段，你可以展示一名角色的手牌：弃置其中所有攻击牌，然后你消耗等量灵力（不够耗至1）， 对其造成消耗量的灵击伤害；若其中没有攻击牌，【裁决】无效，直到你受到弹幕伤害后。',
                caijue_audio1:'突击检查可是很重要的。如果事先警告检查的话，只会造成临时抱佛脚的情况来。虽然可以简单看得出来，但是终究是对长久懒散的习惯没有任何补成的——因此，只有多多突击检查，并且每一次都要加大力度，要让你从心底里惧怕，才能促进你平常的生活习惯。',
                caijue_audio2:'要赎罪，要改过自新，并不是三分钟热度所能够做到的。因此，如果想要好好的改正，需要有强硬的人时常督促和警告，甚至严训和惩罚都是有必要的。不，我并不是为了你好——地狱只是有些人数溢出了而已。',
                shenpan:'最终审判',
                shenpan_info:'符卡技（X）<限定>（X 为体力值）符卡发动时，你视为使用一张【令避之间】；结束阶段，你对场上体力最高的角色造成１点弹幕伤害，然后对灵力，手牌数，和击坠角色数重复此流程。',
                shenpan_audio1:'审判「Last Judgement」——',
                shenpan_audio2:'虽然我本来希望不会走到这一步，但是——你们，完全的没救了！',
                eiki_die:'打倒我也是没有任何意义的。',
            },
      };
});