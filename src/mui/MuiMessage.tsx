import { Box, Grow, Typography } from '@material-ui/core';
import React from 'react';

import { Message } from '../chat-types';

export function MuiMessage({
  message,
}: {
  message: Message<unknown>;
}): React.ReactElement {
  if (message.deletedAt) {
    return <div />;
  }

  const l = message.self ? '20%' : 0;
  const r = message.self ? 0 : '20%';
  const bgcolor = message.self ? 'primary.main' : 'background.paper';
  const color = message.self ? 'primary.contrastText' : 'text.primary';
  const justifyContent = message.self ? 'flex-end' : 'flex-start';

  return (
    <Grow in>
      <Box
        flex="0 0 auto"
        my={1}
        pl={l}
        pr={r}
        display="flex"
        justifyContent={justifyContent}
      >
        <Box
          minWidth={0}
          py={1}
          px={2}
          bgcolor={bgcolor}
          color={color}
          borderRadius={16}
          boxShadow={2}
        >
          <Typography
            variant="body1"
            style={{ overflowWrap: 'break-word', whiteSpace: 'pre-wrap' }}
          >
            {/* eslint-disable-next-line @typescript-eslint/ban-types */}
            {message.content as object}
          </Typography>
        </Box>
      </Box>
    </Grow>
  );
}