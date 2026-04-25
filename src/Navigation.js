import React from 'react';
import './Navigation.css';

export default class Navigation extends React.Component {
  render() {
    return (
      <nav className="Navbar">
        <div className="Navbar-brand">Shiptivitas</div>
        <div className="Navbar-links">
          <button 
            className={"Nav-button " + (this.props.selectedTab === 'home' ? 'active': '')} 
            onClick={() => this.props.onClick("home")}
          >
            Home
          </button>
          <button 
            className={"Nav-button " + (this.props.selectedTab === 'shipping-requests' ? 'active': '')} 
            onClick={() => this.props.onClick("shipping-requests")}
          >
            Shipping Requests
          </button>
        </div>
        <div className="Navbar-progress">
          <div className="Progress-label">Global Progress</div>
          <div className="Progress-value">{this.props.progress}%</div>
          <div className="Progress-track">
            <div className="Progress-fill" style={{ width: `${this.props.progress}%` }}></div>
          </div>
        </div>
      </nav>
    );
  }
}