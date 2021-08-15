import { Avatar, Box, Grow, Typography, Button } from '@material-ui/core';
import React from 'react';

import { Message, MessageContent } from '../chat-types';

export function AudioMessageButton(props: any): JSX.Element {
  if (props.component) {
    return props.component;
  }
  return <Button
  style= {{flex: '1 0 0%', display: 'flex',flexDirection: 'row', border: '0px', color: 'rgb(63, 81, 181)', margin: '0px 0px 5px 10px', height: '20px', width: '20px', boxShadow: '1px 1px 2px rgba(0,0,0,.3)', marginTop:'auto'}}
  >Sound</Button>
}

export function MuiMessage({
  id,
  message,
  showDateTime,
}: {
  id: string;
  message: Message<MessageContent>;
  showDateTime: boolean;
}): React.ReactElement {
  if (message.deletedAt) {
    return <div id={id} />;
  }

  const dispDate = message.updatedAt ? message.updatedAt : message.createdAt;
  const component = message.audioButtonComponent;
  const audioButtonProps = { component };

  const playSoundContent = async () => {
    if (message.audio) {
        const sound = new Audio('data:audio/wav;base64,' + message.audio);
        await sound.play();
    }
  };

  const ChatAvator = (
    <Box
      minWidth={0}
      flexShrink={0}
      ml={message.self ? 1 : 0}
      mr={message.self ? 0 : 1}
    >
      <Avatar alt={message.username} src={message.avatar} />
    </Box>
  );

  const ChatUsername = (
    <Box maxWidth="100%" mx={1}>
      <Typography variant="body2" align={message.self ? 'right' : 'left'}>
        {message.username}
      </Typography>
    </Box>
  );

  const ChatDate = (
    <Box maxWidth="100%" mx={1}>
      <Typography
        variant="body2"
        align={message.self ? 'right' : 'left'}
        color="textSecondary"
      >
        {dispDate?.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Typography>
    </Box>
  );

  return (
    <Grow in>
      <Box
        id={id}
        maxWidth="100%"
        flex="0 1 auto"
        my={1}
        pl={message.self ? '20%' : 0}
        pr={message.self ? 0 : '20%'}
        display="flex"
        justifyContent={message.self ? 'flex-end' : 'flex-start'}
        style={{ overflowWrap: 'break-word' }}
      >
        {message.avatar && !message.self && ChatAvator}
        <Box minWidth={0} display="flex" flexDirection="column">
          {message.username && ChatUsername}
          <Box
            maxWidth="100%"
            py={1}
            px={2}
            bgcolor={message.self ? 'primary.main' : 'background.paper'}
            color={message.self ? 'primary.contrastText' : 'text.primary'}
            borderRadius={16}
            boxShadow={2}
          >
            {message.type === 'text' && (
              <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                {message.content}
              </Typography>
            )}
            {message.type === 'text_audio' && (
              <div style={{flex: '0 1 0%', display: 'flex', flexDirection: 'row'}}>
                <Typography
                  variant="body1"
                  style={{ overflowWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                    {message.content}
                </Typography>
                <div onClick={playSoundContent}>
                  <AudioMessageButton {...audioButtonProps}/>
                </div>
              </div>
            )}
            {message.type === 'jsx' && <div>{message.content}</div>}
          </Box>
          {showDateTime && ChatDate}
        </Box>
        {message.avatar && message.self && ChatAvator}
      </Box>
    </Grow>
  );
}
