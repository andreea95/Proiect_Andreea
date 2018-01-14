/*global angular*/
var app = angular.module("detaliiPersoanaController", ["ui.router"]);

var SERVER = 'https://gaby-chameleon-1994.c9users.io'

app.controller('detaliiPersoanaController', function($scope, $http, $state, $stateParams) {
	
	$scope.constructor = function() {
		$http.get(SERVER + '/persoane/' + $stateParams.personId)
		.then(function(response) {     
		    console.log(response.data)
				$scope.person = response.data
				
			return $http.get(SERVER + '/persoane/' + $scope.person.id + '/contact_info')
		})
		.then(function(response) {
			console.log(response.data)
				$scope.person.contact_info2 = response.data
		})
		.catch(function(response) {
			console.log(response)
				$scope.status = 'error'
		})			  
	}
		
	$scope.addContact = function(contact2){
		$http.post(SERVER + '/persoane/' + $stateParams.personId + '/contact_info', contact2)
			.then(function(response) { $state.go($state.current, {}, {reload: true}) })
			.catch(function(response) {
				console.log(response)
					$scope.status = 'error'
			})		
	}

    $scope.deleteContact = function(contact2) {
		$http.delete(SERVER + '/persoane/' +  $stateParams.personId + '/contact_info/' + contact2.id)
			.then(function(response) { $state.go($state.current, {}, { reload: true }) })
			.catch(function(response) {
				console.log(response)
					$scope.status = 'error'
			})		
	}
		
	$scope.selected = {}
	
	$scope.getTemplate = function(contact2) {
		if (contact2.id === $scope.selected.id) { return 'edit' }  
			else { return 'display' }
	}
		
	$scope.editContact = function(contact2) {
	    $scope.selected = angular.copy(contact2)
	}
	
	 $scope.saveContact = function(contact2) {
	 	console.log('sending')
	 	console.log(contact2)
			$http.put(SERVER + '/persoane/' +  $stateParams.personId + '/contact_info/' + contact2.id, contact2)
				.then(function(response) {     
					$state.go($state.current, {}, { reload: true })
				})
				.catch(function(response){
					console.log(response)
						$scope.status = 'error'
				})		
	}

	$scope.constructor();
	
})