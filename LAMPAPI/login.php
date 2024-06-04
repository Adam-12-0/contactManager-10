<?php
require 'config.php';

header("Content-Type: application/json; charset=UTF-8");

// Decode the JSON input
$data = json_decode(file_get_contents("php://input"));

// Connect to the database
try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(array("error" => "Connection failed: " . $e->getMessage()));
    exit();
}

// Check if the username exists
$stmt = $conn->prepare("SELECT * FROM users WHERE username = :username");
$stmt->bindParam(':username', $data->username);
$stmt->execute();
$result = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$result) {
    echo json_encode(array("error" => "Username does not exist"));
    exit();
}

// Verify the password
if ($result['password'] !== md5($data->password)) {
    echo json_encode(array("error" => "Incorrect password"));
    exit();
}

// Return the user ID if login is successful
echo json_encode(array("error" => "", "user_id" => $result['id']));
?>