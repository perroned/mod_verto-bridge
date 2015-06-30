mod_verto-bridge Extension
===

This is an extension for the [FreeSWITCH](https://freeswitch.org/) ([source](https://freeswitch.org/fisheye/browse/freeswitch)) [mod_verto](https://freeswitch.org/confluence/display/FREESWITCH/mod_verto) endpoint.
This serves as an API to use mod_verto in a web application. A replacement for SIP.js.

This extension is a modified version of the verto demo code to be used in [BigBlueButton](https://github.com/bigbluebutton/bigbluebutton/) to communicate with FreeSWITCH.

The entry point is callIntoConference(). Receives a voice bridge number, a username for the voice conference, a user Id in the conference, and an optional callback.

Should be placed in the verto video_demo directory in [FreeSWITCH 1.6](https://freeswitch.org/confluence/display/FREESWITCH/FreeSWITCH+1.6+Video).

Install with <code>./deploy.sh</code>.

Components
===
###Extension (verto_extension.js)

- This file will be needed to be added to the index.html JavaScript imports.
- The file provides own functions, and functions and data which substitutes code inside verto.js allowing this file to run stand alone once added, without manipulating multiple files.
- Overwrites the 'callbacks' object defined in verto.js.
- Overwrites the verto hangup handler.
- Substitutes the verto.js initialization (init) function.
- Provides WebRTC callbacks for call initialization.
- Will substitute the document's 'ready' for my own which creates a button to begin the protocol, and relocates the verto initialization.
- Makes an AJAX call to the page served at bigbluebutton/api/stuns/index.php to retrieve JSON data for a STUN/TURN server configuration.


###STUN API (bigbluebutton/api/stuns/index.php)
- Will be linked to and served from the webserver's root. Serves a PHP script which returns a JSON array holding information for a STUN/TURN server configuration.

###Installer (deploy.sh)
- Should be ran after a git clone/placement inside the video_demo directory.
- Will link the PHP script directory tree to the webserver's root at /bigbluebutton.
- Will link the video_demo directory to the webserver's root at /verto.
- Will remove the import of the minified verto library
- Will fix an HTML5 error in the verto video_demo index.html page
- Will locate the JavaScript import entry in the video_demo/index.html file where the mod_verto demo file is linked. Will substitute that entry with the 3 non-minified files that make it up (jquery.FSRTC.js, jquery.jsonrpcclient.js, jquery.verto.js), the verto demo file, and will add the entry for the verto extension.
