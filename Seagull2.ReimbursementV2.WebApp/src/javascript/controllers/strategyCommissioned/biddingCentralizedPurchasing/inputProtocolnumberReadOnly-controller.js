﻿define(['app', 'leftNavExtend'], function (app) {
    app.controller('inputProtocolnumberReadOnly_controller',
        function ($injector, $scope, $rootScope, $http, $state, wfOperate, seagull2Url, wfWaiting, sogModal, $location, viewData, sogWfControlOperationType, sogOguType, sogValidator, ValidateHelper) {
            angular.extend($scope, viewData);
            $scope.mainTitle = '采购管理';
            $scope.title = "招投标（集中采购）";
            
            $scope.wfOperateOpts.allowRejection = false;//退回
            $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
            $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
            $scope.wfOperateOpts.allowPrint = false;//打印
            //基本信息
            $scope.baseInfo = {
                //采购信息是否显示招标附件
                isShowbiddingReportFile: true,
                //采购信息是否编辑招标附件
                isEditbiddingReportFile: false,
                isShowUser: true,
                //左侧导航栏
                leftNavListOpts: {
                    offset: 59.5,
                    fixed: 0,
                    delay: 1000,
                    resourceId: $scope.resourceId,
                    scene: "InputProtocolnumber",
                    activityInfoList: $scope.viewModel.processActivityInfoList,
                },
            };
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
                    default:
                        defer.resolve(null);
                        break;
                }
            };
        });
});

