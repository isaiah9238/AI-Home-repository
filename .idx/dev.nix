{ pkgs, ... }: {
  channel = "stable-24.05"; 

  packages = [
    pkgs.nodejs_20
    pkgs.jdk21        # Required for Firebase Emulators
    pkgs.psmisc       # Gives you the 'fuser' command to kill ports
    pkgs.nano
    pkgs.sudo
    pkgs.sudo-rs
    pkgs.doas-shim
    ];

  env = {
    FUNCTIONS_DISCOVERY_TIMEOUT = "60";
  };

  idx = {
    extensions = [ 
      "gui.npm-scripts"
      "mtxr.sqltools-driver-pg"
      "mtxr.sqltools"
      "google.gcp-integrated-cloud-sdk" # Highly recommended for this setup
    ];

    workspace = {
      onCreate = {
        # Runs only once when the workspace is created
        npm-install = "npm ci";
      };
      onStart = {
        # Runs every time the workspace starts
        # Removed the repair-sudo line
        npm-install = "npm install";
      };
    };

    previews = {
      enable = true;
      previews = {
        web = {
          # Simplified command for IDX/Workstations
          command = ["npm" "run" "dev" "--" "--port" "$PORT" "--hostname" "0.0.0.0"];
          manager = "web";
        };
      };
    };
  };
}