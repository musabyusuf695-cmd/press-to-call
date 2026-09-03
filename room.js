// ==============================
// ROOM.JS
// ==============================

import { db } from "./firebase.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ==============================
// GET ELEMENTS
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
// HIDE EVERYTHING FIRST
// ==============================

if (loadingScreen) {
  loadingScreen.style.display = "none";
}

if (errorScreen) {
  errorScreen.style.display = "none";
}

if (callImage) {
  callImage.style.display = "none";
}

if (callVideo) {
  callVideo.style.display = "none";
}


// ==============================
// GET CALL ID
// Accept BOTH ?call= and ?id=
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
      "This call link is invalid."
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


    // ==========================
    // GET MEDIA
    // ==========================

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


    const name =
      callData.name ||
      "Musab";


    if (!mediaPath) {

      showError(
        "No call media was found."
      );

      return;
    }


    // ==========================
    // SET NAME
    // ==========================

    if (callerName) {
      callerName.textContent = name;
    }

    if (centerName) {
      centerName.textContent = name;
    }


    const firstLetter =
      name.charAt(0).toUpperCase();


    if (callerAvatar) {
      callerAvatar.textContent =
        firstLetter;
    }

    if (centerAvatar) {
      centerAvatar.textContent =
        firstLetter;
    }


    // ==========================
    // SET STATUS
    // ==========================

    if (callStatus) {
      callStatus.textContent =
        "In call";
    }

    if (centerStatus) {
      centerStatus.textContent =
        "In call";
    }


    // ==========================
    // SHOW MEDIA IMMEDIATELY
    // ==========================

    if (
      mediaType === "video" ||
      mediaType === "vid" ||
      mediaPath.toLowerCase()
        .includes(".mp4") ||
      mediaPath.toLowerCase()
        .includes(".webm")
    ) {

      showVideo(mediaPath);

    } else {

      showImage(mediaPath);

    }


  } catch (error) {

    console.error(error);

    showError(
      "Could not connect to this call."
    );

  }

}


// ==============================
// SHOW IMAGE
// ==============================

function showImage(src) {

  if (callVideo) {

    callVideo.pause();

    callVideo.removeAttribute("src");

    callVideo.style.display =
      "none";

  }


  if (callImage) {

    callImage.onload = () => {

      callImage.style.display =
        "block";

    };


    callImage.onerror = () => {

      showError(
        "The call photo could not be loaded."
      );

    };


    callImage.src = src;

  }

}


// ==============================
// SHOW VIDEO
// ==============================

function showVideo(src) {

  if (callImage) {

    callImage.style.display =
      "none";

  }


  if (callVideo) {

    callVideo.muted = true;

    callVideo.playsInline = true;

    callVideo.autoplay = true;

    callVideo.loop = true;


    callVideo.oncanplay = () => {

      callVideo.style.display =
        "block";

      callVideo.play()
        .catch(error => {

          console.log(
            "Video play error:",
            error
          );

        });

    };


    callVideo.onerror = () => {

      showError(
        "The call video could not be loaded."
      );

    };


    callVideo.src = src;

    callVideo.load();

  }

}


// ==============================
// SHOW ERROR
// ==============================

function showError(message) {

  if (callImage) {
    callImage.style.display =
      "none";
  }

  if (callVideo) {
    callVideo.style.display =
      "none";
  }

  if (centerInfo) {
    centerInfo.style.display =
      "none";
  }

  if (errorMessage) {
    errorMessage.textContent =
      message;
  }

  if (errorScreen) {
    errorScreen.style.display =
      "flex";
  }

}


// ==============================
// MUTE
// ==============================

let muted = false;

if (muteButton) {

  muteButton.addEventListener(
    "click",
    () => {

      muted = !muted;


      if (muteIcon) {

        muteIcon.textContent =
          muted
            ? "🔇"
            : "🎤";

      }

      muteButton.classList.toggle(
        "active",
        muted
      );

    }
  );

}


// ==============================
// SPEAKER
// ==============================

let speakerOn = false;

if (speakerButton) {

  speakerButton.addEventListener(
    "click",
    () => {

      speakerOn = !speakerOn;


      if (callVideo) {

        callVideo.muted =
          !speakerOn;

      }


      speakerButton.textContent =
        speakerOn
          ? "🔊"
          : "🔇";

      speakerButton.classList.toggle(
        "active",
        !speakerOn
      );

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

  if (callVideo) {

    callVideo.pause();

    callVideo.removeAttribute("src");

  }


  if (callStatus) {
    callStatus.textContent =
      "Call ended";
  }

  if (centerStatus) {
    centerStatus.textContent =
      "Call ended";
  }


  setTimeout(() => {

    window.location.href =
      "index.html";

  }, 500);

}


// ==============================
// GO HOME
// ==============================

window.goHome = function () {

  window.location.href =
    "index.html";

};
