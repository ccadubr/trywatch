import React, { Component } from 'react';
import './countDownTimes.css';
import alarm from '../assets/alarm.wav'

class CountdownTimer extends Component {
  constructor(props) {
    super(props);

    this.state = {
     inputNumber: '',
     RestartNumber: 0,
     time: 0,
     finished: false,
     paused: false,
     disable: true,
     start: true,
     notStarted: true,
     disableInput: false,
    };
  }

  handleChange = ({ target }) => {
    const { value } = target

    let disable;

    if (value.includes(':')) {
        const regex2 = /^[0-5]?[0-9]:[0-5][0-9]$/;
        disable = !value.match(regex2);
    } else {
        const regex = /^([1-5][0-9]|[1-9])m\s([1-5][0-9]|[1-9])s$|^([1-5][0-9]|[1-9])(m|s)$/;
        disable = !value.match(regex);
    
    }

    this.setState({ inputNumber: value, disable });
  };

  restartTimer = () => {
    this.interval = setInterval(() => {
      const { time } = this.state;
      if (time > 0) {
        this.setState({ time: time - 1, finished: false, });
      } else {
        clearInterval(this.interval);
        this.setState({ finished: true, start: true, notStarted: true, disableInput: false, disable: true });
      }
    }, 1000);

    this.setState({ paused: false });
  };

  startTimer = () => {
    const { inputNumber } = this.state;
    let minutes = 0;
    let seconds = 0;

    const hasMinutes = inputNumber.includes('m');
    const hasSeconds = inputNumber.includes('s');
    const hasP = inputNumber.includes(':');

    if (hasMinutes) minutes = inputNumber.replace('m', '');
    if (hasSeconds) seconds = inputNumber.replace('s', '');
    if (hasMinutes && hasSeconds) [minutes, seconds] = inputNumber.split('m').map(item => item.replace('s', ''));
    if (hasP) {
      const x = inputNumber.split(':');
      minutes = x[0];
      seconds = x[1];
    }

    this.setState({
      time: Number(minutes) * 60 + Number(seconds),
      inputNumber: '',
      RestartNumber: Number(minutes) * 60 + Number(seconds),
      paused: false,
      finished: false,
      start: false,
      notStarted: false,
      disableInput: true
    });
    this.restartTimer();
  };

  pauseTimer = () => {
    clearInterval(this.interval);
    this.setState({ paused: true, disableInput: true });
  };

  stopTimer = () => {
    clearInterval(this.interval);
    this.setState({ inputNumber: '', time: 0, RestartNumber: 0, start: true, disable: true, notStarted: true, disableInput: false });
  };

  default = () => {
    this.setState({
    time: 600,
    inputNumber: '',
    RestartNumber: 600,
    paused: false,
    finished: false,
    start: false,
    notStarted: false,
    disableInput: true 
    });
    this.restartTimer();
  };

  defaultShort = () => {
    this.setState({
      time: 300,
      inputNumber: '',
      RestartNumber: 300,
      paused: false,
      finished: false,
      start: false,
      notStarted: false,
      disableInput: true 
    });
    this.restartTimer();
  };

  defaultRandom = () => {
    const RANDOM_TIMER = Math.floor(Math.random() * 1971 + 30);
    this.setState({
      time: RANDOM_TIMER,
      inputNumber: '',
      RestartNumber: RANDOM_TIMER,
      paused: false,
      finished: false,
      start: false,
      notStarted: false,
      disableInput: true 
    });
    this.restartTimer();
  };

  formatTime(time) {
    const [minutesRight, minutesLeft] = Math.floor(time / 60).toString().padStart(2, '0');
    const [secondsRight, secondsLeft] = (time % 60).toString().padStart(2, '0');
    return (
    <div className="timer">
      <div className="minutes">
        <span className="minutesRight">
          {minutesRight}
        </span>
        <span className="minutesLeft">
          {minutesLeft}
        </span>
      </div>
    <span>:</span>
      <div className="seconds">
        <span className="secondsRight">
          {secondsRight}
        </span>
        <span className="secondsLeft">
          {secondsLeft}
        </span>
      </div>
    </div>
    );
  }

  render() {
    const {disableInput, time, start, inputNumber, disable, paused, finished,notStarted} = this.state
    return (
      <>
        <div className="stopwatch"> 
          <h1>{this.formatTime(time)}</h1>
          <form>
            { !disableInput && <input
              maxLength={7}
              type='text'
              placeholder='Ex.: 3m 30s ou 3:30'
              value={ inputNumber }
              onChange={this.handleChange}
              onKeyUp={ (event) => {
                if (event.key === 'Enter' && !disable) {
                  event.preventDefault();
                  this.setState({ disableInput: true });
                };
              } }
            /> }
            <div className="options">
              {
                  start && <button type="submit" disabled={disable} onClick={ () => this.startTimer() }>Começar</button>
              }
              { !notStarted &&
                  (paused ? (<button type="button" onClick={ () => this.restartTimer() }>Reiniciar</button>) : ( <button type="button" onClick={ () => this.pauseTimer() }>Pausar</button>))
              }
              { !notStarted && <button onClick={ () => this.stopTimer() }>Parar</button> }
            </div>
            { start && 
            <div className="options-default">
              <button type="button" onClick={ this.default }>Intervalo ⏰</button>
              <button type="button" onClick={ this.defaultShort }>Vamos rápido 🏃‍♂️</button>
              <button type="button" onClick={ this.defaultRandom }>Aleatório 🔀</button>
            </div>
            }
          </form>
        </div>
        {
          finished && (
          <div className="finish">
            <p>O tempo acabou 🎉 #VQV</p>
            <button type="button" onClick={ () => {this.setState({ finished: false, disable: true })} }>Fechar</button>
            <audio autoPlay>
              <source src={alarm} type="audio/mp3" />
            </audio>
          </div>)
        }
      </>
    );
  }
}

export default CountdownTimer;