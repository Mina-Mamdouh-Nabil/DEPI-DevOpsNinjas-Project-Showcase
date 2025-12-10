# # backend/bootstrap.tf
# module "remote_state" {
#   source = "./modules/s3"
#   bucket_name         ="Jen-tf-backend-718170779365"
#   dynamodb_table_name = "tf-HelloLock"
# }

# # terraform apply -target=module.remote_state
# 
# ## Remove This Section untill you create the bucket then add it and init again 
# terraform {
#   backend "s3" {
#     bucket         = "dev-tf-backend-718170779365"          # paste the actual bucket name created
#     key            = "us-east-1/terraform.tfstate"
#     region         = "us-east-1"
#     dynamodb_table = "tf-HelloLock"
#     encrypt        = true
#   }
# }
