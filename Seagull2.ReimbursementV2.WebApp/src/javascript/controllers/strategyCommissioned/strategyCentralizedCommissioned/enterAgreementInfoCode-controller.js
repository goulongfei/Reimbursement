define(
    [
        'app'
    ],
    function (app) {
        app.controller('enterAgreementInfoCode_controller', [
            '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate', 'viewData', '$timeout', 'wfWaiting', 'sogModal', 'sogWfControlOperationType',
           'seagull2Url', 'ValidateHelper', 'sogValidator', 'sogOguType', '$filter', 'configure', '$window',
            function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, viewData, $timeout, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, $filter, configure, $window) {

                angular.extend($scope, viewData);
                viewData.wfOperateOpts.allowPrint = false;
                viewData.wfOperateOpts.allowDoWithdraw = false;
                viewData.wfOperateOpts.allowRejection = false;
                viewData.wfOperateOpts.allowDoAbort = false;//作废
                $scope.mainTitle = '采购管理';
                //基本信息
                $scope.baseInfo = {
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

                //点击供应商详情
                $scope.checkSupplierDetails = function (code) {
                    var config = {};
                    var BaseRootUrl = configure.getConfig(config, 'common').apiUrlBase;
                    var url = "/THRWebApp/SupplierV2/default.htm#/supplierDetails?supplierCode=" + code;
                    $window.open(BaseRootUrl + url);
                }
            }]);
    });
