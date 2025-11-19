import { WebContents } from "electron";
import { ExtendedChatItemText } from "../ipcEvent";
import { WebContentsWrapper } from "./webContentsWrapper";

let stocks: ExtendedChatItemText[] = [];
const stockedLiveChatItemIds = new Set<string>();

export function getStockedLiveChatItemIds() {
  return stockedLiveChatItemIds;
}

export function setupStocks() {
  stocks = [];
  stockedLiveChatItemIds.clear();
}

export function addStock(item: ExtendedChatItemText) {
  if (stockedLiveChatItemIds.has(item.id.id)) {
    throw new Error(`this item is already stocked. ${item.id.id}`);
  }
  stocks = [...stocks, { ...item, isStocked: true }];
  stockedLiveChatItemIds.add(item.id.id);
}

export function removeStock(item: ExtendedChatItemText) {
  if (!stockedLiveChatItemIds.has(item.id.id)) {
    throw new Error(`this item is already unstocked. ${item.id.id}`);
  }
  stocks = stocks.filter((stock) => stock.id.id !== item.id.id);
  stockedLiveChatItemIds.delete(item.id.id);
}

export function sendStocksToRenderer(webContents: WebContents) {
  WebContentsWrapper.send(webContents, "tellStocks", stocks, stocks.length);
}
