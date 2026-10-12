
<?php
// update_profile.php

require_once "db.php";
require_once "auth.php";

requirePlayer();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    jsonResponse(["error" => "POST request required."], 405);
}

verifyCsrfToken();

$data = json_decode(
    file_get_contents("php://input"),
    true
);

if (!is_array($data)) {
    jsonResponse(["error" => "Invalid request data."], 400);
}

$name = trim((string) ($data["username"] ?? ""));
$bio = trim((string) ($data["bio"] ?? ""));
$position = trim((string) ($data["position"] ?? ""));

$allowedPositions = [
    "Goalkeeper",
    "Defender",
    "Midfielder",
    "Striker",
    "Winger"
];

if ($name === "" || strlen($name) > 100) {
    jsonResponse([
        "error" => "Enter a name of no more than 100 characters."
    ], 422);
}

if (strlen($bio) > 1000) {
    jsonResponse([
        "error" => "Your bio must be 1000 characters or fewer."
    ], 422);
}

if (!in_array($position, $allowedPositions, true)) {
    jsonResponse([
        "error" => "Choose a valid football position."
    ], 422);
}

$userId = (int) $_SESSION["user_id"];

$stmt = $pdo->prepare(
    "UPDATE player_profiles
     SET Player_Name = ?, Bio = ?, Position = ?
     WHERE UserID = ?"
);

$stmt->execute([
    $name,
    $bio,
    $position,
    $userId
]);

if ($stmt->rowCount() === 0) {
    // A zero row count can also mean that values were unchanged.
    $check = $pdo->prepare(
        "SELECT PlayerID
         FROM player_profiles
         WHERE UserID = ?
         LIMIT 1"
    );

    $check->execute([$userId]);

    if (!$check->fetch()) {
        jsonResponse([
            "error" => "Your player profile could not be found."
        ], 404);
    }
}

jsonResponse([
    "success" => true,
    "message" => "Profile saved successfully."
]);