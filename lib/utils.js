import $ from 'jquery';

export function renderTranslation(query, result) {
    let phonetic = '';
    let translation = '未找到释义';
    let className = 'transit-warning';

    if (result) {
        phonetic = result.phonetic;
        translation = result.translation;
        className = 'transit-success';
    }

    return `` +
        `<div class="transit-result ${className}">` +
        `  <code>${phonetic || ''}</code>` +
        `  <pre>${translation}</pre>` +
        `</div>`;
}

function getComputedPosition(position) {
    const $elem = $('<div class="transit-spirit"></div>').appendTo('body');
    $elem.css(position);

    const computedStyle = window.getComputedStyle($elem.get(0));
    const computedPosition = {
        left: computedStyle.left,
        top: computedStyle.top,
        right: computedStyle.right,
        bottom: computedStyle.bottom,
    };

    $elem.remove();
    return computedPosition;
}

function getPosition(evt, selection) {
    const rect = selection.getRangeAt(0).getBoundingClientRect();
    const scroll = { x: window.pageXOffset, y: window.pageYOffset };

    // 如果选中的文本是在文本框中，则使用鼠标位置
    let position = null;
    if (rect.left === 0 && rect.top === 0) {
        position = { left: evt.clientX, top: evt.clientY, height: 24 };
    } else {
        position = { left: rect.left + scroll.x, top: rect.top + scroll.y, height: rect.height };
    }

    // 生成一个临时元素以获取精准定位
    var computedPosition = getComputedPosition(position);

    if (position.top >= 150) {
        return { left: position.left, bottom: parseFloat(computedPosition.bottom) + rect.height + 10 };
    } else {
        return { left: position.left, top: parseFloat(computedPosition.top) + rect.height + 10 };
    }
}

export function getSelection(evt) {
    const selection = window.getSelection();
    const text = selection.toString().trim();

    if (text) {
        return { text: text, position: getPosition(evt, selection) };
    } else {
        return null;
    }
}

export function clearSelection() {
    const selection = window.getSelection();
    if (selection) {
        selection.empty();
    }
}

export function sanitizeHTML(html) {
    var match = html.match(/<body[\s\S]*<\/body>/img);
    return match[0].replace(/<script([\s\S]*?)<\/script>/img, '')
        .replace(/<style([\s\S]*?)<\/style>/img, '')
        .replace(/<img([\s\S]*?)>/img, '')
        .replace(/<video([\s\S]*?)>/img, '');
}

export function stopPropagation(event) {
    event.stopPropagation();
}