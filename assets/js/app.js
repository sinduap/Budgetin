// MODULS

// BUDGET CONTROLLLER
var budgetController = (function () {
    //code
    var Expense = function(id, description, value) {
        this.id = id,
        this.description = description,
        this.value = value
    };

    var Income = function(id, description, value) {
        this.id = id,
        this.description = description,
        this.value = value
    };

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
            data.totals[type] = sum;
        });
    };

    var data = {
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
    }

    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            // Buat ID baru
            if (data.allItems[type][data.allItems[type]-1] > 0) {
                ID = data.allItems[type][data.allItems[type]-1].id + 1;
            } else {
                ID = 0;
            }

            // Buat item baru berdasarkan exp / inc type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            // push ke data structure
            data.allItems[type].push(newItem);

            // return
            return newItem;
        },

        calculateBudget: function() {
            // Hitung total pemasukan dan pengeluaran
            calculateTotal('exp');
            calculateTotal('inc');
            // Hitung budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            // Hitung presentase income
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1
            }
        },

        getBudget: function() {
            return {
                budget: data.budget,
                income: data.totals.inc,
                expense: data.totals.exp,
                percentage: data.percentage
            }
        },

        testing: function() {
            console.log(data);
        }
    }

})();

// UI CONTROLLLER
var UIController = (function () {
    //code
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage'
    }
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value, // either inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }
        },

        addListItem: function(obj, type) {
            var html, newHtml, element;

            if (type === 'inc') {
                element = DOMStrings.incomeContainer;

                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMStrings.expensesContainer;

                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            // Replace placeholder text dengan data aktual
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Masukkan template HTML ke DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        getDOMStrings: function () {
            return DOMStrings;
        },

        displayBudget : function(obj) {
            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.income;
            document.querySelector(DOMStrings.expenseLabel).textContent = obj.expense;
            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + ' %';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }
        },

        clearFields: function() {
            var fields;
            // var fieldsArr;
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);

            // fieldsArr = Array.prototype.slice.call(fields);
            fields.forEach(function(cur, index, arr) {
                cur.value = '';
            });

            // fieldsArr[0].focus();
            fields[0].focus();
        }
    };
})();


// APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {
    //code
    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMStrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    };

    var updateBudget = function() {
        // 1. Hitung Budget
        budgetCtrl.calculateBudget();
        // 2. Return Budget
        var budget = budgetCtrl.getBudget();
        console.log(budget);
        // 3. Tampilkan budget ke UI
        UICtrl.displayBudget(budget);
    };

    // function ketika tombol enter ditekan atau add__btn diklik
    var ctrlAddItem = function () {
        // 1. Tangkap input data pada aplikasi
        var input, newItem;
        input = UICtrl.getInput();
        // Mencegah input tidak sesuai
        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
            // 2. Tambahkan item kedalam budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            budgetController.testing();
            // 3. Tampilkan item ke UI
            UICtrl.addListItem(newItem, input.type);
            // 4. Bersihkan input
            UICtrl.clearFields();
            // 5. Hitung dan update budget
            updateBudget();
        }        
    };

    return {
        init: function() {
            console.log('Application has started.');
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();