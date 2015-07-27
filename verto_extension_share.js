function screenStart(state, callback) {
	if (state) {
		if(!isLoggedIntoVerto()) { // start the verto log in procedure
			// runs when the websocket is successfully created
			callbacks.onWSLogin = function(v, success) {
				doshare(state);
				goto_page("main");
				callback({'status':'success', 'message': 'screenshare started'});
				console.log("logged in. starting screenshare");
				$("#webcam").show()
				$("#webcam").css("z-index","1000")
			}
			// set up verto
			$.verto.init({}, init);
		} else {
			console.log("already logged into verto, going straight to making a call");
			doshare(state);
			goto_page("main");
			callback({'status':'success', 'message': 'screenshare started'});
			$("#webcam").show()
			$("#webcam").css("z-index","1000")
		}
	} else {
		doshare(state);
		callback({'status':'success', 'message': 'screenshare ended'});
	}
}

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

	$('#ext').trigger('change');
	$("#main_info").html("Trying");
	$("#vqual_hd").prop("checked", true)

	outgoingBandwidth = incomingBandwidth = "5120";
	// outgoingBandwidth = incomingBandwidth = "default";

	var sharedev = "screen"; // $("#useshare").find(":selected").val();

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

	getChromeExtensionStatus( function() {
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
