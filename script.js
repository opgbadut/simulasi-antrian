// Database sederhana di memori untuk nampung data antrian
let dataPelanggan = [];
let targetEditId = null;

// Mengambil referensi elemen DOM
const inputDatang = document.getElementById('waktuDatang');
const inputLayan = document.getElementById('waktuLayan');
const btnSimpan = document.getElementById('btnSimpan');
const btnBatal = document.getElementById('btnBatal');
const btnHapus = document.getElementById('btnHapus');

// Fungsi utama manajemen data (Tambah / Update)
function simpanData() {
    const kedatangan = parseFloat(inputDatang.value);
    const pelayanan = parseFloat(inputLayan.value);

    // Validasi input standar
    if (isNaN(kedatangan) || isNaN(pelayanan) || kedatangan < 0 || pelayanan <= 0) {
        alert("Mohon masukkan angka waktu yang valid (pelayanan tidak boleh 0).");
        return;
    }

    if (targetEditId !== null) {
        // Mode update: cari pelanggan dan timpa datanya
        const target = dataPelanggan.find(p => p.id === targetEditId);
        if (target) {
            target.datang = kedatangan;
            target.layan = pelayanan;
        }
        batalEdit(); // Balik ke mode tambah
    } else {
        // Mode tambah: Auto-increment ID seperti Primary Key
        const idBaru = dataPelanggan.length > 0 ? dataPelanggan[dataPelanggan.length - 1].id + 1 : 1;
        dataPelanggan.push({
            id: idBaru,
            datang: kedatangan,
            layan: pelayanan
        });
    }

    // Pastikan data selalu urut berdasarkan waktu kedatangan (Prinsip FCFS)
    dataPelanggan.sort((a, b) => a.datang - b.datang);
    
    // Refresh semua tabel
    renderSemuaTabel();
    bersihkanForm();
}

function siapEdit(id) {
    const target = dataPelanggan.find(p => p.id === id);
    if (!target) return;

    // Masukkan ke form
    inputDatang.value = target.datang;
    inputLayan.value = target.layan;
    
    // Ubah state UI ke mode edit
    targetEditId = id;
    btnSimpan.innerText = "Update Data";
    btnBatal.classList.remove('hidden');
    btnHapus.classList.remove('hidden');

    renderTabelInput(); // Render ulang untuk highlight baris yang lagi diedit
}

function batalEdit() {
    targetEditId = null;
    btnSimpan.innerText = "Tambah Data";
    btnBatal.classList.add('hidden');
    btnHapus.classList.add('hidden');
    bersihkanForm();
    renderTabelInput();
}

function hapusData() {
    if (targetEditId !== null) {
        dataPelanggan = dataPelanggan.filter(p => p.id !== targetEditId);
        batalEdit();
        renderSemuaTabel();
    }
}

function bersihkanForm() {
    inputDatang.value = '';
    inputLayan.value = '';
    inputDatang.focus();
}

// --- CORE ENGINE FCFS ---

function hitungAntrianFCFS() {
    let hasilAntrian = [];
    let waktuSelesaiKasirSebelumnya = 0; // Mirip tracker koneksi TCP sebelumnya

    dataPelanggan.forEach(pelanggan => {
        // Jika kasir nganggur, langsung dilayani. Kalau masih sibuk, tunggu!
        let waktuMulaiDilayani = Math.max(pelanggan.datang, waktuSelesaiKasirSebelumnya);
        
        let waktuKeluar = waktuMulaiDilayani + pelanggan.layan;
        let waktuTunggu = waktuMulaiDilayani - pelanggan.datang;
        let waktuDiSupermarket = waktuKeluar - pelanggan.datang;

        hasilAntrian.push({
            id: pelanggan.id,
            datang: pelanggan.datang,
            layan: pelanggan.layan,
            keluar: parseFloat(waktuKeluar.toFixed(1)),
            tunggu: parseFloat(waktuTunggu.toFixed(1)),
            diToko: parseFloat(waktuDiSupermarket.toFixed(1))
        });

        // Update kapan kasir akan selesai melayani pelanggan ini
        waktuSelesaiKasirSebelumnya = waktuKeluar;
    });

    return hasilAntrian;
}

function buatTimelineEvent(hasilAntrian) {
    let bukuCatatanEvent = [];

    // Event inisiasi sistem nyala
    bukuCatatanEvent.push({ waktu: 0.0, id: 0, tipe: 'Mulai' });

    // Pecah data jadi 2 event: Momen "Datang" dan Momen "Keluar"
    hasilAntrian.forEach(p => {
        bukuCatatanEvent.push({ waktu: p.datang, id: p.id, tipe: 'Datang' });
        bukuCatatanEvent.push({ waktu: p.keluar, id: p.id, tipe: 'Keluar' });
    });

    // Urutkan event berdasarkan waktu (Timeline)
    bukuCatatanEvent.sort((a, b) => {
        if (a.waktu !== b.waktu) return a.waktu - b.waktu;
        // Jika ada yang datang dan keluar di detik yang sama persis, 
        // bebaskan kasir dulu (Keluar) baru terima yang Datang
        if (a.tipe === 'Keluar' && b.tipe === 'Datang') return -1;
        if (a.tipe === 'Datang' && b.tipe === 'Keluar') return 1;
        return a.id - b.id;
    });

    // Tracker status (State machine)
    let jmlDiAntrian = 0;
    let jmlDiSupermarket = 0;
    let kasirSibuk = false;
    let hasilEvent = [];

    bukuCatatanEvent.forEach(ev => {
        if (ev.tipe === 'Mulai') {
            jmlDiAntrian = 0;
            jmlDiSupermarket = 0;
            kasirSibuk = false;
        } 
        else if (ev.tipe === 'Datang') {
            jmlDiSupermarket++;
            if (kasirSibuk) {
                jmlDiAntrian++; // Masuk buffer
            } else {
                kasirSibuk = true; // Langsung dilayani
            }
        } 
        else if (ev.tipe === 'Keluar') {
            jmlDiSupermarket--;
            if (jmlDiAntrian > 0) {
                jmlDiAntrian--; // Panggil antrian selanjutnya, kasir tetap sibuk
            } else {
                kasirSibuk = false; // Kasir nganggur
            }
        }

        hasilEvent.push({
            waktu: ev.waktu,
            id: ev.tipe === 'Mulai' ? '-' : ev.id,
            tipe: ev.tipe,
            antri: jmlDiAntrian,
            toko: jmlDiSupermarket,
            statusKasir: kasirSibuk ? 'Sibuk' : 'Menganggur'
        });
    });

    return hasilEvent;
}

// --- RENDER KE HTML ---

function renderSemuaTabel() {
    renderTabelInput();
    const dataAntrianMatang = hitungAntrianFCFS();
    renderTabelAntrian(dataAntrianMatang);
    
    const dataEvent = buatTimelineEvent(dataAntrianMatang);
    renderTabelEvent(dataEvent);
    updateNarasi(dataAntrianMatang.length);
}

function renderTabelInput() {
    const tbody = document.getElementById('bodyTabelInput');
    tbody.innerHTML = '';
    
    dataPelanggan.forEach(p => {
        const tr = document.createElement('tr');
        if (p.id === targetEditId) tr.classList.add('baris-aktif');
        
        tr.onclick = () => siapEdit(p.id);
        tr.innerHTML = `
            <td>${p.id}</td>
            <td>${p.datang.toFixed(1)}</td>
            <td>${p.layan.toFixed(1)}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderTabelAntrian(data) {
    const tbody = document.getElementById('bodyTabelAntrian');
    tbody.innerHTML = '';
    
    data.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${p.id}</td>
            <td>${p.datang.toFixed(1)}</td>
            <td>${p.layan.toFixed(1)}</td>
            <td>${p.keluar.toFixed(1)}</td>
            <td>${p.tunggu.toFixed(1)}</td>
            <td>${p.diToko.toFixed(1)}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderTabelEvent(data) {
    const tbody = document.getElementById('bodyTabelEvent');
    tbody.innerHTML = '';
    
    data.forEach(ev => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${ev.waktu.toFixed(1)}</td>
            <td>${ev.id}</td>
            <td>${ev.tipe}</td>
            <td>${ev.antri}</td>
            <td>${ev.toko}</td>
            <td>${ev.statusKasir}</td>
        `;
        tbody.appendChild(tr);
    });
}

function updateNarasi(jumlahData) {
    const narasi = document.getElementById('teksNarasi');
    if (jumlahData === 0) {
        narasi.innerHTML = "Sistem saat ini kosong. Silakan tambahkan data pelanggan.";
    } else {
        narasi.innerHTML = `Simulasi berjalan untuk <strong>${jumlahData} pelanggan</strong>. Proses berjalan menggunakan metode FCFS. Pada Tabel 3, setiap kali kasir berstatus "Menganggur" dan ada pelanggan yang "Datang", status akan langsung berubah menjadi "Sibuk". Namun jika kasir masih "Sibuk" memproses request sebelumnya, maka pelanggan baru akan dialihkan ke kolom "Pelanggan di antrian".`;
    }
}