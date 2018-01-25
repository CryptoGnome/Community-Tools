var currency = "btc"; //btc or eth

function estimate() {
	$("#dtDcaLogs th.total-cost").text('Estimated Value');
	$('.summary-table').removeClass('col-md-3').removeClass('col-md-4').addClass('col-md-4');
	$.getJSON("https://www.cryptonator.com/api/ticker/" + currency + "-usd", function(data) {
		var btc1 = data.ticker.price;
		//DCA
		if (!$('#dtDcaLogs thead .est-usd').length) {
			$('#dtDcaLogs thead tr').append('<th class="text-right est-usd all sorting" rowspan="1" colspan="1" style="width: 92px;">Estimated Value</th>');
		}
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
		//Pairs
		if (!$('#dtPairsLogs thead .est-usd').length) {
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
		//Dust
		if (!$('#dtDustLogs thead .est-usd').length) {
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
		//Sales
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
	});
}
$("body").on('DOMSubtreeModified', "#dvLastUpdatedOn", function() {
	estimate();
});
$(".dca-log, .pairs-log, .dust-log, .sales-log").on("click", function() {
	estimate();
});
