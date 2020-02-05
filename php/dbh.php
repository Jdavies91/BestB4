<?php 
//connection to connect to database from website
$conn = mysqli_connect("127.0.0.1", "root", "","bestb4" );
if(!$conn){
    die("Connection failed : ".mysqli_connect_error());
}
?>