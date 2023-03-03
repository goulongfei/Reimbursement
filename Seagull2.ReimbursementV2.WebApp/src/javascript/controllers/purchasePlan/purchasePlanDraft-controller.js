define([
    'app',
    'tiger-balm',
    'purchasePlanExtend',
    'purchasePlanFileInfoExtend',
     'echartsUitl',
], function (app) {
    app.controller('purchasePlanDraft_controller',
        function ($scope, sogModal, viewData, sogWfControlOperationType, sogValidator, ValidateHelper, linq) {
            angular.extend($scope, viewData);
            $scope.mainTitle = '采购管理';
            $scope.title = "采购计划";
            $scope.readonly = false;
            $scope.isOpinionsShow = false;
            $scope.isApprovalShow = false;
            angular.forEach($scope.opinions, function (v, i) {

                //评价意见是否显示
                if (v.commentIsDelete)
                    $scope.isOpinionsShow = true;
                //审批意见是否显示
                if (v.nextStepSnapshot.length > 0 && !v.commentIsDelete)
                    $scope.isApprovalShow = true;
            });
            
            //初审图表数据初始化
            $scope.projectPurchaseScheduleOpt ={
                   title : "项目采购进度",
                   color : ["#70AD47", "#FFC000", "#ED7D31"]
            };
            $scope.planCompleteTimeOpt ={
                   title : "计划完成情况",
                   color : ["#70AD47", "#FFC000", "#ED7D31"]
            };
             $scope.purchaseWaySortingOpt ={
                   title : "采购方式分布",
                   color : $scope.viewModel.purchaseWaySortingColor
            }; 
            //采购方式分布详情
            $scope.purchaseWaySortingDetailShow = function(){
                 var viewPath = 'htmlTemplate/controlTemplate/purchasePlan/purchaseWaySortingDetails.html';
                    var template = '<div ng-include="\'' + viewPath + '\'"></div>',
                        promise = sogModal.openDialog(template, '采购方式分布', ["$scope", function ($modelScope) {
                            $modelScope.model = $scope.viewModel.purchaseWaySortingList;
                        }], $scope, { containerStyle: {  } },
                        function (v, defer) {//50%
                            defer.resolve(v);//确定
                        }, function (v, defer) {
                            defer.resolve(v);//取消
                        });
            }      

            $scope.organizationChange = function(){
                angular.forEach($scope.viewModel.option.organizations, function (v) {
                        if ($scope.viewModel.purchasePlanCase.constructCenterCode == v.code) {
                            $scope.viewModel.purchasePlanCase.constructCenterCode = v.code;
                            $scope.viewModel.purchasePlanCase.constructCenterName = v.name;
                        }
                    });
            } 
            
            $scope.viewModel.isFullscreen = false;
            //如果是观光状态则不需要作废按钮
            if ($scope.viewModel.formAction.actionStateCode === 0) {
                $scope.wfOperateOpts.allowDoAbort = false;//作废      
            }
            $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
            $scope.wfOperateOpts.allowPrint = false;//打印
            $scope.baseInfo = {
                selectCommodityPaging: {
                    currentPage: 1,
                    itemsPerPage: 100,
                    totalItems: $scope.viewModel.purchasePlanCaseDetailInfos.length
                },
            };
            $scope.setplanVersion = function (item) {
                $scope.viewModel.purchasePlanCase.planVersion = item;
            }
            //数据有效性的检验
            var RequiredValidator = ValidateHelper.getValidator("Required");
            var validData = function (isMoveTo) {
                var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                    {
                        key: '', attributeName: '', validator: new RequiredValidator('')
                    }
                ]);
                var pageSize = $scope.baseInfo.selectCommodityPaging.itemsPerPage;
                angular.forEach($scope.viewModel.purchasePlanCaseDetailInfos, function (item, i) {
                    var page = parseInt(i / pageSize) + 1;
                    var row = i - (page - 1) * pageSize + 1;
                    if (isMoveTo) {
                        if (!item.purchaseName) {
                            modelStateDictionary.addModelError("采购计划", "全部采购计划第" + page + "页第" + row + "行采购名称不能为空");
                        } else if (item.purchaseName.length > 30) {
                            modelStateDictionary.addModelError("采购计划", "全部采购计划第" + page + "页第" + row + "行采购名称不能超过30个字");
                        }
                        var contractAgreements = linq.from($scope.viewModel.contractAgreementScopes).where(
                            function (where) {
                                return where.aggregationToCode === item.code;
                            }).toArray();
                        if (contractAgreements.length === 0) {
                            modelStateDictionary.addModelError("采购计划", "全部采购计划第" + page + "页第" + row + "行合约规划不能为空");
                        }
                        if (item.preStartDate !== null && item.preStartDate !== "null" && item.preStartDate !== "" && item.preStartDate !== undefined && item.preStartDate !== "undefined" && item.preStartDate !== "1901-01-01T00:00:00+08:00" && item.preStartDate !== "0001-01-01T00:00:00" &&
                            item.preSupplierPutInDate !== null && item.preSupplierPutInDate !== "null" && item.preSupplierPutInDate !== "" && item.preSupplierPutInDate !== undefined && item.preSupplierPutInDate !== "undefined" && item.preSupplierPutInDate !== "1901-01-01T00:00:00+08:00" && item.preSupplierPutInDate !== "0001-01-01T00:00:00" &&
                            new Date(item.preStartDate) < new Date(item.preSupplierPutInDate)) {
                            modelStateDictionary.addModelError("采购计划", "全部采购计划第" + page + "页第" + row + "行计划采购开始日期不能小于供应商入库开始日期");
                        }
                        if (item.preEndDate !== null && item.preEndDate !== "null" && item.preEndDate !== "" && item.preEndDate !== undefined && item.preEndDate !== "undefined" && item.preEndDate !== "1901-01-01T00:00:00+08:00" && item.preEndDate !== "0001-01-01T00:00:00" &&
                            item.preStartDate !== null && item.preStartDate !== "null" && item.preStartDate !== "" && item.preStartDate !== undefined && item.preStartDate !== "undefined" && item.preStartDate !== "1901-01-01T00:00:00+08:00" && item.preStartDate !== "0001-01-01T00:00:00" &&
                            new Date(item.preEndDate) < new Date(item.preStartDate)) {
                            modelStateDictionary.addModelError("采购计划", "全部采购计划第" + page + "页第" + row + "行计划采购完成日期不能小于计划采购开始日期");
                        }
                        if (item.preContractSignDate !== null && item.preContractSignDate !== "null" && item.preContractSignDate !== "" && item.preContractSignDate !== undefined && item.preContractSignDate !== "undefined" && item.preContractSignDate !== "1901-01-01T00:00:00+08:00" && item.preContractSignDate !== "0001-01-01T00:00:00" &&
                            item.preEndDate !== null && item.preEndDate !== "null" && item.preEndDate !== "" && item.preEndDate !== undefined && item.preEndDate !== "undefined" && item.preEndDate !== "1901-01-01T00:00:00+08:00" && item.preEndDate !== "0001-01-01T00:00:00" &&
                            new Date(item.preContractSignDate) < new Date(item.preEndDate)) {
                            modelStateDictionary.addModelError("采购计划", "全部采购计划第" + page + "页第" + row + "行合同订立日期不能小于计划采购完成日期");
                        }
                        if (item.preEnterSupplyDate !== null && item.preEnterSupplyDate !== "null" && item.preEnterSupplyDate !== "" && item.preEnterSupplyDate !== undefined && item.preEnterSupplyDate !== "undefined" && item.preEnterSupplyDate !== "1901-01-01T00:00:00+08:00" && item.preEnterSupplyDate !== "0001-01-01T00:00:00" &&
                            item.preContractSignDate !== null && item.preContractSignDate !== "null" && item.preContractSignDate !== "" && item.preContractSignDate !== undefined && item.preContractSignDate !== "undefined" && item.preContractSignDate !== "1901-01-01T00:00:00+08:00" && item.preContractSignDate !== "0001-01-01T00:00:00" &&
                            new Date(item.preEnterSupplyDate) < new Date(item.preContractSignDate)) {
                            modelStateDictionary.addModelError("采购计划", "全部采购计划第" + page + "页第" + row + "行计划进场/供货日期不能小于合同订立日期");
                        }
                    } else {
                        if (item.purchaseName && item.purchaseName.length > 30) {
                            modelStateDictionary.addModelError("采购计划", "全部采购计划第" + page + "页第" + row + "行采购名称不能超过30个字");
                        }
                    }
                });
                return modelStateDictionary;
            };
            //收集数据
            $scope.collectData = function (e, defer) {
                sogValidator.clear();
                switch (e.operationType) {
                    case sogWfControlOperationType.MoveTo:
                        var result = validData(true);
                        if (!result.isValid()) {
                            sogModal.openDialogForModelStateDictionary('信息校验失败', result);
                            sogValidator.broadcastResult(result.get());
                            defer.reject($scope.viewModel);
                        } else {
                            defer.resolve($scope.viewModel);
                        }
                        break;
                    case sogWfControlOperationType.Save:
                        var saveResult = validData(false);
                        if (!saveResult.isValid()) {
                            sogModal.openDialogForModelStateDictionary('信息校验失败', saveResult);
                            sogValidator.broadcastResult(saveResult.get());
                            defer.reject($scope.viewModel);
                        } else {
                            defer.resolve($scope.viewModel);
                        }
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


