'use strict';
game.import('mode',function(lib,game,ui,get,ai,_status){
	return {
		name:'brawl',
	    game:{
	        syncMenu:true,
	    },
	    start:function(){
	        ui.auto.hide();
	        if(!lib.storage.scene){
	            lib.storage.scene={};
	        }
	        if(!lib.storage.stage){
	            lib.storage.stage={};
	        }
	        if(!_status.extensionmade){
	            _status.extensionmade=[];
	        }
	        if(_status.extensionscene){
	            game.save('scene',lib.storage.scene);
	        }
	        if(_status.extensionstage){
	            game.save('stage',lib.storage.stage);
	        }
	        var dialog=ui.create.dialog('hidden');
	        dialog.classList.add('fixed');
	        dialog.classList.add('scroll1');
	        dialog.classList.add('scroll2');
	        dialog.classList.add('fullwidth');
	        dialog.classList.add('fullheight');
	        dialog.classList.add('noupdate');
	        dialog.classList.add('character');
	        dialog.contentContainer.style.overflow='visible';
	        dialog.style.overflow='hidden';
	        dialog.content.style.height='100%';
	        dialog.contentContainer.style.transition='all 0s';
	        if(!lib.storage.directStage) dialog.open();
	        var packnode=ui.create.div('.packnode',dialog);
	        lib.setScroll(packnode);
	        var clickCapt=function(){
	            var active=this.parentNode.querySelector('.active');
	            if(this.link=='stage'){
	                if(get.is.empty(lib.storage.scene)){
	                    alert('请创建至少1个场景');
	                    return;
	                }
	            }
	            if(active){
	                if(active==this) return;
	                for(var i=0;i<active.nodes.length;i++){
	                    active.nodes[i].remove();
	                    if(active.nodes[i].showcaseinterval){
	                        clearInterval(active.nodes[i].showcaseinterval);
	                        delete active.nodes[i].showcaseinterval;
	                    }
	                }
	                active.classList.remove('active');
	            }
	            this.classList.add('active');
	            for(var i=0;i<this.nodes.length;i++){
	                dialog.content.appendChild(this.nodes[i]);
	            }
	            var showcase=this.nodes[this.nodes.length-1];
	            showcase.style.height=(dialog.content.offsetHeight-showcase.offsetTop)+'px';
	            if(typeof showcase.action=='function'){
	                if(showcase.action(showcase._showcased?false:true)!==false){
	                    showcase._showcased=true;
	                }
	            }
	            if(this._nostart) start.style.display='none';
	            else start.style.display='';
	            game.save('currentBrawl',this.link);
	        }
	        var createNode=function(name){
	            var info=lib.brawl[name];
	            var node=ui.create.div('.dialogbutton.menubutton.large',info.name,packnode,clickCapt);
	            node.style.transition='all 0s';
	            var caption=info.name;
	            var modeinfo='';
	            if(info.mode){
	                modeinfo=get.translation(info.mode)+'模式';
	            }
	            if(info.submode){
	                if(modeinfo){
	                    modeinfo+=' - ';
	                }
	                modeinfo+=info.submode;
	            }
	            var intro;
	            if(Array.isArray(info.intro)){
	                intro='<ul style="text-align:left;margin-top:0;width:450px">';
	                if(modeinfo){
	                    intro+='<li>'+modeinfo;
	                }
	                for(var i=0;i<info.intro.length;i++){
	                    intro+='<li>'+info.intro[i];
	                }
	            }
	            else{
	                intro='';
	                if(modeinfo){
	                    intro+='（'+modeinfo+'）';
	                }
	                intro+=info.intro;
	            }
	            var showcase=ui.create.div();
	            showcase.style.margin='0px';
	            showcase.style.padding='0px';
	            showcase.style.width='100%';
	            showcase.style.display='block'
	            showcase.action=info.showcase;
	            showcase.link=name;
	            if(info.fullshow){
	                node.nodes=[showcase];
	                showcase.style.height='100%';
	            }
	            else{
	                node.nodes=[
	                    ui.create.div('.caption',caption),
	                    ui.create.div('.text center',intro),
	                    showcase
	                ];
	            }
	            node.link=name;
	            node._nostart=info.nostart;
	            if(lib.storage.currentBrawl==name){
	                clickCapt.call(node);
	            }
	            return node;
	        }
	        var clickStart=function(){
	            var active=packnode.querySelector('.active');
	            if(active){
	                for(var i=0;i<active.nodes.length;i++){
	                    if(active.nodes[i].showcaseinterval){
	                        clearInterval(active.nodes[i].showcaseinterval);
	                        delete active.nodes[i].showcaseinterval;
	                    }
	                }
	                var info;
	                if(active.link.indexOf('stage_')==0){
	                    var level;
	                    if(Array.isArray(arguments[0])){
	                        level={index:arguments[0][1]};
	                    }
	                    else{
	                        level=dialog.content.querySelector('.menubutton.large.active');
	                    }
	                    if(level){
	                        var stagesave=lib.storage.stage;
	                        var stage=stagesave[active.link.slice(6)];
	                        game.save('lastStage',level.index);
	                        lib.onover.push(function(bool){
	                            _status.createControl=ui.controls[0];
	                            if(bool&&level.index+1<stage.scenes.length){
	                                ui.create.control('下一关',function(){
	                                    game.save('directStage',[stage.name,level.index+1],'brawl');
	                                    localStorage.setItem(lib.configprefix+'directstart',true);
	                                    game.reload();
	                                });
	                                if(level.index+1>stage.level){
	                                    stage.level=level.index+1;
	                                    game.save('stage',stagesave,'brawl');
	                                }
	                                if(stage.mode!='sequal'){
	                                    game.save('lastStage',level.index+1,'brawl');
	                                }
	                            }
	                            else{
	                                ui.create.control('重新开始',function(){
	                                    if(stage.mode=='sequal'&&bool&&level.index==stage.scenes.length-1){
	                                        game.save('directStage',[stage.name,0],'brawl');
	                                    }
	                                    else{
	                                        game.save('directStage',[stage.name,level.index],'brawl');
	                                    }
	                                    localStorage.setItem(lib.configprefix+'directstart',true);
	                                    game.reload();
	                                });
	                                if(stage.mode=='sequal'&&level.index==stage.scenes.length-1){
	                                    stage.level=0;
	                                    game.save('stage',stagesave,'brawl');
	                                }
	                                if(stage.mode!='sequal'){
	                                    game.save('lastStage',level.index,'brawl');
	                                }
	                            }
	                            delete _status.createControl;
	                        });
	                        var scene=stage.scenes[level.index];
	                        info={
	                            name:scene.name,
	                            intro:scene.intro,
	                        };
	                        for(var i in lib.brawl.scene.template){
	                            info[i]=get.copy(lib.brawl.scene.template[i]);
	                        }
	                        if(!scene.gameDraw){
	                            info.content.noGameDraw=true;
	                        }
	                        info.content.scene=scene;
	                    }
	                    else{
	                        return;
	                    }
	                }
	                else{
	                    info=lib.brawl[active.link];
	                }
	                lib.translate.restart='返回';
	                dialog.delete();
	                ui.brawlinfo=ui.create.system('乱斗',null,true);
	                lib.setPopped(ui.brawlinfo,function(){
	                    var uiintro=ui.create.dialog('hidden');
	                    uiintro.add(info.name);
	                    var intro;
	                    if(Array.isArray(info.intro)){
	                        intro='<ul style="text-align:left;margin-top:0;width:450px">';
	                        for(var i=0;i<info.intro.length;i++){
	                            intro+='<li>'+info.intro[i];
	                        }
	                        intro+='</ul>'
	                    }
	                    else{
	                        intro=info.intro;
	                    }
	                    uiintro.add('<div class="text center">'+intro+'</div>');
	                    var ul=uiintro.querySelector('ul');
	                    if(ul){
	                        ul.style.width='180px';
	                    }
	                    uiintro.add(ui.create.div('.placeholder'));
	                    return uiintro;
	                },250);
	                ui.auto.show();
	                _status.brawl=info.content;
	                game.switchMode(info.mode);
	                if(info.init){
	                    info.init();
	                }
	            }
	        };
	        var start=ui.create.div('.menubutton.round.highlight','斗',dialog.content,clickStart);
	        start.style.position='absolute';
	        start.style.left='auto';
	        start.style.right='10px';
	        start.style.top='auto';
	        start.style.bottom='10px';
	        start.style.width='80px';
	        start.style.height='80px';
	        start.style.lineHeight='80px';
	        start.style.margin='0';
	        start.style.padding='5px';
	        start.style.fontSize='72px';
	        start.style.zIndex=3;
	        start.style.transition='all 0s';
	        game.addScene=function(name,clear){
	            var scene=lib.storage.scene[name];
	            var brawl={
	                name:name,
	                intro:scene.intro,
	            };
	            for(var i in lib.brawl.scene.template){
	                brawl[i]=get.copy(lib.brawl.scene.template[i]);
	            }
	            if(!scene.gameDraw){
	                brawl.content.noGameDraw=true;
	            }
	            brawl.content.scene=scene;
	            lib.brawl['scene_'+name]=brawl;
	            var node=createNode('scene_'+name);
	            if(clear){
	                game.addSceneClear();
	                clickCapt.call(node);
	                _status.sceneChanged=true;
	            }
	        };
	        game.addStage=function(name,clear){
	            var stage=lib.storage.stage[name];
	            var brawl={
	                name:name,
	                intro:stage.intro,
	                content:{}
	            };
	            for(var i in lib.brawl.stage.template){
	                brawl[i]=get.copy(lib.brawl.stage.template[i]);
	            }
	            brawl.content.stage=stage;
	            lib.brawl['stage_'+name]=brawl;
	            var node=createNode('stage_'+name);
	            if(clear){
	                game.addStageClear();
	                clickCapt.call(node);
	            }
	        }
	        game.removeScene=function(name){
	            delete lib.storage.scene[name];
	            game.save('scene',lib.storage.scene);
	            _status.sceneChanged=true;
	            for(var i=0;i<packnode.childElementCount;i++){
	                if(packnode.childNodes[i].link=='scene_'+name){
	                    if(packnode.childNodes[i].classList.contains('active')){
	                        for(var j=0;j<packnode.childElementCount;j++){
	                            if(packnode.childNodes[j].link=='scene'){
	                                clickCapt.call(packnode.childNodes[j]);
	                            }
	                        }
	                    }
	                    packnode.childNodes[i].remove();
	                    break;
	                }
	            }
	        }
	        game.removeStage=function(name){
	            delete lib.storage.stage[name];
	            game.save('stage',lib.storage.stage);
	            for(var i=0;i<packnode.childElementCount;i++){
	                if(packnode.childNodes[i].link=='stage_'+name){
	                    if(packnode.childNodes[i].classList.contains('active')){
	                        for(var j=0;j<packnode.childElementCount;j++){
	                            if(get.is.empty(lib.storage.scene)){
	                                if(packnode.childNodes[j].link=='scene'){
	                                    clickCapt.call(packnode.childNodes[j]);
	                                }
	                            }
	                            else{
	                                if(packnode.childNodes[j].link=='stage'){
	                                    clickCapt.call(packnode.childNodes[j]);
	                                }
	                            }
	                        }
	                    }
	                    packnode.childNodes[i].remove();
	                    break;
	                }
	            }
	        }
	        var sceneNode;
	        for(var i in lib.brawl){
	            if(get.config(i)===false) continue;
	            if(i=='scene'){
	                sceneNode=createNode(i);
	            }
	            else{
	                createNode(i);
	            }
	        }
	        if(sceneNode){
	            game.switchScene=function(){
	                clickCapt.call(sceneNode);
	            }
	        }
	        for(var i in lib.storage.scene){
	            game.addScene(i);
	        }
	        for(var i in lib.storage.stage){
	            game.addStage(i);
	        }
	        if(!lib.storage.currentBrawl){
	            clickCapt.call(packnode.firstChild);
	        }
	        game.save('lastStage');
	        if(lib.storage.directStage){
	            var directStage=lib.storage.directStage;
	            game.save('directStage');
	            clickStart(directStage);
	        }
	        lib.init.onfree();
	    },
	    brawl:{
	    	practise:{
	        	name:'对战练习',
	        	mode:'old_identity',
	        	submode:'1v1',
	        	intro:[
	        		'不会用角色？不熟悉牌堆？不熟悉游戏操作？',
	        		'来和5血<s>稻草人</s>子规老师练习一下吧？',
	        	],
	        	init:function(){
					lib.config.mode_config['old_identity']['player_number'] = '2';
					lib.config.mode_config['old_identity']['free_choose'] = true;
					lib.config.mode_config['old_identity']['continue_game'] = true;
				},
	        	content:{
					//chooseCharacterFixed:true,
					chooseCharacterAi:function(player){
						player.init('zigui');
					},
	        	},
	        	showcase:function(init){
					var node=this;
					var player;
					if(init){
						player=ui.create.player(null,true);
						player.init('zigui');
						player.node.avatar.show();
						player.style.left='calc(50% - 75px)';
						player.style.top='20px';
						player.node.count.remove();
						//player.node.hp.remove();
						player.style.transition='all 0.5s';
						node.appendChild(player);
						node.playernode=player;
					}
					else{
						player=node.playernode;
					}
				},
	        },
	        weiwoduzun:{
	            name:'唯我独尊',
	            mode:'old_identity',
	            intro:[
	                '牌堆中【轰！】的数量增加30%',
	                '游戏开始时，主公获得一枚战神标记',
	                '拥有战神标记的角色【轰！】造成的伤害+1',
	                '受到【轰！】造成的伤害后战神印记将移到伤害来源的武将牌上'
	            ],
	            showcase:function(init){
	                var node=this;
	                var player;
	                if(init){
	                    player=ui.create.player(null,true);
	                    player.node.avatar.style.backgroundSize='cover';
	                    player.node.avatar.setBackgroundImage('image/mode/boss/character/boss_reimu2.jpg');
	                    player.node.avatar.show();
	                    player.style.left='calc(50% - 75px)';
	                    player.style.top='20px';
	                    player.node.count.remove();
	                    player.node.hp.remove();
	                    player.style.transition='all 0.5s';
	                    node.appendChild(player);
	                    node.playernode=player;
	                }
	                else{
	                    player=node.playernode;
	                }
	                var num=0;
	                var num2=0;
	                this.showcaseinterval=setInterval(function(){
	                    var dx,dy
	                    if(num2%5==0){
	                        // player.animate('target');
	                        // player.animate('zoomin');
	                        player.classList.add('zoomin3');
	                        player.hide();
	                        setTimeout(function(){
	                            player.style.transitionProperty='none';
	                            player.classList.remove('zoomin3');
	                            player.classList.add('zoomout2');
	                            setTimeout(function(){
	                                player.style.transitionProperty='';
	                                player.classList.remove('zoomout2');
	                                player.show();
	                            },500);
	                        },700);
							for(var i=0;i<5;i++){
								switch(i){
			                        case 0:dx=-180;dy=0;break;
			                        case 1:dx=-140;dy=100;break;
			                        case 2:dx=0;dy=155;break;
			                        case 3:dx=140;dy=100;break;
			                        case 4:dx=180;dy=0;break;
			                    }
								var card=game.createCard('sha','noclick');
			                    card.style.left='calc(50% - 52px)';
			                    card.style.top='68px';
			                    card.style.position='absolute';
			                    card.style.margin=0;
			                    card.style.zIndex=2;
			                    card.style.opacity=0;
			                    node.appendChild(card);
			                    ui.refresh(card);
			                    card.style.opacity=1;
			                    card.style.transform='translate('+dx+'px,'+dy+'px)';
			                    setTimeout((function(card){
			                        return function(){
										card.delete();
									};
			                    })(card),700);
							}
	                    }
	                    num2++;
	                    if(num>=5){
	                        num=0;
	                    }
	                },700);
	            },
	            init:function(){
	                lib.skill.weiwoduzun={
	                    mark:true,
	                    intro:{
	                        content:'杀造成的伤害+1'
	                    },
	                    group:['weiwoduzun_damage','weiwoduzun_lose'],
	                    subSkill:{
	                        damage:{
	                            trigger:{source:'damageBegin'},
	                            forced:true,
	                            filter:function(event){
	                                return event.card&&event.card.name=='sha'&&event.notLink();
	                            },
	                            content:function(){
	                                trigger.num++;
	                            }
	                        },
	                        lose:{
	                            trigger:{player:'damageEnd'},
	                            forced:true,
	                            filter:function(event){
	                                return event.source&&event.source.isAlive();
	                            },
	                            content:function(){
	                                player.removeSkill('weiwoduzun');
	                                trigger.source.addSkill('weiwoduzun');
	                            }
	                        }
	                    }
	                };
	                lib.translate.weiwoduzun='战神';
	                lib.translate.weiwoduzun_bg='尊';
	            },
	            content:{
	                cardPile:function(list){
	                    var num=0;
	                    for(var i=0;i<list.length;i++){
	                        if(list[i][2]=='sha') num++;
	                    }
	                    num=Math.round(num*0.3);
	                    if(num<=0) return list;
	                    while(num--){
	                        var nature='';
	                        var rand=Math.random();
	                        if(rand<0.15){
	                            nature='fire';
	                        }
	                        else if(rand<0.3){
	                            nature='thunder';
	                        }
	                        var suit=['heart','spade','club','diamond'].randomGet();
	                        var number=Math.ceil(Math.random()*13);
	                        if(nature){
	                            list.push([suit,number,'sha',nature]);
	                        }
	                        else{
	                            list.push([suit,number,'sha']);
	                        }
	                    }
	                    return list;
	                },
	                gameStart:function(){
	                    if(_status.mode=='zhong'){
	                        game.zhong.addSkill('weiwoduzun');
	                    }
	                    else{
	                        game.zhu.addSkill('weiwoduzun');
	                    }
	                }
	            }
	        },
	        tongjiangmoshi:{
	            name:'同⑨模式',
	            mode:'identity',
	            intro:'玩家选择一个角色，所有玩家均使用此角色',
	            showcase:function(init){
	                if(init){
	                    this.nodes=[];
	                }
	                else{
	                    while(this.nodes.length){
	                        this.nodes.shift().remove();
	                    }
	                }
	                var lx=this.offsetWidth/2-120;
	                var ly=Math.min(lx,this.offsetHeight/2-60);
	                var setPos=function(node){
	                    var i=node.index;
	                    var deg=Math.PI/4*i;
	                    var dx=Math.round(lx*Math.cos(deg));
	                    var dy=Math.round(ly*Math.sin(deg));
	                    node.style.transform='translate('+dx+'px,'+dy+'px)';
	                }
	                for(var i=0;i<8;i++){
	                    var node=ui.create.player(null,true);
	                    this.nodes.push(node);
	                    node.init('cirno');
	                    node.classList.add('minskin');
	                    node.node.marks.remove();
	                    node.node.hp.remove();
	                    node.node.lili.remove();
	                    node.node.count.remove();
	                    node.style.left='calc(50% - 60px)';
	                    node.style.top='calc(50% - 60px)';
	                    node.index=i;
	                    setPos(node);
	                    this.appendChild(node);
	                }
	                var nodes=this.nodes;
	                this.showcaseinterval=setInterval(function(){
	                    for(var i=0;i<nodes.length;i++){
	                        nodes[i].index++;
	                        if(nodes[i].index>7){
	                            nodes[i].index=0;
	                        }
	                        setPos(nodes[i]);
	                    }
	                },1000);
	            },
	            content:{
	                gameStart:function(){
	                    var target=(_status.mode=='zhong')?game.zhong:game.zhu;
	                    if(get.config('double_character')){
	                        target.init(game.me.name,game.me.name2);
	                    }
	                    else{
	                        target.init(game.me.name);
	                    }
	                    target.hp++;
	                    target.maxHp++;
	                    target.update();
	                },
	                chooseCharacterAi:function(player,list,list2,back){
	                    if(player==game.zhu){
	                        return;
	                    }
	                    else{
	                        if(get.config('double_character')){
	                            player.init(game.me.name,game.me.name2);
	                        }
	                        else{
	                            player.init(game.me.name);
	                        }
	                    }
	                },
	                chooseCharacter:function(list,list2,num){
	                    if(game.me!=game.zhu){
	                        return list.slice(0,list2);
	                    }
	                    else{
	                        if(_status.event.zhongmode){
	    						return list.slice(0,6);
	    					}
	    					else{
	    						return list.concat(list2.slice(0,num));
	    					}
	                    }
	                }
	            }
	        },
	        pandora:{
	        	name:'禁忌解放',
	            mode:'identity',
	            intro:[
	            	'不知道谁把潘多拉的魔盒打开了！',
	                '牌堆中的<b><u>禁忌牌</b></u>数量增加了<b><u>400%！</b></u>',
	            ],
	            showcase:function(init){
	                var node=this;
	                var player;
	                if(init){
	                    player=ui.create.player(null,true);
	                    player.init('yuyuko');
	                    player.node.avatar.show();
	                    player.style.left='calc(50% - 75px)';
	                    player.style.top='20px';
	                    player.node.count.remove();
	                    player.node.hp.remove();
	                    player.node.lili.remove();
	                    player.style.transition='all 0.5s';
	                    node.appendChild(player);
	                    node.playernode=player;
	                }
	                else{
	                    player=node.playernode;
	                }
	                var num=0;
	                var num2=0;
	                this.showcaseinterval=setInterval(function(){
	                    var dx,dy
	                    if(num2%5==0){
							for(var i=0;i<5;i++){
								switch(i){
			                        case 0:dx=-180;dy=0;break;
			                        case 1:dx=-140;dy=100;break;
			                        case 2:dx=0;dy=155;break;
			                        case 3:dx=140;dy=100;break;
			                        case 4:dx=180;dy=0;break;
			                    }
								var card=game.createCard('simen');
			                    card.style.left='calc(50% - 52px)';
			                    card.style.top='68px';
			                    card.style.position='absolute';
			                    card.style.margin=0;
			                    card.style.zIndex=2;
			                    card.style.opacity=0;
			                    setTimeout((function(card, dx, dy){
			                        return function(){
					                    node.appendChild(card);
					                    ui.refresh(card);
					                    card.style.opacity=1;
					                    card.style.transform='translate('+dx+'px,'+dy+'px)';
									};
			                    })(card, dx, dy),i*200);
			                    setTimeout((function(card){
			                    	return function(){
			                    		card.delete();
			                    	};
			                    })(card),1400);
							}
	                    }
	                    num2++;
	                    if(num>=5){
	                        num=0;
	                    }
	                },700);
	            },
	            init:function(){
	            },
	            content:{
	                cardPile:function(list){
	                    var num=0;
	                    var cardlist = [];
	                    for(var i=0;i<list.length;i++){
	                        if(get.type({name:list[i][2]}) == 'jinji'){
	                        	num++;
	                        	cardlist.push(list[i][2]);
	                        }
	                    }
	                    num=num*4;
	                    if(num<=0) return list;
	                    while(num--){
	                        var rand=Math.floor(Math.random()*cardlist.length);
	                        var name = cardlist[rand];
	                        var suit=['heart','spade','club','diamond'].randomGet();
	                        var number=Math.ceil(Math.random()*13);
	                        list.push([suit,number,name]);
	                    }
	                    return list;
	                },
	                gameStart:function(){
	                }
	            }
	        },
		    shenxian:{
	            name:'神仙打架',
	            mode:'identity',
	            intro:[
	            	'高达一号凭依了幻想乡里的所有人！',
	                '所有角色在使用一张牌后摸一张牌！',
	                '顺便，牌堆牌数翻倍了。',
	            ],
	            showcase:function(init){
	                var node=this;
	                var player;
	                if(init){
	                    player=ui.create.player(null,true);
	                    player.node.avatar.style.backgroundSize='cover';
	                    player.node.avatar.setBackgroundImage('image/mode/boss/character/boss_zhaoyun.jpg');
	                    player.node.avatar.show();
	                    player.style.left='calc(50% - 75px)';
	                    player.style.top='20px';
	                    player.node.count.remove();
	                    player.node.hp.remove();
	                    player.style.transition='all 0.5s';
	                    node.appendChild(player);
	                    node.playernode=player;
	                }
	                else{
	                    player=node.playernode;
	                }
	            },
	            init:function(){
	                lib.skill._gaoda={
	                	trigger:{player:'useCard'},
	                	direct:true,
	                	content:function(){
	                		player.draw();
	                	},
	                };
	            },
	            content:{
	                cardPile:function(list){
	                    return list.concat(list);
	                },
	                gameStart:function(){
	                	var players = game.filterPlayer();
	                	for (var i = 0; i < players.length; i ++){
	                		
	                	}
	                }
	            }
	        },
	        pubg:{
	        	name:'吃鸡模式',
	        	mode:'identity',
	        	intro:[
	        		'游戏开始时，所有角色获得一张【皆杀】异变牌。',
	        		'简单来说，所有角色的胜利条件仅为击坠所有其他角色，且所有角色击坠角色后，摸3张牌，获得1点灵力，摸一张技能牌。',
	        		'额外的，牌堆里加入了3张专属禁忌牌。',
	        	],
	        	init:function(){
	        		lib.card.luanwu={
						filterTarget:function(card,player,target){
							return target!=player;
						},
						audio:true,
						fullskin:true,
						type:'jinji',
						enable:true,
						selectTarget:-1,
						content:function(){
							"step 0"
							target.chooseToUse('乱武：使用一张轰！或失去一点体力',{name:'sha'},function(card,player,target){
								if(player==target) return false;
								if(!player.canUse('sha',target)) return false;
								if(get.distance(player,target)<=1) return true;
								if(game.hasPlayer(function(current){
									return current!=player&&get.distance(player,current)<get.distance(player,target);
								})){
									return false;
								}
								return true;
							});
							"step 1"
							if(result.bool==false) target.loseHp();
						},
						ai:{
							order:1,
							value:5,
							useful:2,
							result:{
								player:function(player){
									if(lib.config.mode=='identity'&&game.zhu.isZhu&&player.identity=='fan'){
										if(game.zhu.hp==1&&game.zhu.countCards('h')<=2) return 1;
									}
									var num=0;
									var players=game.filterPlayer();
									for(var i=0;i<players.length;i++){
										var att=get.attitude(player,players[i]);
										if(att>0) att=1;
										if(att<0) att=-1;
										if(players[i]!=player&&players[i].hp<=3){
											if(players[i].countCards('h')==0) num+=att/players[i].hp;
											else if(players[i].countCards('h')==1) num+=att/2/players[i].hp;
											else if(players[i].countCards('h')==2) num+=att/4/players[i].hp;
										}
										if(players[i].hp==1) num+=att*1.5;
									}
									if(player.hp==1){
										return -num;
									}
									if(player.hp==2){
										return -game.players.length/4-num;
									}
									return -game.players.length/3-num;
								}
							}
						},
	        		};
				},
				showcase:function(init){
	                var node=this;
					var card=game.createCard('death');
                    card.style.left='calc(50% - 52px)';
                    card.style.top='68px';
                    card.style.position='absolute';
                    card.style.margin=0;
                    card.style.zIndex=2;
                    card.style.opacity=0;
                    node.appendChild(card);
                    ui.refresh(card);
                    card.style.opacity=1;
	            },
	            content:{
	            	cardPile:function(list){
						var num=3;
						if(num<=0) return list;
						while(num--){
							var suit=['heart','spade','club','diamond'].randomGet();
							var number=Math.ceil(Math.random()*13);
							list.push([suit,number,'luanwu']);
						}
						return list;
					},
	            	gameStart:function(){
	                	var players = game.players;
	                	for (var i = 0; i < players.length; i ++){
	                		players[i].identityShown = true;
	                		//players[i].setIdentity(players[i].identity);
	                		players[i].addIncident(game.createCard('death'));
	                	}
	                }
	            },
	        },
	        library:{
	        	name:'稗田教室',
	        	mode:'identity',
	        	intro:[
	        		'阿求老师的特殊规则！',
	        	],
	        	showcase:function(init){
	        		var node=this;
	                var player;
	        		if (init){
	        			lib.config['library'] = [false,false,false,false];
		                lib.character['akyuu'] = ['female','1',3,[],[]];
	    				player=ui.create.player(null,true);
	                    player.init('akyuu');
	                    player.node.avatar.show();
	                    player.style.left='calc(50% - 75px)';
	                    player.style.top='20px';
	                    player.node.count.remove();
	                    player.node.hp.remove();
	                    player.node.lili.remove();
	                    player.style.transition='all 0.5s';
	                    node.appendChild(player);
	                    node.playernode=player;
	        			if (lib.config.akyuu){
	        				var style2={position:'relative',display:'block',left:0,top:'210px',marginBottom:'6px',padding:0,width:'100%'};
	        				var line2=ui.create.div(style2,this);
	        				var style3={position:'relative',display:'block',left:0,top:'210px',marginBottom:'6px',padding:0,width:'100%'};
	        				var line3=ui.create.div(style3, this);
	        				ui.create.node('span','请选择你想要使用的规则！',line2,{marginLeft:'20px'});
	        				ui.create.node('span','<br>一名角色的回合结束时，其摸X张牌（X为其本回合造成的伤害数）。 ',line2,{});
		                    var linked=ui.create.node('input',line2);
		                    linked.type='checkbox';
		                    ui.create.node('span','<br>所有角色的体力上限+1，灵力上限+2，手牌上限+3。 ',line2,{});
		                    var turn=ui.create.node('input',line2,{marginLeft:'116px'});
		                    turn.type='checkbox';
		                    ui.create.node('span','<br>一名角色造成伤害时，若其手牌数为场上最高（之一），该伤害+1。 ',line2,{});
		                    var round=ui.create.node('input',line2);
		                    round.type='checkbox';
		                    ui.create.node('span','<br>阿求老师来一起玩！ ',line2,{});
		                    var akyuu=ui.create.node('input',line2,{});
		                    akyuu.type='checkbox';
		                    ui.create.div('.menubutton.large','确定',line3,{position:'relative'},function(){
		                    	lib.config['library'] = [linked.checked,turn.checked,round.checked,akyuu.checked];
		                    });
	        			} else {
		                    var dialog=ui.create.dialog('hidden');
							dialog.style.left = "0px";
							dialog.style.top = "0px";
							dialog.style.width = "100%";
							dialog.style.height = "100%";
							dialog.classList.add('fixed');
		        			dialog.noopen=true;
							node.appendChild(dialog);
							var number = 3;
							if (lib.config.gameRecord.incident && lib.config.gameRecord.incident.data['akyuu']){
								number = lib.config.gameRecord.incident.data['akyuu'] < 3?3-lib.config.gameRecord.incident.data['akyuu']:0;
							}
		                    dialog.addText('<div><div style="display:block;left:180px;top:200px;text-align:left;font-size:16px">成功召唤阿求就可以使用这个场景啦！<br>召唤阿求还需要'+number+'次异变胜利。');
	        			}
	        		}
	        	},
	        	content:{
	        		gameStart:function(){
	        			if (lib.config.library){
	        				if (lib.config.library[0]) game.zhu.addSkill('shuchu');
	        				if (lib.config.library[1]) game.zhu.addSkill('fuzhu');
	        				if (lib.config.library[2]) game.zhu.addSkill('kongchang');
	        			}
	                }
	        	},
	        },
	        scene:{
	            name:'创建场景',
	            content:{
	                submode:'normal'
	            },
	            nostart:true,
	            fullshow:true,
	            template:{
	                mode:'old_identity',
	                init:function(){
	                    game.saveConfig('double_character',false,'identity');
	                    _status.brawl.playerNumber=_status.brawl.scene.players.length;
	                },
	                showcase:function(init){
	                    if(init){
	                        var name=lib.brawl[this.link].name;
	                        var scene=lib.storage.scene[name];
	                        ui.create.node('button','编辑场景',this,function(){
	                            _status.sceneToLoad=scene;
	                            game.switchScene();
	                        });
	                        if(_status.extensionmade.contains(name)){
	                            ui.create.node('button','管理扩展',this,function(){
	                                ui.click.configMenu();
	                                ui.click.extensionTab(name);
	                            },{marginLeft:'6px'});
	                        }
	                        else{
	                            ui.create.node('button','删除场景',this,function(){
	                                if(confirm('确定删除'+name+'？')){
	                                    game.removeScene(name);
	                                }
	                            },{marginLeft:'6px'});
	                        }
	                        ui.create.node('button','导出扩展',this,function(){
	                            var str='{name:"'+name+'",content:function(){\nif(lib.config.mode=="brawl"){\n'+
	                            'if(!lib.storage.scene) lib.storage.scene={};\n'+
	                            'if(!lib.storage.scene["'+name+'"]){\nlib.storage.scene["'+name+'"]='+get.stringify(scene)+';\n_status.extensionscene=true;}\n'+
	                            'if(!_status.extensionmade) _status.extensionmade=[];\n'+
	                            '_status.extensionmade.push("'+name+'");\n}}\n}';
	                            var extension={'extension.js':'game.import("extension",function(lib,game,ui,get,ai,_status){return '+str+'})'};
	                            game.importExtension(extension,null,name);
	                        },{marginLeft:'6px'});
	                    }
	                },
	                content:{
	                    submode:'normal',
	                    noAddSetting:true,
	                    identityShown:true,
	                    orderedPile:true,
	                    cardPile:function(list){
	                        list.randomSort();
	                        var scene=_status.brawl.scene;
	                        var inpile=[];
	                        for(var i=0;i<list.length;i++){
	                            if(lib.card[list[i][2]]){
	                                if(lib.config.bannedcards.contains(list[i][2])) continue;
	                                if(game.bannedcards&&game.bannedcards.contains(list[i][2])) continue;
	                                inpile.add(list[i][2]);
	                            }
	                        }
	                        var parseInfo=function(info){
	                            var info2=[];
	                            if(info[1]=='random'){
	                                info2.push(['club','spade','heart','diamond'].randomGet());
	                            }
	                            else{
	                                info2.push(info[1]);
	                            }
	                            if(info[2]=='random'){
	                                info2.push(Math.ceil(Math.random()*13));
	                            }
	                            else{
	                                info2.push(info[2]);
	                            }
	                            if(info[0]=='random'){
	                                info2.push(inpile.randomGet());
	                            }
	                            else{
	                                info2.push(info[0]);
	                            }
	                            return info2;
	                        }
	                        if(scene.replacepile){
	                            list.length=0;
	                        }
	                        for(var i=scene.cardPileTop.length-1;i>=0;i--){
	                            list.unshift(parseInfo(scene.cardPileTop[i]));
	                        }
	                        for(var i=0;i<scene.cardPileBottom.length;i++){
	                            list.push(parseInfo(scene.cardPileBottom[i]));
	                        }
	                        for(var i=0;i<scene.discardPile.length;i++){
	                            ui.create.card(ui.discardPile).init(parseInfo(scene.discardPile[i]));
	                        }
	                        return list;
	                    },
	                    gameStart:function(){
	                        for(var i=0;i<game.players.length;i++){
	                            game.players[i].node.marks.show();
	                            game.players[i].node.name.show();
	                            game.players[i].node.name2.show();
	                            var info=game.players[i].brawlinfo;
	                            if(info.maxHp){
	                                game.players[i].maxHp=info.maxHp;
	                                if(game.players[i].hp>game.players[i].maxHp){
	                                    game.players[i].hp=game.players[i].maxHp;
	                                }
	                            }
	                            if(info.hp){
	                                game.players[i].hp=info.hp;
	                                if(game.players[i].hp>game.players[i].maxHp){
	                                    game.players[i].maxHp=game.players[i].hp;
	                                }
	                            }
	                            if(info.maxlili){
	                                game.players[i].maxlili=info.maxlili;
	                                if(game.players[i].lili>game.players[i].maxlili){
	                                    game.players[i].lili=game.players[i].maxlili;
	                                }
	                            }
	                            if(info.lili){
	                                game.players[i].lili=info.lili;
	                                if(game.players[i].lili>game.players[i].maxlili){
	                                    game.players[i].maxlili=game.players[i].lili;
	                                }
	                            }
	                            game.players[i].update();
	                        }
	                        var scene=_status.brawl.scene;
	                        var over=function(str){
	                            switch(str){
	                                case 'win':game.over(true);break;
	                                case 'lose':game.over(false);break;
	                                case 'tie':game.over('平局');break;
	                            }
	                        }
	                        if(scene.turns){
	                            var turns=scene.turns[0];
	                            lib.onphase.push(function(){
	                                turns--;
	                                if(turns<0){
	                                    over(scene.turns[1]);
	                                }
	                            });
	                        }
	                        if(scene.washes){
	                            var washes=scene.washes[0];
	                            lib.onwash.push(function(){
	                                washes--;
	                                if(washes<=0){
	                                    over(scene.washes[1]);
	                                }
	                            });
	                        }
	                    },
	                    chooseCharacterBefore:function(){
	                        var scene=_status.brawl.scene;
	                        var playercontrol=[];
	                        var maxpos=0;
	                        for(var i=0;i<scene.players.length;i++){
	                            if(scene.players[i].playercontrol){
	                                playercontrol.push(scene.players[i]);
	                            }
	                            maxpos=Math.max(maxpos,scene.players[i].position);
	                        }

	                        if(maxpos<scene.players.length){
	                            maxpos=scene.players.length;
	                        }
	                        var posmap=[];
	                        for(var i=1;i<=maxpos;i++){
	                            posmap.push(i);
	                        }
	                        for(var i=0;i<scene.players.length;i++){
	                            if(scene.players[i].position){
	                                posmap.remove(scene.players[i].position);
	                            }
	                        }
	                        for(var i=0;i<scene.players.length;i++){
	                            if(!scene.players[i].position){
	                                scene.players[i].position=posmap.randomRemove();
	                            }
	                        }
	                        if(playercontrol.length){
	                            game.me.brawlinfo=playercontrol.randomGet();
	                        }
	                        else{
	                            game.me.brawlinfo=scene.players.randomGet();
	                        }
	                        var getpos=function(info){
	                            var dp=info.position-game.me.brawlinfo.position;
	                            if(dp<0){
	                                dp+=maxpos;
	                            }
	                            return dp;
	                        };
	                        scene.players.sort(function(a,b){
	                            return getpos(a)-getpos(b);
	                        });
	                        var target=game.me;
	                        var createCard=function(info){
	                            var info2=[];
	                            if(info[1]=='random'){
	                                info2.push(['club','spade','heart','diamond'].randomGet());
	                            }
	                            else{
	                                info2.push(info[1]);
	                            }
	                            if(info[2]=='random'){
	                                info2.push(Math.ceil(Math.random()*13));
	                            }
	                            else{
	                                info2.push(info[2]);
	                            }
	                            if(info[0]=='random'){
	                                info2.push(lib.inpile.randomGet());
	                            }
	                            else{
	                                info2.push(info[0]);
	                            }
	                            return ui.create.card().init(info2);
	                        }
	                        _status.firstAct=game.me;
	                        for(var i=0;i<scene.players.length;i++){
	                            var info=scene.players[i];
	                            target.brawlinfo=info;
	                            target.identity=info.identity;
	                            target.setIdentity(info.identity);
	                            target.node.marks.hide();
	                            if(info.name2!='none'&&info.name2!='random'){
	                                if(info.name=='random'){
	                                    target.init(info.name2,info.name2);
	                                    target.node.name.hide();
	                                    target.node.avatar.hide();
	                                }
	                                else{
	                                    target.init(info.name,info.name2);
	                                }
	                            }
	                            else{
	                                if(info.name!='random'){
	                                    if(info.name2=='random'){
	                                        target.init(info.name,info.name);
	                                        target.node.name2.hide();
	                                        target.node.avatar2.hide();
	                                    }
	                                    else{
	                                        target.init(info.name);
	                                    }
	                                }
	                            }
	                            if(info.position<_status.firstAct.brawlinfo.position) _status.firstAct=target;
	                            var hs=[];
	                            for(var j=0;j<info.handcards.length;j++){
	                                hs.push(createCard(info.handcards[j]));
	                            }
	                            if(hs.length){
	                                target.directgain(hs);
	                            }
	                            for(var j=0;j<info.equips.length;j++){
	                                target.$equip(createCard(info.equips[j]));
	                            }
	                            for(var j=0;j<info.judges.length;j++){
	                                target.node.judges.appendChild(createCard(info.judges[j]));
	                            }
	                            target=target.next;
	                        }
	                    },
	                    chooseCharacterAi:function(player,list,list2){
	                        var info=player.brawlinfo;
	                        if(info.name2!='none'){
	                            if(info.name=='random'&&info.name2=='random'){
	                                list=list.slice(0);
	                                player.init(list.randomRemove(),list.randomRemove());
	                            }
	                            else if(info.name=='random'){
	                                player.init(list.randomGet(),info.name2);
	                            }
	                            else if(info.name2=='random'){
	                                player.init(info.name,list.randomGet());
	                            }
	                        }
	                        else{
	                            if(info.name=='random'){
	                                player.init(list.randomGet());
	                            }
	                        }
	                    },
	                    chooseCharacter:function(list){
	                        var info=game.me.brawlinfo;
	                        var event=_status.event;
	                        if(info.name2=='none'){
	                            if(info.name!='random'){
	                                event.chosen=[info.name];
	                            }
	                        }
	                        else{
	                            if(info.name2=='random'&&info.name=='random'){
	                                _status.brawl.doubleCharacter=true;
	                            }
	                            else if(info.name=='random'){
	                                game.me.init(info.name2,info.name2);
	                                game.me.node.avatar.hide();
	                                game.me.node.name.hide();
	                                _status.brawl.chooseCharacterStr='选择主将';
	                                event.modchosen=[info.name,info.name2];
	                            }
	                            else if(info.name2=='random'){
	                                game.me.init(info.name,info.name);
	                                game.me.node.avatar2.hide();
	                                game.me.node.name2.hide();
	                                _status.brawl.chooseCharacterStr='选择副将';
	                                event.modchosen=[info.name,info.name2];
	                            }
	                            else{
	                                event.chosen=[info.name,info.name2];
	                            }
	                        }
	                        if(game.me.identity=='zhu') return false;
	                        return 'nozhu';
	                    },
	                }
	            },
	            showcase:function(init){
	                if(init){
	                    lib.translate.zhu=lib.translate.zhu||'黑';
	                    lib.translate.zhong=lib.translate.zhong||'异';
	                    lib.translate.nei=lib.translate.nei||'路';
	                    lib.translate.fan=lib.translate.fan||'自';


	                    this.style.transition='all 0s';
	                    this.style.height=(this.offsetHeight-10)+'px';
	                    this.style.overflow='scroll';
	                    lib.setScroll(this);
	                    var style={marginLeft:'3px',marginRight:'3px'};
	                    var style2={position:'relative',display:'block',left:0,top:0,marginBottom:'6px',padding:0,width:'100%'};
	                    var style3={marginLeft:'4px',marginRight:'4px',position:'relative'}


	                    var scenename=ui.create.node('input',ui.create.div(style2,'','场景名称：',this),{width:'120px'});
	                    scenename.type='text';
	                    scenename.style.marginTop='20px';
	                    var sceneintro=ui.create.node('input',ui.create.div(style2,'','场景描述：',this),{width:'120px'});
	                    sceneintro.type='text';
	                    sceneintro.style.marginBottom='10px';

	                    var line1=ui.create.div(style2,this);
	                    var addCharacter=ui.create.node('button','添加角色',line1,function(){
	                        // line1.style.display='none';
	                        resetStatus();
	                        editPile.disabled=true;
	                        // editCode.disabled=true;
	                        saveButton.disabled=true;
	                        // exportButton.disabled=true;
	                        line7.style.display='none';
	                        line2.style.display='block';
	                        line2_t.style.display='block';
	                        line3.style.display='block';
	                        line4.style.display='block';
	                        line5.style.display='block';
	                        line6_h.style.display='block';
	                        line6_e.style.display='block';
	                        line6_j.style.display='block';
	                        capt1.style.display='block';
	                        capt2.style.display='block';
	                        if(line6_h.childElementCount) capt_h.style.display='block';
	                        if(line6_e.childElementCount) capt_e.style.display='block';
	                        if(line6_j.childElementCount) capt_j.style.display='block';
	                    },style);
	                    var editPile=ui.create.node('button','场景选项',line1,function(){
	                        resetCharacter();
	                        addCharacter.disabled=true;
	                        // editCode.disabled=true;
	                        saveButton.disabled=true;
	                        // exportButton.disabled=true;
	                        line7.style.display='none';
	                        line8.style.display='block';
	                        capt8.style.display='block';
	                        line9.style.display='block';
	                        line10.style.display='block';
	                        line11.style.display='block';
	                        capt9.style.display='block';
	                        line3.style.display='block';

	                        line6_t.style.display='block';
	                        line6_b.style.display='block';
	                        line6_d.style.display='block';
	                        if(line6_t.childElementCount) capt_t.style.display='block';
	                        if(line6_b.childElementCount) capt_b.style.display='block';
	                        if(line6_d.childElementCount) capt_d.style.display='block';
	                    },style);
	                    // var editCode=ui.create.node('button','编辑代码',line1,function(){
	                    //     console.log(1);
	                    // },style);
	                    var saveButton=ui.create.node('button','保存场景',line1,function(){
	                        if(!scenename.value){
	                            alert('请填写场景名称');
	                            return;
	                        }
	                        var scene={
	                            name:scenename.value,
	                            intro:sceneintro.value,
	                            players:[],
	                            cardPileTop:[],
	                            cardPileBottom:[],
	                            discardPile:[],
	                        };
	                        for(var i=0;i<line7.childElementCount;i++){
	                            scene.players.push(line7.childNodes[i].info);
	                        }
	                        if(scene.players.length<2){
	                            alert('请添加至少两名角色');
	                            return;
	                        }
	                        if(lib.storage.scene[scenename.value]){
	                            if(_status.currentScene!=scenename.value){
	                                if(!confirm('场景名与现有场景重复，是否覆盖？')){
	                                    return;
	                                }
	                            }
	                            game.removeScene(scenename.value);
	                        }
	                        for(var i=0;i<line6_t.childElementCount;i++){
	                            scene.cardPileTop.push(line6_t.childNodes[i].info);
	                        }
	                        for(var i=0;i<line6_b.childElementCount;i++){
	                            scene.cardPileBottom.push(line6_b.childNodes[i].info);
	                        }
	                        for(var i=0;i<line6_d.childElementCount;i++){
	                            scene.discardPile.push(line6_d.childNodes[i].info);
	                        }
	                        if(replacepile.checked){
	                            scene.replacepile=true;
	                        }
	                        if(gameDraw.checked){
	                            scene.gameDraw=true;
	                        }
	                        if(turnsresult.value!='none'){
	                            scene.turns=[parseInt(turns.value),turnsresult.value]
	                        }
	                        if(washesresult.value!='none'){
	                            scene.washes=[parseInt(washes.value),washesresult.value]
	                        }
	                        lib.storage.scene[scene.name]=scene;
	                        game.save('scene',lib.storage.scene);
	                        game.addScene(scene.name,true);
	                    },style);


	                    var capt1=ui.create.div(style2,'','角色信息',this);
	                    var line2=ui.create.div(style2,this);
	                    line2.style.display='none';
	                    var identity=ui.create.selectlist([['zhu','黑幕'],['zhong','异变'],['nei','路人'],['fan','自机']],'zhu',line2);
	                    identity.value='fan';
	                    identity.style.marginLeft='3px';
	                    identity.style.marginRight='3px';
	                    var position=ui.create.selectlist([['0','随机位置'],['1','一号位'],['2','二号位'],['3','三号位'],['4','四号位'],['5','五号位'],['6','六号位'],['7','七号位'],['8','八号位']],'1',line2);
	                    position.style.marginLeft='3px';
	                    position.style.marginRight='3px';
	                    var line2_t=ui.create.div(style2,this);
	                    line2_t.style.display='none';
	                    // line2_t.style.marginBottom='10px';
	                    ui.create.node('span','体力：',line2_t);
	                    var hp=ui.create.node('input',line2_t,{width:'40px'});
	                    hp.type='text';
	                    ui.create.node('span','体力上限：',line2_t,{marginLeft:'10px'});
	                    var maxHp=ui.create.node('input',line2_t,{width:'40px'});
	                    maxHp.type='text';
	                    ui.create.node('span','灵力：',line2_t,{marginLeft:'10px'});
	                    var lili=ui.create.node('input',line2_t,{width:'40px'});
	                    lili.type='text';
	                    ui.create.node('span','灵力上限：',line2_t,{marginLeft:'10px'});
	                    var maxlili=ui.create.node('input',line2_t,{width:'40px'});
	                    maxlili.type='text';
	                    ui.create.node('span','玩家 ',line2_t,{marginLeft:'10px'});
						var playercontrol=ui.create.node('input',line2_t);
						playercontrol.type='checkbox';

	                    var list=[];
	                    for(var i in lib.character){
	                        list.push([i,lib.translate[i]]);
	                    }

	                    list.sort(function(a,b){
	                        a=a[0];b=b[0];
	                        var aa=a,bb=b;
	                        if(aa.indexOf('_')!=-1){
	                            aa=aa.slice(aa.indexOf('_')+1);
	                        }
	                        if(bb.indexOf('_')!=-1){
	                            bb=bb.slice(bb.indexOf('_')+1);
	                        }
	                        if(aa!=bb){
	                            return aa>bb?1:-1;
	                        }
	                        return a>b?1:-1;
	                    });
	                    list.unshift(['random','自选主将']);
	                    var name1=ui.create.selectlist(list,list[0],line2);
	                    name1.style.marginLeft='3px';
	                    name1.style.marginRight='3px';
	                    name1.style.maxWidth='80px';
	                    list[0][1]='自选副将';
	                    list.unshift(['none','无副将']);
	                    var name2=ui.create.selectlist(list,list[0],line2);
	                    name2.style.marginLeft='3px';
	                    name2.style.marginRight='3px';
	                    name2.style.maxWidth='80px';

	                    var capt9=ui.create.div(style2,'','编辑牌堆',this);
	                    capt9.style.display='none';


	                    var capt2=ui.create.div(style2,'','添加卡牌',this);
	                    var line3=ui.create.div(style2,this);
	                    line3.style.display='none';
	                    capt1.style.display='none';
	                    capt2.style.display='none';

	                    var line5=ui.create.div(style2,this);
	                    line5.style.display='none';
	                    var pileaddlist=[];
	                    for(var i=0;i<lib.config.cards.length;i++){
	                        if(!lib.cardPack[lib.config.cards[i]]) continue;
	                        for(var j=0;j<lib.cardPack[lib.config.cards[i]].length;j++){
	                            var cname=lib.cardPack[lib.config.cards[i]][j];
	                            if (lib.translate[cname]){
	                            	pileaddlist.push([cname,get.translation(cname)]);
	                        	}
	                        }
	                    }
	                    for(var i in lib.cardPack){
	                        if(lib.config.all.cards.contains(i)) continue;
	                        for(var j=0;j<lib.cardPack[i].length;j++){
	                            var cname=lib.cardPack[i][j];
	                            pileaddlist.push([cname,get.translation(cname)]);
	                        }
	                    }
	                    pileaddlist.unshift(['random',['随机卡牌']]);
	                    var cardpileaddname=ui.create.selectlist(pileaddlist,null,line3);
	                    cardpileaddname.style.marginLeft='3px';
	                    cardpileaddname.style.marginRight='3px';
	                    cardpileaddname.style.width='85px';
	                    var cardpileaddsuit=ui.create.selectlist([
	                        ['random','随机花色'],
	                        ['heart','红桃'],
	                        ['diamond','方片'],
	                        ['club','梅花'],
	                        ['spade','黑桃'],
	                    ],null,line3);
	                    cardpileaddsuit.style.marginLeft='3px';
	                    cardpileaddsuit.style.marginRight='3px';
	                    cardpileaddsuit.style.width='85px';
	                    var cardpileaddnumber=ui.create.selectlist([
	                        ['random','随机点数'],1,2,3,4,5,6,7,8,9,10,11,12,13
	                    ],null,line3);
	                    cardpileaddnumber.style.marginLeft='3px';
	                    cardpileaddnumber.style.marginRight='3px';
	                    cardpileaddnumber.style.width='85px';

	                    var fakecard=function(info,position,capt){
	                        var name=info[0],suit=info[1],number=info[2];
	                        var card=ui.create.card(null,'noclick',true);
	                        card.style.zoom=0.6;
	                        number=parseInt(cardpileaddnumber.value);
	                        var name2=name;
	                        var suit2=suit;
	                        var number2=number;
	                        if(name2=='random') name2='sha';
	                        if(suit2=='random') suit2='?';
	                        if(!number2){
	                            number='random';
	                            number2='?';
	                        }
	                        card.init([suit2,number2,name2]);
	                        card.info=info;
	                        if(name=='random'){
	                            card.node.name.innerHTML=get.verticalStr('随机卡牌');
	                        }
	                        if(position&&capt){
	                            card.listen(function(){
	                                this.remove();
	                                if(!position.childElementCount) capt.style.display='none';
	                            });
	                            position.appendChild(card);
	                        }
	                        return card;
	                    };
	                    var cc_h=ui.create.node('button','加入手牌区',line5,function(){
	                        fakecard([cardpileaddname.value,cardpileaddsuit.value,cardpileaddnumber.value],line6_h,capt_h);
	                        capt_h.style.display='block';
	                    });
	                    var cc_e=ui.create.node('button','加入装备区',line5,function(){
	                        if(get.type(cardpileaddname.value)!='equip') return;
	                        var subtype=get.subtype(cardpileaddname.value);
	                        if (line6_e.childElementCount > 2){
	                        	line6_e.childNodes[2].remove();
	                        }
	                        fakecard([cardpileaddname.value,cardpileaddsuit.value,cardpileaddnumber.value],line6_e,capt_e);
	                        capt_e.style.display='block';
	                    });
	                    var cc_j=ui.create.node('button','加入技能牌',line5,function(){
	                        if(get.type(cardpileaddname.value)!='delay') return;
	                        for(var i=0;i<line6_j.childElementCount;i++){
	                            if(line6_j.childNodes[i].name==cardpileaddname.value){
	                                line6_j.childNodes[i].remove();break;
	                            }
	                        }
	                        fakecard([cardpileaddname.value,cardpileaddsuit.value,cardpileaddnumber.value],line6_j,capt_j);
	                        capt_j.style.display='block';
	                    });
	                    cc_h.style.marginLeft='3px';
	                    cc_h.style.marginRight='3px';
	                    cc_h.style.width='85px';
	                    cc_e.style.marginLeft='3px';
	                    cc_e.style.marginRight='3px';
	                    cc_e.style.width='85px';
	                    cc_j.style.marginLeft='3px';
	                    cc_j.style.marginRight='3px';
	                    cc_j.style.width='85px';

	                    var capt_h=ui.create.div(style2,'','手牌区',this);
	                    var line6_h=ui.create.div(style2,this);
	                    var capt_e=ui.create.div(style2,'','装备区',this);
	                    var line6_e=ui.create.div(style2,this);
	                    var capt_j=ui.create.div(style2,'','判定区',this);
	                    var line6_j=ui.create.div(style2,this);
	                    line6_j.style.marginBottom='10px';
	                    capt_h.style.display='none';
	                    capt_e.style.display='none';
	                    capt_j.style.display='none';

	                    var line10=ui.create.div(style2,this);
	                    line10.style.display='none';
	                    var ac_h=ui.create.node('button','加入牌堆顶',line10,function(){
	                        fakecard([cardpileaddname.value,cardpileaddsuit.value,cardpileaddnumber.value],line6_t,capt_t);
	                        capt_t.style.display='block';
	                    });
	                    var ac_e=ui.create.node('button','加入牌堆底',line10,function(){
	                        fakecard([cardpileaddname.value,cardpileaddsuit.value,cardpileaddnumber.value],line6_b,capt_b);
	                        capt_b.style.display='block';
	                    });
	                    var ac_j=ui.create.node('button','加入弃牌堆',line10,function(){
	                        fakecard([cardpileaddname.value,cardpileaddsuit.value,cardpileaddnumber.value],line6_d,capt_d);
	                        capt_d.style.display='block';
	                    });
	                    ac_h.style.marginLeft='3px';
	                    ac_h.style.marginRight='3px';
	                    ac_h.style.width='85px';
	                    ac_e.style.marginLeft='3px';
	                    ac_e.style.marginRight='3px';
	                    ac_e.style.width='85px';
	                    ac_j.style.marginLeft='3px';
	                    ac_j.style.marginRight='3px';
	                    ac_j.style.width='85px';

	                    var line11=ui.create.div(style2,this,'','<span>替换牌堆</span>');
	                    line11.style.display='none';
	                    var replacepile=ui.create.node('input',line11);
	                    replacepile.type='checkbox';

	                    ui.create.node('span',line11,'开局摸牌',{marginLeft:'10px'});
	                    var gameDraw=ui.create.node('input',line11);
	                    gameDraw.type='checkbox';
	                    gameDraw.checked=true;

	                    var capt_t=ui.create.div(style2,'','牌堆顶',this);
	                    var line6_t=ui.create.div(style2,this);
	                    var capt_b=ui.create.div(style2,'','牌堆底',this);
	                    var line6_b=ui.create.div(style2,this);
	                    var capt_d=ui.create.div(style2,'','弃牌堆',this);
	                    var line6_d=ui.create.div(style2,this);
	                    line6_d.style.marginBottom='10px';
	                    capt_t.style.display='none';
	                    capt_b.style.display='none';
	                    capt_d.style.display='none';

	                    var line4=ui.create.div(style2,this);
	                    line4.style.display='none';
	                    line4.style.marginTop='20px';
	                    var resetCharacter=function(){
	                        // line1.style.display='block';
	                        editPile.disabled=false;
	                        // editCode.disabled=false;
	                        saveButton.disabled=false;
	                        // exportButton.disabled=false;
	                        line7.style.display='block';
	                        line2.style.display='none';
	                        line2_t.style.display='none';
	                        line3.style.display='none';
	                        line4.style.display='none';
	                        line5.style.display='none';
	                        line6_h.style.display='none';
	                        line6_e.style.display='none';
	                        line6_j.style.display='none';
	                        capt1.style.display='none';
	                        capt2.style.display='none';
	                        capt_h.style.display='none';
	                        capt_e.style.display='none';
	                        capt_j.style.display='none';

	                        name1.value='random';
	                        name2.value='none';
	                        identity.value='fan';
	                        position.value='0';
	                        hp.value='';
	                        maxHp.value='';
	                        lili.value='';
	                        maxlili.value='';
	                        line6_h.innerHTML='';
	                        line6_e.innerHTML='';
	                        line6_j.innerHTML='';
	                        cardpileaddname.value='random';
	                        cardpileaddsuit.value='random';
	                        cardpileaddnumber.value='random';
	                        playercontrol.checked=false;
	                    };
	                    var createCharacter=function(info){
	                        var player=ui.create.player(null,true);
	                        player._customintro=function(uiintro){
	                            if(info.handcards.length){
	                                uiintro.addText('手牌',true);
	                                var hs=ui.create.div('.buttons');
	                                for(var i=0;i<info.handcards.length;i++){
	                                    hs.appendChild(fakecard(info.handcards[i]));
	                                }
	                                uiintro.add(hs);
	                            }
	                            else{
	                                return false;
	                            }
	                        }
	                        player.info=info;
	                        var name=info.name,name3=info.name2;
	                        if(name=='random'){
	                            name='re_caocao';
	                        }
	                        if(name3!='none'){
	                            if(name3=='random'){
	                                name3='liubei';
	                            }
	                            player.init(name,name3);
	                            if(info.name2=='random'){
	                                player.node.name2.innerHTML=get.verticalStr('自选副将');
	                            }
	                        }
	                        else{
	                            player.init(name);
	                        }
	                        if(info.name=='random'){
	                            player.node.name.innerHTML=get.verticalStr('自选主将');
	                        }
	                        if(info.maxHp){
	                            player.maxHp=info.maxHp;
	                        }
	                        if(info.hp){
	                            player.hp=Math.min(info.hp,player.maxHp);
	                        }
	                        if(info.maxlili){
	                            player.maxlili=info.maxlili;
	                        }
	                        if(info.lili){
	                            player.lili=Math.min(info.lili,player.maxlili);
	                        }
	                        for(var i=0;i<info.handcards.length;i++){
	                            player.node.handcards1.appendChild(ui.create.card());
	                        }
	                        for(var i=0;i<info.equips.length;i++){
	                            player.$equip(fakecard(info.equips[i]));
	                        } 
	                        for(var i=0;i<info.judges.length;i++){
	                            player.node.judges.appendChild(fakecard(info.judges[i]));
	                        }
	                        player.setIdentity(info.identity);
	                        var pos=info.position;
	                        if(pos==0){
	                            pos='随机位置';
	                        }
	                        else{
	                            pos=get.cnNumber(pos,true)+'号位'
	                        }
	                        player.setNickname(pos);
	                        player.update();
	                        player.style.transform='scale(0.7)';
	                        player.style.position='relative';
	                        player.style.left=0;
	                        player.style.top=0;
	                        player.style.margin='-18px';
	                        player.node.marks.remove();


	                        line7.appendChild(player);
	                        player.listen(function(){
	                            if(confirm('是否删除此角色？')){
	                                this.remove();
	                                if(line7.childElementCount<8){
	                                    addCharacter.disabled=false;
	                                }
	                            }
	                        });
	                        if(line7.childElementCount>=8){
	                            addCharacter.disabled=true;
	                        }

	                        return player;
	                    };
	                    ui.create.div('.menubutton.large','确定',line4,style3,function(){
	                        var info={
	                            name:name1.value,
	                            name2:name2.value,
	                            identity:identity.value,
	                            position:parseInt(position.value),
	                            hp:parseInt(hp.value),
	                            maxHp:parseInt(maxHp.value),
	                            lili:parseInt(lili.value),
	                            maxlili:parseInt(maxlili.value),
	                            playercontrol:playercontrol.checked,
	                            handcards:[],
	                            equips:[],
	                            judges:[]
	                        };
	                        for(var i=0;i<line7.childElementCount;i++){
	                            if(info.identity=='zhu'&&line7.childNodes[i].info.identity=='zhu'){
	                                alert('不能有两个黑幕');
	                                return;
	                            }
	                            if(info.position!=0&&info.position==line7.childNodes[i].info.position){
	                                alert('座位与现在角色相同');
	                                return;
	                            }
	                        }
	                        for(var i=0;i<line6_h.childElementCount;i++){
	                            info.handcards.push(line6_h.childNodes[i].info);
	                        }
	                        for(var i=0;i<line6_e.childElementCount;i++){
	                            info.equips.push(line6_e.childNodes[i].info);
	                        }
	                        for(var i=0;i<line6_j.childElementCount;i++){
	                            info.judges.push(line6_j.childNodes[i].info);
	                        }
	                        createCharacter(info);
	                        resetCharacter();
	                    });
	                    ui.create.div('.menubutton.large','取消',line4,style3,resetCharacter);
	                    var line7=ui.create.div(style2,this);
	                    line7.style.marginTop='12px';


	                    var capt8=ui.create.div(style2,'','胜负条件',this);
	                    capt8.style.display='none';
	                    var line8=ui.create.div(style2,this);
	                    line8.style.display='none';
	                    line8.style.marginTop='10px';
	                    line8.style.marginBottom='10px';
	                    var turnslist=[['1','一'],['2','两'],['3','三'],['4','四'],['5','五'],['6','六'],['7','七'],['8','八'],['9','九'],['10','十']];
	                    var results=[['none','无'],['win','胜利'],['lose','失败'],['tie','平局']];
	                    var turns=ui.create.selectlist(turnslist,'1',line8);
	                    ui.create.node('span','个回合后',line8,style);
	                    var turnsresult=ui.create.selectlist(results,'none',line8);


	                    var washes=ui.create.selectlist(turnslist,'1',line8);
	                    washes.style.marginLeft='20px';
	                    ui.create.node('span','次洗牌后',line8,style);
	                    var washesresult=ui.create.selectlist(results,'none',line8);

	                    var line9=ui.create.div(style2,this);
	                    line9.style.display='none';
	                    line9.style.marginTop='20px';
	                    var resetStatus=function(all){
	                        if(line7.childElementCount>=8){
	                            addCharacter.disabled=true;
	                        }
	                        else{
	                            addCharacter.disabled=false;
	                        }
	                        // editCode.disabled=false;
	                        saveButton.disabled=false;
	                        // exportButton.disabled=false;
	                        cardpileaddname.value='random';
	                        cardpileaddsuit.value='random';
	                        cardpileaddnumber.value='random';

	                        line8.style.display='none';
	                        capt8.style.display='none';
	                        capt9.style.display='none';
	                        line9.style.display='none';
	                        line10.style.display='none';
	                        line11.style.display='none';
	                        line3.style.display='none';
	                        line7.style.display='block';


	                        line6_t.style.display='none';
	                        line6_b.style.display='none';
	                        line6_d.style.display='none';
	                        capt_t.style.display='none';
	                        capt_b.style.display='none';
	                        capt_d.style.display='none';

	                        if(all===true){
	                            replacepile.checked=false;
	                            gameDraw.checked=true;
	                            turns.value='1';
	                            turnsresult.value='none';
	                            washes.value='1';
	                            washesresult.value='none';
	                            line6_t.innerHTML='';
	                            line6_b.innerHTML='';
	                            line6_d.innerHTML='';
	                        }
	                    }

	                    ui.create.div('.menubutton.large','确定',line9,style3,resetStatus);

	                    game.addSceneClear=function(){
	                        resetCharacter();
	                        resetStatus(true);
	                        scenename.value='';
	                        sceneintro.value='';
	                        line7.innerHTML='';
	                        delete _status.currentScene;
	                    };
	                    game.loadScene=function(scene){
	                        resetCharacter();
	                        resetStatus(true);
	                        scenename.value=scene.name;
	                        sceneintro.value=scene.intro;
	                        _status.currentScene=scene.name;
	                        line7.innerHTML='';
	                        if(scene.replacepile) replacepile.checked=true;
	                        if(scene.gameDraw) gameDraw.checked=true;
	                        else gameDraw.checked=false;
	                        if(scene.turns){
	                            turns.value=scene.turns[0].toString();
	                            turnsresult.value=scene.turns[1];
	                        }
	                        if(scene.washes){
	                            washes.value=scene.washes[0].toString();
	                            washesresult.value=scene.washes[1];
	                        }
	                        for(var i=0;i<scene.cardPileTop.length;i++){
	                            fakecard(scene.cardPileTop[i],line6_t,capt_t);
	                        }
	                        for(var i=0;i<scene.cardPileBottom.length;i++){
	                            fakecard(scene.cardPileBottom[i],line6_b,capt_b);
	                        }
	                        for(var i=0;i<scene.discardPile.length;i++){
	                            fakecard(scene.discardPile[i],line6_d,capt_d);
	                        }

	                        for(var i=0;i<scene.players.length;i++){
	                            createCharacter(scene.players[i]);
	                        }
	                    };
	                }
	                if(_status.sceneToLoad){
	                    var scene=_status.sceneToLoad;
	                    delete _status.sceneToLoad;
	                    game.loadScene(scene);
	                }
	            }
	        },
	        stage:{
	            name:'创建关卡',
	            content:{
	                submode:'normal'
	            },
	            nostart:true,
	            fullshow:true,
	            template:{
	                showcase:function(init){
	                    if(init){
	                        var name=lib.brawl[this.link].name;
	                        var stage=lib.storage.stage[name];
	                        var style2={position:'relative',display:'block',left:0,top:0,marginBottom:'10px',padding:0,width:'100%'};
	                        var style3={marginLeft:'4px',marginRight:'4px',position:'relative'}
	                        var line1=ui.create.div(style2,this);
	                        var line2=ui.create.div(style2,this);
	                        line2.style.lineHeight='50px';
	                        if(_status.extensionmade.contains(name)){
	                            ui.create.node('button','管理扩展',line1,function(){
	                                ui.click.configMenu();
	                                ui.click.extensionTab(name);
	                            },{marginLeft:'6px'});
	                        }
	                        else{
	                            ui.create.node('button','删除关卡',line1,function(){
	                                if(confirm('确定删除'+name+'？')){
	                                    game.removeStage(name);
	                                }
	                            },{marginLeft:'6px'});
	                        }
	                        ui.create.node('button','导出扩展',line1,function(){
	                            var level=stage.level;
	                            stage.level=0;
	                            var str='{name:"'+name+'",content:function(){\nif(lib.config.mode=="brawl"){\n'+
	                            'if(!lib.storage.stage) lib.storage.stage={};\n'+
	                            'if(!lib.storage.stage["'+name+'"]){\nlib.storage.stage["'+name+'"]='+get.stringify(stage)+';\n_status.extensionstage=true;}\n'+
	                            'if(!_status.extensionmade) _status.extensionmade=[];\n'+
	                            '_status.extensionmade.push("'+name+'");\n}}\n}';
	                            stage.level=level;
	                            var extension={'extension.js':'game.import("extension",function(lib,game,ui,get,ai,_status){return '+str+'})'};
	                            game.importExtension(extension,null,name);
	                        },{marginLeft:'6px'});
	                        var noactive=true;
	                        var clickNode=function(){
	                            if(this.classList.contains('unselectable')) return;
	                            if(!this.classList.contains('active')){
	                                var active=this.parentNode.querySelector('.menubutton.large.active');
	                                if(active){
	                                    active.classList.remove('active');
	                                }
	                                this.classList.add('active');
	                            }
	                        }
	                        for(var i=0;i<stage.scenes.length;i++){
	                            var node=ui.create.div('.menubutton.large',line2,stage.scenes[i].name,style3,clickNode);
	                            node.index=i;
	                            if(stage.mode=='sequal'){
	                                if(i==stage.level){
	                                    node.classList.add('active');
	                                    noactive=false;
	                                }
	                                else{
	                                    node.classList.add('unselectable');
	                                }
	                            }
	                            else if(stage.mode=='normal'){
	                                if(i>stage.level){
	                                    node.classList.add('unselectable');
	                                }
	                            }
	                            if(lib.storage.lastStage==i&&!node.classList.contains('unselectable')){
	                                node.classList.add('active');
	                                noactive=false;
	                            }
	                            else if(lib.storage.lastStage==undefined&&noactive&&!node.classList.contains('unselectable')){
	                                node.classList.add('active');
	                                noactive=false;
	                            }
	                        }
	                    }
	                },
	            },
	            showcase:function(init){
	                if(_status.sceneChanged){
	                    init=true;
	                    this.innerHTML='';
	                    delete _status.sceneChanged;
	                }
	                if(init){
	                    this.style.transition='all 0s';
	                    this.style.height=(this.offsetHeight-10)+'px';
	                    this.style.overflow='scroll';
	                    lib.setScroll(this);
	                    var style2={position:'relative',display:'block',left:0,top:0,marginBottom:'6px',padding:0,width:'100%'};
	                    var style3={marginLeft:'4px',marginRight:'4px',position:'relative'}

	                    var scenename=ui.create.node('input',ui.create.div(style2,'','关卡名称：',this),{width:'120px'});
	                    scenename.type='text';
	                    scenename.style.marginTop='20px';
	                    var sceneintro=ui.create.node('input',ui.create.div(style2,'','关卡描述：',this),{width:'120px'});
	                    sceneintro.type='text';
	                    sceneintro.style.marginBottom='10px';

	                    var line1=ui.create.div(style2,this);
	                    var line2=ui.create.div(style2,this);
	                    line1.style.marginBottom='10px';
	                    line2.style.lineHeight='50px';
	                    var scenes=[];
	                    for(var i in lib.storage.scene){
	                        scenes.push([i,i]);
	                    }
	                    if(!scenes.length){
	                        alert('请创建至少1个场景');
	                        return;
	                    }
	                    var scenelist=ui.create.selectlist(scenes,null,line1);
	                    var e1=function(){
	                        if(this.nextSibling){
	                            this.parentNode.insertBefore(this,this.nextSibling.nextSibling);
	                        }
	                    }
	                    var e2=function(){
	                        var that=this;
	                        this.movetimeout=setTimeout(function(){
	                            e1.call(that);
	                        },500);
	                    }
	                    var e3=function(){
	                        clearTimeout(this.movetimeout);
	                        delete this.movetimeout;
	                    }
	                    var e4=function(value){
	                        var node=ui.create.div('.menubutton.large',value,line2,style3,function(){
	                            if(confirm('是否移除'+this.innerHTML+'？')){
	                                this.remove();
	                            }
	                        });
	                        if(lib.config.touchscreen){
	                            node.ontouchstart=e2;
	                            node.ontouchend=e3;
	                            node.ontouchmove=e3;
	                        }
	                        else{
	                            node.oncontextmenu=e1;
	                            node.onmousedown=e2;
	                            node.onmouseup=e3;
	                            node.onmouseleave=e3;
	                        }
	                    }
	                    var addButton=ui.create.node('button','添加场景',line1,function(){
	                        e4(scenelist.value);
	                    },{marginLeft:'6px',marginRight:'12px'});
	                    var sceneconfig=ui.create.selectlist([
	                        ['normal','默认模式'],
	                        ['sequal','连续闯关'],
	                        ['free','自由选关']
	                    ],null,line1);
	                    var saveButton=ui.create.node('button','保存关卡',line1,function(){
	                        if(!scenename.value){
	                            alert('请填写关卡名称');
	                            return;
	                        }
	                        if(line2.childElementCount<2){
	                            alert('请添加至少2个场景');
	                            return;
	                        }
	                        var stage={
	                            name:scenename.value,
	                            intro:sceneintro.value,
	                            scenes:[],
	                            mode:sceneconfig.value,
	                            level:0
	                        };
	                        for(var i=0;i<line2.childElementCount;i++){
	                            stage.scenes.push(lib.storage.scene[line2.childNodes[i].innerHTML]);
	                        }
	                        if(lib.storage.stage[scenename.value]){
	                            if(!confirm('关卡名与现有关卡重复，是否覆盖？')){
	                                return;
	                            }
	                            game.removeStage(scenename.value);
	                        }
	                        lib.storage.stage[stage.name]=stage;
	                        game.save('stage',lib.storage.stage);
	                        game.addStage(stage.name,true);
	                    },{marginLeft:'6px'});
	                    game.addStageClear=function(){
	                        scenelist.value=scenes[0][0];
	                        sceneconfig.value='normal';
	                        scenename.value='';
	                        sceneintro.value='';
	                        line2.innerHTML='';
	                    };
	                }
	            }
	        }
	    },
	};
});
