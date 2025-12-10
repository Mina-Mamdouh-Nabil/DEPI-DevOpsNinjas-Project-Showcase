# Deploy Jenkins Instance with Terraform

This project provisions a Jenkins server on AWS EC2 using Terraform. It demonstrates best practices such as using a dynamic S3 backend for state management, reusing pre‑built modules, and templating user data for automated Jenkins installation.

---

## 🔧 Features
- **Dynamic S3 Backend**: Remote state stored in S3 with encryption and versioning.
- **Reusable Modules**: Leverages existing modules (e.g. `s3`, `vpc`, `security groups`) for consistency and scalability.
- **Automated Jenkins Setup**: User data script installs Java, adds Jenkins repo, and starts the service.
- **Outputs & Variables**: Clear outputs and variable definitions for portability across environments.

---

## 📂 Project Structure
```
backend.tf              # S3 backend configuration
main.tf                 # Root Terraform configuration
provider.tf             # AWS provider setup
variables.tf            # Input variables
outputs.tf              # Output values
terraform.tfvars        # Variable values
modules/s3/main.tf      # Reusable S3 module
templates/              # User data & helper scripts
src/project_SudoCode.txt# Pseudocode documentation
doc/Project_Topology.png# Architecture diagram
```

---

## 🚀 Usage

### 1. Initialize
```bash
source ./templates/aliases.prep.sh
alias > ./logs/alisaes
ti  #terraform init
terraform validate
tp
taa
```
( Optional - uncommit ) --> This configures the dynamic S3 backend and downloads required providers/modules.

### 2.Troubleshoot Commands 
```bash
# For testing --> td -target=aws_instance.jenkins_instance -auto-approve
# For testing --> ta -target=aws_instance.jenkins_instance -auto-approve
# For testing --> ta -replace=aws_instance.jenkins_instance -auto-approve
#curl http://169.254.169.254/latest/user-data/
#dos2unix templates/jenkins_installation.sh

```

### 3. Access Jenkins
- SSH into the instance and check service:
  ```bash
  systemctl status jenkins
  ```
- Open Jenkins in browser:
  ```
  http://<EC2-Public-IP>:8080
  ```

---

## 🧪 Notes & Issues Solved
- **Jenkins package not found** → Fixed by running `apt update` again after adding the Jenkins repo.
- **User data debugging** → Verified execution via `/var/log/cloud-init-output.log`.
- **Instance recreation** → Used `terraform apply -replace=aws_instance.jenkins_instance` to re-run user data when updated.
