<?php
header("content-type:application/json");
$stunsInfo = array(
	'stunServers' => array(
		array(
			'url' => 'stun:stun.l.google.com:19302' /* what freeswitch uses */
		),
		array(
			'url' => 'stun:stun.freeswitch.org' /* what BBB/api/stuns returns */
		)
	),
	'turnServers' => array(
		array(
			'url' => 'turn:numb.viagenie.ca',
			'password' => 'muazkh',
			'username' => 'webrtc@live.com'
		)
	)
);
echo json_encode($stunsInfo);
?>
