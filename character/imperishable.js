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
                         console.log(player.storage.qipai.length);
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
                            console.log('d');
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
                                    return 1;
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
                      player.chooseControl(list).set('prompt',get.prompt('mengxiang'));
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
                      spell:['businiao1','businiao2'],
                      trigger:{player:'phaseBegin'},
                      filter:function(event,player){
                          return player.lili > lib.skill.businiao.cost;
                      },
                      content:function(){
                          player.loselili(lib.skill.businiao.cost);
                          player.turnOver();
                      },
                      check:false,
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
                      check:true,
                  },
                  businiao2:{
                    init:function(){
                      player.nodying=true;
                      player.hp=0;
                      player.update();
                    },
                    onremove:function(){
                      delete player.nodying;
                      if (player.hp <= 0) player.hp=-1;
                      player.update();
                    },
                    audio:2,
                    trigger:{global:'phaseEnd'},
                    forced:true,
                    content:function(){
                        'step 0'
                        if (player.lili > 0){
                            player.chooseToUse('【不死鸟之羽】：你可以消耗1点灵力，使用一张【轰！】；可以重复此流程。',{name:'sha'},function(card,player,target){
                                return player.canUse('sha',target, true);
                            });
                        }
                        'step 1'
                        if (result.bool){
                            player.loselili();
                            event.goto(0);
                        }
                        'step 2'
                        player.loselili(player.lili);
                        if (player.hp < 1) player.recover(1-player.hp);
                        player.draw(3 - player.countCards('h'));
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
                  wriggle_die:'用杀虫剂是犯规啦！',
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
                  mengxiang_info:'符卡技（2）<永续>你使用牌指定目标后，可以选择一项：令目标角色：受到1点灵击伤害；或弃置一张牌；若其有明置异变牌，改为选择两项。',
                  mengxiang_audio1:'灵符「梦想封印」！',
                  mengxiang_audio2:'以博丽巫女之名，我会退治你这个异变！',
                  reimu_die:'啊啊，肚子饿了，回去了回去了。',
                  mokou:'妹红',
                  yuhuo:'狱火',
                  yuhuo_2:'狱火',
                  yuhuo_audio1:'给老娘变成烤串吧！',
                  yuhuo_audio2:'火起！',
                  yuhuo2_audio1:'即使是变成灰烬……！',
                  yuhuo2_audio2:'我的怨念可不止这点程度！',
                  yuhuo_info:'你可以将一张牌当作【轰！】使用，每回合每种类型限一次；你使用【轰！】指定目标后，可以失去1点体力，令之不算次数。',
                  businiao:'不死鸟之羽',
                  businiao_audio1:'凤凰涅槃！欲火焚身！',
                  businiao_audio2:'炎符「不死鸟之羽」！',
                  businiao2:'不死鸟之羽',
                  businiao2_audio1:'……浴火重生*',
                  businiao2_audio2:'无论是多少次，无论是多少次！',
                  businiao_info:'符卡技（1）<终语>你不坠机；当前回合的结束阶段，你可以消耗1点灵力值，并使用一张攻击牌；你可以重复此流程任意次；然后，你须消耗所有灵力，将体力回复至1，并将手牌补至3张。',
            },
      };
});