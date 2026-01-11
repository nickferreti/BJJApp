<?php
// backend/auth.php
// Handle POST /?action=login

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (!$email || !$password) {
    http_response_code(400);
    echo json_encode(['error' => 'Email and password required']);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if ($user && password_verify($password, $user['password'])) {
    // Login success
    // Fetch extra details if student
    $extra = [];
    if ($user['role'] === 'student') {
        $stmtDetails = $pdo->prepare("SELECT * FROM student_details WHERE user_id = ?");
        $stmtDetails->execute([$user['id']]);
        $details = $stmtDetails->fetch();
        if ($details) {
            $extra = $details;
            // Calculate isPaymentLate (mock logic for now or query transactions)
            $stmtTrans = $pdo->prepare("SELECT COUNT(*) FROM transactions WHERE student_id = ? AND status IN ('pending', 'overdue')");
            $stmtTrans->execute([$user['id']]);
            $extra['isPaymentLate'] = $stmtTrans->fetchColumn() > 0;
            $extra['nextClass'] = 'Segunda, 19:00'; // Hardcoded for MVP
        }
    }

    unset($user['password']); // Don't send hash back
    
    echo json_encode([
        'user' => array_merge($user, $extra),
        'token' => 'mock_token_' . $user['id'] // In real app, generate JWT
    ]);
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid credentials']);
}
?>
