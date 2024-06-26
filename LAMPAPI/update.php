<?php
require 'config.php';

header("Content-Type: application/json; charset=UTF-8");

// Decode the JSON input
$data = json_decode(file_get_contents("php://input"));

$errors = array();

// Validate phone number and email
if (empty($data->phone_number) && empty($data->email_address)) {
    $errors[] = "Either phone number or email must be provided";
}

// Validate that at least one of first_name, last_name, or organization is provided
if (empty($data->first_name) && empty($data->last_name) && empty($data->organization)) {
    $errors[] = "Either first name, last name, or organization must be provided";
}

if (!empty($data->email_address) && !filter_var($data->email_address, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Invalid email format. Expected format: xxx@xxx.xxx";
}

if (!empty($data->phone_number)) {
    $phone_number = preg_replace('/[^0-9]/', '', $data->phone_number);
    if (strlen($phone_number) < 10) {
        $errors[] = "Phone number must be at least 10 digits long";
    }
}

// Connect to the database
try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(array("error" => "Connection failed: " . $e->getMessage()));
    exit();
}

// Get current contact ID
$contact_id = $data->id;

// Retrieve the user_id of the current contact
$stmt = $conn->prepare("SELECT user_id FROM Contacts WHERE id = :contact_id");
$stmt->bindParam(':contact_id', $contact_id);
$stmt->execute();
$user_id = $stmt->fetchColumn();

// Check if the phone number already exists for other contacts with the same user_id
if (!empty($data->phone_number)) {
    $stmt = $conn->prepare("SELECT COUNT(*) FROM Contacts WHERE phone_number = :phone_number AND id != :contact_id AND user_id = :user_id");
    $stmt->bindParam(':phone_number', $data->phone_number);
    $stmt->bindParam(':contact_id', $contact_id);
    $stmt->bindParam(':user_id', $user_id);
    $stmt->execute();
    if ($stmt->fetchColumn() > 0) {
        $errors[] = "Phone number already exists";
    }
}

// Check if the email address already exists for other contacts with the same user_id
if (!empty($data->email_address)) {
    $stmt = $conn->prepare("SELECT COUNT(*) FROM Contacts WHERE email_address = :email_address AND id != :contact_id AND user_id = :user_id");
    $stmt->bindParam(':email_address', $data->email_address);
    $stmt->bindParam(':contact_id', $contact_id);
    $stmt->bindParam(':user_id', $user_id);
    $stmt->execute();
    if ($stmt->fetchColumn() > 0) {
        $errors[] = "Email address already exists";
    }
}

if (!empty($data->organization) && !preg_match('/^[a-zA-Z0-9 ]*$/', $data->organization)) {
    $errors[] = "Organization must contain only letters and numbers";
}

if (!empty($data->last_name) && !preg_match('/^[a-zA-Z0-9 ]*$/', $data->last_name)) {
    $errors[] = "Last name must contain only letters and numbers";
}

if (!empty($data->first_name) && !preg_match('/^[a-zA-Z0-9 ]*$/', $data->first_name)) {
    $errors[] = "First name must contain only letters and numbers";
}

// If there are validation errors, return them as a single error message array
if (!empty($errors)) {
    echo json_encode(array("error" => $errors));
    exit();
}

// Prepare and execute the SQL statement to update the contact
try {
    $stmt = $conn->prepare("UPDATE Contacts SET organization = :organization, last_name = :last_name, first_name = :first_name, phone_number = :phone_number, email_address = :email_address, sorting_key = CONCAT(:user_id, COALESCE(:first_name, ''), COALESCE(:last_name, ''), COALESCE(:organization, ''), COALESCE(:email_address, ''), COALESCE(:phone_number, '')) WHERE id = :id");
    $stmt->bindParam(':organization', $data->organization);
    $stmt->bindParam(':last_name', $data->last_name);
    $stmt->bindParam(':first_name', $data->first_name);
    $stmt->bindParam(':phone_number', $phone_number);
    $stmt->bindParam(':email_address', $data->email_address);
    $stmt->bindParam(':user_id', $data->user_id); // Add this line to bind the user_id parameter
    $stmt->bindParam(':id', $data->id);
    $stmt->execute();    
} catch (PDOException $e) {
    echo json_encode(array("error" => "Failed to update contact: " . $e->getMessage()));
    exit();
}

// Return a successful response with an empty error message
echo json_encode(array("error" => ""));
?>