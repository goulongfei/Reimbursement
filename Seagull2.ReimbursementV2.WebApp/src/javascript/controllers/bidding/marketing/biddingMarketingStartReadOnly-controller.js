define(
    [
        'app',
        'biddingSynthesizeExtend',
        'engineeringExtend',
        'commonUtilExtend',
        'leftNavExtend',
    ],
    function (app) {
        app.controller('biddingMarketingStartReadOnly_controller', [
            '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate', 'viewData', '$timeout', 'wfWaiting', 'sogModal',
             'sogWfControlOperationType', 'seagull2Url', 'ValidateHelper', 'sogValidator', 'sogOguType', '$filter', 'errorDialog', 'configure', '$window',
            function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, viewData, $timeout, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, $filter, errorDialog, configure, $window) {
                angular.extend($scope, viewData);
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                $scope.mainTitle = '采购管理';
                $scope.title = "招投标(营销类)";
                $scope.isOpinionsShow = $scope.opinions.length > 0 ? true : false;
                $scope.nowDate = $filter('date')(new Date(), 'yyyy-MM-dd');

                $scope.isMac = false;
                $scope.firstDate = $filter('date')($scope.viewModel.purchaseOfMarketing.lastReplyDeadline, 'yyyy-MM-dd');

                $scope.wfOperateOpts.allowCirculate = false;//传阅
                $scope.wfOperateOpts.allowRejection = false;//退回
                $scope.wfOperateOpts.allowDoAbort = false;//作废 
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
                $scope.wfOperateOpts.allowPrint = false;//打印      
                if ($scope.wfOperateOpts.sendButtonName == "已阅") {
                    $scope.wfOperateOpts.allowSave = false;//保存
                }

                //回标截止时间到，页面左上方会出现发送按钮，您可以发送至评标环节
                //if ($scope.nowDate <= $scope.firstDate) {
                //    $scope.wfOperateOpts.allowMoveTo = false;
                //} else {
                //    $scope.wfOperateOpts.allowMoveTo = true;
                //}

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
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 1000,
                        resourceId: $scope.resourceId,
                        scene: "OpenTender",
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                    },
                    // 采购时间安排信息
                    purchaseDateArrangeOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'DraftReadOnly',
                        'purchaseBase': $scope.viewModel.purchaseBase,
                        'priceFile': $scope.viewModel.priceFile,
                        'project': {
                            projectCode: $scope.viewModel.purchaseOfMarketing.projectCode,
                            projectName: $scope.viewModel.purchaseOfMarketing.projectName
                        },
                    },
                    isShowUpstreamProcessMarketing: false
                };

                //过滤时间显示格式
                for (var i = 0; i < $scope.viewModel.purchaseDateArrangeInfoList.length; i++) {
                    $scope.viewModel.purchaseDateArrangeInfoList[i].replyDeadline = $scope.viewModel.purchaseDateArrangeInfoList[i].replyDeadline == "0001-01-01T00:00:00" ? "" : $scope.viewModel.purchaseDateArrangeInfoList[i].replyDeadline;
                    $scope.viewModel.purchaseDateArrangeInfoList[i].evaluateBiddingDeadline = $scope.viewModel.purchaseDateArrangeInfoList[i].evaluateBiddingDeadline == "0001-01-01T00:00:00" ? "" : $scope.viewModel.purchaseDateArrangeInfoList[i].evaluateBiddingDeadline;
                    $scope.viewModel.purchaseDateArrangeInfoList[i].decideBiddingDeadline = $scope.viewModel.purchaseDateArrangeInfoList[i].decideBiddingDeadline == "0001-01-01T00:00:00" ? "" : $scope.viewModel.purchaseDateArrangeInfoList[i].decideBiddingDeadline;
                }

                //如果有上流流程信息，则显示出
                if ($scope.viewModel.purchaseOfMarketing.upstreamProcessResourceID != null && $scope.viewModel.purchaseOfMarketing.upstreamProcessResourceID != "") {
                    $scope.baseInfo.isShowUpstreamProcessMarketing = true;
                }

                //显示验证码
                angular.forEach($scope.viewModel.supplierReplyBiddingInfoForSubmitList, function (v) {
                    angular.forEach($scope.viewModel.supplierScopeList, function (s) {
                        if (s.supplierCode == v.supplierCode)
                            v.verificationCode = s.verificationCode;
                    });
                });

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

                //页面所用函数
                $scope.api = {
                    //自定义指令回调函数
                    //项目名称
                    projectOpts: {
                        projectName: $scope.viewModel.purchaseOfMarketing.projectName,
                        beforAppend: function (project) {
                            $scope.viewModel.purchaseOfMarketing.projectCode = project.projectCode;
                            $scope.viewModel.purchaseOfMarketing.projectName = project.projectName;
                        }
                    },
                    //法人公司
                    corporationOpts: {
                        corporationName: $scope.viewModel.corporationScope[0].corporationName,
                        beforAppend: function (corporationData) {
                            $scope.viewModel.corporationScope[0].corporationCode = corporationData.corporationCode;
                            $scope.viewModel.corporationScope[0].corporationName = corporationData.corporationName;
                            $scope.initChargeCompany($scope.viewModel.corporationScope[0].corporationCode);
                        }
                    },
                    //入围供应商
                    supplierScopeOpts: {
                        scene: "Start",
                        beforAppend: function (supplierData) {
                            $scope.viewModel.supplierScopeList.push(supplierData);
                        },
                        afterAppend: function (supplierData) {
                            $scope.viewModel.supplierScopeList = supplierData;
                        },
                    }
                };

                //查询记账公司
                $scope.initChargeCompany = function (corporationCode) {
                    if (corporationCode) {
                        $http.get(seagull2Url.getPlatformUrl("/Purchase/GetChargeCompanyList?corporationCode=" + corporationCode))
                        .success(function (data) {
                            $scope.viewModel.option.chargeCompany = data;
                        })
                    }
                }

                //记账公司下拉框选中后数据变化
                $scope.chargeCompanyChange = function () {
                    angular.forEach($scope.viewModel.option.chargeCompany, function (v) {
                        if ($scope.viewModel.purchaseOfMarketing.chargeCompanyCode == v.code) {
                            $scope.viewModel.purchaseOfMarketing.chargeCompanyCode = v.code;
                            $scope.viewModel.purchaseOfMarketing.chargeCompanyName = v.name;
                        }
                        if ($scope.viewModel.purchaseOfMarketing.chargeCompanyCode) {
                            $scope.loadCostCenter($scope.viewModel.purchaseOfMarketing.chargeCompanyCode);
                        }
                    })
                }

                //加载成本中心
                $scope.loadCostCenter = function (chargeCompanyCode) {
                    if (chargeCompanyCode) {
                        $http.get(seagull2Url.getPlatformUrl("/Purchase/GetCostCenterList?chargeCompanyCode=" + chargeCompanyCode))
                         .success(function (data) {
                             $scope.viewModel.option.costCenter = data;
                         })
                    }

                }
                //成本中心选中下拉框数据变化
                $scope.costCenterChange = function () {
                    angular.forEach($scope.viewModel.option.costCenter, function (v) {
                        if ($scope.viewModel.purchaseOfMarketing.costCenterCode == v.code) {
                            $scope.viewModel.purchaseOfMarketing.costCenterCode = v.code;
                            $scope.viewModel.purchaseOfMarketing.costCenterName = v.name;
                        }
                    })
                }

                //营销采购分类下拉框选中
                $scope.marketingPurchaseTypeChange = function () {
                    angular.forEach($scope.viewModel.option.marketingPurchaseType, function (v) {
                        if ($scope.viewModel.purchaseOfMarketing.marketingPurchaseTypeCode == v.code) {
                            $scope.viewModel.purchaseOfMarketing.marketingPurchaseTypeCode = v.code;
                            $scope.viewModel.purchaseOfMarketing.marketingPurchaseTypeName = v.name;
                        }
                    })
                }

                //校验是否选择了法人公司和成本中心
                $scope.validOpts = function (name) {
                    if (name == '记账公司') {
                        if ($scope.viewModel.corporationScope[0].corporationCode == "" || $scope.viewModel.corporationScope[0].corporationCode == null) {
                            sogModal.openAlertDialog("提示", "请先选择法人公司");
                        }
                    }
                    if (name == '成本中心') {
                        if ($scope.viewModel.purchaseOfMarketing.chargeCompanyCode == "" || $scope.viewModel.purchaseOfMarketing.chargeCompanyCode == null) {
                            sogModal.openAlertDialog("提示", "请先选择记账公司");
                        }
                    }
                }

                //更新最新回标截止时间
                $scope.editReplyDeadline = function () {
                    var lastTime = $filter('date')($scope.viewModel.purchaseOfMarketing.lastReplyDeadline, 'yyyy-MM-dd');

                    if (lastTime) {
                        //if (lastTime < $scope.nowDate) {
                        //    alert("最新回标截止时间不能小于当前时间");
                        //    return;
                        //}

                        if (lastTime == $scope.nowDate) {
                            return;
                        }

                        $http.get(seagull2Url.getPlatformUrl("/BiddingMarketing/UpdateLastReplyDeadline?resourceID=" +
                                $scope.viewModel.resourceID +
                                "&lastReplyDeadline=" +
                                lastTime))
                            .success(function () {
                                alert("最新回标截止时间修改成功");
                            })
                    } else {
                        alert("最新回标截止时间不能为空");
                    }
                }

                //发起修改时间流程
                $scope.editpurchaseDatearrange = function () {

                    $http.get(seagull2Url.getPlatformUrl("/BiddingMarketing/UpdateLastReplyDeadline?resourceID=" +
                            $scope.viewModel.resourceID +
                            "&isAdjustBiddingDataArrange=true"))
                        .success(function () {
                            $scope.viewModel.purchaseOfMarketing.isAdjustBiddingDataArrange = true;

                            var t_link = "default.htm?processDescKey=ReimbursementV2_Bidding_Marketing_ModifyTime&parentResourceID=" + $scope.viewModel.resourceID + "#/biddingMarketingModifyTime/";
                            window.open(t_link, self);
                        })
                }

                //是否废标-更新流程参数
                $scope.changeIsAbandonBidding = function () {
                    var dataModel = { IsAbandonBidding: !$scope.viewModel.purchaseOfMarketing.isAbandonBidding };
                    wfOperate.refreshProcess('/BiddingMarketingStartWf', viewData.currentActivityId, undefined, dataModel, true).success(function (data) {

                    });
                }

                //打开供应商详情页面
                $scope.OpenSupplier = function (code) {
                    var url = $scope.common.webUrlBase + "/THRWebApp/SupplierV2/default.htm#/supplierDetails?supplierCode=" + code + "&random=" + Math.random();
                    $window.open(url);
                }

                //数据有效性的检验
                var RequiredValidator = ValidateHelper.getValidator("Required");

                var checkData = function () {
                    sogValidator.clear();
                    var error = ValidateHelper.validateData($scope.viewModel, [
                        {
                            Key: '', attributeName: '', validator: new RequiredValidator('')
                        }]);


                    //如果废标，还得更新废标理由
                    if ($scope.viewModel.purchaseOfMarketing.isAbandonBidding) {
                        if (!$scope.viewModel.purchaseOfMarketing.abandonBiddingReason) {
                            error.addModelError("废标", "废标原因不能为空");
                        }
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
                            v.replyDeadline = $filter('date')(v.replyDeadline, 'yyyy-MM-dd HH:mm:00.000');
                            v.evaluateBiddingDeadline = $filter('date')(v.evaluateBiddingDeadline, 'yyyy-MM-dd HH:mm:00.000');
                            v.decideBiddingDeadline = $filter('date')(v.decideBiddingDeadline, 'yyyy-MM-dd HH:mm:00.000');
                        });
                    }
                    if (e.operationType === sogWfControlOperationType.MoveTo) {
                        if (checkData(e)) {
                            defer.resolve($scope.viewModel);
                        } else {
                            defer.reject($scope.viewModel);
                        }
                    }
                    return defer.resolve($scope.viewModel);
                }
            }]);
    });