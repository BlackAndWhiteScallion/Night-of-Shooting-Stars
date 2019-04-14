'use strict';
game.import('play',function(lib,game,ui,get,ai,_status){
	return {
		name:'boss1',
		init:function(){
			lib.characterIntro['boss_zhaoyun'] = '幻想乡是一切皆有可能的地方。<br>即使是原本不可能打得过的人物……！';
			if (lib.config.gameRecord.boss){
				lib.characterPack.mode_extension_boss1={
				};
				if (lib.config.gameRecord.boss.data['boss_reimu']){
					lib.characterPack.mode_extension_boss1.boss_reimu = ['female','3',4,['lingji','mengxiangtiansheng'],[]];
				} 
				if (lib.config.gameRecord.boss.data['boss_zhaoyun']){
					lib.characterPack.mode_extension_boss1.boss_zhaoyun = ['male','0',1,['boss_juejing','longhun'],[]];
				}
				if (lib.config.gameRecord.boss.data['boss_nianshou']){
					lib.characterPack.mode_extension_boss1.boss_nianshou = ['female','0',4,['boss_qixiang','boss_nianrui'],[]];
				}
				for(var i in lib.characterPack.mode_extension_boss1){
					lib.characterPack.mode_extension_boss1[i][4].push('mode:boss');
					lib.character[i]=lib.characterPack.mode_extension_boss1[i];
					if(!lib.config.boss1_enableai_playpackconfig){
						lib.config.forbidai.push(i);
					}
				}
				var list={
					mode_extension_boss1_character_config:'挑战',
				};
				
				if(get.mode()!='boss'){
					for(var i in list){
						lib.translate[i]=lib.translate[i]||list[i];
					}
				}
			}
		},
		arenaReady:function(){
			if (get.mode() == 'boss') return;
			game.loadModeAsync('boss',function(mode){
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
