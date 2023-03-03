define(['app', 'commonUtilExtend', 'dateTimePickerExtend'], function (app) {
    app.controller('biddingNotProjectModifyTime_controller',
        function ($injector, $scope, $rootScope, $http, $state, wfOperate, seagull2Url, wfWaiting, sogModal, $location, viewData,
            sogWfControlOperationType, sogOguType, sogValidator, ValidateHelper, $window, configure) {
            angular.extend($scope, viewData);
            $scope.mainTitle = '采购管理';
            $scope.title = "调整采购时间";
            $scope.isApprovalShow = false;
            angular.forEach($scope.opinions, function (v, i) {
                //审批意见是否显示
                if (v.nextStepSnapshot.length > 0 && !v.commentIsDelete)
                    $scope.isApprovalShow = true;
            });
            
            $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
            $scope.wfOperateOpts.allowPrint = false;//打印
            //查看开标页面
            $scope.lookPurchaseInfo = function () {
                var urlat = null;
                $http.get(seagull2Url.getPlatformUrl("/PublicApi/TicketStr?r=" + new Date().getTime()))
                    .success(function (data) {
                        urlat = data;
                        if (urlat !== null) {
                            urlat = urlat.replace(/"/g, "");
                            var url = $scope.viewModel.p_PurchaseDataArrangeAdjustRecordPEMu.purchaseUrl;

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
            };
            //数据有效性的检验
            var RequiredValidator = ValidateHelper.getValidator("Required");
            var validData = function () {
                var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                    {
                        key: '', attributeName: '', validator: new RequiredValidator('')
                    }
                ]);
                var isValidAdopt = true;
                angular.forEach($scope.viewModel.p_PurchaseDateArrangeInfoPEMus, function (item) {
                    if (item.className == 2) {
                        if (item.replyDeadline == null || item.replyDeadline == "0001-01-01T00:00:00" || item.replyDeadline == "") {
                            modelStateDictionary.addModelError("采购时间安排", "回标截止时间不能为空");
                            isValidAdopt = false;
                        }
                        if (item.evaluateBiddingDeadline == null || item.evaluateBiddingDeadline == "0001-01-01T00:00:00" || item.evaluateBiddingDeadline == "") {
                            modelStateDictionary.addModelError("采购时间安排", "评标时间不能为空");
                            isValidAdopt = false;
                        }
                        if (item.decideBiddingDeadline == null || item.decideBiddingDeadline == "0001-01-01T00:00:00" || item.decideBiddingDeadline == "") {
                            modelStateDictionary.addModelError("采购时间安排", "定标时间不能为空");
                            isValidAdopt = false;
                        }
                        if (isValidAdopt) {
                            if (new Date(item.replyDeadline) < new Date()) {
                                modelStateDictionary.addModelError("采购时间安排", "回标截止时间不能小于当前时间");
                            }
                            if (item.evaluateBiddingDeadline < item.replyDeadline) {
                                modelStateDictionary.addModelError("采购时间安排", "评标时间不能小于回标截止时间");
                            }
                            if (item.decideBiddingDeadline < item.evaluateBiddingDeadline) {
                                modelStateDictionary.addModelError("采购时间安排", "定标时间不能小于评标时间");
                            }
                        }
                    }
                });
                return modelStateDictionary;
            };
            //收集数据
            $scope.collectData = function (e, defer) {
                sogValidator.clear();
                switch (e.operationType) {
                    case sogWfControlOperationType.MoveTo:
                        var result = validData();
                        if (!result.isValid()) {
                            sogModal.openDialogForModelStateDictionary('信息校验失败', result);
                            sogValidator.broadcastResult(result.get());
                            defer.reject($scope.viewModel);
                        } else {
                            defer.resolve($scope.viewModel);
                        }
                        break;
                    case sogWfControlOperationType.Save:
                        angular.forEach($scope.viewModel.p_PurchaseDateArrangeInfoPEMus, function (item) {
                            if (item.className == 2) {
                                if (item.questionDeadline == null || item.questionDeadline == "") {
                                    item.questionDeadline == "0001-01-01T00:00:00";
                                }
                                if (item.replyDeadline == null || item.replyDeadline == "") {
                                    item.replyDeadline == "0001-01-01T00:00:00";
                                }
                                if (item.clearBinddingDeadline == null || item.clearBinddingDeadline == "") {
                                    item.clearBinddingDeadline == "0001-01-01T00:00:00";
                                }
                                if (item.evaluateBiddingDeadline == null || item.evaluateBiddingDeadline == "") {
                                    item.evaluateBiddingDeadline == "0001-01-01T00:00:00";
                                }
                                if (item.decideBiddingDeadline == null || item.decideBiddingDeadline == "") {
                                    item.decideBiddingDeadline == "0001-01-01T00:00:00";
                                }
                            }
                        });
                        defer.resolve($scope.viewModel);
                        break;
                    case sogWfControlOperationType.CancelProcess:
                        defer.resolve($scope.viewModel);
                        break;
                    case sogWfControlOperationType.Withdraw:
                        defer.resolve($scope.viewModel);
                        break;
                    default:
                        defer.resolve(null);
                        break;
                }
            };
        });
});


