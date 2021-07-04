import {
  ActionRequest,
  ActionResponse,
  ChatOption,
  Message,
  MessageContent,
  OnActionChanged,
  OnActionResponsed,
  OnMessagesChanged,
} from './chat-types';

interface ChatState {
  option: ChatOption;
  messages: Message<MessageContent>[];
  action: Action;
  actionHistory: Action[];
  onMessagesChanged: OnMessagesChanged[];
  onActionChanged: OnActionChanged[];
}

interface Action {
  request: ActionRequest;
  responses: ActionResponse[];
  onResnponsed: OnActionResponsed[];
}

export class ChatController {
  private state: ChatState;

  private defaultOption: ChatOption = {
    delay: 300,
  };

  private emptyAction: Action = {
    request: { type: 'empty' },
    responses: [],
    onResnponsed: [],
  };

  private defaultActionRequest = {
    always: false,
    addMessage: true,
  };

  constructor(option?: ChatOption) {
    this.state = {
      option: { ...this.defaultOption, ...option },
      messages: [],
      action: this.emptyAction,
      actionHistory: [],
      onMessagesChanged: [],
      onActionChanged: [],
    };
  }

  addMessage(message: Message<MessageContent>): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const len = this.state.messages.push(message);
        const idx = len - 1;
        this.state.messages[idx].createdAt = new Date();
        this.callOnMessagesChanged();

        resolve(idx);
      }, this.state.option.delay);
    });
  }

  updateMessage(index: number, message: Message<MessageContent>): void {
    if (message !== this.state.messages[index]) {
      const { createdAt } = this.state.messages[index];
      this.state.messages[index] = message;
      this.state.messages[index].createdAt = createdAt;
    }

    this.state.messages[index].updatedAt = new Date();
    this.callOnMessagesChanged();
  }

  removeMessage(index: number): void {
    this.state.messages[index].deletedAt = new Date();
    this.callOnMessagesChanged();
  }

  getMessages(): Message<MessageContent>[] {
    return this.state.messages;
  }

  setMessages(messages: Message<MessageContent>[]): void {
    this.clearMessages();
    this.state.messages = [...messages];
    this.callOnMessagesChanged();
  }

  clearMessages(): void {
    this.state.messages = [];
    this.callOnMessagesChanged();
  }

  private callOnMessagesChanged(): void {
    this.state.onMessagesChanged.map((h) => h(this.state.messages));
  }

  addOnMessagesChanged(callback: OnMessagesChanged): void {
    this.state.onMessagesChanged.push(callback);
  }

  removeOnMessagesChanged(callback: OnMessagesChanged): void {
    const idx = this.state.onMessagesChanged.indexOf(callback);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this.state.onActionChanged[idx] = (): void => {};
  }

  setActionRequest<T extends ActionRequest>(
    request: T,
    onResponse?: OnActionResponsed,
  ): Promise<ActionResponse> {
    const action: Action = {
      request: { ...this.defaultActionRequest, ...request },
      responses: [],
      onResnponsed: [],
    };

    // See setActionResponse method
    return new Promise((resolve, reject) => {
      if (!request.always) {
        const returnResponse = (response: ActionResponse): void => {
          if (!response.error) {
            resolve(response);
          } else {
            reject(response.error);
          }
        };
        action.onResnponsed.push(returnResponse);
      }

      if (onResponse) {
        action.onResnponsed.push(onResponse);
      }

      this.state.action = action;
      this.state.actionHistory.push(action);
      this.callOnActionChanged(action.request);

      if (request.always) {
        resolve({ type: 'text', value: 'dummy' });
      }
    });
  }

  cancelActionRequest(): void {
    this.state.action = this.emptyAction;
    this.callOnActionChanged(this.emptyAction.request);
  }

  getActionRequest(): ActionRequest | undefined {
    const { request, responses } = this.state.action;
    if (!request.always && responses.length > 0) {
      return undefined;
    }

    return request;
  }

  async setActionResponse(
    request: ActionRequest,
    response: ActionResponse,
  ): Promise<void> {
    const { request: origReq, responses, onResnponsed } = this.state.action;
    if (request !== origReq) {
      throw new Error('Invalid action.');
    }
    if (!request.always && onResnponsed.length === 0) {
      throw new Error('onResponsed is not set.');
    }

    responses.push(response);
    this.callOnActionChanged(request, response);

    if (request.addMessage) {
      await this.addMessage({
        type: 'text',
        content: response.value,
        self: true,
      });
    }

    onResnponsed.map((h) => h(response));
  }

  getActionResponses(): ActionResponse[] {
    return this.state.action.responses;
  }

  private callOnActionChanged(
    request: ActionRequest,
    response?: ActionResponse,
  ): void {
    this.state.onActionChanged.map((h) => h(request, response));
  }

  addOnActionChanged(callback: OnActionChanged): void {
    this.state.onActionChanged.push(callback);
  }

  removeOnActionChanged(callback: OnActionChanged): void {
    const idx = this.state.onActionChanged.indexOf(callback);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this.state.onActionChanged[idx] = (): void => {};
  }

  getOption(): ChatOption {
    return this.state.option;
  }
}
