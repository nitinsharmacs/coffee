#! /bin/bash

COFFEE_DIR=~/.coffee
COFFEE_REPORTERS=~/.coffee/reporters
COFFEE_REPORTER=$COFFEE_REPORTERS/reporter.js
COFFEE_UTILS=$COFFEE_DIR/utils
COFFEE=~/bin/coffee

COFFEE_REPORTERS_RELATIVE="../.coffee/reporters"

function create_coffee_setup() {
  mkdir -p $COFFEE_REPORTERS
}

function store_reporter() {
  local reporter_location=$1
  echo "Downloading Reporter..."
  curl -# -o "$COFFEE_REPORTER" "$reporter_location"
  echo "Stored Reporter successfully"
}

function store_coffee() {
  local coffee_location=$1
  echo "Downloading Coffee file..."
  curl -# -o $COFFEE "$coffee_location"
  echo "Placed coffee in user bin successfully"
}

function store_parser() {
  local parsers_location=$@
  local file_locations=("$COFFEE_UTILS/argsParser.js" "$COFFEE_UTILS/createParser.js" "$COFFEE_UTILS/optionParsers.js")

  echo "Downloading parsers..."
  local index=0
  while [[ $index -le ${#parsers_location[@]} ]]; then
    curl -# -o $COFFEE "${parsers_location[$index]}"
    index=$(( index + 1 ))
  done
  echo "Placed parsers successfully..."
}

function make_coffee_exec() {
  chmod +x $COFFEE
}

function coffee_path_export() {
  echo -e "\nexport COFFEE=\"$COFFEE\""
}

function set_coffee_path() {
  if [[ -f ~/.bashrc ]]; then
    coffee_path_export >> ~/.bashrc
  fi
  if [[ -f ~/.zshrc ]]; then
    coffee_path_export >> ~/.zshrc
  fi
}

REPORTER_URL="https://raw.githubusercontent.com/nitinsharmacs/coffee/main/src/reporters/reporter.js"
COFFEE_URL="https://raw.githubusercontent.com/nitinsharmacs/coffee/main/src/coffee.js"
PARSERS=("https://raw.githubusercontent.com/nitinsharmacs/coffee/main/src/utils/argsParser.js" "https://raw.githubusercontent.com/nitinsharmacs/coffee/main/src/utils/createParser.js" "https://raw.githubusercontent.com/nitinsharmacs/coffee/main/src/utils/optionParsers.js")

function main() {
  if [[ ! -e $COFFEE_REPORTERS ]]; then
    create_coffee_setup
  fi
  store_reporter "$REPORTER_URL"
  store_parser "${PARSERS[@]}"
  store_coffee "$COFFEE_URL"

  echo "Making coffee executable"
  make_coffee_exec

  echo "Setting up the coffee path"
  set_coffee_path

  echo "Installed successfully"
  echo "Happy testing :)"
}

main