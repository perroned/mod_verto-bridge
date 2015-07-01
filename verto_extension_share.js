function screenStart(state, callback) {
	doShare(state);
	if (state) {
			callback({'status':'success', 'message': 'screenshare started'});
	} else {
		callback({'status':'success', 'message': 'screenshare ended'});
	}
}
