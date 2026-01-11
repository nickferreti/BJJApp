<?php
// backend/professor.php
require_once 'utils.php';

// Ensure $action is handled
if (!isset($action)) {
    $action = $_GET['action'] ?? '';
}

// Protect all professor routes
// This ensures only users with 'professor' role can access these endpoints
$currentUser = requireAuth($pdo, 'professor');

switch ($action) {
    // --- STUDENTS ---
    case 'professor_students':
        // OPTIMIZED: Single query with LEFT JOIN and subquery for payment status
        // Removes N+1 problem
        $sql = "SELECT 
                    u.id, u.name, u.email, u.avatar_url, 
                    d.belt, d.stripes, d.attendance, d.required_attendance,
                    (SELECT COUNT(*) 
                     FROM transactions t 
                     WHERE t.student_id = u.id AND t.status IN ('pending', 'overdue')
                    ) > 0 as isPaymentLate
                FROM users u 
                JOIN student_details d ON u.id = d.user_id 
                WHERE u.role = 'student'";
        
        $stmt = $pdo->query($sql);
        $students = $stmt->fetchAll();
        echo json_encode($students);
        break;

    case 'add_student':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit; }
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Basic Validation
        if (empty($data['name']) || empty($data['email'])) {
            http_response_code(400); echo json_encode(['error' => 'Name and email required']); exit;
        }

        try {
            // 1. Create User
            $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role, avatar_url) VALUES (?, ?, ?, 'student', ?)");
            $defaultPass = password_hash('aluno123', PASSWORD_DEFAULT);
            $avatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=' . urlencode($data['name']);
            $stmt->execute([$data['name'], $data['email'], $defaultPass, $avatar]);
            $userId = $pdo->lastInsertId();

            // 2. Create Details
            $stmt = $pdo->prepare("INSERT INTO student_details (user_id, belt, stripes, attendance, required_attendance) VALUES (?, ?, ?, 0, 50)");
            $stmt->execute([$userId, $data['belt'] ?? 'Branca', 0]);

            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'promote_student':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit; }
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("UPDATE student_details SET belt = ?, stripes = ? WHERE user_id = ?");
        $stmt->execute([$data['belt'], $data['stripes'], $data['user_id']]);
        echo json_encode(['success' => true]);
        break;
        
    case 'delete_student':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit; }
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$data['user_id']]);
        echo json_encode(['success' => true]);
        break;

    // --- STATISTICS ---
    case 'professor_stats':
        // Real Data Aggregation
        $totalStudents = $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'student'")->fetchColumn();
        
        $latePayments = $pdo->query("SELECT COUNT(DISTINCT student_id) FROM transactions WHERE status IN ('pending', 'overdue')")->fetchColumn();
        
        // Calculate Revenue for current month (sqlite strftime)
        $currentMonth = date('m');
        $stmtRev = $pdo->query("SELECT SUM(amount) FROM transactions WHERE status = 'paid'"); // Total ever for MVP simple
        // ideally: WHERE strftime('%m', date) = '$currentMonth'
        $revenue = $stmtRev->fetchColumn() ?: 0;
        
        echo json_encode([
            'totalStudents' => $totalStudents,
            'latePayments' => $latePayments,
            'activeStudents' => $totalStudents, 
            'revenueMonth' =>  $revenue 
        ]);
        break;

    case 'professor_financial':
         $stmt = $pdo->query("SELECT t.*, u.name as studentName FROM transactions t JOIN users u ON t.student_id = u.id ORDER BY t.date DESC");
         echo json_encode($stmt->fetchAll());
         break;

    // --- VIDEOS ---
    case 'professor_videos':
         $stmt = $pdo->query("SELECT * FROM videos");
         echo json_encode($stmt->fetchAll());
         break;

    case 'add_video':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit; }
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("INSERT INTO videos (title, category, belt_level, url, thumbnail_url, tags) VALUES (?, ?, ?, ?, ?, ?)");
        $thumb = $data['thumbnail_url'] ?? 'https://placehold.co/600x400'; 
        $stmt->execute([$data['title'], $data['category'], $data['belt_level'], $data['url'], $thumb, $data['tags']]);
        echo json_encode(['success' => true]);
        break;

    case 'delete_video':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit; }
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("DELETE FROM videos WHERE id = ?");
        $stmt->execute([$data['id']]);
        echo json_encode(['success' => true]);
        break;

    // --- EVENTS ---
    case 'professor_events':
         $stmt = $pdo->query("SELECT id, title, date, time, location, maps_link as mapsLink, description, type FROM events ORDER BY date ASC");
         echo json_encode($stmt->fetchAll());
         break;

    case 'add_event':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit; }
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("INSERT INTO events (title, date, time, location, maps_link, description, type) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['title'], 
            $data['date'], 
            $data['time'] ?? '19:00', 
            $data['location'] ?? 'Tatame Principal', 
            $data['mapsLink'] ?? '', 
            $data['description'], 
            'general'
        ]);
        echo json_encode(['success' => true]);
        break;

    case 'delete_event':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit; }
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("DELETE FROM events WHERE id = ?");
        $stmt->execute([$data['id']]);
        echo json_encode(['success' => true]);
        break;

    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found in professor.php']);
        break;
}
?>
