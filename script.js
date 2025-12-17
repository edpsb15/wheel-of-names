// COPY DATA DARI EXCEL ANDA KE DALAM ARRAY INI
const peserta = [
    "Budi Santoso", 
    "Siti Aminah", 
    "Andi Wijaya", 
    "Dewi Lestari", 
    "Eko Prasetyo"
    // Tambahkan nama lainnya di sini...
];

let daftarPemenang = [];

function startDraw() {
    const button = document.getElementById('spin-button');
    const display = document.getElementById('winner-name');
    
    if (peserta.length === 0) {
        alert("Semua peserta sudah menang!");
        return;
    }

    button.disabled = true;
    let counter = 0;
    
    // Efek mengacak nama
    const interval = setInterval(() => {
        const randomTemp = peserta[Math.floor(Math.random() * peserta.length)];
        display.innerText = randomTemp;
        counter++;

        if (counter > 20) { // Berhenti setelah 20 kali acak
            clearInterval(interval);
            
            // Pilih pemenang final
            const winnerIndex = Math.floor(Math.random() * peserta.length);
            const winner = peserta.splice(winnerIndex, 1)[0];
            
            display.innerText = "🎉 " + winner + " 🎉";
            display.style.color = "#ff4757";
            
            updateHistory(winner);
            button.disabled = false;
        }
    }, 100);
}

function updateHistory(name) {
    const list = document.getElementById('winner-list');
    const li = document.createElement('li');
    li.innerText = `🏆 ${name}`;
    list.prepend(li);
}
