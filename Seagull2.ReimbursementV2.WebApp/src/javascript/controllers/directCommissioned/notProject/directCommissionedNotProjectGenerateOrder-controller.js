define(
    [
        'app',
        'directCommissionedSynthesizeExtend',
        'commonUtilExtend',
    ],
    function (app) {
        app.controller('directCommissionedNotProjectGenerateOrder_controller', [
            '$scope', '$http', 'viewData', 'wfWaiting', 'sogModal', 'seagull2Url', 'errorDialog', 'configure', '$window',
            function ($scope, $http, viewData, wfWaiting, sogModal, seagull2Url, errorDialog, configure, $window) {

                angular.extend($scope, viewData);
                $scope.mainTitle = '直接委托';
                $scope.title = "直接委托(非项目服务类)";

                viewData.wfOperateOpts.allowComment = true; //评论
                viewData.wfOperateOpts.allowCirculate = true;//传阅
                viewData.wfOperateOpts.allowDoAbort = false;//作废 
                viewData.wfOperateOpts.allowDoWithdraw = false;//撤回
                viewData.wfOperateOpts.allowPrint = false;//打印
                viewData.wfOperateOpts.allowSave = true;//保存
                viewData.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底

                if (viewData.wfOperateOpts.sendButtonName == "已阅") {
                    viewData.wfOperateOpts.allowRejection = false;//退回
                    viewData.wfOperateOpts.allowCirculate = false;//传阅
                    viewData.wfOperateOpts.allowSave = false;//保存
                    viewData.wfOperateOpts.allowComment = true; //评论
                }

                //基本信息
                $scope.settings = {
                    // 委托信息
                    delegationOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'startupContractEdit',
                        'isInvolveProject': $scope.viewModel.purchaseOfNotProject.isInvolveProject,
                        'reason': $scope.viewModel.purchaseOfNotProject.directDelegationReasonCode,
                        'purchaseBase': $scope.viewModel.purchaseBase,
                        'tinyAmount': 50000,
                        'project': {
                            projectCode: $scope.viewModel.purchaseOfNotProject.projectCode,
                            projectName: $scope.viewModel.purchaseOfNotProject.projectName
                        },
                        'blackList': ['delegationAmount', 'reason']
                    }
                };

                //加载收集数据的名称
                $scope.collectData = function (e, defer) {
                    defer.resolve($scope.viewModel);
                };

                var createHidden = function (name, value, form) {
                    var hidden = document.createElement('input');
                    hidden.type = 'hidden';
                    hidden.name = name;
                    hidden.value = value;
                    form.appendChild(hidden);
                };

                //京东登录跳转
                $scope.jdLogin = function () {

                    var loginInfo = {
                        returnUrl: "",
                        prNo: ""
                    };
                    wfWaiting.show();
                    $http.post(seagull2Url.getPlatformUrl("/JdMallUser/JdLogin"), loginInfo)
                        .success(function (data) {
                            wfWaiting.hide();
                            if (data.success) {
                                var loginInfo = data.data;
                                console.log(loginInfo);
                                var form1 = document.createElement('form');
                                form1.id = "formId";
                                form1.name = "formId";
                                document.body.appendChild(form1);

                                createHidden("pin", loginInfo.pin, form1);
                                createHidden("appId", loginInfo.appId, form1);
                                createHidden("strustNo", loginInfo.strustNo, form1);
                                createHidden("sign", loginInfo.sign, form1);
                                createHidden("uniqueNo", loginInfo.uniqueNo, form1);

                                //createHidden("hookUrl", loginInfo.hookUrl, form1);
                                //createHidden("PR", loginInfo.pr, form1); 
                                //createHidden("returnUrl", loginInfo.returnUrl, form1);

                                form1.method = 'post';
                                form1.action = loginInfo.jdVspUrl;
                                form1.targer = '_blank';
                                console.log(form1);
                                form1.submit();
                                document.body.removeChild(form1);
                            } else {
                                var promise = sogModal.openConfirmDialog("提示", data.message);
                                promise.then(function () {
                                    $window.location.reload();
                                }, function () {
                                    $window.location.reload();
                                });
                            }
                        })
                        .error(function (data, status) {
                            sogModal.openErrorDialog(data, status, "登录京东失败");
                            wfWaiting.hide();
                        });
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