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
          priority: Math.floor(Math.random() * 5) + 1 
        })),
        inProgress: [],
        complete: [],
      }
    }
    this.swimlanes = {
      backlog: React.createRef(),
      inProgress: React.createRef(),
      complete: React.createRef(),
    }
  }

  handleSort = (lane, mode) => {
    this.setState(prevState => {
      const updatedClients = { ...prevState.clients };
      updatedClients[lane] = this.sortClients(updatedClients[lane], mode);
      return { clients: updatedClients };
    });
  }

  sortClients = (clients, mode) => {
    const sorted = [...clients];
    switch (mode) {
      case 'AZ':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'ZA':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'High':
        return sorted.sort((a, b) => b.priority - a.priority || a.name.localeCompare(b.name));
      case 'Low':
        return sorted.sort((a, b) => a.priority - b.priority || a.name.localeCompare(b.name));
      default:
        return sorted;
    }
  }

  updatePriority = (clientID, newPriority) => {
    const { clients } = this.state;
    const updatedClients = { ...clients };
    
    ['backlog', 'inProgress', 'complete'].forEach(lane => {
      updatedClients[lane] = updatedClients[lane].map(c => 
        c.id === clientID ? { ...c, priority: newPriority } : c
      );
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
      let targetKey = 'backlog';
      if (targetLaneTitle.includes('in progress')) { newStatus = 'in-progress'; targetKey = 'inProgress'; }
      else if (targetLaneTitle.includes('complete')) { newStatus = 'complete'; targetKey = 'complete'; }

      const sourceKey = source.parentElement.querySelector('.Swimlane-title').innerText.toLowerCase().includes('in progress') ? 'inProgress' : 
                        source.parentElement.querySelector('.Swimlane-title').innerText.toLowerCase().includes('complete') ? 'complete' : 'backlog';
      
      const sourceClients = [...this.state.clients[sourceKey]];
      const clientIndex = sourceClients.findIndex(c => c.id === clientID);
      const [movedClient] = sourceClients.splice(clientIndex, 1);
      movedClient.status = newStatus;

      const targetClients = sourceKey === targetKey ? sourceClients : [...this.state.clients[targetKey]];
      
      let insertIndex = targetClients.length;
      if (sibling) {
        insertIndex = targetClients.findIndex(c => c.id === sibling.dataset.id);
      }
      targetClients.splice(insertIndex, 0, movedClient);

      this.setState(prevState => ({
        clients: {
          ...prevState.clients,
          [sourceKey]: sourceClients,
          [targetKey]: targetClients
        }
      }));
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
        onSort={(mode) => this.handleSort(laneKey, mode)}
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
