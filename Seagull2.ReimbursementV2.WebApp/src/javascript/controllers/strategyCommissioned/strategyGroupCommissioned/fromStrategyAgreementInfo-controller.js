define(
    [
        'app'
    ],
    function (app) {
        app.controller('strategyGroupCommissionedFromStrategyAgreementInfo_controller', [
            '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate', 'viewData', '$timeout', 'wfWaiting', 'sogModal', 'sogWfControlOperationType',
           'seagull2Url', 'ValidateHelper', 'sogValidator', 'sogOguType', '$filter',
            function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, viewData, $timeout, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, $filter) {

                angular.extend($scope, viewData);
                $scope.mainTitle = '采购管理';
                //隐藏打印和传阅
                $scope.wfOperateOpts.allowPrint = false; //打印
                $scope.wfOperateOpts.allowRejection = false;//退回
                $scope.wfOperateOpts.allowDoAbort = false;//作废 
                $scope.wfOperateOpts.allowCirculate = false;//传阅

                //基本信息
                $scope.baseInfo = {
                    //附件设置项
                    fileopts: {
                        'resourceId': $scope.viewModel.resourceID,
                    },
                    //单选人员
                    selectRadioPeople: {
                        selectMask: sogOguType.User,
                        multiple: false
                    },
                    supplierTypeInit: function () {
                        $scope.viewModel.industryDomainName = "";
                        angular.forEach($scope.viewModel.p_IndustryDomainScopes, function (v) {
                            $scope.viewModel.industryDomainName += v.industryDomainName + ';';
                        });
                    }
                }

                //加载收集数据的名称
                $scope.collectData = function (e, defer) {
                    defer.resolve($scope.viewModel);
                };
            }]);
    });
