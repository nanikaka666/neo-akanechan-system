export class ChannelId {
  readonly id: string;
  constructor(id: string) {
    if (id === "") {
      throw new Error("channelId is empty.");
    }
    if (id.match(/^[0-9a-zA-Z_-]{24}$/) === null) {
      throw new Error(
        "channelId looks like not YouTube handle has invalid format. Or YouTube changed format channelId.",
      );
    }

    this.id = id;
  }
}

export class VideoId {
  readonly id: string;
  constructor(id: string) {
    if (id.match(/^[0-9a-zA-Z_-]{11}$/) === null) {
      throw new Error("invalid format videoId.");
    }

    this.id = id;
  }
}

export class LiveChatId {
  readonly id: string;
  constructor(id: string) {
    if (id.match(/^[0-9a-zA-Z_-]{55}$/) === null) {
      throw new Error("invalid format LiveChatId.");
    }

    this.id = id;
  }
}

export class ActiveLiveChatId {
  readonly id: string;
  constructor(id: string) {
    if (id.match(/^[0-9a-zA-Z_-]{75}$/) === null) {
      throw new Error("invalid format LiveChatId.");
    }

    this.id = id;
  }
}
