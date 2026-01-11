<?php
try {
    $pdo = new PDO('sqlite:bjj_academy.sqlite');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Add location column
    try {
        $pdo->exec("ALTER TABLE events ADD COLUMN location TEXT");
        echo "Added location column.\n";
    } catch (Exception $e) {
        echo "Location column might already exist or error: " . $e->getMessage() . "\n";
    }

    // Add time column
    try {
        $pdo->exec("ALTER TABLE events ADD COLUMN time TEXT");
        echo "Added time column.\n";
    } catch (Exception $e) {
        echo "Time column might already exist or error: " . $e->getMessage() . "\n";
    }

} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
