defmodule KartographyWeb.MapRoomChannel do
  use KartographyWeb, :channel
  require Logger

  @impl true
  def join("map_room:1", _message, socket) do
    {:ok, socket}
  end

  @impl true
  def join("map_room:" <> _room_id, _message, socket) do
    {:ok, socket}
  end

  # @impl true
  # def join("map_room:1", payload, socket) do
  #   if authorized?(payload) do
  #     {:ok, socket}
  #   else
  #     {:error, %{reason: "unauthorized"}}
  #   end
  # end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  # @impl true
  # def handle_in("ping", payload, socket) do
  #   {:reply, {:ok, payload}, socket}
  # end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (map_room:1).
  @impl true
  def handle_in("new_msg", %{"body" => body}, socket) do
    broadcast!(socket, "new_msg", %{body: body})
    {:noreply, socket}
  end

  # Handle input is called by pheonix channel when channel.push() is called.
  # channel.push("new_msg", {body: chatInput.value}), here, it is chatInput.value that
  # becomes the map
  @impl true
  def handle_in("canvas_draw", %{"type" => "brush_stroke", "data" => data}, socket) do
    broadcast!(socket, "canvas_update", %{type: "brush_stroke", data: data})
    {:noreply, socket}
  end

  # Add authorization logic here
  # defp authorized?(_payload) do
  #   true
  # end
end
