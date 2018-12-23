'use strict';
game.import('character',function(lib,game,ui,get,ai,_status){
	return {
		name:'sb',
		connect:true,
		character:{
			aya:['female','2',4,[]],
         hetate:['female','2',3,['nianxie','jilan','lianxu']],
		},
		characterIntro:{
			aya:'全名射命丸文，妖怪之山的天狗记者。以持有幻想乡最快的报导速度而闻名（也以报导的片面性和捏造闻名）。',
         hetate:'全名姬海棠果，妖怪之山的天狗记者。以不用出门就能写报导的念写能力而闻名（也以报导的过期性闻名）。',
		},       
		perfectPair:{
		},
      skill:{
         nianxie_storage:{
                        init:function(player){
                              player.storage.nianxie_storage=[];
                        },
                        popup:false,
                        forced:true,
                        mark:true,
                        intro:{
                              content:function(storage,player){
                                    var str = '';
                                    for (var i = 0; i < player.storage.nianxie_storage.length; i ++){
                                          str += get.translation(player.storage.nianxie_storage[i]) + ',';
                                    }
                                    return str;
                              }
                        },
                        trigger:{global:'loseEnd'},
                        filter:function(event,player){
                             for(var i=0;i<event.cards.length;i++){
                                    if(get.position(event.cards[i])=='d'){
                                          return true;
                                    }
                              }
                              return false;
                        },
                        content:function(){
                              for (var i=0; i < trigger.cards.length; i ++){
                                    if(get.position(trigger.cards[i])=='d'){
                                          if (!player.storage.nianxie_storage){
                                                player.storage.nianxie_storage = [get.suit(trigger.cards[i])];
                                          } else {
                                                if (!player.storage.nianxie_storage.contains(get.suit(trigger.cards[i]))){
                                                      player.storage.nianxie_storage.push(get.suit(trigger.cards[i]));
                                                }
                                          }
                                    }    
                              }
                              if (_status.currentPhase == player){
                                    player.markSkill('nianxie_storage');
                                    player.syncStorage('nianxie_storage');
                              }
                        },
         },
         nianxie_remove:{
                        popup:false,
                        forced:true,
                        trigger:{global:'phaseBegin'},
                        filter:function(event,player){
                              return true;
                        },
                        content:function(){
                              if (_status.currentPhase == player){
                                    player.markSkill('nianxie_storage');
                                    player.syncStorage('nianxie_storage');
                              } else {
                                    player.storage.nianxie_storage = [];
                                    player.unmarkSkill('nianxie_storage');
                                    player.syncStorage('nianxie_storage');
                              }
                        },
         },
         nianxie:{
                        group:['nianxie_storage','nianxie_remove'],
                        audio:2,
                        trigger:{player:'phaseEnd'},
                        frequent:true,
                        content:function(){
                              'step 0'
                              player.judge(function(card){
                                 if (!player.storage.nianxie_storage.contains(get.suit(card))) return -1; 
                                 return 1;   
                              });
                              'step 1'
                              event.card = result.card;
                              if (player.storage.nianxie_storage.contains(get.suit(result.card))){
                                    player.chooseTarget(true,'选择一名角色送出'+get.translation(result.card),function(card,player,target){
                                          return true;
                                    }).set('ai',function(target){
                                          var att=get.attitude(_status.event.player,target);
                                          return att;
                                    });
                              } else {
                                 event.finish();
                              }
                              'step 2'
                              if (result.targets.length){
                                 player.line(result.targets,'green');
                                 result.targets[0].gain(event.card,'gain2');
                              }
                        },
         },
         jilan:{
                        mod:{
                              globalTo:function(from,to,distance){
                                    if (to.lili > from.lili && to.hasSkill('jilan')) return distance+10000;
                                    return distance;
                              }
                        }
         },
         lianxu:{
                      audio:2,
                      cost:0,
                      spell:['lianxu2'],
                      trigger:{player:'phaseBegin'},
                      filter:function(event,player){
                          return player.lili > lib.skill.lianxu.cost;
                      },
                      check:function(event,player){
                        var att = 0;
                        att += player.lili;
                        att += (4 - player.hp);
                        att += (player.hp - player.getCards('h').length);
                        return att > 3;
                      },
                      content:function(){
                          player.loselili(lib.skill.lianxu.cost);
                          player.turnOver();
                      },
         },
         lianxu2:{
            group:['lianxu3'],
            enable:'phaseUse',
            audio:2,
            filter:function(event,player){
               var cards=player.getCards('h');
               for (var i in cards){ 
                  return true;
               }
               return false;
            },
            selectCard:1,
            filterCard:function(card,player){
               return player.storage.lianxu3.contains(get.number(card)) || player.storage.lianxu3.contains(get.suit(card));
            },
            content:function(){
               player.loselili();
               player.draw(2);
            },
            ai:{
               basic:{
                  order:5,
               },
               result:{
                  target:2,
               },
               tag:{
                  draw:2
               }
            }
         },
         lianxu3:{
            init:function(player){
               player.storage.lianxu3=[];
            },
            popup:false,
            forced:true,
            mark:true,
            intro:{
               content:function(storage,player){
                  var str = '';
                                    for (var i = 0; i < player.storage.lianxu3.length; i ++){
                                          str += get.translation(player.storage.lianxu3[i]) + ',';
                                    }
                                    return str;
                              }
                        },
                        trigger:{global:'loseEnd'},
                        filter:function(event,player){
                             for(var i=0;i<event.cards.length;i++){
                                    if(get.position(event.cards[i])=='d'){
                                          return true;
                                    }
                              }
                              return false;
                        },
                        content:function(){
                              for (var i=0; i < trigger.cards.length; i ++){
                                    if(get.position(trigger.cards[i])=='d'){
                                          if (!player.storage.lianxu3){
                                                player.storage.lianxu3 = [get.number(trigger.cards[i]), get.suit(trigger.cards[i])];
                                          } else {
                                                if (!player.storage.lianxu3.contains(get.number(trigger.cards[i]))){
                                                      player.storage.lianxu3.push(get.number(trigger.cards[i]));
                                                }
                                                if (!player.storage.lianxu3.contains(get.suit(trigger.cards[i]))){
                                                      player.storage.lianxu3.push(get.suit(trigger.cards[i]));
                                                }
                                          }
                                    }    
                              }
                              player.markSkill('lianxu3');
                              player.syncStorage('lianxu3');
                        },
         },
         
      },
      translate:{
         hetate:'果果',
         nianxie:'念写',
         nianxie_info:'结束阶段，你可以判定；若判定牌与本回合或上回合进入弃牌堆的一张牌的花色相同，你令一名角色获得判定牌。',
         nianxie_storage:'念写 花色',
         nianxie_bg:'念',
         nianxie_audio1:'',
         nianxie_audio2:'',
         jilan:'极岚',
                 jilan_info:'锁定技，你视为不在灵力值小于你的角色的攻击范围内。',
                  lianxu:'连续拍摄',
                  lianxu_info:'符卡技（0）出牌阶段，你可以消耗1点灵力，并弃置一张与本回合进入弃牌堆的一张牌花色或点数相同的牌：摸两张牌。',
                  lianxu2:'连续拍摄',
                  lianxu2_info:'出牌阶段，你可以消耗1点灵力，并弃置一张与本回合进入弃牌堆的一张牌花色或点数相同的牌：摸两张牌。',
                  lianxu3:'连续拍摄 花色&点数',
                  lianxu3_bg:'连',
            },
      };
});