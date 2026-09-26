import streamlit as st
from PyPDF2 import PdfReader
import chromadb
from sentence_transformers import SentenceTransformer
import requests

st.set_page_config(page_title="RAG Bot - Moja skripta", page_icon="📚")

# ---------- Funkcije ----------
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
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)
    return chunks

def ask(question, model, collection):
    q_embedding = model.encode(question).tolist()
    results = collection.query(query_embeddings=[q_embedding], n_results=3)
    context = "\n\n".join(results['documents'][0])

    response = requests.post('http://localhost:11434/api/generate', json={
        "model": "llama3.2",
        "prompt": f"Na osnovu ovog konteksta iz skripte:\n\n{context}\n\nOdgovori na pitanje: {question}",
        "stream": False
    })
    return response.json()['response']

# ---------- Učitavanje (samo jednom, keširano) ----------
@st.cache_resource
def load_everything():
    full_text = extract_text("skripta.pdf")
    chunks = chunk_text(full_text)

    model = SentenceTransformer('all-MiniLM-L6-v2')
    client = chromadb.Client()
    collection = client.create_collection("skripta")

    for i, chunk in enumerate(chunks):
        embedding = model.encode(chunk).tolist()
        collection.add(
            embeddings=[embedding],
            documents=[chunk],
            ids=[f"chunk_{i}"]
        )
    return model, collection

# ---------- UI ----------
st.title("📚 RAG Bot - Moja skripta")
st.caption("Postavi pitanje o sadržaju PDF-a i dobij odgovor generisan lokalnim AI modelom.")

with st.spinner("Učitavam skriptu i pravim bazu znanja..."):
    model, collection = load_everything()

st.success("Bot je spreman!")

question = st.text_input("Tvoje pitanje:")

if question:
    with st.spinner("Tražim odgovor..."):
        answer = ask(question, model, collection)
    st.markdown("### Odgovor:")
    st.write(answer)