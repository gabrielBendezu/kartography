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

  @impl true
  def handle_in("map_action", payload, socket) do
    case handle_map_action(payload) do
      {:ok, broadcast_data} ->
        IO.puts("line 43")
        # IO.inspect("received incoming map action with data: #{payload}")
        broadcast!(socket, "map_update", broadcast_data)
        {:noreply, socket}

      {:error, reason} ->
        {:reply, {:error, %{reason: reason}}, socket}
    end
  end

  defp handle_map_action(%{"type" => "terrain", "data" => data}) do
    # Future: Handle adding shapes/annotations
    if valid_shape_data?(data) do
      {:ok, %{type: "terrain", data: data, timestamp: DateTime.utc_now()}}
    else
      {:error, "invalid_no_good"}
    end
  end

  # Handle specific map actions based on type
  defp handle_map_action(%{"type" => "brush", "data" => data}) do
    # Validate brush stroke data
    if valid_brushstroke?(data) do
      IO.puts("testing handled map action")
      # IO.inspect("received incoming map action with data: #{data}")
      {:ok, %{type: "brush", data: data, timestamp: DateTime.utc_now()}}
    else
      {:error, "invalid_brushstroke"}
    end
  end

  defp handle_map_action(%{"type" => "object", "data" => data}) do
    # Future: Handle image dropping
    if valid_image_data?(data) do
      {:ok, %{type: "object", data: data, timestamp: DateTime.utc_now()}}
    else
      {:error, "invalid_image"}
    end
  end

  defp handle_map_action(%{"type" => "map_mode", "data" => data}) do
    # Future: Handle EU4-like map mode layers
    if valid_layer_data?(data) do
      {:ok, %{type: "map_mode", data: data, timestamp: DateTime.utc_now()}}
    else
      {:error, "invalid_layer"}
    end
  end

  defp handle_map_action(%{"type" => "path", "data" => data}) do
    # Future: Handle rivers, roads, railways
    if valid_layer_data?(data) do
      {:ok, %{type: "path", data: data, timestamp: DateTime.utc_now()}}
    else
      {:error, "invalid_path"}
    end
  end

  defp handle_map_action(%{"type" => "text", "data" => data}) do
    # Future: Handle text annotations
    if valid_text_data?(data) do
      {:ok, %{type: "text", data: data, timestamp: DateTime.utc_now()}}
    else
      {:error, "invalid_text"}
    end
  end

  defp handle_map_action(%{"type" => type}) do
    {:error, "unsupported_action_type: #{type}"}
  end

  defp handle_map_action(_) do
    {:error, "invalid_payload_format"}
  end

  # Validation functions
  defp valid_brushstroke?(%{"points" => points, "color" => _color, "width" => width})
    when is_list(points) and is_number(width) and width > 0, do: true
  defp valid_brushstroke?(_), do: true # *****

  defp valid_image_data?(%{"url" => url, "position" => %{"x" => x, "y" => y}})
    when is_binary(url) and is_number(x) and is_number(y), do: true
  defp valid_image_data?(_), do: false

  defp valid_layer_data?(%{"layer_id" => id, "visible" => visible})
    when is_binary(id) and is_boolean(visible), do: true
  defp valid_layer_data?(_), do: false

  defp valid_shape_data?(%{"shape_type" => type, "properties" => _props})
    when type in ["rectangle", "circle", "polygon"], do: true
  defp valid_shape_data?(_), do: false

  defp valid_text_data?(%{"text" => text, "position" => %{"x" => x, "y" => y}})
    when is_binary(text) and is_number(x) and is_number(y), do: true
  defp valid_text_data?(_), do: false


  # Add authorization logic here
  # defp authorized?(_payload) do
  #   true
  # end
end
