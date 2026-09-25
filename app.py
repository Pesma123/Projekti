from PyPDF2 import PdfReader
import chromadb
from sentence_transformers import SentenceTransformer
import requests

# ---------- KORAK A: Ekstrakcija teksta ----------
def extract_text(pdf_path):
    reader = PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text

# ---------- KORAK B: Chunking ----------
def chunk_text(text, chunk_size=500, overlap=50):
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size - overlap):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)
    return chunks

print("Čitam PDF...")
full_text = extract_text("skripta.pdf")

print("Dijelim tekst na komade...")
chunks = chunk_text(full_text)
print(f"Ukupno {len(chunks)} komada teksta.")

# ---------- KORAK C: Embeddings + vektorska baza ----------
print("Učitavam embedding model (prvi put traje malo duže)...")
model = SentenceTransformer('all-MiniLM-L6-v2')

client = chromadb.Client()
collection = client.create_collection("skripta")

print("Pravim embeddinge i punim bazu...")
for i, chunk in enumerate(chunks):
    embedding = model.encode(chunk).tolist()
    collection.add(
        embeddings=[embedding],
        documents=[chunk],
        ids=[f"chunk_{i}"]
    )

# ---------- KORAK D: Poziv lokalnog Ollama modela ----------
def ask(question):
    q_embedding = model.encode(question).tolist()
    results = collection.query(query_embeddings=[q_embedding], n_results=3)
    context = "\n\n".join(results['documents'][0])

    response = requests.post('http://localhost:11434/api/generate', json={
        "model": "llama3.2",
        "prompt": f"Na osnovu ovog konteksta iz skripte:\n\n{context}\n\nOdgovori na pitanje: {question}",
        "stream": False
    })
    return response.json()['response']

# ---------- KORAK E: Interaktivni loop ----------
print("\n✅ Bot je spreman! Ukucaj pitanje (ili 'kraj' za izlaz)\n")
while True:
    q = input("Pitanje: ")
    if q.lower() == "kraj":
        break
    print("\nOdgovor:", ask(q), "\n")