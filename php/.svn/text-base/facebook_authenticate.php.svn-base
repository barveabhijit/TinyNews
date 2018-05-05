<?php
	$facebookId = $_POST["facebook_id"];
	$secretSalt =  '619345'; //secret string

	$tempUserId = md5($facebookId.$secretSalt);
	$tnUserId =  substr($tempUserId,0,12); //truncating it 12 charcters to match with DB column length

	echo $tnUserId.'@test.com';
?>