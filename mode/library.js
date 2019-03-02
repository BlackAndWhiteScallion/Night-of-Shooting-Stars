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
	        if(lib.config.background_music!='music_off'){
	        	lib.config.background_music = 'library';
                ui.backgroundMusic.src=lib.assetURL+'audio/background/library.mp3';
                ui.backgroundMusic.currentTime = 0;
            }
            var today = new Date();
            if(today.getMonth() == 3){
            	lib.config.background_music = 'signature';
            	ui.backgroundMusic.src=lib.assetURL+'audio/background/signature.mp3';
	        }
	        lib.init.onfree();
	    },
	    brawl:{
	    	new:{
	    		name:'写在前面',
	    		mode:'',
	    		intro:['','','','','','','',''],
	    		showcase:function(init){
	    		},
	    	},
	    	help:{
	    		name:'使用须知',
	    		mode:'',
	    		intro:['欢迎来到东方流星夜！',
	    				'东方流星夜是一套以三国杀为原型，东方project为主题的二次创作非商业化桌游游戏。',
	    				'而流星夜的程序化，也就是你现在所在的游戏，是基于无名杀1.9.51版的大型魔改版mod。',
	    				'对游戏的不解，在我这里是有大量的信息的：先读一下规则，模式介绍，如果还有不懂的，在更多资源里可以找到更多的帮助哟。',
	    				'',
	    				'<u>程序使用须知：</u>',
	    				'1. 使用刷新键（f5）可以重置游戏。',
	    				'2.左上的[选项]可以更改很多游戏相关的设置，包括并不限于：',
	    				'<t>游戏模式的人数，身份分配，牌局的布局，卡牌的样式，打开关闭角色，和游戏录像。',
	    				'记得多多探索一下，没准有奇怪的东西！',
	    				'3. 在牌局中双击角色可以查看角色简介，也可以换皮肤和听配音（虽然没有配音）。',
	    				'3.1 在左上的[选项-角色]里双击角色牌也可以看到简介。',
	    				'4. 快捷键：按A托管，按space可以暂停，按W可以切换“不询问【请你住口！】”按钮',
	    				'5. 如果你在游戏过程中，看到让你选择发动个什么字母+数字的技能，随便点一个就行了，这些是后台计数技能，人畜无害的。',
	    				],
	    		showcase:function(init){
	        	},
	    	},
	    	updatelog:{
	    		name:'更新事宜',
	    		mode:'',
	    		intro:['更新下载链接→<a href = "https://github.com/BlackAndWhiteScallion/Night-of-Shooting-Stars-Extensions/archive/master.zip">国外镜像下载</a> <a href = "https://coding.net/u/BWS/p/NOSS-Extensions/git/archive/master">国内镜像下载</a>',
	    				'下载完毕后，在浏览器的默认下载文件夹里可以找到，然后解压到流星夜所在的文件夹里，并全部覆盖就OK啦。',
	    				'安卓手机端更新，请点选项按钮，然后在<b>[选项—选项—其他—重新下载游戏]</b>来进行更新。会保留所有设置的。',
	    				'素材更新在<b>[选项—其他—更新—检查素材更新]</b>看到。',
	    				'用手机来解压覆盖也可以，所需要拖到的文件夹在：(默认SD卡)/android/data/com.widget.noname1',
	    				'覆盖完毕后，记得重启流星夜app！',
	    				'',
	    				'<u>更新注释：</u>',
	    				'<br>',
	    				'<u>已知bug列表：</u>',
	    				'1. 永琳，紫妈，梅莉，还有莉格露观看牌堆时有时候会因不明原因卡住，暂停再取消暂停就行了。',
	    				'2. 永琳使用符卡效果有时候会卡住，有时候可以通过暂停来解决，有时候就是卡死了。因原因不明，碰到的话请一定向制作组反馈情况。',
	    				'3. 在[对称]布局下，玩家视角无法主动弃置技能牌，也不能查看自己的技能牌。',
	    				],
	    		showcase:function(init){
	    			
	    		},
	    	},
	    	ruleview:{
	        	name:'规则帮助',
	        	mode:'',
	        	intro:[
	        		'规则图文介绍可以在<a href="game/guide.pdf">幻想乡最速体系介绍</a>读到    详细的资源可以在<a href="http://liuxingye.666forum.com/f1-forum">魔法店仓库里</a>和<a href = "https://jq.qq.com/?_wv=1027&k=570nlJG">官方QQ群</a>里找到',
	        		'',
	        		'《东方流星夜！》的新系统：',
	        		'<u>灵力值</u>:（角色下的绿色星星，或者蓝圆圈）',
	        		'游戏的核心系统，各种消耗和启动符卡都需要用。',
	        		'玩家的<u>攻击范围</u>等于灵力值；<u>灵击伤害</u>指对灵力值造成的伤害。',
	        		'',
	        		'<u>强化</u>：持有“强化”的牌通过消耗标注量的灵力可以强化，结算时追加描述里的效果',
	        		'',
	        		'<u>追加效果</u>：这牌有追加的效果。使用追加效果不算使用牌。',
	        		'',
	        		'<u>符卡技</u>：游戏的核心技能系统。',
	        		'符卡技在玩家回合开始时，灵力大于标注量时，通过消耗标注量的灵力启动。',
	        		'启动后，玩家持有符卡技描述中的技能，并且<u>不能获得灵力</u>，直到符卡结束。',
	        		'<u>符卡结束时机</u>：1.当前回合结束；2. 灵力值变化为0',
	        		'',
	        		'<u>符卡标签</u>：<br><u><永续></u>符卡结束时机1改为你的下个回合开始时；<br><u><瞬发></u>你可以在需要使用符卡描述技能时，发动符卡并立即使用（正常发动条件生效）;',
	        		'<u><限定></u>一局游戏只能启动一次；<br><u><终语></u>在决死状态可以启动（正常发动条件生效）；<br><u><极意></u>删除符卡结束时机1，符卡结束时，立即坠机',
	        		],
	        	showcase:function(init){

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
						dialog.addText('请在上方点击你想要了解的模式。');
						dialog.classList.add('fixed');
	        			dialog.noopen=true;
	        			this.appendChild(dialog);
	        			var incident=ui.create.node('button','异变模式',line2,function(){
	        				var i = ['<u><b>异变模式：</u></b> 游戏人数：4~8人，推荐人数为7人',
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
	        				dialog.setCaption('<div><div style="text-align:left;font-size:16px">'+i.join('<br>'));
	                    },{marginLeft:'6px'});
	                    var identity=ui.create.node('button','身份模式',line2,function(){
	        				var i = ['<u><b>身份模式：</u></b> 游戏人数：4~8人，推荐人数为8人',
	        					'身份模式是三国杀的同名模式的复刻，并没有什么区别。',
	        					'主公 → 黑幕',
	        					'忠臣 → 异变',
	        					'反贼 → 自机',
	        					'内奸 → 路人',
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
	        						'<u> 3v3 </u>',
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
	                    var boss=ui.create.node('button','挑战模式',line2,function(){
	        				var i = ['<u><b>挑战模式：</u></b>',
	        						'挑战模式下，三名玩家组队成为盟军挑战一名大魔王BOSS玩家！',
	        						'大魔王的胜利条件为所有盟军坠机。 盟军的胜利条件为大魔王坠机。',
	        						'',
	        						'<u>回合顺序</u>',
	        						'回合顺序有两种：',
	        						'1. 由大魔王开始回合，然后大魔王在每一名盟军角色的回合结束后，进行一个回合。',
	        						'（大魔王 → 盟军1 → 大魔王 → 盟军2 → 大魔王 → 盟军3 → 大魔王）',
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
	        						'有些BOSS甚至有两个阶段，请一定小心。',
				        		];
	        				dialog.setCaption('<div><div style="text-align:left;font-size:16px">'+i.join('<br>'));
	                    },{marginLeft:'6px'});
	                    var tafang=ui.create.node('button','战棋模式',line2,function(){
	        				var i = ['<u><b>战棋……模式？</u></b>',
	        						'其实，即使是我也不知道战棋模式是怎么玩的……',
	        						'不过，据说战棋模式里有一些特别厉害的东西？',
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
	        	intro:'卡牌花色点数以牌局内为准。',
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
	        	intro:'技能牌是特殊的游戏卡牌，没有花色点数，也不可以转化',
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
							if(lib.translate[i] && !lib.card[i].vanish && lib.card[i].type == 'delay'){
								list.push(i);
	                        }
						}
						dialog.add([list,'vcard']);
						this.appendChild(dialog);
						dialog.noopen=true;
					}
	        	},
	        },
	        incidentview:{
	        	name:'异变牌',
	        	mode:'identity',
	        	intro:'异变牌持有胜利条件，特殊效果。不是游戏牌，也没有花色点数的。',
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
	        	name:'你的战绩',
	        	intro:[''],
	        	fullshow:true,
	        	showcase:function(init){
	        		if (init){
		        		var node = this;
		        		this.style.height=(parseInt(this.style.height.substr(0,this.style.height.length-2))-this.offsetTop)+'px';
	                    for(var i=0;i<lib.config.all.mode.length;i++){
                            if(!lib.config.gameRecord[lib.config.all.mode[i]]) continue;
                            if(lib.config.gameRecord[lib.config.all.mode[i]].str){
                                ui.create.div('.config.indent',lib.translate[lib.config.all.mode[i]]+'模式',node);
                                //var item=ui.create.div('.config.indent',lib.config.gameRecord[lib.config.all.mode[i]].str+'<span>重置</span>',node);
                                var item=ui.create.div('.config.indent',lib.config.gameRecord[lib.config.all.mode[i]].str+'<span><br><br></span>',node);
                                item.style.height='auto';
                                //item.lastChild.addEventListener('click',reset);
                                item.lastChild.classList.add('pointerdiv');
                                item.link=lib.config.all.mode[i];
                            }
                        }
                 	}
	        	},
	        },
	        download:{
	        	name:'联系制作',
	        	intro:[
	        		'你玩流星夜觉得开心吗？觉得不开心吗？觉得制作组是傻逼吗？自己也想要做吗？那么…………',
	                '欢迎大家光临雾雨魔法店！',
	                '官方QQ群：<a href = "https://jq.qq.com/?_wv=1027&k=570nlJG">东方流星夜总会</a>',
	                '实卡淘宝链接：<a href = "https://item.taobao.com/item.htm?spm=a2126o.11854294.0.0.19cf4831lNX5xr&id=586815026235">游家桌游店</a>',
	                '官方百度贴吧：<a href="https://tieba.baidu.com/f?kw=%CE%ED%D3%EA%BC%D2%B5%C4%C4%A7%B7%A8%B5%EA">雾雨家的魔法店吧</a>',
	                '官方资源库兼论坛：<a href="http://liuxingye.666forum.com">雾雨魔法店的仓库</a>',
	                '无论是聊天，看漫画，反映问题，还是想提出建议，都可以到以上任意一个地方去发表意见，我们会看到并尊重你的每一个意见。',
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
	        	'游戏BGM：東方紅魔月譚 ～ Scarlet Devil Fantasic Rhapsody 【まぐなむおーぱす】',
	        	'红月异变BGM：「artificial」 【THE OTHER FLOWER】',
	        	'散樱异变BGM：「桜風」 【森羅万象】',
	        	'永夜异变BGM：「輝夜」 【凋叶棕】',
	        	'花映异变BGM：「LAST JUDGEMENT」 【SOUND HOLIC】',
	        	'萃梦异变BGM：「まだ、もう少しだけ」 【Minstrel】',
	        	'皆杀异变BGM： EastNewSound - 緋色月下、狂咲ノ絶　-1st Anniversary Remix-',
	        	'笨蛋异变BGM： 「ちるのりずむ」 【ShibayanRecords】',
	        	'图鉴BGM：「忘らるる物語」 【凋叶棕】',
	        	],
	        	showcase:function(init){

	        	}
	        }
	    },
	};
});
