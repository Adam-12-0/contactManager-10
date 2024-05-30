<?php
header('Content-Type: application/json');

// Database connection details
$servername = "YOUR_SERVERNAME";
$username = "YOUR_USERNAME";
$password = "YOUR_PASSWORD";
$dbname = "YOUR_DBNAME";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit();
} else {
    echo json_encode(["success" => "Connected successfully"]);
}

// Close the connection
$conn->close();
?>
