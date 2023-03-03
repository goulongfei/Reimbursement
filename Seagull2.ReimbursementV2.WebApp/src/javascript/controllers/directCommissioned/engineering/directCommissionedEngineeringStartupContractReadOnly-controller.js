define(
    [
        'app',
        'corporationRadioSelector',
        'supplierCategory',
        'commonUtilExtend', 
        'directCommissionedSynthesizeExtend',
        'engineeringExtend',
        'supplierCategoryExtend',
        'negativeListExtend',
        'contractAgreementExtend',
    ],
    function (app) {
        app.controller('directCommissionedEngineeringStartupContractReadOnly_controller', [
            '$scope', 'viewData',  
            'wfWaiting', 'sogModal', '$stateParams',
            function ($scope, viewData,  
                wfWaiting, sogModal) {
                angular.extend($scope, viewData);
                //流程标题
                $scope.mainTitle = '直接委托';
                $scope.title = '直接委托（工程采购类）';
                //设置导航栏按钮状态
                $scope.wfOperateOpts.allowCirculate = true;//传阅 
                $scope.wfOperateOpts.allowPrint = false;//打印
                $scope.wfOperateOpts.allowRejection = false;//退回 
                $scope.wfOperateOpts.allowDoAbort = false;//作废
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底
             
                // 直接委托报告 附件设置项
                $scope.reportFileOpts = {
                    'auto': true,
                    'preview': false,
                    'fileNumLimit': 0
                };
                // 直接委托说明 附件设置项
                $scope.manualFileOpts = {
                    'auto': true,
                    'preview': false,
                    'fileNumLimit': 0
                };
                // 其他附件 附件设置项
                $scope.otherFileOpts = {
                    'auto': true,
                    'preview': false,
                    'fileNumLimit': 0
                }; 
                // 设置
                $scope.settings = {  
                    // 委托信息
                    delegationOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'startupContract',
                        'purchaseBase': $scope.viewModel.purchaseBase,
                        actionStateCode: $scope.viewModel.formAction.actionStateCode
                    },
                    //合约规划
                    contractAgreementOpts: {
                        model: 'readOnly',
                    },
                };

                $scope.api = {
                    showErrorMessage: function (error) {
                        wfWaiting.hide();
                        if (error) {
                            sogModal.openErrorDialog(error).then(function () {
                            });
                        }
                    },
                }

                // 基本信息 
                $scope.baseInfo = {
                    init: function () {
                        this.setOpinionOpts($scope.opinionOpts.options);
                        if (angular.isArray($scope.viewModel.purchaseDelegationInfoList)
                            && $scope.viewModel.purchaseDelegationInfoList.length > 0) {
                            $scope.viewModel.purchaseDelegationInfoList[0].priceFile = $scope.viewModel.priceFile;
                        }
                    },
                    setOpinionOpts: function (data) {
                        // 设置审批栏权限
                        angular.forEach(data, function (item) {
                            item.allowToBeAppended = false;
                            item.allowToBeDeleted = false;
                            item.allowToBeModified = false;
                        });
                    },
                };


                //加载收集数据的名称
                $scope.collectData = function (e, defer) {
                    defer.resolve($scope.viewModel);
                };

                $scope.baseInfo.init();
            }
        ]);
    });