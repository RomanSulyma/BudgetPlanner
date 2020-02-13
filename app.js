
    var budgetController = (function () {

        function generateID() {
            var id = data.currentid;
            data.currentid += 1;
            return id;
        }

        var data =  {
            dataObjects : [],
            income : 0,
            incomePercent : 0,
            expansePercent : 0,
            expanse : 0,
            currentid : 0,
            totalBalance : 0
        };

        var dataObject = function (type, description, value) {
            this.type = type;
            this.value = value;
            this.description = description;
            this.id = 0;
            this.percent = 0;
        };

        return {

            addDataObject : function (dataObject) {
                dataObject.id = generateID();
                data.dataObjects.push(dataObject);
            },

            getData : function () {
                return data;
            },

            deleteElem : function (id) {

                var deleteElem = data.dataObjects.find(function (value) {
                    if(value.id === id) {
                        return value;
                    }
                });
                var index = data.dataObjects.indexOf(deleteElem);
                data.dataObjects.splice(index, 1);

            },

            calculateBudget : function () {

                var total = 0, income = 0, expanse = 0;

                 data.dataObjects.forEach(function (value) {

                     if(value.type === 'inc'){
                         total += parseInt(value.value);
                         income += parseInt(value.value);
                     } else if(value.type === 'exp') {
                         total -= parseInt(value.value);
                         expanse += parseInt(value.value);
                     }

                });

                data.totalBalance = total;
                data.expanse = expanse;
                data.income = income;

            },

            calculatePercent : function () {

                data.dataObjects.forEach(function (value ) {
                    value.percent = Math.abs(Math.round((value.value / data.totalBalance) * 100));
                });
                data.incomePercent = Math.abs(Math.round((data.income / data.totalBalance) * 100));
                data.expansePercent = Math.abs(Math.round((data.expanse / data.totalBalance) * 100));

                if(data.expanse == 0 || data.income == 0) {
                    data.incomePercent = 0;
                    data.expansePercent = 0;
                }

            },

            getDataObject : function (type, description, value) {
                return new dataObject(type, description, value);
            }
        }


    })();

    var UIController = (function () {

        var DOMNames = {
            addbtn : '.add__btn',
            inputDescription : '.add__description',
            inputValue : '.add__value',
            inputType : '.add__type',
            incomeParent : '.income__list',
            expenseParent : '.expenses__list',
            budgetTotalValue : '.budget__value',
            incomeValue : '.budget__income--value',
            expensesValue : '.budget__expenses--value',
            month : '.budget__title--month',
            container : '.container',
            deleteButton : 'ion-ios-close-outline',
            UIPercentage : '.item__percentage',
            expencesPercentage : '.budget__expenses--percentage',
            incomePercentage : '.budget__income--percentage'
        };

        return {

            getInputElement : function () {
                var type = document.querySelector(DOMNames.inputType).value;
                var description = document.querySelector(DOMNames.inputDescription).value;
                var value = document.querySelector(DOMNames.inputValue).value;

                return budgetController.getDataObject(type, description, value);
            },

            cleanFields : function () {
                document.querySelector(DOMNames.inputDescription).value = "";
                document.querySelector(DOMNames.inputValue).value = "";
            },

            addElementToUI : function (dataObject) {

                var htmlElem = '<div class="item clearfix" id="%id">\n' +
                    '                    <div class="item__description">%description</div>\n' +
                    '                    <div class="right clearfix">\n' +
                    '                        <div class="item__value">%value</div>\n' +
                    '                        <div class="item__percentage">10%</div>\n' +
                    '                        <div class="item__delete">\n' +
                    '                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\n' +
                    '                        </div>\n' +
                    '                    </div>\n' +
                    '                </div>';

                htmlElem = htmlElem.replace('%description', dataObject.description);
                htmlElem = htmlElem.replace('%value', dataObject.value);

                if(dataObject.type === 'inc') {
                    htmlElem = htmlElem.replace('%id', dataObject.id);
                    document.querySelector(DOMNames.incomeParent).insertAdjacentHTML("beforeend", htmlElem);
                } else if (dataObject.type === 'exp') {
                    htmlElem = htmlElem.replace('%id', dataObject.id);
                    document.querySelector(DOMNames.expenseParent).insertAdjacentHTML("beforeend", htmlElem);
                }
            },

            updateDataUI : function (data) {
                document.querySelector(DOMNames.budgetTotalValue).textContent = data.totalBalance;
                document.querySelector(DOMNames.incomeValue).textContent = data.income;
                document.querySelector(DOMNames.expensesValue).textContent = data.expanse;

                data.dataObjects.forEach(function (value ) {
                    document.getElementById(value.id).querySelector(DOMNames.UIPercentage).textContent = value.percent + '%';
                });

                    document.querySelector(DOMNames.incomePercentage).textContent = data.incomePercent + '%';
                    document.querySelector(DOMNames.expencesPercentage).textContent = data.expansePercent + '%';
            },

            validateInput : function (dataObject) {
                if(dataObject.value == 0 || isNaN(dataObject.value) || dataObject.value.length === 0 || dataObject.value.includes('-')) {
                    return false
                }
                if(dataObject.description.length === 0) {
                    return false;
                }
                return true;
            },

            deleteFromUI : function (event) {
                var node = event.target.parentNode.parentNode.parentNode.parentNode;
                var id = node.id;
                node.parentNode.removeChild(node);

                return id;
            },

            changeColor : function () {
            document.querySelector(DOMNames.addbtn).classList.toggle('red');
                document.querySelector(DOMNames.addbtn).classList.toggle('red-focus');
            document.querySelector(DOMNames.inputValue).classList.toggle('red');
                document.querySelector(DOMNames.inputValue).classList.toggle('red-focus');
            document.querySelector(DOMNames.inputDescription).classList.toggle('red');
                document.querySelector(DOMNames.inputDescription).classList.toggle('red-focus');
            document.querySelector(DOMNames.inputType).classList.toggle('red');
                document.querySelector(DOMNames.inputType).classList.toggle('red-focus');
            },

            getDomNames : function () {
                return DOMNames;
            }

        }

    })();

    var mainController = (function (budgetController, UIController) {

        function addElement () {

            var dataObject = UIController.getInputElement();
            UIController.cleanFields();

            if(UIController.validateInput(dataObject)) {

                budgetController.addDataObject(dataObject);
                UIController.addElementToUI(dataObject);
                budgetController.calculateBudget();
                budgetController.calculatePercent();
                UIController.updateDataUI(budgetController.getData());

            } else {
                alert('validation error!');
            }

        }

        function deleteElement (event) {

            var id = UIController.deleteFromUI(event);
            budgetController.deleteElem(id);
            budgetController.calculateBudget();
            budgetController.calculatePercent();
            UIController.updateDataUI(budgetController.getData());

        }

        return {
            initialize : function (DomNames) {

                const monthNames = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ];
                document.querySelector(DomNames.addbtn).addEventListener('click', function () {
                    addElement();
                });
                document.querySelector(DomNames.month).textContent = monthNames[new Date().getMonth()];
                document.querySelector(DomNames.container).addEventListener('click', function (event) {
                    if(event.target.className === DomNames.deleteButton) {
                        deleteElement(event);
                    }
                });
                document.querySelector(DomNames.inputType).addEventListener('change', function () {
                    UIController.changeColor();
                })
            }
        }

    })(budgetController, UIController);

    mainController.initialize(UIController.getDomNames());