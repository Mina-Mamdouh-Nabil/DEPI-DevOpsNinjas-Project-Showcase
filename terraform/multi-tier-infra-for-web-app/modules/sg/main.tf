
# 11- Craete Security group for EC2 Instances
resource "aws_security_group" "WebSG" {
  name   = "WebSG"
  description = "Allow Student Ports"
  vpc_id =var.vpc_id_where_sg_applyed
  
  dynamic "ingress" {
    for_each = var.allowed_ports
    iterator = port
    content {
      from_port   = port.value
      to_port     = port.value
      protocol    = var.protocol
    # cidr_blocks = [var.my_ip]
      cidr_blocks = ["0.0.0.0/0"]
    }
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = var.protocol
    cidr_blocks = ["0.0.0.0/0"]
    # cidr_blocks = [var.my_ip]
  }
}


