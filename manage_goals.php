<?php
require_once "db.php";
require_once "auth.php";
require_once "goal_storage.php";

requirePlayer();

try {
    ensurePlayerGoalsTable($pdo);
} catch (PDOException $e) {
    error_log($e->getMessage());
    jsonResponse(["error" => "Goals are temporarily unavailable."], 500);
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    jsonResponse(["error" => "POST request required."], 405);
}

verifyCsrfToken();

$data = json_decode(file_get_contents("php://input"), true);

if (!is_array($data)) {
    jsonResponse(["error" => "Invalid request data."], 400);
}

$userId = (int) $_SESSION["user_id"];
$action = $data["action"] ?? "";

if (!is_string($action)) {
    jsonResponse(["error" => "Choose a valid goal action."], 422);
}

if ($action === "delete") {
    $goalId = filter_var($data["goalId"] ?? null, FILTER_VALIDATE_INT);

    if (!$goalId || $goalId < 1) {
        jsonResponse(["error" => "Choose a valid goal to delete."], 422);
    }

    $stmt = $pdo->prepare(
        "DELETE FROM player_goals WHERE goal_id = ? AND user_id = ?"
    );
    $stmt->execute([$goalId, $userId]);

    if ($stmt->rowCount() !== 1) {
        jsonResponse(["error" => "That goal could not be found."], 404);
    }

    jsonResponse(["success" => true]);
}

if ($action !== "save") {
    jsonResponse(["error" => "Choose a valid goal action."], 422);
}

$goalId = null;
if (isset($data["goalId"]) && $data["goalId"] !== "") {
    $goalId = filter_var($data["goalId"], FILTER_VALIDATE_INT);

    if (!$goalId || $goalId < 1) {
        jsonResponse(["error" => "Choose a valid goal to edit."], 422);
    }
}

$period = $data["period"] ?? "";
$goal = $data["goal"] ?? "";
$accountability = $data["accountability"] ?? "";
$allowedPeriods = ["week", "month", "year"];

if (!is_string($period) || !in_array($period, $allowedPeriods, true)) {
    jsonResponse(["error" => "Choose a weekly, monthly, or yearly goal."], 422);
}

if (!is_string($goal) || !is_string($accountability)) {
    jsonResponse(["error" => "Enter valid goal details."], 422);
}

$goal = trim($goal);
$accountability = trim($accountability);

if ($goal === "" || strlen($goal) > 250) {
    jsonResponse(["error" => "Enter a goal of no more than 250 characters."], 422);
}

if ($accountability === "" || strlen($accountability) > 100) {
    jsonResponse([
        "error" => "Enter an accountability partner of no more than 100 characters."
    ], 422);
}

if ($goalId !== null) {
    $stmt = $pdo->prepare(
        "UPDATE player_goals
         SET period = ?, goal_text = ?, accountability = ?
         WHERE goal_id = ? AND user_id = ?"
    );
    $stmt->execute([$period, $goal, $accountability, $goalId, $userId]);

    if ($stmt->rowCount() === 0) {
        $check = $pdo->prepare(
            "SELECT goal_id FROM player_goals
             WHERE goal_id = ? AND user_id = ? LIMIT 1"
        );
        $check->execute([$goalId, $userId]);

        if (!$check->fetch()) {
            jsonResponse(["error" => "That goal could not be found."], 404);
        }
    }
} else {
    $stmt = $pdo->prepare(
        "INSERT INTO player_goals
            (user_id, period, goal_text, accountability)
         VALUES (?, ?, ?, ?)"
    );
    $stmt->execute([$userId, $period, $goal, $accountability]);
    $goalId = (int) $pdo->lastInsertId();
}

jsonResponse([
    "success" => true,
    "goal" => [
        "id" => (int) $goalId,
        "period" => $period,
        "title" => $goal,
        "accountability" => $accountability
    ]
]);
