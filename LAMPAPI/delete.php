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

// Prepare and execute the SQL statement to delete the contact
try {
    $stmt = $conn->prepare("DELETE FROM Contacts WHERE id = :id");
    $stmt->bindParam(':id', $data->id);
    $stmt->execute();
} catch (PDOException $e) {
    echo json_encode(array("error" => "Failed to delete contact: " . $e->getMessage()));
    exit();
}

// Return a successful response with an empty error message
echo json_encode(array("error" => ""));
?>