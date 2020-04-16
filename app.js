//Budget Controller
const budgetController = (function(){

    class Expense{

        constructor(id,description,value){
            this.id = id;
            this.description = description;
            this.value = value;
            this.percentage = -1;
        }

        calculatePercentage(totalIncome) {
             
            if (totalIncome > 0) {
                this.percentage = Math.round((this.value/totalIncome)*100);
            } else {
                this.percentage = -1;
            }
            
        }

        getPercentages() {
            return this.percentage;
        }
    }

    class Income{

        constructor(id,description,value){
            this.id = id;
            this.description = description;
            this.value = value;
        }
    }

    let calculateTotal = function(type) {

        let sum = 0;

        data.allItems[type].forEach(function(cur) {

            sum += cur.value;
        });
        data.totals[type] = sum;
    };
    //Creating data entry or data Struc for all item objs and their value
    let data = {
        
        allItems: {

            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1

    };

    return {
        addItem: function(type, des, val){
             
           let newItem,ID;

            //creating IDs of every entry / By Ternary operator
             (data.allItems[type].length > 0) ? ID = data.allItems[type][data.allItems[type].length - 1].id + 1 : ID = 0;
           
            // if(data.allItems[type].length > 0){
            //     ID = data.allItems[type][data.allItems[type].length - 1].id + 1
            // } else{
            //     ID = 0;
            // }

            //create new items based on type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            
            //push in array as data entries
            data.allItems[type].push(newItem);
            return newItem;
        },

        deleteItem: function(type, id){

            let ids,index;

            ids = data.allItems[type].map(function(curr) {

                return curr.id;
            });

            index = ids.indexOf(id);

            if (index !== -1 ) {
                data.allItems[type].splice(index, 1);
 
            }
        },

        calculateBudget: function(){

            //Calculate total income and expense
            calculateTotal('exp');
            calculateTotal('inc');

            //Calculate the budget: income/expense
            data.budget = data.totals.inc - data.totals.exp;
            
            //calculate the percentage of expenses
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        }, 

        calculatePercentages: function() {

            data.allItems.exp.forEach(function(cur) {
                cur.calculatePercentage(data.totals.inc);
            });
        },

        getPercentages: function() {

            let allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentages();
            });
            return allPerc;
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        testing: function(){
            console.log(data);
        }
    }
    
})();

//User Interface Controller
const UIController = (function(){

    const  DomStrings = {
        intputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dataLabel: '.budget__title--month'

    };

    const formatNumb = function(num, type) {

        let numSplit,int,dec;

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;


    };

    const nodeListForEach = function(list, callback) {
        for (let i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    return {
           getInput: function(){
            
            return{
                type: document.querySelector(DomStrings.intputType).value, //will be either inc or exp
                description: document.querySelector(DomStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DomStrings.inputValue).value)
            
            };            
        },

            addListItem: function(obj, type) {

                let html,newHtml,element;
                // Create HTML strings with place holder text

                if(type === 'inc'){
                    element = DomStrings.incomeContainer;

                    html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>  </div></div></div>';             

                } else if (type === 'exp') {
                    element = DomStrings.expenseContainer;
                    html =  '<div class="item clearfix" id="exp-%id%">  <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div>  <div class="item__percentage">21%</div>  <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
                  
                }

                // Replace thw placeholder text with actual data
                      newHtml = html.replace('%id%', obj.id);
                      newHtml = newHtml.replace('%description%', obj.description);
                      newHtml = newHtml.replace('%value%', formatNumb(obj.value, type)); 
                
                // Insert the HTML in DOM
                document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

            },

            deleteListItem: function(selectorID) {
                 
                let el;
                
                el = document.getElementById(selectorID);
                el.parentNode.removeChild(el);

            },

            clearFields: function(){
                
                let fields,fieldsArr;

                fields = document.querySelectorAll(DomStrings.inputDescription + ',' + DomStrings.inputValue );
                
                //converts list to array
                fieldsArr = Array.prototype.slice.call(fields);

                fieldsArr.forEach(function(curr,index,array){

                    curr.value = "";
                    fieldsArr[0].focus();
                });
            },

            displayBudget: function(obj) {

                obj.budget > 0 ? type = 'inc' : type = 'exp';

                document.querySelector(DomStrings.budgetLabel).textContent = formatNumb(obj.budget, type);
                document.querySelector(DomStrings.incomeLabel).textContent = formatNumb(obj.totalInc,'inc');
                document.querySelector(DomStrings.expensesLabel).textContent = formatNumb(obj.totalExp, 'exp');
               
                if (obj.percentage > 0) {
                    document.querySelector(DomStrings.percentageLabel).textContent = obj.percentage + '%';
                } else {
                    document.querySelector(DomStrings.percentageLabel).textContent = '---';
            
                }
            },

            displayPercentages: function(percentages) {

                const fields = document.querySelectorAll(DomStrings.expensesPercLabel);
                                
                nodeListForEach(fields, function(cur, index) {

                    if (percentages[index] > 0) {
                        cur.textContent = percentages[index] + '%';        
                    } else {
                        cur.textContent = '---';
                    }
                   
                });
            },

            displayMonth: function() {

                let year,month;
                let now = new Date();

                months = ['January','Febuary','March','April','May','June','July','August','September','October','November','December'];

                month = now.getMonth();                
                year = now.getFullYear();

                document.querySelector(DomStrings.dataLabel).textContent = months[month] + " " + year;
            },

            changedType: function() {
            
                var fields = document.querySelectorAll(
                    DomStrings.intputType + ',' +
                    DomStrings.inputDescription + ',' +
                    DomStrings.inputValue);
                
                nodeListForEach(fields, function(cur) {
                   cur.classList.toggle('red-focus'); 
                });
                
                document.querySelector(DomStrings.inputBtn).classList.toggle('red');
                
            },
            

            getDomStrings: function(){
                return DomStrings;
            }
    };
})();

//Application Controller
const appControl = (function(budgetCtrl,UICtrl) {

    //Event Handlers
    const eventListerners = function(){
        
    //Dom strings
    const Dom = UICtrl.getDomStrings();
    
    //Events
    document.querySelector(Dom.inputBtn).addEventListener('click', cntrlAddItem);

    document.addEventListener('keypress', function(event){
        
        if(event.keyCode === 13 || event.which === 13){
            
            cntrlAddItem();
        }
 
        
     });

     document.querySelector(Dom.container).addEventListener('click', ctrlDeleteItem);
     document.querySelector(Dom.intputType).addEventListener('change', UICtrl.changedType);
    } ;   

    const updateBudget = function(){
        
        //1. Calculate the budget
        budgetCtrl.calculateBudget();
        //2. Return the budget
        let budget = budgetCtrl.getBudget();

        //3. Display the Budget on the UI
        UICtrl.displayBudget(budget);
    };

    const updatePercentages = function() {

        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();

        // 2. Read percentages from the budget controller
        let percentages = budgetCtrl.getPercentages();

        // 3. Update the UI with the new percentages
        UICtrl.displayPercentages(percentages);
    };

    //function to add new data items
    const cntrlAddItem = function(){
             
        let input,newItem; 
        
         //1. Get input data
        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0){

            //2. Add the item to the budget Controller
            newItem = budgetCtrl.addItem(input.type,input.description,input.value);
            
            //3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            //4. Clear the fields
            UICtrl.clearFields();
            
            //5. Calculate and Update Budget
            updateBudget();

            //6. Calculate and update percentages
            updatePercentages();
        }
        
    };
 
    //Function to Delete items
    const ctrlDeleteItem = function(event) {

        let itemID,splitID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID){

            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. Delete item from data Struc
            budgetController.deleteItem(type, ID);
            // 2. Delete item from UI
            UICtrl.deleteListItem(itemID);

            // 3. Update and show the new budget
            updateBudget();

        }
    };

    return {
        init: function(){
            console.log('Its working');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0
            });
            eventListerners();
        }
    };
          
})(budgetController,UIController);

appControl.init(); 

