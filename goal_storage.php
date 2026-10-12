<?php
function ensurePlayerGoalsTable(PDO $pdo)
{
    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS player_goals (
            goal_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
            user_id INT NOT NULL,
            period ENUM('week', 'month', 'year') NOT NULL,
            goal_text VARCHAR(250) NOT NULL,
            accountability VARCHAR(100) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (goal_id),
            KEY idx_player_goals_user_id (user_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
    );
}
