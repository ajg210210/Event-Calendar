<?php
    require 'database.php';
    ini_set("session.cookie_httponly", 1);
    session_start();
    header("Content-Type: application/json");



    $json_str = file_get_contents('php://input');
    //storing data
    $json_obj = json_decode($json_str, true); 
    $username = $json_obj['username'];
    $password = $json_obj['password'];
    /**if(preg_match('/\s+/', $username) || empty($username) || empty($password)){
        echo json_encode(array(
        "success" => false,
        "message" => "Bad username format"
	    ));
        exit;
    }
**/
    $hashed_password = password_hash($password, PASSWORD_BCRYPT);//hash the password
    $stmt = $mysqli->prepare("insert into users (username, password) values (?,?)");
    if(!$stmt){
        echo json_encode(array(
        "success" => false,
        "message" => "Failure to prepare query"
	    ));
        exit;
    }

    $stmt->bind_param('ss', $username, $hashed_password);
    if($stmt->execute()){
        $stmt->close();
        ini_set("session.cookie_httponly", 1);
        $_SESSION['username'] = $username;
        $_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32)); 
        $stmt = $mysqli->prepare("SELECT id FROM users WHERE username=?");
        $stmt->bind_param('s', $username);
        $stmt->execute();
        $stmt->bind_result($user_id);
        $stmt->fetch();
        $stmt->close();
        $_SESSION['user_id'] = $user_id;
        echo json_encode(array(
            "success" => true
        ));
        exit;
    }

    $stmt->close();
    session_destroy();
    echo json_encode(array(
		"success" => false,
		"message" => "The username has already been taken"
    ));
    exit;
?>