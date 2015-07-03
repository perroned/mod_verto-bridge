function screenStart(state, callback) {
	if(!isLoggedIntoVerto()) { // start the verto log in procedure
		// runs when the websocket is successfully created
		// callbacks.onWSLogin = function(v, success) {
			// doshare(state);
		// }
		// set up verto
		$.verto.init({}, init);
	} else {
		console.log("already logged into verto, going straight to making a call");
		doshare(state);
	}


	if (state) {
			callback({'status':'success', 'message': 'screenshare started'});
	} else {
		callback({'status':'success', 'message': 'screenshare ended'});
	}
}
