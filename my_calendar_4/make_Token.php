<?php
    session_start();

    echo json_encode(array(
        "token" => $_SESSION['token']
    ));
    exit;
?>