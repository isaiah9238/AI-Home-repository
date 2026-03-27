{ pkgs, ... }: { 
  channel = "stable-24.05";
  packages = [
    pkgs.nodejs_20
    pkgs.nodePackages.nodemon
  ];
  env = { };
  idx = {
    extensions = [
    ];
    previews = {
      enable = true;
      previews = {
        web = {
        command = [ "npm" "run" "dev" "--" "-p" "$PORT" "-H" "0.0.0.0" ];
        manager = "web";
         env = {
           PORT = "3100";
           };
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