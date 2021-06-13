import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { database } from '../../../misc/firebase';
import { transformToArrWithId } from '../../../misc/helper-funcs';
import MessageItem from './MessageItem';

const messagesRef = database.ref('/messages');

const ChatMessages = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState(null);

  const isChatEmpty = messages && messages.length === 0;
  const canShowMessages = messages && messages.length > 0;

  useEffect(() => {
    messagesRef
      .orderByChild('roomId')
      .equalTo(chatId)
      .on('value', snapshot => {
        const messageData = transformToArrWithId(snapshot.val());
        setMessages(messageData);
      });
  }, [chatId]);

  return (
    <ul className="msg-list custom-scroll">
      {isChatEmpty && <li>No messages yet</li>}
      {canShowMessages &&
        messages.map(message => (
          <MessageItem key={message.id} message={message} />
        ))}
    </ul>
  );
};

export default ChatMessages;
