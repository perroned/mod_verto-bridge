var videoContstraints = [];
// BigBlueButton low
videoContstraints["low"] = {
	"name": "Low quality",
	"constraints": {
		"minWidth": 160,
		"minHeight": 120,
		"maxWidth": 160,
		"maxHeight": 120,
		"minFrameRate": 10,
		"vertoBestFrameRate": 10
	}
};
// BigBlueButton medium
videoContstraints["medium"] = {
	"name": "Medium quality",
	"constraints": {
		"minWidth": 320,
		"minHeight": 240,
		"maxWidth": 320,
		"maxHeight": 240,
		"minFrameRate": 10,
		"vertoBestFrameRate": 10
	}
};
// BigBlueButton high
videoContstraints["high"] = {
	"name": "High quality",
	"constraints": {
		"minWidth": 640,
		"minHeight": 480,
		"maxWidth": 640,
		"maxHeight": 480,
		"minFrameRate": 15,
		"vertoBestFrameRate": 15
	}
};
// verto defaults
videoContstraints["qvga"] = {
	"name": "QVGA",
	"constraints": {
		"minWidth": 320,
		"minHeight": 240,
		"maxWidth": 320,
		"maxHeight": 240,
		"minFrameRate": 15,
		"vertoBestFrameRate": 30
	}
};
videoContstraints["vga"] = {
	"name": "VGA",
	"constraints": {
		"minWidth": 640,
		"minHeight": 480,
		"maxWidth": 640,
		"maxHeight": 480,
		"minFrameRate": 15,
		"vertoBestFrameRate": 30
	}
};
videoContstraints["qvga_wide"] = {
	"name": "QVGA WIDE",
	"constraints": {
		"minWidth": 320,
		"minHeight": 180,
		"maxWidth": 320,
		"maxHeight": 180,
		"minFrameRate": 15,
		"vertoBestFrameRate": 30
	}
};
videoContstraints["vga_wide"] = {
	"name": "VGA WIDE",
	"constraints": {
		"minWidth": 640,
		"minHeight": 360,
		"maxWidth": 640,
		"maxHeight": 360,
		"minFrameRate": 15,
		"vertoBestFrameRate": 30
	}
};
videoContstraints["hd"] = {
	"name": "HD",
	"constraints": {
		"minWidth": 1280,
		"minHeight": 720,
		"maxWidth": 1280,
		"maxHeight": 720,
		"minFrameRate": 15,
		"vertoBestFrameRate": 30
	}
};
videoContstraints["hhd"] = {
	"name": "HHD",
	"constraints": {
		"minWidth": 1920,
		"minHeight": 1080,
		"maxWidth": 1920,
		"maxHeight": 1080,
		"minFrameRate": 15,
		"vertoBestFrameRate": 30
	}
};

function getAllVideoResolutions() {
	return videoContstraints;
}

function makeResolutions() {
	var videoConstraints = getAllVideoResolutions();
	for(var i in videoConstraints) {
		v = videoConstraints[i];
		$("#webcamResolutions").append("<input type='radio' name='webcamQuality' id='webcamQuality_" + i + "' value='" + i + "'>");
		$("#webcamResolutions").append("<label for='webcamQuality_" + i + "'>" + v.name + " " + v.constraints.minWidth + "x" + v.constraints.minHeight + "</label>");
	}
	$("#webcamQuality_qvga").prop("checked", true);
}
makeResolutions();
