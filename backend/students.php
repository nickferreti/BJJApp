<?php
// backend/students.php

$userId = $_GET['user_id'] ?? null;
// In a real app, we would validate the token from Authorization header to get user_id.
// For this MVP, we pass user_id as a query param or body param for simplicity.

if (!$userId) {
    http_response_code(400); // Bad Request
    echo json_encode(['error' => 'User ID required']);
    exit;
}

switch ($action) {
    case 'student_dashboard':
        // Return mostly user details which frontend already has, but maybe refresh stats
        // Fetch User + Details
        $stmt = $pdo->prepare("SELECT u.name, u.email, u.avatar_url, d.* FROM users u 
                               JOIN student_details d ON u.id = d.user_id 
                               WHERE u.id = ?");
        $stmt->execute([$userId]);
        $student = $stmt->fetch();
        
        if ($student) {
             // Check if already checked in today (mock logic: check-ins table not strictly implemented, just toggle)
             // For MVP, return 'checkedIn' = false initially
             $student['checkedIn'] = false; 
             $student['nextClass'] = 'Segunda, 19:00'; 
             echo json_encode($student);
        } else {
             http_response_code(404);
             echo json_encode(['error' => 'Student not found']);
        }
        break;

    case 'check_in':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
             http_response_code(405); exit;
        }
        // Increment attendance
        $stmt = $pdo->prepare("UPDATE student_details SET attendance = attendance + 1 WHERE user_id = ?");
        $stmt->execute([$userId]);
        echo json_encode(['success' => true, 'message' => 'Check-in realizado!']);
        break;

    case 'student_videos':
        // Get Student Belt
        $stmt = $pdo->prepare("SELECT belt FROM student_details WHERE user_id = ?");
        $stmt->execute([$userId]);
        $belt = $stmt->fetchColumn();

        // Get Videos for that belt
        $stmt = $pdo->prepare("SELECT * FROM videos WHERE belt_level = ?");
        $stmt->execute([$belt]);
        $videos = $stmt->fetchAll();
        echo json_encode($videos);
        break;

    case 'student_events':
        // Return all events
        $stmt = $pdo->query("SELECT id, title, date, time, location, maps_link as mapsLink, description, type FROM events ORDER BY date ASC");
        echo json_encode($stmt->fetchAll());
        break;

    case 'student_financial':
        // Get transactions
        $stmt = $pdo->prepare("SELECT * FROM transactions WHERE student_id = ? ORDER BY date DESC");
        $stmt->execute([$userId]);
        echo json_encode($stmt->fetchAll());
        break;
}
?>
