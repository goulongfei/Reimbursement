define(["app"], function (app) {
    app.controller('directCommissionedFrontController', function ($scope, $http, wfWaiting, sogModal, seagull2Url, $window) {
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

        $scope.submit = function () {
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
                    $scope.openUrl('非项目服务类', 'default.htm?processDescKey=ReimbursementV2_Entrust_NotProject&type=1#/directCommissionedNotProject/');
                    break;
                case '2':
                    sogModal.openAlertDialog('提示', "若您需要进行固定资产采购，请您在'固定资产管理'流程进行'固定资产申请'操作");
                    //$window.open('default.htm?processDescKey=ReimbursementV2_Entrust_AssetsPurchase&type=2#/directCommissionedAssetsPurchase/', '_blank');
                    break;
                case '4':
                    $window.open('default.htm?processDescKey=ReimbursementV2_Entrust_ProjectDefine&type=4#/directCommissionedProjectDefine/', '_blank');
                    break;
                case '5':
                    $window.open('default.htm?processDescKey=ReimbursementV2_Entrust_Implement&type=5#/directCommissionedImplementApplication/', '_blank');
                    break;
                case '6':
                    $window.open('default.htm?processDescKey=ReimbursementV2_Entrust_Engineering&type=6#/directCommissionedEngineeringApplication/', '_blank');
                    break;
                case '7':
                    $window.open('default.htm?processDescKey=ReimbursementV2_Entrust_Marketing&type=7#/directCommissionedMarketingDraft/', '_blank');
                    break;
                case '8':
                    $window.open('default.htm?processDescKey=ReimbursementV2_Entrust_LandDevelop&type=8&expenditureType=' + $scope.viewModel.expenditureTypeCode + '#/directCommissionedLandDevelop/', '_blank');
                    break;
                case '9':
                    $window.open('default.htm?processDescKey=ReimbursementV2_Entrust_Maintenance&type=9&expenditureType=' + $scope.viewModel.expenditureTypeCode + '#/directCommissionedMaintenanceApplication/', '_blank');
                    break;
                case '10':
                    $window.open('default.htm?processDescKey=ReimbursementV2_Entrust_BusinessOperations&type=10#/directCommissionedBusinessOperationsApplication/', '_blank');
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

    });
});

