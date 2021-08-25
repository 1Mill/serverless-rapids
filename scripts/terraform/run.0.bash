#!/bin/bash

function run() {
	local DIR=$1
	local VERSION=$2
	local ACTION=$3

	source $(dirname $BASH_SOURCE)/constants.0.bash

	local CONFIG_FILE_PATH=$(pwd)/$DIR/$CONFIG_FILENAME
	source $CONFIG_FILE_PATH

	# * Check for .env file in project root for credentials
	local ENV_FILE_PATH=$(dirname $BASH_SOURCE)/../../.env
	if [ -f "$ENV_FILE_PATH" ]; then
		source $ENV_FILE_PATH
	fi

	local AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
	local AWS_DEFAULT_REGION=us-east-1
	local AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
	local FILE=$(dirname $BASH_SOURCE)/docker-compose.$VERSION.yml
	local TERRAFORM_VERSION=$TERRAFORM_VERSION

	AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
	AWS_DEFAULT_REGION=$AWS_DEFAULT_REGION \
	AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
	DIR=$(pwd)/$1 \
	TERRAFORM_VERSION=$TERRAFORM_VERSION \
	docker-compose -f $FILE run terraform $ACTION
}

run $1 $2 $3
