
COFFEE_REPORTERS=~/.coffee/reporters

function create_coffee_dir() {
  mkdir -p COFFEE_REPORTERS
}

function download_file() {
  local file_location=$1
  echo "Downloading..."
  curl -# $file_location
}

function store_reporter() {
  local reporter_location=$1
  local reporter=$(download_file "$reporter_location")
  echo "$reporter" > COFFEE_REPORTERS/reporter.js
}