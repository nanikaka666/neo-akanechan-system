export class ChannelId {
  readonly id: string;
  constructor(id: string) {
    if (id.match(/^[0-9a-zA-Z_-]{24}$/) === null) {
      throw new Error(`invalid format ChannelId. ${id} (${id.length})`);
    }

    this.id = id;
  }
}

export class VideoId {
  readonly id: string;
  constructor(id: string) {
    if (id.match(/^[0-9a-zA-Z_-]{11}$/) === null) {
      throw new Error(`invalid format VideoId. ${id} (${id.length})`);
    }

    this.id = id;
  }
}

export class LiveChatId {
  readonly id: string;
  constructor(id: string) {
    if (id.match(/^[0-9a-zA-Z_-]{55}$/) === null) {
      throw new Error(`invalid format LiveChatItemId. ${id} (${id.length})`);
    }

    this.id = id;
  }
}

export class ActiveLiveChatId {
  readonly id: string;
  constructor(id: string) {
    if (id.match(/^[0-9a-zA-Z_-]{75}$/) === null) {
      throw new Error(`invalid format ActiveLiveChatItemId. ${id} (${id.length})`);
    }

    this.id = id;
  }
}
export class LiveChatItemId {
  readonly id: string;
  constructor(id: string) {
    if (id.match(/^[0-9a-zA-Z._-]{44}$/) === null && id.match(/^[0-9a-zA-Z._-]{70}$/) === null) {
      throw new Error(`invalid format LiveChatItemId. ${id} (${id.length})`);
    }

    this.id = id;
  }
}
