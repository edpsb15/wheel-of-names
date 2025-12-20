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
            initSlots();
            console.log(`Data dimuat: ${allParticipants.length} peserta.`);
        })
        .catch(error => {
            alert("Error: Pastikan dijalankan di Local Server (Live Server).");
            console.error(error);
        });
});

// 2. Membuat 10 Slot Kosong
function initSlots() {
    const container = document.getElementById('grid-container');
    container.innerHTML = '';
    
    for (let i = 1; i <= totalWinners; i++) {
        const div = document.createElement('div');
        div.className = 'slot';
        div.id = `slot-${i}`;
        div.innerHTML = `
            <div class="slot-number">Pemenang #${i}</div>
            <div class="slot-content">
                <div class="slot-name">---</div>
                <div class="slot-satker">---</div>
            </div>
        `;
        container.appendChild(div);
    }
}

// 3. Fungsi Format Teks Baru (Hanya Nama & Satker)
function formatText(p) {
    // Menggunakan p.Nama dan p.Satker sesuai dataset Anda
    return `
        <div class="slot-content">
            <div class="slot-name">${p.Nama}</div>
            <div class="slot-satker">${p.Satker}</div>
        </div>`;
}

// 4. Logika Pengacakan
function startGacha() {
    if (isSpinning) return;
    if (allParticipants.length < totalWinners) {
        alert("Jumlah peserta kurang dari 10!");
        return;
    }

    const btn = document.getElementById('spin-btn');
    btn.disabled = true;
    isSpinning = true;

    // Acak array
    const shuffled = [...allParticipants].sort(() => 0.5 - Math.random());
    const winners = shuffled.slice(0, totalWinners);

    let intervals = [];
    
    // Mulai animasi untuk semua slot
    for (let i = 1; i <= totalWinners; i++) {
        const slotEl = document.getElementById(`slot-${i}`);
        
        const intervalId = setInterval(() => {
            const randomPerson = allParticipants[Math.floor(Math.random() * allParticipants.length)];
            
            // Update tampilan saat mengacak
            slotEl.innerHTML = `
                <div class="slot-number">Mengacak...</div>
                ${formatText(randomPerson)}
            `;
        }, 80);
        
        intervals.push(intervalId);
    }

    // Stop berurutan
    winners.forEach((winner, index) => {
        const delay = (index + 1) * 1000; // Jeda 1 detik per pemenang

        setTimeout(() => {
            clearInterval(intervals[index]);

            const slotDiv = document.getElementById(`slot-${index + 1}`);
            slotDiv.innerHTML = `
                <div class="slot-number" style="color:var(--forest-green);">🎉 Pemenang #${index + 1}</div>
                ${formatText(winner)}
            `;
            
            slotDiv.classList.add('active');

            if (index === totalWinners - 1) {
                isSpinning = false;
                btn.innerText = "Putar !";
                btn.disabled = true;
            }
        }, delay);
    });
}
