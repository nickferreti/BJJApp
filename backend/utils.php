<?php
// backend/utils.php

function getBearerToken() {
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        if (preg_match('/Bearer\s(\S+)/', $headers['Authorization'], $matches)) {
            return $matches[1];
        }
    }
    return null;
}

function requireAuth($pdo, $requiredRole = null) {
    // For this MVP, we are using a simple token strategy: "mock_token_{USER_ID}"
    // In production, REPLACE THIS with real JWT verification (firebase/php-jwt)
    
    $token = getBearerToken();
    
    if (!$token) {
        http_response_code(401);
        echo json_encode(['error' => 'Token not provided']);
        exit;
    }

    // Extract User ID from mock token
    if (strpos($token, 'mock_token_') !== 0) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid token format']);
        exit;
    }

    $userId = str_replace('mock_token_', '', $token);

    // Verify user exists and has role
    $stmt = $pdo->prepare("SELECT id, role FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid token user']);
        exit;
    }

    if ($requiredRole && $user['role'] !== $requiredRole) {
        http_response_code(403);
        echo json_encode(['error' => 'Insufficient permissions']);
        exit;
    }

    return $user; // Return user for use in controller
}
?>
