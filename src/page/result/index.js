'use strict';
require('./index.css');
require('page/common/nav-simple/index');
var _mm = require('util/mm.js');

$(function () {
   var type = _mm.getUrlParam('type') || 'default',
       $element = $('.' + type + '-success');
   if (type === 'payment') {
      var orderNumber = _mm.getUrlParam('orderNumber'),
          $orderNumber = $element.find('.order-number');
       $orderNumber.attr('href', $orderNumber.attr('href') + orderNumber);
   }
   // 显示对应得提示元素
   $element.show();
});