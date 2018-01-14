/*global angular*/
var app = angular.module("persoaneController",["ui.router"]);

var SERVER = 'https://gaby-chameleon-1994.c9users.io'

app.controller('persoaneController', function($scope, $http, $state) {
	
	$scope.constructor = function() {
		$http.get(SERVER + '/persoane')
			.then(function(response) {     
			    console.log(response.data)
				$scope.people = response.data
			})
			//scope.artisti
			.catch(function(response){
				console.log(response)
				$scope.status = 'error'
			})		  	
	}

	$scope.addPerson = function(person){
		$http.post(SERVER + '/persoane', person)
			.then(function(response) {     
				$state.go($state.current, {}, {reload: true})
			})
			.catch(function(response){
				console.log(response)
				$scope.status = 'error'
			})		
	}

    $scope.deletePerson = function(person){
		$http.delete(SERVER + '/persoane/ ' + person.id)
			.then(function(response) {     
				$state.go($state.current, {}, {reload: true})
			})
			.catch(function(response){
				console.log(response)
				$scope.status = 'error'
			})	
	}
	
	$scope.selected = {}
	$scope.getTemplate = function(person) {
		if (person.id === $scope.selected.id){
			return 'edit'
		}  
		else{ 
			return 'display'
		}
	}
	
	$scope.editPerson = function (person) {  
	    $scope.selected = angular.copy(person)
	}
	
	 $scope.savePerson = function(person){
		$http.put(SERVER + '/persoane/' + person.id, person)
			.then(function(response) {     
				$state.go($state.current, {}, {reload: true})
			})
			.catch(function(response){
				console.log(response)
				$scope.status = 'error'
			})		
	}

	$scope.constructor();
})



