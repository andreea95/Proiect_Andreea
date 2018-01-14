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
		
	$scope.addContact = function(opera_arta){
		$http.post(SERVER + '/persoane/' + $stateParams.personId + '/contact_info', opera_arta)
			.then(function(response) { $state.go($state.current, {}, {reload: true}) })
			.catch(function(response) {
				console.log(response)
					$scope.status = 'error'
			})		
	}

    $scope.deleteContact = function(opera_arta) {
		$http.delete(SERVER + '/persoane/' +  $stateParams.personId + '/contact_info/' + opera_arta.id)
			.then(function(response) { $state.go($state.current, {}, { reload: true }) })
			.catch(function(response) {
				console.log(response)
					$scope.status = 'error'
			})		
	}
		
	$scope.selected = {}
	
	$scope.getTemplate = function(opera_arta) {
		if (opera_arta.id === $scope.selected.id) { return 'edit' }  
			else { return 'display' }
	}
		
	$scope.editContact = function(opera_arta) {
	    $scope.selected = angular.copy(opera_arta)
	}
	
	 $scope.saveContact = function(opera_arta) {
	 	console.log('sending')
	 	console.log(opera_arta)
			$http.put(SERVER + '/persoane/' +  $stateParams.personId + '/contact_info/' + opera_arta.id, opera_arta)
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