// Delgetstei ajillah controller
var uiController = (function() {
    var DOMstrings = {
        inputType: ".add__type",
        inputDescription : ".add__description",
        inputValue: ".add__value",
        addBtn: ".add__btn",
        incomeList: ".income__list",
        expenseList: ".expenses__list",
        tusuvLabel: ".budget__value",
        incomeLabel: ".budget__income--value",
        expenseLabel: ".budget__expenses--value",
        percentageLabel: ".budget__expenses--percentage",
        containerDiv: ".container",
        expensePercentageLabel: ".item__percentage",
        dateLabel: ".budget__title--month"
    };
    var nodeListForeach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i, list);
        }
    };
    var formatMoney = function(too, type) {
        too = " " + too;
        var x = too.split("").reverse().join("");
        var y = "";
        var count = 1;
        for (var i = 0; i < x.length; i++) {
            y = y + x[i];
            if (count % 3 === 0) y = y + ",";
            count ++;
        }
        var z = y.split("").reverse().join(""); 
        if (z[0] === ",") z = z.substring(1, z.length - 1);
        if (type === "inc") z = "+" + z;
         else z = "-" + z;
         return z;
    };
    return {
        displayDate: function() {
            var unuudur = new Date();
            document.querySelector(DOMstrings.dateLabel).textContent = unuudur.getFullYear() + " oni " + unuudur.getMonth() + " sariin ";
        }, 

        getInput : function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // inc, exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseInt(document.querySelector(DOMstrings.inputValue).value)
           };  
        },

        displayPercentages: function(allPercentages) {
            // Zarlaga-n NodeList-iig DOM-s oloh
            var elements = document.querySelectorAll(DOMstrings.expensePercentageLabel);

            // Element bolgonii huvid zarlagiin huviig massiv-s avch shivj oruulah
            nodeListForeach(elements, function(el, index) {
                el.textContent = (allPercentages[index]) + " %";
            });
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

        tusviigUzuuleh: function(tusuv) {
            var type;
            if (tusuv.tusuv > 0) type = "inc";
            else type = "exp";
            document.querySelector(DOMstrings.tusuvLabel).textContent = formatMoney(tusuv.tusuv, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatMoney(tusuv.totalInc, "inc");
            document.querySelector(DOMstrings.expenseLabel).textContent = formatMoney(tusuv.totalExp, "exp");
            if(tusuv.huvi > 0) {
            document.querySelector(DOMstrings.percentageLabel).textContent = tusuv.huvi + "%";
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = "0";
            }
        },

        addListItem: function(item, type) {
            // Orlogo, Zarlagain elementiig aguulsan html-iig beltgene
            var html, list;
            if(type === "inc") {
                list = DOMstrings.incomeList;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%DESCRIPTION%</div><div class="right clearfix"><div class="item__value">%VALUE%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else {
                list = DOMstrings.expenseList;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%DESCRIPTION%</div><div class="right clearfix"><div class="item__value">%VALUE%</div><div class="item__percentage"></div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            // Ter html dotoroo orlogo, zarlaga-n utguudiig REPLACE ashiglaj uurchilj ugnu
            html = html.replace('%id%', item.id);
            html = html.replace('%DESCRIPTION%', item.description);
            html = html.replace('%VALUE%', formatMoney(item.value, type));
            
            // Beltgesen HTML-ee DOM ruu hiij ugnu
            document.querySelector(list).insertAdjacentHTML('beforeend', html);
        },

        deleteListItem: function(id) {
            var el = document.getElementById(id);
            el.parentNode.removeChild(el);
        },
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
        this.percentage = -1;
    };
    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = 0;
        }
    };
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    }
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
            if ( data.totals.inc > 0) {
                data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.huvi = 0;
            }
        },

        calculatePercentages: function() {
            data.items.exp.forEach(function(el) {
                el.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function() {
            var allPercentages = data.items.exp.map(function(el) {
                return el.getPercentage();
            });
            return allPercentages;
        },

        tusuviigAvah : function() {
            return {
                tusuv: data.tusuv,
                huvi: data.huvi,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp
            }
        },

        deleteItem: function(type, id) {
            var ids = data.items[type].map(function(el) {
                return el.id;
            });
            var index = ids.indexOf(id);
            if (index !== -1) {
                data.items[type].splice(index, 1);
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

        // Tusuv-g shineer tsootsoolj, delgetsend haruulah
         updateTusuv();
        }
    };
    var updateTusuv = function() {
         // Tusuv-g tootsoolono
        financeController.tusuvTootsooloh();

        // Etsiin uldegdel tootsoog delgetsend gargana
         var tusuv = financeController.tusuviigAvah();
        
        // Tusuviin tootsoog delgetsend gargana
         uiController.tusviigUzuuleh(tusuv);

         // Elementuudiin huviig tootsoolono
        financeController.calculatePercentages();

         // Elementuudiig huviig huleej avna
         var allPercentages = financeController.getPercentages();

         // Edgeer huviig delgetsend garna
         uiController.displayPercentages(allPercentages);

    }
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
        document.querySelector(DOM.containerDiv).addEventListener('click', function(event) {
            var id = event.target.parentNode.parentNode.parentNode.parentNode.id;
            // inc-2, exp-1
            if (id) {
                var arr = id.split('-');
                var type = arr[0];
                var itemId = parseInt(arr[1]);

                // 1. sanhuugiin modul-s type, id ashiglaj usgana
                financeController.deleteItem(type, itemId);

                // 2. delgets deeres ene elemnt-g ustgana#
                uiController.deleteListItem(id);

                // 3. uldegdel tootsoog shinechilj haruulna
                updateTusuv();
            }        
        });
    };
    return {
        init: function() {
            console.log("Application started ..");
            uiController.displayDate();
            uiController.tusviigUzuuleh({
                tusuv: 0,
                huvi: 0,
                totalInc: 0,
                totalExp: 0
            });
            setUpEventListeners();
        }
    };
})(uiController, financeController);
appController.init();
