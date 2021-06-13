import React from 'react';
import moment from 'moment';
import { Button, Modal } from 'rsuite';
import { useModalState } from '../../../misc/custom-hooks';
import ProfilePic from '../../dashboard/ProfilePic';

const ProfileInfoBtnModal = ({ profile, ...btnProps }) => {
  const { isOpen, closeModal, openModal } = useModalState();
  const { name, picture, createdAt } = profile;

  const shortName = profile.name.split(' ')[0];

  const memberSince = moment(new Date(createdAt).toLocaleDateString()).format(
    'DD/MM/YYYY'
  );

  return (
    <>
      <Button {...btnProps} onClick={openModal}>
        {shortName}
      </Button>

      <Modal show={isOpen} onHide={closeModal}>
        <Modal.Header>
          <Modal.Title>{shortName} profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <ProfilePic
            src={picture}
            name={name}
            className="width-200 height-200 img-fullsize font-huge"
          />

          <h4 className="mt-2">{name}</h4>

          <p>Member since {memberSince}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button block onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProfileInfoBtnModal;
