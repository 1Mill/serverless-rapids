#!/bin/bash

function run() {
	local DIR=$1
	local VERSION=$2
	local ACTION=$3

	local FILE=$(dirname $BASH_SOURCE)/docker-compose.$VERSION.yml
	local TERRAFORM_VERSION=1.0.5

	DIR=$(pwd)/$1 \
	TERRAFORM_VERSION=$TERRAFORM_VERSION \
	docker-compose -f $FILE run terraform $ACTION
}

run $1 $2 $3
