export interface ChatState {
  option: ChatOption;
  messages: Message<unknown>[];
  actions: Action[];
  onUpdate: ((state: object) => void)[];
}

export interface ChatOption {
  delay?: number;
}

export interface Message<C> {
  type: string;
  content: C;
  isSelf: boolean;
  isTyping?: boolean;
  username?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface Action {
  request: ActionRequest;
  response?: ActionResponse;
  hook?: ActionResponseHook;
}

export interface ActionRequest {
  type: string;
  addMessage?: boolean;
  response?: ActionResponse;
}

export interface TextActionRequest extends ActionRequest {
  type: 'text';
  placeholder?: string;
  defaultValue?: string;
  sendButtonText?: string;
  response?: TextActionResponse;
}

export interface SelectActionRequest extends ActionRequest {
  type: 'select';
  options: {
    value: string;
    text: string;
  }[];
  response?: SelectActionResponse;
}

export interface MultiSelectActionRequest extends ActionRequest {
  type: 'multi-select';
  options: {
    value: string;
    text: string;
  }[];
  sendButtonText?: string;
  response?: MultiSelectActionResponse;
}

export interface FileActionRequest extends ActionRequest {
  type: 'file';
  sendButtonText?: string;
  accept?: string;
  multiple?: boolean;
  response?: FileActionResponse;
}

export interface AudioActionRequest extends ActionRequest {
  type: 'audio';
  sendButtonText?: string;
  response?: AudioActionResponse;
}

export interface ActionResponse {
  type: string;
  value: string;
  error?: Error;
}

export interface TextActionResponse extends ActionResponse {
  type: 'text';
}

export interface SelectActionResponse extends ActionResponse {
  type: 'select';
}

export interface MultiSelectActionResponse extends ActionResponse {
  type: 'multi-select';
  values: string[];
}

export interface FileActionResponse extends ActionResponse {
  type: 'file';
  files: File[];
}

export interface AudioActionResponse extends ActionResponse {
  type: 'audio';
  audio?: Blob;
}

export interface ActionResponseHook {
  (response: ActionResponse): void;
}
