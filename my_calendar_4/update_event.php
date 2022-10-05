<?php
    require 'database.php';
    ini_set("session.cookie_httponly", 1);
    session_start();

    header("Content-Type: application/json");

    $json_str = file_get_contents('php://input');

    $json_obj = json_decode($json_str, true);

    $eventId = $json_obj['eventId'];
    $title = $json_obj['title'];
    $date = $json_obj['date'];
    $time = $json_obj['time'];
    $token = $json_obj['token'];
    $priority = $json_obj['priority'];

    if(!hash_equals($_SESSION['token'], $token)){
        die("Request forgery detected");
    }

    $dateTime = sprintf('%s %s', $date, $time);

    $stmt = $mysqli->prepare("UPDATE events set title=?, date_time=?, priority=? where id=?");

    $stmt->bind_param('ssss', $title, $dateTime, $priority, $eventId);

    if($stmt->execute()){
        echo json_encode(array(
            "success" => true,
            "title" => $title,
            "date" => $date,
            "time" => $time,
            "priority" => $priority,
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