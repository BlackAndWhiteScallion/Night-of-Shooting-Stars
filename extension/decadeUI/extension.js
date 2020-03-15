/*jshint esversion: 6 */
game.import("extension", function(lib,game,ui,get,ai,_status){ return { name:"手机UI升级",
content:function(config, pack){
	var extensionName = 'decadeUI';
	var extension = lib.extensionMenu['extension_' + extensionName];
	var extensionPath = lib.assetURL + 'extension/' + extensionName + '/';
    //if (!(extension.enable && extension.enable.init)) return;
    
	if (lib.device){
		lib.config.layout = 'nova';
	}
	/*
    switch(lib.config.layout){
        case 'long2':
        case 'nova':
            break;
        default:
            //alert('十周年UI提醒您，请更换<手杀>、<新版>布局以获得良好体验（在选项-外观-布局）。');
            break;
    }*/

	console.time(extensionName);
	window.decadeUI = {
		init:function(){
			this.extensionName = extensionName;
			
			var SVG_NS = 'http://www.w3.org/2000/svg';
			var svg = document.body.appendChild(document.createElementNS(SVG_NS, 'svg'));
			var defs = svg.appendChild(document.createElementNS(SVG_NS, 'defs'));
			var solo = defs.appendChild(document.createElementNS(SVG_NS, 'clipPath'));
			var duoL = defs.appendChild(document.createElementNS(SVG_NS, 'clipPath'));
			var duoR = defs.appendChild(document.createElementNS(SVG_NS, 'clipPath'));
			
			solo.id = 'solo-clip';
			duoL.id = 'solo-clip-l';
			duoR.id = 'solo-clip-r';
			
			solo.setAttribute('clipPathUnits', 'objectBoundingBox');
			duoL.setAttribute('clipPathUnits', 'objectBoundingBox');
			duoR.setAttribute('clipPathUnits', 'objectBoundingBox');
			
			var soloPath = solo.appendChild(document.createElementNS(SVG_NS, 'path'));
			var duoLPath = duoL.appendChild(document.createElementNS(SVG_NS, 'path'));
			var duoRPath = duoR.appendChild(document.createElementNS(SVG_NS, 'path'));
			
			soloPath.setAttribute('d', 'M0 0 H1 Q1 0.065 0.9 0.065 Q1 0.065 1 0.11 V0.96 Q1 1 0.9 1 H0.1 Q0 1 0 0.96 V0.11 Q0 0.065 0.1 0.065 Q0 0.065 0 0 Z');
			duoLPath.setAttribute('d', 'M0 0 H1 V1 Q1 1 0.9 1 H0.1 Q0 1 0 0.96 V0.11 Q0 0.065 0.1 0.065 Q0 0.065 0 0 Z');
			duoRPath.setAttribute('d', 'M0 0 H1 Q1 0.065 0.9 0.065 Q1 0.065 1 0.11 V0.96 Q1 1 0.9 1 H0 Z');
			
			this.initOverride();
		},
		initOverride:function(){
		    var gameCheckFunction = game.check;
		    var gameUncheckFunction = game.uncheck;
		    var swapControlFunction = game.swapControl;
		    var swapPlayerFunction = game.swapPlayer;
		    var createArenaFunction = ui.create.arena;
			var createPauseFunction = ui.create.pause;
			var createPlayerFunction = ui.create.player;
			var createMenuFunction = ui.create.menu;
			var createCardFunction = ui.create.card;
			var initCssstylesFunction = lib.init.cssstyles;
			var initLayoutFunction = lib.init.layout;
			var cardInitFunction = lib.element.card.init;
			var playerInitFunction = lib.element.player.init;
			var playerUninitFunction = lib.element.player.uninit;
			var playerDamageFunction = lib.element.player.$damage;
			var playerUpdateFunction = lib.element.player.update;
			var playerChooseTargetFunction = lib.element.player.chooseTarget;
			var playerThrowFunction = lib.element.player.$throw;
			var playerDrawFunction = lib.element.player.$draw;
			var playerDieAfterFunction = lib.element.player.$dieAfter;
			var playerDieFlipFunction = lib.element.player.$dieflip;
			
			ui.updatehl = decadeUI.layout.updateHand;
			ui.updatej = decadeUI.layout.updateJudges;
			
			ui.updatez = function(zoom) {
    			var width = document.documentElement.offsetWidth;
    			var height = document.documentElement.offsetHeight;
    			var zoom = game.documentZoom;
    			if(zoom != 1){
    			    width = Math.round(width / zoom);
    			    height = Math.round(height / zoom);
    			    if (width % 2 != 0) width += 1;
    			    if (height % 2 != 0) height += 1;
    				document.body.style.width = width + 'px';
    				document.body.style.height = height + 'px'
					document.body.style.zoom = zoom;
					document.body.style.transform = '';
    			}else{
    				document.body.style.width = width + 'px';
    				document.body.style.height = height + 'px';
					document.body.style.zoom = 1;
    				document.body.style.transform = '';
    			}
			};

			game.check = function(event){
			    if (!event) event = _status.event;
			    var result = gameCheckFunction.call(this, event);
			    var ok = true;
			    var range;
			    
			    if (event.filterButton){
			        range = get.select(event.selectButton);
			        if (ui.selected.buttons.length < range[0]){
    					if (!event.forced || event.complexSelect || event.getParent().name == 'chooseCharacter' || event.getParent().name == 'chooseButtonOL'){
    					    ok = false;
					    }
					    
					    if (ok){
					        for (var i = 0; i < event.dialog.buttons.length; i++){
    					        if (event.dialog.buttons[i].classList.contains('selectable')){
    					            ok = false;
    					            break;
    					        }
    					    }
					    }
    				}
			    }
			    
			    if (event.filterCard) event.player.node.equips.classList.remove('popequip');
			    if (event.filterCard && ok){
			        
			        range = get.select(event.selectCard);
			        if(ui.selected.cards.length < range[0]){
						if(!event.forced || event.complexSelect){
						    ok = false;
						}
						
						if (ok){
						    var cards = event.player.getCards(event.position);
						    for (var i = 0; i < cards.length; i ++){
						        if (cards[i].classList.contains('selectable')){
						            ok = false;
						        }
						    }
						}
					}
			    }
			    
			    if (ok && event.filterTarget){
			        for (var i = 0; i < game.players.length; i++){
			            if (game.players[i].classList.contains('selected') ||
			               game.players[i].classList.contains('selectable') ||
			               event.finished){
			                game.players[i].classList.remove('un-selectable');
			            }else{
			                game.players[i].classList.add('un-selectable');
			            }
			        }
			    }
			    
			    return result;
			};
			
			game.uncheck = function(){
			    var target = arguments.length == 0;
			    for (var i = 0; i < arguments.length; i++){
			        if (arguments[i] === 'target'){
			            target = true;
			            break;
			        }
			    }
			    
			    if (target){
			        for (var i = 0; i < game.players.length; i++){
			            game.players[i].classList.remove('un-selectable');
			        }
			    }
			    
			    var result = gameUncheckFunction.apply(this, arguments);
			    return result;
			};
			
			game.swapPlayer = function(player, player2){
			    var result = swapPlayerFunction.call(this, player, player2);
    			if (game.me && game.me != ui.equipsZone.me) {
			        ui.equipsZone.me.appendChild(ui.equipsZone.equips);
			        ui.equipsZone.me = game.me;
				    ui.equipsZone.equips = game.me.node.equips;
					ui.equipsZone.appendChild(game.me.node.equips);
			    }
			    
			    return result;
			};
			
			game.swapControl = function(player){
    			var result = swapControlFunction.call(this, player);
    			if (game.me && game.me != ui.equipsZone.me) {
			        ui.equipsZone.me.appendChild(ui.equipsZone.equips);
			        ui.equipsZone.me = game.me;
				    ui.equipsZone.equips = game.me.node.equips;
					ui.equipsZone.appendChild(game.me.node.equips);
			    }
			    return result;
			};
			
			ui.click.intro = function(e){
                if (_status.dragged) return;
                _status.clicked = true;
                if (this.classList.contains('player') && !this.name){
                    return;
                }
                if (this.parentNode == ui.historybar){
                    if (ui.historybar.style.zIndex == '22'){
                        if (_status.removePop){
                            if (_status.removePop(this) == false) return;
                        } else {
                            return;
                        }
                    }
                    ui.historybar.style.zIndex = 22;
                }
                var uiintro;
                /*if (this.classList.contains('card') && this.parentNode && this.parentNode.classList.contains('equips') && get.is.phoneLayout() && !get.is.mobileMe(this.parentNode.parentNode)){
                    uiintro = get.nodeintro(this.parentNode.parentNode, false, e);
                }*/
                uiintro = uiintro || get.nodeintro(this, false, e);
                if (!uiintro) return;
                uiintro.classList.add('popped');
                uiintro.classList.add('static');
                ui.window.appendChild(uiintro);
                var layer = ui.create.div('.poplayer', ui.window);
                var clicklayer = function(e){
                    if (_status.touchpopping) return;
                    delete _status.removePop;
                    uiintro.delete();
                    this.remove();
                    ui.historybar.style.zIndex = '';
                    delete _status.currentlogv;
                    if (!ui.arena.classList.contains('menupaused') && !uiintro.noresume) game.resume2();
                    if (e && e.stopPropagation) e.stopPropagation();
                    if (uiintro._onclose){
                        uiintro._onclose();
                    }
                    return false;
                };
                
                layer.addEventListener(lib.config.touchscreen ? 'touchend': 'click', clicklayer);
                if (!lib.config.touchscreen) layer.oncontextmenu = clicklayer;
                if (this.parentNode == ui.historybar && lib.config.touchscreen){
                    var rect = this.getBoundingClientRect();
                    e = {
                        clientX: 0,
                        clientY: rect.top + 30
                    };
                }
                
                lib.placePoppedDialog(uiintro, e);
                if (this.parentNode == ui.historybar){
                    if (lib.config.show_history == 'right'){
                        uiintro.style.left = (ui.historybar.offsetLeft - 230) + 'px';
                    } else {
                        uiintro.style.left = (ui.historybar.offsetLeft + 60) + 'px';
                    }
                }
                uiintro.style.zIndex = 21;
                var clickintro = function(){
                    if (_status.touchpopping) return;
                    delete _status.removePop;
                    layer.remove();
                    this.delete();
                    ui.historybar.style.zIndex = '';
                    delete _status.currentlogv;
                    if (!ui.arena.classList.contains('menupaused') && !uiintro.noresume) game.resume2();
                    if (uiintro._onclose){
                        uiintro._onclose();
                    }
                };
                var currentpop = this;
                _status.removePop = function(node){
                    if (node == currentpop) return false;
                    layer.remove();
                    uiintro.delete();
                    _status.removePop = null;
                    return true;
                };
                if (uiintro.clickintro){
                    uiintro.listen(function(){
                        _status.clicked = true;
                    });
                    uiintro._clickintro = clicklayer;
                } else if (!lib.config.touchscreen){
                    uiintro.addEventListener('mouseleave', clickintro);
                    uiintro.addEventListener('click', clickintro);
                } else if (uiintro.touchclose){
                    uiintro.listen(clickintro);
                }
                uiintro._close = clicklayer;
            
                game.pause2();
                return uiintro;
            };
            
            ui.click.identity = function(e){
                if (_status.dragged) return;
                _status.clicked = true;
                if (!game.getIdentityList) return;
                if (_status.video) return;
                if (this.parentNode.forceShown) return;
                if (_status.clickingidentity) {
                    for (var i = 0; i < _status.clickingidentity[1].length; i++) {
                        _status.clickingidentity[1][i].delete();
                        _status.clickingidentity[1][i].style.transform = '';
                    }
                    if (_status.clickingidentity[0] == this.parentNode) {
                        delete _status.clickingidentity;
                        return;
                    }
                }
                var list = game.getIdentityList(this.parentNode);
                if (!list) return;
                if (lib.config.mark_identity_style == 'click') {
                    var list2 = [];
                    for (var i in list) {
                        list2.push(i);
                    }
                    list2.push(list2[0]);
                    for (var i = 0; i < list2.length; i++) {
                        if (this.firstChild.innerHTML == list[list2[i]]) {
                            this.firstChild.innerHTML = list[list2[i + 1]];
                            this.dataset.color = list2[i + 1];
                            break;
                        }
                    }
                } else {
                    if (get.mode() == 'guozhan') {
                        list = {
                            wei: '魏',
                            shu: '蜀',
                            wu: '吴',
                            qun: '群'
                        };
                    }
                    
                    var list2 = get.copy(list);
                    if (game.getIdentityList2) {
                        game.getIdentityList2(list2);
                    }
                    var rect = this.parentNode.getBoundingClientRect();
                    this._customintro = function(uiintro) {
                        if (get.mode() == 'guozhan') {
                            uiintro.clickintro = true;
                        } else {
                            uiintro.touchclose = true;
                        }

                        uiintro.classList.add('woodbg');
                        
                        if (get.is.phoneLayout()) {
                            uiintro.style.width = '100px';
                        } else {
                            uiintro.style.width = '85px';
                        }
                        var source = this.parentNode;
                        for (var i in list) {
                            var node = ui.create.div();
                            node.classList.add('guessidentity');
                            node.classList.add('pointerdiv');
                            ui.create.div('.menubutton.large', list2[i], node);
                            if (!get.is.phoneLayout()) {
                                node.firstChild.style.fontSize = '24px';
                                node.firstChild.style.lineHeight = '24px';
                            }
                            if (get.mode() == 'guozhan') {
                                if (source._guozhanguess) {
                                    if (!source._guozhanguess.contains(i)) {
                                        node.classList.add('transparent');
                                    }
                                }
                                node._source = source;
                                node.listen(ui.click.identitycircle);
                            } else {
                                node.listen(function() {
                                    var info = this.link;
                                    info[0].parentNode.setIdentity(info[2]);
                                    /*
                                    info[0].firstChild.innerHTML = info[1];
                                    info[0].dataset.color = info[2];
                                    */
                                    _status.clicked = false;
                                });
                            }
                            
                            node.link = [this, list[i], i];
                            uiintro.add(node);
                        }
                    };
                    ui.click.touchpop();
                    ui.click.intro.call(this, {
                        clientX: (rect.left + rect.width) * game.documentZoom,
                        clientY: (rect.top) * game.documentZoom
                    });
                }
            };
			
			
			
			ui.create.pause = function(){
				var dialog = createPauseFunction.call(this);
				dialog.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
				return dialog;
			};
				
			ui.clear = function(){
				game.addVideo('uiClear');
				var nodes = document.getElementsByClassName('thrown');
				for(var i = nodes.length - 1; i >= 0; i--){
				    if (nodes[i].fixed)
				        continue;
				    
				    if (nodes[i].classList.contains('card')){
				        decadeUI.layout.clearout(nodes[i]);
					}else{
					    nodes[i].delete();
					}
				}
			};
			
			if ((typeof ui.create.menu) == 'function') {
				var str = ui.create.menu.toString();
				str = str.substring(str.indexOf('{'));
				str = str.replace(/game.documentZoom/g, '1');
				createMenuFunction = new Function('connectMenu', '_status','lib','game','ui','get','ai', str);
			}
			
			ui.create.menu = function(connectMenu){
				return createMenuFunction.call(this, connectMenu, _status, lib, game, ui, get, ai);
			};
			
			ui.create.arena = function(){
			    var result = createArenaFunction.apply(this, arguments);
				decadeUI.config.update();
			    return result;
			};
			
			ui.create.me = function(hasme){
				ui.arena.dataset.layout = game.layout;
				
				ui.mebg = ui.create.div('#mebg', ui.arena);
				ui.me = decadeUI.dialog.create('hand-zone', ui.arena);
				ui.handcards1Container = decadeUI.dialog.create('hand-cards', ui.me);
				ui.handcards2Container = ui.create.div('#handcards2', ui.me);
				ui.arena.classList.add('decadeUI');
				ui.arena.classList.remove('nome');
				var equipsZone = decadeUI.dialog.create('equips-zone', ui.arena);
				var equipsBack = decadeUI.dialog.create('equips-back', equipsZone);
				ui.equipsZone = equipsZone;
				decadeUI.dialog.create('equip0', equipsBack);
				decadeUI.dialog.create('equip1', equipsBack);
				decadeUI.dialog.create('equip2', equipsBack);
				decadeUI.dialog.create('equip3', equipsBack);
				decadeUI.dialog.create('equip4', equipsBack);
				decadeUI.resizeSensor.create(ui.me, decadeUI.layout.onResize);
				decadeUI.layout.onResize();
				
				if(lib.config.mousewheel && !lib.config.touchscreen){
					ui.handcards1Container.onmousewheel = ui.click.mousewheel;
					ui.handcards2Container.onmousewheel = ui.click.mousewheel;
				}
				
				ui.handcards1Container.ontouchstart = ui.click.touchStart;
				ui.handcards2Container.ontouchstart = ui.click.touchStart;
				ui.handcards1Container.ontouchmove = ui.click.touchScroll;
				ui.handcards2Container.ontouchmove = ui.click.touchScroll;
				ui.handcards1Container.style.WebkitOverflowScrolling = 'touch';
				ui.handcards2Container.style.WebkitOverflowScrolling = 'touch';

				if(hasme && game.me){
					ui.handcards1 = game.me.node.handcards1;
					ui.handcards2 = game.me.node.handcards2;
					ui.handcards1Container.appendChild(ui.handcards1);
					ui.handcards2Container.appendChild(ui.handcards2);
				}
				else if(game.players.length){
					game.me = game.players[0];
					ui.handcards1 = game.me.node.handcards1;
					ui.handcards2 = game.me.node.handcards2;
					ui.handcards1Container.appendChild(ui.handcards1);
					ui.handcards2Container.appendChild(ui.handcards2);
				}
				
				if (game.me){
				    equipsZone.me = game.me;
				    equipsZone.equips = game.me.node.equips;
					equipsZone.appendChild(game.me.node.equips);
				}
			};
			
			ui.create.player = function(position, noclick){
				var player = createPlayerFunction.call(this, position, noclick);
				var zoneCamp = decadeUI.dialog.create('camp-zone');
				var zoneHp = decadeUI.dialog.create('hp-zone');
				player.insertBefore(zoneCamp, player.node.name);
				player.insertBefore(zoneHp, player.node.hp);
				player.node.zoneCamp = zoneCamp;
				player.node.zoneHp = zoneHp;
				player.node.mask = decadeUI.dialog.create('mask');
				player.insertBefore(player.node.mask, player.node.identity);
				
				zoneHp.appendChild(player.node.hp);
				
				zoneCamp.node = {
					back: decadeUI.dialog.create('camp-back', zoneCamp),
					border: decadeUI.dialog.create('camp-border', zoneCamp),
					avatarName: player.node.name,
					avatarDefaultName: decadeUI.dialog.create('avatar-name-default', zoneCamp),
				};
				zoneCamp.appendChild(player.node.name);
				zoneCamp.node.avatarName.className = 'avatar-name';
				zoneCamp.node.avatarDefaultName.innerHTML = '主<br>将';

				return player;
			};
			
			ui.create.card = function(position, info, noclick){
				var card = createCardFunction.call(this, position, info, noclick);
				
				card.node.judgeMark = decadeUI.dialog.create('judge-mark', card);
				card.node.usedInfo = decadeUI.dialog.create('used-info', card);
				card.node.cardMask = decadeUI.dialog.create('card-mask', card);
				
				card.node.judgeMark.node = {
					back: decadeUI.dialog.create('back', card.node.judgeMark),
					mark: decadeUI.dialog.create('mark', card.node.judgeMark),
					judge: decadeUI.dialog.create('judge', card.node.judgeMark)
				};

				return card;
			};
			
			lib.init.cssstyles = function(){
			    var temp = lib.config.glow_phase;
			    lib.config.glow_phase = '';
			    initCssstylesFunction.call(this);
			    lib.config.glow_phase = temp;
				
				ui.css.styles.sheet.insertRule('.avatar-name, .avatar-name-default { font-family: ' + (lib.config.name_font || 'xinkai') + ',xinwei }', 0);
			};

			lib.init.layout = function(){
			    var result = initLayoutFunction.apply(this, arguments);
			    ui.arena.dataset.layout = game.layout;
			    return result;
			};
	
			lib.skill._usecard = {
				trigger: { global: 'useCardAfter' },
				forced: true,
				popup: false,
				priority: -100,
				filter:function(event){
					return ui.clear.delay === 'usecard' && event.card.name != 'wuxie';
				},
				content:function(){
					ui.clear.delay = false;
    				game.broadcastAll(function(){
    					ui.clear();
    				});
				}
			},
			
			lib.skill._usecardBegin = {
				trigger:{ global:'useCardBegin' },
				forced: true,
				popup: false,
				priority: -100,
				filter:function(event){
				    return !ui.clear.delay && event.card.name != 'wuxie';
				},
				content:function(){
					ui.clear.delay = 'usecard';
				}
			};
	        
	        lib.skill._discard = {
				trigger: { global: ['discardAfter'] },
				forced: true,
				popup: false,
				priority: -100,
				filter:function(event){
					return ui.todiscard[event.discardid] ? true : false;
				},
				content:function(){
					game.broadcastAll(function(id){
    					if (decadeUI){
    					    ui.todiscard = [];
    					    ui.clear();
    					    return;
    					}
    						
    					var todiscard = ui.todiscard[id];
    					delete ui.todiscard[id];
    					if (todiscard){
    						var time = 1000;
    						if (typeof todiscard._discardtime == 'number'){
    							time += todiscard._discardtime - get.time();
    						}
    						if (time < 0){
    							time = 0;
    						}
    						setTimeout(function(){
    							for (var i = 0; i < todiscard.length; i++){
    								todiscard[i].delete();
    							}
    						},
    						time);
    					}
    				}, trigger.discardid);
				}
			};
			
			lib.skill._decadeUI_dieKillEffect = {
				trigger:{ source:['dieBegin'] },
				forced: true,
				popup: false,
				priority: -100,
				content:function(){
					if (!(trigger.source && trigger.player) || !decadeUI.config.playerKillEffect) return;
					decadeUI.effect.kill(trigger.source, trigger.player);
				}
			};
			
			lib.element.content.addJudge = function(){
				"step 0";
				if (cards){
					var owner = get.owner(cards[0]);
					if (owner){
						owner.lose(cards, 'visible');
					}
				};
				"step 1";
				if (cards[0].destroyed){
					if (player.hasSkill(cards[0].destroyed)){
						delete cards[0].destroyed;
					} else {
						event.finish();
						return;
					}
				}
				cards[0].fix();
				cards[0].style.transform = '';
				cards[0].classList.remove('drawinghidden');
				cards[0]._transform = null;
				
				var viewAs = typeof card == 'string' ? card: card.name;
				if (!lib.card[viewAs] || !lib.card[viewAs].effect){
					game.cardsDiscard(cards[0]);
				} else {
					cards[0].style.transform = '';
					player.node.judges.insertBefore(cards[0], player.node.judges.firstChild);
					if (_status.discarded){
						_status.discarded.remove(cards[0]);
					}
					ui.updatej(player);
					game.broadcast(function(player, card, viewAs){
						card.fix();
						card.style.transform = '';
						card.classList.add('drawinghidden');
						card.viewAs = viewAs;
						if (viewAs && viewAs != card.name){
							if (decadeUI){
								card.classList.add('fakejudge');
								cards.node.judgeMark.node.judge.innerHTML = get.translation(cards[0].viewAs)[0];
								
							}else if (card.classList.contains('fullskin') || card.classList.contains('fullborder')){
								card.classList.add('fakejudge');
								card.node.background.innerHTML = lib.translate[viewAs+'_bg'] || get.translation(viewAs)[0];
							}
						} else {
							card.classList.remove('fakejudge');
							if (decadeUI) cards.node.judgeMark.node.judge.innerHTML = get.translation(cards[0].name)[0];
						}
						
						player.node.judges.insertBefore(card, player.node.judges.firstChild);
						ui.updatej(player);
						if (card.clone && (card.clone.parentNode == player.parentNode || card.clone.parentNode == ui.arena)){
							card.clone.moveDelete(player);
							game.addVideo('gain2', player, get.cardsInfo([card]));
						}
					}, player, cards[0], viewAs);
					
					if (cards[0].clone && (cards[0].clone.parentNode == player.parentNode || cards[0].clone.parentNode == ui.arena)){
						cards[0].clone.moveDelete(player);
						game.addVideo('gain2', player, get.cardsInfo(cards));
					}

					if (get.itemtype(card) != 'card'){
						if (typeof card == 'string') cards[0].viewAs = card;
						else cards[0].viewAs = card.name;
					} else {
						cards[0].viewAs = null;
					}
					
					if (cards[0].viewAs && cards[0].viewAs != cards[0].name){
						cards[0].classList.add('fakejudge');
						cards[0].node.judgeMark.node.judge.innerHTML = get.translation(cards[0].viewAs)[0];
						game.log(player, '被贴上了<span class="yellowtext">' + get.translation(cards[0].viewAs) + '</span>（', cards, '）');
					} else {
						cards[0].classList.remove('fakejudge');
						cards[0].node.judgeMark.node.judge.innerHTML = get.translation(cards[0].name)[0];
						game.log(player, '被贴上了', cards);
					}
					
					game.addVideo('addJudge', player, [get.cardInfo(cards[0]), cards[0].viewAs]);
				}
			};
			
			lib.element.player.update = function(nocallUpdate, damage){
			    var result;
			    var nocall = nocallUpdate === 'nocall';
			    if (!nocall) {
			        result = playerUpdateFunction.apply(this, arguments);
			    }
			    
			    var hp = this.node.hp;
			    var hpValue = this.hp - (nocall ? damage : 0);
			    
			    if (this.maxHp > 5){
			        hp.innerHTML = (hpValue != Infinity ? hpValue : '∞') + '<br>/<br>' + (this.maxHp != Infinity ? this.maxHp : '∞') + '<div></div>';
					if(hpValue == 0){
						hp.lastChild.classList.add('lost');
					}
					
					hp.classList.add('textstyle');
			    }else if(nocall) {
			        hp.innerHTML='';
					hp.classList.remove('text');
					hp.classList.remove('textstyle');
					while (this.maxHp > hp.childNodes.length){
						ui.create.div(hp);
					}
					
					while(this.maxHp < hp.childNodes.length){
						hp.removeChild(hp.lastChild);
					}
					
					for (var i = 0; i < this.maxHp; i++) {
                        var index = i;
                        if (get.is.newLayout()) {
                            index = this.maxHp - i - 1;
                        }
                        if (i < hpValue) {
                            hp.childNodes[index].classList.remove('lost');
                        } else {
                            hp.childNodes[index].classList.add('lost');
                        }
                    }
			    }
			    
			    if (true) {
                    if (hp.classList.contains('room')) {
                        hp.dataset.condition = 'high';
                    } else if (hpValue == 0) {
                        hp.dataset.condition = '';
                    } else if (hpValue > Math.round(this.maxHp / 2) || hpValue == this.maxHp) {
                        hp.dataset.condition = 'high';
                    } else if (hpValue > Math.floor(this.maxHp / 3)) {
                        hp.dataset.condition = 'mid';
                    } else {
                        hp.dataset.condition = 'low';
                    }
                    
                    //ui.refresh(hp);
			    }
			    
				this.dataset.maxHp = this.maxHp;
				
			    return result;
			};

			lib.element.player.setIdentity = function(identity){
				if(!identity) identity = this.identity;
				
				switch(get.mode()){
				    case 'guozhan':
				        this.group = identity;
				        break;
				    case 'versus':
						if (_status.mode == 'three' || _status.mode == 'four' || _status.mode == 'standard') {
							this._finalSide = this.side;
							if (this.side === false) this.node.identity.classList.add('opposite');
						}
				        break;
				}
				
				this.node.identity.dataset.color = identity;
				if (decadeUI.config.campIdentityImageMode){
				    var that = this;
					var image = new Image();
					var url = extensionPath + 'image/decoration/identity_' + decadeUI.getPlayerIdentityByMode(that, identity) + '.webp';
				    that._finalIdentity = identity;
					
				    image.onerror = function(){
						that.node.identity.firstChild.innerHTML = get.is.jun(that) ? '君' : get.translation(that._finalIdentity);
				    };
				    
				    that.node.identity.firstChild.innerHTML = '';
				    that.node.identity.firstChild.style.backgroundImage = 'url("' + url + '")';
					image.src = url;
					
				}else{
				    this.node.identity.firstChild.innerHTML = get.is.jun(this) ? '君' : get.translation(identity);
				}
				
				return this;
			};
			
			lib.element.player.$damage = function(source){
			    if (!source) source = this;

			    var result = playerDamageFunction.call(this, source);
			    var time = getComputedStyle(source).transitionDuration;
			    if (!time) return result;
			    
			    if (time.lastIndexOf('ms') != -1){
			        time = parseInt(time.replace(/ms/, ''));
			    }else if(time.lastIndexOf('s') != -1){
			        time = parseFloat(time.replace(/s/, '')) * 1000;
			    }
			    
			    decadeUI.delay(time + 100);
			    this.update('nocall', _status.event.num);
			    return result;
			};
			
			lib.element.player.$throw = function(card, time, init, nosource){
				time = undefined;
				return playerThrowFunction.call(this, card, time, init, nosource);
			};
			
			lib.element.player.$dieflip = function(){
				if (!decadeUI.config.playerDieEffect && playerDieFlipFunction) playerDieFlipFunction.apply(this, arguments);
			};
			
			lib.element.player.$dieAfter = function(){
				if (!decadeUI.config.playerDieEffect) {
					if (playerDieAfterFunction) playerDieAfterFunction.apply(this, arguments);
					return;
				}
				
				if(!this.node.dieidentity) this.node.dieidentity = ui.create.div('damage.dieidentity', this);
				this.node.dieidentity.classList.add('damage');
				this.node.dieidentity.classList.add('dieidentity');
				this.classList.add('died-effect');
				
				var that = this;
				var image = new Image();
				var identity = decadeUI.getPlayerIdentityByMode(this);
				
				var url = extensionPath + 'image/decoration/dead_' + identity + '.webp';
				image.onerror = function(){
					that.node.dieidentity.innerHTML = decadeUI.getPlayerIdentityByMode(that, that.identity, true) + '<br>阵亡';
					if (that._finalSide === false) {
						that.node.dieidentity.classList.add('opposite');
					}
				};
				
				that.node.dieidentity.innerHTML = '';
				that.node.dieidentity.style.backgroundImage = 'url("' + url + '")';
				image.src = url;

				// var dieIdentityNode = that.node.dieidentity;
				// var transform = this.style.transform;
				// if (transform) {
					// if (transform.indexOf('rotateY') != -1) {
						// dieIdentityNode.style.transform = 'rotateY(180deg)';
					// } else if (transform.indexOf('rotateX') != -1) {
						// dieIdentityNode.style.transform = 'rotateX(180deg)';
					// } else {
						// dieIdentityNode.style.transform = '';
					// }
				// } else {
					// dieIdentityNode.style.transform = '';
				// }
			};
			
			lib.element.player.$throwordered2 = function(card, nosource){
				if (_status.connectMode) ui.todiscard = [];
				
				card.classList.add('thrown');
				card.classList.add('transition-none');
				var inserted = false;
				
				if (!card.fixed){
    				for (var i = 0; i < ui.thrown; i++){
    			        if (ui.thrown[i].parentNode == ui.arena){
    			            ui.arena.insertBefore(card, ui.thrown[i]);
    			            inserted = true;
    			            break;
    			        }
    			    }
				}
				
				if (!inserted) ui.arena.appendChild(card);
				if (!card.fixed) ui.thrown.splice(0, 0, card);
				var parentNode = card.parentNode;
				var x, y;
				if (nosource){
					x = ((parentNode.offsetWidth - card.offsetWidth) / 2 - parentNode.offsetWidth * 0.08) + 'px';
					y = ((parentNode.offsetHeight - card.offsetHeight) / 2) + 'px';
				}else{
					x = ((this.offsetWidth - card.offsetWidth) / 2 + this.offsetLeft) + 'px';
					y = ((this.offsetHeight - card.offsetHeight) / 2 + this.offsetTop) + 'px';
				}

				card.style.transform = 'translate(' + x + ', ' + y + ')' + 'scale(' + decadeUI.getCardBestScale() + ')';
				ui.refresh(card);
				card.classList.remove('transition-none');
				card.scaled = true;
				if (card.fixed) return;
				decadeUI.layout.invalidateDiscard();
				var usedInfo = card.querySelector('.used-info');
				if (!usedInfo) return card;
				var eventName = '';
				var event = _status.event;
	
				switch(event.name){
				    case 'useCard':
				        if (event.targets.length == 1){
				            if (event.targets[0] == this){
				                eventName = '对自己';
				            }else{
				                eventName = '对' + get.translation(event.targets[0]);
				            }
				        }else{
				            eventName = '使用';
				        }
				        break;
				    case 'respond':
				        eventName = '打出';
				        break;
				    case 'useSkill':
				        eventName = '发动';
				        break;
				    case 'die':
				        card.classList.add('invalided');
				        decadeUI.layout.delayClear();
				        eventName = '弃置';
				        break;
				    case 'lose':
						if (event.parent && event.parent.name == 'discard' && event.parent.parent) {
							var skillEvent = event.parent.parent.parent;
							if (skillEvent) {
								eventName = lib.translate[skillEvent.name != 'useSkill' ? skillEvent.name : skillEvent.skill];
								if (eventName == null) eventName = '';
								eventName += '弃置';
								break;
							}
						}
				    case 'discard':
				        eventName = '弃置';
				        break;
				    case 'judge':
				        eventName = '的判定';
				        if (!lib.element.content['throwJudgeCallback']){
				            lib.element.content['throwJudgeCallback'] = function(event,step,source,player,target,targets,card,cards,skill,forced,num,trigger,result,_status,lib,game,ui,get,ai){
    				            var callback = event.parent.overrides.callback;
    				            if (callback){
    				                if (!callback._parsed){
    				                    event.parent.overrides.callback = lib.init.parse(callback);
    				                    event.parent.overrides.callback._parsed = true;
    				                    callback = event.parent.overrides.callback;
    				                    var steps = callback.toString().match(/case(.*?)(?=:)/g);
    				                    
    				                    if (steps && steps.length){
    				                        event.parent.overrides.step = parseInt(steps[steps.length - 1].replace('case', '')) + 1;
    				                    }
    				                    
    				                }
    				            }
    				            
    				            if (event.parent.overrides.step == step){
    				                event.finish();
    				                return;
    				            }
    				            
    				            if (callback) callback.apply(this, arguments);
    				            var card = event.judgeResult.card.clone;
    				            var judge = event.judgeResult.judge;
    				            card.node.usedInfo = card.querySelector('.used-info');
    				            card.node.usedInfo.innerHTML = (judge != 0 ? (judge > 0 ? '洗具' : '杯具') : '不洗不杯');
				            };
				            
				            lib.element.content['throwJudgeCallback']._parsed = true;
				        }
				        
				        if (!event.overrides) event.overrides = { };
				        event.overrides.callback = event.callback;
				        event.overrides.step = 1;
				        event.callback = 'throwJudgeCallback';
				        break;
				    default:
				        //eventName = event.name;
				        break;
				}
				
				usedInfo.innerHTML = get.translation(this) + eventName;
				return card;
			};
			
			lib.element.card.init = function(param){
				var card = cardInitFunction.call(this, param);
				if (decadeUI.resources.cardNames[card.name] && decadeUI.config.cardReplace){
					card.classList.add('newcard');
					
					var cardName = (card.node.image.classList.contains('thunder') ? 'lei' : (card.node.image.classList.contains('fire') ? 'huo' : '')) + card.name;
					if (!card.classList.contains('infohidden')){
						var path = lib.assetURL + 'extension/' + extensionName + '/image/card/' + cardName + '.webp';
						card.style.background = 'url("' + path + '")';
					}
				}
				
				if (param[0]){
					card.dataset.suit = param[0];
					if (param[1]){
						var cardnum = param[1];
						var cardsuit = get.translation(param[0]);
						if([1,11,12,13].contains(cardnum)){
							cardnum = {'1':'A','11':'J','12':'Q','13':'K'}[cardnum];
						}
						
						card.node.suitNum = decadeUI.dialog.create('suit-num');
						card.insertBefore(card.node.suitNum, card.node.info);
						
						card.node.info.innerHTML = null;
						card.node.suitNum.innerHTML = '<span>' + cardnum + '</span>' + '<br><span>' + cardsuit + '</span>';
						card.node.name2.innerHTML = '<span data-suit="' + param[0] + '">' + cardsuit + cardnum + '</span>&nbsp;' + get.translation(this.name);
						var info = lib.card[this.name];
						
						
						switch(get.subtype(this)){
    						case 'equip3':
        						if(info.distance && info.distance.globalTo){
        							this.node.name2.innerHTML += '&nbsp;+';
        						}
        						break;
    						case 'equip4':
        						if(info.distance&&info.distance.globalFrom){
        							this.node.name2.innerHTML += '&nbsp;-';
        						}
        						break;
    					}
    				
    				}
				}
				
				if (param[0]) card.dataset.suit = param[0];
				
				card.node.topName = decadeUI.dialog.create('top-name', card);
				card.node.topName.innerHTML = get.translation(this.name);
				return card;
			};
			
			
			
			lib.element.card.moveTo = function(player){
                if (!player) return;
                
                this.fixed = true;
                this.moving = true;
                var x = Math.round((player.offsetWidth - this.offsetWidth) / 2 + player.offsetLeft);
                var y = Math.round((player.offsetHeight - this.offsetHeight) / 2 + player.offsetTop);
                var scale = decadeUI.getCardBestScale();
                this.style.transform = 'translate(' + x + 'px,' + y + 'px)scale(' + scale + ')';
                return this;
            };
            
        
            lib.element.card.moveDelete = function(player, handUpdate){
				this.fixed = true;
				this.moving = true;
				if(!this._listeningEnd || this._transitionEnded){
					this.moveTo(player);
					if (!handUpdate && ui.thrown.indexOf(this) != -1){
					    decadeUI.layout.invalidateDiscard();
					}
					
					setTimeout(function(card){
						card.delete();
					}, 330, this);
				}
				else{
					this._onEndMoveDelete = player;
				}
			};
			
			
			lib.element.player.$draw= function(num, init, config){
                if (game.chess) return playerDrawFunction.call(this, num, init, config);
                if (init !== false && init !== 'nobroadcast'){
                    game.broadcast(function(player, num, init, config){
                        player.$draw(num, init, config);
                    }, this, num, init, config);
                }
                
                var cards;
                if (get.itemtype(num) == 'cards'){
                    cards = num;
                    num = cards.length;
                } else if (get.itemtype(num) == 'card'){
                    cards = [num];
                    num = 1;
                }
                
                if (init !== false){
                    if (cards){
                        game.addVideo('drawCard', this, get.cardsInfo(cards));
                    } else {
                        game.addVideo('draw', this, num);
                    }
                }				
                
                var nodes = [];
                for (var i = 0; i < num; i++){
                    var card = cards ? cards[i].copy('thrown', 'drawingcard') : ui.create.div('.card.thrown.drawingcard');
                    card.fixed = true;
                    card.hide();
                    card.classList.add('transition-none');
                    this.parentNode.appendChild(card);
                    nodes.push(card);
                }
                
                var parentNode = this.parentNode;
                var scale = decadeUI.getCardBestScale();
				var cardWidth = nodes[0].offsetWidth * scale;
				var x;
				var y = Math.round((parentNode.offsetHeight - nodes[0].offsetHeight) / 2);
				var margin = (parentNode.offsetWidth - this.offsetWidth) / 2 - (nodes[0].offsetWidth - cardWidth) / 2;
				var marginOffset = Math.round(margin - this.offsetLeft + (nodes[0].offsetWidth - cardWidth) / 2);
				var offset = this.offsetWidth - cardWidth * nodes.length;
				var overflow = offset < 0;
				if (overflow){
					offset = Math.abs(offset) / (nodes.length - 1);
				}else{
					offset /= 2;
				}
                
                var tx, ty, time = 50;
                for (var i = 0; i < nodes.length; i++){
                    var node = nodes[i];
					if (overflow){
						x = Math.round((i * (cardWidth - offset) + margin));
					}else{
						x = Math.round((offset + i * cardWidth + margin));
					}
					
					node.style.transform = 'translate(' + x + 'px,' + y + 'px)scale(' + scale + ')';
					
                    tx = x - marginOffset;
                    ty = (this.offsetHeight - node.offsetHeight) / 2 + this.offsetTop;
                    
                    setTimeout(function(mnode, mnodes, mtx, mty, mscale){
                        mnode.show();
                        mnode.classList.remove('transition-none');
                        ui.refresh(mnode);
                        mnode.style.transform = 'translate(' + mtx + 'px, ' + mty + 'px)' + 'scale(' + mscale + ')';
                        
                        if (mnode == mnodes[mnodes.length - 1]){
                            mnode._mnodes = mnodes;
                            mnode.addEventListener('webkitTransitionEnd', function(){
                                var deletes = this._mnodes;
                                if (!deletes) return;
                                
                                for (var i = 0; i < deletes.length; i++){
                                    deletes[i].style.transitionDuration = '0.3s';
                                    deletes[i].delete();
                                }
                                this._mnodes = null;
                            });                           
                        }
                    }, time, node, nodes, tx, ty, scale);
                    
                    time += 50;
				}
            };
            
            lib.element.player.$give = function(card, player, log, init) {
                if (init !== false) {
                    game.broadcast(function(source, card, player, init) {
                        source.$give(card, player, false, init);
                    },
                    this, card, player, init);
                    if (typeof card == 'number' && card >= 0) {
                        game.addVideo('give', this, [card, player.dataset.position]);
                    } else {
                        if (get.itemtype(card) == 'card') {
                            card = [card];
                        }
                        if (get.itemtype(card) == 'cards') {
                            game.addVideo('giveCard', this, [get.cardsInfo(card), player.dataset.position]);
                        }
                    }
                }
                
                if (get.itemtype(card) == 'cards') {
                    if (log != false && !_status.video) {
                        game.log(player, '从', this, '获得了', card);
                    }
                    if (this.$givemod) {
                        this.$givemod(card, player);
                    } else {
                        for (var i = 0; i < card.length; i++) {
                            this.$give(card[i], player, false, false);
                        }
                    }
                } else if (typeof card == 'number' && card >= 0) {
                    if (log != false && !_status.video) {
                        game.log(player, '从', this, '获得了' + get.cnNumber(card) + '张牌');
                    }
                    if (this.$givemod) {
                        this.$givemod(card, player);
                    } else {
                        while (card--) this.$give('', player, false, false);
                    }
                } else {
                    if (log != false && !_status.video) {
                        if (get.itemtype(card) == 'card' && log != false) {
                            game.log(player, '从', this, '获得了', card);
                        } else {
                            game.log(player, '从', this, '获得了一张牌');
                        }
                    }
                    if (this.$givemod) {
                        this.$givemod(card, player);
                    } else {
                        var node;
                        if (get.itemtype(card) == 'card') {
                            node = card.copy('card', 'thrown', false);
                        } else {
                            node = ui.create.div('.card.thrown');
                        }
                        
                        node.fixed = true;
                        this.$throwordered2(node);
                        node.moveTo = lib.element.card.moveTo;
                        node.moveDelete = lib.element.card.moveDelete;
                        node.moveDelete(player);
                    }
                }
            },
            
            lib.element.player.$gain2 = function(cards, log){
                if (log === true) game.log(this, '获得了', cards);
                
                game.broadcast(function(player, cards){
                    player.$gain2(cards);
                }, this, cards);
                
                switch(get.itemtype(cards)){
                    case 'card':
                        cards = [cards];
                        break;
                    case 'cards':
                        cards = cards;
                        break;
                    default:
                        throw cards;
                }
                
                var list = [], list2 = [];
                var update = false;
                
                for (var i = 0; i < cards.length; i++){
                    if (cards[i].clone && (cards[i].clone.parentNode == this.parentNode || cards[i].clone.parentNode == ui.arena)){
                        if (!update){
                            update = ui.thrown.indexOf(cards[i].clone) != -1;
                        }
                        
                        cards[i].clone.moveDelete(this, true);
                        list2.push(cards[i].clone);
                    } else {
                        list.push(cards[i]);
                    }
                }
                
                if (update){
                    ui.clear();
                    decadeUI.layout.invalidateDiscard();
                }
                
                if (list2.length){
                    game.addVideo('gain2', this, get.cardsInfo(list2));
                }
                
                if (list.length){
                    this.$draw(list, 'nobroadcast');
                    return true;
                }
			};
			
		},
		dialog:{
			create:function(className, parentNode, tagNameOptional){
				var element = !tagNameOptional ? document.createElement('div') : document.createElement(tagNameOptional);
				for(var i in decadeUI.dialog){
					if (decadeUI.dialog[i]) element[i] = decadeUI.dialog[i];
				}
				
				element.listens = {};
				for(var i in decadeUI.dialog.listens){
					if (decadeUI.dialog.listens[i]) element.listens[i] = decadeUI.dialog.listens[i];
				}
					
				element.listens._dialog = element;
				element.listens._list = [];
				
				if (className) element.classList.add(className);
				if (parentNode) parentNode.appendChild(element);
				
				return element;
			},
			open:function(){
				if (this == decadeUI.dialog) return console.error('undefined');
			},
			show:function(){
				if (this == decadeUI.dialog) return console.error('undefined');
				
				this.style.visibility = 'visible';
			},
			hide:function(){
				if (this == decadeUI.dialog) return console.error('undefined');
				
				this.style.visibility = 'hidden';
			},
			animate:function(property, duration, toArray, fromArrayOptional){
				if (this == decadeUI.dialog) return console.error('undefined');
				if (property == null || duration == null || toArray == null) return console.error('arguments');
				
				var propArray = property.replace(/\s*/g, '').split(',');
				if (!propArray || propArray.length == 0) return console.error('property');
				
				var realDuration = 0;
				if (duration.lastIndexOf('s') != -1){
					if (duration.lastIndexOf('ms') != -1){
						duration = duration.replace(/ms/, '');
						duration = parseInt(duration);
						if (isNaN(duration)) return console.error('duration');
						realDuration = duration;
					}else{
						duration = duration.replace(/s/, '');
						duration = parseFloat(duration);
						if (isNaN(duration)) return console.error('duration');
						realDuration = duration * 1000;
					}
				}else {
					duration = parseInt(duration);
					if (isNaN(duration)) return console.error('duration');
					realDuration = duration;
				}
				
				if (fromArrayOptional){
					for (var i = 0; i < propArray.length; i++){
						this.style.setProperty(propArray[i], fromArrayOptional[i]);
					}
				}
				
				var duraBefore = this.style.transitionDuration;
				var propBefore = this.style.transitionProperty;
				this.style.transitionDuration = realDuration + 'ms';
				this.style.transitionProperty = property;
				
				ui.refresh(this);
				for (var i = 0; i < propArray.length; i++){
					this.style.setProperty(propArray[i], toArray[i]);
				}
				
				var restore = this;
				setTimeout(function(){
					restore.style.transitionDuration = duraBefore;
					restore.style.transitionProperty = propBefore;
				}, realDuration);
			},
			close:function(delayTime, fadeOut){
				if (this == decadeUI.dialog) return console.error('undefined');
				this.listens.clear();
				
				if (!this.parentNode) return;
				
				if (fadeOut === true && delayTime) {
					this.animate('opacity', delayTime, 0);
				}
				
				if (delayTime) {
					var remove = this;
					delayTime = (typeof delayTime == 'number') ? delayTime : parseInt(delayTime);
					setTimeout(function(){ 
						if (remove.parentNode) remove.parentNode.removeChild(remove);
					}, delayTime);
					return;
				}
				
				this.parentNode.removeChild(this);
				return;
			},
			listens:{
				add:function(listenElement, event, func, useCapture){
					if (!this._dialog || !this._list) return console.error('undefined');
					if (!(listenElement instanceof HTMLElement) || !event || (typeof func !== 'function')) return console.error('arguments');
					
					this._list.push(new Array(listenElement, event, func));
					listenElement.addEventListener(event, func);
				}, 
				remove:function(listenElementOptional, eventOptional, funcOptional){
					if (!this._dialog || !this._list) return console.error('undefined');
					
					var list = this._list;
					if (listenElementOptional && eventOptional && funcOptional){
						var index = list.indexOf(new Array(listenElementOptional, eventOptional, funcOptional));
						if (index != -1){
							list[index][0].removeEventListener(list[index][1], list[index][2]);
							list.splice(index, 1);
							return;
						}
					}else if (listenElementOptional && eventOptional){
						for (var i = list.length - 1; i >= 0; i--){
							if (list[i][0] == listenElementOptional && list[i][1] == eventOptional){
								list[i][0].removeEventListener(list[i][1], list[i][2]);
								list.splice(i, 1);
							}
						}
					}else if (listenElementOptional && funcOptional){
						for (var i = list.length - 1; i >= 0; i--){
							if (list[i][0] == listenElementOptional && list[i][2] == funcOptional){
								list[i][0].removeEventListener(list[i][1], list[i][2]);
								list.splice(i, 1);
							}
						}
					}else if (eventOptional && funcOptional){
						for (var i = list.length - 1; i >= 0; i--){
							if (list[i][1] == eventOptional && list[i][2] == funcOptional){
								list[i][0].removeEventListener(list[i][1], list[i][2]);
								list.splice(i, 1);
							}
						}
					}else if (listenElementOptional){
						for (var i = list.length - 1; i >= 0; i--){
							if (list[i][0] == listenElementOptional){
								list[i][0].removeEventListener(list[i][1], list[i][2]);
								list.splice(i, 1);
							}
						}
					}else if (eventOptional){
						for (var i = list.length - 1; i >= 0; i--){
							if (list[i][1] == eventOptional){
								list[i][0].removeEventListener(list[i][1], list[i][2]);
								list.splice(i, 1);
							}
						}
					}else if (funcOptional){
						for (var i = list.length - 1; i >= 0; i--){
							if (list[i][2] == funcOptional){
								list[i][0].removeEventListener(list[i][1], list[i][2]);
								list.splice(i, 1);
							}
						}
					}
				},
				clear:function(){
					if (!this._dialog || !this._list) return console.error('undefined');
					
					var list = this._list;
					for (var i = list.length - 1; i >= 0; i--){
						list[i][0].removeEventListener(list[i][1], list[i][2]);
						list[i] = undefined;
					}
					list.length = 0;
				}
			}
		},
		effect:{
			gameStart:function(){
				game.playAudio('../extension', decadeUI.extensionName, 'audio/game_start.mp3');
			},
			kill:function(source, target){
				if (get.itemtype(source) != 'player' || get.itemtype(target) != 'player') throw arguments;
				
				var effect = decadeUI.dialog.create('effect-window');
				var killer = decadeUI.dialog.create('killer', effect);
				var victim = decadeUI.dialog.create('victim', effect);
				var lightLarge = decadeUI.dialog.create('li-big', effect);
				
				victim.back = decadeUI.dialog.create('back', victim);
				victim.rout = decadeUI.dialog.create('rout', victim);
				victim.rout2 = decadeUI.dialog.create('rout', victim);
				victim.back.part1 = decadeUI.dialog.create('part1', victim.back);
				victim.back.part2 = decadeUI.dialog.create('part2', victim.back);
				victim.rout.innerHTML = '破敌';
				victim.rout2.innerHTML = '破敌';
				victim.rout2.classList.add('shadow');
				
				killer.style.backgroundImage = source.node.avatar.style.backgroundImage;
				victim.back.part1.style.backgroundImage = target.node.avatar.style.backgroundImage;
				victim.back.part2.style.backgroundImage = target.node.avatar.style.backgroundImage;
				
				
				game.playAudio('../extension', decadeUI.extensionName, 'audio/kill_effect_sound.mp3');
				effect.style.backgroundColor = 'rgba(0,0,0,0.6)';
				effect.style.transition = 'all 3s';
				ui.window.appendChild(effect);
				var height = ui.window.offsetHeight;
				var x, y , scale;
				for (var i = 0; i < 12; i++) {
					x = decadeUI.getRandom(0, 100) + 'px';
					y = decadeUI.getRandom(0, height / 4) + 'px';
					x = decadeUI.getRandom(0, 1) == 1 ? x : '-' + x;
					y = decadeUI.getRandom(0, 1) == 1 ? y : '-' + y;
					scale = decadeUI.getRandom(1, 10) / 10;
					
					setTimeout(function(mx, my, mscale, meffect){
						var light = decadeUI.dialog.create('li', meffect);
						light.style.transform = 'translate(' + mx + ', ' + my + ')' + 'scale(' + mscale + ')';
					}, decadeUI.getRandom(0, 300), x, y, scale, effect);
				}
				
				console.log(1);
				decadeUI.delay(2000);
				effect.style.backgroundColor = '';
				effect.close(3000);
				effect = null;
			}
		},
		resizeSensor:{
			create:function(element, func, execOpt){
				if (!(element instanceof HTMLElement) || (typeof func !== 'function')) return console.error('arguments');
				
				var sensor = {};
				for(var i in decadeUI.resizeSensor){
					if (decadeUI.resizeSensor[i]) sensor[i] = decadeUI.resizeSensor[i];
				}
				
				sensor._element = element;
				sensor._lastWidth = element.offsetWidth || 1;
				sensor._lastHeight = element.offsetHeight || 1;
				sensor._maxWidth = 10000 * (sensor._lastWidth);
				sensor._maxHeight = 10000 * (sensor._lastHeight);

				var expand = document.createElement('div');
				expand.style.cssText = 'position:absolute;top:0;bottom:0;left:0;right:0;z-index=-10000;overflow:hidden;visibility:hidden;transition:all 0s;';
				var shrink = expand.cloneNode(false);

				var expandChild = document.createElement('div');
				expandChild.style.cssText = 'transition: all 0s !important; animation: none !important;';
				var shrinkChild = expandChild.cloneNode(false);

				expandChild.style.width = sensor._maxWidth + 'px';
				expandChild.style.height = sensor._maxHeight + 'px';
				shrinkChild.style.width = '250%';
				shrinkChild.style.height = '250%';

				expand.appendChild(expandChild);
				shrink.appendChild(shrinkChild);
				element.appendChild(expand);
				element.appendChild(shrink);
				
				if (expand.offsetParent != element){
				  element.style.position = 'relative';
				}
				
				expand.scrollTop = shrink.scrollTop = sensor._maxHeight;
				expand.scrollLeft = shrink.scrollLeft = sensor._maxWidth;
				
				sensor.onScroll = function(){
					sensor._newWidth = sensor._element.offsetWidth || 1;
					sensor._newHeight = sensor._element.offsetHeight || 1;

					if (sensor._newWidth != sensor._lastWidth || sensor._newHeight != sensor._lastHeight){
						  sensor._lastWidth = sensor._newWidth;
						  sensor._lastHeight = sensor._newHeight;
						  requestAnimationFrame(func);
					}
					
					expand.scrollTop = shrink.scrollTop = sensor._maxHeight;
					expand.scrollLeft = shrink.scrollLeft = sensor._maxWidth;
				};
				
				expand.addEventListener('scroll', sensor.onScroll);
				shrink.addEventListener('scroll', sensor.onScroll);
				sensor._expand = expand;
				sensor._shrink = shrink;
				if (execOpt){
				    sensor.onScro();
				}
				
				return sensor;
			},
			close:function(){
				if (this == decadeUI.resizeSensor) return console.error('undefined');
				
				this.expand.removeEventListener('scroll', this.onScroll);
				this.shrink.removeEventListener('scroll', this.onScroll);
				
				if (!this._element){
					this._element.removeChild(this._expand);
					this._element.removeChild(this._shrink);
				}
			}
		},
		resources:{
			cardNames:{
				bagua: ['bagua',  '八卦阵'],
				baiyin: ['baiyin',  '白银狮子'],
				bingliang: ['bingliang',  '兵粮寸断'],
				chitu: ['chitu',  '赤兔'],
				cixiong: ['cixiong',  '雌雄双股剑'],
				dawan: ['dawan',  '大宛'],
				dilu: ['dilu',  '的卢'],
				fangtian: ['fangtian',  '方天画戟'],
				guanshi: ['guanshi',  '贯石斧'],
				guding: ['guding',  '古锭刀'],
				guohe: ['guohe',  '过河拆桥'],
				hanbing: ['hanbing',  '寒冰剑'],
				hualiu: ['hualiu',  '骅骝'],
				huogong: ['huogong',  '火攻'],
				huosha: ['huosha',  '火杀'],
				jiedao: ['jiedao',  '借刀杀人'],
				jiu: ['jiu',  '酒'],
				juedou: ['juedou',  '决斗'],
				jueying: ['jueying',  '绝影'],
				lebu: ['lebu',  '乐不思蜀'],
				leisha: ['leisha',  '雷杀'],
				muniu: ['muniu',  '木牛流马'],
				nanman: ['nanman',  '南蛮入侵'],
				qilin: ['qilin',  '麒麟弓'],
				qinggang: ['qinggang',  '青釭剑'],
				qinglong: ['qinglong',  '青龙偃月刀'],
				renwang: ['renwang',  '仁王盾'],
				sha: ['sha',  '杀'],
				shan: ['shan',  '闪'],
				shandian: ['shandian',  '闪电'],
				shunshou: ['shunshou',  '顺手牵羊'],
				tao: ['tao',  '桃'],
				taoyuan: ['taoyuan',  '桃园结义'],
				tengjia: ['tengjia',  '藤甲'],
				tiesuo: ['tiesuo',  '铁索连环'],
				wanjian: ['wanjian',  '万箭齐发'],
				wugu: ['wugu',  '五谷丰登'],
				wuxie: ['wuxie',  '无懈可击'],
				wuzhong: ['wuzhong',  '无中生有'],
				zhangba: ['zhangba',  '丈八蛇矛'],
				zhuahuang: ['zhuahuang',  '爪黄飞电'],
				zhuge: ['zhuge',  '诸葛连弩'],
				zhuque: ['zhuque',  '朱雀羽扇'],
				zixin: ['zixin',  '紫骍'],
				// ★SP包
				caomu: ['caomu',  '草木皆兵'],
				du: ['du',  '毒'],
				fulei: ['fulei',  '浮雷'],
				jinchan: ['jinchan',  '金蝉脱壳'],
				lanyinjia: ['lanyinjia',  '烂银甲'],
				qibaodao: ['qibaodao',  '七宝刀'],
				qijia: ['qijia',  '弃甲曳兵'],
				shengdong: ['shengdong',  '声东击西'],
				yinyueqiang: ['yinyueqiang',  '银月枪'],
				zengbin: ['zengbin',  '增兵减灶'],
				zhungangshuo: ['zhungangshuo',  '衠钢槊'],
				// 国战
				chiling: ['chiling',  '敕令'],
				diaohulishan: ['diaohulishan',  '调虎离山'],
				dinglanyemingzhu: ['dinglanyemingzhu',  '定澜夜明珠'],
				feilongduofeng: ['feilongduofeng',  '飞龙夺凤'],
				huoshaolianying: ['huoshaolianying',  '火烧连营'],
				huxinjing: ['huxinjing',  '护心镜'],
				jinfanma: ['jinfanma',  '惊帆'],
				lianjunshengyan: ['lianjunshengyan',  '联军盛宴'],
				liulongcanjia: ['liulongcanjia',  '六龙骖驾'],
				lulitongxin: ['lulitongxin',  '勠力同心'],
				minguangkai: ['minguangkai',  '明光铠'],
				sanjian: ['sanjian',  '三尖两刃枪'],
				shuiyanqijunx: ['shuiyanqijux',  '水淹七军'],
				taipingyaoshu: ['taipingyaoshu',  '太平要术'],
				wuliu: ['wuliu',  '吴六剑'],
				xietianzi: ['xietianzi',  '挟天子以令诸侯'],
				yiyi: ['yiyi',  '以逸待劳'],
				yuanjiao: ['yuanjiao',  '远交近攻'],
				yuxi: ['yuxi',  '玉玺'],
				zhibi: ['zhibi',  '知己知彼'],
				// 衍生
				ly_piliche: ['ly_piliche',  '霹雳车'],
				pyzhuren_club: ['pyzhuren_club',  '水波剑'],
				pyzhuren_diamond: ['pyzhuren_diamond',  '烈淬刀'],
				pyzhuren_heart: ['pyzhuren_heart',  '红缎枪'],
				pyzhuren_shandian: ['pyzhuren_shandian',  '天雷刃'],
				pyzhuren_spade: ['pyzhuren_spade',  '淬毒弯刃'],
				rewrite_bagua: ['wy_meirenji',  '先天八卦阵'],
				rewrite_baiyin: ['wy_meirenji',  '玉照狮子盔'],
				rewrite_lanyinjia: ['wy_meirenji',  '精银甲'],
				rewrite_renwang: ['wy_meirenji',  '仁王金刚盾'],
				rewrite_tengjia: ['wy_meirenji',  '桐油百炼甲'],
				rewrite_zhuge: ['wy_meirenji',  '元戎精械弩'],
				wy_meirenji: ['wy_meirenji',  '美人计'],
				wy_xiaolicangdao: ['wy_meirenji',  '笑里藏刀'],
			}
		},
		sheet:{
			init:function(){
				if (!this.sheetList){
					this.sheetList = [];
					for (var i = 0; i < document.styleSheets.length; i++){
						if (document.styleSheets[i].href && document.styleSheets[i].href.indexOf('extension/' + encodeURI(extensionName)) != -1){
							this.sheetList.push(document.styleSheets[i]);
						}
					}
				}
				
				if (this.sheetList) delete this.init;
			},
			getStyle:function(selector, cssName){
				if (!this.sheetList) this.init();
				if (!this.sheetList) throw 'sheet not loaded';
				if ((typeof selector != 'string') || !selector) throw 'parameter "selector" error';
				if (!this.cachedSheet) this.cachedSheet = {};
				if (this.cachedSheet[selector]) return this.cachedSheet[selector];
				
				
				var sheetList = this.sheetList;
				var sheet;
				var shouldBreak = false;
				
				
				for (var j = sheetList.length - 1; j >= 0; j--) {
					if (typeof cssName == 'string') {
						cssName = cssName.replace(/.css/, '') + '.css';
						for (var k = j; k >= 0; k--) {
							if (sheetList[k].href.indexOf(cssName) != -1) {
								sheet = sheetList[k];
							}
						}
						
						shouldBreak = true;
						if (!sheet) throw 'cssName not found';
					} else {
						sheet = sheetList[j];
					}
					/*
					for (var i = 0; i < sheet.cssRules.length; i++) {
						if (!(sheet.cssRules[i] instanceof CSSMediaRule)) {
							if (sheet.cssRules[i].selectorText == selector) {
								this.cachedSheet[selector] = sheet.cssRules[i].style;
								return sheet.cssRules[i].style;
							}
						} else {
							var rules = sheet.cssRules[i].cssRules;
							for (var j = 0; j < rules.length; j++) {
								if (rules[j].selectorText == selector) {
									return rules[j].style;
								}
							}
						}
					}*/
					
					
					if (shouldBreak) break;
				}
				
				return null;
			},
			insertRule:function(rule, index, cssName){
				if (!this.sheetList) this.init();
				if (!this.sheetList) throw 'sheet not loaded';
				if ((typeof rule != 'string') || !rule) throw 'parameter "rule" error';
				
				var sheet;
				if (typeof cssName == 'string') {
					for (var j = sheetList.length - 1; j >= 0; j--) {
						cssName = cssName.replace(/.css/, '') + '.css';
						if (sheetList[j].href.indexOf(cssName) != -1) {
							sheet = sheetList[k];
						}
					}
					
					if (!sheet) throw 'cssName not found';
				}
				
				if (!sheet) sheet = this.sheetList[this.sheetList.length - 1];
				var inserted = 0;
				if (typeof index == 'number'){
					inserted = sheet.insertRule(rule, index);
				} else {
					//inserted = sheet.insertRule(rule, sheet.cssRules.length);
				}
				
				//return sheet.cssRules[inserted].style;
			}
		},
		layout:{
			update:function(){
				this.updateHand();
				this.updateDiscard();
			},
			updateHand:function(debugName){
				if(!ui.handcards1Container || !ui.handcards1Container.firstChild || !game.me) return;
			
				var parentNode = ui.handcards1Container.firstChild;
				var handCards = [];
				for(var i = 0; i < parentNode.childElementCount; i++){
					if(!parentNode.childNodes[i].classList.contains('removing')){
						handCards.push(parentNode.childNodes[i]);
					}else{
						parentNode.childNodes[i].scaled = null;
					}
				}
				
				if (!handCards.length) return;
				
				var margin = 1;
				var scale = decadeUI.getCardBestScale();
				var cardWidth = handCards[0].offsetWidth;
				var x;
				var y = Math.round((parentNode.offsetHeight - handCards[0].offsetHeight) / 2) + 'px';
				var scaleMargin = (cardWidth - cardWidth * scale) / 2;
				cardWidth = cardWidth * scale + margin * 2;
				
				var offset = parentNode.offsetWidth - cardWidth * handCards.length;
				var overflow = offset < 0;
				if (overflow){
					cardWidth -= margin * 2;
					offset = Math.abs(offset + margin * 2 * handCards.length) / (handCards.length - 1);
				}else{
					offset /= 2;
				}
				
				for(var i = 0; i < handCards.length; i++){
					if (!handCards[i].scaled){
					    handCards[i].classList.add('transition-none');
					    x = -Math.round(scaleMargin) + 'px';
					    handCards[i].style.transform = 'translate(' + x + ',' + y + ')scale(' + scale + ')';
					    ui.refresh(handCards[i]);
					    handCards[i].scaled = true;
					    handCards[i].classList.remove('transition-none');
					}
					
					if (overflow){
						x = Math.round((i * (cardWidth - offset) - scaleMargin)) + 'px';
					}else{
						x = Math.round((offset + i * cardWidth + margin - scaleMargin)) + 'px';
					}

					handCards[i].style.transform = 'translate(' + x + ',' + y + ')scale(' + scale + ')';
					handCards[i]._transform = handCards[i].style.transform;
					handCards[i].classList.remove('drawinghidden');
				}
			},
			updateDiscard:function(){
				if (!ui.thrown) ui.thrown = [];
				for (var i = ui.thrown.length - 1; i >= 0; i--){
					if (ui.thrown[i].classList.contains('drawingcard') ||
					   ui.thrown[i].classList.contains('removing') ||
					   ui.thrown[i].parentNode != ui.arena || ui.thrown[i].moving){
						ui.thrown.splice(i, 1);
					}else{
					    ui.thrown[i].classList.remove('removing');
					}
				}
				
				
				if (!ui.thrown.length) return;
				var discards = ui.thrown;
				var parent = discards[0].parentNode;
				var scale = decadeUI.getCardBestScale();
				var margin = 1;
				var cardWidth = discards[0].offsetWidth * scale + margin * 2;
				var x;
				var y = Math.round((parent.offsetHeight - discards[0].offsetHeight) / 2) + 'px';
				var scaleOffset = (1 - scale) * discards[0].offsetWidth / 2;
				var offset = parent.offsetWidth - cardWidth * discards.length;
				var overflow = offset < 0;
				if (overflow){
					cardWidth -= margin * 2;
					offset = Math.abs(offset + margin * 2 * discards.length) / (discards.length - 1);
				}else{
					offset /= 2;
				}
				
				
				for(var i = 0; i < discards.length; i++){
					if (!discards[i].scaled){
					    discards[i].classList.add('transition-none');
					    x = ((parent.offsetWidth - discards[i].offsetWidth) / 2 - parent.offsetWidth * 0.08) + 'px';
					    discards[i].style.transform = 'translate(' + x + ',' + y + ')scale(' + scale + ')';
					    ui.refresh(discards[i]);
					    discards[i].scaled = true;
					    discards[i].classList.remove('transition-none');
					}
					
					
					if (overflow){
						x = Math.round((i * (cardWidth - offset) - scaleOffset)) + 'px';
					}else{
						x = Math.round((offset + i * cardWidth + margin - scaleOffset)) + 'px';
					}
					discards[i].style.transform = 'translate(' + x + ',' + y + ') scale(' + scale + ')';
					discards[i]._transthrown = null;
				}
			},
			updateJudges:function(player){
				if (!player) return;
				
				var judges = player.node.judges.childNodes;
				for (var i = 0; i < judges.length; i++){
					if (judges[i].classList.contains('removing'))
						continue;
					
					judges[i].classList.remove('drawinghidden');
					if (_status.connectMode) {
						if (judges[i].viewAs && judges[i].viewAs != judges[i].name){
							judges[i].node.judgeMark.node.judge.innerHTML = get.translation(judges[i].viewAs)[0];
						} else {
							judges[i].node.judgeMark.node.judge.innerHTML = get.translation(judges[i].name)[0];
						}
					}
				}
				
				return;
			},
			clearout:function(card){
			    if (!card) throw card;
			    if (card.classList.contains('drawingcard') ||
			       card.classList.contains('removing') ||
			       card.fixed || card.moving) return;
			    
				if (ui.thrown.indexOf(card) == -1){
					ui.thrown.splice(0, 0, card);
					card.style.left = 'auto';
					card.style.top = 'auto';
					decadeUI.layout.updateDiscard();
				}
				
				if (!card.classList.contains('invalided')){
				    var event = _status.event;
    				var judging = event.triggername == 'judge' || event.name == 'judge';
    				if (event.name == 'judge' && !ui.clear.delay){
    				    ui.clear.delay = 'judge';
    				    Object.defineProperties(event.parent, {
        					finished: {
        						configurable: true,
        						get:function(){
        							return this._finished;
        						},
        						set:function(value){
        							this._finished = value;
        							if (this._finished == true && ui.clear.delay == 'judge'){
        							    ui.clear.delay = false;
        							    ui.clear();
        							}
        						}
        					},
        					_finished: {
        					    value: false,
        					    writable: true
        					}
        				});
    				}
    				
    				if (ui.clear.delay || (judging && !event.finished)) return;
				}
				
				card.classList.add('invalided');
				setTimeout(function(card){
					if (card.parentNode != null){
					    card.classList.add('removing');
					    card.parentNode.removeChild(card);
					}
					
					card = null;
					decadeUI.layout.invalidateDiscard();
				}, 2333, card);
			},
			delayClear:function(){
			    var timestamp = 500;
			    var nowTime = new Date().getTime();
			    if (this._delayClearTimeout){
			        clearTimeout(this._delayClearTimeout);
			        timestamp = nowTime - this._delayClearTimeoutTime;
			        if (timestamp > 1000){
			            this._delayClearTimeout = null;
			            this._delayClearTimeoutTime = null;
			            ui.clear();
			            return;
			        }
			    }else{
			        this._delayClearTimeoutTime = nowTime;
			    }
			    
			    this._delayClearTimeout = setTimeout(function(){
			        decadeUI.layout._delayClearTimeout = null;
			        decadeUI.layout._delayClearTimeoutTime = null;
			        ui.clear();
			    }, timestamp);
			},
			invalidate:function(){
			    this.invalidateHand();
			    this.invalidateDiscard();
			},
			invalidateHand:function(debugName){
			    //和上下面的有点重复，有空合并
			    var timestamp = 40;
			    var nowTime = new Date().getTime();
			    if (this._handcardTimeout){
			        clearTimeout(this._handcardTimeout);
			        timestamp = nowTime - this._handcardTimeoutTime;
			        if (timestamp > 180){
			            this._handcardTimeout = null;
			            this._handcardTimeoutTime = null;
			            this.updateHand();
			            return;
			        }
			    }else{
			        this._handcardTimeoutTime = nowTime;
			    }
			    
			    this._handcardTimeout = setTimeout(function(){
			        decadeUI.layout._handcardTimeout = null;
			        decadeUI.layout._handcardTimeoutTime = null;
			        decadeUI.layout.updateHand();
			    }, timestamp);
			},
			invalidateDiscard:function(){
			    var timestamp = (ui.thrown && ui.thrown.length > 15) ? 80 : 40;
			    var nowTime = new Date().getTime();
			    if (this._discardTimeout){
			        clearTimeout(this._discardTimeout);
			        timestamp = nowTime - this._discardTimeoutTime;
			        if (timestamp > 180){
			            this._discardTimeout = null;
			            this._discardTimeoutTime = null;
			            this.updateDiscard();
			            return;
			        }
			    }else{
			        this._discardTimeoutTime = nowTime;
			    }
			    
			    this._discardTimeout = setTimeout(function(){
			        decadeUI.layout._discardTimeout = null;
			        decadeUI.layout._discardTimeoutTime = null;
			        decadeUI.layout.updateDiscard();
			    }, timestamp);
			},
			onResize:function(){
			    if (decadeUI.isMobile()) ui.window.classList.add('mobile-phone');
				else ui.window.classList.remove('mobile-phone');
				//减少引起的抖动
				var handStyle = decadeUI.sheet.getStyle('.decadeUI > .hand-zone');
				if (!handStyle){
				    handStyle = decadeUI.sheet.insertRule('.decadeUI > .hand-zone { left: 0; right: 0; height: 0; }');
				}
				
				var buttonsZoom = decadeUI.sheet.getStyle('#arena:not(.choose-character) .buttons');
				if (!buttonsZoom){
				    buttonsZoom = decadeUI.sheet.insertRule('#arena:not(.choose-character) .buttons { zoom: 1; }');
				}
				
				var me = game.me ? game.me : game.players && game.players.length ? game.players[0] : null;
				
				if (me){
					// var meRect = me.getBoundingClientRect();
					// var equipsRect = ui.equipsZone ? ui.equipsZone.getBoundingClientRect() : meRect;
					// ui.me.style.left = Math.round(meRect.right - meRect.left + 50) + 'px';
					// ui.me.style.right = Math.round(equipsRect.right - equipsRect.left + 50)+ 'px';
					var meWidth = me.offsetWidth;
					var equipsWidth = ui.equipsZone ? ui.equipsZone.offsetWidth : meWidth;
					ui.me.style.left = Math.round(meWidth + 50) + 'px';
					ui.me.style.right = Math.round(equipsWidth + 50)+ 'px';
					ui.me.style.width = 'auto';
				}
				
				ui.me.style.height = Math.round(decadeUI.getHandCardSize().height * decadeUI.getCardBestScale()) + 'px';
				if (handStyle){
				    handStyle.left = ui.me.style.left;
					handStyle.right = ui.me.style.right;
				    handStyle.height = ui.me.style.height;
				}
				
				if (buttonsZoom) {
					buttonsZoom.zoom = decadeUI.getCardBestScale();
				}
				
			    decadeUI.layout.invalidate();
			}
		},
		isMobile:function(){
			return true;
		    return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|OperaMini/i.test(navigator.userAgent));
		},
		delay:function(milliseconds){
		    if (typeof milliseconds != 'number') throw 'milliseconds is not number';
		    if(_status.paused) return;
			game.pause();
			_status.timeout = setTimeout(game.resume, milliseconds);
		},
		getRandom:function(min, max) {
			return Math.floor(Math.random() * (max + 1 - min)) + min;
		},
		getCardBestScale:function(sizeOpt){
			if (!(sizeOpt && sizeOpt.height)){
			    sizeOpt = decadeUI.getHandCardSize();
			}
			
			return Math.min(document.body.clientHeight * (decadeUI.isMobile() ? 0.23 : 0.18) / sizeOpt.height, 1);
		},
		getHandCardSize:function(canUseDefault){
			var style = decadeUI.sheet.getStyle('.media_defined > .card');
			if (style == null) style = decadeUI.sheet.getStyle('.hand-cards > .handcards > .card');
			if (style == null) return canUseDefault ? { width: 108, height: 150 } : { width: 0, height: 0 };
			var size = { width: parseFloat(style.width), height: parseFloat(style.height) };
			return size;
		},
		getMapElementPos:function(elementFrom, elementTo){
			if (!(elementFrom instanceof HTMLElement) || !(elementTo instanceof HTMLElement)) return console.error('arguments');
			var rectFrom = elementFrom.getBoundingClientRect();
			var rectTo = elementTo.getBoundingClientRect();
			var pos = { x: rectFrom.left - rectTo.left, y: rectFrom.top - rectTo.top };
			pos.left = pos.x;
			pos.top = pos.y;
			return pos;
		},
		getPlayerIdentityByMode:function(player, identity, chinese, isMark){
			if (!(player instanceof HTMLElement && get.itemtype(player) == 'player')) throw 'player';
			if (!identity) identity = player.identity;
			
			if (!chinese) {
				switch (get.mode()) {
					case 'guozhan':
						if (identity == 'unknown') {
							identity = player.wontYe() ? lib.character[player.name1][1] : 'ye';
						}
						
						if (get.is.jun(player)) identity += 'jun';
						break;
					case 'versus':
						switch (_status.mode) {
							case 'standard':
								switch (identity) {
									case 'trueZhu': return 'shuai';
									case 'trueZhong': return 'bing';
									case 'falseZhu': return 'jiang';
									case 'falseZhong': return 'zu';
								}
								break;
							case 'three':
							case 'four':
								var side = player._finalSide ? player._finalSide : player.side;
								if (side === false) identity += '_false';
								break;
								
							case 'two':
								var side = player._finalSide ? player._finalSide : player.side;
								identity = game.me.side == side ? 'friend' : 'enemy';
								break;
						}
						
						break;
					case 'doudizhu':
						identity = identity == 'zhu' ? 'dizhu' : 'nongmin';
						break;
					case 'boss':
						switch (identity) {
							case 'zhu': identity = 'boss'; break;
							case 'zhong': identity = 'cong'; break;
							case 'cai': identity = 'meng'; break;
						}
						break;
				}
			} else {
				var translated = false;
				switch(get.mode()){
					case 'identity':
						identity = player.special_identity ? player.special_identity : identity + '2';
						break;
						
					case 'guozhan':
						if (identity == 'unknown') {
							identity = player.wontYe() ? lib.character[player.name1][1] : 'ye';
						}
						
						if (get.is.jun(player)) {
							identity = isMark ? '君' : identity + '君';
						} else {
							identity = identity == 'ye' ? '野心家' : (identity == 'qun' ? '群雄' : get.translation(identity) + '将');
						}
						translated = true;
						break;
						
					case 'versus':
						translated = true;
						switch (_status.mode) {
							case 'standard':
							case 'three':
							case 'four':
								switch (identity) {
									case 'zhu': identity = '主公'; break;
									case 'zhong': identity = '忠臣'; break;
									case 'fan': identity = '反贼'; break;
									default: translated = false; break;
								}
								break;
								
							case 'two':
								var side = player._finalSide ? player._finalSide : player.side;
								identity = game.me.side == side ? '友方' : '敌方';
								break;
							
							case 'siguo':
							case 'jiange':
								identity = get.translation(identity) + '将';
								break;
								
							default:
								translated = false;
								break;
						}
						
						break;
						
					case 'doudizhu':
						identity += '2';
						break;
					case 'boss':
						translated = true;
						switch (identity) {
							case 'zhu': identity = 'BOSS'; break;
							case 'zhong': identity = '仆从'; break;
							case 'cai': identity = '盟军'; break;
							default: translated = false; break;
						}
						break;
				}
				
				if (!translated) {
					identity = get.translation(identity);
				}
				
				if (isMark) identity = identity[0];
			}
			
			return identity;
		},
		
	};
	
	decadeUI.config = config;
	decadeUI.config.update = function(){
	    ui.arena.dataset.skillMarkColor = decadeUI.config.skillMarkColor;
	};
	decadeUI.init();
	console.timeEnd(extensionName);
},
precontent:function(){
	var explorer = window.navigator.userAgent.toLowerCase();
	var ver = explorer.match(/chrome\/([\d.].)/)[1];
	if (ver < 50) document.body.dataset.version = 'low';
	
	var extensionName = 'decadeUI';
	var extension = lib.extensionMenu['extension_' + extensionName];
	if (lib.config['extension_' + extensionName + '_eruda']) {
	    var script = document.createElement('script');
        script.src = 'http://eruda.liriliri.io/eruda.min.js'; 
        document.body.appendChild(script); 
        script.onload = function(){ eruda.init(); };
	}
	
	//if (!(extension.enable && extension.enable.init)) return;
	
	var layoutPath = lib.assetURL + 'extension/' + extensionName;
	lib.init.css(layoutPath, 'layout');
	lib.init.css(layoutPath, 'decadeLayout');
	lib.init.css(layoutPath, 'player');
	
	var gameload = lib.init.onload;
	
	Object.defineProperties(_status, {
		connectMode: {
			configurable: true,
			get:function(){
				return this._connectMode;
			},
			set:function(value){
				this._connectMode = value;
				if (value && lib.extensions) {
					var decadeExtension;
					var startBeforeFunction = lib.init.startBefore;

					for (var i = 0; i < lib.extensions.length; i++) {
						if (lib.extensions[i][0] == extensionName) {
							decadeExtension = lib.extensions[i];
							break;
						}
					}
					
					if (!decadeExtension) return;

					lib.init.startBefore = function(){
						try {
							_status.extension = decadeExtension[0];
							_status.evaluatingExtension = decadeExtension[3];
							decadeExtension[1](decadeExtension[2], decadeExtension[4]);
							delete _status.extension;
							delete _status.evaluatingExtension;
							console.log('%c' + extensionName + ': 联机成功', 'color:blue');
						} catch(e) {
							console.log(e);
						}
						
						if (startBeforeFunction) startBeforeFunction.apply(this, arguments);
					};
				}
			}
		},
		_connectMode: {
			value: false,
			writable: true
		}
	});

},help:{},
config:{
    eruda:{
        name: '调试助手(开发用)',
        init: false,
    },
	/*
    cardReplace:{
        name: '使用新杀卡牌素材',
        init: true,
    },
	campIdentityImageMode:{
        name: '势力身份名图片化',
        init: true,
    },*/
	playerKillEffect:{
		name: '玩家击杀特效',
        init: true,
		onclick:function(value){
            game.saveConfig('extension_十周年UI_playerKillEffect', value);
            if (decadeUI) decadeUI.config.playerKillEffect = value;
        },
	},
	playerDieEffect:{
		name: '玩家阵亡特效',
        init: true,
		onclick:function(value){
            game.saveConfig('extension_十周年UI_playerDieEffect', value);
			if (decadeUI) decadeUI.config.playerDieEffect = value;
        },
	},
    skillMarkColor:{
        name: '玩家技能标记颜色',
        init: 'yellow',
        item:{
            yellow:'黄色',
			red:'红色',
        },
        onclick:function(value){
			game.saveConfig('extension_十周年UI_skillMarkColor', value);
			if (decadeUI) ui.arena.dataset.skillMarkColor = value;
		},
    },
},
package:{
    character:{
        character:{
            },
        translate:{
        }
    },
    card:{
        card:{
        },
        translate:{
        },
        list:[]
    },
    skill:{
        skill:{
        },
        translate:{
        }
    },
    intro:
	'改自QQ464598631制作的十周年UI扩展。非常感谢作者！<br>对"手杀"和"最新版"布局生效（选项-外观-布局）<br>扩展打开后，需要重启游戏才能生效。<br>联机时布局有问题，请在联机前关闭此扩展。',
    author:"",
    diskURL:"",
    forumURL:"",
    version:"1.9.98.1.11",
},
files:{
    "character":["测试人物.jpg"],
    "card":[],
    "skill":[]
},
editable: false
};
});

/*
1.9.97.6.2：修复不是本扩展卡牌图片溢出，因判定不能及时清理弃牌区，更正势力颜色，技能按钮位置。
1.9.97.6.3：修复类似邓小艾这种判定没有标记的bug，对决模式可能正常换装备了。新增自定义势力字图，直接放到(十周年UI/image/decoration/name_你的势力名.webp)，如果不存自动用字体代替。
1.9.97.6.5：修复国战模式势力名显示错误，新增新版布局。
1.9.97.9.1：新增身份面具，identity_你的身份名.webp，暂时关闭pc版判定牌的信息(有bug没电脑)。
1.9.97.9.2：优化对决模式中的对抗4v4显示身份面具一样，另一个命名为identity_身份名_false.webp。
1.9.98.1.1：修复游戏原版的界面缩放问题，以便更好的适配布局。增加红色技能标记。
1.9.98.1.2：修正了在新版布局未亮明武将牌的情况下装备不能正常显示，以及调整角色背景，可以自定义透明图片了，适当调宽其他玩家装备显示。
1.9.98.1.3：修复因缺少素材而造成显示身份名不正确的bug。
1.9.98.1.4：新增卡牌素材开关，卡牌左边辅助名称开关。
1.9.98.1.5：现在游戏1.8版本也能用了，不过我发现没有1.9版本流畅。
1.9.98.1.6：修复缩放问题。
1.9.98.1.7：修复PC版判定牌，新增缩放防抖动（但会模糊点）。
1.9.98.1.8：新增秃头皮肤使用开关（必须有秃头皮肤），双将默认为左右布局；调整缩放后造成的画面抖动，修正展示手牌过大的问题，修复势力名素材无法正确加载的问题。
1.9.98.1.9：修复：菜单栏显示偏移，武将选择框小；新增：人名字体自由设置，扩展联机可用。
1.9.98.1.10：修复：因联机引起的扩展加载错误。
*/