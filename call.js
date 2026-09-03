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

const profileImage =
  document.getElementById("profileImage");

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


// ==============================
// CHECK CALL ID
// ==============================

if (!callId) {

  callerName.textContent =
    "Invalid Call";

  callingText.textContent =
    "This call link is invalid.";

  profileInitial.textContent =
    "?";

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


    // ==========================
    // CALL DOES NOT EXIST
    // ==========================

    if (!callSnap.exists()) {

      callerName.textContent =
        "Call Not Found";

      callingText.textContent =
        "This call could not be found.";

      profileInitial.textContent =
        "?";

      answerBtn.disabled = true;

      declineBtn.disabled = true;

      return;

    }


    const callData =
      callSnap.data();


    // ==========================
    // CALLER NAME
    // ==========================

    const name =
      callData.name ||
      "Unknown";


    callerName.textContent =
      name;


    // Default initial

    profileInitial.textContent =
      name.charAt(0).toUpperCase();


    // ==========================
    // GET MEDIA PATH
    // ==========================

    const mediaPath =
      callData.mediaPath ||
      callData.media ||
      callData.photo ||
      callData.video ||
      "";


    // ==========================
    // SHOW PHOTO AS PROFILE IMAGE
    // ==========================

    if (
      mediaPath &&
      callData.mediaType === "photo"
    ) {

      profileImage.src =
        mediaPath;

      profileImage.style.display =
        "block";

      profileInitial.style.display =
        "none";


      // If image cannot load,
      // show the letter again

      profileImage.onerror =
        function () {

          profileImage.style.display =
            "none";

          profileInitial.style.display =
            "flex";

        };

    } else {

      // No photo or this is video

      profileImage.style.display =
        "none";

      profileInitial.style.display =
        "flex";

    }


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

    try {

      await updateDoc(
        callRef,
        {
          status: "ringing"
        }
      );

    } catch (error) {

      console.log(
        "Status update failed:",
        error
      );

    }


  } catch (error) {

    console.error(error);

    callerName.textContent =
      "Connection Error";

    callingText.textContent =
      "Unable to load this call.";

    profileInitial.textContent =
      "?";

    answerBtn.disabled = true;

    declineBtn.disabled = true;

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
      "...";


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


    // ==========================
    // OPEN VIDEO/PHOTO SCREEN
    // ==========================

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
