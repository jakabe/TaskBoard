
    

    var debugMe = true;
    //make a new variable that takes in class name
    const CHECK = "fa-check-circle";
    const UNCHECK = "fa-circle-thin";
    const LINE_THROUGH =  "lineThrough";
    //
    let BOARD;

    //cookie?
    let boardData = localStorage.getItem("BOARD");
    
    /** itemUtils allows the user to edit items on each list
    
    
    */
    var itemUtils = {
        removeItem(event){
            //delete the parent
            var element = event.target;
            element.parentNode.parentNode.removeChild(element.parentNode);
            //trash the element
            var bIndex = parseInt(element.getAttribute("bIn"));
            var arrayIndex = parseInt(element.getAttribute("arrIn"));
            var rem = BOARD[bIndex].arrayOfItemsFromList.splice(arrayIndex,1);
            //console.log(rem);
            //console.log(BOARD);
            localStorage.setItem("BOARD",JSON.stringify(BOARD));
            //BOARD[bIndex].arrayOfItemsFromList[arrayIndex].pop;
            
        }

        ,

        cleanBoard : function(obj) {
            console.log("CLEAN BOARD CALLED");
            console.log(obj);
            var propNames = Object.getOwnPropertyNames(obj);
            console.log("-- "+propNames);
            for (var i = 0; i < propNames.length; i++) {
                var propName = propNames[i];
                console.log("--- "+propName);
                if (obj[propName] === null || obj[propName] === undefined) {
                    console.log(propName+" was null or undefined, deleting now");
                    delete obj[propName];
                }
            }
        },

        removeList(event){
            f(">>>>>>>>>>>>>>  removeList called  ");
            f(` Event Target `);
            console.log(event.target);
            f(` Event Target Parent `);
            console.log(event.target.parentNode);
            f(` Event Target Parent Parent `);
            console.log(event.target.parentNode.parentNode);

            f(` Event Target Parent Parent Parent `);
            console.log(event.target.parentNode.parentNode.parentNode);

            var killTarget = event.target.parentNode.parentNode.parentNode;
            killTarget.remove();
            f(` target removed from window`);

            var bIndex = parseInt(killTarget.getAttribute("boardindex"));
            

            f(` Element ${bIndex}, will be removed from board now...`);
            var removal = BOARD[bIndex];
            console.log(removal);

            delete BOARD[bIndex];

            itemUtils.cleanBoard(BOARD);
            console.log(BOARD);

            var removeEmptyOrNull = (obj) => {
                Object.keys(obj).forEach(k =>
                (obj[k] && typeof obj[k] === 'object') && removeEmptyOrNull(obj[k]) ||
                (!obj[k] && obj[k] !== undefined) && delete obj[k]
                );
                console.log("REMOVING EMPTY OR NULL");
                console.log(obj);
                return obj;
            };

            console.log("RESIZING BOARD");
            var nb=[];
            for(var i = 0 ; i < BOARD.length ; i++){
                if(BOARD[i] != null){
                    nb.push(BOARD[i]);
                }
                
            }
            console.log(nb);
            BOARD = nb;

            console.log(BOARD);
            localStorage.setItem("BOARD",JSON.stringify(BOARD));
           
        }

     }

    /** myDragUtils allows the user to drag the panels around the screen
    *
    *
    *
    */
    var myDragUtils = {
        targetElement: null,
        coords : {
            pos1 : 0,
            pos2 : 0,
            pos3 : 0,
            pos4 : 0
        },

        mouseDownFunction : function(e){

            //
            e = e || window.event;
            e.preventDefault();
            //
            targetElement = e.target.parentNode;

            //

            pos3 = e.clientX;
            pos4 = e.clientY;
            
            document.onmouseup = myDragUtils.haltTrackFunction;
           
            document.onmousemove = myDragUtils.mouseTrackFunction;
        },

        mouseTrackFunction : function(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:

            targetElement.style.top = (targetElement.offsetTop - pos2) + "px";
            targetElement.style.left = (targetElement.offsetLeft - pos1) + "px";
        },

        haltTrackFunction : function() {
            document.onmouseup = null;
            document.onmousemove = null;

            //reset position variables
            pos1 = 0, 
            pos2 = 0, 
            pos3 = 0, 
            pos4 = 0;
            targetElement = null;
        }

    }
    
    /** myStorageUtils grabs any local data and adds it to the page for the user
    
    
    */
    var myStorageUtils = {

        thing : "This is a thing! ",

        a_function : function() {
            //console.log("No Parameters");
        },

        

        /** this takes the board object and uses it to laod the board to the page
        * 
        * 
        */
        loadBoard : function(/* this will take an array as a parameter */ boardObject){
                //console.log("========READING BOARD OBJECT NOW =============="  );
                //console.log(" board object is "+boardObject.length+" long");
                console.log(BOARD);
                if (boardObject != 'NaN' && boardObject != null && boardObject != ''){
                    console.log(" boardObject is not null");
                    var bobTitle;
                    var bobArrayOfItems;
                    var bobId;
                    var bobj;
                    var listCode;
                    for(var i = 0 ; i < boardObject.length; i++){
                        if (boardObject[i] != 'NaN' && boardObject[i] != null && boardObject[i] != ''){
                            console.log("___");
                            console.log(i+": "+boardObject[i]+" is not null");
                            //console.log(`<<== ${boardObject[i].listTitleString} ==>>>`  );
                            //console.log(boardObject[i]);

                            bobj = boardObject[i];
                            f(`     bobj is... `);
                            f(bobj);
                            //For each list we need to add the list itself to the window
                            //update variables
                            bobId = bobj.listId;
                            f(`     bobId is...`);
                            f(bobId);

                            bobArrayOfItems = bobj.arrayOfItemsFromList;
                            f(`     bobj array is...        `);
                            f(bobArrayOfItems);

                            bobTitle = bobj.listTitleString;
                            f(`     bobj title is... `);
                            f(bobTitle);
                            
                            //now we get the board
                            var db = document.getElementsByTagName("board")[0];

                            //now we add the list to the board
                            listCode = `
                            <div class = "list" id="${bobId}" numberOfItems = "${bobArrayOfItems.length}" boardIndex="${i}">
                                <div class = "listheader" id="${bobId}-header" onmousedown="myDragUtils.mouseDownFunction(event)">
                                    ${bobTitle}
                                    
                                    <div class = "refBtn"> 
                                        <i class="de fa fa-trash-o delete" job="delete" id = "{bobId+"-"+j}" bIn="{targetInputElement.getAttribute("boardIndex")}" arrIn="{n+1}" onclick = "itemUtils.removeList(event)"></i>
                                    </div>
                                </div>
                                
                                <!-- button ?-->
                                <button onclick="myListTitleUtils.updateListTitle(event)" >Change List Title</button> <p></p>

                                <button onclick="myInputUtils.addItemFromInput(event)">+</button> <input type="text" id ="input-${bobId}" placeholder="Add a to-do">
                                
                            </div>
                            `
                            db.insertAdjacentHTML('beforeend',listCode);  

                            //grab the list weve made 
                            var tie = document.getElementById(bobId);
                            var specificListItem;
                            var ls;
                            for(var j = 0 ; j < boardObject[i].arrayOfItemsFromList.length ; j++){
                            //for each element of the list we need to add that to the list on the window
                            //console.log("   "+boardObject[i].arrayOfItemsFromList[j]);
                            specificListItem = boardObject[i].arrayOfItemsFromList[j];

                            ls = `
                                        <li class="item">
                                            <i class="fa {DONE}" job="complete" id = "{id}"></i>
                                            <p class="text {LINE}"> ${specificListItem} </p>
                                            <i class="de fa fa-trash-o delete" job="delete" id = "${bobId+"-"+j}" bIn="${i}" arrIn="${j}" onclick="itemUtils.removeItem(event)"></i>
                                        </li>
                            `
                            tie.insertAdjacentHTML('beforeend',ls);
                        } 
                            //console.log(`<<<============================================>>>`);
                        } else {
                            console.log("___");
                            console.log(i+": "+boardObject[i]+" is null!!!");
                        }
                    }

                } else {
                    console.log(" cannot load null board");
                }
            //console.log("##################################################");
        }


    };

    /*
    *
    *
    *
    *
    */ 
    if(boardData){
        BOARD = JSON.parse(boardData);
        console.log(`### BOARD DATA EXISTS `);
        console.log(boardData);
        if(false){
            console.log("       killing old board files")
            BOARD = [];
            //localStorage.setItem("BOARD",JSON.stringify(BOARD));
            localStorage.removeItem("BOARD");

        }
        //if there is local data we can load it to the page with the loadBoad function
        //loadBoard(BOARD);
        myStorageUtils.loadBoard(BOARD);
        //myStorageUtils.getBoard(BOARD);
        //newOl.callOut();
    } else {
        //if data isn't empty
        console.log(`### NO BOARD DATA EXISTS`);
        BOARD = [];
        
    }


    var listNumber = 1;

    /**
        flags the time with a string
    */
    function f(strang){
        d=new Date();
        console.log(`   ${strang}@${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}:${d.getMilliseconds()}`);
    }

    /**
        easier print function
    */
    function p(pr){
        console.log(`${pr}`);
    }

    //object literal for changing header titles
    var myListTitleUtils = {

        editThisHeader : null,
        inputCodeChunk : null,
        temporaryInputPoint : null,

        updateListTitle : function(eventBoi){
        //var inputPoint = document.getElementById(eventBoi.target.id);
        //console.log(eventBoi);
        //console.log(eventBoi.target);
        //console.log(eventBoi.target.parentNode);
        editThisHeader = document.getElementById(eventBoi.target.parentNode.id+"-header");
        inputCodeChunk = `<input type="text" id ="tempInputCodeChunk-${editThisHeader.id}" placeholder="New list title here" onkeyup="myListTitleUtils.enterKeyUp(event)">`;
        temporaryInputPoint = `tempInputCodeChunk-${editThisHeader.id}`;
        eventBoi.target.insertAdjacentHTML('beforebegin',inputCodeChunk);

        
        },

        enterKeyUp : function(event) {
        //console.log(event);
        //console.log(event.target);
            if(event.code === "Enter"){
                //console.log(`   WOW`);
                var tempInputChunkValue = document.getElementById(event.target.id).value;
                //console.log(tempInputChunkValue);
                //change header
                editThisHeader.innerHTML = tempInputChunkValue;

                //kill the input div
                myListTitleUtils.killTheInput();

                if(debugMe === true ){

                f(`  UPDATE TO BOARD TITLE COMPLETE - UPDATING BOARD OBJECT`);
                f(` target header is  ${editThisHeader.id}`);
                f(` target header title is "${editThisHeader.innerHTML}"`);
               
                f(` target parent is ${editThisHeader.parentNode.id}`);
                f(`     target attributes are... `);
                f(`     class = ${editThisHeader.parentNode.getAttribute('class')}`);
                f(`     id = ${editThisHeader.parentNode.getAttribute('id')}`);
                f(`     number of items = ${editThisHeader.parentNode.getAttribute('numberOfItems')}`);
                f(`     board index = ${editThisHeader.parentNode.getAttribute('boardIndex')}`);
                
                }
                var indexToCheck = parseInt(editThisHeader.parentNode.getAttribute('boardIndex'));
                //f(` ${indexToCheck}  `);

                //now to update the BOARD object with the new title
                //console.log(Object.keys(BOARD));

                //console.log(BOARD[indexToCheck]);

                BOARD[indexToCheck].listTitleString = tempInputChunkValue;

                //console.log(BOARD[indexToCheck]);
                //console.log(BOARD[indexToCheck].listTitleString);

                localStorage.setItem("BOARD",JSON.stringify(BOARD));

            }
        },

        killTheInput : function(){
            var objToKill = document.getElementById(temporaryInputPoint);
            objToKill.remove();
        }


      
    }
 
    var myInputUtils = {
        targetInputElement: null,

        targetInputElementValue : null,
        
        addItemFromInput : function(e){
            f(` addItemFromInput `);
            //
            e = e || window.event;
            e.preventDefault();
            //
            targetInputElement = e.target.parentNode;

            //update input value
            targetInputElementValue = document.getElementById('input-'+targetInputElement.id).value;
            
            //only add item if there has been an input
            if(targetInputElementValue != "" ){
                console.log(targetInputElementValue);

                

                //p(targetElement.getAttribute('numberOfItems'));
                var n = parseInt(targetInputElement.getElementsByClassName("item").length);
                console.log(`   the number of item elements this element has is ${targetInputElement.getElementsByClassName("item").length}`);
                console.log(targetInputElement.getElementsByClassName("item"));
                
                targetInputElement.setAttribute('numberOfItems', n+1);
                

                //update listStructure
                //listStructure = `<p>#${n+1}. ${targetInputElementValue} </p>`;
                listStructure = `
                                <li class="item">
                                    <i class="fa {DONE}" job="complete" id = "{id}"></i>
                                    <p class="text {LINE}"> ${targetInputElementValue} </p>
                                    <i class="de fa fa-trash-o delete" job="delete" id = "{bobId+"-"+j}" bIn="${targetInputElement.getAttribute("boardIndex")}" arrIn="${n+1}" onclick="itemUtils.removeItem(event)"></i>
                                </li>
                `
                //
                targetInputElement.insertAdjacentHTML('beforeend',listStructure);
                //
                console.log(`   the number of item elements this element has is ${targetInputElement.getElementsByClassName("item").length}`);

            } else {
                console.log("null input");
            }

             //now to push these to the BOARD array
            console.log(" Pushing to BOARD arrayOfItemsFromList ");
            if(debugMe === true ){
                f(`     target is ${targetInputElement} `);
                f(`     target id = ${targetInputElement.id} `);
                f(`     target class = ${targetInputElement.class} ` );
                f(`     target parent is ${targetInputElement.parentNode.id} `);
    
                f(`     class = ${targetInputElement.getAttribute('class')} `);
                f(`     id = ${targetInputElement.getAttribute('id')} `);
                f(`     number of items = ${targetInputElement.getAttribute('numberOfItems')} `);
                f(`     board index = ${targetInputElement.getAttribute('boardIndex')} `);

            }


            var bi = parseInt(targetInputElement.getAttribute("boardIndex"));
            
            if(debugMe ===true){
                console.log(BOARD[bi]);
            }
            

            BOARD[bi].arrayOfItemsFromList.push(targetInputElementValue);

            localStorage.setItem("BOARD",JSON.stringify(BOARD));

            if(debugMe ===true){
                console.log(BOARD[bi]);
            }

            //nullify target element before completing util
            targetInputElement = null;

           
        },

        userSpecifiedItem : ` huh?`,

        listStructure : `<p> huh? </p>`,
    }

    var addListUtils = {
        
        listArray : [],
        

        lastListElement : null,

        boardIndexOfElement : null,

        listCode : "",

        
        addListToBoard : function() {
            f(` addListToBoard `);
            //update variables
            listArray = document.getElementsByClassName("list");

            //output to console for debugging
            f(listArray);
            console.log(listArray);
            
            //if its empty then boardIndexOfElement = 0
            if(listArray.length === 0){
                f(` empty array, setting boardIndexOfElement to 0 `);
                
                boardIndexOfElement = 0;
            } else {
                f(` array not empty, setting boardIndexOfElement to list last pos`);
                lastListElement = listArray[listArray.length - 1];
                console.log(lastListElement);
                boardIndexOfElement = parseInt(lastListElement.getAttribute("boardIndex"))+1;
            }
            //check "board" for how many lists exist
        
            var docuBoard = document.getElementsByTagName("board")[0];
            console.log(docuBoard);
            f(` docuBoard - > ${docuBoard} `);

            listCode = `
            <div class = "list" id="element-${boardIndexOfElement+1}" numberOfItems = "0" boardIndex="${boardIndexOfElement}">
                <div class = "listheader" id="element-${boardIndexOfElement+1}-header" onmousedown="myDragUtils.mouseDownFunction(event)">
                    Click here to move
                    <div class = "refBtn"> 
                                <i class="de fa fa-trash-o delete" job="delete" id = "{bobId+"-"+j}" bIn="{targetInputElement.getAttribute("boardIndex")}" arrIn="{n+1}" onclick = "itemUtils.removeList(event)"></i>
                    </div>
                </div>
                <button onclick="myListTitleUtils.updateListTitle(event)" >Change List Title</button> <p></p>
                <button onclick="myInputUtils.addItemFromInput(event)">+</button> <input type="text" id ="input-element-${boardIndexOfElement+1}" placeholder="Add a to-do">
                
            </div>
            `
            docuBoard.insertAdjacentHTML('beforeend',listCode);
            //
                
            //add list to the board data array
            var listIdString=("element-"+(boardIndexOfElement+1));
            f(` listIdString = ${listIdString} `);

            BOARD.push(
                {
                listTitleString: null,
                listId: listIdString,
                listIndex: null,
                arrayOfItemsFromList: []
                }

            );
            
            localStorage.setItem("BOARD",JSON.stringify(BOARD));

            //console.log(BOARD);
            //now to make sure that we can access these elements and edit them 
        }

            

            
        
        
    }
