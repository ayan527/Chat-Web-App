import React, { memo } from 'react';
import { Button, Modal } from 'rsuite';
import { useCurrentRoom } from '../../../context/current-room.context';
import { useModalState } from '../../../misc/custom-hooks';

const RoomInfoBtnModal = () => {
  const { isOpen, closeModal, openModal } = useModalState();
  const roomDescription = useCurrentRoom(v => v.description);
  const roomNname = useCurrentRoom(v => v.name);

  return (
    <>
      <Button appearance="link" className="px-0" onClick={openModal}>
        Room info
      </Button>
      <Modal show={isOpen} onHide={closeModal}>
        <Modal.Header>
          <Modal.Title>About {roomNname}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6 className="mb-1">Description</h6>
          <p>{roomDescription}</p>
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

export default memo(RoomInfoBtnModal);
