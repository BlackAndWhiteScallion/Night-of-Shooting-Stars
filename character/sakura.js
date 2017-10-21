'use strict';
game.import('character',function(lib,game,ui,get,ai,_status){
	return {
		name:'sakura',
		connect:true,
		character:{
			letty:['female','3',4,['shuangjiang','baofengxue']],
            chen:['female','3',3,['mingdong','shihuo','shuanggui']],
            lilywhite:['female','5',3,['chunxiao','mengya']],
            youmu:['female','3',4,['yishan','yinhuashan']],
            yuyuko:['female','1',3,['youdie','moyin','fanhundie']],
            ran:['female','2',3,['jiubian','shiqu','tianhugongzhu']],
            yukari:['female','1',3,['huanjing','mengjie','mengjing']],
		},
		characterIntro:{
			diaochan:'中国古代四大美女之一，有闭月羞花之貌。司徒王允之义女，由王允授意施行连环计，离间董卓、吕布，借布手除卓。后貂蝉成为吕布的妾。',
		},       
		perfectPair:{
		},
		skill:{
            shuangjiang:{
                group:['shuangjiang2'],
                trigger:{player:'phaseEnd'},
                filter:function(event,player){
                    return true;
                },
                content:function(){
                    'step 0'
                    if (player.hasSkill('baofengxue2')){
                        var num = 0 + game.countPlayer(function(current){
                                if(player!= current && current.storage._mubiao > 0 && !current.storage.shuang) return 1;
                            });
                        player.chooseTarget([num, num], get.prompt('shuangjiang'),function(card,player,target){
                            return target!=player && target.storage._mubiao > 0 && !target.storage.shuang;
                        }).set('ai',function(target){
                            return get.attitude(_status.event.player,target);
                        });
                    } else {
                        player.chooseTarget(get.prompt('shuangjiang'),function(card,player,target){
                            return target!=player && target.storage._mubiao > 0 && !target.storage.shuang;
                        }).set('ai',function(target){
                            return get.attitude(_status.event.player,target);
                        });
                    }
                    'step 1'
                    if(result.bool){
                        player.logSkill('shuangjiang',result.targets);
                        result.targets[0].damage('thunder');
                    }
                },
            },
            shuangjiang2:{
                trigger:{global:['useCard','respond']},
                forced:true,
                popup:false,
                filter:function(event,player){
                    return true;
                },
                content:function(){
                    if (trigger.player){
                        if (trigger.player._mubiao > 0){
                            trigger.player.storage.shuang = 1;
                        }
                    }
                },
            },
            baofengxue:{
                audio:2,
                cost:2,
                spell:['baofengxue2'],
                roundi:true,
                trigger:{player:'phaseBegin'},
                filter:function(event,player){
                    return player.lili > lib.skill.baofengxue.cost;
                },
                content:function(){
                    player.loselili(lib.skill.baofengxue.cost);
                    player.turnOver();
                },
            },
            baofengxue2:{
                audio:2,
                trigger:{player:'useCard'},
                frequent:false,
                filter:function(event){
                    return (get.suit(event.card));
                },
                content:function(){
                   "step 0"
                    event.current=player.next;
                    "step 1"
                    if (!event.current.hasSkill('baofengxue3')){
                        event.current.addTempSkill('baofengxue3');
                        event.current.storage.baofengxue = [];
                    }
                    event.current.storage.baofengxue.add(get.suit(trigger.card));
                    if(event.current.next!=player){
                        event.current=event.current.next;
                        game.delay(0.5);
                        event.goto(1);
                    }
                },
                ai:{
                    threaten:1.4,
                    noautowuxie:true,
                }
            },
            baofengxue3:{
                trigger:{global:'phaseAfter'},
                forced:true,
                mark:true,
                audio:false,
                content:function(){
                    player.removeSkill('baofengxue3');
                    delete player.storage.baofengxue;
                },
                mod:{
                    cardEnabled:function(card,player){
                        if(player.storage.baofengxue.contains(get.suit(card))) return false;
                    },
                    cardUsable:function(card,player){
                        if(player.storage.baofengxue.contains(get.suit(card))) return false;
                    },
                    cardRespondable:function(card,player){
                        if(player.storage.baofengxue.contains(get.suit(card))) return false;
                    },
                    cardSavable:function(card,player){
                        if(player.storage.baofengxue.contains(get.suit(card))) return false;
                    }
                },
                intro:{
                    content:function(suit){
                        return '不能使用或打出'+get.translation(suit)+'的牌';
                    }
                },
            },
            mingdong:{
                trigger:{target:'useCardToBegin'},
                group:['mingdong2'],
                usable:1,
                mark:true,
                audio:2,
                init:function(player){
                    player.storage.mingdong=[];
                },
                content:function(){
                    'step 0'
                    var list = [];
                    for (var i in lib.card){
                        if(lib.card[i].mode&&lib.card[i].mode.contains(lib.config.mode)==false) continue;
                        if(lib.card[i].forbid&&lib.card[i].forbid.contains(lib.config.mode)) continue;
                        if(lib.card[i].type == 'basic'){
                            list.add(i);
                        }
                    }
                    for(var i=0;i<list.length;i++){
                        list[i]=[get.type(list[i]),'',list[i]];
                    }
                    player.chooseButton([get.prompt('mingdong'),[list,'vcard']]).set('ai',function(button){
                        return Math.random();
                    });
                    'step 1'
                    if (result.bool){
                        var name=result.links[0][2];
                        player.storage.mingdong = name;
                        lib.skill.mingdong2.viewAs = {name:name};
                    }
                },
            },
            mingdong2:{
                audio:3,
                enable:['chooseToRespond','chooseToUse'],
                hiddenCard:function(player,name){
                    return name == "shan";
                },
                filter:function(event,player){
                    if (player.storage.mingdong.length == 0) return false;
                    return player.countCards('h',{type:'trick'})>0;
                },
                filterCard:function(card,player){
                    return get.type(card)=='trick';
                },
                position:'h',
                check:function(card){return 4-get.value(card)},
                ai:{
                },
            },
            shihuo:{
                trigger:{player:'gainliliAfter'},
                usable:1,
                audio:2,
                filter:function(event, player){
                    return event.num > 0;
                },
                content:function(){
                    'step 0'
                    player.chooseTarget(get.prompt('shihuo'),function(card,player,target){
                        return true;
                    }).set('ai',function(target){
                        return get.attitude(_status.event.player,target);
                    });
                    'step 1'
                    if(result.bool){
                        player.logSkill('shihuo',result.targets);
                        result.targets[0].gainlili();
                    }
                },
            },
            shuanggui:{
                audio:2,
                cost:2,
                spell:['shuanggui2','shuanggui3'],
                roundi:true,
                trigger:{player:'phaseBegin'},
                filter:function(event,player){
                    return player.lili > lib.skill.shuanggui.cost;
                },
                content:function(){
                    player.loselili(lib.skill.shuanggui.cost);
                    player.turnOver();
                },
            },
            shuanggui2:{
                audio:2,
                trigger:{player:'phaseUseBegin'},
                forced:true,
                filter:function(event,player){
                    return true;
                },
                content:function(){
                    'step 0'
                    player.chooseTarget([1,1],get.prompt('shuanggui'),function(card,player,target){
                        return target != player;
                    },true).set('ai',function(target){
                        return get.attitude(_status.event.player,target);
                    });
                    'step 1'
                    if (result.bool){
                        player.logSkill('shuanggui',result.targets);
                        result.targets[0].draw();
                        result.targets[0].addTempSkill('shuanggui4');
                        player.draw();
                    }
                },
            },
            shuanggui3:{
                audio:2,
                trigger:{global:'loseliliBegin'},
                forced:true,
                filter:function(event,player){
                    return event.player.hasSkill('shuanggui4');
                },
                content:function(){
                    player.loselili(event.num);
                    event.num = 0;
                },
                onremove:function(){
                    for(var i=0;i<game.players.length;i++){
                        if(game.players[i].hasSkill('shuanggui4')){
                            game.players[i].removeSkill('shuanggui4');
                        }
                    }
                },
            },
            shuanggui4:{
                mark:true,
                intro:true,
            },
            chunxiao:{
                trigger:{player:'phaseBegin'},
                filter:function(event,player){
                    return player.lili > player.hp;
                },
                content:function(){
                    "step 0"
                    event.current=player;
                    event.players=game.filterPlayer();
                    event.num=0;
                    "step 1"
                    if(event.num<event.players.length){
                        var target=event.players[event.num];
                        target.draw();
                        event.num++;
                        event.redo();
                    }
                    "step 2"
                    event.current.chooseTarget([1,1],true,get.prompt('chunxiao'),function(card,player,target){
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
                    "step 3"
                    if(result.bool){
                        //player.logSkill('chunxiao',result.targets);
                        event.targets=result.targets;
                        event.current.discardPlayerCard(event.targets[0],'hej',[1,1],true);
                    }
                    if(event.current.next!=player){
                        event.current=event.current.next;
                        game.delay(0.5);
                        event.goto(1);
                    }
                },
            },
            mengya:{
                enable:'phaseUse',
                usable:2,
                filter:function(event,player){
                    return !(player.lili == 0 && player.num('hej') == 0);
                },
                content:function(){
                    var choice = [];
                    if (player.lili != 0){
                        choice.push('lose_lili');
                    }
                    if (player.lili != player.maxlili && player.num('hej') != 0){
                        choice.push('gain_lili');
                    }
                    'step 0'
                    player.chooseControl(choice).set('ai',function(){
                        return 'lose_lili';
                    });
                    'step 1'
                    if (result.control == 'gain_lili'){
                        player.chooseToDiscard(1,true,'hej');
                        player.gainlili();
                    } else if (result.control == 'lose_lili') {
                        player.loselili();
                        player.draw();
                    }
                },
            },
            yishan:{
                audio:2,
                direct:true,
                trigger:{player:'useCardAfter'},
                usable:1,
                filter:function(event,player){
                    return (event.card.name=='sha');
                },
                content:function(){
                    "step 0"
                    player.chooseTarget(get.prompt('yishan'),function(card,player,target){
                        if(player==target) return false;
                        return player.canUse({name:'sha'},target,false);
                    }).set('ai',function(target){
                        if(!_status.event.check) return 0;
                        return get.effect(target,{name:'sha'},_status.event.player);
                    });
                    "step 1"
                    if(result.bool){
                        player.logSkill('yishan',result.targets);
                        result.targets[0].draw();
                        player.useCard({name:'sha'},result.targets[0],false);
                    }
                },
            },
            yinhuashan:{
                audio:2,
                cost:0,
                spell:['yinhuashan2'],
                trigger:{player:'phaseBegin'},
                filter:function(event,player){
                    return player.lili > lib.skill.yinhuashan.cost;
                },
                content:function(){
                    player.loselili(lib.skill.yinhuashan.cost);
                    player.turnOver();
                },
            },
            yinhuashan2:{
                audio:2,
                direct:true,
                trigger:{player:'useCard'},
                filter:function(event,player){
                    return (event.card.name=='sha' && player.lili > 0);
                },
                content:function(){
                    "step 0"
                    var choice = ["重置一闪"];
                    if (game.hasPlayer(function(target){
                        return target!=player&&player.canUse(trigger.card,target)&&trigger.targets.contains(target)==false;
                    })){
                        choice.push('extra_target');
                    }
                    player.chooseControl(choice).set('ai',function(){
                        return '重置一闪';
                    });

                    "step 1"
                    player.loselili();
                    if (result.control == "重置一闪"){
                        if (player.storage.counttrigger) player.storage.counttrigger['yishan'] = 0;
                    } else {
                        player.chooseTarget(get.prompt('yinhuashan'),function(card,player,target){
                            if(player==target) return false;
                            var trigger=_status.event.getTrigger();
                            return player.canUse(trigger.card,target)&&trigger.targets.contains(target)==false;
                        }).set('ai',function(target){
                            var trigger=_status.event.getTrigger();
                            var player=_status.event.player;
                            return get.effect(target,trigger.card,player,player)+1;
                        });
                    }

                    "step 2"
                    if(result.bool){
                        game.log(event.target,'成为了',trigger.card,'的额外目标');
                        trigger.targets.push(event.target);
                    }
                    else{
                        event.finish();
                    }
                },
            },
        },
		translate:{
            letty:'蕾蒂',
            shuangjiang:'霜降',
            shuangjiang_info:'结束阶段，你可以对本回合成为过牌的目标，且没有使用/打出过牌的一名角色造成1点灵击伤害。',
            baofengxue:'暴风雪之眼',
            baofengxue2:'暴风雪之眼',
            baofengxue3:'暴风雪之眼',
            baofengxue_info:'符卡技（2）你使用一张牌时，可以令其他角色不能使用/打出与之相同花色的牌，直到结束阶段；【霜降】中的“一名”视为“所有”',
            chen:'橙',
            mingdong:'鸣动',
            mingdong2:'鸣动',
            mingdong_info:'一回合一次，你成为牌的目标后，你可以声明一种基本牌；你的法术牌均视为该牌，直到结束阶段。',
            shihuo:'式获',
            shihuo_info:'一回合一次，你获得1点灵力值后，可以令一名角色获得1点灵力值。',
            shuanggui:'青鬼赤鬼',
            shuanggui4:'鬼',
            shuanggui_info:'符卡技（2）【永续】准备阶段，你指定一名其他角色，与其各摸一张牌；该角色需要消耗灵力时，须改为消耗你的灵力。',
            lilywhite:'莉莉白',
            chunxiao:'春晓',
            chunxiao_info:'准备阶段，若你的灵力值不小于体力值，你可以令所有角色各摸一张牌，然后各弃置与其最近的一名角色一张牌。',
            mengya:'萌芽',
            mengya_info:'一回合两次，出牌阶段，你可以选择一项：获得1点灵力，然后弃置一张牌；或消耗1点灵力，然后摸一张牌。',
            youmu:'妖梦',
            yishan:'一闪',
            yishan_info:'一回合一次，你使用【轰！】结算完毕后，你可以令一名角色摸一张牌，视为对其使用一张无视装备的【轰！】。',
            yinhuashan:'樱花闪闪',
            yinhuashan_info:'符卡技（0）你使用【轰！】指定目标时，可以消耗1点灵力，并选择一项：额外指定一名目标角色，或重置【一闪】。',
            'refresh':'重置',
            'extra_target':'额外目标',
        },
	};
});
