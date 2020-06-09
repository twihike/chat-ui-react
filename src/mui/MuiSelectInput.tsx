import { Button, Theme, makeStyles } from '@material-ui/core';
import React from 'react';

import { ChatController } from '../chat-controller';
import { SelectActionRequest, SelectActionResponse } from '../chat-types';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    '& > *': {
      flex: '0 0 auto',
      maxWidth: '100%',
    },
    '& > * + *': {
      marginTop: theme.spacing(1),
    },
  },
}));

export function MuiSelectInput({
  chatController,
  actionRequest,
}: {
  chatController: ChatController;
  actionRequest: SelectActionRequest;
}): React.ReactElement {
  const classes = useStyles();
  const chatCtl = chatController;

  const setResponse = React.useCallback(
    (value: string): void => {
      const option = actionRequest.options.find((o) => o.value === value);
      if (!option) {
        throw new Error(`Unknown value: ${value}`);
      }
      const res: SelectActionResponse = {
        type: 'select',
        value: option.text,
        option,
      };
      chatCtl.setActionResponse(actionRequest, res);
    },
    [actionRequest, chatCtl],
  );

  return (
    <div className={classes.container}>
      {actionRequest.options.map((o) => (
        <Button
          key={actionRequest.options.indexOf(o)}
          type="button"
          value={o.value}
          onClick={(e): void => setResponse(e.currentTarget.value)}
          variant="contained"
          color="primary"
        >
          {o.text}
        </Button>
      ))}
    </div>
  );
}
