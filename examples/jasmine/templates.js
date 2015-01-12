angular.module('templates-main', ['template.html']);

angular.module('template.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('template.html', '<div class={{class}}>{{message}}</div>');
}]);
