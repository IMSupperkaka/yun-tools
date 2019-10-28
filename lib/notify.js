import $ from 'jquery';
import sugar from 'sugar';

import {
    stopPropagation,
    clearSelection,
    renderTranslation
} from './utils';

var notifyList = [];
var tpls = {
    notify: '<div class="transit-notify transit-{1}">' +
        ' <div class="transit-notify-content">{2}</div>' +
        '</div>',
    list: '<div class="transit-notify-list">' +
        '  <div class="transit-list-inner"></div>' +
        '</div>',
    success: '<div class="transit-result transit-success">{1}</div>',
    warning: '<div class="transit-result transit-warning">{1}</div>',
    loading: '<div class="transit-result">' + '正在翻译...</div>',
};

function getNotifyList() {
    var $notifyList = $('.transit-notify-list');
    if ($notifyList.length <= 0) {
        $notifyList = $(tpls.list).appendTo('body');
    }

    return $notifyList;
}

var Notify = function (text, options) {
    this.text = text;
    this.options = options;

    this.render();
    this.bind();
    this.request();
};

Notify.prototype.render = function () {
    var loading = tpls.loading.assign(this.text);
    this.$el = $(tpls.notify.assign(this.options.mode, loading));

    if (this.options.mode == 'margin') {
        var $list = getNotifyList().find('.transit-list-inner');
        this.$el.appendTo($list);
    } else {
        this.$el.appendTo('body')
            .css({ position: 'absolute' })
            .css(this.options.position)
            .fadeIn();
    }
};

Notify.prototype.request = function () {
    var self = this;
    var message = { type: 'translate', text: self.text };
    chrome.extension.sendMessage(message, function (response) {
        var result = renderTranslation(self.text, response);
        self.$el.find('.transit-notify-content').html(result);
        self.hide();
    });
};

Notify.prototype.mouseover = function () {
    var $notify = this.$el;
    $notify.clearQueue();
    $notify.stop();

    if ($notify.is('.transit-in-place')) {
        $notify.insertAfter($('.transit-in-place:last'));
        event.stopPropagation();
    }
};

Notify.prototype.bind = function () {
    this.$el.hover(
        $.proxy(this.mouseover, this),
        $.proxy(this.hide, this)
    );

    var $close = this.$el.find('.transit-notify-close');
    $close.click($.proxy(this.close, this));

    $close.mouseup(stopPropagation);
    
    this.$el.mouseup(stopPropagation);
    this.$el.mousedown(stopPropagation);
};


Notify.prototype.hide = function () {
    this.$el.delay(this.options.timeout * 1000)
        .fadeOut($.proxy(this.destroy, this));
};


Notify.prototype.close = function (event) {
    clearSelection();
    $.proxy(this.destroy, this)()
    // this.$el.fadeOut($.proxy(this.destroy, this));
};

Notify.prototype.destroy = function () {
    notifyList.remove({ text: this.text });
    this.$el.remove();
};

const notify = function (text, options) {
    if (!notifyList.find((v) => {
        return v.text == text
    })) {
        notifyList.push(new Notify(text, options));
    }
};

const clearAllNotify = function () {
    notifyList.forEach(function (v) {
        v.close();
    })
}

window.notify = notify;

export { notify, clearAllNotify }