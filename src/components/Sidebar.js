import React from 'react';
import CreateRoomBtn from './CreateRoomBtn';
import DashboardToggle from './dashboard/DashboardToggle';

const Sidebar = () => {
  return (
    <div className="h-100 pt-2">
      <div>
        <DashboardToggle />
        <CreateRoomBtn />
      </div>
      Chat-Room List
    </div>
  );
};

export default Sidebar;
