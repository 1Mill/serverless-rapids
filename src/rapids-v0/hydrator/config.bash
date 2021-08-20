#!/bin/bash

FUNCTION_NAME=rapids-v0-hydrator
TIMEOUT=3

DEV_ENVIRONMENT="{
	AWS_ACCESS_KEY_ID=string-exists-for-development,
	AWS_ENDPOINT: http://localstack:4566/,
	AWS_REGION=us-east-1,
	AWS_SECRET_ACCESS_KEY=string-exists-for-development,
}"
