import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import './App.css';

function App() {
  const [otvoreno, setOtvoreno] = useState(false);
  const [formData, setFormData] = useState({ ime: '', prezime: '', dolazak: 'Da' });
  const [poslano, setPoslano] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://sheetdb.io/api/v1/zm41dwrk5bf57', {
      data: [formData]
    }).then((response) => {
      console.log("Uspješno poslano!", response);
      setPoslano(true);
    }).catch((error) => {
      console.error("Greška pri slanju:", error);
      alert("Greška! Provjerite konzolu.");
    });
  };

  return (
    <div className="glavni-kontejner">
      {!otvoreno ? (
        <motion.div 
          onClick={() => setOtvoreno(true)}
          whileHover={{ scale: 1.05 }}
          className="koverta-sekcija"
        >
          {/* Ovdje smo dodali klasu koverta-emoji umjesto inline stila */}
          <span className="koverta-emoji">✉️</span>
          <p style={{ fontFamily: 'Playfair Display', color: '#cda26f' }}>
            Kliknite da otvorite pozivnicu.
          </p>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }}
          className="pozivnica-kartica"
        >
          <img 
            src="https://cdn-icons-png.flaticon.com/512/2913/2913564.png" 
            alt="floral header" 
            className="floral-header" 
          />

          <p className="imena">OsobaA & OsobaB</p>
          
          <p className="tekst-pozivnice">
            "Prave ljubavne priče nikada nemaju završetak... <br />
            Podijelite s nama početak."
          </p>
          
          <hr />

          <p className="podaci">
            AUGUST <br />
            29 | SUBOTA | 2026 <br />
            17:00h
          </p>

          <div style={{ margin: '20px 0 40px 0' }}>
            <a 
              href="https://www.google.com/maps" // Ovdje kasnije stavi link hotela
              target="_blank" 
              rel="noreferrer"
              className="btn-lokacija"
            >
              📍 POGLEDAJ LOKACIJU NA MAPI
            </a>
          </div>

          <div className="rsvp-naslov">Potvrdite dolazak</div>
          
          {!poslano ? (
            <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
              <div className="form-grupa">
                <input 
                  type="text" 
                  placeholder="Vaše Ime"
                  required 
                  onChange={(e) => setFormData({...formData, ime: e.target.value})} 
                />
              </div>
              <div className="form-grupa">
                <input 
                  type="text" 
                  placeholder="Vaše Prezime"
                  required 
                  onChange={(e) => setFormData({...formData, prezime: e.target.value})} 
                />
              </div>
              <div className="form-grupa">
                <select onChange={(e) => setFormData({...formData, dolazak: e.target.value})}>
                  <option value="Da">Dolazim sa zadovoljstvom</option>
                  <option value="Ne">Nažalost, neću moći</option>
                </select>
              </div>
              <button type="submit" className="btn-potvrda">POŠALJI ODGOVOR</button>
            </form>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{marginTop: '20px'}}>
              <h3 style={{ color: '#cda26f', fontFamily: 'Playfair Display' }}>Hvala na odgovoru!</h3>
              <p style={{ fontFamily: 'Playfair Display' }}>Vaša potvrda je uspješno zabilježena.</p>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default App;