define(
    [
        'app',
        'commonUtilExtend',
        'biddingSynthesizeExtend',
        'engineeringExtend',
        'dateTimePickerExtend',
        'leftNavExtend'
    ],
    function (app) {
        app.controller('biddingMaintenanceStart_controller', [
            '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate', 'viewData', '$timeout', 'wfWaiting', 'sogModal',
             'sogWfControlOperationType', 'seagull2Url', 'ValidateHelper', 'sogValidator', 'sogOguType', '$filter', 'errorDialog', 'configure', '$window', '$injector',
            function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, viewData, $timeout, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, $filter, errorDialog, configure, $window, $injector) {
                angular.extend($scope, viewData);
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                $scope.mainTitle = '采购管理';
                $scope.title = "招投标(第三方维保类)";
                $scope.isOpinionsShow = $scope.opinions.length > 0 ? true : false;
                $scope.nowDate = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:00.000');
                $scope.isMac = false;
                $scope.supplierRemark = "";
                $scope.firstDate = $filter('date')($scope.viewModel.purchaseOfMaintenance.lastReplyDeadline, 'yyyy-MM-dd HH:mm:00.000');

                $scope.wfOperateOpts.allowComment = true; //评论
                $scope.wfOperateOpts.allowCirculate = false;//传阅
                $scope.wfOperateOpts.allowDoAbort = false;//作废 
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
                $scope.wfOperateOpts.allowPrint = false;//打印      
                if ($scope.wfOperateOpts.sendButtonName == "已阅") {
                    $scope.wfOperateOpts.allowSave = false;//保存
                }
                if ($scope.sceneId == "StartReadOnly") {
                    $scope.wfOperateOpts.allowRejection = false;//退回
                    $scope.wfOperateOpts.allowDoWithdraw = true;//撤回
                    $scope.wfOperateOpts.allowMoveTo = false;
                } else {
                    $scope.wfOperateOpts.allowRejection = true;//退回
                    //回标截止时间到，页面左上方会出现发送按钮，您可以发送至评标环节
                    if ($scope.nowDate < $scope.firstDate) {
                        $scope.wfOperateOpts.allowMoveTo = false;
                    } else {
                        $scope.wfOperateOpts.allowMoveTo = true;
                    }
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
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'DraftReadOnly',
                        'purchaseBase': $scope.viewModel.purchaseBase,
                        'project': {
                            projectCode: $scope.viewModel.purchaseOfMaintenance.projectCode,
                            projectName: $scope.viewModel.purchaseOfMaintenance.projectName
                        },
                    },
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 1000,
                        resourceId: $scope.resourceId,
                        scene: 'OpenTender',
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                    },
                };


                $scope.viewModel.purchaseDateArrangeInfo.replyDeadline = $scope.viewModel.purchaseDateArrangeInfo.replyDeadline == "0001-01-01T00:00:00" ? "" : $scope.viewModel.purchaseDateArrangeInfo.replyDeadline;
                $scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline = $scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline == "0001-01-01T00:00:00" ? "" : $scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline;
                $scope.viewModel.purchaseDateArrangeInfo.decideBiddingDeadline = $scope.viewModel.purchaseDateArrangeInfo.decideBiddingDeadline == "0001-01-01T00:00:00" ? "" : $scope.viewModel.purchaseDateArrangeInfo.decideBiddingDeadline;

                //显示验证码
                angular.forEach($scope.viewModel.supplierReplyBiddingInfoForSubmitList, function (v) {
                    angular.forEach($scope.viewModel.supplierScopeList, function (s) {
                        if (s.supplierCode == v.supplierCode)
                            v.verificationCode = s.verificationCode;
                    });
                });

                //是否显示IP/Mac
                var replyIpMacs = [];
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
                        projectName: $scope.viewModel.purchaseOfMaintenance.projectName,
                        beforAppend: function (project) {
                            $scope.viewModel.purchaseOfMaintenance.projectCode = project.projectCode;
                            $scope.viewModel.purchaseOfMaintenance.projectName = project.projectName;
                        }
                    },
                    //法人公司
                    corporationOpts: {
                        corporationName: $scope.viewModel.corporationScopeList[0].corporationName,
                        beforAppend: function (corporationData) {
                            $scope.viewModel.corporationScopeList[0].corporationCode = corporationData.corporationCode;
                            $scope.viewModel.corporationScopeList[0].corporationName = corporationData.corporationName;
                            $scope.initChargeCompany($scope.viewModel.corporationScopeList[0].corporationCode);
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

                //更新最新回标截止时间
                $scope.editReplyDeadline = function () {
                    var lastTime = new Date($scope.viewModel.purchaseOfMaintenance.lastReplyDeadline.replace('T', ' '));
                    var nowDate = new Date();
                    if (lastTime) {
                        if (lastTime < nowDate) {
                            alert("最新回标截止时间不能小于当前时间");
                            return;
                        }

                        $http.get(seagull2Url.getPlatformUrl("/BiddingMaintenance/UpdateLastReplyDeadline?resourceID=" +
                                $scope.viewModel.resourceID +
                                "&lastReplyDeadline=" +
                                $scope.viewModel.purchaseOfMaintenance.lastReplyDeadline.replace('T', ' ')))
                            .success(function () {
                                var promise = sogModal.openAlertDialog('提示', "最新回标截止时间修改成功！");
                                promise.then(function (result) {
                                    location.reload();
                                }, function (rejectData) {
                                    location.reload();
                                });
                            })
                    } else {
                        alert("最新回标截止时间不能为空");
                    }
                }

                //发起修改时间流程
                $scope.editpurchaseDatearrange = function () {
                    wfWaiting.show();
                    $http.get(seagull2Url.getPlatformUrl("/BiddingMaintenance/Update?resourceID=" +
                            $scope.viewModel.resourceID +
                            "&isAdjustBiddingDataArrange=true"))
                        .success(function () {
                            $scope.viewModel.purchaseOfMaintenance.isAdjustBiddingDataArrange = true;
                            wfWaiting.hide();
                            var t_link = "default.htm?processDescKey=ReimbursementV2_ModifyPurchaseTime&parentResourceID=" + $scope.viewModel.resourceID + "&purchaseActivityID=" + viewData.currentActivityId + "&urlPart=biddingMaintenanceStart" + "#/modifyPurchaseTime/";
                            window.open(t_link, self);
                        })
                }

                //是否废标-更新流程参数
                $scope.changeIsAbandonBidding = function () {
                    var dataModel = { ResourceID: $scope.viewModel.resourceID, IsAbandonBidding: !$scope.viewModel.purchaseOfMaintenance.isAbandonBidding };
                    wfOperate.refreshProcess('/BiddingMaintenanceStartWf', viewData.currentActivityId, undefined, dataModel, true).success(function (data) {

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
                    if ($scope.viewModel.purchaseOfMaintenance.isAbandonBidding) {
                        if (!$scope.viewModel.purchaseOfMaintenance.abandonBiddingReason) {
                            error.addModelError("废标", "废标原因不能为空");
                        }
                    }
                    else {
                        var replyRound = 0;
                        angular.forEach($scope.viewModel.supplierReplyBiddingInfoForSubmitList, function (v, i) {

                            if (v.isReplyBidding) {
                                replyRound++;
                            }
                        });

                        if (replyRound < 3)
                            error.addModelError("回标供应商个数", "回标供应商个数不能小于3家");
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