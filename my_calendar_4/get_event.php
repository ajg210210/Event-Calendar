<?php
    require 'database.php';
    ini_set("session.cookie_httponly", 1);
    session_start();
    header("Content-Type: application/json");

    $json_str = file_get_contents('php://input');
    $json_obj = json_decode($json_str, true);
    
    $month = $json_obj['month'];
    $date = $json_obj['date'];
    $year = $json_obj['year'];
    $priority = $json_obj['priority'];
    $dateInput = sprintf('%s-%s-%s', $year, $month, $date);

    
    if(!isset($_SESSION['username']) ){ //is user logged in
        $stmt = $mysqli->prepare("SELECT id, title, TIME(date_time), DATE(date_time), priority from events 
        where (DATE(date_time)=? and id=user_id)
        order by date_time asc");

        $stmt->bind_param('s', $dateInput);
        $stmt->bind_result($id, $title, $time, $dateOutput, $priority);
        $stmt-> execute();

        $jsonArr = array();
        while($stmt->fetch()){
            array_push($jsonArr, array(
                "id" => $id,
                "title" => htmlentities($title),
                "time" => htmlentities($time),
                "date" => htmlentities($dateOutput),
                "priority" => htmlentities($priority),
            ));
        
        }
        $stmt->close();
        echo json_encode($jsonArr);
        exit;
    }
    else{
    //IF USER IS NOT LOGGED IN:
    $stmt = $mysqli->prepare("SELECT id, title, TIME(date_time), DATE(date_time), priority from events 
    where ((user_id=?) and DATE(date_time)=?)
    order by date_time asc");

    $stmt->bind_param('ss', $_SESSION['user_id'], $dateInput);
    $stmt->bind_result($id, $title, $time, $dateOutput, $priority);
    $stmt-> execute();

    $jsonArr = array();
    while($stmt->fetch()){
        array_push($jsonArr, array(
            "id" => $id,
            "title" => htmlentities($title),
            "time" => htmlentities($time),
            "date" => htmlentities($dateOutput),
            "priority" => htmlentities($priority),
        ));
    }
    $stmt->close();
    echo json_encode($jsonArr);
    exit;
    }
?>