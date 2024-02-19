// Delgetstei ajillah controller
var uiController = (function() {
    var DOMstrings = {
        inputType: ".add__type",
        inputDescription : ".add__description",
        inputValue: ".add__value",
        addBtn: ".add__btn"
    };
    return {
        getInput : function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // inc, exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
           };  
        },
        getDOMstrings: function() {
            return DOMstrings;
        }
    };
})();

// Sanhuutei ajillah controller
var financeController = (function() {
    var Income = function(id, description, value) {
        this.id =  id;
        this.description = description;
        this.value = value;
    };
    var Expense = function(id, description, value) {
        this.id =  id;
        this.description = description;
        this.value = value;
    };
    var data = {
        items : {
            inc: [],
            exp: []
        },
        totals : {
            inc: 0,
            exp: 0
        }
    };
    return {
        addItem: function(type, description, value) {
            var item, id;
            if (data.items[type].length === 0) id = 1;
            else id = data.items[type][data.items[type].length-1].id + 1; 
            if (type === "inc") {
                item = new Income(id, description, value);          
            } else {
                item = new Expense(id, description, value);
            }
            data.items[type].push(item);
        },
        data: function() {
            return data;
        }
    }
})();

// Programm-n holbogch controller
var appController = (function(uiController, financeController) {
    var ctrlAddItem = function() {
    // Oruulah uguduliig delgetsees olj avna
    var input = uiController.getInput();

    // Olj avsan ugugduluudee sanhuugiiin controller-t damjuulj tend hadgalna
    financeController.addItem(input.type, input.description, input.value);
    
    // Olj avsan ugugduluudee web-deeree tohiroh hesegt gargana
    
    // Tusuv-g tootsoolono

    // Etsiin uldegdel tootsoog delgetsend gargana
    };
    var setUpEventListeners = function() {
        var DOM = uiController.getDOMstrings();
        document.querySelector(DOM.addBtn).addEventListener("click", function() {
            ctrlAddItem();
        });
        document.addEventListener("keypress", function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            };
        });
    };
    return {
        init: function() {
            console.log("Application started ..");
            setUpEventListeners();
        }
    };
})(uiController, financeController);
appController.init();
