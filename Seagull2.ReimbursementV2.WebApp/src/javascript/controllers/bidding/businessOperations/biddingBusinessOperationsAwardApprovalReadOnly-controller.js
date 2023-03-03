define(
    [
        'app',
        'commonUtilExtend',
        'contractAgreementExtend',
        'signContractExtend',
        'leftNavExtend',
        'biddingSynthesizeExtend',
    ],
    function (app) {
        app.controller('biddingBusinessOperationsAwardApprovalReadOnly_controller',
            function ($scope, viewData, wfWaiting, sogModal, configure, seagull2Url, $http, $window) {
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                angular.extend($scope, viewData);
                //流程标题
                $scope.mainTitle = viewData.viewModel.purchaseBase.purchaseWayName;
                $scope.title = viewData.viewModel.formAction.actionTypeName;
                //设置导航栏按钮状态
                $scope.wfOperateOpts.allowPrint = false;//打印    
                $scope.wfOperateOpts.allowDoAbort = false;//作废
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底
                $scope.wfOperateOpts.allowAdminMoveTo = false;//超级发送

                if (viewData.wfOperateOpts.sendButtonName == "已阅") {
                    viewData.wfOperateOpts.allowRejection = false;//退回 
                    viewData.wfOperateOpts.allowSave = false;//保存
                    if (viewData.wfOperateOpts.allowMoveTo)
                        viewData.wfOperateOpts.allowComment = true; //评论
                }
                
                // 设置
                $scope.settings = {
                    //合约规划
                    contractAgreementOpts: {
                        model: 'readOnly',
                        isAdmin: $scope.viewModel.isAdmin,
                    },
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 2000,
                        resourceId: $scope.resourceId,
                        scene: "BiddingBusinessOperationsAward",
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                        isAbandonBidding: $scope.viewModel.purchaseOfBusinessOperations.isAbandonBidding,
                        isGrantDiscountEnquiry: $scope.viewModel.purchaseOfBusinessOperations.isGrantDiscountEnquiry,
                        actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
                    },
                    //附件设置项
                    fileReady: true,
                    fileOpts: {
                        'auto': true,
                        'preview': false,
                        'fileNumLimit': 0
                    },
                };

                // 基本信息 
                $scope.baseInfo = {
                    lookInfo: function (routesType) {
                        wfWaiting.show();
                        var urlat = null;
                        $http.get(seagull2Url.getPlatformUrl("/PublicApi/TicketStr?r=" + new Date().getTime()))
                            .success(function (data) {
                                wfWaiting.hide();
                                urlat = data;
                                if (urlat !== null) {
                                    urlat = urlat.replace(/"/g, "");
                                    var activityID = "";
                                    angular.forEach($scope.viewModel.processActivityInfoList, function (process) {
                                        if (process.activityStateName == routesType) {
                                            activityID = process.activityCode;
                                        }
                                    });
                                    if (activityID != "") {
                                        var url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/" + routesType + "/?resourceID=" + $scope.viewModel.resourceID + "&activityID=" + activityID + "&_at=" + urlat;
                                        $window.open(url, '_blank');
                                    }
                                }
                            })
                            .error(function (data, status) {
                                errorDialog.openErrorDialog(data, status, "查看信息异常");
                                wfWaiting.hide();
                            });
                    },
                    //关联合约
                    relatinCotractAgreement: function (contract) {
                        var viewPath = 'htmlTemplate/dialogTemplate/common/perSignBusinessAgreement.html';
                        var template = '<div ng-include="\'' + viewPath + '\'"></div>',
                            promise = sogModal.openDialog(template, '查看所属合约', ["$scope", function ($modelScope) {
                                $modelScope.agreementData = [];
                                $modelScope.readOnly = true;
                                if (angular.isArray(contract.perSignContractAgreementScopeInfoList) && contract.perSignContractAgreementScopeInfoList.length > 0) {
                                    angular.forEach(contract.perSignContractAgreementScopeInfoList, function (perSignAgreement) {
                                        angular.forEach($scope.viewModel.contractAgreementScopeList, function (agreementScope) {
                                            if (perSignAgreement.contractAgreementCode === agreementScope.contractAgreementCode) {
                                                var lookContractAgreement = {
                                                    projectName: agreementScope.projectName,
                                                    stageAreaName: agreementScope.stageAreaName,
                                                    contractAgreementName: agreementScope.contractAgreementName,
                                                    costTargetAmount: agreementScope.contractAgreementScope,
                                                };
                                                $modelScope.agreementData.push(lookContractAgreement);
                                            }
                                        });
                                    });
                                }

                            }], $scope, { containerStyle: { width: '50%', marginRight: "auto", marginLeft: "auto" } },
                                function (v, defer) {//50%
                                    defer.resolve(v);//确定                
                                }, function (v, defer) {
                                    defer.resolve(v);//取消
                                });
                    },
                }

                //超管查看
                if ($scope.viewModel.isPermissionAdmin) {
                    $scope.isApproval = true;
                }

                //加载收集数据的名称
                $scope.collectData = function (e, defer) {
                    defer.resolve($scope.viewModel);
                };
            }
        );
    });