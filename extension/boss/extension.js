'use strict';
game.import('play',function(lib,game,ui,get,ai,_status){
	return {
		name:'boss',
		init:function(){
			lib.characterPack.mode_extension_boss={
			}
			lib.characterIntro['boss_zhaoyun'] = '幻想乡是一切皆有可能的地方。<br>即使是原本不可能打得过的人物……！';
			if (lib.config.gameRecord.boss){
				lib.characterPack.mode_extension_boss={
					yuri:['female', '3', 3, ['chongzou', 'moxin1'], []],
					priestress:['female', '3', 3, ['xiaoyu', 'jinhua', 'shengbi'], [], '', '3'],
					tamamo:['female', '2', 3, ['liyu', 'zhoufa', 'shuitian'], []],
				};
				if (lib.config.gameRecord.boss.data['boss_reimu2']){
					lib.characterPack.mode_extension_boss.boss_reimu2 = ['female','5',4,['lingji','mengxiangtiansheng'], [], 'shu'];
				}
				if (lib.config.gameRecord.boss.data['boss_cirno2']){
					lib.characterPack.mode_extension_boss.boss_cirno2 = ['female', '9', 4, ['jiqiang','zuanshi','jubing'], [], 'wei', '9'];
				}
				if (lib.config.gameRecord.boss.data['boss_mokou2']){
					lib.characterPack.mode_extension_boss.boss_mokou2 = ['female', '5', 8, ['huoniao2', 'businiao_boss'],[], 'shu'];
				}  
				if (lib.config.gameRecord.boss.data['boss_zhaoyun']){
					lib.characterPack.mode_extension_boss.boss_zhaoyun = ['male','0',1,['boss_juejing','longhun'],[], 'shen'];
				}
				if (lib.config.gameRecord.boss.data['boss_nianshou'] && lib.config.gameRecord.boss.data['boss_nianshou'][0] >= 50){
					lib.characterPack.mode_extension_boss.boss_nianshou = ['female','0',10000,['boss_qixiang','boss_nianrui'],[],'shu','10000'];
				}
				if (lib.config.gameRecord.boss.data['boss_saitama'] && lib.config.gameRecord.boss.data['boss_saitama'][0] >= 5){
					lib.characterPack.mode_extension_boss.boss_saitama = ['male','0',Infinity,['punch'],[],'shen'];
				}
				//if (lib.config.gameRecord.boss.data['boss_fapaiji'] && lib.config.gameRecord.boss.data['boss_fapaiji'][0] >= 5){
					lib.characterPack.mode_extension_boss.boss_fapaiji = ['female','5', 3,['huanri', 'toutian'],[],'shen'];
				//}
				for(var i in lib.characterPack.mode_extension_boss){
					lib.characterPack.mode_extension_boss[i][4].push('mode:boss');
					lib.character[i]=lib.characterPack.mode_extension_boss[i];
					if(!lib.config.boss_enableai_playpackconfig){
						lib.config.forbidai.push(i);
					}
				}
				var list={
					mode_extension_boss_character_config:'大魔王！',
					boss_saitama:'斗篷光头',
					boss_cirno2:'琪露诺',
					boss_zhaoyun:'赵云',
					boss_nianshou:'年兽',
					boss_fapaiji:'发牌姬',
					boss_reimu2:'灵梦',
					boss_mokou2:'妹红',
					yuri:'由理',
					tamamo:'玉藻前',
					priestress:'女神官',
				};
				if(get.mode()!='boss'){
					for(var i in list){
						lib.translate[i]=lib.translate[i]||list[i];
					}
				}
				lib.translate['shengbi_info'] = '一名角色的回合开始时，你可以消耗1点灵力并指定一名角色：其本回合第一次受到伤害时，该伤害-1。';
			}
		},
		arenaReady:function(){
			if (get.mode() == 'boss' || get.mode() == 'puzzle') return;
			lib.card.list = lib.card.list.concat([[null,0,'boss_sansi'],[null,0,'boss_sansi'],[null,0,'boss_gushou'],[null,0,'boss_gushou'],[null,0,'boss_poxian'],[null,0,'boss_poxian']]);
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
