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

const profileImage =
  document.getElementById("profileImage");

const profileVideo =
  document.getElementById("profileVideo");

const callerName =
  document.getElementById("callerName");

const callingText =
  document.querySelector(".calling-text");

const answerBtn =
  document.getElementById("answerBtn");

const declineBtn =
  document.getElementById("declineBtn");


// ==============================
// GET CALL ID
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

  answerBtn.disabled = true;

  declineBtn.disabled = true;

} else {

  loadCall();

}


// ==============================
// LOAD CALL
// ==============================

async function loadCall() {

  try {

    const callRef =
      doc(db, "calls", callId);

    const callSnap =
      await getDoc(callRef);


    // ==========================
    // CALL NOT FOUND
    // ==========================

    if (!callSnap.exists()) {

      callerName.textContent =
        "Call Not Found";

      callingText.textContent =
        "This call could not be found.";

      profileInitial.textContent =
        "?";

      answerBtn.disabled = true;

      return;

    }


    // ==========================
    // GET CALL DATA
    // ==========================

    const callData =
      callSnap.data();

    console.log(
      "CALL DATA:",
      callData
    );


    // ==========================
    // CALLER NAME
    // ==========================

    const name =
      callData.name ||
      callData.callerName ||
      "Unknown";

    callerName.textContent =
      name;


    // ==========================
    // FIRST LETTER
    // ==========================

    profileInitial.textContent =
      name
        .charAt(0)
        .toUpperCase();


    // ==========================
    // GET MEDIA TYPE
    // ==========================

    const mediaType =
      callData.mediaType ||
      "photo";


    // ==========================
    // GET MEDIA PATH
    // ==========================

    const mediaPath =
      callData.mediaPath ||
      callData.media ||
      callData.photoPath ||
      callData.videoPath ||
      "";


    console.log(
      "MEDIA PATH:",
      mediaPath
    );


    // ==========================
    // SHOW PHOTO
    // ==========================

    if (
      mediaType === "photo" &&
      mediaPath
    ) {

      profileInitial.style.display =
        "none";

      profileVideo.style.display =
        "none";

      profileImage.src =
        mediaPath;

      profileImage.style.display =
        "block";


      profileImage.onerror =
        function () {

          console.log(
            "IMAGE FAILED TO LOAD:",
            mediaPath
          );

          profileImage.style.display =
            "none";

          profileInitial.style.display =
            "flex";

        };

    }


    // ==========================
    // SHOW VIDEO
    // ==========================

    else if (
      mediaType === "video" &&
      mediaPath
    ) {

      profileInitial.style.display =
        "none";

      profileImage.style.display =
        "none";

      profileVideo.src =
        mediaPath;

      profileVideo.style.display =
        "block";


      profileVideo.play()
        .catch(() => {

          console.log(
            "Video autoplay was blocked"
          );

        });


      profileVideo.onerror =
        function () {

          console.log(
            "VIDEO FAILED TO LOAD:",
            mediaPath
          );

          profileVideo.style.display =
            "none";

          profileInitial.style.display =
            "flex";

        };

    }


    // ==========================
    // NO MEDIA
    // ==========================

    else {

      profileImage.style.display =
        "none";

      profileVideo.style.display =
        "none";

      profileInitial.style.display =
        "flex";

    }


    // ==========================
    // CALL TEXT
    // ==========================

    if (mediaType === "video") {

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

    console.error(
      "LOAD ERROR:",
      error
    );

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
        "Could not answer call:",
        error
      );

    }


    // GO TO CALL SCREEN

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
        "Could not decline call:",
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
