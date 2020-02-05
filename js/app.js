(function() {
    "use strict";
    var app = {
        rowList: [],
        rowNumber: 0,
        OldItemList: [],
        AddItemList: [],
        AddItemDetailsList: [],
        recipeTemplate: document.querySelector(".recipeTemplate"),
        rowTemplate: document.querySelector(".rowTemplate"),
        historyRowTemplate: document.querySelector(".historyRowTemplate"),
        itemSelctionTemplate: document.querySelector(".itemSelctionTemplate"),
        checkListTable: document.querySelector(".checkList"),
        historyLogTable: document.querySelector(".historyLogTable"),
        now: new Date(),
        last: new Date(),
        recipeRead: false,
        remiderRead: false,
        recipeTry: 0,
        recipeNumber: 100
    };

    /* NavBar*/
    /** CLOSE MAIN NAVIGATION WHEN CLICKING OUTSIDE THE MAIN NAVIGATION AREA**/
    $(document).on("click", function (e){
        /* bootstrap collapse js adds "in" class to your collapsible element*/
        var menu_opened = $("#navBar").hasClass("in");
        if(!$(e.target).closest("#navBar").length &&
            !$(e.target).is("#navBar") &&
            menu_opened === true){
                $("#navBar").collapse("toggle");
        }
    });

    /* Notification */
    /* Checking notification state */
    app.checkNotificationState = function(){
        if(app.recipeRead==true){
            document.getElementById("cookingAdvice").
                classList.remove("notificationDark");
        } else {
            document.getElementById("cookingAdvice").
                classList.add("notificationDark");
        }
        if(app.remiderRead==true){
            document.getElementById("ExpiryRemider").
                classList.remove("notificationDark");
        } else {
            document.getElementById("ExpiryRemider").
                classList.add("notificationDark");
        }
        if(app.recipeRead==true || app.remiderRead==true){
            document.getElementById("navBarNotification").
                classList.remove("notificationDark");
        } else {
            document.getElementById("navBarNotification").
                classList.add("notificationDark");
        }
    };

    /* Cooking advice */
    document.getElementById("cookingAdvice")
        .addEventListener("click",function(){
        /* Change read state */
        app.recipeRead = false;
        app.checkNotificationState();
        app.saveAllData();
        /*Launch model*/
        $("#cookingAdviceModal").modal({backdrop: "static", keyboard: false});
    });
    document.getElementById("cookingAdviceRenew").
        /*Renew advice*/
        addEventListener("click",function(){
        app.removeRecipe();
        app.recipeNumber = 100;
        app.cookingAdvice();
    });
    app.cookingAdvice = function() {
        var random = Math.ceil(Math.random() * app.recipeNumber);
        var checkList = [];
        app.rowList.forEach(function(row) {
            if(row.state == ""){
                checkList.push(row.item.name);
            }
        });
        var keyword = "";
        if(checkList.length !=0){
            var randomItemNumber = Math.ceil(Math.random() * checkList.length);
            keyword = checkList[randomItemNumber];
        }

        var appId = "8debe546";
        var apiKey = "4330a3a9e434cb24f15edb11222ce1a0";
        var from = random;
        var to = random + 1;
        var url = "https://api.edamam.com/search"
                + "?q=" + keyword
                + "&app_id=" + appId
                + "&app_key=" + apiKey
                + "&from=" + from
                + "&to=" + to;
        /* Getting recipe */
        $.getJSON(url, function(data) {
            var hits = data.hits;
            var recipeAdvice = document.querySelector(".recipeAdvice");
            if(hits.length >0){
                recipeAdvice.appendChild(app.createRecipe(hits[0]));
                app.setTwitterText(hits[0]);
            }

            if(hits.length==0 && app.recipeTry<5){
                app.recipeTry++;
                app.recipeNumber = random;
                app.cookingAdvice();
            }
        });
    };

    app.createRecipe = function (data){
        var recipe = app.recipeTemplate.cloneNode(true);
        recipe.classList.remove("recipeTemplate");
        recipe.classList.add("recipeNew");
        recipe.removeAttribute("hidden");
        recipe.querySelector(".recipeLabel").
            textContent = data.recipe.label;
        recipe.querySelector(".recipeImage").
        setAttribute("src",data.recipe.image);
        recipe.querySelector(".recipeImage").
            setAttribute("alt",data.recipe.label);
        for(var i = 0; i < data.recipe.ingredients.length; i++ ){
                var p = document.createElement("p");
                var br = document.createElement("br");
                p.textContent = data.recipe.ingredients[i].text;
                recipe.querySelector(".recipeIngredient").appendChild(p);
        }

        recipe.querySelector(".recipeUrl").setAttribute("href",data.recipe.url);

        return recipe;
    }

    /* Set Twitter text */
    app.setTwitterText = function(data){
        var text = "";
        text = text.concat("Title: ", data.recipe.label);
        text = text.concat("&#13;&#10;");

/*         text = text.concat("Ingredients:");
        text = text.concat("&#13;&#10;");

        for(var i=0; i < data.recipe.ingredients.length; i++){
            text = text.concat(data.recipe.ingredients[i].text);
            text = text.concat("&#13;&#10;");
        } */

        text = text.concat("Link:");
        text = text.concat("&#13;&#10;");
        text = text.concat(data.recipe.url);
        text = text.concat("&#13;&#10;");

        document.getElementById("recipeText").value = text;

    }

    /* Remove recipe */
    app.removeRecipe = function(){
        var recipeAdvice = document.getElementById("recipeAdvice");
        var recipes = recipeAdvice.getElementsByClassName("recipeNew");
        for(var i = recipes.length-1; i >= 0; i--) {
            recipeAdvice.removeChild(recipes[i]);
        }
    }


    /* Expiry date Remider */
    document.getElementById("ExpiryRemider").
        addEventListener("click", function() {
        /* Change read state */
        app.remiderRead = false;
        app.checkNotificationState();
        app.saveAllData();

        var expired = [];
        var expiredIn2 = [];
        for(var i=0; i<app.rowList.length; i++){
            if(app.rowList[i].state == ""){
                var days = Math.ceil( (new Date(app.rowList[i].
                    expiry_date).getTime() - app.
                    now.getTime()) / (1000 * 3600 * 24) );
                if(days<0){
                    expired.push(app.rowList[i]);
                } else if(days<3){
                    expiredIn2.push(app.rowList[i]);
                }
            }

        }

        var remiderExpired = document.querySelector(".remiderExpired");
        var remiderExpiredIn2 = document.querySelector(".remiderExpiredIn2");
        var remiderRowTemplete = document.querySelector(".remiderRowTemplete");
        var remiderRow;
        var remiderItem;
        for(var i=0; i<expired.length; i++){
            if(i%2==0){
                remiderRow = remiderRowTemplete.cloneNode(true);
                remiderRow.classList.add("remiderRowNew");
                remiderRow.removeAttribute("hidden");
                remiderItem = remiderRow.getElementsByClassName("remiderItem");
                remiderItem[0].textContent = expired[i].item.name;
                remiderExpired.appendChild(remiderRow);
            } else if(i%2==1){
                remiderItem[1].textContent = expired[i].item.name;
            }
        }

        for(var i=0; i<expiredIn2.length; i++){
            if(i%2==0){
                remiderRow = remiderRowTemplete.cloneNode(true);
                remiderRow.classList.add("remiderRowNew");
                remiderRow.removeAttribute("hidden");
                remiderItem = remiderRow.getElementsByClassName("remiderItem");
                remiderItem[0].textContent = expiredIn2[i].item.name;
                remiderExpiredIn2.appendChild(remiderRow);
            } else if(i%2==1){
                remiderItem[1].textContent = expiredIn2[i].item.name;
            }
        }
        /*Launch model*/
        $("#expiryDateRemiderModal").
            modal({backdrop: "static", keyboard: false});
    });

    /* Close */
    document.getElementById("expiryDateRemiderClose").
        addEventListener("click", function() {
        app.removeRemiderRow();
    });

    /* Remove remider row  */
    app.removeRemiderRow = function(){
        var remiderExpired = document.querySelector(".remiderExpired");
        var remiderExpiredRow = remiderExpired.
            getElementsByClassName("remiderRowNew");
        for(var i = remiderExpiredRow.length-1; i >= 0; i--) {
            remiderExpired.removeChild(remiderExpiredRow[i]);
        }

        var remiderExpiredIn2 = document.querySelector(".remiderExpiredIn2");
        var remiderExpiredIn2dRow = remiderExpiredIn2.
            getElementsByClassName("remiderRowNew");
        for(var i = remiderExpiredIn2dRow.length-1; i >= 0; i--) {
            remiderExpiredIn2.removeChild(remiderExpiredIn2dRow[i]);
        }


    }




    /* Shopping list */
    /* Close */
    document.getElementById("addItemsClose").
        addEventListener("click", function() {
        app.resetAddItems();
    });

    document.getElementById("addOtherItemsClose").
        addEventListener("click", function() {
        app.resetAddItems();
    });

    document.getElementById("enterItemDetailsClose").
        addEventListener("click", function() {
        app.resetAddItems();
    });

    app.resetAddItems = function(){
        /*Remove item selections */
        var oldItems = document.getElementById("oldItems");
        var oldItemsSelctions = oldItems.
            getElementsByClassName("itemSelctionNew");
        for(var i = oldItemsSelctions.length-1; i >= 0; i--) {
            oldItems.removeChild(oldItemsSelctions[i]);
        }
        var frequentItems = document.getElementById("frequentItems");
        var frequentItemsSelctions = frequentItems.
            getElementsByClassName("itemSelctionNew");
        for(var i = frequentItemsSelctions.length-1; i >= 0; i--) {
            frequentItems.removeChild(frequentItemsSelctions[i]);
        }
        /*Remove input other items*/
        var allOtherItems = document.getElementById("allOtherItems")
        var otherItemNameInput = allOtherItems.
            getElementsByClassName("otherItemNameInput");
        for(var i=0; i<otherItemNameInput.length; i++){
            otherItemNameInput[i].value = "";
        }

        var otherItemCategoryInput = allOtherItems.
            getElementsByClassName("otherItemCategoryInput");
        for(var i=0; i<otherItemCategoryInput.length; i++){
            otherItemCategoryInput[i].selectedIndex = 0;
        }
        /*Remove item details*/
        var enterItemDetailsTable = document.
            getElementById("enterItemDetailsTable");
        var enterItemDetailsTableRows = enterItemDetailsTable.
            getElementsByClassName("enterItemDetailsTableRowNew");
        for(var i = enterItemDetailsTableRows.length-1; i >= 0; i--) {
            enterItemDetailsTable.removeChild(enterItemDetailsTableRows[i]);
        }

    }


    /* Add items */
    document.getElementById("add_items").addEventListener("click", function() {
        /*Create Items*/
        app.createOldItems();
        app.createFrequentItems();

        /*Set selected state*/
        var allAddItemSections = document.
            getElementsByClassName("itemSelctionNew");
        for(var i = 0; i < allAddItemSections.length; i++) {
            var selection = allAddItemSections[i];
            selection.onclick = function() {
                if(this.classList.contains("addItemSelected")){
                    this.classList.remove("addItemSelected");
                } else {
                    this.classList.add("addItemSelected");
                }
            }
        }

        /*Launch model*/
        $("#addItemsModal").modal({backdrop: "static", keyboard: false});
    });

    app.createOldItems = function() {
        if(app.OldItemList != null){
            var oldItems = document.getElementById("oldItems");
            for (var i=0; i<app.OldItemList.length; i++) {
                var thisSelection = app.createItemSelection(app.OldItemList[i]);
                oldItems.appendChild(thisSelection);
            }
        }
    }

    app.createFrequentItems = function() {
        var frequentItemsList = [
            {"name":"Orange","category":"Fruits"},
            {"name":"Apple","category":"Fruits"},
            {"name":"Banana","category":"Fruits"},
            {"name":"Grapes","category":"Fruits"},
            {"name":"Broccoli","category":"Veggies"},
            {"name":"Carrots","category":"Veggies"},
            {"name":"Celery","category":"Veggies"},
            {"name":"Onions","category":"Veggies"},
            {"name":"Lettuce","category":"Veggies"},
            {"name":"Bacon","category":"Proteins"},
            {"name":"Steak","category":"Proteins"},
            {"name":"Chicken","category":"Proteins"},
            {"name":"Pork","category":"Proteins"},
            {"name":"Salmon","category":"Proteins"},
            {"name":"Cookies","category":"Sweets"},
            {"name":"Candy","category":"Sweets"},
            {"name":"Cake","category":"Sweets"},
            {"name":"Chocolate","category":"Sweets"},
            {"name":"Ice Cream","category":"Sweets"},
            {"name":"Bread","category":"Carbs"},
            {"name":"Pasta","category":"Carbs"},
            {"name":"Rice","category":"Carbs"},
            {"name":"Butter","category":"Dairy"},
            {"name":"Cheese","category":"Dairy"},
            {"name":"Milk","category":"Dairy"},
            {"name":"Yogurt","category":"Dairy"},
            {"name":"Eggs","category":"Dairy"}
        ];

        var frequentItems = document.getElementById("frequentItems");
        for (var i=0; i<frequentItemsList.length; i++) {
            if(app.isItemInOld(frequentItemsList[i])){
                continue;
            }

            var thisSelection = app.createItemSelection(frequentItemsList[i]);
            frequentItems.appendChild(thisSelection);
        }
    }

    app.createItemSelection = function(data) {
        var selection = app.itemSelctionTemplate.cloneNode(true);
        selection.classList.remove("itemSelctionTemplate");
        selection.classList.add("itemSelctionNew");
        selection.removeAttribute("hidden");
        selection.querySelector(".itemSelectionName").
            textContent = data.name;
        selection.querySelector(".itemSelectionCategory").
            setAttribute("src","Icons/" + data.category+".png");
        selection.querySelector(".itemSelectionCategory").
            setAttribute("alt",data.category);
        return selection;
    }

    app.isTwoItemsEqual = function(item1, item2){
        if(item1.name === item2.name && item1.category === item2.category) {
            return true;
        }
        return false;
    }

    app.isItemInOld = function(item){
        for (var i=0; i<app.OldItemList.length; i++) {
            if(app.isTwoItemsEqual(app.OldItemList[i], item)){
                return true;
            }
        }
        return false;
    }
    /* Add Other Items */
    document.getElementById("addOtherItems").
        addEventListener("click", function() {
        app.AddItemList = [];
        var addItemSelected = document.
            getElementsByClassName("addItemSelected");
        for (var i=0; i<addItemSelected.length; i++) {
            var name = addItemSelected[i].querySelector(".itemSelectionName").
                textContent.valueOf();
            var category = addItemSelected[i].
                querySelector(".itemSelectionCategory").
                getAttribute("alt");
            app.AddItemList.push({
            "name": name,
            "category": category
            });

        }

        $("#otherItemsModal").modal({backdrop: "static", keyboard: false});
    });


    /* Enter Item Details */
    document.getElementById("enterItemDetails").
        addEventListener("click", function() {
        /*Push other items to AddItemList and OldItemList*/
        var otherItemGroup = document.getElementsByClassName("otherItemGroup");
        for (var i=0; i<otherItemGroup.length; i++) {
            var name = otherItemGroup[i].querySelector(".otherItemNameInput").
                value;
            if(name === ""){
                continue;
            }
            var selection = otherItemGroup[i].
                querySelector(".otherItemCategoryInput");
            var category = selection.options[selection.selectedIndex].value;
            var item = {"name": name,"category": category};
            app.AddItemList.push(item);
        }
        /*Create all items in AddItemList for entering details*/
        for (var i=0; i<app.AddItemList.length; i++) {
            app.addEnterDetailsRow(app.AddItemList[i]);
        }
        /*Launch model*/
        $("#enterItemDetailsModal").
            modal({backdrop: "static", keyboard: false});
    });


    app.addEnterDetailsRow = function(data) {
        var enterItemDetailsTableRowTemplate = document.
            querySelector(".enterItemDetailsTableRowTemplate");
        var row = enterItemDetailsTableRowTemplate.cloneNode(true);
        row.classList.remove("enterItemDetailsTableRowTemplate");
        row.removeAttribute("hidden");
        row.classList.add("enterItemDetailsTableRowNew");
        row.querySelector(".enterItemDetailsName").textContent = data.name;
        row.querySelector(".enterItemDetailsCategory").
            textContent = data.category;

        /*************************************/
        /*expiry date*/
        var days = 5;
        var newdate = new Date();
        newdate.setDate(app.now.getDate() + days);

        var day = ("0" + newdate.getDate()).slice(-2);
        var month = ("0" + (newdate.getMonth() + 1)).slice(-2);
        var newdateString = newdate.getFullYear()+"-"+(month)+"-"+(day) ;

        row.querySelector(".itemDetailDaysInput").value = days;
        row.querySelector(".itemDetailExpiryDateInput").value = newdateString;

        /*Functions for expiry date in detail table*/
        row.querySelector(".itemDetailDaysInput").
            onchange = function() {app.itemDetailDaysInputChange(this)};
        row.querySelector(".itemDetailExpiryDateInput").
            onchange = function() {app.itemDetailExpiryDateInputChange(this)};
        row.querySelector(".glyphicon-minus").
            onclick = function() {app.itemDetailDaysInputMinus(this)};
        row.querySelector(".glyphicon-plus").
            onclick = function() {app.itemDetailDaysInputPlus(this)};


        document.querySelector("#enterItemDetailsTable").appendChild(row);
    };

    app.itemDetailDaysInputChange = function(element){
        var days = parseInt(element.value);
        var newdate = new Date();
        newdate.setDate(app.now.getDate() + days);
        var day = ("0" + newdate.getDate()).slice(-2);
        var month = ("0" + (newdate.getMonth() + 1)).slice(-2);
        var newdateString = newdate.getFullYear()+"-"+(month)+"-"+(day) ;
        element.parentElement.
            querySelector(".itemDetailExpiryDateInput").value = newdateString;
    }
    app.itemDetailExpiryDateInputChange = function(element){
        var date = new Date(element.value);
        var timeDiff = date.getTime() - app.now.getTime();
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        element.parentElement.querySelector(".itemDetailDaysInput").
            value = diffDays;
    }
    app.itemDetailDaysInputMinus = function(element){
        var itemDetailDaysInput = element.parentElement.
            querySelector(".itemDetailDaysInput");
        itemDetailDaysInput.value--;
        app.itemDetailDaysInputChange(itemDetailDaysInput);
    }

    app.itemDetailDaysInputPlus = function(element){
        var itemDetailDaysInput = element.parentElement.
            querySelector(".itemDetailDaysInput");
        itemDetailDaysInput.value++;
        app.itemDetailDaysInputChange(itemDetailDaysInput);
    }



    /*Add to checklist and row list*/
    document.getElementById("addToChecklist").
        addEventListener("click", function() {
        var enterItemDetailsTableRow = document.
            getElementsByClassName("enterItemDetailsTableRowNew");
        for (var i=0; i<enterItemDetailsTableRow.length; i++) {
            var rowKey = ("00000" + (app.rowNumber + 1)).slice(-5);
            var name = enterItemDetailsTableRow[i].
                querySelector(".enterItemDetailsName").textContent.valueOf();
            var category = enterItemDetailsTableRow[i].
                querySelector(".enterItemDetailsCategory").
                    textContent.valueOf();
            var expiry_date = enterItemDetailsTableRow[i].
                querySelector(".itemDetailExpiryDateInput").value;
            var memo = enterItemDetailsTableRow[i].
                querySelector(".enterItemDetailsMemoInput").value;
            var data = {
                "rowKey": rowKey,
                "item": {
                    "name": name,
                    "category": category
                },
                "state": "",
                "expiry_date": expiry_date,
                "memo": memo
            };
            app.updateRow(data);
            app.rowNumber++;
            /*Unshift new other items to OldItemList*/
            var item = {"name": name,"category": category};
            if(!app.isItemInOld(item)){
                app.OldItemList.unshift(item);
            }


        }
        app.saveAllData();
        app.resetAddItems();
    });
    /* Edit Items */
    /* Close */
    document.getElementById("editItemsClose").
        addEventListener("click", function() {
        app.resetEditItems();
    });

    app.resetEditItems = function(){
        var editItemsTable = document.getElementById("editItemsTable");
        var editItemsTableRowNews = editItemsTable.
            getElementsByClassName("editItemsTableRowNew");
        for(var i = editItemsTableRowNews.length-1; i >= 0; i--) {
            editItemsTable.removeChild(editItemsTableRowNews[i]);
        }
    }


    document.getElementById("edit_items").
        addEventListener("click", function() {
        /*Create all items in checklist for editing*/
        for (var i=0; i<app.rowList.length; i++) {
            if(app.rowList[i].state == ""){
                app.addEditItemsRow(app.rowList[i]);
            }
        }
        /*Launch model*/
        $("#editItemsModal").modal({backdrop: "static", keyboard: false});
    });

    app.addEditItemsRow = function(data) {
        var editItemsTableRowTemplate = document.
            querySelector(".editItemsTableRowTemplate");
        var row = editItemsTableRowTemplate.cloneNode(true);
        row.classList.remove("editItemsTableRowTemplate");
        row.removeAttribute("hidden");
        row.classList.add("editItemsTableRowNew");
        row.querySelector(".editItemsRowKey").
            textContent = data.rowKey;
        row.querySelector(".editItemsNameInput").
            value = data.item.name;
        row.querySelector(".editItemsCategoryInput").
            value = data.item.category;
        row.querySelector(".editItemsExpiryDateInput").
            value = data.expiry_date;
        var days = Math.ceil( (new Date(data.expiry_date).
            getTime() - app.now.getTime()) / (1000 * 3600 * 24) );
        row.querySelector(".editItemsDaysInput").value = days;
        row.querySelector(".editItemsMemoInput").value = data.memo;
        /*Functions for expiry date in edit table*/
        row.querySelector(".editItemsDaysInput").
            onchange = function() {app.editItemsDaysInputChange(this)};
        row.querySelector(".editItemsExpiryDateInput").
            onchange = function() {app.editItemsExpiryDateInputChange(this)};
        row.querySelector(".glyphicon-minus").
            onclick = function() {app.editItemsDaysInputMinus(this)};
        row.querySelector(".glyphicon-plus").
            onclick = function() {app.editItemsDaysInputPlus(this)};
        /*Function for delete in edit table*/
        row.querySelector(".glyphicon-remove").
            onclick = function() {app.rowDelete(this)};
        document.querySelector("#editItemsTable").appendChild(row);
    };

    app.editItemsDaysInputChange = function(element){
        var days = parseInt(element.value);
        var newdate = new Date();
        newdate.setDate(app.now.getDate() + days);
        var day = ("0" + newdate.getDate()).slice(-2);
        var month = ("0" + (newdate.getMonth() + 1)).slice(-2);
        var newdateString = newdate.getFullYear()+"-"+(month)+"-"+(day) ;
        element.parentElement.
            querySelector(".editItemsExpiryDateInput").value = newdateString;
    }
    app.editItemsExpiryDateInputChange = function(element){
        var date = new Date(element.value);
        var timeDiff = date.getTime() - app.now.getTime();
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        element.parentElement.querySelector(".editItemsDaysInput").
            value = diffDays;
    }
    app.editItemsDaysInputMinus = function(element){
        var editItemsDaysInput = element.parentElement.
            querySelector(".editItemsDaysInput");
        editItemsDaysInput.value--;
        app.editItemsDaysInputChange(editItemsDaysInput);
    }
    app.editItemsDaysInputPlus = function(element){
        var editItemsDaysInput = element.parentElement.
            querySelector(".editItemsDaysInput");
        editItemsDaysInput.value++;
        app.editItemsDaysInputChange(editItemsDaysInput);
    }
    /* Remove item*/
    app.rowDelete = function(element){
        var editItemsTableRowNew = element.parentElement.parentElement;
        if(editItemsTableRowNew.classList.contains("editItemDeleteRow")){
            editItemsTableRowNew.classList.remove("editItemDeleteRow");
        } else{
            editItemsTableRowNew.classList.add("editItemDeleteRow");
        }
    }
    /*Save edit items */
    document.getElementById("editItemsSave").
        addEventListener("click", function() {
        /* Update rowList */
        var editItemsTableRowNew = document.
            getElementsByClassName("editItemsTableRowNew");
        var j = 0;
        for (var i=0; i<editItemsTableRowNew.length; i++) {
            var rowKey = editItemsTableRowNew[i].
                querySelector(".editItemsRowKey").textContent.valueOf();
            var name = editItemsTableRowNew[i].
                querySelector(".editItemsNameInput").value;
            var selection = editItemsTableRowNew[i].
                querySelector(".editItemsCategoryInput");
            var category = selection.options[selection.selectedIndex].value;
            var state = "";
            if(editItemsTableRowNew[i].classList.contains("editItemDeleteRow")){
                state = "Deleted";
            }
            var expiry_date = editItemsTableRowNew[i].
                querySelector(".editItemsExpiryDateInput").value;
            var memo = editItemsTableRowNew[i].
                querySelector(".editItemsMemoInput").value;
            var data = {
                "rowKey": rowKey,
                "item": {
                    "name": name,
                    "category": category
                },
                "state": state,
                "expiry_date": expiry_date,
                "memo": memo
            };

            for(;;j++){
                if(app.rowList[j].rowKey == rowKey ){
                    app.rowList[j]=data;
                    j++;
                    break;
                }
            }

        }
        app.saveAllData();
        /* Reset new checklist */
        app.resetCH();

        /* Reset edit items */
        app.resetEditItems();
    });
    /* History Log */
    document.getElementById("history_log").
        addEventListener("click", function() {
        /*Launch model*/
        $("#historyLogModal").
            modal({backdrop: "static", keyboard: false});
    });
    document.getElementById("historyLogClose").
        addEventListener("click", function() {
        app.resetCH();
    });
    /* Save user"s data*/
    $("#saveData").click(function() {
        var email = document.getElementById("emailSave").value;
        var password = document.getElementById("passwordSave").value;
        $.ajax({
            type: "POST",
            url: "/php/savedata.php",
            data: {email: email,password: password, rowList: app.rowList,
                OldItemList: app.OldItemList},
            success: function(data) {
                if(data == "wrong"){
                    alert("Your email or password is incorrect!");
                } else{
                    alert("Successfully saved!");
                    $("#saveDataModal").modal("hide");
                }
            }
        });
    });
    /* Load user"s data*/
    $("#loadData").click(function() {
        var email = document.getElementById("emailLoad").value;
        var password = document.getElementById("passwordLoad").value;
        $.ajax({
            type: "POST",
            url: "/php/loaddata.php",
            data: {email: email,password: password},
            success: function(data) {
                if(data == "wrong") {
                    alert("Your email or password is incorrect!");
                } else {
                    if(data == " "){
                        alert("There is no saving data!");
                    } else {
                        var array = data.split(" ");
                        $.getJSON("../userdata/".concat(array[0], ".json"),
                            function(data) {
                            app.rowList = data;
                            app.rowNumber = app.rowList.length;
                            $.getJSON("../userdata/".concat(array[1], ".json"),
                                function(data) {
                                    app.OldItemList = data;
                                    /* Reset other variables */
                                    app.last = new Date();
                                    app.recipeRead = false;
                                    app.remiderRead = false;
                                    app.saveAllData();
                                    alert("Successfully loaded");
                                    location.reload();
                            });
                        });
                    }
                }
            }
        });
    });
    /* Checklist and History log */
    /* Reset */
    app.resetCH = function(){
        app.cleanCH();
        app.createCH();
    }

    /* Clean */
    app.cleanCH = function(){
        app.cleanChecklist();
        app.cleanHistoryLog();
    }

    /* Clean checklist*/
    app.cleanChecklist = function(){
        var checklistTableRowNews = app.checkListTable.
            getElementsByClassName("checklistTableRowNew");
        for(var i = checklistTableRowNews.length-1; i >= 0; i--) {
            app.checkListTable.removeChild(checklistTableRowNews[i]);
        }
    }
    /* Clean history log*/
    app.cleanHistoryLog = function(){
        var historyRowNews = app.historyLogTable.
            getElementsByClassName("historyRowNew");
        for(var i = historyRowNews.length-1; i >= 0; i--) {
            app.historyLogTable.removeChild(historyRowNews[i]);
        }
    }

    /* Create */
    app.createCH = function(){
        app.rowList.forEach(function(row) {
            if(row.state == ""){
                app.updateRow(row);
            } else {
                app.updateHistoryLogRow(row);
            }
        });
    }
    /* Update row in checklist */
    app.updateRow = function(data) {
        var row = app.rowTemplate.cloneNode(true);
        row.classList.remove("rowTemplate");
        row.classList.add("checklistTableRowNew");
        row.removeAttribute("hidden");
        row.querySelector(".rowKey").textContent = data.rowKey;
        row.querySelector(".name").textContent = data.item.name;
        row.querySelector(".category").textContent = data.item.category;
        row.querySelector(".expiry_date").textContent = data.expiry_date;
        var days = Math.ceil( (new Date(data.expiry_date).getTime()
            - app.now.getTime()) / (1000 * 3600 * 24) );
        row.querySelector(".days").textContent = days;
        row.querySelector(".memo").textContent = data.memo;
        if(data.state === "Eaten"){
            row.querySelector(".state").textContent = "Eaten";
        } else if(data.state === "Dumped"){
            row.querySelector(".state").textContent = "Dumped";
        } else if(days>2){
            row.querySelector(".state").textContent = "Fresh";
        } else if(days>=0){
            row.querySelector(".state").textContent = "Eat soon!";
        } else if(days<0){
            row.querySelector(".state").textContent = "Expired";
        }
        row.querySelector(".glyphicon-cutlery").
            onclick = function() {app.rowEaten(this)};
        row.querySelector(".glyphicon-trash").onclick = function() {app.
            rowDumped(this)};
        app.checkListTable.appendChild(row);
        /* New row */
        if(data.rowKey === ("00000" + (app.rowNumber + 1)).slice(-5)){
            if (!app.rowList) {
                app.rowList = [];
            }
            app.rowList.push(data);
        }

    };
    /* Clicking on eaten */
    app.rowEaten = function(element){
        var checklistTableRowNew = element.parentElement.parentElement;
        var rowKey = checklistTableRowNew.querySelector(".rowKey").textContent;
        var state = checklistTableRowNew.querySelector(".state").textContent;
        var days = checklistTableRowNew.querySelector(".days").textContent;
        var change;
        if(state == "Eaten"){
            change = "";
        } else {
            change = "Eaten";
        }
        app.rowList.forEach(function(row) {
            if( row.rowKey == rowKey ){
                row.state = change;
            }
        });
        if(change == "Eaten"){
            checklistTableRowNew.querySelector(".state").textContent = "Eaten";
        } else if(change == "Dumped"){
            checklistTableRowNew.querySelector(".state").textContent = "Dumped";
        } else if(days>2){
            checklistTableRowNew.querySelector(".state").textContent = "Fresh";
        } else if(days>=0){
            checklistTableRowNew.querySelector(".state").textContent = "Eat soon!";
        } else if(days<0){
            checklistTableRowNew.querySelector(".state").textContent = "Expired";
        }
        app.saveAllData();
    }

    /* Clicking on dumped */
    app.rowDumped = function(element){
        var checklistTableRowNew = element.parentElement.parentElement;
        var rowKey = checklistTableRowNew.querySelector(".rowKey").textContent;
        var state = checklistTableRowNew.querySelector(".state").textContent;
        var days = checklistTableRowNew.querySelector(".days").textContent;
        var change;
        if(state == "Dumped"){
            change = "";
        } else {
            change = "Dumped";
        }
        app.rowList.forEach(function(row) {
            if( row.rowKey == rowKey ){
                row.state = change;
            }
        });
        if(change == "Eaten"){
            checklistTableRowNew.querySelector(".state").textContent = "Eaten";
        } else if(change == "Dumped"){
            checklistTableRowNew.querySelector(".state").textContent = "Dumped";
        } else if(days>2){
            checklistTableRowNew.querySelector(".state").textContent = "Fresh";
        } else if(days>=0){
            checklistTableRowNew.querySelector(".state").textContent = "Eat soon!";
        } else if(days<0){
            checklistTableRowNew.querySelector(".state").textContent = "Expired";
        }
        app.saveAllData();
    }


    /* Update row in history log */
    app.updateHistoryLogRow = function(data) {
        var row = app.historyRowTemplate.cloneNode(true);
        row.classList.remove("historyRowTemplate");
        row.classList.add("historyRowNew");
        row.removeAttribute("hidden");

        row.querySelector(".rowKey").textContent = data.rowKey;
        row.querySelector(".name").textContent = data.item.name;
        row.querySelector(".category").textContent = data.item.category;
        row.querySelector(".expiry_date").textContent = data.expiry_date;
        var days = Math.ceil( (new Date(data.expiry_date).getTime() - app.
            now.getTime()) / (1000 * 3600 * 24) );
        row.querySelector(".days").textContent = days;
        row.querySelector(".memo").textContent = data.memo;
        if(data.state === "Eaten"){
            row.querySelector(".state").textContent = "Eaten";
        } else if(data.state === "Dumped"){
            row.querySelector(".state").textContent = "Dumped";
        } else if(data.state === "Deleted"){
            row.querySelector(".state").textContent = "Deleted";
        } else if(days>2){
            row.querySelector(".state").textContent = "Fresh";
        } else if(days>=0){
            row.querySelector(".state").textContent = "Eat soon!";
        } else if(days<0){
            row.querySelector(".state").textContent = "Expired";
        }
        var oldState = document.createAttribute("oldState");
        oldState.value = data.state;
        row.querySelector(".state").setAttributeNode(oldState);

        row.querySelector(".glyphicon-repeat").onclick = function() {app.
            rowRestore(this)};
        app.historyLogTable.appendChild(row);
    };
    /* Restore the row */
    app.rowRestore = function(element){
        var historyRowNew = element.parentElement.parentElement;
        var rowKey = historyRowNew.querySelector(".rowKey").textContent;
        var state = historyRowNew.querySelector(".state").textContent;
        var days = historyRowNew.querySelector(".days").textContent;
        var change;

        if(state === "Eaten" || state === "Dumped" || state === "Deleted"){
            change = "";
        } else {
            change = historyRowNew.querySelector(".state").
                getAttribute("oldstate");
        }

        app.rowList.forEach(function(row) {
            if( row.rowKey == rowKey ){
                row.state = change;
            }
        });

        if(change === "Eaten"){
            historyRowNew.querySelector(".state").textContent = "Eaten";
        } else if(change === "Dumped"){
            historyRowNew.querySelector(".state").textContent = "Dumped";
        } else if(change === "Deleted"){
            historyRowNew.querySelector(".state").textContent = "Deleted";
        } else if(days>2){
            historyRowNew.querySelector(".state").textContent = "Fresh";
        } else if(days>=0){
            historyRowNew.querySelector(".state").textContent = "Eat soon!";
        } else if(days<0){
            historyRowNew.querySelector(".state").textContent = "Expired";
        }

        app.saveAllData();
    }

    //Save rowList
    app.saveAllData = function() {
        var rowList = JSON.stringify(app.rowList);
        localStorage.rowList = rowList;
        var OldItemList = JSON.stringify(app.OldItemList);
        localStorage.OldItemList = OldItemList;
        var last = JSON.stringify(app.last);
        localStorage.last = last;
        var recipeRead = JSON.stringify(app.recipeRead);
        localStorage.recipeRead = recipeRead;
        var remiderRead = JSON.stringify(app.remiderRead);
        localStorage.remiderRead = remiderRead;
    };
    var initialRow = {
        "rowKey": "00000",
        "item": {
            "name": "Milk",
            "category": "Dairy"
        },
        "state": "",
        "expiry_date": "2018/05/10",
        "memo": "4 liters"
    };
    /* Excuting when launch */
    /* Loading data from local storage */
    /* Row list */
    app.rowList = localStorage.rowList;
    if(app.rowList){
        app.rowList = JSON.parse(app.rowList);
        app.rowNumber = app.rowList.length;

        app.createCH();

    } else {
        app.rowList = [];
    }
    /* Old list */
    app.OldItemList = localStorage.OldItemList;
    if(app.OldItemList){
        app.OldItemList = JSON.parse(app.OldItemList);
    } else {
        app.OldItemList = [];
    }
    /* Notification */
    app.last = localStorage.last;
    if(app.last){
        app.last = new Date(JSON.parse(app.last));
    } else {
        app.last = new Date();
    }
    app.recipeRead = localStorage.recipeRead;
    if(app.recipeRead){
        app.recipeRead = JSON.parse(app.recipeRead);
    } else {
        app.recipeRead = false;
    }
    app.remiderRead = localStorage.remiderRead;
    if(app.remiderRead){
        app.remiderRead = JSON.parse(app.remiderRead);
    } else {
        app.remiderRead = false;
    }
    /* Updating notification */
    if(  Math.ceil( app.now.getTime()/(1000 * 3600 * 24) ) !==
    Math.ceil( app.last.getTime()/(1000 * 3600 * 24) ) ){
        app.recipeRead = true;
        app.remiderRead = true;
    }
    app.checkNotificationState();
    /* Updating last date */
    app.last = app.now;
    app.saveAllData();
    /* Update daily cooking advice */
    app.removeRecipe();
    app.cookingAdvice();
    // Add service worker
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker
            .register("./service-worker.js")
            .then(function() { console.log("Service Worker Registered"); });
    }
})();