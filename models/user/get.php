<?php

$email = $_POST['email'];
$password = $_POST['password'];

$getUser = $dbq->prepare("SELECT * FROM user WHERE email=:email AND passwordValue=:password AND authorityLevel != 2");
$getUser->bindValue(':email', $email, PDO::PARAM_STR);
$getUser->bindValue(':password', $password, PDO::PARAM_STR);
$getUser->execute();
$numberOfRows = $dbq->query("SELECT FOUND_ROWS();");
$numberOfRows = $numberOfRows->fetchColumn();
if ($numberOfRows == 1) {
    $data['user'] = $getUser->fetch();
} else {
    $data['user'] = false;
}

$getUser->closeCursor();


header('Content-Type: application/json');
echo json_encode($data, TRUE);
?>