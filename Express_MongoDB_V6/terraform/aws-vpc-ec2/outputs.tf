hcl
# terraform/aws-vpc-ec2/outputs.tf

output "vpc_id" {
  description = "ID du VPC créé"
  value       = aws_vpc.main.id
}

output "subnet_public_id" {
  description = "ID du subnet public"
  value       = aws_subnet.public.id
}

output "ec2_public_ip" {
  description = "IP publique de l'instance EC2"
  value       = aws_instance.backend.public_ip
}

output "ec2_public_dns" {
  description = "DNS public de l'instance EC2"
  value       = aws_instance.backend.public_dns
}

output "ssh_command" {
  description = "Commande SSH pour se connecter"
  value       = "ssh -i votre-cle.pem ec2-user@${aws_instance.backend.public_ip}"
}