defmodule Kartography.Repo do
  use Ecto.Repo,
    otp_app: :kartography,
    adapter: Ecto.Adapters.Postgres
end
