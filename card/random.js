game.import('card',function(lib,game,ui,get,ai,_status){
	return {
		name:'random',
		connect:false,
        card:{
            holysword:{
                fullskin:true,
                type:'equip',
                subtype:'equip1',
                cost:5,
                ai:{
                    basic:{
                        equipValue:10
                    }
                },
                skills:['ziheng_skill','jinu_skill','lianji_skill'],
            },
            spell_wuyashenxiang:{
                type:'trick',
                subtype:'support',
                fullimage:true,
                enable:true,
                cost:-1,
                filterTarget:function(card,player,target){
                    return target==player;
                },
                selectTarget:-1,
                content:function(){
                    'step 0'
                    player.chooseControl('法术牌','基本牌').ai=function(){
                        return Math.random()<0.5?'法术牌':'基本牌';
                    }
                    'step 1'
                    var list=[];
                    var bool=(result.control=='法术牌');
                    for(var i in lib.card){
                        if(bool){
                            if(lib.card[i].type=='trick'){
                                list.push(i);
                            }
                        }
                        else{
                            if(lib.card[i].type=='basic'){
                                list.push(i);
                            }
                        }
                    }
                    list=list.randomGets(3);
                    var cards=[];
                    for(var i=0;i<list.length;i++){
                        cards.push(game.createCard(list[i]));
                    }
                    player.chooseCardButton(cards,'选择一张加入手牌',true);
                    'step 2'
                    player.gain(result.links,'draw');
                },
                ai:{
                    order:2,
                    value:5,
                    useful:5,
                    result:{
                        player:1
                    },
                }
            },
            spell_xiaoshi:{
                type:'trick',
                subtype:'disrupt',
                fullimage:true,
                enable:true,
                cost:-2,
                selectTarget:1,
                filterTarget:function(card,player,target){
                    return true;
                },
                content:function(){
                    'step 0'
                    target.gain(target.getCards('e'),'gain2');
                    'step 1'
                    var dh=target.countCards('h')-player.countCards('h');
                    if(dh>0){
                        target.discard(target.getCards('h').randomGets(dh));
                    }
                },
                ai:{
                    order:1,
                    value:1,
                    useful:1,
                    result:{
                        target:function(player,target){
                            if(target.countCards('he')>=player.countCards('h')) return -1;
                            return 0;
                        }
                    }
                }
            },
            spell_piaoqie:{
                type:'trick',
                subtype:'disrupt',
                fullimage:true,
                enable:true,
                cost:-1,
                filterTarget:function(card,player,target){
                    return target!=player && target.countCards('h');
                },
                selectTarget:1,
                content:function(){
                    var cards=target.getCards('h').randomGets(2);
                    var list=[];
                    for(var i=0;i<cards.length;i++){
                        list.push(game.createCard(cards[i]));
                    }
                    if(list.length){
                        player.gain(list,'draw');
                    }
                },
                ai:{
                    order:0.5,
                    result:{
                        player:1
                    }
                }
            },
            gw_xinsheng:{
                type:'trick',
                subtype:'disrupt',
                fullimage:true,
                enable:function(card,player){
                    return game.hasPlayer(function(current){
                        return !current.isUnseen();
                    });
                },
                selectTarget:1,
                filterTarget:function(){
                    return true;
                },
                contentBefore:function(){
                    player.$skill('新生','legend','metal', true);
                    game.delay(2);
                },
                content:function(){
                    'step 0'
                    event.aitarget=target;
                    var list=[];
                    for(var i in lib.character){
                        if(!lib.filter.characterDisabled(i)&&!lib.filter.characterDisabled2(i)){
                            list.push(i);
                        }
                    }
                    var players=game.players.concat(game.dead);
                    for(var i=0;i<players.length;i++){
                        list.remove(players[i].name);
                        list.remove(players[i].name1);
                        list.remove(players[i].name2);
                    }
                    var dialog=ui.create.dialog('选择一张角色牌','hidden');
                    dialog.add([list.randomGets(12),'character']);
                    player.chooseButton(dialog,true).ai=function(button){
                        if(get.attitude(player,event.aitarget)>0){
                            return get.rank(button.link,true);
                        }
                        else{
                            return -get.rank(button.link,true);
                        }
                    };
                    'step 1'
                    event.nametarget=result.links[0];
                    var hp=target.hp;
                    target.reinit(target.name,event.nametarget);
                    target.hp=Math.min(hp,target.maxHp);
                    target.update();
                    player.line(target,'green');
                    'step 3'
                    game.triggerEnter(target);
                },
                contentAfter:function(){
                    var evt=_status.event.getParent('phaseUse');
                    if(evt&&evt.name=='phaseUse'){
                        evt.skipped=true;
                    }
                },
                ai:{
                    value:8,
                    useful:[6,1],
                    result:{
                        player:1
                    },
                    order:0.5,
                }
            },
            gw_zumoshoukao:{
                type:'trick',
                fullimage:true,
                subtype:'disrupt',
                enable:true,
                filterTarget:function(card,player,target){
                    return !target.hasSkill('fengyin');
                },
                content:function(){
                    target.addTempSkill('fengyin');
                },
                ai:{
                    value:[4.5,1],
                    useful:[4,1],
                    result:{
                        target:function(player,target){
                            var threaten=get.threaten(target,player,true);
                            if(target.hasSkill('fengyin')){
                                return 0;
                            }
                            if(target.hasSkillTag('maixie_hp')){
                                threaten*=1.5;
                            }
                            return -threaten;
                        }
                    },
                    order:9.5,
                }
            },
            gw_youer:{
                type:'trick',
                subtype:'disrupt',
                enable:true,
                fullimage:true,
                filterTarget:function(card,player,target){
                    return target!=player&&target.countCards('h')>0;
                },
                content:function(){
                    'step 0'
                    var cards=target.getCards('h');
                    target.lose(cards,ui.special);
                    target.storage.gw_youer=cards;
                    target.addSkill('gw_youer');
                    'step 1'
                    player.draw();
                },
                ai:{
                    basic:{
                        order:10,
                        value:7,
                        useful:[3,1],
                    },
                    result:{
                        target:function(player,target){
                            if(target.hasSkillTag('noh')) return 3;
                            var num=-Math.sqrt(target.countCards('h'));
                            if(player.hasSha()&&player.canUse('sha',target)){
                                num-=2;
                            }
                            return num;
                        },
                    },
                }
            },
        },
        skill:{
            
        },
        translate:{
            holysword:'天赐圣剑',
            holysword_info:'锁定技，你视为拥有【连击】【激怒】【制衡】的效果。',
            spell_wuyashenxiang:'乌鸦神像',
            spell_wuyashenxiang_info:'出牌阶段，对自己使用；目标选择一项：法术牌或基本牌，然后从三张该种类的牌中获得一张。',
            spell_xiaoshi:'消失',
            spell_xiaoshi_info:'出牌阶段，对一名角色使用；其收回装备区内的所有牌，并弃置其若干张手牌，直到其手牌数与你相等',
            spell_piaoqie:'剽窃',
            spell_piaoqie_info:'出牌阶段，对一名角色使用；复制其两张手牌，加入你的手牌',
            gw_xinsheng:'新生',
            gw_xinsheng_info:'出牌阶段，对一名角色使用；你随机观看12张角色牌，选择一张替代目标角色牌（保留当前体力值和灵力值，且不大于新上限），然后结束出牌阶段',
            gw_zumoshoukao:'阻魔手铐',
            gw_zumoshoukao_info:'出牌阶段，对一名角色使用；目标技能失效，直到回合结束',
            gw_youer:'诱饵',
            gw_youer_bg:'饵',
            gw_youer_info:'出牌阶段，对一名其他角色使用；目标将所有手牌移出游戏，你摸一张牌；回合结束后目标将以此法失去的牌收回手牌',
        },
		list:[
		],
	};
});