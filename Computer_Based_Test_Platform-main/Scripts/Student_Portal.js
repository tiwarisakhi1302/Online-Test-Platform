//--------------------------------------------------------------------- Firebase CDN setup -------------------------------------------------------------------------------

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
var Load_Overlay = document.getElementById("Load_overlay"); //Getting refrence to load overlay div

//--------------------------------------------------------------------Local Variables---------------------------------------------------------------

var Test_Data_obj = {} //Dictionary that keeps key as {Test ID} and values as object
//-------------------------------------------------------------------- Functions -------------------------------------------------------------------

function redirect_to_homepage() //function locates back to Admin_Portal
{
    location.href = "./index.html";
}

function assign_Profile() //this function assigns the profile div it's data for username
{
    document.getElementById("logged_in_as").innerHTML = Cookies.get("Name"); //assigning values
}





function Fetch_Test_Data_from_Database() //This function is called to fetch Test Data from firebase Database
{
    Load_Overlay.hidden = false; //revealing the load overlay
    var path_directory = "Tests/";
    get(ref(db, path_directory ))
    .then((snapshot)=>{
        if( snapshot.exists() )
        {
            //alert("exists");
            var obj = snapshot.val(); //getting the JSON object from the database
            console.log(obj); //read values like this
            Load_Overlay.hidden = true; //Hiding the load overlay after it has been loaded completely
            var val_Array = Object.values(obj); //getting the value array of the object (each item in the array is itself an object)
            console.log(val_Array);
             for(var i=0;i<val_Array.length;i++) //storing the fetched JSON data in a dictionary so as to re-use it whenever needed
               Test_Data_obj[val_Array[i].Test_ID] = val_Array[i];

             console.log(Test_Data_obj);
             add_to_table("Test_Data_Table");
        }
        else
            alert("not exists");
    })
    .catch((error)=>{
        alert("unsuccessful, error = " + error);
    });
}

function add_to_table(id) //function inserts data into table
{
    //inserting cells
    var table = document.getElementById(id);

    for (const [key, value] of Object.entries(Test_Data_obj))  //Iterating over the Test data Dictionary
    {
        console.log(key,value);
        var row = table.insertRow(2); //inserting at the 1
        var Test_name_Cell = row.insertCell(0); //inserting at the 0th col (starting)
        var Creator_Cell = row.insertCell(1); //inserting at the 1th col
        var No_of_Questions_Cell = row.insertCell(2); //inserting at the 2th col
        var Duration_Cell = row.insertCell(3); //inserting at the 3th col
        var Max_Marks_Cell = row.insertCell(4); //inserting at the 4th col
        var Link_Cell = row.insertCell(5); //inserting at the 5th col

        Test_name_Cell.innerHTML = value.Test_Name;
        Creator_Cell.innerHTML = value.Creater;
        No_of_Questions_Cell.innerHTML = value.No_of_Questions;
        Duration_Cell.innerHTML = value.Test_Duration;
        Max_Marks_Cell.innerHTML = value.max_Marks;

        var btn_id = "test," + value.Test_ID;

        Link_Cell.innerHTML = "<Button id=" + btn_id + "> Take Test </Button>";
        document.getElementById(btn_id).addEventListener('click',goto_Test.bind(null,value.Test_ID));
    }
}

function goto_Test(test_id)
{
    console.log(Test_Data_obj[test_id]);
    Cookies.set("Current_test_data",Test_Data_obj[test_id]); //setting cookie for curent test (key = current_test_data) (value = test object)
    location.href = "./Test_Platform.html"; //redirecting to test portal
    //console.log(Cookies.get("Current_test_data"));
    //console.log(JSON.parse(Cookies.get("Current_test_data")).Test_ID);
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


Fetch_Test_Data_from_Database();
logout_button.addEventListener('click',logout_user);
