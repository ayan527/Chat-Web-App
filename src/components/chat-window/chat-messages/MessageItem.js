import React from 'react';
import { Button } from 'rsuite';
import TimeAgo from 'timeago-react';
import { useCurrentRoom } from '../../../context/current-room.context';
import { auth } from '../../../misc/firebase';
import ProfilePic from '../../dashboard/ProfilePic';
import PresenceDot from '../../PresenceDot';
import ProfileInfoBtnModal from './ProfileInfoBtnModal';
import IconBtnControl from './IconBtnControl';
import { useHover, useMediaQuery } from '../../../misc/custom-hooks';
import ImgFileBtnModal from './ImgFileBtnModal';

const displayFileMessage = file => {
  if (file.contentType.includes('image')) {
    return (
      <div className="height-220">
        <ImgFileBtnModal src={file.url} fileName={file.name} />
      </div>
    );
  }

  return <a href={file.url}>Download {file.name}</a>;
};

const MessageItem = ({ message, handleAdmin, handleLike, handleDelete }) => {
  const { author, createdAt, text, likes, likeCount, file } = message;

  const isAdmin = useCurrentRoom(room => room.isAdmin);
  const admins = useCurrentRoom(room => room.admins);

  const isMsgAuthorAdmin = admins.includes(author.uid);
  const isAuthor = auth.currentUser.uid === author.uid;
  const canGrantAdmin = isAdmin && !isAuthor;

  const [selfRef, isHovered] = useHover();
  const isMobile = useMediaQuery('(max-width: 992px)');

  const canShowIcons = isMobile || isHovered;
  const isLiked = likes && Object.keys(likes).includes(auth.currentUser.uid);

  return (
    <li
      className={`padded mb-1 cursor-pointer ${isHovered ? 'bg-black-02' : ''}`}
      ref={selfRef}
    >
      <div className="d-flex align-items-center font-bolder mb-1">
        <PresenceDot uid={author.uid} />
        <ProfilePic
          src={author.picture}
          name={author.name}
          className="ml-1"
          size="xs"
        />
        <ProfileInfoBtnModal
          profile={author}
          appearance="link"
          className="p-0 ml-1 text-black"
        >
          {canGrantAdmin && (
            <Button
              block
              onClick={() => handleAdmin(author.uid)}
              color={isMsgAuthorAdmin ? 'red' : 'green'}
            >
              {isMsgAuthorAdmin ? 'Remove from admin' : 'Make new admin'}
            </Button>
          )}
        </ProfileInfoBtnModal>
        <TimeAgo
          datetime={createdAt}
          className="font-normal text-black-45 ml-2"
        />
        <IconBtnControl
          {...(isLiked ? { color: 'red' } : {})}
          isVisible={canShowIcons}
          iconName="heart"
          tooltip="Like"
          onClick={() => handleLike(message.id)}
          badgeContent={likeCount}
        />
        {isAuthor && (
          <IconBtnControl
            isVisible={canShowIcons}
            iconName="close"
            tooltip="Delete"
            onClick={() => handleDelete(message.id)}
          />
        )}
      </div>
      <div>
        {text && <span className="word-breal-all">{text}</span>}
        {file && displayFileMessage(file)}
      </div>
    </li>
  );
};

export default MessageItem;
