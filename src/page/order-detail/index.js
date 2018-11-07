'use strict';

require('./index.css');
require('page/common/nav/index');
require('page/common/header/index');
var navSide = require('page/common/nav-side/index');
var _mm = require('util/mm.js');
var _order = require('service/order-service.js');
var temp = require('./index.string');

// page逻辑部分
var page = {
    data : {
        orderNumber : _mm.getUrlParam('orderNumber')
    },
    init : function () {
        this.onLoad();
        this.bindEvent();
    },
    onLoad : function () {
        // 初始化左侧菜单
        navSide.init({
            name : 'order-list'
        });
        this.loadDetail();
    },
    bindEvent : function () {
        var _this = this;
        $(document).on('click', '.order-cancel', function () {
            if (window.confirm('确认要取消该订单？')){
                _order.cancelOrder(_this.data.orderNumber, function (res) {
                    _mm.successTips('该订单取消成功.');
                    _this.loadDetail();
                }, function (errMsg) {
                    _mm.errorTips(errMsg);
                });
            }
        });
    },
    // 加载订单列表
    loadDetail : function () {
        var _this = this,
            orderDetailHtml = '',
            $content = $('.content');
        $content.html('<div class="loading"></div>');
        _order.getOrderDetail(this.data.orderNumber, function (res) {
            _this.dataFilter(res);
            // 渲染Html
            orderDetailHtml = _mm.renderHtml(temp, res);
            $content.html(orderDetailHtml);
        }, function (errMsg) {
            $content.html('<p class="err-tip">' + errMsg + '</p>');
        });
    },
    // 数据适配
    dataFilter : function (data) {
        data.needPay = data.status == 10;
        data.isCancelable = data.status == 10;
    }
};
$(function () {
    page.init();
});