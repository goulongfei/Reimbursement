define(
    [
        'app',
        'biddingSynthesizeExtend',
        'engineeringExtend',
        'dateTimePickerExtend',
        'commonUtilExtend',
        'leftNavExtend'
    ],
    function (app) {
        app.controller('biddingMaintenanceCancel_controller', [
            '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate', 'viewData', '$timeout', 'wfWaiting', 'sogModal',
             'sogWfControlOperationType', 'seagull2Url', 'ValidateHelper', 'sogValidator', 'sogOguType', '$filter', 'errorDialog', 'configure', '$window', '$injector',
            function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, viewData, $timeout, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, $filter, errorDialog, configure, $window, $injector) {
                angular.extend($scope, viewData);
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                $scope.mainTitle = '采购管理';
                $scope.title = "招投标(第三方维保类)";
                $scope.isMac = false;

                $scope.wfOperateOpts.allowCirculate = false;//传阅
                $scope.wfOperateOpts.allowDoAbort = false;//作废 
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
                $scope.wfOperateOpts.allowPrint = false;//打印      
                if ($scope.wfOperateOpts.sendButtonName == "已阅") {
                    $scope.wfOperateOpts.allowSave = false;//保存
                }
                if ($scope.sceneId == "CancelReadOnly" || $scope.sceneId == "CancelApprovalReadOnly") {
                    $scope.wfOperateOpts.allowRejection = false;//退回
                }
                if ($scope.sceneId == "CancelApprovalReadOnly") {
                    $scope.wfOperateOpts.allowDoWithdraw = true;//撤回
                }
                $scope.$broadcast('viewModel', { data: $scope.viewModel });

                //定标审批字样修改
                if ($scope.opinionOpts.options.length > 0) {

                    angular.forEach($scope.opinionOpts.options, function (v) {
                        if (v.nextStepCollection != undefined) {
                            if (v.nextStepCollection.length > 0) {
                                angular.forEach(v.nextStepCollection, function (n) {
                                    if (n.name.indexOf('不同意') > -1) {
                                        n.name = "不同意，且退回废标申请";
                                    }
                                });
                            }
                        }
                    });
                }

                if ($scope.opinions.length > 0) {
                    angular.forEach($scope.opinions, function (v) {
                        if (v.nextStepSnapshot != undefined) {
                            if (v.nextStepSnapshot.length > 0) {
                                angular.forEach(v.nextStepSnapshot, function (n) {
                                    if (n.name.indexOf('不同意') > -1) {
                                        n.name = "不同意，且退回废标申请";
                                    }
                                });
                            }
                        }
                    });
                }

                //监控选择同意不同意按钮，实时改变文字显示
                $scope.$watch("opinionOpts", function (newVal, oldVal) {
                    angular.forEach(newVal.options, function (v) {
                        if (v.nextStepCollection != undefined) {
                            if (v.nextStepCollection.length > 0) {
                                angular.forEach(v.nextStepCollection, function (n) {
                                    if (n.name.indexOf('不同意') > -1) {
                                        n.name = "不同意，且退回废标申请";
                                    }
                                });
                            }
                        }
                    });
                });

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
                        'priceFile': $scope.viewModel.priceFile,
                        'project': {
                            projectCode: $scope.viewModel.purchaseOfMaintenance.projectCode,
                            projectName: $scope.viewModel.purchaseOfMaintenance.projectName
                        }   
                    },
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 1000,
                        resourceId: $scope.resourceId,
                        scene: "CancelTender",
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                    },
                };

                //过滤时间显示格式
                for (var i = 0; i < $scope.viewModel.purchaseDateArrangeInfoList.length; i++) {
                    $scope.viewModel.purchaseDateArrangeInfoList[i].replyDeadline = $scope.viewModel.purchaseDateArrangeInfoList[i].replyDeadline == "0001-01-01T00:00:00" ? "" : $scope.viewModel.purchaseDateArrangeInfoList[i].replyDeadline;
                    $scope.viewModel.purchaseDateArrangeInfoList[i].evaluateBiddingDeadline = $scope.viewModel.purchaseDateArrangeInfoList[i].evaluateBiddingDeadline == "0001-01-01T00:00:00" ? "" : $scope.viewModel.purchaseDateArrangeInfoList[i].evaluateBiddingDeadline;
                    $scope.viewModel.purchaseDateArrangeInfoList[i].decideBiddingDeadline = $scope.viewModel.purchaseDateArrangeInfoList[i].evaluateBiddingDeadline == "0001-01-01T00:00:00" ? "" : $scope.viewModel.purchaseDateArrangeInfoList[i].evaluateBiddingDeadline;
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
                        corporationName: $scope.viewModel.corporationNames,
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
                    if (!$scope.viewModel.purchaseOfMaintenance.abandonBiddingReason) {
                        error.addModelError("废标", "废标原因不能为空");
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