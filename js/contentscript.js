import { getSelection } from '../lib/utils';
import $ from 'jquery';
import notify from '../lib/notify';

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

        notify(selection.text, {
            mode: 'in-place',
            position: selection.position,
            timeout: 1000
        });
    }
}

console.log('inject success!')
$(document).on('mouseup', selectionHandler);