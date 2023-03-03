(function (window, angular) {
    'use strict';

    $affiliatedBankInput.$inject = ['$templateCache', 'seagull2Url'];
    function $affiliatedBankInput($templateCache, seagull2Url) {
        return {
            restrict: 'A',
            scope: {
                data: '=affiliatedBankInput'
            },
            template: '<span sog-complex-input="data" opts="complexInputOpts">hello</span>',
            replace: false,
            link: {
                pre: function ($scope, $element, $attrs) {
                    $templateCache.put('affiliatedBank-input-tag-template.html',
                       '<span style="width:100%;"  title="{{item.displayName || data.displayName}}">{{item.displayName || data.displayName}}1111</span>'
                   );
                    $templateCache.put('affiliatedBank-input-select-modal-template-th.html',
                        '<div style="display: inline-block;padding: 5px;float: left;width: 100%;cursor: pointer;">名称</div>'
                    );
                    $templateCache.put('affiliatedBank-input-select-modal-template-tr.html',
                        '<div style="display: inline-block;padding: 5px;float: left;width: 100%;cursor: pointer;"><span>{{item.displayName}}</span></div>'
                    );

                    var tagItemTemplateUrl = 'affiliatedBank-input-tag-template.html';
                    var tableHeadTemplateUrl = 'affiliatedBank-input-select-modal-template-th.html';
                    var tableRowTemplateUrl = 'affiliatedBank-input-select-modal-template-tr.html';


                    var defaultOpts = {
                        multiple: false,
                        splitChar: ';',
                        root: null,
                        rootName: null,
                        beforeQuery: null,
                        beforeAddChildren: null,
                        bankCodeOpts: null,
                    };
                    var a = $attrs.opts;

                    if ($attrs.opts) {
                        $scope.opts = $scope.$parent.$eval($attrs.opts);
                    }

                    var defaultOptsClone = angular.copy(defaultOpts);
                    angular.extend(defaultOptsClone, $scope.opts || {});
                    $scope.opts = defaultOptsClone;

                    var uriConfig = {
                        affiliatedBankSearchUrl: seagull2Url.getPlatformUrl("/AffiliatedBank/Search"),
                    };

                    var beforeQuery = function (e) {
                        if (angular.isObject(e.queryParam.context)) {
                            e.queryParam.context.BankCode = $scope.$parent.$parent.affiliatedBankOpts[$scope.opts.bankCodeOpts].bankCode;
                            if (e.queryParam.context.BankCode == "0") {
                                e.queryParam.context.BankCode = null;
                            }
                        }
                    };

                    $scope.complexInputOpts = {
                        multiple: $scope.opts.multiple,
                        root: $scope.opts.root,
                        rootName: $scope.opts.rootName,
                        searchUrl: uriConfig.affiliatedBankSearchUrl,
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

    var module = angular.module('angular-seagull2-affiliatedBankprovider.affiliatedBank-input', [
        'angular-seagull2-common',
        'angular-seagull2-infrastructure.templates'
    ]);
    module.directive('affiliatedBankInput', $affiliatedBankInput);

})(window, window.angular);

(function (angular) {
    'use strict';

    angular.module('angular-seagull2-affiliatedBankprovider', [
        'angular-seagull2-affiliatedBankprovider.affiliatedBank-input'
    ]);

}(window.angular));