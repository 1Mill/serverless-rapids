terraform {
	required_providers {
		sops = {
			source = "carlpett/sops"
			version = "~> 0.6.3"
		}
	}
}

module "config" {
	source  = "click-flow/file-content-to-object/local"
	version = "0.0.2"

	filename = "${path.module}/config.bash"
}

data "sops_file" "secrets" { source_file = "${path.module}/secrets.sops.json" }
module "docker-image" {
	source = "terraform-aws-modules/lambda/aws//modules/docker-build"

	create_ecr_repo = true
	ecr_repo = module.config.variables.FUNCTION_NAME
	image_tag = module.config.variables.VERSION
	source_path = abspath(path.module)
}
module "lambda" {
	source = "terraform-aws-modules/lambda/aws"
	version = "~> 2.11"

	environment_variables = {
		"1MILL_LAMBDA_AWS_ACCESS_KEY_ID" = data.sops_file.secrets.data["INVOKE_AWS_ACCESS_KEY_ID"]
		"1MILL_LAMBDA_AWS_REGION" = "us-east-1"
		"1MILL_LAMBDA_AWS_SECRET_ACCESS_KEY" = data.sops_file.secrets.data["INVOKE_AWS_SECRET_ACCESS_KEY"]
		"NODE_ENV" = "production"
	}
	create_package = false
	function_name = module.config.variables.FUNCTION_NAME
	image_uri = module.docker-image.image_uri
	package_type = "Image"
	timeout = module.config.variables.TIMEOUT
}
