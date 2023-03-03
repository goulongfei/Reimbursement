define([
    'angular',
    'app'
], function (angular, app) {
    //基础 opts
    app.factory("rcBaseOpts", function () {
        function base() {
            this.title = "添加";//一般用于按钮的显示文字  
            this.projectCodeList = '';//项目编码  
            this.stageAreaName = "";//期区名称

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
    //选择期区
    app.directive("selectMultipleStageArea", function () {
        return {
            restrict: 'A',
            template: "<div style='height:25px;'><input sog-valide-status='期区名称' type='text' class='meeting' style='display:inline-block;' ng-style='{width:readOnly?\"100%\":\"calc(100% - 22px)\",backgroundColor:opts.readOnly?\"#eee\":\"\"}' disabled ng-value='opts.stageAreaName' title='{{opts.stageAreaName}}' placeholder='请选择期区名称'/>&nbsp;<i ng-if='!opts.readOnly' ng-click='open()' class='glyphicon glyphicon-folder-open' style='cursor:pointer;'></i></div>",
            scope: {
                opts: "=",
                data: "="
            },
            replace: true,
            controller: function ($scope, sogModal, rcBaseOpts) {
                $scope.opts = rcBaseOpts.get($scope.opts);
                if (!$scope.single) {
                    $scope.single = false;
                }
                $scope.opts.stageAreaName = $scope.opts.stageAreaName || "";
                $scope.model = {
                    firstProjectName: '',
                    onlyOneProject: false,
                    stageAreaName: '',
                }
                angular.forEach($scope.data, function (item) {
                    $scope.model.stageAreaName += item.projectName + "-" + item.stageAreaName + ';';
                    if ($scope.model.onlyOneProject) {
                        $scope.opts.stageAreaName += item.stageAreaName + ';';
                    }
                    else {
                        $scope.opts.stageAreaName = $scope.model.stageAreaName;
                    }
                    if (!$scope.model.firstProjectName) { $scope.model.firstProjectName = item.projectName; }
                    if ($scope.model.firstProjectName !== item.projectName && $scope.model.onlyOneProject === true) {
                        $scope.model.onlyOneProject = false;
                        $scope.opts.stageAreaName = $scope.model.stageAreaName;
                    }
                });
                $scope.open = function () {
                    $scope.opts.refreshOpts($scope.opts);
                    if (!$scope.opts.projectList || angular.isArray($scope.opts.projectList) === false) {
                        sogModal.openAlertDialog("提示", "请先选择项目！")
                        return;
                    }
                    var codeList = '';
                    for (var i = 0; i < $scope.opts.projectList.length; i++) {
                        codeList += $scope.opts.projectList[i].projectCode + ';';
                    }
                    var viewPath = 'htmlTemplate/controlTemplate/common/stageArea.html';
                    var template = '<div ng-include="\'' + viewPath + '\'"></div>',
                        promise = sogModal.openDialog(template, '选择期区', [
                            '$scope', 'sogModal', 'seagull2Url',
                            function ($scope, sogModal, seagull2Url) {
                                $scope.init = {
                                    name: '',
                                    code: '',
                                    list: [],
                                    stageAreaInfo: [],
                                };
                                function initInfo() {
                                }
                                $scope.selectStageTreeOtps = {
                                    'rootName': '',
                                    'root': codeList,
                                    'serviceUrl': seagull2Url.getPlatformUrl("/ProjectInfo/GetStageAreasByProjectCodeList"),
                                    'autoLoadRoot': true,
                                    'showCheckboxes': true,
                                    'nodeClick': function (e) {
                                        var count = 0;
                                        $scope.init.code = e.nodeData.id;
                                        $scope.init.name = e.nodeData.displayName;
                                        $scope.init.list = e.treeModel;
                                        //父节点
                                        if (e.nodeData.hasChildren) {
                                            if (e.nodeData.checked) {
                                                angular.forEach(e.nodeData.children, function (v) {
                                                    v.checked = true;
                                                });
                                            } else {
                                                angular.forEach(e.nodeData.children, function (v) {
                                                    v.checked = false;
                                                });
                                            }
                                        }
                                        //子节点
                                        else {
                                            var id = e.nodeData.id;
                                            angular.forEach(e.treeModel, function (x) {
                                                angular.forEach(x.children, function (y) {
                                                    if (id == y.id) {
                                                        angular.forEach(x.children, function (z) {
                                                            if (!z.checked) {
                                                                x.checked = false;
                                                            } else {
                                                                count++;
                                                            }
                                                        });
                                                        if (count == x.children.length) {
                                                            x.checked = true;
                                                        }
                                                    }
                                                })
                                            })
                                        }
                                    }
                                }
                                $scope.ok = function () {
                                    angular.forEach($scope.init.list, function (v) {
                                        if (v.hasChildren) {
                                            angular.forEach(v.children, function (x) {
                                                if (x.checked) {
                                                    $scope.init.stageAreaInfo.push(x);
                                                }
                                            })
                                        }
                                    });
                                    if ($scope.init.stageAreaInfo.length) {
                                        $scope.confirm($scope.init.stageAreaInfo);
                                    } else {
                                        sogModal.openAlertDialog('选择期区', '请选择期区');
                                    }
                                }
                                initInfo();
                            }], $scope, { containerStyle: { width: '50%' } },
                            function (v, defer) {//50%
                                defer.resolve(v);//确定 
                                $scope.opts.stageAreaName = '';
                                $scope.data = v; 
                                $scope.model.firstProjectName = '';
                                $scope.model.onlyOneProject = false;
                                $scope.model.stageAreaName = '';
                                angular.forEach(v, function (item) {
                                    item.projectCode = item.extendData.projectCode;
                                    item.projectName = item.extendData.projectName;
                                    item.stageAreaCode = item.id;
                                    item.stageAreaName = item.displayName; 

                                    $scope.model.stageAreaName += item.projectName + "-" + item.stageAreaName + ';';
                                    if ($scope.model.onlyOneProject) {
                                        $scope.opts.stageAreaName += item.stageAreaName + ';';
                                    }
                                    else {
                                        $scope.opts.stageAreaName = $scope.model.stageAreaName;
                                    }
                                    if (!$scope.model.firstProjectName) { $scope.model.firstProjectName = item.projectName; }
                                    if ($scope.model.firstProjectName !== item.projectName && $scope.model.onlyOneProject === true) {
                                        $scope.model.onlyOneProject = false;
                                        $scope.opts.stageAreaName = $scope.model.stageAreaName;
                                    }
                                });
                                $scope.opts.beforAppend(v);
                            }, function (v, defer) {
                                defer.resolve(v);//取消
                            });
                }
            }
        };
    });
});