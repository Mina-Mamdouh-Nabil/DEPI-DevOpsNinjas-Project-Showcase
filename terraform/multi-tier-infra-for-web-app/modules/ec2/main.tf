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

resource "aws_instance" "web" {
  count                  = var.web_instance_count
  ami                    = var.web_ami
  instance_type          = var.web_instance_type
  key_name               = aws_key_pair.generated.key_name
  availability_zone      = var.web_az
  vpc_security_group_ids = var.sg_ids
  subnet_id              = var.public_subnet_ids[var.web_az].id
  user_data              = var.user_data_web
  root_block_device {
    encrypted = true
  }


  tags = {
    Name      = "web_instance_${count.index}_${terraform.workspace}"
    Workspace = terraform.workspace
  }

  provisioner "remote-exec" {
    inline = [
      "sudo hostnamectl set-hostname ${terraform.workspace}-web-${count.index}",
      "sudo mkdir -p /opt/app/logs",
      "echo 'Web instance ${count.index} started in ${terraform.workspace} at $$(date)' | sudo tee /opt/app/logs/startup.log"
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
resource "aws_instance" "app" {
  count                  = var.app_instance_count
  ami                    = var.app_ami
  instance_type          = var.app_instance_type
  key_name               = aws_key_pair.generated.key_name
  availability_zone      = var.app_az
  vpc_security_group_ids = var.sg_ids
  subnet_id              = var.private_subnet_ids[var.app_az].id
  user_data              = var.user_data_app
  root_block_device {
    encrypted = true
  }

  tags = {
    Name      = "app_instance_${count.index}"
    Workspace = terraform.workspace
  }

  provisioner "local-exec" {
    command = "echo App instance ${self.id} created in workspace ${terraform.workspace} >> ./logs/creation.log"
  }

  provisioner "remote-exec" {
    inline = [
      "cd ~",
      "ping -c 10 google.com | tee ~/Hello2.txt"
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
    bastion_host = aws_instance.web[0].public_ip # ✅ always use first web instance
    bastion_user = "ec2-user"
  }

}
