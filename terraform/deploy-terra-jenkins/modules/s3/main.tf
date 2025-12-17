variable "bucket_name" {
  description = "Globally unique name for the S3 bucket used for remote state"
  type        = string
  validation {
    condition     = length(var.bucket_name) > 6 && substr(var.bucket_name, 0, 4) == "Jen-"
    error_message = "The S3 Bucket Name must be longer than 10 characters and start with \"dev-\"."
  }
}


variable "dynamodb_table_name" {
  description = "Name of DynamoDB table for state locking"
  type        = string

validation {
    condition     = length(var.dynamodb_table_name) > 6 && substr(var.dynamodb_table_name, 0, 3) == "tf-"
    error_message = "The Dynamo Table Name must be longer than 8 characters and start with \"tf-\"."
  }
}




module "state_bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "5.8.2"

  bucket                   = var.bucket_name
  
  control_object_ownership = true
  object_ownership         = "BucketOwnerPreferred"

  versioning = {
    enabled = false
  }

  server_side_encryption_configuration = {
    rule = {
      apply_server_side_encryption_by_default = {
        sse_algorithm = "AES256"
      }
    }
  }

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
  
}

resource "aws_dynamodb_table" "tf_locks" {
  name         = var.dynamodb_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

    lifecycle {
    #prevent_destroy = true   # ✅ protects DynamoDB table from terraform destroy
  }
}




output "bucket_name" {
  description = "Name of the S3 bucket created"
  value       = module.state_bucket.s3_bucket_id
}

output "dynamodb_table_name" {
  description = "Name of the DynamoDB table created"
  value       = aws_dynamodb_table.tf_locks.name
}
