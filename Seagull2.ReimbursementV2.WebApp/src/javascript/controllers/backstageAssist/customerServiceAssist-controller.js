define(['app',
    'commonUtilExtend'], function (app) {
        app.controller('customerServiceAssist_controller',
            function ($scope, $location, wfWaiting, sogModal, $http, seagull2Url) {
                //页面数据
                $scope.viewModel = {
                    resourceID: "",
                    searchType: 0,
                    openPagelable: "查看单据",
                    openWorkFlowlable: "查看流程跟踪",
                    mutiApprovalList: [],
                    expendInfo: null,
                }
                //访问后台地址
                var configUrl = {
                    mutiApprovalUrl: '/BackstageAssist/LoadMultiWorkFlowRelateRecord',
                    abortWorkFlowUrl: '/BackstageAssist/AbortMultiWorkFlowRelate',
                    expenditureTypeUrl: '/BackstageAssist/GetExpenditureTypeInfo'
                };

                $scope.baseFn = {
                    //查询类型
                    searchType: function (type) {
                        if ($scope.viewModel.resourceID == "" || $scope.viewModel.resourceID == undefined) {
                            sogModal.openAlertDialog("提示", "请输入单据ResourceID");
                            return;
                        }
                        $scope.viewModel.searchType = type;
                    },
                    //多审批指引流程查询
                    mutiApproval: function () {
                        if ($scope.viewModel.searchType != 1) {
                            return;
                        }
                        wfWaiting.show();
                        $http.get(seagull2Url.getPlatformUrl(configUrl.mutiApprovalUrl) + "?resourceID=" + $scope.viewModel.resourceID, { cache: false })
                            .success(function (data) {
                                $scope.viewModel.mutiApprovalList = data;
                                wfWaiting.hide();
                            });
                    },
                    //多审批作废分支
                    abortWorkFlow: function (mutiApproval) {
                        if (mutiApproval.resourceID == mutiApproval.mainResourceID) {
                            sogModal.openAlertDialog("提示", "不能作废主流程");
                            return;
                        }
                        wfWaiting.show();
                        $http.get(seagull2Url.getPlatformUrl(configUrl.abortWorkFlowUrl) + "?resourceID=" + mutiApproval.resourceID, { cache: false })
                            .success(function (data) {
                                wfWaiting.hide();
                                sogModal.openAlertDialog("提示", "作废成功！");
                            }).error(function (data, status) {
                                wfWaiting.hide();
                                errorDialog.openErrorDialog(data, status, "查看异常信息");
                            });
                    },
                    //查看支持类型
                    searchExpenditureType: function () {
                        if ($scope.viewModel.searchType != 2) {
                            return;
                        }
                        wfWaiting.show();
                        $http.get(seagull2Url.getPlatformUrl(configUrl.expenditureTypeUrl) + "?resourceID=" + $scope.viewModel.resourceID, { cache: false })
                            .success(function (data) {
                                $scope.viewModel.expendInfo = data;
                                wfWaiting.hide();
                            });
                    },
                };
            });
    });

