'use strict';
game.import('character',function(lib,game,ui,get,ai,_status){
	return {
		name:'imperishable',
		connect:true,
		character:{
			   wriggle:['female','4',3,['yingguang','yechong']],
                  mystia:['female','4',3,['shiming','zangsong','wuye']],
                  keine:['female','3',4,['jiehuo','richuguo']],
                  reimu:['female','2',3,['yinyang','mengdie','mengxiang']],
                  marisa:['female','2',3,['liuxing','xingchen','stardust']],
                  tewi:['female','3',3,['kaiyun','mitu','yuangu']],
                  reisen:['female','2',4,['huanshi','zhenshi']],
                  eirin:['female','1',3,['zhaixing','lanyue','tianwen']],
                  kaguya:['female','1',3,['nanti','poxiao','yongye']],
                  mokou:['female','1',4,['yuhuo','businiao']],
		},
		characterIntro:{
			   wriggle:'全名莉格露·奈特巴格。萤火虫妖怪，并且是虫王，可以操纵大量的各种虫子（和听起来一样恶心）。但是惧怕虫子的人越来越少，妖力下降到只是个萝莉，还是个笨蛋。<br> <b>画师：羽々斩</b>',
                mystia:'全名米斯蒂娅·萝蕾拉。夜雀妖怪，可以通过歌声让人疯狂或是变成夜盲。以前以吃人为生，现在因种种原因在开烧烤店。<br> <b>画师：鶖（かしどり）</b>',
                keine:'全名上白泽慧音。虽然是妖怪，平时与人类住在一起，并给人类孩子们教书。在月圆之夜会变身成兽人，然后做些……不可描述的事情。<br> <b>画师：にしもん</b>',
                reimu:'全名博丽灵梦。东方project的主角，博丽神社的巫女，符卡规则的创建人。因为是巫女，在幻想乡是绝对权威势力。但是平常懒到连异变都不去解决……<br> <b>画师：萩原</b>',
                marisa:'全名雾雨魔理沙。东方project的主角。住在魔法森林里的人类魔法使（魔炮流派）。总是抢在巫女之前冲去解决异变。因为种种原因与多名少女有说不清楚的关系。<br> <b>画师：フアルケン</b> <br><s>据说其实是创星神的分身？</s>',
                tewi:'全名因蟠帝。住在迷途竹林里的兔妖。据说在竹林里见到她的人能获得好运。虽然，从竹林里活着出来的人并没有发现他们怎么好运了。<br> <b>画师：ねこぜ</b>',
                reisen:'全名铃仙·优昙华院·因蟠。从月亮逃下，躲入幻想乡的一只月兔妖。因为在永远亭中是最下级的位置，总是被其他人欺负。持有令人解释不清楚程度的能力。<br> <b>画师：ksk(かそく) </b>',
                eirin:'全名八意永琳。不老不死的药师，月都创立人之一。数千年前从月亮逃出，带着辉夜躲入幻想乡。最近才冒出来，并开设了一个诊所。<br> <b>画师：minusT</b>',
                kaguya:'全名蓬莱山辉夜。不老不死的月亮的公主，数千年前从月亮逃出，与永琳一同躲入幻想乡，最近才冒出来。<br> <b>画师：Riv</b>',
                mokou:'全名藤原妹红。原本是人类，数千年前因为辉夜成为了不老不死。一段时间前流浪入了幻想乡，最近住在竹林里。<br> <b>画师：palinus</b>',
		},       
		perfectPair:{
		},
            skill:{
                  yingguang:{
                        audio:4,
                        trigger:{player:'useCard'},
                        frequent:true,
                        usable:1,
                        filter:function(event, player){
                              if (player.hasSkill('yechong1')) return true;
                              //if (player.getStat().skill.yingguang>=1) return false;
                              //if (player.getStat('skill')['yingguang'] >= 1) return false;
                              //if (get.skillCount('yingguang') >= 1) return false;
                              return true;
                        },
                        content:function(){
                              "step 0"
                              event.card = ui.skillPile.childNodes[0];
                              //event.card = ui.skillPile.removeChild(ui.skillPile.firstChild);
                              if (!event.card) event.finish();
                              game.broadcast(function(card){
                                    ui.arena.classList.add('thrownhighlight');
                                    card.copy('thrown','center','thrownhighlight',ui.arena).animate('start');
                              },event.card);
                              event.node=event.card.copy('thrown','center','thrownhighlight',ui.arena).animate('start');
                              ui.arena.classList.add('thrownhighlight');
                              game.addVideo('thrownhighlight1');
                              game.addVideo('centernode',null,get.cardInfo(event.card));
                              player.chooseTarget('选择获得此牌的角色',true).set('ai',function(target){
                                    return get.attitude(_status.event.player,target) && target.countCards('j') < 3;
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
                        },
                        ai:{
                              threaten:1.4,
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
                        init:function(player){
                          lib.skill['yingguang'].usable = 10000;
                        },
                        onremove:function(player){
                          lib.skill['yingguang'].usable = 1;
                        },
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
                                          player.discardPlayerCard('hej',event.targets[event.num],true).ai = function(button){
                                            var val=get.buttonValue(button);
                                            var type = get.type(button.link);
                                            if(get.attitude(_status.event.player,get.owner(button.link))>0 && get.owner(button.link).countCards('hej') > player.countCards('hej')) return type != 'delay' && -val;
                                            if(get.attitude(_status.event.player,get.owner(button.link))>0) return -val;
                                            if (get.attitude(_status.event.player,get.owner(button.link))<0 && get.owner(button.link).countCards('hej') > player.countCards('hej')) return type == 'delay' && val;
                                            return val;
                                          };
                                    }
                              }
                              "step 3"
                              if (result.bool && result.links && result.links.length){
                                    if (get.type(result.links[0]) == 'delay'){
                                          if (event.targets[event.num].countCards('hej') && event.targets[event.num].countCards('hej') >= player.countCards('hej')){
                                                event.targets[event.num].damage('thunder');
                                          } 
                                    }
                              }
                              "step 4"
                              if (event.num < event.targets.length - 1){
                                    event.num++;
                                    event.goto(2);
                              }
                        },
                  },
                  shiming:{
                    audio:2,
                    enable:'phaseUse',
                    usable:1,
                    trigger:{player:'damageEnd'},
                    content:function(){
                      'step 0'
                      player.chooseTarget('失明：洗混一名角色手牌').set('ai',function(target){
                            if (_status.currentPhase == target && get.attitude(player, _status.currentPhase) < 0) return 100;
                            return -get.attitude(_status.event.player,target);
                          });
                      'step 1'
                      if (result.bool){
                        player.logSkill(event.name,result.targets);
                        result.targets[0].addTempSkill('shiming_2');
                        result.targets[0].addTempSkill('shiming_3');
                        player.addSkill('counttrigger');
                        if(!player.storage.counttrigger){
                            player.storage.counttrigger={};
                        }
                        player.storage.counttrigger['shiming']=1;
                        player.stat[player.stat.length-1].skill['shiming']=1;
                      }
                    },
                    check:function(){
                      return true;
                    },
                    ai:{
                      maixie_defend:true,
                    },
                  },
                  shiming_2:{
                    mark:true,
                    intro:{
                      content:'我是谁 我在哪',
                    },
                    silent:true,
                    popup:false,
                      enable:'chooseToUse',
                      group:'shiming_4',
                      filter:function(event,player){
                        return player.countCards('h') > 0 && !player.storage.shiming;
                      },
                      content:function(){
                        "step 0"
                        var next = player.choosePlayerCard('h','失明：试图使用一张牌？', player, 'invisible', true);
                        next.set('ai',function(card){
                            var hs=player.getCards('h').randomSort();
                            return card == hs[0];
                        });
                        "step 1"
                        if (result.bool){
                          player.showCards(result.links[0]);
                          player.removeSkill('shiming_3');
                          if (lib.filter.filterCard({name:result.links[0].name},player,_status.event.getParent().getParent())){
                            if (!player.storage.shiming) player.storage.shiming = [];
                            player.storage.shiming.push(result.links[0]);
                          } else {
                            player.discard(result.links[0]);
                          }
                          player.addTempSkill('shiming_3');
                        }
                      },
                      check:function(event, player){
                        return player.countCards('h') > player.hp || ((player.countCards('h', {name:'shan'}) || player.countCards('h', {name:'tao'})) && player.hp == 1);
                      },
                      ai:{
                        order:4,
                        result:{
                          player:function(player){
                            if (player.hp <= 1) return 1;
                            if (player.countCards('h') > player.hp){
                              if (_status.currentPhase == player) return 0.1;
                              else return 0;
                            }
                          },
                        },
                      }
                  },
                  shiming_3:{
                    mod:{
                          cardEnabled:function(card,player){
                              if(!player.storage.shiming || !player.storage.shiming.contains(card)) return false;
                          },
                          cardUsable:function(card,player){
                                if(!player.storage.shiming || !player.storage.shiming.contains(card)) return false;
                          },
                          cardRespondable:function(card,player){
                                if(!player.storage.shiming || !player.storage.shiming.contains(card)) return false;
                          },
                          cardSavable:function(card,player){
                                if(!player.storage.shiming || !player.storage.shiming.contains(card)) return false;
                          }
                      },
                  },
                  shiming_4:{
                      direct:true,
                      popup:false,
                      trigger:{player:'useCardAfter'},
                      filter:function(event,player){
                        return player.storage.shiming;
                      },
                      content:function(){
                        delete player.storage.shiming;
                      }
                  },
                  zangsong:{
                    audio:2,
                    trigger:{player:'discardAfter'},
                    usable:1,
                    content:function(){
                      'step 0'
                      player.chooseTarget('葬颂：可以弃置一名角色一张牌').set('ai',function(target){
                          return -get.attitude(_status.event.player,target);
                      });
                      'step 1'
                      if (result.bool){
                          player.logSkill(event.name,result.targets);
                          player.discardPlayerCard('hej',result.targets[0],true);
                      }
                    },
                    check:function(event,player){
                      return true;
                    },
                  },
                  wuye:{
                    audio:2,
                    spell:['wuye2'],
                    cost:2,
                    roundi:true,
                    trigger:{player:'phaseBegin'},
                    filter:function(event,player){
                      return player.lili > lib.skill.wuye.cost;
                    },
                    content:function(){
                      player.loselili(lib.skill.wuye.cost);
                      player.turnOver();
                    },
                    check:function(event,player){
                      return player.hp < 2 || (player.hp < 3 && !player.countCards('h', {subtype:'defense'}));
                    },
                  },
                  wuye2:{
                          audio:2,
                          trigger:{target:'useCardToBefore'},
                          direct:true,
                          priority:5,
                          filter:function(event,player){
                              return get.distance(player,event.player,'attack')<=1;
                          },
                          content:function(){
                            "step 0"
                            player.chooseTarget('午夜中的合唱指挥：你可以将'+get.translation(trigger.card)+'转移给一名其他角色',function(card, player, target){
                              return trigger.player.canUse(trigger.card, target);
                            }).ai=function(target){
                                return -get.attitude(player, target);
                            };
                            "step 1"
                            if(result.bool){
                              player.logSkill(event.name,result.targets);
                              trigger.target=result.targets[0];
                              trigger.targets.remove(player);
                              trigger.targets.push(result.targets[0]);
                            }
                            else{
                              event.finish();
                            }
                            "step 2"
                            trigger.untrigger();
                            trigger.trigger('useCardToBefore');
                            trigger.trigger('shaBefore');
                            game.delay();
                          },
                          check:function(event,player){
                            return get.subtype(event.card) != 'support' && get.type(event.card)!='equip';
                          },
                          ai:{
                            effect:{
                              target:function(card,player,target){
                                if (!get.subtype(card) == 'support' && !get.type(card) == 'equip') return 0;
                                else return ;
                              }
                            }
                          }
                    },
                  jiehuo:{
                      trigger:{player:['useCardAfter','respondAfter']},
                      usable:1,
                      audio:2,
                      filter:function(event,player){
                        var i = event;
                        var use = false;
                        while (i.name != 'phaseLoop'){
                          if (i.name == 'phaseUse'){
                            use = true;
                            break;
                          } else {
                            i = i.parent;
                          }
                        }
                        if(!use) return false;
                        var card = event.card;
                        if (!get.position(card) && card.cards && card.cards.length >= 1){
                          card = card.cards[0];
                        }
                        return (get.position(card)=='d'&&get.itemtype(card)=='card'&&player.lili>0);
                      },
                      content:function(){
                         'step 0'
                         player.loselili();
                         event.card = trigger.card;
                         if (!get.position(event.card) && event.card.cards && event.card.cards.length >= 1){
                           event.card = trigger.card.cards; 
                         }
                         player.chooseTarget('将'+get.translation(event.card)+'交给一名角色',true,function(card,player,target){
                              return true;
                          }).set('ai',function(target){
                              if (get.bonus(event.card) > 0) return player == target;
                              return get.attitude(player,target);
                          });
                          'step 1'
                          if (result.targets){
                            if (result.targets[0].name == 'mokou'){
                              game.trySkillAudio('jiehuo',result.targets[0],true,3);
                            }
                              result.targets[0].gain(event.card);
                              result.targets[0].$gain2(event.card);
                          }
                      },
                      check:function(event,player){
                            //return get.value(event.card) >= 5;
                            if (player.lili == 1) return get.value(event.card) >= 6;
                            if (player.lili > 1 && player.lili <= 3) return get.value(event.card) >= 4;
                          return get.value(event.card);
                      },
                  },
                  richuguo:{
                         audio:2,
                         cost:3,
                         spell:['richuguo2'],
                         roundi:true,
                         limited:true,
                         trigger:{player:'phaseBegin'},
                         init:function(player){
                              player.storage.richuguo=true;
                          },
                         mark:true,
                         intro:{
                              content:'limited'
                         },
                        filter:function(event,player){
                          if (player.lili == 0) return false;
                         if (!player.storage.richuguo) return false;
                          var num = 0;
                          if (player.countCards('h',{type:'basic'}) > 0) num ++;
                          if (player.countCards('h',{type:'trick'}) > 0) num ++;
                          if (player.countCards('he',{type:'equip'}) > 0) num ++;
                          if (player.countCards('h',{type:'jinji'}) > 0) num ++;
                           return (player.lili > lib.skill.richuguo.cost) || num >= 3;
                       },
                       content:function(){
                         'step 0'
                         event.list = [];
                         player.storage.qipai = [];
                         'step 1'
                         player.chooseCard('he',function(card){
                           var player=_status.event.player;
                            return !player.storage.qipai.contains(get.type(card));
                         },'弃置3张不同种类的牌，或消耗3点灵力。');
                         'step 2'
                         if (result.bool){
                            event.list.push(result.cards[0]);
                            player.storage.qipai.push(get.type(result.cards[0]));
                            if (player.storage.qipai.length < 3){
                                event.goto(1);
                            } else {
                                player.discard(event.list);
                                event.bool = true;
                                delete player.storage.qipai;
                            }
                         } else {
                            if (player.lili > lib.skill.richuguo.cost){
                                player.loselili(lib.skill.richuguo.cost);
                                event.bool = true;   
                            }
                         }
                         'step 3'
                         if (event.bool){
                            player.turnOver();
                            player.awakenSkill('richuguo');
                            //player.storage.richuguo=false;
                              player.chooseTarget([1,1],'选择一名角色，重置其体力值，灵力值，手牌数',true,function(card,player,target){
                                return true;
                              }).ai=function(target){
                                    return get.attitude(player, target);
                              }
                          }
                          'step 4'
                          if (result.targets){
                              result.targets[0].recover(result.targets[0].maxHp - result.targets[0].hp);
                              var ol = parseInt(lib.character[result.targets[0].name][1]);
                              if (result.targets[0].lili < ol){
                                result.targets[0].gainlili(ol-result.targets[0].lili);
                              } else if (result.targets[0].lili > ol){
                                result.targets[0].loselili(result.targets[0].lili-ol);
                              }
                              if (result.targets[0].countCards('h') < 4){
                                result.targets[0].draw(4-result.targets[0].countCards('h'));
                              } else if (result.targets[0].countCards('h') > 4){
                                result.targets[0].chooseToDiscard(result.targets[0].countCards('h')-4,true,'h');
                              }
                          }
                       },
                       check:function(event, player){
                        var players = game.filterPlayer();
                        var t = false;
                        for (var i = 0; i < players.length; i ++){
                          if (get.attitude(player, players[i]) && (players[i].hp < 2 || players[i].countCards('h') < 2)){
                            t = true;
                          }
                        }
                        return t;
                       },
                     },
                  richuguo2:{
                        trigger:{player:'dying'},
                        forced:true,
                        content:function(){
                             player.storage.richuguo=true;
                             player.restoreSkill('richuguo');
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
                                    if(trigger.player.countCards('hej')&&get.attitude(player,trigger.player)<0 && player.countCards('h') > 2){
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
                                    game.log(player,'将',trigger.player,'的',result.links[0],'置入牌堆底');
                                    trigger.player.showCards(result.links[0]);
                                    trigger.player.lose(result.links[0], ui.special);
                                    trigger.player.update();
                                    result.links[0].fix();
                                    event.card = result.links[0];
                              }
                              'step 3'
                              if (event.card){
                                if (get.type(event.card) == 'delay'){
                                  ui.skillPile.appendChild(event.card);
                                } else {
                                  ui.cardPile.appendChild(event.card);
                                }
                              }
                              player.storage.yinyang = false;
                        },
                        ai:{
                          threaten:0.7,
                          maixie_defend:true,
                        }
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
                      audio:1,
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
                      roundi:true,
                      trigger:{player:['phaseBegin']},
                      filter:function(event,player){
                          return player.lili > lib.skill.mengxiang.cost;
                      },
                      content:function(){
                          player.loselili(lib.skill.mengxiang.cost);
                          player.turnOver();
                      },
                      check:function(event, player){
                        return player.lili > 3 && player.countCards('h') > 3;
                      },
                  },
                  mengxiang1:{
                    audio:2,
                    trigger:{player:'useCardToBegin'},
                    filter:function(event,player){
                      return event.target;
                    },
                    content:function(){
                      'step 0'
                      var list = [];
                      if (trigger.target.storage._tanpai){
                          list.push('受到1点灵击伤害 并弃置一张牌');
                      } else {
                        if (trigger.target.countCards('hej')){
                          list.push('discard');
                        }
                        list.push('lilidamage');
                      }
                      player.chooseControl(list).set('prompt',get.translation(player)+'对'+get.translation(trigger.target)+'发动了【梦想封印】!');
                      'step 1'
                      if (result.control != 'lilidamage'){
                        if (trigger.target.countCards('hej')){
                          trigger.target.chooseToDiscard(true,'hej');
                        }
                      }
                      if (result.control != 'discard'){
                        trigger.target.damage('thunder');
                      }
                    },
                    check:function(event,player){
                      if (event.target == player) return false;
                      return get.attitude(player,event.target) < 0;
                    },
                  },
                  liuxing:{
                    audio:2,
                    trigger:{player:'phaseDrawBegin'},
                    filter:function(event,player){
                        return event.num > 0;
                    },
                    content:function(){
                        'step 0'
                        var list = [];
                        for (var i = 0; i < trigger.num; i ++){
                            list.push(i+1);
                        }
                        player.chooseControl(list,function(){
                            if (!player.countCards('h') || !game.hasPlayer(function(current){
                              return get.attitude(player, current) <= 0 && current.countCards('hej') && get.distance(player,current,'attack')<=2; 
                            })){
                              return false;
                            }
                            else return 0;
                        }).set('prompt','少摸任意张牌，增加等量攻击范围');
                        'step 1'
                        if (result.control){
                            trigger.num -= result.control;
                            player.storage.liuxing = result.control;
                            player.addTempSkill('liuxing_shun','phaseAfter');
                        }
                    },
                    mod:{
                        attackFrom:function(from,to,distance){
                          if (!from.storage.liuxing) return distance;
                            return distance-from.storage.liuxing;
                        }
                    }
                  },
                  liuxing_shun:{
                    audio:0,
                    group:'liuxing_unlili',
                    trigger:{player:'phaseEnd'},
                    forced:true,
                    filter:function(event,player){
                        return true;
                    },
                    content:function(){
                        'step 0'
                        player.chooseTarget('今天要去偷谁的东西呢？',function(card,player,target){
                            return player.canUse('shunshou', target);
                         }).set('ai',function(target){
                            return get.effect(target,{name:'shunshou'},_status.event.player);
                         });
                         'step 1'
                         if (result.bool && result.targets){
                            player.useCard({name:'shunshou'},result.targets[0],false);
                         }
                    },
                  },
                  liuxing_unlili:{
                    direct:true,
                    trigger:{player:'loseliliBefore'},
                    filter:function(event,player){
                      return event.getParent().getParent().getParent().name == 'liuxing_shun';
                    },
                    content:function(){
                      trigger.cancel();
                    },
                  },
                  xingchen:{
                    audio:2,
                    group:'xingchen_2',
                    enable:['chooseToUse','chooseToRespond'],
                    filter:function(event,player){
                      return player.countCards('h') == player.hp;
                    },
                    position:'h',
                    selectCard:1,
                    viewAs:{name:'sha'},
                    filterCard:true,
                    prompt:'将一张手牌当【轰！】使用或打出',
                    check:function(card){return 4-get.value(card)},
                    ai:{
                      skillTagFilter:function(player){
                        return player.countCards('h') == player.hp;
                      },
                      respondSha:true,
                    }
                  },
                  xingchen_2:{
                    trigger:{player:'shaBegin'},
                    direct:true,
                    filter:function(event,player){
                      return event.skill=='xingchen';
                    },
                    content:function(){
                      player.getStat().card.sha--;
                    },
                    mod:{
                      cardUsable:function(card,player,num){
                        if(card.name=='sha' && player.countCards('h') == player.hp) return Infinity;
                      }
                    },
                  },
                  stardust:{
                    audio:2,
                    trigger:{player:'phaseBegin'},
                    cost:0,
                    spell:['stardust1'],
                    filter:function(event,player){
                      return player.lili > lib.skill.stardust.cost;
                    },
                    content:function(){
                      'step 0'
                        var list = [0];
                        for (var i = 1; i <= player.lili; i ++){
                              list.push(i);
                        }
                        player.chooseControl(list,function(){
                              if (player.countCards('h') > 2) return player.lili - 2;
                              return player.lili - 3;
                            }).set('prompt','消耗任意点灵力');
                        'step 1'
                        if (result.control){
                            player.loselili(result.control);
                            game.playBackgroundMusic('marisa');
                            lib.config.musicchange = 'off';
                            player.storage.stardust = result.control;
                            if (!player.storage._enhance) player.storage._enhance = result.control;
                            else player.storage._enhance += result.control;
                            player.turnOver();
                        }
                    },
                    check:function(event,player){
                      return player.lili >= 3 && game.countPlayer(function(current){
                        return current!=player&&current.countCards('h')&&get.attitude(player,current)<=0;
                      }) >= 2;
                    },
                  },
                  stardust1:{
                    audio:2,
                    direct:true,
                    trigger:{player:'useCardAfter'},
                    filter:function(event,player){
                      return player.storage.stardust;
                    },
                    content:function(){
                      delete player.storage.stardust;
                    },
                    mod:{
                      targetInRange:function(card,player,target,now){
                        if(player.storage.stardust && card.type != 'equip') return true;
                      },
                      selectTarget:function(card,player,range){
                        if(player.storage.stardust && card.type != 'equip'&&range[1]!=-1) range[1]+=player.storage.stardust;
                      },
                    },
                  },
                  kaiyun:{
                    global:'kaiyun_1',
                  },
                  kaiyun_1:{
                    trigger:{player:'phaseUseBegin'},
                    filter:function(event,player){
                      return player.countCards('hej') && game.hasPlayer(function(current){
                          return current.hasSkill('kaiyun');
                      });
                    },
                    content:function(){
                      'step 0'
                        player.chooseCardTarget({
                          prompt:'交给帝一张牌，摸一张【神佑】，然后本回合不能对你和她以外的人用牌',
                          selectCard:1,
                          filterTarget:function(card,player,target){
                            return target.hasSkill('kaiyun');
                          },
                          forced:true,
                          position:'hej',
                          ai2:function(target){
                            return get.attitude(_status.event.player,target);
                          }
                        });
                        'step 1'
                        if(result.targets&&result.targets[0]){
                          result.targets[0].gain(result.cards,player);
                          player.$give(result.cards.length,result.targets[0]);
                          result.targets[0].say('只要998，保证你出SSR——');  
                        }
                        player.drawSkill('shenyou');
                        player.addTempSkill('kaiyun_3');
                        result.targets[0].addTempSkill('kaiyun_4');
                    },
                    check:function(event,player){
                      if (game.countPlayer(function(current){
                        return current.countCards('j', {name:'shenyou'});
                      }) > 1) return false;
                      if (player.hp > 1 && (player.countCards('h') - 1 > player.getHandcardLimit() || player.countCards('h', function(card){
                        return get.subtype(card) == 'attack' || get.subtype(card) == 'disrupt';
                      }) > 2)) return false;
                      return game.hasPlayer(function(current){
                        return current!=player&&current.hasSkill('kaiyun')&&get.attitude(player,current)>0;
                      });
                    },
                  },
                  kaiyun_3:{
                    mod:{
                        playerEnabled:function(card,player,target){
                          if (target != player && !target.hasSkill('kaiyun_4')) return false;
                        }
                      }
                  },
                  kaiyun_4:{
                    // 又是标记啊
                  },
                  mitu:{
                    audio:2,
                    group:'mitu_storage',
                    trigger:{global:'useCardToBegin'},
                    filter:function(event,player){
                      if (!player.storage.mitu.length) return false;
                      if (event.card.name != player.storage.mitu[0].name) return false;
                      //if (player.hasSkill('yuangu_1')){
                        return get.distance(player,event.target,'attack')<=1;
                      //} else {
                        //return event.target == player;
                      //}
                    },
                    content:function(event,player){
                      'step 0'
                      player.showCards(player.storage.mitu);
                      trigger.player.judge(function(card){
                        if (get.color(card) == 'black') return -2;
                        return 1;
                      });
                      'step 1'
                      if (result.bool == false){
                        player.discardPlayerCard(trigger.player,'hej',true);
                        if(trigger.target == player) trigger.cancel();
                        if(!player.hasSkill('yuangu_1')) {
                          player.storage.mitu[0].discard();
                          player.$throw(player.storage.mitu);
                          player.storage.mitu = [];
                          player.unmarkSkill('mitu');
                        }
                      }
                    },
                    check:function(event, player){
                      return get.attitude(player, event.target) > 0;
                    },
                    intro:{
                        mark:function(dialog,content,player){
                          if(content && content.length){
                            if(player==game.me||player.isUnderControl()){
                              dialog.addAuto(content);
                            }
                            else{
                              return '这里有个坑哟';
                            }
                          }
                        },
                        content:function(content,player){
                          if(content && content.length){
                            if(player==game.me||player.isUnderControl()){
                              return get.translation(content);
                            }
                            return '这里有个坑哟';
                          }
                        }
                      },
                  },
                  mitu_storage:{
                    audio:2,
                    trigger:{player:'phaseDiscardBegin'},
                    init:function(player){
                      player.storage.mitu = [];
                    },
                    filter:function(event,player){
                      return player.countCards('he') && !player.storage.mitu.length;
                    },
                    content:function(){
                      'step 0'
                      player.chooseCard('he','将一张牌作为“坑”放头上').set('ai',function(card){
                          /*if (game.countPlayer(function(current){
                            return get.attitude(player, current) < 0 && get.distance(player,current,'attack')<=1 && current.hp == 1;  
                          }) && player.countCards('h', {name:'tao'})) return card.name == 'tao';
                          */  
                            return get.subtype(card) == 'attack' || get.subtype(card) == 'disrupt';
                          });
                      'step 1'
                      if(result.cards&&result.cards.length){
                        player.lose(result.cards,ui.special);
                        player.storage.mitu=[result.cards[0]];
                        player.syncStorage('mitu');
                        player.markSkill('mitu');
                      }
                    },
                    check:function(event,player){
                      return player.countCards('h')>player.countCards('h', function(card){
                          return !get.info(card).enable;
                      });
                    },
                  },
                  yuangu:{
                    audio:2,
                    cost:2,
                    spell:['yuangu_1'],
                    roundi:true,
                    trigger:{player:'phaseBegin'},
                    filter:function(event,player){
                        return player.lili > lib.skill.yuangu.cost;
                    },
                    content:function(){
                        player.loselili(lib.skill.yuangu.cost);
                        player.turnOver();
                      },
                    check:function(event,player){
                      return (player.lili > 3 || player.hp < 2) && player.storage.mitu.length;
                    },
                  },
                  yuangu_1:{
                    // 结果这玩意变成了鬼道了啊……
                    audio:2,
                    trigger:{global:'judge'},
                    filter:function(event,player){
                      return player.countCards('he')>0;
                    },
                    direct:true,
                    content:function(){
                      "step 0"
                      player.chooseCard(get.translation(trigger.player)+'的'+(trigger.judgestr||'')+'判定为'+
                      get.translation(trigger.player.judging[0])+'，'+get.prompt('yuangu'),'he',function(card){
                        return true;
                      }).set('ai',function(card){
                        var trigger=_status.event.getTrigger();
                        var player=_status.event.player;
                        var judging=_status.event.judging;
                        var result=trigger.judge(card)-trigger.judge(judging);
                        var attitude=get.attitude(player,trigger.player);
                        if(attitude==0||result==0) return 0;
                        if(attitude>0){
                          return result;
                        }
                        else{
                          return -result;
                        }
                      }).set('judging',trigger.player.judging[0]);
                      "step 1"
                      if(result.bool){
                        player.respond(result.cards,'highlight');
                      }
                      else{
                        event.finish();
                      }
                      "step 2"
                      if(result.bool){
                        player.logSkill('yuangu');
                        player.$gain2(trigger.player.judging[0]);
                        player.gain(trigger.player.judging[0]);
                        trigger.player.judging[0]=result.cards[0];
                        if(!get.owner(result.cards[0],'judge')){
                          trigger.position.appendChild(result.cards[0]);
                        }
                        game.log(trigger.player,'的判定牌改为',result.cards[0]);
                      }
                      "step 3"
                      game.delay(2);
                    },
                    ai:{
                      tag:{
                        rejudge:1
                      }
                    }
                  },
                  huanshi:{
                    audio:2,
                    enable:'phaseUse',
                    discard:false,
                    filterCard:true,
                    filter:function(event,player){
                      return player.countCards('he');
                    },
                    content:function(){
                      'step 0'
                      var list = [];
                      for (var i in lib.card){
                          if(lib.card[i].mode&&lib.card[i].mode.contains(lib.config.mode)==false) continue;
                          if(lib.card[i].forbid&&lib.card[i].forbid.contains(lib.config.mode)) continue;
                          if(lib.card[i].subtype == 'attack' || lib.card[i].subtype == 'disrupt'){
                              list.add(i);
                          }
                      }
                      for(var i=0;i<list.length;i++){
                          list[i]=[get.type(list[i]),'',list[i]];
                      }
                      if(list.length){
                          player.chooseButton(['视为使用一张牌',[list,'vcard']]).set('ai',function(button){
                              var player=_status.event.player;
                              var card={name:button.link[2]};
                              return get.value(card);
                          });
                      }
                      'step 1'
                      if(result&&result.bool&&result.links[0]){
                          var card = {name:result.links[0][2]};
                          event.fakecard=card;
                          player.chooseTarget(function(card,player,target){
                              return player.canUse(event.fakecard,target,true) && !target.hasSkill('huanshi_3');
                          },true,'选择'+get.translation(card.name)+'的目标').set('ai',function(target){
                              return get.effect(target,event.fakecard,_status.event.player);
                          });
                      } else {
                          event.finish();
                      }       
                      'step 2'
                      if(result.bool&&result.targets&&result.targets.length){
                        for (var i = 0; i < result.targets.length; i ++){
                          result.targets[i].addTempSkill('huanshi_2','useCardAfter');
                          result.targets[i].addTempSkill('huanshi_3');
                          if (result.targets[i].name == 'eirin') game.trySkillAudio('huanshi',player,true,3);
                          if (result.targets[i].name == 'kaguya') game.trySkillAudio('huanshi',player,true,4);
                        }
                        player.storage.huanshi = [cards[0]];
                        player.useCard(event.fakecard,result.targets);
                      }
                    },
                    ai:{
                        order:6,
                        result:{
                            player:function(player,target){
                                if (player.countCards('h') < 3) return -1;
                                var players=game.filterPlayer();
                                for(var i=0;i<players.length;i++){
                                  if (get.attitude(player,players[i])< 0 && !players[i].hasSkill('huanshi_3')) return 1;
                                }
                            }
                        },
                        threaten:1,
                    }
                  },
                  huanshi_2:{
                    trigger:{target:'useCardToBegin'},
                    direct:true,
                    filter:function(event,player){
                      return event.getParent().getParent().name == 'huanshi';
                    },
                    prompt:'幻视：你可以将一张牌当作一种防御牌使用',
                    check:function(){
                      return true;
                    },
                    content:function(){
                      'step 0'
                      player.chooseCard('he','幻视：将一张牌当作一种防御牌使用').set('ai',function(card){
                            return 7-get.value(card);
                        });
                      'step 1'
                      if (!result.cards){
                        game.log('幻视：当作',trigger.card,'的牌是',trigger.player.storage.huanshi[0]);
                        event.finish();
                      } else {
                        event.card = result.cards[0];
                        var list = [];
                        for (var i in lib.card){
                            if(lib.card[i].mode&&lib.card[i].mode.contains(lib.config.mode)==false) continue;
                            if(lib.card[i].forbid&&lib.card[i].forbid.contains(lib.config.mode)) continue;
                            if(lib.card[i].subtype == 'defense'){
                                list.add(i);
                            }
                        }
                        for(var i=0;i<list.length;i++){
                            list[i]=[get.type(list[i]),'',list[i]];
                        }
                        if(list.length){
                            player.chooseButton(['将'+get.translation(event.card)+'当作一张牌使用',[list,'vcard']]).set('ai',function(button){
                                var player=_status.event.player;
                                var card={name:button.link[2]};
                                return get.value(card);
                            });
                        }
                      }
                      'step 2'
                      if(result.bool&&result.links){
                        player.$throw(event.card,500);
                        player.lose(event.card);
                        game.log(player,'将',event.card,'当作',result.links[0][2],'打出');
                        game.log('幻视：当作',trigger.card,'的牌是',trigger.player.storage.huanshi[0]);
                        trigger.cancel();
                        if (trigger.player.storage.huanshi){
                            var rcard = trigger.player.storage.huanshi[0];
                            if (trigger.player.canUse(rcard, player)){
                              if (result.links[0][2] == 'shan' && trigger.player.storage.huanshi[0].name != 'sha' ||
                                result.links[0][2] == 'wuxie' && get.type(trigger.player.storage.huanshi[0]) != 'trick')
                              trigger.player.useCard(rcard,player);
                            }
                        }
                      } else {
                        game.log('幻视：当作',trigger.card,'的牌是',trigger.player.storage.huanshi[0]);
                        event.finish();
                      }
                    },
                    /*
                    mod:{
                      cardEnabled:function(card,player){
                        if(get.subtype(card) == 'defense') return false;
                      },
                      cardUsable:function(card,player){
                        if(get.subtype(card) == 'defense') return false;
                      },
                      cardRespondable:function(card,player){
                        if(get.subtype(card) == 'defense') return false;
                      },
                      cardSavable:function(card,player){
                        if(get.subtype(card) == 'defense') return false;
                      },
                    },
                    */
                  },
                  huanshi_3:{
                  },
                  zhenshi:{
                    audio:2,
                    cost:1,
                    spell:['zhenshi_1'],
                    roundi:true,
                    trigger:{player:'phaseBegin'},
                    filter:function(event,player){
                        return player.lili > lib.skill.zhenshi.cost;
                    },
                    content:function(){
                        player.loselili(lib.skill.zhenshi.cost);
                        player.turnOver();
                      },
                    check:function(event,player){
                      return player.lili > 3 && player.countCards('hej') > 3 && game.countPlayer(function(current){
                        return get.attitude(player, current) && (current.hp == 1) || (current.hp < 3 && current.countCards('h') < 2);
                      });
                      //return true;
                    },
                  },
                  zhenshi_1:{
                    trigger:{global:'useCardToBefore'},
                    filter:function(event,player){
                      if (!player.countCards('hej')) return false;
                      return get.subtype(event.card) == 'attack' && get.distance(player,event.target,'attack')<=1 && event.targets.length == 1;
                    },
                    check:function(event,player){
                      return player.countCards('hej') > 2 && get.attitude(player, event.target);
                    },
                    content:function(){
                      'step 0'
                      var next=player.chooseToDiscard('hej','真实之月：为使用月亮的力量而弃置一张牌吧');
                        next.ai=function(card){
                            return 7-get.value(card);
                        };
                      'step 1'
                      player.chooseTarget([1,2],'选择要被月光晒瞎的倒霉人吧',true,function(card,player,target){
                                return target != trigger.targets[0];
                              }).ai=function(target){
                                    return -get.attitude(player,target);
                              }
                      'step 2'
                      if (result.targets){
                        player.logSkill('zhenshi',result.targets);
                        event.targets = result.targets;
                        event.targets.push(trigger.targets[0]);
                        var rand = [game.createCard('?','',''), game.createCard('?','','')];
                        if (event.targets.length == 3){
                          rand.push(game.createCard('?','',''));
                        }
                        trigger.player.chooseCardButton(1,true,rand,'选择'+get.translation(trigger.card)+'新的目标').set('ai',function(button){
                            return 1;
                        });
                      }
                      'step 3'
                      if (result.links){
                        event.targets.randomSort();
                        trigger.targets.remove(trigger.targets[0]);
                        trigger.target=event.targets[0];
                        game.log(trigger.card,'转移给了',event.targets[0]);
                        trigger.untrigger();
                        trigger.trigger('useCardToBefore');
                        trigger.trigger(trigger.card.name+'Before');
                        game.delay();
                      }
                    },
                  },
                  zhaixing:{
                    audio:2,
                    trigger:{player:'phaseEnd'},
                    group:['zhaixing_mark','zhaixing_remove'],
                    filter:function(event,player){
                      return player.storage.zhaixing.length;
                    },
                    intro:{
                          content:function(storage,player){
                                var str = '';
                                for (var i = 0; i < player.storage.zhaixing.length; i ++){
                                      str += get.translation(player.storage.zhaixing[i]) + ',';
                                }
                                return str;
                          }
                    }, 
                    content:function(){
                      'step 0'
                      player.chooseControl(['观看牌堆顶','观看技能牌堆顶'], true);
                      'step 1'
                      if (result.control){
                        var cards = [];
                        if (result.control == '观看牌堆顶'){
                          cards = get.cards(player.storage.zhaixing.length);
                        } else if (result.control == '观看技能牌堆顶'){
                            for(var i=0;i<player.storage.zhaixing.length;i++){
                                cards.push(ui.skillPile.childNodes[i]);
                            }
                        }
                        event.cards = cards;
                        player.chooseCardButton(cards,'可以选择一张牌交给一名角色',1).set('ai',function(button){
                          return get.value(button);
                        });
                      }
                      'step 2'
                      if (result.links && result.links.length){
                        event.card = result.links;
                        player.chooseTarget('将'+get.translation(result.links)+'交给一名角色').set('ai',function(target){
                              return get.attitude(_status.event.player,target);
                          });;
                      }
                      'step 3'
                      if (result.targets && result.targets.length){
                        if (result.targets[0].name == 'kaguya') game.trySkillAudio('zhaixing',result.targets[0],true,3);
                        result.targets[0].gain(event.card);
                        event.cards.remove(event.card);
                      }
                      'step 4'
                      if (!event.cards.length) event.finish();
                      if (event.cards.length){
                        if(player.isUnderControl()){
                          game.modeSwapPlayer(player);
                        }
                        var cards=event.cards;
                        var switchToAuto=function(){
                          _status.imchoosing=false;
                          if(event.dialog) event.dialog.close();
                          if(event.control) event.control.close();
                          var top=[];
                          var bottom;
                          var stopped = false;
                          if(!stopped){
                            cards.sort(function(a,b){
                              return get.value(b,player)-get.value(a,player);
                            });
                            while(cards.length){
                              if(get.value(cards[0],player)<=5) break;
                              top.unshift(cards.shift());
                            }
                          }
                          bottom=cards;
                          for(var i=0;i<top.length;i++){
                            ui.cardPile.insertBefore(top[i],ui.cardPile.firstChild);
                          }
                          for(i=0;i<bottom.length;i++){
                            ui.cardPile.appendChild(bottom[i]);
                          }
                          player.popup(get.cnNumber(top.length)+'上'+get.cnNumber(bottom.length)+'下');
                          game.log(player,'将'+get.cnNumber(top.length)+'张牌置于牌堆顶');
                          game.delay(2);
                        };
                        var chooseButton=function(online,player,cards){
                          var event=_status.event;
                          player=player||event.player;
                          cards=cards||event.cards;
                          event.top=[];
                          event.bottom=[];
                          event.status=true;
                          event.dialog=ui.create.dialog('按顺序选择置于牌堆顶的牌（先选择的在上）',cards);
                          for(var i=0;i<event.dialog.buttons.length;i++){
                            event.dialog.buttons[i].classList.add('pointerdiv');
                          }
                          event.switchToAuto=function(){
                            event._result='ai';
                            event.dialog.close();
                            event.control.close();
                            _status.imchoosing=false;
                          },
                          event.control=ui.create.control('ok','pileTop','pileBottom',function(link){
                            var event=_status.event;
                            if(link=='ok'){
                              if(online){
                                event._result={
                                  top:[],
                                  bottom:[]
                                }
                                for(var i=0;i<event.top.length;i++){
                                  event._result.top.push(event.top[i].link);
                                }
                                for(var i=0;i<event.bottom.length;i++){
                                  event._result.bottom.push(event.bottom[i].link);
                                }
                              }
                              else{
                                var i;
                                for(i=0;i<event.top.length;i++){
                                  ui.cardPile.insertBefore(event.top[i].link,ui.cardPile.firstChild);
                                }
                                for(i=0;i<event.bottom.length;i++){
                                  ui.cardPile.appendChild(event.bottom[i].link);
                                }
                                for(i=0;i<event.dialog.buttons.length;i++){
                                  if(event.dialog.buttons[i].classList.contains('glow')==false&&
                                    event.dialog.buttons[i].classList.contains('target')==false)
                                  ui.cardPile.appendChild(event.dialog.buttons[i].link);
                                }
                                player.popup(get.cnNumber(event.top.length)+'上'+get.cnNumber(event.cards.length-event.top.length)+'下');
                                game.log(player,'将'+get.cnNumber(event.top.length)+'张牌置于牌堆顶');
                              }
                              event.dialog.close();
                              event.control.close();
                              game.resume();
                              _status.imchoosing=false;
                            }
                            else if(link=='pileTop'){
                              event.status=true;
                              event.dialog.content.childNodes[0].innerHTML='按顺序选择置于牌堆顶的牌';
                            }
                            else{
                              event.status=false;
                              event.dialog.content.childNodes[0].innerHTML='按顺序选择置于牌堆底的牌';
                            }
                          })
                          for(var i=0;i<event.dialog.buttons.length;i++){
                            event.dialog.buttons[i].classList.add('selectable');
                          }
                          event.custom.replace.button=function(link){
                            var event=_status.event;
                            if(link.classList.contains('target')){
                              link.classList.remove('target');
                              event.top.remove(link);
                            }
                            else if(link.classList.contains('glow')){
                              link.classList.remove('glow');
                              event.bottom.remove(link);
                            }
                            else if(event.status){
                              link.classList.add('target');
                              event.top.unshift(link);
                            }
                            else{
                              link.classList.add('glow');
                              event.bottom.push(link);
                            }
                          }
                          event.custom.replace.window=function(){
                            for(var i=0;i<_status.event.dialog.buttons.length;i++){
                              _status.event.dialog.buttons[i].classList.remove('target');
                              _status.event.dialog.buttons[i].classList.remove('glow');
                              _status.event.top.length=0;
                              _status.event.bottom.length=0;
                            }
                          }
                          game.pause();
                          game.countChoose();
                        };
                        event.switchToAuto=switchToAuto;

                        if(event.isMine()){
                          chooseButton();
                          event.finish();
                        }
                        else if(event.isOnline()){
                          event.player.send(chooseButton,true,event.player,event.cards);
                          event.player.wait();
                          game.pause();
                        }
                        else{
                          event.switchToAuto();
                          event.finish();
                        }
                      }
                      'step 5'
                      if (!event.cards.length) event.finish();
                      if(event.result=='ai'||!event.result){
                          event.switchToAuto();
                        }
                        else{
                          var top=event.result.top||[];
                          var bottom=event.result.bottom||[];
                          for(var i=0;i<top.length;i++){
                            if (get.type(top[i]) == 'delay'){
                              ui.skillPile.insertBefore(top[i],ui.skillPile.firstChild);
                            } else {
                              ui.cardPile.insertBefore(top[i],ui.cardPile.firstChild);
                            }
                          }
                          for(i=0;i<bottom.length;i++){
                            if (get.type(bottom[i]) == 'delay'){
                              ui.skillPile.appendChild(bottom[i]);
                            } else {
                              ui.cardPile.appendChild(bottom[i]);
                            }
                          }
                          for(i=0;i<event.cards.length;i++){
                            if(!top.contains(event.cards[i])&&!bottom.contains(event.cards[i])){
                              if (get.type(event.cards[i]) == 'delay'){
                                ui.skillPile.appendChild(event.cards[i]);
                              } else {
                                ui.cardPile.appendChild(event.cards[i]);
                              }
                            }
                          }
                          player.popup(get.cnNumber(top.length)+'上'+get.cnNumber(event.cards.length-top.length)+'下');
                          game.log(player,'将'+get.cnNumber(top.length)+'张牌置于牌堆顶');
                          game.delay(2);
                        }
                    },
                  },
                  zhaixing_mark:{
                    direct:true,
                    trigger:{player:'useCard'},
                    init:function(player){
                      player.storage.zhaixing=[];
                    },
                    filter:function(event,player){
                        return _status.currentPhase == player;
                    },
                    content:function(){
                      if (!player.storage.zhaixing.contains(get.suit(trigger.card))){
                        player.storage.zhaixing.push(get.suit(trigger.card));
                      }
                      player.markSkill('zhaixing');
                      player.syncStorage('zhaixing');
                    },
                  },
                  zhaixing_remove:{
                      direct:true,
                      trigger:{player:'phaseAfter'},
                      content:function(){
                        player.storage.zhaixing=[];
                        player.unmarkSkill('zhaixing');
                      },
                  },
                  lanyue:{
                    audio:2,
                    enable:'phaseUse',
                    usable:1,
                    filterTarget:function(card,player,target){
                      var players = game.filterPlayer();
                      var length = 0;
                      for (var i = 0; i < players.length; i ++){
                        if (get.distance(player,players[i],'attack') > 1) players.remove(players[i]);
                        else if (get.distance(player,players[i]) > length) length = get.distance(player,players[i]);
                      }
                      return players.contains(target) && get.distance(player,target) == length;
                    },
                    content:function(){
                      "step 0"
                      if (target.name == 'kaguya') game.trySkillAudio('lanyue',target,true,3);
                      var list = [];
                      if (target.hp != player.hp) list.push('体力');
                      if (target.lili != player.lili) list.push('灵力');
                      // 选择枝AI
                      var choice;
                      if (target.hp < player.hp){
                        if ((player.lili - target.lili)/2 > (player.hp - target.hp)) choice = '灵力';
                        else choice = '体力';
                      } else if (target.hp > player.hp){
                        if ((player.lili - target.lili)/2 > (target.hp - player.hp)) choice = '体力';
                        else choice = '灵力';
                      } else choice = '灵力';
                      if (!list.contains(choice)) choice = list[0];
                      if (list.length == 0) event.finish();
                      else target.chooseControl(list, function(){
                              return _status.event.choice;
                            },true).set('choice',choice);
                      "step 1"
                      if(result.control){
                        if (result.control == '体力'){
                          game.log(target,'的体力调整为'+player.hp);
                          if (target.hp < player.hp){
                            target.recover(player.hp-target.hp);
                          } else if (target.hp > player.hp){
                            target.loseHp(target.hp-player.hp);
                          }
                        } else if (result.control == '灵力'){
                          game.log(target,'的灵力调整为'+player.lili);
                          if (target.lili < player.lili){
                            target.gainlili(player.lili-target.lili);
                          } else if (target.lili > player.lili){
                            target.loselili(target.lili-player.lili);
                          }
                        }
                      }
                    },
                    ai:{
                      order:10,
                      result:{
                          target:function(player,target){
                            var num = 0;
                            if (player.hp <= target.hp) num --;
                            if (player.lili <= target.lili) num --;
                            if (num == -2) return -1;
                            else return 2;
                          }
                        },
                      threaten:1.5,
                    },
                  },
                  tianwen:{
                      audio:2,
                      cost:0,
                      spell:['tianwen_skill','tianwen_use'],
                      trigger:{player:['phaseBeginStart']},
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
                        var choice = 1;
                          player.chooseControl(list,function(){
                                    return choice;
                              }).set('prompt','消耗任意点灵力').set('choice',choice);
                          'step 1'
                          if (result.control){
                              player.loselili(result.control);
                              player.storage.tianwen = result.control;
                              player.turnOver();
                          }
                      },
                      check:function(event,player){
                        return player.lili > 3;
                      },
                  },
                  tianwen_skill:{
                    direct:true,
                    trigger:{player:'phaseBegin'},
                    content:function(){
                      'step 0'
                      var num = player.storage.tianwen*2;
                      player.chooseCardButton(num,true,get.cards(num),'按顺序将卡牌置于牌堆顶（先选择的在上）').set('ai',function(button){
                        return get.value(button.link);
                      });
                      'step 1'
                      if(result.bool){
                        player.storage.tianwen = [];
                        var list=result.links.slice(0);
                        while(list.length){
                          ui.cardPile.insertBefore(list.pop(),ui.cardPile.firstChild);
                        }
                      }
                      'step 2'
                      player.judge();
                      'step 3'
                      player.storage.tianwen.push(result.card);
                      if (player.storage.tianwen.length == 1) event.goto(2);
                      'step 4'
                      player.chooseCardButton(player.storage.tianwen,'天文密葬法：获得一张判定牌，该牌效果视为另一张牌的效果，直到回合结束', true).set('ai',function(button){
                            return get.value(button.link);
                        });
                      'step 5'
                      if (result.bool){
                        player.gain(result.links[0]);
                        player.$gain2(result.links[0]);
                        player.storage.tianwen.remove(result.links[0]);
                        player.storage.tianwen_use = player.storage.tianwen[0][2];
                        player.storage.tianwen = result.links[0];
                      }
                    }
                  },
                  tianwen_use:{
                    direct:true,
                    trigger:{player:'useCardToBegin'},
                    filter:function(event,player){
                      return event.card == player.storage.tianwen;
                    },
                    onremove:function(player){
                      delete player.storage.tianwen;
                      delete player.storage.tianwen_use;
                    },
                    content:function(){
                      if (player.canUse({name:player.storage.tianwen_use},targets)){
                        trigger.cancel();
                        player.useCard({name:player.storage.tianwen_use.name,color:get.color(trigger.card),number:get.number(trigger.card)},targets);
                      }
                    },
                  },
                  nanti:{
                    audio:2,
                    enable:'phaseUse',
                    usable:1,
                    selectTarget:1,
                    position:'he',
                    filterCard:function(){
                      return true;
                    },
                    selectCard:[1,Infinity],
                    discard:false,
                    lose:false,
                    filterTarget:function(card,player,target){
                      return player != target;
                    },
                    content:function(){
                      'step 0'
                      player.showCards(cards);
                      player.chooseControl('牌名长度','花色','点数','种类','属性',function(){
                        var list = ['牌名长度','花色','点数','种类','属性'];
                        list.randomSort();
                        return list[0];
                      },true);
                      'step 1'
                      if (result.control){
                        game.log(player,'选择了'+result.control);
                        var valid = [];
                        for (var i in cards){
                          switch(result.control){
                            case '牌名长度': valid.push(get.translation(cards[i].name).length); break;
                            case '花色': valid.push(get.suit(cards[i])); break;
                            case '点数': valid.push(get.number(cards[i])); break;
                            case '种类': valid.push(get.type(cards[i])); break;
                            case '属性': valid.push(get.subtype(cards[i])); break;
                          }
                        }
                        if (targets[0].name == 'eirin') game.trySkillAudio('nanti', player, true, 3);
                        targets[0].chooseCard('是否交给'+get.translation(player)+'一张与'+get.translation(result.cards)+'不同'+result.control+'的牌？','he',function(card){
                            switch(result.control){
                              case '牌名长度': return !valid.contains(get.translation(card.name).length); break;
                              case '花色': return !valid.contains(get.suit(card)); break;
                              case '点数': return !valid.contains(get.number(card)); break;
                              case '种类': return !valid.contains(get.type(card)); break;
                              case '属性': return !valid.contains(get.subtype(card)); break;
                            }
                        }).set('ai',function(card){
                          return 5 - get.value(card);
                        });
                      } else {
                        event.finish();
                      }
                      'step 2'
                      if (result.bool){
                        targets[0].showCards(result.cards);
                        game.log(targets[0],'成功回答了难题！');
                        player.gain(result.cards);
                        targets[0].$give(result.cards,player);
                        player.discard(cards);
                      } else {
                        game.log(targets[0],'没有回答出难题。');
                        targets[0].damage('thunder');
                        player.choosePlayerCard(targets[0],'he',
                          (Math.min(targets[0].countCards('he'), cards.length)),'重铸没有回答出难题的角色的牌', true);
                      }
                      'step 3'
                      if (result.bool && result.links.length){
                        game.log(targets[0],'重铸了',result.links);
                        targets[0].recast(result.links);
                      }
                    },
                    check:function(card){
                      if(ui.selected.cards.length<1) return 7-get.value(card);
                      return -0.1;
                    },
                    ai:{
                      order:4,
                      expose:0.2,
                      result:{
                        target:-1,
                        player:function(player,target){
                          return 0;
                        }
                      },
                    },
                  },
                  poxiao:{
                    audio:2,
                    trigger:{player:'phaseEnd'},
                    filter:function(event,player){
                      return player.countCards('he');
                    },
                    content:function(){
                      'step 0'
                      var suits = [];
                      var cards = player.getCards('he');
                      for (var i = 0; i < cards.length; i ++){
                        if (get.suit(cards[i]) && !suits.contains(get.suit(cards[i]))) suits.push(get.suit(cards[i]))
                      }
                      player.chooseCard('hej',[1,player.countCards('hej')],'破晓：可以重铸任意张牌',true).set('ai',function(card){
                            if (suits.length == 4){
                                var suit=get.suit(card);
                                for(var i=0;i<ui.selected.cards.length;i++){
                                  if(get.suit(ui.selected.cards[i])==suit) return false;
                                }
                                return true;
                            }
                            return 7-get.value(card) && !get.subtype(card) == 'defense';
                        });
                      'step 1'
                      if (result.bool && result.cards.length){
                          var suits = [];
                          for (var i = 0; i < result.cards.length; i ++){
                            if (get.suit(result.cards[i]) && !suits.contains(get.suit(result.cards[i]))) suits.push(get.suit(result.cards[i]))
                          }
                          player.recast(result.cards);
                          if (suits.length == 4){
                              player.addSkill('poxiao_2');
                          }
                      }
                    },
                  },
                  poxiao_2:{
                    trigger:{player:'phaseAfter'},
                    filter:function(event,player){
                      return player.lili > 0;
                    },
                    content:function(){
                      player.removeSkill('poxiao_2');
                      player.loselili();
                      player.insertPhase();
                    },
                    prompt:'是否发动【破晓】进行一个额外的回合？',
                    check:function(event, player){
                      return !player.isTurnedOver();
                    },
                  },
                  yongye:{
                    audio:2,
                      cost:1,
                      group:'yongye_die',
                      spell:['yongye1','yongye2','yongye3','yongye4'],
                      infinite:true,
                      trigger:{player:'phaseBeginStart'},
                      filter:function(event,player){
                          return player.lili > lib.skill.yongye.cost;
                      },
                      content:function(){
                          player.loselili(lib.skill.yongye.cost);
                          player.turnOver();
                      },
                      check:function(){
                        return false;
                      },
                  },
                  yongye_die:{
                    audio:'yongye',
                    cost:1,
                    infinite:true,
                     spell:['yongye1','yongye2','yongye3','yongye4'],
                      enable:'chooseToUse',
                      filter:function(event,player){
                         if(event.type!='dying') return false;
                         if(player!=event.dying) return false;
                         return player.lili > lib.skill.yongye.cost;
                      },
                      content:function(){
                          player.loselili(lib.skill.yongye.cost);
                          player.turnOver();
                      },
                      check:function(event,player){
                        return !player.countCards('h',{name:'tao'});
                      },
                      ai:{
                        order:1,
                          skillTagFilter:function(player){
                            if(player.hp>0) return false;
                          },
                          save:true,
                          result:{
                            player:function(player){
                              if(player.hp==0) return 10;
                              if(player.hp<=2&&player.countCards('he')<=1) return 10;
                              return 0;
                            }
                          },
                          threaten:function(player,target){
                            return 0.6;
                          }
                      },
                  },
                  yongye1:{
                    direct:true,
                    trigger:{player:'phaseEnd'},
                    init:function(player){
                      player.nodying=true;
                      player.hp=0;
                      player.update();
                    },
                    onremove:function(player){
                      delete player.nodying;
                      player.die();
                    },
                    content:function(){
                      player.loselili();
                    }
                  },
                  yongye2:{
                    audio:2,
                    trigger:{player:'phaseUseBegin'},
                    filter:function(event,player){
                      return player.lili <= 3 && player.countCards('hej');
                    },
                    content:function(){
                      var cards = player.getCards('hej');
                      player.recast(cards);
                    },
                    prompt:'是否重铸所有牌？',
                    check:function(event,player){
                      return !player.countCards('e');
                    },
                  },
                  yongye3:{
                    audio:2,
                    direct:true,
                    trigger:{player:'phaseBegin'},
                    filter:function(event,player){
                      return player.lili <= 2;
                    },
                    content:function(){
                      player.drawSkill(2);
                    }
                  },
                  yongye4:{
                    audio:2,
                    direct:true,
                    trigger:{player:'useCard'},
                    filter:function(event,player){
                      return player.lili <= 1;
                    },
                    content:function(){
                      player.draw();
                    }
                  },
                  yuhuo:{
                    audio:2,
                    enable:'chooseToUse',
                    subSkill:{
                         clear:{
                              trigger:{player:'phaseAfter'},
                              silent:true,
                              content:function(){
                                   delete player.storage.yuhuo_type;
                              }
                         },
                         count:{
                              trigger:{player:'shaBegin'},
                              silent:true,
                              filter:function(){
                                   return _status.event.skill=='yuhuo';
                              },
                              content:function(){
                                   if (!player.storage.yuhuo_type) player.storage.yuhuo._type = [get.type(trigger.card)];
                                   else player.storage.yuhuo._type.push(get.type(trigger.card));
                              },
                         },
                    },
                    group:['yuhuo_clear','yuhuo_count','yuhuo_2'],
                    filterCard:function(card,player){
                         if (!player.storage.yuhuo_type) return true;
                         return (!player.storage.yuhuo_type.contains(get.type(card)));
                    },
                    position:'he',
                    viewAs:{name:'sha'},
                    prompt:'将一张牌当【轰！】使用',
                    check:function(card){return 4-get.value(card)},
                    ai:{
                         skillTagFilter:function(player){
                              if(get.zhu(player,'shouyue')){
                                   if(!player.countCards('he')) return false;
                              }
                              else{
                                   if(!player.countCards('he',{color:'red'})) return false;
                              }
                         },
                         respondSha:true,
                    }  
                  },
                  yuhuo_2:{
                    audio:2,
                    trigger:{player:'shaBegin'},
                    filter:function(event,player){
                         return player.hp > 0;
                    },
                    content:function(){
                         player.loseHp();
                         player.getStat().card.sha--;
                    },
                    check:function(event,player){
                      return (player.lili > 1 || player.hp > 2) && player.countCards('h', {name:'sha'});
                    },
                  },
                  businiao:{
                      audio:2,
                      cost:1,
                      group:'businiao_die',
                      spell:['businiao2'],
                      trigger:{player:'phaseBegin'},
                      filter:function(event,player){
                          return player.lili > lib.skill.businiao.cost;
                      },
                      content:function(){
                          player.loselili(lib.skill.businiao.cost);
                          player.turnOver();
                      },
                      check:function(){
                        return false;
                      },
                  },
                  businiao_die:{
                    audio:'businiao',
                    cost:1,
                     spell:['businiao2'],
                      enable:'chooseToUse',
                      filter:function(event,player){
                         if(event.type!='dying') return false;
                         if(player!=event.dying) return false;
                         return player.lili > lib.skill.businiao.cost;
                      },
                      content:function(){
                          player.loselili(lib.skill.businiao.cost);
                          player.turnOver();
                      },
                      check:function(){
                        return true;
                      },
                      ai:{
                        order:1,
                          skillTagFilter:function(player){
                            if(player.hp>0) return false;
                          },
                          save:true,
                          result:{
                            player:function(player){
                              if(player.hp==0) return 10;
                              if(player.hp<=2&&player.countCards('he')<=1) return 10;
                              return 0;
                            }
                          },
                          threaten:function(player,target){
                            return 0.6;
                          }
                      },
                  },
                  businiao2:{
                    init:function(player){
                      player.nodying=true;
                      if (player.hp <= 0) player.hp=0;
                      player.update();
                    },
                    onremove:function(player){
                      delete player.nodying;
                      if (player.hp <= 0) {
                        player.hp=0;
                        player.dying({});
                      }
                      player.update();
                    },
                    audio:2,
                    trigger:{global:'phaseEnd'},
                    forced:true,
                    content:function(){
                        'step 0'
                        if (player.lili > 0){
                            player.chooseToUse('【不死鸟之羽】：你可以消耗1点灵力，使用一张【轰！】；可以重复此流程。',{name:'sha'},function(card,player,target){
                                return player.canUse('sha', target, true);
                            });
                        }
                        'step 1'
                        if (result.bool){
                            player.loselili();
                            if (player.lili > 0) event.goto(0);
                        }
                        'step 2'
                        if (player.hp < 1){
                            player.recover(1-player.hp);
                            player.update();
                        }
                        if (player.countCards('h') < 3) player.draw(3 - player.countCards('h'));
                        player.loselili(player.lili);
                    },
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
                  yechong1_audio1:'风暴来了！',
                  yechong1_audio2:'虫虫咬她们！',
                  wriggle_die:'用杀虫剂是犯规啦！',
                  mystia:'米斯蒂亚',
                  shiming:'失明',
                  shiming_2:'失明',
                  shiming_audio1:'我来让你获得夜盲症吧！',
                  shiming_audio2:'我来教教你暗夜的恐怖吧！',
                  shiming_info:'一回合一次，出牌阶段，或你受到伤害后，你可以令一名角色直到当前回合结束：其不能以此法以外的方式使用牌；其需要使用牌时，可以随机展示一张手牌：若可以使用，本次结算中其可以使用该牌；否则，其弃置之，并可以重复此流程。',
                  zangsong:'葬颂',
                  zangsong_info:'一回合一次，你因弃置牌失去牌后，可以弃置一名角色一张牌。',
                  zangsong_audio1:'永别了！',
                  zangsong_audio2:'葬身在这夜晚下吧！',
                  wuye:'午夜中的合唱指挥',
                  wuye_audio1:'米斯蒂亚的独唱会开始啦！',
                  wuye_audio2:'独家专辑正在绝赞发售中！',
                  wuye_info:'符卡技（2）<永续>你成为攻击范围内的角色的牌的目标时，你可以指定一名其他角色，将目标转移给其。',
                  mystia_die:'别忘了光顾我的烧烤店啊~',
                  keine:'慧音',
                  jiehuo:'解惑',
                  jiehuo_info:'一回合一次，一名角色的出牌阶段，一张牌因你使用/打出进入弃牌堆时，可以消耗1点灵力，令一名角色获得之。',
                  jiehuo_audio1:'这是这张牌的正确使用方式，知道了吗？',
                  jiehuo_audio2:'这是下次考试的知识点，一定要记住。',
                  jiehuo_audio3:'慧音辛苦了，不要忘记休息啊。',
                  richuguo:'日出国的天子',
                  richuguo_info:'符卡技（3）<限定><永续>你可以弃置三张不同的类型的牌来代替符卡消耗；准备阶段，你可以指定一名角色，重置其体力值，灵力值，和手牌数；你进入决死状态时，重置此符卡技。',
                  richuguo_audio1:'「日出国之天子」！',
                  richuguo_audio2:'我不允许这种事情的存在！',
                  keine_die:'要是是满月，怎么会输给你们呢……',
                  reimu:'灵梦',
                  yinyang:'阴阳',
                  yinyang_audio1:'太极生两仪，两仪生四象，后面的我不知道了。',
                  yinyang_audio2:'啊，多谢款待！请下次一定还要再来！',
                  spin_card:'将当前角色一张牌置入牌堆底',
                  yinyang_info:'一名角色的结束阶段，若你本回合使用过牌，或受到过弹幕伤害，你可以选择一项：摸一张牌；或展示当前回合角色的一张牌，并将之置于牌堆底。',
                  mengdie:'梦蝶',
                  mengdie_audio1:'不知周之梦为胡蝶与？胡蝶之梦为周与？',
                  mengdie_info:'觉醒技，准备阶段，若你的手牌数不大于你已受伤值，你将灵力值补至上限，并获得〖幻境〗',
                  huanjing_reimu_audio1:'哼，别忘了我可会这招！',
                  huanjing_reimu_audio2:'嗯……这里附近应该有张【葱】来着？',
                  mengxiang:'梦想封印',
                  mengxiang1:'梦想封印',
                  mengxiang_info:'符卡技（2）<永续>你使用牌指定目标后，可以选择一项：令目标角色：受到1点灵击伤害；或弃置一张牌；若其有明置异变牌，改为选择两项。',
                  mengxiang_audio1:'灵符「梦想封印」！',
                  mengxiang_audio2:'以博丽巫女之名，我会退治你这个异变！',
                  mengxiang1_audio1:'走你！',
                  mengxiang2_audio2:'下次异变之前，可要问问我的意见啊？',
                  lilidamage:'受到1点灵击伤害',
                  reimu_die:'啊啊，肚子饿了，回去了回去了。',
                  marisa:'魔理沙',
                  liuxing:'流星',
                  liuxing_info:'摸牌阶段，你可以少摸至少一张牌，令你的攻击范围+X（X为以此法少摸的牌数），直到结束阶段；若如此做，结束阶段，你视为使用一张不消耗灵力的【顺手牵羊】。',
                  liuxing_audio1:'无论你有没有准备好！',
                  liuxing_audio2:'让开，流星雨要来了！',
                  liuxing_shun:'流星（顺手牵羊）',
                  liuxing_shun_audio1:'这就稍微借我一下吧？',
                  liuxing_shun_audio2:'等到我死了我就还给你！',
                  liuxing_shun_audio3:'真是的，告诉你多少遍了，我已经没有值钱东西可以拿了啊……',
                  liuxing_shun_audio4:'黑白老鼠又来了啊……',
                  xingchen:'星尘',
                  xingchen_info:'若你的手牌数等于体力值：你可以将一张手牌当作【轰！】使用/打出；以此法使用的【轰！】不计次数。',
                  xingchen_audio1:'先打再说！',
                  xingchen_audio2:'接下我的爱之魔炮ze！',
                  stardust:'星屑幻想',
                  stardust_audio1:'魔符「星屑幻想」！',
                  stardust_audio2:'现在开始，这就是我的舞台了！',
                  stardust_info:'符卡技（X）（X为任意值）你本回合使用下一张牌时：若有强化效果，执行强化效果X次；若不是装备牌，可以无视距离限制指定X名额外目标。',
                  marisa_die:'没事，反正这个夜晚永远不会结束的！',
                  tewi:'帝',
                  mitu:'迷途',
                  mitu_storage:'迷途（挖坑）',
                  mitu_storage_audio1:'嘘——',
                  mitu_storage_audio2:'这里什么都没有哟，什么都没有',
                  mitu_audio1:'中计啦，你个傻瓜！',
                  mitu_audio2:'真的是笨蛋呢你！',
                  mitu_info:'弃牌阶段开始时，若你没有“伏”，你可以将一张牌扣置于角色牌上，称为“伏”；你攻击范围内的一名角色成为牌的目标后，你可以展示同名“伏”，令来源判定；若为黑色，弃置“伏”，弃置来源一张牌，且若目标为你，令该牌对你无效。',
                  kaiyun:'开运',
                  kaiyun_1:'开运',
                  kaiyun_2:'开运',
                  kaiyun_info:'一名角色的出牌阶段开始时，其可以交给你一张牌：获得一张【神佑】技能牌，且其不能对你或其以外的角色使用牌，直到回合结束。',
                  yuangu:'远古的骗术',
                  yuangu_audio1:'狡兔可是有三窟的——',
                  yuangu_audio2:'哈哈，来玩到尽兴为止吧！',
                  yuangu_info:'符卡技（2）<永续>一名角色的判定牌生效前，你可以打出一张牌替换之；无视【迷途】中的“弃置"伏"”。',
                  tewi_die:'你这家伙真的不好玩！',
                  reisen:'铃仙',
                  huanshi:'幻视',
                  huanshi_2:'幻视',
                  huanshi_info:'一回合每名角色限一次，出牌阶段，你可以扣置一张手牌，当做一种攻击牌或控场牌使用；其成为该牌目标后，可将一张牌当作防御牌打出，亮出扣置牌并令之无效：若原牌不为此防御牌的合法目标，则你对其使用原牌。',
                  huanshi_audio1:'你也一同陷入狂乱吧！',
                  huanshi_audio2:'来，看着我的眼睛——',
                  huanshi_audio3:'啊，师、师匠，我、我不是故意的！',
                  huanshi_audio4:'公、公主大人……？！我、我只是开个玩笑而已啦……',
                  zhenshi:'真实之月（隐形满月）',
                  zhenshi_1:'真实之月（隐形满月）',
                  zhenshi_info:'符卡技（1）<永续>你攻击范围内角色成为攻击牌的唯一目标时，你可以弃置一张牌，将包括其的至多3名角色牌扣置并洗混；来源明置一张：将目标转移给明置的角色；然后将这些牌调整为原状态。',
                  zhenshi_audio1:'散符「真实之月(Invisible Full Moon)」！',
                  zhenshi_audio2:'真实和虚假的区别，你分的出来吗？',
                  reisen_die:'啊啊，要被师匠骂了',
                  kaguya:'辉夜',
                  nanti:'难题',
                  nanti_audio1:'这些难题可已经劝退了无数的人哟。',
                  nanti_audio2:'你，解的开多少个呢？',
                  nanti_audio3:'啊，这种东西对于永琳来说只是小儿科对吧~',
                  nanti_info:'一回合一次，出牌阶段，你可以展示任意张手牌，并声明一项：牌名的字数，花色，点数，属性，或类型，然后令一名其他角色选择一项：交给你一张该项与你展示的牌均不同的牌，并弃置展示的牌；或令你重铸其与展示的牌等量张牌，并对其造成1点灵击伤害。',
                  poxiao:'破晓',
                  poxiao_2:'破晓',
                  poxiao_info:'结束阶段，你可以重铸任意张牌；若你以此法重铸了4张不同花色的牌，你可以消耗1点灵力，然后进行一个额外的回合。',
                  poxiao_audio1:'黎明就要到来了。',
                  poxiao_audio2:'曙光就在前方呢。',
                  yongye:'永夜归返',
                  yongye2:'永夜归返',
                  yongye_die:'永夜归返',
                  yongye_info:'符卡技（1）<极意><终语>结束阶段，你消耗1点灵力；若你的灵力值不大于：4，你不会坠机；3，出牌阶段开始时，你可以重铸所有牌；2，准备阶段，你摸2张技能牌；1，你使用一张牌后，摸一张牌。',
                  kaguya_die:'=w=明天晚上再见！',
                  eirin:'永琳',
                  zhaixing:'摘星',
                  zhaixing_audio1:'等【星】实装了，我就真的可以摘【星】了呢。',
                  zhaixing_audio2:'就算是星星，我也可以摘下来给你。',
                  zhaixing_audio3:'啊，还真摘了颗星星来啊，谢谢永琳！',
                  zhaixing_info:'结束阶段，你可以观看牌堆顶，或技能牌堆顶的X张牌（X为你本回合使用的牌花色数）；你将其中一张交给一名角色，其余按任意顺序置于该牌堆顶或底。',
                  lanyue:'揽月',
                  lanyue_audio1:'药也可以这么用的呢。',
                  lanyue_audio2:'即使是月亮，也不会离开我的手心之中。',
                  lanyue_audio3:'即使是我也逃不出永琳的手掌心呢w',
                  lanyue_info:'一回合一次，出牌阶段，你可以令攻击范围内离你最远的一名角色选择：体力值或灵力值中与你不同的一项，然后将该项调整至与你相同',
                  tianwen:'天文秘葬法',
                  tianwen_audio1:'秘術「天文密葬法」。',
                  tianwen_audio2:'所谓星空，也只不过是试验场罢了。',
                  tianwen_skill:'天文秘葬法',
                  tianwen_info:'符卡技（X）（X为任意值，至少为1）准备阶段，你可以观看牌堆顶的2X张牌，以任意顺序置于牌堆顶，然后进行两次判定：你获得其中一张，该牌的效果视为与另一张相同，直到回合结束。',
                  eirin_die:'哎，陪你们跳舞就陪到这里了吧。',
                  mokou:'妹红',
                  yuhuo:'狱火',
                  yuhuo_2:'狱火',
                  yuhuo_audio1:'给老娘变成烤串吧！',
                  yuhuo_audio2:'火起！',
                  yuhuo2_audio1:'即使是变成灰烬……！',
                  yuhuo2_audio2:'我的怨念可不止这点程度！',
                  yuhuo_info:'你可以将一张牌当作【轰！】使用，每回合每种类型限一次；你使用【轰！】指定目标后，可以失去1点体力，令之不算次数。',
                  businiao:'不死鸟之羽',
                  businiao_die:'不死鸟之羽',
                  businiao_audio1:'凤凰涅槃！欲火焚身！',
                  businiao_audio2:'炎符「不死鸟之羽」！',
                  businiao2:'不死鸟之羽',
                  businiao2_audio1:'……浴火重生*',
                  businiao2_audio2:'好像读错字了……？',
                  businiao_info:'符卡技（1）<终语>你不坠机；当前回合的结束阶段，你可以消耗1点灵力值，并使用一张攻击牌；你可以重复此流程任意次；然后，你须消耗所有灵力，将体力回复至1，并将手牌补至3张。',
                  mokou_die:'啊——。有点太硌牙了呢。',
            },
      };
});