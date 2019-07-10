'use strict';
game.import('play',function(lib,game,ui,get,ai,_status){
	return {
		name:'boss',
		init:function(){
			lib.characterPack.mode_extension_stg_scarlet={
			};
			if ((lib.config.gameRecord.stg && lib.config.gameRecord.stg.data['stg_scarlet'] && lib.config.gameRecord.stg.data['stg_scarlet'][0] > 0)
			 || lib.config.connect_nickname == '路人'){
				lib.characterPack.mode_extension_stg_scarlet['stg_remilia']=['female','5',4,['mingyun','gungirs'],[]],
				lib.characterPack.mode_extension_stg_scarlet['stg_bookshelf']=['female','3',5,['juguang'],[]],
				lib.characterIntro['stg_remilia']='众所周知，什么神枪魔枪都是有好多把，可以随便召唤跟回手，而且还可以变成各种奇怪的形状的。<br>画师：ふゆき(七原冬雪)';
				lib.characterIntro['stg_bookshelf']='链接: <a href = "https://pan.baidu.com/s/1MkevcTpTKWDl_IFqHGvXew" target="_blank">https://pan.baidu.com/s/1MkevcTpTKWDl_IFqHGvXew</a> 提取码: 2333';
			}
			if (lib.config.gameRecord.stg && lib.config.gameRecord.stg.data['stg_scarlet'] && lib.config.gameRecord.stg.data['stg_scarlet'][0] > 0){
				lib.characterPack.mode_extension_stg_scarlet['stg_patchouli']=['female','2',3,['qiyao','riyin','royal'],[]],
				lib.characterIntro['stg_patchouli']='“喂，帕琪，你就算自己能做一个假太阳，不代表你就可以成天躲着不晒太阳了啊？”<br>“无路赛。”<br>画师：60枚';
			}
			for(var i in lib.characterPack.mode_extension_stg_scarlet){
				lib.characterPack.mode_extension_stg_scarlet[i][4].push('mode:stg');
				lib.character[i]=lib.characterPack.mode_extension_stg_scarlet[i];
				if(!lib.config.boss_enableai_playpackconfig){
					lib.config.forbidai.push(i);
				}
			}
			var list={
				stg_remilia:'蕾米莉亚',
				stg_patchouli:'帕秋莉',

				stg_bookshelf:'魔导书塔',
				juguang_info:'游戏开始时，你装备5种魔导书；你可以跳过你的所有阶段，并消耗1点灵力，视为使用一张【轰！】；锁定技，你的装备区上限+2。',
				mode_extension_stg_scarlet_character_config:'闯关角色',
			};
			if(get.mode()!='stg'){
				for(var i in list){
					lib.translate[i]=lib.translate[i]||list[i];
				}
			}
		},
		arenaReady:function(){
			if(get.mode()=='stg') return;
			game.loadModeAsync('stg',function(mode){
				for(var i in mode.translate){
					lib.translate[i]=lib.translate[i]||mode.translate[i];
					//lib.translate[i]=mode.translate[i];
				}
				for(var i in mode.skill){
					if(lib.skill[i]) console.log(i);
					//console.log(i);
					lib.skill[i]=mode.skill[i];
					game.finishSkill(i);
				}
				if(get.mode()!='stg'){
					lib.skill['juguang'].forced = false;
				}
				for(var i in mode.card){
					if(lib.card[i]) console.log(i);
					//console.log(i);
					lib.card[i]=mode.card[i];
					game.finishCards();
				}
			});
		},
	};
});
