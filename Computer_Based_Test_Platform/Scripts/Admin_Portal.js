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

//------------------------------------------------------------------------------- Refrences -------------------------------------------------------------------

var logout_button = document.getElementById("Logout_btn"); //Getting refrence to Logout button
var Load_overlay = document.getElementById("Load_overlay"); //Getting refrence to Load Overlay

//--------------------------------------Refrence for Confirmation Overlay-----------------------------------------------
var confirmation_overlay = document.getElementById("Overlay"); //getting refrence to delete Confirmation Overlay div
var delete_confirm_yes_btn = document.getElementById("confirmation_ans_yes"); //getting refrence to delete confirmation ans yes btn
var delete_confirm_no_btn = document.getElementById("confirmation_ans_no"); //getting refrence to delete confirmation ans no btn

//--------------------------------------Refrence for Current Edit Pallet-----------------------------------------------

var current_edit_name = document.getElementById("current_edit_name");
var current_edit_password = document.getElementById("current_edit_password");
var user_type_checkbox_student = document.getElementById("input_as_Student");
var user_type_checkbox_Problem_Setter = document.getElementById("input_as_Problem_Setter");
var update_btn = document.getElementById("Update_btn");

//--------------------------------------Refrence for Register User Pallet-----------------------------------------------

var as_student = document.getElementById("register_as_Student");
var as_problem_setter = document.getElementById("register_as_Problem_Setter");
var input_user_id = document.getElementById("input_user_id");
var input_name = document.getElementById("input_name");
var input_password = document.getElementById("input_password");
var Register_btn = document.getElementById("Register_btn");

//------------------------------------------------------------------------------- Functions -------------------------------------------------------------------



function InsertData() //function inserts data to Database
{
    if(input_user_id.value != "" && input_name.value != "" && input_password.value != "") //if valid input
    {
        var database_loc = (as_student.checked == true) ? "Students/" + input_user_id.value: "Problem_Setters/" + input_user_id.value; //checking which database to insert into
        var obj_to_store = {
            User_ID : input_user_id.value,
            Name : input_name.value,
            Password : input_password.value
        }
        set(ref(db,database_loc),obj_to_store)
        .then(()=>{
            //alert("data stored successfully");
            //reset values
            as_student.checked = true;
            input_user_id.value = "";
            input_name.value = "";
            input_password.value = "";
            refresh_page();
        })
        .catch((error)=>{
            alert("unsuccessful, error = " + error);
        });
    }
    else
        alert("Please Fill data");
}

function refresh_page()
{
    location.href = "./Admin_Portal.html";
}

function edit_data(obj) //this function puts the data from the table to current edit input fields
{
    if(obj.sub_database == "Students")
        user_type_checkbox_student.checked = true;
    else if(obj.sub_database == "Problem_Setters")
        user_type_checkbox_Problem_Setter.checked = true;

    current_edit_name.value = obj.name_val;
    current_edit_password.value = obj.password;
    console.log(obj);
    update_btn.addEventListener('click',update_Data.bind(null,obj));
}

function delete_data(obj) //this function is called when a delete button is clicked (it brings up confirmation dialogue box)
{
    confirmation_overlay.hidden = false; //unhiding the confirmation overlay

    delete_confirm_no_btn.onclick = function(){
        confirmation_overlay.hidden = true; //if no button is clicked just hide the confirmation overlay again
    }

    delete_confirm_yes_btn.onclick = function(){  //if yes button is clicked hide the overlay and delete the data from database
        confirmation_overlay.hidden = true;
        var database_loc = obj.sub_database + "/" + obj.User_ID; //getting database Location to delete
        remove(ref(db,database_loc)) //removing from firebase database
        .then(()=>{
            refresh_page();
        })
        .catch((error)=>{
            alert("unsuccessful , error " + error);
        });
    }
}

function update_Data(obj) //function called when update button is clicked (this function is binded to the button only whem some edit button is clicked)
{
    var database_loc = obj.sub_database + "/" + obj.User_ID; //getting database location to update

    var updated_obj = {  //setting the updated JSON object
        Name : current_edit_name.value,
        Password : current_edit_password.value ,
        User_ID : obj.User_ID
    }

    if(updated_obj.Name == "" || updated_obj.Password == "" )
        alert("You can't leave entries blank");
    else
    {
        update(ref(db,database_loc),updated_obj) //updating in database
        .then(()=>{
            refresh_page();
        })
        .catch((error)=>{
            alert("unsuccessful while  updating , error = " + error);
        })
    }
}

function add_to_table(id,name,pass,uid) //function inserts data into table
{
    var table = document.getElementById(id);
    var row = table.insertRow(2); //inserting at the second index (since index 0 is table heading and 1 is coloumn heading)
    var name_cell = row.insertCell(0); //inserting at the 0th col (starting)
    var pass_cell = row.insertCell(1); //inserting at the 1th col
    var uid_cell = row.insertCell(2); //inserting at the 2th col
    var edit_cell = row.insertCell(3);  //inserting at the 3th col
    var delete_cell = row.insertCell(4);  //inserting at the 4th col
    name_cell.innerHTML = name; //setting data to the cell
    pass_cell.innerHTML = pass; //setting data to the password cell
    uid_cell.innerHTML = uid; //setting data to the user id cell

    var edit_btn_id = "edit," + id + "," + uid; //id for each edit button (using this format to make all id distinct)
    var delete_btn_id = "del," + id + "," + uid; //id for each delete button (using this format to make all id distinct)

    edit_cell.innerHTML = "<Button style = 'background-color: transparent;' id = " + edit_btn_id + " > <img src = './GUI_Resources/Edit_Icon.png'> </Button>";
    edit_cell.style = "width: 80px;";
    delete_cell.innerHTML = "<Button style = 'background-color: transparent; ' id = " + delete_btn_id + " > <img src = './GUI_Resources/Delete_Icon.png'> </Button>";
    delete_cell.style = "width: 80px;";

    const row_object = {
        sub_database : (id == "Student_table") ? "Students" : "Problem_Setters" , //getting subdatabse from table id
        name_val : name,
        password : pass,
        User_ID : uid
    }

    var th_edit_btn = document.getElementById(edit_btn_id);
    th_edit_btn.addEventListener('click',edit_data.bind(null,row_object));

    var th_delete_btn = document.getElementById(delete_btn_id);
    th_delete_btn.addEventListener('click',delete_data.bind(null,row_object));
}


function Fetch_data_from_database(to_database,table_id) //function that fetches all the data from the database passed
{
    Load_overlay.hidden = false; //unhiding the loading overlay
   const dbref = ref(db);
   get(child(dbref,to_database)).then((snapshot)=>{
    if(snapshot.exists())
    {
        var obj = (snapshot.val()); //getting the object
        console.log(obj);
        var values = Object.values(obj); //getting the value array of the object (each item in the array is itself an object)
        console.log(values);
        Load_overlay.hidden = true; //hiding the load overlay since data is fetched from the database
        for(var i=0;i<values.length;i++)
            add_to_table(table_id,values[i].Name,values[i].Password,values[i].User_ID);
    }
   });
}


function redirect_to_homepage() //function locates back to Admin_Portal
{
    location.href = "./index.html";
}

function logout_user()
{
    Cookies.remove("Logged_in");
    Cookies.remove("user_id");
    Cookies.remove("Name");
    redirect_to_homepage();
}


function assign_Profile() //this function assigns the profile div it's data for username
{
    document.getElementById("logged_in_as").innerHTML = Cookies.get("Name"); //assigning values
}

if(Cookies.get("Logged_in") == undefined) //if got to this page without logging in redirect to homepage
    redirect_to_homepage();
else
{
    assign_Profile();
    Fetch_data_from_database('Problem_Setters',"Problem_Setter_table");
    Fetch_data_from_database('Students',"Student_table");
}

 //-----------------------------------------------------------------------------------------Assignments-------------------------------------------------------------------------------//
 logout_button.addEventListener('click',logout_user);
 Register_btn.addEventListener('click',InsertData);