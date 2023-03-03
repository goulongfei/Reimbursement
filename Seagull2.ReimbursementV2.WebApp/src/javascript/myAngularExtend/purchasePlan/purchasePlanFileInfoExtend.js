define(['app'], function (app) {
    app.directive("purchasePlanFileInfoExtend", function () {
        var template = "<div><i ng-show=\"!readonly&&!purchaseFileInfo.isStartScheme\" ng-click=\"operation()\" style=\"cursor: pointer; color: blue;\">编辑</i><i ng-show=\"readonly||purchaseFileInfo.isStartScheme\" ng-click=\"operation()\" style=\"cursor: pointer; color: blue;\">查看</i></div>";
        return {
            restrict: "AE",
            scope: {
                purchaseFileInfo: '=',
                specialty: "=",
                readonly: '=',
                isCompleted: '='
            },
            template: template,
            controller: function ($scope, $element, $attrs, $http, $templateCache, sogModal, seagull2Url, linq, wfWaiting, ValidateHelper, sogValidator, $q, sogOguType, configure, $window) {
                //操作
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                $scope.operation = function () {
                    var viewPath = './htmlTemplate/controlTemplate/purchasePlan/purchasePlanFileInfo.html';
                    var sogtemplate = '<div><div ng-include="\'' + viewPath + '\'"></div>';
                    var promise = sogModal.openDialog(sogtemplate, '采购前置需求', ['$scope',
                        function ($modelScope) {
                            $modelScope.data = {
                                purchaseName: $scope.purchaseFileInfo.purchaseName,
                                readonly: $scope.readonly,
                                materialFeedbackInfoList: $scope.purchaseFileInfo.p_MaterialFeedbackInfoListPEMu,
                                specialty: $scope.specialty,
                                purchaseFileInfoCode: $scope.purchaseFileInfo.resultCode,
                                isAutoStart: $scope.purchaseFileInfo.isAutoStart,
                                isStartScheme: $scope.purchaseFileInfo.isStartScheme,
                                isCompleted: $scope.isCompleted
                            };
                            angular.forEach($modelScope.data.materialFeedbackInfoList, function (v) {
                                v.specialtyCode = v.specialtyCode.toString();
                            });
                            $modelScope.fileInfoPro = {
                                peopleSelect: {
                                    selectMask: sogOguType.User,
                                    multiple: false
                                },
                                //是否全选
                                isCheckAll: false,
                                //添加
                                addItem: function () {
                                    $modelScope.data.materialFeedbackInfoList.push({
                                        canDelete: true,
                                        canEditFileName: true
                                    });
                                },
                                //删除
                                deleteItem: function () {
                                    var selected = false;
                                    if ($modelScope.data.materialFeedbackInfoList !== null || $modelScope.data.materialFeedbackInfoList.length > 0) {
                                        angular.forEach($modelScope.data.materialFeedbackInfoList, function (item) {
                                            if (item.checked)
                                                selected = true;
                                        });
                                    }
                                    if (selected === false) {
                                        sogModal.openAlertDialog('提示', "请选择需要删除行!");
                                        return;
                                    }
                                    var promise = sogModal.openConfirmDialog("提示", "确认是否删除?");
                                    promise.then(function (v) {
                                        for (var i = $modelScope.data.materialFeedbackInfoList.length - 1; i >= 0; i--) {
                                            var item = $modelScope.data.materialFeedbackInfoList[i];
                                            if (item.checked) {
                                                $modelScope.data.materialFeedbackInfoList.splice(i, 1);
                                            }
                                        }
                                        $modelScope.fileInfoPro.isCheckAll = false;
                                    });
                                },
                                //全选
                                checkAll: function () {
                                    for (var i = 0; i < $modelScope.data.materialFeedbackInfoList.length; i++) {
                                        var item = $modelScope.data.materialFeedbackInfoList[i];
                                        item.checked = !$modelScope.fileInfoPro.isCheckAll;
                                    }
                                },
                                //选择职能
                                specialtyChange: function (item) {
                                    angular.forEach($modelScope.data.specialty, function (v) {
                                        if (v.code === item.specialtyCode) {
                                            item.specialtyName = v.name;
                                            item.specialtyCode = v.code;
                                        }
                                    });
                                },
                                openpurchaseScheme: function (code) {
                                    var urlat = null;
                                    $http.get(seagull2Url.getPlatformUrl("/PublicApi/TicketStr?r=" + new Date().getTime()))
                                        .success(function (data) {
                                            urlat = data;
                                            if (urlat !== null) {
                                                urlat = urlat.replace(/"/g, "");
                                                var url = "";
                                                url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/purchaseSchemeApplication/?resourceID=" + code;
                                                if (url.indexOf("?") == -1) {
                                                    url = url + "?_at=" + urlat;
                                                } else {
                                                    url = url + "&_at=" + urlat;
                                                }
                                                $window.open(url, '_blank');
                                            }
                                        })
                                        .error(function (data, status) {
                                            errorDialog.openErrorDialog(data, status, "查看采购前置流程异常");
                                            wfWaiting.hide();
                                        });
                                }
                            }
                            var validData = function () {
                                var modelStateDictionary = ValidateHelper.validateData($modelScope, [
                                ]);
                                if ($modelScope.data.materialFeedbackInfoList != null && $modelScope.data.materialFeedbackInfoList.length > 0) {
                                    angular.forEach($modelScope.data.materialFeedbackInfoList, function (v, k) {
                                        var key = '第' + (k + 1) + '行资料反馈信息';
                                        if (v.specialtyCode == null || v.specialtyCode == "") {
                                            modelStateDictionary.addModelError('职能', key + '职能不能为空');
                                        }
                                        if (v.feedbackUser == null || v.feedbackUser == "") {
                                            modelStateDictionary.addModelError('反馈人员', key + '反馈人员不能为空');
                                        }
                                        if (v.feedbackContent == null || v.feedbackContent == "") {
                                            modelStateDictionary.addModelError('反馈内容与要求', key + '反馈内容与要求不能为空');
                                        }
                                        if (v.feedbackDeadline == null || v.feedbackDeadline == "0001-01-01T00:00:00" || v.feedbackDeadline == "") {
                                            modelStateDictionary.addModelError('反馈期限', key + '反馈期限不能为空');
                                        } else {
                                            var d = new Date(Date.parse(v.feedbackDeadline));
                                            var curDate = new Date();
                                            if (d <= curDate) {
                                                modelStateDictionary.addModelError('反馈期限', key + '反馈期限必须大于当前时间');
                                            }
                                        }
                                    });
                                    var materialFeedback = linq.from($modelScope.data.materialFeedbackInfoList).groupBy(x => x.specialtyName).select(x => ({ key: x.key(), names: x.getSource() })).where(x => x.names.length > 1).toArray();
                                    if (materialFeedback != null && materialFeedback.length > 0) {
                                        angular.forEach(materialFeedback, function (v) {
                                            modelStateDictionary.addModelError('职能', v.key + '不能重复');
                                        });
                                    }
                                } else {
                                    modelStateDictionary.addModelError("资料反馈", "资料反馈信息至少添加一行数据");
                                }
                                return modelStateDictionary;
                            }
                            //提交
                            $modelScope.confirm = function (v) {
                                var result = validData();
                                if (result.isValid()) {
                                    $modelScope.closeThisDialog();
                                } else {
                                    sogModal.openDialogForModelStateDictionary('验证不通过', result);
                                    sogValidator.broadcastResult(result.get());
                                }
                            }
                        }], $scope, { containerStyle: { width: '80%' } });
                    promise.then(function (v) {
                    }, function (v) { });
                };
            }
        }
    });
})


