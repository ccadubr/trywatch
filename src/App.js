import './App.css';
import CountdownTimer from './components/countDownTimes';
import logo from './images/logo_trybe.svg';

function App() {
  return (
    <>
      <header>
        <img src={logo} alt={logo} />
      </header>
    <div className="container">
      <CountdownTimer />
    </div>
      <footer>Desenvolvido por: Ruan Portella & Carlos Eduardo</footer>
    </>
  );
}

export default App;