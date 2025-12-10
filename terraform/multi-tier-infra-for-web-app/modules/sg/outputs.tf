output "websg_id" {
  description = "The ID of the WebSG security group"
  value       = aws_security_group.WebSG.id
}

output "websg_arn" {
  description = "The ARN of the WebSG security group"
  value       = aws_security_group.WebSG.arn
}

output "websg_name" {
  description = "The name of the WebSG security group"
  value       = aws_security_group.WebSG.name
}

output "websg_vpc_id" {
  description = "The VPC ID where WebSG is applied"
  value       = aws_security_group.WebSG.vpc_id
}

output "websg_ingress_rules" {
  description = "Ingress rules applied to WebSG"
  value       = aws_security_group.WebSG.ingress
}

output "websg_egress_rules" {
  description = "Egress rules applied to WebSG"
  value       = aws_security_group.WebSG.egress
}
