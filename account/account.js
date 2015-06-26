angular.module('ngBoilerplate.account',['ui.router','ngResource'])
.config(function config2 ($stateProvider){
    $stateProvider.state('login',{
        url:'/login',
        views:{
             'main':{
                 templateUrl:'account/login.tpl.html',
                 controller:'loginCtrl'
             }
        },
        data:{
             pageTitle: 'Login'
        }

    })
    .state('register',{
            url:'/register',
            views:{
                'main':{
                    templateUrl:'account/register.tpl.html',
                    controller:'registerCtrl'
                }
            },
            data:{
                pageTitle: 'Registration'
            }

        });
 })
.factory('accountService',function(){
        var session = {
            login : function(data){
                console.log(data);
                localStorage.setItem("session",data);
            },
            logout : function (){
                localStorage.removeItem("session");
            },
            isLoggedIn : function(){
                return localStorage.getItem("session")!=null;
            }
       };

        return session;

    })
.factory('sessionService',function($resource){
        var service = {
            register : function(account, success, failure){
                var Account = $resource('/angular/rest/accounts');
                Account.save({},account,success,failure);
             },
            userExist : function(account, success, failure){
                var Account = $resource('/angular/rest/accounts');
                var data = Account.get({name:account.name},
                    function () {
                        var accounts = data.accounts;
                        if(accounts.length!==0){
                            success(accounts[0]);
                        }else{
                            failure();
                        }
                    },
                    failure
                );
            }
        };
        return service;
    })
.controller('loginCtrl',function($scope,accountService,$state,sessionService){
     $scope.login = function(){
         sessionService.userExist(
             $scope.account,
             function(account){
                 accountService.login(account);
                 $state.go("home");
             },
             function(){
                 alert("error al obtener los datos");
             });

     };
})
.controller('registerCtrl',function($scope, accountService, $state, sessionService){
     $scope.register = function(){
         sessionService.register($scope.account,
         function(returnedData){
             console.log("datos retornados"+returnedData);
             accountService.login(returnedData);

             $state.go("home");
         },
         function(){
             alert("Hola es un error");
         });
     };
});