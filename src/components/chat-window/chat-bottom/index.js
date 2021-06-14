import React, { useCallback, useState } from 'react';
import firebase from 'firebase/app';
import { Alert, Icon, InputGroup, Input } from 'rsuite';
import { useParams } from 'react-router';
import { useProfile } from '../../../context/profile.context';
import { database } from '../../../misc/firebase';
import FileUploaderBtn from './FileUploaderBtn';

function assembleMessage(profile, chatId) {
  return {
    roomId: chatId,
    author: {
      name: profile.name,
      uid: profile.uid,
      createdAt: profile.createdAt,
      ...(profile.picture ? { picture: profile.picture } : {}),
    },
    createdAt: firebase.database.ServerValue.TIMESTAMP,
    likeCount: 0,
  };
}

const ChatBottom = () => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { chatId } = useParams();
  const { profile } = useProfile();

  const onInputChange = useCallback(value => {
    setInputText(value);
  }, []);

  const onSendClick = async () => {
    if (inputText.trim() === '') {
      return;
    }

    const msgData = assembleMessage(profile, chatId);
    msgData.text = inputText;

    const updates = {};

    const messageId = database.ref('messages').push().key;

    updates[`/messages/${messageId}`] = msgData;
    updates[`/rooms/${chatId}/lastMessage`] = {
      ...msgData,
      msgId: messageId,
    };

    setIsLoading(true);
    try {
      await database.ref().update(updates);

      setInputText('');
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      Alert.error(err.message, 4000);
    }
  };

  const onPressEnter = ev => {
    if (ev.keyCode === 13) {
      ev.preventDefault();
      onSendClick();
    }
  };

  const afterUpload = useCallback(
    async files => {
      setIsLoading(true);

      const updates = {};

      files.forEach(file => {
        const msgData = assembleMessage(profile, chatId);
        msgData.file = file;

        const messageId = database.ref('messages').push().key;

        updates[`/messages/${messageId}`] = msgData;
      });

      const lastMsgId = Object.keys(updates).pop();

      updates[`/rooms/${chatId}/lastMessage`] = {
        ...updates[lastMsgId],
        msgId: lastMsgId,
      };

      try {
        await database.ref().update(updates);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        Alert.error(err.message);
      }
    },
    [chatId, profile]
  );

  return (
    <div>
      <InputGroup>
        <FileUploaderBtn afterUpload={afterUpload} />
        <Input
          placeholder="Write a new message here..."
          value={inputText}
          onChange={onInputChange}
          onKeyDown={onPressEnter}
        />

        <InputGroup.Button
          color="blue"
          appearance="primary"
          onClick={onSendClick}
          disabled={isLoading}
        >
          <Icon icon="send" />
        </InputGroup.Button>
      </InputGroup>
    </div>
  );
};

export default ChatBottom;
