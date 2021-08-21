#!/bin/bash

function setup () {
	local DIR=$1

	local dirs=$(
		find $DIR \
		-name config.bash \
		-not -path *node_modules* \
		-not -path *terraform* \
		-type f \
		-print0 | xargs -0 -n1 dirname
	)

	for dir in $dirs
	do
		source $(dirname $BASH_SOURCE)/build.0.bash $dir &
		source $(dirname $BASH_SOURCE)/publish.0.bash $dir
		wait
	done
}

setup $1
