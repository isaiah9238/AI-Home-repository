# To learn more about how to use Nix to configure your environment
# see: https://firebase.google.com/docs/studio/customize-workspace

{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-24.11"; 

  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
    pkgs.nodePackages.firebase-tools
    pkgs.jdk21
    pkgs.nano
    pkgs.psmisc
  ];

  # Sets environment variables in the workspace
  env = {
    FUNCTIONS_DISCOVERY_TIMEOUT = "60";
  };

  # Firebase emulators configuration
  services.firebase.emulators = {
    enable = true;
    # Add your project ID if needed
    # projectId = "AI Home project"; 
  };

  idx = {
    # Search for the extensions you want on https://open-vsx.org/
    extensions = [
      "christian-kohler.npm-intellisense"
    ];

    # Workspace hooks
    workspace = {
      onCreate = {
        npm-install = "npm install";
        default.openFiles = [ "package.json" ];
      };
      onStart = {
        # Custom fix for the permissions issues we had
        repair-sudo = "sudo chmod 4755 /usr/bin/sudo || true";
      };
    };

    # Preview configuration
    previews = {
      enable = true;
      previews = {
        web = {
          command = [ "npm" "run" "dev" "--" "--port" "$PORT" "--host" "0.0.0.0" ];
          manager = "web";
        };
      };
    };
  };
}