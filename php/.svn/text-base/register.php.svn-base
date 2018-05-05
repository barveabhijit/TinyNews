<?php

	// header('Content-type: application/json');
	// Enable Error Reporting and Display:
	// error_reporting(~0);
	// ini_set('display_errors', 1);

	$email = $_POST['emaill'];
	$pass = $_POST['passs'];
	$firstname = $_POST['firstnamee'];
	$lastname = $_POST['lastnamee'];
	$photo_url = $_POST['photo_urll'];
	
   	if (!empty($email) && !empty($pass) && !empty($firstname) && !empty($lastname) && !empty($photo_url)) {
	   	$contents = file_get_contents($photo_url);	
	   	$unpacked = unpack("c*", $contents);
		$pparam = "[";
		foreach ($unpacked as $val) {
			$pparam .= $val.",";
		}
	    $pparam = rtrim($pparam, ",");
	    $pparam .= "]";
	
		$jsonArray = array("email"=>$email, "password"=>$pass, "firstname"=>$firstname, "lastname"=>$lastname, "photo"=>$pparam);
	}

    //var_dump($jsonArray);
   	$customer = json_encode($jsonArray);
  	//var_dump($buzz);
   	$params = array("action"=>"registerCustomer", "customer"=>$customer);
	//print_r("\n\n\$params: ".$params);
	//var_dump($params);
   	$query = http_build_query ($params);
   	//var_dump($query);
	
   	$contextData = array ('method' => 'POST', 'header' => "Connection: close\r\n"."Content-Length: ".strlen($query)."\r\n", 'content'=> $query );
   	//var_dump($contextData);
   	$context = stream_context_create (array ( 'http' => $contextData ));
 	
 	$result = file_get_contents("http://".$_SERVER['HTTP_HOST']."/salebynow/json.htm", false, $context);
	
	/* if ($result != "[true]")
		echo "401"; 
	else echo $result; */
	
	if (strpos($http_response_header[0], "200")) {
		header("HTTP/1.1 200 OK");
		echo $result;
	}
	else if (strpos($http_response_header[0], "401"))
		header("HTTP/1.1 401 Unauthorized");
	else if (strpos($http_response_header[0], "500"))
		header("HTTP/1.1 500 Insufficient data to complete request");
		
   	// echo($result);

?>