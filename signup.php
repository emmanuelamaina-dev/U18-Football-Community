<?php
// signup.php

require_once "db.php";
require_once "auth.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: signup.html");
    exit;
}

$username = trim($_POST["username"] ?? "");
$email = trim($_POST["email"] ?? "");
$password = $_POST["password"] ?? "";
$confirmPassword = $_POST["confirm_password"] ?? "";

$fullName = trim($_POST["full_name"] ?? $username);

$allowedPositions = [
    "Goalkeeper",
    "Defender",
    "Midfielder",
    "Striker",
    "Winger"
];

$position = $_POST["position"] ?? "Midfielder";

if (!in_array($position, $allowedPositions, true)) {
    $position = "Midfielder";
}

if (
    $username === "" ||
    strlen($username) > 50 ||
    !filter_var($email, FILTER_VALIDATE_EMAIL) ||
    strlen($email) > 254 ||
    strlen($password) < 8 ||
    $password !== $confirmPassword ||
    $fullName === "" ||
    strlen($fullName) > 100
) {
    header("Location: signup.html?error=invalid");
    exit;
}

try {
    $pdo->beginTransaction();

    // Check for an existing username or email.
    $check = $pdo->prepare(
        "SELECT UserID
         FROM users
         WHERE Username = ? OR Email = ?
         LIMIT 1"
    );

    $check->execute([$username, $email]);

    if ($check->fetch()) {
        $pdo->rollBack();

        header("Location: signup.html?error=exists");
        exit;
    }

    // Create the account.
    $passwordHash = password_hash(
        $password,
        PASSWORD_DEFAULT
    );

    $insertUser = $pdo->prepare(
        "INSERT INTO users
            (Username, Email, Password_Hash, Role)
         VALUES (?, ?, ?, 'Player')"
    );

    $insertUser->execute([
        $username,
        $email,
        $passwordHash
    ]);

    $userId = (int) $pdo->lastInsertId();

    // Create the matching player profile.
    $insertProfile = $pdo->prepare(
        "INSERT INTO player_profiles
            (UserID, Player_Name, Position, Team,
             Profile_Image, Join_Date, Bio)
         VALUES (?, ?, ?, ?, ?, NOW(), ?)"
    );

    $insertProfile->execute([
        $userId,
        $fullName,
        $position,
        "U18 Community Team",
        "",
        "Welcome to the U18 Football Community!"
    ]);

    $pdo->commit();

    header("Location: login.html?registered=1");
    exit;

} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    error_log("Registration error: " . $e->getMessage());

    http_response_code(500);
    exit(
        "Registration could not be completed. " .
        "Check the PHP error log and database column requirements."
    );
}