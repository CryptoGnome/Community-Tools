function estimateYesterdayPercent() {
    var previousTCV = $("#mTotalCurrentVal").text() - $("#mTodayProfit").text();
    var prevPercentCalc = ($("#mYesterdayProfit").text()/previousTCV*100).toFixed(2);
    var prevPercent = prevPercentCalc + '%';
    if ($("#mYesterdayProfit").text() !== "")
    { 
        if ($("#mYesterdayProfitPCTValue").text() === "") {
        $("span.market-price-calculations.text-profityd").append('<br><label class="usd-value"><span class="full-text">Estimated Percent Gain&nbsp;</span><span class="short-text">Est. % Gain&nbsp;</span></label><span class="mb-0  main-text" id="mYesterdayProfitPCTValue" title="'+prevPercent+'">'+prevPercent+'</span>');
        } else {
            $("#mYesterdayProfitPCTValue").attr("title",prevPercent);
            $("#mYesterdayProfitPCTValue").text(prevPercent);
        }
    }
}

function estimatePercent() {
    var todayPercentCalc = ($("#mTodayProfit").text()/$("#mTotalCurrentVal").text()*100).toFixed(2);
    var todayPercent = todayPercentCalc + '%';
    $(".usd-value").css({'margin-bottom':'0px'});
    if ($("#mTodayProfit").text() !== "")
    { 
        if ($("#mTodayProfitPCTValue").text() === "") {
        $("span.market-price-calculations.text-profittd").append('<br><label class="usd-value"><span class="full-text">Estimated Percent Gain&nbsp;</span><span class="short-text">Est. % Gain&nbsp;</span></label><span class="mb-0  main-text" id="mTodayProfitPCTValue" title="'+todayPercent+'">'+todayPercent+'</span>');
        } else {
            $("#mTodayProfitPCTValue").attr("title",todayPercent);
            $("#mTodayProfitPCTValue").text(todayPercent);
        }
    }
}

estimateYesterdayPercent();
$("body").on('DOMSubtreeModified', "#mYesterdayProfitUSDValue", function() {
	estimateYesterdayPercent();
});

estimatePercent();
$("body").on('DOMSubtreeModified', "#mTodayProfitUSDValue", function() {
	estimatePercent();
});
