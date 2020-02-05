<!DOCTYPE html>
<html lang="en">

	<title>Upload Photo to Twitter</title>
	<!--Puts images into tab box--> 
	<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0">
	<link rel = "stylesheet" href="../css/bootstrap.min.css">
	<link rel = "stylesheet" href="../styles/twitter.css">
    <link rel="apple-touch-icon" sizes="57x57" href="/fav/apple-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="/fav/apple-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="/fav/apple-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="76x76" href="/fav/apple-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="/fav/apple-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="/fav/apple-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="/fav/apple-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="/fav/apple-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/fav/apple-icon-180x180.png">
    <link rel="icon" type="image/png" sizes="192x192"  href="/fav/android-icon-192x192.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/fav/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="96x96" href="/fav/favicon-96x96.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/fav/favicon-16x16.png">
    <link rel="manifest" href="/manifest.json">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="msapplication-TileImage" content="/ms-icon-144x144.png">
    <meta name="theme-color" content="#ffffff">
	<script type ="text/javascript" src="../js/jquery-3.2.1.min.js"></script>
</head>
<body>
<div>

<?php
require 'autoload.php';
session_start();
use Abraham\TwitterOAuth\TwitterOAuth;
// image to resize the image to a smaller size
function resizeImage($resourceType, $image_width,$image_height){
    
    $resizeWidth = 50;
    $resizeHeight = 50;
    $imageLayer = imagecreatetruecolor($resizeWidth,$resizeHeight);
    imagecopyresampled($imageLayer,$resourceType,0,0,0,0,$resizeWidth,$resizeHeight, $image_width,$image_height);
    return $imageLayer;
}
//	echo $user->screen_name;
//	print_r($user);
    
define('CONSUMER_KEY', 'XgFf7XCMjWCRz8UJiRJLXQZag'); // add your app consumer key between single quotes
define('CONSUMER_SECRET', 'kuqU4hbLB3GlYhmUoq9Ew3bMX6E79t8T5CXzt0IDbUnTcUpoAt'); // add your app consumer secret key between single quotes
define('OAUTH_CALLBACK', 'https://www.bestb4.ca/php/callback.php'); // your app callback URL
$GLOBALS['messagetxtbox'] = $_POST['text'];
//if check if user has avaible to have acess to the file
if (!isset($_SESSION['access_token'])) {
	
	$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET);
	$request_token = $connection->oauth('oauth/request_token', array('oauth_callback' => OAUTH_CALLBACK));
	$_SESSION['oauth_token'] = $request_token['oauth_token'];
	$_SESSION['oauth_token_secret'] = $request_token['oauth_token_secret'];

	$url = $connection->url('oauth/authorize', array('oauth_token' => $request_token['oauth_token']));
	//Post text into a session so it could go into the url
	if(isset($_POST['text'])){
	    $_SESSION['Messtxtbox'] = $_POST['text'];
	}
	header("location: $url");
	
 
//	header("location: callback.php");
} else {    //if theres already a acess token for twitter then it will go to else
    //if text is set then it goes into the session varible
    if(isset($_POST['text'])){
        $_SESSION['Messtxtbox'] = $_POST['text'];
    }
    // if submit is clicked then it will create a tweet
    if(isset($_POST['submit'])){
    	$imageProcess = 0;
    	if(is_array($_FILES)){
    	   
    	    $access_token = $_SESSION['access_token'];
	        $connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token['oauth_token'], $access_token['oauth_token_secret']);
	        $user = $connection->get("account/verify_credentials");
    	    $message = $_POST['msg'];
	        $source = $_FILES['file']["tmp_name"];
    	    list($sourceImageWidth,$sourceImageHeight,$uploadImageType) = getimagesize($source);
    	    $resizeFileName = time();
    	   
    	    $uploadPath = "../uploads/";
    	    $fileExt = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
            // a switch stament to see what image type it is
            switch($uploadImageType) {
    	       case IMAGETYPE_JPEG:
    	            
    	            imagejpeg($source,$uploadPath.$resizeFileName.'.'.$fileExt,50);
    	            move_uploaded_file($source,$uploadPath.$resizeFileName.".".$fileExt);
    	            $imageProcess = 1;
    	            if(message===""){
    	                $message = $message."From the BestB4 Web Application";
    	            } else{
    	                $message = $message."\nFrom the BestB4 Web Application";
    	            }
    	            $tweetwm = $connection->upload('media/upload', ['media'=>$uploadPath.$resizeFileName.'.'.$fileExt]);
                    $tweet = $connection->post('statuses/update',['media_ids'=> $tweetwm->media_id, 'status' => $message]);
                    unlink($uploadPath.$resizeFileName.'.'.$fileExt);
    	            break;
    	       case IMAGETYPE_GIF:
    	            $resourceType = imagecreatefromgif($source);
    	            $imageLayer = resizeImage($resourceType, $sourceImageWidth, $sourceImageHeight);
    	            imagegif($uploadPath."thump_".$resizeFileName.'.'.$fileExt);
    	    	    move_uploaded_file($source,$uploadPath.$resizeFileName.".".$fileExt);
    	            $imageProcess = 1;
    	            
    	            if(message===""){
    	                $message = $message."From the BestB4 Web Application";
    	            } else{
    	                $message = $message."\nFrom the BestB4 Web Application";
    	            }
    	            	$tweetwm = $connection->upload('media/upload', ['media'=>$uploadPath.$resizeFileName.'.'.$fileExt]);
                        $tweet = $connection->post('statuses/update',['media_ids'=> $tweetwm->media_id, 'status' => $message]);
                        unlink($uploadPath.$resizeFileName.'.'.$fileExt);
    	            break;
    	       case " ":
    	                $imageProcess = 3;
    	            break;
    	       case IMAGETYPE_PNG:
    	           	move_uploaded_file($source,$uploadPath.$resizeFileName.".".$fileExt);
    	            $imageProcess = 1;
    	            $resourceType = imagecreatefromPNG($source);
    	            $imageLayer = resizeImage($resourceType, $sourceImageWidth, $sourceImageHeight);
    	            imagepng($uploadPath."thump_".$resizeFileName.'.'.$fileExt);
    	            move_uploaded_file($source,$uploadPath.$resizeFileName.".".$fileExt);
    	            $imageProcess = 1;
    	            $tweetwm = $connection->upload('media/upload', ['media'=>$uploadPath.$resizeFileName.'.'.$fileExt]);
    	            
    	            if(message===""){
    	                $message = $message."From the BestB4 Web Application";
    	            } else{
    	                $message = $message."\nFrom the BestB4 Web Application";
    	            }
                    $tweet = $connection->post('statuses/update',['media_ids'=> $tweetwm->media_id, 'status' => $message]);
                    unlink($uploadPath.$resizeFileName.'.'.$fileExt);
    	            break;
    	       default:
                    $imageProcess = 2;
                    break;
    	    }
    	}
    	
    	
	

    }
}


?>



	<h1> Upload A Photo To Twitter</h1>
	<hr>
	<div class = "row center">
		<div class ="col-md-6 col-md-offset-2">
		   <!-- creates a form for a message text box and a file upload-->
			<form name = "uploadFrm" method = "post" enctype="multipart/form-data">

				<div class = "form-group">
					<label for ="message-text" class="control-label"> Message:</label>
					<?php
					
				        //if message box is not blank then put session in
						if($_SESSION['Messtxtbox']!== ""){
							echo '<textarea class="form-control" id="msg" rows="5" cols = "30" name= "msg">';
							echo $_SESSION['Messtxtbox'];
							echo'</textarea>';
					
						    
						} else { // else leave place holder
							echo '<textarea class="form-control" id="msg" rows="5" cols = "30" name= "msg" ';
							echo 'placeholder="Upload photo on Twitter using Graph API in PHP" value = ""';
							echo '></textarea>';
						
						}
					?>
				</div>
				
				<div class ="form-group">
					<label for="file">Select File</label>
					<input type="file" id = "file" name="file">
					<p class= "help-block"> Select your Picture of the food you have created.</p>
				</div>
				<div class = "footer">
					<button type = "submit" name = "submit" class ="btn btn-primary">Post Status</button>
					<a href="../app.html"><button type = "button" name = "home" class ="btn btn-secondary">App Homepage</button></a>
				</div>
				<div>
			        <?php
			        // check if message is succesffully load or not
			        if(isset($_POST['submit'])){
			                  if($imageProcess ===1){
			                
                    ?> 
                        <strong>Successfully upload</strong>
                
			        <?php
			         
			   
			                
			            } else if(!isset($_POST['file'])) {
                    ?> 
                    <strong>No file selected.</strong>
			        <?php
			            } else {
			         ?> 
			        <strong>Error with upload please try again.</strong>
			        <?php
			            }
			        } 
			        ?> 
			    </div>
			</form>
		</div>
	</div>
</div>


