<?php
    require 'database.php';
    ini_set("session.cookie_httponly", 1);
    session_start();

    header("Content-Type: application/json");

    $json_str = file_get_contents('php://input');

    $json_obj = json_decode($json_str, true);

    $eventId = $json_obj['eventId'];
    $token = $json_obj['token'];

    if(!hash_equals($_SESSION['token'], $token)){
        die("Request forgery detected");
    }

    $stmt = $mysqli->prepare("SELECT title, DATE(date_time), TIME(date_time), priority from events where id=?");

    $stmt->bind_param('s', $eventId);
    $stmt->bind_result($title, $date, $time, $priority);

    if($stmt->execute()){
        if($stmt->fetch()){
           echo json_encode(array(
            "success" => true,
            "title" => htmlentities($title),
            "date" => htmlentities($date),
            "time" => htmlentities($time),
            "priority" => htmlentities($priority),
        ));
        $stmt->close();
        exit; 
        }
    }
    echo json_encode(array(
        "success" => false,
        "message" => "Query failed"
    ));

    $stmt->close();
    exit;
?>