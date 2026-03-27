💍 Digitalna Pozivnica za Vjenčanje
Moderna, responzivna i interaktivna digitalna pozivnica kreirana kao Single Page Application (SPA). Projekat uključuje animirano otvaranje koverte, prikaz lokacije putem Google Maps-a i integrisanu RSVP formu koja podatke šalje direktno u Google Sheets.

🚀 Tehnologije
U izradi ovog projekta korištene su sljedeće tehnologije i biblioteke:

React.js (Vite) – Core framework za izgradnju korisničkog interfejsa.

Framer Motion – Korišten za napredne animacije (otvaranje koverte, pojavljivanje elemenata).

CSS3 (Flexbox & Media Queries) – Za potpuno responzivan dizajn prilagođen mobilnim uređajima i desktopu.

Axios – Za slanje HTTP POST zahtjeva prema API-ju.

SheetDB – Servis koji omogućava korištenje Google Sheets-a kao baze podataka za RSVP potvrde.

Vercel – Platforma korištena za hosting i kontinuirani deployment.

✨ Ključne Funkcionalnosti
Interaktivna Koverta: Animacija koja simulira otvaranje koverte na klik korisnika.

Responzivni Dizajn: Automatsko prilagođavanje izgleda ekrana za mobilne telefone (iPhone/Android) i desktop računare.

RSVP Forma: Gosti mogu potvrditi svoj dolazak, a podaci se automatski upisuju u tabelu organizatora u realnom vremenu.

Integracija Mapa: Brzi link za navigaciju gostiju do tačne lokacije hotela/restorana.

🛠️ Instalacija i Pokretanje
Da biste pokrenuli projekat lokalno, pratite ove korake:

Klonirajte repozitorij:

Bash
git clone [link-tvoj-repozitorij]
Uđite u folder projekta:

Bash
cd nova-pozivnica
Instalirajte zavisnosti:

Bash
npm install
Pokrenite razvojni server:

Bash
npm run dev
📂 Struktura Projekta
Plaintext
src/
├── assets/          # Slike i floralni ukrasi
├── App.jsx          # Glavna logika aplikacije i animacije
├── App.css          # Stilovi, media queries i centriranje
└── main.jsx         # Entry point aplikacije
Kako da ovo dodaš?
U korijenu tvog projekta (tamo gdje su package.json i src) napravi novi fajl i nazovi ga README.md.

Zalijepi ovaj tekst unutra.

Sačuvaj i uradi standardni git postupak:

Bash
git add README.md
git commit -m "Dodat dokumentovan README"
git push origin dizajn-popravke
