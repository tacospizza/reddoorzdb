<?php
// Pastikan tidak ada spasi, baris kosong, atau karakter lain sebelum tag ini!
header('Content-Type: application/json');

// --- Konfigurasi koneksi ke MySQL (XAMPP/Localhost) ---
// Perhatikan: $host, $user, $pass, $db hanya didefinisikan SATU KALI
$host = 'localhost'; 
$user = 'root'; 
$pass = ''; // WAJIB KOSONG jika XAMPP tanpa password
$db   = 'reddoorz_db'; // WAJIB EJAAN BENAR (Case-Sensitivity)

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    // Pesan error jika koneksi gagal (Sangat membantu untuk debugging)
    echo json_encode(["success" => false, "message" => "Gagal konek ke database. Error: " . $conn->connect_error]);
    exit;
}

// --- Ambil Parameter dari JavaScript ---
$search = isset($_GET['search']) ? $conn->real_escape_string($_GET['search']) : '';
$filter = isset($_GET['filter']) ? $conn->real_escape_string($_GET['filter']) : '';

// --- Bangun Query SQL ---
$sql = "SELECT tanggal, booking_id, employee, property_code, hotel, source, promo_code FROM bookings WHERE 1=1";

// Logika Search
if (!empty($search)) {
    // Mencari di beberapa kolom
    $sql .= " AND (
        tanggal LIKE '%$search%' OR 
        booking_id LIKE '%$search%' OR 
        employee LIKE '%$search%' OR
        hotel LIKE '%$search%'
    )";
}

// Logika Filter (Berdasarkan Kolom 'source')
if (!empty($filter) && $filter !== 'all') {
    $sql .= " AND source = '$filter'";
}

// Tambahkan pengurutan
$sql .= " ORDER BY tanggal DESC"; 

$result = $conn->query($sql);

$data = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

// Kembalikan hasil dalam format JSON
echo json_encode(["success" => true, "results" => $data, "message" => "Data berhasil diambil."]);

$conn->close();
?>