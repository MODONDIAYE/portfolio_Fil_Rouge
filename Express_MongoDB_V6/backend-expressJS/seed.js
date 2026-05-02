const mongoose = require('mongoose');
require('dotenv').config();
const Project = require('./models/Project');
const Member = require('./models/Member');

const members = [
  {
    name: 'Aboubacryne Sadikh DIOP',
    role: 'Lead Developer & DevOps',
    specialty: 'Full-Stack & Cloud AWS',
    bio: 'Développeur Full-Stack passionné par le Cloud et le DevOps. Architecte des solutions AWS du groupe.',
    skills: ['React', 'Node.js', 'AWS EC2', 'Docker', 'Kubernetes', 'MongoDB'],
    github: 'https://github.com/',
    email: 'diopaboubacryne@gmail.com'
  },
  {
    name: 'Aminata Cissoko',
    role: 'Frontend Developer',
    specialty: 'React & UI/UX',
    bio: 'Spécialiste frontend avec une passion pour les interfaces utilisateur modernes et accessibles.',
    skills: ['React', 'Tailwind CSS', 'TypeScript', 'Figma', 'AWS S3'],
    github: 'https://github.com/',
    email: 'fatou.mbaye@example.com'
  },
  {
    name: 'Meissa Babou',
    role: 'Backend Developer',
    specialty: 'Node.js & MongoDB',
    bio: 'Expert backend, spécialisé dans la conception d\'APIs REST robustes et la gestion de bases de données.',
    skills: ['Node.js', 'Express.js', 'MongoDB', 'MySQL', 'AWS Lambda', 'Redis'],
    github: 'https://github.com/',
    email: 'moussa.ndiaye@example.com'
  },
  {
    name: 'Mame Yacine Ndiaye',
    role: 'Cloud & Infrastructure',
    specialty: 'AWS & DevOps',
    bio: 'Ingénieure Cloud spécialisée dans l\'infrastructure AWS, l\'automatisation CI/CD et la sécurité.',
    skills: ['AWS EC2', 'AWS RDS', 'Terraform', 'GitHub Actions', 'Nginx', 'Linux'],
    github: 'https://github.com/',
    email: 'aissatou.diallo@example.com'
  },
  {
    name: 'Modou Ndiaye',
    role: 'Mobile Developer',
    specialty: 'Flutter & React Native',
    bio: 'Développeur mobile cross-platform, créateur d\'applications performantes pour iOS et Android.',
    skills: ['Flutter', 'Dart', 'React Native', 'Firebase', 'AWS Amplify'],
    github: 'https://github.com/',
    email: 'ibrahima.seck@example.com'
  }
];

const projects = [
  {
    title: 'CloudTasker — Gestion de tâches en équipe',
    short: 'Application SaaS de gestion de tâches déployée sur AWS avec CI/CD automatisé',
    description: 'Plateforme collaborative de gestion de projets et tâches pour équipes distribuées. Interface React moderne avec notifications en temps réel via WebSockets, backend Node.js containerisé sur AWS ECS, et pipeline CI/CD complet via GitHub Actions.',
    tags: ['React', 'Node.js', 'MongoDB', 'Docker', 'AWS ECS', 'WebSocket'],
    type: 'Cloud',
    status: 'Terminé',
    awsServices: ['ECS', 'ECR', 'RDS', 'S3', 'CloudFront', 'Route 53'],
    features: [
      'Authentification JWT avec refresh tokens',
      'Tableaux Kanban en temps réel (WebSocket)',
      'Notifications push et email',
      'Pipeline CI/CD GitHub Actions → AWS ECS',
      'Monitoring via CloudWatch',
      'Multi-workspace avec gestion des rôles'
    ],
    members: ['Aboubacryne Sadikh DIOP', 'Fatou Mbaye', 'Moussa Ndiaye'],
    github: 'https://github.com/G2-AWS-P5/cloudtasker'
  },
  {
    title: 'PrésenCheck — Système de gestion de présence',
    short: 'Application mobile + web de pointage avec géolocalisation et tableau de bord analytique',
    description: 'Solution complète de gestion de présence pour établissements scolaires et entreprises. Application mobile Flutter avec scan QR code, backend Spring Boot déployé sur AWS EC2, et dashboard analytique React avec exports PDF/Excel.',
    tags: ['Flutter', 'Spring Boot', 'MySQL', 'AWS EC2', 'React', 'Docker'],
    type: 'Mobile',
    status: 'Terminé',
    awsServices: ['EC2', 'RDS MySQL', 'S3', 'SES'],
    features: [
      'Scan QR code pour pointage instantané',
      'Géolocalisation et validation de zone',
      'Dashboard analytique temps réel',
      'Export rapports PDF et Excel',
      'Notifications SMS/email automatiques',
      'Application mobile Flutter (iOS + Android)'
    ],
    members: ['Ibrahima Seck', 'Aïssatou Diallo', 'Moussa Ndiaye'],
    github: 'https://github.com/G2-AWS-P5/presencheck'
  },
  {
    title: 'MarketPlace API — Plateforme e-commerce',
    short: 'API REST modulaire pour marketplace multi-vendeurs avec paiement intégré',
    description: 'Architecture microservices pour une marketplace multi-vendeurs. API REST Node.js avec authentification OAuth2, gestion des paiements via Stripe, stockage des médias sur S3, et moteur de recherche Elasticsearch pour les produits.',
    tags: ['Node.js', 'Express', 'MongoDB', 'Stripe', 'AWS S3', 'Elasticsearch'],
    type: 'API',
    status: 'En cours',
    awsServices: ['Lambda', 'API Gateway', 'S3', 'SQS', 'SNS', 'DynamoDB'],
    features: [
      'Architecture microservices serverless (AWS Lambda)',
      'Paiement Stripe avec webhooks',
      'Recherche full-text Elasticsearch',
      'Stockage médias AWS S3 + CDN CloudFront',
      'Queue de messages SQS pour commandes',
      'Documentation Swagger auto-générée'
    ],
    members: ['Moussa Ndiaye', 'Aboubacryne Sadikh DIOP'],
    github: 'https://github.com/G2-AWS-P5/marketplace-api'
  },
  {
    title: 'SkyInfra — Dashboard Infrastructure AWS',
    short: 'Outil de monitoring et visualisation des ressources AWS en temps réel',
    description: 'Tableau de bord de supervision d\'infrastructure cloud AWS. Intégration avec l\'API AWS pour afficher en temps réel les métriques EC2, RDS, Lambda et S3. Alertes configurables et rapports de coûts automatisés.',
    tags: ['React', 'Node.js', 'AWS SDK', 'Chart.js', 'Terraform', 'MongoDB'],
    type: 'DevOps',
    status: 'En cours',
    awsServices: ['CloudWatch', 'Cost Explorer', 'EC2', 'RDS', 'Lambda', 'IAM'],
    features: [
      'Vue unifiée de toutes les ressources AWS',
      'Graphiques métriques CPU, RAM, réseau',
      'Alertes personnalisables par seuil',
      'Rapports de coûts et recommandations',
      'Gestion Infrastructure as Code (Terraform)',
      'Multi-compte AWS avec rôles IAM'
    ],
    members: ['Aïssatou Diallo', 'Aboubacryne Sadikh DIOP'],
    github: 'https://github.com/G2-AWS-P5/skyinfra'
  },
  {
    title: 'EduConnect — Plateforme e-learning',
    short: 'Plateforme d\'apprentissage en ligne avec vidéos, quiz et suivi de progression',
    description: 'Plateforme e-learning complète pour formations professionnelles. Streaming vidéo via AWS MediaConvert et CloudFront, quiz interactifs avec correction automatique, certificats générés automatiquement, et système de recommandations IA basé sur le profil apprenant.',
    tags: ['React', 'Node.js', 'MongoDB', 'AWS MediaConvert', 'AWS CloudFront', 'Python'],
    type: 'Web',
    status: 'En cours',
    awsServices: ['MediaConvert', 'CloudFront', 'S3', 'Cognito', 'SageMaker'],
    features: [
      'Streaming vidéo adaptatif (HLS)',
      'Quiz interactifs avec feedback immédiat',
      'Génération automatique de certificats PDF',
      'Recommandations de cours par IA (SageMaker)',
      'Authentification AWS Cognito',
      'Tableau de bord progression apprenant'
    ],
    members: ['Fatou Mbaye', 'Ibrahima Seck', 'Moussa Ndiaye', 'Aboubacryne Sadikh DIOP'],
    github: 'https://github.com/G2-AWS-P5/educonnect'
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/g2_aws_p5');
    console.log('✅ MongoDB connecté');

    await Project.deleteMany({});
    await Member.deleteMany({});
    console.log('🗑️  Collections vidées');

    await Member.insertMany(members);
    console.log(`✅ ${members.length} membres insérés`);

    await Project.insertMany(projects);
    console.log(`✅ ${projects.length} projets insérés`);

    console.log('🎉 Seed terminé avec succès !');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur de seed :', err);
    process.exit(1);
  }
}

seed();
