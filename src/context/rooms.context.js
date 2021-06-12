import React, { createContext, useState, useEffect, useContext } from 'react';
import { database } from '../misc/firebase';
import { transformToArrWithId } from '../misc/helper-funcs';

const ChatRoomsContext = createContext();
export const ChatRoomsProvider = ({ children }) => {
  const [roomList, setRoomList] = useState(null);

  useEffect(() => {
    const roomListRef = database.ref('/rooms');

    roomListRef.on('value', snapshot => {
      const roomsData = transformToArrWithId(snapshot.val());
      // console.log(roomsData);

      setRoomList(roomsData);
    });

    return () => {
      roomListRef.off();
    };
  }, []);

  return (
    <ChatRoomsContext.Provider value={roomList}>
      {children}
    </ChatRoomsContext.Provider>
  );
};

export const useRooms = () => useContext(ChatRoomsContext);
