define(["app"], function (app) {
    app.controller('strategyCommissionedFontController', [
        '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate',
        '$timeout', 'wfWaiting', 'sogModal', 'seagull2Url', '$location', '$window', 'exception',
        function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, $timeout, wfWaiting, sogModal, seagull2Url, $location, $window, exception) {
            $scope.viewModel = {
                purchasePatterns: [
                    { code: '1', value: '直接委托(集团战略采购)' },
                    //{ code: '2', value: '直接委托(区域战略采购)' },
                    { code: '3', value: '直接委托(集中采购)' },
                    { code: '4', value: '招投标（集中采购）' },
                    { code: '5', value: '招投标（集团战采）' }
                ]
            };

            //页面权限加载--对接统一权限资源权限
            function CheckPermission() {
                var command = {
                    permissionValue: "strategyPurchaseFontOaportal",
                    permissionName: "战略采购"
                };
                var url = seagull2Url.getPlatformUrl("/BiddingAbnormityClewInfo/GetUpmsPermissions");
                wfWaiting.show();
                $http.post(url, command)
                    .success(function (data) {
                        wfWaiting.hide();
                        if (data.success)
                        {
                            if (!data.data)
                            {
                                exception.throwException(500,{message: "您没有战略采购相关权限，请联系管理员!"});
                            }
                        } else {
                            exception.throwException(500,{message: data.message});
                        }
                    });
            }
            CheckPermission();

            $scope.submit = function () {
                if (!$scope.viewModel.purchaseOperation) {
                    sogModal.openAlertDialog('提示', "请选择战采操作");
                    return false;
                }
                if (!$scope.viewModel.purchasePattern) {
                    sogModal.openAlertDialog('提示', "请选择采购方式");
                    return false;
                }
                switch ($scope.viewModel.purchasePattern) {
                    case '1':
                        location.href = "default.htm?processDescKey=ReimbursementV2_StrategyGroupCommissioned&PurchaseOperation=" + $scope.viewModel.purchaseOperation + "&PurchasePattern=" + $scope.viewModel.purchasePattern + "#/StrategyGroupCommissionedDraft/";
                        break;
                    case '2':
                        sogModal.openAlertDialog('提示', "开发中...");
                        break;
                    case '3':
                        location.href = "default.htm?processDescKey=ReimbursementV2_StrategyCentralizedCommissionedProject&PurchaseOperation=" + $scope.viewModel.purchaseOperation + "&PurchasePattern=" + $scope.viewModel.purchasePattern + "#/strategyCentralizedCommissioned/";
                        break;
                    case '4':
                        $window.open('default.htm?processDescKey=ReimbursementV2_Bidding_CentralizedPurchasing&purchaseOperation=' + $scope.viewModel.purchaseOperation + '&purchasePattern=' + $scope.viewModel.purchasePattern + '#/compilingTender/', '_blank');
                        break;
                    case '5':
                        $window.open('default.htm?processDescKey=ReimbursementV2_Bidding_StrategyGroup&purchaseOperation=' + $scope.viewModel.purchaseOperation + '&purchasePattern=' + $scope.viewModel.purchasePattern + '#/biddingStrategyGroupCompilingTender/', '_blank');
                        break;
                }

            };




            //战略采购前置页-流程中心使用版本
            $scope.viewModelOaportal = {
                purchaseOperation: 1,
                purchasePatterns: [
                    { code: '1', value: '招投标(集团战略采购)' },
                    /*{ code: '2', value: '招投标(区域战略采购)' },*/
                    { code: '3', value: '招投标(集中采购)' },
                    { code: '4', value: '直接委托(集团战略采购)' },
                    { code: '5', value: '直接委托(集中采购)' },
                ]
            };
            $scope.submitOaportal = function () {
                if ($scope.viewModelOaportal.purchaseOperation == 1) {
                    if (!$scope.viewModelOaportal.purchasePattern) {
                        sogModal.openAlertDialog('提示', "请选择采购方式");
                        return false;
                    }
                    switch ($scope.viewModelOaportal.purchasePattern) {
                        case '1':
                            $window.open('default.htm?processDescKey=ReimbursementV2_Bidding_StrategyGroup&purchaseOperation1=&purchasePattern=4#/biddingStrategyGroupCompilingTender/', '_blank');
                            break;
                        case '2':
                            //$window.open('/MCSWebApp/SinoOcean.Seagull2.Tender/Tender/StrategicBiddingGroupAndArea/FillInfoAndApprovalController.ashx?processDescKey=StrategicBiddingArea&businessTypeCode=6&purchasePatternCode=5', '_blank');
                            break;
                        case '3':
                            $window.open('default.htm?processDescKey=ReimbursementV2_Bidding_CentralizedPurchasing&purchaseOperation=2&purchasePattern=4#/compilingTender/', '_blank');
                            break;
                        case '4':
                            $window.open('default.htm?processDescKey=ReimbursementV2_StrategyGroupCommissioned&PurchaseOperation=2&PurchasePattern=1#/StrategyGroupCommissionedDraft/', '_blank');
                            break;
                        case '5':
                            $window.open('default.htm?processDescKey=ReimbursementV2_StrategyCentralizedCommissionedProject&PurchaseOperation=1&PurchasePattern=3#/strategyCentralizedCommissioned/', '_blank');
                            break;
                    }
                }
                else if ($scope.viewModelOaportal.purchaseOperation == 2) {
                    //$window.open('/MCSWebApp/SinoOcean.Seagull2.Tender/Tender/StrategicBiddingRenew/FillInformationController.ashx?processDescKey=StrategicBiddingRenew', '_blank');
                }
                else if ($scope.viewModelOaportal.purchaseOperation == 3) {
                    //$window.open('/MCSWebApp/SinoOcean.Seagull2.Tender/Tender/StrategyPurchaseChange/StrategyPurchaseChangeController.ashx?processDescKey=StrategyPurchaseChange&businessTypeCode=6&purchasePatternCode=4', '_blank');
                }
            };

            $scope.cancel = function () {
                self.close();
            };
        }]);
});

