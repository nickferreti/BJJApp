<?php
// backend/index.php
// Main router. For a simple app, we can just require specific files based on path or query param.
// Using query param ?action=... for simplicity with PHP built-in server without .htaccess

require 'db.php';

$action = $_GET['action'] ?? '';

// Basic Router
switch ($action) {
    case 'login':
        require 'auth.php';
        break;
    case 'student_dashboard':
    case 'student_profile':
    case 'student_videos':
    case 'student_financial':
    case 'student_events':
    case 'check_in':
        require 'students.php';
        break;
    case 'professor_stats':
    case 'professor_students':
    case 'professor_videos':
    case 'professor_financial':
    case 'professor_events':
    // CRUD Actions
    case 'add_student':
    case 'promote_student':
    case 'delete_student':
    case 'add_video':
    case 'delete_video':
    case 'add_event':
    case 'delete_event':
        require 'professor.php';
        break;
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
        break;
}
?>
