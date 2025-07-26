// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".

// Bring in Phoenix channels client library:
import {Socket} from "phoenix"

// And connect to the path in "lib/kartography_web/endpoint.ex". We pass the
// token for authentication.
//
// Read the [`Using Token Authentication`](https://hexdocs.pm/phoenix/channels.html#using-token-authentication)
// section to see how the token should be used.
console.log("Starting socket connection...")

let socket = new Socket("/socket", {})

socket.onOpen(() => console.log("Socket connected!"))
socket.onError(() => console.log("Socket connection error!"))
socket.onClose(() => console.log("Socket closed!"))

socket.connect()

// Now that you are connected, you can join channels with a topic.
// Let's assume you have a channel with a topic named `room` and the
// subtopic is its id - in this case 1:
console.log("Attempting to join channel map_room:1...")

let channel = socket.channel("map_room:1", {})
let chatInput = document.querySelector("#chat-input")
let messagesContainer = document.querySelector("#messages")

// Test
if (!chatInput || !messagesContainer) {
  console.error("Required DOM elements not found:", { chatInput, messagesContainer })
}

chatInput.addEventListener("keypress", event => {
  if(event.key === 'Enter'){
    channel.push("new_msg", {body: chatInput.value})
    chatInput.value = ""
  }
})

channel.on("new_msg", payload => {
  let messageItem = document.createElement("p")
  messageItem.innerText = `[${Date()}] ${payload.body}`
  messagesContainer.appendChild(messageItem)
})

channel.join()
  .receive("ok", resp => { console.log("Joined successfully", resp) })
  .receive("error", resp => { console.log("Unable to join", resp) })

export default {socket, channel}
