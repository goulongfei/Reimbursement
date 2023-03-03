define([
    'angular',
    'app'
], function (angular, app) {
    // 附件一键下载
    app.directive("fileDown", function () {
        return {
            restrict: 'A',
            template: '<a style="float:right;color:blue;font-size:13px;margin-top:5px;" ng-if="data && data.length>0" ng-click="open()">附件一键下载</a>',
            scope: {
                opts: "=",
                data: "="
            },
            replace: true,
            controller: function ($scope, sogModal) {
                $scope.open = function () {
                    var viewPath = 'htmlTemplate/dialogTemplate/common/fileDownList.html';
                    var template = '<div ng-include="\'' + viewPath + '\'"></div>';
                    promise = sogModal.openDialog(template, '附件一键下载', [
                        '$scope', "configure", "sogModal", 'wfWaiting', "$http", "configure", "seagull2Url", "$window",
                        function ($modelScope, configure, sogModal, wfWaiting, $http, configure, seagull2Url, $window) {
                            $scope.common = {};
                            configure.getConfig($scope.common, 'common');
                            $modelScope.model = {
                                isCheckAll: false,
                                checkAll: function () {
                                    for (var i = 0; i < $scope.data.length; i++) {
                                        var item = $scope.data[i];
                                        item.checked = !$modelScope.model.isCheckAll;
                                    }
                                }
                            }
                            // 附件设置项
                            $scope.fileOpts = {
                                'auto': true,
                                'preview': false,
                                'fileNumLimit': 0
                            };

                            // 下载
                            $modelScope.model.download = function () {
                                var list = [];
                                for (var i = 0; i < $scope.data.length; i++) {
                                    var item = $scope.data[i];
                                    if (item.checked) {
                                        list.push(item);
                                    }
                                }
                                if (list.length === 0) { return; }
                                var param = { 'FileDownList': angular.toJson(list) };
                                try {
                                    var _doc = document;
                                    var _form = _doc.createElement("form");
                                    _form.method = "POST";
                                    _form.target = "_blank";
                                    _form.action = seagull2Url.getPlatformUrl("/PurchaseFile/GetContentByZip");

                                    angular.forEach(param, function (value, key) {
                                        var _input = _doc.createElement("input");
                                        _input.type = "hidden";
                                        _input.name = key;
                                        _input.value = value;
                                        _form.appendChild(_input);
                                    });

                                    _doc.body.appendChild(_form);
                                    _form.submit();
                                    _doc.body.removeChild(_form);

                                } catch (e) {
                                    
                                }
                            }

                        }], $scope, { containerStyle: { width: '70%' } },
                        function (v, defer) {
                            defer.resolve(v);//确定 
                            $scope.data = v.name;
                        }, function (v, defer) {
                            defer.resolve(v);//取消
                        });
                }

            }
        };
    });
});