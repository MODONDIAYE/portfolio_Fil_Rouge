hcl
# terraform/aws-vpc-ec2/variables.tf

variable "aws_region" {
  description = "Region AWS de déploiement"
  type        = string
  default     = "eu-west-1"
}

variable "vpc_cidr" {
  description = "Bloc CIDR du VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "subnet_cidr" {
  description = "Bloc CIDR du subnet public"
  type        = string
  default     = "10.0.1.0/24"
}

variable "instance_type" {
  description = "Type d'instance EC2"
  type        = string
  default     = "t2.micro"   # Eligible Free Tier
}

variable "project_name" {
  description = "Nom du projet (utilisé dans les tags)"
  type        = string
  default     = "portfolio-modou"
}