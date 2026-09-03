// ==============================
// ROOM.JS - CORRECT VERSION
// ==============================


// ==============================
// FIREBASE IMPORTS
// ==============================

import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  doc,
  getDoc
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ==============================
// FIREBASE CONFIGURATION
// ==============================

const firebaseConfig = {
  apiKey: "AIzaSyDEJv47nDpckV_pOu1roa1dAyEoMCCQU5A",
  authDomain: "press-to-call.firebaseapp.com",
  projectId: "press-to-call",
  storageBucket: "press-to-call.firebasestorage.app",
  messagingSenderId: "1067913620438",
  appId: "1:1067913620438:web:2576355fbd191e17aa1277"
};


// ==============================
// INITIALIZE FIREBASE
// ==============================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


// ==============================
// GET PAGE ELEMENTS
// ==============================

const callImage =
  document.getElementById("callImage");

const callVideo =
  document.getElementById("callVideo");

const loadingScreen =
  document.getElementById("loadingScreen");

const errorScreen =
  document.getElementById("errorScreen");

const errorMessage =
  document.getElementById("errorMessage");

const callerName =
  document.getElementById("callerName");

const centerName =
  document.getElementById("centerName");

const callStatus =
  document.getElementById("callStatus");

const centerStatus =
  document.getElementById("centerStatus");

const callerAvatar =
  document.getElementById("callerAvatar");

const centerAvatar =
  document.getElementById("centerAvatar");

const centerInfo =
  document.getElementById("centerInfo");

const muteButton =
  document.getElementById("muteButton");

const muteIcon =
  document.getElementById("muteIcon");

const speakerButton =
  document.getElementById("speakerButton");

const endButton =
  document.getElementById("endButton");


// ==============================
// GET CALL ID FROM LINK
// IMPORTANT: SUPPORTS BOTH
// ?call= AND ?id=
// ==============================

const urlParams =
  new URLSearchParams(
    window.location.search
  );

const callId =
  urlParams.get("call") ||
  urlParams.get("id");


// ==============================
// START
// ==============================

loadCall();


// ==============================
// LOAD CALL FROM FIRESTORE
// ==============================

async function loadCall() {

  // No call ID
  if (!callId) {

    showError(
      "No call ID was found in this link."
    );

    return;
  }


  try {

    // Get call document
    const callRef =
      doc(
        db,
        "calls",
        callId
      );

    const callSnapshot =
      await getDoc(callRef);


    // Call does not exist
    if (!callSnapshot.exists()) {

      showError(
        "This call could not be found."
      );

      return;
    }


    // Get call data
    const callData =
      callSnapshot.data();

    console.log(
      "Call loaded:",
      callData
    );


    // ==============================
    // GET CALLER NAME
    // ==============================

    const name =
      callData.name ||
      "Press to Call";


    callerName.textContent =
      name;

    centerName.textContent =
      name;


    // Avatar letter
    const firstLetter =
      name
        .charAt(0)
        .toUpperCase();


    callerAvatar.textContent =
      firstLetter;

    centerAvatar.textContent =
      firstLetter;


    // ==============================
    // GET MEDIA TYPE
    // ==============================

    const mediaType =
      callData.mediaType ||
      callData.type ||
      "photo";


    // ==============================
    // GET MEDIA PATH
    // ==============================

    let mediaPath =
      callData.mediaPath ||
      callData.media ||
      callData.url ||
      callData.path;


    // If Firestore has no media path,
    // use your files in the main folder

    if (!mediaPath) {

      if (
        String(mediaType)
          .toLowerCase() === "video"
      ) {

        mediaPath =
          "video.mp4";

      } else {

        mediaPath =
          "photo.jpg";

      }

    }


    // ==============================
    // SHOW PHOTO OR VIDEO
    // ==============================

    showMedia(
      mediaPath,
      mediaType
    );


    // ==============================
    // CONNECTING STATUS
    // ==============================

    callStatus.textContent =
      "Connecting...";

    centerStatus.textContent =
      "Connecting...";


    // Wait for the call screen

    setTimeout(() => {

      loadingScreen.classList.add(
        "hidden"
      );


      callStatus.textContent =
        "In call";

      centerStatus.textContent =
        "In call";


      // Hide center information
      // if your CSS supports this

      if (centerInfo) {

        centerInfo.classList.add(
          "call-connected"
        );

      }


    }, 1200);


  }


  catch (error) {

    console.error(
      "Error loading call:",
      error
    );


    showError(
      "Could not connect to this call."
    );

  }

}


// ==============================
// SHOW PHOTO OR VIDEO
// ==============================

function showMedia(
  mediaPath,
  mediaType
) {

  const type =
    String(
      mediaType
    ).toLowerCase();


  // ==============================
  // VIDEO
  // ==============================

  if (
    type === "video" ||
    type === "vid"
  ) {

    // Hide image

    if (callImage) {

      callImage.classList.add(
        "hidden"
      );

    }


    // Show video

    if (callVideo) {

      callVideo.classList.remove(
        "hidden"
      );

      callVideo.src =
        mediaPath;

      callVideo.loop =
        true;

      callVideo.playsInline =
        true;

      callVideo.muted =
        true;

      callVideo.load();


      callVideo.play()
        .catch(
          error => {

            console.log(
              "Video needs user interaction:",
              error
            );

          }
        );

    }

  }


  // ==============================
  // PHOTO
  // ==============================

  else {

    // Stop video

    if (callVideo) {

      callVideo.pause();

      callVideo.removeAttribute(
        "src"
      );

      callVideo.load();

      callVideo.classList.add(
        "hidden"
      );

    }


    // Show image

    if (callImage) {

      callImage.classList.remove(
        "hidden"
      );

      callImage.src =
        mediaPath;


      // Show error in console
      // if photo cannot load

      callImage.onerror =
        () => {

          console.error(
            "Could not load image:",
            mediaPath
          );

        };

    }

  }

}


// ==============================
// SHOW ERROR
// ==============================

function showError(message) {

  if (loadingScreen) {

    loadingScreen.classList.add(
      "hidden"
    );

  }


  if (centerInfo) {

    centerInfo.classList.add(
      "hidden"
    );

  }


  if (errorMessage) {

    errorMessage.textContent =
      message;

  }


  if (errorScreen) {

    errorScreen.classList.remove(
      "hidden"
    );

  }

}


// ==============================
// MUTE BUTTON
// ==============================

let muted =
  false;


if (muteButton) {

  muteButton.addEventListener(
    "click",
    () => {

      muted =
        !muted;


      if (muted) {

        if (muteIcon) {

          muteIcon.textContent =
            "🔇";

        }


        muteButton.classList.add(
          "active"
        );

      }

      else {

        if (muteIcon) {

          muteIcon.textContent =
            "🎤";

        }


        muteButton.classList.remove(
          "active"
        );

      }

    }
  );

}


// ==============================
// SPEAKER BUTTON
// ==============================

let speakerOn =
  true;


if (speakerButton) {

  speakerButton.addEventListener(
    "click",
    () => {

      speakerOn =
        !speakerOn;


      // Control video sound

      if (
        callVideo &&
        !callVideo.classList.contains(
          "hidden"
        )
      ) {

        callVideo.muted =
          !speakerOn;

      }


      if (speakerOn) {

        speakerButton.classList.remove(
          "active"
        );

        speakerButton.textContent =
          "🔊";

      }

      else {

        speakerButton.classList.add(
          "active"
        );

        speakerButton.textContent =
          "🔇";

      }

    }
  );

}


// ==============================
// END CALL
// ==============================

if (endButton) {

  endButton.addEventListener(
    "click",
    endCall
  );

}


function endCall() {

  // Stop video

  if (callVideo) {

    callVideo.pause();

    callVideo.removeAttribute(
      "src"
    );

  }


  // Update text

  if (callStatus) {

    callStatus.textContent =
      "Call ended";

  }


  if (centerStatus) {

    centerStatus.textContent =
      "Call ended";

  }


  // Disable controls

  if (muteButton) {

    muteButton.disabled =
      true;

  }


  if (speakerButton) {

    speakerButton.disabled =
      true;

  }


  if (endButton) {

    endButton.disabled =
      true;

  }


  // Return home

  setTimeout(() => {

    window.location.href =
      "index.html";

  }, 1000);

}


// ==============================
// GO HOME
// ==============================

window.goHome =
  function () {

    window.location.href =
      "index.html";

  };
