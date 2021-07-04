import {
  Button,
  CssBaseline,
  Divider,
  Link,
  Theme,
  ThemeProvider,
  Typography,
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

const muiTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#007aff',
    },
  },
});

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100%',
    backgroundColor: 'gray',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    maxWidth: '640px',
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: theme.palette.background.default,
  },
  header: {
    padding: theme.spacing(1),
  },
  chat: {
    flex: '1 1 0%',
    minHeight: 0,
  },
}));

export function App(): React.ReactElement {
  const classes = useStyles();
  const [chatCtl] = React.useState(
    new ChatController({
      showDateTime: false,
    }),
  );

  React.useMemo(() => {
    echo(chatCtl);
  }, [chatCtl]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <div className={classes.root}>
        <div className={classes.container}>
          <Typography className={classes.header}>
            Welcome to{' '}
            <Link href="https://github.com/twihike/chat-ui-react">
              chat-ui-react
            </Link>{' '}
            demo site.
          </Typography>
          <Divider />
          <div className={classes.chat}>
            <MuiChat chatController={chatCtl} />
          </div>
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
    avatar: '-',
  });
  const text = await chatCtl.setActionRequest({
    type: 'text',
    placeholder: 'Please enter something',
  });
  await chatCtl.addMessage({
    type: 'text',
    content: `You have entered:\n${text.value}`,
    self: false,
    avatar: '-',
  });

  await chatCtl.addMessage({
    type: 'text',
    content: `What is your gender?`,
    self: false,
    avatar: '-',
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
    avatar: '-',
  });

  await chatCtl.addMessage({
    type: 'text',
    content: `What is your favorite fruit?`,
    self: false,
    avatar: '-',
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
    avatar: '-',
  });

  await chatCtl.addMessage({
    type: 'text',
    content: `What is your favorite picture?`,
    self: false,
    avatar: '-',
  });
  const file = (await chatCtl.setActionRequest({
    type: 'file',
    accept: 'image/*',
    multiple: true,
  })) as FileActionResponse;
  await chatCtl.addMessage({
    type: 'jsx',
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
    avatar: '-',
  });

  await chatCtl.addMessage({
    type: 'text',
    content: `Please enter your voice.`,
    self: false,
    avatar: '-',
  });
  const audio = (await chatCtl
    .setActionRequest({
      type: 'audio',
    })
    .catch(() => ({
      type: 'audio',
      value: 'Voice input failed.',
      avatar: '-',
    }))) as AudioActionResponse;
  await (audio.audio
    ? chatCtl.addMessage({
        type: 'jsx',
        content: (
          <a href={window.URL.createObjectURL(audio.audio)}>Audio downlaod</a>
        ),
        self: false,
        avatar: '-',
      })
    : chatCtl.addMessage({
        type: 'text',
        content: audio.value,
        self: false,
        avatar: '-',
      }));

  await chatCtl.addMessage({
    type: 'text',
    content: `Please press the button.`,
    self: false,
    avatar: '-',
  });
  const good = await chatCtl.setActionRequest({
    type: 'custom',
    Component: GoodInput,
  });
  await chatCtl.addMessage({
    type: 'text',
    content: `You have pressed the ${good.value} button.`,
    self: false,
    avatar: '-',
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
