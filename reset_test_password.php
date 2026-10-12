<?php
require_once "db.php";

// Change this to your own test account's username.
$username = "ella_player";

// Choose a new temporary password.
$newPassword = "TestPassword123!";

$newHash = password_hash($newPassword, PASSWORD_DEFAULT);

$stmt = $pdo->prepare(
    "UPDATE Users
     SET Password_Hash = ?
     WHERE Username = ?"
);

$stmt->execute([$newHash, $username]);

echo $stmt->rowCount() === 1
    ? "Test account password updated successfully."
    : "Account not found or no change made.";