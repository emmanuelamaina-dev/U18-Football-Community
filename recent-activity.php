
<?php
// recent-activity.php

require_once "db.php";
require_once "auth.php";

requirePlayer();

$userId = (int) $_SESSION["user_id"];

try {
    // Find the player associated with the signed-in user.
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

    // Retrieve this player's progress history.
    $activityQuery = $pdo->prepare("
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

    $activityQuery->execute([
        "player_id" => $playerId
    ]);

    $activities = $activityQuery->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    error_log("Recent activity error: " . $e->getMessage());
    http_response_code(500);
    exit("Unable to load recent activity. Please try again later.");
}

function escapeActivity($value) {
    return htmlspecialchars(
        (string) ($value ?? ""),
        ENT_QUOTES,
        "UTF-8"
    );
}

function activityDate($date) {
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

    <title>Recent Activity | GameHub</title>

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
            --background: #f4f8f5;
            --surface: #ffffff;
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
            width: min(1000px, 92%);
            margin: 35px auto 60px;
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

        .intro {
            color: var(--muted);
            line-height: 1.7;
            margin: 0 0 26px;
            font-size: 14px;
        }

        .summary {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            flex-wrap: wrap;
            background: var(--green-light);
            border: 1px solid #cfe9d7;
            border-radius: 13px;
            padding: 18px 22px;
            margin-bottom: 25px;
        }

        .summary strong {
            display: block;
            color: var(--green-dark);
            font-size: 14px;
        }

        .summary p {
            color: #52725f;
            font-size: 12px;
            margin: 5px 0 0;
        }

        .count {
            background: white;
            border-radius: 20px;
            padding: 9px 13px;
            color: var(--green-dark);
            font-size: 12px;
            font-weight: 700;
        }

        .activity-list {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .activity-card {
            min-width: 0;
            display: flex;
            align-items: flex-start;
            gap: 16px;
            padding: 21px;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 13px;
            box-shadow: 0 4px 14px rgba(25, 70, 43, .04);
        }

        .activity-symbol {
            width: 44px;
            height: 44px;
            flex: 0 0 44px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 12px;
            background: var(--green-light);
            color: var(--green-dark);
            font-size: 21px;
            font-weight: 700;
        }

        .activity-content {
            flex: 1 1 0;
            min-width: 0;
        }

        .activity-heading {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 12px;
            flex-wrap: wrap;
        }

        .activity-heading h2 {
            font-size: 24px;
            margin: 0 0 6px;
            overflow-wrap: anywhere;
        }

        .activity-date {
            color: var(--muted);
            font-size: 11px;
            padding-top: 4px;
        }

        .area {
            display: inline-block;
            background: #eaf2ff;
            color: var(--blue);
            padding: 5px 9px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
            margin: 5px 0 10px;
        }

        .milestone {
            color: #617067;
            font-size: 13px;
            line-height: 1.7;
            margin: 3px 0 12px;
            overflow-wrap: anywhere;
        }

        .activity-bottom {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            flex-wrap: wrap;
            border-top: 1px solid var(--border);
            padding-top: 13px;
        }

        .status {
            display: inline-block;
            background: #fff3d7;
            color: #896312;
            border-radius: 20px;
            padding: 6px 10px;
            font-size: 11px;
            font-weight: 700;
            overflow-wrap: anywhere;
        }

        .percentage {
            color: var(--green);
            font-size: 13px;
            font-weight: 700;
        }

        .notes {
            background: #f7faf8;
            border-radius: 8px;
            padding: 12px;
            margin-top: 13px;
            font-size: 12px;
            line-height: 1.7;
            overflow-wrap: anywhere;
        }

        .empty-state {
            background: white;
            border: 1px dashed #b9d5c2;
            border-radius: 14px;
            padding: 45px 20px;
            text-align: center;
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
            background: var(--green-dark);
            color: white;
            text-align: center;
            padding: 25px 6%;
            font-size: 12px;
            line-height: 1.8;
        }

        @media (max-width: 600px) {
            .page-container {
                margin-top: 25px;
            }

            .activity-card {
                padding: 15px;
                gap: 11px;
            }

            .activity-symbol {
                width: 36px;
                height: 36px;
                flex-basis: 36px;
            }

            .activity-heading h2 {
                font-size: 22px;
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

    <span class="eyebrow">Your progress history</span>
    <h1>Recent Activity</h1>

    <p class="intro">
        Review your recorded development updates, milestones and
        progress statuses. Your latest records appear first.
    </p>

    <section class="summary">
        <div>
            <strong>Your activity history</strong>
            <p>Updates recorded in your player progress profile.</p>
        </div>

        <span class="count">
            <?= count($activities) ?>
            <?= count($activities) === 1 ? "record" : "records" ?>
        </span>
    </section>

    <section class="activity-list">

        <?php if (empty($activities)): ?>

            <div class="empty-state">
                <h2>No activity recorded yet</h2>
                <p>
                    Your progress updates will appear here when records
                    are available in your player profile.
                </p>
            </div>

        <?php else: ?>

            <?php foreach ($activities as $activity): ?>

                <?php
                    $percentage = max(
                        0,
                        min(100, (int) ($activity["Progress_Percentage"] ?? 0))
                    );

                    $status = $activity["Progress_Status"] ?? "Not specified";
                ?>

                <article class="activity-card">

                    <div class="activity-symbol" aria-hidden="true">
                        ↗
                    </div>

                    <div class="activity-content">

                        <div class="activity-heading">
                            <div>
                                <h2>
                                    <?= escapeActivity(
                                        $activity["Goal"] ?: "Progress update"
                                    ) ?>
                                </h2>

                                <span class="area">
                                    <?= escapeActivity(
                                        $activity["Development_Area"] ?: "General"
                                    ) ?>
                                </span>
                            </div>

                            <time class="activity-date">
                                <?= escapeActivity(
                                    activityDate($activity["Progress_Date"] ?? null)
                                ) ?>
                            </time>
                        </div>

                        <?php if (!empty($activity["Milestone"])): ?>
                            <p class="milestone">
                                <strong>Milestone:</strong>
                                <?= escapeActivity($activity["Milestone"]) ?>
                            </p>
                        <?php endif; ?>

                        <div class="activity-bottom">
                            <span class="status">
                                <?= escapeActivity($status) ?>
                            </span>

                            <span class="percentage">
                                <?= $percentage ?>% complete
                            </span>
                        </div>

                        <?php if (!empty($activity["Notes"])): ?>
                            <div class="notes">
                                <strong>Notes</strong><br>
                                <?= nl2br(escapeActivity($activity["Notes"])) ?>
                            </div>
                        <?php endif; ?>

                    </div>

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
