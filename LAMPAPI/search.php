<?php
require 'config.php';

header("Content-Type: application/json; charset=UTF-8");

// Decode the JSON input
$data = json_decode(file_get_contents("php://input"));

// Validate input
if (!isset($data->user_id) || !isset($data->search_string)) {
    echo json_encode(array("error" => "Missing user ID or search string"));
    exit();
}

$user_id = $data->user_id;
$search_string = isset($data->search_string) ? trim($data->search_string) : '';

// Connect to the database
try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8mb4", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(array("error" => "Connection failed: " . $e->getMessage()));
    exit();
}

$sql = "SELECT * FROM contacts WHERE user_id=:user_id AND ";
$conditions = [];

$queries = explode(" ", $data->search_string);

foreach($queries as $term){
	$conditions[] = "organization LIKE '%$term%'
            OR last_name LIKE '%$term%'
            OR first_name LIKE '%$term%'
            OR phone_number LIKE '%$term%'
            OR email_address LIKE '%$term%'";
}

$sql .= implode(' AND ', $conditions);

$sql .= "ORDER BY SORTING_KEY COLLATE utf8mb4_general_ci ASC";

try {
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();
    $contacts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Process the SORTING_KEY to remove the user_id at the front
    foreach ($contacts as &$contact) {
        $user_id_length = strlen($contact['user_id']);
        $contact['SORTING_KEY'] = substr($contact['SORTING_KEY'], $user_id_length);
    }

    echo json_encode(array("contacts" => $contacts));
} catch (PDOException $e) {
    echo json_encode(array("error" => $e->getMessage()));
}
?>
