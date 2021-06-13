import React from 'react';
import { Loader } from 'rsuite';
import { useParams } from 'react-router';
import ChatBottom from '../../components/chat-window/chat-bottom';
import ChatMessages from '../../components/chat-window/chat-messages';
import ChatTop from '../../components/chat-window/chat-top';
import { CurrentRoomProvider } from '../../context/current-room.context';
import { useRooms } from '../../context/rooms.context';
import { transformToArr } from '../../misc/helper-funcs';
import { auth } from '../../misc/firebase';

const ChatPage = () => {
  const { chatId } = useParams();

  const rooms = useRooms();

  if (!rooms) {
    return (
      <Loader
        center
        vertical
        backdrop
        size="lg"
        content="Loading..."
        speed="slow"
      />
    );
  }

  const currentRoom = rooms.find(room => room.id === chatId);

  if (!currentRoom) {
    return (
      <h6 className="text-center mt-page">Chat room: {chatId} not found</h6>
    );
  }

  const { name, description } = currentRoom;

  const admins = transformToArr(currentRoom.admins);
  const isAdmin = admins.includes(auth.currentUser.uid);

  const currentRoomData = {
    name,
    description,
    admins,
    isAdmin,
  };

  return (
    <CurrentRoomProvider data={currentRoomData}>
      <div className="chat-top">
        <ChatTop />
      </div>
      <div className="chat-middle">
        <ChatMessages />
      </div>
      <div className="chat-bottom">
        <ChatBottom />
      </div>
    </CurrentRoomProvider>
  );
};

export default ChatPage;
