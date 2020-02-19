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
	        dialog.style.overflow='scroll';
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
	            game.save('currentBrawl','help');
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
	            var today = new Date();
            	if(today.getMonth() == 3 && name == 'thanks') intro += '<br> 特殊BGM：資料室のお茶会 - key';
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
	                    //ui.create.div('.caption',caption),
	                    i,
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
			lib.setPopped(ui.rules,function(){
				var uiintro=ui.create.dialog('hidden');
					uiintro.add('<div class="text left">阿求已经有主人了！不要想奇怪的事情！</div>');
					uiintro.add(ui.create.div('.placeholder.slim'))
				return uiintro;
			},400);
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
					if (i == 'updatelog' && location.hostname && !lib.device) continue;
					if (i == 'downloadlog' && (!location.hostname || lib.device)) continue;
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
	        if(lib.config.background_music!='music_off'){
				game.playBackgroundMusic('library');
                ui.backgroundMusic.currentTime = 0;
            }
            var today = new Date();
            if(today.getMonth() == 3){
				game.playBackgroundMusic('signature');
	        }
	        lib.init.onfree();
	    },
	    brawl:{
	    	help:{
	    		name:'欢迎光临!',
	    		mode:'',
	    		intro:[],
	    		showcase:function(init){
	    			var node=this;
	    			if(init){
	                    var player=ui.create.player(null,true);
	                    lib.character['akyuu'] = ['female','1',3,['mengji'],[]];
	                    lib.characterIntro['akyuu']='全名稗田阿求，将毕生奉献于记载幻想乡的历史的稗田家的现任家主。持有过目不忘的记忆能力。<br><b>画师：渡瀬　玲<br></b><br>现因一些原因，被赋予了幻想乡的管理员权限。不过依然是和平常一样做着记录屋的工作。';
				        lib.skill['mengji'] = {};
				        lib.translate['mengji'] = '隐藏';
				        lib.translate['mengji_info'] = '达成多次异变牌胜利的话，可以解锁这个角色哟？';
	                    player.init('akyuu');
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
	                    player.onclick = function(){
	                    	 ui.arena.classList.add('only_dialog');
	                    	 var num;
	                    	 if (lib.config.gameRecord.incident && lib.config.gameRecord.incident.data['akyuu']){
	                    	 	num = 3 - lib.config.gameRecord.incident.data['akyuu'];
	                    	 	if (num <= 0) num = 0;
	                    	 } else {
	                    	 	num = 3;
	                    	 }
	                    	 if (!lib.config.akyuu){
		                    	 var d = '<div><div style="width:280px;margin-left:120px;font-size:18px">抱歉，'+lib.config.connect_nickname+'，我还没有准备好呢……再异变胜利'+num+'次应该就可以了。……那个，要茶吗？</div>';
		                    	 if (num <= 0) d = '<div><div style="width:280px;margin-left:120px;font-size:18px">太好啦，'+lib.config.connect_nickname+'，我准备好了呢！快来异变模式玩吧！</div>';
		                    	 if (lib.config.connect_nickname == '黑白葱') d = '<div><div style="width:280px;margin-left:120px;font-size:18px">主人啊……你倒是什么时候才会不摸鱼啊？</div>';
		                    	 var dialog = ui.create.dialog(d);
								 ui.create.div('.avatar',ui.dialog).setBackground('akyuu','character');
		                    	 ui.create.control('没事，不用急',function(){
		                    	 	dialog.close();
									while(ui.controls.length) ui.controls[0].close();
									ui.arena.classList.remove('only_dialog');
								});
		                    } else {
		                    	var dialog = ui.create.dialog();
		                    	dialog.classList.add('fixed');
						        dialog.classList.add('scroll1');
						        dialog.classList.add('scroll2');
						        dialog.classList.add('fullwidth');
						        dialog.classList.add('fullheight');
						        dialog.classList.add('noupdate');
						        dialog.classList.add('character');
						        dialog.classList.remove('nobutton');
						        dialog.style.top = '0px';

						        var p=ui.create.player(null,true);
								p.init('akyuu');
								p.node.avatar.show();
								p.style.left='20px';
			                    p.style.top='20px';
			                    p.style.zIndex = '10';
			                    p.style.cursor = 'pointer';
			                    p.node.count.remove();
			                    p.classList.add('show');
			                    lib.translate['library'] = '平和';
								//player.node.hp.remove();
								p.style.transition='all 0.5s';
								dialog.appendChild(p);
			                    ui.create.div('.config.indent','<div><div style="width:100%;left:140px;text-align:right;font-size:18px"><b><u>至今所发生过的异变：</b></u></div>',dialog);
			                 	var list=[];
								for (i in lib.card){
									if(lib.translate[i] && lib.card[i].type == 'zhenfa'){
										list.push(i);
			                        }
								}
								dialog.addText('<div><div style="display:block;top:500px;text-align:left;font-size:16px">距离阿求下一次出场还有'+num+'次异变牌胜利。');
								list.push('library');
								for (var i = 0; i < list.length; i ++){
									if (!lib.config.gameRecord.incident.data[list[i]]) continue;
									var data = lib.config.gameRecord.incident.data[list[i]];
									ui.create.div('.config.indent','<div><div style="width:100%;left:140px;text-align:right">'+lib.translate[list[i]]+'异变：'+data[0]+'次发生  '+data[1]+'胜<br>',dialog);
								}
		                    	var control = ui.create.control('好了，谢谢！',function(){
		                    	 	dialog.close();
									while(ui.controls.length) ui.controls[0].close();
									ui.arena.classList.remove('only_dialog');
								});
								var counter = 0;
								var f = get.rand(4);
		                    	p.onclick = function(){
		                    		if (counter > 6) return;
		                    		var h = [['其实流星夜有个四格漫画系列，可以在贴吧，公众号上和群里找到哟。',
		                    					'主人没事做的时候，不仅会做漫画，也会做表情呢。所以，有有趣的情况请说给他听吧。',
		                    					'别看主人那个样子，该忙的时候他还是会忙的啦。',
		                    					'除了忙以外，灵感缺失也是一大问题呢。',
		                    					'不过灵感缺失的一大方面，还是因为他的要求和想法总是太奇奇怪怪吧。',
		                    					'不擅长弄一些正常的想法也不是坏事呢。毕竟，把我弄成这个样子……其实感觉也挺不错的呢。'],
		                    				['其实游戏开始的教程是我啦。对，就是问你名字的那个。……是个不错的名字呢，'+lib.config.connect_nickname+'。',
		                    				'嗯？为什么我当时不露脸？主人觉得一开始不要出来那么多角色比较好。特别是，离我正式出场还有相当一段时间呢。',
		                    				'我是怎么成为管理员的？主人说我不能战斗，又比较擅长这一块，而我觉得做管理员也挺有趣的。',
		                    				'“不应该战斗那就别战斗”主人他是这么说的。确实，我也不觉得我有和其他人弹幕战的一天呢。',
		                    				'如果能打弹幕战会怎么样？…………虽然我不反对试新事物，但是我有更重要的事情做呢。',
		                    				'现在神主反常的开始高产起来了。我的工作也就自然越来越多了。没时间去参加弹幕战呢。而主人虽然也是越来越忙了，但是他却经常去乐悠悠的弹幕战。真是的……'],
		                    				['符卡和异变，是幻想乡中最重要的元素。异变推动着故事走向，亮出新人物，给已有人物追加新维度。',
		                    				'而符卡则是战斗的核心。酷炫以外，战斗方式也是人心的镜子。如何运用能力，如何布置弹幕，都是很体现人物性格的。符卡更是如此。',
		                    				'虽然符卡是有趣很多啦，但是我不会弹幕战，所以……我也没什么感觉。要研究符卡的话，魔理沙倒是有出书呢。',
		                    				'我的工作则是记录幻想乡中的各色人物，和发生过的异变呢。成为管理员之后，也兼职进行规则的介绍了。',
		                    				'异变毕竟是幻想乡中的超大变故，还会出现永久改变幻想乡的事情。大家每天吃的饭，用的牌……要记那种东西的话，就是一万辈子我也记不完啊。',
		                    				'虽然有些异变也不是坏事，但是对于我们这些没有战斗力的人类，还是希望日子能正常一点好啊。啊……要是灵梦会老实干活就好了……'],
		                    				['幻想乡是个很神奇的地方。撰写《幻想乡缘起》的初衷是教导人类们对付妖怪现在看来，记载丰富多彩的大家也不错呢。',
		                    				'其实幻想乡以前不是欢乐的地方。前几代巫女非常敬业，把妖怪们打的毫无还手之力。虽然正面冲突基本没有了，暗地里的袭击事件多了很多。',
		                    				'而这代巫女，灵梦，是个很奇怪的人呢。她创建了符卡规则，让妖怪，人类，巫女，本来是类似食物链的关系，变成了可以同台对战。',
		                    				'因为符卡规则，妖怪不但不惧怕，甚至还相当欢迎与巫女的正面冲突。也造成了异变事件常常发生。随着时间的推移，异变对人类的影响也越来越少。而本来可怕的妖怪，对人类的友好度也高了起来……',
		                    				'即使是幻想乡，先吃饱才能表演的规则也是没变。所以，不用介意生计的妖怪们用异变进行表演，而异变则招来更多的妖怪…算是良性循环吧？',
		                    				'是不是好事，我也说不上来。总之，我工作量是大幅度增加了呢……啊，不说了，我还要赶死线呢！'],
		                    				];
									var k = h[f][counter];
									if (counter == 6) k = lib.config.connect_nickname+'，虽然我并不讨厌和你说话,但是你肯定有更好的事情做吧？';
									var date = new Date();
									if (date.getHours() > 22 || date.getHours() < 8) k = 'Zzz……';
									var d = ui.create.dialog('<div><div style="width:280px;margin-left:120px;">'+k+'</div>');
									 ui.create.div('.avatar',d).setBackground('akyuu','character');
			                    	 control.hide();
			                    	 var c = ui.create.control(counter!=6?'嗯嗯':'抱歉……',function(){
			                    	 	counter++;
			                    	 	d.close();
										c.close();
										control.show();
									});	
								}
		                    }
	                    };
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
						var i = ['欢迎来到东方流星夜,'+lib.config.connect_nickname+'!',
							'东方流星夜是一套以三国杀为原型，东方project为主题的二次创作非商业化桌游游戏。',
							'而流星夜的程序化，也就是你现在所在的游戏，是基于无名杀1.9.51版的大型魔改。',
							'对游戏的不解，在我这里有规则，模式介绍，卡牌查询。 如果还有不懂的，在[场景-对战练习]下找子规去练习吧，实战可是最快的学习方式哟。',
							'祝你游玩愉快！',
	    				];
							var j = [
							'<u>程序使用须知：</u>',
							'1. 使用刷新键（f5）可以重置游戏。',
							'2.左上的[选项]可以更改很多游戏相关的设置，包括并不限于：',
							'<t>游戏模式的人数和身份分配（[选项-开始-异变]）',
							'牌局的布局，界面的样式 ([选项-选项-外观-布局]和[选项-选项-外观-主题])，',
							'和游戏录像。([选项-其他-录像])',
							'记得多多探索一下，没准有奇怪的东西！',
							'<b>2.1 如果觉得界面太小或者太挤的话，在[选项-选项-外观-界面缩放]可以调整整个游戏的大小！</b>',
							'3. 在牌局中双击角色可以查看角色简介，也可以换皮肤和听配音（如果有配音的话）。',
							'3.1 在左上的[选项-角色]里双击角色牌也可以看到简介。',
							'4. 如果你在游戏过程中，看到让你选择发动个什么拼音+数字的技能，随便点一个就行了，这些是后台计数技能，人畜无害的。',
							'<b>5. 其实，点击我是可以跟我说话的啦。就上方那个。</b>',
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
	    	/*
	    	new:{
	    		name:'写在前面',
	    		mode:'',
	    		intro:['','','','','','','',''],
	    		showcase:function(init){
	    		},
	    	},
	    	*/
			downloadlog:{
				name:'下载事宜',
				mode:'',
				intro:['网络上的页游再方便，玩起来还是不如下载下来方便的。', '下载版的好处包括：素材立即加载，可以自己添加皮肤和音乐，还可以自己制作角色和导入扩展包。'],
				showcase:function(init){
	        		if (init){
	        			var style2={position:'relative',display:'block',left:10,top:0,marginBottom:'6px',padding:0,width:'100%'};
	        			var line2=ui.create.div(style2,this);
	        			line2.style.lineHeight='50px';
	        			var dialog=ui.create.dialog('hidden',line2);
						dialog.style.left = "0px";
						dialog.style.top = "0px";
						dialog.style.width = "100%";
						dialog.style.height = "100%";
						dialog.addText('喏，'+lib.config.connect_nickname+'，<a href = "https://mp.weixin.qq.com/s/2dvbkhEezGQn7pUjETRlpQ" target = " _blank">这里也有教程哟。</a>');
						dialog.classList.add('fixed');
	        			dialog.noopen=true;
	        			this.appendChild(dialog);
	        			var incident=ui.create.node('button','电脑端下载',line2,function(){
	        			var i = ['下载链接：',
								'国外镜像：<a href = "https://github.com/BlackAndWhiteScallion/Night-of-Shooting-Stars/archive/master.zip">https://github.com/BlackAndWhiteScallion/Night-of-Shooting-Stars/archive/master.zip</a>',
								'国内镜像1：<a href = https://bws.coding.net/api/share/download/bcf9e902-4fd3-4919-9fc9-f681388b0523>https://bws.coding.net/api/share/download/bcf9e902-4fd3-4919-9fc9-f681388b0523</a>',
								'国内镜像2：<a href = https://gitee.com/b_2/noss/repository/archive/master.zip>https://gitee.com/b_2/noss/repository/archive/master.zip</a>',
								'国内镜像2因神奇腾讯有可能炸了，还请大家注意。',
	    					];
	        			dialog.setCaption('<div><div style="text-align:left;font-size:16px">'+i.join('<br>'));
	                    },{marginLeft:'6px'});
	                    var identity=ui.create.node('button','手机端下载',line2,function(){
	        				var i = [
								'手机端目前只支持安卓系统。为您带来的不便表达万分歉意。',
								'',
								'百度网盘链接：<a href = "https://pan.baidu.com/s/14ogm9-RAdDuuXUGTZYC_qA">链接: https://pan.baidu.com/s/14ogm9-RAdDuuXUGTZYC_qA 提取码: e6nf</a>',
								'直接下载链接：<a href = "https://BWS.coding.net/s/19055702-1f41-42d3-8aa0-e1d7f4066d76">https://BWS.coding.net/s/19055702-1f41-42d3-8aa0-e1d7f4066d76</a>',
				        		];
	        				dialog.setCaption('<div><div style="text-align:left;font-size:16px">'+i.join('<br>'));
	                    },{marginLeft:'6px'});
	                    var versus=ui.create.node('button','我的存档啊！',line2,function(){
	        				var i = [
								'要保存你的数据的话，首先，从[选项-选项-文件-导出游戏设置]，把当前的游戏设置保存下来。',
								'然后，打开下载的流星夜，从[选项-选项-文件-导入游戏设置]，把刚存下来的游戏设置导入。',
								'',
								'这个操作也可以同样用于把本地的数据导入网页版，或者把电脑的数据导入手机。',
								'但是注意的是，像自己加的皮肤，自己加的音乐与配音这些本地素材，是无法导入网页版的。',
				        		];
	        				dialog.setCaption('<div><div style="text-align:left;font-size:16px">'+i.join('<br>'));
	                    },{marginLeft:'6px'});
	        		}
	        	},
			},
	    	updatelog:{
	    		name:'更新事宜',
	    		mode:'',
	    		intro:['定期更新一下是最好的，比如隔一周更新一下，大部分时候都会有些更新的。<br>大更新了的时候，在<a href = "https://jq.qq.com/?_wv=1027&k=570nlJG target="_blank">群里 </a>和 <a href="https://mp.weixin.qq.com/s/PC6a3Y8Y8bslqgsVWqcTqw" target="_blank">微信公众号</a>里都会发出消息来的。'],
	        	showcase:function(init){
	        		if (init){
	        			var style2={position:'relative',display:'block',left:10,top:0,marginBottom:'6px',padding:0,width:'100%'};
	        			var line2=ui.create.div(style2,this);
	        			line2.style.lineHeight='50px';
	        			var dialog=ui.create.dialog('hidden',line2);
						dialog.style.left = "0px";
						dialog.style.top = "0px";
						dialog.style.width = "100%";
						dialog.style.height = "100%";
						dialog.addText('有什么更新相关的问题吗，'+lib.config.connect_nickname+'？');
						dialog.classList.add('fixed');
	        			dialog.noopen=true;
	        			this.appendChild(dialog);
	        			var incident=ui.create.node('button','更新方式',line2,function(){
	        			var i = ['更新方式有三种:',
	    				'1: 下载更新程序包',
	    				'更新下载链接→<a href = "https://github.com/BlackAndWhiteScallion/Night-of-Shooting-Stars-Extensions/archive/master.zip">国外镜像下载</a> <a href = "https://bws.coding.net/p/NOSS-Extensions/d/NOSS-Extensions/git/raw/master/%E4%B8%9C%E6%96%B9%E6%B5%81%E6%98%9F%E5%A4%9C%E6%9B%B4%E6%96%B0.exe">国内镜像下载</a>',
	    				'下载完毕后，在浏览器的默认下载文件夹里可以找到，然后解压到流星夜所在的文件夹里，并全部覆盖就OK啦。',
	    				'手机端也可以使用这个更新方式，安卓手机所需要拖到的文件夹在：<b>(默认SD卡)/android/data/com.widget.noname1</b>',
	    				'覆盖完毕后，需要重启流星夜程序！',
	    				'',
	    				'2. 游戏内更新，在<b>[选项-其他-更新]</b>下有多个更新选项',
	    				'[检查游戏更新]是检查游戏的文件更新，有可能可以使用，也有可能不能使用。',
	    				'[检查素材更新]是检查游戏新加的素材。 但是只能检查新加的素材，无法更新被覆盖的旧素材。',
	    				'检查素材更新在电脑和手机端都可以进行。',
	    				'',
	    				'3. 手机端更新，可以在<b>[选项—选项—文件—重新下载游戏]</b>来进行更新。',
	    				'这样会保留所有的设置，但是并不会更新素材。',
						'如果缺了图片的话，通过<b>[选项-其他-更新-检查素材更新]</b>来进行素材更新。',];
	        			dialog.setCaption('<div><div style="text-align:left;font-size:16px">'+i.join('<br>'));
	                    },{marginLeft:'6px'});
	                    var identity=ui.create.node('button','更新注释',line2,function(){
	        				var i = ['其实主人他最近有点懒得写这些啦……',
				        		];
	        				dialog.setCaption('<div><div style="text-align:left;font-size:16px">'+i.join('<br>'));
	                    },{marginLeft:'6px'});
	                    var versus=ui.create.node('button','已知BUG',line2,function(){
	        				var i = [
								'<u>已知bug列表：</u>',
								'1. 永琳，紫妈，梅莉，还有莉格露观看牌堆时有时候会因不明原因卡住，暂停再取消暂停就行了。铃仙有时候也会卡住，使用同样方式解决。',
								'2. 永琳使用符卡效果有时候会卡住，有时候可以通过暂停来解决，有时候就是卡死了。因原因不明，碰到的话请一定向制作组反馈情况。',
								'3. 在[对称]布局下，玩家视角无法主动弃置技能牌，也不能查看自己的技能牌。',
								'4. 观看录像时，技能牌的图标不显示，且技能牌弃置有错误。',
								'5. 联机模式下异变胜利后的战果显示有错误',
								'6. [挑战角色]和[闯关角色]扩展同时打开会导致其中一个不能使用。',
								'7. 观看录像时，无法查看自己的手牌。',
				        		];
	        				dialog.setCaption('<div><div style="text-align:left;font-size:16px">'+i.join('<br>'));
	                    },{marginLeft:'6px'});
	        		}
	        	},
	    	},
	    	ruleview:{
	        	name:'规则帮助',
	        	mode:'',
	        	intro:[
	        		'虽然新规则看起来有点太复杂，很麻烦，但是不用担心，规则比看起来的要容易理解多了！',
	        		'无论是我，还是子规老师，还是主人，都是会全力帮助你的，所以一定不要泄气！加油！',
	        		'',      		
	        		],
	        	showcase:function(init){
	        		if (init){
	        			var style2={position:'relative',display:'block',left:10,top:0,marginBottom:'6px',padding:0,width:'100%'};
	        			var line2=ui.create.div(style2,this);
	        			line2.style.lineHeight='50px';
	        			var dialog=ui.create.dialog('hidden',line2);
						dialog.style.left = "0px";
						dialog.style.top = "0px";
						dialog.style.width = "100%";
						dialog.style.height = "100%";
						dialog.addText('');
						dialog.addText('');
						dialog.addText('如果你觉得文字太枯燥的话，图文介绍可以在<a href = "https://mp.weixin.qq.com/s/uBonlYfZg69V03FhebUwCQ">基础游戏介绍</a>和<a href="https://mp.weixin.qq.com/s/AO1BbLYLaNFn88ZqtKxsrw">新系统介绍</a>读到。');
						dialog.addText('去[场景-对战练习]找子规老师探讨探讨也是个不错的办法。');
						dialog.addText('请选择你想要了解的系统，'+lib.config.connect_nickname+'，我会尽力解答的！');
						dialog.classList.add('fixed');
	        			dialog.noopen=true;
	        			this.appendChild(dialog);
	        			var incident=ui.create.node('button','灵力值是什么？',line2,function(){
	        				var i = ['<u>灵力值</u>:（角色下的绿色星星，或者蓝圆圈）',
				        		'游戏的核心系统，各种消耗和启动符卡都需要用。',
				        		'玩家的<u>攻击范围</u>等于灵力值；<u>灵击伤害</u>指对灵力值造成的伤害。',
				        		'使用持有"灵力：+1"的牌可以增加1点灵力。',
				        		'在准备阶段，如果玩家没有灵力，在结束阶段，玩家会将灵力补到1。',];
	        				dialog.setCaption('<div><div style="text-align:left;font-size:16px">'+i.join('<br>'));
	                    },{marginLeft:'6px'});
	                    var identity=ui.create.node('button','游戏牌有哪些新设定？',line2,function(){
	        				var i = ['游戏牌有很多小改动。其实你跟着感觉走就行，但是多了解些绝对不是坏事！',
	        						'<u>强化</u>：持有“强化”的牌通过消耗标注量的灵力可以强化，结算时追加描述里的效果',
	        						'',
	        						'<u>追加效果</u>：这牌有追加的效果。使用追加效果不算使用牌。',
	        						'',
	        						'牌都有【属性】（比如【轰！】是攻击属性），在牌的信息中有记载。<br>属性和种类之类的一样，不影响平常使用牌。',
	        						'',
	        						'装备区可以装任意种任何牌，但是最多只能装3张。',
	        						'',
	        						'哦对了，判定区和延时锦囊的坏文明已不复存在！',
				        		];
	        				dialog.setCaption('<div><div style="text-align:left;font-size:16px">'+i.join('<br>'));
	                    },{marginLeft:'6px'});
	                    var versus=ui.create.node('button','符卡怎么使用？',line2,function(){
	        				var i = ['<u>符卡技</u>：游戏的核心技能系统。',
	        						'在幻想乡怎么可以不会用符卡呢！对吧！',
	        						'',
					        		'符卡技在玩家回合开始时，灵力大于标注量时，通过消耗标注量的灵力启动。',
					        		'（游戏内可发动时会有提示的 放心）',
					        		'启动后，玩家持有符卡技描述中的技能，并且<u>不能获得灵力</u>，直到符卡结束。',
					        		'<u>符卡结束时机</u>：1.当前回合结束；2. 灵力值变化为0',
					        		'',
					        		'<u>符卡标签</u>：<br><u><永续></u>符卡结束时机1改为你的下个回合开始时；<br><u><瞬发></u>你可以在需要使用符卡描述技能时，发动符卡并立即使用（正常发动条件生效）;',
					        		'<u><限定></u>一局游戏只能启动一次；<br><u><终语></u>在决死状态可以启动（正常发动条件生效）；<br><u><极意></u>删除符卡结束时机1，符卡结束时，立即坠机',
					        		'',
				        		];
	        				dialog.setCaption('<div><div style="text-align:left;font-size:16px">'+i.join('<br>'));
	                    },{marginLeft:'6px'});
	                    var boss=ui.create.node('button','技能牌是什么？',line2,function(){
	        				var i = ['技能牌是一种新牌，处于和牌堆分开的独立牌堆里。换句话来说，你摸牌是不会摸到它的。',
					        		'技能牌与装备牌类似，摸到后可以任意使用上面的技能，且一次最多持有3张。',

					        		'技能牌可以通过“摸技能牌”或者“获得技能牌”来获得，也可以获得其他人的技能牌。',
					        		'除此之外，技能牌也可以弃置，或重铸（摸一张技能牌）。',
					        		'但是技能牌没有花色，点数，种类或属性，所以不能用于满足对应的要求。并且，也不能用于转化，不能置于角色牌上。'
					        		];
	        				dialog.setCaption('<div><div style="text-align:left;font-size:16px">'+i.join('<br>'));
	                    },{marginLeft:'6px'});
	                    var tafang=ui.create.node('button','其他注意事项？',line2,function(){
	        				var i = [
	        						'攻击范围内包括你自己了。 所以，在读牌的时候要记得：【轰！】，【疾风骤雨】，【顺手牵羊】都是可以对自己用的！',
	        						'',
	        						'拼点结束后，拼点双方各摸一张牌。',
	        						'',
	        						'明置牌指的就是你所持有的，正面朝上的牌。这包括你的<b>明置手牌</b>，你的装备牌，和你的技能牌，请一定要仔细读描述。',
				        		];
	        				dialog.setCaption('<div><div style="text-align:left;font-size:16px">'+i.join('<br>'));
	                    },{marginLeft:'6px'});
	        		}
	        	},
	        },
	        modeview:{
	        	name:'游戏模式',
	        	mode:'',
	        	intro:[
	        		'每个模式都在左上角的[选项——开始]里可以进行各种设置！',
	        		],
	        	showcase:function(init){
	        		if (init){
	        			var style2={position:'relative',display:'block',left:10,top:0,marginBottom:'6px',padding:0,width:'100%'};
	        			var line2=ui.create.div(style2,this);
	        			line2.style.lineHeight='50px';
	        			var dialog=ui.create.dialog('hidden',line2);
						dialog.style.left = "0px";
						dialog.style.top = "0px";
						dialog.style.width = "100%";
						dialog.style.height = "100%";
						dialog.addText('请在上方点击你想要了解的模式，'+lib.config.connect_nickname+'。');
						dialog.classList.add('fixed');
	        			dialog.noopen=true;
	        			this.appendChild(dialog);
	        			var incident=ui.create.node('button','异变模式',line2,function(){
	        				var i = ['<u><b>异变模式：</u></b> 游戏人数：4~8人，推荐人数为7人',
								'<a href = "https://mp.weixin.qq.com/s/ZBT62CCpPWzqiLMFDQOSsg" target="_blank">详细介绍点这里</a>',
				        		'黑幕与异变身份为一方；自机身份为一方，且与黑幕为对立阵营；每个路人身份玩家为单独一方',
				        		'游戏开始时，每名玩家的身份暗置，随机玩家执行第一个回合',
				        		'每名玩家可以在出牌阶段明置自己的身份；身份明置时，根据身份执行效果：',
				        		'黑幕：获得一张异变牌并明置',
				        		'异变：令一名角色摸一张牌',
				        		'自机：令一名其他角色选择一项：弃置一张牌，或明置身份',
				        		'路人：获得一张异变牌并暗置；可以在出牌阶段明置异变牌',
				        		'',
				        		'<u>胜利条件：</u>',
				        		'黑幕：击坠所有自机',
				        		'异变：黑幕获得胜利',
				        		'自机：击坠黑幕',
				        		'路人：无',
				        		'特殊的，游戏结束时，存活的路人玩家不算游戏失败。路人玩家胜利时，其他玩家也不算游戏失败。',
				        		'',
				        		'<u>异变牌：</u>任何持有异变牌的玩家可以通过异变牌的效果获得胜利；异变牌只有明置才有效果；异变胜利时，所有与其同阵营的玩家也获得胜利'];
	        					'<u>击坠奖励：</u>一名角色击坠其他角色后，获得1点灵力，并摸一张技能牌。',
	        				dialog.setCaption('<div><div style="text-align:left;font-size:16px">'+i.join('<br>'));
	                    },{marginLeft:'6px'});
	                    var identity=ui.create.node('button','身份模式',line2,function(){
	        				var i = ['<u><b>身份模式：</u></b> 游戏人数：4~8人，推荐人数为8人',
	        					'身份模式是三国杀的同名模式的复刻，并没有什么区别。',
	        					'主公 → 黑幕',
	        					'忠臣 → 异变',
	        					'反贼 → 自机',
	        					'内奸 → 路人',
	        					'',
	        					'<u>明忠模式</u>',
	        					'明忠模式就是，游戏开始时，主公不亮身份，而是改成一个忠臣亮身份。',
	        					'亮出来的忠臣第一个进行回合，且体力值和体力上限+1。',
	        					'其他部分都与身份模式相同。',
				        		];
	        				dialog.setCaption('<div><div style="text-align:left;font-size:16px">'+i.join('<br>'));
	                    },{marginLeft:'6px'});
	                    var versus=ui.create.node('button','对决模式',line2,function(){
	        				var i = ['<u><b>对决模式：</u></b>',
	        						'对决模式是各式两队对战小模式的总称。 这些小模式可以在左上角<b>开始—对决</b>进行设置，或使用“自由设定”模式来自行调整。',
	        						'游戏内预置模式共包括三种：',
	        						'',
	        						'<u> 2v2 </u>',
	        						'两队各两名玩家，一号位和四号位VS二号位和三号位。',
	        						'双方的胜利条件均为对方全部坠机。',
	        						'由一号位开始游戏，且一号位起手少摸一张牌。',
	        						'2v2 专属设置：',
	        						'<b>替补模式:</b> 选角色时从5选1改为8选2；第一个选的角色坠机后，换成替补角色继续游戏；一方坠机两名角色后失败。',
	        						'<b>末位换牌：</b>四号位起手可以把所有手牌弃掉，重新摸4张。',
	        						'',
	        						'<u> 3v3统率 </u>',
	        						'两队各三名玩家。选将方式为游戏开始时，双方从同一个将池中轮流选将，然后从选出来的中选三个。',
	        						'双方的胜利条件均为击坠对方主帅。',
	        						'回合顺序为双方轮流，然后由主帅选择己方进行回合的角色。',
	        						'<b>注：玩家方的所有角色全部由玩家操控。</b>',
	        						'',
	        						'<u> 4v4 </u>',
	        						'两队各四名玩家，位置为交叉分配。',
	        						'双方的胜利条件均为击坠对方主帅。',
	        						'选将为按位置依次选将，然后由随机一名角色开始游戏。',
				        		];
	        				dialog.setCaption('<div><div style="text-align:left;font-size:16px">'+i.join('<br>'));
	                    },{marginLeft:'6px'});
	                    var boss=ui.create.node('button','魔王模式',line2,function(){
	        				var i = ['<u><b>魔王模式：</u></b>',
									'<a href = "https://mp.weixin.qq.com/s/eEbCgLswPGXEhzl702FZzQ" target="_blank">详细介绍点这里</a>',
	        						'魔王模式下，三名玩家组队成为盟军挑战一名大魔王BOSS玩家！',
	        						'大魔王的胜利条件为所有盟军坠机。 盟军的胜利条件为大魔王坠机。',
	        						'',
	        						'<u>回合顺序</u>',
	        						'回合顺序有两种：',
	        						'1. 由大魔王开始回合，然后盟军选择一名角色进行回合，然后回到大魔王回合。',
	        						'（大魔王 → 盟军选1 → 大魔王 → 盟军选1 → 大魔王 → 盟军选1 → 大魔王）',
	        						'',
	        						'2. 由大魔王开始回合，然后三名盟军依次进行回合。',
	        						'（大魔王 → 盟军1 → 盟军2 → 盟军3 → 大魔王）',
	        						'',
	        						'<u>重整</u>',
	        						'一名盟军角色坠机后，在大魔王的N个回合后会复活，然后重新加入游戏。',
	        						'默认的重整时间为5个回合。有些大魔王的重整时间不一样。',
	        						'',
	        						'<u>阶段切换</u>',
	        						'有的大魔王有多阶段技能。阶段转换条件在技能上标注出来的。',
	        						'条件达成导致阶段切换时，终止所有结算，当前回合立即结束，然后进入大魔王的回合。',
	        						'并且，阶段切换后，回合顺序会变成第二种。',
	   								'',
	   								'<u>提示</u>',
	   								'在右上角，可以用[手牌]键查看你队友的手牌；用[重整]键查看队友还有多久复活；用[换人]键将主视角切换为另外一名队友。',
				        		];
	        				dialog.setCaption('<div><div style="text-align:left;font-size:16px">'+i.join('<br>'));
	                    },{marginLeft:'6px'});
	                    var stg=ui.create.node('button','闯关模式',line2,function(){
	        				var i = ['<u><b>闯关模式：</u></b>',
									'<a href = "https://mp.weixin.qq.com/s/owQpDcBP0_OFPSlZMecPYQ" target="_blank">详细介绍点这里</a>',
	        						'选择出你的自机角色，欺负小怪，连续打关，找出最后的黑幕并击破她吧！',
	        						'',
	        						'玩家的胜利条件为击坠最后一个BOSS，通过最后一个小关。 失败条件为自己坠机。',
	        						'一个大关最多有6个小关，最少只有1小关。',
	        						'',
	        						'<u>专属装备</u>',
	        						'每一个大关会限定一些自机角色。这些自机角色在游戏开始时，可以选择一张属于她的专属装备。',
	        						'这张专属装备不能被弃置或获得。 并且，使用不同的专属装备会让玩家获得不同的符卡。',
	        						'使用[自由选自机]来选出这些角色以外的角色来闯关的话，不会有专属装备。',
	        						'',
	        						'<u>复活机会</u>',
	        						'玩家在坠机时，如果还剩复活机会，会消耗1个，然后弃置所有牌，摸4张牌，体力回复至满，灵力调整为2，继续游戏。',
	        						'没有复活机会的情况下坠机就是游戏失败咯。',
	        						'玩家初始的复活机会数量，和击坠哪些BOSS会获得更多的复活机会，在大关介绍上有写。',
	        						'在游戏中，可以随时用右上的[残机]键查看剩余复活次数。',
	        						'',
	        						'<u>击坠和通关奖励</u>',
	        						'任何角色坠机后，击坠那名角色的来源获得1点灵力，并摸一张牌。',
	        						'玩家通过一个小关后，玩家回复1点体力，并摸一张技能牌。 并且，牌堆会完全重置。',
	        						'',
	        						'<u>敌人增援</u>',
	        						'在玩家的回合开始时，如果场上敌人的数量小于2，会出现下一个敌人。',
	        						'这些敌人会继续出现，直到BOSS角色出现为止。',
	        						'即使小怪在场上，击坠BOSS角色依然是成功通关，所以不用太介意。',
	        						'',
	        						'<u>BOSS阶段转换</u>',
	        						'有些BOSS在坠机时，会进入下一个阶段：',
	        						'BOSS将体力值回复至上限，灵力调整为5，然后立即获得并启动符卡技。这些符卡技均视为持有<极意>标签。',
	        						'有些BOSS甚至有两个阶段，请千万小心。',
				        		];
	        				dialog.setCaption('<div><div style="text-align:left;font-size:16px">'+i.join('<br>'));
	                    },{marginLeft:'6px'});
	                    var tafang=ui.create.node('button','战棋模式',line2,function(){
	        				var i = ['<u><b>战棋模式</u></b>',
	        						'说来惭愧，我其实最近才开始研究战棋模式，所以可能会有些漏的或者错的，还请见谅……',
	        						'',
	        						'对阵模式：<br>n人对战n人的模式（最多8v8），由单人控制，开始游戏后随机分配位置<li>'+
						    		'每人在出牌阶段有一次移动的机会，可移动的最大距离为2<li>'+
						    		'任何卡牌或技能无法指定位置相隔8个格以上的角色为目标'+
						    		'<br>',
						    		'主帅选项：开启后，双方各选择一名角色成为主将。主将体力上限加一，主将坠机后，若有副将，副将代替之成为主将，否则游戏结束<li>'+
						    		'无尽模式：开启后，任何一方有角色坠机都将选择一名新角色重新加入战场，直到点击左上角的结束游戏按钮手动结束游戏。结束游戏时，击坠数更多的一方获胜<li>'+
						    		'行动顺序：行动顺序为[指定]时，双方无论存活角色角色多少都将轮流进行行动。<li>'+
						    		'回合结束摸牌：在一方所有角色行动完毕进行下一轮行动时，若其人数比另一方少，另一方可指定至多X名角色名摸一张牌，X为人数之差<li>'+
						    		'战场机关：开启后，游戏开始时，场上会出现一个机关；且每个轮次结束后，有一定机率出现一个机关。机关不参与战斗，并有一个影响周围或全体角色的效果。机关在出现后的3个轮次内消失<li>'+
						    		'伤害击飞：开启后，当一名角色对距离两格以内的目标造成伤害后，受伤害角色将沿反方向移动一格<li>'+
						    		'路障：角色不能移动到路障。当一名角色的周围四格有至少三格为路障或在战场外时，其可以在回合内清除一个相邻路障</ul>'+
						    		'<br>',
						    		'后宫模式：<br>收集角色进行战斗，根据战斗难度及我方出场角色的强度，战斗胜利后将获得数量不等的金钱。没有后宫王出场时，获得的金钱较多<li>'+
						    		'金钱可以用来招募随机角色，招到已有角色，或遣返不需要的角色时可得到招募令<li>'+
						    		'战斗中有后宫王出场时可招降敌将，成功率取决于敌将的稀有度、剩余体力值以及手牌数。成功后战斗立即结束且没有金钱奖励。每发动一次招降，无论成功还是失败，都会扣除10招募令<li>'+
						    		'挑战武将会与该武将以及与其强度相近的武将进行战斗，敌方人数与我方出场人数相同，但不少于3。胜利后可通过招募令招募该武将，普通/稀有/史诗/传说武将分别需要40/100/400/1600招募令<br>'+
						    		'竞技场：<br>随机选择9名武将，每次派出1~3名武将参战。战斗中坠机的武将不能再次上场。<li>战斗后武将进入疲劳状态，若立即再次出场则初始体力值-1。<li>战斗中本方武将行动时可召唤后援，令一名未出场的已方武将加入战斗。后援武将在战斗结束后无论存活与否均不能再次出场<br><br>当取得12场胜利或所有武将全部坠机后结束，并根据胜场数获得随机奖励',
				        		];
	        				dialog.setCaption('<div><div style="text-align:left;font-size:16px">'+i.join('<br>'));
	                    },{marginLeft:'6px'});
						var puzzle=ui.create.node('button','残局模式',line2,function(){
	        				var i = ['<u><b>残局模式：</u></b> 游戏人数：1人',
				        		'取出一个预先布置好的场面，然后在一回合内获得胜利！',
								'',
								'<u>规则：</u>',
								'1. 胜利条件和普通牌局的胜利条件一样。一般都是击坠所有与你不同阵营的角色。',
								'2. 游戏从你的回合开始，从准备阶段开始进行。当前回合结束时，判定你为游戏失败。',
								'3. 所有角色的手牌，装备，和技能牌，都是固定的。',
								'4. 牌堆是固定的，且不包括多余的牌。洗牌不会回到正常的牌堆。技能牌堆同样',
							];
	        				dialog.setCaption('<div><div style="text-align:left;font-size:16px">'+i.join('<br>'));
	                    },{marginLeft:'6px'});
	        		}
	        	},
	        },
	        characterview:{
	            name:'角色牌',
	            mode:'',
	            intro:[
	            '单击角色可以查看角色简介，和切换角色皮肤，并可以收藏，禁用，打开角色。',
	            '（在游戏中，或左上[选项-角色]中 双击角色也可以查看角色简介和切换角色皮肤哟。）',
	            ],
	            showcase:function(init){
	            	if (init){
		            	var list=[];
		            	for(var i in lib.character){
		            		list.push(i);
						}
		            	var dialog=ui.create.dialog('hidden');
						dialog.style.left = "0px";
						dialog.style.top = "0px";
						dialog.style.width = "100%";
						dialog.style.height = "100%";
						/*
						var style2={position:'relative',display:'block',left:0,top:0,marginBottom:'6px',padding:0,width:'100%'};
						var line1=ui.create.div(style2);
						dialog.add(line1);
						var scenelist=ui.create.selectlist(['默认','随机'],null,line1);
						var addButton=ui.create.node('button','批量更换皮肤',line1,function(){
							if (scenelist.value == '默认'){
	                        	for (i in lib.character){
									delete lib.config.skin[i];
								}
							} else{
								var r = null;
								if (scenelist.value == '随机'){
									//r = lib.config.skinSet[0];
								}
							} 
							game.saveConfig('skin',lib.config.skin);
							var list1 = document.getElementsByClassName('character');
							for(var i1=0;i1<list1.length;i1++){
                                if(list1[i1].classList.contains('character')){
                                    list1[i1].node.setBackground(list1[i1].name,'character');
                                }
                            }
	                    },{marginLeft:'6px',marginRight:'12px'});
						*/
						dialog.add([list,'character'],false);
	                    for (var i = 0; i < dialog.buttons.length; i ++){
	                    	dialog.buttons[i].classList.add('show');
	                    }
						this.appendChild(dialog);
						dialog.noopen=true;
	            	}
	            },
	        },
	        cardview:{
	        	name:'游戏牌',
	        	mode:'',
	        	intro:['卡牌的花色点数和灵力以牌局内为准。右键或长按卡牌可以查看卡牌简介，也可以更换卡牌皮肤。',],
				showcase:function(init){
	        		if (init){
		        		var i;
		            	var list=[];
						event.list=list;
		            	var dialog=ui.create.dialog('hidden');
						dialog.classList.add('fixed');
						dialog.style.left = "0px";
						dialog.style.top = "0px";
						dialog.style.width = "100%";
						dialog.style.height = "100%";
						var style2={position:'relative',display:'block',left:0,top:0,marginBottom:'6px',padding:0,width:'100%'};
						var line1=ui.create.div(style2);
						dialog.add(line1);
						var scenelist=ui.create.selectlist(['默认','红魔乡风格','妖妖梦风格'],null,line1);
						var addButton=ui.create.node('button','批量更换皮肤',line1,function(){
							if (scenelist.value == '默认'){
	                        	for (i in lib.card){
									delete lib.config.skin[i];
								}
							} else{
								var r = null;
								if (scenelist.value == '妖妖梦风格'){
									r = lib.config.skinSet[0];
								} else if (scenelist.value == '红魔乡风格'){
									r = lib.config.skinSet[1];
								}
								if (r){
									for (i in r){
										if (r[i] == 0){
											delete lib.config.skin[i];
										} else {
											lib.config.skin[i] = r[i];
										}
									}
								}
							} 
							game.saveConfig('skin',lib.config.skin);
							var list = document.getElementsByClassName('card');
							for(var i=0;i<list.length;i++){
                                if(list[i].classList.contains('card')){
                                    list[i].node.image.setBackground(list[i].name,'card');
                                }
                            }
	                    },{marginLeft:'6px',marginRight:'12px'});
						var packs = lib.config.all.cards.diff(lib.config.cards);
						for (i in lib.card){
							 if (packs){
								var f = false;
								for (var j = 0; j < packs.length; j ++){
									if (lib.cardPack[packs[j]].contains(i)){
										f = true;
										break;
									}
								}
								if (f) continue;
							}
							if(lib.translate[i] && lib.card[i].type != 'zhenfa' && !lib.card[i].vanish && lib.card[i].type != 'delay'){
								var card=game.createCard(i, undefined, undefined, undefined);
	                            dialog.add(card);
	                        }
						}
						this.appendChild(dialog);
						dialog.noopen=true;
					}
	        	},
	        },
	        skillview:{
	        	name:'技能牌',
	        	mode:'',
	        	intro:['技能牌是特殊的游戏卡牌，没有花色点数，也不可以转化',],
	        	showcase:function(init){
	        		if (init){
		        		var i;
		            	var list=[];
						event.list=list;
		            	var dialog=ui.create.dialog('hidden');
						dialog.classList.add('fixed');
						dialog.style.left = "0px";
						dialog.style.top = "0px";
						dialog.style.width = "100%";
						dialog.style.height = "100%";
						var style2={position:'relative',display:'block',left:0,top:0,marginBottom:'6px',padding:0,width:'100%'};
						var line1=ui.create.div(style2);
						var scenelist=ui.create.selectlist(['图标','文字'],null,line1);
						var addButton=ui.create.node('button','批量更换皮肤',line1,function(){
	                        for (i in lib.card){
								if (lib.card[i].type != 'delay') continue;
								if (scenelist.value == '图标') delete lib.config.skin[i];
								else if (scenelist.value == '文字') lib.config.skin[i] = 1;
							}
							game.saveConfig('skin',lib.config.skin);
							var list = document.getElementsByClassName('card');
							for(var i=0;i<list.length;i++){
                                if(list[i].classList.contains('card')){
                                    list[i].node.image.setBackground(list[i].name,'card');
                                }
                            }
	                    },{marginLeft:'6px',marginRight:'12px'});
						for (i in lib.card){
							if(lib.translate[i] && !lib.card[i].vanish && lib.card[i].type == 'delay'){
								list.push(i);
	                        }
						}
						dialog.add(line1);
						dialog.add([list,'vcard']);
						this.appendChild(dialog);
						dialog.noopen=true;
					}
	        	},
	        },
	        incidentview:{
	        	name:'异变牌',
	        	mode:'identity',
	        	intro:['异变牌持有胜利条件，特殊效果。不是游戏牌，也没有花色点数的。',],
	        	showcase:function(init){
	        		if (init){
	        			var i;
		            	var list=[];
						event.list=list;
		            	var dialog=ui.create.dialog('hidden');
						dialog.classList.add('fixed');
						dialog.style.left = "0px";
						dialog.style.top = "0px";
						dialog.style.width = "100%";
						dialog.style.height = "100%";
						for (i in lib.card){
							if(lib.translate[i] && lib.card[i].type == 'zhenfa'){
								list.push(i);
	                        }
						}
						dialog.add([list,'vcard']);
						this.appendChild(dialog);
						dialog.noopen=true;
	        		}
	        	},
	        },
	        record:{
	        	name:'我的战绩',
	        	intro:[],
	        	fullshow:true,
	        	showcase:function(init){
	        		if (init){
		        		var node = this;
		        		this.style.height=(parseInt(this.style.height.substr(0,this.style.height.length-2))-this.offsetTop)+'px';
	                    ui.create.div('.config.indent','<div><div style="width:100%;text-align:right;font-size:18px"><b><u>'+lib.config.connect_nickname+'的战绩：</b></u></div>',node);
	                    if (lib.config.gameRecord.general){
							ui.create.div('.config.indent',lib.translate['general'],node);
							var item=ui.create.div('.config.indent',lib.config.gameRecord.general.str+'<span><br><br></span>',node);
                            item.style.height='auto';
						}
						for (var i in lib.config.gameRecord){
						//for(var i=0;i<lib.config.all.mode.length;i++){
                            //if(!lib.config.gameRecord[lib.config.all.mode[i]]) continue;
                            if(lib.config.gameRecord[i].str && i != 'general'){
                                ui.create.div('.config.indent',lib.translate[i]+'模式',node);
                                //var item=ui.create.div('.config.indent',lib.config.gameRecord[lib.config.all.mode[i]].str+'<span>重置</span>',node);
                                var item=ui.create.div('.config.indent',lib.config.gameRecord[i].str+'<span><br><br></span>',node);
                                item.style.height='auto';
                                //item.lastChild.addEventListener('click',reset);
                                item.lastChild.classList.add('pointerdiv');
                                item.link=i;
                            }
                        }
                 	}
	        	},
	        },
			diy:{
				name:'我要DIY！',
				mode:'',
				intro:['有好点子？想要更多萌妹？想要萌妹们穿上泳装？来把你的幻想变成现实吧！'],
				showcase:function(init){
	        		if (init){
	        			var style2={position:'relative',display:'block',left:10,top:0,marginBottom:'6px',padding:0,width:'100%'};
	        			var line2=ui.create.div(style2,this);
	        			line2.style.lineHeight='50px';
	        			var dialog=ui.create.dialog('hidden',line2);
						dialog.style.left = "0px";
						dialog.style.top = "0px";
						dialog.style.width = "100%";
						dialog.style.height = "100%";
						if (location.hostname){
							dialog.addText('很抱歉，'+lib.config.connect_nickname+'，网页版不能进行DIY操作。把游戏下载下来才可以的。');
						} else {
							dialog.addText('想要了解哪些DIY手段呢，'+lib.config.connect_nickname+'？');
							dialog.classList.add('fixed');
							dialog.noopen=true;
							this.appendChild(dialog);
							var incident=ui.create.node('button','添加皮肤',line2,function(){
								var i = [
									'添加皮肤，按照以下步骤来，很简单的：',
									'1. 打开流星夜所在的文件夹（这个文件夹里有一堆文件夹，一个html，和一个txt）',
									'2. 打开image文件夹。',
									'3. 你知道想要加皮肤的角色的内部名吗？知道的话，进入下一步。不知道的话，打开character文件夹，找到你想要改的角色的插图，文件名就是她的内部名（不包括后缀的.jpg）',
									'4. 打开image下的skin文件夹。',
									'5. 有她的名字的文件夹吗？如果有，打开它。如果没有，创建一个，然后打开它。',
									'6. 把图片（.jpg格式）放进文件夹里。命名为1.jpg。已经有了就+1，2.jpg。以此类推。',
									'就这样，皮肤就可以在游戏内切换啦！',
									'添加游戏牌的皮肤也是相同的方式。找出卡牌的名字，找出它的文件夹来。区别是，游戏牌的图片是.png格式而不是.jpg格式。',
								];
								dialog.setCaption('<div><div style="text-align:left;font-size:16px">'+i.join('<br>'));
							},{marginLeft:'6px'});

							var versus=ui.create.node('button','添加背景',line2,function(){
								var i = [
									'右上，选项，选项，外观，游戏背景（随机背景打开的话，这个按键会被隐藏），添加背景',
									'点编辑背景可以删除已有的背景。',
									'顺带一提，随机背景可以随机到由你加入的背景。',
								];
								dialog.setCaption('<div><div style="text-align:left;font-size:16px">'+i.join('<br>'));
							},{marginLeft:'6px'});

							var brawl=ui.create.node('button','制作角色',line2,function(){
								var i = [
									'教程撰写中，敬请期待……',
								];
								dialog.setCaption('<div><div style="text-align:left;font-size:16px">'+i.join('<br>'));
							},{marginLeft:'6px'});
						}
					}
	        	},
			},
	        download:{
	        	name:'联系我们',
	        	intro:[
	        		'你玩流星夜觉得开心吗？觉得不开心吗？觉得制作组是傻逼吗？自己也想要做吗？那么…………',
	                '欢迎大家光临雾雨魔法店！',
					'官方微信公众号：<a href="https://mp.weixin.qq.com/s/PC6a3Y8Y8bslqgsVWqcTqw" target="_blank">东方流星夜 大葱专线</a>',
	                '官方QQ群：<a href = "https://jq.qq.com/?_wv=1027&k=570nlJG target="_blank">东方流星夜 总会</a>',
	                '实卡淘宝链接：<a href = "https://item.taobao.com/item.htm?spm=a2126o.11854294.0.0.19cf4831lNX5xr&id=586815026235" target="_blank">游家桌游店</a>',
	                '官方百度贴吧：<a href="https://tieba.baidu.com/f?kw=%CE%ED%D3%EA%BC%D2%B5%C4%C4%A7%B7%A8%B5%EA" target="_blank">雾雨家的魔法店吧</a>',
	                '官方资源库兼论坛：<a href="http://liuxingye.666forum.com" target="_blank">雾雨魔法店的仓库</a>',
	                '无论是聊天，<a href="https://mp.weixin.qq.com/s/eq1HewSJkujUNA4U1vEq3Q" target="_blank">看漫画，</a>反映问题，还是想提出建议，都可以到以上任意一个地方去发表意见，我们会看到并尊重你的每一个意见。',
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
	        	'然后，感谢无名杀的各位开发者和维护者，提供了如此靓丽的平台。',
	        	'接着，感谢魔法店里陪着我们走到现在的大家。',
	        	'最后，感谢你，玩这个游戏的玩家，的支持。',
	        	'我们衷心希望，你能在这里玩的开心。',
	        	'',
	        	'',
	        	'各个角色的画师可以在角色简介内找到。',
	        	'',
	        	'游戏默认BGM：東方紅魔月譚 ～ Scarlet Devil Fantasic Rhapsody 【まぐなむおーぱす】',
	        	'红月异变BGM：「artificial」 【THE OTHER FLOWER】',
	        	'散樱异变BGM：「桜風」 【森羅万象】',
	        	'永夜异变BGM：「輝夜」 【凋叶棕】',
	        	'花映异变BGM：「LAST JUDGEMENT」 【SOUND HOLIC】',
	        	'萃梦异变BGM：「まだ、もう少しだけ」 【Minstrel】',
	        	'皆杀异变BGM： EastNewSound - 緋色月下、狂咲ノ絶　-1st Anniversary Remix-',
	        	'笨蛋异变BGM： 「ちるのりずむ」 【ShibayanRecords】',
	        	'图鉴BGM：「忘らるる物語」 【凋叶棕】',
	        	'BGM[琪露诺]：琪露诺的完美算数教室',
	        	'BGM[烂苹果]：bad apple!',
	        	'BGM[灵梦战]：少女绮想曲-Dream Battle 交响曲remix',
	        	'BGM[神赵云战]：三国杀-虎牢关',
	        	'BGM[红魔乡EX]：魔法少女们的百年祭——まらしぃ ',
	        	'',
	        	'背景[夜空]:雪夜',
		        '背景[天界]:Cloudy.R',
		        '背景[神社]:RA',
		        '背景[山水]:ゾウノセ',
		        '背景[永远]:C.Z.',
		        '背景[雨季]：ふぁみ',
		        '背景[罗马！]:ippers',
		        '背景[红月异变]:ke-ta',
		        '背景[散樱异变]:直火焙煎いりごま',
		        '背景[永夜异变]:氷樹一世',
		        '背景[萃梦异变]:阿桜',
		        '背景[花映异变]:自然卷',
		        '背景[文花异变]:Ryosios',
		        '背景[笨蛋异变]:阿桜',
		       	'背景[皆杀异变]:三木比呂',
		       	'背景[图鉴]:DomotoLain',
		        '背景[红魔乡]:ボタン餅',
		        '背景[大图书馆]:青葉 HAL',
		        '背景[红魔馆内部]:青葉 HAL',
		        '背景[地下]:青葉 HAL',
	        	],
	        	showcase:function(init){

	        	}
	        }
	    },
	};
});
