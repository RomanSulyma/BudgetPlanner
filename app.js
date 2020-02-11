
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
        deleteButton : 'ion-ios-close-outline'
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
                   data.totalBalance += parseInt(dataObject.value);
                } else if(dataObject.type === 'exp') {
                    data.expanse -= parseInt(dataObject.value);
                    data.totalBalance -= parseInt(dataObject.value);
                }

            },

            deleteElem : function (id) {
                var deleteElem = data.dataObjects.find(function (value) {
                    if(value.id === id) {
                        return value;
                    }
                });
                var index = data.dataObjects.indexOf(deleteElem);
                data.dataObjects.splice(index, 1);

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
            },

            validateInput : function (dataObject) {
                if(dataObject.value === 0 || isNaN(dataObject.value) || dataObject.value.length === 0) {
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
                budgetController.updateBudget(dataObject);
                UIController.updateDataUI(budgetController.getData());

            } else {
                alert('validation error!');
            }

        }

        function deleteElement (event) {

            var id =UIController.deleteFromUI(event);
            budgetController.deleteElem(id);

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
                    if(event.target.className === classIDs.deleteButton)
                    deleteElement(event);
                });
            }
        }

    })(budgetController, UIController);

    mainController.initialize();