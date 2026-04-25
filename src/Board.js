import React from 'react';
import Dragula from 'dragula';
import 'dragula/dist/dragula.css';
import Swimlane from './Swimlane';
import './Board.css';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    this.swimlanes = {
      backlog: React.createRef(),
      inProgress: React.createRef(),
      complete: React.createRef(),
    }
  }

  handleSort = (lane, mode) => {
    const updatedClients = { ...this.props.clients };
    updatedClients[lane] = this.sortClients(updatedClients[lane], mode);
    this.props.onUpdateClients(updatedClients);
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
    const updatedClients = { ...this.props.clients };
    
    ['backlog', 'inProgress', 'complete'].forEach(lane => {
      updatedClients[lane] = updatedClients[lane].map(c => 
        c.id === clientID ? { ...c, priority: newPriority } : c
      );
    });

    this.props.onUpdateClients(updatedClients);
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
      
      const sourceClients = [...this.props.clients[sourceKey]];
      const clientIndex = sourceClients.findIndex(c => c.id === clientID);
      const [movedClient] = sourceClients.splice(clientIndex, 1);
      movedClient.status = newStatus;

      const targetClients = sourceKey === targetKey ? sourceClients : [...this.props.clients[targetKey]];
      
      let insertIndex = targetClients.length;
      if (sibling) {
        insertIndex = targetClients.findIndex(c => c.id === sibling.dataset.id);
      }
      targetClients.splice(insertIndex, 0, movedClient);

      this.props.onUpdateClients({
        ...this.props.clients,
        [sourceKey]: sourceClients,
        [targetKey]: targetClients
      });
    });
  }

  componentWillUnmount() {
    if (this.drake) this.drake.destroy();
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
    const { clients } = this.props;

    return (
      <div className="Board">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              {this.renderSwimlane('Backlog', clients.backlog, this.swimlanes.backlog, 'backlog')}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('In Progress', clients.inProgress, this.swimlanes.inProgress, 'inProgress')}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('Complete', clients.complete, this.swimlanes.complete, 'complete')}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
