terraform {
	required_providers {
		sops = {
			source = "carlpett/sops"
			version = "~> 0.6.3"
		}
	}
}

data "sops_file" "secrets" { source_file = "${path.module}/secrets.sops.json" }
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
		"1MILL_JOURNAL_NAME" = "todo"
		"1MILL_JOURNAL_TABLE" = "todo"
		"1MILL_JOURNAL_TYPE" = "todo"
		"1MILL_JOURNAL_URI" = "todo"
		"ABLY_API_KEY" = data.sops_file.secrets.data["ABLY_API_KEY"]
		"NODE_ENV" = "production"
	}
	create_package = false
	function_name = module.config.variables.FUNCTION_NAME
	image_uri = module.docker-image.image_uri
	package_type = "Image"
	timeout = module.config.variables.TIMEOUT
}
