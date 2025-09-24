# shell.nix
# This file defines a reproducible development and testing environment for the watchtower project.
# To be run with `nix-shell --pure`

{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  # buildInputs is the list of software packages we need available in our environment.
  # This is like the "-p" flag, but saved in a file.
  buildInputs = with pkgs; [
    nodejs_20  # Provides node, npm, and npx
    cacert     # Provides the SSL certificates needed for secure network access
  ];

  # The shellHook is a block of shell script that runs automatically
  # every single time you enter this nix-shell.
  # This is where we automate the solution to the EACCES permission error.
  shellHook = ''
    # Create a temporary, writable directory for global npm packages for this session.
    export NPM_GLOBAL_DIR=$(mktemp -d)

    # Tell npm (via an environment variable) to use this directory as its "global" location.
    export npm_config_prefix=$NPM_GLOBAL_DIR

    # Add this new directory's bin folder to the PATH so we can run any installed commands.
    export PATH="$NPM_GLOBAL_DIR/bin:$PATH"

    # Add a friendly message so the user knows the environment is ready.
    echo ""
    echo "✅ Watchtower test environment is ready."
    echo "   NPM global packages will be installed in a temporary directory: $NPM_GLOBAL_DIR"
    echo ""
  '';
}
