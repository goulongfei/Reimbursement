define(
    [
        'app',
        'biddingSynthesizeExtend',
        'engineeringExtend',
        'dateTimePickerExtend',
        'commonUtilExtend',
        'leftNavExtend',
    ],
    function (app) {
        app.controller('biddingMarketingSummer_controller', [
            '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate', 'viewData', '$timeout', 'wfWaiting', 'sogModal',
            'sogWfControlOperationType', 'seagull2Url', 'ValidateHelper', 'sogValidator', 'sogOguType', '$filter', 'errorDialog', 'configure', '$window',
            function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, viewData, $timeout, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, $filter, errorDialog, configure, $window) {
                angular.extend($scope, viewData);
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                $scope.mainTitle = '采购管理';
                $scope.title = "招投标(营销类)";
                $scope.isOpinionsShow = $scope.opinions.length > 0 ? true : false;

                $scope.wfOperateOpts.allowCirculate = true;//传阅
                $scope.wfOperateOpts.allowRejection = false;//退回
                $scope.wfOperateOpts.allowDoAbort = false;//作废 
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
                $scope.wfOperateOpts.allowPrint = false;//打印      
                if ($scope.wfOperateOpts.sendButtonName == "已阅") {
                    $scope.wfOperateOpts.allowSave = false;//保存
                }

                $scope.$broadcast('viewModel', { data: $scope.viewModel });

                var replyCount = 0;
                angular.forEach($scope.viewModel.grantDiscountEnquiryInfoList, function (v) {
                    if (v.replyStateCode == "2") {
                        replyCount = replyCount + 1;
                    }
                });

                if (viewData.sceneId == "SummerReadOnly" && replyCount == 0) {
                    $scope.wfOperateOpts.allowDoWithdraw = true;//撤回
                }
                else {
                    $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
                }

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
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 1000,
                        resourceId: $scope.resourceId,
                        scene: "EvaluateSummary",
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                    },
                    init: function () {
                        $scope.baseInfo.setIsGrantDiscountEnquiry();
                    },
                    // 设置是否发放让利询价
                    setIsGrantDiscountEnquiry: function (val) {
                        if (val !== undefined) {
                            $scope.viewModel.purchaseOfMarketing.isGrantDiscountEnquiry = val;
                        }

                        if ($scope.viewModel.purchaseOfMarketing.isGrantDiscountEnquiry === true) {
                            $scope.wfOperateOpts.transitionKey = $scope.viewModel.toProfitSharingTransitionKey;
                        }
                        else {
                            $scope.wfOperateOpts.transitionKey = $scope.viewModel.toAwardTransitionKey;
                        }
                        $rootScope.$broadcast('$processRefreshed', $scope);
                        if ($scope.sceneId==="Summer") {
                            var dataModel = { ResourceID: $scope.viewModel.resourceID, IsGrantDiscountEnquiry: !!$scope.viewModel.purchaseOfMarketing.isGrantDiscountEnquiry };
                            wfOperate.refreshProcess('/BiddingMarketingSummerWf', viewData.currentActivityId, undefined, dataModel, true).success(function (data) { });
                        }
                    },
                    isShowUpstreamProcessMarketing: false
                };

                //过滤时间显示格式
                $scope.viewModel.purchaseOfMarketing.discountDeadline = $scope.viewModel.purchaseOfMarketing.discountDeadline == "0001-01-01T00:00:00" ? "" : $scope.viewModel.purchaseOfMarketing.discountDeadline;

                //如果有上流流程信息，则显示出
                if ($scope.viewModel.purchaseOfMarketing.upstreamProcessResourceID != null && $scope.viewModel.purchaseOfMarketing.upstreamProcessResourceID != "") {
                    $scope.baseInfo.isShowUpstreamProcessMarketing = true;
                }


                //打开供应商详情页面
                $scope.OpenSupplier = function (code) {
                    var url = $scope.common.webUrlBase + "/THRWebApp/SupplierV2/default.htm#/supplierDetails?supplierCode=" + code + "&random=" + Math.random();
                    $window.open(url);
                }

                //是否显示IP/Mac
                $scope.isMac = false;
                var replyIpMacs = [];
                $scope.supplierRemark = "";
                angular.forEach($scope.viewModel.supplierReplyBiddingInfoForSubmitList, function (v) {
                    if (v.replyIP != "")
                        replyIpMacs.push(v.replyIP + v.replyMAC);
                });

                //去重
                $scope.uniq = function (array) {
                    var temp = []; //一个新的临时数组
                    var tempMore = [];//返回重复的数
                    for (var i = 0; i < array.length; i++) {
                        if (temp.indexOf(array[i]) == -1) {
                            temp.push(array[i]);
                        }
                        else {
                            if (tempMore.indexOf(array[i]) == -1) {
                                tempMore.push(array[i]);
                            }
                        }
                    }
                    return tempMore;
                }

                if ($scope.uniq(replyIpMacs).length > 0) {
                    var temp = $scope.uniq(replyIpMacs);
                    $scope.isMac = true;
                    angular.forEach($scope.viewModel.supplierReplyBiddingInfoForSubmitList, function (v) {
                        for (var i = 0; i < temp.length; i++) {
                            if (temp[i] == v.replyIP + v.replyMAC) {
                                $scope.supplierRemark += v.supplierName + "、";
                            }
                        }
                    });
                    $scope.supplierRemark = $scope.supplierRemark.substring(0, $scope.supplierRemark.length - 1);
                }

                //数据有效性的检验
                var RequiredValidator = ValidateHelper.getValidator("Required");

                var checkData = function () {
                    sogValidator.clear();
                    var error = ValidateHelper.validateData($scope.viewModel, [
                        {
                            Key: '', attributeName: '', validator: new RequiredValidator('')
                        }]);


                    if ($scope.viewModel.purchaseOfMarketing.isGrantDiscountEnquiry == null) {
                        error.addModelError("是否发放让利询价", "请选择是否发放让利询价");
                    }

                    //供应商信息验证--发放让利询价
                    if ($scope.viewModel.purchaseOfMarketing.isGrantDiscountEnquiry == true) {
                        if ($scope.viewModel.purchaseOfMarketing.discountDeadline == null || $scope.viewModel.purchaseOfMarketing.discountDeadline == "" || $scope.viewModel.purchaseOfMarketing.discountDeadline == "0001-01-01T00:00:00")
                            error.addModelError("回复截止时间", "回复截止时间不能为空");
                        else {
                            if (new Date($scope.viewModel.purchaseOfMarketing.discountDeadline.replace('T', ' ')) <= new Date()) {
                                error.addModelError("回标截止时间", "回复截止时间不能小于等于当前时间");
                            }
                        }

                        //联系人电话
                        var regPhoneNumber = /^(((\+\d{2}-)?0\d{2,3}-\d{7,8})|((\+\d{2}-)?(\d{2,3}-)?(1[3-9]\d{9})))$/;

                        if ($scope.viewModel.grantDiscountEnquiryInfoList.length) {
                            var isEmpty = true;
                            angular.forEach($scope.viewModel.grantDiscountEnquiryInfoList,
                                function (v, i) {
                                    var key = '第' + (i + 1) + '行供应商';

                                    if (v.businessGrantDiscountEnquiryFileList != null && v.businessGrantDiscountEnquiryFileList.length > 0) {
                                        var fileCount = 0;
                                        angular.forEach(v.businessGrantDiscountEnquiryFileList,
                                            function (v, i) {
                                                if (v.isDeleted) {
                                                    fileCount++;
                                                }
                                            });
                                        if (fileCount != v.businessGrantDiscountEnquiryFileList.length) {
                                            isEmpty = false;
                                            if (!v.linkPhone) {
                                                error.addModelError("联系人电话", key + "联系人电话不能为空");
                                            }
                                            if (v.linkPhone && regPhoneNumber.test(v.linkPhone) === false) {
                                                error.addModelError('联系人电话', key + '联系人电话格式不正确');
                                            }
                                        }
                                    }
                                    else {
                                        if (v.linkPhone) {
                                            error.addModelError("联系人电话", key + "请上传让利询价文件");
                                        }
                                        if (v.linkPhone && regPhoneNumber.test(v.linkPhone) === false) {
                                            error.addModelError('联系人电话', key + '联系人电话格式不正确且填写了电话务必请上传询价文件');
                                        }
                                    }
                                });

                            if (isEmpty)
                                error.addModelError("发放让利询价", "若选择了需要发放让利，至少要添加一条让利信息。");
                        }
                    }

                    if (!error.isValid()) {
                        sogModal.openDialogForModelStateDictionary('信息校验失败', error)
                        sogValidator.broadcastResult(error.get());
                        return false;
                    }
                    return true;
                }

                var checkFileData = function () {
                    var retrunFlag = true;
                    if ($scope.viewModel.grantDiscountEnquiryInfoList != null && $scope.viewModel.grantDiscountEnquiryInfoList.length > 0) {
                        angular.forEach($scope.viewModel.grantDiscountEnquiryInfoList, function (item) {
                            if (item.businessGrantDiscountEnquiryFileList != null && item.businessGrantDiscountEnquiryFileList.length > 0) {
                                angular.forEach(item.businessGrantDiscountEnquiryFileList, function (file) {
                                    if (!file.uploaded) {
                                        retrunFlag = false;
                                    }
                                });
                            }
                        });
                    }
                    if (!retrunFlag) {
                        sogModal.openAlertDialog('提示', '附件未上传完毕');
                    }
                    return retrunFlag;
                };

                //加载收集数据的名称
                $scope.collectData = function (e, defer) {
                    if ($scope.viewModel.purchaseOfMarketing.discountDeadline == "" || $scope.viewModel.purchaseOfMarketing.discountDeadline == null)
                        $scope.viewModel.purchaseOfMarketing.discountDeadline = "0001-01-01T00:00:00";

                    if (checkFileData()) {
                        if (e.operationType === sogWfControlOperationType.MoveTo) {
                            if (checkData(e)) {
                                defer.resolve($scope.viewModel);
                            } else {
                                defer.reject($scope.viewModel);
                            }
                        }
                        return defer.resolve($scope.viewModel);
                    }
                }

                $scope.baseInfo.init();
            }]);
    });