<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
// Database connection
$servername = "YOUR_SERVERNAME";
$username = "YOUR_USERNAME";
$password = "YOUR_PASSWORD";
$dbname = "YOUR_DBNAME";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}
?>
