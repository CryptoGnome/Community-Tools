(function(){
	var util = {};

	//=========================================
	//===============  SETTINGS  ==============
	//=========================================

	util.graphMinutes = 15; //how many minutes of graph to show?
	util.extendGraphColumn = true; //if you set more than 10 minutes, set this to true.
	util.drawZeroLine = true; //display line at purchase price
	util.drawSellThreshold = true; //draw
	util.zeroLineColor = '#333';
	util.sellThresholdColor = '#ff5';
	util.graphLineColor = '#00f';

	// --- border percentages add padding to the top or bottom of the graph based on the height of the box.
	// --- the percentages are percent out of the original max to min spread.

	util.topOffsetPercentage = 2; // value between 60 and 2;
	util.bottomOffsetPercentage = 2; // value between 60 and 2;

	// --- the below settings are experimental... please let me know if they aren't working and you're using them.

	util.testHangWarning = true; // --- true to enable hang warnings; false to disable.
	util.hangThreshold = 10; // --- the number of ticks with an identical price that will cause a hang warning alert.
	util.percentHanging = .5; // --- percentage of items needed to appear to hang before a warning is given
	util.hangWarningMessage = '{n} Prices seem to be stagnant... did the bot hang?'; // --- hang message

	util.displayMarketCap = true;
	//=========================================
	//===========  END SETTINGS  ==============
	//=========================================

	util.coinMarketCapAPI = 'https://api.coinmarketcap.com/v1/global/';
	util.msPerDataFrame = 12900; //assumed average time
	util.topOffsetPercentage = Math.min( 60, Math.max( 2, util.topOffsetPercentage ));
	util.bottomOffsetPercentage = Math.min( 60, Math.max( 2, util.bottomOffsetPercentage ));
	util.graphFrames = ((util.graphMinutes || 5) * 6) >> 0;
	util.hangThreshold = Math.min( 999, Math.max( 1, util.hangThreshold ));
	util.percentHanging = Math.min( 1, Math.max( .001, util.percentHanging ));

	util.createHiDPICanvas = function( w, h, ratio, elementUse ) {
		if( !window.PIXEL_RATIO ) {
		    window.PIXEL_RATIO = ( function () {
				var ctx = document.createElement( "canvas" ).getContext( "2d" ),
				dpr = window.devicePixelRatio || 1,
				bsr = ctx.webkitBackingStorePixelRatio ||
						ctx.mozBackingStorePixelRatio ||
						ctx.msBackingStorePixelRatio ||
						ctx.oBackingStorePixelRatio ||
						ctx.backingStorePixelRatio || 1;

			    return dpr / bsr;
			})();
		}
	    if ( !ratio ) { ratio = window.PIXEL_RATIO; }
	    var can = ( Array.isArray( elementUse ) ? elementUse[0] : elementUse );
	    can.width = w * ratio;
	    can.height = h * ratio;
	    can.style.width = w + "px";
	    can.style.height = h + "px";
	    can.getContext( "2d" ).setTransform( ratio, 0, 0, ratio, 0, 0 );
	    return can;
	};

	util.graph = function( drawZero, drawProfit ) {
		this.stats = {
			totalSamples: util.graphFrames,
			profitLine: .01,
			data: []
		};
		this.stats.data = new Array( this.stats.totalSamples );
		this.stats.data = this.stats.data.join( ',' ).split( ',' ).map( function() { return null; });
		this.drawZero = drawZero;
		this.drawProfit = drawProfit;
	};

	util.graph.prototype.setSelector = function( selector ) {
		this.destination = selector[0];

		var width = selector.width();
		var height = selector.height();

		var canvas = $( '#myCanvas' );
		var self = this;
		if( canvas.length < 1 ) {
			$( 'body' ).append( '<div style="position:absolute;display:none;"><canvas id="myCanvas"></canvas></div>' );
			var canvas = $( '#myCanvas' );
			canvas = util.createHiDPICanvas( width, height, 1, canvas[0] );
			util.canvas = canvas;
			util.canvasContext = canvas.getContext( '2d' );
		}
		this.canvas = canvas;
	};

	util.graph.prototype.updateStats = function( value, sellTrigger ) {
		this.stats.data.push( value );
		this.stats.profitLine = sellTrigger;
		this.stats.data.shift(); // remove the oldest value
	};

	util.graph.prototype.drawStats = function() {
		var ctx = util.canvasContext;
		var size = this.destination.getBoundingClientRect();
		var totalRun = this.stats.totalSamples;

		if( util.extendGraphColumn && size.width < totalRun ) {
			this.destination.style['width'] = totalRun+'px';
			size.width = totalRun;
		}

		if( util.canvas == undefined || util.canvas.height == undefined ) {
			return;
		}

		if( size.width != util.canvas.width || size.height != util.canvas.height ) {
			util.canvas = util.createHiDPICanvas(size.width, size.height, 1, $( '#myCanvas' )[0] );
			util.canvasContext = util.canvas.getContext( '2d' );
		}
		ctx.clearRect( 0, 0, size.width, size.height );
		var first = true;
		var range = { min: 1e8, max: -1e8, size: 0 };
		this.stats.data.forEach( function( c ){
			if( c !== null ) {
				range.min = Math.min( c, range.min );
				range.max = Math.max( c, range.max );
			}
		});

		if( this.drawZero ) {
			range.min = Math.min( range.min, 0 );
			range.max = Math.max( range.max, 0 );
		}

		if( this.drawProfit ) {
			range.max = Math.max( range.max, this.stats.profitLine );
			range.min = Math.min( range.min, this.stats.profitLine );
		}

		range.size = range.max - range.min;

		range.max += range.size * (util.topOffsetPercentage / 100);
		range.min -= range.size * (util.bottomOffsetPercentage / 100);

		range.size = range.max - range.min;

		if( util.drawZeroLine && this.drawZero ) {
			var percent = Math.abs(range.max - 0) / range.size;
			ctx.strokeStyle = util.zeroLineColor;
			ctx.fillStyle = util.zeroLineColor;
			ctx.lineWidth = 1;
			ctx.font = '12px calibri';
			ctx.fillText( '0%', 0, (percent * size.height >> 0) + .5 );
			ctx.beginPath();
			ctx.moveTo( 20, (percent * size.height >> 0) + .5 );
			ctx.lineTo( size.width, (percent * size.height >> 0) + .5 );
			ctx.stroke();
		}

		if( util.drawSellThreshold && this.drawProfit ) {
			var percent = Math.abs(range.max - this.stats.profitLine) / range.size;
			ctx.strokeStyle = util.sellThresholdColor;
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo( 0, (percent * size.height >> 0) +.5 );
			ctx.lineTo( size.width, (percent * size.height >> 0) +.5 );
			ctx.stroke();
		}

		ctx.strokeStyle = util.graphLineColor;
		ctx.lineWidth = 1;
		ctx.beginPath();
		var first = true;
		var index = 0;
		for( var i = 0; i < totalRun; i++ ) {
			if( this.stats.data[i] != null && this.stats.data[i] != '' ) {
				if( first ) {
					first = false;
					ctx.moveTo( (index/totalRun * size.width) , (size.height - (( this.stats.data[i] - range.min ) / range.size * size.height )));
				} else {
					ctx.lineTo( (index/totalRun * size.width) , (size.height - (( this.stats.data[i] - range.min ) / range.size * size.height )));
				}
				index++;
			} /*else if( this.stats.data[i] == '' ) {
				if( !first ) {
					ctx.stroke();
					first = true;
				}
				index++;
			}*/
		}
		ctx.stroke();
		var res = 'url(' + util.canvas.toDataURL() + ')';

		this.destination.style['backgroundImage'] = res;
		this.destination.style['backgroundRepeat'] = 'no-repeat';

	};

	var containers = {
		dca: {
			dataName: 'dcaLogData',
			name: 'dtDcaLogs',
			statName: 'profit',
			childDestination: 'profit',
			drawZero: true,
			drawProfit: true,
			hangCheck: true,
			pairAppend: ''
		},
		pairs: {
			dataName: 'gainLogData',
			name: 'dtPairsLogs',
			statName: 'profit',
			childDestination: 'profit',
			drawZero: true,
			drawProfit: true,
			hangCheck: true,
			pairAppend: ''
		},
		pbl: {
			dataName: 'bbBuyLogData',
			name: 'dtPossibleBuysLog',
			statName: 'currentValue',
			childDestination: 'current-value',
			drawZero: false,
			drawProfit: false,
			hangCheck: true,
			pairAppend: '_PBL'
		},
		dust: {
			dataName: 'dustLogData',
			name: 'dtDustLogs',
			statName: 'profit',
			childDestination: 'profit',
			drawZero: true,
			drawProfit: false,
			hangCheck: false,
			pairAppend: '_DUST'
		},
		pending: {
			dataName: 'pendingLogData',
			name: 'dtPendingLogs',
			statName: 'profit',
			childDestination: 'profit',
			drawZero: true,
			drawProfit: true,
			hangCheck: false,
			pairAppend: '_PEND'
		}
	};

	var pairData = {};

	var freshPairCutoff = 60000;
	function tick( data ) {
		if( util.displayMarketCap ) {
			displayMarketCap();
		}
		var now = Date.now();

		var hangStats = {signaled: 0, max: 0};

		var keys = Object.keys( pairData );
		for( var i = 0; i < keys.length; i++ ) {
			if( now - pairData[keys[i]].lastTick > freshPairCutoff ) {
				delete pairData[keys[i]];
			}
		}

		var dataTypes = Object.keys( containers );
		for( var i = 0; i < dataTypes.length; i++ ) {
			var source = data[containers[dataTypes[i]].dataName];
			for( var j = 0; j < source.length; j++ ) {
				var pair = source[j].market + containers[dataTypes[i]].pairAppend;
				if( pairData[pair] == undefined ) {
					pairData[pair] = {
						lastTick: now,
						graph: new util.graph( containers[dataTypes[i]].drawZero, containers[dataTypes[i]].drawProfit )
					};
					var cachedData = getCacheData( pair );
					for( var z = 0; z < cachedData.length; z++ ) {
						pairData[pair].graph.updateStats( cachedData[z], 0 );
					}
				} else {
					pairData[pair].lastTick = now;
				}
				pairData[pair].graph.updateStats(
					source[j][containers[dataTypes[i]].statName] / 100, //current profit
					(source[j].triggerValue || 0) / 100 //sell threshold
				);
				setCacheData( pair, pairData[pair].graph.stats.data, pairData[pair].lastTick );
				if( util.testHangWarning && containers[dataTypes[i]].hangCheck ) {
					hangStats.max++;
					var result = hangCheck( pairData[pair] );
					if( result >= util.hangThreshold ) {
						console.log( pair + ' is signaling a hang.');
						hangStats.signaled++;
					}
				}
			}
		}

		if( util.testHangWarning && hangStats.max > 0 && hangStats.signaled / hangStats.max >= util.percentHanging ) {
			alert( util.hangWarningMessage.replace( '{n}', hangStats.signaled ));
		}
	}

	function hangCheck( pair ) {
		var start = pair.graph.stats.totalSamples - 1;
		var runs = {};
		var lastValue = null;
		var run = 0;
		for( var i = pair.graph.stats.totalSamples-1; i > -1; i-- ) {
			var curValue = pair.graph.stats.data[i];
			if( curValue != null && curValue != '' && lastValue == null ) {
				lastValue = curValue;

				run++;
			} else if( curValue == lastValue ) {
				run++;
			} else if( lastValue != null ) {
				return run;
			}
		}
		return 0;
	}

	function render() {

		var renderTypes = Object.keys( containers );
		for( var i = 0; i < renderTypes.length; i++ ) {
			var curContainer = containers[renderTypes[i]];
			var curParent = $( '#' + curContainer.name );
			if( curParent.width() != 100 ) {
				var curParent = $( '#' + curContainer.name + ' tbody tr' );
				for( var j = 0; j < curParent.length; j++ ) {
					var curType = $( curParent[j] ).children( '.market' ).children( 'a' ).html();
					var cur = pairData[curType+curContainer.pairAppend];
					if( cur !== undefined ) {
						//we can render it!
						cur.graph.setSelector( $( curParent[j] ).children( '.' + curContainer.childDestination ));
						cur.graph.drawStats();
					}
				}
				return; // --- we rendered this one, dont render any others.
			}
		}
	}

	function setCacheData( key, values, lastTick ) {
		var graphing = localStorage.getItem('graphing');
		if( graphing == null ) {
			graphing = {};
		} else {
			graphing = JSON.parse( graphing );
		}

		var store = [];
		for( var i = 0; i < values.length; i++ ) {
			if( values[i] == null || values[i] == '' ) {
				// do nothing
			} else {
				store.push(parseFloat(values[i].toFixed(4)));
			}
		}

		graphing[key] = {time: lastTick, values: store};

		localStorage.setItem( 'graphing', JSON.stringify( graphing ));
	}

	function getCacheData( key ) {
		var graphing = localStorage.getItem('graphing');
		if( graphing == null ) {
			graphing = {};
		} else {
			graphing = JSON.parse( graphing );
		}

		if( graphing[key] != undefined ) {
			var elapsedTime = Date.now() - graphing[key].time;
			var ticksElapsed = (elapsedTime / util.msPerDataFrame) >> 0;
			var results = graphing[key].values;
			for( var i = 0; i < ticksElapsed; i++ ) {
				results.push(null);
			}
			return results;
		}
		return [];
	}



	function displayMarketCap() {
		$.get( util.coinMarketCapAPI, function( data ) {
			if( data && data.total_market_cap_usd ) {
				var value = data.total_market_cap_usd.toLocaleString( 'en', { useGrouping: true });
				var delta = 0;
				var exists = $( '#nMCAPTotal' );
				if( exists.length ) {
					exists.attr( 'title', value ).html( value );
				} else {
					$('.monitor-summary').append('<li class="list-inline-item tdbitcoin font-16 ticker-text"><label id="nMCAP" data-toggle="tooltip" data-placement="bottom" title="Total Crypto MarketCap" data-original-title="Total Crypto MarketCap">MCAP</label>: <span id="nMCAPTotal" title="'+value+'">'+value+'</span></li>');
					// --- coinmarketcap does not currently return the 24hr % change, so save this for when it does.
					//$('.monitor-summary').append('<li class="list-inline-item tdbitcoin font-16 ticker-text"><label id="nMarket" data-toggle="tooltip" data-placement="bottom" title="Total Crypto MarketCap" data-original-title="Total Crypto MarketCap">MCAP</label>: <span id="nMarketPrice" title="'+value+'">'+value+'</span>&nbsp;<span id="nMarketPercChange" title="'+delta+' %" class="text-danger">('+delta+' %)</span></li>');
				}
			}
		});
	}

	// listen to AJAX requests:

	function addXMLRequestCallback( callback ) {
	    var oldSend, i;
	    if( XMLHttpRequest.callbacks ) {
	        // we've already overridden send() so just add the callback
	        XMLHttpRequest.callbacks.push( callback );
	    } else {
	        // create a callback queue
	        XMLHttpRequest.callbacks = [callback];
	        // store the native send()
	        oldSend = XMLHttpRequest.prototype.send;
	        // override the native send()
	        XMLHttpRequest.prototype.send = function() {

	            for( i = 0; i < XMLHttpRequest.callbacks.length; i++ ) {
	                XMLHttpRequest.callbacks[i]( this );
	            }
	            // call the native send()
	            oldSend.apply( this, arguments );
	        };
	    }
	}

	addXMLRequestCallback( function( xhr ) {
		xhr.onreadystatechange = function() {
			if( xhr.readyState == 4 && xhr.status == 200 ) {
			    if( xhr.responseURL.indexOf( 'data' ) > -1 ) {
			    	var data = JSON.parse( xhr.response );
			    	tick( data );
			    }
			}
		};
	});

	$( "body" ).on( 'DOMSubtreeModified', "#dvLastUpdatedOn", function() {
		render();
	});
	$( ".dca-log,.dust-log,.pairs-log,.possible-buys-log,.pending-log" ).on( "click", function(){
		setTimeout( function(){ render(); }, 100 );
	});
})();
