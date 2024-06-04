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

// Check if the username already exists
$stmt = $conn->prepare("SELECT * FROM users WHERE username = :username");
$stmt->bindParam(':username', $data->username);
$stmt->execute();
$result = $stmt->fetch(PDO::FETCH_ASSOC);

if ($result) {
    echo json_encode(array("error" => "Username already exists"));
    exit();
}

if (!preg_match('/[a-z]/', $data->password) || !preg_match('/[A-Z]/', $data->password) || !preg_match('/[0-9]/', $data->password))
{
	echo json_encode(array("error" => "Password must contain at least one upper-case letter, one lower-case letter, and one numerical character"));
    exit();
}

// Hash the password before storing
$hashedPassword = md5($data->password);

// Insert the new user
try {
    $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (:username, :password)");
    $stmt->bindParam(':username', $data->username);
    $stmt->bindParam(':password', $hashedPassword);
    $stmt->execute();
    echo json_encode(array("error" => ""));
} catch (PDOException $e) {
    echo json_encode(array("error" => "Registration failed: " . $e->getMessage()));
}
?>