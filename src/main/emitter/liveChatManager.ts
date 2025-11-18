import {
  MembershipMilestone,
  NewMembership,
  SponsorshipsGift,
  TextMessage,
} from "youtube-livechat-emitter/dist/src/types/liveChat";
import {
  ExtendedChatItemSuperChat,
  ExtendedChatItemSuperSticker,
  ExtendedChatItemText,
  ExtendedSuperItem,
  LiveLaunchProperties,
} from "../../ipcEvent";
import { YoutubeLiveChatEmitter } from "youtube-livechat-emitter";
import { WebContents } from "electron";
import { WebContentsWrapper } from "../webContentsWrapper";

let liveChatEmitter: YoutubeLiveChatEmitter | undefined;
let chatNum: number;

let textChats: ExtendedChatItemText[];
let textChatNum: number;

let superChats: ExtendedSuperItem[];
let superChatsNum: number;

let newMemberships: NewMembership[];
let membershipMilestones: MembershipMilestone[];
let gifts: (SponsorshipsGift & { num: number })[];

const authorChannelIds = new Set<string>();

let webContents: WebContents | undefined;

export async function setupLiveChatEmitter(
  w: WebContents,
  liveLaunchProperties: LiveLaunchProperties,
) {
  if (liveChatEmitter !== undefined) {
    liveChatEmitter.close();
    liveChatEmitter = undefined;
  }
  webContents = w;
  chatNum = 0;

  textChats = [];
  textChatNum = 0;

  superChats = [];
  superChatsNum = 0;

  newMemberships = [];
  membershipMilestones = [];
  gifts = [];
  authorChannelIds.clear();

  liveChatEmitter = new YoutubeLiveChatEmitter(
    liveLaunchProperties.channel.channel.channelId.id,
    1 * 1000,
  );
  liveChatEmitter.on("addChat", (item) => {
    let isFirstChat = false;
    if (!authorChannelIds.has(item.author.channelId.id)) {
      isFirstChat = true;
      authorChannelIds.add(item.author.channelId.id);
      WebContentsWrapper.send(webContents!, "tellChatUniqueUserCount", authorChannelIds.size);
    }
    if (item.type === "text") {
      // increase chat count
      textChatNum++;
      const convertedItem = {
        ...item,
        ...{
          indexOfWhole: textChatNum,
          formatedTime: formatDate(new Date(item.timestamp / 1000)), // microsecond to millisecond
          isFirst: isFirstChat,
        },
      } satisfies ExtendedChatItemText;
      textChats = [...textChats, convertedItem].slice(-1000); // take latest 1000 items.
      console.log(item.messages);
      WebContentsWrapper.send(webContents!, "tellTextChats", textChats, textChatNum);
    } else if (item.type === "superChat") {
      superChatsNum++;
      const convertedItem = {
        ...item,
        ...{ formatedTime: formatDate(new Date(item.timestamp / 1000)), isFirst: isFirstChat },
      } satisfies ExtendedChatItemSuperChat;
      superChats = [...superChats, convertedItem];
      console.log(item.superChat);
      WebContentsWrapper.send(webContents!, "tellSuperChats", superChats, superChatsNum);
    } else {
      superChatsNum++;
      const convertedItem = {
        ...item,
        ...{ formatedTime: formatDate(new Date(item.timestamp / 1000)), isFirst: isFirstChat },
      } satisfies ExtendedChatItemSuperSticker;
      superChats = [...superChats, convertedItem];
      console.log(item.superSticker);
      WebContentsWrapper.send(webContents!, "tellSuperChats", superChats, superChatsNum);
    }
    // tell chat count increased.
    chatNum++;
    WebContentsWrapper.send(webContents!, "tellChatCount", chatNum);
  });
  liveChatEmitter.on("removeChat", (id) => {
    // very simple deleting algorythm.
    // if any problem of performance occurred then change the algorythm.
    textChats = textChats.filter((item) => item.id.id !== id.id);
    console.log(`remove item: ${id.id}`);
    // todo: tell changed chat lists to renderer
  });
  liveChatEmitter.on("blockUser", (blockChannelId) => {
    textChats = textChats.filter((item) => item.author.channelId.id !== blockChannelId.id);
    superChats = superChats.filter((item) => item.author.channelId.id !== blockChannelId.id);
    console.log(`block user: ${blockChannelId.id}`);
    // todo: tell changed chat lists to renderer
  });
  liveChatEmitter.on("memberships", (item) => {
    if (item.type === "new") {
      newMemberships = [...newMemberships, item];
      console.log("New Memberships.", item);
    } else {
      membershipMilestones = [...membershipMilestones, item];
      console.log("Membership Milestone.", item);
    }
  });
  liveChatEmitter.on("sponsorshipsGift", (item) => {
    const message = (item.messages![0] as TextMessage).text;
    const res = message.match(/^[^0-9]*([0-9]+)/);
    if (res === null) {
      throw new Error(`Gift num not found. ${message}`);
    }
    const convertedItem = {
      ...item,
      num: Number.parseInt(res[1]),
    };
    gifts = [...gifts, convertedItem];
    console.log("Gift purchased!", convertedItem);
  });
  liveChatEmitter.on("start", () => {
    console.log("LiveChatEmitter started.");
  });
  liveChatEmitter.on("end", () => {
    console.log("LiveChatEmitter finished.");
  });
  liveChatEmitter.on("error", (error) => {
    console.log(error);
  });
  await liveChatEmitter.start();
}

function formatDate(date: Date) {
  const hour = date.getHours() + "";
  const minute = date.getMinutes() + "";
  const second = date.getSeconds() + "";

  return `${to2Digit(hour)}:${to2Digit(minute)}:${to2Digit(second)}`;
}

function to2Digit(value: string) {
  return value.length === 1 ? "0" + value : value;
}
