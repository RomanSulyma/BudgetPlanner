
    var classIDs = {
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
        UIPercentage : '.item__percentage'
    };

    var dataObject = function (type, description , value) {
        this.type = type;
        this.value = value;
        this.description = description;
        this.id = 0;
        this.percent = 0;
    };

    var budgetController = (function () {

        function generateID() {
            var id = data.currentid;
            data.currentid += 1;
            return id;
        }

        var data =  {
            dataObjects : [],
            income : 0,
            expanse : 0,
            currentid : 0,
            totalBalance : 0
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
                })

            }
        }


    })();

    var UIController = (function () {


        return {
            getInputElement : function () {
                var type = document.querySelector(classIDs.inputType).value;
                var description = document.querySelector(classIDs.inputDescription).value;
                var value = document.querySelector(classIDs.inputValue).value;

                return new dataObject(type, description, value);
            },

            cleanFields : function () {
                document.querySelector(classIDs.inputDescription).value = "";
                document.querySelector(classIDs.inputValue).value = "";
            },

            addElementToUI : function (dataObject) {

                htmlElem = '<div class="item clearfix" id="%id">\n' +
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
                    document.querySelector(classIDs.incomeParent).insertAdjacentHTML("beforeend", htmlElem);
                } else if (dataObject.type === 'exp') {
                    htmlElem = htmlElem.replace('%id', dataObject.id);
                    document.querySelector(classIDs.expenseParent).insertAdjacentHTML("beforeend", htmlElem);
                }
            },

            updateDataUI : function (data) {
                document.querySelector(classIDs.budgetTotalValue).textContent = data.totalBalance;
                document.querySelector(classIDs.incomeValue).textContent = data.income;
                document.querySelector(classIDs.expensesValue).textContent = data.expanse;

                data.dataObjects.forEach(function (value ) {
                    document.getElementById(value.id).querySelector(classIDs.UIPercentage).textContent = value.percent + '%';
                })
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
            document.querySelector(classIDs.addbtn).classList.toggle('red');
                document.querySelector(classIDs.addbtn).classList.toggle('red-focus');
            document.querySelector(classIDs.inputValue).classList.toggle('red');
                document.querySelector(classIDs.inputValue).classList.toggle('red-focus');
            document.querySelector(classIDs.inputDescription).classList.toggle('red');
                document.querySelector(classIDs.inputDescription).classList.toggle('red-focus');
            document.querySelector(classIDs.inputType).classList.toggle('red');
                document.querySelector(classIDs.inputType).classList.toggle('red-focus');
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
            initialize : function () {

                const monthNames = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ];
                document.querySelector(classIDs.addbtn).addEventListener('click', function () {
                    addElement();
                });
                document.querySelector(classIDs.month).textContent = monthNames[new Date().getMonth()];
                document.querySelector(classIDs.container).addEventListener('click', function (event) {
                    if(event.target.className === classIDs.deleteButton) {
                        deleteElement(event);
                    }
                });
                document.querySelector(classIDs.inputType).addEventListener('change', function () {
                    UIController.changeColor();
                })
            }
        }

    })(budgetController, UIController);

    mainController.initialize();