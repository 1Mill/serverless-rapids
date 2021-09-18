#!/bin/bash

FUNCTION_NAME=rapids-v0-websockets
TIMEOUT=7
VERSION=2021-09-03T12-20-00

DEV_ENVIRONMENT="{
	1MILL_JOURNAL_NAME=development,
	1MILL_JOURNAL_TABLE=journal.$FUNCTION_NAME.v0,
	1MILL_JOURNAL_TYPE=mongodb,
	1MILL_JOURNAL_URI=mongodb://root:password@mongo-able:27017/,
	ABLY_API_KEY=$ABLY_API_KEY,
	NODE_ENV=development,
}"
