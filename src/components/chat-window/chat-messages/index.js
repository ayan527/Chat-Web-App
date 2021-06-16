/* eslint-disable consistent-return */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { Alert, Button } from 'rsuite';
import { auth, database, storage } from '../../../misc/firebase';
import { groupBy, transformToArrWithId } from '../../../misc/helper-funcs';
import MessageItem from './MessageItem';

const PAGE_SIZE = 10;
const messagesRef = database.ref('/messages');

function shouldScrollToBottom(nodeUl, threshold = 30) {
  const percentage =
    (100 * nodeUl.scrollTop) / (nodeUl.scrollHeight - nodeUl.clientHeight) || 0;

  return percentage > threshold;
}

const ChatMessages = () => {
  const { chatId } = useParams();

  const [messages, setMessages] = useState(null);
  const [msglimit, setMsgLimit] = useState(PAGE_SIZE);

  const isChatEmpty = messages && messages.length === 0;
  const canShowMessages = messages && messages.length > 0;

  const ulRef = useRef();

  const loadMessages = useCallback(
    limit => {
      const nodeUl = ulRef.current;

      messagesRef.off();

      messagesRef
        .orderByChild('roomId')
        .equalTo(chatId)
        .limitToLast(limit || PAGE_SIZE)
        .on('value', snap => {
          const data = transformToArrWithId(snap.val());
          setMessages(data);

          if (shouldScrollToBottom(nodeUl)) {
            nodeUl.scrollTop = nodeUl.scrollHeight;
          }
        });
      setMsgLimit(p => p + PAGE_SIZE);
    },
    [chatId]
  );

  const onLoadMore = useCallback(() => {
    const nodeUl = ulRef.current;
    const oldHeight = nodeUl.scrollHeight;

    loadMessages(msglimit);

    setTimeout(() => {
      const newHeight = nodeUl.scrollHeight;
      nodeUl.scrollTop = newHeight - oldHeight;
    }, 400);
  }, [loadMessages, msglimit]);

  useEffect(() => {
    const nodeUl = ulRef.current;

    loadMessages();

    setTimeout(() => {
      nodeUl.scrollTop = nodeUl.scrollHeight;
    }, 400);

    return () => {
      messagesRef.off('value');
    };
  }, [loadMessages]);

  const handleAdmin = useCallback(
    async uid => {
      const adminsRef = database.ref(`/rooms/${chatId}/admins`);

      let alertMsg;

      await adminsRef.transaction(admins => {
        if (admins) {
          if (admins[uid]) {
            admins[uid] = null;
            alertMsg = 'Admin permission removed';
          } else {
            admins[uid] = true;
            alertMsg = 'Admin permission granted';
          }
        }

        return admins;
      });

      Alert.info(alertMsg, 4000);
    },
    [chatId]
  );

  const handleLike = useCallback(async msgId => {
    const { uid } = auth.currentUser;
    const messageRef = database.ref(`/messages/${msgId}`);

    let alertMsg;

    await messageRef.transaction(msg => {
      if (msg) {
        if (msg.likes && msg.likes[uid]) {
          msg.likeCount -= 1;
          msg.likes[uid] = null;
          alertMsg = 'Unliked message';
        } else {
          msg.likeCount += 1;

          if (!msg.likes) {
            msg.likes = {};
          }

          msg.likes[uid] = true;
          alertMsg = 'Liked message';
        }
      }

      return msg;
    });

    Alert.info(alertMsg, 4000);
  }, []);

  const handleDelete = useCallback(
    async (msgId, file) => {
      // eslint-disable-next-line no-alert
      if (!window.confirm('Delete this message?')) {
        return;
      }

      const isLast = messages[messages.length - 1].id === msgId;

      const updates = {};

      updates[`/messages/${msgId}`] = null;

      if (isLast && messages.length > 1) {
        updates[`/rooms/${chatId}/lastMessage`] = {
          ...messages[messages.length - 2],
          msgId: messages[messages.length - 2].id,
        };
      }

      if (isLast && messages.length === 1) {
        updates[`/rooms/${chatId}/lastMessage`] = null;
      }

      try {
        await database.ref().update(updates);

        Alert.info('Message deleted', 4000);
      } catch (err) {
        return Alert.error(err.message, 4000);
      }

      if (file) {
        try {
          const fileRef = storage.refFromURL(file.url);
          await fileRef.delete();
        } catch (err) {
          Alert.error(err.message, 4000);
        }
      }
    },
    [chatId, messages]
  );

  const renderMessages = () => {
    const groups = groupBy(messages, item =>
      new Date(item.createdAt).toDateString()
    );

    const items = [];

    Object.keys(groups).forEach(date => {
      items.push(
        <li key={date} className="text-center mb-1 padded">
          {date}
        </li>
      );

      const msgs = groups[date].map(msg => (
        <MessageItem
          key={msg.id}
          message={msg}
          handleAdmin={handleAdmin}
          handleLike={handleLike}
          handleDelete={handleDelete}
        />
      ));

      items.push(...msgs);
    });

    return items;
  };

  return (
    <ul ref={ulRef} className="msg-list custom-scroll">
      {messages && messages.length >= PAGE_SIZE && (
        <li className="text-center mt-2 mb-2">
          <Button onClick={onLoadMore} color="green">
            Load more
          </Button>
        </li>
      )}
      {isChatEmpty && <li>No messages yet</li>}
      {canShowMessages && renderMessages()}
    </ul>
  );
};

export default ChatMessages;
