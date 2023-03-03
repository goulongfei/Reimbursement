define(
    [
        'app',
        'commonUtilExtend',
        'biddingSynthesizeExtend',
        'engineeringExtend',
        'dateTimePickerExtend'
    ],
    function (app) {
        app.controller('biddingMarketingModifyTime_controller', [
            '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate', 'viewData', '$timeout', 'wfWaiting', 'sogModal',
             'sogWfControlOperationType', 'seagull2Url', 'ValidateHelper', 'sogValidator', 'sogOguType', '$filter', 'errorDialog', 'configure', '$window',
            function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, viewData, $timeout, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, $filter, errorDialog, configure, $window) {
                angular.extend($scope, viewData);
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                $scope.mainTitle = '采购管理';
                $scope.title = "招投标(营销类)";
                $scope.isOpinionsShow = $scope.opinions.length > 0 ? true : false;

                $scope.wfOperateOpts.allowAdminMoveTo = false;//超级发送  
                $scope.wfOperateOpts.allowCirculate = false;//传阅
                $scope.wfOperateOpts.allowRejection = false;//退回
                $scope.wfOperateOpts.allowDoAbort = false;//作废 
                $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
                $scope.wfOperateOpts.allowPrint = false;//打印      
                $scope.wfOperateOpts.allowComment = true; //评论
                if ($scope.wfOperateOpts.sendButtonName == "已阅") {
                    $scope.wfOperateOpts.allowSave = false;//保存
                }

                $scope.$broadcast('viewModel', { data: $scope.viewModel });

                //基本信息
                $scope.baseInfo = {
                    //附件设置项
                    fileopts: {
                        'resourceId': $scope.viewModel.resourceID,
                    },
                    //单选人员
                    peopleSelect: {
                        selectMask: sogOguType.User,
                        multiple: false
                    },
                    //多选人员
                    selectCheckBoxPeople: {
                        selectMask: sogOguType.User,
                        multiple: true
                    },
                    // 金额控件
                    moneyOpts: {
                        min: 1,
                        max: 999999999,
                        precision: 2
                    },
                    //招标比例
                    optsScale: {
                        min: 1,
                        max: 100,
                        precision: 2
                    },
                    // 采购时间安排信息
                    purchaseDateArrangeOpts: {
                        'scene': 'ModifyTime',
                    },
                    isShowUpstreamProcessMarketing: false
                };

                //过滤时间显示格式
                for (var i = 0; i < $scope.viewModel.purchaseDateArrangeInfoList.length; i++) {
                    $scope.viewModel.purchaseDateArrangeInfoList[i].replyDeadline = $scope.viewModel.purchaseDateArrangeInfoList[i].replyDeadline == "0001-01-01T00:00:00" ? "" : $scope.viewModel.purchaseDateArrangeInfoList[i].replyDeadline;
                    $scope.viewModel.purchaseDateArrangeInfoList[i].evaluateBiddingDeadline = $scope.viewModel.purchaseDateArrangeInfoList[i].evaluateBiddingDeadline == "0001-01-01T00:00:00" ? "" : $scope.viewModel.purchaseDateArrangeInfoList[i].evaluateBiddingDeadline;
                    $scope.viewModel.purchaseDateArrangeInfoList[i].decideBiddingDeadline = $scope.viewModel.purchaseDateArrangeInfoList[i].decideBiddingDeadline == "0001-01-01T00:00:00" ? "" : $scope.viewModel.purchaseDateArrangeInfoList[i].decideBiddingDeadline;
                }

                //查看开标页面
                $scope.lookbiddingMarketingInfo = function () {
                    var urlat = null;
                    $http.get(seagull2Url.getPlatformUrl("/PublicApi/TicketStr?r=" + new Date().getTime()))
                        .success(function (data) {
                            urlat = data;
                            if (urlat !== null) {
                                urlat = urlat.replace(/"/g, "");
                                var url = "";

                                url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/biddingMarketingStart/?resourceID=" + $scope.viewModel.p_PurchaseDataArrangeAdjustRecord.purchaseResourceID;

                                if (url.indexOf("?") == -1) {
                                    url = url + "?_at=" + urlat;
                                } else {
                                    url = url + "&_at=" + urlat;
                                }
                                $window.open(url, '_blank');
                            }

                        })
                        .error(function (data, status) {
                            errorDialog.openErrorDialog(data, status, "查看采购进度详情异常");
                            wfWaiting.hide();
                        });
                }

                //数据有效性的检验
                var RequiredValidator = ValidateHelper.getValidator("Required");

                var checkData = function () {
                    sogValidator.clear();
                    var error = ValidateHelper.validateData($scope.viewModel, [
                        {
                            Key: '', attributeName: '', validator: new RequiredValidator('')
                        }]);


                    if ($scope.viewModel.purchaseDateArrangeInfoList.length) {
                        angular.forEach($scope.viewModel.purchaseDateArrangeInfoList, function (v, i) {
                            if (v.classActiveName == '最新时间安排') {
                                var key = '第' + (i + 1) + '行采购时间安排';
                                if (v.replyDeadline == null || v.replyDeadline == "0001-01-01T00:00:00" || v.replyDeadline == "") {
                                    error.addModelError("回标截止时间", key + "回标截止时间不能为空");
                                }
                                if (v.evaluateBiddingDeadline == null || v.evaluateBiddingDeadline == "0001-01-01T00:00:00" || v.evaluateBiddingDeadline == "") {
                                    error.addModelError("评标时间", key + "评标时间不能为空");
                                }
                                if (v.decideBiddingDeadline == null || v.decideBiddingDeadline == "0001-01-01T00:00:00" || v.decideBiddingDeadline == "") {
                                    error.addModelError("定标时间", key + "定标时间不能为空");
                                }
                            }
                        });
                    }

                    if (!error.isValid()) {
                        sogModal.openDialogForModelStateDictionary('信息校验失败', error)
                        sogValidator.broadcastResult(error.get());
                        return false;
                    }
                    return true;
                }

                //加载收集数据的名称
                $scope.collectData = function (e, defer) {

                    if (e.operationType === sogWfControlOperationType.MoveTo) {
                        if (checkData(e)) {
                            return defer.resolve($scope.viewModel);
                        } else {
                            return defer.reject($scope.viewModel);
                        }
                    } else if (e.operationType === sogWfControlOperationType.Save) {
                        if ($scope.viewModel.purchaseDateArrangeInfoList.length) {
                            angular.forEach($scope.viewModel.purchaseDateArrangeInfoList, function (v, i) {
                                if (v.replyDeadline == null || v.replyDeadline == "") {
                                    v.replyDeadline = "0001-01-01T00:00:00";
                                }
                                if (v.evaluateBiddingDeadline == null || v.evaluateBiddingDeadline == "") {
                                    v.evaluateBiddingDeadline = "0001-01-01T00:00:00";
                                }
                                if (v.decideBiddingDeadline == null || v.decideBiddingDeadline == "") {
                                    v.decideBiddingDeadline = "0001-01-01T00:00:00";
                                }
                            });
                        }
                    }
                    return defer.resolve($scope.viewModel);
                }
            }]);
    });