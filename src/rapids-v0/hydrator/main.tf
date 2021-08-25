terraform {
	required_providers {
		local = {
			source = "hashicorp/local"
			version = "~> 2.1"
		}
	}
}

module "config" {
	source  = "click-flow/file-content-to-object/local"
	version = "0.0.2"

	filename = "${path.module}/config.bash"
}

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
		INVOKE_AWS_ACCESS_KEY_ID: "TODO"
		INVOKE_AWS_REGION: "us-east-1"
		INVOKE_AWS_SECRET_ACCESS_KEY: "TODO"
		NODE_ENV: "production"
	}
	create_package = false
	function_name = module.config.variables.FUNCTION_NAME
	image_uri = module.docker-image.image_uri
	package_type = "Image"
	timeout = module.config.variables.TIMEOUT
}
