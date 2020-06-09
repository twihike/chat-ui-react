import { Button, Theme, makeStyles } from '@material-ui/core';
import { Send as SendIcon } from '@material-ui/icons';
import React from 'react';

import { ChatController } from '../chat-controller';
import {
  MultiSelectActionRequest,
  MultiSelectActionResponse,
} from '../chat-types';

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

export function MuiMultiSelectInput({
  chatController,
  actionRequest,
}: {
  chatController: ChatController;
  actionRequest: MultiSelectActionRequest;
}): React.ReactElement {
  const classes = useStyles();
  const chatCtl = chatController;
  const [values, setValues] = React.useState<string[]>([]);

  const handleSelect = React.useCallback(
    (value: string): void => {
      if (values.find((v) => v === value) === undefined) {
        setValues([...values, value]);
      } else {
        setValues(values.filter((v) => v !== value));
      }
    },
    [values],
  );

  const setResponse = React.useCallback((): void => {
    const options = actionRequest.options.filter((o) =>
      values.includes(o.value),
    );

    const res: MultiSelectActionResponse = {
      type: 'multi-select',
      value: options.map((o) => o.text).toString(),
      options,
    };
    chatCtl.setActionResponse(actionRequest, res);
    setValues([]);
  }, [actionRequest, chatCtl, values]);

  const sendButtonText = actionRequest.sendButtonText
    ? actionRequest.sendButtonText
    : 'Send';

  return (
    <div className={classes.container}>
      {actionRequest.options.map((o) => (
        <Button
          key={actionRequest.options.indexOf(o)}
          type="button"
          value={o.value}
          onClick={(e): void => handleSelect(e.currentTarget.value)}
          variant={!values.includes(o.value) ? 'outlined' : 'contained'}
          color="primary"
        >
          {o.text}
        </Button>
      ))}
      <Button
        type="button"
        onClick={setResponse}
        disabled={values.length === 0}
        variant="contained"
        color="primary"
        startIcon={<SendIcon />}
      >
        {sendButtonText}
      </Button>
    </div>
  );
}
