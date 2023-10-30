////////////////////////////////////////////////////////////////////////////////
// --NEXT///////////////////////////////////////////////////////////////////////
// Firebase//////////////////////////////////////////////////////////////////////////////
import { async } from "@firebase/util";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  onValue,
  push,
  remove,
  orderByChild,
  serverTimestamp,
  query,
  goOnline,
} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDqo6O98uKG6vIovn9uaMiIyAttzUyZizA",
  authDomain: "elite-messaging.firebaseapp.com",
  projectId: "elite-messaging",
  storageBucket: "elite-messaging.appspot.com",
  messagingSenderId: "25038291351",
  appId: "1:25038291351:web:d7ee2978b4833722b304d2",
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const chatObjInDb = ref(db, "chats");

/// to arrange the database data according to the timestamp
const q = query(chatObjInDb, orderByChild("timeStamp"));
////////////////////////////////////////////////////////////////////////////////
// --NEXT///////////////////////////////////////////////////////////////////////
// OOP //////////////////////////////////////////////////////////////////////////////

// class eliteMessaging {
//   constructor() {
//   }
// }
////////////////////////////////////////////////////////////////////////////////
// --NEXT///////////////////////////////////////////////////////////////////////
// elements //////////////////////////////////////////////////////////////////////////////

// by querySelector
const form = document.querySelector(".section-form");
const chatBox = document.querySelector(".section-dashboard");
// by id
const usernameDisplay = document.getElementById("username_cont");
const sendMessage_inp = document.getElementById("send-message_inp");
const send_btn = document.getElementById("send_btn");
const allChatsCont = document.getElementById("chat_box");
////////////////////////////////////////////////////////////////////////////////
// --NEXT///////////////////////////////////////////////////////////////////////
//--- reuable functions//////////////////////////////////////////////////////////////////////////////
const openPage = function (pagename) {
  document.querySelectorAll("section").forEach((section) => {
    section.classList.add(section.getAttribute("data-hide"));
  });
  pagename.classList.remove(pagename.getAttribute("data-hide"));
};
const isAuthed = function (form) {
  if (
    localStorage.getItem("userId") !== null &&
    !form.classList.contains(form.getAttribute("data-hide"))
  )
    return true;
  else return false;
};
const setUsername = function () {
  usernameDisplay.innerHTML = `--${localStorage.getItem("userId")}--`;
};
////////////////////////////////////////////////////////////////////////////////
// --NEXT///////////////////////////////////////////////////////////////////////
//--- to open chat page if user is authenticated onload//////////////////////////////////////////////////////////////////////////////
window.onload = function () {
  if (isAuthed(form)) {
    openPage(chatBox);
  } else {
    openPage(form);
  }
};

////////////////////////////////////////////////////////////////////////////////
// --NEXT///////////////////////////////////////////////////////////////////////
// to auth user//////////////////////////////////////////////////////////////////////////////

const openChat_btn = document.getElementById("open-chat_btn");
const username_inp = document.getElementById("username_inp");
const error_p = document.getElementById("error_p");
openChat_btn.addEventListener("click", (e) => {
  e.preventDefault();
  const isReadyToOpenChat = function () {
    if (
      username_inp.value &&
      username_inp.value.length >= 2 &&
      username_inp.value.length <= 17 &&
      !Number(username_inp.value)
    ) {
      return "ready";
    } else if (!username_inp.value) {
      return "invalid input";
    } else if (username_inp.value.length < 2) {
      return "name is too short";
    } else if (username_inp.value.length > 17) {
      return "name is too long";
    } else if (Number(username_inp.value)) {
      return "use letters";
    }
  };
  if (isReadyToOpenChat() === "ready") {
    localStorage.setItem("userId", username_inp.value);
    error_p.innerHTML = "";
    username_inp.value = "";
    openPage(chatBox);
  } else {
    error_p.innerHTML = isReadyToOpenChat();
  }
});

////////////////////////////////////////////////////////////////////////////////
// --NEXT///////////////////////////////////////////////////////////////////////
// to  send messages//////////////////////////////////////////////////////////////////////////////
send_btn.addEventListener("click", (e) => {
  e.preventDefault();
  allChatsCont.scrollTo({ top: allChatsCont.scrollHeight, behavior: "smooth" });
  const inpValue = sendMessage_inp.value;
  if (inpValue) {
    push(chatObjInDb, {
      name: localStorage.getItem("userId"),
      message: inpValue,
      time: `${
        new Date().getMonth() + 1
      }/${new Date().getDate()}/${new Date().getFullYear()}`,
      timeStamp: serverTimestamp(),
    });
    sendMessage_inp.value = "";
  }
});
/*
const chatObjInDb = ref(db, "chats");
onValue(chatObjInDb, (snapshot) => {
  console.log(snapshot.val());
});
orderByPriority("time");
const deleteRef = ref(db, "chats/-NhtEWsvumk4eA0r4BQ_");
push(chatObjInDb, {
  name: "username",
  time: serverTimestamp(),
});
remove(deleteRef);
// push(chatObjInDb, "john");

*/
////////////////////////////////////////////////////////////////////////////////
// --NEXT///////////////////////////////////////////////////////////////////////
// to  load messages//////////////////////////////////////////////////////////////////////////////
onValue(q, (snapshot) => {
  setUsername();
  const chatObj = Object.values(snapshot.val());
  allChatsCont.innerHTML = "";
  chatObj.forEach((obj) => {
    allChatsCont.innerHTML += `
    <div class="chat ${
      localStorage.getItem("userId") === obj.name ? "right" : "left"
    }">
    <p class="sender-name">${obj.name}</p>
    <div class="chat-message">
      <p class="message">${obj.message}</p>
      <p class="date">${obj.time}</p>
    </div>
  </div>
    `;
  });
});
