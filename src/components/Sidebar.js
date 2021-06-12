import React, { useEffect, useState, useRef } from 'react';
import { Divider } from 'rsuite';
import CreateRoomBtn from './CreateRoomBtn';
import DashboardToggle from './dashboard/DashboardToggle';
import ChatRoomList from './rooms/ChatRoomList';

const Sidebar = () => {
  const topSidebarRef = useRef();
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (topSidebarRef.current) {
      setHeight(topSidebarRef.current.scrollHeight);
    }
  }, [topSidebarRef]);

  return (
    <div className="h-100 pt-2">
      <div ref={topSidebarRef}>
        <DashboardToggle />
        <CreateRoomBtn />
        <Divider>Join chat rooms</Divider>
      </div>
      <ChatRoomList aboveHeight={height} />
    </div>
  );
};

export default Sidebar;
