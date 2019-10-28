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
    console.log(handle)
    dispatchFuns[handle] && dispatchFuns[handle](message, sender, sendResponse);
    return true;
});