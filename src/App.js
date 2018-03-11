import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import Chart from 'chart.js';
import _ from 'lodash';

var appenv = process.env.NODE_ENV ? process.env.NODE_ENV : "development";
console.log(appenv);

class App extends Component {
  constructor() {
    super();
    this.state = {
      data: {
        labels: ['1', '2', '3', '4', '5'],
        datasets: [{
          label: "7th Floor",
          backgroundColor: 'rgba(52, 152, 219, 0.75)',
          data: [
            5, 10, 15, 30, 50
          ]
        }, {
          label: "8th Floor",
          backgroundColor: 'rgba(231, 76, 60, 0.75)',
          data: [
            300, 500, 100, 40, 120
          ]
        }]
      },
      lastUpdate: ""
    }
  }

  componentDidMount() {
    this.chartOptions = {
      title: {
        display: true,
        text: 'Machine Room Temperatures',
        fontSize: 20
      },
      scales: {
        xAxes: [{
          display: true
        }],
        yAxes: [{
          type: "linear",
          display: true,
          position: "left"
        }]
      },
      responsive: true
    };
    this.loadData();
    this.canvas = document.getElementById('tempChart');
    this.ctx = this.canvas.getContext('2d');
    
    this.timerID = setInterval(
      () => this.loadData(),
      60000
    );
  }

  loadData() {
    //var proxyUrl = 'http://localhost:8080/',
    //   targetUrl = 'http://192.168.1.204/logfile.rb?lf=0';
    var tempURL = appenv === 'production' ? 'http://192.168.1.204/logfile.rb?lf=0' : 'http://localhost:8080/http://192.168.1.204/logfile.rb?lf=0';
    fetch(tempURL)
      .then(blob => blob.text())
      .then(data => {
        console.log(data);
        var dataArray = data.split('\n');
        this.setData(dataArray);
      })
      .catch(e => {
        console.log(e);
      });
    }
    
  setData(tempData) {
    var titles = [], labels = [], data1 = [], data2 = [];
  
    //take 30 items from tempData
    // it will be 30 mins of data to show on graph.
    var tempData30 = tempData.slice(0, 31);
    console.table(tempData30);
  
    titles = _.first(tempData30).split(' ').slice(2);
    _.forEach(_.reverse(tempData30.slice(1)), value => {
      var valueArray = value.split(' ');
      labels.push(valueArray[1]);
      data1.push(parseFloat(valueArray[2]));
      data2.push(parseFloat(valueArray[3]));
    });
    this.setState({
      data: {
        labels: labels,
        datasets: [{
          label: titles[0],
          backgroundColor: 'rgba(52, 152, 219, 0.75)',
          data: data1
        }, {
          label: titles[1],
          backgroundColor: 'rgba(231, 76, 60, 0.75)',
          data: data2
        }]
      },
      lastUpdate: tempData30[1].split(' ')[1]
    });

    this.refreshChart();
  }

  refreshChart() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart(this.ctx, {
      type: 'line',
      data: this.state.data,
      options: this.chartOptions
    });
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  render() {
    return (
      <div className="App">
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1> 
        </header> */}
       <div className="Temp-Monitor">
        <canvas id="tempChart"></canvas>
        <h2>Last Update: {this.state.lastUpdate}</h2>
       </div>
      </div>
    );
  }
}


export default App;
