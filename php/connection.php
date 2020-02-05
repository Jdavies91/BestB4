<?php
class DB {
    // database server information
	private $servername = "localhost";
	private $username = "bestbca_user";
	private $password = "user123";
	private $dbname = "bestbca_bb4";
	private $port = "3306";
	// Connect to DB
	public function connect()
	{
		$this->conn = new mysqli(
		$this->servername, $this->username, 
		$this->password, $this->dbname);
		return;
	}
	// Insert to DB
	// Att: make sure table students is already created
	public function Insert($username,$email, $password){
		$username = htmlspecialchars($username);
		$email = htmlspecialchars($email);
		$password = htmlspecialchars($password);
		$sql ="INSERT INTO customer (custemail, custuserName, custpass) 
		VALUES (md5(\"$email\"),\"$username\",md5(\"$password\"))";
		$result = $this->conn->query($sql);
		if ($result == true){
		    echo '<script type="text/javascript">'; 
            echo 'alert("Account created");'; 
            echo 'window.location.href = "../app.html";';
            echo '</script>';
		}
	}
	// Searches through the database to see if theres a match
	public function search($email, $password){
		$email = htmlspecialchars($email);
		$password = htmlspecialchars($password);
		$sql = "SELECT * FROM customer WHERE custemail = \"$email\" AND custpass = \"$password\" ";
		$result = $this->conn->query($sql);
						
		$row = NULL;
		if ($row == mysqli_fetch_assoc($result)){
			return true;
		} else {
			return false;
		}
	}	
	// Searchs if there is a email already in used
	public function searchemail($email){
		$email = htmlspecialchars($email);
		$sql = "SELECT * FROM customer WHERE custemail = md5(\"$email\")";
		$result = $this->conn->query($sql);
						
		$row = NULL;
		if ($row == mysqli_fetch_assoc($result)){
			return true;
		} else {
			return false;
		}
	}			    
	// Read from DB
	public function ListNames(){
		$sql = "SELECT * FROM students";
		$result = $this->conn->query($sql);
						        
		if ($result->num_rows > 0) {
			// output data of each row
			while($row = $result->fetch_assoc()) {
				echo "First name: " . $row["FirstName"]."<br>";
			}
		} else {
			echo "0 results";
		}
	}
    // Upload JSON file
    public function uploadBackUp($email,$filenameRowList,$filenameOldItemList){
		$email = htmlspecialchars($email);
        $filenameRowList = htmlspecialchars($filenameRowList);
        $filenameOldItemList = htmlspecialchars($filenameOldItemList);
        
		$sql ="INSERT INTO DataBackUp (custemail, uploadTime, rowListFile, oldItemListFile) 
		VALUES (md5(\"$email\"),CURRENT_TIMESTAMP,md5(\"$filenameRowList\"),md5(\"$filenameOldItemList\"))";
		$result = $this->conn->query($sql);
		if ($result == true){
			echo "Record added! </br>";
		}
	}
	// Load JSON file
	public function loadData($email){
		$email = htmlspecialchars($email);        
		$sql = "SELECT * FROM DataBackUp WHERE custemail = md5(\"$email\") ORDER BY uploadTime DESC LIMIT 1" ;
		$result = $this->conn->query($sql);
		$row = $result->fetch_assoc();

 		echo $row["rowListFile"] . " " . $row["oldItemListFile"];
	}
	
	public function diConnect(){
		$this->conn->close();
	}
}
?>