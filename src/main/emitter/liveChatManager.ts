import {
  ChatItemSuperChat,
  ChatItemSuperSticker,
  ChatItemText,
  MembershipMilestone,
  NewMembership,
  SponsorshipsGift,
  TextMessage,
} from "youtube-livechat-emitter/dist/src/types/liveChat";
import { LiveLaunchProperties } from "../../ipcEvent";
import { YoutubeLiveChatEmitter } from "youtube-livechat-emitter";
import { WebContents } from "electron";
import { WebContentsWrapper } from "../webContentsWrapper";

let liveChatEmitter: YoutubeLiveChatEmitter | undefined;
let textChats: ChatItemText[];
let superChats: ChatItemSuperChat[];
let superStickers: ChatItemSuperSticker[];
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
  textChats = [];
  superChats = [];
  superStickers = [];
  newMemberships = [];
  membershipMilestones = [];
  gifts = [];
  authorChannelIds.clear();

  liveChatEmitter = new YoutubeLiveChatEmitter(
    liveLaunchProperties.channel.channel.channelId.id,
    1 * 1000,
  );
  liveChatEmitter.on("addChat", (item) => {
    if (!authorChannelIds.has(item.author.channelId.id)) {
      authorChannelIds.add(item.author.channelId.id);
      WebContentsWrapper.send(webContents!, "tellChatUniqueUserCount", authorChannelIds.size);
    }
    if (item.type === "text") {
      textChats = [...textChats, item];
      console.log(item.messages);
    } else if (item.type === "superChat") {
      superChats = [...superChats, item];
      console.log(item.superChat);
    } else {
      superStickers = [...superStickers, item];
      console.log(item.superSticker);
    }
    // tell chat count increased.
    const chatNum = textChats.length + superChats.length + superStickers.length;
    WebContentsWrapper.send(webContents!, "tellChatCount", chatNum);
  });
  liveChatEmitter.on("removeChat", (id) => {
    // very simple deleting algorythm.
    // if any problem of performance occurred then change the algorythm.
    textChats = textChats.filter((item) => item.id.id !== id.id);
    console.log(`remove item: ${id.id}`);
  });
  liveChatEmitter.on("blockUser", (blockChannelId) => {
    textChats = textChats.filter((item) => item.author.channelId.id !== blockChannelId.id);
    superChats = superChats.filter((item) => item.author.channelId.id !== blockChannelId.id);
    superStickers = superStickers.filter((item) => item.author.channelId.id !== blockChannelId.id);
    console.log(`block user: ${blockChannelId.id}`);
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
