const form = document.getElementById("form");
const liste = document.getElementById("liste");

// Verileri localStorage'dan yükle
let gunler = JSON.parse(localStorage.getItem("ozelGunler") || "[]");

function kaydet() {
  localStorage.setItem("ozelGunler", JSON.stringify(gunler));
}

// Kalan gün sayısını hesapla
function kalanGun(tarih) {
  const bugun = new Date();
  bugun.setHours(0, 0, 0, 0);
  const hedef = new Date(tarih);
  hedef.setHours(0, 0, 0, 0);
  const fark = Math.round((hedef - bugun) / (1000 * 60 * 60 * 24));
  return fark;
}

function sayacMetni(fark) {
  if (fark > 0) return { metin: `⏳ ${fark} gün kaldı`, sinif: "" };
  if (fark === 0) return { metin: "🎉 Bugün!", sinif: "" };
  return { metin: `${Math.abs(fark)} gün önceydi`, sinif: "gecti" };
}

function ciz() {
  liste.innerHTML = "";
  if (gunler.length === 0) {
    liste.innerHTML = '<p class="bos">Henüz özel gün eklemedin. 💚</p>';
    return;
  }
  // Yaklaşana göre sırala
  gunler.sort((a, b) => kalanGun(a.tarih) - kalanGun(b.tarih));

  gunler.forEach((g, i) => {
    const { metin, sinif } = sayacMetni(kalanGun(g.tarih));
    const kart = document.createElement("div");
    kart.className = "kart";
    kart.innerHTML = `
      <button class="sil" title="Sil">✕</button>
      <h3>${g.baslik}</h3>
      <div class="tarih">${new Date(g.tarih).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</div>
      ${g.not ? `<div class="not">"${g.not}"</div>` : ""}
      <div class="sayac ${sinif}">${metin}</div>
    `;
    kart.querySelector(".sil").addEventListener("click", () => {
      gunler.splice(i, 1);
      kaydet();
      ciz();
    });
    liste.appendChild(kart);
  });
}

form.addEventListener("submit", e => {
  e.preventDefault();
  gunler.push({
    baslik: document.getElementById("baslik").value.trim(),
    tarih: document.getElementById("tarih").value,
    not: document.getElementById("not").value.trim()
  });
  kaydet();
  form.reset();
  ciz();
});

ciz();
