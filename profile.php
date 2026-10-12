<?php
// profile.php
// Returns the current player's information as JSON.

require_once "db.php";
require_once "auth.php";
require_once "goal_storage.php";

requirePlayer();

$userId = (int) $_SESSION["user_id"];

try {
    ensurePlayerGoalsTable($pdo);
} catch (PDOException $e) {
    error_log($e->getMessage());
    jsonResponse(["error" => "Your goals could not be loaded right now."], 500);
}

$stmt = $pdo->prepare(
    "SELECT
        u.UserID,
        u.Username,
        u.Email,
        u.Role,
        p.PlayerID,
        p.Player_Name,
        p.Position,
        p.Team,
        p.Profile_Image,
        p.Join_Date,
        p.Bio
     FROM users AS u
     LEFT JOIN player_profiles AS p
        ON u.UserID = p.UserID
     WHERE u.UserID = ?
     LIMIT 1"
);

$stmt->execute([$userId]);
$row = $stmt->fetch();

if (!$row) {
    jsonResponse(["error" => "Player account not found."], 404);
}

if (empty($row["PlayerID"])) {
    jsonResponse([
        "error" => "No player profile exists for this account."
    ], 404);
}

$goalStmt = $pdo->prepare(
    "SELECT goal_id, period, goal_text, accountability
     FROM player_goals
     WHERE user_id = ?
     ORDER BY FIELD(period, 'week', 'month', 'year'), created_at, goal_id"
);
$goalStmt->execute([$userId]);
$goals = array_map(
    static function ($goal) {
        return [
            "id" => (int) $goal["goal_id"],
            "period" => $goal["period"],
            "title" => $goal["goal_text"],
            "accountability" => $goal["accountability"]
        ];
    },
    $goalStmt->fetchAll()
);

// Use the image filename stored in the database.
// Put uploaded images inside the project's uploads folder.
$image = trim((string) ($row["Profile_Image"] ?? ""));

if ($image !== "" && !preg_match("~^https?://~i", $image)) {
    $image = "uploads/" . basename($image);
}

if ($image === "") {
    $image = "https://api.dicebear.com/9.x/adventurer/svg?seed="
        . rawurlencode($row["Username"]);
}

$joined = "—";

if (!empty($row["Join_Date"])) {
    $timestamp = strtotime($row["Join_Date"]);

    if ($timestamp !== false) {
        $joined = date("d/m/Y", $timestamp);
    }
}

jsonResponse([
    "userId" => (int) $row["UserID"],
    "playerId" => (int) $row["PlayerID"],
    "username" => $row["Player_Name"],
    "accountUsername" => $row["Username"],
    "email" => $row["Email"],
    "bio" => $row["Bio"] ?? "",
    "position" => $row["Position"] ?? "Not set",
    "team" => $row["Team"] ?? "",
    "ageGroup" => "U18",
    "joined" => $joined,
    "avatar" => $image,

    "goals" => $goals,
    "achievements" => [],

    "csrfToken" => getCsrfToken()
]);