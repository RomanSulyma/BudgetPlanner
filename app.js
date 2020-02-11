
    var classIDs = {
        addbtn : '.add__btn',
        inputDescription : '.add__description',
        inputValue : '.add__value',
        inputType : '.add__type',
        incomeParent : '.income__list',
        expenseParent : '.expenses__list',
        budgetTotalValue : '.budget__value',
        incomeValue : '.budget__income--value',
        expensesValue : '.budget__expenses--value'

    };

    var dataObject = function (type, description , value) {
        this.type = type;
        this.value = value;
        this.description = description;
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

            updateBudget : function (dataObject) {
                if(dataObject.type === 'inc'){
                   data.income += parseInt(dataObject.value);
                } else if(dataObject.type === 'exp') {
                    data.expanse += parseInt(dataObject.value);
                }
                data.totalBalance += parseInt(dataObject.value);
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
                    htmlElem = htmlElem.replace('%id', 'income-' + dataObject.id);
                    document.querySelector(classIDs.incomeParent).insertAdjacentHTML("beforeend", htmlElem);
                } else if (dataObject.type === 'exp') {
                    htmlElem = htmlElem.replace('%id', 'expense-' + dataObject.id);
                    document.querySelector(classIDs.expenseParent).insertAdjacentHTML("beforeend", htmlElem);
                }
            },

            updateDataUI : function (data) {
                document.querySelector(classIDs.budgetTotalValue).value = data.totalBalance;
                document.querySelector(classIDs.incomeValue).value = data.income;
                document.querySelector(classIDs.expensesValue).value = data.expanse;
            }
        }

    })();

    var mainController = (function (budgetController, UIController) {


        function addElement() {

            var dataObject = UIController.getInputElement();

            UIController.cleanFields();

            budgetController.addDataObject(dataObject);

            UIController.addElementToUI(dataObject);

            budgetController.updateBudget(dataObject);

            UIController.updateDataUI(budgetController.getData());

        }

        return {
            initialize : function () {

                document.querySelector(classIDs.addbtn).addEventListener('click', function (event) {
                    addElement();
                });

            }
        }



    })(budgetController, UIController);

    mainController.initialize();