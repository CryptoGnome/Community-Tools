var ConvertLogDates = {
	init: function () {
		var _parent = this;
		$("body").on('DOMSubtreeModified', "#dvLastUpdatedOn", function() {
			if ($('#dtDcaLogs').text() !== "")
				_parent.convertDCADates();

			if ($('#dtPairsLogs').text() !== "")
				_parent.convertPairsDates();

			if ($('#dtSalesLog').text() !== "")
				_parent.convertSalesLogDates();

			if ($('#dtDustLogs').text() !== "")
				_parent.convertDustLogDates();
		});
		$("body").on('DOMSubtreeModified', "#dvCurrentUTCTime", function() {
			_parent.convertLocalTimeToAMPM();
		});

		$(".dca-log, .pairs-log, .dust-log, .sales-log, th.date.all").on("click", function() {
			console.log ("called");
				setTimeout(function(){
					if ($('#dtSalesLog').text() !== "")
						_parent.convertSalesLogDates();
					if ($('#dtDcaLogs').text() !== "")
						_parent.convertDCADates();
					if ($('#dtPairsLogs').text() !== "")
						_parent.convertPairsDates();
					if ($('#dtDustLogs').text() !== "")
						_parent.convertDustLogDates();
				},500);
		});
	},
	calcNewDate: function(t) {
		var originalDate = $(t).find("td.date.all").text(),
    		 militaryTime = originalDate.split('(')[0].split(' ')[1],
    		 mDY = originalDate.split(' ')[0],
    		 day = originalDate.split('(')[1].split(')')[0],
    		 amPmTime = this.toDate(militaryTime,"h:m").toLocaleString('en-US',
    		  { hour: 'numeric', minute: 'numeric', hour12: true }),
    		 newDate = mDY + ' ' + amPmTime + ' (' + day +')';
		     return (originalDate.indexOf('M') != '-1')?originalDate:newDate;
	},
	convertLocalTimeToAMPM: function () {
	  var time = this.toDate($("#dvCurrentTime").text(),"h:m"),
	   currentServerLocalAMPMTime = time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
	    $("#dvCurrentTime").hide();
	    if ($("#dvCurrentUTCTime").text() !== "")
	    { 
	        if ($("#dvCurrentAMPMTime").text() === "") {
	            $("#dvCurrentTime").after("<span id='dvCurrentAMPMTime'>"+ currentServerLocalAMPMTime +"</span>");
	        } else {
	            $("#dvCurrentAMPMTime").text(currentServerLocalAMPMTime);
	        }
	    }
	},
    convertPairsDates: function () {
    	var _parent = this;
    	$('#dtPairsLogs tbody tr').each(function() {
    		var newDate = _parent.calcNewDate(this);
    		$(this).find("td.date.all").text(newDate);
		});
    },
    convertDCADates: function () {
    	var _parent = this;
    	$('#dtDcaLogs tbody tr').each(function() {
    		var newDate = _parent.calcNewDate(this);
    		$(this).find("td.date.all").text(newDate);
		});
    },
    convertSalesLogDates: function () {
    	var _parent = this;
    	$('#dtSalesLog tbody tr').each(function() {
    		var newDate = _parent.calcNewDate(this);
    		$(this).find("td.date.all").text(newDate);
		});
    },
    convertDustLogDates: function () {
    	var _parent = this;
    	$('#dtDustLogs tbody tr').each(function() {
    		var newDate = _parent.calcNewDate(this);
    		$(this).find("td.date.all").text(newDate);
		});
    },
    toDate: function (dStr,format) {
		var now = new Date();
		if (format == "h:m") {
	 		now.setHours(dStr.substr(0,dStr.indexOf(":")));
	 		now.setMinutes(dStr.substr(dStr.indexOf(":")+1));
	 		now.setSeconds(0);
	 		return now;
		}else 
			return "Invalid Format";
    }
};
ConvertLogDates.init();
