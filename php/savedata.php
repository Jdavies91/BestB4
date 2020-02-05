<?php
include 'connection.php';
//Puts form information into varibles
$email = $_POST['email'];
$password = $_POST['password'];
$rowListObject = $_POST['rowList'];
$OldItemListObject = $_POST['OldItemList'];

$obj = new DB();
$obj->connect();
// sees if there is a correct user there
$boolean=$obj->search(md5($email), md5($password));

if($boolean){
    echo "wrong";
}else{
    //puts information into a file conents and puts it into the backup 
    echo "correct";
    $rowListjson = json_encode($rowListObject);
    $OldItemListjson = json_encode($OldItemListObject);
    $filename = $email . time();
    $filenameRowList = $filename."_rowList";
    $filenameOldItemList = $filename."_OldItemList";
    file_put_contents("../userdata/".md5($filenameRowList).".json",$rowListjson);
    file_put_contents("../userdata/".md5($filenameOldItemList).".json",$OldItemListjson);        
    $obj->uploadBackUp($email,$filenameRowList,$filenameOldItemList);
}
?>