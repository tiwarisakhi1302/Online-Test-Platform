
//------------------------------------------------------- Firebase CDN Setup --------------------------------------------------------------------------------

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

import {getDatabase, ref, get}  from "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js" ; //importing the functions

    const db = getDatabase(); //getting the database

//------------------------------------------------------------------- Refrences -------------------------------------------------------------------

    var login_as_Admin = document.getElementById("login_as_Admin");
    var login_as_Student = document.getElementById("login_as_Student");
    var login_as_Problem_Setter = document.getElementById("login_as_Problem_Setter");
    // var input_uid = document.getElementById("input_uid");
    var input_uid = document.getElementById("input_uid");
    var input_pass = document.getElementById("input_pass");
    var login_button = document.getElementById("login_button");
    var load_overlay = document.getElementById("Load_overlay");

//-------------------------------------------------------------------- Functions ---------------------------------------------------------------

    function Login() //this function is called when user tries to log-in
    {
        console.group("Login Details");
        console.log("Login as Details - " + login_as_Admin.checked + " " + login_as_Student.checked + " " + login_as_Problem_Setter.checked );
        console.log("user id = " + input_uid.value);
        console.log("pass = " + input_pass.value);
        console.groupEnd("Login Details");

        if(input_uid.value != "" && input_pass.value != "") //if input fields are not empty
        {
            if(login_as_Admin.checked) //if login as admin is checked
            {
                    load_overlay.hidden = false;
                    get(ref(db,"Admins/" + input_uid.value))
                    .then((snapshot)=>{
                        if(snapshot.exists() && snapshot.val().Password == input_pass.value) //if this record exists and user id and password matches
                        {
                            Cookies.set("Logged_in","yes"); //storing session cookies
                            Cookies.set("user_id",input_uid.value); //storing session cookies
                            Cookies.set("Name",(snapshot.val().Name)); //storing session cookies for fast retrival of username
                            console.log("Logged in");
                            load_overlay.hidden = true;
                            location.href = "./Admin_Portal.html";
                        }
                        else
                        {
                            load_overlay.hidden = true;
                            alert("Wrong UserID/Password");
                        }
                    })
                    .catch((error)=>{
                        alert("unsuccessful, error = " + error);
                    });
            }
            else if(login_as_Problem_Setter.checked) //if login as problem setter is checked
            {
                    load_overlay.hidden = false;
                    get(ref(db,"Problem_Setters/" + input_uid.value))
                    .then((snapshot)=>{
                        if(snapshot.exists() && snapshot.val().Password == input_pass.value) //if this record exists and user id and password matches
                        {
                            Cookies.set("Logged_in","yes"); //storing session cookies
                            Cookies.set("user_id",input_uid.value); //storing session cookies
                            Cookies.set("Name",(snapshot.val().Name)); //storing session cookies for fast retrival of username
                            console.log("Logged in");
                            load_overlay.hidden = true;
                            location.href = "./Problem_Setter_Portal.html";
                        }
                        else
                        {
                            load_overlay.hidden = true;
                            alert("Wrong UserID/Password");
                        }
                    })
                    .catch((error)=>{
                        alert("unsuccessful, error = " + error);
                    });
            }
            else  //login as student is Set
            {
                    load_overlay.hidden = false;
                    get(ref(db,"Students/" + input_uid.value))
                    .then((snapshot)=>{
                        if(snapshot.exists() && snapshot.val().Password == input_pass.value) //if this record exists and user id and password matches
                        {
                            Cookies.set("Logged_in","yes"); //storing session cookies
                            Cookies.set("user_id",input_uid.value); //storing session cookies
                            Cookies.set("Name",(snapshot.val().Name)); //storing session cookies for fast retrival of username
                            console.log("Logged in");
                            load_overlay.hidden = true;
                            location.href = "./Student_Portal.html";
                        }
                        else
                        {
                            load_overlay.hidden = true;
                            alert("Wrong UserID/Password");
                        }
                    })
                    .catch((error)=>{
                        alert("unsuccessful, error = " + error);
                    });
            }
        }
        else
            alert("Please Enter Values");
    }

    //----------------------------------------------------------------------Assignments------------------------------------------------------------//
     login_button.addEventListener('click',Login);