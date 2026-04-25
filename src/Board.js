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

  // Pure function for sorting logic
  static sortClients(clients, mode) {
    const sorted = [...clients];
    switch (mode) {
      case 'AZ': return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'ZA': return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'High': return sorted.sort((a, b) => b.priority - a.priority || a.name.localeCompare(b.name));
      case 'Low': return sorted.sort((a, b) => a.priority - b.priority || a.name.localeCompare(b.name));
      default: return sorted;
    }
  }

  handleSort = (lane, mode) => {
    const updatedClients = { ...this.props.clients };
    updatedClients[lane] = Board.sortClients(updatedClients[lane], mode);
    this.props.onUpdateClients(updatedClients);
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
      const targetKey = targetLaneTitle.includes('in progress') ? 'inProgress' : targetLaneTitle.includes('complete') ? 'complete' : 'backlog';
      const sourceKey = source.parentElement.querySelector('.Swimlane-title').innerText.toLowerCase().includes('in progress') ? 'inProgress' : 
                        source.parentElement.querySelector('.Swimlane-title').innerText.toLowerCase().includes('complete') ? 'complete' : 'backlog';
      
      const sourceClients = [...this.props.clients[sourceKey]];
      const clientIndex = sourceClients.findIndex(c => c.id === clientID);
      const [movedClient] = sourceClients.splice(clientIndex, 1);
      
      movedClient.status = targetKey === 'inProgress' ? 'in-progress' : targetKey;

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

  render() {
    const { clients } = this.props;
    const lanes = [
      { name: 'Backlog', key: 'backlog' },
      { name: 'In Progress', key: 'inProgress' },
      { name: 'Complete', key: 'complete' }
    ];

    return (
      <div className="Board container-fluid">
        <div className="row">
          {lanes.map(lane => (
            <div className="col-md-4" key={lane.key}>
              <Swimlane 
                name={lane.name} 
                clients={clients[lane.key]} 
                dragulaRef={this.swimlanes[lane.key]}
                onPriorityChange={this.updatePriority}
                onSort={(mode) => this.handleSort(lane.key, mode)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}
