import React from 'react';
import { Loader } from 'rsuite';
import { useParams } from 'react-router';
import ChatBottom from '../../components/chat-window/chat-bottom';
import ChatMessages from '../../components/chat-window/chat-messages';
import ChatTop from '../../components/chat-window/chat-top';
import { useRooms } from '../../context/rooms.context';

const ChatPage = () => {
  const { chatId } = useParams();

  const rooms = useRooms();

  if (!rooms) {
    return (
      <Loader
        oader
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

  return (
    <>
      <div className="chat-top">
        <ChatTop />
      </div>
      <div className="chat-middle">
        <ChatMessages />
      </div>
      <div className="chat-bottom">
        <ChatBottom />
      </div>
    </>
  );
};

export default ChatPage;
