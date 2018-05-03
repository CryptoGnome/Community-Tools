function AdvancedExchange() {
// Modifies Binance coin links to Advanced view, and adds icon link to TradingView for ProfitTrailer v2 GUI
  $("table td.market a").each(function() {
    var value = $(this).attr("href");
    var exchanges = ["BTC", "ETH", "BNB", "USDT"];
    var newSymbol = "";
    var exchange = "BINANCE";
    var queryParams = new URLSearchParams($(this).prop("search"));

    var symbolParam = queryParams.get("symbol");
    if (symbolParam === null) { // Try to parse for Bittrex
      exchange = "BITTREX";
      symbolParam = queryParams.get("MarketName");
      symbolParam = symbolParam.split("-").reverse().join("");
    }

    $.each(exchanges, (function(i, exchange) {
      var parts = symbolParam.split(exchange);
      
      if(parts[1] === "") {
        newSymbol = parts[0].replace("_", "") + "_" + exchange;
        return false;
      }
    }));

    $(this).siblings(".trading-view").remove();
    $(this).unwrap("span");
    $(this).wrap("<span class=\"market-wrapper\" style=\"white-space:nowrap;\"></span>");
    $(this).parent().append("<span class=\"trading-view\" style=\"margin-left:5px;\"><a href=\"https://www.tradingview.com/chart/?symbol=" + exchange + ":" + symbolParam.replace("_", "") + "\" target=\"_blank\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"25\"viewBox=\"0 0 33 19\"><path fill=\"#3BB3E4\" d=\"M29.032 7.382a5.47 5.47 0 0 1 .963 2.872A4.502 4.502 0 0 1 28.5 19H6a5.98 5.98 0 0 1-4.222-1.737l9.546-7.556c.35.187.75.293 1.176.293a2.49 2.49 0 0 0 1.066-.238l4.55 3.981a2.5 2.5 0 1 0 4.711-.157l6.205-6.204zm-1.414-1.414l-6.204 6.204A2.494 2.494 0 0 0 20.5 12a2.49 2.49 0 0 0-1.066.238l-4.55-3.981a2.5 2.5 0 1 0-4.801-.118L.608 15.638A6 6 0 0 1 6.061 7a8.001 8.001 0 0 1 15.625-1.227A5.474 5.474 0 0 1 24.5 5c1.157 0 2.231.358 3.118.968z\"></path></svg></a></span>");

    queryParams.set("symbol", newSymbol);
    
    $(this).attr("href", value.replace("www.binance.com/trade.html","www.binance.com/tradeDetail.html"));
    $(this).prop("search", "?" + queryParams.toString());
  });
}

$("body").on('DOMSubtreeModified', "#dvLastUpdatedOn", function() {
  AdvancedExchange();
});
$(".has-submenu").on("click", function() {
  setTimeout(function(){ AdvancedExchange(); }, 100 );
});

//Estimated USD difference for Profit Trailer 2.0
//Created by ProfitTanker#0156 - If you need any help send me a DM.
function estimate() {
	//Pairs
	if ($('#dtPairsLogs thead').length > 0) {
		$('#dtPairsLogs tbody tr').each(function() {
			$(this).find('b').remove();
			var difference = ($(this).find('td.bought-cost:last .current-value').text().replace("$", "").replace(",", "") - $(this).find('td.bought-cost:last .bought-cost').text().replace("$", "").replace(",", "")).toFixed(2);
			var difference2 = ($(this).find('td.current-value.blue-color:first .current-value').text().replace("$", "").replace(",", "") - $(this).find('td.current-value.blue-color:first .bought-cost').text().replace("$", "").replace(",", "")).toFixed(8);
			if (difference2 > 0) {
				$(this).find('td.bought-cost:last .bought-cost').append('<b style="color:#05b16f;border-top: 1px solid;"><br>$' + difference.toLocaleString() + '</b>');
				$(this).find('td.current-value.blue-color:first .bought-cost').append('<b style="color:#05b16f;border-top: 1px solid;"><br>' + difference2 + '</b>');
			} else {
				$(this).find('td.bought-cost:last .bought-cost').append('<b style="color:#d85353;border-top: 1px solid;"><br>$' + difference.toLocaleString() + '</b>');
				$(this).find('td.current-value.blue-color:first .bought-cost').append('<b style="color:#d85353;border-top: 1px solid;"><br>' + difference2 + '</b>');
			}
		});
	}
	//DCA
	if ($('#dtDcaLogs thead').length > 0) {
		$('#dtDcaLogs tbody tr').each(function() {
			$(this).find('b').remove();
			var difference = ($(this).find('td.current-value:last .current-value').text().replace("$", "").replace(",", "") - $(this).find('td.current-value:last .bought-cost').text().replace("$", "").replace(",", "")).toFixed(2);
			var difference2 = ($(this).find('td.current-value.blue-color:first .current-value').text().replace("$", "").replace(",", "") - $(this).find('td.current-value.blue-color:first .bought-cost').text().replace("$", "").replace(",", "")).toFixed(8);
			if (difference2 > 0) {
				$(this).find('td.current-value:last').append('<b style="color:#05b16f;border-top: 1px solid;"><br>$' + difference.toLocaleString() + '</b>');
				$(this).find('td.current-value.blue-color:first').append('<b style="color:#05b16f;border-top: 1px solid;"><br>' + difference2 + '</b>');
			} else {
				$(this).find('td.current-value:last').append('<b style="color:#d85353;border-top: 1px solid;"><br>$' + difference.toLocaleString() + '</b>');
				$(this).find('td.current-value.blue-color:first').append('<b style="color:#d85353;border-top: 1px solid;"><br>' + difference2 + '</b>');
			}
		});
	}
	//Dust
	if ($('#dtDustLogs thead').length > 0) {
		$('#dtDustLogs tbody tr').each(function() {
			$(this).find('b').remove();
			var difference = ($(this).find('td.bought-cost .current-value').text().replace("$", "").replace(",", "") - $(this).find('td.bought-cost .bought-cost').text().replace("$", "").replace(",", "")).toFixed(2);
			var difference2 = ($(this).find('td.blue-color.current-value:first .current-value').text().replace("$", "").replace(",", "") - $(this).find('td.blue-color.current-value:first .bought-cost').text().replace("$", "").replace(",", "")).toFixed(8);
			if (difference2 > 0) {
				$(this).find('td.bought-cost .bought-cost').append('<b style="color:#05b16f;border-top: 1px solid;"><br>$' + difference.toLocaleString() + '</b>');
				$(this).find('td.blue-color.current-value:first').append('<b style="color:#05b16f;border-top: 1px solid;"><br>' + difference2 + '</b>');
			} else {
				$(this).find('td.bought-cost .bought-cost').append('<b style="color:#d85353;border-top: 1px solid;"><br>$' + difference.toLocaleString() + '</b>');
				$(this).find('td.blue-color.current-value:first').append('<b style="color:#d85353;border-top: 1px solid;"><br>' + difference2 + '</b>');
			}
		});
	}
}
$("body").on('DOMSubtreeModified', "#dvLastUpdatedOn", function() {
	estimate();
});
$('#topNav a').on("click", function() {
	setTimeout(function() {
		estimate();
	}, 100);
});