import React, { useState } from 'react';
import { Modal, Button, Alert } from 'rsuite';
import AvatarEditor from 'react-avatar-editor';
import { useModalState } from '../../misc/custom-hooks';

const picFileTypes = '.png, .jpg, .jpeg';

const acceptdFileTypes = ['image/png', 'image/jpg', 'image/jpeg'];
const isValidFileType = file => acceptdFileTypes.includes(file.type);

const ProfilePicUploadBtn = () => {
  const { isOpen, openModal, closeModal } = useModalState();
  const [profilePic, setProfilePic] = useState(null);

  const onFileSelect = ev => {
    const selectedFiles = ev.target.files;

    if (selectedFiles.length === 1) {
      const currentFile = selectedFiles[0];

      if (isValidFileType(currentFile)) {
        setProfilePic(currentFile);
        openModal();
      } else {
        Alert.warning(`Wrong file type ${currentFile.type}`, 4000);
      }
    } else {
      Alert.error("Can't select multiple files", 4000);
    }
  };

  return (
    <div className="mt-3 text-center">
      <label htmlFor="profile-pic" className="d-block cursor-pointer padded">
        Select new picture
        <input
          id="profile-pic"
          type="file"
          className="d-none"
          accept={picFileTypes}
          onChange={onFileSelect}
        />
      </label>

      <Modal show={isOpen} onHide={closeModal}>
        <Modal.Header>
          <Modal.Title>Adjust and upload new picture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-center align-items-center h-100">
            {profilePic && (
              <AvatarEditor
                image={profilePic}
                width={200}
                height={200}
                border={10}
                borderRadius={100}
                rotate={0}
              />
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button block appearance="ghost">
            Upload new picture
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProfilePicUploadBtn;
