'use strict';
game.import('mode',function(lib,game,ui,get,ai,_status){
	return {
		name:'library',
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
	        // 应该是这里是制作列表的地方
	        var createNode=function(name){
	            var info=lib.brawl[name];
	            var node=ui.create.div('.dialogbutton.menubutton.large',info.name,packnode,clickCapt);
	            node.style.transition='all 0s';
	            var caption=info.name;
	            var modeinfo='';
	            if(info.mode){
	                modeinfo=get.translation(info.mode)+'模式';	// 这个是标注哪个模式下使用的
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
	        // 点那个巨大的“斗”之后
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
	        // 制作那个“斗”的键的。去掉会出bug，不知道为什么
	        var start=ui.create.div('.menubutton.round.highlight','←',dialog.content,clickStart);
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
	        characterview:{
	            name:'角色一览',
	            mode:'',
	            intro:'牌堆中所有普通锦囊牌数量翻倍；移除拥有集智技能的角色',
	            showcase:function(init){
	                var node=this;
	                var player1,player2;
	                if(init){
	                    player1=ui.create.player(null,true).init('huangyueying');
	                    player2=ui.create.player(null,true);
						if(lib.character.jsp_huangyueying){
							player2.init('jsp_huangyueying');
						}
						else if(lib.character.re_huangyueying){
	                        player2.init('re_huangyueying');
	                    }
	                    else{
	                        player2.init('huangyueying');
	                    }
	                    player1.style.left='20px';
	                    player1.style.top='20px';
	                    player1.style.transform='scale(0.9)';
	                    player1.node.count.innerHTML='2';
	                    player1.node.count.dataset.condition='mid';
	                    player2.style.left='auto';
	                    player2.style.right='20px';
	                    player2.style.top='20px';
	                    player2.style.transform='scale(0.9)';
	                    player2.node.count.innerHTML='2';
	                    player2.node.count.dataset.condition='mid';
	                    this.appendChild(player1);
	                    this.appendChild(player2);
	                    this.player1=player1;
	                    this.player2=player2;
	                }
	                else{
	                    player1=this.player1;
	                    player2=this.player2;
	                }
	                var rect1=player1.getBoundingClientRect();
	                var rect2=player2.getBoundingClientRect();
	                var left1=rect1.left+rect1.width/2-ui.arena.offsetLeft;
	                var left2=rect2.left+rect2.width/2-ui.arena.offsetLeft;
	                var top1=rect1.top+rect1.height/2-ui.arena.offsetTop;
	                var top2=rect2.top+rect2.height/2-ui.arena.offsetTop;

	                var createCard=function(wuxie){
	                    var card;
	                    if(wuxie){
	                        card=game.createCard('wuxie','noclick');
	                        card.style.transform='scale(0.9)';
	                    }
	                    else{
	                        card=ui.create.card(null,'noclick',true);
	                    }
	                    card.style.opacity=0;
	                    card.style.position='absolute';
	                    card.style.zIndex=2;
	                    card.style.margin=0;
	                    return card;
	                }

	                var func=function(){
	                    game.linexy([left1,top1,left2,top2]);
	                    var card=createCard(true);
	                    card.style.left='43px';
	                    card.style.top='58px';
	                    node.appendChild(card);
	                    ui.refresh(card);
	                    card.style.opacity=1;
	                    card.style.transform='scale(0.9) translate(137px,152px)';
	                    setTimeout(function(){
	                        card.delete();
	                    },1000);
	                    player1.node.count.innerHTML='1';

	                    setTimeout(function(){
	                        if(!node.showcaseinterval) return;
	                        player1.node.count.innerHTML='2';
	                        var card=createCard();
	                        card.style.left='43px';
	                        card.style.top='58px';
	                        card.style.transform='scale(0.9) translate(137px,152px)';
	                        node.appendChild(card);
	                        ui.refresh(card);
	                        card.style.opacity=1;
	                        card.style.transform='scale(0.9)';
	                        setTimeout(function(){
	                            card.delete();
	                        },1000);
	                    },300);

	                    setTimeout(function(){
	                        if(!node.showcaseinterval) return;
	                        player2.node.count.innerHTML='1';
	                        game.linexy([left2,top2,left1,top1]);
	                        var card=createCard(true);
	                        card.style.left='auto';
	                        card.style.right='43px';
	                        card.style.top='58px';
	                        node.appendChild(card);
	                        ui.refresh(card);
	                        card.style.opacity=1;
	                        card.style.transform='scale(0.9) translate(-137px,152px)';
	                        setTimeout(function(){
	                            card.delete();
	                        },700);

	                        setTimeout(function(){
	                            if(!node.showcaseinterval) return;
	                            player2.node.count.innerHTML='2';
	                            var card=createCard();
	                            card.style.left='auto';
	                            card.style.right='43px';
	                            card.style.top='58px';
	                            card.style.transform='scale(0.9) translate(-137px,152px)';
	                            node.appendChild(card);
	                            ui.refresh(card);
	                            card.style.opacity=1;
	                            card.style.transform='scale(0.9)';
	                            setTimeout(function(){
	                                card.delete();
	                            },700);
	                        },300);
	                    },1000);
	                };
	                node.showcaseinterval=setInterval(func,2200);
	                func();
	            },
	            init:function(){
	                for(var i in lib.character){
	                    var skills=lib.character[i][3]
	                    if(skills.contains('jizhi')||skills.contains('rejizhi')||skills.contains('lingzhou')){
	                        delete lib.character[i];
	                    }
	                }
	            },
	        },
	    },
	};
});
