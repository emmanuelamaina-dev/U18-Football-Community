
<?php
// progress.php
// Returns progress records for the logged-in player as JSON.

require_once "db.php";
require_once "auth.php";

requirePlayer();

$userId = (int) $_SESSION["user_id"];

try {
    // Find the PlayerID belonging to the logged-in account.
    $playerStmt = $pdo->prepare(
        "SELECT PlayerID
         FROM player_profiles
         WHERE UserID = ?
         LIMIT 1"
    );

    $playerStmt->execute([$userId]);
    $player = $playerStmt->fetch();

    if (!$player) {
        jsonResponse([
            "error" => "No player profile exists for this account."
        ], 404);
    }

    $playerId = (int) $player["PlayerID"];

    // Retrieve only this player's progress records.
    $stmt = $pdo->prepare(
        "SELECT
            ProgressID,
            Goal,
            Development_Area,
            Milestone,
            Progress_Status,
            Progress_Percentage,
            Progress_Date,
            Notes
         FROM Progress
         WHERE PlayerID = ?
         ORDER BY Progress_Date DESC"
    );

    $stmt->execute([$playerId]);
    $records = $stmt->fetchAll();

    // Calculate average progress from the player's actual records.
    $total = count($records);
    $sum = 0;

    foreach ($records as $record) {
        $sum += (int) $record["Progress_Percentage"];
    }

    $average = $total > 0
        ? (int) round($sum / $total)
        : 0;

    jsonResponse([
        "success" => true,
        "overallProgress" => $average,
        "totalGoals" => $total,
        "completedGoals" => count(array_filter(
            $records,
            static fn($record) =>
                strtolower($record["Progress_Status"]) === "completed"
        )),
        "progress" => $records
    ]);

} catch (PDOException $e) {
    error_log($e->getMessage());

    jsonResponse([
        "error" => "Unable to load progress records."
    ], 500);
}

