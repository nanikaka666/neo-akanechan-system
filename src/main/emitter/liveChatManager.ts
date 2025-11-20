import { TextMessage } from "youtube-livechat-emitter/dist/src/types/liveChat";
import {
  ExtendedChatItemSuperChat,
  ExtendedChatItemSuperSticker,
  ExtendedChatItemText,
  ExtendedGiftRedemption,
  ExtendedMembershipAndGiftItem,
  ExtendedSuperItem,
  LiveLaunchProperties,
  LiveStatistics,
} from "../../ipcEvent";
import { YoutubeLiveChatEmitter } from "youtube-livechat-emitter";
import { WebContents } from "electron";
import { WebContentsWrapper } from "../webContentsWrapper";
import {
  getStockedLiveChatItemIds,
  removeStockByLiveChatItemIdIfNeeded,
  removeStocksByChannelIdIfNeeded,
  sendStocksToRenderer,
} from "../stock";
import { updateLiveStatistics } from "../liveStatistics";

/**
 * `isStocked` is unknown (always false more correctly) when live chat receiving.
 *
 * So `isStocked` will be calculated when every sending data to renderer.
 */
type NonMarkedExtendedChatItemText = Omit<ExtendedChatItemText, "isStocked">;

let liveChatEmitter: YoutubeLiveChatEmitter | undefined;
// let chatNum: number;

let counts: Pick<
  LiveStatistics,
  | "textChatCount"
  | "chatUUCount"
  | "superChatCount"
  | "superStickerCount"
  | "newMembershipsCount"
  | "membershipMilestoneCount"
  | "giftCount"
  | "redemptionGiftCount"
>;

let textChats: NonMarkedExtendedChatItemText[];
/**
 * this variable holds count of coming text chat.
 *
 * it never decreased even if cause removing text chats.
 */
let textIndexOfWhole: number;

/**
 * including SuperChat and SuperSticker
 */
let superChats: ExtendedSuperItem[];

let membershipsAndGifts: ExtendedMembershipAndGiftItem[];

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
  textIndexOfWhole = 0;

  superChats = [];

  membershipsAndGifts = [];

  counts = {
    textChatCount: 0,
    chatUUCount: 0,
    superChatCount: 0,
    superStickerCount: 0,
    newMembershipsCount: 0,
    membershipMilestoneCount: 0,
    giftCount: 0,
    redemptionGiftCount: 0,
  };

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
      counts.chatUUCount = authorChannelIds.size;
    }
    if (item.type === "text") {
      // update text chat count.
      // textChats variable holds only 1000 items, so this count will be raised incrementally, not by calculated.
      counts.textChatCount++;

      // proceed count of text chat.
      textIndexOfWhole++;

      const convertedItem = {
        ...item,
        ...{
          indexOfWhole: textIndexOfWhole,
          formatedTime: formatDate(new Date(item.timestamp / 1000)), // microsecond to millisecond
          isFirst: isFirstChat,
        },
      } satisfies NonMarkedExtendedChatItemText;
      textChats = [...textChats, convertedItem].slice(-100); // take latest 1000 items.
      console.log(item.messages);

      sendTextChatsToRenderer();
    } else if (item.type === "superChat") {
      const convertedItem = {
        ...item,
        ...{ formatedTime: formatDate(new Date(item.timestamp / 1000)), isFirst: isFirstChat },
      } satisfies ExtendedChatItemSuperChat;
      superChats = [...superChats, convertedItem];

      // update count of superChat
      // it is enabled to calculate from superChats array, because items in superChats will not be removed.
      counts.superChatCount = superChats.filter((chat) => chat.type === "superChat").length;
      console.log(item.superChat);
      WebContentsWrapper.send(webContents!, "tellSuperChats", superChats, superChats.length);
    } else {
      const convertedItem = {
        ...item,
        ...{ formatedTime: formatDate(new Date(item.timestamp / 1000)), isFirst: isFirstChat },
      } satisfies ExtendedChatItemSuperSticker;
      superChats = [...superChats, convertedItem];

      // same as superChatCount
      counts.superStickerCount = superChats.filter((chat) => chat.type === "superSticker").length;
      console.log(item.superSticker);
      WebContentsWrapper.send(webContents!, "tellSuperChats", superChats, superChats.length);
    }
    updateLiveStatistics(counts);
  });
  liveChatEmitter.on("removeChat", (id) => {
    // update textChatCount
    const matchSize = textChats.filter((item) => item.id.id === id.id).length;
    counts.textChatCount -= matchSize;

    textChats = textChats.filter((item) => item.id.id !== id.id);
    console.log(`remove item: ${id.id}`);
    updateLiveStatistics(counts);
    sendTextChatsToRenderer();

    // if some item removed by stocks, send updated stock to renderer
    if (removeStockByLiveChatItemIdIfNeeded(id)) {
      sendStocksToRenderer(webContents!);
    }
  });
  liveChatEmitter.on("blockUser", (blockChannelId) => {
    // hold a count which how many text chat will be removed.
    const countOfRemoveTextChat = textChats.filter(
      (item) => item.author.channelId.id === blockChannelId.id,
    ).length;

    textChats = textChats.filter((item) => item.author.channelId.id !== blockChannelId.id);
    superChats = superChats.filter((item) => item.author.channelId.id !== blockChannelId.id);
    console.log(`block user: ${blockChannelId.id}`);

    counts.textChatCount -= countOfRemoveTextChat;
    counts.superChatCount = superChats.filter((item) => item.type === "superChat").length;
    counts.superStickerCount = superChats.filter((item) => item.type === "superSticker").length;

    sendTextChatsToRenderer();

    authorChannelIds.delete(blockChannelId.id);
    counts.chatUUCount = authorChannelIds.size;

    updateLiveStatistics(counts);
    // if some item removed by stocks, send updated stock to renderer
    if (removeStocksByChannelIdIfNeeded(blockChannelId)) {
      sendStocksToRenderer(webContents!);
    }
  });
  liveChatEmitter.on("memberships", (item) => {
    const convertedItem = {
      ...item,
      ...{ formatedTime: formatDate(new Date(item.timestamp / 1000)) },
    } satisfies ExtendedMembershipAndGiftItem;
    membershipsAndGifts = [...membershipsAndGifts, convertedItem];

    WebContentsWrapper.send(
      webContents!,
      "tellMembershipsAndGifts",
      membershipsAndGifts,
      membershipsAndGifts.length,
    );

    // update counts by calculation.
    counts.newMembershipsCount = membershipsAndGifts.filter((value) => value.type === "new").length;
    counts.membershipMilestoneCount = membershipsAndGifts.filter(
      (value) => value.type === "milestone",
    ).length;

    updateLiveStatistics(counts);

    if (item.type === "new") {
      console.log("New Memberships.", item);
    } else {
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
      type: "gift",
      num: Number.parseInt(res[1]),
      formatedTime: "???", // todo: livechat emitter update
      id: counts.giftCount + "", // todo: given by emitter module
    } satisfies ExtendedMembershipAndGiftItem;

    membershipsAndGifts = [...membershipsAndGifts, convertedItem];
    counts.giftCount = membershipsAndGifts.filter((value) => value.type === "gift").length;
    updateLiveStatistics(counts);

    WebContentsWrapper.send(
      webContents!,
      "tellMembershipsAndGifts",
      membershipsAndGifts,
      membershipsAndGifts.length,
    );
    console.log("Gift purchased!", convertedItem);
  });
  liveChatEmitter.on("redemptionGift", (item) => {
    const convertedItem = {
      ...item,
      type: "redemption",
      formatedTime: formatDate(new Date(item.timestamp / 1000)),
    } satisfies ExtendedGiftRedemption;
    membershipsAndGifts = [...membershipsAndGifts, convertedItem];

    counts.redemptionGiftCount = membershipsAndGifts.filter(
      (value) => value.type === "redemption",
    ).length;
    updateLiveStatistics(counts);

    WebContentsWrapper.send(
      webContents!,
      "tellMembershipsAndGifts",
      membershipsAndGifts,
      membershipsAndGifts.length,
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
export function sendTextChatsToRenderer() {
  const liveChatItemIds = getStockedLiveChatItemIds();
  const markedTextChats = textChats.map((item) => {
    return {
      ...item,
      isStocked: liveChatItemIds.has(item.id.id),
    } satisfies ExtendedChatItemText;
  });

  // note: counts.textChatCount is referenced here, so it must be updated before calling this function.
  WebContentsWrapper.send(webContents!, "tellTextChats", markedTextChats, counts.textChatCount);
}
