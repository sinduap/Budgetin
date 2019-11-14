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

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        total: {
            exp: 0,
            inc: 0
        }
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
        expensesContainer: '.expenses__list'
    }
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value, // either inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
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
            console.log(html, element);
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Masukkan HTML pada DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        getDOMStrings: function () {
            return DOMStrings;
        }
    };
})();


// APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {
    //code
    var setupEventListeners = function () {
        var DOM = UIController.getDOMStrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    };

    // function ketika tombol enter ditekan atau add__btn diklik
    var ctrlAddItem = function () {
        // 1. Tangkap input data pada aplikasi
        var input, newItem;
        input = UIController.getInput();
        // console.log(input);
        // 2. Tambahkan item kedalam budget controller
        newItem = budgetController.addItem(input.type, input.description, input.value);
        budgetController.testing();
        // 3. Tampilkan item ke UI
        UIController.addListItem(newItem, input.type);
        // 4. Hitung
        // 5. Tampilkan budget ke UI
    };

    return {
        init: function() {
            console.log('Application has started.');
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();