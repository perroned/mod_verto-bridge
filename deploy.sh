#!/bin/bash
webDir='/var/www/html'
fsDemoDir='/home/firstuser/freeswitch.git/html5/verto/video_demo'
bbbDir='bigbluebutton'
verto='mod_verto-bridge'

# link directories to the web root
if [ ! -h "$webDir/$bbbDir" ]; then
	sudo ln -s "$fsDemoDir/$verto/$bbbDir" "$webDir/$bbbDir"
fi

if [ ! -h /var/www/html/verto ]; then
	sudo ln -s "$fsDemoDir" "$webDir/verto"
fi

# remove existing copies of non-minified javascript files
[[ -f "../js/jquery.FSRTC.js" ]] && rm "../js/jquery.FSRTC.js"
[[ -f "../js/jquery.jsonrpcclient.js" ]] && rm "../js/jquery.jsonrpcclient.js"
[[ -f "../js/jquery.verto.js" ]] && rm "../js/jquery.verto.js"
# copy fresh files over
cp ../../js/src/* ../js/
# sudo chown firstuser ../js/ -R

# remove the initialization on start up
targetLine='\$\.verto\.init({}, init);'
substitution='\/* & *\/'
targetFile='../verto.js'
sed -i "s/$targetLine/$substitution/g" $targetFile

# allows me to add a callback specifically for when ICE negotiation fails
targetLine='peer.onicecandidate = function(event) {'
substitution='peer\.oniceconnectionstatechange = function(event) {\
if (event\.currentTarget\.iceConnectionState == \"failed\") {\
RTCPeerConnectionCallbacks\.iceFailed(event);\
}\
}\
&'
targetFile='../js/jquery.FSRTC.js'
sed -i "s/$targetLine/$substitution/g" $targetFile

targetFile="index2.html"
cp targetFile ..
