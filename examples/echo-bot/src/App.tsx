import {
  Button,
  CssBaseline,
  ThemeProvider,
  createMuiTheme,
  makeStyles,
} from '@material-ui/core';
import {
  ActionRequest,
  AudioActionResponse,
  ChatController,
  FileActionResponse,
  MuiChat,
} from 'chat-ui-react';
import React from 'react';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#007aff',
    },
  },
});

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: 'gray',
  },
  container: {
    minHeight: '100vh',
    height: '100vh',
    maxWidth: '640px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}));

export function App(): React.ReactElement {
  const classes = useStyles();
  const [chatCtl] = React.useState(new ChatController());

  React.useMemo(() => {
    echo(chatCtl);
  }, [chatCtl]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={classes.root}>
        <div className={classes.container}>
          <MuiChat chatController={chatCtl} />
        </div>
      </div>
    </ThemeProvider>
  );
}

async function echo(chatCtl: ChatController): Promise<void> {
  await chatCtl.addMessage({
    type: 'text',
    content: `Please enter something.`,
    self: false,
  });
  const text = await chatCtl.setActionRequest({
    type: 'text',
    placeholder: 'Please enter something',
  });
  await chatCtl.addMessage({
    type: 'text',
    content: `You have entered:\n${text.value}`,
    self: false,
  });

  await chatCtl.addMessage({
    type: 'text',
    content: `What is your gender?`,
    self: false,
  });
  const sel = await chatCtl.setActionRequest({
    type: 'select',
    options: [
      {
        value: 'man',
        text: 'Man',
      },
      {
        value: 'woman',
        text: 'Woman',
      },
      {
        value: 'other',
        text: 'Other',
      },
    ],
  });
  await chatCtl.addMessage({
    type: 'text',
    content: `You have selected ${sel.value}.`,
    self: false,
  });

  await chatCtl.addMessage({
    type: 'text',
    content: `What is your favorite fruit?`,
    self: false,
  });
  const mulSel = await chatCtl.setActionRequest({
    type: 'multi-select',
    options: [
      {
        value: 'apple',
        text: 'Apple',
      },
      {
        value: 'orange',
        text: 'Orange',
      },
      {
        value: 'none',
        text: 'None',
      },
    ],
  });
  await chatCtl.addMessage({
    type: 'text',
    content: `You have selected '${mulSel.value}'.`,
    self: false,
  });

  await chatCtl.addMessage({
    type: 'text',
    content: `What is your favorite picture?`,
    self: false,
  });
  const file = (await chatCtl.setActionRequest({
    type: 'file',
    accept: 'image/*',
    multiple: true,
  })) as FileActionResponse;
  await chatCtl.addMessage({
    type: 'text',
    content: (
      <div>
        {file.files.map((f) => (
          <img
            key={file.files.indexOf(f)}
            src={window.URL.createObjectURL(f)}
            alt="File"
            style={{ width: '100%', height: 'auto' }}
          />
        ))}
      </div>
    ),
    self: false,
  });

  await chatCtl.addMessage({
    type: 'text',
    content: `Please enter your voice.`,
    self: false,
  });
  const audio = (await chatCtl
    .setActionRequest({
      type: 'audio',
    })
    .catch(() => {
      return {
        type: 'audio',
        value: 'Voice input failed.',
      };
    })) as AudioActionResponse;
  if (audio.audio) {
    await chatCtl.addMessage({
      type: 'text',
      content: (
        <a href={window.URL.createObjectURL(audio.audio)}>Audio downlaod</a>
      ),
      self: false,
    });
  } else {
    await chatCtl.addMessage({
      type: 'text',
      content: audio.value,
      self: false,
    });
  }

  await chatCtl.addMessage({
    type: 'text',
    content: `Please press the button.`,
    self: false,
  });
  const good = await chatCtl.setActionRequest({
    type: 'custom',
    Component: GoodInput,
  });
  await chatCtl.addMessage({
    type: 'text',
    content: `You have pressed the ${good.value} button.`,
    self: false,
  });

  echo(chatCtl);
}

function GoodInput({
  chatController,
  actionRequest,
}: {
  chatController: ChatController;
  actionRequest: ActionRequest;
}) {
  const chatCtl = chatController;

  const setResponse = React.useCallback((): void => {
    const res = { type: 'custom', value: 'Good!' };
    chatCtl.setActionResponse(actionRequest, res);
  }, [actionRequest, chatCtl]);

  return (
    <div>
      <Button
        type="button"
        onClick={setResponse}
        variant="contained"
        color="primary"
      >
        Good!
      </Button>
    </div>
  );
}
