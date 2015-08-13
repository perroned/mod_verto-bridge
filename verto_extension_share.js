var deskshareStream = "deskshareStream";
window[deskshareStream] = null;

function doshare(on, callback, videoTag) {
	if (!on) {
		if (share_call) {
			share_call.hangup();
		}
		return;
	}

	if (share_call) {
		return;
	}

	outgoingBandwidth = incomingBandwidth = "default";
	var sharedev = "screen";

	if (sharedev !== "screen") {
		console.log("Attempting Screen Capture with non-screen device....");
		share_call = verto.newCall({
			destination_number: extension + "-screen",
			caller_id_name: conferenceUsername + " (Screen)",
			caller_id_number: conferenceIdNumber + " (screen)",
			outgoingBandwidth: outgoingBandwidth,
			incomingBandwidth: incomingBandwidth,
			useCamera: sharedev,
			useVideo: true,
			screenShare: true,
			dedEnc: $("#use_dedenc").is(':checked'),
			mirrorInput: $("#mirror_input").is(':checked')
		});
		return;
	}

	getChromeExtensionStatus( function(status) {
		sourceId = null;
		getScreenConstraints(function(error, screen_constraints) {
			if(error) {
				return console.error(error);
			}

			console.log('screen_constraints', screen_constraints);
			var selectedDeskshareResolution = getChosenDeskshareResolution(); // this is the video profile the user chose
			my_real_size(selectedDeskshareResolution);
			var selectedDeskshareConstraints = getDeskshareConstraintsFromResolution(selectedDeskshareResolution, screen_constraints); // convert to a valid constraints object
			console.log("new screen constraints");
			console.log(selectedDeskshareConstraints);

			share_call = verto.newCall({
				destination_number: extension + "-screen",
				caller_id_name: conferenceUsername + " (Screen)",
				caller_id_number: conferenceIdNumber + " (screen)",
				outgoingBandwidth: outgoingBandwidth,
				incomingBandwidth: incomingBandwidth,
				videoParams: selectedDeskshareConstraints.video.mandatory,
				useVideo: true,
				screenShare: true,
				dedEnc: false,
				mirrorInput: false,
				tag: videoTag
			});
		});
	});
}

function doDesksharePreview(onSuccess, onFailure, videoTag) {
	getChromeExtensionStatus(function(status) {
		sourceId = null;
		getScreenConstraints(function(error, screen_constraints) {
			if(error) {
				return console.error(error);
			}

			console.log('screen_constraints', screen_constraints);
			var selectedDeskshareResolution = getChosenDeskshareResolution(); // this is the video profile the user chose
			my_real_size(selectedDeskshareResolution);
			var selectedDeskshareConstraints = getDeskshareConstraintsFromResolution(selectedDeskshareResolution, screen_constraints); // convert to a valid constraints object
			console.log("new screen constraints");
			console.log(selectedDeskshareConstraints);
			previewLocalMedia(deskshareStream, selectedDeskshareConstraints, videoTag, onSuccess, onFailure);
		});
	});
}

// return the webcam resolution that the user has selected
function getChosenDeskshareResolution() {
	var videoConstraints = getAllPresetVideoResolutions(); // retrieve all resolutions
	var selectedVideo = null;
	for(var i in videoConstraints) {
		selectedVideo = videoConstraints[i];
		if($("#deskshareQuality_"+i).is(':checked')) { // compare against all resolutions
			break;
		}
	}
	return selectedVideo;
}

// receives a video resolution profile, and converts it into a constraints format for getUserMedia
function getDeskshareConstraintsFromResolution(resolution, constraints) {
	return {
		"audio": false,
		"video": {
			"mandatory": {
				"maxWidth": resolution.constraints.maxWidth,
				"maxHeight": resolution.constraints.maxHeight,
				"chromeMediaSource": constraints.mandatory.chromeMediaSource,
				"chromeMediaSourceId": constraints.mandatory.chromeMediaSourceId,
				"minFrameRate": resolution.constraints.minFrameRate
			},
			"optional": []
		}
	};
}

function screenStart(state, callback, videoTag) {
	if (state) {
		if(!isLoggedIntoVerto()) { // start the verto log in procedure
			// runs when the websocket is successfully created
			callbacks.onWSLogin = function(v, success) {
				doshare(state, callback, videoTag);
				callback({'status':'success', 'message': 'screenshare started'});
				console.log("logged in. starting screenshare");
			}
			// set up verto
			$.verto.init({}, init);
		} else {
			console.log("already logged into verto, going straight to making a call");
			doshare(state, callback, videoTag);
			callback({'status':'success', 'message': 'screenshare started'});
		}
	} else {
		doshare(state, callback, videoTag);
		callback({'status':'success', 'message': 'screenshare ended'});
	}
}
