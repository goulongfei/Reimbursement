define([
    'angular',
    'app'
], function (angular, app) {
    //基础 opts
    app.factory("rcBaseOpts", function () {
        function base() {
            this.title = "添加";//一般用于按钮的显示文字  
            this.projectCodeList = '';//项目编码  
            this.bidSectionName = "";//标段名称

            this.beforAppend = function (v) { };
            this.refreshOpts = function (opts) { };//该方法接收当前的配置对象，可在这里从新修改该配置对象；
        }
        return {
            get: function (opts) {
                if (!angular.isObject(opts)) {
                    opts = {};
                }
                return angular.extend(new base(), opts);
            }
        }
    });
    //选择标段
    app.directive("bidSection", function () {
        return {
            restrict: 'A',
            template: "<div style='height:25px;'><input sog-valide-status='标段名称' type='text' class='meeting' style='display:inline-block;' ng-style='{width:readOnly?\"100%\":\"calc(100% - 22px)\",backgroundColor:opts.readOnly?\"#eee\":\"\"}' disabled ng-value='opts.bidSectionName' title='{{opts.bidSectionName}}' placeholder='请选择标段名称'/>&nbsp;<i ng-if='!opts.readOnly' ng-click='open()' class='glyphicon glyphicon-folder-open' style='cursor:pointer;'></i></div>",
            scope: {
                opts: "=",
                data: "="
            },
            replace: true,
            controller: function ($scope, sogModal, rcBaseOpts) {
                $scope.opts = rcBaseOpts.get($scope.opts);  
                $scope.open = function () {
                    $scope.opts.refreshOpts($scope.opts);
                    $scope.selectList = [];
                    angular.forEach($scope.opts.bidSection, function (item) {
                        $scope.selectList.push({
                            biddingSectionCode: item.code ? item.code : item.$$hashKey,
                            biddingSectionName: item.biddingSectionName
                        })
                    });
                    var viewPath = 'htmlTemplate/dialogTemplate/common/bidSection.html';
                    var template = '<div ng-include="\'' + viewPath + '\'"></div>';
                    promise = sogModal.openDialog(template, '选择标段', [
                        '$scope',
                        function ($modelScope) {
                            $modelScope.modal = {
                                isCheckedAll: false,
                                bidSectionInfo: [],
                                checkedAll: function () {
                                    angular.forEach($modelScope.selectList, function (v) {
                                        v.checked = !$modelScope.modal.isCheckedAll;
                                    });
                                },
                            }

                            function initInfo() {
                                $modelScope.modal.isCheckedAll = true;
                                angular.forEach($modelScope.selectList, function (v) {
                                    v.checked = true;
                                });
                            }

                            $modelScope.ok = function () {
                                angular.forEach($modelScope.selectList, function (v) {
                                    if (v.checked) {
                                        $modelScope.modal.bidSectionInfo.push(v);
                                    }
                                });
                                if ($modelScope.modal.bidSectionInfo.length) {
                                    $modelScope.confirm($modelScope.modal.bidSectionInfo);
                                } else {
                                    sogModal.openAlertDialog('选择标段', '请选择标段');
                                }
                            }
                            initInfo();
                        }], $scope, { containerStyle: { width: '50%' } },
                        function (v, defer) {//50%
                            defer.resolve(v);//确定 
                            $scope.opts.bidSectionName = '';
                            $scope.data = [];
                            angular.forEach(v, function (item) {
                                $scope.opts.bidSectionName += item.biddingSectionName + ';';
                                $scope.data.push(item);
                            });
                            // $scope.opts.beforAppend(v);
                        }, function (v, defer) {
                            defer.resolve(v);//取消
                        });
                }


                $scope.$watch('data', function () {
                    $scope.opts.bidSectionName = "";
                    angular.forEach($scope.data, function (item) {
                        $scope.opts.bidSectionName += item.biddingSectionName + ';';
                    });
                }, true);
            }
        };
    });
});