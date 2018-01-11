'use strict';
game.import('card',function(lib,game,ui,get,ai,_status){
	return {
		name:'incident',
		card:{
			scarlet:{
				type:'zhenfa',
				audio:true,
				fullskin:true,
				enable:true,
				selectTarget:-1,
				filterTarget:function(card,player,target){
					return target==player;
				},
				modTarget:true,
				content:function(){
					target.addSkill(scarlet_normal);
					target.addSkill(scarlet_win);
				},
			},
			sakura:{
				type:'zhenfa',
			},
			niaoxiangzhen:{
				type:'zhenfa',
				chongzhu:true,
				enable:true,
				filterTarget:function(card,player,target){
					if(player.identity==target.identity) return false;
					if(target.identity=='unknown'||target.identity=='ye') return false;
					return target.identity==target.next.identity||target.identity==target.previous.identity
				},
				selectTarget:-1,
				content:function(){
					"step 0"
					var next=target.chooseToRespond({name:'shan'});
					next.ai=function(card){
						if(get.damageEffect(target,player,target)>=0) return 0;
						return 1;
					};
					next.autochoose=lib.filter.autoRespondShan;
					"step 1"
					if(result.bool==false){
						target.damage();
					}
				},
				ai:{
					basic:{
						order:9,
						useful:1
					},
					result:{
						target:-1.5,
					},
					tag:{
						respond:1,
						respondShan:1,
						damage:1,
					}
				},
				mode:['guozhan'],
			},
		},
		skill:{

		},
		translate:{
			incident:'异变',
			scarlet:'红月',
			sakura:'散樱',
			scarlet_info:'d',
			sakura_info:'d',
			changshezhen_info:'若你处于队列中，与你同一队列的所有角色摸一张牌，否则将与你逆时针距离最近的同势力角色移至你下家',
			// pozhenjue_info:'将所有角色的顺序随机重排',
			tianfuzhen_info:'所有大势力角色弃置一张牌'
		},
		list:[
			["diamond",1,'sakura'],
		],
	};
});
