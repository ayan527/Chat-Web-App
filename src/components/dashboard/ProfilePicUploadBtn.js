import React, { useState, useRef } from 'react';
import { Modal, Button, Alert } from 'rsuite';
import AvatarEditor from 'react-avatar-editor';
import { useModalState } from '../../misc/custom-hooks';
import { database, storage } from '../../misc/firebase';
import { useProfile } from '../../context/profile.context';
import ProfilePic from './ProfilePic';
import { getUserUpdates } from '../../misc/helper-funcs';

const picFileTypes = '.png, .jpg, .jpeg';

const acceptdFileTypes = ['image/png', 'image/jpg', 'image/jpeg'];
const isValidFileType = file => acceptdFileTypes.includes(file.type);

const ProfilePicUploadBtn = () => {
  const { profile } = useProfile();

  const { isOpen, openModal, closeModal } = useModalState();
  const [profilePic, setProfilePic] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const avatarEditorRef = useRef();

  const getCanvasBLob = canvas => {
    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Processing Error!'));
        }
      });
    });
  };

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

  const onUploadFile = async () => {
    const canvas = avatarEditorRef.current.getImageScaledToCanvas();

    try {
      setIsLoading(true);

      const blob = await getCanvasBLob(canvas);

      const currentUserStorageRef = storage
        .ref(`/profiles/${profile.uid}`)
        .child('picture');

      const uploadResult = await currentUserStorageRef.put(blob, {
        cacheControl: `public, max-age=${3600 * 24 * 2}`,
      });

      const uploadedUrl = await uploadResult.ref.getDownloadURL();

      const updates = await getUserUpdates(
        profile.uid,
        'picture',
        uploadedUrl,
        database
      );

      await database.ref().update(updates);

      setIsLoading(false);
      closeModal();
      Alert.success('Pofile picture updated', 4000);
    } catch (error) {
      setIsLoading(false);
      closeModal();
      Alert.error(error.message, 4000);
    }
  };

  return (
    <div className="mt-3 text-center">
      <ProfilePic
        src={profile.picture}
        name={profile.name}
        className="width-200 height-200 img-fullsize font-huge"
      />
      <div>
        <label htmlFor="profile-pic" className="d-block cursor-pointer padded">
          Select new picture
          <input
            id="profile-pic"
            type="file"
            className="d-none"
            value=""
            accept={picFileTypes}
            onChange={onFileSelect}
          />
        </label>
      </div>

      <Modal show={isOpen} onHide={closeModal}>
        <Modal.Header>
          <Modal.Title>Adjust and upload new picture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-center align-items-center h-100">
            {profilePic && (
              <AvatarEditor
                ref={avatarEditorRef}
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
          <Button
            block
            appearance="ghost"
            onClick={onUploadFile}
            disabled={isLoading}
          >
            Upload new picture
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProfilePicUploadBtn;
