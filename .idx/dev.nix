{ pkgs, ... }: { 
  channel = "stable-24.05";

  packages = [
    pkgs.nodejs_22
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
        command = [ "npm" "run" "dev" "--" "-p" "$PORT" "-H" "0.0.0.0" ];
        manager = "web";
        };
      };
    };

    workspace = {
      onCreate = {
        npm-install = "npm install";
      };
      onStart = {};
    };
  };
}