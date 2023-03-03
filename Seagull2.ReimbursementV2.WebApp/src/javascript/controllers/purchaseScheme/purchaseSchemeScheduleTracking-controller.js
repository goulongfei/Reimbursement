define([
    'app',
], function (app) {
    app.controller('purchaseSchemeScheduleTracking_controller',
        function ($scope, uploader, wfWaiting, sogModal, seagull2Url, viewData, ValidateHelper, sogWfControlOperationType, wfOperate, $rootScope, sogOguType, $http, $location) {
            angular.extend($scope, viewData);
            $scope.mainTitle = '采购前置流程';
            $scope.title = '进度跟踪';
            $scope.wfOperateOpts.allowComment = false; //评论
            $scope.wfOperateOpts.allowCirculate = false; //传阅 
            var config = {
                url: {
                    updateScheduleTrackingInfoUrl: seagull2Url.getPlatformUrl('/PurchaseScheme/UpdateScheduleTrackingInfo'),
                },
            };
            $scope.settings = {
                feedbackFileOpt: {
                    'auto': true,
                    'preview': false,
                    'fileNumLimit': 0
                },
                param: {
                    //type的类型识别：0无效;1催办;2待办重发;3重新反馈;4确认无误
                    type: 0,
                    activityCode: $scope.viewModel.ActivityCode,
                    taskAcceptUser: null,
                    reBackReason: '',
                    reBackReasonFile: [],
                    materialFeedbackInfo: null,
                    taskTitle: $scope.viewModel.purchaseSchemeRecordActionEx.purchaseName + "采购前置流程" + $scope.viewModel.flowNumber
                },
                peopleSelect: {
                    selectMask: sogOguType.User,
                    multiple: false
                },
                editSate: false
            }

            $scope.scheduleTracking = {
                confirmOk: function (item) {
                    $scope.settings.param = {
                        type: 4,
                        materialFeedbackInfo: item
                    }
                    refreshProcess();
                },
                promptTask: function (item) {
                    $scope.settings.param = {
                        type: 1,
                        materialFeedbackInfo: item,
                        taskTitle: $scope.viewModel.purchaseSchemeRecordActionEx.purchaseName + "采购前置流程" + $scope.viewModel.flowNumber
                    }
                    refreshProcess();
                },
                renewFeedBack: function (item) {
                    var viewPath = './htmlTemplate/dialogTemplate/purchaseScheme/taskReturnExplainView.html';
                    var template = '<div><div ng-include="\'' + viewPath + '\'"></div>';
                    sogModal.openDialog(template, '退回说明', ['$scope', function ($childModelScope) {
                        $childModelScope.rebackModel = {
                            taskAcceptUser: item.feedbackUser,
                        }
                        $childModelScope.confirmTaskReturn = function () {
                            $scope.settings.param = {
                                type: 3,
                                taskAcceptUser: $childModelScope.rebackModel.taskAcceptUser,
                                reBackReason: $childModelScope.rebackModel.reBackReason,
                                reBackReasonFile: $childModelScope.rebackModel.reBackReasonFile,
                                materialFeedbackInfo: item,
                                taskTitle: $scope.viewModel.purchaseSchemeRecordActionEx.purchaseName + "采购前置流程" + $scope.viewModel.flowNumber
                            }
                            if ($scope.settings.param.taskAcceptUser == null || $scope.settings.param.taskAcceptUser == "") {
                                sogModal.openAlertDialog("退回说明", "待办接受人不能为空！");
                                return;
                            }
                            if ($scope.settings.param.reBackReason == null || $scope.settings.param.reBackReason == "") {
                                sogModal.openAlertDialog("退回说明", "退回理由不能为空！");
                                return;
                            }
                            $childModelScope.closeThisDialog();
                            refreshProcess();
                        }
                    }], $scope, { containerStyle: { width: '320px;' } }, function (v, defer) {
                        defer.resolve(v);
                    }, function (v, defer) {
                        defer.resolve(v);//取消
                    });
                },
                retryTask: function (item) {
                    var viewPath = './htmlTemplate/dialogTemplate/purchaseScheme/taskRepeatView.html';
                    var template = '<div><div ng-include="\'' + viewPath + '\'"></div>';
                    sogModal.openDialog(template, '待办重发', ['$scope', function ($childModelScope) {
                        $childModelScope.taskModel = {
                            taskAcceptUser: item.feedbackUser,
                        }
                        $childModelScope.confirmTaskRepeat = function () {
                            $scope.settings.param = {
                                type: 2,
                                taskAcceptUser: $childModelScope.taskModel.taskAcceptUser,
                                materialFeedbackInfo: item,
                                taskTitle: $scope.viewModel.purchaseSchemeRecordActionEx.purchaseName + "采购前置流程" + $scope.viewModel.flowNumber
                            }
                            if ($scope.settings.param.taskAcceptUser == null || $scope.settings.param.taskAcceptUser == "") {
                                sogModal.openAlertDialog("待办重发", "待办接受人不能为空！");
                                return;
                            }
                            $childModelScope.closeThisDialog();
                            refreshProcess();
                        }
                    }], $scope, { containerStyle: { width: '320px;' } }, function (v, defer) {
                        defer.resolve(v);
                    }, function (v, defer) {
                        defer.resolve(v);//取消
                    });
                },
                //查看退回记录信息
                lookingRebackRecord: function (item) {
                    wfWaiting.show();
                    $scope.rebackRecordList = [];
                    var viewPath = './htmlTemplate/dialogTemplate/purchaseScheme/rebackRecordView.html';
                    var template = '<div><div ng-include="\'' + viewPath + '\'"></div>';
                    sogModal.openDialog(template, '退回记录', ['$scope', function ($childModelScope) {
                        $http.get(seagull2Url.getPlatformUrl("/PurchaseScheme/GetRebackRecordInfoList?resourceID=" + $scope.viewModel.resourceID + "&itemCode=" + item.aggregationToCode))
                            .success(function (returnResult) {
                                wfWaiting.hide();
                                if (returnResult.status == 200 && returnResult.returnData.length != 0) {
                                    $scope.rebackRecordList = returnResult.returnData;
                                }
                            });
                    }], $scope, { containerStyle: { width: '320px;' } }, function (v, defer) {
                        defer.resolve(v);
                    }, function (v, defer) {
                        defer.resolve(v);//取消
                    });
                },
            }

            var refreshProcess = function () {
                wfWaiting.show();
                $http.post(config.url.updateScheduleTrackingInfoUrl + '?r=' + Math.random(), $scope.settings.param)
                    .success(function (returnResult) {
                        wfWaiting.hide();
                        if ($scope.settings.param.type == 1 && returnResult.returnData == "success") {
                            sogModal.openAlertDialog("催办", "催办成功！").then(function () {
                                window.location.reload();
                            });
                        }
                        else if ($scope.settings.param.type == 2 && returnResult.returnData == "success") {
                            sogModal.openAlertDialog("待办重发", "重新发起待办成功！").then(function () {
                                window.location.reload();
                            });
                        }
                        else if ($scope.settings.param.type == 3 && returnResult.returnData == "success") {
                            sogModal.openAlertDialog("重新反馈", "退回待办发起成功！").then(function () {
                                window.location.reload();
                            });
                        }
                        else if ($scope.settings.param.type == 4 && returnResult.returnData == "success") {
                            sogModal.openAlertDialog("确认无误", "确认执行成功！").then(function () {
                                window.location.reload();
                            });
                        } else {
                            sogModal.openAlertDialog("错误信息", returnResult.returnData).then(function () {
                                window.location.reload();
                            });
                        }
                    });
            };

            //加载收集数据的名称
            $scope.collectData = function (e, defer) {
                defer.resolve($scope.viewModel);
            };
        });
});



