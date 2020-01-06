'use strict';
game.import('mode',function(lib,game,ui,get,ai,_status){
	return {
		name:'puzzle',
	    game:{
	        syncMenu:true,
	    },
	    start:function(){
	        ui.auto.hide();
			if (!lib.storage.puzzle){
				lib.storage.puzzle = {};
			}
	        if(!lib.storage.puzzleset){
	            lib.storage.puzzleset={};
	        }
	        if(!_status.extensionmade){
	            _status.extensionmade=[];
	        }
			if (lib.puzzleset){
				for (var i in lib.puzzleset){
					//lib.storage.puzzleset[i] = lib.puzzleset[i];
					if (!lib.storage.puzzleset[i]){
						lib.storage.puzzleset[i] = lib.puzzleset[i];
					} else {
						for (var j in lib.puzzleset[i].scenes){
							if (!lib.storage.puzzleset[i].scenes[j]){
								lib.storage.puzzleset[i].scenes[j] = lib.puzzleset[i].scenes[j];
							}
						}
					}
				}
			}
	        if(_status.extensionscene){
	            game.save('scene',lib.storage.puzzle);
	        }
	        if(_status.extensionstage){
	            game.save('stage',lib.storage.puzzleset);
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
			lib.setPopped(ui.rules,function(){
				var uiintro=ui.create.dialog('hidden');
					uiintro.add('<div class="text left">选好了按下面那个大红按钮就行了</div>');
					uiintro.add('<div class="text left"><a href = "https://mp.weixin.qq.com/s/-pgrxrf61nyWU6bkwTbZTA" target="_blank">场景模式详细介绍</a></div>');
					uiintro.add(ui.create.div('.placeholder.slim'))
				return uiintro;
			},400);
			lib.character['kosuzu'] = ['female', '2', 3, [], []];
			lib.translate['kosuzu']='小铃';
			lib.characterIntro['kosuzu']='全名本居小铃，古书店“铃奈庵”的店员。爱好自然是读书，还有收集各种各样稀奇古怪的妖怪书。但愿她不要把自己又搞进什么危险的情况……<br><b>画师：安威拓郎</b><br>目前收到了阿求的邀请，正在做残局模式的管理员和导师。';
	        lib.setScroll(packnode);
	        var clickCapt=function(){
	            var active=this.parentNode.querySelector('.active');
	            if(this.link=='stage'){
	                if(get.is.empty(lib.storage.puzzle)){
	                    alert('请创建至少1个残局');
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
	            game.save('currentPuzzle',this.link);
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
	                intro='<ul style="text-align:left;margin-top:0">';
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
	           var i = ui.create.div('.text center',intro);
	            i.style.overflow='scroll';
	            i.style.margin='0px';
	            i.style.padding='0px';
	            var showcase=ui.create.div();
	            showcase.style.margin='0px';
	            showcase.style.padding='0px';
	            showcase.style.width='100%';
	            showcase.style.display='block'
	            showcase.style.overflow='scroll';
	            showcase.action=info.showcase;
	            showcase.link=name;
	            if(info.fullshow){
	                node.nodes=[showcase];
	                showcase.style.height='100%';
	            }
	            else{
	                node.nodes=[
	                    ui.create.div('.caption',caption),
	                    i,
	                    showcase,
	                ];
	            }
	            node.link=name;
	            node._nostart=info.nostart;
	            if(lib.storage.currentPuzzle==name){
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
	                        var stagesave=lib.storage.puzzleset;
	                        var stage=stagesave[active.link.slice(6)];
	                        game.save('lastStage',level.index);
	                        lib.onover.push(function(bool){
	                            _status.createControl=ui.controls[0];
	                            if(bool&&level.index+1<stage.scenes.length){
	                                ui.create.control('下一关',function(){
	                                    game.save('directStage',[stage.name,level.index+1],'puzzle');
	                                    localStorage.setItem(lib.configprefix+'directstart',true);
	                                    game.reload();
	                                });
	                                if(level.index+1>stage.level){
	                                    stage.level=level.index+1;
	                                    game.save('puzzleset',stagesave,'puzzle');
	                                }
	                                if(stage.mode!='sequal'){
	                                    game.save('lastStage',level.index+1,'puzzle');
	                                }
	                            }
	                            else{
	                                ui.create.control('重新开始',function(){
	                                    if(stage.mode=='sequal'&&bool&&level.index==stage.scenes.length-1){
	                                        game.save('directStage',[stage.name,0],'puzzle');
	                                    }
	                                    else{
	                                        game.save('directStage',[stage.name,level.index],'puzzle');
	                                    }
	                                    localStorage.setItem(lib.configprefix+'directstart',true);
	                                    game.reload();
	                                });
	                                if(stage.mode=='sequal'&&level.index==stage.scenes.length-1){
	                                    stage.level=0;
	                                    game.save('puzzleset',stagesave,'puzzle');
	                                }
	                                if(stage.mode!='sequal'){
	                                    game.save('lastStage',level.index,'puzzle');
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
	        start.style.zIndex=10;
	        start.style.transition='all 0s';
	        game.addScene=function(name,clear){
	            var scene=lib.storage.puzzle[name];
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
	            var stage=lib.storage.puzzleset[name];
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
	            delete lib.storage.puzzle[name];
	            game.save('scene',lib.storage.puzzle);
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
	            delete lib.storage.puzzleset[name];
	            game.save('puzzleset',lib.storage.puzzleset);
	            for(var i=0;i<packnode.childElementCount;i++){
	                if(packnode.childNodes[i].link=='stage_'+name){
	                    if(packnode.childNodes[i].classList.contains('active')){
	                        for(var j=0;j<packnode.childElementCount;j++){
	                            if(get.is.empty(lib.storage.puzzle)){
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
					sceneNode.style.color = '#3fff00';
	            }
	            else if (lib.brawl[i].stage == true){
					game.addStage(i);
				} else {
	                createNode(i);
	            }
	        }
	        if(sceneNode){
	            game.switchScene=function(){
	                clickCapt.call(sceneNode);
	            }
	        }
	        for(var i in lib.storage.puzzle){
				game.addScene(i);
	        }
	        for(var i in lib.storage.puzzleset){
	            if (!lib.brawl[i]) game.addStage(i);
	        }
	        if(!lib.storage.currentPuzzle){
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
	        library:{
	        	name:'残局向导',
				mode:'',
				nostart:true,
	        	intro:'',
	        	showcase:function(init){
	    			var node=this;
	    			if(init){
	                    var player=ui.create.player(null,true);
						/*
	                    lib.character['akyuu'] = ['female','1',3,['mengji'],[]];
	                    lib.characterIntro['akyuu']='全名稗田阿求，将毕生奉献于记载幻想乡的历史的稗田家的现任家主。持有过目不忘的记忆能力。<br><b>画师：渡瀬　玲<br></b><br>现因一些原因，被赋予了幻想乡的管理员权限。不过依然是和平常一样做着记录屋的工作。';
				        lib.skill['mengji'] = {};
				        lib.translate['mengji'] = '隐藏';
				        lib.translate['mengji_info'] = '达成多次异变胜利的话，可以解锁这个角色哟？';
	                    */
						player.init('kosuzu');
	                    player.node.avatar.show();
	                    //player.style.left='calc(50% - 75px)';
	                    player.style.left='0px';
	                    player.style.top='0px';
	                    player.style.zIndex = '10';
	                    player.style.cursor = 'pointer';
	                    player.node.count.remove();
	                    player.node.lili.remove();
	                    player.node.hp.remove();
	                    player.style.transition='all 0.5s';
	                    node.appendChild(player);
	                    node.playernode=player;
	        			var dialog=ui.create.dialog('hidden');
						dialog.style.left = "0px";
						dialog.style.top = "0px";
						dialog.style.width = "100%";
						dialog.style.height = "100%";
						dialog.classList.add('fixed');
	        			dialog.noopen=true;
						node.appendChild(dialog);
						var i = ['欢迎来到残局模式,'+lib.config.connect_nickname+'!',
							'一个残局，指的是一个由我预先布好的场面，然后由你来解开它！',
							'',
							'<u>残局的具体规则</u>',
							'1. 残局破解方式，是在一个回合内获得胜利。胜利方式与正常游戏相同。',
							'2. 游戏从你的回合开始，并从准备阶段开始进行。在你的回合结束时，如果游戏没有结束，则判定为游戏失败。',
							'3. 所有角色的手牌，装备，和技能牌都是固定的。',
							'4. 牌堆是固定的，且不包括多余的牌。洗牌时也不会重置至正常牌堆。技能牌堆同样。',
							'',
							'',
							'<u>然后呢，是一些相当关键的注意事项：</u>',
							'1. 在右上角的【牌堆】键可以查看牌堆和技能牌堆里的牌，【手牌】键可以查看所有其他角色的手牌。',
							'2. 残局中的AI与正常游戏相同：虽然智商不高，但是绝不会做出完全傻子的事情，所以不要想的太简单了！',
							'3. 抽牌时，没有牌构成牌堆了，就会游戏平局！这跟普通游戏也是一样的。',
							'4. 残局是以难度分类的：新手，简单，普通，困难，和噩梦。虽然说也没有限制，但是还是从简单点的开始比较好啦。',
							'',
							'那么，祝你武运昌盛！',
	    				];
						var j = [
	    				];
						if (!game.layout=='nova'){
							dialog.addText('<div><div style="display:block;left:180px;text-align:left;font-size:16px">'+i.join('<br>'));
							dialog.addText('<div><div style="display:block;top:140px;text-align:left;font-size:16px">'+j.join('<br>'));
						} else {
							dialog.addText('<div><div style="display:block;left:150px;text-align:left;font-size:16px">'+i.join('<br>'));
							dialog.addText('<div><div style="display:block;top:160px;text-align:left;font-size:16px">'+j.join('<br>'));
						}
					}
	        	},
	        },
			"新手":{
				name:'新手',
				stage:true,
			},
			'简单':{
				name:'简单',
				stage:true,
			},
			'普通':{
				name:'普通',
				stage:true,
			},
			/*
			'困难':{
				name:'困难',
			},
			'噩梦':{
				stage:true,
			},
			*/
	        scene:{
	            name:'创建残局',
	            content:{
	                submode:'normal'
	            },
	            nostart:true,
	            fullshow:true,
	            template:{
	                mode:'old_identity',
	                init:function(){
	                    game.saveConfig('double_character',false,'old_identity');
	                    _status.brawl.playerNumber=_status.brawl.scene.players.length;
	                },
	                showcase:function(init){
	                    if(init){
	                        var name=lib.brawl[this.link].name;
	                        var scene=lib.storage.puzzle[name];
	                        ui.create.node('button','编辑残局',this,function(){
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
	                            ui.create.node('button','删除残局',this,function(){
	                                if(confirm('确定删除'+name+'？')){
	                                    game.removeScene(name);
	                                }
	                            },{marginLeft:'6px'});
	                        }
	                        ui.create.node('button','导出扩展',this,function(){
	                            var str='{name:"'+name+'",content:function(){\nif(lib.config.mode=="puzzle"){\n'+
	                            'if(!lib.storage.puzzle) lib.storage.puzzle={};\n'+
	                            'if(!lib.storage.puzzle["'+name+'"]){\nlib.storage.puzzle["'+name+'"]='+get.stringify(scene, 10)+';\n_status.extensionscene=true;}\n'+
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
								if (info[3]){
									info2.push('');
									info2.push(info[3]);
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
							if (!scene.skillPileTop || !scene.skillPileBottom) return list;
							for(var i=scene.skillPileTop.length-1;i>=0;i--){
	                            list.unshift(parseInfo(scene.skillPileTop[i]));
	                        }
	                        for(var i=0;i<scene.skillPileBottom.length;i++){
	                            list.push(parseInfo(scene.skillPileBottom[i]));
	                        }
	                        return list;
	                    },
	                    gameStart:function(){
							game.saveConfig('background_music',lib.config.background_music);
                            game.playBackgroundMusic();
	                        ui.cardPileButton.style.display='';
							ui.auto.style.display='none';
                			ui.wuxie.style.display='none';
							ui.playerids.style.display = 'none';
							ui.rules.style.display = 'none';
							var puzzleButton = function(){
								var uiintro=ui.create.dialog('hidden');
								uiintro.listen(function(e){
									e.stopPropagation();
								});
								var num;
								if(game.online){
									num=_status.cardPileNum||0;
								}
								else{
									num=ui.cardPile.childNodes.length;
								}
								uiintro.add('牌堆剩余 <span style="font-family:'+'xinwei'+'">'+num);
								var list=[];
								if(ui.cardPile.childNodes.length){
									for(var i=0;i<ui.cardPile.childNodes.length;i++){
										list.push(ui.cardPile.childNodes[i]);
									}
									uiintro.add([list,'card']);
								}
								uiintro.add('技能牌剩余 <span style="font-family:'+'xinwei'+'">'+ui.skillPile.childNodes.length);
								var list=[];
								if(ui.skillPile.childNodes.length){
									for(var i=0;i<ui.skillPile.childNodes.length;i++){
										list.push(ui.skillPile.childNodes[i]);
									}
									uiintro.add([list,'card']);
								}
								uiintro.add('<div class="text center">弃牌堆</div>' + ui.discardPile.childNodes.length +'');
								if(ui.discardPile.childNodes.length){
									var list=[];
									for(var i=0;i<ui.discardPile.childNodes.length;i++){
										list.push(ui.discardPile.childNodes[i]);
									}
									uiintro.add([list,'card']);
								}
								else{
									uiintro.add('<div class="text center" style="padding-bottom:3px">无</div>');
								}
								return uiintro;
							};
							lib.setPopped(ui.cardPileButton,puzzleButton,220);
							lib.setPopped(ui.create.system('手牌',null,true),function(){
								var uiintro=ui.create.dialog('hidden');

								var players=game.players.concat(game.dead);
								for(var i=0;i<players.length;i++){
									if(players[i]!=game.me){
										uiintro.add(get.translation(players[i]));
										var cards=players[i].getCards('h');
										if(cards.length){
											uiintro.add(cards,true);
										}
										else{
											uiintro.add('（无）');
										}
									}
								}

								return uiintro;
							},220);
							/*
							ui.create.system('重来',function(){
								var level;
								if(Array.isArray(arguments[0])){
									level={index:arguments[0][1]};
								}
								else{
									level=dialog.content.querySelector('.menubutton.large.active');
								}
								var stagesave=lib.storage.puzzleset;
								var stage=stagesave[active.link.slice(6)];
								if(stage.mode=='sequal'&&bool&&level.index==stage.scenes.length-1){
									game.save('directStage',[stage.name,0],'puzzle');
								}
								else{
									game.save('directStage',[stage.name,level.index],'puzzle');
								}
								localStorage.setItem(lib.configprefix+'directstart',true);
								game.reload();
							});
							*/
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
	                            if(info.lili || info.lili == 0){
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
							game.pause();
							ui.create.dialog('<div><div style="width:280px;margin-left:120px;font-size:18px">'+scene.intro);
							ui.create.div('.avatar',ui.dialog).setBackground('kosuzu','character');
							ui.create.control('走起！',function(){
								ui.dialog.close();
								while(ui.controls.length) ui.controls[0].close();
								game.resume();
							});
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
								if (info[3]){
									info2.push('');
									info2.push(info[3]);
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
	                                //target.node.judges.appendChild(createCard(info.judges[j]));
	                            	target.addJudge(createCard(info.judges[j]));
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


	                    var scenename=ui.create.node('input',ui.create.div(style2,'','残局名称：',this),{width:'120px'});
	                    scenename.type='text';
	                    scenename.style.marginTop='20px';
	                    var sceneintro=ui.create.node('input',ui.create.div(style2,'','残局描述：',this),{width:'120px'});
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
	                    var editPile=ui.create.node('button','游戏选项',line1,function(){
	                        resetCharacter();
	                        addCharacter.disabled=true;
	                        // editCode.disabled=true;
	                        saveButton.disabled=true;
	                        // exportButton.disabled=true;
	                        line7.style.display='none';
	                        //line8.style.display='block';
	                        //capt8.style.display='block';
	                        line9.style.display='block';
	                        line10.style.display='block';
	                        line11.style.display='block';
	                        //capt9.style.display='block';
	                        line3.style.display='block';

	                        line6_t.style.display='block';
	                        line6_b.style.display='block';
	                        line6_d.style.display='block';
	                        line6_st.style.display='block';
	                        line6_sb.style.display='block';
	                        if(line6_t.childElementCount) capt_t.style.display='block';
	                        if(line6_b.childElementCount) capt_b.style.display='block';
	                        if(line6_st.childElementCount) capt_st.style.display='block';
	                        if(line6_sb.childElementCount) capt_sb.style.display='block';
	                        if(line6_d.childElementCount) capt_d.style.display='block';
	                    },style);
	                    // var editCode=ui.create.node('button','编辑代码',line1,function(){
	                    //     console.log(1);
	                    // },style);
	                    var saveButton=ui.create.node('button','保存残局',line1,function(){
	                        if(!scenename.value){
	                            alert('请填写残局名称');
	                            return;
	                        }
	                        var scene={
	                            name:scenename.value,
	                            intro:sceneintro.value,
	                            players:[],
	                            cardPileTop:[],
	                            cardPileBottom:[],
	                            discardPile:[],
								skillPileTop:[],
								skillPileBottom:[],
	                        };
	                        for(var i=0;i<line7.childElementCount;i++){
	                            scene.players.push(line7.childNodes[i].info);
	                        }
	                        if(scene.players.length<2){
	                            alert('请添加至少两名角色');
	                            return;
	                        }
	                        if(lib.storage.puzzle[scenename.value]){
	                            if(_status.currentScene!=scenename.value){
	                                if(!confirm('残局名与现有残局重复，是否覆盖？')){
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
							for(var i=0;i<line6_st.childElementCount;i++){
	                            scene.skillPileTop.push(line6_st.childNodes[i].info);
	                        }
	                        for(var i=0;i<line6_sb.childElementCount;i++){
	                            scene.skillPileBottom.push(line6_sb.childNodes[i].info);
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
	                        lib.storage.puzzle[scene.name]=scene;
	                        game.save('scene',lib.storage.puzzle);
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
	                        if (line6_e.childElementCount > 2){
	                        	line6_e.childNodes[2].remove();
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
	                    var capt_j=ui.create.div(style2,'','技能牌',this);
	                    var line6_j=ui.create.div(style2,this);
	                    line6_j.style.marginBottom='10px';
	                    capt_h.style.display='none';
	                    capt_e.style.display='none';
	                    capt_j.style.display='none';

	                    var line10=ui.create.div(style2,this);
	                    line10.style.display='none';
	                    var ac_h=ui.create.node('button','加入牌堆顶',line10,function(){
							if(get.type(cardpileaddname.value)=='delay' || get.type(cardpileaddname.value)=='zhenfa') return;
	                        fakecard([cardpileaddname.value,cardpileaddsuit.value,cardpileaddnumber.value],line6_t,capt_t);
	                        capt_t.style.display='block';
	                    });
	                    var ac_e=ui.create.node('button','加入牌堆底',line10,function(){
							if(get.type(cardpileaddname.value)=='delay' || get.type(cardpileaddname.value)=='zhenfa') return;
	                        fakecard([cardpileaddname.value,cardpileaddsuit.value,cardpileaddnumber.value],line6_b,capt_b);
	                        capt_b.style.display='block';
	                    });
	                    var ac_j=ui.create.node('button','加入弃牌堆',line10,function(){
							if(get.type(cardpileaddname.value)=='delay' || get.type(cardpileaddname.value)=='zhenfa') return;
	                        fakecard([cardpileaddname.value,cardpileaddsuit.value,cardpileaddnumber.value],line6_d,capt_d);
	                        capt_d.style.display='block';
	                    });
						var ac_st=ui.create.node('button','加入技能牌堆顶',line10,function(){
							if(get.type(cardpileaddname.value)!='delay') return;
	                        fakecard([cardpileaddname.value,cardpileaddsuit.value,cardpileaddnumber.value],line6_st,capt_st);
	                        capt_st.style.display='block';
	                    });
						var ac_sb=ui.create.node('button','加入技能牌堆底',line10,function(){
							if(get.type(cardpileaddname.value)!='delay') return;
	                        fakecard([cardpileaddname.value,cardpileaddsuit.value,cardpileaddnumber.value],line6_sb,capt_sb);
	                        capt_sb.style.display='block';
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
						ac_st.style.marginLeft='3px';
	                    ac_st.style.marginRight='3px';
	                    ac_st.style.width='85px';
						ac_sb.style.marginLeft='3px';
	                    ac_sb.style.marginRight='3px';
	                    ac_sb.style.width='85px';

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
						var capt_st=ui.create.div(style2,'','技能牌堆顶',this);
	                    var line6_st=ui.create.div(style2,this);
	                    var capt_sb=ui.create.div(style2,'','技能牌堆底',this);
	                    var line6_sb=ui.create.div(style2,this);
	                    line6_d.style.marginBottom='10px';
	                    capt_t.style.display='none';
	                    capt_b.style.display='none';
						capt_st.style.display='none';
	                    capt_sb.style.display='none';
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
	                            name='zigui';
	                        }
	                        if(name3!='none'){
	                            if(name3=='random'){
	                                name3='zigui';
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
	                    var turnsresult=ui.create.selectlist(results,'lose',line8);


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
							line6_st.style.display='none';
	                        line6_sb.style.display='none'; 
	                        line6_d.style.display='none';
	                        capt_t.style.display='none';
	                        capt_b.style.display='none';
							capt_st.style.display='none';
	                        capt_sb.style.display='none';
	                        capt_d.style.display='none';

	                        if(all===true){
	                            replacepile.checked=false;
	                            gameDraw.checked=true;
	                            turns.value='1';
	                            turnsresult.value='lose';
	                            washes.value='1';
	                            washesresult.value='none';
	                            line6_t.innerHTML='';
	                            line6_b.innerHTML='';
	                            line6_d.innerHTML='';
								line6_st.innerHTML='';
	                            line6_sb.innerHTML='';
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
	                        var stage=lib.storage.puzzleset[name];
							var style2={position:'relative',display:'block',left:0,top:'15px',marginBottom:'10px',padding:0,width:'100%'};
	                        var style3={marginLeft:'4px',marginRight:'4px',position:'relative'}
	                        var line1=ui.create.div(style2,this);
	                        var line2=ui.create.div(style2,this);
	                        line2.style.lineHeight='50px';
	                        if(_status.extensionmade.contains(name)){
	                            ui.create.node('button','管理扩展',line1,function(){
	                                ui.click.configMenu();
	                                ui.click.extensionTab(name);
	                            },{marginLeft:'6px'});
	                        }else{
	                            ui.create.node('button','删除关卡',line1,function(){
	                                if(confirm('确定删除'+name+'？')){
	                                    game.removeStage(name);
	                                }
	                            },{marginLeft:'6px'});
	                        }
	                        ui.create.node('button','导出扩展',line1,function(){
	                            var level=stage.level;
	                            stage.level=0;
	                            var str='{name:"'+name+'",content:function(){\nif(lib.config.mode=="puzzle"){\n'+
	                            'if(!lib.storage.puzzleset) lib.storage.puzzleset={};\n'+
	                            'if(!lib.storage.puzzleset["'+name+'"]){\nlib.storage.puzzleset["'+name+'"]='+get.stringify(stage)+';\n_status.extensionstage=true;}\n'+
	                            'if(!_status.extensionmade) _status.extensionmade=[];\n'+
	                            '_status.extensionmade.push("'+name+'");\n}}\n}';
	                            stage.level=level;
	                            var extension={'extension.js':'game.import("extension",function(lib,game,ui,get,ai,_status){return '+str+'})'};
	                            game.importExtension(extension,null,name);
	                        },{marginLeft:'6px'});
	                        if (lib.brawl[name]) line1.style.display = 'none';
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
	                    for(var i in lib.storage.puzzle){
	                        scenes.push([i,i]);
	                    }
	                    if(!scenes.length){
	                        alert('请创建至少1个残局');
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
	                    var addButton=ui.create.node('button','添加残局',line1,function(){
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
	                            alert('请添加至少2个残局');
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
	                            stage.scenes.push(lib.storage.puzzle[line2.childNodes[i].innerHTML]);
	                        }
	                        if(lib.storage.puzzleset[scenename.value]){
	                            if(!confirm('关卡名与现有关卡重复，是否覆盖？')){
	                                return;
	                            }
	                            game.removeStage(scenename.value);
	                        }
	                        lib.storage.puzzleset[stage.name]=stage;
	                        game.save('puzzleset',lib.storage.puzzleset);
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
		puzzleset:{
			"新手":{
				name:"新手",
				intro:"无论是谁都有新手上路的时候！<br>解开这些残局，来证明你已经精通了游戏的操作吧！",
				stage:true,
				scenes:[
					{name:'1',
						intro:"新手入门的第一关，不用紧张！<br>我们来复习一下残局模式的规则吧：<br>在一回合内要拿下游戏胜利。<br>牌堆，手牌，技能牌，装备，都是固定的。<br>牌堆里的牌，和其他人手牌，都可以在右上角查看。<br>那么，去拿下你的首胜吧！",
						players:[
							{name:"kosuzu",
							name2:"none",
							identity:"zhu",
							position:0,
							hp:null,maxHp:null,lili:2,maxlili:null,
							playercontrol:true,
							handcards:[],equips:[],judges:[]
							},
							{name:"lunasa",
							name2:"none",
							identity:"fan",
							position:1,
							hp:1, maxHp:null, lili:2, maxlili:null,
							playercontrol:false,
							handcards:[["shan","diamond",10],],equips:[],judges:[]
							},
						],
						cardPileTop:[["sha","spade",8], ["shunshou","diamond",4]],cardPileBottom:[],discardPile:[],
						skillPileTop:[],skillPileBottom:[],gameDraw:false,replacepile:true,turns:[1,"lose"],
					},
					{name:'2',
						intro:"该强化的时候就要强化，灵力毕竟不能留着过年啊！",
						players:[
							{name:"kosuzu",
							name2:"none",
							identity:"zhu",
							position:0,
							hp:null,maxHp:null,lili:2,maxlili:null,
							playercontrol:true,
							handcards:[],equips:[],judges:[]
							},
							{name:"lunasa",
							name2:"none",
							identity:"fan",
							position:1,
							hp:1, maxHp:null, lili:null, maxlili:null,
							playercontrol:false,
							handcards:[["shan","diamond",10]],equips:[["mirror","club",8]],judges:[]
							},
						],
						cardPileTop:[["guohe","spade",8],["sha","spade",2],["sha","spade",6]],cardPileBottom:[],discardPile:[],
						skillPileTop:[],skillPileBottom:[],gameDraw:false,replacepile:true,turns:[1,"lose"],
					},
					{name:'3',
						intro:"禁忌牌的力量，虽然说从我这里说出来不太合适，但是请一定小心……",
						players:[
							{name:"kosuzu",
							name2:"none",
							identity:"zhu",
							position:0,
							hp:null,maxHp:null,lili:2,maxlili:null,
							playercontrol:true,
							handcards:[["lingbi","spade",4]],equips:[],judges:[]
							},
							{name:"lunasa",
							name2:"none",
							identity:"fan",
							position:1,
							hp:1, maxHp:null, lili:null, maxlili:null,
							playercontrol:false,
							handcards:[["tao","diamond",12]],equips:[],judges:[]
							},
						],
						cardPileTop:[["sha","spade",2],["sha","spade",5]],cardPileBottom:[],discardPile:[],
						skillPileTop:[],skillPileBottom:[],gameDraw:false,replacepile:true,turns:[1,"lose"],
					},
					{name:'4',
						intro:"这里可是幻想乡，不要忘记了你那独一无二的武器……！",
						players:[
							{name:"reimu",
							name2:"none",
							identity:"zhu",
							position:0,
							hp:null,maxHp:null,lili:3,maxlili:null,
							playercontrol:true,
							handcards:[["sha","spade",2]],equips:[],judges:[]
							},
							{name:"lunasa",
							name2:"none",
							identity:"fan",
							position:1,
							hp:1, maxHp:null, lili:null, maxlili:null,
							playercontrol:false,
							handcards:[],equips:[["mirror","club",8]],judges:[]
							},
						],
						cardPileTop:[["sha","club",3],["sha","club",4],["sha","spade",5]],cardPileBottom:[],discardPile:[],
						skillPileTop:[],skillPileBottom:[],gameDraw:false,replacepile:true,turns:[1,"lose"],
					},
					{name:'5',
						intro:"除了别忘记你那独一无二的武器以外，也别忘记你对手那独一无二的武器！",
						players:[
							{name:"kosuzu",
							name2:"none",
							identity:"zhu",
							position:0,
							hp:2,maxHp:null,lili:3,maxlili:null,
							playercontrol:true,
							handcards:[["tao","heart",8]],equips:[],judges:[]
							},
							{name:"lunasa",
							name2:"none",
							identity:"fan",
							position:1,
							hp:1, maxHp:null, lili:3, maxlili:null,
							playercontrol:false,
							handcards:[["wuzhong","heart",8]],equips:[],judges:[]
							},
						],
						cardPileTop:[["sha","club",3],["zhiyuu","club",13]],cardPileBottom:[],discardPile:[],
						skillPileTop:[],skillPileBottom:[],gameDraw:false,replacepile:true,turns:[1,"lose"],
					},
					{name:'6',
						intro:"技能牌可比想象的容易使用多啦。",
						players:[
							{name:"kosuzu",
							name2:"none",
							identity:"zhu",
							position:0,
							hp:1,maxHp:null,lili:3,maxlili:null,
							playercontrol:true,
							handcards:[],equips:[],judges:[["lianji",null,null]]
							},
							{name:"lunasa",
							name2:"none",
							identity:"fan",
							position:1,
							hp:2, maxHp:null, lili:2, maxlili:null,
							playercontrol:false,
							handcards:[],equips:[],judges:[]
							},
						],
						cardPileTop:[["sha","spade",5],["sha","spade",2]],cardPileBottom:[],discardPile:[],
						skillPileTop:[],skillPileBottom:[],gameDraw:false,replacepile:true,turns:[1,"lose"],
					},
					{name:'7',
						intro:"禁忌牌的两种效果，对手的技能牌效果，该做出什么选择呢？",
						players:[
							{name:"kosuzu",
							name2:"none",
							identity:"zhu",
							position:0,
							hp:null,maxHp:null,lili:3,maxlili:null,
							playercontrol:true,
							handcards:[["zuiye","club",3]],equips:[],judges:[["lianji",null,null]]
							},
							{name:"lunasa",
							name2:"none",
							identity:"fan",
							position:1,
							hp:2, maxHp:null, lili:2, maxlili:null,
							playercontrol:false,
							handcards:[['tao', 'heart', 13]],equips:[],judges:[["shengdun",null,null]]
							},
						],
						cardPileTop:[["sha","spade",5], ["sha","spade",2]],cardPileBottom:[],discardPile:[],
						skillPileTop:[],skillPileBottom:[],gameDraw:false,replacepile:true,turns:[1,"lose"],
					},
					{name:'8',
						intro:"没有灵力了就没法造成伤害了啊，该怎么办啊！",
						players:[
							{name:"kosuzu",
							name2:"none",
							identity:"zhu",
							position:0,
							hp:1,maxHp:null,lili:0,maxlili:null,
							playercontrol:true,
							handcards:[],equips:[],judges:[["lianji",null,null]]
							},
							{name:"lunasa",
							name2:"none",
							identity:"fan",
							position:1,
							hp:1, maxHp:null, lili:2, maxlili:null,
							playercontrol:false,
							handcards:[],equips:[],judges:[]
							},
						],
						cardPileTop:[["sha","heart",5, 1],["sha","spade",2]],cardPileBottom:[],discardPile:[],
						skillPileTop:[],skillPileBottom:[],gameDraw:false,replacepile:true,turns:[1,"lose"],
					},
					{name:'9',
						intro:"游戏相关的规则差不多就到这里了。<br>那么，该是时候来进行你的毕业测验啦！<br>加油！",
						players:[
							{name:"reimu",
							name2:"none",
							identity:"zhu",
							position:0,
							hp:null,maxHp:null,lili:3,maxlili:null,
							playercontrol:true,
							handcards:[['guohe', 'spade', '3']],equips:[['stone', 'spade', '7']],judges:[['lingyong', null, null]]
							},
							{name:"lunasa",
							name2:"none",
							identity:"fan",
							position:1,
							hp:1, maxHp:null, lili:3, maxlili:null,
							playercontrol:false,
							handcards:[["shan","heart",5], ["shan","diamond",7], ["wuxie","spade",12]],equips:[["mirror","club",8]],judges:[['shengdun', null, null]],
							},
						],
						cardPileTop:[["shunshou","diamond",3],["sha","spade",2], ['sha', 'spade', 9]],cardPileBottom:[],discardPile:[],
						skillPileTop:[],skillPileBottom:[],gameDraw:false,replacepile:true,turns:[1,"lose"],
					},
				],
				level:0,
				mode:'normal',
			},
			'简单':{
				name:'简单',
				intro:"简单易懂，相对轻松的残局们。<br>用你的智慧来扫荡这些敌人吧！",
				stage:true,
				scenes:[
					{name:'1',
						intro:"禁忌牌的使用还记得吗？记不得的话，再来一次吧？",
						players:[
							{name:"keine",
							name2:"none",
							identity:"zhu",
							position:0,
							hp:null,maxHp:null,lili:2,maxlili:null,
							playercontrol:true,
							handcards:[],equips:[],judges:[]
							},
							{name:"kosuzu",
							name2:"none",
							identity:"fan",
							position:1,
							hp:2, maxHp:null, lili:2, maxlili:null,
							playercontrol:false,
							handcards:[["shan","diamond",10],],equips:[],judges:[]
							},
						],
						cardPileTop:[["sha","spade",8], ["zuiye","club",3]],cardPileBottom:[],discardPile:[],
						skillPileTop:[],skillPileBottom:[],gameDraw:false,replacepile:true,turns:[1,"lose"],
					},
					{name:'2',
						intro:"即使是神的保佑，也不是万能的。",
						players:[
							{name:"wriggle",
							name2:"none",
							identity:"zhu",
							position:0,
							hp:null,maxHp:null,lili:1,maxlili:null,
							playercontrol:true,
							handcards:[],equips:[],judges:[]
							},
							{name:"kosuzu",
							name2:"none",
							identity:"fan",
							position:1,
							hp:2, maxHp:null, lili:2, maxlili:null,
							playercontrol:false,
							handcards:[],equips:[['mirror', 'club', 8]],judges:[]
							},
						],
						cardPileTop:[["sha","spade",8], ["zuiye","club",3], ['sha', 'club', '7']],cardPileBottom:[],discardPile:[],
						skillPileTop:[['shenyou', null, null]],skillPileBottom:[],gameDraw:false,replacepile:true,turns:[1,"lose"],
					},
					{name:'3',
						intro:"就是自损一千，也要伤敌八百！",
						players:[
							{name:"flandre",
							name2:"none",
							identity:"zhu",
							position:0,
							hp:null,maxHp:null,lili:4,maxlili:null,
							playercontrol:true,
							handcards:[["sha", 'spade', 10]],equips:[],judges:[]
							},
							{name:"lyrica",
							name2:"none",
							identity:"fan",
							position:1,
							hp:1, maxHp:null, lili:5, maxlili:null,
							playercontrol:false,
							handcards:[["tao","heart",6],["tao", "heart", 7], ["tao", "heart", 8], ["tao", "heart", 12]],equips:[],judges:[]
							},
						],
						cardPileTop:[["sha","spade",8], ["danmakucraze","spade",12], ['sha', 'club', 7]],cardPileBottom:[],discardPile:[],
						skillPileTop:[],skillPileBottom:[],gameDraw:false,replacepile:true,turns:[1,"lose"],
					},
					{name:'4',
						intro:"一个夜雀的基本本领，要从完全驾驭夜盲症开始。",
						players:[
							{name:"mystia",
							name2:"none",
							identity:"zhu",
							position:0,
							hp:null,maxHp:null,lili:2,maxlili:null,
							playercontrol:true,
							handcards:[["shan", 'diamond', 10], ["shan", 'diamond', 11], ["shan", 'heart', 2]],equips:[],judges:[]
							},
							{name:"koakuma",
							name2:"none",
							identity:"fan",
							position:1,
							hp:1, maxHp:null, lili:1, maxlili:null,
							playercontrol:false,
							handcards:[["shan","diamond",4],["shan", "diamond", 7], ["shan", "heart", 13]],equips:[],judges:[['shenyou', null, null]]
							},
						],
						cardPileTop:[["juedou","heart",11], ['guohe', 'club', 4]],cardPileBottom:[],discardPile:[],
						skillPileTop:[],skillPileBottom:[],gameDraw:false,replacepile:true,turns:[1,"lose"],
					},
					{name:'5',
						intro:"不仅牌堆里完全没有伤害牌，甚至还有三张葱？这得什么疯子才能赢？",
						players:[
							{name:"merlin",
							name2:"none",
							identity:"zhu",
							position:0,
							hp:1,maxHp:null,lili:2,maxlili:null,
							playercontrol:true,
							handcards:[['houraiyuzhi', 'heart', 12]],equips:[],judges:[]
							},
							{name:"kosuzu",
							name2:"none",
							identity:"fan",
							position:1,
							hp:1, maxHp:null, lili:1, maxlili:null,
							playercontrol:false,
							handcards:[["shan", "heart", 13]],equips:[],judges:[]
							},
						],
						cardPileTop:[["tao", "heart", 6], ["tao", 'heart', 4], ["tao", "heart", "9"], ['shan', 'diamond', 3]],cardPileBottom:[],discardPile:[],
						skillPileTop:[],skillPileBottom:[],gameDraw:false,replacepile:true,turns:[1,"lose"],
					},
					{name:'6',
						intro:"下雪天那么冷，就是能复活也不会愿意复活在雪大的天气吧……特别是暴风雪的话……",
						players:[
							{name:"letty",
							name2:"none",
							identity:"zhu",
							position:0,
							hp:3,maxHp:null,lili:3,maxlili:null,
							playercontrol:true,
							handcards:[['lingbi', 'spade', 4],["wuxie", "diamond", 12],['sha', 'spade', 9]],equips:[],judges:[]
							},
							{name:"kaguya",
							name2:"none",
							identity:"fan",
							position:1,
							hp:1, maxHp:null, lili:5, maxlili:null,
							playercontrol:false,
							handcards:[["wuxie", "club", 12],['shan', 'diamond', 5], ['tao', 'heart', 7]],equips:[],judges:[]
							},
						],
						cardPileTop:[["tianguo", "heart", 8],['juedou', 'club', 1]],cardPileBottom:[],discardPile:[],
						skillPileTop:[],skillPileBottom:[],gameDraw:false,replacepile:true,turns:[1,"lose"],
					},
				],
				level:0,
				mode:'normal',
			},
			'普通':{
				intro:"普普通通，不难不弱的难度<br>好好享受脑海闪电的感觉吧。",
				stage:true,
				scenes:[
					{name:'1',
						intro:"操作命运是很强的能力，但是命运数量不够，种类不够……该怎么办呢？",
						players:[
							{name:"remilia",
							name2:"none",
							identity:"zhu",
							position:0,
							hp:3,maxHp:null,lili:null,maxlili:null,
							playercontrol:true,
							handcards:[],equips:[],judges:[]
							},
							{name:"merlin",
							name2:"none",
							identity:"fan",
							position:1,
							hp:1, maxHp:null, lili:5, maxlili:null,
							playercontrol:false,
							handcards:[],equips:[["yinyangyu","heart",5, -1], ["bailou","club",6, -1]],judges:[]
							},
						],
						cardPileTop:[["juedou","heart",11], ["tao","diamond",12], ["guohe","club",4], ["gungnir","heart", 13], ["simen","spade",2], ["reidaisai","heart",6]],cardPileBottom:[],discardPile:[],
						skillPileTop:[],skillPileBottom:[],gameDraw:false,replacepile:true,turns:[1,"lose"],
					},
					{name:'2',
						intro:"只有做好裁决自己的觉悟的人，才能够裁决别人。",
						players:[
							{name:"eiki",
							name2:"none",
							identity:"zhu",
							position:0,
							hp:3,maxHp:null,lili:5,maxlili:null,
							playercontrol:true,
							handcards:[["sha","diamond",7, 1],["deathfan","heart",1],["tao","heart",8]],equips:[],judges:[]
							},
							{name:"flandre",
							name2:"none",
							identity:"fan",
							position:1,
							hp:3, maxHp:null, lili:1, maxlili:null,
							playercontrol:false,
							handcards:[["shan","diamond",10],["tao","heart",12]],equips:[],judges:[]
							},
						],
						cardPileTop:[["shan","diamond",4], ["tao","heart",3]],cardPileBottom:[],discardPile:[],
						skillPileTop:[],skillPileBottom:[],gameDraw:false,replacepile:true,turns:[1,"lose"],
					},
					/*
					{name:'3',
						intro:"",
						players:[
							{name:"yuuka",
							name2:"none",
							identity:"zhu",
							position:0,
							hp:1,maxHp:null,lili:5,maxlili:null,
							playercontrol:true,
							handcards:[],equips:[],judges:[]
							},
							{name:"lyrica",
							name2:"none",
							identity:"fan",
							position:1,
							hp:1, maxHp:null, lili:5, maxlili:null,
							playercontrol:false,
							handcards:[["tao","heart",6],["tao", "heart", 7], ["tao", "heart", 8]],equips:[],judges:[]
							},
						],
						cardPileTop:[["sha","spade",8], ["danmakucraze","spade",12], ['sha', 'club', '7']],cardPileBottom:[],discardPile:[],
						skillPileTop:[],skillPileBottom:[],gameDraw:false,replacepile:true,turns:[1,"lose"],
					},
					*/
					{name:'3',
						intro:"对于怨念如此深的人，别以为打趴一次就足够了！",
						players:[
							{name:"kaguya",
							name2:"none",
							identity:"zhu",
							position:0,
							hp:1,maxHp:null,lili:1,maxlili:null,
							playercontrol:true,
							handcards:[["juedou","diamond",1],["zuiye", "club", 3]],equips:[["laevatein","heart",13]],judges:[["shenyou",null,0]],
							},
							{name:"mokou",
							name2:"none",
							identity:"fan",
							position:1,
							hp:1, maxHp:null, lili:5, maxlili:null,
							playercontrol:false,
							handcards:[],equips:[],judges:[]
							},
						],
						cardPileTop:[["huazhi","diamond",9], ["sha","club",4], ['simen', 'spade', 2], ["sha","club",7],['shan', 'diamond', 3], ['juedou', 'spade', 1]],cardPileBottom:[],discardPile:[],
						skillPileTop:[['lingyong', null, 0]],skillPileBottom:[],gameDraw:false,replacepile:true,turns:[1,"lose"],
					},
				],
				level:0,
				mode:'normal',
			},
			/*
			'困难':{
				intro:"到这里就困难起来啦！<br>没有可以表演的闲暇了呢。",
				stage:true,
			},
			'噩梦':{
				intro:"一直以来的难度<br>不懂的话还是不要靠近的好。",
				stage:true,
				
			},
			*/
		}
	};
});
