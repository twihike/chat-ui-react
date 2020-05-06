import {
  Action,
  ActionRequest,
  ActionResponse,
  ChatOption,
  ChatState,
  Message,
} from './chat-types';

export default class ChatController {
  private state: ChatState;

  private defaultOption: ChatOption = {
    delay: 300,
  };

  constructor(option?: ChatOption) {
    let opt: ChatOption;
    if (option) {
      opt = { ...this.defaultOption, ...option };
    } else {
      opt = { ...this.defaultOption };
    }

    this.state = {
      option: opt,
      messages: [],
      actions: [],
      onUpdate: [],
    };
  }

  addUpdateHook(hook: (state: object) => void): void {
    this.state.onUpdate.push(hook);
  }

  removeUpdateHook(hook: (state: object) => void): void {
    const idx = this.state.onUpdate.indexOf(hook);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this.state.onUpdate[idx] = (): void => {};
  }

  private callUpdateHook(): void {
    this.state.onUpdate.map((h) => h(this.state));
  }

  addMessage<C>(message: Message<C>): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const len = this.state.messages.push(message);
        const idx = len - 1;
        this.state.messages[idx].createdAt = new Date();
        this.callUpdateHook();

        resolve(idx);
      }, this.state.option.delay);
    });
  }

  updateMessage<C>(index: number, message: Message<C>): void {
    this.state.messages[index] = message;
    this.state.messages[index].updatedAt = new Date();
    this.callUpdateHook();
  }

  removeMessage(index: number): void {
    this.state.messages[index].deletedAt = new Date();
    this.callUpdateHook();
  }

  getMessages(): Message<unknown>[] {
    return this.state.messages;
  }

  setActionRequest<T extends ActionRequest>(
    request: T,
  ): Promise<ActionResponse> {
    const action: Action = {
      request,
    };
    this.state.actions.push(action);
    this.callUpdateHook();

    // See setActionResponse method
    return new Promise((resolve, reject) => {
      action.hook = (response: ActionResponse): void => {
        action.response = response;
        if (!response.error) {
          resolve(response);
        } else {
          reject(response.error);
        }
      };
    });
  }

  getActionRequest(): ActionRequest | undefined {
    if (this.state.actions.length === 0) {
      return undefined;
    }

    const act = this.state.actions.slice(-1)[0];
    if (act.response) {
      return undefined;
    }

    return act.request;
  }

  async setActionResponse(
    request: ActionRequest,
    response: ActionResponse,
  ): Promise<void> {
    const actions = this.state.actions.filter((v) => v.request === request);
    if (actions.length !== 1) {
      throw new Error('Action not found.');
    }

    const action = actions[0];
    if (action.response) {
      return;
    }

    action.response = response;
    this.callUpdateHook();

    if (request.addMessage === undefined || request.addMessage === true) {
      await this.addMessage({
        type: 'text',
        content: response.value,
        isSelf: true,
      });
    }

    if (!action.hook) {
      throw new Error('Action hook is not set.');
    }
    action.hook(response);
  }

  getActionResponse(request: ActionRequest): ActionResponse | undefined {
    const action = this.state.actions.filter((v) => v.request === request);
    if (action.length !== 1) {
      return undefined;
    }

    return action[0].response;
  }
}
