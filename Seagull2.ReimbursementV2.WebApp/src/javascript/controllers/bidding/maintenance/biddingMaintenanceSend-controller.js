﻿define(
    [
        'app',
        'commonUtilExtend',
        'biddingSynthesizeExtend',
        'engineeringExtend',
        'dateTimePickerExtend',
        'leftNavExtend'
    ],
    function (app) {
        app.controller('biddingMaintenanceSend_controller', [
            '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate', 'viewData', '$timeout', 'wfWaiting', 'sogModal',
             'sogWfControlOperationType', 'seagull2Url', 'ValidateHelper', 'sogValidator', 'sogOguType', '$filter', 'errorDialog',
            function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, viewData, $timeout, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, $filter, errorDialog) {
                angular.extend($scope, viewData);
                $scope.mainTitle = '采购管理';
                $scope.title = "招投标(第三方维保类)";
                $scope.isOpinionsShow = $scope.opinions.length > 0 ? true : false;

                var dateArrangeScene = viewData.sceneId == "SendReadOnly" ? "DraftReadOnly" : "Send";
                var supplierScene = viewData.sceneId == "SendReadOnly" ? "SendReadOnly" : "Send";

                $scope.wfOperateOpts.allowCirculate = true;//传阅
                $scope.wfOperateOpts.allowRejection = viewData.sceneId == "Send" ? true : false;//退回
                $scope.wfOperateOpts.allowDoAbort = false;//作废 
                $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
                $scope.wfOperateOpts.allowPrint = false;//打印      
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
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': dateArrangeScene,
                        'purchaseBase': $scope.viewModel.purchaseBase,
                        'priceFile': $scope.viewModel.priceFile,
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
                        scene: 'SendTender',
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                    },
                    isShowUpstreamProcessMarketing: false
                };


                $scope.viewModel.purchaseDateArrangeInfo.replyDeadline = $scope.viewModel.purchaseDateArrangeInfo.replyDeadline == "0001-01-01T00:00:00" ? "" : $scope.viewModel.purchaseDateArrangeInfo.replyDeadline;
                $scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline = $scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline == "0001-01-01T00:00:00" ? "" : $scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline;
                $scope.viewModel.purchaseDateArrangeInfo.decideBiddingDeadline = $scope.viewModel.purchaseDateArrangeInfo.decideBiddingDeadline == "0001-01-01T00:00:00" ? "" : $scope.viewModel.purchaseDateArrangeInfo.decideBiddingDeadline;

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
                        scene: supplierScene,
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
                        if ($scope.viewModel.purchaseOfMaintenance.chargeCompanyCode == v.code) {
                            $scope.viewModel.purchaseOfMaintenance.chargeCompanyCode = v.code;
                            $scope.viewModel.purchaseOfMaintenance.chargeCompanyName = v.name;
                        }
                        if ($scope.viewModel.purchaseOfMaintenance.chargeCompanyCode) {
                            $scope.loadCostCenter($scope.viewModel.purchaseOfMaintenance.chargeCompanyCode);
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
                        if ($scope.viewModel.purchaseOfMaintenance.costCenterCode == v.code) {
                            $scope.viewModel.purchaseOfMaintenance.costCenterCode = v.code;
                            $scope.viewModel.purchaseOfMaintenance.costCenterName = v.name;
                        }
                    })
                }

                //营销采购分类下拉框选中
                $scope.marketingPurchaseTypeChange = function () {
                    angular.forEach($scope.viewModel.option.marketingPurchaseType, function (v) {
                        if ($scope.viewModel.purchaseOfMaintenance.marketingPurchaseTypeCode == v.code) {
                            $scope.viewModel.purchaseOfMaintenance.marketingPurchaseTypeCode = v.code;
                            $scope.viewModel.purchaseOfMaintenance.marketingPurchaseTypeName = v.name;
                        }
                    })
                }

                //校验是否选择了法人公司和成本中心
                $scope.validOpts = function (name) {
                    if (name == '记账公司') {
                        if ($scope.viewModel.corporationScopeList[0].corporationCode == "" || $scope.viewModel.corporationScopeList[0].corporationCode == null) {
                            sogModal.openAlertDialog("提示", "请先选择法人公司");
                        }
                    }
                    if (name == '成本中心') {
                        if ($scope.viewModel.purchaseOfMaintenance.chargeCompanyCode == "" || $scope.viewModel.purchaseOfMaintenance.chargeCompanyCode == null) {
                            sogModal.openAlertDialog("提示", "请先选择记账公司");
                        }
                    }
                }

                //数据有效性的检验
                var RequiredValidator = ValidateHelper.getValidator("Required");

                var checkData = function () {
                    sogValidator.clear();
                    var error = ValidateHelper.validateData($scope.viewModel, [
                        {
                            Key: '', attributeName: '', validator: new RequiredValidator('')
                        }]);


                    if ($scope.viewModel.purchaseDateArrangeInfo.replyDeadline == null || $scope.viewModel.purchaseDateArrangeInfo.replyDeadline == "0001-01-01T00:00:00" || $scope.viewModel.purchaseDateArrangeInfo.replyDeadline == "") {
                        error.addModelError("回标截止时间", "回标截止时间不能为空");
                    }
                    if ($scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline == null || $scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline == "0001-01-01T00:00:00" || $scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline == "") {
                        error.addModelError("评标时间", "评标时间不能为空");
                    }
                    if ($scope.viewModel.purchaseDateArrangeInfo.decideBiddingDeadline == null || $scope.viewModel.purchaseDateArrangeInfo.decideBiddingDeadline == "0001-01-01T00:00:00" || $scope.viewModel.purchaseDateArrangeInfo.decideBiddingDeadline == "") {
                        error.addModelError("定标时间", "定标时间不能为空");
                    }

                    if (new Date($scope.viewModel.purchaseDateArrangeInfo.replyDeadline.replace('T', ' ')) <= new Date()) {
                        error.addModelError("回标截止时间", "回标截止时间必须大于当前时间");
                    }
                    if ($scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline <= new Date()) {
                        error.addModelError("评标时间", "评标时间必须大于当前时间");
                    }
                    if ($scope.viewModel.purchaseDateArrangeInfo.decideBiddingDeadline <= new Date()) {
                        error.addModelError("定标时间", "定标时间必须大于当前时间");
                    }

                    if (new Date($filter('date')($scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline, 'yyyy-MM-dd 00:00:00.000')) <= new Date($scope.viewModel.purchaseDateArrangeInfo.replyDeadline.replace('T', ' '))) {
                        error.addModelError("评标时间", "评标时间必须大于回标截止时间");
                    }

                    if ($scope.viewModel.purchaseDateArrangeInfo.decideBiddingDeadline <= $scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline) {
                        error.addModelError("定标时间", "定标时间必须大于评标时间");
                    }
                    if ($scope.viewModel.reportFile == null) error.addModelError("招标文件", "招标文件不能为空");

                    if (!$scope.viewModel.linkManUser) error.addModelError("联系人", "联系人不能为空");

                    //联系人电话与邮箱验证
                    var regPhoneNumber = /^(((\+\d{2}-)?0\d{2,3}-\d{7,8})|((\+\d{2}-)?(\d{2,3}-)?(1[3-9]\d{9})))$/;
                    var regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,}$/;
                    var validPhoneNumber = regPhoneNumber.test($scope.viewModel.purchaseOfMaintenance.linkManPhone);
                    var validEmail = regEmail.test($scope.viewModel.purchaseOfMaintenance.linkManEmail);
                    if (validPhoneNumber === false) {
                        error.addModelError('联系电话', '请正确填写联系电话');
                    }

                    if (validEmail === false) {
                        error.addModelError('E-mail', '请正确填写E-mail地址');
                    }

                    //供应商信息验证
                    if ($scope.viewModel.supplierScopeList.length) {
                        angular.forEach($scope.viewModel.supplierScopeList, function (v, i) {
                            var key = '第' + (i + 1) + '行供应商';
                            if (!v.linkManName) error.addModelError("联系人", key + "联系人不能为空");


                            if (!v.linkPhone)
                                error.addModelError("联系人电话", key + "联系人电话不能为空");
                            else {
                                if (regPhoneNumber.test(v.linkPhone) === false) {
                                    error.addModelError('联系人电话', key + '联系人电话格式不正确');
                                }
                            }
                            if (!v.linkEmail)
                                error.addModelError("联系人邮箱", key + "联系人邮箱不能为空");
                            else {
                                if (regEmail.test(v.linkEmail) === false) {
                                    error.addModelError('联系人邮箱', key + '联系人邮箱格式不正确');
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
                $scope.fileReady = true;
                var checkFileData = function () {
                    if (!$scope.fileReady) {
                        sogModal.openAlertDialog('提示', '附件未上传完毕');
                        return false;
                    }
                    return true;
                };
                //加载收集数据的名称
                $scope.collectData = function (e, defer) {
                    if (checkFileData()) {
                        if (e.operationType === sogWfControlOperationType.MoveTo) {
                            if (checkData(e)) {
                                defer.resolve($scope.viewModel);
                            } else {
                                defer.reject($scope.viewModel);
                            }
                        } else if (e.operationType === sogWfControlOperationType.Save) {

                            if ($scope.viewModel.purchaseDateArrangeInfo.replyDeadline == null || $scope.viewModel.purchaseDateArrangeInfo.replyDeadline == "") {
                                $scope.viewModel.purchaseDateArrangeInfo.replyDeadline = "0001-01-01T00:00:00";
                            }
                            if ($scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline == null || $scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline == "") {
                                $scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline = "0001-01-01T00:00:00";
                            }
                            if ($scope.viewModel.purchaseDateArrangeInfo.decideBiddingDeadline == null || $scope.viewModel.purchaseDateArrangeInfo.decideBiddingDeadline == "") {
                                $scope.viewModel.purchaseDateArrangeInfo.decideBiddingDeadline = "0001-01-01T00:00:00";
                            }

                        }
                        return defer.resolve($scope.viewModel);
                    }
                }
            }]);
    });