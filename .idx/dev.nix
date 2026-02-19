{ pkgs, ... }: {
  # 1. System Configuration
  channel = "stable-24.05"; 

  # 2. Package Installation
  packages = [
    pkgs.nodejs_22
    pkgs.nodePackages.firebase-tools
    pkgs.tsx
    pkgs.jdk21
    pkgs.sudo
    pkgs.psmisc
    pkgs.nano
  ];

  # 3. Environment Variables
  env = {
    FUNCTIONS_DISCOVERY_TIMEOUT = "60";
  };

  # 4. Project IDX Specifics
  idx = {
    # Extensions to install in VS Code
    extensions = [ 
      "mtxr.sqltools-driver-pg"
      "mtxr.sqltools"
    ];

    # Workspace Lifecycle Hooks
    workspace = {
      onStart = {
        repair-sudo = "chmod 4755 /usr/bin/sudo";
        install = "npm install";
      };
    };

    # Previews Configuration
    previews = {
      enable = true; # <--- THE ONLY "ENABLE" YOU NEED
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--port" "$PORT" "--host" "0.0.0.0"];
          manager = "web";
        };
      };
    };
  };
}