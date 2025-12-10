

output "bucket_name" {
  description = "Name of the S3 bucket created"
  value       = module.state_bucket.s3_bucket_id
}

output "dynamodb_table_name" {
  description = "Name of the DynamoDB table created"
  value       = aws_dynamodb_table.tf_locks.name
}
