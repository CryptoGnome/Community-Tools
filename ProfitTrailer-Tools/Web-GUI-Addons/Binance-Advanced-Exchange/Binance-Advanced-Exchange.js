function binanceAdvancedExchange() {
  $("table td.market.all a").each(function() {
    var value = $(this).attr('href');
    $(this).attr('href', value.replace('www.binance.com/trade.html','www.binance.com/tradeDetail.html'));
  });
}

$("body").on('DOMSubtreeModified', "#dvLastUpdatedOn", function() {
  binanceAdvancedExchange();
});
$(".dca-log, .pairs-log, .dust-log, .sales-log").on("click", function() {
  binanceAdvancedExchange();
});
