
//BUDGETCONTROLLER
var budgetController= (function(){
	var Expense=function(id,description,value){
		this.id=id;
		this.description=description;
		this.value=value;
		this.percentage=-1;
	};

	Expense.prototype.calcPercentage = function(totalIncome) {
		if(totalIncome>0){
			this.percentage = Math.round((this.value/totalIncome)*100);
		}else{
			this.percentage=-1;
		}

	};

	Expense.prototype.getPercentage = function(){
		return this.percentage;
	};

	var Income=function(id,description,value){
		this.id=id;
		this.description=description;
		this.value=value;
	};

	var calculateTotal =function(type){
		var sum =0;
		data.allItems[type].forEach(function(curr){
			sum =sum + curr.value;

         });
		data.totals[type]=sum; 

	};

	var data={
		allItems:{
			exp:[],
			inc:[]
		},
		totals:{
			exp:0,
			inc:0
		},
		budget:0,
		percentage:-1
	};

	return{
		 addItem:function(type,des,val){

			var newItem,Id;

			if(data.allItems[type].length>0){
				Id=data.allItems[type][data.allItems[type].length-1].id+1;
			}else{
				Id=0;
			}

			if(type==='exp'){
				newItem= new Expense(Id,des,val);
			}else if(type==='inc'){
				newItem= new Income(Id,des,val);
			}

			data.allItems[type].push(newItem);
			return newItem;
		},


		deleteItem:function(type,id){
			var ids,index;

			ids=data.allItems[type].map(function(current){
				return current.id;

			});
			index = ids.indexOf(id);
			if(index!==-1){
				data.allItems[type].splice(index,1);

			}

		},

		calculateBudget: function(){

          //calculate total income and expences
          calculateTotal('exp');
          calculateTotal('inc');

          //calculate the budget : income - expense
          data.budget=data.totals.inc -data.totals.exp; 

          // calculate the percentage of income that we spent
          if(data.totals.inc>0){
          data.percentage = Math.round((data.totals.exp / data.totals.inc)*100);
          }else{
          	data.percentage=-1;
          }
		},

		calculatePercentages:function(){

			data.allItems.exp.forEach(function(cur){
				cur.calcPercentage(data.totals.inc);
			});

		},

		getPercentages: function(){
			var allPerc = data.allItems.exp.map(function(cur){
               return cur.getPercentage();
			});

			return allPerc;

		},

		getBudget:function(){
			return {
				budget:data.budget,
				totalInc:data.totals.inc,
				totalExp:data.totals.exp,
				percentage:data.percentage

			};
		},

		testing:function(){
			console.log(data);
		}
	};
     

})();



//USERINTERFACE
var UIController = (function(){

	var Domstrings = {
		 inputType:'.add__type',
		 inputDescription: '.add__description',
		 inputValue :'.add__value',
		 inputBtn:'.add__btn',
		 incomeContainer:'.income__list',
		 expenseContainer:'.expenses__list',
		 budgetLabel:'.budget__value',
		 incomeLable:'.budget__income--value',
		 expensesLabel:'.budget__expenses--value',
		 percentageLable:'.budget__expenses--percentage',
		 container: '.container',
		 expensesPercLabel : '.item__percentage',
		 dateLabel :'.budget__title--month'
	};

	var formatNumber = function(num, type){
   	var numSplit, int, dec,type;

   	num = Math.abs(num);
   	num = num.toFixed(2);

   	numSplit = num.split('.');

   	int = numSplit[0];
   	if(int.length>3){
   		int = int.substr(0, int.length-3) + ',' + int.substr(int.length-3,3);
   	}

   	dec = numSplit[1];

   	return (type ==='exp' ? '-' : '+') + ' ' + int + '.' + dec;


   };

   	var nodeListForEach = function(list, callback){
   		for(var i=0; i< list.length;i++){
   			callback(list[i],i);
   		}
   	};

return {

   getInput: function(){
	  return{
         type: document.querySelector('.add__type').value,
         description:document.querySelector('.add__description').value,
         value:parseFloat(document.querySelector('.add__value').value)

	  };
   },

   addListItem:function(obj,type){
   	var html,newHtml,element;
   	if(type==='inc'){
   		element=Domstrings.incomeContainer;

   		html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

   	}else if(type==='exp'){
   		element=Domstrings.expenseContainer;

   		html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button</div></div></div>';

   	}

   	newHtml=html.replace('%id%',obj.id);
   	newHtml=newHtml.replace('%description%',obj.description);
   	newHtml=newHtml.replace('%value%',formatNumber(obj.value,type));

   	document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);

   },

   deleteListItem:function(selectorID){
   	var el = document.getElementById(selectorID);
   	el.parentNode.removeChild(el);
   },

   clearfield:function(){
   	var fields,fieldsArr;
    fields=document.querySelectorAll(Domstrings.inputDescription+','+Domstrings.inputValue);
    fieldsArr=Array.prototype.slice.call(fields);

    fieldsArr.forEach(function(current,index,Array){
    	current.value="";
    });
    fieldsArr[0].focus();

   },

   displayBudget: function(obj){
   	var type;
   	obj.budget>0 ? type = 'inc' : type ='exp';

   	document.querySelector(Domstrings.budgetLabel).textContent = formatNumber(obj.budget,type);
   	document.querySelector(Domstrings.incomeLable).textContent = formatNumber(obj.totalInc,'inc');
   	document.querySelector(Domstrings.expensesLabel).textContent = formatNumber(obj.totalExp,'exp') ;

   	if(obj.percentage>0){
   		document.querySelector(Domstrings.percentageLable).textContent=obj.percentage + '%';
   	}else{
   		document.querySelector(Domstrings.percentageLable).textContent='---';
   	}

   },

   displayPercentages : function(percentages) {
   	var fields = document.querySelectorAll(Domstrings.expensesPercLabel);

   

   	nodeListForEach(fields, function(current,index){

   		if(percentages[index]>0){
   			current.textContent = percentages[index] + '%';
   		}else {
   			current.textContent = '---';
   		}

   	});


   },

   displayMonth: function(){
   	var now, months,month,year;

   	now= new Date();

   	months = ['January', 'February','March', 'April','May','June','July','August','September','October','November','December'];
   	month = now.getMonth();

   	year= now.getFullYear();

   	document.querySelector(Domstrings.dateLabel).textContent= months[month] +' '+ year;

   },

   changedType: function(){
   	var fields = document.querySelectorAll(
   		Domstrings.inputType +',' + 
   		Domstrings.inputDescription + ',' +
   		Domstrings.inputValue);

   	nodeListForEach(fields,function(cur){
   		cur.classList.toggle('red-focus');

   	});

   	document.querySelector(Domstrings.inputBtn).classList.toggle('red');



   },
   getDomStrings: function(){
  	return Domstrings;
  	
  }


  };

   

})();




//APPCONTROLLER
var Controller = (function(budgetCtrl,UICtrl){

	var setupEventListener = function(){

		var DOM = UICtrl.getDomStrings();
		document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);

        document.addEventListener('keypress',function(event){
           if(event.keyCode ===13 || event.which===13){
           ctrlAddItem();
         }

      });

        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change',UICtrl.changedType);
	};

	var updateBudget= function(){
		//1. calculate the budget 
		budgetCtrl.calculateBudget();

		//2. Return the budget
		var budget = budgetCtrl.getBudget();
		
		//3. Display the budget on the UI
		UICtrl.displayBudget(budget);

	};

	var updatePercentages = function(){
		//1. Calculate percentages
		budgetCtrl.calculatePercentages();

		//2. Read percentages from the budget controller.
		var  percentages = budgetCtrl.getPercentages();

		// 3. Update the UI with the new percentages.
		UICtrl.displayPercentages(percentages);

	};
 
 
var ctrlAddItem = function(){
var input,newItem;
//1. Get the frist input data.

 input= UICtrl.getInput();

if(input.description!=="" && input.value>0 && !isNaN(input.value)){

//2. Add the item to the budget controller.
 newItem= budgetCtrl.addItem(input.type,input.description,input.value);

//3. Add the item to the UI.
UICtrl.addListItem(newItem, input.type);

// 4.clear the fields
UICtrl.clearfield();

//5. calculate and update budget.
updateBudget();

//6. calculate and update percentages.
updatePercentages(); 

}
	
};

var ctrlDeleteItem= function(event){
	var itemID,splitID,type,ID;

	itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;
    if(itemID){
    	splitID= itemID.split('-');
    	type=splitID[0];
    	ID=parseInt(splitID[1]);

    	//1. Delete the item from the data structure.
    	budgetCtrl.deleteItem(type,ID);


    	//2. delete the item form the UI
    	UICtrl.deleteListItem(itemID);

    	//3. update and show the new budget.
    	updateBudget();
    }

};
return{
	init:function(){
		UICtrl.displayMonth();
		UICtrl.displayBudget({
			budget:0,
			totalInc:0,
			totalExp:0,
			percentage:-1
		});
		setupEventListener();
	}
    
};


})(budgetController,UIController);

Controller.init();