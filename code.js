// Import Firebase and Firestore
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

// Firebase Configuration (Replace with Your Own)
const firebaseConfig = {
  apiKey: "AIzaSyCA6oxno4zHhbBgOB7Y5EpmR3fMl9Y8SX4",
  authDomain: "live-281b2.firebaseapp.com",
  databaseURL: "https://live-281b2-default-rtdb.firebaseio.com",
  projectId: "live-281b2",
  storageBucket: "live-281b2.firebasestorage.app",
  messagingSenderId: "138809616254",
  appId: "1:138809616254:web:b92b11181d017c2286352f",
  measurementId: "G-C08D27B79V"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Define Screen Names for Easy Modification
const SCREENS = {
  HOME: "HOME",
  SELECT_ACCOUNT: "SelectAccount",
  SIGNUP: "SignUp",
  LOGIN: "loginscreen",
  LANDLORD_IMAGES: "Landlordaccountuploadimages",
  LANDLORD_PROFILE: "landlordprofile",
  ABOUT_US: "AboutUs",
  ADMIN_PASSWORD: "ADMINPASSWORDSCREEN"
};

// Function to Navigate Screens
function navigateScreen(eventId, screenName) {
  onEvent(eventId, "click", () => setScreen(screenName));
}

// Function to Navigate **After Checking Firestore**
async function navigateAfterFirestore(eventId, screenName, userId) {
  onEvent(eventId, "click", async () => {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      console.log(`User exists: ${userId}, navigating to ${screenName}`);
      setScreen(screenName);
    } else {
      console.log(`User ${userId} not found in Firestore`);
    }
  });
}

// Standard Navigation Events
navigateScreen("SignUp", SCREENS.SELECT_ACCOUNT);
navigateScreen("adminBackButton", SCREENS.HOME);
navigateScreen("Backbuttonselectaccount", SCREENS.HOME);
navigateScreen("homeiconadmin", SCREENS.HOME);
navigateScreen("Tenantaccount", SCREENS.SIGNUP);
navigateScreen("next1", SCREENS.LOGIN);
navigateScreen("Landlordaccount", SCREENS.LANDLORD_IMAGES);
navigateScreen("NextLandlordbutton", SCREENS.LANDLORD_PROFILE);
navigateScreen("Login", SCREENS.LOGIN);
navigateScreen("AboutUsButton", SCREENS.ABOUT_US);
navigateScreen("Homebutton", SCREENS.HOME);
navigateScreen("HOMEBUTTONTENANT", SCREENS.HOME);
navigateScreen("ADMINBUTTONHOME", SCREENS.ADMIN_PASSWORD);
navigateScreen("home111", SCREENS.HOME);

// Firestore Queries Before Navigation
navigateAfterFirestore("Login", SCREENS.LOGIN, "exampleUserId");
navigateAfterFirestore("SignUp", SCREENS.SELECT_ACCOUNT, "exampleUserId");



// Landlord Login Event
onEvent("landlordloginbutton", "click", async function () {
  var username = getText("username_input").trim().toLowerCase();
  var password = getText("password_input13").trim();

  if (!username || !password) {
    setText("login_status", "❌ Please enter both Username and Password.");
    return;
  }

  try {
    // Query Firestore for matching landlord
    const q = query(collection(db, "HomeInformation"), 
                    where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const matchedUser = querySnapshot.docs[0].data();

      // **Secure Authentication** - Verify password manually (Firestore should not store raw passwords)
      if (matchedUser.password !== password) {
        setText("login_status", "❌ Incorrect Username or Password.");
        return;
      }

      // Login Success - Navigate and display details
      setScreen("landlordprofile");
      setText("login_status", "✅ Login successful!");

      var output = `👤 Username: ${matchedUser.username}\n
                    📍 Location: ${matchedUser.Location}\n
                    🏠 Description: ${matchedUser.Description}\n
                    💲 Price: ${matchedUser.Price}\n
                    📌 Status: ${matchedUser.Status}`;

      setText("text_area1propertDeatils", output);
    } else {
      setText("login_status", "❌ Incorrect Username or Password.");
    }
  } catch (error) {
    console.error("Error logging in:", error);
    setText("login_status", "⚠️ Login failed. Try again.");
  }
});






// Tenant Login Event
onEvent("tenantloginbutton", "click", async function () {
  var username = getText("username_input").trim().toLowerCase();
  var password = getText("password_input13").trim();

  if (!username || !password) {
    setText("login_status", "❌ Please enter both Username and Password.");
    return;
  }

  try {
    // Query Firestore for matching tenant
    const q = query(collection(db, "UserDetails"), where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const matchedUser = querySnapshot.docs[0].data();

      // **Secure Password Handling** - Avoid storing raw passwords in Firestore
      if (matchedUser.password !== password) {
        setText("login_status", "❌ Incorrect Username or Password.");
        return;
      }

      // Login Success - Navigate and display user details
      setScreen("TenantSearchScreen");
      console.log(`Login Successful: ${matchedUser.email} | ${matchedUser.phone}`);
    } else {
      setText("login_status", "❌ Incorrect Username or Password.");
    }
  } catch (error) {
    console.error("Error during login:", error);
    setText("login_status", "⚠️ Login failed. Please try again.");
  }
});





// Event for Updating Property Status
onEvent("UpdateStatus", "click", async function () {
  var inputs = {
    Location: getText("LocationDropdown").trim(),
    Description: getText("HouseDescriptionInput").trim(),
    Status: getText("StatusInput").trim(),
    Image: getText("LANDLORDIMAGEINPUT").trim(),
    Price: getText("priceinputdropdown").trim(),
    username: getText("NameLandLordInput").trim(),
    Phone: getText("PhoneLandLordInput").trim(),
    Email: getText("EmailLandLordInput").trim(),
    password: getText("LandLordPasswordInput").trim() // ⚠️ Consider hashing passwords
  };

  var requiredKeys = ["Location", "Description", "Price", "username", "Phone", "Email", "password"];
  for (var key of requiredKeys) {
    if (!inputs[key]) {
      setText("UploadStatus2", "❌ Please complete all required fields before submitting.");
      return;
    }
  }

  try {
    // Check for conflicts in Firestore
    const emailQuery = query(collection(db, "PendingApproval"), where("Email", "==", inputs.Email));
    const emailSnapshot = await getDocs(emailQuery);
    if (!emailSnapshot.empty) throw "Email already exists";

    const phoneQuery = query(collection(db, "PendingApproval"), where("Phone", "==", inputs.Phone));
    const phoneSnapshot = await getDocs(phoneQuery);
    if (!phoneSnapshot.empty) throw "Phone number already exists";

    const passwordQuery = query(collection(db, "PendingApproval"), where("password", "==", inputs.password));
    const passwordSnapshot = await getDocs(passwordQuery);
    if (!passwordSnapshot.empty) throw "Password already exists";

    // No conflicts — add to Firestore
    await addDoc(collection(db, "PendingApproval"), inputs);
    
    setText("UploadStatus2", "✅ Property added successfully! Submit your images via WhatsApp to admin (+260975525434) for verification.");
  
  } catch (error) {
    if (typeof error === "string") {
      setText("UploadStatus2", `❌ A property with this ${error.toLowerCase()} already exists.`);
    } else {
      console.error("Error adding property:", error);
      setText("UploadStatus2", "❌ Failed to add property.");
    }
  }
});


      










// Import Firestore functions (since Firebase is already initialized at the top of your code)
import { getFirestore, collection, getDocs } from "firebase/firestore";

// Firestore instance
const db = getFirestore();

// Fetch Landlord Details on Button Click
onEvent("AdminLandlordordsbutton", "click", async function () {
  try {
    const querySnapshot = await getDocs(collection(db, "HomeInformation"));
    
    if (querySnapshot.empty) {
      setText("OutputNames", "⚠️ No landlord records found.");
      return;
    }

    let outputText = "📋 Landlords Details:\n\n";
    let i = 0;

    querySnapshot.forEach((doc) => {
      const r = doc.data();
      i++;

      outputText += `
      🔹 Record #${i}
      🆔 ID: ${doc.id}
      👤 Name: ${r.username || "No name"}
      📞 Phone: ${r.Phone || "Not available"}
      📍 Location: ${r.Location || "No location provided"}
      📝 Description: ${r.Description || "No description"}
      
      `;
    });

    setText("OutputNames", outputText);
  } catch (error) {
    console.error("Error fetching landlord details:", error);
    setText("OutputNames", "❌ Failed to load landlord details.");
  }
});





// Import Firestore functions (Firebase is already initialized at the beginning of your code)
import { getFirestore, collection, getDocs } from "firebase/firestore";

// Firestore instance
const db = getFirestore();

// Fetch Tenant Details on Button Click
onEvent("AdminTenantsButton", "click", async function () {
  try {
    const querySnapshot = await getDocs(collection(db, "UserDetails"));
    
    if (querySnapshot.empty) {
      setText("OutputNames", "⚠️ No tenant records found.");
      return;
    }

    let outputText = "🏘️ Tenants Details:\n\n";
    let i = 0;

    querySnapshot.forEach((doc) => {
      const r = doc.data();
      i++;

      outputText += `
      🔸 Record #${i}
      🆔 ID: ${doc.id}
      👤 Name: ${r.username || "No name"}
      📞 Phone: ${r.phone || "Not available"}
      
      `;
    });

    setText("OutputNames", outputText);
  } catch (error) {
    console.error("Error fetching tenants:", error);
    setText("OutputNames", "❌ Failed to load tenant details.");
  }
});

// Fetch Pending Landlord Submissions on Button Click
onEvent("PendingButton", "click", async function () {
  try {
    const querySnapshot = await getDocs(collection(db, "PendingApproval"));
    
    if (querySnapshot.empty) {
      setText("OutputNames", "⚠️ No pending landlord submissions found.");
      return;
    }

    let outputText = "⏳ Pending Landlord Submissions:\n\n";
    let i = 0;

    querySnapshot.forEach((doc) => {
      const r = doc.data();
      i++;

      outputText += `
      📄 Entry #${i}
      🆔 Record ID: ${doc.id}
      👤 Name: ${r.username || "No name"}
      📞 Phone: ${r.Phone || "Not available"}
      📍 Location: ${r.Location || "No location provided"}
      📝 Description: ${r.Description || "No description"}
      
      `;
    });

    setText("OutputNames", outputText);
  } catch (error) {
    console.error("Error fetching pending submissions:", error);
    setText("OutputNames", "❌ Failed to load pending details.");
  }
});








// Import Firestore functions (Firebase is already initialized at the beginning of your code)
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

// Firestore instance
const db = getFirestore();

// Global search result variables
var searchResults = [];
var currentResultIndex = 0;

// Tenant Search Event
onEvent("tenantsearchbutton", "click", async function() {
  try {
    var chosenLocation = getText("dropdownLocationsearchtenantbutton").trim();
    var chosenDescription = getText("dropdownnumberofroomsbutton").trim();
    var chosenStatus = getText("DropdownStatusbutton").trim();
    var chosenPrice = getText("dropdownpricetenant").trim();

    // Build Firestore query dynamically
    let q = query(collection(db, "HomeInformation"));
    
    if (chosenLocation) q = query(q, where("Location", "==", chosenLocation));
    if (chosenDescription) q = query(q, where("Description", "==", chosenDescription));
    if (chosenStatus) q = query(q, where("Status", "==", chosenStatus));
    if (chosenPrice) q = query(q, where("Price", "==", chosenPrice));

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      searchResults = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      currentResultIndex = 0;
      displayCurrentResult();
    } else {
      searchResults = [];
      currentResultIndex = 0;
      setText("Descriptionoutput", "❌ No matching records found.");
      setImageURL("imageDisplayTenantSearch", "");
    }
  } catch (error) {
    console.error("Error fetching properties:", error);
    setText("Descriptionoutput", "⚠️ Failed to load properties.");
  }
});

// Navigate to Next Search Result
onEvent("nextResultButton", "click", function() {
  if (searchResults.length > 0) {
    currentResultIndex = (currentResultIndex + 1) % searchResults.length;
    displayCurrentResult();
  }
});

// Function to Display Current Search Result
function displayCurrentResult() {
  if (searchResults.length === 0) return;

  var record = searchResults[currentResultIndex];
  var outputText = `
    📋 Result ${currentResultIndex + 1} of ${searchResults.length}
    📍 Location: ${record.Location || "N/A"}
    🏠 Description: ${record.Description || "N/A"}
    📌 Status: ${record.Status || "N/A"}
    💰 Price: ${record.Price || "N/A"}
    🆔 Record ID: ${record.id}
  `;

  setText("Descriptionoutput", outputText);
  setImageURL("imageDisplayTenantSearch", record.Image || "");
}













// Import Firestore functions (Firebase is already initialized at the beginning of your code)
import { getFirestore, collection, getDocs } from "firebase/firestore";

// Firestore instance
const db = getFirestore();

// Function to refresh dropdowns with unique Firestore values
async function refreshDropdowns() {
  try {
    const querySnapshot = await getDocs(collection(db, "HomeInformation"));

    if (querySnapshot.empty) {
      console.warn("No records found in HomeInformation.");
      return;
    }

    const locationList = new Set();
    const descriptionList = new Set();
    const statusList = new Set();
    const priceList = new Set();

    querySnapshot.forEach((doc) => {
      const r = doc.data();

      if (r.Location) locationList.add(r.Location);
      if (r.Description) descriptionList.add(r.Description);
      if (r.Status) statusList.add(r.Status);
      if (r.Price) priceList.add(r.Price);
    });

    // Update dropdowns with unique values
    setProperty("dropdownLocationsearchtenantbutton", "options", [...locationList]);
    setProperty("dropdownnumberofroomsbutton", "options", [...descriptionList]);
    setProperty("DropdownStatusbutton", "options", [...statusList]);
    setProperty("dropdownpricetenant", "options", [...priceList]);

  } catch (error) {
    console.error("Error fetching dropdown values:", error);
  }
}

// ✅ Call once at startup
refreshDropdowns();

// ✅ Call after uploading new data:
refreshDropdowns();






// Import Firestore functions (since Firebase is already initialized at the top)
import { getFirestore, collection, query, where, getDocs, addDoc } from "firebase/firestore";

// Firestore instance
const db = getFirestore();

// Signup Event
onEvent("next1", "click", async function () {
  try {
    var email = getText("email_input4").trim();
    var phone = getText("phone_input3").trim();
    var password = getText("Password_input5").trim(); // ⚠️ Consider hashing passwords for better security

    // Validate input fields
    if (!email || !phone || !password) {
      setText("signup_status", "⚠️ Please fill in email, phone, and password.");
      return;
    }

    // Firestore Conflict Checks
    const checkIfExists = async (field, value) => {
      const q = query(collection(db, "UserDetails"), where(field, "==", value));
      const snapshot = await getDocs(q);
      return !snapshot.empty; // Returns `true` if record exists
    };

    if (await checkIfExists("email", email)) throw "Email already exists";
    if (await checkIfExists("phone", phone)) throw "Phone number already exists";

    // ✅ Proceed with creating account
    await addDoc(collection(db, "UserDetails"), {
      email: email,
      phone: phone,
      password: password // ⚠️ Should be hashed for security
    });

    setText("signup_status", "✅ Account created successfully!");

  } catch (error) {
    if (typeof error === "string") {
      setText("signup_status", `❌ This ${error.toLowerCase()} is already registered.`);
    } else {
      console.error("Error creating account:", error);
      setText("signup_status", "❌ Error creating account. Try again.");
    }
  }
});



// Import Firestore functions (Firebase is already initialized at the beginning)
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";

// Firestore instance
const db = getFirestore();

// Tenant Search Event
onEvent("tenantsearchbutton", "click", async function() {
  try {
    var selectedLocation = getText("dropdownLocationsearchtenantbutton").trim();
    var selectedDescription = getText("dropdownnumberofroomsbutton").trim();
    var selectedStatus = getText("DropdownStatusbutton").trim();

    // Build Firestore query dynamically
    let q = query(collection(db, "HomeInformation"));
    
    if (selectedLocation) q = query(q, where("Location", "==", selectedLocation));
    if (selectedDescription) q = query(q, where("Description", "==", selectedDescription));
    if (selectedStatus) q = query(q, where("Status", "==", selectedStatus));

    const querySnapshot = await getDocs(q);

    setText("searchResultCount", `🔍 ${querySnapshot.size} result(s) found`);

  } catch (error) {
    console.error("Error fetching search results:", error);
    setText("searchResultCount", "⚠️ Failed to load search results.");
  }
});

// Update Status for Logged-In Landlord
onEvent("UpdateStatus", "change", async function() {
  try {
    var newStatus = getText("HomeStatusLandlord").trim();
    var loggedInUsername = getText("username_input").trim().toLowerCase();

    // Query Firestore for the landlord's record
    const q = query(collection(db, "HomeInformation"), where("username", "==", loggedInUsername));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docRef = doc(db, "HomeInformation", querySnapshot.docs[0].id);
      await updateDoc(docRef, { Status: newStatus });

      setText("statusUpdateLabel", `✅ Status updated to: ${newStatus}`);
    } else {
      throw "No matching user found";
    }

  } catch (error) {
    if (error === "No matching user found") {
      setText("statusUpdateLabel", "⚠️ No matching user found in database.");
    } else {
      console.error("Error updating status:", error);
      setText("statusUpdateLabel", "❌ Failed to update status.");
    }
  }
});







// Import Firestore functions (Firebase is already initialized at the beginning)
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, setDoc, deleteDoc } from "firebase/firestore";

// Firestore instance
const db = getFirestore();

// Landlord Login Event
onEvent("landlordloginbutton", "click", async function () {
  try {
    var username = getText("username_input").trim().toLowerCase();
    var password = getText("password_input13").trim();

    if (!username || !password) {
      setText("login_status", "❌ Please enter both Username and Password.");
      setImageURL("LandlordProfileimage", "");
      return;
    }

    // Query Firestore for matching landlord
    const q = query(collection(db, "HomeInformation"), where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const matchedUser = querySnapshot.docs[0].data();

      // **Secure authentication** - Firestore should not store raw passwords
      if (matchedUser.password !== password) {
        setText("login_status", "❌ Incorrect Username or Password.");
        setImageURL("LandlordProfileimage", "");
        return;
      }

      // Login Success - Navigate and set profile image
      setText("login_status", "✅ Login successful!");
      setImageURL("LandlordProfileimage", matchedUser.Image || "");
    } else {
      setText("login_status", "❌ Incorrect Username or Password.");
      setImageURL("LandlordProfileimage", "");
    }
  } catch (error) {
    console.error("Error logging in:", error);
    setText("login_status", "⚠️ Login failed. Try again.");
  }
});

// Approve & Move Pending Record
onEvent("updateImageStatusButton", "click", async function () {
  try {
    var newImage = getText("ImageUrlAdmin").trim();
    var newStatus = getText("StatusUpdateAdmin").trim();

    if (!newImage || !newStatus) {
      setText("Deletelabel", "⚠️ Please enter both image URL and status.");
      return;
    }

    // Query Firestore for first pending approval record
    const q = query(collection(db, "PendingApproval"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) throw "No pending records found";

    const docToApprove = querySnapshot.docs[0];
    const recordData = docToApprove.data();
    const recordId = docToApprove.id;

    // Update image and status before moving
    recordData.Image = newImage;
    recordData.Status = newStatus;

    // Move record to HomeInformation and delete from PendingApproval
    await setDoc(doc(db, "HomeInformation", recordId), recordData);
    await deleteDoc(doc(db, "PendingApproval", recordId));

    setText("Deletelabel", "✅ Record updated and approved to main database.");
    setText("HiddenRecordId", "");
    setText("OutputNames", "");

  } catch (error) {
    if (error === "No pending records found") {
      setText("Deletelabel", "❌ No pending records found.");
    } else {
      console.error("Error approving record:", error);
      setText("Deletelabel", "❌ Failed to approve record.");
    }
  }
});




// Import Firestore functions (Firebase is already initialized at the beginning)
import { getFirestore, collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";

// Firestore instance
const db = getFirestore();

// Admin Login Event
onEvent("Submitadminpasswordbutton", "click", async function () {
  try {
    var username = getText("AdminUserName").trim().toLowerCase();
    var password = getText("AdminPassword").trim();

    if (!username || !password) {
      setText("AdminLabel", "❌ Please enter both Username and Password.");
      return;
    }

    // Query Firestore for admin login validation
    const q = query(collection(db, "Admin"), where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const matchedUser = querySnapshot.docs[0].data();

      // **Secure authentication** - Firestore should not store raw passwords
      if (matchedUser.password !== password) {
        setText("AdminLabel", "❌ Incorrect Username or Password.");
        return;
      }

      setScreen("ADMIN"); // Proceed to admin dashboard
      console.log(`Login Successful: ${matchedUser.email} | ${matchedUser.phone}`);
    } else {
      setText("AdminLabel", "❌ Incorrect Username or Password.");
    }

  } catch (error) {
    console.error("Error during login:", error);
    setText("AdminLabel", "⚠️ Login failed. Please try again.");
  }
});

// Delete Landlord Record
onEvent("DeleteLandlordButton", "click", async function () {
  try {
    var targetUsername = getText("DeleteLandlordInpu").trim().toLowerCase();

    // Query Firestore for landlord record
    const q = query(collection(db, "HomeInformation"), where("username", "==", targetUsername));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) throw "Username not found";

    // Delete all matched records
    let deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    setText("Deletelabel", "✅ Landlord record deleted.");

  } catch (error) {
    if (error === "Username not found") {
      setText("Deletelabel", "❌ Username not found.");
    } else {
      console.error("Error deleting landlord:", error);
      setText("Deletelabel", "❌ Failed to delete record.");
    }
  }
});

// Delete Tenant Record
onEvent("DeleteTenantButton", "click", async function () {
  try {
    var targetUsername = getText("DeleteTenantInput").trim().toLowerCase();

    // Query Firestore for tenant record
    const q = query(collection(db, "UserDetails"), where("username", "==", targetUsername));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) throw "Username not found";

    // Delete all matched records
    let deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    setText("Deletelabel", "✅ Tenant record deleted.");

  } catch (error) {
    if (error === "Username not found") {
      setText("Deletelabel", "❌ Username not found.");
    } else {
      console.error("Error deleting tenant:", error);
      setText("Deletelabel", "❌ Failed to delete record.");
    }
  }
});




// Import Firestore functions (Firebase is already initialized at the beginning)
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

// Firestore instance
const db = getFirestore();

// Search for Landlord by Username
onEvent("SearchButtonAdmin", "click", async function () {
  try {
    var searchUsername = getText("DeleteLandlordInpu").trim().toLowerCase();

    // Query Firestore
    const q = query(collection(db, "HomeInformation"), where("username", "==", searchUsername));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const user = querySnapshot.docs[0].data();

      var info = `
      👤 Username: ${user.username || ""}
      📧 Email: ${user.Email || ""}
      📞 Phone: ${user.Phone || ""}
      🏠 Description: ${user.Description || ""}
      💰 Price: ${user.Price || ""}
      📌 Status: ${user.Status || ""}
      📍 Location: ${user.Location || ""}
      🆔 Record ID: ${querySnapshot.docs[0].id}
      `;

      setText("OutputNames", info);
    } else {
      setText("OutputNames", "❌ No user found.");
    }

  } catch (error) {
    console.error("Error searching landlord:", error);
    setText("OutputNames", "⚠️ Failed to search.");
  }
});

// Search for Tenant by Username
onEvent("FindTenantAdmin", "click", async function () {
  try {
    var searchUsername = getText("DeleteLandlordInpu").trim().toLowerCase();

    // Query Firestore
    const q = query(collection(db, "UserDetails"), where("username", "==", searchUsername));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const user = querySnapshot.docs[0].data();

      var info = `
      👤 Username: ${user.username}
      📧 Email: ${user.email}
      📞 Phone: ${user.phone}
      `;

      setText("OutputNames", info);
    } else {
      setText("OutputNames", "❌ No user found.");
    }

  } catch (error) {
    console.error("Error searching tenant:", error);
    setText("OutputNames", "⚠️ Failed to search.");
  }
});

// Handle Sign Up UI Adjustments
onEvent("Landlordaccount", "click", function () {
  hideElement("updateImageButton");
  hideElement("LANDLORDIMAGEINPUT");
});

// Handle Login UI Adjustments
onEvent("landlordloginbutton", "click", function () {
  showElement("updateImageButton");
  showElement("LANDLORDIMAGEINPUT");
});





// Import Firestore functions (Firebase is already initialized at the beginning)
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, onSnapshot } from "firebase/firestore";

// Firestore instance
const db = getFirestore();

// Track the number of documents for real-time updates
let lastCount = 0;

onEvent("ADMINBUTTONHOME", "click", function () {
  const homeInfoRef = collection(db, "HomeInformation");

  onSnapshot(homeInfoRef, (querySnapshot) => {
    const newCount = querySnapshot.size;

    if (newCount > lastCount) {
      showElement("notificationLabel");
      setText("notificationLabel", "🔔 New entry added!");

      // Hide notification after 3 seconds
      setTimeout(() => {
        hideElement("notificationLabel");
      }, 3000);
    }

    lastCount = newCount; // Update count for future checks
  });
});

// Admin Updates Landlord Status
onEvent("UpdateStatusAdmin", "click", async function () {
  try {
    const newStatus = getText("StatusUpdateAdmin").trim();
    const targetUsername = getText("DeleteLandlordInpu").trim().toLowerCase();

    if (!newStatus || !targetUsername) {
      setText("Deletelabel", "⚠️ Please enter both a username and a new status.");
      return;
    }

    // Query Firestore for the landlord's record
    const q = query(collection(db, "HomeInformation"), where("username", "==", targetUsername));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) throw "No user found with that username";

    const docRef = doc(db, "HomeInformation", querySnapshot.docs[0].id);
    await updateDoc(docRef, { Status: newStatus });

    setText("Deletelabel", `✅ Status updated for user: ${targetUsername}`);

  } catch (error) {
    if (error === "No user found with that username") {
      setText("Deletelabel", "❌ No user found with that username.");
    } else {
      console.error("Error updating status:", error);
      setText("Deletelabel", "❌ Failed to update status.");
    }
  }
});
