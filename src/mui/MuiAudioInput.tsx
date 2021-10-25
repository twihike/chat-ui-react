import { Box, Button, Icon } from '@mui/material';
import React from 'react';

import { AudioMediaRecorder } from '../audio-media-recorder';
import { ChatController } from '../chat-controller';
import { AudioActionRequest, AudioActionResponse } from '../chat-types';

export function MuiAudioInput({
  chatController,
  actionRequest,
}: {
  chatController: ChatController;
  actionRequest: AudioActionRequest;
}): React.ReactElement {
  const chatCtl = chatController;
  const [audioRec] = React.useState(AudioMediaRecorder.getInstance());
  const [stopped, setStopped] = React.useState(true);
  const [audio, setAudio] = React.useState<Blob | undefined>();

  const handleError = React.useCallback(
    (error: Error): void => {
      const value: AudioActionResponse = {
        type: 'audio',
        value: error.message,
        error,
      };
      chatCtl.setActionResponse(actionRequest, value);
    },
    [actionRequest, chatCtl],
  );

  const handleStart = React.useCallback(async (): Promise<void> => {
    try {
      await audioRec.initialize();
      await audioRec.startRecord();
      setStopped(false);
    } catch (error) {
      handleError(error as Error);
    }
  }, [audioRec, handleError]);

  const handleStop = React.useCallback(async (): Promise<void> => {
    try {
      const a = await audioRec.stopRecord();
      setAudio(a);
      setStopped(true);
    } catch (error) {
      handleError(error as Error);
    }
  }, [audioRec, handleError]);

  const sendResponse = React.useCallback((): void => {
    if (audio) {
      const value: AudioActionResponse = {
        type: 'audio',
        value: 'Audio',
        audio,
      };
      chatCtl.setActionResponse(actionRequest, value);
      setAudio(undefined);
    }
  }, [actionRequest, audio, chatCtl]);

  const sendButtonText = actionRequest.sendButtonText
    ? actionRequest.sendButtonText
    : 'Send';

  return (
    <Box
      sx={{
        flex: '1 1 auto',
        display: 'flex',
        '& > *': {
          flex: '1 1 auto',
          minWidth: 0,
        },
        '& > * + *': {
          ml: 1,
        },
      }}
    >
      {stopped && (
        <Button
          type="button"
          onClick={handleStart}
          disabled={!stopped}
          variant="contained"
          color="primary"
          startIcon={<Icon>keyboard_voice</Icon>}
        >
          Rec start
        </Button>
      )}
      {!stopped && (
        <Button
          type="button"
          onClick={handleStop}
          disabled={stopped}
          variant="contained"
          color="primary"
          startIcon={<Icon>stop</Icon>}
        >
          Rec stop
        </Button>
      )}
      <Button
        type="button"
        onClick={sendResponse}
        disabled={!audio}
        variant="contained"
        color="primary"
        startIcon={<Icon>send</Icon>}
      >
        {sendButtonText}
      </Button>
    </Box>
  );
}
