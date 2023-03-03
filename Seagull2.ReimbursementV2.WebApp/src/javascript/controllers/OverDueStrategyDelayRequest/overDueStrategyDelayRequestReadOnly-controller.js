define(
    [
        'app',
        'directCommissionedSynthesizeExtend',
        'commonUtilExtend',
        'useCostCenterExtend'
    ],
    function (app) {
        app.controller('overDueStrategyDelayRequestReadOnly-controller', [
            '$window', '$scope', '$rootScope', '$http', 'wfOperate', 'viewData', 'wfWaiting', 'sogModal', 'sogWfControlOperationType', 'seagull2Url', 'ValidateHelper', 'sogValidator', 'sogOguType', 'sogWfQueryField', 'exception',
            function ($window, $scope, $rootScope, $http, wfOperate, viewData, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, sogWfQueryField, exception) {
                angular.extend($scope, viewData);
                $scope.mainTitle = '战采协议延期申请';
                $scope.title = "延期申请";
                viewData.wfOperateOpts.allowDoAbort = false;//作废 

                //页面权限加载--对接统一权限资源权限
                function CheckPermission() {
                    var command = {
                        permissionValue: "StrategyDelayRequest",
                        permissionName: "战采协议延期申请"
                    };
                    var url = seagull2Url.getPlatformUrl("/BiddingAbnormityClewInfo/GetUpmsPermissions");
                    wfWaiting.show();
                    $http.post(url, command)
                        .success(function (data) {
                            wfWaiting.hide();
                            if (data.success) {
                                if (!data.data) {
                                    exception.throwException(500, { message: "您没有战采协议延期申请相关权限，请联系管理员!" });
                                }
                            } else {
                                exception.throwException(500, { message: data.message });
                            }
                        });
                }
                CheckPermission();

                // 设置
                $scope.settings = {

                    // 拟变更信息
                    proposedChangeOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'application',
                        'isUpstreamReadOnly': $scope.viewModel.isUpstreamReadOnly
                    }
                };

                //加载收集数据的名称
                $scope.collectData = function (e, defer) {
                    defer.resolve($scope.viewModel);
                };

            }]);
    });