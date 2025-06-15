// Navigate Screens
onEvent("SignUp", "click", function() {
  setScreen("SelectAccount");
});
onEvent("adminBackButton", "click", function( ) {
  setScreen("HOME");
});
onEvent("Backbuttonselectaccount", "click", function( ) {
  setScreen("HOME");
});
onEvent("homeiconadmin", "click", function( ) {
  setScreen("HOME");
});
onEvent("Tenantaccount", "click", function( ) {
  setScreen("SignU");
});
onEvent("next1", "click", function() {
  setScreen("loginscreen");
});
onEvent("Landlordaccount", "click", function() {
  setScreen("Landlordaccountuploadimages");
});
onEvent("NextLandlordbutton", "click", function() {
  setScreen("landlordprofile");
});
onEvent("Login", "click", function() {
  setScreen("loginscreen");
});
onEvent("AboutUsButton", "click", function() {
  setScreen("AboutUs");
});
onEvent("Homebutton", "click", function() {
  setScreen("HOME");
});
onEvent("HOMEBUTTONTENANT", "click", function() {
  setScreen("HOME");
});
onEvent("ADMINBUTTONHOME", "click", function() {
  setScreen("ADMINPASSWORDSCREEN");
});
onEvent("home111", "click", function( ) {
  setScreen("HOME");
});





// ✅ Landlord Login + Display Matching Property Details
onEvent("landlordloginbutton", "click", function() {
  var username = getText("username_input").trim().toLowerCase();
  var password = getText("password_input13").trim();

  if (!username || !password) {
    setText("login_status", "❌ Please enter both Username and Password.");
    return;
  }

  readRecords("HomeInformation", {}, function(records) {
    var matchedUser = null;

    for (var i = 0; i < records.length; i++) {
      var r = records[i];

      if (r.username && r.password &&
          r.username.toLowerCase() === username &&
          r.password === password) {
        matchedUser = r;
        break;
      }
    }

    if (matchedUser) {
      setScreen("landlordprofile"); // Navigate to landlord profile screen
      setText("login_status", "✅ Login successful!");

      // Display only that user's property details
      var output = "👤 Username: " + matchedUser.username + "\n" +
                   "📍 Location: " + matchedUser.Location + "\n" +
                   "🏠 Description: " + matchedUser.Description + "\n" +
                   "💲 Price: " + matchedUser.Price + "\n" +
                   "📌 Status: " + matchedUser.Status;

      setText("text_area1propertDeatils", output);

    } else {
      setText("login_status", "❌ Incorrect Username or Password.");
      setText("landlordprofilename", "Login successful"); // This line likely needs fixing
    }
  });
});







      

// ✅ Tenant Login Authentication (Validates credentials from "UserDetails")
onEvent("tenantloginbutton", "click", function() {
  var username = getText("username_input").trim().toLowerCase();
  var password = getText("password_input13").trim();

  if (!username || !password) {
    setText("login_status", "❌ Please enter both Username and Password.");
    return;
  }

  readRecords("UserDetails", {}, function(records) {
    if (!Array.isArray(records) || records.length === 0) {
      setText("login_status", "❌ Error: No users found in the database.");
      return;
    }

    var matchedUser = null;

    // Iterate over records instead of using `.find()`
    for (var i = 0; i < records.length; i++) {
      if (records[i].username && records[i].password &&
          records[i].username.toLowerCase() === username &&
          records[i].password === password) {
        matchedUser = records[i]; // Store matched user
        break; // Exit loop once a match is found
      }
    }

    if (matchedUser) {
      setScreen("TenantSearchScreen"); // Proceed to tenant search screen
      console.log("Login Successful: " + matchedUser.email + " | " + matchedUser.phone);
    } else {
      setText("login_status", "❌ Incorrect Username or Password.");
    }
  });
});




//Landlord sign up//

onEvent("UpdateStatus", "click", function() {
  var inputs = {
    Location: getText("LocationDropdown").trim(),
    Description: getText("HouseDescriptionInput").trim(),
    Status: getText("StatusInput").trim(),
    Image: getText("LANDLORDIMAGEINPUT").trim(),
    Price: getText("priceinputdropdown").trim(),
    username: getText("NameLandLordInput").trim(),
    Phone: getText("PhoneLandLordInput").trim(),
    Email: getText("EmailLandLordInput").trim(),
    password: getText("LandLordPasswordInput").trim()
  };

  // Validate all fields except Status and Image
  var requiredKeys = ["Location", "Description", "Price", "username", "Phone", "Email", "password"];
  for (var i = 0; i < requiredKeys.length; i++) {
    var key = requiredKeys[i];
    if (inputs[key] === "") {
      setText("UploadStatus2", "❌ Please complete all required fields before submitting.");
      return;
    }
  }

  readRecords("PendingApproval", {}, function(records) {
    var conflictFound = false;

    for (var i = 0; i < records.length; i++) {
      var record = records[i];

      if (
        (record.Email && record.Email.toLowerCase().trim() === inputs.Email.toLowerCase()) ||
        (record.Phone && record.Phone.trim() === inputs.Phone) ||
        (record.password && record.password === inputs.password)
      ) {
        conflictFound = true;
        break;
      }
    }

    if (conflictFound) {
      setText("UploadStatus2", "❌ A property with this email, phone number, or password already exists.");
    } else {
      createRecord("PendingApproval", inputs, function(success) {
        setText("UploadStatus2", success
          ? "✅ Property added successfully !Submit your Images  with your details via Whatsapp to admin  (+260975525434) for verification and approval "
          : "❌ Failed to add property.");
      });
    }
  });
});
 




// ✅ Admin Fetch Landlord Details
onEvent("AdminLandlordordsbutton", "click", function() {
  readRecords("HomeInformation", {}, function(records) {
    var outputText = "📋 Landlords Details:\n\n";
    for (var i = 0; i < records.length; i++) {
      var r = records[i];
      outputText += 
        "🔹 Record #" + (i + 1) + "\n" +
        "🆔 ID: " + r.id + "\n" +
        "👤 Name: " + (r.username || "No name") + "\n" +
        "📞 Phone: " + (r.Phone || "Not available") + "\n" +
        "📍 Location: " + (r.Location || "No location provided") + "\n" +
        "📝 Description: " + (r.Description || "No description") + "\n\n";
    }
    setText("OutputNames", outputText);
  });
});




onEvent("AdminTenantsButton", "click", function() {
  readRecords("UserDetails", {}, function(records) {
    var outputText = "🏘️ Tenants Details:\n\n";
    for (var i = 0; i < records.length; i++) {
      var r = records[i];
      outputText += 
        "🔸 Record #" + (i + 1) + "\n" +
        "🆔 ID: " + r.id + "\n" +
        "👤 Name: " + (r.username || "No name") + "\n" +
        "📞 Phone: " + (r.phone || "Not available") + "\n\n";
    }
    setText("OutputNames", outputText);
  });
});





// ✅ Admin  Fetch Pending Details
onEvent("PendingButton", "click", function() {
  readRecords("PendingApproval", {}, function(records) {
    var outputText = "⏳ Pending Landlord Submissions:\n\n";
    for (var i = 0; i < records.length; i++) {
      var r = records[i];
      outputText += 
        "📄 Entry #" + (i + 1) + "\n" +
        "🆔 Record ID: " + r.id + "\n" +
        "👤 Name: " + (r.username || "No name") + "\n" +
        "📞 Phone: " + (r.Phone || "Not available") + "\n" +
        "📍 Location: " + (r.Location || "No location provided") + "\n" +
        "📝 Description: " + (r.Description || "No description") + "\n\n";
    }
    setText("OutputNames", outputText);
  });
});







// ✅ Tenant Property Search Function with Price Filter

var searchResults = [];
var currentResultIndex = 0;

onEvent("tenantsearchbutton", "click", function() {
  var chosenLocation = getText("dropdownLocationsearchtenantbutton");
  var chosenDescription = getText("dropdownnumberofroomsbutton");
  var chosenStatus = getText("DropdownStatusbutton");
  var chosenPrice = getText("dropdownpricetenant");

  readRecords("HomeInformation", {
    Location: chosenLocation,
    Description: chosenDescription,
    Status: chosenStatus,
    Price: chosenPrice
  }, function(records) {
    if (records.length > 0) {
      searchResults = records;
      currentResultIndex = 0;
      displayCurrentResult();
    } else {
      searchResults = [];
      currentResultIndex = 0;
      setText("Descriptionoutput", "❌ No matching records found.");
      setImageURL("imageDisplayTenantSearch", "");
    }
  });
});

onEvent("nextResultButton", "click", function() {
  if (searchResults.length > 0) {
    currentResultIndex = (currentResultIndex + 1) % searchResults.length;
    displayCurrentResult();
  }
});

function displayCurrentResult() {
  var record = searchResults[currentResultIndex];
  var outputText = 
    "📋 Result " + (currentResultIndex + 1) + " of " + searchResults.length + "\n\n" +
    "📍 Location: " + record.Location + "\n" +
    "🏠 Description: " + record.Description + "\n" +
    "📌 Status: " + record.Status + "\n" +
    "💰 Price: " + record.Price + "\n" +
    "🆔 Record ID: " + record.id;

  setText("Descriptionoutput", outputText);
  setImageURL("imageDisplayTenantSearch", record.Image || "");
}










// 🔁 Function to refresh dropdowns with latest values from the database (including Price)
function refreshDropdowns() {
  readRecords("HomeInformation", {}, function(records) {
    var locationList = [];
    var descriptionList = [];
    var statusList = [];
    var priceList = [];

    for (var i = 0; i < records.length; i++) {
      var r = records[i];

      if (r.Location && locationList.indexOf(r.Location) === -1) {
        locationList.push(r.Location);
      }
      if (r.Description && descriptionList.indexOf(r.Description) === -1) {
        descriptionList.push(r.Description);
      }
      if (r.Status && statusList.indexOf(r.Status) === -1) {
        statusList.push(r.Status);
      }
      if (r.Price && priceList.indexOf(r.Price) === -1) {
        priceList.push(r.Price);
      }
    }

    setProperty("dropdownLocationsearchtenantbutton", "options", locationList);
    setProperty("dropdownnumberofroomsbutton", "options", descriptionList);
    setProperty("DropdownStatusbutton", "options", statusList);
    setProperty("dropdownpricetenant", "options", priceList);
  });
}

// ✅ Call once at startup
refreshDropdowns();

// ✅ Or call this again after uploading new data:
// createRecord(...) -> inside success callback: refreshDropdowns();





onEvent("next1", "click", function() {
  var email = getText("email_input4").trim();
  var phone = getText("phone_input3").trim();
  var password = getText("Password_input5").trim();

  // Validate input fields
  if (email === "" || phone === "" || password === "") {
    setText("signup_status", "⚠️ Please fill in email, phone, and password.");
    return;
  }

  // Check if email or phone already exists
  readRecords("UserDetails", {}, function(records) {
    var conflict = false;

    for (var i = 0; i < records.length; i++) {
      var r = records[i];
      if (
        (r.email && r.email.toLowerCase().trim() === email.toLowerCase()) ||
        (r.phone && r.phone.trim() === phone)
      ) {
        conflict = true;
        break;
      }
    }

    if (conflict) {
      setText("signup_status", "❌ This email or phone number is already registered.");
      return;
    }

    // ✅ Proceed with creating account
    createRecord("UserDetails", {
      email: email,
      phone: phone,
      password: password
    }, function(success) {
      if (success) {
        setText("signup_status", "✅ Account created successfully!");
        // Optional: clear inputs
        // setText("email_input4", "");
        // setText("phone_input4", "");
        // setText("Password_input5", "");
      } else {
        setText("signup_status", "❌ Error creating account. Try again.");
      }
    });
  });
});




// 🔎 Count matching search results and display total
onEvent("tenantsearchbutton", "click", function( ) {
readRecords("HomeInformation", {}, function(records) {
    var matchCount = 0;

    var selectedLocation = getText("dropdownLocationsearchtenantbutton");
    var selectedDescription = getText("dropdownnumberofroomsbutton");
    var selectedStatus = getText("DropdownStatusbutton");

    for (var i = 0; i < records.length; i++) {
      var record = records[i];

      if (
        (selectedLocation === "" || record.Location === selectedLocation) &&
        (selectedDescription === "" || record.Description === selectedDescription) &&
        (selectedStatus === "" || record.Status === selectedStatus)
      ) {
        matchCount++;
      }
    }

    setText("searchResultCount", "🔍 " + matchCount + " result(s) found");
  });  
});
// 🕒 Auto logout after 2 minute of inactivity
var logoutDelay = 2 * 60 * 1000; // 1 minute in milliseconds
var logoutTimer;

// 🔐 Function to perform logout
function logUserOut() {
  stopTimedLoop(logoutTimer);
  setText("sessionStatus", "⏳ Logged out due to inactivity.");
  setScreen("loginscreen"); // Replace with your login/home screen ID

  // Optional: clear session inputs
  // setText("email_input", "");
  // setText("password_input", "");
}

// 🔁 Reset the logout timer on interaction
function resetLogoutTimer() {
  if (logoutTimer) {
    stopTimedLoop(logoutTimer);
  }
  logoutTimer = timedLoop(logoutDelay, function() {
    logUserOut();
  });
}

// ▶️ Start session tracking after login
onEvent("tenantloginbutton", "click", function() {
  // Perform your login logic here...
  setText("logged", "✅ Logged in.");

  // Start/reset the inactivity timer
  resetLogoutTimer();

  // Detect activity on the main app screen to reset timer
  onEvent("TenantSearchScreen", "mousemove", resetLogoutTimer);
  onEvent("TenantSearchScreen", "keydown", resetLogoutTimer);
  onEvent("TenantSearchScreen", "touchstart", resetLogoutTimer);
});
  


      
// 🔁 Update status in the database when dropdown changes
onEvent("UpdateStatus", "change", function() {
  var newStatus = getText("HomeStatusLandlord");
  var loggedInUsername = getText("username_input").trim().toLowerCase(); // Adjust if you're storing this differently

  // Find the matching landlord record and update its status
  readRecords("HomeInformation", {}, function(records) {
    var matchFound = false;

    for (var i = 0; i < records.length; i++) {
      var r = records[i];

      if (r.username && r.username.toLowerCase() === loggedInUsername) {
        matchFound = true;

        updateRecord("HomeInformation", r.id, {
          Status: newStatus
        }, function(success) {
          if (success) {
            setText("statusUpdateLabel", "✅ Status updated to: " + newStatus);
          } else {
            setText("statusUpdateLabel", "❌ Failed to update status.");
          }
        });

        break; // Exit loop after updating
      }
    }

    if (!matchFound) {
      setText("statusUpdateLabel", "⚠️ No matching user found in database.");
    }
  });
});







//fetch profile image
onEvent("landlordloginbutton", "click", function() {
  var username = getText("username_input").trim().toLowerCase();
  var password = getText("password_input13").trim();

  if (!username || !password) {
    setText("login_status", "❌ Please enter both Username and Password.");
    setImageURL("LandlordProfileimage", "");
    return;
  }

  readRecords("HomeInformation", {}, function(records) {
    var matchedUser = null;

    for (var i = 0; i < records.length; i++) {
      var r = records[i];

      if (
        r.username && r.password &&
        r.username.toLowerCase() === username &&
        r.password === password
      ) {
        matchedUser = r;
        break;
      }
    }

    if (matchedUser) {
      setText("login_status", "✅ Login successful!");
      setImageURL("LandlordProfileimage", matchedUser.Image || "");
    } else {
      setText("login_status", "❌ Incorrect Username or Password.");
      setImageURL("LandlordProfileimage", "");
    }
  });
});





// Approve and move to HomeInformation without setting image/status yet
onEvent("updateImageStatusButton", "click", function() {
  var newImage = getText("ImageUrlAdmin").trim();
  var newStatus = getText("StatusUpdateAdmin").trim();

  if (!newImage || !newStatus) {
    setText("Deletelabel", "⚠️ Please enter both image URL and status.");
    return;
  }

  readRecords("PendingApproval", {}, function(records) {
    if (records.length === 0) {
      setText("Deletelabel", "❌ No pending records found.");
      return;
    }

    var recordToApprove = records[0];
    var recordId = recordToApprove.id;

    // Remove id before creation
    delete recordToApprove.id;

    // Add new image and status
    recordToApprove.Image = newImage;
    recordToApprove.Status = newStatus;

    createRecord("HomeInformation", recordToApprove, function() {
      deleteRecord("PendingApproval", {id: recordId}, function() {
        setText("Deletelabel", "✅ Record updated and approved to main database.");
        setText("HiddenRecordId", "");
        setText("OutputNames", "");
      });
    });
  });
});





// ✅ Admin Login Authentication (Validates credentials from "UserDetails")
onEvent("Submitadminpasswordbutton", "click", function() {
  var username = getText("AdminUserName").trim().toLowerCase();
  var password = getText("AdminPassword").trim();

  if (!username || !password) {
    setText("AdminLabel", "❌ Please enter both Username and Password.");
    return;
  }

  readRecords("Admin", {}, function(records) {
    if (!Array.isArray(records) || records.length === 0) {
      setText("AdminLabel", "❌ Error: No users found in the database.");
      return;
    }

    var matchedUser = null;

    // Iterate over records instead of using `.find()`
    for (var i = 0; i < records.length; i++) {
      if (records[i].username && records[i].password &&
          records[i].username.toLowerCase() === username &&
          records[i].password === password) {
        matchedUser = records[i]; // Store matched user
        break; // Exit loop once a match is found
      }
    }

    if (matchedUser) {
      setScreen("ADMIN"); // Proceed to tenant search screen
      console.log("Login Successful: " + matchedUser.email + " | " + matchedUser.phone);
    } else {
      setText("AdminLabel", "❌ Incorrect Username or Password.");
    }
  });
});




//Delete Lanlord Logic
onEvent("DeleteLandlordButton", "click", function() {
  var targetUsername = getText("DeleteLandlordInpu");

  readRecords("HomeInformation", {username: targetUsername}, function(records) {
    if (records.length > 0) {
      for (var i = 0; i < records.length; i++) {
        deleteRecord("HomeInformation", {id: records[i].id}, function(success) {
          if (success) {
            console.log("Record deleted successfully.");
            // Optional: Add a label or alert to show confirmation
            setText("Deletelabel", "Record deleted.");
          } else {
            console.log("Failed to delete record.");
            setText("Deletelabel", "Failed to delete record.");
          }
        });
      }
    } else {
      console.log("No matching user found.");
      setText("Deletelabel", "Username not found.");
    }
  });
});




//Delete Tenant Logic
onEvent("DeleteLandlordButton", "click", function() {
  var targetUsername = getText("DeleteLandlordInpu");

  readRecords("UserDetails", {username: targetUsername}, function(records) {
    if (records.length > 0) {
      for (var i = 0; i < records.length; i++) {
        deleteRecord("UserDetails", {id: records[i].id}, function(success) {
          if (success) {
            console.log("Record deleted successfully.");
            // Optional: Add a label or alert to show confirmation
            setText("Deletelabel", "Record deleted.");
          } else {
            console.log("Failed to delete record.");
            setText("Deletelabel", "Failed to delete record.");
          }
        });
      }
    } else {
      console.log("No matching user found.");
      setText("Deletelabel", "Username not found.");
    }
  });
});



// Search for Landlord on Admin page //

onEvent("SearchButtonAdmin", "click", function() {
  var searchUsername = getText("DeleteLandlordInpu").toLowerCase();

  readRecords("HomeInformation", {}, function(records) {
    var matchFound = false;

    for (var i = 0; i < records.length; i++) {
      if (records[i].username && records[i].username.toLowerCase() === searchUsername) {
        var user = records[i];

        var info = 
          "👤 Username: " + (user.username || "") + "\n" +
          "📧 Email: " + (user.Email || "") + "\n" +
          "📞 Phone: " + (user.Phone || "") + "\n" +
          "🏠 Description: " + (user.Description || "") + "\n" +
          "💰 Price: " + (user.Price || "") + "\n" +
          "📌 Status: " + (user.Status || "") + "\n" +
          "📍 Location: " + (user.Location || "") + "\n" +
          "🆔 Record ID: " + (user.id || "");

        setText("OutputNames", info);
        matchFound = true;
        break;
      }
    }

    if (!matchFound) {
      setText("OutputNames", "❌ No user found.");
    }
  });
});





// Search for user on Admin page //
onEvent("FindTenantAdmin", "click", function() {
  var searchUsername = getText("DeleteLandlordInpu").toLowerCase();

  readRecords("UserDetails", {}, function(records) {
    var matchFound = false;

    for (var i = 0; i < records.length; i++) {
      if (records[i].username.toLowerCase() === searchUsername) {
        var user = records[i];
        var info = "Username: " + user.username + 
                   "\nEmail: " + user.email + 
                   "\nPhone: " + user.phone;
        setText("OutputNames", info);
        matchFound = true;
        break;
      }
    }

    if (!matchFound) {
      setText("OutputNames", "No user found.");
    }
  });
});






// When the user clicks "Sign Up"
onEvent("Landlordaccount", "click", function() {
  hideElement("updateImageButton");
  hideElement("LANDLORDIMAGEINPUT");
  // Additional sign-up logic here
});

// When the user clicks "Log In"
onEvent("landlordloginbutton", "click", function() {
  showElement("updateImageButton");
  showElement("LANDLORDIMAGEINPUT");
  // Additional login logic here
});





// Store the number of records at startup
var lastCount = 0;

// Check for new entries every 5 seconds
onEvent("ADMINBUTTONHOME", "click", function( ) {
  setInterval(function() {
    readRecords("HomeInformation", {}, function(records) {
      if (records.length > lastCount) {
        showElement("notificationLabel");
        setText("notificationLabel", "🔔 New entry added!");

        // Update the count
        lastCount = records.length;

        // Optional: Hide after a few seconds
        setTimeout(function() {
          hideElement("notificationLabel");
        }, 3000);
      }
    });
  }, 5000);
});
// 5000ms = 5 seconds






//admin update Landlord Status Vacant and occupied //

onEvent("UpdateStatusAdmin", "click", function() {
  var newStatus = getText("StatusUpdateAdmin").trim();
  var targetUsername = getText("DeleteLandlordInpu").toLowerCase(); // Input for username

  if (!newStatus || !targetUsername) {
    setText("Deletelabel", "⚠️ Please enter both a username and a new status.");
    return;
  }

  readRecords("HomeInformation", {}, function(records) {
    var matchFound = false;

    for (var i = 0; i < records.length; i++) {
      var user = records[i];
      if (user.username && user.username.toLowerCase() === targetUsername) {
        // Update only the Status field while keeping all other existing values
        updateRecord("HomeInformation", {
          id: user.id,
          username: user.username,
          Email: user.Email,
          Phone: user.Phone,
          Location: user.Location,
          Description: user.Description,
          Price: user.Price,
          Image: user.Image,
          Status: newStatus
        }, function(success) {
          setText("Deletelabel", success
            ? "✅ Status updated for user: " + user.username
            : "❌ Failed to update status.");
        });

        matchFound = true;
        break;
      }
    }

    if (!matchFound) {
      setText("Deletelabel", "❌ No user found with that username.");
    }
  });
});








