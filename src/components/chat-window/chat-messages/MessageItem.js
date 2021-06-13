import React from 'react';
import TimeAgo from 'timeago-react';
import ProfilePic from '../../dashboard/ProfilePic';

const MessageItem = ({ message }) => {
  const { author, createdAt, text } = message;

  return (
    <li className="padded mb-1">
      <div className="d-flex align-items-center font-bolder mb-1">
        <ProfilePic
          src={author.picture}
          name={author.name}
          className="ml-1"
          size="xs"
        />
        <TimeAgo
          datetime={createdAt}
          className="font-normal text-black-45 ml-2"
        />
      </div>
      <div>{text && <span className="word-breal-all">{text}</span>}</div>
    </li>
  );
};

export default MessageItem;
