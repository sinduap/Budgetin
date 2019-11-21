// 3 MAIN MODULS

// BUDGET CONTROLLLER
var budgetController = (function () {
    //code
    var Expense = function(id, description, value) {
        this.id = id,
        this.description = description,
        this.value = value,
        this.percentage = -1
    };

    Expense.prototype.calcPercentage = function(totalIncome) {
        console.log(totalIncome);
        if (data.totals.inc > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    var Income = function(id, description, value) {
        this.id = id,
        this.description = description,
        this.value = value
    };

    var calculateTotal = function(type) {
        var sum = 0;
        if (data.allItems[type].length === 0) {
            data.totals[type] = sum;
        } else {
            data.allItems[type].forEach(function(cur) {
                sum += cur.value;
                data.totals[type] = sum;
            });
        }
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
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
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

        deleteItem: function(type, id) {
            // id 1
            var ids, index;
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
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

        calculatePercentages: function() {
            data.allItems.exp.forEach(function(cur) {
                cur.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            });
            return allPerc;
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
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    var formatNumber = function(num, type) {
        var numSplit, int, dec;
        /* 
        + atau - sebelum angka 
        2 desimal
        koma pada tiap ribuan
        contoh: inc 23456.3474 --> + 23,456.35
        */
        num = Math.abs(num);
        console.log(num);
        num = num.toFixed(2);
        console.log(num);
        numSplit = num.split('.');
        int = numSplit[0];
        dec = numSplit[1];
        console.log(dec);

        if (int.length > 9) {
            int = int.substr(0, int.length - 9) + ',' + int.substr(int.length - 9, int.length - 6) + ',' + int.substr(int.length - 6, int.length - 3) + ',' + int.substr(int.length - 3, int.length);
        } else if (int.length > 6) {
            int = int.substr(0, int.length - 6) + ',' + int.substr(int.length - 6, int.length - 3) + ','  + int.substr(int.length - 3, int.length);
        } else if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length);
        }

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

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

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline">x</i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMStrings.expensesContainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn">x<i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            // Replace placeholder text dengan data aktual
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            // Masukkan template HTML ke DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function(selectorId) {
            var el;
            el = document.getElementById(selectorId).remove();
        },

        displayPercentages: function(percentages) {
            var fields = document.querySelectorAll(DOMStrings.expensesPercLabel)

            var nodeListForEach = function(list, callback) {
                for (var i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }
            };

            nodeListForEach(fields, function(current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
        },

        getDOMStrings: function () {
            return DOMStrings;
        },

        displayBudget : function(obj) {
            obj.budget >= 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.income, type);
            document.querySelector(DOMStrings.expenseLabel).textContent = formatNumber(obj.expense, type);
            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + ' %';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }
        },

        displayMonth: function() {
            var now, year;
            now = new Date();
            year = now.getFullYear();
            document.querySelector(DOMStrings.dateLabel).textContent = year;
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

            document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
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

    var updatePercentages = function() {
        // 1. Hitung persentase
        budgetController.calculatePercentages();
        // 2. Baca persentase dari budget controller
        var percentages = budgetController.getPercentages();
        console.log(percentages);
        // 3. Update UI dengan persentase baru
        UIController.displayPercentages(percentages);
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
            // 6. Hitung dan update persentase
            updatePercentages();
        }        
    };

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            // inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            // 1. Hapus item dari struktur data
            budgetController.deleteItem(type, ID);
            // 2. Hapus item dari UI
            UIController.deleteListItem(itemID);
            // 3. Perbarui dan tampilkan budget baru
            updateBudget();
            // 4. Perbarui dan update persentase
            updatePercentages();
        } 
    };

    return {
        init: function() {
            UIController.displayMonth();
            console.log('Application has started.');
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();