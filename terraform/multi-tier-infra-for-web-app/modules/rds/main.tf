
# 21- Database subnet group
# Database subnet group

resource "aws_db_subnet_group" "db_subnet" {
  name       = var.db_subnet_group_name
  subnet_ids = var.private_subnet_ids
    tags = {
    Name = var.db_subnet_group_name
  }
}


# 22- Database Security Group
resource "aws_security_group" "db_sg" {
  name        = "db-sg"
  description = "Security group for RDS database"
  vpc_id      = var.vpc_id

  # Allow traffic from the Web SG (frontend instances)
  ingress {
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [var.web_sg_id]
  }

  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 23- Database Instance
resource "aws_db_instance" "rds_instance" {
  allocated_storage      = var.db_allocated_storage
  identifier             = var.db_identifier
  storage_type           = var.db_storage_type
  engine                 = var.db_engine
  engine_version         = var.db_engine_version
  instance_class         = var.db_instance_class
  db_name                = var.db_name
  username               = var.db_username
  password               = var.db_password
  publicly_accessible    = false
  skip_final_snapshot    = true
  db_subnet_group_name   = aws_db_subnet_group.db_subnet.name
  vpc_security_group_ids = [aws_security_group.db_sg.id]

  tags = {
    Name = var.db_identifier
  }
}