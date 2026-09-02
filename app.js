// app.js

import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


// ==============================
// GET HTML ELEMENTS
// ==============================

const mediaPathInput = document.getElementById("mediaPath");
const mediaTypeInput = document.getElementById("mediaType");
const callNameInput = document.getElementById("callName");

const createCallBtn = document.getElementById("createCallBtn");

const callLinkInput = document.getElementById("callLink");
const copyCallBtn = document.getElementById("copyCallBtn");


// ==============================
// CREATE CALL
// ==============================

createCallBtn.addEventListener("click", async () => {
  
  const mediaPath = mediaPathInput.value.trim();
  const mediaType = mediaTypeInput.value;
  const callName = callNameInput.value.trim();
  
  
  // Check media path
  if (!mediaPath) {
    alert("Please enter the photo or video path.");
    return;
  }
  
  
  // Check call name
  if (!callName) {
    alert("Please enter your name or call name.");
    return;
  }
  
  
  // Disable button while creating
  createCallBtn.disabled = true;
  createCallBtn.innerText = "Creating...";
  
  
  try {
    
    // ==============================
    // SAVE CALL TO FIRESTORE
    // ==============================
    
    const callRef = await addDoc(
      collection(db, "calls"),
      {
        
        name: callName,
        
        // Example:
        // media/photo.jpg
        // media/video.mp4
        // Or a full https:// URL
        mediaUrl: mediaPath,
        
        // image or video
        mediaType: mediaType,
        
        status: "waiting",
        
        createdAt: serverTimestamp()
        
      }
    );
    
    
    // ==============================
    // CREATE SHAREABLE LINK
    // ==============================
    
    const callId = callRef.id;
    
    const baseUrl =
      window.location.origin +
      window.location.pathname.replace(/[^/]*$/, "");
    
    const callLink =
      baseUrl +
      "call.html?call=" +
      encodeURIComponent(callId);
    
    
    // Show link
    callLinkInput.value = callLink;
    
    
    // Enable copy button
    copyCallBtn.disabled = false;
    
    
    alert("Your Press to Call link is ready!");
    
    console.log("Call created:", callId);
    console.log("Call link:", callLink);
    
    
  } catch (error) {
    
    console.error("Error creating call:", error);
    
    alert(
      "Could not create the call. Check your Firebase configuration and Firestore rules."
    );
    
  } finally {
    
    createCallBtn.disabled = false;
    createCallBtn.innerText = "Create Call Link";
    
  }
  
});


// ==============================
// COPY CALL LINK
// ==============================

copyCallBtn.addEventListener("click", async () => {
  
  const link = callLinkInput.value.trim();
  
  
  if (!link) {
    alert("Create a call link first.");
    return;
  }
  
  
  try {
    
    await navigator.clipboard.writeText(link);
    
    const originalText = copyCallBtn.innerText;
    
    copyCallBtn.innerText = "Copied!";
    
    setTimeout(() => {
      
      copyCallBtn.innerText = originalText;
      
    }, 2000);
    
  } catch (error) {
    
    console.error("Copy failed:", error);
    
    // Fallback for some mobile browsers
    callLinkInput.select();
    
    document.execCommand("copy");
    
    alert("Link copied!");
    
  }
  
});


// ==============================
// AUTO-DETECT MEDIA TYPE
// Optional convenience feature
// ==============================

mediaPathInput.addEventListener("input", () => {
  
  const path = mediaPathInput.value
    .trim()
    .toLowerCase();
  
  
  if (
    path.endsWith(".mp4") ||
    path.endsWith(".webm") ||
    path.endsWith(".ogg") ||
    path.endsWith(".mov")
  ) {
    
    mediaTypeInput.value = "video";
    
  }
  
  
  if (
    path.endsWith(".jpg") ||
    path.endsWith(".jpeg") ||
    path.endsWith(".png") ||
    path.endsWith(".gif") ||
    path.endsWith(".webp")
  ) {
    
    mediaTypeInput.value = "image";
    
  }
  
});