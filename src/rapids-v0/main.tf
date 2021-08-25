terraform {
	required_version = "~> 1.0"

	required_providers {
		aws = {
			source = "hashicorp/aws"
			version = "~> 3.55"
		}
	}
}

provider "aws" { region = "us-east-1" }

module "hydrator-lambda" { source = "./hydrator" }
module "websockets-lambda" { source = "./websockets" }
