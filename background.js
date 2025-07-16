/*
 * Hide Facebook Home Page Extension
 * Copyright (C) 2025 Stavros G.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

// when pressing the button
browser.browserAction.onClicked.addListener((tab) => {
  if (!tab.url.includes("facebook.com")) {
    return;
  } // doing that just to make button work only when you are on facebook tab

  browser.storage.local.get('feedBlockerEnabled').then((result) => {
    let enabled = result.feedBlockerEnabled || false;

    enabled = !enabled;
    browser.storage.local.set({ feedBlockerEnabled: enabled });

    browser.tabs.executeScript(tab.id, { file: "remove_feed.js" }).then(() => {
      browser.tabs.sendMessage(tab.id, { action: enabled ? "enable" : "disable" });
    });
  });
});

// when refreshing tab
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab.url &&
    tab.url.includes("facebook.com")
  ) {
    browser.storage.local.get('feedBlockerEnabled').then((result) => {
      if (result.feedBlockerEnabled) {
        browser.tabs.executeScript(tabId, { file: "remove_feed.js" }).then(() => {
          browser.tabs.sendMessage(tabId, { action: "enable" });
        });
      }
    });
  }
});
