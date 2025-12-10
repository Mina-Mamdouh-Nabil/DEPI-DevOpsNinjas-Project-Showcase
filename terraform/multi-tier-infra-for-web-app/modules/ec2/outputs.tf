output "web_instance_ids" {
  description = "IDs of all web instances"
  value       = [for w in aws_instance.web : w.id]
}

output "app_instance_ids" {
  description = "IDs of all app instances"
  value       = [for a in aws_instance.app : a.id]
}

output "web_instance_public_ips" {
  description = "Public IPs of all web instances"
  value       = [for w in aws_instance.web : w.public_ip]
}

output "app_instance_private_ips" {
  description = "Private IPs of all app instances"
  value       = [for a in aws_instance.app : a.private_ip]
}


output "key_pair_name" {
  description = "Name of the generated key pair"
  value       = aws_key_pair.generated.key_name
}

output "public_key_openssh" {
  description = "Public key in OpenSSH format"
  value       = tls_private_key.rsa_4096.public_key_openssh
}

output "private_key_pem" {
  description = "Private key in PEM format"
  value       = tls_private_key.rsa_4096.private_key_pem
  sensitive   = true
}

output "web_instance_ids_map" {
  description = "Map of web instance IDs keyed by index"
  value       = { for idx, inst in aws_instance.web : idx => inst.id }
}