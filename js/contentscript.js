import { getSelection } from '../lib/utils';
import $ from 'jquery';
import { notify, clearAllNotify } from '../lib/notify';

function toggleLinkInspectMode(flag) {
    $('body').toggleClass('translt-link-inspect-mode', flag);
    const enabled = $('body').is('.translt-link-inspect-mode');
    chrome.runtime.sendMessage({ type: 'linkInspect', enabled: enabled });
}

function selectionHandler(evt) {
    toggleLinkInspectMode(false);

    const selection = getSelection(evt);

    if (selection) {
        chrome.runtime.sendMessage({ type: 'selection', text: selection.text });
        clearAllNotify()
        notify(selection.text, {
            mode: 'in-place',
            position: selection.position,
            timeout: 1000
        });
    }
}

function removeAd () {
    $('.ec_tuiguang_pplink').closest('.result').remove();
    $('.ec-pc_brand_tip-site').closest('.ec-pl-container').remove();
}

$(document).on('mouseup', selectionHandler);

$(document).on('mousedown', clearAllNotify);

$(document).ready(function () {
    removeAd();
})

$(window).on('load', function () {
    removeAd();
})

$(window).on('resize', function () {
    removeAd();
})

chrome.extension.onMessage.addListener(function(details) {
    removeAd();
});