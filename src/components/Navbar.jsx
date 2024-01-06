import React from "react";
import "../css/navbar.css";
import { NAVBAR_TABS } from "../utils/constants";

const Navbar = ({ activeTab, setActiveTab }) => {

  return (
    <div className="nav-container">
      {NAVBAR_TABS.map((tab, i) => (
        <div
          key={tab.id}
          className={`nav-item item-${i} ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </div>
      ))}
      <div className="nav-item-highlighter" />
    </div>
  );
};

export default Navbar;
