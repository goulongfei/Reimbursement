define(['angular', 'app'], function (angular, app) {
    //选择广联达招标清单
    app.directive("selectGlodonFile", function () {
        return {
            restrict: "A",
            scope: {
                opts: '=',
            },
            templateUrl: 'htmlTemplate/controlTemplate/common/glodonFileTemp.html',
            replace: true,
            transclude: false,
            controller: function ($scope, $element, $attrs, $http, sogModal, seagull2Url, wfWaiting, configure) {
                if ($scope.opts.scene === 'Draft' || $scope.opts.scene === 'Answer' || $scope.opts.scene === 'IssueBiddingDocument') {
                    $scope.isEdit = true;
                } else {
                    $scope.isEdit = false;
                }
                $scope.linkOpt = {
                    id: $scope.opts.fileId,
                    extraName: $scope.opts.fileName,
                    type: 2,
                    account: "v-yuanxf"
                }

                $scope.deleteDetail = function () {
                    wfWaiting.show();
                    $http.get(seagull2Url.getPlatformUrl("/GlodonServe/UnlockFile") + "?fileId=" + $scope.opts.fileId + "&resourceID=" + $scope.opts.resourceID,{ cache: false })
                        .success(function (data) {
                            wfWaiting.hide();
                            if (data == "true") {
                                $scope.opts.deleteAppend();
                                $scope.linkOpt.id = "";
                                $scope.linkOpt.extraName = "";
                            } else {
                                sogModal.openAlertDialog("提示", "取消清单失败！");
                                return;
                            }
                        });
                }

                // 打开选择广联达清单
                $scope.openGlodonFileModal = function () {
                    if (!$scope.opts.catalogId) {
                        sogModal.openAlertDialog("提示", "请在主页面选择采购类别！");
                        return;
                    };
                    if ($scope.opts.projectList == null || $scope.opts.projectList.length == 0) {
                        sogModal.openAlertDialog("提示", "请在主页面选择项目！");
                        return;
                    };
                    if ($scope.opts.stageAreaList == null || $scope.opts.stageAreaList.length == 0) {
                        sogModal.openAlertDialog("提示", "请在主页面选择期区！");
                        return;
                    };
                    var viewPath = 'htmlTemplate/dialogTemplate/common/selectGlodonFile.html';
                    var template = '<div ng-include="\'' + viewPath + '\'"></div>';
                    sogModal.openDialog(template, '选择招标清单', ["$scope", function ($modelScope) {
                        $modelScope.model = {
                            //广联达招标清单集合
                            allFileList: [],
                            //页面显示清单集合
                            pageFileList: [],
                            //查询条件
                            condition: {
                                // 采购类别
                                catalogId: $scope.opts.catalogId,
                                // 项目编码
                                projectId: "",
                                // 期区编码
                                projectStageID: "",
                                // 清单Id
                                fileId: "",
                                // 清单名称 
                                fileName: ""
                            },
                            // 分页配置
                            paginationConf: {
                                currentPage: 1,
                                itemsPerPage: 10,
                                totalItems: 0
                            },
                            // 选中清单
                            selectedItem: null,
                            projectList: $scope.opts.projectList,
                            stageAreaList: [],
                        };
                        
                        // 项目
                        $modelScope.projectChange = function (item) {
                            $modelScope.model.stageAreaList = [];
                            if ($scope.opts.stageAreaList != null && $scope.opts.stageAreaList.length > 0) {
                                angular.forEach($scope.opts.stageAreaList, function (itemStage) {
                                    if ($modelScope.model.condition.projectId === itemStage.projectCode) {
                                        $modelScope.model.stageAreaList.push(itemStage);
                                    }
                                });
                            }
                        };

                        // 选择操作
                        $modelScope.chooseItem = function (item) {
                            $modelScope.model.selectedItem = item;
                        };
                        // 查询操作
                        $modelScope.query = function () {
                            var model = $modelScope.model;
                            if (!model.condition.projectId) {
                                sogModal.openAlertDialog("提示", "请选择项目！");
                                return;
                            }
                            $modelScope.loadData();
                        };
                        // 确认
                        $modelScope.confirmHandler = function () {
                            var model = $modelScope.model;
                            if (!model.selectedItem) {
                                sogModal.openAlertDialog("提示", "请选择招标清单！");
                                return;
                            }
                            $modelScope.confirm(model.selectedItem);
                            var isSuccess = $scope.opts.beforAppend(model.selectedItem);
                            if (isSuccess) {
                                $scope.linkOpt.id = model.selectedItem.fileId;
                                $scope.linkOpt.extraName = model.selectedItem.fileName;
                            }
                        };
                        //分页监控
                        $modelScope.$watch('model.paginationConf.currentPage', function (newVal, oldVal) {
                            var model = $modelScope.model;
                            if (model.paginationConf.totalItems > model.paginationConf.itemsPerPage) {
                                model.pageFileList = [];
                                var cuurentPage = 0;
                                if (model.paginationConf.currentPage > 1)
                                    cuurentPage = (model.paginationConf.currentPage - 1) * model.paginationConf.itemsPerPage;
                                for (var i = cuurentPage; i < cuurentPage + model.paginationConf.itemsPerPage && i < model.paginationConf.totalItems; i++) {
                                    model.pageFileList.push(model.allFileList[i]);
                                }
                            }
                        });

                        // 加载数据
                        $modelScope.loadData = function () {
                            var url = seagull2Url.getPlatformUrl("/GlodonServe/GetTenderFileList");
                            var model = $modelScope.model;
                            var dataParm = {
                                catalogId: model.condition.catalogId,
                                projectId: model.condition.projectId,
                                projectStageID: model.condition.projectStageID,
                                fileName: model.condition.fileName
                            };
                            wfWaiting.show();
                            $http.post(url, dataParm)
                                .success(function (data) {
                                    model.paginationConf.currentPage = 1;
                                    model.paginationConf.totalItems = data.length;
                                    model.allFileList = data;
                                    if (model.paginationConf.totalItems <= model.paginationConf.itemsPerPage) {
                                        model.pageFileList = model.allFileList;
                                    } else {
                                        model.pageFileList = [];
                                        for (var i = 0; i < model.paginationConf.itemsPerPage; i++) {
                                            model.pageFileList.push(model.allFileList[i]);
                                        }
                                    }
                                    wfWaiting.hide();
                                }).error(function (data, status) {
                                    sogModal.openAlertDialog("提示", "查询出现异常，请稍后重试！");
                                    wfWaiting.hide();
                                });
                        };
                    }], $scope, { containerStyle: { width: '50%' } },
                        function (v, defer) {//50%
                            defer.resolve(v);//确定
                            $scope.opts.contract = v;
                        }, function (v, defer) {
                            defer.resolve(v);//取消
                        });
                }
            }/*End*/
        };
    });
  
});


   
