(function() {
    'use strict';
    $( document ).ready(function() {

            //Add a new tile for net income
    var tile =' <div class="text-right">\
              <h3 class=" m-t-10 text-profittd main-text">\
                <b class="counter" id="mTodayNetProfit" title=""></b>\
                <span class="market m-l-5">ETH</span>\
              </h3>\
              <p class="mb-0 text-profittd main-text">Net Profit Today</p>\
              <span class="market-price-calculations text-profittd">\
                <label class="usd-value">\
                  <span class="full-text">Estimated USD Value</span>\
                  <span class="short-text">Est. USD Value</span>\
                </label>\
                <span class="mb-0  main-text" id="mTodayNetProfitUSDValue" title=""></span>\
              </span>\
            </div>\
            <div class="clearfix"></div>\
            ';
    $('#mTodayProfit').parent().parent().parent().append(tile);
        //Get data
        function refresh()
        {
        $.getJSON( "monitoring/data?_="+ (new Date().getTime()), function( data ) {
  var ETH_USD =data.ETHUSDTPrice;
  var profitToday = data.totalProfitToday;
  var todayLoss = getTodayBags(data);
  var todayNetProfit = parseFloat(profitToday) - todayLoss;
  var todayNetUSD = parseFloat($('#mTodayProfitUSDValue').text())*(todayNetProfit/profitToday);
        //console.log('Today profit in coin:'+ profitToday);
        //console.log('Today loss in coin:'+ todayLoss);
        //console.log('Today net profit in coin:'+ todayNetProfit.toFixed(8));
        //console.log('Today net profit in usd:'+todayNetUSD.toFixed(2));
  $('#mTodayNetProfit').text(todayNetProfit.toFixed(8));
  $('#mTodayNetProfitUSDValue').text(todayNetUSD.toFixed(2));
});
        }
        setInterval( refresh,5000);
   });

   function isToday(date)
   {
       var tdate = new Date(date.date.year,date.date.month-1,date.date.day, date.time.hour, date.time.minute, date.time.second,0);

       var now = new Date();
       tdate = new Date(tdate.getTime()-now.getTimezoneOffset()*60*1000);
       //console.log(now.getFullYear()+'/'+now.getMonth()+'/'+now.getDate());
       return now.getFullYear()==tdate.getFullYear()&&now.getMonth()==tdate.getMonth()&&now.getDate()==tdate.getDate();
    }
function getTodayBags(data){
    var sum = 0.0;
    //Add Pairs Log
    for(i=0; i<data.gainLogData.length; i++)
    {
        var coin = data.gainLogData[i];
        if(isToday(coin.averageCalculator.firstBoughtDate))
        {
        sum = sum + (coin.averageCalculator.totalCost - coin.currentPrice * coin.averageCalculator.totalAmount);
          //  console.log(coin.averageCalculator.firstBoughtDate.date.year+'/'+coin.averageCalculator.firstBoughtDate.date.month+'/'+coin.averageCalculator.firstBoughtDate.date.day);
          //console.log(coin.market+" today loss  is "+ (coin.currentPrice * coin.averageCalculator.totalAmount - coin.averageCalculator.totalCost));
        }
    }

    //Add DCA Log
    for(i=0; i<data.dcaLogData.length; i++)
    {
        var coin = data.dcaLogData[i];
        if(isToday(coin.averageCalculator.firstBoughtDate))
        {
        sum = sum + (coin.averageCalculator.totalCost - coin.currentPrice * coin.averageCalculator.totalAmount);
        //console.log(coin.market+" today loss is "+ (coin.currentPrice * coin.averageCalculator.totalAmount - coin.averageCalculator.totalCost));
        }
    }
    //console.log('Total loss：'+sum);
    return sum;
}
})();
