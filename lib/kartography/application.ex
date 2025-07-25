defmodule Kartography.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      KartographyWeb.Telemetry,
      Kartography.Repo,
      {DNSCluster, query: Application.get_env(:kartography, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: Kartography.PubSub},
      # Start a worker by calling: Kartography.Worker.start_link(arg)
      # {Kartography.Worker, arg},
      # Start to serve requests, typically the last entry
      KartographyWeb.Endpoint
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Kartography.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    KartographyWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
