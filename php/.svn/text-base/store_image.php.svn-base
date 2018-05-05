<?php

	//error_reporting(~0);
	//ini_set('display_errors', 1);
	$file = "";
	$url = "";
	if( isset($_FILES["file"]["tmp_name"]) ) { $file = $_FILES["file"]["tmp_name"]; };
	if( isset($_POST['url']) ) { $url = $_POST['url']; };
	$compression = TRUE; // override for now
	$time = time();
	$applocation = "/php/";
	
	if ($file) {
		if ( exif_imagetype($file) == IMAGETYPE_JPEG ) {
			$srcimage = @imagecreatefromjpeg($file);
		}
		elseif ( exif_imagetype($file) == IMAGETYPE_PNG ) {
			$srcimage = @imagecreatefrompng($file);
		}
		else exit('File picture type is not supported');
		//$size = getimagesize($file);
	}
	elseif ($url) {
		if ( exif_imagetype($url) == IMAGETYPE_JPEG ) {
			$srcimage = @imagecreatefromjpeg($url);
		}
		elseif ( exif_imagetype($url) == IMAGETYPE_PNG ) {
			$srcimage = @imagecreatefrompng($url);
		}
		else exit('Given url picture type is not supported');
	}
	else exit("No resource provided");
	
	if ($srcimage && $compression) {
		$photo = "images/p".$time.".jpg";
		$target = 245760; // target size, bytes
		$delta = 20000; // size tolerated above target, bytes
		$initial_quality = 85;
		$step = 10;
		$max_iterations = floor($initial_quality/$step);
		$q = $initial_quality;
		$iteration = 0;
		
		imagejpeg($srcimage, $photo, $initial_quality);
		//echo filesize($photo);
		
		if ( filesize($photo) > ($target+$delta)) {
			while ( (filesize($photo) > ($target+$delta)) && ($iteration <= $max_iterations) )
			{
				unlink($photo);
				$q = $q - $step;
				imagejpeg($srcimage, $photo, $q);
				$iteration++;
			}
			echo ("http://".$_SERVER['HTTP_HOST'].$applocation.$photo);
		}
	
		else echo ("http://".$_SERVER['HTTP_HOST'].$applocation.$photo);
	}
	elseif ($srcimage && !$compression) {
		$photo="images/p".$time.".jpg";
		imagejpeg($srcimage,"$photo",100);
		echo ("http://".$_SERVER['HTTP_HOST'].$applocation.$photo);
	}
	else {
		echo("Error uploading image.");
	}
	
?>