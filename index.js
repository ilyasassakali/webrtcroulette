import config from "./config.mjs";

const APP_ID = config.APP_ID;
const TOKEN = config.TOKEN;
const CHANNEL = config.CHANNEL;

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

let Tracks = [];
let Users = {};

let joinAndShowUsers = async () => {
  client.on("user-published", handleUserJoined);
  let UID = await client.join(APP_ID, CHANNEL, TOKEN, null);

  Tracks = await AgoraRTC.createMicrophoneAndCameraTracks();

  let player = `<div class="video-container" id="user-container-${UID}">
                        <div class="video-player" id="user-${UID}"></div>
                  </div>`;
  document
    .getElementById("video-streams")
    .insertAdjacentHTML("beforeend", player);

  Tracks[1].play(`user-${UID}`);

  await client.publish([Tracks[0], Tracks[1]]);
};

let joinRoom = async () => {
  await joinAndShowUsers();
  document.getElementById("join-btn").style.display = "none";
  document.getElementById("stream-controls").style.display = "flex";
};

let handleUserJoined = async (user, mediaType) => {
  Users[user.uid] = user;
  await client.subscribe(user, mediaType);

  if (mediaType === "video") {
    let player = document.getElementById(`user-container-${user.uid}`);
    if (player != null) {
      player.remove();
    }

    player = `<div class="video-container" id="user-container-${user.uid}">
                        <div class="video-player" id="user-${user.uid}"></div> 
                 </div>`;
    document
      .getElementById("video-streams")
      .insertAdjacentHTML("beforeend", player);

    user.videoTrack.play(`user-${user.uid}`);
  }

  if (mediaType === "audio") {
    user.audioTrack.play();
  }
};

document.getElementById("join-btn").addEventListener("click", joinRoom);
