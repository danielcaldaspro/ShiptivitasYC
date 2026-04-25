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
        backlog: clients.map(client => ({ ...client, status: 'backlog', priority: 1 })),
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

  updatePriority = (clientID, newPriority) => {
    const { clients } = this.state;
    const updatedClients = { ...clients };
    
    ['backlog', 'inProgress', 'complete'].forEach(lane => {
      updatedClients[lane] = updatedClients[lane].map(c => 
        c.id === clientID ? { ...c, priority: newPriority } : c
      ).sort((a, b) => b.priority - a.priority);
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
      this.drake.cancel(true); // Let React handle the DOM update

      const clientID = el.dataset.id;
      const targetLane = target.parentElement.querySelector('.Swimlane-title').innerText.toLowerCase();
      let newStatus = 'backlog';
      if (targetLane === 'in progress') newStatus = 'in-progress';
      else if (targetLane === 'complete') newStatus = 'complete';

      // Find the client and move it
      const allClients = [
        ...this.state.clients.backlog,
        ...this.state.clients.inProgress,
        ...this.state.clients.complete,
      ];

      const clientIndex = allClients.findIndex(c => c.id === clientID);
      const client = { ...allClients[clientIndex], status: newStatus };
      allClients.splice(clientIndex, 1);

      // Determine the new index in the target lane
      // Find the sibling's index if it exists
      const targetClients = allClients.filter(c => c.status === newStatus);
      let targetIndex = targetClients.length;
      if (sibling) {
        const siblingID = sibling.dataset.id;
        targetIndex = targetClients.findIndex(c => c.id === siblingID);
      }

      // Update state
      const updatedClients = {
        backlog: allClients.filter(c => c.status === 'backlog'),
        inProgress: allClients.filter(c => c.status === 'in-progress'),
        complete: allClients.filter(c => c.status === 'complete'),
      };

      // Add the moved client to the target lane at the correct index
      const laneKey = newStatus === 'in-progress' ? 'inProgress' : newStatus;
      updatedClients[laneKey].splice(targetIndex, 0, client);

      // Re-sort all lanes by priority to ensure auto-sorting
      ['backlog', 'inProgress', 'complete'].forEach(lane => {
        updatedClients[lane].sort((a, b) => b.priority - a.priority);
      });

      this.setState({
        clients: updatedClients
      });
    });
  }

  componentWillUnmount() {
    this.drake.destroy();
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
  renderSwimlane(name, clients, ref) {
    return (
      <Swimlane 
        name={name} 
        clients={clients} 
        dragulaRef={ref}
        onPriorityChange={this.updatePriority}
      />
    );
  }

  render() {
    return (
      <div className="Board">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              {this.renderSwimlane('Backlog', this.state.clients.backlog, this.swimlanes.backlog)}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('In Progress', this.state.clients.inProgress, this.swimlanes.inProgress)}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('Complete', this.state.clients.complete, this.swimlanes.complete)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
