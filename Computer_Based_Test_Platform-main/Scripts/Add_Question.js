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
var logout_button = document.getElementById("Logout_btn"); //getting refrence to logout button
var Question_desc = document.getElementById("ques_desc"); //getting refrence to Question Description Text area
var Mcq_opt_1 = document.getElementById("mcq_option1_value"); //getting refrence to Option 1 text area
var Mcq_opt_2 = document.getElementById("mcq_option2_value"); //getting refrence to Option 2 text area
var Mcq_opt_3 = document.getElementById("mcq_option3_value"); //getting refrence to Option 3 text area
var Mcq_opt_4 = document.getElementById("mcq_option4_value"); //getting refrence to Option 4 text area
var Submit_Question_btn = document.getElementById("Submit_Question"); //getting refrence to Submit Question Button
var Authored_by_me = document.getElementById("Authored_by_me"); //getting refrence to Authored by me radio button
var Difficulty_slider = document.getElementById("Difficulty_Slider");
var correct_option_1 = document.getElementById("correct_opt_1");
var correct_option_2 = document.getElementById("correct_opt_2");
var correct_option_3 = document.getElementById("correct_opt_3");
var correct_option = 1;
//------------------------------------------------------------------------------- Functions -------------------------------------------------------------------


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
    document.getElementById("my_name").innerHTML = Cookies.get("Name");
}


function Submit_Question()
{
    var authored_by = (Authored_by_me.checked == true) ? Cookies.get("Name") : "Anonymous";

    if(correct_option_1.checked == true)
        correct_option = 1;
    else if(correct_option_2.checked == true)
        correct_option = 2;
    else if(correct_option_3.checked == true)
        correct_option = 3;
    else
        correct_option = 4;


    var current_subject;

    if(document.getElementById("sub_Algorithm").checked == true)
        current_subject = "Algorithm";
    else if(document.getElementById("sub_Automata").checked == true)
        current_subject = "Automata";
    else
        current_subject = "OS";



    console.group("Question_Submission_Log");
    console.log(authored_by);
    console.log(Difficulty_slider.value);
    console.log(Question_desc.value);
    console.log(Mcq_opt_1.value);
    console.log(Mcq_opt_2.value);
    console.log(Mcq_opt_3.value);
    console.log(Mcq_opt_4.value);
    console.log(correct_option);



    console.log("unique id = " + Date.now());


    console.groupEnd("Question_Submission_Log");

    var to_database = "Question_Bank/MCQs/";
    var Question_ID = Date.now();

    if(Question_desc.value != "" && Mcq_opt_1.value != "" && Mcq_opt_2.value != "" && Mcq_opt_3.value != "" && Mcq_opt_4.value != "")
    {
        var path_directory = to_database + Question_ID;

        var Question = {
            Authenticity_Count : 0,
            Subject : current_subject,
            Question_ID : Question_ID,
            Authored_by : authored_by,
            Difficulty : Difficulty_slider.value,
            Description : Question_desc.value,
            Option1 : Mcq_opt_1.value ,
            Option2 : Mcq_opt_2.value ,
            Option3 : Mcq_opt_3.value ,
            Option4 : Mcq_opt_4.value ,
            Correct_Option : correct_option
        }
        set(ref( db , path_directory ), Question )
        .then(()=>{
            alert("data stored successfully");
            location.href = "./Add_Question.html";
        })
        .catch((error)=>{
            alert("unsuccessful, error = " + error);
        });
    }
    else
        alert("Cant leave Fields empty");

}

Difficulty_slider.oninput = function() //function called when slider value changes
{
    document.getElementById("current_difficulty").innerHTML = Difficulty_slider.value;
}

if(Cookies.get("Logged_in") == undefined) //if got to this page without logging in redirect to homepage
    redirect_to_homepage();
else
{
    assign_Profile();
}


logout_button.addEventListener('click',logout_user);
Submit_Question_btn.addEventListener('click',Submit_Question);

