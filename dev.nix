{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs-20_x
  ];

  shellHook = ''
    echo "Nix shell for AI Home is active."
    echo "Node version: $(node --version)"
    echo "npm version: $(npm --version)"
  '';
}
