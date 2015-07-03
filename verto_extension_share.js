function screenStart(state, callback) {
	doshare(state);
	if (state) {
			callback({'status':'success', 'message': 'screenshare started'});
	} else {
		callback({'status':'success', 'message': 'screenshare ended'});
	}
}
