output "db_instance_id" {
  description = "ID of the RDS instance"
  value       = aws_db_instance.rds_instance.id
}

output "db_instance_endpoint" {
  description = "Connection endpoint for the RDS instance"
  value       = aws_db_instance.rds_instance.endpoint
}

output "db_subnet_group_name" {
  description = "Name of the DB subnet group"
  value       = aws_db_subnet_group.db_subnet.name
}

output "db_security_group_id" {
  description = "Security group ID for the DB"
  value       = aws_security_group.db_sg.id
}
