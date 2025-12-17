variable "allowed_ports" {
  type    = list(any)
  default = ["22", "80", "443"]
}

variable "vpc_id_where_sg_applyed" {
  type        = string
  description = "The VPC ID where SG will be created"
  
}

variable "protocol" {
	type = string
  default = "tcp"
}
# variable "my_ip" {
#   description = "Your public IPv4 address"
#   type        = string
# }