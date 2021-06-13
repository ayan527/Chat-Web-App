import React, { useCallback, useState } from 'react';
import { Alert, Icon, Input, InputGroup } from 'rsuite';

const EditInput = ({
  initialValue,
  onSave,
  label = null,
  placeholder = 'Enter an input',
  emptyMsg = "Input can't be empty",
  wrapperClassName = '',
  ...inputProps
}) => {
  const [input, setInput] = useState(initialValue);
  const [isEditable, setIsEditable] = useState(false);

  const onInputChange = useCallback(value => {
    setInput(value);
  }, []);

  const onEditable = useCallback(() => {
    setIsEditable(prev => !prev);
    setInput(initialValue);
  }, [initialValue]);

  const onSaveEdit = async () => {
    const trimmedValue = input.trim();

    if (trimmedValue === '') {
      setInput(initialValue);
      Alert.info(emptyMsg, 4000);
    } else if (trimmedValue !== initialValue) {
      await onSave(trimmedValue);
    }

    setIsEditable(false);
  };

  return (
    <div className={wrapperClassName}>
      {label}
      <InputGroup>
        <Input
          {...inputProps}
          disabled={!isEditable}
          placeholder={placeholder}
          value={input}
          onChange={onInputChange}
        />

        <InputGroup.Button onClick={onEditable}>
          <Icon icon={isEditable ? 'close' : 'edit2'} />
        </InputGroup.Button>

        {isEditable && (
          <InputGroup.Button onClick={onSaveEdit}>
            <Icon icon="check" />
          </InputGroup.Button>
        )}
      </InputGroup>
    </div>
  );
};

export default EditInput;
