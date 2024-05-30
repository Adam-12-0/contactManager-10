<?php
header('Content-Type: application/json');

// Database connection
$servername = "YOUR_SERVERNAME";
$username = "YOUR_USERNAME";
$password = "YOUR_PASSWORD";
$dbname = "YOUR_DBNAME";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Additional code to handle registration or login can be added here

echo json_encode(["success" => "Connected successfully"]);
?>
