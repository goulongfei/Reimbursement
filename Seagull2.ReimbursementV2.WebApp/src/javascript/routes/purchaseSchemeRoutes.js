define(['app'], function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var csspathBase = "https://cdn.sinoocean-test.com/libs/seagull2-workflow-responsive/1.0.4/";

        //拟单申请页
        $stateProvider.state('purchaseSchemeApplicationState', {
            url: '/purchaseSchemeApplication',
            useWorkflow: true,
            workflowUrlBase: '/PurchaseSchemeApplicationWf',
            workflowScene: {
                'Application': {
                    templateUrl: './views/purchaseScheme/purchaseSchemeApplication.html',
                    controller: 'purchaseSchemeApplication_controller',
                    controllerUrl: './javascript/controllers/purchaseScheme/purchaseSchemeApplication-controller.js'
                },
                'ApplicationReadOnly': {
                    templateUrl: './views/purchaseScheme/purchaseSchemeScheduleTracking.html',
                    controller: 'purchaseSchemeScheduleTracking_controller',
                    controllerUrl: './javascript/controllers/purchaseScheme/purchaseSchemeScheduleTracking-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/purchaseScheme/purchaseSchemeScheduleTracking.html',
                    controller: 'purchaseSchemeScheduleTracking_controller',
                    controllerUrl: './javascript/controllers/purchaseScheme/purchaseSchemeScheduleTracking-controller.js'
                },
                'DefaultCirculationSceneReadOnly': {
                    templateUrl: './views/purchaseScheme/purchaseSchemeScheduleTracking.html',
                    controller: 'purchaseSchemeScheduleTracking_controller',
                    controllerUrl: './javascript/controllers/purchaseScheme/purchaseSchemeScheduleTracking-controller.js'
                },
                'fileProvidedReadOnly': {
                    templateUrl: './views/purchaseScheme/purchaseSchemeScheduleTracking.html',
                    controller: 'purchaseSchemeScheduleTracking_controller',
                    controllerUrl: './javascript/controllers/purchaseScheme/purchaseSchemeScheduleTracking-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        //进度跟踪
        $stateProvider.state('purchaseSchemeScheduleTrackingState', {
            url: '/purchaseSchemeScheduleTracking',
            useWorkflow: true,
            workflowUrlBase: '/PurchaseSchemeApplicationWf',
            workflowScene: {
                'ScheduleTracking': {
                    templateUrl: './views/purchaseScheme/purchaseSchemeScheduleTracking.html',
                    controller: 'purchaseSchemeScheduleTracking_controller',
                    controllerUrl: './javascript/controllers/purchaseScheme/purchaseSchemeScheduleTracking-controller.js'
                },
                'ScheduleTrackingReadOnly': {
                    templateUrl: './views/purchaseScheme/purchaseSchemeScheduleTracking.html',
                    controller: 'purchaseSchemeScheduleTracking_controller',
                    controllerUrl: './javascript/controllers/purchaseScheme/purchaseSchemeScheduleTracking-controller.js'
                },
                'Application': {
                    templateUrl: './views/purchaseScheme/purchaseSchemeApplication.html',
                    controller: 'purchaseSchemeApplication_controller',
                    controllerUrl: './javascript/controllers/purchaseScheme/purchaseSchemeApplication-controller.js'
                },
                'ApplicationReadOnly': {
                    templateUrl: './views/purchaseScheme/purchaseSchemeScheduleTracking.html',
                    controller: 'purchaseSchemeScheduleTracking_controller',
                    controllerUrl: './javascript/controllers/purchaseScheme/purchaseSchemeScheduleTracking-controller.js'
                },
                'fileProvided': {
                    templateUrl: './views/purchaseScheme/purchaseSchemeScheduleTracking.html',
                    controller: 'purchaseSchemeScheduleTracking_controller',
                    controllerUrl: './javascript/controllers/purchaseScheme/purchaseSchemeScheduleTracking-controller.js'
                },
                'fileProvidedReadOnly': {
                    templateUrl: './views/purchaseScheme/purchaseSchemeScheduleTracking.html',
                    controller: 'purchaseSchemeScheduleTracking_controller',
                    controllerUrl: './javascript/controllers/purchaseScheme/purchaseSchemeScheduleTracking-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        //资料提供
        $stateProvider.state('purchaseSchemefileInfoProvidedState', {
            url: '/purchaseSchemefileInfoProvided',
            useWorkflow: true,
            workflowUrlBase: '/PurchaseSchemefileInfoProvidedWf',
            workflowScene: {
                'fileProvided': {
                    templateUrl: './views/purchaseScheme/purchaseSchemefileInfoProvided.html',
                    controller: 'purchaseSchemefileInfoProvided_controller',
                    controllerUrl: './javascript/controllers/purchaseScheme/purchaseSchemefileInfoProvided-controller.js'
                },
                'fileProvidedReadOnly': {
                    templateUrl: './views/purchaseScheme/purchaseSchemefileInfoProvidedReadOnly.html',
                    controller: 'purchaseSchemefileInfoProvidedReadOnly_controller',
                    controllerUrl: './javascript/controllers/purchaseScheme/purchaseSchemefileInfoProvidedReadOnly-controller.js'
                },
                'DefaultCirculation': {
                    templateUrl: './views/purchaseScheme/purchaseSchemefileInfoProvidedReadOnly.html',
                    controller: 'purchaseSchemefileInfoProvidedReadOnly_controller',
                    controllerUrl: './javascript/controllers/purchaseScheme/purchaseSchemefileInfoProvidedReadOnly-controller.js'
                },
                'DefaultCirculationSceneReadOnly': {
                    templateUrl: './views/purchaseScheme/purchaseSchemefileInfoProvidedReadOnly.html',
                    controller: 'purchaseSchemefileInfoProvidedReadOnly_controller',
                    controllerUrl: './javascript/controllers/purchaseScheme/purchaseSchemefileInfoProvidedReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 催办通知
        $stateProvider.state('purchaseSchemeNotifyState', {
            url: '/purchaseSchemeNotify',
            templateUrl: './views/purchaseScheme/purchaseSchemeNotify.html',
            controller: 'purchaseSchemeNotify_controller',
            controllerUrl: './javascript/controllers/purchaseScheme/purchaseSchemeNotify-controller.js',
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });

        // 催办通知-拟单人
        $stateProvider.state('purchaseSchemeNotifyToCreatorState', {
            url: '/purchaseSchemeNotifyToCreator',
            templateUrl: './views/purchaseScheme/purchaseSchemeNotifyToCreator.html',
            controller: 'purchaseSchemeNotifyToCreator_controller',
            controllerUrl: './javascript/controllers/purchaseScheme/purchaseSchemeNotifyToCreator-controller.js',
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
    }]);
});