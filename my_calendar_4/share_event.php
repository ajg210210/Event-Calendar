<?php
    require 'database.php';
    ini_set("session.cookie_httponly", 1);
    session_start();

    header("Content-Type: application/json");
    $json_str = file_get_contents('php://input');
    $json_obj = json_decode($json_str, true);

    $username = $json_obj['username'];
    $title = $json_obj['title'];
    $date = $json_obj['date'];
    $time = $json_obj['time'];
    $priority = $json_obj['priority'];
    $dateTime = sprintf('%s %s', $date, $time);
    


    if(!hash_equals($_SESSION['token'], $token)){
        die("Request forgery detected");
    }

    $stmt = $mysqli->prepare("INSERT into events (title, date_time, user_id, priority) VALUES (?,?,?,?)");
    $stmt->bind_param('ssss', $title, $dateTime, $username, $priority);
    if($stmt->execute()){
        echo json_encode(array(
            "success" => true
        ));
        $stmt->close();
        exit;
    }
      echo json_encode(array(
        "success" => false,
        "message" => "Query failed"
    ));

    $stmt->close();
    exit;
?>