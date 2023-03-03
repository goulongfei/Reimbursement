define(
    [
        'app',
        'directCommissionedSynthesizeExtend',
        'commonUtilExtend',
    ],
    function (app) {
        app.controller('directCommissionedNotProjectStartContractCirculation_controller', [
            '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate', 'viewData',
            '$timeout', 'wfWaiting', 'sogModal',
            'sogWfControlOperationType',
            'seagull2Url',
            'ValidateHelper', 'sogValidator',
            'sogOguType',
            '$filter',
            'errorDialog', 'configure', '$window',
            function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, viewData, $timeout, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, $filter, errorDialog, configure, $window) {

                angular.extend($scope, viewData);

                $scope.mainTitle = '直接委托';
                $scope.title = "直接委托(非项目服务类)";

                
                viewData.wfOperateOpts.allowCirculate = false;//传阅
                viewData.wfOperateOpts.allowRejection = false;//退回
                viewData.wfOperateOpts.allowDoAbort = false;//作废 
                viewData.wfOperateOpts.allowDoWithdraw = false;//撤回
                viewData.wfOperateOpts.allowPrint = false;//打印
                viewData.wfOperateOpts.allowSave = false;//保存
                viewData.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底

                if (viewData.wfOperateOpts.sendButtonName == "已阅") {
                    viewData.wfOperateOpts.allowRejection = false;//退回
                    viewData.wfOperateOpts.allowCirculate = false;//传阅
                    viewData.wfOperateOpts.allowSave = false;//保存
                    if (viewData.wfOperateOpts.allowMoveTo)
                        viewData.wfOperateOpts.allowComment = true; //评论
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
                };

                //加载收集数据的名称
                $scope.collectData = function (e, defer) {
                    defer.resolve($scope.viewModel);
                };
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

            }]);
    });