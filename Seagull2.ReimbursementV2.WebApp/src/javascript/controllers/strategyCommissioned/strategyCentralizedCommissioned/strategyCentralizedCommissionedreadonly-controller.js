define(
    [
        'app'
    ],
    function (app) {

        app.controller('strategyCentralizedCommissionedreadonly_controller', [
            '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate', 'viewData',
            '$timeout', 'wfWaiting', 'sogModal',
            'sogWfControlOperationType',
            'seagull2Url',
            'ValidateHelper', 'sogValidator',
            'sogOguType',
            '$filter','configure','$window',
        function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, viewData, $timeout, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, $filter, configure, $window ) {
                angular.extend($scope, viewData);
                viewData.wfOperateOpts.allowCirculate = false;//传阅
                viewData.wfOperateOpts.allowDoAbort = false;//作废 
                viewData.wfOperateOpts.allowDoWithdraw = false;//撤回
                viewData.wfOperateOpts.allowPrint = false;//打印
                viewData.wfOperateOpts.allowRejection = false;//退回
                if ($scope.viewModel.isCirculationProcess) {
                    viewData.wfOperateOpts.allowSave = false;
                }
                $scope.mainTitle = '采购管理';
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
                    //多选人员
                    selectCheckBoxPeople: {
                        selectMask: sogOguType.User,
                        multiple: true
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
                    return defer.resolve($scope.viewModel);
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