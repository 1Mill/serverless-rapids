#!/bin/bash

function run() {
	local DIR=$1
	local VERSION=$2
	local ACTION=$3
	local PAYLOAD="$4"

	source $(dirname $BASH_SOURCE)/$ACTION.$VERSION.bash $DIR "$PAYLOAD"
}

for action in $(echo $3 | tr "," "\n")
do
	run $1 $2 $action "$4"
done
