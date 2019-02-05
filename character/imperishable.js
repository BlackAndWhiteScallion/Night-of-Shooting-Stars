'use strict';
game.import('character',function(lib,game,ui,get,ai,_status){
	return {
		name:'imperishable',
		connect:true,
		character:{
			   wriggle:['female','4',3,['yingguang','yechong']],
                  mystia:['female','4',3,['shiming','wuye']],
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
                reisen:'全名铃仙·优昙华院·因蟠。从月亮逃下，躲入幻想乡的一只月兔妖。因为在永远亭中是最下级的位置，总是被其他人欺负。持有令人解释不清楚程度的能力。<br> <b>画师：k2pudding</b>',
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
                        filter:function(event, player){
                              if (player.hasSkill('yechong1')) return true;
                              if (player.getStat().skill.yingguang>=1) return false;
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
                  shiming:{
                    audio:2,
                    trigger:{player:['phaseBegin','damageEnd']},
                    content:function(){
                      'step 0'
                      player.chooseTarget('失明：洗混一名角色手牌').set('ai',function(target){
                            return -get.attitude(_status.event.player,target);
                          });
                      'step 1'
                      if (result.bool){
                        player.logSkill(event.name,result.targets);
                        result.targets[0].addTempSkill('shiming_2');
                        result.targets[0].addTempSkill('shiming_3');
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
                    silent:true,
                    popup:false,
                      enable:'chooseToUse',
                      group:'shiming_4',
                      filter:function(event,player){
                        return player.countCards('h') > 0 && !player.storage.shiming;
                      },
                      content:function(){
                        "step 0"
                        var next = player.choosePlayerCard('h','失明：试图使用一张牌？', player,'invisible');
                        next.set('ai',function(card){
                            if (_status.event.player.countCards('h') > _status.event.player.hp) return 2;
                            return 0;
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
                      check:function(){
                        return true;
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
                      return player.hp < 2;
                    },
                  },
                  wuye2:{
                          audio:2,
                          trigger:{target:'useCardtoBefore'},
                          direct:true,
                          priority:5,
                          filter:function(event,player){
                              return get.distance(player,event.player,'attack')<=1;
                          },
                          content:function(){
                            "step 0"
                            player.chooseTarget('午夜中的合唱指挥：你可以将'+get.translation(trigger.card)+'转移给一名其他角色').ai=function(target){
                              return trigger.player.canUse(trigger.card, target);
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
                          ai:{
                            effect:{
                              target:function(card,player,target){
                                if(target.countCards('he')==0) return;
                                if(card.name!='sha') return;
                                var min=1;
                                var friend=get.attitude(player,target)>0;
                                var vcard={name:'shacopy',nature:card.nature,suit:card.suit};
                                var players=game.filterPlayer();
                                for(var i=0;i<players.length;i++){
                                  if(player!=players[i]&&
                                    get.attitude(target,players[i])<0&&
                                    target.canUse(card,players[i])){
                                    if(!friend) return 0;
                                    if(get.effect(players[i],vcard,player,player)>0){
                                      if(!player.canUse(card,players[0])){
                                        return [0,0.1];
                                      }
                                      min=0;
                                    }
                                  }
                                }
                                return min;
                              }
                            }
                          }
                    },
                  jiehuo:{
                      trigger:{player:'useCardAfter'},
                      usable:1,
                      audio:2,
                      filter:function(event,player){
                        if(event.parent.parent.name!='phaseUse') return false;
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
                            //return get.value(event.card) >= 5;
                          return player.lili > 1;
                      },
                  },
                  richuguo:{
                         audio:2,
                         cost:3,
                         spell:['richuguo1','richuguo2'],
                         roundi:true,
                         trigger:{player:'phaseBeginStart'},
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
                            player.storage.richuguo=false;
                          }
                       },
                       check:function(event, player){
                         return player.hp < 2;
                       },
                     },
                  richuguo1:{
                        trigger:{player:['phaseBegin']},
                        frequent:true,
                        content:function(){
                              'step 0'
                              player.chooseTarget([1,1],get.prompt('richuguo'),true,function(card,player,target){
                                return true;
                              }).ai=function(target){
                                    return get.attitude(player, target);
                              }
                              'step 1'
                              if (result.targets){
                                    result.targets[0].hp = result.targets[0].maxHp;
                                    result.targets[0].lili = parseInt(lib.character[result.targets[0].name][1])
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
                                    if(trigger.player.countCards('hej')&&get.attitude(player,trigger.player)<0){
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
                                    game.log(get.translation(player)+'将'+get.translation(trigger.player)+'的'+get.translation(result.links[0])+'置入牌堆底');
                                    trigger.player.showCards(result.links[0]);
                                    if (get.type(result.links[0]) == 'delay'){
                                      ui.skillPile.appendChild(result.links[0]);
                                    } else {
                                      ui.cardPile.appendChild(result.links[0]);
                                    }
                                    trigger.player.lose(result.links[0]);
                                    trigger.player.update();
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
                      roundi:true,
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
                    audio:2,
                    trigger:{player:'useCardToBegin'},
                    filter:function(event,player){
                      return event.target;
                    },
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
                      player.chooseControl(list).set('prompt',get.translation(player)+'对你发动了【梦想封印】!');
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
                      if (event.target == player) return 0;
                      return -get.attitude(player,event.target);
                    },
                  },
                  liuxing:{
                    audio:2,
                    trigger:{player:'phaseDrawBefore'},
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
                            if (player.countCards('h')) return 0;
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
                            return distance-from.storage.liuxing;
                        }
                    }
                  },
                  liuxing_shun:{
                    audio:2,
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
                            return -get.attitude(player,target) && target.countCards('hej');
                         });
                         'step 1'
                         if (result.bool && result.targets){
                            player.useCard({name:'shunshou'},result.targets[0],false);
                         }
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
                    prompt:'将一张牌当【轰！】使用或打出',
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
                                  return 1;
                            }).set('prompt','消耗任意点灵力');
                        'step 1'
                        if (result.control){
                            player.loselili(result.control);
                            ui.backgroundMusic.src = lib.assetURL+'audio/background/marisa.mp3'
                            lib.config.background_music = 'marisa';
                            //lib.config.volumn_background = 100;
                            lib.config.musicchange = 'off';
                            player.storage.stardust = result.control;
                            if (!player.storage._enhance) player.storage._enhance = result.control;
                            else player.storage._enhance += result.control;
                            player.turnOver();
                        }
                    },
                    check:function(event,player){
                      return player.lili > 3;
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
                          selectCard:1,
                          filterTarget:function(card,player,target){
                            return target.hasSkill('kaiyun');
                          },
                          forced:true,
                          ai2:function(target){
                            return get.attitude(_status.event.player,target);
                          }
                        });
                        'step 1'
                        if(result.targets&&result.targets[0]){
                          result.targets[0].gain(result.cards,player);
                          player.$give(result.cards.length,result.targets[0]);
                          result.targets[0].say('哦嘞，这个是给我的？');  
                        }
                        for(var i=0;i<ui.skillPile.childNodes.length;i++){
                          if (ui.skillPile.childNodes[i].name == 'shenyou'){
                            player.gain(ui.skillPile.childNodes[i]);
                            break;
                          } else if (i == ui.skillPile.childNodes.length -1){
                              result.targets[0].say('技能牌堆里并没有【神佑】，呵呵——');                      
                          }
                        }
                        player.addTempSkill('kaiyun_3');
                        result.targets[0].addTempSkill('kaiyun_4');
                    },
                    check:function(event,player){
                      if(player.countCards('h')>=player.hp) return false;
                      return game.hasPlayer(function(current){
                        return current!=player&&current.hasSkill('kaiyun')&&get.attitude(player,current)>0;
                      });
                    },
                  },
                  kaiyun_3:{
                    mod:{
                        playerEnabled:function(card,player,target){
                          if(player!=target || !target.hasSkill('kaiyun_4')) return false;
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
                      if (!player.storage.mitu) return false;
                      if (event.card.name != player.storage.mitu.name) return false;
                      if (player.hasSkill('yuangu_1')){
                        return get.distance(event.target,player,'attack')<=1;
                      } else {
                        return event.target == player;
                      }
                    },
                    content:function(event,player){
                      'step 0'
                      player.showCards(player.storage.mitu);
                      trigger.player.judge(function(card){
                        if (get.color(card) == 'black') return -2;
                        return 0;
                      });
                      'step 1'
                      if (result.bool == false){
                        player.discardPlayerCard(trigger.player,'hej',true);
                        if(trigger.target == player) trigger.cancel();
                        if(!player.hasSkill('yuangu_1')) {
                          player.storage.mitu.discard();
                          player.$throw(player.storage.mitu);
                          delete player.storage.mitu;
                          player.unmarkSkill('mitu');
                        }
                      }
                    },
                    check:function(){return true},
                    intro:{
                        mark:function(dialog,content,player){
                          if(content){
                            if(player==game.me||player.isUnderControl()){
                              dialog.addAuto(content);
                            }
                            else{
                              return '这里有个坑哟';
                            }
                          }
                        },
                        content:function(content,player){
                          if(content){
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
                    filter:function(event,player){
                      return player.countCards('he') && !player.storage.mitu;
                    },
                    content:function(){
                      'step 0'
                      player.chooseCard('he',get.prompt('mitu')).set('ai',function(card){
                            return card.name == 'sha';
                          });
                      'step 1'
                      if(result.cards&&result.cards.length){
                        player.lose(result.cards,ui.special);
                        player.storage.mitu=result.cards[0];
                        player.logSkill('mitu');
                        player.syncStorage('mitu');
                        player.markSkill('mitu');
                      }
                    },
                    check:function(event,player){
                      return player.countCards('h',{name:'sha'});
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
                      return player.lili > 3 && player.storage.mitu;
                    },
                  },
                  yuangu_1:{
                    // 结果这玩意就是个标记啊……
                  },
                  huanshi:{
                    audio:2,
                    enable:'phaseUse',
                    usable:1,
                    discard:false,
                    filterCard:true,
                    filter:function(event,player){
                      return player.countCards('hej');
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
                              return player.canUse(event.fakecard,target,true);
                          },true,'选择'+get.translation(card.name)+'的目标').set('ai',function(target){
                              return get.effect(target,card,player,player);
                          });
                      } else {
                          event.finish();
                      }       
                      'step 2'
                      if(result.bool&&result.targets&&result.targets.length){
                        for (var i = 0; i < result.targets.length; i ++){
                          result.targets[0].addTempSkill('huanshi_2','useCardAfter');
                        }
                        player.storage.huanshi = [cards[0]];
                        player.useCard(event.fakecard,result.targets);
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
                  huanshi_2:{
                    trigger:{target:'useCardToBegin'},
                    filter:function(event,player){
                      return event.getParent().getParent().name == 'huanshi';
                    },
                    check:function(){
                      return true;
                    },
                    content:function(){
                      'step 0'
                      player.chooseCard('he','将一张牌当作一种防御牌使用').set('ai',function(card){
                            return 7-get.value(card);
                        });
                      'step 1'
                      if (!result.cards) event.finish();
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
                      'step 2'
                      if(result.bool&&result.links){
                        player.$throw(event.card,500);
                        game.log(get.translation(player)+'将'+get.translation(event.card)+'当作'+get.translation(result.links[0][2])+'打出');
                        trigger.cancel();
                        if (trigger.player.storage.huanshi){
                            var rcard = trigger.player.storage.huanshi[0];
                            if (trigger.player.canUse(rcard, player)){
                              if (result.links[2] == 'shan' && trigger.player.storage.huanshi[0][2] != 'sha' ||
                                result.links[2] == 'wuxie' && get.type(trigger.player.storage.huanshi[0]) != 'trick')
                              trigger.player.useCard(rcard,player);
                            }
                        }
                      } else {
                          event.finish();
                      }
                    },
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
                      //return player.lili > 3 && player.countCards('hej') > 3;
                      return true;
                    },
                  },
                  zhenshi_1:{
                    trigger:{global:'useCardToBefore'},
                    filter:function(event,player){
                      return get.subtype(event.card) == 'attack' && get.distance(player,event.target,'attack')<=1 && event.targets.length == 1;
                    },
                    check:function(event,player){
                      //return player.countCards('hej') > 2 && get.attitude(player, event.target);
                      return true;
                    },
                    content:function(){
                      'step 0'
                      var next=player.chooseToDiscard('为使用月亮的力量而弃置一张牌吧');
                        next.ai=function(card){
                            return 9-get.value(card);
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
                        var rand = [game.createCard('?','',''),game.createCard('?','','')];
                        if (result.targets.length == 2){
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
                        game.log(get.translation(trigger.card)+'转移给了'+get.translation(event.targets[0]));
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
                            for(var i=0;i<3;i++){
                                cards.push(ui.skillPile.childNodes[i]);
                            }
                        }
                        event.cards = cards;
                        player.chooseCardButton(cards,'可以选择一张牌交给一名角色',1);
                      }
                      'step 2'
                      if (result.links.length){
                        event.card = result.links;
                        player.chooseTarget('将'+get.translation(result.links)+'交给一名角色').set('ai',function(target){
                              return get.attitude(_status.event.player,target);
                          });;
                      }
                      'step 3'
                      if (result.targets.length){
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
                          var judges=player.node.judges.childNodes;
                          var stopped=false;
                          if(!player.countCards('h','wuxie')){
                            for(var i=0;i<judges.length;i++){
                              var judge=get.judge(judges[i]);
                              cards.sort(function(a,b){
                                return judge(b)-judge(a);
                              });
                              if(judge(cards[0])<0){
                                stopped=true;break;
                              }
                              else{
                                top.unshift(cards.shift());
                              }
                            }
                          }
                          var bottom;
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
                      if (list.length == 0) event.finish();
                      else target.chooseControl(function(){
                              return _status.event.choice;
                            },true).set('choiceList',list).set('choice',choice);
                      "step 1"
                      if(result.control){
                        if (result.control == '体力'){
                          game.log(get.translation(target)+'的体力调整为'+player.hp);
                          target.hp = player.hp;
                          target.update();
                        } else if (result.control == '灵力'){
                          game.log(get.translation(target)+'的灵力调整为'+player.lili);
                          target.lili = player.lili;
                          target.update();
                        }
                      }
                    },
                    ai:{
                      order:8.5,
                      result:{
                          target:function(player,target){
                            if (player.hp > target.hp || player.lili > target.hp) return get.attitude(player,target);
                            return -get.attitude(player,target);
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
                        game.log(get.translation(player)+'选择了'+result.control);
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
                        targets[0].chooseCard('是否交给'+get.translation(player)+'一张与'+get.translation(result.cards)+'不同'+result.control+'的牌？','he',function(card){
                            switch(result.control){
                              case '牌名长度': return !valid.contains(get.translation(card.name).length); break;
                              case '花色': return !valid.contains(get.suit(card)); break;
                              case '点数': return !valid.contains(get.number(card)); break;
                              case '种类': return !valid.contains(get.type(card)); break;
                              case '属性': return !valid.contains(get.subtype(card)); break;
                            }
                        }).set('ai',function(card){
                          return get.value(card);
                        });
                      } else {
                        event.finish();
                      }
                      'step 2'
                      if (result.bool){
                        targets[0].showCards(result.cards);
                        game.log(get.translation(targets[0])+'成功回答了难题！');
                        player.gain(result.cards);
                        player.discard(cards);
                      } else {
                        game.log(get.translation(targets[0])+'没有回答出难题。');
                        targets[0].damage('thunder');
                        player.choosePlayerCard(targets[0],'he',
                          (Math.min(targets[0].countCards('he'), cards.length)),'重铸没有回答出难题的角色的牌', true);
                      }
                      'step 3'
                      if (result.bool && result.links.length){
                        game.log(get.translation(targets[0])+'重铸了'+get.translation(result.links));
                        targets[0].$throw(result.links);
                        for (var i = 0; i < result.links.length; i ++){
                          result.links[0].discard();
                        }
                        targets[0].draw(result.links.length);
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
                      threaten:0.5
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
                      player.chooseCard('he',[1,player.countCards('he')],'破晓：可以重铸任意张牌',true).set('ai',function(card){
                            return 7-get.value(card);
                        });
                      'step 1'
                      if (result.bool && result.cards.length){
                          player.$throw(result.cards);
                          var suits = [];
                          for (var i = 0; i < result.cards.length; i ++){
                            if (get.suit(result.cards[i]) && suits.contains(get.suit(result.cards[i]))) suit.push(get.suit(result.cards[i]))
                            result.cards[i].discard();
                          }
                          game.log(get.translation(trigger.player)+'重铸了'+get.translation(result.cards));
                          player.draw(result.cards.length);
                          if (suits.length == 4){
                              player.addSkill('poxiao_2');
                          }
                      }
                    },
                  },
                  poxiao_2:{
                    direct:true,
                    trigger:{player:'phaseAfter'},
                    filter:function(event,player){
                      return player.lili > 0;
                    },
                    content:function(){
                      player.removeSkill('poxiao_2');
                      player.loselili();
                      player.insertPhase();
                    },
                  },
                  yongye:{
                    audio:2,
                      cost:1,
                      group:'yongye_die',
                      spell:['yongye1','yongye2','yongye3','yongye4'],
                      infinite:true,
                      trigger:{player:'phaseBegin'},
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
                      return player.lili <= 3 && player.countCards('he');
                    },
                    content:function(){
                      var cards = player.getCards('he');
                       player.$throw(cards);
                          for (var i = 0; i < cards.length; i ++){
                             result.cards[i].discard();
                          }
                          game.log(get.translation(player)+'重铸了'+get.translation(cards));
                          player.draw(cards.length);
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
                      player.gain(ui.skillPile.childNodes[0],'draw2');
                      player.gain(ui.skillPile.childNodes[0],'draw2');
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
                            event.goto(0);
                        }
                        'step 2'
                        player.loselili(player.lili);
                        if (player.hp < 1){
                            player.recover(1-player.hp);
                            player.update();
                        }
                        if (player.countCards('h') < 3) player.draw(3 - player.countCards('h'));
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
                  yechong1_audio1:'',
                  yechong_audio2:'',
                  wriggle_die:'用杀虫剂是犯规啦！',
                  mystia:'米斯蒂亚',
                  shiming:'失明',
                  shiming_2:'失明',
                  shiming_audio1:'我来让你获得夜盲症吧！',
                  shiming_audio2:'我来教教你暗夜的恐怖吧！',
                  shiming_info:'准备阶段，或你受到伤害后，你可以令一名角色获得以下效果，直到当前回合结束：其不能以此技能以外的方式使用牌；其需要使用牌时，可以洗混其手牌；其不能查看其中暗置牌；其展示其中一张：若可以使用，本次结算中其可以使用该牌；否则，其弃置之，并可以重复此流程。',
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
                  mengdie_audio2:'现在想放弃的话还来的及哟？',
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
                  discard:'弃牌',
                  lilidamage:'受到1点灵击伤害',
                  reimu_die:'啊啊，肚子饿了，回去了回去了。',
                  marisa:'魔理沙',
                  liuxing:'流星',
                  liuxing_info:'摸牌阶段，你可以少摸至少一张牌，令你的攻击范围+X（X为以此法少摸的牌数），直到结束阶段；若如此做，结束阶段，你视为使用一张强化的【顺手牵羊】。',
                  liuxing_audio1:'无论你有没有准备好！',
                  liuxing_audio2:'让开，流星雨要来了！',
                  liuxing_shun:'流星（顺手牵羊）',
                  liuxing_shun_audio1:'这就稍微借我一下吧？',
                  liuxing_shun_audio2:'等到我死了我就还给你！',
                  xingchen:'星尘',
                  xingchen_info:'若你的手牌数等于体力值：你可以将一张手牌当作【轰！】使用/打出；以此法使用的【轰！】不计次数。',
                  xingchen_audio1:'先打再说！',
                  xingchen_audio2:'接下我的爱之魔炮ze！',
                  stardust:'星屑幻想',
                  stardust_audio1:'魔符「星屑幻想」！',
                  stardust_audio2:'现在开始，这就是我的舞台了！',
                  stardust_info:'符卡技（X）（X为任意值）你本回合使用下一张牌时：若有强化效果，执行强化效果X次；若不是装备牌，可以无视距离限制指定X名额外目标。',
                  marisa_die:'没事，这夜晚还很长呢！',
                  tewi:'帝',
                  mitu:'迷途',
                  mitu_storage_audio1:'嘘——',
                  mitu_storage_audio2:'这里什么都没有哟，什么都没有',
                  mitu_audio1:'中计啦，你个傻瓜！',
                  mitu_audio2:'真的是笨蛋呢你！',
                  mitu_info:'弃牌阶段开始时，若你没有“伏”，你可以将一张牌扣置于角色牌上，称为“伏”；你成为牌的目标后，你可以展示同名“伏”，令来源判定；若为黑色，弃置“伏”，弃置来源一张牌，并令该牌对你无效。',
                  kaiyun:'开运',
                  kaiyun_1:'开运',
                  kaiyun_2:'开运',
                  kaiyun_info:'一名角色的出牌阶段开始时，其可以交给你一张牌：获得一张【神佑】技能牌，且其不能对你或其以外的角色使用牌，直到回合结束。',
                  yuangu:'远古的骗术',
                  yuangu_audio1:'狡兔可是有三窟的——',
                  yuangu_audio2:'哈哈，来玩到尽兴为止吧！',
                  yuangu_info:'符卡技（2）<永续>【迷途】中的“你成为牌的目标后”视为“你攻击范围内的一名角色成为牌的目标后”；无视【迷途】中的“弃置"伏"”。',
                  tewi_die:'你这家伙真的不好玩！',
                  reisen:'铃仙',
                  huanshi:'幻视',
                  huanshi_2:'幻视',
                  huanshi_info:'一回合一次，你可以扣置一张手牌，当做一种攻击牌或控场牌使用；一名角色成为此牌的目标后，其可将一张牌当做一种防御牌打出。若如此做，你的扣置牌无效且你亮出此牌；若此牌不为此防御牌的合法目标，则你对其使用此牌。',
                  zhenshi:'真实之月（隐形满月）',
                  zhenshi_1:'真实之月（隐形满月）',
                  zhenshi_info:'符卡技（1）【永续】你攻击范围内角色成为攻击牌的唯一目标时，你可以弃置一张牌，将包括其的至多3名角色牌扣置并洗混；来源明置一张：将目标转移给明置的角色；然后将这些牌调整为原状态。',
                  kaguya:'辉夜',
                  nanti:'难题',
                  nanti_audio1:'这些难题可已经劝退了无数的人哟。',
                  nanti_audio2:'你，解的开多少个呢？',
                  nanti_info:'一回合一次，出牌阶段，你可以展示任意张手牌，并声明一项：牌名的字数，花色，点数，属性，或类型，然后令一名其他角色选择一项：交给你一张该项与你展示的牌均不同的牌，并弃置展示的牌；或令你重铸其与展示的牌等量张牌，并对其造成1点灵击伤害。',
                  poxiao:'破晓',
                  poxiao_info:'结束阶段，你可以重铸任意张牌；若你以此法重铸了4张不同花色的牌，你可以消耗1点灵力，然后进行一个额外的回合。',
                  poxiao_audio1:'黎明就要到来了。',
                  poxiao_audio2:'曙光就在前方呢。',
                  yongye:'永夜归返',
                  yongye2:'永夜归返',
                  yongye_die:'永夜归返',
                  yongye_info:'符卡技（1）<极意><终语>结束阶段，消你耗1点灵力；若你的灵力值不大于：4，你不会坠机；3，出牌阶段开始时，你 可以重铸所有牌；2，准备阶段，你摸2张技能牌；1，你使用一张牌后，摸一张牌。',
                  kaguya_die:'=w=明天晚上再见！',
                  eirin:'永琳',
                  zhaixing:'摘星',
                  zhaixing_audio1:'哈哈，吃药还是做不到这个程度的。',
                  zhaixing_audio2:'就算是星星，我也可以摘下来给你。',
                  zhaixing_info:'结束阶段，你可以观看牌堆顶，或技能牌堆顶的X张牌（X为你本回合使用的牌花色数）；你将其中一张交给一名角色，其余按任意顺序置于该牌堆顶或底。',
                  lanyue:'揽月',
                  lanyue_audio1:'药也可以这么用的呢。',
                  lanyue_audio2:'即使是月亮，也不会离开我的手心之中。',
                  lanyue_info:'一回合一次，出牌阶段，你可以令攻击范围内离你最远的一名角色选择：体力值或灵力值中与你不同的一项，然后将该项调整至与你相同',
                  tianwen:'天文秘葬法',
                  tianwen_audio1:'秘術「天文密葬法」。',
                  tianwen_audio2:'所谓星空，也只不过是试验场罢了。',
                  tianwen_skill:'天文秘葬法',
                  tianwen_info:'符卡技（X）（X为任意值，至少为1）准备阶段，你可以观看牌堆顶的2X张牌，以任意顺序置于牌堆顶，然后进行两次判定：你获得其中一张，该牌的效果视为与另一张相同，直到回合结束。',
                  eirin_die:'哎，我也没力气永远陪你们跳舞的。',
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
                  businiao2_audio2:'无论是第几次，无论是多少次！',
                  businiao_info:'符卡技（1）<终语>你不坠机；当前回合的结束阶段，你可以消耗1点灵力值，并使用一张攻击牌；你可以重复此流程任意次；然后，你须消耗所有灵力，将体力回复至1，并将手牌补至3张。',
                  mokou_die:'啊——。有点太硌牙了呢。',
            },
      };
});