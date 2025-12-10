#!/usr/bin/bash
# Create working directory
cd ~
mkdir -p jen
cd jen
# Update system and install Java
sudo apt update && sudo apt upgrade -y
sudo apt install -y fontconfig openjdk-21-jre
# Add Jenkins repository key (new method)
sudo mkdir -p /etc/apt/keyrings
sudo wget -q -O /etc/apt/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
# Add Jenkins repository
echo "deb [signed-by=/etc/apt/keyrings/jenkins-keyring.asc] \
https://pkg.jenkins.io/debian-stable binary/" | \
sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
# Update and install Jenkins
#very fucking important to give it another fucking sudo apt update %^%^%^%^%^% 
sudo apt update

# The reason you needed that extra apt update is subtle but important:
# When you first run apt update, your system only knows about the default Ubuntu repositories.
# After you add the Jenkins repository (/etc/apt/sources.list.d/jenkins.list), the package manager doesn’t automatically refresh its index.
# Without refreshing, apt has no idea that “jenkins” is available from the new repo → hence the dreaded “no installation candidate”.
# Running apt update again tells your system: “Hey, there’s a new repo, go fetch its package list.” Only then does apt install jenkins succeed.
# Think of it like updating a library catalog: you added a new shelf (Jenkins repo), but until you rescan the catalog (apt update), the librarian doesn’t know those books exist.

sudo apt install -y jenkins
# Enable and start Jenkins service
sudo systemctl enable jenkins
sudo systemctl start jenkins
# Save Jenkins service status
cd ..
# Save Java version info
java -version >> jen.txt 2>&1
sudo systemctl status jenkins >> status.txt
sudo cat /var/log/cloud-init-output.log 
sudo mv /var/log/cloud-init-output.log .
curl -I http://localhost:8080 >> status.txt

