angular.module('firstApp',[])
		.controller('mainController',function(){
			// bind this to vm (view-model)
			var vm = this;
			// define variables and objects on this
    		// this lets them be available to our views
		
    		vm.message = 'Hey there!'

    		vm.computers = [
    		{name:'macbook pro',color:'silver', nerdness:7},
    		{name:'Yoga 2 Pro',color:'silver', nerdness:6},
    		{name:'Chromebook',color:'black', nerdness:5}
    		];

    		// information that comes from our form
    		vm.computerData = {};

    		vm.addComputer = function() {
    			// add a computer to the list
    			vm.computers.push({
    				name: vm.computerData.name,
    				color: vm.computerData.color,
    				nerdness: vm.computerData.nerdness
    			});
    			//clears form
    			vm.computerData = {};

    		}

		});