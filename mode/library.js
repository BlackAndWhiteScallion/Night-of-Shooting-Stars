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
	                    //ui.create.div('.caption',caption),
	                    ui.create.div('.text center',intro),
	                    showcase,
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
	        	dialog.delete();
	        	ui.auto.show();
	        	game.switchMode('identity');
	        };
	        // 制作那个“斗”的键的。去掉会出bug，不知道为什么
	        var start=ui.create.div('.menubutton.round.highlight','←',dialog.content,clickStart);
	        start.style.position='absolute';
	        start.style.left='-100px';
	        start.style.right='auto';
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
	        start.hide();
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
	            intro:'',
	            showcase:function(init){
	            	var i;
	            	var list=[];
	            	for(i in lib.character){
						list.push(i);
						
					}
					event.list=list;
	            	var dialog=ui.create.dialog('hidden');
					dialog.classList.add('fixed');
					dialog.style.left = "0px";
					dialog.style.top = "0px";
					dialog.style.width = "100%";
					dialog.style.height = "100%";
					//ui.click.charactercard(i,null,null,true,dialog);
					dialog.add([list,'character']);
					this.appendChild(dialog);
					dialog.noopen=true;
	            },
	        },
	        cardview:{
	        	name:'卡牌一览',
	        	mode:'',
	        	intro:'卡牌花色点数以牌局内为准。',
	        	showcase:function(init){
	        		var i;
	            	var list=[];
					event.list=list;
	            	var dialog=ui.create.dialog('hidden');
					//var dialog=this;
					dialog.classList.add('fixed');
					//dialog.classList.add('bosscharacter');
					//dialog.classList.add('withbg');
					dialog.style.left = "0px";
					dialog.style.top = "0px";
					dialog.style.width = "100%";
					dialog.style.height = "100%";
					for (i in lib.card){
						if(lib.translate[i]){
							var card=game.createCard(i, null, null, null);
                            dialog.add(card);
                        }
					}
					this.appendChild(dialog);
					dialog.noopen=true;
	        	},
	        },
	        modeview:{
	        	name:'模式一览',
	        	mode:'',
	        	intro:'模式目前还在制作中',
	        	showcase:function(init){

	        	},
	        },
	        download:{
	        	name:'更多资源',
	        	intro:'欢迎来到雾雨魔法店！',
	        	showcase:function(init){

	        	},
	        },
	        thanks:{
	        	name:'鸣谢',
	        	mode:'',
	        	intro:'',
	        	showcase:function(init){

	        	}
	        }
	    },
	};
});
