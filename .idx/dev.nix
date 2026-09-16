{ pkgs, ... }: { 
  channel = "stable-24.05";

  packages = [
    pkgs.nodejs_22
    pkgs.pnpm
    pkgs.psmisc
    ];
  
  env = {
    PORT = "3000";
  };
  
  idx = {
    extensions = [];

    previews = {
      enable = true;
      previews = {
        web = {
        command = [ "pnpm" "run" "dev" "--" "-p" "$PORT" "-H" "0.0.0.0" ];
        manager = "web";
        };
      };
    };

    workspace = {
      onCreate = {
        pnpm-install = "pnpm install";
      };
      onStart = {};
    };
  };
}