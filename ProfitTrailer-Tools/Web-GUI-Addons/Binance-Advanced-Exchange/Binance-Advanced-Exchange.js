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
