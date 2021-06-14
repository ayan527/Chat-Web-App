import React, { useCallback, useState } from 'react';
import { ReactMic } from 'react-mic';
import { useParams } from 'react-router';
import { Alert, InputGroup, Icon } from 'rsuite';
import { storage } from '../../../misc/firebase';

const AudioUploadBtn = ({ afterUpload }) => {
  const { chatId } = useParams();

  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const onRecordClick = useCallback(() => {
    setIsRecording(p => !p);
  }, []);

  const onAudioUpload = useCallback(
    async data => {
      setIsUploading(true);
      try {
        const snap = await storage
          .ref(`/chat/${chatId}`)
          .child(`audio_${Date.now()}.mp3`)
          .put(data.blob, {
            cacheControl: `public, max-age=${3600 * 24 * 3}`,
          });

        const audioFile = {
          contentType: snap.metadata.contentType,
          name: snap.metadata.name,
          url: await snap.ref.getDownloadURL(),
        };

        setIsUploading(false);
        afterUpload([audioFile]);

        Alert.success('Audio sent', 4000);
      } catch (error) {
        setIsUploading(false);
        Alert.error(error.message, 4000);
      }
    },
    [afterUpload, chatId]
  );

  return (
    <InputGroup.Button
      onClick={onRecordClick}
      disabled={isUploading}
      className={isRecording ? 'animate-blink' : ''}
    >
      <Icon icon="microphone" />
      <ReactMic
        record={isRecording}
        className="d-none"
        onStop={onAudioUpload}
        mimeType="audio/mp3"
      />
    </InputGroup.Button>
  );
};

export default AudioUploadBtn;
