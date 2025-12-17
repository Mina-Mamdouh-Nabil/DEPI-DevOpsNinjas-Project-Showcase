variable "sg_ids" {
  description = "List of security group IDs"
  type        = list(string)
}

variable "public_subnet_ids" {
  description = "Map of AZs to public subnet objects"
  type        = map(any)
}

variable "private_subnet_ids" {
  description = "Map of AZs to private subnet objects"
  type        = map(any)
}



variable "web_az" {
  description = "Availability Zone for web instance"
  type        = string
  default     = "us-east-1a"
}

variable "app_az" {
  description = "Availability Zone for app instance"
  type        = string
  default     = "us-east-1b"
}

variable "web_ami" {
  description = "AMI for web instance"
  type        = string
  default     = "ami-0cae6d6fe6048ca2c"
}

variable "app_ami" {
  description = "AMI for app instance"
  type        = string
  default     = "ami-0cae6d6fe6048ca2c"
}

variable "web_instance_type" {
  description = "Instance type for web"
  type        = string
  default     = "t2.micro"
}

variable "app_instance_type" {
  description = "Instance type for app"
  type        = string
  default     = "t2.micro"
}



variable "user_data_web" {
  type = string
  default = ""
}
variable "user_data_app" {
  type = string
  default = ""
}
variable "web_instance_count" {
  description = "Number of web EC2 instances"
  type        = number
  default     = 1
}

variable "app_instance_count" {
  description = "Number of app EC2 instances"
  type        = number
  default     = 0
}
