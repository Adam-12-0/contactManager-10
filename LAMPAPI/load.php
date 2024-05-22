<?php
require 'config.php';

header("Content-Type: application/json; charset=UTF-8");

// Decode the JSON input
$data = json_decode(file_get_contents("php://input"));

// Validate input
if (!isset($data->user_id)) {
    echo json_encode(array("error" => "Missing user ID"));
    exit();
}

$user_id = $data->user_id;

// Connect to the database
try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8mb4", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(array("error" => "Connection failed: " . $e->getMessage()));
    exit();
}

// Query to load contacts
$sql = "SELECT id, organization, last_name, first_name, phone_number, email_address, user_id 
        FROM Contacts 
        WHERE user_id = :user_id 
        ORDER BY SORTING_KEY COLLATE utf8mb4_general_ci ASC";

try {
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();
    $contacts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(array("contacts" => $contacts));
} catch (PDOException $e) {
    echo json_encode(array("error" => $e->getMessage()));
}
?>