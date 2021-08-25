#!/bin/bash

function run() {
	local DIR=$1
	local VERSION=$2
	local ACTION=$3

	source $(dirname $BASH_SOURCE)/constants.0.bash

	local CONFIG_FILE_PATH=$(pwd)/$DIR/$CONFIG_FILENAME
	source $CONFIG_FILE_PATH

	local FILE=$(dirname $BASH_SOURCE)/docker-compose.$VERSION.yml
	local TERRAFORM_VERSION=$TERRAFORM_VERSION

	DIR=$(pwd)/$1 \
	TERRAFORM_VERSION=$TERRAFORM_VERSION \
	docker-compose -f $FILE run terraform $ACTION
}

run $1 $2 $3
