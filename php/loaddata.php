<?php
include 'connection.php';
        
$email = $_POST['email'];
$password = $_POST['password'];
$obj = new DB();
$obj->connect();
// search email and password in database and returns a boolean
$boolean=$obj->search(md5($email), md5($password));
//if bolean = true then oupts wrong
if($boolean){
    echo "wrong";
}else{ // if false loads data into database.
    echo $obj->loadData($email);
}
?>