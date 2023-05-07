//--------------------------------------------------------------------- Firebase setup -------------------------------------------------------------------------------

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyDGNsQ9NsqIHkrHyW6D-UNqG8cxnSIWdCI",
    authDomain: "online-test-platform-ffa22.firebaseapp.com",
    projectId: "online-test-platform-ffa22",
    storageBucket: "online-test-platform-ffa22.appspot.com",
    messagingSenderId: "832913608186",
    appId: "1:832913608186:web:5adb28f213d93b6121e843",
    measurementId: "G-HYYH35EM4B"
};

    const app = initializeApp(firebaseConfig);

   import {getDatabase, ref, get, set, child, update,remove}  from "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js" ; //importing the functions

    const db = getDatabase(); //getting the database

//------------------------------------------------------------------- Refrences -------------------------------------------------------------------
var logout_button = document.getElementById("Logout_btn"); //Getting refrence to Logout button
var fetch_question_bank_btn = document.getElementById("fetch_question_bank"); //Getting refrence to fetch question bank button
var Load_overlay = document.getElementById("Load_overlay"); //Getting refrence to loading Overlay
var desc_overlay = document.getElementById("Description_Overlay"); //getting refrence to Question Description overlay
var create_Test_btn = document.getElementById("create_Test");



var Cur_Test_Obj = { //Curent Test JSON Object that contains refrence to all test related HTML elements
    Creater : document.getElementById("Name_of_Problem_setter"),
    Test_Name : document.getElementById("test_name"),
    Test_Duration : document.getElementById("test_duration") ,
    No_of_Questions : document.getElementById("no_of_questions"),
    max_Marks : document.getElementById("max_marks") ,
    Questions : []
}

//-----------------------------------------------------------------------Global variables----------------------------------------------------------------------//

var fetched_Question_Bank_dict = {}; //dictionary that stores the fetched question bank
var selected_Questions_dict = {};

const Desc_overlay_pallet_obj = { //creating A JSON object that contains HTML element refrences
    close_btn : document.getElementById("close_pallet_btn"),
    ques_id : document.getElementById("Question_ID_val"), //getting refrence to Question ID span
    difficulty : document.getElementById("difficulty_val"), //getting refrence to difficulty_val span
    authored_by : document.getElementById("authored_by"), //getting refrence to authored_by span
    Question_desc : document.getElementById("Question_desc"), //getting refrence to Question_Desc textarea
    opt_1_val : document.getElementById("opt_1_val"), //getting refrence to opt_1_val textarea
    opt_2_val : document.getElementById("opt_2_val"), //getting refrence to opt_2_val textarea
    opt_3_val : document.getElementById("opt_3_val"), //getting refrence to opt_3_val textarea
    opt_4_val : document.getElementById("opt_4_val"), //getting refrence to opt_4_val textarea
    correct_opt : document.getElementById("correct_opt") , //getting refrence to correct_opt span
    Marks_alloted : document.getElementById("Marks_alloted") , //getting refrence to input field
    add_to_test_btn : document.getElementById("add_to_test_btn")  //getting refrence to add_to_test_btn
}

//-------------------------------------------------------------------- Functions ----------------------------------------------------




function redirect_to_homepage() //function locates back to Admin_Portal
{
    location.href = "./index.html";
}

function assign_Profile() //this function assigns the profile div it's data for username
{
    Cur_Test_Obj.Creater.innerHTML = Cookies.get("Name"); //setting the creater name
    document.getElementById("logged_in_as").innerHTML = Cookies.get("Name"); //assigning values
}


function logout_user() //function is called when logout button is clicked
{
    Cookies.remove("Logged_in");
    Cookies.remove("user_id");
    Cookies.remove("Name");
    redirect_to_homepage();
}

if(Cookies.get("Logged_in") == undefined) //if got to this page without logging in redirect to homepage
    redirect_to_homepage();
else
    assign_Profile();


function fetch_Question_Bank() //this function is called when we click on the fetch Question Bank Button
{
    Load_overlay.hidden = false; //unhiding the load overlay
    const dbref = ref(db);
    var path_directory = "Question_Bank/MCQs";
    get(child(dbref,path_directory)).then((snapshot)=>{
            if(snapshot.exists())
            {
                var obj = (snapshot.val()); //getting the object
                console.log(obj);
                var values = Object.values(obj); //getting the value array of the object (each item in the object is itself an object)
                console.log(values);
                console.log("loaded");
                Load_overlay.hidden = true; //hiding the loading overlay after the data has been fetched
                fetch_question_bank_btn.hidden = true;
                for(var i=0;i<values.length;i++)
                {
                    console.log(values[i]);
                    fetched_Question_Bank_dict[String(values[i].Question_ID)] = values[i];
                    // add_to_table(table_id,values[i]);
                }

                add_to_table("Question_to_add_MCQ_table");
            }
    });
}

function add_to_table(table_id) //function inserts data into table
{
    var table;

    if(table_id == "Question_to_add_MCQ_table") //if table ID is of {Question to add} table
    {
        for (const [key, value] of Object.entries(fetched_Question_Bank_dict))
        {
            console.log(key, value);

            if(value.Subject == "Automata")
            {
                table = document.getElementById("Question_to_add_MCQ_table_Autometa");
                if( ( parseInt(value.Authenticity_Count) < 5 ) )
                {
                    var row = table.insertRow(2);
                    var question_ID_Cell = row.insertCell(0);
                    var add_image_cell = row.insertCell(1);
                    question_ID_Cell.innerHTML = value.Question_ID;

                    var add_btn_id = "add_btn," + value.Question_ID;
                    var add_btn_img_id = "img," + value.Question_ID;
                    add_image_cell.innerHTML =  "<button class='add_question_btn' id = " + add_btn_id + "> <img src= 'GUI_Resources/add.png' id= "+ add_btn_img_id + "> </button>";
                    var add_btn = document.getElementById(add_btn_id);
                    add_btn.addEventListener('click',Add_Remove_Question.bind(null,value.Question_ID)); //Adding click event listener to all the add buttons
                }
            }
            else if(value.Subject == "OS")
            {
                table = document.getElementById("Question_to_add_MCQ_table_OS");
                if( ( parseInt(value.Authenticity_Count) < 5 ) )
                {
                    var row = table.insertRow(2);
                    var question_ID_Cell = row.insertCell(0);
                    var add_image_cell = row.insertCell(1);
                    question_ID_Cell.innerHTML = value.Question_ID;

                    var add_btn_id = "add_btn," + value.Question_ID;
                    var add_btn_img_id = "img," + value.Question_ID;
                    add_image_cell.innerHTML =  "<button class='add_question_btn' id = " + add_btn_id + "> <img src= 'GUI_Resources/add.png' id= "+ add_btn_img_id + "> </button>";
                    var add_btn = document.getElementById(add_btn_id);
                    add_btn.addEventListener('click',Add_Remove_Question.bind(null,value.Question_ID)); //Adding click event listener to all the add buttons
                }
            }
            else
            {
                table = document.getElementById("Question_to_add_MCQ_table_Algorithm");
                if( ( parseInt(value.Authenticity_Count) < 5 ) )
                {
                    var row = table.insertRow(2);
                    var question_ID_Cell = row.insertCell(0);
                    var add_image_cell = row.insertCell(1);
                    question_ID_Cell.innerHTML = value.Question_ID;

                    var add_btn_id = "add_btn," + value.Question_ID;
                    var add_btn_img_id = "img," + value.Question_ID;
                    add_image_cell.innerHTML =  "<button class='add_question_btn' id = " + add_btn_id + "> <img src= 'GUI_Resources/add.png' id= "+ add_btn_img_id + "> </button>";
                    var add_btn = document.getElementById(add_btn_id);
                    add_btn.addEventListener('click',Add_Remove_Question.bind(null,value.Question_ID)); //Adding click event listener to all the add buttons
                }
            }

        }
    }
    else // else table id is of {Question Added table} so re-iterate
    {
        table = document.getElementById("Question_Added_table");
        var delete_index = 2; //since we want to start deleting from index 2 (index 0 and index 1 are headings)
        while(delete_index < table.rows.length) //deleting all the previous rows
            table.deleteRow(delete_index);

        for (const [key, value] of Object.entries(selected_Questions_dict))
        {
            console.log(key, value);
            var row = table.insertRow(2); //inserting form the second row since first 2 rows are headings
            var question_ID_Cell = row.insertCell(0);
            var marks_cell = row.insertCell(1);
            question_ID_Cell.innerHTML = value.Question_ID;
            marks_cell.innerHTML = value.Marks;
        }
        console.log("\n");
    }
}

function Add_Remove_Question(Question_ID) //function called when user presses any of the Add buttons (with question ID passed as a parameter)
{
    var this_btn = document.getElementById("img," + Question_ID); //getting refrence to add button of current Question
    if((this_btn.src).includes("add.png")) //if currently add icon is set
    {
        //console.log(Question_ID);
        //console.log(fetched_Question_Bank_dict[Question_ID]);

        desc_overlay.hidden = false; //revealing the Overlay

        //Assigning the Data from the Dictionary to HTML elements to display
        Desc_overlay_pallet_obj.ques_id.innerHTML = fetched_Question_Bank_dict[Question_ID].Question_ID;
        Desc_overlay_pallet_obj.difficulty.innerHTML = fetched_Question_Bank_dict[Question_ID].Difficulty;
        Desc_overlay_pallet_obj.authored_by.innerHTML = fetched_Question_Bank_dict[Question_ID].Authored_by;
        Desc_overlay_pallet_obj.Question_desc.innerHTML = fetched_Question_Bank_dict[Question_ID].Description;
        Desc_overlay_pallet_obj.opt_1_val.innerHTML = fetched_Question_Bank_dict[Question_ID].Option1;
        Desc_overlay_pallet_obj.opt_2_val.innerHTML = fetched_Question_Bank_dict[Question_ID].Option2;
        Desc_overlay_pallet_obj.opt_3_val.innerHTML = fetched_Question_Bank_dict[Question_ID].Option3;
        Desc_overlay_pallet_obj.opt_4_val.innerHTML = fetched_Question_Bank_dict[Question_ID].Option4;
        Desc_overlay_pallet_obj.correct_opt.innerHTML = fetched_Question_Bank_dict[Question_ID].Correct_Option;

        Desc_overlay_pallet_obj.close_btn.onclick = function() //if the close button is clicked
        {
            desc_overlay.hidden = true; //just hide the overlay again
        }

        Desc_overlay_pallet_obj.add_to_test_btn.onclick = function() //this function is called when a user clicks on {Add to Test} button (in overlay)
        {
            //console.log("adding + " + Desc_overlay_pallet_obj.ques_id.innerHTML + " with marks = " + Desc_overlay_pallet_obj.Marks_alloted.value);
            if(Desc_overlay_pallet_obj.Marks_alloted.value != "")
            {
                desc_overlay.hidden = true; //Hiding the Overlay

                var selected_question_obj = { //Making a JSON object to store currently added questino data
                    Question_ID : Desc_overlay_pallet_obj.ques_id.innerHTML,
                    Marks : Desc_overlay_pallet_obj.Marks_alloted.value
                }

                Cur_Test_Obj.max_Marks.innerHTML = parseInt(Cur_Test_Obj.max_Marks.innerHTML) +  parseInt(selected_question_obj.Marks); //increasing the max marks counter
                Cur_Test_Obj.No_of_Questions.innerHTML = parseInt(Cur_Test_Obj.No_of_Questions.innerHTML) + parseInt(1); //increasing the number of questions counter

                selected_Questions_dict[Question_ID] = (JSON.parse(JSON.stringify(selected_question_obj))); //Adding pair to dictionary with key as cur question id and values as {selected question object}
                this_btn.src =  "GUI_Resources/cancel.png"; //changing its source
                add_to_table("Question_Added_table");  //displaying the updated table
            }
            else
                alert("Please enter valid marks!");

        }
    }
    else
    {

        Cur_Test_Obj.max_Marks.innerHTML = parseInt(Cur_Test_Obj.max_Marks.innerHTML) -  parseInt(selected_Questions_dict[Question_ID].Marks); //increasing the max marks counter
        Cur_Test_Obj.No_of_Questions.innerHTML = parseInt(Cur_Test_Obj.No_of_Questions.innerHTML) - parseInt(1); //increasing the number of questions counter

        this_btn.src = "GUI_Resources/add.png"; //changing the icon to cross
        delete selected_Questions_dict[Question_ID]; //deleting this Added Question
        add_to_table("Question_Added_table"); //displaying the update table
    }
}


function create_this_test() //This function is called when user clicks on {create a test} it pushes into database
{
    if (Cur_Test_Obj.Test_Name.value != "" && Cur_Test_Obj.No_of_Questions.innerHTML != "0")
    {
        console.log("creating test");
        var test_id = Date.now();
        var path_directory = "Tests/" + test_id;

        var Test_obj_to_Store = {
            Test_ID : test_id,
            Creater : Cur_Test_Obj.Creater.innerHTML,
            Test_Name : Cur_Test_Obj.Test_Name.value,
            Test_Duration : Cur_Test_Obj.Test_Duration.value ,
            No_of_Questions : Cur_Test_Obj.No_of_Questions.innerHTML,
            max_Marks :Cur_Test_Obj.max_Marks.innerHTML ,
            Questions : []
        }

        for (const [key, value] of Object.entries(selected_Questions_dict))
        {
            console.log(key, value);
            Test_obj_to_Store.Questions.push(value);
        }

        set(ref( db , path_directory ), Test_obj_to_Store )
        .then(()=>{
            alert("data stored successfully");
            location.href = "./Create_Test.html";
        })
        .catch((error)=>{
            alert("unsuccessful, error = " + error);
        });

    }
    else
        alert("Please Make a valid Test");
}

logout_button.addEventListener('click',logout_user);
fetch_question_bank_btn.addEventListener('click',fetch_Question_Bank);
create_Test_btn.addEventListener('click',create_this_test);