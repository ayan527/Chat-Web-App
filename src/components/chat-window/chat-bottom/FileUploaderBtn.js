import React, { useState } from 'react';
import { useParams } from 'react-router';
import { InputGroup, Icon, Modal, Uploader, Button, Alert } from 'rsuite';
import { useModalState } from '../../../misc/custom-hooks';
import { storage } from '../../../misc/firebase';

const MAX_FILE_SIZE = 1000 * 1024 * 5;

const FileUploaderBtn = ({ afterUpload }) => {
  const { chatId } = useParams();

  const { isOpen, openModal, closeModal } = useModalState();

  const [fileList, setFileList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const onUploadChange = fileArray => {
    const filtered = fileArray
      .filter(file => file.blobFile.size <= MAX_FILE_SIZE)
      .slice(0, 5);

    setFileList(filtered);
  };

  const onUpload = async () => {
    setIsLoading(true);

    try {
      const uploadFilePromises = fileList.map(file => {
        return storage
          .ref(`/chat/${chatId}`)
          .child(Date.now() + file.name)
          .put(file.blobFile, {
            cacheControl: `public, max-age=${3600 * 24 * 3}`,
          });
      });

      const uploadFileSnapshots = await Promise.all(uploadFilePromises);

      const filePromises = uploadFileSnapshots.map(async file => {
        return {
          contentType: file.metadata.contentType,
          name: file.metadata.name,
          url: await file.ref.getDownloadURL(),
        };
      });

      const files = await Promise.all(filePromises);

      await afterUpload(files);

      setIsLoading(false);
      setFileList([]);
      closeModal();
    } catch (err) {
      setIsLoading(false);
      setFileList([]);
      Alert.error(err.message, 4000);
    }
  };

  return (
    <>
      <InputGroup.Button onClick={openModal}>
        <Icon icon="attachment" />
      </InputGroup.Button>

      <Modal show={isOpen} onHide={closeModal}>
        <Modal.Header>
          <Modal.Title>Upload files</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Uploader
            autoUpload={false}
            action=""
            fileList={fileList}
            onChange={onUploadChange}
            multiple
            listType="picture-text"
            className="w-100"
            disabled={isLoading}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button block disabled={isLoading} onClick={onUpload}>
            Send to chat
          </Button>
          <div className="text-right mt-2">
            <small>* file size must be less than 5 mb</small>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FileUploaderBtn;
