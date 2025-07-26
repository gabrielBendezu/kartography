defmodule KartographyWeb.PageController do
  use KartographyWeb, :controller

  def home(conn, _params) do
    # The home page is often custom made,
    # so skip the default app layout.
    render(conn, :home, layout: false)
  end

  def devtools_json(conn, _params) do
    json(conn, %{})
  end
end
