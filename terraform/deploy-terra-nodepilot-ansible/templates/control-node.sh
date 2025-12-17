#!/usr/bin/bash
sudo yum update -y
sudo update-alternatives --config editor
sudo yum install -y git python3
sudo amazon-linux-extras install epel
sudo yum install -y epel-release
sudo amazon-linux-extras enable ansible2
sudo yum install -y ansible
sudo yum install -y vim curl wget unzip

##################

sudo useradd -m admin
# echo 'Passw0rd' | passwd --stdin admin 
echo "admin:Passw0rd" | sudo chpasswd
# Add admin to sudoers (wheel group)
sudo usermod -aG wheel admin
# OR explicitly add to sudoers file:
echo "admin ALL=(ALL) NOPASSWD:ALL" | sudo tee /etc/sudoers.d/admin
sudo chmod 777 /etc/sudoers.d/ #440

# Create admin user with home directory
# Set up SSH for admin
sudo mkdir -p /home/admin/.ssh
sudo cp /home/ec2-user/.ssh/authorized_keys /home/admin/.ssh/
sudo chown -R admin:admin /home/admin/.ssh
sudo chmod 777 /home/admin/.ssh  #700
sudo chmod 777 /home/admin/.ssh/authorized_keys #600


# Restart SSH
sudo systemctl restart sshd


##################
# sudo hostnamectl set-hostname controlnode
sudo hostnamectl set-hostname ControlNode$(hostname | cut -d'-' -f2)
# sudo echo "<managednode1-ip> managednode1" >> /etc/hosts
# sudo echo "<managednode2-ip> managednode2" >> /etc/hosts
################


