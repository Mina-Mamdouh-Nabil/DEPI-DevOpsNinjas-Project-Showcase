output "vpc-arn" {
  description = "ARN Of VPC"
  value       = aws_vpc.depi-project.arn
}

output "vpc-id" {
  description = "ID Of VPC"
  value       = aws_vpc.depi-project.id
}

output "vpc_name" {
  description = "The name  of the VPC"
  value       = aws_vpc.depi-project.tags["Name"]
}

output "public_subnets" {
  description = "Public Subnets Of the VPC"
  value       = aws_subnet.public_subnets
  
}


output "private_subnets" {
  description = "Private Subnets Of the VPC"
  value       = aws_subnet.private_subnets
  
}
output "private_subnet_ids" {
  description = "Private Subnet IDs of the VPC"
  value       = [for subnet in aws_subnet.private_subnets : subnet.id]
}

output "Internet_Gateway_ID" {
  description = "Internet_Gateway_ID Of the VPC"
  value       = aws_internet_gateway.internet_gateway.id
}
output "Internet_Gateway_arn" {
  description = "Internet_Gateway_arn  Of the VPC"
  value       = aws_internet_gateway.internet_gateway.arn 
}

