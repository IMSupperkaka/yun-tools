/**
 * 有道翻译
 */

import sugar from 'sugar';
import $ from 'jquery';
import { sanitizeHTML } from '../lib/utils';

export default class YoudaoTranslator {
    constructor() {
        this.name = 'youdao';
    }

    _parseWord(page) {
        console.log(page)
        var $result = $(sanitizeHTML(page)).find('#ec_contentWrp');

        if ($result.length) {
            var response = {};

            var $phonetic = $result.find('.phonetic');
            if ($phonetic.length) {
                response.phonetic = $phonetic.last().text();
            }

            const $means = $result.find('ul li').toArray();
            response.translation = $means.map(node => node.innerText).join('<br/>');

            return response;
        } else {
            return null;
        }
    }

    _parseText(page) {
        const $result = $(sanitizeHTML(page));
        const $means = $result.find('#translateResult li').toArray();
        const translation = $means.map(item => item.innerText).join('<br/><br/>');

        return { translation: translation };
    }

    _requestWord(text, callback) {
        const settings = {
            url: `https://mobile.youdao.com/dict?le=eng&q=${text}`,
            method: 'GET',
            headers: {
                'Accept-Language': 'zh-CN,zh;q=0.8'
            },
            success: function (res) {
                console.log(res)
            },
            fail: function (err) {
                console.log(err)
            }
        };

        $.ajax(settings)
            .done(page => callback(this._parseWord(page)))
            .fail(() => callback(null));
    }

    _requestText(text, callback) {
        const settings = {
            url: 'https://mobile.youdao.com/translate',
            type: 'POST',
            data: {
                inputtext: text,
                type: 'AUTO'
            },
            headers: {
                'Accept-Language': 'zh-CN,zh;q=0.8',
                'Origin': 'https://mobile.youdao.com',
                'Refer': 'https://mobile.youdao.com/translate'
            }
        };

        $.ajax(settings)
            .done(data => callback(this._parseText(data)))
            .fail(() => callback(null));
    }

    translate(text, callback) {
        if (/^\s*$/.test(text)) {
            callback(null);
        } else if (/^[a-zA-Z]+$/.test(text)) {
            this._requestWord(text, callback);
        } else {
            this._requestText(text, callback);
        }
    }
}