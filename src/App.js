import React, {useState, useCallback} from 'react';
// Koristimo lukid-react za ikone
import { Search, MapPin, Cloud, Droplet, Wind, Loader, AlertTriangle } from 'lucide-react';

const API_KEY="adef4295cd6a5f7aa3213bb86981814d";
const BASE_URL="https://api.openweathermap.org/data/2.5/weather";

// Komponenta za ubrizgavanje CSS-a
const CustomStyles = () => (
  <style>{`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      transition: background-color 1s;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    }
    .weather-card {
      background-color: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(4px);
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      width: 100%;
      max-width: 420px;
    }
    .input-group {
      display: flex;
      border-radius: 0.75rem;
      overflow: hidden;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
    .input-field {
      flex-grow: 1;
      padding: 1rem;
      border: none;
      outline: none;
      color: #1f2937;
      transition: all 0.2s;
    }
    .input-field:focus {
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5); /* focus:ring-4 focus:ring-sky-400 */
    }
    .search-button {
      background-color: #0284c7; /* bg-sky-600 */
      color: white;
      padding: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s;
    }
    .search-button:hover:not(:disabled) {
      background-color: #0369a1; /* hover:bg-sky-700 */
    }
    .search-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .status-box {
      padding: 1rem;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
    }
    .loader-spin {
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .bg-clear { background-color: #0ea5e9; } /* sky-500 */
    .bg-clouds { background-color: #6b7280; } /* gray-500 */
    .bg-rain { background-color: #4f46e5; } /* indigo-600 */
    .bg-snow { background-color: #93c5fd; } /* blue-300 */
    .bg-default { background-color: #374151; } /* slate-700 */
    .bg-loading { background-color: #9ca3af; } /* gray-400 */
    .bg-error { background-color: #dc2626; } /* red-600 */
    .temp-large {
        font-size: 4.5rem; /* 7xl */
        font-weight: 300; /* light */
        color: #1f2937;
        border-bottom: 1px solid #e5e7eb;
        padding-bottom: 1rem;
        margin-bottom: 1rem;
    }
    .temp-unit {
        font-size: 2.25rem; /* 4xl */
        vertical-align: top;
    }
  `}</style>
);


// Glavna komponenta
function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Funkcija za dohvaćanje podataka o vremenu s eksponencijalnim odgodom (Exponential Backoff)
  const fetchWeather = useCallback(async (searchCity, attempt = 0) => {
    if (!searchCity) {
      setError("Molimo unesite ime grada.");
      return;
    }
    if (!API_KEY) {
        setError("API Ključ nije postavljen. Molimo ga dodajte u App.jsx datoteku.");
        setLoading(false);
        return;
    }

    setLoading(true);
    setError(null);
    setWeatherData(null);

    const url = `${BASE_URL}?q=${encodeURIComponent(searchCity)}&units=metric&appid=${API_KEY}&lang=hr`;

    try {
      // Implementacija eksponencijalnog backoff-a za pouzdanost
      const MAX_RETRIES = 3;
      for (let i = 0; i < MAX_RETRIES; i++) {
        const response = await fetch(url);
        
        if (response.ok) {
          const data = await response.json();
          setWeatherData(data);
          setLoading(false);
          return; // Uspješno, izlazimo
        }

        // Ako nije 404 (Not Found), pokušajte ponovo s odgodom
        if (response.status !== 404 && i < MAX_RETRIES - 1) {
          const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
          console.log(`Greška pri dohvaćanju (${response.status}). Pokušavam ponovno za ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          // Posljednji pokušaj ili 404 (trajni neuspjeh)
          if (response.status === 404) {
            setError(`Grad "${searchCity}" nije pronađen. Provjerite pravopis.`);
          } else {
            setError(`Došlo je do greške prilikom dohvaćanja podataka: ${response.statusText}`);
          }
          break; // Izlazimo iz petlje
        }
      }
    } catch (err) {
      console.error("Greška pri dohvaćanju:", err);
      setError("Mrežna greška. Provjerite svoju internetsku vezu.");
    } finally {
      setLoading(false);
    }
  }, []); // Prazan dependency array jer su konstante unutar funkcije

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather(city);
  };

  const WeatherCard = ({ data }) => {
    if (!data) return null;
    
    // Dohvaćanje relevantnih podataka
    const temp = Math.round(data.main.temp);
    const description = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);
    const humidity = data.main.humidity;
    const windSpeed = (data.wind.speed * 3.6).toFixed(1); // Konverzija iz m/s u km/h
    const iconCode = data.weather[0].icon;

    // Funkcija za odabir ikone na temelju koda
    const getWeatherIcon = (code) => {
        // Ovdje bi se trebala koristiti ikona iz API-ja, ali radi jednostavnosti koristimo lucide-react
        if (code.includes('01')) return <Cloud size={48} className="text-yellow-400" />; // Sunce/Vedro
        if (code.includes('09') || code.includes('10') || code.includes('11')) return <Droplet size={48} className="text-blue-500" />; // Kiša/Oluja
        if (code.includes('13')) return <div style={{color: 'white', fontSize: '3rem'}}>❄️</div>; // Snijeg
        return <Cloud size={48} style={{color: '#9ca3af'}} />; // Oblaci/Općenito
    };

    return (
      <div className="weather-card">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem'}}>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <h2 style={{fontSize: '1.875rem', fontWeight: 800, color: '#1f2937', display: 'flex', alignItems: 'center'}}>
              <MapPin size={24} style={{marginRight: '0.5rem', color: '#ef4444'}} />
              {data.name}
            </h2>
            <p style={{fontSize: '1rem', color: '#6b7280', marginTop: '0.25rem'}}>{description}</p>
          </div>
          <div style={{marginTop: '0.25rem'}}>
            {getWeatherIcon(iconCode)}
          </div>
        </div>

        <div className="temp-large">
          {temp}<span className="temp-unit">°C</span>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem'}}>
          <DetailItem icon={<Droplet size={18} />} label="Vlažnost" value={`${humidity}%`} />
          <DetailItem icon={<Wind size={18} />} label="Vjetar" value={`${windSpeed} km/h`} />
        </div>
      </div>
    );
  };

  const DetailItem = ({ icon, label, value }) => (
    <div style={{display: 'flex', alignItems: 'center', columnGap: '0.75rem', backgroundColor: 'rgba(249, 250, 251, 0.7)', padding: '0.75rem', borderRadius: '0.5rem'}}>
      <div style={{color: '#6b7280'}}>{icon}</div>
      <div>
        <p style={{fontSize: '0.75rem', fontWeight: 500, color: '#6b7280', textTransform: 'uppercase'}}>{label}</p>
        <p style={{fontSize: '1.125rem', fontWeight: 600, color: '#1f2937'}}>{value}</p>
      </div>
    </div>
  );
  
  // Kontekstualna pozadina na temelju statusa (Radi samo vizualno, nije povezano s pravim vremenom)
  const getBackgroundClass = () => {
    if (loading) return "bg-loading";
    if (error) return "bg-error";
    if (weatherData) {
      const main = weatherData.weather[0].main.toLowerCase();
      if (main.includes('clear')) return "bg-clear";
      if (main.includes('clouds')) return "bg-clouds";
      if (main.includes('rain')) return "bg-rain";
      if (main.includes('snow')) return "bg-snow";
      return "bg-default";
    }
    return "bg-default"; // Početna pozadina
  };


  return (
    <div className={`app-container ${getBackgroundClass()}`}>
      
      {/* Ubacujemo CSS definicije */}
      <CustomStyles /> 

      <h1 style={{fontSize: '2.25rem', fontWeight: 800, marginBottom: '2rem', color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.3)'}}>Vremenska Aplikacija</h1>

      {/* Obrazac za pretragu */}
      <form onSubmit={handleSearch} style={{width: '100%', maxWidth: '40rem', marginBottom: '2rem'}}>
        <div className="input-group">
          <input
            type="text"
            placeholder="Unesite ime grada..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="input-field"
            aria-label="Unesite ime grada"
          />
          <button
            type="submit"
            className="search-button"
            disabled={loading}
            aria-label="Pretraži vrijeme"
          >
            {loading ? <Loader size={24} className="loader-spin" /> : <Search size={24} />}
          </button>
        </div>
      </form>

      {/* Prikaz Statusa */}
      <div style={{minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        {loading && (
          <div className="status-box" style={{color: 'white', backgroundColor: 'rgba(0,0,0,0.3)'}}>
            <Loader size={20} className="loader-spin" style={{marginRight: '0.75rem'}} />
            <p style={{fontSize: '1.125rem'}}>Učitavanje...</p>
          </div>
        )}

        {error && (
          <div className="status-box" style={{color: 'white', backgroundColor: 'rgba(220, 38, 38, 0.8)'}}>
            <AlertTriangle size={20} style={{marginRight: '0.75rem'}} />
            <p style={{fontSize: '1.125rem'}}>{error}</p>
          </div>
        )}

        {weatherData && !loading && !error && <WeatherCard data={weatherData} />}
      </div>

    </div>
  );
}

export default App;
