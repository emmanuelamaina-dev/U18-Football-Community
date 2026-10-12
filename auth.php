
<?php
// auth.php

if (session_status() !== PHP_SESSION_ACTIVE) {
    $isHttps = !empty($_SERVER["HTTPS"])
        && $_SERVER["HTTPS"] !== "off";

    session_set_cookie_params([
        "httponly" => true,
        "secure" => $isHttps,
        "samesite" => "Lax",
        "path" => "/"
    ]);

    session_start();
}

function jsonResponse($data, $status = 200)
{
    http_response_code($status);
    header("Content-Type: application/json; charset=utf-8");

    echo json_encode($data);
    exit;
}

function requireLogin()
{
    if (empty($_SESSION["user_id"])) {
        jsonResponse([
            "error" => "Please log in to continue."
        ], 401);
    }
}

function requirePlayer()
{
    requireLogin();

    if (($_SESSION["role"] ?? "") !== "Player") {
        jsonResponse([
            "error" => "This page is available to player accounts."
        ], 403);
    }
}

function getCsrfToken()
{
    if (empty($_SESSION["csrf_token"])) {
        $_SESSION["csrf_token"] = bin2hex(random_bytes(32));
    }

    return $_SESSION["csrf_token"];
}

function verifyCsrfToken()
{
    $provided = $_SERVER["HTTP_X_CSRF_TOKEN"] ?? "";
    $expected = $_SESSION["csrf_token"] ?? "";

    if (
        $expected === "" ||
        $provided === "" ||
        !hash_equals($expected, $provided)
    ) {
        jsonResponse([
            "error" => "Your session token is invalid. Refresh and try again."
        ], 403);
    }
}