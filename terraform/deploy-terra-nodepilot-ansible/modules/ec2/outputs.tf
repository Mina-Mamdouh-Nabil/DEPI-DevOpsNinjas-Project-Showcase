# ===========================
# outputs.tf
# ===========================

# Key Pair Outputs
output "key_pair_name" {
  description = "Name of the generated AWS key pair"
  value       = aws_key_pair.generated.key_name
}

output "private_key_pem" {
  description = "Private key PEM (use carefully, sensitive)"
  value       = tls_private_key.rsa_4096.private_key_pem
  sensitive   = true
}

# Control Node Outputs
output "controlNode_ids" {
  description = "IDs of all control node instances"
  value       = aws_instance.controlNode[*].id
}

output "controlNode_public_ips" {
  description = "Public IPs of control node instances"
  value       = aws_instance.controlNode[*].public_ip
}

output "controlNode_private_ips" {
  description = "Private IPs of control node instances"
  value       = aws_instance.controlNode[*].private_ip
}

output "controlNode_tags" {
  description = "Tags applied to control node instances"
  value       = aws_instance.controlNode[*].tags
}

# Managed Node Outputs
output "managedNode_ids" {
  description = "IDs of all managed node instances"
  value       = aws_instance.managedNode[*].id
}

output "managedNode_private_ips" {
  description = "Private IPs of managed node instances"
  value       = aws_instance.managedNode[*].private_ip
}

output "managedNode_tags" {
  description = "Tags applied to managed node instances"
  value       = aws_instance.managedNode[*].tags
}

# Workspace Context
output "workspace_name" {
  description = "Current Terraform workspace name"
  value       = terraform.workspace
}
