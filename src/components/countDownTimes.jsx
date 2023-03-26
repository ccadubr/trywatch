import React, { Component } from 'react';

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
        this.setState({ finished: true, start: true, });
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
      start: false
    });
    this.restartTimer();
  };

  pauseTimer = () => {
    clearInterval(this.interval);
    this.setState({ paused: true });
  };

  stopTimer = () => {
    clearInterval(this.interval);
    this.setState({ inputNumber: '', time: 0, RestartNumber: 0, start: true, disable: true });
  };

  formatTime(time) {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }


  render() {
    const {time, start, inputNumber, disable, paused, finished} = this.state
    return (
      <div>
        <h1>{this.formatTime(time)}</h1>
        <input
         maxLength={7}
          type='text'
          placeholder='3m 30s ou 3:30'
          value={ inputNumber }
          onChange={this.handleChange}
        />
        {
            start && <button  disabled={disable} onClick={ () => this.startTimer() }>Começar</button>
        }
        {
            paused ? (<button onClick={ () => this.restartTimer() }>Reiniciar</button>) : ( <button onClick={ () => this.pauseTimer() }>Pausar</button>)
        }
        <button onClick={ () => this.stopTimer() }>Parar</button>
        {
            finished && <p>Acabou</p>
        }
      </div>
    );
  }
}

export default CountdownTimer;