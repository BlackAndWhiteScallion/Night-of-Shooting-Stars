'use strict';
game.import('play',function(lib,game,ui,get,ai,_status){
	return {
		name:'boss1',
		init:function(){
			lib.characterIntro['boss_zhaoyun'] = '幻想乡是一切皆有可能的地方。<br>即使是原本不可能打得过的人物……！';
			if (lib.config.gameRecord.boss){
				lib.characterPack.mode_extension_boss1={
				};
				if (lib.config.gameRecord.boss.data['boss_reimu2']){
					lib.characterPack.mode_extension_boss1.boss_reimu = ['female','5',4,['lingji','mengxiangtiansheng'], [], 'shu'];
				}
				if (lib.config.gameRecord.boss.data['boss_cirno2']){
					lib.characterPack.mode_extension_boss1.boss_cirno = ['female', '9', 4, ['jiqiang','zuanshi','jubing'], [], 'wei', '9'];
				} 
				if (lib.config.gameRecord.boss.data['boss_zhaoyun']){
					lib.characterPack.mode_extension_boss1.boss_zhaoyun = ['male','0',1,['boss_juejing','longhun'],[], 'shen'];
				}
				if (lib.config.gameRecord.boss.data['boss_nianshou'] && lib.config.gameRecord.boss.data['boss_nianshou'][0] >= 50){
					lib.characterPack.mode_extension_boss1.boss_nianshou = ['female','0',10000,['boss_qixiang','boss_nianrui'],[],'shu','10000'];
				}
				if (lib.config.gameRecord.boss.data['boss_saitama'] && lib.config.gameRecord.boss.data['boss_saitama'][0] >= 5){
					lib.characterPack.mode_extension_boss1.boss_saitama = ['male','0',Infinity,['punch'],[],'shen','1'];
				}
				if (lib.config.gameRecord.boss.data['boss_fapaiji'] && lib.config.gameRecord.boss.data['boss_fapaiji'][0] >= 5){
					lib.characterPack.mode_extension_boss1.boss_fapaiji = ['female','5', 3,['huanri', 'toutian'],[],'shen'];
				}
				for(var i in lib.characterPack.mode_extension_boss1){
					lib.characterPack.mode_extension_boss1[i][4].push('mode:boss');
					lib.character[i]=lib.characterPack.mode_extension_boss1[i];
					if(!lib.config.boss1_enableai_playpackconfig){
						lib.config.forbidai.push(i);
					}
				}
				var list={
					mode_extension_boss1_character_config:'大魔王！',
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
