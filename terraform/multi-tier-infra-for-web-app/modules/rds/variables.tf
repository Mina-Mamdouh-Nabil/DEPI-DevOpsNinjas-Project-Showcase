variable "db_subnet_group_name" {
  description = "Name of the DB subnet group"
  type        = string
  default     = "rds-db-subnet"
}

variable "private_subnet_ids" {
  description = "List of private subnet IDs"
  type        = list(string)
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "web_sg_id" {
  description = "Security group ID of web instances"
  type        = string
}

variable "db_allocated_storage" {
  description = "Allocated storage size in GB"
  type        = number
  default     = 20
}

variable "db_identifier" {
  description = "Identifier for the DB instance"
  type        = string
  default     = "rds-terraform"
}

variable "db_storage_type" {
  description = "Storage type for the DB instance"
  type        = string
  default     = "gp2"
}

variable "db_engine" {
  description = "Database engine"
  type        = string
  default     = "mysql"
}

variable "db_engine_version" {
  description = "Database engine version"
  type        = string
  default     = "8.0"
}

variable "db_instance_class" {
  description = "Instance class for DB"
  type        = string
  default     = "db.t3.micro"
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "project_rds"
}

variable "db_username" {
  description = "Master username"
  type        = string
  default     = "sa"
}

variable "db_password" {
  description = "Master password"
  type        = string
  default     = "Passw0rd"
}
