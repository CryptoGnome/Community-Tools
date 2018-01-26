//Graphing-Tracker.js
//Graphing-Tracker.js
//Graphing-Tracker.js
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
	//=========================================
	//===========  END SETTINGS  ==============
	//=========================================

	util.topOffsetPercentage = Math.min( 60, Math.max( 2, util.topOffsetPercentage ));
	util.bottomOffsetPercentage = Math.min( 60, Math.max( 2, util.bottomOffsetPercentage ));
	util.graphFrames = ((util.graphMinutes || 5) * 6) >> 0;

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
		var size = this.destination.getBoundingClientRect()
		var totalRun = this.stats.totalSamples;
		if( totalRun < 2 ) {
			console.warn('please set valid number for util.graphMinutes (more than .17)');
			return;
		}

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
			ctx.fillText( '0%', 0, percent * size.height >> 0 );
			ctx.beginPath();
			ctx.moveTo( 20, percent * size.height );
			ctx.lineTo( size.width, percent * size.height >> 0 );
			ctx.stroke();
		}

		if( util.drawSellThreshold && this.drawProfit ) {
			var percent = Math.abs(range.max - this.stats.profitLine) / range.size;
			ctx.strokeStyle = util.sellThresholdColor;
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo( 0, percent * size.height );
			ctx.lineTo( size.width, percent * size.height );
			ctx.stroke();
		}

		ctx.strokeStyle = util.graphLineColor;
		ctx.lineWidth = 1;
		ctx.beginPath();
		var first = true;
		var index = 0;
		for( var i = 0; i < totalRun; i++ ) {
			if( this.stats.data[i] != null ) {
				if( first ) {
					first = false;
					ctx.moveTo( (index/(totalRun-1) * size.width) >> 0, (size.height - (( this.stats.data[i] - range.min ) / range.size * size.height )) >> 0);
				} else {
					ctx.lineTo( (index/(totalRun-1) * size.width) >> 0, (size.height - (( this.stats.data[i] - range.min ) / range.size * size.height )) >> 0);
				}
				index++;
			}
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
			pairAppend: ''
		},
		pairs: {
			dataName: 'gainLogData',
			name: 'dtPairsLogs',
			statName: 'profit',
			childDestination: 'profit',
			drawZero: true,
			drawProfit: true,
			pairAppend: ''
		},
		pbl: {
			dataName: 'bbBuyLogData',
			name: 'dtPossibleBuysLog',
			statName: 'currentValue',
			childDestination: 'current-value',
			drawZero: false,
			drawProfit: false,
			pairAppend: '_PBL'
		},
		dust: {
			dataName: 'dustLogData',
			name: 'dtDustLogs',
			statName: 'profit',
			childDestination: 'profit',
			drawZero: true,
			drawProfit: false,
			pairAppend: '_DUST'
		},
		pending: {
			dataName: 'pendingLogData',
			name: 'dtPendingLogs',
			statName: 'profit',
			childDestination: 'profit',
			drawZero: true,
			drawProfit: true,
			pairAppend: '_PEND'
		}
	};

	var pairData = {};

	var freshPairCutoff = 60000;
	function tick( data ) {
		var now = Date.now();
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
				} else {
					pairData[pair].lastTick = now;
				}
				pairData[pair].graph.updateStats(
					source[j][containers[dataTypes[i]].statName] / 100, //current profit
					(source[j].triggerValue || 0) / 100 //sell threshold
				);
			}
		}
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
	        }
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


//Binance-Advanced-Exchange.js
//Binance-Advanced-Exchange.js
//Binance-Advanced-Exchange.js
function binanceAdvancedExchange() {
  $("table td.market.all a").each(function() {
    var value = $(this).attr("href");
    var queryParams = new URLSearchParams($(this).prop("search"));
    var symbolParam = queryParams.get("symbol");
    var exchanges = ["BTC", "ETH", "BNB", "USDT"];
    var newSymbol = "";

    $.each(exchanges, (function(i, exchange) {
      var parts = symbolParam.split(exchange);
      
      if(parts[1] === "") {
        newSymbol = parts[0].replace("_", "") + "_" + exchange;
        return false;
      }
    }));

    queryParams.set("symbol", newSymbol);
    
    $(this).attr("href", value.replace("www.binance.com/trade.html","www.binance.com/tradeDetail.html"));
    $(this).prop("search", "?" + queryParams.toString());
  });
}

$("body").on('DOMSubtreeModified', "#dvLastUpdatedOn", function() {
  binanceAdvancedExchange();
});
$(".dca-log, .pairs-log, .dust-log, .sales-log, .pending-log, .possible-buys-log").on("click", function() {
  setTimeout(function(){ binanceAdvancedExchange(); }, 100 );
});

//Estimated-Percent-Gain.js
//Estimated-Percent-Gain.js
//Estimated-Percent-Gain.js
function estimatePercent() {
    var todayPercentCalc = ($("#mTodayProfit").text()/$("#mTotalCurrentVal").text()*100).toFixed(2);
    var todayPercent = todayPercentCalc + '%';
    $(".usd-value").css({'margin-bottom':'0px'});
    if ($("#mTodayProfit").text() !== "")
    { 
        if ($("#mTodayProfitPCTValue").text() === "") {
        $("span.market-price-calculations.text-profittd").append('<label class="usd-value"><span class="full-text">Estimated Percent Gain&nbsp;</span><span class="short-text">Est. % Gain&nbsp;</span></label><span class="mb-0  main-text" id="mTodayProfitPCTValue" title="'+todayPercent+'">'+todayPercent+'</span>');
        } else {
            $("#mTodayProfitPCTValue").attr("title",todayPercent);
            $("#mTodayProfitPCTValue").text(todayPercent);
        }
    }
}

estimatePercent();
$("body").on('DOMSubtreeModified', "#mTodayProfitUSDValue", function() {
    estimatePercent();
});


//USD-Estimate.js
//USD-Estimate.js
//USD-Estimate.js
function estimate() {
	var btc1 = $('#nMarketPrice').attr("title");
	$("#dtDcaLogs th.total-cost").text('Estimated Value');
	$('.summary-table').removeClass('col-md-3').removeClass('col-md-4').addClass('col-md-4');
	//DCA
	if ($('#dtDcaLogs thead').length > 0) {
		if ($('#dtDcaLogs thead .est-usd').length < 1) {
			$('#dtDcaLogs thead tr').append('<th class="text-right est-usd all sorting" rowspan="1" colspan="1" style="width: 92px;">Estimated Value</th>');
		};
		$('#dtDcaLogs tbody tr').each(function() {
			$(this).find('.est-usd').remove();
			$(this).append('<td class="text-right est-usd all"></td>');
			var num1 = $(this).find('.current-value').html().split("<br>")[1];
			var num2 = $(this).find('.current-value').html().split("<br>")[0];
			var calc = num2 - num1;
			var btc = calc.toFixed(8);
			var usd = btc * btc1;
			var difference = usd.toFixed(2);
			var sta = num2 * btc1;
			var total = sta.toFixed(2);
			if (difference > 0) {
				$(this).find('.est-usd').html('<span style="color:#05b16f;"><i style="color:#98a6ad;font-style:normal;">$' + total + '</i><br>$' + difference + '</span>');
			} else {
				$(this).find('.est-usd').html('<span style="color:#d85353;"><i style="color:#98a6ad;font-style:normal;">$' + total + '</i><br>$' + difference + '</span>');
			}
		});
		$("#dcLogDifference").find('b').remove();
		$("#dcLogTotalCurrentVal").find('b').remove();
		$("#dcLogRealCost").find('b').remove();
		var val = $('#dcLogTotalCurrentVal').text();
		var bou = $('#dcLogRealCost').text();
		var calc = val - bou;
		var btc = calc.toFixed(8);
		var est = bou * btc1;
		var bought = est.toFixed(2);
		var usd = btc * btc1;
		var difference = usd.toFixed(2);
		var sta = val * btc1;
		var total = sta.toFixed(2);
		$("#dcLogDifference").prepend('<b style="color:#98a6ad;font-weight:400;margin-right:5px">($' + difference + ')</b>');
		$("#dcLogTotalCurrentVal").prepend('<b style="color:#98a6ad;font-weight:400;margin-right:8px">($' + total + ')</b>');
		$("#dcLogRealCost").prepend('<b style="color:#98a6ad;font-weight:400;margin-right:8px">($' + bought + ')</b>');
	}
	//Pairs
	if ($('#dtPairsLogs thead').length > 0) {
		if ($('#dtPairsLogs thead .est-usd').length < 1) {
			$('#dtPairsLogs thead tr').append('<th class="text-right est-usd all sorting" rowspan="1" colspan="1" style="width: 92px;">Estimated Value</th>');
		}
		$('#dtPairsLogs tbody tr').each(function() {
			$(this).find('.est-usd').remove();
			$(this).append('<td class=" text-right est-usd all"></td>');
			var num1 = $(this).find('.bought-cost').text();
			var num2 = $(this).find('.current-value').text();
			var calc = num2 - num1;
			var btc = calc.toFixed(8);
			var usd = btc * btc1;
			var difference = usd.toFixed(2);
			var sta = num2 * btc1;
			var total = sta.toFixed(2);
			if (difference > 0) {
				$(this).find('.est-usd').html('<span style="color:#05b16f;"><i style="color:#98a6ad;font-style:normal;">$' + total + '</i><br>$' + difference + '</span>');
			} else {
				$(this).find('.est-usd').html('<span style="color:#d85353;"><i style="color:#98a6ad;font-style:normal;">$' + total + '</i><br>$' + difference + '</span>');
			}
		});
		$("#pairsLogDifference").find('b').remove();
		$("#pairsLogTotalCurrentVal").find('b').remove();
		$("#pairsLogRealCost").find('b').remove();
		var val = $('#pairsLogTotalCurrentVal').text();
		var bou = $('#pairsLogRealCost').text();
		var calc = val - bou;
		var btc = calc.toFixed(8);
		var est = bou * btc1;
		var bought = est.toFixed(2);
		var usd = btc * btc1;
		var difference = usd.toFixed(2);
		var sta = val * btc1;
		var total = sta.toFixed(2);
		$("#pairsLogDifference").prepend('<b style="color:#98a6ad;font-weight:400;margin-right:5px">($' + difference + ')</b>');
		$("#pairsLogTotalCurrentVal").prepend('<b style="color:#98a6ad;font-weight:400;margin-right:8px">($' + total + ')</b>');
		$("#pairsLogRealCost").prepend('<b style="color:#98a6ad;font-weight:400;margin-right:8px">($' + bought + ')</b>');
	}
	//Dust
	if ($('#dtDustLogs thead').length > 0) {
		if ($('#dtDustLogs thead .est-usd').length < 1) {
			$('#dtDustLogs thead tr').append('<th class="text-right est-usd all sorting" rowspan="1" colspan="1" style="width: 92px;">Estimated Value</th>');
		}
		$('#dtDustLogs tbody tr').each(function() {
			$(this).find('.est-usd').remove();
			$(this).append('<td class=" text-right est-usd all"></td>');
			var num1 = $(this).find('.bought-cost').text();
			var num2 = $(this).find('.current-value').text();
			var calc = num2 - num1;
			var btc = calc.toFixed(8);
			var usd = btc * btc1;
			var difference = usd.toFixed(2);
			var sta = num2 * btc1;
			var total = sta.toFixed(2);
			if (difference > 0) {
				$(this).find('.est-usd').html('<span style="color:#05b16f;"><i style="color:#98a6ad;font-style:normal;">$' + total + '</i><br>$' + difference + '</span>');
			} else {
				$(this).find('.est-usd').html('<span style="color:#d85353;"><i style="color:#98a6ad;font-style:normal;">$' + total + '</i><br>$' + difference + '</span>');
			}
		});
		$("#dustLogDifference").find('b').remove();
		$("#dustLogTotalCurrentVal").find('b').remove();
		$("#dustLogRealCost").find('b').remove();
		var val = $('#dustLogTotalCurrentVal').text();
		var bou = $('#dustLogRealCost').text();
		var calc = val - bou;
		var btc = calc.toFixed(8);
		var est = bou * btc1;
		var bought = est.toFixed(2);
		var usd = btc * btc1;
		var difference = usd.toFixed(2);
		var sta = val * btc1;
		var total = sta.toFixed(2);
		$("#dustLogDifference").prepend('<b style="color:#98a6ad;font-weight:400;margin-right:5px">($' + difference + ')</b>');
		$("#dustLogTotalCurrentVal").prepend('<b style="color:#98a6ad;font-weight:400;margin-right:8px">($' + total + ')</b>');
		$("#dustLogRealCost").prepend('<b style="color:#98a6ad;font-weight:400;margin-right:8px">($' + bought + ')</b>');
	}
	//Sales
	if ($('#dtSalesLog thead').length > 0) {
		$("#salesLogDifference").find('b').remove();
		$("#salesLogTotalCurrentVal").find('b').remove();
		$("#salesLogBoughtCost").find('b').remove();
		var val = $('#salesLogTotalCurrentVal').text();
		var bou = $('#salesLogBoughtCost').text();
		var calc = val - bou;
		var btc = calc.toFixed(8);
		var est = bou * btc1;
		var bought = est.toFixed(2);
		var usd = btc * btc1;
		var difference = usd.toFixed(2);
		var sta = val * btc1;
		var total = sta.toFixed(2);
		$("#salesLogDifference").prepend('<b style="color:#98a6ad;font-weight:400;margin-right:5px">($' + difference + ')</b>');
		$("#salesLogTotalCurrentVal").prepend('<b style="color:#98a6ad;font-weight:400;margin-right:8px">($' + total + ')</b>');
		$("#salesLogBoughtCost").prepend('<b style="color:#98a6ad;font-weight:400;margin-right:8px">($' + bought + ')</b>');
	}	
	//Balance
	$('.ticker-text').css('position','relative');
	$('#nBalanceVal span').remove();
	var btc = $('#nBalanceVal').attr("title");
	var usd = btc * btc1;
	var total = usd.toFixed(2);
	$('#nBalanceVal').append('<span style="display:inline-block;position:absolute;bottom:-8px;right:0;font-size: 10px">($'+total+')</span>');
	//Current
	$('#nTotalCurrentVal span').remove();
	var btc = $('#nTotalCurrentVal').attr("title");
	var usd = btc * btc1;
	var total = usd.toFixed(2);
	$('#nTotalCurrentVal').append('<span style="display:inline-block;position:absolute;bottom:-8px;right:0;font-size: 10px">($'+total+')</span>');
	//Pending
	$('#nTotalPendingVal span').remove();
	var btc = $('#nTotalPendingVal').attr("title");
	var usd = btc * btc1;
	var total = usd.toFixed(2);
	$('#nTotalPendingVal').append('<span style="display:inline-block;position:absolute;bottom:-8px;right:0;font-size: 10px">($'+total+')</span>');
}
$("body").on('DOMSubtreeModified', "#dvLastUpdatedOn", function() {
	estimate();
});
$(".dca-log, .pairs-log, .dust-log, .sales-log").on("click", function() {
	setTimeout(function() {
		estimate();
	}, 100);
});
$( document ).ready(function() {
	setTimeout(function() {
		estimate();
	}, 100);
});
