'use strict';
game.import('play',function(lib,game,ui,get,ai,_status){
	return {
		name:'boss',
		init:function(){
			if ((lib.config.gameRecord.stg && lib.config.gameRecord.stg.data['stg_scarlet'] && lib.config.gameRecord.stg.data['stg_scarlet'][0] > 0)
			 || lib.config.connect_nickname == '路人'){
				lib.characterPack.mode_extension_stg_scarlet={
					stg_remilia:['female','5',4,['mingyun','gungirs'],['hiddenboss','bossallowed']],
					stg_bookshelf:['female','3',5,['juguang'],['hiddenboss','bossallowed']],
				};
				for(var i in lib.characterPack.mode_extension_stg_scarlet){
					lib.characterPack.mode_extension_stg_scarlet[i][4].push('mode:stg');
					lib.character[i]=lib.characterPack.mode_extension_stg_scarlet[i];
					if(!lib.config.stg_enableai_playpackconfig){
						lib.config.forbidai.push(i);
					}
				}
				lib.characterIntro['stg_bookshelf']='链接: <a href = "https://pan.baidu.com/s/1MkevcTpTKWDl_IFqHGvXew">https://pan.baidu.com/s/1MkevcTpTKWDl_IFqHGvXew</a> 提取码: 2333';
			}
			var list={
				stg_remilia:'蕾米莉亚',
				stg_bookshelf:'魔导书塔',
				juguang_info:'游戏开始时，你装备5种魔导书；你可以跳过你的所有阶段，并消耗1点灵力，视为使用一张【轰！】；锁定技，你的装备区上限+2。',
				mode_extension_stg_scarlet_character_config:'闯关:红魔乡',
			};
			if(get.mode()!='stg'){
				for(var i in list){
					lib.translate[i]=lib.translate[i]||list[i];
				}
			}
		},
		arenaReady:function(){
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
