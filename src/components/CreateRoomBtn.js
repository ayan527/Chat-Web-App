import React, { useState, useCallback, useRef } from 'react';
import firebase from 'firebase/app';
import {
  Button,
  Icon,
  Modal,
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  Schema,
  Alert,
} from 'rsuite';
import { useModalState } from '../misc/custom-hooks';
import { database } from '../misc/firebase';

const { StringType } = Schema.Types;

const formModel = Schema.Model({
  name: StringType().isRequired('Room name is required'),
  description: StringType().isRequired('Description is required'),
});

const INITIAL_FORM = {
  name: '',
  description: '',
};

const CreateRoomBtn = () => {
  const { isOpen, openModal, closeModal } = useModalState();
  const [form, setForm] = useState(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(false);

  const formRef = useRef();

  const onFormChange = useCallback(value => {
    setForm(value);
  }, []);

  const onSubmitForm = async () => {
    if (!formRef.current.check()) {
      Alert.error("Can't create new chat room", 4000);
      return;
    }

    setIsLoading(true);

    const newRoomData = {
      ...form,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
    };

    const chatRoomRef = database.ref('/rooms');

    try {
      await chatRoomRef.push(newRoomData);

      Alert.success(`${form.name} room created successfully`, 4000);

      setIsLoading(false);
      setForm(INITIAL_FORM);
      closeModal();
    } catch (error) {
      setIsLoading(false);
      Alert.error(error.message, 4000);
    }
  };

  return (
    <div className="mt-1">
      <Button block color="green" onClick={openModal}>
        <Icon icon="creative" /> New Chat Room
      </Button>

      <Modal show={isOpen} onHide={closeModal}>
        <Modal.Header>
          <Modal.Title>Create a new chat room</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form
            fluid
            onChange={onFormChange}
            formValue={form}
            model={formModel}
            ref={formRef}
          >
            <FormGroup>
              <ControlLabel>Room Name</ControlLabel>
              <FormControl name="name" placeholder="Enter chat room name" />
            </FormGroup>

            <FormGroup>
              <ControlLabel>Room Description</ControlLabel>
              <FormControl
                componentClass="textarea"
                rows={5}
                name="description"
                placeholder="Enter room description"
              />
            </FormGroup>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            block
            appearance="primary"
            onClick={onSubmitForm}
            disabled={isLoading}
          >
            Create chat room
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CreateRoomBtn;
