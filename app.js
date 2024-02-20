// Delgetstei ajillah controller
var uiController = (function() {
    var DOMstrings = {
        inputType: ".add__type",
        inputDescription : ".add__description",
        inputValue: ".add__value",
        addBtn: ".add__btn",
        incomeList: ".income__list",
        expenseList: ".expenses__list"
    };
    return {
        getInput : function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // inc, exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseInt(document.querySelector(DOMstrings.inputValue).value)
           };  
        },
        getDOMstrings: function() {
            return DOMstrings;
        },

        clearFields : function() {
            var fields = document.querySelectorAll(
                DOMstrings.inputDescription + ", " + DOMstrings.inputValue
                ); // list bustaana
            
            // Convert List to Array
            var fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(el, index, array) {
                el.value = "";
            });
            fieldsArr[0].focus();
        },
        addListItem: function(item, type) {
            // Orlogo, Zarlagain elementiig aguulsan html-iig beltgene
            var html, list;
            if(type === "inc") {
                list = DOMstrings.incomeList;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%DESCRIPTION%</div><div class="right clearfix"><div class="item__value">%VALUE%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else {
                list = DOMstrings.expenseList;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%DESCRIPTION%</div><div class="right clearfix"><div class="item__value">%VALUE%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            // Ter html dotoroo orlogo, zarlaga-n utguudiig REPLACE ashiglaj uurchilj ugnu
            html = html.replace('%id%', item.id);
            html = html.replace('%DESCRIPTION%', item.description);
            html = html.replace('%VALUE%', item.value);
            
            // Beltgesen HTML-ee DOM ruu hiij ugnu
            document.querySelector(list).insertAdjacentHTML('beforeend', html);
        }
    }
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
        },
        tusuv: 0,
        huvi: 0
    };
    var calculateTotal = function(type) {
        var sum = 0;
        data.items[type].forEach(function(el) {
            sum = sum + el.value;
        });
        data.totals[type] = sum;
    }
    return {
        tusuvTootsooloh: function() {
            // Niit orlogiin niilberiig tootsoolono
            calculateTotal("inc");

            // Niit zarlag-g tootsoolono
            calculateTotal("exp");

            // Tusuviig shineer tootsoolono
            data.tusuv = data.totals.inc - data.totals.exp;

            // Orlogo zarlaga-n huviig tootsoolono
            data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100);

        },

        tusuviigAvah : function() {
            return {
                tusuv: data.tusuv,
                huvi: data.huvi,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp
            }
        },

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
            return item;
        },
        seeData: function() {
            return data;
        }
    }
})();

// Programm-n holbogch controller
var appController = (function(uiController, financeController) {
    var ctrlAddItem = function() {
    // Oruulah uguduliig delgetsees olj avna
    var input = uiController.getInput();
    if(input.description !== "" && input.value !== "") {
        // Olj avsan ugugduluudee sanhuugiiin controller-t damjuulj tend hadgalna
        var item = financeController.addItem(input.type, input.description, input.value);
        
        // Olj avsan ugugduluudee web-deeree tohiroh hesegt gargana
        uiController.addListItem(item, input.type);
        uiController.clearFields();
        
        // Tusuv-g tootsoolono
        financeController.tusuvTootsooloh();

        // Etsiin uldegdel tootsoog delgetsend gargana
        var tusuv = financeController.tusuviigAvah();

        // Tusuviin tootsoog delgetsend gargana
        console.log(tusuv);
        }
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
