# terraform apply -target=module.remote_state
module "graduation_project_vpc" {
  source     = "./modules/vpc"
  vpc_cidr   = "10.0.0.0/16"
  vpc_name   = "deploy-terra-nodepilot-ansible"
  aws_region = "us-east-1"
  public_subnets = {
    "us-east-1a" = 20
    "us-east-1b" = 30
  }

  private_subnets = {
    "us-east-1a" = 50
    "us-east-1b" = 60
  }


}

module "graduation_project_sg" {
  source                  = "./modules/sg"
  vpc_id_where_sg_applyed = module.graduation_project_vpc.vpc-id
  allowed_ports           = ["0"] # I do this for ease of use , but if you want only ssh --> 22 and change protocol 
  protocol                = "-1"

}

# EC2 Module (workspace aware)
module "graduation_project_ec2" {
  source = "./modules/ec2"
  # Networking references
  controlNodeCount = 1
  managedNode_count = 2

  #################
  controlNode_instance_type="t2.micro"
  managed_node_instance_type="t2.micro"
  #########################
 control_node_ami="ami-0cae6d6fe6048ca2c"
 managed_node_ami="ami-0cae6d6fe6048ca2c"
  # Availability zones
  maanged_node_az = "us-east-1a"
  controlNode_az = "us-east-1b"
  #Subnet /SG Selection  
  sg_ids             = [module.graduation_project_sg.websg_id]
  public_subnet_ids  = module.graduation_project_vpc.public_subnets  # ✅ web in public subnet
  private_subnet_ids = module.graduation_project_vpc.private_subnets # ✅ app in private subnet
###############
  control_node_user_data = file("${path.module}/templates/control-node.sh")
  managed_node_data_app = file("${path.module}/templates/managed-node.sh")


}





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

# terraform apply -replace="module.graduation_project_ec2"
# terraform apply -replace="module.graduation_project_ec2.aws_instance.controlNode[0]" -auto-approve