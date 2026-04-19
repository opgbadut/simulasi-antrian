# Simulasi Antrian FCFS (First Come First Serve) - Kasir Supermarket X 

Sebuah program simulasi antrian berbasis web menggunakan metode FCFS (First Come First Serve) murni. Proyek ini dibuat untuk memodelkan dan menghitung waktu tunggu pelanggan, waktu pelayanan, serta memetakan garis waktu kejadian (event timeline) pada sebuah sistem kasir tunggal.

Secara konsep, logika antrian ini serupa dengan pemrosesan queue tree dasar pada antarmuka jaringan: permintaan yang masuk ke buffer lebih awal akan dieksekusi terlebih dahulu tanpa memandang beban kerja.


## Fitur Utama

- Input Interaktif: Pengguna dapat menambahkan data waktu kedatangan dan durasi pelayanan secara manual.
- CRUD Sederhana: Mendukung fitur Edit dan Hapus data secara langsung.
- Kalkulasi Otomatis: Secara instan menghitung:
  - Waktu mulai dilayani
  - Waktu keluar (selesai dilayani)
  - Waktu tunggu pelanggan
  - Total waktu pelanggan di dalam sistem (supermarket)
- Event-Driven Timeline: Menghasilkan tabel log event kronologis yang melacak momen pelanggan "Datang" dan "Keluar", serta pembaruan status kasir ("Sibuk" / "Menganggur").
- UI/UX Bersih: Desain responsif dan rapi.


## Teknologi yang Digunakan

Proyek ini dibangun murni menggunakan standar web dasar tanpa framework tambahan:
- HTML5: Struktur dan semantik halaman.
- CSS3: Styling, tata letak, dan status visual interaktif.
- Vanilla JavaScript (ES6): Logika pemrosesan array, penanganan event, kalkulasi FCFS, dan manipulasi DOM.


## Cara Pemakaian (Panduan Simulasi)

Program ini dirancang agar interaktif dan berjalan secara real-time di sisi client. Berikut adalah langkah-langkah untuk menjalankan simulasi:

1. Persiapan Data Input
     - Siapkan data metrik antrian yang ingin diuji (seperti data "Waktu Kedatangan" dan "Waktu Pelayanan" pada studi kasus Kasir Supermarket X).

2. Memasukkan Data ke Sistem
   - Pada panel kontrol di bagian atas halaman, isi nilai Waktu Kedatangan pada kolom pertama.
   - Isi nilai Waktu Pelayanan (dalam menit) pada kolom kedua.
   - Klik tombol Tambah Data. Data yang diinputkan akan otomatis masuk dan diurutkan di **Tabel 1**.

3. Membaca Hasil Kalkulasi Otomatis
   - Begitu data ditambahkan, algoritma FCFS akan langsung mengeksekusi perhitungan.
   - Lihat Tabel 2 (Nilai Antrian) untuk mengecek detail waktu keluar, durasi waktu tunggu antrian, dan total waktu pelanggan di dalam sistem.
   - Lihat Tabel 3 (Rincian Event) untuk melacak kronologi kejadian. Tabel ini mensimulasikan *state* mesin (perubahan status kasir antara "Sibuk" dan "Menganggur") berdasarkan momen pelanggan "Datang" dan "Keluar".

4. Mengedit atau Menghapus Data (Koreksi)
   - Jika ada kesalahan ketik saat menginput data, klik baris pelanggan yang bersangkutan langsung pada Tabel 1.
   - Baris tersebut akan tersorot (highlight) dan datanya akan naik kembali ke form input.
   - Lakukan perubahan angka, lalu klik Update Data. Jika ingin menghapusnya, klik Hapus Data.
   - Seluruh perhitungan di Tabel 2 dan log pada Tabel 3 akan secara otomatis dikalkulasi ulang menyesuaikan perubahan data tersebut.


## Struktur File
```text
📁 simulasi-antrian/
├── 📄 index.html    # Tampilan utama dan antarmuka pengguna
├── 📄 style.css     # Kumpulan aturan gaya visual
├── 📄 script.js     # Mesin kalkulasi FCFS dan interaktivitas
└── 📄 README.md     # Dokumentasi proyek
