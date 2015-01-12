angular.module('sample', ['ngSanitize'])

.directive('sampleDemo', function ($sce) {

    return {
        restrict: 'EA',
        replace: true,
        scope: {
            message: '=',
            class: '@'
        },
        templateUrl: 'template.html'
    }
});
