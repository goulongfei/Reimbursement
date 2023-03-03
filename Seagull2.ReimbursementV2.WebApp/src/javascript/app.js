define(
    function (require, exports, module) {
        var angular = require('angular');
        var asyncLoader = require('angular-async-loader');
        require('text!common-config.json');
        require('text!config.json');
        require('module');
        // require('angular-resource');
        require('angular-ui-router');
        require('angular-seagull2-common');
        require('angular-seagull2-oauth');
        require('angular-seagull2-workflow');
        require('angular-seagull2-infrastructure');
        require('angular-datepicker');
        require('seagull2-workflow-responsive');
        //  require('angular-seagull2-affiliatedBankprovider');

        var app = angular.module('app', [
            'ui.router',
            'angular-seagull2-common',
            'angular-seagull2-workflow-oauth',
            'angular-seagull2-workflow',
            'angular-seagull2-infrastructure',
            'angular-datepicker',
            'seagull2-workflow-responsive',]);

        //var commonConfig = require('../node_modules/text/text!../../common-config.json'); //挂在到IIS下后, common-config.json应该在上一级统一配置, 各服务包直接引入
        var commonConfig = require('text!common-config.json');
        var config = require('text!config.json');

        app.config(['configureProvider', function (configureProvider) {
            configureProvider.configure(commonConfig);
            configureProvider.configure(config);
        }]);

        app.filter('htmlContent', ['$sce', function ($sce) {
            return function (input) {
                if (input != null) {
                    input = input.replace(/\n/g, "<Br />");
                }
                return $sce.trustAsHtml(input);
            };
        }]);
        //设置字符串长度
        app.filter('txtLimitLength', function () {
            return function (value, wordwise, max, tail) {

                if (!value) return '';

                max = parseInt(max, 10);
                if (!max) return value;
                if (value.length <= max) return value;

                value = value.substr(0, max);
                if (wordwise) {
                    var lastspace = value.lastIndexOf(' ');
                    if (lastspace != -1) {
                        value = value.substr(0, lastspace);
                    }
                }

                return value + (tail || ' …');//'...'可以换成其它文字
            };
        });

        // 显示百分数
        app.filter('persent', function () {
            return function (value, precision) {
                if (!angular.isNumber(value)) return '';
                newVal = (value * 100).toFixed(precision);
                return newVal + '%';
            };

        });

        // 正则
        app.factory('regex', ['$window', function ($window) {
            return {
                //电话
                phoneNumber: /^(((\+\d{2}-)?0\d{2,3}-\d{7,8})|((\+\d{2}-)?(\d{2,3}-)?(1[3-9]\d{9})))$/,

                //邮箱
                email: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,}$/,
            }
        }]);

        asyncLoader.configure(app);
        module.exports = app;
    });