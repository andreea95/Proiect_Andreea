/*global angular*/
var app = angular.module('crudApp', [
	'ui.router',
	'persoaneController',
	'detaliiPersoanaController',
	'ngMessages'
	])
 
app.config(function($stateProvider, $urlRouterProvider) {   	
	$urlRouterProvider.otherwise("/persoane")
	$stateProvider
		.state('persoane', {
			url: "/persoane",
			templateUrl:'partials/persoane.html',
			controller:'persoaneController'
		})
		.state('detaliiPersoana', {
			url: "/persoane/:personId",
			templateUrl:'partials/contact_info.html',
			controller:'detaliiPersoanaController'
		})
})

