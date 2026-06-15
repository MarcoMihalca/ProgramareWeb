/* public/app.js */
let restaurante = []; 
let cosCumparaturi = JSON.parse(localStorage.getItem('cosFoodApp')) || [];
let adresaLivrare = localStorage.getItem('adresaFoodApp') || null;
let comenziSalvate = JSON.parse(localStorage.getItem('comenziFoodApp')) || [];
// Lista globala de extras (garnituri si bauturi)
const extrasDisponibile = [
    { id: 'g1', nume: 'Cartofi prajiti', pret: 8 },
    { id: 'g2', nume: 'Salata verde', pret: 7 },
    { id: 'b1', nume: 'Suc Cola 330ml', pret: 6 },
    { id: 'b2', nume: 'Suc Portocale 330ml', pret: 6 }
];

let produsInAsteptare = null; // produsul pentru care se aleg extras

async function incarcaRestauranteDeLaServer() {
    try {
        const response = await fetch('/api/restaurante');
        if (!response.ok) throw new Error("Eroare de rețea");
        restaurante = await response.json(); 
        arataBunVenit(); 
    } catch (error) {
        console.error("Eroare:", error);
        document.getElementById('pagina-bun-venit').innerHTML = `
            <p style="color: red; font-weight: bold; text-align: center;">
                Eroare: Nu m-am putut conecta la serverul Node.js. <br>
                Asigură-te că rulează (node server.js)!
            </p>`;
    }
}

function arataBunVenit() {
    document.getElementById('pagina-bun-venit').style.display = 'flex';
    document.getElementById('lista-restaurante').style.display = 'none';
    document.getElementById('sectiune-meniu').style.display = 'none';
    document.getElementById('sectiune-cos').style.display = 'none';
    document.getElementById('sectiune-comenzi').style.display = 'none';
    document.getElementById('buton-inapoi').style.display = 'none';
}

// Aceasta este funcția pe care butoanele din Welcome o apelează
function alegeMood(categorie) {
    // 1. Punem categoria în bara de căutare (invizibil)
    const inputCautare = document.getElementById('input-cautare');
    inputCautare.value = categorie;
    
    // 2. Declanșăm filtrarea care se va ocupa să ascundă Welcome-ul și să arate restaurantele
    filtreazaRestaurante();
}

function filtreazaRestaurante() {
    const termenCautat = document.getElementById('input-cautare').value.toLowerCase();
    
    const restauranteFiltrate = restaurante.filter(restaurant => {
        const potrivireNume = restaurant.nume.toLowerCase().includes(termenCautat);
        const potrivireDescriere = restaurant.descriere.toLowerCase().includes(termenCautat);
        const potrivireMeniu = restaurant.meniu.some(produs => produs.nume.toLowerCase().includes(termenCautat));
        return potrivireNume || potrivireDescriere || potrivireMeniu;
    });

    arataRestaurantele(restauranteFiltrate);
}

function schimbaLocatia() {
    const alegere = confirm("Apasă 'OK' pentru a detecta automat orașul/județul prin GPS, sau 'Cancel' pentru a introduce manual adresa.");
    
    if (alegere) {
        if (navigator.geolocation) {
            document.getElementById('locatie-curenta').innerText = "📍 Se caută orașul...";
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    const urlAPI = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
                    
                    fetch(urlAPI)
                        .then(response => response.json())
                        .then(data => {
                            const adresaCompleta = data.address;
                            const oras = adresaCompleta.city || adresaCompleta.town || adresaCompleta.village || adresaCompleta.municipality || "Oraș necunoscut";
                            const judet = adresaCompleta.county || "Județ necunoscut";
                            
                            adresaLivrare = `${oras}, ${judet}`;
                            actualizeazaAfisajLocatie();
                        })
                        .catch(eroare => {
                            cereLocatieManual();
                        });
                },
                (error) => {
                    cereLocatieManual();
                }
            );
        } else {
            cereLocatieManual();
        }
    } else {
        cereLocatieManual();
    }
}

function cereLocatieManual() {
    const adresaNoua = prompt("Te rugăm să introduci orașul și județul:", adresaLivrare || "");
    if (adresaNoua && adresaNoua.trim() !== "") {
        adresaLivrare = adresaNoua;
        actualizeazaAfisajLocatie();
    } else if (!adresaLivrare) {
        actualizeazaAfisajLocatie(); 
    }
}

function actualizeazaAfisajLocatie() {
    const spanLocatie = document.getElementById('locatie-curenta');
    if (adresaLivrare) {
        spanLocatie.innerText = `📍 ${adresaLivrare}`;
        localStorage.setItem('adresaFoodApp', adresaLivrare);
    } else {
        spanLocatie.innerText = `📍 Apasă aici pentru a seta locația`;
        localStorage.removeItem('adresaFoodApp');
    }
}

function arataRestaurantele(listaDeAfisat = null) {
    document.getElementById('pagina-bun-venit').style.display = 'none';
    document.getElementById('sectiune-meniu').style.display = 'none';
    document.getElementById('sectiune-cos').style.display = 'none';
    document.getElementById('sectiune-comenzi').style.display = 'none';
    document.getElementById('lista-restaurante').style.display = 'block';
    
    const btnInapoi = document.getElementById('buton-inapoi');
    btnInapoi.style.display = 'inline-block';
    btnInapoi.innerText = "🏠 Acasă";
    btnInapoi.onclick = arataBunVenit;
    
    const container = document.getElementById('container-restaurante');
    container.innerHTML = ''; 

    let listaFinala = listaDeAfisat;
    if (!listaFinala) {
        listaFinala = restaurante;
        document.getElementById('input-cautare').value = '';
    }

    if (listaFinala.length === 0) {
        container.innerHTML = '<p>Nu am găsit niciun rezultat. Încearcă altceva!</p>';
        return;
    }

    listaFinala.forEach(restaurant => {
        const div = document.createElement('div');
        div.innerHTML = `
            <div style="background: white; padding: 20px; border-radius: 15px; margin-bottom: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <h3>${restaurant.nume}</h3>
                <p>${restaurant.descriere}</p>
                <button onclick="arataMeniul(${restaurant.id})" style="padding: 10px 15px; cursor: pointer; border-radius: 8px; border: 1px solid #ccc; background: white;">Vezi Meniul</button>
            </div>
        `;
        container.appendChild(div);
    });
}

function arataMeniul(idRestaurant) {
    const restaurant = restaurante.find(r => r.id === idRestaurant);
    
    document.getElementById('lista-restaurante').style.display = 'none';
    document.getElementById('sectiune-cos').style.display = 'none';
    document.getElementById('sectiune-comenzi').style.display = 'none';
    document.getElementById('sectiune-meniu').style.display = 'block';
    
    const btnInapoi = document.getElementById('buton-inapoi');
    btnInapoi.style.display = 'inline-block';
    btnInapoi.innerText = "⬅️ Restaurante";
    btnInapoi.onclick = () => arataRestaurantele();
    
    document.getElementById('nume-restaurant-selectat').innerText = `Meniul de la ${restaurant.nume}`;
    
    const containerMeniu = document.getElementById('container-meniu');
    containerMeniu.innerHTML = ''; 

    restaurant.meniu.forEach(produs => {
        const greutateAfisata = produs.greutate || 'Nespecificat';
        const imagineAfisata = produs.imagine || 'https://via.placeholder.com/900x600?text=Imagine+produs';
        const safeNume = produs.nume.replace(/\s+/g, '_');
        const div = document.createElement('div');
        div.innerHTML = `
            <div style="background: white; padding: 16px; border-radius: 18px; margin-bottom: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden;">
                <img src="${imagineAfisata}" alt="${produs.nume}" style="width: 100%; height: 220px; object-fit: cover; border-radius: 14px; margin-bottom: 14px;">
                <div style="display: flex; justify-content: space-between; gap: 16px; align-items: center;">
                    <div>
                        <h4 style="margin: 0 0 5px 0;">${produs.nume}</h4>
                        <p style="margin: 0; color: #666;">${produs.pret} RON</p>
                        <p style="margin: 4px 0 0 0; color: #888; font-size: 0.95em;">Greutate: ${greutateAfisata}</p>
                    </div>
                    <button class="btn-adauga" data-nume="${produs.nume}" data-pret="${produs.pret}" style="padding: 10px 20px; background-color: #ffeb3b; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; white-space: nowrap;">+ Adaugă</button>
                </div>
            </div>
        `;
        containerMeniu.appendChild(div);

        // attach handler for the new button
        const btn = div.querySelector('.btn-adauga');
        if (btn) {
            if (produs.nume !== 'Prăjitură cu mere' && produs.nume !== 'Cappuccino') {
                btn.addEventListener('click', () => deschideModalExtras(produs));
            } else {
                btn.addEventListener('click', () => adaugaInCos(produs.nume, produs.pret));
            }
        }
    });
}

function deschideModalExtras(produs) {
    produsInAsteptare = produs;
    const div = document.getElementById('extras-list');
    div.innerHTML = '';
    extrasDisponibile.forEach(item => {
        const row = document.createElement('div');
        row.className = 'extras-item';
        row.innerHTML = `<label><input type="checkbox" data-id="${item.id}" data-pret="${item.pret}"> ${item.nume}</label><span>${item.pret} RON</span>`;
        div.appendChild(row);
    });
    document.getElementById('modal-extras').style.display = 'flex';
}

document.addEventListener('DOMContentLoaded', () => {
    const btnCancel = document.getElementById('btn-cancel-extras');
    const btnAdd = document.getElementById('btn-add-extras');
    if (btnCancel) btnCancel.addEventListener('click', () => {
        document.getElementById('modal-extras').style.display = 'none';
        produsInAsteptare = null;
    });
    if (btnAdd) btnAdd.addEventListener('click', () => {
        const checks = Array.from(document.querySelectorAll('#extras-list input[type="checkbox"]:checked'));
        const extrasSelectate = checks.map(ch => ({ id: ch.dataset.id, nume: ch.parentElement.textContent.trim(), pret: Number(ch.dataset.pret) }));
        const totalExtras = extrasSelectate.reduce((s, e) => s + e.pret, 0);
        cosCumparaturi.push({ nume: produsInAsteptare.nume + (extrasSelectate.length ? ' + extras' : ''), pret: produsInAsteptare.pret + totalExtras, extras: extrasSelectate });
        actualizeazaCos();
        arataPopupCos(produsInAsteptare.nume + (extrasSelectate.length ? ' + extras' : ''));
        document.getElementById('modal-extras').style.display = 'none';
        produsInAsteptare = null;
    });
});

function arataCosul() {
    document.getElementById('pagina-bun-venit').style.display = 'none';
    document.getElementById('lista-restaurante').style.display = 'none';
    document.getElementById('sectiune-meniu').style.display = 'none';
    document.getElementById('sectiune-comenzi').style.display = 'none';
    document.getElementById('sectiune-cos').style.display = 'block';

    const btnInapoi = document.getElementById('buton-inapoi');
    btnInapoi.style.display = 'inline-block';
    btnInapoi.innerText = "🏠 Acasă";
    btnInapoi.onclick = arataBunVenit;
}

function arataComenzileMele() {
    document.getElementById('pagina-bun-venit').style.display = 'none';
    document.getElementById('lista-restaurante').style.display = 'none';
    document.getElementById('sectiune-meniu').style.display = 'none';
    document.getElementById('sectiune-cos').style.display = 'none';
    document.getElementById('sectiune-comenzi').style.display = 'block';

    const btnInapoi = document.getElementById('buton-inapoi');
    btnInapoi.style.display = 'inline-block';
    btnInapoi.innerText = "🏠 Acasă";
    btnInapoi.onclick = arataBunVenit;

    actualizeazaListaComenzi();
}

// Funcția existentă, ușor modificată
function adaugaInCos(numeProdus, pretProdus) {
    cosCumparaturi.push({ nume: numeProdus, pret: pretProdus });
    actualizeazaCos();
    
    // NOU: Apelăm funcția care arată pop-up-ul
    arataPopupCos(numeProdus);
}

// NOU: Logica pentru Pop-up
let timeoutPopup; // Variabilă pentru a ține minte timer-ul
function arataPopupCos(nume) {
    const toast = document.getElementById('toast-notificare');
    
    // Schimbăm textul să includă numele produsului
    toast.innerText = `➕ ${nume} adăugat în coș!`;
    
    // Îi punem clasa care îl ridică pe ecran
    toast.classList.add('arata');

    // Dacă utilizatorul apasă rapid pe mai multe produse, resetăm timerul anterior
    clearTimeout(timeoutPopup);
    
    // Setăm un timer să dispară după 2.5 secunde
    timeoutPopup = setTimeout(() => {
        toast.classList.remove('arata');
    }, 2500);
}

function stergeDinCos(index) {
    cosCumparaturi.splice(index, 1);
    actualizeazaCos();
}

function actualizeazaCos() {
    const listaCos = document.getElementById('lista-cos');
    const totalCos = document.getElementById('total-cos');
    const butonHeader = document.getElementById('buton-cos-header');
    
    listaCos.innerHTML = ''; 
    let sumaTotala = 0;

    localStorage.setItem('cosFoodApp', JSON.stringify(cosCumparaturi));

    if (cosCumparaturi.length === 0) {
        listaCos.innerHTML = '<li>Momentan coșul este gol.</li>';
        totalCos.innerText = 'Total: 0 RON';
        butonHeader.innerText = `🛒 Coș (0 RON)`; 
        return; 
    }

    cosCumparaturi.forEach((produs, index) => {
        sumaTotala += produs.pret;
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${produs.nume}</span> 
            <span>${produs.pret} RON <button onclick="stergeDinCos(${index})" style="color: red; border: none; background: none; cursor: pointer; font-size: 1.2em; margin-left: 10px;">✖</button></span>
        `;
        listaCos.appendChild(li);
    });

    totalCos.innerText = `Total: ${sumaTotala} RON`;
    butonHeader.innerText = `🛒 Coș (${sumaTotala} RON)`; 
}

function actualizeazaListaComenzi() {
    const listaComenzi = document.getElementById('lista-comenzi');
    if (!listaComenzi) return;

    localStorage.setItem('comenziFoodApp', JSON.stringify(comenziSalvate));
    listaComenzi.innerHTML = '';

    if (comenziSalvate.length === 0) {
        listaComenzi.innerHTML = '<div class="comanda-card gol">Nu ai încă nicio comandă plasată.</div>';
        return;
    }

    comenziSalvate.forEach((comanda) => {
        const produseHtml = comanda.produse
            .map(produs => `<li>${produs.nume} <span>${produs.pret} RON</span></li>`)
            .join('');

        const card = document.createElement('article');
        card.className = 'comanda-card';
        card.innerHTML = `
            <div class="comanda-card__top">
                <div>
                    <h3>Comanda ${comanda.id}</h3>
                    <p>${new Date(comanda.data).toLocaleString('ro-RO')}</p>
                </div>
                <span class="status-comanda">${comanda.status}</span>
            </div>
            <p><strong>Adresă:</strong> ${comanda.adresa}</p>
            <p><strong>Total:</strong> ${comanda.total} RON</p>
            <ul class="lista-produse-comanda">${produseHtml}</ul>
        `;
        listaComenzi.appendChild(card);
    });
}

function trimiteComanda() {
    if (cosCumparaturi.length === 0) {
        alert("Nu poți plasa o comandă goală!");
        return;
    }
    if (!adresaLivrare) {
        alert("Te rugăm să setezi o locație înainte de a plasa comanda!");
        return;
    }

    const sumaTotala = cosCumparaturi.reduce((total, produs) => total + produs.pret, 0);
    const comandaNoua = {
        id: `CMD-${Date.now().toString().slice(-6)}`,
        data: new Date().toISOString(),
        adresa: adresaLivrare,
        produse: cosCumparaturi.map(produs => ({ ...produs })),
        total: sumaTotala,
        status: 'Plasată'
    };

    comenziSalvate.unshift(comandaNoua);
    localStorage.setItem('comenziFoodApp', JSON.stringify(comenziSalvate));

    alert(`Comanda se va livra la adresa:\n${adresaLivrare}\n\nTotal de plată: ${sumaTotala} RON\nCurierul este pe drum!`);
    
    cosCumparaturi = [];
    actualizeazaCos();
    actualizeazaListaComenzi();
    arataBunVenit(); // Ne întoarcem pe pagina principală după comandă
}

// Inițializare aplicație
actualizeazaAfisajLocatie(); 
actualizeazaCos(); 
actualizeazaListaComenzi();
incarcaRestauranteDeLaServer();