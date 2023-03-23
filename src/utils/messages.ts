class MessageQueue {
  lastMessageAdded: string | null = null;
  lastMessageRequested: string | null = null;
  messages: string[] = [];

  addMessage(message: string) {
    this.messages.push(message);
    this.lastMessageAdded = this.messages[this.messages.length - 1];
  }

  getLastMessage() {
    this.lastMessageRequested = this.lastMessageAdded;
    return this.lastMessageAdded;
  }

  getLastMessageRequested() {
    return this.lastMessageRequested;
  }

  getMessages() {
    return this.messages;
  }

  resetMessages() {
    this.messages = [];
  }

  setMessages(newMessages: string[]) {
    this.messages = newMessages;
  }
}

export const messageQueue = new MessageQueue();
