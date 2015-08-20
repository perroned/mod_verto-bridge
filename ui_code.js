function makeDeskshareResolutions() {
	var videoConstraints = getAllPresetVideoResolutions();
	for(var i in videoConstraints) {
		v = videoConstraints[i];
		$("#deskshareResolutions").append("<input type='radio' name='deskshareQuality' id='deskshareQuality_" + i + "' value='" + i + "'>");
		$("#deskshareResolutions").append("<label for='deskshareQuality_" + i + "'>" + v.name + " " + v.constraints.minWidth + "x" + v.constraints.minHeight + "</label>");
	}
	$("#deskshareQuality_qvga").prop("checked", true);
}

function makeWebcamResolutions() {
	var videoConstraints = getAllPresetVideoResolutions();
	for(var i in videoConstraints) {
		v = videoConstraints[i];
		$("#webcamResolutions").append("<input type='radio' name='webcamQuality' id='webcamQuality_" + i + "' value='" + i + "'>");
		$("#webcamResolutions").append("<label for='webcamQuality_" + i + "'>" + v.name + " " + v.constraints.minWidth + "x" + v.constraints.minHeight + "</label>");
	}
	$("#webcamQuality_qvga").prop("checked", true);
}

makeWebcamResolutions();
makeDeskshareResolutions();

function initUIHandlers() {
	$("#joinAudio").click(function() {
		wasCallSuccessful = false;
		var debuggerCallback = function(message) {
			console.log("CALLBACK: "+JSON.stringify(message));
			/*
			* Beginning of hacky method to make Firefox media calls succeed.
			* Always fail the first time. Retry on failure.
			*/
			if (!!navigator.mozGetUserMedia && message.errorcode == 1001) {
				callIntoConference(extension, conferenceUsername, conferenceIdNumber, function(m){console.log("CALLBACK: "+JSON.stringify(m));}, "webcam");
			}
			/*
			* End of hacky method
			*/
		}
		callIntoConference(extension, conferenceUsername, conferenceIdNumber, debuggerCallback, "webcam");
	});

	$("#hangUp").click(function() {
		console.log("hangup button");
		leaveWebRTCVoiceConference();
		cur_call = null;
	});

	$("#shareScreen").click(function() {
		console.log("shareScreen button");
		screenStart(true, function(){}, "webcam");
		$("#shareScreen").hide();
		$("#stopScreen").show();
	});

	$("#stopScreen").click(function() {
		console.log("stopScreen button");
		screenStart(false, function(){});
		$("#shareScreen").show();
		$("#stopScreen").hide();
	});
	$("#stopScreen").hide();

	$("#desksharePreview").click(function() {
		doDesksharePreview(function(){}, function(){}, "webcam");
	});

	$("#webcamPreview").click(function() {
		doWebcamPreview(function(){}, function(){}, "webcam");
	});

	$("#getAdjustedResolutions").click(function() {
		getAdjustedResolutions(function(result){
			for(var i in result) {
				$("#adjustedResolutions").append(i + ": " + result[i].width + "x" + result[i].height + "<br/>");
			}
		});
	});
	$("#webcam").show();
}
