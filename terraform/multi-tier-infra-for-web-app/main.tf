# terraform apply -target=module.remote_state
module "graduation_project_vpc" {
  source     = "./modules/vpc"
  vpc_cidr   = "10.0.0.0/16"
  vpc_name   = " DEPI - Graduation - Project"
  aws_region = "us-east-1"
  public_subnets = {
    "us-east-1a" = 20
    "us-east-1b" = 30
    "us-east-1c" = 40
  }

  private_subnets = {
    "us-east-1a" = 50
    "us-east-1b" = 60
  }


}

module "graduation_project_sg" {
  source                  = "./modules/sg"
  vpc_id_where_sg_applyed = module.graduation_project_vpc.vpc-id
  allowed_ports           = ["0"]
  protocol                = "-1"

}

# EC2 Module (workspace aware)
module "graduation_project_ec2" {
  source = "./modules/ec2"
  # Networking references
  web_instance_count = 1
  app_instance_count = 1


  # Availability zones
  web_az = "us-east-1a"
  app_az = "us-east-1b"
  #Subnet /SG Selection  
  sg_ids             = [module.graduation_project_sg.websg_id]
  public_subnet_ids  = module.graduation_project_vpc.public_subnets  # ✅ web in public subnet
  private_subnet_ids = module.graduation_project_vpc.private_subnets # ✅ app in private subnet

  user_data_web = file("${path.module}/templates/ec2-user-data.sh")


}












# LB 


/*
vault version
vault server -dev
export VAULT_ADDR="http://.:8200"  >>>>>> linux or MAC
set VAULT_ADDR="http://.:8200"  >>>>>> windows CMD
vault login <root token>
vault kv put /secret/app phone_number=867-5309
*/


#Vaulttaa
provider "vault" {
  address = "http://.:8200"
  token   = ""
}

# Read both DB credentials from one Vault path
data "vault_generic_secret" "db_creds" {
  path = "secret/db_credentials"
}

# Optional outputs for debugging
output "db_username" {
  value     = data.vault_generic_secret.db_creds.data["user"]
  sensitive = true
}

output "db_password" {
  value     = data.vault_generic_secret.db_creds.data["password"]
  sensitive = true
}

# DB

module "graduation_project_db" {
  source             = "./modules/rds"
  vpc_id             = module.graduation_project_vpc.vpc-id
  private_subnet_ids = [for subnet in module.graduation_project_vpc.private_subnets : subnet.id] # extract IDs
  web_sg_id          = module.graduation_project_sg.websg_id
  db_engine_version  = "8.0.43" # ✅ supported version
  db_identifier      = "rds-terraform"
  db_name            = "project_rds"
  db_username        = data.vault_generic_secret.db_creds.data["user"]
  db_password        = data.vault_generic_secret.db_creds.data["password"]

}





# terraform workspace new dev
# terraform apply   # → creates dev-key
# terraform workspace new prod
# terraform apply   # → creates prod-key

# terraform apply -target=module.graduation_project_ec2 -auto-approve
# terraform destroy -target=module.graduation_project_ec2 -auto-approve

# terraform destroy -target=module.graduation_project_sg -auto-approve
# terraform apply -target=module.graduation_project_sg -auto-approve

# terraform destroy -target=module.graduation_project_vpc -auto-approve
# terraform apply -target=module.graduation_project_vpc -auto-approve
#terraform force-unlock 2d3e9460-c33a-75be-9e24-f46baf2d7c14


#ssh -i ~/.ssh/id_rsa ec2-user@10.0.200.216


# terraform apply -target=module.lb_public

# terraform destroy -target=module.graduation_project_ec2 -auto-approve

#mysql -h rds-terraform.cqpq2ww804ex.us-east-1.rds.amazonaws.com -u sde -p
