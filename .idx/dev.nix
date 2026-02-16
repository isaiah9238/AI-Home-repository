{ pkgs, ... }: {
  # Using a stable 2026 channel that supports Node 22
  channel = "stable-25.11"; 

  packages = [
    pkgs.nodejs_22          # Matches your package.json engine
    pkgs.nodePackages.firebase-tools
    pkgs.tsx                # Required for your "genkit:start" script
    pkgs.jdk21              # Required for Firebase Emulators
    pkgs.sudo
    pkgs.psmisc
    pkgs.nano
  ];

  env = {
    # Helps prevent the "Discovery Timeout" during rebase/boot
    FUNCTIONS_DISCOVERY_TIMEOUT = "60";
  };

  idx = {
    extensions = [
      "mtxr.sqltools-driver-pg"
      "mtxr.sqltools"
    ];

    workspace = {
      onStart = {
        # Fixes permission issues on the hotspot/cloud environment
        repair-sudo = "chmod 4755 /usr/bin/sudo";
        # Clean install to fix the "7,000 files" bloat
        install = "npm install";
      };
    };

    previews = {
      enable = true; # <--- Fixed "Recognition" error
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--port" "$PORT" "--host" "0.0.0.0"];
          manager = "web";
        };
      };
    };
  };

  # New Firebase Emulator block with correct Nix syntax
  services.firebase.emulators = {
    enable = true;
    services = [
      "auth"
      "firestore"
      "storage"
      "functions"
      "hosting"
      "pubsub"
      "database"
    ];
  };
}