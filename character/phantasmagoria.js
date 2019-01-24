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
			            lilyblack:'似乎就是莉莉白换了身衣服？',
                  medicine:'全名梅蒂欣·梅兰可莉。被人类抛弃，受铃兰之毒多年后妖怪化的人偶。',
                  yuuka:'全名风间幽香。太阳花园之主。虽然只是种花的，但是实际战力是顶尖级别，还是战狂性格。不过最近比较满足于种花和养老。',
                  komachi:'全名小野塚小町。负责将死者灵魂带入冥界的，冥河上摆渡的死神。虽然是至关重要的工作，但是因为太懒怠工疑似弄出了异变来。',
                  eiki:'全名四季映姬。幻想乡的裁判长/阎魔王。负责判断死者灵魂是转生还是进入地狱永劫不复。职业病非常非常非常严重。',
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
                          event.current.chooseTarget([1,1],true,get.prompt('chunmian'),function(card,player,target){
                              if(player==target) return false;
                              if(get.distance(player,target)<=1) return true;
                              if(game.hasPlayer(function(current){
                                  return current!=player&&get.distance(player,current)<get.distance(player,target);
                              })){
                              return false;
                          }
                              return target.countCards('hej');
                          }).set('ai',function(target){
                              return -get.attitude(_status.event.player,target);
                          }); 
                          "step 2"
                          if(result.bool){
                              event.current.line(result.targets,'black');
                              event.targets=result.targets;
                              event.current.discardPlayerCard(event.targets[0],'hej',[1,1],true);
                              event.targets[0].storage.chunmian = 1;
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
                              choice.push('lose_card');
                          }
                          if (player.lili != player.maxlili){
                              choice.push('gain_card');
                          }
                          'step 0'
                          player.chooseControl(choice).set('ai',function(){
                              if (player.lili < 5){
                                  return 'gain_card'; 
                              } else {
                                  return 'lose_card';
                              }
                              return 'gain_lili';
                          });
                          'step 1'
                          if (result.control == 'gain_card'){
                              player.gainlili();
                              player.draw();
                          } else if (result.control == 'lose_card') {
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
                           var prompt;
                           if (player.storage.zaidu == 'heal') prompt = '令一名灵力不大于你的角色回复1点体力';
                           if (player.storage.zaidu == 'damage') prompt = '令一名灵力不大于你的角色受到1点弹幕伤害';
                           player.chooseTarget(get.prompt('zaidu'),function(card,player,target){
                              return target.lili <= player.lili;
                              }).set('ai',function(target){
                                    if (player.storage.zaidu != 'heal') return -get.attitude(player,target);
                                    else return get.attitude(player,target);
                              });
                              "step 1"
                              if(result.bool){
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
                                    game.trySkillAudio('zhanfang',player,true,1);
                              } else {
                                    player.storage.zaidu = 'heal';
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
                                    if (get.attitude(player, event.player) >= 0) return '令回复量+1';
                                    return '令回复量-1';
                              });
                              'step 1'
                              if (result.control == '令回复量-1'){
                                    game.log();
                                    trigger.num--;
                              } else {
                                    game.log();
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
                          if(hs[i].number>=9&&get.value(hs[i])<7){
                            bool=true;
                            break;
                          }
                        }
                        if(!bool) return 0;
                        if(target.countCards < hs.length) return -2; 
                        return -0.5;
                      }
                    },
                    order:9,
                  }
            	},
            	xiaofeng:{
                        audio:2,
                        cost:4,
                        spell:['xiaofeng1,xiaofeng2'],
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
                        enable:['chooseToUse'],
                        mod:{
                              targetInRange:function(card){
                                    if(_status.event.skill=='guihang') return true;
                              }
                        },
                        filter:function(event,player){
                          return !player.hasSkill('guihang_flag');
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
                            player.getStat().card.sha--;
                        },
                        prompt:'消耗1点灵力，将一张牌当【轰！】使用',
                        check:function(card){return 4-get.value(card)},
                        ai:{
                              skillTagFilter:function(player){
                                    if (player.lili < 2) return false;
                                    if(!player.countCards('he')) return false;
                              },
                        }
                  },
                  guihang_cost:{
                       trigger:{source:'damageAfter'},
                        forced:true,
                        filter:function(event,player){
                          return event.getParent().skill=='guihang';
                        },
                        content:function(){
                          player.addTempSkill('guihang_flag');
                        }
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
                        var choice = 0;
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
                        return player.lili > 2;
                      },
                  },
                  wujian_skill:{
                        enable:'phaseUse',
                        filter:function(event,player){
                              if (!player.getStat().skill.wujian_skill) return true;
                              return player.getStat().skill.wujian_skill<player.storage.wujian;
                        },
                        content:function(){
                              var list = [];
                              var players = game.filterPlayer();
                              for (var i = 0; i < players.length; i ++){
                                    if (get.distance(player, players[i],'attack')<=1 && players[i] != player){
                                          list.push(players[i]);
                                    }
                              }
                              for (var j = 0; j < list.length; j++){
                                    list[j].damage('thunder');
                              }
                              for (var j = 0; j < list.length; j++){
                                    if (list[j].lili == 0 && list[j].countCards('hej')) player.gainPlayerCard(list[j],true,'hej');
                              }
                        },
                        ai:{
                          basic:{
                            order:10
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
                            game.trySkillAudio('huiwu',player,true,1);
                        } else {               
                          trigger.player.chooseCard('hej',true,'悔悟：你须重铸一张牌').set('ai',function(card){
                            return -get.value(card);
                          });
                            game.trySkillAudio('huiwu',player,true,2);
                        }
                        'step 1'
                        if (result.bool&&result.cards.length){
                            trigger.player.$throw(result.cards);
                            result.cards[0].discard();
                            game.log(get.translation(trigger.player)+'重铸了'+get.translation(result.cards[0]));
                            trigger.player.draw();
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
                    player.chooseTarget(get.prompt('caijue'),function(card,player,target){
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
                      spell:'shenpan_1',
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
                         player.useCard({name:'lingbi'},game.filterPlayer());
                    },
                    check:function(event, player){
                         return player.hp < 2;
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
                         player.chooseTarget(get.prompt('shenpan'),true,function(card,player,target){
                              if (event.num == 0) return target.isMaxHp(true);
                              if (event.num == 1) return target.isMaxlili(true);
                              if (event.num == 2) return target.isMaxHandcard(true);
                              if (event.num == 3){
                                   var list = [player];
                                   for (var i = 0; i < game.filterPlayer.length; i ++){
                                        if (game.filterPlayer[i].getStat('kill') > list[0].getStat('kill')){
                                             list = [];
                                             list.push(game.filterPlayer[i]);
                                        } else if (game.filterPlayer[i].getStat('kill') == list[0].getStat('kill')){
                                             list.push(game.filterPlayer[i]);
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
                  guihang_info:'你可以消耗１点灵力，然后将一张牌当作【轰！】使用；该【轰！】不计次数且无视距离；以此法对距离大于１的角色造成弹幕伤害后，弃置其一张牌，并令你与其距离视为１，且此技能无效，直到回合结束。',
                  wujian:'无间之狭间',
                  wujian_skill:'无间之狭间',
                  wujian_info:'符卡技（X）（X为任意值，至少为1）一回合X次，出牌阶段，你可以对攻击范围内的所有角色各造成1点灵击伤害；你以此法令一名角色的灵力变成0后，获得其场上一张牌。',
                  komachi_die:'被暴打可真的不能叫放松啊。',
                eiki:'映姬',
                huiwu:'悔悟',
                huiwu_audio1:'果然你是完全没有听从我的教诲。（其实也有点习惯了。）你可知道这样随随便便的攻击是不会有任何好结果的。无意义的纷争和骚乱，破坏其他人的生活，难道，你真的认为破坏其他人，对你是不会有任何后果的吗？听着，以后一定要收拾你的情绪——我还会再回来检查你的表现的。',
                huiwu_audio2:'虽然说进行弹幕对战是不可避免的，甚至是幻想乡中必要的一环，但是这并不代表斗争就是好的。斗争只会让你们越来越意气用事，越来越控制不住自己，这对任何人都是没有任何好处的。因此，你们要学会控制自己的情绪，不要让弹幕战变成你的重心。只有多多反思和思考，才能成为更好的人，更好的自己。',
                huiwu_info:'锁定技，一名角色的回合结束时，其须重铸一张牌；若其本回合造成过伤害，该牌由你指定。',
                caijue:'裁决',
                caijue_info:'准备阶段，你可以展示一名角色的手牌：弃置其中所有攻击牌，然后你消耗等量灵力（不够耗至1）， 对其造成消耗量的灵击伤害；若其中没有攻击牌，【裁决】无效，直到你受到弹幕伤害后。',
                shenpan:'最终审判',
                shenpan_info:'符卡技（X）<限定>（X 为体力值）符卡发动时，你视为使用一张【令避之间】；结束阶段，你对场上体力最高的角色造成１点弹幕伤害，然后对灵力，手牌数，和击坠角色数重复此流程。',
               eiki_die:'打倒我也是没有任何意义的。',
            },
      };
});