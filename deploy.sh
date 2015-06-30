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

# remove the minified entry
targetFile='../index.html'
targetLine='<script type=\"text\/javascript\" src=\"js\/verto-min.js\"><\/script>'
substitution='<!-- removed -->'
sed -i "s/$targetLine/$substitution/g" $targetFile

# fix quotation error in index.html
targetLine="<input type=\"text\" id=\"ext\"\"\/>"
substitution="<input type=\"text\" id=\"ext\"\/>"
sudo sed -i "s/$targetLine/$substitution/g" $targetFile

# substitute the minified verto code for the 3 separate components and my extension
targetLine='<script type=\"text\/javascript\" src=\"verto.js\"><\/script>'
# substitute with
substitution="<script type=\"text\/javascript\" src=\"js\/jquery.FSRTC.js\"><\/script>\
<script type=\"text\/javascript\" src=\"js\/jquery.jsonrpcclient.js\"><\/script>\
<script type=\"text\/javascript\" src=\"js\/jquery.verto.js\"><\/script>\
<script type=\"text\/javascript\" src=\"verto.js\"><\/script>\
<script type=\"text\/javascript\" src=\".\/$verto\/verto_extension.js\"><\/script>"
sed -i "s/$targetLine/$substitution/g" $targetFile

# remove the initialization on start up
targetLine='\$\.verto\.init({}, init);'
substitution='\/* & *\/'
targetFile='../verto.js'
sed -i "s/$targetLine/$substitution/g" $targetFile
