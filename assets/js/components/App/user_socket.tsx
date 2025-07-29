// socket.ts
// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".

// Bring in Phoenix channels client library:
import { Channel, Socket } from "phoenix"

// Define types for Phoenix responses
interface JoinResponse {
  // Add specific fields based on your server response
  [key: string]: any;
}

interface ErrorResponse {
  reason?: string;
  // Add other error fields as needed
  [key: string]: any;
}

// And connect to the path in "lib/kartography_web/endpoint.ex". We pass the
// token for authentication.
//
// Read the [`Using Token Authentication`](https://hexdocs.pm/phoenix/channels.html#using-token-authentication)
// section to see how the token should be used.
console.log("Starting socket connection...")

const socket: Socket = new Socket("/socket", {})

socket.onOpen((): void => console.log("Socket connected!"))
socket.onError((): void => console.log("Socket connection error!"))
socket.onClose((): void => console.log("Socket closed!"))

socket.connect()

// Now that you are connected, you can join channels with a topic.
// Let's assume you have a channel with a topic named `room` and the
// subtopic is its id - in this case 1:
console.log("Attempting to join channel map_room:1...")

const channel: Channel = socket.channel("map_room:1", {})

channel.join()
  .receive("ok", (resp: JoinResponse): void => { 
    console.log("Joined successfully", resp) 
  })
  .receive("error", (resp: ErrorResponse): void => { 
    console.log("Unable to join", resp) 
  })

export default { channel, socket }