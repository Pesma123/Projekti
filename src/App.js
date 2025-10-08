import React, { useState} from 'react';
import './App.css';


/*Podatci za kviz*/
const quizData= [
  {
    id:1,
    questionText: "Koji je glavni grad Bosne i Hercegovine?",
    options: ["Mostar", "Sarajevo", "Travnik", "Tuzla"],
    correctAnswer: "Sarajevo",
  },
  {
    id:2,
    questionText: "Kako se zove nas poznati glumac koji je glumio Izeta?",
    options: ["Meho", "Mustafa", "Ibro", "Izet"],
    correctAnswer: "Mustafa",
  },
  {
     id:3,
    questionText: "Koja rijeka protice kroz Mostar?",
    options: ["Vrbas", "Dunav", "Neretva", "Miljacka"],
    correctAnswer: "Neretva",
  },
  {
     id:4,
    questionText: "Koliko godina ima Iris?",
    options: ["16", "14", "15", "11"],
    correctAnswer: "15",
  },
];

//Glavna APP
function App () {
  /*kontrola aplikaicje*/
  const [quizStatus, setQuizStatus]=useState('start');
  const [currentQuestionIndex, setCurrentQuestionIndex]=useState(0);
  const[score, setScore]=useState(0);

  const currentQuestion=quizData[currentQuestionIndex];

  /*Logika odgovaranja*/
  const handleAnswer=(selectedOption)=> {
    if(selectedOption === currentQuestion.correctAnswer){
      setScore(prevScore=> prevScore+1);
    }
    const nextIndex=currentQuestionIndex+1; //prelazak na iduce pitanje
    if(nextIndex<quizData.length) {
      //ako ima jos pitanja idi na iduce
      setCurrentQuestionIndex(nextIndex);
    }else{
      //ako nema vise pitanja zavrsi kviz
      setQuizStatus('finished');
    }
  };

  //funkcija za restartovanje kviza
  const restartQuiz =()=> {
    setQuizStatus('start');
    setCurrentQuestionIndex(0);
    setScore(0);
  };

  let sadrzaj;
  if(quizStatus==='start') {
    sadrzaj=(
      <div className="quiz-container start-screen">
        <h2>Dobrodošli na KVIZ</h2>
        <p>Provjerite svoje znanje sa {quizData.length} pitanja.</p>
        <button className="start-btn" onClick={()=>setQuizStatus('active')}>
          Započni kviz
        </button>
      </div>
    );
  }else if(quizStatus==='active') {
    //aktivna pitanja
    sadrzaj=(
      <div className="quiz-container question-screen">
        <p className="status-text">Pitanje {currentQuestionIndex+1} od {quizData.length}</p>
        
         <div className="question-box">
          <h3>{currentQuestion.questionText}</h3>
        </div>
       
       <div className=" options-container">
          {currentQuestion.options.map((option, index)=>(
            <button 
            key={index}
            className="option-btn"
            onClick={()=>handleAnswer(option)}>{option}</button>
          ))}
        </div>
      </div>
    );
  }else if(quizStatus==='finished'){
    const postotak=((score/quizData.length)*100).toFixed(0);

    sadrzaj=(
      <div className="quiz-container result-screen">
        <h2>Kviz završen!</h2>
        <p className="result-score">Vaš rezultat: <strong> {score}/{quizData.length} </strong></p>
        <p className="result-percentge">Uspjesnost: {postotak}%</p>

        <button className="restart-btn" onClick={restartQuiz}>Pokušajte ponovo</button>
      </div>
    );
  }

  return (
    <div className="app-main">
      
      <header>
        <h1>KVIZ</h1>
      </header>
      {sadrzaj}
    </div>
  );
}
export default App;