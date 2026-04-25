import React from 'react';
import Dragula from 'dragula';
import 'dragula/dist/dragula.css';
import Swimlane from './Swimlane';
import './Board.css';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    const clients = this.getClients();
    this.state = {
      clients: {
        backlog: clients.map(client => ({ 
          ...client, 
          status: 'backlog', 
          priority: Math.floor(Math.random() * 5) + 1 // Prioridade Aleatória
        })).sort((a, b) => b.priority - a.priority || a.name.localeCompare(b.name)),
        inProgress: [],
        complete: [],
      },
      sortModes: {
        backlog: 'priority',
        inProgress: 'priority',
        complete: 'priority'
      }
    }
    this.swimlanes = {
      backlog: React.createRef(),
      inProgress: React.createRef(),
      complete: React.createRef(),
    }
  }

  toggleSortMode = (lane) => {
    const newMode = this.state.sortModes[lane] === 'priority' ? 'alphabetical' : 'priority';
    this.setState(prevState => {
      const updatedSortModes = { ...prevState.sortModes, [lane]: newMode };
      const updatedClients = { ...prevState.clients };
      updatedClients[lane] = this.sortClients(updatedClients[lane], newMode);
      return { sortModes: updatedSortModes, clients: updatedClients };
    });
  }

  sortClients = (clients, mode) => {
    if (mode === 'priority') {
      return [...clients].sort((a, b) => b.priority - a.priority || a.name.localeCompare(b.name));
    }
    return [...clients].sort((a, b) => a.name.localeCompare(b.name));
  }

  updatePriority = (clientID, newPriority) => {
    const { clients, sortModes } = this.state;
    const updatedClients = { ...clients };
    
    ['backlog', 'inProgress', 'complete'].forEach(lane => {
      updatedClients[lane] = updatedClients[lane].map(c => 
        c.id === clientID ? { ...c, priority: newPriority } : c
      );
      updatedClients[lane] = this.sortClients(updatedClients[lane], sortModes[lane]);
    });

    this.setState({ clients: updatedClients });
  }

  componentDidMount() {
    this.drake = Dragula([
      this.swimlanes.backlog.current,
      this.swimlanes.inProgress.current,
      this.swimlanes.complete.current,
    ]);

    this.drake.on('drop', (el, target, source, sibling) => {
      this.drake.cancel(true);

      const clientID = el.dataset.id;
      const targetLaneTitle = target.parentElement.querySelector('.Swimlane-title').innerText.toLowerCase();
      
      let newStatus = 'backlog';
      let laneKey = 'backlog';
      if (targetLaneTitle.includes('in progress')) { newStatus = 'in-progress'; laneKey = 'inProgress'; }
      else if (targetLaneTitle.includes('complete')) { newStatus = 'complete'; laneKey = 'complete'; }

      const allClients = [
        ...this.state.clients.backlog,
        ...this.state.clients.inProgress,
        ...this.state.clients.complete,
      ];

      const clientIndex = allClients.findIndex(c => c.id === clientID);
      const movedClient = { ...allClients[clientIndex], status: newStatus };
      allClients.splice(clientIndex, 1);
      allClients.push(movedClient);

      const updatedClients = {
        backlog: this.sortClients(allClients.filter(c => c.status === 'backlog'), this.state.sortModes.backlog),
        inProgress: this.sortClients(allClients.filter(c => c.status === 'in-progress'), this.state.sortModes.inProgress),
        complete: this.sortClients(allClients.filter(c => c.status === 'complete'), this.state.sortModes.complete),
      };

      this.setState({ clients: updatedClients });
    });
  }

  componentWillUnmount() {
    if (this.drake) this.drake.destroy();
  }

  getClients() {
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

  renderSwimlane(name, clients, ref, laneKey) {
    return (
      <Swimlane 
        name={name} 
        clients={clients} 
        dragulaRef={ref}
        onPriorityChange={this.updatePriority}
        sortMode={this.state.sortModes[laneKey]}
        onToggleSort={() => this.toggleSortMode(laneKey)}
      />
    );
  }

  render() {
    return (
      <div className="Board">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              {this.renderSwimlane('Backlog', this.state.clients.backlog, this.swimlanes.backlog, 'backlog')}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('In Progress', this.state.clients.inProgress, this.swimlanes.inProgress, 'inProgress')}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('Complete', this.state.clients.complete, this.swimlanes.complete, 'complete')}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
