import { Theme, makeStyles } from '@material-ui/core';
import React from 'react';

import ChatController from '../chat-controller';
import {
  AudioActionRequest,
  FileActionRequest,
  MultiSelectActionRequest,
  SelectActionRequest,
  TextActionRequest,
} from '../chat-types';

import MuiAudioInput from './MuiAudioInput';
import MuiFileInput from './MuiFileInput';
import MuiMessage from './MuiMessage';
import MuiMultiSelectInput from './MuiMultiSelectInput';
import MuiSelectInput from './MuiSelectInput';
import MuiTextInput from './MuiTextInput';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    height: '100%',
    width: '100%',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
    '& > *': {
      maxWidth: '100%',
    },
    '& > * + *': {
      marginTop: theme.spacing(1),
    },
  },
  messages: {
    flex: '1 1 0%',
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    display: 'flex',
    flexDirection: 'column',
    '& > *': {
      maxWidth: '100%',
    },
  },
  action: {
    flex: '0 1 auto',
    display: 'flex',
    alignContent: 'flex-end',
    '& > *': {
      minWidth: 0,
    },
  },
}));

const MuiChat = ({
  chatController,
}: React.PropsWithChildren<{
  chatController: ChatController;
}>): React.ReactElement => {
  const classes = useStyles();
  const chatCtl = chatController;
  const [messages, setMessages] = React.useState(chatCtl.getMessages());
  const [actReq, setActReq] = React.useState(chatCtl.getActionRequest());

  const msgRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    function scroll(): void {
      if (msgRef.current) {
        msgRef.current.scrollTop = msgRef.current.scrollHeight;
        // msgRef.current.scrollIntoView(true);
      }
    }
    function handleMassagesChanged(): void {
      setMessages([...chatCtl.getMessages()]);
      scroll();
    }
    function handleActionChanged(): void {
      setActReq(chatCtl.getActionRequest());
      scroll();
    }
    chatCtl.addOnMessagesChanged(handleMassagesChanged);
    chatCtl.addOnActionChanged(handleActionChanged);
  }, [chatCtl]);

  const unknownMsg = {
    type: 'text',
    content: 'Unknown message.',
    self: false,
  };

  return (
    <div className={classes.container}>
      <div className={classes.messages} ref={msgRef}>
        {messages.map(
          (msg): React.ReactElement => {
            if (msg.type === 'text' || msg.type === 'jsx') {
              return <MuiMessage key={messages.indexOf(msg)} message={msg} />;
            }
            return (
              <MuiMessage key={messages.indexOf(msg)} message={unknownMsg} />
            );
          },
        )}
      </div>
      <div className={classes.action}>
        {actReq && actReq.type === 'text' && (
          <MuiTextInput
            chatController={chatCtl}
            actionRequest={actReq as TextActionRequest}
          />
        )}
        {actReq && actReq.type === 'select' && (
          <MuiSelectInput
            chatController={chatCtl}
            actionRequest={actReq as SelectActionRequest}
          />
        )}
        {actReq && actReq.type === 'multi-select' && (
          <MuiMultiSelectInput
            chatController={chatCtl}
            actionRequest={actReq as MultiSelectActionRequest}
          />
        )}
        {actReq && actReq.type === 'file' && (
          <MuiFileInput
            chatController={chatCtl}
            actionRequest={actReq as FileActionRequest}
          />
        )}
        {actReq && actReq.type === 'audio' && (
          <MuiAudioInput
            chatController={chatCtl}
            actionRequest={actReq as AudioActionRequest}
          />
        )}
      </div>
    </div>
  );
};

export default MuiChat;
