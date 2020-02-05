<?php
// creates a class for validation
class validation {
    // checks if email is valid
	public function emailValidation($email){
		if(filter_var($email, FILTER_VALIDATE_EMAIL)){
			return true;
		}else{
			return false;
		}
	
	}
	// checks the length of password sees if it meets the requrments
	public function password_strength($pass) {
	    $passwordlen = 8;

	    $validation = true;
	    if ( strlen($pass) < $passwordlen ) {
		    $validation = false;
	    }
	    if ( !preg_match("#[0-9]+#", $pass) ) {
		    $validation = false;
	    }
	    if ( !preg_match("#[a-z]+#", $pass) ) {
		    $validation = false;
	    }
	    if ( !preg_match("#[A-Z]+#", $pass) ) {
		    $validation = false;
	    }
	    if ( !preg_match("/[\'^£$%&*()}{@#~?><>,|=_+!-]/", $pass) ) {
		    $validation = false;
	    }
	return $validation;
    }
}
?>