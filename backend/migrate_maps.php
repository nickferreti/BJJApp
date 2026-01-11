<?php
try {
    $pdo = new PDO('sqlite:bjj_academy.sqlite');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Add maps_link column
    try {
        $pdo->exec("ALTER TABLE events ADD COLUMN maps_link TEXT");
        echo "Added maps_link column.\n";
    } catch (Exception $e) {
        echo "maps_link column might already exist or error: " . $e->getMessage() . "\n";
    }

} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
