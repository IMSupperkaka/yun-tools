import translators from '../translators';

const dispatchFuns = {
    translate: function (message, sender, sendResponse) {
        const translator = translators.youdao;
        translator.translate(message.text, sendResponse);
    }
}

chrome.contextMenus.create({
    id: '1',
    title: '使用Yun-Tools翻译 \'%s\'',
    contexts: ['selection']
})

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId == "radio1" || info.menuItemId == "radio2") {
        console.log("radio item " + info.menuItemId +
            " was clicked (previous checked state was " +
            info.wasChecked + ")");
    } else if (info.menuItemId == "checkbox1" || info.menuItemId == "checkbox2") {
        console.log(JSON.stringify(info));
        console.log("checkbox item " + info.menuItemId +
            " was clicked, state is now: " + info.checked +
            " (previous state was " + info.wasChecked + ")");

    } else {
        console.log("item " + info.menuItemId + " was clicked");
        console.log("info: " + JSON.stringify(info));
        console.log("tab: " + JSON.stringify(tab));
    }
})

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    let handle = message.type;
    dispatchFuns[handle] && dispatchFuns[handle](message, sender, sendResponse);
    return true;
});

chrome.webRequest.onBeforeRequest.addListener(function (details) {
    // if (details.url.indexOf('://data.video.iqiyi.com/videos/') != -1) {
    //     let location = details.url.split('?')[0];
    //     let query = details.url.split('?')[1].split('&');
    //     let queryObj = {};
    //     query.map((v) => {
    //         let item = v.split('=');
    //         queryObj[item[0]] = item[1];
    //     })
    //     queryObj.qdv = 1;
    //     queryObj.qd_uid = '1297792347';
    //     queryObj.qd_tvid = '8815482800';
    //     queryObj.qd_vip = 1;
    //     queryObj.qd_src = '01010031010000000000';
    //     queryObj.qd_tm = '1572355083881';
    //     queryObj.qd_ip = 0;
    //     queryObj.qd_p = 0;
    //     queryObj.qd_k = '25d18a8737cea1e67c3db3522a0a0482'
    //     details.url = location + '?' + Object.keys(queryObj).map((v) => {
    //         return v + '=' + queryObj[v]
    //     }).join('&');

    //     console.log(details.url)
    // }
    return {
        cancel: details.url.indexOf("://data.video.iqiyi.com/videos/other/") != -1
    };
}, { urls: ["<all_urls>"] }, ["blocking"]);

const getCurrentTabId = (callback) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (callback) callback(tabs.length ? tabs[0].id : null);
    });
}

const sendMessageToContentScript = (message, callback) => {
    getCurrentTabId((tabId) => {
        chrome.tabs.sendMessage(tabId, message, (response) => {
            if (callback) callback(response);
        });
    });
}

chrome.webRequest.onCompleted.addListener((details) => {
    if (details.url.indexOf("://www.baidu.com/s") != -1) {
        sendMessageToContentScript('removead');
    }
    return true;
}, { urls: ["<all_urls>"] }, ["responseHeaders"]);