
# RAG Bot - Pitaj svoju skriptu

Full-stack aplikacija koja odgovara na pitanja na osnovu sadržaja PDF dokumenta - daš joj skriptu, knjigu ili predavanje, i ona ti odgovara na osnovu tog teksta, ne izmišlja odgovore od nule. Koristi RAG (Retrieval-Augmented Generation) pristup: tekst se pretvori u embeddinge, sačuva u vektorskoj bazi, i kad postaviš pitanje, najrelevantniji dijelovi se šalju lokalnom LLM-u koji formuliše odgovor.

Sve radi lokalno - nema slanja podataka na internet i nema troškova, jer se koristi Ollama (Llama 3.2) umjesto plaćenog API-ja.

## Tehnologije

**Backend:** FastAPI, ChromaDB (vektorska baza), sentence-transformers (embeddings), Ollama (lokalni LLM)
**Frontend:** React (Vite)

## Kako radi

1. PDF se učita i podijeli na manje dijelove teksta
2. Svaki dio se pretvori u embedding pomoću sentence-transformers modela
3. Dijelovi se čuvaju u ChromaDB bazi
4. Kad postaviš pitanje, bot pronađe najrelevantnije dijelove teksta i pošalje ih lokalnom LLM-u (Llama 3.2 preko Ollame) koji na osnovu toga formuliše odgovor
5. Sve se prikazuje kroz React chat interfejs, sa mogućnošću uploada bilo kog PDF-a direktno kroz UI

## Šta ti treba da pokreneš

- Python 3.10+
- Node.js 18+
- [Ollama](https://ollama.com) instalirana

## Setup

Skini model za Ollama:
```
ollama pull llama3.2
```

### Backend

```
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Backend će raditi na `http://localhost:8000` (dokumentacija API-ja na `/docs`).

### Frontend

U novom terminalu:
```
cd frontend
npm install
npm run dev
```



### Pokretanje

Trebaju ti tri stvari pokrenute istovremeno: Ollama (u pozadini), backend i frontend (svaki u svom terminalu).

Otvori `http://localhost:5173` u browseru i uploaduj bilo koji PDF, ili koristi default `skripta.pdf` koji se automatski učitava pri pokretanju backend-a.

## Šta bih poboljšala kasnije

- Historija razgovora (čuvanje u bazi, ne gubi se pri refresh-u)
- Streaming odgovora riječ po riječ
- Docker za pokretanje jednom komandom
- Deploy online

## Zašto sam ovo napravila

Treća sam godina na ETF-u i htjela sam da isprobam nešto praktično sa AI-jem van onoga što se radi na fakultetu - RAG je trenutno jedna od korisnijih stvari koje se rade sa LLM-ovima u praksi, pa mi je ovo bio dobar način da to naučim kroz konkretan projekat, od jednostavnog CLI skripta do full-stack aplikacije sa svojim backend-om i frontend-om.
