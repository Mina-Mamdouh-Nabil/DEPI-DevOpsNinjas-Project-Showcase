####S3 Backend

# output "bucket_name" {
#   description = "Name of the S3 bucket created"
#   value       = module.remote_state.bucket_name
# }
# 
# output "dynamodb_table_name" {
#   description = "Name of the DynamoDB table created"
#   value       = module.remote_state.dynamodb_table_name
# }



#####VPC
output "vpc_id" {
  description = "ID of the VPC from the module"
  value       = module.graduation_project_vpc.vpc-id
}

output "vpc_arn" {
  description = "ARN of the VPC from the module"
  value       = module.graduation_project_vpc.vpc-arn
}

output "vpc_name" {
  description = "Name of the VPC from the module"
  value       = module.graduation_project_vpc.vpc_name
}

output "public_subnets" {
  description = "Public subnets from the module"
  value       = module.graduation_project_vpc.public_subnets
}

output "private_subnets" {
  description = "Private subnets from the module"
  value       = module.graduation_project_vpc.private_subnets
}

output "internet_gateway_id" {
  description = "Internet Gateway ID from the module"
  value       = module.graduation_project_vpc.Internet_Gateway_ID
}

output "internet_gateway_arn" {
  description = "Internet Gateway ARN from the module"
  value       = module.graduation_project_vpc.Internet_Gateway_arn
}


###SG
output "websg_id" {
  description = "The ID of the WebSG security group"
  value       = module.graduation_project_sg.websg_id
}

output "websg_arn" {
  description = "The ARN of the WebSG security group"
  value       = module.graduation_project_sg.websg_id
}

output "websg_name" {
  description = "The name of the WebSG security group"
  value       = module.graduation_project_sg.websg_name
}

output "websg_vpc_id" {
  description = "The VPC ID where WebSG is applied"
  value       = module.graduation_project_sg.websg_vpc_id
}

output "websg_ingress_rules" {
  description = "Ingress rules applied to WebSG"
  value       = module.graduation_project_sg.websg_ingress_rules
}

output "websg_egress_rules" {
  description = "Egress rules applied to WebSG"
  value       = module.graduation_project_sg.websg_egress_rules
}





# DB
# Show the RDS instance ID
output "db_instance_id" {
  description = "ID of the RDS instance"
  value       = module.graduation_project_db.db_instance_id
}

# Show the RDS endpoint (hostname to connect from web/app)
output "db_instance_endpoint" {
  description = "Connection endpoint for the RDS instance"
  value       = module.graduation_project_db.db_instance_endpoint
}

# Show the DB subnet group name
output "db_subnet_group_name" {
  description = "Name of the DB subnet group"
  value       = module.graduation_project_db.db_subnet_group_name
}

# Show the DB security group ID
output "db_security_group_id" {
  description = "Security group ID for the DB"
  value       = module.graduation_project_db.db_security_group_id
}
