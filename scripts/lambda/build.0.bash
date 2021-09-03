#!/bin/bash

function build() {
	source $(dirname $BASH_SOURCE)/constants.0.bash

	local CONFIG_FILE_PATH=$(pwd)/$1/$CONFIG_FILENAME
	source $CONFIG_FILE_PATH

	local FUNCTION_NAME=$FUNCTION_NAME

	docker build --tag $FUNCTION_NAME $DIR
}

build $1
