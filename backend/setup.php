<?php
// backend/setup.php
require 'db.php';

try {
    // 1. Users Table (Stores both Students and Professors)
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL, -- 'student' or 'professor'
        avatar_url TEXT
    )");

    // 2. Student Details Table (Extends users for students)
    $pdo->exec("CREATE TABLE IF NOT EXISTS student_details (
        user_id INTEGER PRIMARY KEY,
        belt TEXT NOT NULL DEFAULT 'Branca',
        stripes INTEGER DEFAULT 0,
        attendance INTEGER DEFAULT 0,
        required_attendance INTEGER DEFAULT 50,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )");

    // 3. Videos Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS videos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT,
        belt_level TEXT,
        url TEXT,
        thumbnail_url TEXT,
        tags TEXT
    )");

    // 4. Transactions Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        amount REAL NOT NULL,
        date TEXT,
        status TEXT, -- 'paid', 'pending', 'overdue'
        description TEXT,
        FOREIGN KEY (student_id) REFERENCES users(id)
    )");

    // 5. Events Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        date TEXT,
        description TEXT,
        type TEXT
    )");

    echo "Tables created successfully.<br>";

    // ----- SEED DATA -----

    // Check if admin exists
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE email = ?");
    $stmt->execute(['mestre@bjj.com']);
    if ($stmt->fetchColumn() == 0) {
        // Create Admin
        $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role, avatar_url) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([
            'Mestre Carlos', 
            'mestre@bjj.com', 
            password_hash('admin123', PASSWORD_DEFAULT), 
            'professor', 
            'https://api.dicebear.com/7.x/avataaars/svg?seed=mestre'
        ]);
        echo "Admin user created.<br>";
    }

    // Check if student exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute(['joao@bjj.com']);
    $studentId = $stmt->fetchColumn();

    if (!$studentId) {
        // Create Student User
        $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role, avatar_url) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([
            'João Silva', 
            'joao@bjj.com', 
            password_hash('aluno123', PASSWORD_DEFAULT), 
            'student', 
            'https://api.dicebear.com/7.x/avataaars/svg?seed=joao'
        ]);
        $studentId = $pdo->lastInsertId();

        // Create Student Details
        $stmt = $pdo->prepare("INSERT INTO student_details (user_id, belt, stripes, attendance, required_attendance) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$studentId, 'Branca', 2, 24, 50]);
        
        echo "Student user created.<br>";

        // Seed Transactions for Student
        $pdo->exec("INSERT INTO transactions (student_id, amount, date, status, description) VALUES 
            ($studentId, 250.00, '2023-10-05', 'paid', 'Mensalidade Outubro'),
            ($studentId, 250.00, '2023-11-05', 'pending', 'Mensalidade Novembro')
        ");
    }

    // Seed Videos
    $stmt = $pdo->query("SELECT COUNT(*) FROM videos");
    if ($stmt->fetchColumn() == 0) {
        $pdo->exec("INSERT INTO videos (title, category, belt_level, url, thumbnail_url, tags) VALUES 
            ('Fuga de Quadril Básica', 'Fundamentos', 'Branca', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg', 'Aquecimento,Defesa'),
            ('Armlock da Guarda Fechada', 'Finalização', 'Branca', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg', 'Guarda Fechada,Braço')
        ");
        echo "Videos seeded.<br>";
    }

    // Seed Events
    $stmt = $pdo->query("SELECT COUNT(*) FROM events");
    if ($stmt->fetchColumn() == 0) {
        $pdo->exec("INSERT INTO events (title, date, description, type) VALUES 
            ('Seminário de Defesa Pessoal', '2023-12-10', 'Aprenda técnicas essenciais de defesa pessoal.', 'seminar'),
            ('Graduação de Final de Ano', '2023-12-20', 'Cerimônia de entrega de faixas e graus.', 'class')
        ");
        echo "Events seeded.<br>";
    }

    echo "Database setup complete.";

} catch (PDOException $e) {
    echo "Setup failed: " . $e->getMessage();
}
?>
