let allParticipants = [];
const totalWinners = 10;
let isSpinning = false;

// 1. Load Data JSON saat website dibuka
document.addEventListener("DOMContentLoaded", () => {
    fetch('dataset.json')
        .then(response => {
            if (!response.ok) throw new Error("Gagal memuat dataset.json");
            return response.json();
        })
        .then(data => {
            allParticipants = data;
            initSlots(); // Siapkan slot kosong
            console.log(`Data dimuat: ${allParticipants.length} peserta.`);
        })
        .catch(error => {
            alert("Error: Pastikan Anda menjalankan ini di Local Server (Live Server) agar bisa membaca JSON.");
            console.error(error);
        });
});

// 2. Membuat 10 Slot Kosong di HTML
function initSlots() {
    const container = document.getElementById('grid-container');
    container.innerHTML = '';
    
    for (let i = 1; i <= totalWinners; i++) {
        const div = document.createElement('div');
        div.className = 'slot';
        div.id = `slot-${i}`;
        div.innerHTML = `
            <div class="slot-number">Pemenang #${i}</div>
            <div class="slot-name">---</div>
        `;
        container.appendChild(div);
    }
}

// 3. Fungsi Format Teks: "Nama (Root) - Satker"
function formatText(p) {
    return `<div class="slot-name">${p.nama} <span class="slot-root">(${p.root})</span></div>
            <div class="slot-name" style="font-size: 0.8rem; font-weight:normal;">${p.satker}</div>`;
}

// 4. Logika Utama Pengacakan
function startGacha() {
    if (isSpinning) return;
    if (allParticipants.length < totalWinners) {
        alert("Jumlah peserta kurang dari 10!");
        return;
    }

    const btn = document.getElementById('spin-btn');
    btn.disabled = true;
    isSpinning = true;

    // A. Pilih 10 Pemenang Unik (Acak array lalu ambil 10 pertama)
    // Menggunakan algoritma Fisher-Yates Shuffle agar benar-benar acak
    const shuffled = [...allParticipants].sort(() => 0.5 - Math.random());
    const winners = shuffled.slice(0, totalWinners);

    // B. Animasi Rolling (Semua slot berputar)
    // Kita simpan interval ID untuk setiap slot agar bisa distop satu per satu
    let intervals = [];
    
    for (let i = 1; i <= totalWinners; i++) {
        const slotEl = document.getElementById(`slot-${i}`).querySelector('.slot-name').parentNode; // ambil wrapper
        
        // Animasi cepat: ganti-ganti nama random dari seluruh peserta
        const intervalId = setInterval(() => {
            const randomPerson = allParticipants[Math.floor(Math.random() * allParticipants.length)];
            // Update tampilan sementara (biar heboh)
            document.getElementById(`slot-${i}`).innerHTML = `
                <div class="slot-number">Mengacak...</div>
                ${formatText(randomPerson)}
            `;
        }, 80); // kecepatan ganti nama (80ms)
        
        intervals.push(intervalId);
    }

    // C. Stop Berurutan (Sequential Stop)
    winners.forEach((winner, index) => {
        // Jeda waktu berhenti antar slot (misal setiap 1 detik)
        // Slot 1 berhenti di detik ke-1, Slot 2 di detik ke-2, dst.
        const delay = (index + 1) * 1000; 

        setTimeout(() => {
            // 1. Hentikan animasi rolling slot ini
            clearInterval(intervals[index]);

            // 2. Tampilkan pemenang defenitif
            const slotDiv = document.getElementById(`slot-${index + 1}`);
            slotDiv.innerHTML = `
                <div class="slot-number" style="color:red;">🎉 Pemenang #${index + 1}</div>
                ${formatText(winner)}
            `;
            
            // 3. Berikan efek visual "Selected"
            slotDiv.classList.add('active');

            // 4. Jika ini pemenang terakhir, aktifkan tombol lagi
            if (index === totalWinners - 1) {
                isSpinning = false;
                btn.innerText = "ACAK LAGI";
                btn.disabled = false;
            }
        }, delay);
    });
}
