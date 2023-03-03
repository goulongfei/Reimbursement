define(
    [
        'app',
        'commonUtilExtend',
        'biddingSynthesizeExtend',
        'engineeringExtend',
        'leftNavExtend',
        'useCostCenterExtend'
    ],
    function (app) {
        app.controller('biddingMaintenanceSureApproval_controller', [
            '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate', 'viewData', '$timeout', 'wfWaiting', 'sogModal',
            'sogWfControlOperationType', 'seagull2Url', 'ValidateHelper', 'sogValidator', 'sogOguType', '$filter', 'errorDialog', 'configure', '$window',
            function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, viewData, $timeout, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, $filter, errorDialog, configure, $window) {
                angular.extend($scope, viewData);
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                $scope.mainTitle = '采购管理';
                $scope.title = "招投标(第三方维保类)";

                $scope.isOpinionsShow = false;
                $scope.isApprovalShow = false;

                angular.forEach($scope.opinions, function (v, i) {

                    //评价意见是否显示
                    if (v.processId == 'InputOpinion')
                        $scope.isOpinionsShow = true;

                    //审批意见是否显示
                    if (v.processId != 'InputOpinion')
                        $scope.isApprovalShow = true;
                });

                $scope.wfOperateOpts.allowCirculate = true;//传阅
                $scope.wfOperateOpts.allowRejection = viewData.sceneId == "PurchaseApproval" ? true : false;//退回
                $scope.wfOperateOpts.allowDoAbort = false;//作废 
                $scope.wfOperateOpts.allowDoWithdraw = viewData.sceneId.indexOf("ReadOnly") > -1 ? true : false;//撤回
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
                $scope.wfOperateOpts.allowPrint = false;//打印      
                if ($scope.wfOperateOpts.sendButtonName == "已阅") {
                    $scope.wfOperateOpts.allowSave = false;//保存
                }

                // 设置 
                $scope.settings = {
                    //判断审批是否是选择不同意退回
                    getTransitionName: function (transitionKey) {
                        if ($scope.opinionOpts.options.length > 0) {
                            angular.forEach($scope.opinionOpts.options, function (v) {
                                if (v.processId && v.processId !== "InputOpinion" && angular.isArray(v.nextStepCollection) && v.nextStepCollection.length > 0) {
                                    angular.forEach(v.nextStepCollection, function (itemSelect) {
                                        if (itemSelect.transitionKey === transitionKey) {
                                            $scope.viewModel.transitionName = itemSelect.name;
                                        }
                                    });
                                }
                            });
                        }
                    },
                    spreadInfoFn: function () {
                        if ($scope.settings.isSpreadInfo) {
                            $scope.settings.isSpreadInfo = false;
                            $scope.settings.spreadButtonName = "展开";
                        } else {
                            $scope.settings.isSpreadInfo = true;
                            $scope.settings.spreadButtonName = "收起";
                        }
                    },
                    isSpreadInfo: false,
                    isDraftReadOnly: false,
                    spreadButtonName: "展开",
                    isApproval: false,
                    linkName: "定标"
                };

                if ($scope.sceneId == 'Draft' || $scope.sceneId == 'PurchaseApproval' || $scope.sceneId == 'DefaultCirculationScene' || $scope.sceneId == 'ApprovalEdit' || $scope.sceneId == 'Approval' || $scope.viewModel.isAdmin) {
                    $scope.settings.isApproval = true;
                    $scope.settings.isSpreadInfo = true;
                } 

                //定标审批字样修改
                if ($scope.opinionOpts.options.length > 0) {

                    angular.forEach($scope.opinionOpts.options, function (v) {
                        if (v.nextStepCollection != undefined) {
                            if (v.nextStepCollection.length > 0) {
                                angular.forEach(v.nextStepCollection, function (n) {
                                    if (n.name.indexOf('不同意') > -1) {
                                        n.name = "不同意，且退回定标环节";
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
                                        n.name = "不同意，且退回定标环节";
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
                                        n.name = "不同意，且退回定标环节";
                                    }
                                });
                            }
                        }
                    });
                });

                $scope.select_add_all = false;
                $scope.select_del_all = false;
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

                    // 采购时间安排信息
                    purchaseDateArrangeOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'ReadOnly',
                        'project': {
                            projectCode: $scope.viewModel.purchaseOfMaintenance.projectCode,
                            projectName: $scope.viewModel.purchaseOfMaintenance.projectName
                        },
                    },
                    //选择主体公司
                    selectCorporation: function (supplier) {
                        angular.forEach($scope.viewModel.corporationScopeList, function (item) {
                            if (item.corporationCode == supplier.corporationCode) {
                                supplier.corporationName = item.corporationName;
                            }
                        });
                    },
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 1000,
                        resourceId: $scope.resourceId,
                        scene: 'ConfirmTender',
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                    },
                };

                //查看页面
                $scope.lookbiddingMaintenanceInfo = function (routesType, title) {
                    var urlat = null;
                    $http.get(seagull2Url.getPlatformUrl("/PublicApi/TicketStr?r=" + new Date().getTime()))
                        .success(function (data) {
                            urlat = data;
                            if (urlat !== null) {
                                urlat = urlat.replace(/"/g, "");
                                var url = "";
                                var activityID = "";
                                switch (routesType) {
                                    case "biddingMaintenanceSummer":
                                        for (var i = 0; i < $scope.viewModel.processActivityInfoList.length; i++) {
                                            if ($scope.viewModel.processActivityInfoList[i].activityCodeName == "EvaluateTenderSummary") {
                                                activityID = $scope.viewModel.processActivityInfoList[i].activityCode;
                                                break;
                                            }
                                        }
                                        break;
                                    case "biddingMaintenanceApplication":
                                        for (var i = 0; i < $scope.viewModel.processActivityInfoList.length; i++) {
                                            if ($scope.viewModel.processActivityInfoList[i].activityCodeName == "Draft") {
                                                activityID = $scope.viewModel.processActivityInfoList[i].activityCode;
                                                break;
                                            }
                                        }
                                        break;
                                }
                                url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/" + routesType + "/?resourceID=" + $scope.viewModel.resourceID + "&activityID=" + activityID;

                                if (url.indexOf("?") == -1) {
                                    url = url + "?_at=" + urlat;
                                } else {
                                    url = url + "&_at=" + urlat;
                                }
                                $window.open(url, '_blank');
                            }

                        })
                        .error(function (data, status) {
                            errorDialog.openErrorDialog(data, status, title + "异常");
                            wfWaiting.hide();
                        });
                };
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

                $rootScope.$on("$processRefreshed", function (event, data) {
                    $scope.settings.getTransitionName(data.wfOperateOpts.transitionKey);
                });
                $scope.settings.getTransitionName($scope.wfOperateOpts.transitionKey);

                //加载收集数据的名称
                $scope.collectData = function (e, defer) {
                    return defer.resolve($scope.viewModel);
                }
            }]);
    });