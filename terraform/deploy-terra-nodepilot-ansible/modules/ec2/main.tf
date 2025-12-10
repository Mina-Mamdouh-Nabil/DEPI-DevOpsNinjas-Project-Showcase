# Generate RSA key pair
resource "tls_private_key" "rsa_4096" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "generated" {
  key_name   = "key-${terraform.workspace}-env"
  public_key = tls_private_key.rsa_4096.public_key_openssh

  tags = {
    Workspace = terraform.workspace
  }
}


# Web Instance in Public Subnet

resource "aws_instance" "controlNode" {
  count                  = var.controlNodeCount
  ami                    = var.control_node_ami
  instance_type          = var.controlNode_instance_type
  key_name               = aws_key_pair.generated.key_name
  availability_zone      = var.controlNode_az
  vpc_security_group_ids = var.sg_ids
  subnet_id              = var.public_subnet_ids[var.controlNode_az].id
  user_data              = var.control_node_user_data
  root_block_device {
    encrypted = true
  }


  tags = {
    Name      = "ControlNode_${count.index}"
  }
provisioner "local-exec" {
  command = <<EOT
    echo "App instance ${self.tags["Name"]} (${self.id}) created :
    Private IP: ${self.private_ip} ==> ${self.private_dns}
    Public IP: ${self.public_ip} ==> ${self.public_dns}" >> ./logs/creation.log
  EOT
}


  provisioner "remote-exec" {
    inline = [
      "sudo hostnamectl set-hostname controlNode-${count.index}",
      "sudo mkdir -p /opt/app/logs",
      "echo 'Web instance ${count.index} started at $(date)' | sudo tee /opt/app/logs/startup.log",
	  "sudo hostnamectl set-hostname controlNode-${count.index}"


    ]
  }

  connection {
    type        = "ssh"
    user        = "ec2-user"
    private_key = tls_private_key.rsa_4096.private_key_pem
    host        = self.public_ip
  }
}




# App Instance in Private Subnet
resource "aws_instance" "managedNode" {
  count                  = var.managedNode_count
  ami                    = var.managed_node_ami
  instance_type          = var.managed_node_instance_type
  key_name               = aws_key_pair.generated.key_name
  availability_zone      = var.maanged_node_az
  vpc_security_group_ids = var.sg_ids
  subnet_id              = var.private_subnet_ids[var.maanged_node_az].id
  user_data              = var.managed_node_data_app
  root_block_device {
    encrypted = true
  }

  tags = {
    Name      = "ManagedNode_${count.index}"
  }

provisioner "local-exec" {
  command = <<EOT
    echo "App instance ${self.tags["Name"]} (${self.id}) created :
    Private IP: ${self.private_ip} ==> ${self.private_dns}
    Public IP: ${self.public_ip} ==> ${self.public_dns}" >> ./logs/creation.log
  EOT
}



  provisioner "remote-exec" {
    inline = [
      "cd ~",
      "ping -c 10 google.com | tee ~/Hello2.txt",
	  "sudo hostnamectl set-hostname ManagedNode-${count.index}"

    ]
  }

  #   connection {
  #     type         = "ssh"
  #     user         = "ec2-user"
  #     private_key  = tls_private_key.rsa_4096.private_key_pem
  #     host         = self.private_ip
  #     bastion_host = aws_instance.web[count.index].public_ip   # ✅ app[i] uses web[i]
  #     bastion_user = "ec2-user"
  #   }

  connection {
    type         = "ssh"
    user         = "ec2-user"
    private_key  = tls_private_key.rsa_4096.private_key_pem
    host         = self.private_ip
    bastion_host = element(aws_instance.controlNode[*].public_ip, count.index)  # ✅ always use first web instance
    bastion_user = "ec2-user"
  }

}
