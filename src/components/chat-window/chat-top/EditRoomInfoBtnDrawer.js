import React from 'react';
import { useParams } from 'react-router';
import { Alert, Button, Drawer } from 'rsuite';
import { useCurrentRoom } from '../../../context/current-room.context';
import { useMediaQuery, useModalState } from '../../../misc/custom-hooks';
import { database } from '../../../misc/firebase';
import EditInput from '../../EditInput';

const EditRoomInfoBtnDrawer = () => {
  const { isOpen, openModal, closeModal } = useModalState();
  const { chatId } = useParams();
  const isMobile = useMediaQuery('(max-width: 992px)');

  const name = useCurrentRoom(room => room.name);
  const description = useCurrentRoom(room => room.description);

  const updateData = (key, value) => {
    database
      .ref(`rooms/${chatId}`)
      .child(key)
      .set(value)
      .then(() => {
        Alert.success('Successfully updated', 4000);
      })
      .catch(err => {
        Alert.error(err.message, 4000);
      });
  };

  const onNameSave = newName => {
    updateData('name', newName);
  };

  const onDescriptionSave = newDesc => {
    updateData('description', newDesc);
  };

  return (
    <>
      <Button className="br-circle" size="sm" color="red" onClick={openModal}>
        A
      </Button>

      <Drawer
        full={isMobile}
        show={isOpen}
        onHide={closeModal}
        placement="right"
      >
        <Drawer.Header>
          <Drawer.Title>Edit room information</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <EditInput
            initialValue={name}
            onSave={onNameSave}
            label={<h6 className="mb-2">Room name</h6>}
            emptyMsg="Name can't be empty"
          />
          <EditInput
            componentClass="textarea"
            rows={5}
            initialValue={description}
            onSave={onDescriptionSave}
            label={<h6 className="mb-2">Room description</h6>}
            emptyMsg="Description can't be empty"
            wrapperClassName="mt-3"
          />
        </Drawer.Body>
        <Drawer.Footer>
          <Button block onClick={closeModal}>
            Close
          </Button>
        </Drawer.Footer>
      </Drawer>
    </>
  );
};

export default EditRoomInfoBtnDrawer;
