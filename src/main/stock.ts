import { WebContents } from "electron";
import { ExtendedChatItemText } from "../ipcEvent";
import { WebContentsWrapper } from "./webContentsWrapper";
import { LiveChatItemId } from "youtube-livechat-emitter/dist/src/core/LiveChatItemId";
import { ChannelId } from "youtube-live-scraper";
import { updateLiveStatistics } from "./liveStatistics";

/**
 * Stocks is set of marked text chat item.
 *
 * Owner can reference stocked item whenever even if it flew out from chat list.
 */
let stocks: ExtendedChatItemText[] = [];
let webContents: WebContents;

const stockedLiveChatItemIds = new Set<string>();

export function getStockedLiveChatItemIds() {
  return stockedLiveChatItemIds;
}

export function setupStocks(w: WebContents) {
  stocks = [];
  stockedLiveChatItemIds.clear();
  webContents = w;
}

export function addStock(item: ExtendedChatItemText) {
  if (stockedLiveChatItemIds.has(item.id.id)) {
    throw new Error(`this item is already stocked. ${item.id.id}`);
  }
  stocks = [...stocks, { ...item, isStocked: true }];
  stockedLiveChatItemIds.add(item.id.id);
  sendStocksToRenderer();
}

export function removeStock(item: ExtendedChatItemText) {
  if (!stockedLiveChatItemIds.has(item.id.id)) {
    throw new Error(`this item is already unstocked. ${item.id.id}`);
  }
  stocks = stocks.filter((stock) => stock.id.id !== item.id.id);
  stockedLiveChatItemIds.delete(item.id.id);
  sendStocksToRenderer();
}

export function removeStockByLiveChatItemIdIfNeeded(liveChatItemId: LiveChatItemId) {
  const target = stocks.filter((item) => item.id.id === liveChatItemId.id);
  if (target.length === 0) {
    return;
  }
  removeStock(target[0]);
}

export function removeStocksByChannelIdIfNeeded(channelId: ChannelId) {
  const targets = stocks.filter((item) => item.author.channelId.id === channelId.id);
  if (targets.length === 0) {
    return;
  }

  targets.forEach(removeStock);
}

function sendStocksToRenderer() {
  updateLiveStatistics({ stocksCount: stockedLiveChatItemIds.size });
  WebContentsWrapper.send(webContents, "tellStocks", stocks, stocks.length);
}
