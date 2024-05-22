<?php
require 'config.php';

header("Content-Type: application/json; charset=UTF-8");

// Decode the JSON input
$data = json_decode(file_get_contents("php://input"));

$errors = array();

// Connect to the database
try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(array("error" => "Connection failed: " . $e->getMessage()));
    exit();
}

// Validate phone number and email
if (empty($data->phone_number) && empty($data->email_address)) {
    $errors[] = array("field" => "phone_number_email", "error" => "Either phone number or email must be provided");
}

if (!empty($data->email_address) && !filter_var($data->email_address, FILTER_VALIDATE_EMAIL)) {
    $errors[] = array("field" => "email_address", "error" => "Invalid email format. Expected format: xxx@xxx.xxx");
}

if (!empty($data->phone_number)) {
    $phone_number = preg_replace('/[^0-9]/', '', $data->phone_number);
    if (strlen($phone_number) < 10) {
        $errors[] = array("field" => "phone_number", "error" => "Phone number must be at least 10 digits long");
    }
}

// Check if the phone number or email already exists for the current user
if (!empty($data->phone_number)) {
    $stmt = $conn->prepare("SELECT COUNT(*) FROM Contacts WHERE phone_number = :phone_number AND user_id = :user_id");
    $stmt->bindParam(':phone_number', $phone_number);
    $stmt->bindParam(':user_id', $data->user_id);
    $stmt->execute();
    if ($stmt->fetchColumn() > 0) {
        $errors[] = array("field" => "phone_number", "error" => "Phone number already exists");
    }
}

if (!empty($data->email_address)) {
    $stmt = $conn->prepare("SELECT COUNT(*) FROM Contacts WHERE email_address = :email_address AND user_id = :user_id");
    $stmt->bindParam(':email_address', $data->email_address);
    $stmt->bindParam(':user_id', $data->user_id);
    $stmt->execute();
    if ($stmt->fetchColumn() > 0) {
        $errors[] = array("field" => "email_address", "error" => "Email address already exists");
    }
}

if (!empty($data->organization) && !preg_match('/^[a-zA-Z0-9 ]*$/', $data->organization)) {
    $errors[] = array("field" => "organization", "error" => "Organization must contain only letters and numbers");
}

if (!empty($data->last_name) && !preg_match('/^[a-zA-Z0-9 ]*$/', $data->last_name)) {
    $errors[] = array("field" => "last_name", "error" => "Last name must contain only letters and numbers");
}

if (!empty($data->first_name) && !preg_match('/^[a-zA-Z0-9 ]*$/', $data->first_name)) {
    $errors[] = array("field" => "first_name", "error" => "First name must contain only letters and numbers");
}

// If there are validation errors, return them
if (!empty($errors)) {
    echo json_encode(array("error" => $errors));
    exit();
}

// Prepare and execute the SQL statement to insert the new contact
try {
    $stmt = $conn->prepare("INSERT INTO Contacts (organization, last_name, first_name, phone_number, email_address, user_id, sorting_key) VALUES (:organization, :last_name, :first_name, :phone_number, :email_address, :user_id, CONCAT_WS(' ', :organization, :last_name, :first_name, :email_address, :phone_number))");
    $stmt->bindParam(':organization', $data->organization);
    $stmt->bindParam(':last_name', $data->last_name);
    $stmt->bindParam(':first_name', $data->first_name);
    $stmt->bindParam(':phone_number', $phone_number);
    $stmt->bindParam(':email_address', $data->email_address);
    $stmt->bindParam(':user_id', $data->user_id);
    $stmt->execute();
} catch (PDOException $e) {
    echo json_encode(array("error" => "Failed to add contact: " . $e->getMessage()));
    exit();
}

// Return a successful response with an empty error message
echo json_encode(array("error" => ""));
?>