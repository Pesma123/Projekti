# RAG Bot - Pitaj svoju skriptu

Ovo je mali projekat koji sam napravila da isprobam RAG (Retrieval-Augmented Generation) pristup - u suštini, bot kojem daš PDF (skriptu, knjigu, predavanje) i onda mu postavljaš pitanja, a on ti odgovara na osnovu tog teksta, ne izmišlja odgovore od nule.

Ideja mi je bila da umjesto da ručno pretražujem skriptu za neki pojam, samo pitam bota i dobijem odgovor sa objašnjenjem.

## Kako radi

1. Učita se PDF i podijeli na manje dijelove teksta
2. Svaki dio se pretvori u embedding (vektorski zapis značenja) pomoću sentence-transformers modela
3. Ti dijelovi se čuvaju u ChromaDB bazi
4. Kad postaviš pitanje, bot pronađe najrelevantnije dijelove teksta i pošalje ih lokalnom LLM-u (Llama 3.2 preko Ollame) koji na osnovu toga formuliše odgovor

Sve radi lokalno na računaru, nema slanja podataka na internet i nema troškova - koristi Ollama umjesto plaćenog API-ja.

## Šta ti treba da pokreneš

- Python 3.10 ili noviji
- [Ollama](https://ollama.com) instalirana

## Setup

Prvo skini model za Ollama:
