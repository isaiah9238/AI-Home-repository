{ pkgs, ... }: { 
  channel = "stable-24.05";
  packages = [
    pkgs.nodejs_22
    pkgs.nodePackages.nodemon
    pkgs.psmisc
    pkgs.sudo
  ];
  env = { };
  idx = {
    extensions = [
      #any
    ];
    previews = {
      enable = true;
      previews = {
        web = {
        command = [ "npm" "run" "dev" "--" "-p" "$PORT" "-H" "0.0.0.0" ];
        manager = "web";
         #env = {
           #PORT = "3000";
           #};
        };
      };
    };
    workspace = {
      onCreate = {
        npm-install = "npm install";
      };
      onStart = {
      };
    };
  };
}