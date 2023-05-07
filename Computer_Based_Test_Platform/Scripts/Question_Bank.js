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

var logout_button = document.getElementById("Logout_btn");
var del_Confirm_yes_btn = document.getElementById("confirmation_ans_yes");
var del_Confirm_no_btn = document.getElementById("confirmation_ans_no");
var confirmation_overlay = document.getElementById("Overlay");
var loading_overlay = document.getElementById("Load_overlay");
//Question Pallet elements Object
var Question_Pallet = { //JSON object for HTML elements of question pallet
    Cross_Btn : document.getElementById("Cross_Btn"),
    Authenticity_Count : document.getElementById("Authenticity_Vote"),
    Subject_Cell : document.getElementById("Subject_Cell"),
    Upvote_Btn : document.getElementById("Upvote_Btn"),
    Downvote_Btn : document.getElementById("Downvote_Btn"),
    Edit_Btn : document.getElementById("Edit_Button"),
    Edit_Btn_img : document.getElementById("Edit_btn_img"),
    Delete_Btn : document.getElementById("Delete_Button"),
    Question_Pallet_holder_div : document.getElementById("Question_Pallet_holder_div"),
    Cur_Question_ID : document.getElementById("Cur_Question_ID"),
    authoterd_by_me_radio : document.getElementById("Authored_by_me") ,
    Authored_by_anonymous_radio : document.getElementById("Authored_by_anonymous") ,
    authored_by_me_span : document.getElementById("my_name"),
    Difficulty_Slider : document.getElementById("Difficulty_Slider") ,
    current_difficulty_span : document.getElementById("current_difficulty") ,
    ques_desc : document.getElementById("ques_desc") ,
    MCQ_options_values : [  document.getElementById("mcq_option1_value") , document.getElementById("mcq_option2_value") , document.getElementById("mcq_option3_value") , document.getElementById("mcq_option4_value") ] ,
    Correct_opt : [ document.getElementById("correct_opt_1") , document.getElementById("correct_opt_2") , document.getElementById("correct_opt_3") , document.getElementById("correct_opt_4") ] ,
    update_row : document.getElementById("Update_row") ,
    Update_Ques_btn : document.getElementById("Update_Question")
}

Question_Pallet.Cross_Btn.onclick = function()
{
    console.log("button id = ");
    console.log("btnimg,"  + Question_Pallet.Cur_Question_ID.innerHTML);
    var image_id = "btnimg,"  + Question_Pallet.Cur_Question_ID.innerHTML;
    document.getElementById(image_id).src = "GUI_Resources/Right_Arrow.png";
    Question_Pallet_holder_div.hidden = true;
}

//------------------------------------------------------------------------------- Functions -------------------------------------------------------------------


function display_question(id,btn_id,values_obj) //this function is called when view button of any question is clicked
{
    console.log(id);
    console.log(values_obj);
    var view_btn = document.getElementById(btn_id);
    //console.log(view_btn.src);
    if( (view_btn.src).includes("Right_Arrow.png") )
    {
        view_btn.src = "GUI_Resources/eye.png";
        Question_Pallet.Question_Pallet_holder_div.hidden = false; //toggeling hiding div
        Question_Pallet.Cur_Question_ID.innerHTML = (id.split(","))[1]; //putting the current Question ID to the Question Pallet

        if (values_obj.Authored_by == "Anonymous")
        {
            Question_Pallet.authoterd_by_me_radio.checked = false;
            Question_Pallet.Authored_by_anonymous_radio.checked = true;
        }
        else
        {
            Question_Pallet.authoterd_by_me_radio.checked = true;
            Question_Pallet.Authored_by_anonymous_radio.checked = false;
        }

        Question_Pallet.Subject_Cell.innerHTML = (values_obj.Subject);
        Question_Pallet.Authenticity_Count.innerHTML = (values_obj.Authenticity_Count == undefined) ? 0 : values_obj.Authenticity_Count;
        Question_Pallet.current_difficulty_span.innerHTML = values_obj.Difficulty;
        Question_Pallet.authored_by_me_span.innerHTML = Cookies.get("Name");
        Question_Pallet.ques_desc.innerHTML = values_obj.Description;
        Question_Pallet.Difficulty_Slider.value = values_obj.Difficulty;
        Question_Pallet.MCQ_options_values[0].innerHTML = values_obj.Option1;
        Question_Pallet.MCQ_options_values[1].innerHTML = values_obj.Option2;
        Question_Pallet.MCQ_options_values[2].innerHTML = values_obj.Option3;
        Question_Pallet.MCQ_options_values[3].innerHTML = values_obj.Option4;

        Question_Pallet.Correct_opt[0].checked = (values_obj.Correct_Option == 1) ?  true : false;
        Question_Pallet.Correct_opt[1].checked = (values_obj.Correct_Option == 2) ?  true : false;
        Question_Pallet.Correct_opt[2].checked = (values_obj.Correct_Option == 3) ?  true : false;
        Question_Pallet.Correct_opt[3].checked = (values_obj.Correct_Option == 4) ?  true : false;
    }
    else
    {
        view_btn.src = "GUI_Resources/Right_Arrow.png";
        Question_Pallet.Question_Pallet_holder_div.hidden = true; //toggeling hiding div
    }

}

function add_to_table(id,values_obj) //function inserts data into table (here values is a JSON object)
{
    //inserting cells

    var table = document.getElementById(id);
    var row = table.insertRow(2); //inserting at the 1
    var Question_ID_cell = row.insertCell(0); //inserting at the 0th col (starting)
    var display_col = row.insertCell(1); //inserting at the 0th col (starting)
    var Votes_cell = row.insertCell(2); //cell for displaying the Authentication Count
    //adding data to cells

    Question_ID_cell.innerHTML = values_obj.Question_ID; //adding question id to table

    Votes_cell.innerHTML = (values_obj.Authenticity_Count == undefined) ? 0 : values_obj.Authenticity_Count;
    var drop_down_btn_id = "dropdown," + values_obj.Question_ID; //defining button ID
    var view_btn_img_id = "btnimg," + values_obj.Question_ID; //button image
    display_col.innerHTML = "<Button style = 'background-color: transparent;' id = " + drop_down_btn_id + " > <img src='GUI_Resources/Right_Arrow.png' id = " + view_btn_img_id + "> </Button>"; //adding button with this ID

    var th_display_btn = document.getElementById(drop_down_btn_id);
    th_display_btn.addEventListener('click',display_question.bind(null,drop_down_btn_id,view_btn_img_id,values_obj)); //assigning event listener to this button to call the function
}

function Fetch_data_from_database(to_database) //function that fetches all the data from the database passed as JSON object
{
    console.log("loading");
    loading_overlay.hidden = false; //showing loading animation while fetching data from database
    const dbref = ref(db);
    get(child(dbref,to_database)).then((snapshot)=>{
    if(snapshot.exists())
    {
        var obj = (snapshot.val()); //getting the object

        console.log(obj);
        var values = Object.values(obj); //getting the value array of the object (each item in the object is itself an object)
        console.log(values);
        console.log("loaded");
        loading_overlay.hidden = true; //hiding the loading overlay after the data has been fetched
        for(var i=0;i<values.length;i++)
        {
            console.log(values[i].Question_ID);
            if ( values[i].Authenticity_Count < 5 )
            {
                if(values[i].Subject == "Automata")
                    add_to_table("Questions_For_Review_table_Autometa",values[i]);
                else if(values[i].Subject == "OS")
                    add_to_table("Questions_For_Review_table_OS",values[i]);
                else
                    add_to_table("Questions_For_Review_table_Algorithm",values[i]);
            }
            else
            {
                if(values[i].Subject == "Automata")
                    add_to_table("MCQ_Bank_table_Automata",values[i]);
                else if(values[i].Subject == "OS")
                    add_to_table("MCQ_Bank_table_OS",values[i]);
                else
                    add_to_table("MCQ_Bank_table_Algorithm",values[i]);
            }

        }
    }
   });
}


function redirect_to_homepage() //function locates back to Admin_Portal
{
    location.href = "./index.html";
}

function logout_user() //function is called when logout button is clicked
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
    assign_Profile();



function edit_question() //this function is called when edit button is clicked
{
    //toggling everything
    if( parseInt(Question_Pallet.Authenticity_Count.innerHTML) < 5)
    {
        Question_Pallet.ques_desc.disabled = !Question_Pallet.ques_desc.disabled;

        if((Question_Pallet.Edit_Btn_img.src).includes("Edit_Icon.png"))
        {
            (Question_Pallet.Edit_Btn_img).src = "GUI_Resources/Edit_Icon_pressed.png";
            console.log("aaiya");
        }
        else
            Question_Pallet.Edit_Btn_img.src = "GUI_Resources/Edit_Icon.png";

        for(var i=0;i<4;i++)
        {
            Question_Pallet.MCQ_options_values[i].disabled = !Question_Pallet.MCQ_options_values[i].disabled;
            Question_Pallet.Correct_opt[i].disabled = !Question_Pallet.Correct_opt[i].disabled;
        }

        Question_Pallet.authoterd_by_me_radio.disabled = !Question_Pallet.authoterd_by_me_radio.disabled;
        Question_Pallet.Authored_by_anonymous_radio.disabled = !Question_Pallet.Authored_by_anonymous_radio.disabled;
        Question_Pallet.Difficulty_Slider.disabled = !Question_Pallet.Difficulty_Slider.disabled;
        Question_Pallet.update_row.hidden = !Question_Pallet.update_row.hidden; //toggling update row
    }
    else
    {
        alert("You Cant Edit a Already Verified and Authentic Question ");
    }

}


function Update_Data() //this function is called when update data button is clicked
{
    var correct_opt;

    for(var i=0;i<4;i++)
        if(Question_Pallet.Correct_opt[i].checked)
            correct_opt = i+1;


    var path_directory = "Question_Bank/MCQs/" + Question_Pallet.Cur_Question_ID.innerHTML;

    //console.log(Question_Pallet.Cur_Question_ID.innerHTML);

    if(Question_Pallet.ques_desc.value != "" && Question_Pallet.MCQ_options_values[0].value && Question_Pallet.MCQ_options_values[1].value && Question_Pallet.MCQ_options_values[2].value && Question_Pallet.MCQ_options_values[3].value)
    {
            var Updated_Question_Obj = {
                Question_ID : Question_Pallet.Cur_Question_ID.innerHTML,
                Authored_by : (Question_Pallet.authoterd_by_me_radio.checked == true) ? Question_Pallet.authored_by_me_span.innerHTML : "Anonymous",
                Difficulty : Question_Pallet.Difficulty_Slider.value,
                Description : Question_Pallet.ques_desc.value,
                Option1 : Question_Pallet.MCQ_options_values[0].value ,
                Option2 : Question_Pallet.MCQ_options_values[1].value ,
                Option3 : Question_Pallet.MCQ_options_values[2].value ,
                Option4 : Question_Pallet.MCQ_options_values[3].value ,
                Correct_Option : correct_opt
            }

            //console.log(Updated_Question_Obj);

            update(ref(db,path_directory),Updated_Question_Obj)
            .then(()=>{
                alert("updated");
                location.href = "./Question_Bank.html";
            })
            .catch((error)=>{
                alert("unsuccessful while  updating , error = " + error);
            })
        }
        else
            alert("Please Enter Values To update");


}

Question_Pallet.Difficulty_Slider.oninput = function() //function called when slider value changes
{
   Question_Pallet.current_difficulty_span.innerHTML = Question_Pallet.Difficulty_Slider.value;
}

function Delete_Data() //function called when we press yes to delete confirmation
{
    confirmation_overlay.hidden  = true;
    var path_directory = "Question_Bank/MCQs/" + Question_Pallet.Cur_Question_ID.innerHTML;
    remove(ref( db , path_directory ))
        .then(()=>{
            alert("deleted successfully");
            location.href = "./Question_Bank.html";
        })
        .catch((error)=>{
            alert("unsuccessful , error " + error);
        });
}

Question_Pallet.Upvote_Btn.onclick = function() //function called when upvote button is clicked
{
    if(Cookies.get(Question_Pallet.Cur_Question_ID.innerHTML) == undefined) //Means He has not up-voted or down-voted
    {
        console.log("Upvote " + Question_Pallet.Cur_Question_ID.innerHTML);
        var path_directory = "Question_Bank/MCQs/" + Question_Pallet.Cur_Question_ID.innerHTML;
        get(ref( db , path_directory ))
        .then((snapshot)=>{
            if(snapshot.exists() )
            {
                    var updated_JSON_Object = {
                        Subject : snapshot.val().Subject,
                        Authored_by : snapshot.val().Authored_by,
                        Correct_Option : snapshot.val().Correct_Option,
                        Description : snapshot.val().Description,
                        Difficulty : snapshot.val().Difficulty,
                        Option1 : snapshot.val().Option1,
                        Option2 : snapshot.val().Option2,
                        Option3 : snapshot.val().Option3,
                        Option4 : snapshot.val().Option4,
                        Question_ID : snapshot.val().Question_ID,
                        Authenticity_Count : parseInt(snapshot.val().Authenticity_Count) + 1
                    }

                    update(ref( db , path_directory),updated_JSON_Object)
                    .then(()=>{
                        alert("Upvoted");
                        Cookies.set(Question_Pallet.Cur_Question_ID.innerHTML,"Upvoted");
                        location.href = "./Question_Bank.html";
                    })
                    .catch((error)=>{
                        alert("unsuccessful while  updating , error = " + error);
                    })
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
    else
        alert("You have already Casted your vote");

}

Question_Pallet.Downvote_Btn.onclick = function()
{
    if(Cookies.get(Question_Pallet.Cur_Question_ID.innerHTML) == undefined)
    {
        console.log("Downvote " + Question_Pallet.Cur_Question_ID.innerHTML);
        var path_directory = "Question_Bank/MCQs/" + Question_Pallet.Cur_Question_ID.innerHTML;
        get(ref( db , path_directory ))
        .then((snapshot)=>{
            if(snapshot.exists() )
            {
                    var updated_JSON_Object = {
                        Subject : snapshot.val().Subject,
                        Authored_by : snapshot.val().Authored_by,
                        Correct_Option : snapshot.val().Correct_Option,
                        Description : snapshot.val().Description,
                        Difficulty : snapshot.val().Difficulty,
                        Option1 : snapshot.val().Option1,
                        Option2 : snapshot.val().Option2,
                        Option3 : snapshot.val().Option3,
                        Option4 : snapshot.val().Option4,
                        Question_ID : snapshot.val().Question_ID,
                        Authenticity_Count : parseInt(snapshot.val().Authenticity_Count) - 1
                    }

                    update(ref(db,path_directory),updated_JSON_Object)
                    .then(()=>{
                        alert("Downvoted");
                        Cookies.set(Question_Pallet.Cur_Question_ID.innerHTML,"Downvoted");
                        location.href = "./Question_Bank.html";
                    })
                    .catch((error)=>{
                        alert("unsuccessful while  updating , error = " + error);
                    })
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
    else
        alert("You have already Casted your vote");
}

function view_confirmation() //this function enables the confirmation overlay when someone deletes a question
{
    if(parseInt(Question_Pallet.Authenticity_Count.innerHTML) < 5)
        confirmation_overlay.hidden = false;
    else
        alert("You Can't Delete an Authentic and Verified Question");
}

function dont_delete() //function called when no confirmation button is pressed
{
        confirmation_overlay.hidden  = true;
}

logout_button.addEventListener('click',logout_user);
//fetch_MCQs.addEventListener('click',Fetch_data_from_database.bind(null,"Question_Bank/MCQs","MCQ_Bank_table"));
Fetch_data_from_database("Question_Bank/MCQs");
Question_Pallet.Edit_Btn.addEventListener('click',edit_question);
Question_Pallet.Update_Ques_btn.addEventListener('click',Update_Data); //adding click event listener to Update Question Button
Question_Pallet.Delete_Btn.addEventListener('click',view_confirmation);
del_Confirm_no_btn.addEventListener('click',dont_delete);
del_Confirm_yes_btn.addEventListener('click',Delete_Data);
