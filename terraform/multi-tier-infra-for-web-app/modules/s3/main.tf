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
  tags = var.tags

  
}

resource "aws_dynamodb_table" "tf_locks" {
  name         = var.dynamodb_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  tags = var.tags
    lifecycle {
    #prevent_destroy = true   # ✅ protects DynamoDB table from terraform destroy
  }
}


