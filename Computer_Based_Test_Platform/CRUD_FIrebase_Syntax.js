
//Create Entry => 

    set(ref( database_refrence , path_directory ), JSON_to_Insert )
    .then(()=>{
        alert("data stored successfully");
    })
    .catch((error)=>{
        alert("unsuccessful, error = " + error);
    });

//READ => 

    get(ref( database_refrence , path_directory ))
    .then((snapshot)=>{
        if(snapshot.exists() ) 
        {
            alert("exists");
            console.log(snapshot.val().name); //read values like this
        }
        else
        {
            alert("not exists");
        }
    })
    .catch((error)=>{
        alert("unsuccessful, error = " + error);
    });


//Update Syntax ->

    update(ref( database_refrence , path_directory),{updated_JSON_Object})
        .then(()=>{
            alert("updated");
        })
        .catch((error)=>{
            alert("unsuccessful while  updating , error = " + error);
        })
    

//Delete syntax => 

    remove(ref( database_refrence , path_directory ))
        .then(()=>{
            alert("deleted successfully");
        })
        .catch((error)=>{
            alert("unsuccessful , error " + error);
        });
    

