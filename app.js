const { createClient } = supabase;

// Create a single supabase client for interacting with your database
const _supabase = createClient(
  "https://ymwhxcrgumtzgadvfakv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inltd2h4Y3JndW10emdhZHZmYWt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0OTAxNDIsImV4cCI6MjA1MjA2NjE0Mn0.O0-DjhIFJ1OO76GapA81NSoKdm83L5vYasm5Jj-UiK0"
);

$(document).ready(function () {


try {
  $(document).on("click",".delete", async function () {
    var idd = $(this).data("delete_id");
    var thiss = $(this)
    console.log(idd);
    const {status} = await _supabase
  .from('REAL_TIME_CRUD')
  .delete()
  .eq('id', idd)
if(status){
  // $(this).closest("tr").remove();
  Swal.fire({
    icon: "Delete",
    title: "✔",
    text: "Deleted Succefully!",
    
  });

}
  });
} catch (error) {
  console.log(error);
  
}




try {
  $(document).on("click", ".update", function (e) {
    e.preventDefault();
    
    // Show/hide buttons
    $("#submit").hide();
    $("#update").show();

    // Get data from the clicked element
    var update_id = $(this).data("update_id");
    var email = $(this).data("email");
    var pass = $(this).data("password");

    // Set the input fields with current values
    $("#exampleInputEmail1").val(email);
    $("#exampleInputPassword1").val(pass);

    // On Update button click
    $("#update").click(async function (e) {
      e.preventDefault();

      // Get updated values from the input fields
      var update_email_val = $("#exampleInputEmail1").val();
      var update_pass_val = $("#exampleInputPassword1").val();

      // Update in Supabase
      const { error, status } = await _supabase
        .from('REAL_TIME_CRUD')
        .update({ email: update_email_val, password: update_pass_val })
        .eq('id', update_id);

      // Check if update was successful
    if($("#exampleInputEmail1").val() == "" || $("#exampleInputPassword1").val() == ""){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "all field req!",
        // footer: '<a href="#">Why do I have this issue?</a>'
      });
    }else{
      if (status == 204) {
        // Hide the update button and show the submit button
        $("#submit").show();
        $("#update").hide();
        
        // Clear the input fields after update
        $("#exampleInputEmail1").val("");
        $("#exampleInputPassword1").val("");
        Swal.fire({
          title: "Updated!",
          icon: "success",
          draggable: true
        });
      } else {
        console.error("Error updating record:", error);
      }
    }
    });
  });
} catch (error) {
  console.log(error);
}






  async function fetchMessages() {
    const { data, error } = await _supabase.from("REAL_TIME_CRUD").select();
    console.log(data);

    if (error) {
      alert("Some error occurred!");
    } else {
      renderMessages(data); // ✅ Yahan `fetchMessages()` ke andar `renderMessages()` call karenge
    }
  }


  //read data 
  function renderMessages(data) {
    try {
    // ✅ Yeh alag function hai jo data ko table me dikhayega
    $("#td tbody").empty();

    $.each(data, function (key, val) {
      let row = `
      
             <tr>
               <th scope="row">${val.id}</th>
               <td>${val.email}</td>
               <td>${val.password}</td>
               <td>
                 <button class="btn btn-danger delete" data-delete_id="${val.id}">delete</button>
                 <button class="btn btn-info update" data-update_id="${val.id}" data-email="${val.email}" data-password="${val.password}">update</button>
               </td>
             </tr>
        `;

      $("#td tbody").append(row);
    });
  } catch (error) {
    
    console.log(error);
    
  }
}

//insert data 



try {
  $(document).on("click","#submit", async function (e) {
    e.preventDefault();
     $("#update").hide();
     var email = $("#exampleInputEmail1").val();
     var password = $("#exampleInputPassword1").val();
   
      
     // console.log(email,password);
     
     if($("#exampleInputEmail1").val() == "" || $("#exampleInputPassword1").val() == ""){
       Swal.fire({
         icon: "error",
         title: "Oops...",
         text: "all field req!",
         // footer: '<a href="#">Why do I have this issue?</a>'
       });
     }else{
       const { error } = await _supabase
       .from("REAL_TIME_CRUD")
       .insert({ email, password });
   
     if (error) {
       alert("Error inserting data!");
     } else {
      Swal.fire({
        title: "Inserted!",
        icon: "success",
        draggable: true
      });
      
      $("#exampleInputEmail1").val(""); // ✅ Input fields clear karne ke liye
      $("#exampleInputPassword1").val("");
    }
     }
     
     });
} catch (error) {
  console.log(error);
  
}

  _supabase
    .channel("REAL_TIME_CRUD")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "REAL_TIME_CRUD" },
      (payload) => {
        console.log("New message received:", payload.new);
        fetchMessages(); // ✅ Real-time update ke liye sahi function call
      }
    )
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "REAL_TIME_CRUD" },
      (payload) => {
        console.log("New message received:", payload.new);
        fetchMessages(); // ✅ Real-time update ke liye sahi function call
      }
    )
    .on(
      "postgres_changes",
      { event: "DELETE", schema: "public", table: "REAL_TIME_CRUD" },
      (payload) => {
        console.log("New message received:", payload.new);
        fetchMessages(); // ✅ Real-time update ke liye sahi function call
      }
    )
  
    .subscribe();

  fetchMessages(); // ✅ Page load hone par data fetch karega
});

// Step 3: Image upload logic
// const { createClient } = supabase;

// // Supabase client initialize karo
// const _supabase = createClient(
//   "https://ymwhxcrgumtzgadvfakv.supabase.co",
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inltd2h4Y3JndW10emdhZHZmYWt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0OTAxNDIsImV4cCI6MjA1MjA2NjE0Mn0.O0-DjhIFJ1OO76GapA81NSoKdm83L5vYasm5Jj-UiK0"
// );
// console.log(_supabase);

// // (async function () {
// //   // const { data, error } = await _supabase
// //   // .storage
// //   // .createBucket('avatars', {
// //   //   public: false,
// //   //   allowedMimeTypes: ['image/png'],
// //   //   fileSizeLimit: 1024
// //   // })

// //   // const { data, error } = await _supabase.storage.getBucket("avatars");
// // })();

// $("#uploadButton").click(async function () {
//   // const file = $("#imageUpload")[0].files[0]; // Select file from input
//   console.log($("#imageUpload"));

//   // if (file) {
//   //   // Supabase Storage ke "images" bucket mein image upload karna
//   //   const { data, error } = await _supabase.storage
//   //     .from("images") // Bucket name
//   //     .upload(`public/${file.name}`, file); // Upload path (public folder ke andar)

//   //   if (error) {
//   //     console.error("Error uploading image:", error.message);
//   //   } else {
//   //     console.log("Image uploaded:", data);
//   //     // Image ka URL fetch karo
//   //     const url = _supabase.storage
//   //       .from("images")
//   //       .getPublicUrl(`public/${file.name}`).publicURL;
//   //     console.log("Image URL:", url);

//   //     // Tum URL ko kisi image tag mein set kar sakte ho
//   //     $("#uploadedImage").attr("src", url); // Show the uploaded image
//   //   }
//   // }
// });
