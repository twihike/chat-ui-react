import { Box, Button } from '@mui/material';
import React from 'react';

import { ChatController } from '../chat-controller';
import { SelectActionRequest, SelectActionResponse } from '../chat-types';

export function MuiSelectInput({
  chatController,
  actionRequest,
}: {
  chatController: ChatController;
  actionRequest: SelectActionRequest;
}): React.ReactElement {
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
    <Box
      sx={{
        flex: '1 1 auto',
        display: 'flex',
        flexDirection: 'column',
        '& > *': {
          flex: '0 0 auto',
          maxWidth: '100%',
        },
        '& > * + *': {
          mt: 1,
        },
      }}
    >
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
    </Box>
  );
}
