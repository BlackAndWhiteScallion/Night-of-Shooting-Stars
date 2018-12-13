game.import('character',function(lib,game,ui,get,ai,_status){
	return {
		name:'baka',
		connect:true,
		character:{
                  cirno:['female','4',3,['jidong','bingbi','perfect']],
                  daiyousei:['female','5',3,['zhufu','zhiyue']],
		},
		characterIntro:{
		    cirno:'',
                daiyousei:'',
		},       
		perfectPair:{
		},
		skill:{
                  jidong:{
                        trigger:{player:'phaseBegin'},
                        forced:true,
                        audio:2,
                        content:function(){
                              "step 0";
                              player.chooseTarget(get.prompt('jidong'),true).ai=function(target){
                                    if (player.getCards('h','sha') == 0) return player;
                                    else return get.attitude(player,target)<0;
                               };
                              "step 1"
                              if(result.bool){
                                    event.target = result.targets[0];
                                    player.choosePlayerCard(event.target,'he',true);
                              }
                              "step 2"
                              if (result.bool && result.cards.length){
                                    event.target.showCards(result.cards);
                                    //var cards = result.cards[0].clone();
                                    var cards = game.createCard(result.cards[0].name, result.cards[0].suit, result.cards[0].number);
                                    event.target.addTempSkill('jidong_2');
                                    if (!event.target.storage.jidong_2) event.target.storage.jidong_2 = [];
                                    event.target.storage.jidong_2.push(result.cards[0]);
                                    event.target.markSkill('jidong_2');
                                    event.target.syncStorage('jidong_2');
                                    if (get.position(result.cards[0]) == 'e'){
                                          var info=get.info(result.cards[0]);
                                          if(info.skills){
                                              for(var i=0;i<info.skills.length;i++){
                                                  player.removeSkillTrigger(info.skills[i]);
                                              }
                                          }
                                    }
                              }
                        },
                  },
                  jidong_2:{
                        popup:false,
                        intro:{content:'cards'},
                        mod:{
                              cardEnabled:function(card,player){
                                    if(card == player.storage.jidong_2[0] && _status.event.skill!='jidong_2') return false;
                              },
                              cardUsable:function(card,player){
                                    if(card == player.storage.jidong_2[0] && _status.event.skill!='jidong_2') return false;
                              },
                              cardRespondable:function(card,player){
                                    if(card == player.storage.jidong_2[0] && _status.event.skill!='jidong_2') return false;
                              },
                              cardSavable:function(card,player){
                                    if(card == player.storage.jidong_2[0] && _status.event.skill!='jidong_2') return false;
                              }
                        },
                        onremove:function(player){
                                var es=player.getCards('e');
                                for(var j=0;j<es.length;j++){
                                    var info=get.info(es[j]);
                                    if(info.skills && es[j] == player.storage.jidong_2[0]){
                                        for(var i=0;i<info.skills.length;i++){
                                            player.addSkillTrigger(info.skills[i]);
                                        }
                                    }
                                }
                                delete player.storage.jidong_2;
                            },
                        enable:'chooseToUse',
                        filterCard:function(card, player){
                              return card == player.storage.jidong_2[0];
                        },
                        position:'he',
                        viewAs:{name:'sha'},
                        prompt:'将一张【急冻】牌当【轰！】使用',
                        check:function(card){
                              return 4-get.value(card);
                        },
                  },
                  bingbi:{
                        audio:2,
                        trigger:{target:'useCardToBefore'},
                        usable:1,
                        direct:true,
                        filter:function(event,player){
                              return event.card.name=='sha' && player.countCards('h','sha') > 0;
                        },
                        content:function(){
                              "step 0"
                              player.chooseCard(get.prompt('bingbi'),function(card){
                                    return card.name=='sha';
                              }).set('ai',function(card){
                                    return 1;
                              });
                              "step 1"
                              if(result.bool){
                                    player.respond(result.cards,'highlight');
                                    trigger.cancel();
                                    if (player.storage._mubiao) player.draw(player.storage._mubiao + 1);
                                    else player.draw();
                              }
                        },
                        ai:{
                              effect:{
                                    target:function(card,player,target,current){
                                          if(card.name=='sha'&&get.attitude(player,target)<0){
                                                if(_status.event.name=='xiangle') return;
                                                var bs=player.getCards('h',{type:'basic'});
                                                if(bs.length<2) return 0;
                                                if(player.hasSkill('jiu')||player.hasSkill('tianxianjiu')) return;
                                                if(bs.length<=3&&player.countCards('h','sha')<=1){
                                                      for(var i=0;i<bs.length;i++){
                                                            if(bs[i].name!='sha'&&get.value(bs[i])<7){
                                                                  return [1,0,1,-0.5];
                                                            }
                                                      }
                                                      return 0;
                                                }
                                                return [1,0,1,-0.5];
                                          }
                                    }
                              }
                        },
                  },
                  perfect:{
                      audio:2,
                      cost:1,
                      spell:['perfect_1'],
                      trigger:{player:['phaseBegin']},
                      filter:function(event,player){
                          return player.lili > lib.skill.perfect.cost;
                      },
                      content:function(){
                          player.loselili(lib.skill.perfect.cost);
                          player.turnOver();
                      },
                      check:function(event,player){
                        return player.getCards('h').length < 3;
                      },
                  },
                  perfect_1:{
                        global:'perfect_2',
                  },
                  perfect_2:{
                        mod:{
                              cardEnabled:function(card,player){
                                    if(_status.event.skill!='perfect_2'&&card.name!='sha') return false;
                              },
                              cardUsable:function(card,player){
                                    if(_status.event.skill!='perfect_2'&&card.name!='sha') return false;
                              },
                              cardRespondable:function(card,player){
                                    if(_status.event.skill!='perfect_2'&&card.name!='sha') return false;
                              },
                              cardSavable:function(card,player){
                                    if(_status.event.skill!='perfect_2'&&card.name!='sha') return false;
                              },
                        },
                        audio:2,
                        enable:['chooseToUse','chooseToRespond'],
                        position:'h',
                        filterCard:true,
                        viewAs:{name:'sha'},
                        check:function(){return 1},
                        ai:{
                              effect:{
                                    target:function(card,player,target,current){
                                          if(get.tag(card,'respondSha')&&current<0) return 0.6
                                    }
                              },
                              respondSha:true,
                              order:4,
                              useful:-1,
                              value:-1
                        }
                  },
                  zhufu:{
                        audio:2,
                        enable:'phaseUse',
                        usable:1,
                        filter:function(event,player){
                              return player.lili>0;
                        },
                        check:function(card){
                              return 9-get.value(card)
                        },
                        filterTarget:function(card,player,target){
                              if(target.hp>=target.maxHp) return false;
                              if(player.hp>target.hp) return false;
                              return true;
                        },
                        selectTarget:function(){
                              var player=_status.event.player;
                              if (player.lili > 1) return 1;
                              if (player.lili == 1) return -1;
                        },
                        content:function(){
                              player.loselili();
                              target.recover();
                        },
                        ai:{
                              order:9,
                              result:{
                                    target:function(player,target){
                                          if(target.hp==1) return 5;
                                          if(player==target) return 5;
                                          return 2;
                                    }
                              },
                              threaten:2
                        }
                  },
                  zhiyue:{
                        audio:2,
                        enable:'phaseUse',
                        usable:1,
                        filterCard:true,
                        selectCard:1,
                        discard:false,
                        prepare:'give',
                        filterTarget:function(card,player,target){
                              return player!=target;
                        },
                        content:function(){
                              "step 0"
                              target.gain(cards,player);
                              player.chooseBool(get.prompt('zhiyue')).set('choice',player.lili>2);
                              'step 1'
                              if(result.bool){
                                    player.loselili();
                                    player.draw();
                              }
                        },
                        ai:{
                              order:function(skill,player){
                                    if(player.lili>2&&player.countCards('h')>1){
                                          return 10;
                                    }
                                    return 1;
                              },
                              result:{
                                    target:function(player,target){
                                          if(target.hasSkillTag('nogain')) return 0;
                                          var nh=target.countCards('h');
                                          var np=player.countCards('h');
                                          if(player.countCards('h')<=1){
                                                if(nh>=np-1&&np<=player.hp) return 0;
                                          }
                                          return Math.max(1,5-nh);
                                    }
                              },
                              threaten:0.8
                        }
                  }
            },
            translate:{
                  cirno:'琪露诺',
                  jidong:'急冻',
                  jidong_2:'急冻',
                  jidong_audio1:'就像青蛙一样！',
                  jidong_audio2:'接好这个大冰块！',
                  jidong_info:'锁定技，准备阶段，你可以展示一名角色的一张牌；该牌效果无效，且只能当作【轰！】使用，直到结束阶段。',
                  bingbi:'冰壁',
                  bingbi_audio1:'哈哈！你中我的圈套啦！',
                  bingbi_audio2:'哈哈哈！我是无敌的！无敌的！',
                  bingbi_info:'一回合一次，你成为一名角色的【轰！】的目标后，可以打出一张【轰！】，令之对你无效；然后摸X张牌（X为其本回合对你使用的牌数量）。',
                  perfect:'完美冻结',
                  perfect_audio1:'凍符「完美冻结」！',
                  perfect_audio2:'我可是最强的！这就证明给你看！',
                  perfect_info:'符卡技（1）出牌阶段开始时，你可以令所有角色：所有手牌均视为【轰！】。',
                  perfect_2:'完美冻结',
                  cirno_die:'我还会回来的！',
                  daiyousei:'大妖精',
                  zhufu:'祝福',
                  zhufu_audio1:'祝你早日康复——♪',
                  zhufu_audio2:'下次要注意一点的说——♪',
                  zhufu_info:'一回合一次，出牌阶段，你可以消耗1点灵力，令一名体力值不大于你的角色回复1点体力；若你的灵力值为1，“一名”视为“所有”。',
                  zhiyue:'织月',
                  zhiyue_audio1:'这是送给你的——♪',
                  zhiyue_audio2:'祝你武运昌盛——♪',
                  zhiyue_info:'一回合一次，出牌阶段，你可以交给一名其他角色一张牌；然后，你可以消耗1点灵力，摸一张牌。',
            },
      };
});