(function (window, angular) {
    'use strict';

    $bankAccountInput.$inject = ['$templateCache', 'seagull2Url'];
    function $bankAccountInput($templateCache, seagull2Url) {
        return {
            restrict: 'A',
            scope: {
                data: '=bankAccountInput'
            },
            template: '<span sog-complex-input="data" opts="complexInputOpts">hello</span>',
            replace: false,
            link: {
                pre: function ($scope, $element, $attrs) {
                    $templateCache.put('bankAccount-input-tag-template.html',
                        '<span style="width: 100%;"  title="{{item.affiliatedBankName ||data.affiliatedBankName}}  {{item.displayName || data.displayName}}">{{item.displayName || data.displayName}}</span>'
                    );
                    $templateCache.put('bankAccount-input-select-modal-template-th.html',
                        '<div style="display: inline-block;padding: 5px;float: left;width: 100%;cursor: pointer;">银行账号</div>'
                    );
                    $templateCache.put('bankAccount-input-select-modal-template-tr.html',
                        '<div style="display: inline-block;padding: 5px;float: left;width: 100%;cursor: pointer;"><span>{{item.displayName}}</span></div>'
                    );

                    var tagItemTemplateUrl = 'bankAccount-input-tag-template.html';
                    var tableHeadTemplateUrl = 'bankAccount-input-select-modal-template-th.html';
                    var tableRowTemplateUrl = 'bankAccount-input-select-modal-template-tr.html';


                    var defaultOpts = {
                        multiple: false,
                        splitChar: ';',
                        root: null,
                        rootName: null,
                        beforeQuery: null,
                        beforeAddChildren: null,
                        bankCodeOpts: null,
                    };

                    if ($attrs.opts) {
                        $scope.opts = $scope.$parent.$eval($attrs.opts);
                    }
                    var defaultOptsClone = angular.copy(defaultOpts);
                    angular.extend(defaultOptsClone, $scope.opts || {});
                    $scope.opts = defaultOptsClone;



                    var uriConfig = {
                        bankAccountSearchUrl: seagull2Url.getPlatformUrl("/bankAccount/Search"),
                    };


                    var beforeQuery = function (e) {
                        if (angular.isObject(e.queryParam.context)) {
                            // 对应银行编码
                            if (angular.isString($scope.opts.bankCodeOpts)
                                && angular.isObject($scope.$parent.bankAccountOpts[$scope.opts.bankCodeOpts])) {
                                e.queryParam.context.BankCode = $scope.$parent.bankAccountOpts[$scope.opts.bankCodeOpts].bankCode;
                                if (!e.queryParam.context.BankCode
                                    && e.queryParam.context.BankCode == "0") {
                                    e.queryParam.context.BankCode = null;
                                }
                            }
                            // 对应银行分支机构编码
                            if (angular.isString($scope.opts.affiliatedBankCodeOpts)
                                && angular.isObject($scope.$parent.bankAccountOpts[$scope.opts.affiliatedBankCodeOpts])) {
                                e.queryParam.context.affiliatedBankCode = $scope.$parent.bankAccountOpts[$scope.opts.affiliatedBankCodeOpts].affiliatedBankCode;
                                if (!e.queryParam.context.affiliatedBankCode
                                    && e.queryParam.context.affiliatedBankCode == "0") {
                                    e.queryParam.context.affiliatedBankCode = null;
                                }
                            }
                            // 对应法人公司编码
                            if (angular.isString($scope.opts.corporationCodeOpts)
                                && angular.isObject($scope.$parent.bankAccountOpts[$scope.opts.corporationCodeOpts])) {
                                e.queryParam.context.corporationCode = $scope.$parent.bankAccountOpts[$scope.opts.corporationCodeOpts].corporationCode;
                                if (!e.queryParam.context.corporationCode
                                    && e.queryParam.context.corporationCode == "0") {
                                    e.queryParam.context.corporationCode = null;
                                }

                                if (angular.isFunction($scope.opts.callback))
                                    $scope.opts.callback(e.queryParam);

                            }
                            // 是否加载相关信息
                            e.queryParam.context.hasRelevantInfo = $scope.opts.hasRelevantInfo;
                            if (!e.queryParam.context.hasRelevantInfo) {
                                e.queryParam.context.hasRelevantInfo = false;
                            }
                        }
                    };

                    $scope.complexInputOpts = {
                        multiple: $scope.opts.multiple,
                        root: $scope.opts.root,
                        rootName: $scope.opts.rootName,
                        searchUrl: uriConfig.bankAccountSearchUrl,
                        showSelector: false,
                        tagItemTemplateUrl: tagItemTemplateUrl,
                        tableHeadTemplateUrl: tableHeadTemplateUrl,
                        tableRowTemplateUrl: tableRowTemplateUrl,
                        beforeQuery: beforeQuery,
                    };
                }
            }
        };
    }

    var module = angular.module('angular-seagull2-bankAccountprovider.bankAccount-input', [
        'angular-seagull2-common',
        'angular-seagull2-infrastructure.templates'
    ]);
    module.directive('bankAccountInput', $bankAccountInput);

})(window, window.angular);

(function (angular) {
    'use strict';

    angular.module('angular-seagull2-bankAccountprovider', [
        'angular-seagull2-bankAccountprovider.bankAccount-input'
    ]);

}(window.angular));