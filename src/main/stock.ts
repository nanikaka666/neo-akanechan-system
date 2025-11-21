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
let webContents: WebContents | undefined;

const stockedLiveChatItemIds = new Set<string>();

export function getStockedLiveChatItemIds() {
  return stockedLiveChatItemIds;
}

export function cleanUpStocks() {
  stocks = [];
  stockedLiveChatItemIds.clear();
  webContents = undefined;
}

export function setupStocks(w: WebContents) {
  stocks = [];
  stockedLiveChatItemIds.clear();
  webContents = w;
}

/**
 * add item to stock without notify to renderer.
 */
function addStockOnly(item: ExtendedChatItemText) {
  if (stockedLiveChatItemIds.has(item.id.id)) {
    throw new Error(`this item is already stocked. ${item.id.id}`);
  }
  stocks = [...stocks, { ...item, isStocked: true }];
  stockedLiveChatItemIds.add(item.id.id);
}

export function addStock(item: ExtendedChatItemText) {
  if (stockedLiveChatItemIds.has(item.id.id)) {
    return false;
  }
  addStockOnly(item);
  sendStocksToRenderer();
  return true;
}

/**
 * remove item from stock without notify to renderer.
 */
function removeStockOnly(item: ExtendedChatItemText) {
  if (!stockedLiveChatItemIds.has(item.id.id)) {
    throw new Error(`this item is already unstocked. ${item.id.id}`);
  }
  stocks = stocks.filter((stock) => stock.id.id !== item.id.id);
  stockedLiveChatItemIds.delete(item.id.id);
}

export function removeStock(item: ExtendedChatItemText) {
  if (!stockedLiveChatItemIds.has(item.id.id)) {
    return false;
  }
  removeStockOnly(item);
  sendStocksToRenderer();
  return true;
}

export function removeStockByLiveChatItemIdIfNeeded(liveChatItemId: LiveChatItemId) {
  const target = stocks.filter((item) => item.id.id === liveChatItemId.id);
  if (target.length === 0) {
    return false;
  }
  removeStockOnly(target[0]);
  sendStocksToRenderer();
  return true;
}

export function removeStocksByChannelIdIfNeeded(channelId: ChannelId) {
  const targets = stocks.filter((item) => item.author.channelId.id === channelId.id);
  if (targets.length === 0) {
    return false;
  }

  targets.forEach(removeStockOnly);
  sendStocksToRenderer();
  return true;
}

function sendStocksToRenderer() {
  if (!webContents) {
    throw new Error(`webContents is undefined, call setupStocks()`);
  }
  updateLiveStatistics({ stocksCount: stockedLiveChatItemIds.size });
  WebContentsWrapper.send(webContents, "tellStocks", stocks, stocks.length);
}
