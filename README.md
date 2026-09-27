# Miš i sir - Q-Learning & SARSA 🐭🧀

Interaktivna vizualizacija reinforcement learning agenta koji uči da pronađe put kroz labirint koristeći dva klasična algoritma učenja: **Q-learning** i **SARSA**.


## Šta projekat radi

Miš startuje u donjem lijevom uglu mreže i uči, kroz stotine pokušaja (epizoda), da pronađe najkraći put do sira u gornjem desnom uglu - izbjegavajući zidove koje agent sam postavlja ili generiše nasumično.

Projekat je napravljen da **vizuelno pokaže proces učenja u realnom vremenu**, ne samo krajnji rezultat - uključujući Q-vrijednosti, statistiku napretka i poređenje dva različita algoritma na istom problemu.

## Funkcionalnosti

- **Ručno postavljanje zidova** klikom na mrežu
- **Nasumično generisanje labirinta** uz BFS provjeru da je put do cilja uvijek moguć
- **Q-learning i SARSA** - izbor algoritma iz padajućeg menija, uz mogućnost poređenja ponašanja na istom labirintu
- **Vizuelno treniranje uživo** - prati miša kako se kreće kroz epizode, sa opcijom da ubrzaš do kraja treninga
- **Q-value heatmap** - prikazuje naučenu "vrijednost" svakog polja bojom (crveno = loše, zeleno = dobro), otkriva koji put agent smatra optimalnim
- **Graf napretka** - broj koraka po epizodi kroz vrijeme, pokazuje da li agent stvarno uči

## Algoritmi - kratko objašnjenje

**Q-learning** (off-policy) - agent uči vrijednost *najbolje moguće* sljedeće akcije, bez obzira da li će je stvarno izabrati. Rezultat: agresivnija strategija koja cilja apsolutno najkraći put, čak i kad prolazi tik uz zidove.

**SARSA** (on-policy) - agent uči vrijednost akcije koju *stvarno* uzima sljedeći put, uključujući povremene nasumične poteze (epsilon-greedy istraživanje). Rezultat: opreznija strategija, blago izbjegava rizične puteve uz same zidove.

Ova razlika je eksperimentalno potvrđena u projektu - na istom labirintu, SARSA konzistentno pokazuje veći prosječan broj koraka po epizodi nego Q-learning, što odgovara poznatom "cliff walking" fenomenu iz literature (Sutton & Barto).

## Tehnologije

- Vanilla JavaScript (bez frameworka/build alata)
- HTML5 Canvas za crtanje mreže i vizualizacije
- Q-learning i SARSA implementirani od nule (tabelarni pristup)
- BFS za provjeru povezanosti generisanog labirinta

## Pokretanje

Projekat je čist HTML/CSS/JS bez servera ili instalacije:

1. Kloniraj repozitorijum
2. Otvori `index.html` u browseru (ili koristi Live Server ekstenziju u VS Code)

## Kako koristiti

1. Klikni na polja mreže da postaviš zidove, ili klikni "Generiši nasumičan labirint"
2. Izaberi algoritam (Q-learning ili SARSA) iz padajućeg menija
3. Klikni "Treniraj" da pokreneš učenje - prati miša i graf napretka uživo, ili klikni "Ubrzaj do kraja" da preskočiš animaciju
4. Uključi "Prikaži Q-value heatmap" da vidiš naučene vrijednosti polja
5. Klikni "Pusti miša" da vidiš najbolji naučeni put bez daljeg učenja
6. Koristi "Resetuj samo trening" da probaš drugi algoritam na **istom** labirintu radi poređenja

## Mogući dalji koraci

- Deep Q-Network (DQN) verzija koja generalizuje kroz različite labirinte umjesto pamćenja jednog rasporeda 
- Više ciljeva (agent skuplja više komada sira)
- Pokretne prepreke

