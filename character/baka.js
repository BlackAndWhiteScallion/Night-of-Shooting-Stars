game.import('character',function(lib,game,ui,get,ai,_status){
	return {
		name:'baka',
		connect:true,
		character:{
                  cirno:['female','4',3,[]],
                  daiyousei:['female','5',3,['zhufu','zhiyue']],
		},
		characterIntro:{
		    cirno:'',
                daiyousei:'',
		},       
		perfectPair:{
		},
		skill:{
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
                  daiyousei:'大妖精',
                  zhufu:'祝福',
                  zhufu_info:'一回合一次，出牌阶段，你可以消耗1点灵力，令一名体力值不大于你的角色回复1点体力；若你的灵力值为1，“一名”视为“所有”。',
                  zhiyue:'织月',
                  zhiyue_info:'一回合一次，出牌阶段，你可以交给一名其他角色一张牌；然后，你可以消耗1点灵力，摸一张牌。',
            },
      };
});