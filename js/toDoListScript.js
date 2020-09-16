//selecting elements of todolist

const clear = document.querySelector(".clear");

//select the date element
//this needs to be at the top, and to the left of the screen for now
const dateElement = document.getElementById("date");

//select the list
const list = document.getElementById("list");

//selet the input
const input = document.getElementById("input");

//selecting elements
const element = document.getElementById("element");

//make a new variable that takes in class name
const CHECK = "fa-check-circle";
const UNCHECK = "fa-circle-thin";
const LINE_THROUGH =  "lineThrough";

// Variables
let LIST; //these are configured below
let id; 

/*
    In order to make this to do list a lot more functional, we must be able to store some data to the users browser
    we will use the localStorage class
*/
let data = localStorage.getItem("TODO");

/*
    We should also check to see if this data is empty or not
*/
if(data){
    LIST = JSON.parse(data);
    id = LIST.length; //sets the id to the last on in the list
    loadList(LIST); //loads the list
} else {
    //if data isn't empty
    LIST = [];
    id = 0;
}

/* WE will need to load these items into the users interface */
function loadList(/* this will take an array as a parameter */ array){
    array.forEach( function(item){
        addToDo(item.name, item.id, item.done, item.trash);
    });

}

/* Since we are accessing the local storage we should probably not litter */
clear.addEventListener("click", function(){
    localStorage.clear();
    location.reload();
});


/* For fun we will show the user today's date :)  */
//const options = {weekday : "long", month:"short", day:"numeric"};
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
//const today = new Date();
var today = new Date();

//adding this to our page
dateElement.innerHTML = today.toLocaleDateString("en-US", options);
//dateElement.innerHTML = today.toLocaleDateString();

/*  
    our addToDo function
*/
function addToDo( toDo, id,done, trash ) {  
    if(trash){return;}
    const DONE = done ? CHECK : UNCHECK;
    const LINE = done ? LINE_THROUGH : "";
    //creating text variable
    const text = 
                    `<li class="item">
                        
                        <i class="fa ${DONE}" job="complete" id = "${id}"></i>
                        
                        <p class="text ${LINE}"> ${toDo} </p>
                        
                        <i class="de fa fa-trash-o delete" job="delete" id = "${id}" ></i>
                    </li>`
    const position = 'beforeend';
    //inserting new element
    list.insertAdjacentHTML(position,text);
}

//example
//addToDo('Make To Do List',0,false,false);

input.addEventListener( "keyup", function(event){
    if(event.keyCode == 13 ){
        const toDo = input.value;

        //if the input is not empty
        if( toDo ){
            addToDo(toDo, id, false ,false );
            LIST.push(
                {
                    name: toDo,
                    id: id,
                    done: false,
                    trash: false
                }
            );

            //add item to local storage
            localStorage.setItem("TODO",JSON.stringify(LIST));
            //increment id if the input is not empty
            id++;
        }
        //reset input
        input.value = "";
        
    }

});

//now that we have a addToDo function, we need a complete and remove to do

/*
    the complete to do function
*/
function completeToDo(element){
    element.classList.toggle(CHECK);
    element.classList.toggle(UNCHECK);
    element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);

    //now we set this item to be completed if it wasnt already
    LIST[element.id].done = LIST[element.id].done ? false : true ;

}

/* 
    the remove function 
*/

function removeToDo(element){
    //delete the parent
    element.parentNode.parentNode.removeChild(element.parentNode);
    //trash the element
    LIST[element.id].trash = true;
}

/* 
    Target the items created dynamically
*/

list.addEventListener("click", function(event){
    const element = event.target; // whatever you click, this will return it
    
    

    // console.log("# event #:");
    // console.log(event);
    // console.log("# event.target #:");
    // console.log(event.target);
    // console.log("# element #:");
    // console.log(element);
    // console.log("# element.attributes #:");
    // console.log(element.attributes);
    // console.log("# element.attributes.job #:");
    // console.log(element.attributes.job);
    //i need to check if the target has a job at all first...
    if(element.hasAttribute("job") ){
        //console.log("This element has a job attribute!");
        const elementJob = element.attributes.job.value; //completed or deleted?
    

        if(elementJob == "complete"){
            //if the job is done, execute the js method
            completeToDo(element);

        } else if (elementJob == "delete"){
            //if it needs to be deleted then we remove it from the list
            removeToDo(element);
        }

        //and finally we have to add or update the local storage
        localStorage.setItem("TODO",JSON.stringify(LIST));
    }
    
});