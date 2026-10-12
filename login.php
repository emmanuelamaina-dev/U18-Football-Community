<?php
// login.php

require_once "db.php";
require_once "auth.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: login.html");
    exit;
}

$login = trim($_POST["username"] ?? "");
$password = $_POST["password"] ?? "";

if ($login === "" || $password === "") {
    header("Location: login.html?error=invalid");
    exit;
}

$stmt = $pdo->prepare(
    "SELECT UserID, Username, Email, Password_Hash, Role
     FROM users
     WHERE Username = ? OR Email = ?
     LIMIT 1"
);

$stmt->execute([$login, $login]);
$user = $stmt->fetch();

if (
    !$user ||
    !password_verify($password, $user["Password_Hash"])
) {
    header("Location: login.html?error=invalid");
    exit;
}

// Only player accounts use this player profile page.
if ($user["Role"] !== "Player") {
    header("Location: login.html?error=wrong_role");
    exit;
}

session_regenerate_id(true);

$_SESSION["user_id"] = (int) $user["UserID"];
$_SESSION["username"] = $user["Username"];
$_SESSION["role"] = $user["Role"];

getCsrfToken();

header("Location: profile.html");
exit;