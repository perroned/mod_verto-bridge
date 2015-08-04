function doshare(on) {
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
			share_call = verto.newCall({
				destination_number: extension + "-screen",
				caller_id_name: conferenceUsername + " (Screen)",
				caller_id_number: conferenceIdNumber + " (screen)",
				outgoingBandwidth: outgoingBandwidth,
				incomingBandwidth: incomingBandwidth,
				videoParams: screen_constraints.mandatory,
				useVideo: true,
				screenShare: true,
				dedEnc: false,
				mirrorInput: false,
			});
		});
	});
}

function doDesksharePreview() {
	getChromeExtensionStatus(function(status) {
		sourceId = null;
		getScreenConstraints(function(error, screen_constraints) {
			if(error) {
				return console.error(error);
			}

			console.log('screen_constraints', screen_constraints);
			var selectedDeskshareConstraints = getChosenDeskshareResolution(); // this is the video profile the user chose
			my_real_size(selectedDeskshareConstraints);
			selectedDeskshareConstraints = getDeskshareConstraintsFromResolution(selectedDeskshareConstraints); // convert to a valid constraints object
			console.log("new screen constraints");
			console.log(selectedDeskshareConstraints);

			navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
			navigator.getUserMedia({ video: screen_constraints }, function(stream) {
				var video = document.querySelector('video');
				video.src = URL.createObjectURL(stream);
				video.play();
				$("#webcam").show();
			}, function(error) {
				return console.error(JSON.stringify(error, null, '\t'));
			});
		})
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
function getDeskshareConstraintsFromResolution(constraints) {
	return {
		"audio": false,
		"video": {
			"mandatory": {
				"maxWidth": constraints.constraints.maxWidth,
				"maxHeight": constraints.constraints.maxHeight,
				"chromeMediaSource": constraints.constraints.chromeMediaSource,
				"chromeMediaSourceId": constraints.constraints.chromeMediaSourceId
				// "minFrameRate": resolution.constraints.minFrameRate
			},
			"optional": []
		}
	};
}

function screenStart(state, callback) {
	if (state) {
		if(!isLoggedIntoVerto()) { // start the verto log in procedure
			// runs when the websocket is successfully created
			callbacks.onWSLogin = function(v, success) {
				doshare(state);
				callback({'status':'success', 'message': 'screenshare started'});
				console.log("logged in. starting screenshare");
			}
			// set up verto
			$.verto.init({}, init);
		} else {
			console.log("already logged into verto, going straight to making a call");
			doshare(state);
			callback({'status':'success', 'message': 'screenshare started'});
		}
	} else {
		doshare(state);
		callback({'status':'success', 'message': 'screenshare ended'});
	}
}
