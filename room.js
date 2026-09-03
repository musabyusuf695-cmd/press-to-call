import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  doc,
  getDoc
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ==============================
// FIREBASE
// ==============================

const firebaseConfig = {
  apiKey: "AIzaSyDEJv47nDpckV_pOu1roa1dAyEoMCCQU5A",
  authDomain: "press-to-call.firebaseapp.com",
  projectId: "press-to-call",
  storageBucket: "press-to-call.firebasestorage.app",
  messagingSenderId: "1067913620438",
  appId: "1:1067913620438:web:2576355fbd191e17aa1277"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


// ==============================
// ELEMENTS
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
// GET CALL ID
// ACCEPTS ?call= OR ?id=
// ==============================

const urlParams =
  new URLSearchParams(window.location.search);

const callId =
  urlParams.get("call") ||
  urlParams.get("id");


// ==============================
// START
// ==============================

loadCall();


// ==============================
// LOAD CALL
// ==============================

async function loadCall() {

  if (!callId) {

    showError(
      "No call ID was found."
    );

    return;
  }


  try {

    const callRef =
      doc(db, "calls", callId);

    const callSnapshot =
      await getDoc(callRef);


    if (!callSnapshot.exists()) {

      showError(
        "This call could not be found."
      );

      return;
    }


    const callData =
      callSnapshot.data();

    console.log(
      "CALL DATA:",
      callData
    );


    // ==========================
    // GET NAME
    // ==========================

    const name =
      callData.name ||
      "Press to Call";


    // ==========================
    // GET MEDIA
    // ==========================

    const mediaPath =
      callData.mediaPath ||
      callData.media ||
      callData.mediaUrl ||
      callData.url ||
      callData.path;


    const mediaType =
      String(
        callData.mediaType ||
        callData.type ||
        "photo"
      ).toLowerCase();


    // ==========================
    // UPDATE TEXT
    // ==========================

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
    // SHOW MEDIA
    // ==========================

    if (mediaPath) {

      showMedia(
        mediaPath,
        mediaType
      );

    } else {

      console.error(
        "NO MEDIA FOUND:",
        callData
      );

      showError(
        "No photo or video was attached to this call."
      );

      return;

    }


    // ==========================
    // CONNECTED
    // ==========================

    callStatus.textContent =
      "Connecting...";

    centerStatus.textContent =
      "Connecting...";


    // Wait until media is ready
    setTimeout(() => {

      loadingScreen.classList.add(
        "hidden"
      );

      callStatus.textContent =
        "In call";

      centerStatus.textContent =
        "In call";

      centerInfo.classList.add(
        "call-connected"
      );

    }, 800);


  } catch (error) {

    console.error(
      "FIREBASE ERROR:",
      error
    );

    showError(
      "Could not connect to this call."
    );

  }

}


// ==============================
// SHOW MEDIA
// ==============================

function showMedia(
  mediaPath,
  mediaType
) {

  console.log(
    "MEDIA PATH:",
    mediaPath
  );

  console.log(
    "MEDIA TYPE:",
    mediaType
  );


  // VIDEO
  if (
    mediaType === "video" ||
    mediaType === "vid" ||
    mediaPath.toLowerCase().endsWith(".mp4") ||
    mediaPath.toLowerCase().endsWith(".webm")
  ) {

    callImage.classList.add(
      "hidden"
    );

    callVideo.classList.remove(
      "hidden"
    );

    callVideo.src =
      mediaPath;

    callVideo.muted = true;

    callVideo.load();


    callVideo.play()
      .catch(error => {

        console.log(
          "Video play error:",
          error
        );

      });

  }


  // PHOTO
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


    callImage.onload =
      () => {

        console.log(
          "Image loaded successfully"
        );

      };


    callImage.onerror =
      () => {

        showError(
          "The call image could not be loaded."
        );

      };

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

    } else {

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

let speakerOn = false;

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

    window.location.href =
      "index.html";

  }
);


// ==============================
// HOME
// ==============================

window.goHome = function () {

  window.location.href =
    "index.html";

};
// ==============================
// CALL TIMER
// ==============================

const callTimer =
  document.getElementById("callTimer");

let seconds = 0;

setInterval(() => {

  seconds++;

  const hours =
    Math.floor(seconds / 3600);

  const minutes =
    Math.floor(
      (seconds % 3600) / 60
    );

  const secs =
    seconds % 60;

  callTimer.textContent =
    String(hours).padStart(2, "0") +
    ":" +
    String(minutes).padStart(2, "0") +
    ":" +
    String(secs).padStart(2, "0");

}, 1000);


// ==============================
// STOP / START VIDEO BUTTON
// ==============================

const videoButton =
  document.getElementById("videoButton");

const videoIcon =
  document.getElementById("videoIcon");

const videoText =
  document.getElementById("videoText");

let videoStopped = false;

videoButton.addEventListener(
  "click",
  () => {

    videoStopped =
      !videoStopped;


    if (videoStopped) {

      callVideo.style.visibility =
        "hidden";

      callImage.style.visibility =
        "hidden";

      videoIcon.textContent =
        "📹";

      videoText.textContent =
        "Start Video";

      videoButton.classList.add(
        "active"
      );

    } else {

      callVideo.style.visibility =
        "visible";

      callImage.style.visibility =
        "visible";

      videoIcon.textContent =
        "📹";

      videoText.textContent =
        "Stop Video";

      videoButton.classList.remove(
        "active"
      );

    }

  }
);


// ==============================
// PARTICIPANTS
// ==============================

const participantsButton =
  document.getElementById(
    "participantsButton"
  );

if (participantsButton) {

  participantsButton.addEventListener(
    "click",
    () => {

      alert(
        "Participants: 2"
      );

    }
  );

}
