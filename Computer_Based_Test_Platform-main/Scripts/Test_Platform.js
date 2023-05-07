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
var Load_overlay = document.getElementById("Load_overlay");
var Question_Details_Obj = { //JSON object to store html elements for displaying Question
    Question_Details_Pallet : document.getElementById("Question_details"),
    Marks : document.getElementById("Marks"),
    Question_Description : document.getElementById("Question_Description"),
    Option_1 : document.getElementById("Option1"),
    Option_2 : document.getElementById("Option2"),
    Option_3 : document.getElementById("Option3"),
    Option_4 : document.getElementById("Option4"),
    Radio_Option_1 : document.getElementById("option_1_radio"),
    Radio_Option_2 : document.getElementById("option_2_radio"),
    Radio_Option_3 : document.getElementById("option_3_radio"),
    Radio_Option_4 : document.getElementById("option_4_radio")
}

var Test_Elements = {
    Timer : document.getElementById("timer"),

    Start_Test_Overlay : document.getElementById("Start_Test_Overlay"),
    Start_Test_Confirm_Yes : document.getElementById("Start_test_Confirmation_ans_yes"),
    Start_Test_Confirm_No : document.getElementById("Start_test_Confirmation_ans_no"),

    Resume_Test_Overlay : document.getElementById("Resume_Test_Overlay"),
    Resume_Test_Confirm_Yes : document.getElementById("Resume_Test_Confirmation_ans_yes"),
    Resume_Test_Confirm_No : document.getElementById("Resume_Test_Confirmation_ans_no"),

    Submit_Test_Overlay : document.getElementById("Overlay_for_submission"),
    Submit_Yes_Btn : document.getElementById("submit_yes"),
    Submit_No_Btn : document.getElementById("submit_no"),

    Question_Pallet_Div : document.getElementById("Question_Pallet"),
    Question_Pallet_table : document.getElementById("Question_Pallet_table"),
    Submit_Test_btn : document.getElementById("Submit_Test_btn"),
}


//--------------------------------------------------------------------------Global Variables---------------------------------------------------------

var Candidate_Answers = {}; //creating a Dictionary to store answers answered by the candidate with Key = Question ID and values = Answer
var Correct_Answer = {}; //creating a dictionary to store correct answers of each question with key = {Question ID} and value = correct_opt
var Current_Test_Object = JSON.parse(Cookies.get("Current_test_data")); //JSON object that stores the data of the current test object
var Current_Question_Obj; //object that stores the Complete data of the currently loaded Question
var Resume_Test_Object; //JSON Object that stores the Data from the resumed Object
var Question_marks = {} //dictionary that stores marks of each question key = {Question ID} values = {marks}
//-------------------------------------------------------------------- Functions ----------------------------------------------------

function redirect_to_homepage() //function locates back to Admin_Portal
{
    location.href = "./index.html";
}

function assign_Profile() //this function assigns the profile div it's data for username
{
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

function Start_Timer(start_time) //this function starts the timer
{
    var time = start_time; //setting the start time
    Test_Elements.Timer.innerHTML = time;
    var my_timer = setInterval(function(){
        console.log("time running");
        var cur_time = parseInt(Test_Elements.Timer.innerHTML);
        if(cur_time != 0)
            cur_time--;
        else
        {
            alert("time_up");
            clearInterval(my_timer);
            Submit_Test(); //when time is up , just submit test
        }
        Test_Elements.Timer.innerHTML = (cur_time);
    },1000);
}


Test_Elements.Resume_Test_Confirm_No.onclick = function() //function called when Resume No is clicked
{
    location.href = "./Student_Portal.html";
}

Test_Elements.Resume_Test_Confirm_Yes.onclick = function() //Function called when resume Yes is clicked
{
    Test_Elements.Resume_Test_Overlay.hidden = true;
    Start_Timer(parseInt(Resume_Test_Object.Remaining_Time));  //Starting the Timer from where we left

    //Populating Data
    var Question_No = 0;
    for(var i=0;;i++) //iterating over rows
    {
        var done = false;
        var row = Test_Elements.Question_Pallet_table.insertRow(i);
        for(var j=0;j<5;j++)
        {
            Question_No++;
            var cell = row.insertCell(j);
            var Btn_id = "ques," + Resume_Test_Object.Questions[Question_No-1].Question_ID;
            cell.innerHTML = "<Button class = 'question_pallet_buttons' id= "+ Btn_id + ">" + Question_No + "</Button>";
            var this_Question_obj = Resume_Test_Object.Questions[Question_No-1];
            document.getElementById(Btn_id).addEventListener('click',Clicked_Question.bind(null,this_Question_obj))

            if(Resume_Test_Object.Questions[Question_No-1].Selected_Answer	!= -1) //this question was already answered
            {
                document.getElementById(Btn_id).classList.add("Answered_Btn"); //Adding Green CSS for button
                Candidate_Answers[Resume_Test_Object.Questions[Question_No-1].Question_ID] = parseInt( Resume_Test_Object.Questions[Question_No-1].Selected_Answer ); //Updating Candidate Answers
                Correct_Answer[Resume_Test_Object.Questions[Question_No-1].Question_ID] = Resume_Test_Object.Questions[Question_No-1].Correct_Option; //Putting the correct answer of this question in the dictionary
            }

            Question_marks[Resume_Test_Object.Questions[Question_No-1].Question_ID] = Resume_Test_Object.Questions[Question_No - 1].Marks; //Getting the marks of this question

            if(Question_No == Resume_Test_Object.No_Of_Questions)
            {
                done=true;
                break;
            }
        }
        if(done)
            break;
    }


}

Test_Elements.Start_Test_Confirm_No.onclick = function() //Function called when start No is clicked
{
    location.href = "./Student_Portal.html";
}

Test_Elements.Start_Test_Confirm_Yes.onclick = function() //Function called when start YES is clicked
{
    Test_Elements.Start_Test_Overlay.hidden = true;
    Start_Timer(parseInt(Current_Test_Object.Test_Duration)*60);
    shuffle(Current_Test_Object.Questions); //Shuffling the Questions Array
    //Populating Data
    var Question_No = 0;
    for(var i=0;;i++) //iterating over rows
    {
        var done = false;
        var row = Test_Elements.Question_Pallet_table.insertRow(i);
        for(var j=0;j<5;j++)
        {
            Question_No++;
            var cell = row.insertCell(j);
            var Btn_id = "ques," + Current_Test_Object.Questions[Question_No-1].Question_ID;
            Question_marks[Current_Test_Object.Questions[Question_No-1].Question_ID] = Current_Test_Object.Questions[Question_No-1].Marks;
            cell.innerHTML = "<Button class = 'question_pallet_buttons' id= "+ Btn_id + ">" + Question_No + "</Button>";
            var this_Question_obj = Current_Test_Object.Questions[Question_No-1];
            document.getElementById(Btn_id).addEventListener('click',Clicked_Question.bind(null,this_Question_obj)); //assigning click event listener to each button with passing the question details (stored in the test object) of the particular question
            if(Question_No == Current_Test_Object.No_of_Questions)
            {
                done=true;
                break;
            }
        }
        if(done)
            break;
    }
}

function Save_Progress() //this Function Saves the Progress till now
{
    Load_overlay.hidden = false; //revealing the loadOverlay
    var Question_Array = [];

    for(var i = 0;i < Current_Test_Object.No_of_Questions ; i++)
    {
        var Save_Array_Obj = { //JSON object to PUSH to Question Array
            Question_ID : Current_Test_Object.Questions[i].Question_ID,
            Marks : Current_Test_Object.Questions[i].Marks,
            Selected_Answer : (Candidate_Answers[Current_Test_Object.Questions[i].Question_ID] == undefined) ? -1 : Candidate_Answers[Current_Test_Object.Questions[i].Question_ID],
            Correct_Option : (Correct_Answer[Current_Test_Object.Questions[i].Question_ID] == undefined) ? -1 : Correct_Answer[Current_Test_Object.Questions[i].Question_ID]
        }
        Question_Array.push(  JSON.parse(JSON.stringify(Save_Array_Obj)) ); //pushing this Save Array Object
    }

    var Save_Data = {
        Save_ID : Current_Test_Object.Test_ID + Cookies.get("user_id"),
        Test_ID : Current_Test_Object.Test_ID,
        Remaining_Time : Test_Elements.Timer.innerHTML,
        No_Of_Questions : Current_Test_Object.No_of_Questions,
        Questions :  Question_Array
    }

    var path_directory = "Resume_Test/" + Current_Test_Object.Test_ID + Cookies.get("user_id");

    get(ref( db , path_directory ))
    .then((snapshot)=>{
        if(snapshot.exists() )
        {
            //alert("exists");
            Load_overlay.hidden = true;//hiding the load overlay
            update(ref(db,path_directory),Save_Data)
            .then(()=>{
                //alert("updated");
            })
            .catch((error)=>{
                alert("unsuccessful while  saving , error = " + error);
            })

        }
        else
        {
            //alert("not exists");
            Load_overlay.hidden = true;//hiding the load overlay

            set(ref( db , path_directory ), Save_Data )
            .then(()=>{
                //alert("data stored successfully");
            })
            .catch((error)=>{
                alert("unsuccessful saving, error = " + error);
            });
        }
    })
    .catch((error)=>{
        alert("unsuccessful, error = " + error);
    });
}

function Reset_Option_Radios() //this function resets all the Selected Radio Options
{
    Question_Details_Obj.Radio_Option_1.checked = false;
    Question_Details_Obj.Radio_Option_2.checked = false;
    Question_Details_Obj.Radio_Option_3.checked = false;
    Question_Details_Obj.Radio_Option_4.checked = false;
}

Question_Details_Obj.Radio_Option_1.onclick = function(){
    Candidate_Answers[Current_Question_Obj.Question_ID] = 1;
    var btn_id = "ques," + Current_Question_Obj.Question_ID;
    document.getElementById(btn_id).classList.add("Answered_Btn"); //Adding Green CSS for button
    Save_Progress();
}

Question_Details_Obj.Radio_Option_2.onclick = function(){
    Candidate_Answers[Current_Question_Obj.Question_ID] = 2;
    var btn_id = "ques," + Current_Question_Obj.Question_ID;
    document.getElementById(btn_id).classList.add("Answered_Btn"); //Adding Green CSS for button
    Save_Progress();
}

Question_Details_Obj.Radio_Option_3.onclick = function(){
    Candidate_Answers[Current_Question_Obj.Question_ID] = 3;
    var btn_id = "ques," + Current_Question_Obj.Question_ID;
    document.getElementById(btn_id).classList.add("Answered_Btn"); //Adding Green CSS for button
    Save_Progress();
}

Question_Details_Obj.Radio_Option_4.onclick = function(){
    Candidate_Answers[Current_Question_Obj.Question_ID] = 4;
    var btn_id = "ques," + Current_Question_Obj.Question_ID;
    document.getElementById(btn_id).classList.add("Answered_Btn"); //Adding Green CSS for button
    Save_Progress();
}

//this Question_Obj Passed to it only Contails Question ID and Question Marks
function Display_Question(Question_obj) //this fuction Displays the details of the selected Question
{
    Reset_Option_Radios(); //reseting all the radio buttons
    Question_Details_Obj.Question_Details_Pallet.hidden = false;
    Question_Details_Obj.Question_Description.innerHTML = Current_Question_Obj.Description;
    Question_Details_Obj.Marks = Question_obj.Marks;
    Question_Details_Obj.Option_1.innerHTML = Current_Question_Obj.Option1;
    Question_Details_Obj.Option_2.innerHTML = Current_Question_Obj.Option2;
    Question_Details_Obj.Option_3.innerHTML = Current_Question_Obj.Option3;
    Question_Details_Obj.Option_4.innerHTML = Current_Question_Obj.Option4;

    if(Candidate_Answers[Question_obj.Question_ID] != undefined) //if this question is alread answered
    {
        console.log(Candidate_Answers[Question_obj.Question_ID]);
        if(Candidate_Answers[Question_obj.Question_ID] == 1)
            Question_Details_Obj.Radio_Option_1.checked = true;
        else if(Candidate_Answers[Question_obj.Question_ID] == 2)
            Question_Details_Obj.Radio_Option_2.checked = true;
        else if(Candidate_Answers[Question_obj.Question_ID] == 3)
            Question_Details_Obj.Radio_Option_3.checked = true;
        else
            Question_Details_Obj.Radio_Option_4.checked = true;
    }

}

//this passed question object only contains {question_id and marks} since it is from the test object
function Clicked_Question(Question_obj) //this function is called when the user clicks on any of the question button from Question pallet (with the question object passed)
{
    Load_overlay.hidden = false; //Revealing Loading Overlay
    var path_directory = "Question_Bank/MCQs/" + Question_obj.Question_ID;
    get(ref( db , path_directory )) //fetching the  Question from the database
    .then((snapshot)=>{
        if(snapshot.exists() )
        {
            //alert("exists");
            //console.log(snapshot.val().name); //read values like this
            Current_Question_Obj = snapshot.val();
            console.log(Current_Question_Obj);
            Correct_Answer[Current_Question_Obj.Question_ID] = Current_Question_Obj.Correct_Option; //getting the correct answer of this question in the dictionary
            Display_Question(Question_obj);
            Load_overlay.hidden = true; //Hidings Loading Overlay
        }
        else
        {
            alert("not exists");
        }
    })
    .catch((error)=>{
        alert("unsuccessful, error = " + error);
    });
}

function shuffle(a) //this function shuffles the array passed to it
{
    for(var j,i=a.length-1;i>0;i--)
    {
        j=Math.floor(Math.random()*(i+1));
        [a[i],a[j]]=[a[j],a[i]]
    }
}

function Submit_Test() //this function Submits Test (called when time is over or user submits test)
{
    Load_overlay.hidden = false; //Revaling the load overlay
    var path_directory = "Resume_Test/" + Current_Test_Object.Test_ID + Cookies.get("user_id");

    get(ref( db , path_directory ))
    .then((snapshot)=>{
        if(snapshot.exists() )  //IF Resume Data Exists Then Delete it
        {
            //alert("exists");
                remove(ref( db , path_directory ))
                .then(()=>{
                    //alert("deleted successfully");
                    Calculate_Result();
                })
                .catch((error)=>{
                    alert("unsuccessful while deleting Resume Data, error " + error);
                });
        }
        else
        {
           // alert("not exists");
           Calculate_Result();
        }
    })
    .catch((error)=>{
        alert("unsuccessful, error = " + error);
    });


}

function Calculate_Result() //this function calculates the result of the user
{
    var Attempted_Array = []; // An array of objects that stores JSON { Choosed_Option , Correct_Option , Marks , Question_ID }
    var score = 0;

    for (const [key, value] of Object.entries(Candidate_Answers))
    {
        console.log("Key = " + key + " value  " + value); //Key -> Question ID , value -> Marks

        if( Correct_Answer[key]  == value  )
            score += parseInt(Question_marks[key]);

        var Attempted_obj = {
            Choosed_Option :  parseInt(value),
            Correct_Option : parseInt(Correct_Answer[key]),
            Marks : parseInt(Question_marks[key]),
            Question_ID : key,
        }

        Attempted_Array.push(Attempted_obj);
    }

    var JSON_to_Insert = {
        Test_ID : Current_Test_Object.Test_ID,
        User_ID : Cookies.get("user_id"),
        Attempted : Attempted_Array ,
        Score : score ,
        Remaining_Seconds : parseInt(Test_Elements.Timer.innerHTML)
    }

    console.log(JSON_to_Insert);


    //Entrying to Database

    var path_directory = "Test_Results/" + Current_Test_Object.Test_ID + Cookies.get("user_id");

    set(ref( db , path_directory ), JSON_to_Insert )
    .then(()=>{
        alert("data stored successfully");
    })
    .catch((error)=>{
        alert("unsuccessful, error = " + error);
    });


    location.href = "./Result_Section.html"; //Redirecting to Result Section
}
function Begin_Test() //function called when the page loads
{
    //checking if we can resume test
    Load_overlay.hidden = false;//Revealing the loading Overlay

        var path_directory = "Resume_Test/" + Current_Test_Object.Test_ID + Cookies.get("user_id");
        //console.log(path_directory);

        get(ref( db , path_directory ))
        .then((snapshot)=>{
        if(snapshot.exists() ) //Yes we can resume test
        {
            console.log("Found Resume Data , Resuming Test!");
            Load_overlay.hidden = true; //Hiding the load overlay
            Test_Elements.Resume_Test_Overlay.hidden = false; //Revealing the resume test overlay
            Resume_Test_Object = snapshot.val(); //Getting the resume test data object
            console.log(Resume_Test_Object);
        }
        else //no we start new test
        {
            Load_overlay.hidden = true; //Hiding the load overlay
            Test_Elements.Start_Test_Overlay.hidden = false; //Revealing the Start test overlay
        }
    })
    .catch((error)=>{
        alert("unsuccessful, error = " + error);
    });
}


Test_Elements.Submit_Test_btn.onclick = function() //function called when clicking Submit test button is clicked
{
    Test_Elements.Submit_Test_Overlay.hidden = false; //revealing the submit test overlay
}

Test_Elements.Submit_Yes_Btn.onclick = function() //Function Called when user clicks on yes while submit confirmation
{
    Submit_Test();
}

Test_Elements.Submit_No_Btn.onclick = function() //function Called when user clicks on no while submit confirmation
{
    Test_Elements.Submit_Test_Overlay.hidden = true;//hiding the submit test overlay
}

Begin_Test(); //calling
logout_button.addEventListener('click',logout_user);