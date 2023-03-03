define([
    'app',
    'engineeringExtend'
], function (app) {
    app.controller('biddingFrontController', [
        '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate',
        '$timeout', 'wfWaiting', 'sogModal', 'seagull2Url', '$location', '$window',
        function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, $timeout, wfWaiting, sogModal, seagull2Url, $location, $window) {


            $scope.viewModel = {
                purchaseTypes: [
                    { code: '2', value: '固定资产采购类' },
                    { code: '5', value: '项目实施服务类' },
                    { code: '6', value: '工程采购类' },
                    { code: '7', value: '营销类' },
                    { code: '4', value: '项目定义服务类' },
                    { code: '8', value: '土地开发类' },
                    { code: '9', value: '第三方维保类' },
                    { code: '1', value: '非项目服务类' },
                    { code: '10', value: '非开发运营类' },
                ],
                expenditureTypes: [
                    { code: 1, value: '本项目支出' },
                    { code: 2, value: '跨项目支出' },
                    { code: 3, value: '平台在项目列支' },
                ],
                isNeedExpenditureTypes: false
            };

            $scope.$watch('viewModel.purchaseTypeCode', function () {
                if ($scope.viewModel.purchaseTypeCode === '8' || $scope.viewModel.purchaseTypeCode === '9') {
                    $scope.viewModel.isNeedExpenditureTypes = true;
                } else {
                    $scope.viewModel.isNeedExpenditureTypes = false;
                }
            }, true);

            // 设置 
            $scope.settings = {
                //项目
                projectOpts: {
                    readOnly: false,
                    projectName: "",
                    beforAppend: function (project) {
                        $scope.viewModel.project = project;
                    }
                },
            };
            $scope.submit = function () {
                if (!$scope.viewModel.purchaseTypeCode) {
                    sogModal.openAlertDialog('提示', "请选择业务类型");
                    return false;
                }
                switch ($scope.viewModel.purchaseTypeCode) {
                    case '1':
                        $scope.openUrl('非项目服务类', 'default.htm?processDescKey=ReimbursementV2_Bidding_NotProject&type=' + $scope.viewModel.purchaseTypeCode + '#/biddingNotProjectCompilingTender/');
                        break;
                    case '2':
                        $window.open('default.htm?processDescKey=ReimbursementV2_Bidding_AssetsPurchase&type=' + $scope.viewModel.purchaseTypeCode + '#/biddingAssetsPurchaseDraft/', '_blank');
                        break;
                    case '4':
                        $window.open('default.htm?processDescKey=ReimbursementV2_Bidding_ProjectDefine&type=' + $scope.viewModel.purchaseTypeCode + '#/biddingProjectDefineApplication/', '_blank');
                        break;
                    case '5':
                        $window.open('default.htm?processDescKey=ReimbursementV2_Bidding_Implement&type=' + $scope.viewModel.purchaseTypeCode + '#/biddingImplementApplication/', '_blank');
                        break;
                    case '6':
                        $window.open('default.htm?processDescKey=ReimbursementV2_Bidding_Engineering&type=' + $scope.viewModel.purchaseTypeCode + '#/biddingEngineeringApplication/', '_blank');
                        break;
                    case '7':
                        $window.open('default.htm?processDescKey=ReimbursementV2_Bidding_Marketing&type=' + $scope.viewModel.purchaseTypeCode + '#/biddingMarketingDraft/', '_blank');
                        break;
                    case '8':
                        $window.open('default.htm?processDescKey=ReimbursementV2_Bidding_LandDevelop&type=' + $scope.viewModel.purchaseTypeCode + '#/biddingLandDevelopDraft/', '_blank');
                        break;
                    case '9':
                        $window.open('default.htm?processDescKey=ReimbursementV2_Bidding_Maintenance&type=' + $scope.viewModel.purchaseTypeCode + '#/biddingMaintenanceApplication/', '_blank');
                        break;
                    case '10':
                        $window.open('default.htm?processDescKey=ReimbursementV2_Bidding_BusinessOperations&type=' + $scope.viewModel.purchaseTypeCode + '#/biddingBusinessOperationsApplication/', '_blank');
                        break;
                }
            };

            //流程中心使用版
            $scope.submitOaportal = function () {
                if (!$scope.viewModel.purchaseTypeCode) {
                    sogModal.openAlertDialog('提示', "请选择业务类型");
                    return false;
                }
                if (!$scope.viewModel.expenditureTypeCode && $scope.viewModel.isNeedExpenditureTypes) {
                    sogModal.openAlertDialog('提示', "请选择支出类型");
                    return false;
                }
                switch ($scope.viewModel.purchaseTypeCode) {
                    case '1':
                        $scope.openUrl('非项目服务类', 'default.htm?processDescKey=ReimbursementV2_Bidding_NotProject&type=' + $scope.viewModel.purchaseTypeCode + '#/biddingNotProjectCompilingTender/');
                        break;
                    case '2':
                        sogModal.openAlertDialog('提示', "如您需要采购固定资产，请您在'固定资产管理'流程进行'固定资产申请'操作！");
                        break;
                    case '4':
                        $window.open('default.htm?processDescKey=ReimbursementV2_Bidding_ProjectDefine&type=' + $scope.viewModel.purchaseTypeCode + '#/biddingProjectDefineApplication/', '_blank');
                        break;
                    case '5':
                        $window.open('default.htm?processDescKey=ReimbursementV2_Bidding_Implement&type=' + $scope.viewModel.purchaseTypeCode + '#/biddingImplementApplication/', '_blank');
                        break;
                    case '6':
                        $window.open('default.htm?processDescKey=ReimbursementV2_Bidding_Engineering&type=' + $scope.viewModel.purchaseTypeCode + '#/biddingEngineeringApplication/', '_blank');
                        break;
                    case '7':
                        $window.open('default.htm?processDescKey=ReimbursementV2_Bidding_Marketing&type=' + $scope.viewModel.purchaseTypeCode + '#/biddingMarketingDraft/', '_blank');
                        break;
                    case '8':
                        $window.open('default.htm?processDescKey=ReimbursementV2_Bidding_LandDevelop&type=' + $scope.viewModel.purchaseTypeCode + '&expenditureType=' + $scope.viewModel.expenditureTypeCode + '#/biddingLandDevelopDraft/', '_blank');
                        break;
                    case '9':
                        $window.open('default.htm?processDescKey=ReimbursementV2_Bidding_Maintenance&type=' + $scope.viewModel.purchaseTypeCode + '&expenditureType=' + $scope.viewModel.expenditureTypeCode + '#/biddingMaintenanceApplication/', '_blank');
                        break;
                    case '10':
                        $window.open('default.htm?processDescKey=ReimbursementV2_Bidding_BusinessOperations&type=' + $scope.viewModel.purchaseTypeCode + '#/biddingBusinessOperationsApplication/', '_blank');
                        break;
                }
            };

            $scope.cancel = function () {
                self.close();
            };

            // 打开拟单地址
            $scope.openUrl = function (name, url) {
                // 非项目服务类指引验证人员专业线 
                wfWaiting.show();
                $http.get(seagull2Url.getPlatformUrl("/Purchase/GetStationByCurrentUser?r=" + new Date().getTime()))
                    .success(function (data) {
                        wfWaiting.hide();
                        if (data && data.isBanNewStationCategorySystem === true) {
                            var stationName = data.fullPath;
                            if (!stationName) { stationName = ""; }
                            sogModal.openAlertDialog('提示', '[' + stationName + '] 专业线人员不能发起' + name + '采购流程，请核实费用类型，选择正确的采购类型发起');
                        }
                        else {
                            window.open(url, '_blank');
                        }
                    }).error(function (error, header) {
                        wfWaiting.hide();
                        sogModal.openAlertDialog("提示", error.message);
                    });
            };

        }]);
});

