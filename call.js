// ==============================
// CALL.JS
// ==============================

import { db } from "./firebase.js";

import {
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


// ==============================
// GET HTML ELEMENTS
// ==============================

const profileInitial =
  document.getElementById("profileInitial");

const callerName =
  document.getElementById("callerName");

const callingText =
  document.querySelector(".calling-text");

const answerBtn =
  document.getElementById("answerBtn");

const declineBtn =
  document.getElementById("declineBtn");


// ==============================
// GET CALL ID FROM URL
// ==============================

const params =
  new URLSearchParams(window.location.search);

const callId =
  params.get("call");


if (!callId) {
  
  callerName.textContent =
    "Invalid Call";
  
  callingText.textContent =
    "This call link is invalid.";
  
  answerBtn.disabled = true;
  declineBtn.disabled = true;
  
} else {
  
  loadCall();
  
}


// ==============================
// LOAD CALL INFORMATION
// ==============================

async function loadCall() {
  
  try {
    
    const callRef =
      doc(db, "calls", callId);
    
    const callSnap =
      await getDoc(callRef);
    
    
    // Call does not exist
    if (!callSnap.exists()) {
      
      callerName.textContent =
        "Call Not Found";
      
      callingText.textContent =
        "This call does not exist.";
      
      profileInitial.textContent =
        "?";
      
      answerBtn.disabled = true;
      
      return;
      
    }
    
    
    const callData =
      callSnap.data();
    
    
    // ==========================
    // SHOW CALLER NAME
    // ==========================
    
    const name =
      callData.name ||
      "Unknown";
    
    
    callerName.textContent =
      name;
    
    
    // First letter in circle
    profileInitial.textContent =
      name.charAt(0).toUpperCase();
    
    
    // ==========================
    // SHOW CALL TYPE
    // ==========================
    
    if (callData.mediaType === "video") {
      
      callingText.textContent =
        "Incoming video call...";
      
    } else {
      
      callingText.textContent =
        "Incoming call...";
      
    }
    
    
    // ==========================
    // UPDATE STATUS
    // ==========================
    
    await updateDoc(
      callRef,
      {
        status: "ringing"
      }
    );
    
    
  } catch (error) {
    
    console.error(error);
    
    callerName.textContent =
      "Connection Error";
    
    callingText.textContent =
      "Unable to load this call.";
    
    answerBtn.disabled = true;
    
  }
  
}


// ==============================
// ANSWER CALL
// ==============================

answerBtn.addEventListener(
  "click",
  async () => {
    
    if (!callId) return;
    
    
    answerBtn.disabled = true;
    
    answerBtn.textContent =
      "..."
    
    
    try {
      
      const callRef =
        doc(db, "calls", callId);
      
      
      await updateDoc(
        callRef,
        {
          status: "answered"
        }
      );
      
      
    } catch (error) {
      
      console.error(
        "Could not update call:",
        error
      );
      
    }
    
    
    // Open the media call screen
    
    window.location.href =
      "room.html?call=" +
      encodeURIComponent(callId);
    
  }
);


// ==============================
// DECLINE CALL
// ==============================

declineBtn.addEventListener(
  "click",
  async () => {
    
    if (!callId) return;
    
    
    try {
      
      const callRef =
        doc(db, "calls", callId);
      
      
      await updateDoc(
        callRef,
        {
          status: "declined"
        }
      );
      
    } catch (error) {
      
      console.error(
        "Could not update call:",
        error
      );
      
    }
    
    
    // Change screen
    
    callerName.textContent =
      "Call Declined";
    
    callingText.textContent =
      "You declined this call.";
    
    
    answerBtn.style.display =
      "none";
    
    declineBtn.style.display =
      "none";
    
  }
);
