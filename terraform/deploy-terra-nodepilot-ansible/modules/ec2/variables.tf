variable "controlNodeCount" {
  description = "Number of web EC2 instances"
  type        = number
  default     = 1
}

variable "managedNode_count" {
  description = "Number of app EC2 instances"
  type        = number
  default     = 1
}


#==================================

variable "control_node_ami" {
  description = "AMI for web instance"
  type        = string
  default     = "ami-0cae6d6fe6048ca2c"
}

variable "managed_node_ami" {
  description = "AMI for app instance"
  type        = string
  default     = "ami-0cae6d6fe6048ca2c"
}
#==============================
variable "controlNode_instance_type" {
  description = "Instance type for web"
  type        = string
  default     = "t2.micro"
}

variable "managed_node_instance_type" {
  description = "Instance type for app"
  type        = string
  default     = "t2.micro"
}
#===========================


variable "control_node_user_data" {
  type = string
  default = ""
}
variable "managed_node_data_app" {
  type = string
  default = ""
}


#=============

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

#=======================

variable "controlNode_az" {
  description = "Availability Zone for web instance"
  type        = string
  default     = "us-east-1a"
}

variable "maanged_node_az" {
  description = "Availability Zone for app instance"
  type        = string
  default     = "us-east-1b"
}

#==========================
