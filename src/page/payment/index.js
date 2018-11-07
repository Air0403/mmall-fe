'use strict';

require('./index.css');
require('page/common/nav/index');
require('page/common/header/index');
var _mm = require('util/mm.js');
var _payment = require('service/payment-service.js');
var temp = require('./index.string');

// page逻辑部分
var page = {
    data : {
        orderNumber : _mm.getUrlParam('orderNumber')
    },
    init : function () {
        this.onLoad();
    },
    onLoad : function () {
        this.loadPaymentInfo();
    },
    // 加载订单列表
    loadPaymentInfo : function () {
        var _this = this,
            paymentHtml = '',
            $pageWrap = $('.page-wrap');
        $pageWrap.html('<div class="loading"></div>');
        _payment.getPaymentInfo(this.data.orderNumber, function (res) {
            // 渲染Html
            paymentHtml = _mm.renderHtml(temp, res);
            $pageWrap.html(paymentHtml);
            _this.listenOrderStatus();
        }, function (errMsg) {
            $pageWrap.html('<p class="err-tip">' + errMsg + '</p>');
        });
    },
    // 监听订单状态,5秒轮询一次
    listenOrderStatus : function () {
        var _this = this;
        this.paymentTimer = window.setInterval(function () {
            _payment.getPaymentStatus(_this.data.orderNumber, function (res) {
                if (res == true) {
                    window.location.href
                        = './result.html?type=payment&orderNumber='
                        + _this.data.orderNumber;
                }
            });
        }, 5e3);
    }
};
$(function () {
    page.init();
});