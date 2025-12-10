#!/usr/bin/bash
sudo yum update -y
sudo yum install -y python3
sudo yum install -y vim curl wget unzip

sudo update-alternatives --config editor
sudo hostnamectl set-hostname managednode$(hostname | cut -d'-' -f2)
echo 'Passw0rd' | passwd --stdin ec2-user
sudo useradd -m admin
echo "admin:Passw0rd" | sudo chpasswd

#################
sudo mkdir -p /home/admin/.ssh
sudo cp /home/ec2-user/.ssh/authorized_keys /home/admin/.ssh/
sudo chown -R admin:admin /home/admin/.ssh

sudo chmod 777 /home/admin/.ssh  #700
sudo chmod 777 /home/admin/.ssh/authorized_keys #600

############
sudo sed -i 's/^PasswordAuthentication no$/PasswordAuthentication yes/' 
/etc/ssh/sshd_config
sudo sed -i 's/^#PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart sshd.service
############







