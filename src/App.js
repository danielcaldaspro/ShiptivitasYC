import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import HomeTab from './HomeTab';
import Navigation from './Navigation';
import Board from './Board';
import MagneticBall from './MagneticBall';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    const initialClients = this.getInitialClients();
    this.state = {
      selectedTab: 'home',
      clients: {
        backlog: initialClients.map(c => ({ ...c, status: 'backlog', priority: Math.floor(Math.random() * 5) + 1 })),
        inProgress: [],
        complete: [],
      }
    };
  }

  getInitialClients() {
    return [
      ['1','Stark, White and Abbott','Cloned Optimal Architecture', 'in-progress'],
      ['2','Wiza LLC','Exclusive Bandwidth-Monitored Implementation', 'complete'],
      ['3','Nolan LLC','Vision-Oriented 4Thgeneration Graphicaluserinterface', 'backlog'],
      ['4','Thompson PLC','Streamlined Regional Knowledgeuser', 'in-progress'],
      ['5','Walker-Williamson','Team-Oriented 6Thgeneration Matrix', 'in-progress'],
      ['6','Boehm and Sons','Automated Systematic Paradigm', 'backlog'],
      ['7','Runolfsson, Hegmann and Block','Integrated Transitional Strategy', 'backlog'],
      ['8','Schumm-Labadie','Operative Heuristic Challenge', 'backlog'],
      ['9','Kohler Group','Re-Contextualized Multi-Tasking Attitude', 'backlog'],
      ['10','Romaguera Inc','Managed Foreground Toolset', 'backlog'],
      ['11','Reilly-King','Future-Proofed Interactive Toolset', 'complete'],
      ['12','Emard, Champlin and Runolfsdottir','Devolved Needs-Based Capability', 'backlog'],
      ['13','Fritsch, Cronin and Wolff','Open-Source 3Rdgeneration Website', 'complete'],
      ['14','Borer LLC','Profit-Focused Incremental Orchestration', 'backlog'],
      ['15','Emmerich-Ankunding','User-Centric Stable Extranet', 'in-progress'],
      ['16','Willms-Abbott','Progressive Bandwidth-Monitored Access', 'in-progress'],
      ['17','Brekke PLC','Intuitive User-Facing Customerloyalty', 'complete'],
      ['18','Bins, Toy and Klocko','Integrated Assymetric Software', 'backlog'],
      ['19','Hodkiewicz-Hayes','Programmable Systematic Securedline', 'backlog'],
      ['20','Murphy, Lang and Ferry','Organized Explicit Access', 'backlog'],
    ].map(companyDetails => ({
      id: companyDetails[0],
      name: companyDetails[1],
      description: companyDetails[2],
      status: companyDetails[3],
    }));
  }

  handleStateChange = (newClients) => {
    this.setState({ clients: newClients });
  }

  changeTab(tabName) {
    this.setState({ selectedTab: tabName });
  }

  render() {
    const { clients } = this.state;
    const total = clients.backlog.length + clients.inProgress.length + clients.complete.length;
    const completed = clients.complete.length;

    return (
      <div className="App">
        <Navigation
          onClick={(tabName) => this.changeTab(tabName)}
          selectedTab={this.state.selectedTab}
          completed={completed}
          total={total}
        />

        <div className="App-body">
          {this.state.selectedTab === 'home' ? (
            <HomeTab />
          ) : (
            <Board 
              clients={this.state.clients} 
              onStateChange={this.handleStateChange} 
            />
          )}
        </div>
        <MagneticBall />
      </div>
    );
  }
}

export default App;
