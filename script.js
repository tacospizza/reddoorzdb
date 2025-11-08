// ===============================================
// 1. FUNGSI UTAMA & RENDERING
// ===============================================

async function fetchData() {
    const search = document.getElementById('searchInput').value;
    const filter = document.getElementById('filterSelect').value;
    const errorMsg = document.getElementById('errorMessage');
    const totalCount = document.getElementById('totalCount');
    
    errorMsg.textContent = '';
    totalCount.textContent = '... Loading ...';

    try {
        // Panggilan ke API.php dengan parameter search dan filter
        const res = await fetch(`api.php?search=${encodeURIComponent(search)}&filter=${encodeURIComponent(filter)}`);
        
        // Cek jika HTTP status code bukan 200 (misalnya 404/500)
        if (!res.ok) {
            throw new Error(`Server Error: ${res.status} ${res.statusText}. Cek api.php`);
        }

        const data = await res.json();

        // Cek jika API.php mengembalikan success: false
        if (!data.success) {
            // Mengambil pesan error dari PHP
            throw new Error(data.message || "Gagal mengambil data dari API.");
        }

        renderTable(data.results);
    } catch (err) {
        // Tampilkan pesan error di HTML dan reset tampilan
        errorMsg.textContent = '❌ ' + err.message;
        document.getElementById('tableBody').innerHTML = `<tr><td colspan="7">Gagal memuat data</td></tr>`;
        totalCount.textContent = '0';
    }
}

function renderTable(rows) {
    const tbody = document.getElementById('tableBody');
    const total = document.getElementById('totalCount');
    
    if (rows.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7">Tidak ada data ditemukan</td></tr>`;
    } else {
        // Membangun baris tabel dengan data dari MySQL
        tbody.innerHTML = rows.map(r => `
            <tr>
                <td>${r.tanggal}</td>
                <td>${r.booking_id}</td>
                <td>${r.employee}</td>
                <td>${r.property_code}</td>
                <td>${r.hotel}</td>
                <td>${r.source}</td>
                <td>${r.promo_code}</td>
            </tr>
        `).join('');
    }

    total.textContent = rows.length;
}


// ===============================================
// 2. INITIALIZATION & EVENT LISTENERS
// ===============================================

document.addEventListener('DOMContentLoaded', (event) => {
    
    // Logika Dark/Light Mode (dibiarkan tetap sama)
    const darkToggle = document.getElementById('darkToggle');
    const body = document.body;
    const themeClass = 'light-mode'; 
    const currentTheme = localStorage.getItem('theme');
    
    const isLight = currentTheme === 'light';
    body.classList.toggle(themeClass, isLight);
    darkToggle.checked = isLight;

    if (!currentTheme) {
        localStorage.setItem('theme', 'dark');
    }

    darkToggle.addEventListener('change', function() {
        const isChecked = this.checked;
        body.classList.toggle(themeClass, isChecked);
        localStorage.setItem('theme', isChecked ? 'light' : 'dark');
    });


    // Event Listeners Aplikasi
    document.getElementById('searchBtn').addEventListener('click', fetchData);
    document.getElementById('refreshBtn').addEventListener('click', fetchData);
    document.getElementById('filterSelect').addEventListener('change', fetchData); // Filter Otomatis
    document.getElementById('searchInput').addEventListener('keypress', e => {
        if (e.key === 'Enter') fetchData();
    });

    // PANGGIL DATA PERTAMA KALI
    fetchData(); 
});