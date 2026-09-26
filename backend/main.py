from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PyPDF2 import PdfReader
import chromadb
from sentence_transformers import SentenceTransformer
import requests
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = SentenceTransformer('all-MiniLM-L6-v2')
client = chromadb.Client()
collection = None

def extract_text(pdf_path):
    reader = PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text

def chunk_text(text, chunk_size=500, overlap=50):
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size - overlap):
        chunks.append(" ".join(words[i:i + chunk_size]))
    return chunks

def build_collection(pdf_path):
    global collection
    full_text = extract_text(pdf_path)
    chunks = chunk_text(full_text)

    try:
        client.delete_collection("skripta")
    except Exception:
        pass
    collection = client.create_collection("skripta")

    for i, chunk in enumerate(chunks):
        embedding = model.encode(chunk).tolist()
        collection.add(embeddings=[embedding], documents=[chunk], ids=[f"chunk_{i}"])

    return len(chunks)

@app.on_event("startup")
def startup_event():
    if os.path.exists("skripta.pdf"):
        build_collection("skripta.pdf")
        print("Default skripta.pdf učitana.")

class Question(BaseModel):
    question: str

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    save_path = f"uploaded_{file.filename}"
    with open(save_path, "wb") as f:
        f.write(await file.read())

    num_chunks = build_collection(save_path)
    return {"status": "ok", "chunks": num_chunks, "filename": file.filename}

@app.post("/ask")
def ask_question(q: Question):
    if collection is None:
        return {"answer": "Prvo uploaduj PDF."}

    q_embedding = model.encode(q.question).tolist()
    results = collection.query(query_embeddings=[q_embedding], n_results=3)
    context = "\n\n".join(results['documents'][0])

    response = requests.post('http://localhost:11434/api/generate', json={
        "model": "llama3.2",
        "prompt": f"Na osnovu ovog konteksta iz skripte:\n\n{context}\n\nOdgovori na pitanje: {q.question}",
        "stream": False
    })
    return {"answer": response.json()['response']}