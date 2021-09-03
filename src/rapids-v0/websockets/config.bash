#!/bin/bash

FUNCTION_NAME=rapids-v0-websockets
TIMEOUT=7
VERSION=2021-09-03T12-20-00

DEV_ENVIRONMENT="{
	ABLY_API_KEY=$ABLY_API_KEY,
	JOURNAL_DB_NAME=development,
	JOURNAL_DB_URI=mongodb://root:password@mongo-able:27017/,
	JOURNAL_TABLE_NAME=journal.$FUNCTION_NAME.v0,
	NODE_ENV=development,
}"
