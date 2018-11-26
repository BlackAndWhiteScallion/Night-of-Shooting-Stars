'use strict';
game.import('mode',function(lib,game,ui,get,ai,_status){
	return {
		name:'library',
	    game:{
	        syncMenu:true,
	    },
	    start:function(){
			ui.auto.hide();
			if(lib.config.background_music!='music_off'){
                ui.backgroundMusic.src=lib.assetURL+'audio/background/library.mp3';
            }
            var today = new Date();
            if(today.getMonth() == 3) ui.backgroundMusic.src=lib.assetURL+'audio/background/signature.mp3';
			
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
	        ui.background.setBackgroundImage('image/background/library.jpg');
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
	        	/*
	            ui.background=ui.create.div('.background');
				ui.background.style.backgroundSize="cover";
				ui.background.style.backgroundPosition='50% 50%';
				ui.background.setBackgroundImage('image/background/library.jpg');
				*/


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
	                    intro+='<br>'+info.intro[i];
	                }
	            }
	            else{
	                intro='';
	                if(modeinfo){
	                    intro+='（'+modeinfo+'）';
	                }
	                intro+=info.intro;
	            }
	            var today = new Date();
            	if(today.getMonth() == 3 && name == 'thanks') intro += '<br> 特殊BGM：資料室のお茶会 - key';
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
	    	updatelog:{
	    		name:'更新注释',
	    		mode:'',
	    		intro:'暂无更新',
	    		showcase:function(init){

	    		},
	    	},
	        characterview:{
	            name:'角色一览',
	            mode:'',
	            intro:'关闭，打开，和查看角色简介在左上角的选项/角色进行。',
	            showcase:function(init){
	            	var i;
	            	var list=[];
	            	for(i in lib.character){
						list.push(i);
					}
	            	var dialog=ui.create.dialog('hidden');
					dialog.style.left = "0px";
					dialog.style.top = "0px";
					dialog.style.width = "100%";
					dialog.style.height = "100%";
					dialog.add([list,'character'],false);
					var buttons=ui.create.buttons(list,'character');
					/*
                    for(var i=0;i<buttons.length;i++){
                    	/*
                        buttons[i].classList.add('noclick');
                        buttons[i].listen(banCharacter);
                        buttons[i].node.hp.style.transition='all 0s';
                        buttons[i].node.hp._innerHTML=buttons[i].node.hp.innerHTML;
						if(mode!='mode_banned'){
							buttons[i].updateBanned=updateBanned;
						}
						
						ui.click.charactercard(buttons[i].node.name,buttons[i]);
                    }
                    dialog.add(buttons);
					*/
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
						if(lib.translate[i] && lib.card[i].type != 'zhenfa' && !lib.card[i].vanish){
							var card=game.createCard(i, undefined, undefined, undefined);
                            dialog.add(card);
                        }
					}
					this.appendChild(dialog);
					dialog.noopen=true;
	        	},
	        },
	       	ruleview:{
	        	name:'规则帮助',
	        	mode:'',
	        	intro:[
	        		'规则简略可以在<a href="game/guide.pdf">这里</a>读到',
	        		'详细的资源可以在<a href="http://liuxingye.666forum.com/f1-forum">魔法店仓库里</a>和<a href = "https://jq.qq.com/?_wv=1027&k=570nlJG">官方QQ群</a>里找到',
	        		'游戏内的资料正在制作中',
	        		],
	        	showcase:function(init){

	        	},
	        },
	        modeview:{
	        	name:'模式一览',
	        	mode:'',
	        	intro:[
	        		'模式介绍全部可以在<a href="http://liuxingye.666forum.com/f5-forum">魔法店仓库里</a>和<a href = "https://jq.qq.com/?_wv=1027&k=570nlJG">官方QQ群</a>里找到',
	        		'游戏内的资料正在制作中',
	        		],
	        	showcase:function(init){

	        	},
	        },
	        download:{
	        	name:'更多资源',
	        	intro:[
	                '欢迎大家光临雾雨魔法店！',
	                '官方百度贴吧：<a href="https://tieba.baidu.com/f?kw=%CE%ED%D3%EA%BC%D2%B5%C4%C4%A7%B7%A8%B5%EA">雾雨家的魔法店吧</a>',
	                '官方资源库兼论坛：<a href="http://liuxingye.666forum.com">雾雨魔法店的仓库</a>',
	                '官方QQ群：<a href = "https://jq.qq.com/?_wv=1027&k=570nlJG">东方流星夜总会</a>',
	                '无论是聊天，想反映问题，还是想提出建议，都可以到以上任意一个地方去发表意见，我们会看到并尊重你的每一个意见。',
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
	                        /*
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
							*/
							for(var i=0;i<5;i++){
								switch(i){
			                        case 0:dx=-180;dy=0;break;
			                        case 1:dx=-140;dy=100;break;
			                        case 2:dx=0;dy=155;break;
			                        case 3:dx=140;dy=100;break;
			                        case 4:dx=180;dy=0;break;
			                    }
								var card=game.createCard('tao','noclick');
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
			                    })(card),1000);
							}
	                    }
	                    num2++;
	                    if(num>=5){
	                        num=0;
	                    }
	                },700);
	        	},
	        },
	        thanks:{
	        	name:'鸣谢',
	        	mode:'',
	        	intro:[
	        	'第一，感谢ZUN和上海爱丽丝幻乐团。只希望，玩这个游戏的大家也能感受到幻想乡的魅力。',
	        	'然后，感谢无名杀的各位开发者和维护者，提供了如此漂亮的一个平台。',
	        	'接着，感谢魔法店里陪着我们走到现在的大家。',
	        	'最后，感谢你，玩这个游戏的玩家，的支持。',
	        	'我们衷心希望，你能在这里玩的开心。',
	        	'',
	        	'',
	        	'',
	        	'游戏BGM：<a href="https://www.bilibili.com/video/av30877"> 东方连奏Pianoforte - Shiraha </a>',
	        	'红月异变BGM：「artificial」 【THE OTHER FLOWER】',
	        	'散樱异变BGM：「桜風」 【森羅万象】',
	        	'永夜异变BGM：「輝夜」 【凋叶棕】',
	        	'花映异变BGM：「LAST JUDGEMENT」 【SOUND HOLIC】',
	        	'萃梦异变BGM：「まだ、もう少しだけ」 【Minstrel】',
	        	'皆杀异变BGM： EastNewSound - 緋色月下、狂咲ノ絶　-1st Anniversary Remix-',
	        	'图鉴BGM：「忘らるる物語」 【凋叶棕】',
	        	],
	        	showcase:function(init){

	        	}
	        }
	    },
	};
});
