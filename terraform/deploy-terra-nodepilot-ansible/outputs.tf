

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


output "websg_ingress_rules" {
  description = "Ingress rules applied to WebSG"
  value       = module.graduation_project_sg.websg_ingress_rules
}

output "websg_egress_rules" {
  description = "Egress rules applied to WebSG"
  value       = module.graduation_project_sg.websg_egress_rules
}

