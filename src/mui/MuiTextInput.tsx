import { Button, TextField, Theme, makeStyles } from '@material-ui/core';
import { Send as SendIcon } from '@material-ui/icons';
import React from 'react';

import ChatController from '../chat-controller';
import { TextActionRequest, TextActionResponse } from '../chat-types';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    flex: '1 1 auto',
    display: 'flex',
    '& > *': {
      flex: '1 1 auto',
      minWidth: 0,
    },
    '& > * + *': {
      marginLeft: theme.spacing(1),
    },
    '& :last-child': {
      flex: '0 1 auto',
    },
  },
}));

const MuiTextInput = ({
  chatController,
  actionRequest,
}: {
  chatController: ChatController;
  actionRequest: TextActionRequest;
}): React.ReactElement => {
  const classes = useStyles();
  const chatCtl = chatController;
  const initValue = actionRequest.defaultValue
    ? actionRequest.defaultValue
    : '';
  const [value, setValue] = React.useState(initValue);

  const setResponse = (): void => {
    const res: TextActionResponse = { type: 'text', value };
    chatCtl.setActionResponse(actionRequest, res);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.nativeEvent.isComposing) {
      return;
    }

    if (e.key === 'Enter' && e.shiftKey && value) {
      setResponse();
    }
  };

  const sendButtonText = actionRequest.sendButtonText
    ? actionRequest.sendButtonText
    : 'Send';

  return (
    <div className={classes.container}>
      <TextField
        type="text"
        value={value}
        onChange={(e): void => setValue(e.target.value)}
        autoFocus
        multiline
        inputProps={{ onKeyDown: handleKeyDown }}
        variant="outlined"
        rowsMax={10}
      />
      <Button
        type="button"
        onClick={setResponse}
        disabled={!value}
        variant="contained"
        color="primary"
        startIcon={<SendIcon />}
      >
        {sendButtonText}
      </Button>
    </div>
  );
};

export default MuiTextInput;
