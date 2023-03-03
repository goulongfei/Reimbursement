define(
    [
        'app',
        'directCommissionedSynthesizeExtend',
        'commonUtilExtend',
        'useCostCenterExtend'
    ],
    function (app) {
        app.controller('directCommissionedNotProjectApproval_controller', 
            function ($scope, $http, viewData, $rootScope, configure, $window, sogModal) {

                angular.extend($scope, viewData);
                $scope.mainTitle = '直接委托';
                $scope.title = "直接委托(非项目服务类)";

                viewData.wfOperateOpts.allowComment = true; //评论
                viewData.wfOperateOpts.allowCirculate = true;//传阅
                viewData.wfOperateOpts.allowDoAbort = false;//作废 
                viewData.wfOperateOpts.allowPrint = false;//打印
                viewData.wfOperateOpts.allowSave = true;//保存
                viewData.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底
                viewData.wfOperateOpts.allowAdminMoveTo = false;//超级发送
                if (viewData.wfOperateOpts.sendButtonName == "已阅") {
                    viewData.wfOperateOpts.allowRejection = false;//退回
                    viewData.wfOperateOpts.allowSave = false;//保存
                    viewData.wfOperateOpts.allowComment = true; //评论
                }
                if (viewData.sceneId == "DefaultCirculationScene") {
                    viewData.wfOperateOpts.allowDoWithdraw = false; //撤回
                }

                //基本信息
                $scope.settings = {
                    // 委托信息
                    delegationOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'application',
                        'isInvolveProject': $scope.viewModel.purchaseOfNotProject.isInvolveProject,
                        'reason': $scope.viewModel.purchaseOfNotProject.directDelegationReasonCode,
                        'purchaseBase': $scope.viewModel.purchaseBase,
                        'tinyAmount': 50000,
                        'project': {
                            projectCode: $scope.viewModel.purchaseOfNotProject.projectCode,
                            projectName: $scope.viewModel.purchaseOfNotProject.projectName
                        },
                        'blackList': ['delegationAmount', 'reason'],
                    },
                    setIsReject: function (data) {
                        try {
                            $scope.viewModel.isReject = false;
                            for (var i = 0; i < data.opinionOpts.options.length; i++) {
                                var item = data.opinionOpts.options[i];
                                if (item.nextStepCollection.length > 1
                                    && data.wfOperateOpts.transitionKey === item.nextStepCollection[1].transitionKey) {
                                    $scope.viewModel.isReject = true;
                                }
                            }
                        } catch (e) {
                        }
                    },
                    spreadInfoFn: function () {
                        if ($scope.settings.isSpreadInfo) {
                            $scope.settings.isSpreadInfo = false;
                            $scope.settings.spreadButtonName = "展开";
                        } else {
                            $scope.settings.isSpreadInfo = true;
                            $scope.settings.spreadButtonName = "收起";
                        }
                    },
                    isSpreadInfo: false,
                    spreadButtonName: "展开",
                    linkName : "拟单"
                };
                $scope.settings.setIsReject($scope); 

                //加载收集数据的名称
                $scope.collectData = function (e, defer) {
                    defer.resolve($scope.viewModel);
                };

                $rootScope.$on("$processRefreshed", function (event, data) {
                    $scope.settings.setIsReject(data);
                });
                // 供应商详情
                $scope.checkSupplierDetails = function (code) {
                    var config = {};
                    var baseRootUrl = configure.getConfig(config, 'common').apiUrlBase;
                    var url = "/THRWebApp/SupplierV2/default.htm#/supplierDetails?supplierCode=" + code;
                    $window.open(baseRootUrl + url);
                };
                //查看京东已选产品
                $scope.showJdproducts = function () {
                    var viewPath = 'htmlTemplate/dialogTemplate/common/SelectJdMallProducts.html';
                    var template = '<div ng-include="\'' + viewPath + '\'"></div>';
                    var opts = {
                        width: '55%',
                        footerHeight: 0
                    };
                    var promise = sogModal.openMaxDialog(template, '订单产品明细', ["$scope",
                        function ($modelScope) {
                            $modelScope.delegationInfo = angular.copy($scope.viewModel.purchaseDelegationInfoList[0]);
                        }], $scope, null, opts);
                    promise.then(function (v) {

                    }, function (v) {

                    });

                };
            });
    });