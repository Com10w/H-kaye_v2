document.addEventListener('DOMContentLoaded', () => {
    startGame();
});

// Gerekli HTML elementlerini seçelim
const gameTextElement = document.getElementById('game-text');
const choicePaneElement = document.getElementById('choice-pane');
const locationTextElement = document.querySelector('.location-text');
const visualPaneElement = document.getElementById('visual-pane'); // /* YENİ: Görsel paneli seçiyoruz */



// OYUNUN HİKAYE VERİTABANI
// YENİ VE UZATILMIŞ HİKAYE
const story = {
    'start': {
        location: "> YER: ALT SEVİYE 7 - ONARIM TÜNELİ",
        sceneClass: "scene-alt-seviye",
        text: "Hava ağır ve nemli. Tek ışık kaynağın, siber-optik lensinden süzülen soluk mavi veri akışı. Rutin bir onarım... derken, eski bir terminalin arkasından zayıf, parazitli bir 'EKO' algılıyorsun. Bu imkansız. 'Büyük Sessizlik'ten beri hiçbir dış sinyal yok.",
        choices: [
            { text: "[İNCELE] Terminali aç ve sinyalin kaynağına bak.", next: 'incele_sinyal' },
            { text: "[YOK SAY] Başını belaya sokma. Raporunu doldur ve işe devam et.", next: 'yok_say' }
        ]
    },
    'yok_say': {
        location: "> YER: ALT SEVİYE 7 - ÇIKIŞ",
        sceneClass: "scene-yok-say",
        text: "Bunun senin sorunun olmadığına karar veriyorsun. Merkez, izinsiz veri araştırmasını sevmez. Paneli kapatıp uzaklaşıyorsun. Gün biter, maaşın yatar. Ama o 'EKO'nun ne olduğunu asla öğrenemezsin.",
        choices: [
            { text: "[Oyun Bitti (Nötr Son)] Yeniden Başla?", next: 'start' }
        ]
    },
    'incele_sinyal': {
        location: "> YER: TERMİNAL ARAYÜZÜ",
        sceneClass: "scene-terminal",
        text: "Siber-kolunu panele bağlıyorsun. Veri akışı başlıyor. Bu bir 'EKO', evet. Ama eski değil. Canlı. Şifrelenmiş bir mesaj: '...bizi duyan var mı? ...Gök-Kale bir yalan...'. Sinyal aniden kesiliyor ve Merkez'in güvenlik protokolü ekranında beliriyor: [İZİNSİZ ERİŞİM TESPİT EDİLDİ].",
        choices: [
            { text: "[KOPAR] Bağlantıyı hemen kes ve kaç.", next: 'kac' },
            { text: "[SAKLA] Sinyali hızla kişisel veri çipine kopyala.", next: 'kopyala' },
            { text: "[RAPOR ET] 'Merkez'e dürüstçe rapor et.", next: 'rapor_et' }
        ]
    },
    'kac': {
        location: "> YER: ALT SEVİYE 7 - KORİDORLAR",
        sceneClass: "scene-kacis",
        text: "Bağlantıyı söküp atıyorsun. Alarm çalmaya başlamadan önce karanlıkta kayboluyorsun. Güvendesin... şimdilik. Ama sinyali kaybettin. Elin boş.",
        choices: [
            { text: "[Evine git ve saklan.]", next: 'kac_sonrasi' } // GÜNCELLENDİ
        ]
    },
    'kopyala': {
        location: "> YER: ALT SEVİYE 7 - KORİDORLAR",
        sceneClass: "scene-kacis",
        text: "Risk alıyorsun. Kopyalama %99... tamamlandı! Alarm çalarken çipi söküp tulumunun gizli cebine atıyorsun. Artık tehlikeli bir sırrın var. 'Merkez Pazarı'ndaki 'Bilgi Taciri' bunu çözebilir.",
        choices: [
            { text: "[Merkez Pazarı'na doğru yola çık.]", next: 'pazar_yolculuk' } // GÜNCELLENDİ
        ]
    },
    'rapor_et': {
        location: "> YER: GÖZALTI BİRİMİ",
        sceneClass: "scene-gozalti",
        text: "Protokole uyuyorsun. Sinyali ve anormalliği Merkez'e rapor ediyorsun. 10 dakika içinde 'Güvenlik' birimleri geliyor. 'Rutin sorgulama' diyorlar. Bir daha 'Alt Seviyeler'i göremiyorsun.",
        choices: [
            { text: "[Oyun Bitti (Kötü Son)] Yeniden Başla?", next: 'start' }
        ]
    },

    // --- YENİ EKLENEN HİKAYE BÖLÜMLERİ ---

    'kac_sonrasi': {
        location: "> YER: KAI'NIN DAİRESİ",
        sceneClass: "scene-daire", // Yeni görsel
        text: "Nefes nefese dairene varıyorsun. Kapıyı kilitliyorsun. Güvendesin. Ama elinde hiçbir şey yok. Sinyali duydun, ama kanıtın yok. Merkez'in bir şeyi sakladığını biliyorsun ama ne olduğunu asla kanıtlayamayacaksın.",
        choices: [
            { text: "[Oyun Bitti (Sessiz Son)] Yeniden Başla?", next: 'start' }
        ]
    },

    'pazar_yolculuk': {
        location: "> YER: MERKEZ PAZARI - GİRİŞ",
        sceneClass: "scene-pazar", // Yeni görsel
        text: "Alt Seviyelerin paslı metal kokusunu geride bırakıp Pazar'ın sahte vanilya ve ozon kokusuna giriyorsun. Hologramlar gözünü alıyor. Kalabalık. Ve her köşede 'Merkez Güvenlik' devriyeleri var. Çip, cebinde bir kor gibi yanıyor.",
        choices: [
            { text: "[DİKKATLİCE] Bilgi Taciri'nin tezgahını ara.", next: 'pazar_arastir' },
            { text: "[PANİKLE] Bu çok riskli. Çipten kurtul.", next: 'pazar_vazgec' }
        ]
    },

    'pazar_vazgec': {
        location: "> YER: MERKEZ PAZARI - ÇÖP YAKICI",
        sceneClass: "scene-pazar",
        text: "Bunun başını yakacağına eminsin. Güvenlik devriyesine bakıp hızla bir ara sokağa dalıyorsun. Veri çipini çıkarıp bir çöp yakma ünitesine atıyorsun. Tıslayarak eriyor. Sır da onunla birlikte yok oluyor.",
        choices: [
            { text: "[Oyun Bitti (Korkak Son)] Yeniden Başla?", next: 'start' }
        ]
    },

    'pazar_arastir': {
        location: "> YER: PAZAR - ARA SOKAK",
        sceneClass: "scene-pazar-ara", // Yeni görsel (daha karanlık pazar)
        text: "Kalabalığın içinde bir gölge gibi süzülüyorsun. Devriyelerin bakışlarından kaçınıp, 'Bilgi Taciri'nin çalıştığı söylenen küçük ramen tezgahını buluyorsun. Tezgahın arkasında, yüzü dijital bir 'kedi' maskesiyle gizlenmiş biri (NEKO) sana bakıyor.",
        choices: [
            { text: "[PAROLA] 'Bu geceki yağmur sahteymiş.' de.", next: 'tacir_konusma' },
            { text: "[DOBRACA] 'Deşifre etmen gereken bir 'EKO'm var.' de.", next: 'tacir_dobra' },
            { text: "[ŞÜPHELİ] 'Sadece bir kase ramen alacaktım.' de.", next: 'tacir_ramen' }
        ]
    },

    'tacir_dobra': {
        location: "> YER: BİLGİ TACİRİ'NİN TEZGAHI",
        sceneClass: "scene-pazar-ara",
        text: "Neko'nun kedi maskesi alayla göz kırpıyor. 'EKO' kelimesini bu kadar yüksek sesle söylediğin için etraftaki 2-3 kişi dönüp sana baktı. Neko fısıldıyor: 'Acemi. Git buradan. Dikkat çekiyorsun.' Seni reddediyor.",
        choices: [
            { text: "[Geri çekil ve başka bir yol düşün.] (Gelecekte eklenecek)", next: 'pazar_yolculuk' } // Şimdilik Pazara dönsün
        ]
    },
    
    'tacir_ramen': {
        location: "> YER: BİLGİ TACİRİ'NİN TEZGAHI",
        sceneClass: "scene-pazar-ara",
        text: "Neko sana bir kase uzatıyor. 'Burada sadece ramen var, teknisyen.' diyor soğuk bir sesle. Seni test ediyor ve geçemedin. Çipini göstermeye cesaret edemiyorsun.",
        choices: [
            { text: "[Ramen'i ye ve sessizce ayrıl.]", next: 'kac_sonrasi' } // Vazgeçmiş sayılır
        ]
    },

    'tacir_konusma': {
        location: "> YER: BİLGİ TACİRİ'NİN TEZGAHI",
        sceneClass: "scene-pazar-ara",
        text: "Neko'nun dijital maskesi sabitleniyor. 'Ve her sahte yağmurun altında gerçek bir fırtına yatar,' diye cevap veriyor. Seni tezgahın arkasına, eski bir perdenin ardına çekiyor. 'Ne getirdin, küçük teknisyen? Ve Merkez'in dikkatini çekmeye değer mi?'",
        choices: [
            { text: "[ÇİPİ GÖSTER] 'Bunun ne olduğunu söyle. Bu bir yardım çağrısı.'", next: 'tacir_anlasma' },
            { text: "[TEDBİRLİ OL] 'Önce sen söyle, Merkez neden sinyalleri kesiyor?'", next: 'tacir_pazarlik' }
        ]
    },

    // Hikaye buradan sonra 'tacir_anlasma' veya 'tacir_pazarlik' ile devam edecek...
    // Şimdilik bunları başlangıca yönlendirelim.
    'tacir_anlasma': {
        location: "> YER: TEZGAH ARKASI",
        sceneClass: "scene-pazar-ara",
        text: "Neko çipi alıyor. 'Buna bakacağım... Ama bir bedeli var. Benim için Alt Seviyeler'den bir 'veri hayaleti' getirmen gerekecek.' (HİKAYE DEVAM EDECEK)",
        choices: [
            { text: "[Yeniden Başla]", next: 'start' }
        ]
    },
    'tacir_pazarlik': {
        location: "> YER: TEZGAH ARKASI",
        sceneClass: "scene-pazar-ara",
        text: "Neko gülüyor. 'Pazarlık etmeyi seviyorsun. Merkez, 'EKO'lardan korkmaz... Onların ne *olduklarından* korkar: Geçmişin yankıları. Ve bu yankılar Gök-Kale'nin duvarlarını çatlatabilir.' (HİKAYE DEVAM EDECEK)",
        choices: [
            { text: "[Yeniden Başla]", next: 'start' }
        ]
    }
};

// Oyunu başlatan fonksiyon
function startGame() {
    showScene('start');
}

// Sahneyi gösteren ana fonksiyon
function showScene(sceneKey) {
    const scene = story[sceneKey];
    if (!scene) {
        console.error(`Hata: '${sceneKey}' adında bir sahne bulunamadı!`);
        return;
    }

    // 1. Konum Metnini Güncelle
    locationTextElement.innerText = scene.location;
    
    // 2. Arka plan görselini (CSS sınıfını) güncelle
    visualPaneElement.className = 'scene-base ' + scene.sceneClass;
    
    // 3. Hikaye Metnini Güncelle
    gameTextElement.innerText = scene.text;

    // 4. Eski seçimleri temizle
    while (choicePaneElement.firstChild) {
        choicePaneElement.removeChild(choicePaneElement.firstChild);
    }

    // 5. Yeni seçim düğmelerini oluştur
    scene.choices.forEach(choice => {
        const button = document.createElement('button');
        button.innerText = choice.text;
        button.classList.add('choice-button');
        button.addEventListener('click', () => {
            showScene(choice.next);
        });
        choicePaneElement.appendChild(button);
    });
}