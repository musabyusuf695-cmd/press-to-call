// ==============================
// ROOM.JS
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
// FIREBASE CONFIG
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
// START FIREBASE
// ==============================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


// ==============================
// HTML ELEMENTS
// ==============================

const callImage =
  document.getElementById("callImage");

const callVideo =
  document.getElementById("callVideo");

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
// GET CALL ID
// IMPORTANT: USE "call"
// ==============================

const params =
  new URLSearchParams(window.location.search);

const callId =
  params.get("call");


// ==============================
// LOAD CALL
// ==============================

async function loadCall() {

  // Stop if there is no ID
  if (!callId) {

    showFallback();

    return;

  }


  try {

    const callRef =
      doc(db, "calls", callId);

    const callSnapshot =
      await getDoc(callRef);


    // Call not found
    if (!callSnapshot.exists()) {

      showFallback();

      return;

    }


    const callData =
      callSnapshot.data();


    // Get caller name
    const name =
      callData.name ||
      "Press to Call";


    // Get media
    const mediaPath =
      callData.mediaPath ||
      callData.media ||
      callData.url ||
      callData.path;


    const mediaType =
      String(
        callData.mediaType ||
        callData.type ||
        "photo"
      ).toLowerCase();


    // Update text
    callerName.textContent =
      name;

    centerName.textContent =
      name;


    const firstLetter =
      name.charAt(0).toUpperCase();

    callerAvatar.textContent =
      firstLetter;

    centerAvatar.textContent =
      firstLetter;


    // ==========================
    // SHOW VIDEO
    // ==========================

    if (
      mediaType === "video" ||
      mediaType === "vid"
    ) {

      showVideo(
        mediaPath
      );

    }

    // ==========================
    // SHOW PHOTO
    // ==========================

    else {

      showPhoto(
        mediaPath
      );

    }


    // Change status after loading
    setTimeout(() => {

      callStatus.textContent =
        "In call";

      centerStatus.textContent =
        "In call";

      centerInfo.classList.add(
        "call-connected"
      );

    }, 800);


  }
  catch (error) {

    console.error(
      "Call error:",
      error
    );

    showFallback();

  }

}


// ==============================
// SHOW PHOTO
// ==============================

function showPhoto(mediaPath) {

  // If no path, use fallback
  if (!mediaPath) {

    showFallback();

    return;

  }


  callVideo.pause();

  callVideo.removeAttribute(
    "src"
  );

  callVideo.classList.add(
    "hidden"
  );


  callImage.src =
    mediaPath;

  callImage.classList.remove(
    "hidden"
  );


  // If image fails
  callImage.onerror =
    () => {

      console.error(
        "Image could not load:",
        mediaPath
      );

      showFallback();

    };

}


// ==============================
// SHOW VIDEO
// ==============================

function showVideo(mediaPath) {

  // If no video path
  if (!mediaPath) {

    showFallback();

    return;

  }


  callImage.classList.add(
    "hidden"
  );


  callVideo.src =
    mediaPath;

  callVideo.classList.remove(
    "hidden"
  );


  callVideo.load();


  // Try playing
  callVideo.play()
    .catch(() => {

      // Mobile browsers may block sound
      callVideo.muted = true;

      callVideo.play()
        .catch(error => {

          console.log(
            "Video could not autoplay:",
            error
          );

        });

    });


  // If video cannot load
  callVideo.onerror =
    () => {

      console.error(
        "Video could not load:",
        mediaPath
      );

      showFallback();

    };

}


// ==============================
// FALLBACK
// ==============================

function showFallback() {

  // Hide video
  callVideo.pause();

  callVideo.removeAttribute(
    "src"
  );

  callVideo.classList.add(
    "hidden"
  );


  // Hide image
  callImage.classList.add(
    "hidden"
  );


  // Still show a clean call screen
  callerName.textContent =
    "Press to Call";

  centerName.textContent =
    "Press to Call";

  callStatus.textContent =
    "Connecting...";

  centerStatus.textContent =
    "Connecting...";

}


// ==============================
// MUTE
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
// SPEAKER
// ==============================

let speakerOn = true;


speakerButton.addEventListener(
  "click",
  () => {

    speakerOn =
      !speakerOn;


    if (!callVideo.classList.contains("hidden")) {

      callVideo.muted =
        !speakerOn;

    }


    speakerButton.textContent =
      speakerOn
        ? "🔊"
        : "🔇";

  }
);


// ==============================
// END CALL
// ==============================

endButton.addEventListener(
  "click",
  () => {

    callVideo.pause();

    callStatus.textContent =
      "Call ended";

    centerStatus.textContent =
      "Call ended";


    setTimeout(() => {

      window.location.href =
        "index.html";

    }, 800);

  }
);


// ==============================
// START
// ==============================

loadCall();
