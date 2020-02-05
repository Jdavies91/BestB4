<?php
// post information into a email message then sent to user
if(isset($_POST["consubmit"])){
	$conname = $_POST['conname'];
	$conemail = $_POST['conemail'];
	$connumber = $_POST['connumber'];
	$conmessage = $_POST['conmsg'];
	$formcontent="From: $conname \n Message: $conmessage \n Number: $connumber";
	$recipient = "jesh.co@hotmail.com";
	$subject = "Contact Form";
	$mailheader = "From: $conemail \r\n";
	// creates a email and sends it to the company
	mail($recipient, $subject, $formcontent, $mailheader) or die("Error!");
    header("Location: ../index.html#contact");
	echo "Thank You!";
}
?>


