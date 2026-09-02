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

const callImage = document.getElementById("callImage");

const callVideo = document.getElementById("callVideo");

const loadingScreen = document.getElementById("loadingScreen");

const errorScreen = document.getElementById("errorScreen");

const errorMessage = document.getElementById("errorMessage");

const callerName = document.getElementById("callerName");

const centerName = document.getElementById("centerName");

const callStatus = document.getElementById("callStatus");

const centerStatus = document.getElementById("centerStatus");

const callerAvatar = document.getElementById("callerAvatar");

const centerAvatar = document.getElementById("centerAvatar");

const centerInfo = document.getElementById("centerInfo");

const muteButton = document.getElementById("muteButton");

const muteIcon = document.getElementById("muteIcon");

const speakerButton = document.getElementById("speakerButton");

const endButton = document.getElementById("endButton");


// ==============================
// GET CALL ID FROM LINK
// ==============================

const urlParams = new URLSearchParams(window.location.search);

const callId = urlParams.get("id");


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

    // Get the call document
    const callRef = doc(
      db,
      "calls",
      callId
    );

    const callSnapshot = await getDoc(callRef);


    // Check if call exists
    if (!callSnapshot.exists()) {

      showError(
        "This call does not exist or may have expired."
      );

      return;
    }


    // Get data
    const callData = callSnapshot.data();

    console.log("Call loaded:", callData);


    // Media path
    const mediaPath =
      callData.mediaPath ||
      callData.media ||
      callData.url ||
      callData.path;


    // Media type
    const mediaType =
      callData.mediaType ||
      callData.type ||
      "photo";


    // Optional caller name
    const name =
      callData.name ||
      "Press to Call";


    // Check media
    if (!mediaPath) {

      showError(
        "This call does not contain a photo or video."
      );

      return;
    }


    // Update names
    callerName.textContent = name;

    centerName.textContent = name;


    // Avatar letter
    const firstLetter =
      name.charAt(0).toUpperCase();

    callerAvatar.textContent =
      firstLetter;

    centerAvatar.textContent =
      firstLetter;


    // Display media
    showMedia(
      mediaPath,
      mediaType
    );


    // Simulate connecting
    callStatus.textContent =
      "Connecting...";

    centerStatus.textContent =
      "Connecting...";


    // Hide loading after media loads
    setTimeout(() => {

      loadingScreen.classList.add("hidden");

      callStatus.textContent =
        "In call";

      centerStatus.textContent =
        "In call";

      // Hide the large center information
      // so the media becomes the main focus
      centerInfo.classList.add("call-connected");

    }, 1200);


  }
  catch (error) {

    console.error(
      "Error loading call:",
      error
    );

    showError(
      "Could not connect to this call. Please try again."
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
    String(mediaType).toLowerCase();


  // --------------------------
  // VIDEO
  // --------------------------

  if (
    type === "video" ||
    type === "vid"
  ) {

    callImage.classList.add(
      "hidden"
    );

    callVideo.classList.remove(
      "hidden"
    );

    callVideo.src =
      mediaPath;

    callVideo.muted = false;

    callVideo.load();


    callVideo.play()
      .catch(() => {

        // Some mobile browsers block
        // autoplay with sound.
        callVideo.muted = true;

        callVideo.play()
          .catch(error => {

            console.log(
              "Video autoplay blocked:",
              error
            );

          });

      });

  }


  // --------------------------
  // PHOTO
  // --------------------------

  else {

    callVideo.pause();

    callVideo.removeAttribute(
      "src"
    );

    callVideo.classList.add(
      "hidden"
    );


    callImage.classList.remove(
      "hidden"
    );

    callImage.src =
      mediaPath;

  }

}


// ==============================
// SHOW ERROR
// ==============================

function showError(message) {

  loadingScreen.classList.add(
    "hidden"
  );

  centerInfo.classList.add(
    "hidden"
  );

  errorMessage.textContent =
    message;

  errorScreen.classList.remove(
    "hidden"
  );

}


// ==============================
// MUTE BUTTON
// ==============================

let muted = false;

muteButton.addEventListener(
  "click",
  () => {

    muted = !muted;


    if (muted) {

      muteIcon.textContent =
        "🔇";

      muteButton.classList.add(
        "active"
      );

    }

    else {

      muteIcon.textContent =
        "🎤";

      muteButton.classList.remove(
        "active"
      );

    }

  }
);


// ==============================
// SPEAKER BUTTON
// ==============================

let speakerOn = true;

speakerButton.addEventListener(
  "click",
  () => {

    speakerOn = !speakerOn;


    if (
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


// ==============================
// END CALL
// ==============================

endButton.addEventListener(
  "click",
  endCall
);


function endCall() {

  // Stop video
  if (!callVideo.paused) {

    callVideo.pause();

  }


  // Change screen text
  callStatus.textContent =
    "Call ended";

  centerStatus.textContent =
    "Call ended";


  // Disable buttons
  muteButton.disabled = true;

  speakerButton.disabled = true;

  endButton.disabled = true;


  // Redirect after a moment
  setTimeout(() => {

    window.location.href =
      "index.html";

  }, 1000);

}


// ==============================
// GO HOME
// ==============================

window.goHome = function () {

  window.location.href =
    "index.html";

};
