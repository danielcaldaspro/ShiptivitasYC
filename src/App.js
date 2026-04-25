import React, { Component } from 'react';
import HomeTab from './HomeTab';
import Navigation from './Navigation';
import Board from './Board';
import MagneticBall from './MagneticBall';
import { INITIAL_CLIENTS } from './data';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'home',
      clients: {
        backlog: INITIAL_CLIENTS.filter(c => c.status === 'backlog').map(c => ({ 
          ...c, 
          priority: Math.floor(Math.random() * 5) + 1 
        })),
        inProgress: INITIAL_CLIENTS.filter(c => c.status === 'in-progress').map(c => ({ 
          ...c, 
          priority: Math.floor(Math.random() * 5) + 1 
        })),
        complete: INITIAL_CLIENTS.filter(c => c.status === 'complete').map(c => ({ 
          ...c, 
          priority: Math.floor(Math.random() * 5) + 1 
        })),
      }
    };
  }

  handleTabClick = (tab) => {
    this.setState({ selectedTab: tab });
  }

  updateClients = (updatedClients) => {
    this.setState({ clients: updatedClients });
  }

  renderTabContent() {
    switch (this.state.selectedTab) {
      case 'home':
        return <HomeTab />;
      case 'shipping-requests':
        return <Board clients={this.state.clients} onUpdateClients={this.updateClients} />;
      default:
        return <HomeTab />;
    }
  }

  render() {
    const { clients } = this.state;
    const total = clients.backlog.length + clients.inProgress.length + clients.complete.length;
    const completed = clients.complete.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
      <div className="App">
        <Navigation 
          onClick={this.handleTabClick} 
          selectedTab={this.state.selectedTab} 
          progress={percentage}
        />
        <div className="App-body">
          {this.renderTabContent()}
        </div>
        <MagneticBall />
      </div>
    );
  }
}

export default App;
