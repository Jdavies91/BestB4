<!DOCTYPE html>
<html lang="en">
    <head> 
        <!-- Image for Tab-->
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
	    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0">

		<!-- Website CSS style -->
		<link rel="stylesheet" type="text/css" href="../styles/register.css">

		<!-- Website Font style -->
        <link href="https://fonts.googleapis.com/css?family=Inconsolata:700" rel="stylesheet">
	    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css">
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script> 
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
		
		<!-- Google Fonts -->
		<title>Best B4 Register</title>
	</head>
	<body>
		<div class="container">
			<div class="row main">
				<div class="panel-heading">
	               <div class="panel-title text-center">
	               		<h1 class="title">Best B4</h1>
	               		<hr />
	               	</div>
	            </div> 
				<div class="main-login main-center">
					    
					    <!--Puts a form for registration -->
					<form class="form-horizontal" method="POST">
						<div class="form-group">
							<label for="email" class="cols-sm-2 control-label">Email</label>
							<div class="cols-sm-10">
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-envelope fa" aria-hidden="true"></i></span>
									<input type="text" class="form-control" name="email" id="email"  placeholder="Enter your Email" 
									value="<?php echo isset($_POST["email"])?$_POST["email"]:""; ?>" name="email" />
								</div>
							</div>
						</div>

						<div class="form-group">
							<label for="username" class="cols-sm-2 control-label">Username</label>
							<div class="cols-sm-10">
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-users fa" aria-hidden="true"></i></span>
									<input type="text" class="form-control" name="username" id="username"  placeholder="Enter your Username"
									value="<?php echo isset($_POST["username"])?$_POST["username"]:""; ?>" name="username"/>
								</div>
							</div>
						</div>

						<div class="form-group">
							<label for="password" class="cols-sm-2 control-label">Password</label>
							<div class="cols-sm-10">
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-lock fa-lg" aria-hidden="true"></i></span>
									<input type="password" class="form-control" name="password" id="password"  placeholder="Enter your Password"/>
								</div>
							</div>
						</div>

						<div class="form-group">
							<label for="confirm" class="cols-sm-2 control-label">Confirm Password</label>
							<div class="cols-sm-10">
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-lock fa-lg" aria-hidden="true"></i></span>
									<input type="password" class="form-control" name="confirm" id="confirm"  placeholder="Confirm your Password"/>
								</div>
							</div>
						</div>

						<div class="form-group">
                          
                               <button name="submit" type="submit"  class="btn btn-success btn-lg">Register
                           </button>
                           <br>
                           <br>
                            <a href="../app.html">Click here to go back</a>
						</div>
                        
					</form>
				</div>
			</div>
		</div>

		<script type="text/javascript" src="assets/js/bootstrap.js"></script>
		<!---Validates the username and password -->
		<?php 	
			include 'connection.php';
			include 'Validation.php';
			if(isset($_POST['submit'])){
				$email = $_POST['email'];
				$username = $_POST['username'];
				$password = $_POST['password'];
				$confirm = $_POST['confirm'];
				$obj = new DB();
				$val = new Validation();
				$obj->connect();
				$usertest = $obj->searchemail($email);
    			if ($val->emailValidation($email)) {
        			if($usertest){
    	    			if($val->password_strength($password)){
			    			if($password==$confirm){
				    			$obj->insert($username, $email, $password);
					    	}else{
						    	echo "<p align='center'><font color=red size='3pt'>Password don't match, please try again</font></p>";
						    }
					    } else{
						    echo "<p align='center'><font color=red size='3pt'>Password needs to have a number, a special character, 1 uppercase, and a length of 8</font></p>";
					    }
				    }elseif (!$usertest) {
					    echo "<p align='center'><font color=red size='3pt'>Email already used, please choose another email</font></p>";
				    }
				    } else {
    				    echo "<p align='center'><font color=red size='3pt'> Enter an valid email address</font></p>";
				    }
			    }
						//	header("Location: app.html");
		?>
				
	</body>
</html>