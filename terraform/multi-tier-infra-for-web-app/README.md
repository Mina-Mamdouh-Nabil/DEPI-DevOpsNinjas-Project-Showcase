# Multi‑Tier Web Application Infrastructure with Terraform

## 📖 Overview
This project provisions a **multi‑tier infrastructure** on AWS using Terraform.  
It includes:
- **Networking layer (VPC, subnets, IGW, NAT)**
- **Load Balancer (ALB)**
- **Web/App tier (EC2 instances in Auto Scaling Group)**
- **Database tier (Amazon RDS MySQL in private subnets)**

The design follows best practices:
- Public subnets for load balancer and bastion access
- Private subnets for application servers and database
- Security groups enforcing least‑privilege communication
- Modular Terraform code for scalability and reusability

---

## 🏗️ Architecture
```
Internet
   │
[ Application Load Balancer ]
   │
   ▼
[ Web/App EC2 Instances ]  <-- Auto Scaling Group
   │
   ▼
[ RDS MySQL Database ]     <-- Private Subnets
```

- **VPC**: Custom VPC with public and private subnets across multiple AZs  
- **ALB**: Distributes traffic to EC2 instances in private subnets  
- **EC2**: Web/App tier, scalable via Auto Scaling Group  
- **RDS**: MySQL database in private subnets, accessible only from Web/App SG  

---

## 📂 Project Structure
```
.
├── main.tf                # Root module wiring all components
├── variables.tf           # Root input variables
├── outputs.tf             # Root outputs
├── version.tf             
├── backend.tf             # S3 backend
├── provider.tf             
├── src						#main source code before modules - ready to run              
├── templates				# EC2 User Data Scripts , others              
├── Valut					# EC2 User Data Scripts , others              
├── modules/
│   ├── vpc/               # VPC, subnets, IGW, NAT
│   ├── sg/                # Security groups
│   ├── alb/               # Application Load Balancer
│   ├── web/               # EC2 + Auto Scaling
│   └── rds/               # RDS subnet group, SG, DB instance
```

---

## ⚙️ Usage

### 1. Initialize Terraform
```bash
terraform init
source ./templates/aliases.prep.sh
alias
```


### 2. Validate configuration
```bash
terraform validate
```

### 3. Plan deployment
```bash
terraform plan
```

### 4. Apply deployment
```bash
terraform apply
```

---

## 📤 Outputs
After `terraform apply`, you’ll see:
- `vpc_id` – VPC ID
- `public_subnets` / `private_subnets` – Subnet IDs
- `internet_gateway_id` – IGW ID
- `web_sg_id` – Web/App Security Group ID
- `db_instance_endpoint` – RDS connection endpoint
- `db_security_group_id` – RDS SG ID
- `alb_dns_name` – Load Balancer DNS name

---

## 🔐 Security Model
- **ALB SG**: Allows inbound HTTP/HTTPS from the internet  
- **Web/App SG**: Allows inbound from ALB SG, outbound to DB SG  
- **DB SG**: Allows inbound MySQL (3306) only from Web/App SG  
- **No public access** to RDS  

---

## 🧪 Testing
1. SSH into a web EC2 instance (via bastion or public subnet if configured).  
2. Verify ALB DNS name responds to HTTP requests.  
3. Connect from EC2 to RDS:
   ```bash
   mysql -h <db_instance_endpoint> -u <db_username> -p
   ```
4. Run test queries to confirm DB connectivity.

---

## 📌 Notes
- Default DB engine: MySQL 8.0.43 (updateable via variable).  
- Credentials (`db_username`, `db_password`) are set via variables — rotate securely.  
- Infrastructure is modular: each layer can be reused or extended independently.  

---

## 🚀 Next Steps
- Add **parameter groups** for DB tuning.  
- Integrate **CloudWatch monitoring** and alarms.  
- Add **bastion host module** for secure admin access.  
- Extend with **CI/CD pipeline** for automated deployments.

---