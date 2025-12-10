provider "aws" {
  # Configuration options
#   shared_config_files=["./providers/aws/aws_shared_config_files/conf"]
#   shared_credentials_files =["./providers/aws/aws_shared_config_files/creds"]
#   profile                  ="alhusainy"
	
default_tags {
    tags = {
      Project = "nodepilot-ansible"
      Owner   = "Ahmed Tarek Alhusainy"
    }
}
}