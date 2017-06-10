// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current active Tab.
 *
 * @param {function(object)} callback - called when the current tab
 *   is found.
 */
function getCurrentTab(callback) {
    // Query filter to be passed to chrome.tabs.query - see
    // https://developer.chrome.com/extensions/tabs#method-query
    var queryInfo = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(queryInfo, function(tabs) {
        // chrome.tabs.query invokes the callback with a list of tabs that match the
        // query. When the popup is opened, there is certainly a window and at least
        // one tab, so we can safely assume that |tabs| is a non-empty array.
        // A window can only have one active tab at a time, so the array consists of
        // exactly one tab.
        var tab = tabs[0];

        // A tab is a plain object that provides information about the tab.
        // See https://developer.chrome.com/extensions/tabs#type-Tab
        var url = tab.url;

        // tab.url is only available if the "activeTab" permission is declared.
        // If you want to see the URL of other tabs (e.g. after removing active:true
        // from |queryInfo|), then the "tabs" permission is required to see their
        // "url" properties.
        console.assert(typeof url == 'string', 'tab.url should be a string');

        callback(tab);
    });

    // Most methods of the Chrome extension APIs are asynchronous. This means that
    // you CANNOT do something like this:
    //
    // var url;
    // chrome.tabs.query(queryInfo, function(tabs) {
    //   url = tabs[0].url;
    // });
    // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

/**
 * 原示例中 google search 的 API 已经关闭
 * 新版的 API 配置更严格, 并不方便使用, 所以先去掉这个功能啦~
 */
// function getImageUrl(searchTerm, callback, errorCallback) {
//     // Google image search - 100 searches per day.
//     // https://developers.google.com/image-search/
//     var searchUrl = 'https://ajax.googleapis.com/ajax/services/search/images' +
//         '?v=1.0&q=' + encodeURIComponent(searchTerm);
//     var x = new XMLHttpRequest();
//     x.open('GET', searchUrl);
//     // The Google image search API responds with JSON, so let Chrome parse it.
//     x.responseType = 'json';
//     x.onload = function() {
//         // Parse and process the response from Google Image Search.
//         var response = x.response;
//         if (!response || !response.responseData || !response.responseData.results ||
//             response.responseData.results.length === 0) {
//             errorCallback('No response from Google Image search!');
//             return;
//         }
//         var firstResult = response.responseData.results[0];
//         // Take the thumbnail instead of the full image to get an approximately
//         // consistent image size.
//         var imageUrl = firstResult.tbUrl;
//         var width = parseInt(firstResult.tbWidth);
//         var height = parseInt(firstResult.tbHeight);
//         console.assert(
//             typeof imageUrl == 'string' && !isNaN(width) && !isNaN(height),
//             'Unexpected respose from the Google Image Search API!');
//         callback(imageUrl, width, height);
//     };
//     x.onerror = function() {
//         errorCallback('Network error.');
//     };
//     x.send();
// }

function renderTabInfo(tab) {
    var infoHTML = '';
    Object.keys(tab).map(key => {
        infoHTML += `<li> ${key}: ${tab[key]}</li>`;
    });
    document.getElementById('tab-prop').innerHTML = infoHTML;
}

function renderStatus(statusText) {
    document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
    getCurrentTab(function(tab) {
        renderStatus('Current tab\'s url is ' + tab.url);
        renderTabInfo(tab);
    });
});