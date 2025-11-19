import { TextMessage } from "youtube-livechat-emitter/dist/src/types/liveChat";
import {
  ExtendedChatItemSuperChat,
  ExtendedChatItemSuperSticker,
  ExtendedChatItemText,
  ExtendedGiftRedemption,
  ExtendedMembershipAndGiftItem,
  ExtendedSuperItem,
  LiveLaunchProperties,
} from "../../ipcEvent";
import { YoutubeLiveChatEmitter } from "youtube-livechat-emitter";
import { WebContents } from "electron";
import { WebContentsWrapper } from "../webContentsWrapper";

/**
 * `isStocked` is unknown (always false more correctly) when live chat receiving.
 *
 * So `isStocked` will be calculated when every sending data to renderer.
 */
type NonMarkedExtendedChatItemText = Omit<ExtendedChatItemText, "isStocked">;

let liveChatEmitter: YoutubeLiveChatEmitter | undefined;
let chatNum: number;

let textChats: NonMarkedExtendedChatItemText[];
let textChatNum: number;

let superChats: ExtendedSuperItem[];
let superChatsNum: number;

let membershipsAndGifts: ExtendedMembershipAndGiftItem[];
let membershipsAndGIftsNum: number;

const authorChannelIds = new Set<string>();

let stocks: ExtendedChatItemText[];
const stockedLiveChatItemIds = new Set<string>();

let webContents: WebContents | undefined;

export async function setupLiveChatEmitter(
  w: WebContents,
  liveLaunchProperties: LiveLaunchProperties,
) {
  if (liveChatEmitter !== undefined) {
    liveChatEmitter.close();
    liveChatEmitter = undefined;
  }

  stocks = [];
  stockedLiveChatItemIds.clear();

  webContents = w;
  chatNum = 0;

  textChats = [];
  textChatNum = 0;

  superChats = [];
  superChatsNum = 0;

  membershipsAndGifts = [];
  membershipsAndGIftsNum = 0;

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
      } satisfies NonMarkedExtendedChatItemText;
      textChats = [...textChats, convertedItem].slice(-1000); // take latest 1000 items.
      console.log(item.messages);

      sendTextChatsToRenderer();
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
    membershipsAndGIftsNum++;
    const convertedItem = {
      ...item,
      ...{ formatedTime: formatDate(new Date(item.timestamp / 1000)) },
    } satisfies ExtendedMembershipAndGiftItem;
    membershipsAndGifts = [...membershipsAndGifts, convertedItem];

    WebContentsWrapper.send(
      webContents!,
      "tellMembershipsAndGifts",
      membershipsAndGifts,
      membershipsAndGIftsNum,
    );

    if (item.type === "new") {
      console.log("New Memberships.", item);
    } else {
      console.log("Membership Milestone.", item);
    }
  });
  liveChatEmitter.on("sponsorshipsGift", (item) => {
    membershipsAndGIftsNum++;
    const message = (item.messages![0] as TextMessage).text;
    const res = message.match(/^[^0-9]*([0-9]+)/);
    if (res === null) {
      throw new Error(`Gift num not found. ${message}`);
    }
    const convertedItem = {
      ...item,
      type: "gift",
      num: Number.parseInt(res[1]),
      formatedTime: "???", // todo: livechat emitter update
    } satisfies ExtendedMembershipAndGiftItem;

    membershipsAndGifts = [...membershipsAndGifts, convertedItem];

    WebContentsWrapper.send(
      webContents!,
      "tellMembershipsAndGifts",
      membershipsAndGifts,
      membershipsAndGIftsNum,
    );
    console.log("Gift purchased!", convertedItem);
  });
  liveChatEmitter.on("redemptionGift", (item) => {
    membershipsAndGIftsNum++;
    const convertedItem = {
      ...item,
      type: "redemption",
      formatedTime: formatDate(new Date(item.timestamp / 1000)),
    } satisfies ExtendedGiftRedemption;
    membershipsAndGifts = [...membershipsAndGifts, convertedItem];
    WebContentsWrapper.send(
      webContents!,
      "tellMembershipsAndGifts",
      membershipsAndGifts,
      membershipsAndGIftsNum,
    );
    console.log("Gift redemption!", convertedItem);
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
/**
 * Send chat data to renderer.
 *
 * set `isStocked` property.
 */
function sendTextChatsToRenderer() {
  const markedTextChats = textChats.map((item) => {
    return {
      ...item,
      isStocked: stockedLiveChatItemIds.has(item.id.id),
    } satisfies ExtendedChatItemText;
  });

  WebContentsWrapper.send(webContents!, "tellTextChats", markedTextChats, textChatNum);
}
