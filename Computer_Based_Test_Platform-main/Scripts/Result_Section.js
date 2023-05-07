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
var Load_Overlay = document.getElementById("Load_overlay"); //Getting Refrence to the Load Overlay button
var Test_ID_Cell = document.getElementById("test_id_cell"); //test id Cell
var Score_Cell = document.getElementById("Score_Cell"); //Getting refrence to Score cell
//-------------------------------------------------------------------- Functions ----------------------------------------------------

function redirect_to_homepage() //function locates back to Admin_Portal
{
    location.href = "./index.html";
}

function assign_Profile() //this function assigns the profile div it's data for username
{
    document.getElementById("logged_in_as").innerHTML = Cookies.get("Name"); //assigning values
}


function Display_Result(Result_Data_Obj)
{
    var table = document.getElementById("Result_Table");
    Test_ID_Cell.innerHTML = Result_Data_Obj.Test_ID;
    Score_Cell.innerHTML = Result_Data_Obj.Score;
    if(Result_Data_Obj.Attempted != undefined) //if actually attempted
    {
        for(var i=0;i<Result_Data_Obj.Attempted.length;i++) //iterating over the attempted array
        {
            var row  = table.insertRow(2);
            var Question_ID_cell = row.insertCell(0);
            var Question_Marks_cell = row.insertCell(1);
            var Attempted_Option_cell = row.insertCell(2);
            var Correct_Option_cell = row.insertCell(3);
            var Status_Cell = row.insertCell(4);
            Question_ID_cell.innerHTML = Result_Data_Obj.Attempted[i].Question_ID;
            Question_Marks_cell.innerHTML = Result_Data_Obj.Attempted[i].Marks;
            Attempted_Option_cell.innerHTML = Result_Data_Obj.Attempted[i].Choosed_Option;
            Correct_Option_cell.innerHTML = Result_Data_Obj.Attempted[i].Correct_Option;

            if(Result_Data_Obj.Attempted[i].Correct_Option == Result_Data_Obj.Attempted[i].Choosed_Option)
                Status_Cell.innerHTML = "<img src = 'GUI_Resources/accept.png' >";
            else
                Status_Cell.innerHTML = "<img src = 'GUI_Resources/cancel.png' >";
        }
    }
    else
        alert("You havent attempted the test");

}

function Fetch_Data()
{
    var Test_ID = JSON.parse(Cookies.get("Current_test_data")).Test_ID;
    var User_ID = JSON.parse(Cookies.get("user_id"));
    Load_Overlay.hidden = false; //displaying the load overlay
    var path_directory = "Test_Results/" + Test_ID + User_ID;

    get(ref( db , path_directory ))
    .then((snapshot)=>{
        if(snapshot.exists() )
        {
            //alert("exists");
            console.log(snapshot.val()); //Debugging the data we got
            Display_Result(snapshot.val()); //this function display the result into the table
            Load_Overlay.hidden = true; //hiding the load overlay
        }
        else
        {
            alert("You didnt Attempted the test");
        }
    })
    .catch((error)=>{
        alert("unsuccessful, error = " + error);
    });
}

function logout_user() //function is called when logout button is clicked
{
    Cookies.remove("Logged_in");
    Cookies.remove("user_id");
    Cookies.remove("Name");
    redirect_to_homepage();
}

Fetch_Data();

if(Cookies.get("Logged_in") == undefined) //if got to this page without logging in redirect to homepage
    redirect_to_homepage();
else
    assign_Profile();

logout_button.addEventListener('click',logout_user);