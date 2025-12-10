
variable "bucket_name" {
  description = "Globally unique name for the S3 bucket used for remote state"
  type        = string
  validation {
    condition     = length(var.bucket_name) > 6 && substr(var.bucket_name, 0, 4) == "dev-"
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

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default = {
    Project = "aws-multitier"
    Purpose = "terraform-remote-state"
    Owner   = "Ahmed Alhusainy"
  }
}
