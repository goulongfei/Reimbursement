define([
    'angular',
    'app'
], function (angular, app) {
    //基础 opts
    app.factory("rcBaseOpts", function () {
        function base() {
            this.title = "选择";//一般用于按钮的显示文字  
            this.projectList = '';//项目
            this.stageAreaList = '';//期区    
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
    // 根据期区筛选标段
    app.filter('bidFilter', function () {
        return function (value, stageAreaCode) {
            var result = [];
            if (angular.isArray(value)) {
                for (var i = 0; i < value.length; i++) {
                    var item = value[i];
                    if (item.stageAreaCode === stageAreaCode) {
                        result.push(item);
                    }
                }
            }
            return result;
        }
    });
    //选择项目实施中的期区标段
    app.directive("selectBid", function () {
        return {
            restrict: 'A',
            template: "<div style='height:25px;'><input sog-valide-status='标段名称' type='text' class='meeting' style='display:inline-block;' ng-style='{width:readOnly?\"100%\":\"calc(100% - 22px)\",backgroundColor:opts.readOnly?\"#eee\":\"\"}' disabled ng-value='data' title='{{data}}' placeholder='请选择标段名称'/>&nbsp;<i ng-if='!opts.readOnly' ng-click='open()' class='glyphicon glyphicon-folder-open' style='cursor:pointer;'></i></div>",
            scope: {
                opts: "=",
                data: "="
            },
            replace: true,
            controller: function ($scope, sogModal, rcBaseOpts) {
                $scope.opts = rcBaseOpts.get($scope.opts);
                $scope.open = function () {
                    $scope.opts.refreshOpts($scope.opts)
                    if (angular.isArray($scope.opts.projectList) === false
                        || $scope.opts.projectList.length === 0) {
                        sogModal.openAlertDialog("提示", "请先选择项目！")
                        return;
                    }
                    if (angular.isArray($scope.opts.stageAreaList) === false
                        || $scope.opts.stageAreaList.length === 0) {
                        sogModal.openAlertDialog("提示", "请先选择期区！")
                        return;
                    }

                    var codeList = '';
                    for (var i = 0; i < $scope.opts.projectList.length; i++) {
                        codeList += $scope.opts.projectList[i].projectCode + ';';
                    }
                    var viewPath = 'htmlTemplate/controlTemplate/common/selectBid.html';
                    var template = '<div ng-include="\'' + viewPath + '\'"></div>';
                    promise = sogModal.openDialog(template, '选择标段', [
                        '$scope', "configure", "sogModal", 'wfWaiting', "$http", "configure", "seagull2Url",
                        function ($modelScope, configure, sogModal, wfWaiting, $http, configure, seagull2Url) {
                            $scope.common = {};
                            configure.getConfig($scope.common, 'common');

                            $modelScope.model = {
                                selectBid: null,
                                projectList: $scope.opts.projectList,
                                stageAreaList: $scope.opts.stageAreaList,
                                bidList: [],
                                name: '',
                                code: '',
                                list: [],
                            }
                            function initInfo() { 
                            }

                            $scope.selectBidTreeOtps = {
                                'rootName': '',
                                'root': codeList,
                                'serviceUrl': seagull2Url.getPlatformUrl("/ProjectInfo/GetImplementTendersByStageAreaList"),
                                'autoLoadRoot': true,
                                'showCheckboxes': false,
                                'nodeClick': function (e) {  
                                    if (e.nodeData.extendData && e.nodeData.extendData.isBidSection) {
                                        $modelScope.model.code = e.nodeData.id;
                                        $modelScope.model.name = e.nodeData.displayName;
                                        $modelScope.model.list = e.treeModel;
                                    }
                                }
                            }

                            $modelScope.ok = function () { 
                                if ($modelScope.model.name ) {
                                    $modelScope.confirm($modelScope.model);
                                } else {
                                    sogModal.openAlertDialog('选择标段', '请选择标段');
                                }
                            }
                            initInfo();
                        }], $scope, { containerStyle: { width: '50%' } },
                        function (v, defer) {//50%
                            defer.resolve(v);//确定 
                            $scope.data = v.name;
                            // $scope.opts.beforAppend(v);
                        }, function (v, defer) {
                            defer.resolve(v);//取消
                        });
                }

            }
        };
    });
});