define([
    'app',
], function (app) {
    app.controller('purchaseSchemefileInfoProvidedReadOnly_controller',
        function ($scope, uploader, wfWaiting, sogModal, seagull2Url, viewData, $http, sogWfControlOperationType, sogOguType) {
            angular.extend($scope, viewData);
            $scope.mainTitle = '采购前置流程';
            $scope.title = '资料反馈';
            $scope.wfOperateOpts.allowComment = false; //评论
            $scope.wfOperateOpts.allowDoAbort = false;//作废 
            $scope.wfOperateOpts.allowPrint = false;//打印
            $scope.settings = {
                feedbackFileOpt: {
                    'auto': true,
                    'preview': false,
                    'fileNumLimit': 0
                },
                editSate: false
            }

            //查看退回记录信息
            $scope.lookingRebackRecord = function (item) {
                wfWaiting.show();
                $scope.rebackRecordList = [];
                var viewPath = './htmlTemplate/dialogTemplate/purchaseScheme/rebackRecordView.html';
                var template = '<div><div ng-include="\'' + viewPath + '\'"></div>';
                sogModal.openDialog(template, '退回记录', ['$scope', function ($childModelScope) {
                    $http.get(seagull2Url.getPlatformUrl("/PurchaseScheme/GetRebackRecordInfoList?resourceID=" + $scope.viewModel.resourceID + "&itemCode=" + item.aggregationToCode))
                        .success(function (returnResult) {
                            wfWaiting.hide();
                            if (returnResult.status == 200 && returnResult.returnData.length != 0) {
                                $scope.rebackRecordList = returnResult.returnData;
                            }
                        });
                }], $scope, { containerStyle: { width: '320px;' } }, function (v, defer) {
                    defer.resolve(v);
                }, function (v, defer) {
                    defer.resolve(v);//取消
                });
            }

            //加载收集数据的名称
            $scope.collectData = function (e, defer) {
                defer.resolve($scope.viewModel);
            };
        });
});

