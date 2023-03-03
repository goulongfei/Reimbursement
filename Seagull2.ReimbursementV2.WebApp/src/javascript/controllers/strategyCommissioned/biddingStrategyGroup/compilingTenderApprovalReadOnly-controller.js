define(['app', 'commonUtilExtend', 'leftNavExtend', 'enterpriseShowExtend'], function (app) {
    app.controller('compilingTenderApprovalReadOnly_controller',
        function ($scope, viewData, sogWfControlOperationType, sogValidator, configure, $window) {
            angular.extend($scope, viewData);
            $scope.mainTitle = '采购管理';
            $scope.title = "招投标（集团战采）";
            $scope.isOpinionsShow = true;
            $scope.wfOperateOpts.allowRejection = false;//退回
            $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底                
            $scope.wfOperateOpts.allowPrint = false;//打印
            $scope.wfOperateOpts.allowDoAbort = false;//作废
            $scope.common = {};
            configure.getConfig($scope.common, 'common');

            //基本信息
            $scope.baseInfo = {
                //采购信息是否显示招标附件
                isShowbiddingReportFile: false,
                //采购信息是否编辑招标附件
                isEditbiddingReportFile: false,
                isShowUser: true,
                //左侧导航栏
                leftNavListOpts: {
                    offset: 59.5,
                    fixed: 0,
                    delay: 1000,
                    resourceId: $scope.resourceId,
                    scene: "Draft",
                    activityInfoList: $scope.viewModel.processActivityInfoList,
                },
                //采购时间安排
                purchaseDateArrangeInfoPEMus: function () {
                    var purchaseDateArrangeInfoPEMuList = [];
                    angular.forEach($scope.viewModel.p_PurchaseDateArrangeInfoPEMus, function (item) {
                        if (item.className == 5) {
                            purchaseDateArrangeInfoPEMuList.push(item);
                        }
                    });
                    return purchaseDateArrangeInfoPEMuList;
                }
            };

            //打开供应商详情页面
            $scope.OpenSupplier = function (code) {
                var url = $scope.common.webUrlBase + "/THRWebApp/SupplierV2/default.htm#/supplierDetails?supplierCode=" + code + "&random=" + Math.random();
                $window.open(url);
            }

            //收集数据
            $scope.collectData = function (e, defer) {
                sogValidator.clear();
                switch (e.operationType) {
                    case sogWfControlOperationType.MoveTo:
                        defer.resolve($scope.viewModel);
                        break;
                    case sogWfControlOperationType.Save:
                        defer.resolve($scope.viewModel);
                        break;
                    case sogWfControlOperationType.CancelProcess:
                        defer.resolve($scope.viewModel);
                        break;
                    case sogWfControlOperationType.Withdraw:
                        defer.resolve($scope.viewModel);
                        break;
                    default:
                        defer.resolve(null);
                        break;
                }
            };
        });
});


