
<?php
// development-areas.php

require_once "db.php";
require_once "auth.php";

requirePlayer();

$userId = (int) $_SESSION["user_id"];

try {
    // Find the signed-in player's profile.
    $profileQuery = $pdo->prepare("
        SELECT PlayerID
        FROM player_profiles
        WHERE UserID = :user_id
        LIMIT 1
    ");

    $profileQuery->execute([
        "user_id" => $userId
    ]);

    $profile = $profileQuery->fetch(PDO::FETCH_ASSOC);

    if (!$profile) {
        http_response_code(404);
        exit("Player profile not found.");
    }

    $playerId = (int) $profile["PlayerID"];

    // Retrieve all development records belonging to this player.
    $progressQuery = $pdo->prepare("
        SELECT
            ProgressID,
            Goal,
            Development_Area,
            Milestone,
            Progress_Status,
            Progress_Percentage,
            Progress_Date,
            Notes
        FROM Progress
        WHERE PlayerID = :player_id
        ORDER BY Progress_Date DESC, ProgressID DESC
    ");

    $progressQuery->execute([
        "player_id" => $playerId
    ]);

    $developmentAreas = $progressQuery->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    error_log("Development areas error: " . $e->getMessage());
    http_response_code(500);
    exit("Unable to load development areas. Please try again later.");
}

// Safely display database values in HTML.
function escapeOutput($value) {
    return htmlspecialchars(
        (string) ($value ?? ""),
        ENT_QUOTES,
        "UTF-8"
    );
}

function displayDate($date) {
    if (empty($date)) {
        return "Date not recorded";
    }

    $timestamp = strtotime($date);

    return $timestamp
        ? date("d M Y", $timestamp)
        : "Date not recorded";
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Development Areas | GameHub</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Open+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet">

    <style>
        :root {
            --green: #16834a;
            --green-dark: #105d37;
            --green-light: #e7f6ec;
            --blue: #2879b9;
            --coral: #f27d72;
            --gold: #e9b949;
            --text: #24352d;
            --muted: #718078;
            --border: #e2ebe5;
            --surface: #ffffff;
            --background: #f4f8f5;
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            background: var(--background);
            color: var(--text);
            font-family: "Open Sans", sans-serif;
        }

        a {
            color: inherit;
            text-decoration: none;
        }

        .topbar {
            background: var(--green);
            color: white;
            padding: 16px 6%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 20px;
            flex-wrap: wrap;
        }

        .brand {
            font-family: "Bebas Neue", sans-serif;
            font-size: 30px;
            letter-spacing: 1px;
        }

        .back-link {
            background: rgba(255,255,255,.15);
            border: 1px solid rgba(255,255,255,.3);
            border-radius: 8px;
            padding: 10px 14px;
            font-size: 13px;
        }

        .page-container {
            width: min(1100px, 92%);
            margin: 35px auto 60px;
        }

        .page-heading {
            margin-bottom: 26px;
        }

        .eyebrow {
            color: var(--green);
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 1.5px;
            text-transform: uppercase;
        }

        h1, h2 {
            font-family: "Bebas Neue", sans-serif;
            letter-spacing: .5px;
        }

        h1 {
            font-size: clamp(36px, 5vw, 48px);
            margin: 8px 0;
        }

        .page-heading p {
            color: var(--muted);
            line-height: 1.7;
            margin: 0;
        }

        .summary-card {
            background: var(--green-light);
            border: 1px solid #cfe9d7;
            border-radius: 14px;
            padding: 20px 22px;
            margin-bottom: 25px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            flex-wrap: wrap;
        }

        .summary-card strong {
            display: block;
            color: var(--green-dark);
            font-size: 14px;
        }

        .summary-card span {
            display: block;
            margin-top: 5px;
            font-size: 13px;
            color: #52725f;
        }

        .record-count {
            background: white;
            padding: 9px 13px;
            border-radius: 20px;
            font-weight: 700;
            font-size: 12px;
            color: var(--green-dark);
        }

        .development-list {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 20px;
        }

        .development-card {
            min-width: 0;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 15px;
            padding: 22px;
            box-shadow: 0 4px 14px rgba(25, 70, 43, .04);
        }

        .card-top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 12px;
        }

        .area-label {
            display: inline-block;
            background: #eaf2ff;
            color: var(--blue);
            padding: 5px 9px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
        }

        .percentage {
            color: var(--green);
            font-size: 20px;
            font-weight: 700;
            white-space: nowrap;
        }

        .development-card h2 {
            font-size: 25px;
            margin: 15px 0 8px;
            overflow-wrap: anywhere;
        }

        .milestone {
            color: var(--muted);
            font-size: 13px;
            line-height: 1.7;
            overflow-wrap: anywhere;
        }

        .progress-track {
            height: 9px;
            background: #e8eee9;
            border-radius: 10px;
            overflow: hidden;
            margin: 18px 0;
        }

        .progress-fill {
            height: 100%;
            background: var(--green);
            border-radius: 10px;
        }

        .record-detail {
            border-top: 1px solid var(--border);
            padding-top: 13px;
            margin-top: 12px;
            font-size: 13px;
            line-height: 1.7;
            overflow-wrap: anywhere;
        }

        .record-detail strong {
            color: #43584b;
        }

        .status {
            display: inline-block;
            background: #fff3d7;
            color: #896312;
            padding: 5px 9px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 700;
        }

        .notes {
            background: #f7faf8;
            padding: 12px;
            border-radius: 8px;
            margin-top: 14px;
            font-size: 12px;
            line-height: 1.7;
            overflow-wrap: anywhere;
        }

        .empty-state {
            grid-column: 1 / -1;
            background: white;
            border: 1px dashed #b9d5c2;
            border-radius: 14px;
            text-align: center;
            padding: 45px 20px;
        }

        .empty-state h2 {
            font-size: 28px;
            margin: 0 0 8px;
        }

        .empty-state p {
            color: var(--muted);
            font-size: 13px;
            line-height: 1.7;
        }

        footer {
            background: #105d37;
            color: white;
            padding: 25px 6%;
            text-align: center;
            font-size: 12px;
            line-height: 1.8;
        }

        @media (max-width: 700px) {
            .development-list {
                grid-template-columns: minmax(0, 1fr);
            }

            .page-container {
                margin-top: 25px;
            }
        }
    </style>
</head>

<body>

<header class="topbar">
    <a href="text.html" class="brand">GameHub</a>
    <a href="text.html" class="back-link">← Back to dashboard</a>
</header>

<main class="page-container">

    <div class="page-heading">
        <span class="eyebrow">Player development</span>
        <h1>Development Areas</h1>
        <p>
            Review your goals, track your milestones and see how your
            development is progressing over time.
        </p>
    </div>

    <section class="summary-card">
        <div>
            <strong>Your development journey</strong>
            <span>All development records saved to your player profile.</span>
        </div>

        <div class="record-count">
            <?= count($developmentAreas) ?>
            <?= count($developmentAreas) === 1 ? "record" : "records" ?>
        </div>
    </section>

    <section class="development-list">

        <?php if (empty($developmentAreas)): ?>

            <div class="empty-state">
                <h2>No development areas yet</h2>
                <p>
                    Your development records will appear here once
                    progress has been added to your profile.
                </p>
            </div>

        <?php else: ?>

            <?php foreach ($developmentAreas as $area): ?>

                <?php
                    $percentage = max(
                        0,
                        min(100, (int) ($area["Progress_Percentage"] ?? 0))
                    );

                    $status = $area["Progress_Status"] ?? "Not specified";
                ?>

                <article class="development-card">

                    <div class="card-top">
                        <span class="area-label">
                            <?= escapeOutput(
                                $area["Development_Area"] ?: "General"
                            ) ?>
                        </span>

                        <span class="percentage">
                            <?= $percentage ?>%
                        </span>
                    </div>

                    <h2>
                        <?= escapeOutput(
                            $area["Goal"] ?: "Development goal"
                        ) ?>
                    </h2>

                    <div class="milestone">
                        <strong>Milestone:</strong>
                        <?= escapeOutput(
                            $area["Milestone"] ?: "No milestone recorded"
                        ) ?>
                    </div>

                    <div
                        class="progress-track"
                        role="progressbar"
                        aria-label="Goal completion"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-valuenow="<?= $percentage ?>"
                    >
                        <div
                            class="progress-fill"
                            style="width: <?= $percentage ?>%;"
                        ></div>
                    </div>

                    <div class="record-detail">
                        <strong>Status:</strong>
                        <span class="status">
                            <?= escapeOutput($status) ?>
                        </span>
                    </div>

                    <div class="record-detail">
                        <strong>Last recorded:</strong>
                        <?= escapeOutput(
                            displayDate($area["Progress_Date"] ?? null)
                        ) ?>
                    </div>

                    <?php if (!empty($area["Notes"])): ?>
                        <div class="notes">
                            <strong>Notes</strong><br>
                            <?= nl2br(escapeOutput($area["Notes"])) ?>
                        </div>
                    <?php endif; ?>

                </article>

            <?php endforeach; ?>

        <?php endif; ?>

    </section>

</main>

<footer>
    <strong>GameHub</strong><br>
    Keep learning, keep improving, and lift others up.
</footer>

</body>
</html>
