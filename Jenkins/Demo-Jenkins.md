# 🔧 Jenkins — Démo Complète sur le Projet Fil Rouge
## Portfolio Fullstack : Express.js · React · MongoDB · Docker

> **Projet :** Express_MongoDB_V6 — Portfolio Modou NDIAYE  
> **Objectif :** Intégrer Jenkins dans le cycle de vie complet de l'application fullstack  
> **Auteur :** Modou NDIAYE  
> **Date :** Mai 2026

---

## 📋 Table des matières

1. [Problématique — Pourquoi Jenkins ?](#1-problématique--pourquoi-jenkins-)
2. [Présentation — Qu'est-ce que Jenkins ?](#2-présentation--quest-ce-que-jenkins-)
3. [Installation](#3-installation)
4. [Configuration initiale](#4-configuration-initiale)
5. [Gestion des plugins](#5-gestion-des-plugins)
6. [Pipelines](#6-pipelines)
7. [Intégration du dépôt Git](#7-intégration-du-dépôt-git)
8. [Utilisation de Docker dans Jenkins](#8-utilisation-de-docker-dans-jenkins)
9. [Gestion des notifications](#9-gestion-des-notifications)
10. [Stratégies de déploiement](#10-stratégies-de-déploiement)
11. [Comparaison avec GitHub Actions](#11-comparaison-avec-github-actions)
12. [Démo — Intégration dans le projet fil rouge](#12-démo--intégration-dans-le-projet-fil-rouge)
13. [Références](#13-références)

---

## 1. Problématique — Pourquoi Jenkins ?

### Le problème sans CI/CD

Sans outil d'automatisation, le cycle de vie de ton application ressemble à ça :

```
Développeur modifie le code
        ↓
git push (manuel)
        ↓
Se connecter au serveur (manuel)
        ↓
git pull (manuel)
        ↓
npm install (manuel)
        ↓
npm run build (manuel)
        ↓
docker compose down (manuel)
        ↓
docker compose up --build (manuel)
        ↓
Tester que tout fonctionne (manuel)
```

**Problèmes concrets sur le projet V6 :**

| Problème | Impact |
|---|---|
| Déploiement manuel = erreurs humaines | Un `npm run build` oublié → app cassée en prod |
| Pas de tests automatiques | Un bug passe en production sans être détecté |
| Pas de feedback immédiat | On découvre les erreurs trop tard |
| Processus non reproductible | "Ça marche sur ma machine" |
| Perte de temps | 15-30 min de déploiement manuel à chaque modification |

### La solution : Jenkins

Jenkins automatise **tout ce processus** à chaque `git push` :

```
git push
   ↓
Jenkins détecte le changement (webhook)
   ↓
Récupère le code (git pull)
   ↓
Installe les dépendances (npm install)
   ↓
Lance les tests
   ↓
Build Docker (docker compose build)
   ↓
Déploie (docker compose up -d)
   ↓
Notifie le développeur (email/Slack)
```

---

## 2. Présentation — Qu'est-ce que Jenkins ?

**Jenkins** est un serveur d'automatisation open-source écrit en Java. Il permet de mettre en place des pipelines **CI/CD** (Intégration Continue / Déploiement Continu).

### Concepts clés

| Concept | Définition | Exemple sur V6 |
|---|---|---|
| **CI** (Intégration Continue) | Tester automatiquement chaque commit | Vérifier que `npm run build` passe |
| **CD** (Déploiement Continu) | Déployer automatiquement après les tests | `docker compose up --build -d` |
| **Pipeline** | Séquence d'étapes automatisées | Build → Test → Deploy |
| **Stage** | Une étape du pipeline | "Build Backend", "Build Frontend" |
| **Step** | Une action dans un stage | `sh 'npm install'` |
| **Agent** | Machine qui exécute le pipeline | Le serveur Jenkins |
| **Webhook** | Déclencheur automatique depuis GitHub | Push → Jenkins démarre |
| **Jenkinsfile** | Fichier de définition du pipeline | Placé à la racine du projet |

### Architecture Jenkins sur le projet V6

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Repository                         │
│              MODONDIAYE/portfolio_Fil_Rouge                  │
└──────────────────────┬──────────────────────────────────────┘
                       │ webhook (git push)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  Jenkins Server                              │
│                  (localhost:8080)                            │
│                                                              │
│  Pipeline : portfolio-v6                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│  │ Checkout │→│  Build   │→│  Test    │→│    Deploy    │   │
│  │   Git    │ │ Backend  │ │   API    │ │docker compose│   │
│  └──────────┘ │ Frontend │ └──────────┘ └──────────────┘   │
│               └──────────┘                                   │
└─────────────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Docker Containers                               │
│  portfolio_mongodb · portfolio_backend · portfolio_frontend  │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Installation

### Option A — Jenkins via Docker (recommandé pour la démo)

C'est la méthode la plus simple. Jenkins tourne lui-même dans un conteneur Docker.

**Étape 1 — Créer le fichier `jenkins/docker-compose.jenkins.yml`** à la racine du projet :

```yaml
services:
  jenkins:
    image: jenkins/jenkins:lts
    container_name: jenkins_portfolio
    restart: unless-stopped
    ports:
      - "8080:8080"     # interface web Jenkins
      - "50000:50000"   # communication agents Jenkins
    volumes:
      - jenkins_home:/var/jenkins_home
      # Partager le socket Docker pour que Jenkins puisse lancer des conteneurs
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - JAVA_OPTS=-Djenkins.install.runSetupWizard=false
    networks:
      - jenkins_network

volumes:
  jenkins_home:
    driver: local

networks:
  jenkins_network:
    driver: bridge
```

**Étape 2 — Lancer Jenkins :**

```bash
# Se placer dans le dossier Jenkins
cd "C:\Users\modou\OneDrive\Documents\Portfolio_ModouNDIAYE-20260329T200354Z-1-001\Jenkins"

# Démarrer Jenkins
docker compose -f docker-compose.jenkins.yml up -d

# Vérifier que Jenkins tourne
docker ps | grep jenkins
```

**Étape 3 — Récupérer le mot de passe initial :**

```bash
docker exec jenkins_portfolio cat /var/jenkins_home/secrets/initialAdminPassword
```

Copie le mot de passe affiché (ex: `a1b2c3d4e5f6...`).

**Étape 4 — Accéder à Jenkins :**

Ouvre **http://localhost:8080** dans ton navigateur.

---

### Option B — Jenkins installé directement sur Windows

```powershell
# Prérequis : Java 17+
java -version

# Télécharger Jenkins
# → https://www.jenkins.io/download/ → Windows → jenkins.msi

# Après installation, Jenkins démarre automatiquement sur :
# http://localhost:8080
```

---

## 4. Configuration initiale

### Étape 1 — Déverrouiller Jenkins

1. Ouvre **http://localhost:8080**
2. Colle le mot de passe récupéré à l'étape précédente
3. Clique **"Continue"**

### Étape 2 — Installer les plugins suggérés

1. Clique **"Install suggested plugins"**
2. Attends la fin de l'installation (~5 minutes)

### Étape 3 — Créer le premier administrateur

```
Username : admin
Password : admin123
Full name : Modou NDIAYE
Email     : modou2243@gmail.com
```

### Étape 4 — Configurer l'URL Jenkins

```
Jenkins URL : http://localhost:8080/
```

Clique **"Save and Finish"** → **"Start using Jenkins"**

---

## 5. Gestion des plugins

Les plugins étendent les fonctionnalités de Jenkins. Voici ceux nécessaires pour le projet V6.

### Accéder au gestionnaire de plugins

```
Jenkins → Manage Jenkins → Plugins → Available plugins
```

### Plugins à installer pour le projet V6

| Plugin | Utilité | Priorité |
|---|---|---|
| **Git** | Cloner le dépôt GitHub | ⭐ Obligatoire |
| **GitHub Integration** | Webhooks GitHub → Jenkins | ⭐ Obligatoire |
| **Pipeline** | Créer des pipelines Jenkinsfile | ⭐ Obligatoire |
| **Docker Pipeline** | Utiliser Docker dans les pipelines | ⭐ Obligatoire |
| **NodeJS** | Exécuter npm dans les pipelines | ⭐ Obligatoire |
| **Blue Ocean** | Interface visuelle moderne des pipelines | ✅ Recommandé |
| **Email Extension** | Notifications par email | ✅ Recommandé |
| **Slack Notification** | Notifications Slack | 🔵 Optionnel |
| **HTML Publisher** | Publier des rapports de tests | 🔵 Optionnel |

### Installer les plugins

```
1. Manage Jenkins → Plugins → Available plugins
2. Rechercher chaque plugin
3. Cocher la case
4. Cliquer "Install"
5. Redémarrer Jenkins après installation
```

### Configurer le plugin NodeJS

```
Manage Jenkins → Tools → NodeJS installations
→ Add NodeJS
   Name    : NodeJS-20
   Version : 20.x.x (LTS)
→ Save
```

---

## 6. Pipelines

Un pipeline Jenkins est défini dans un fichier **`Jenkinsfile`** placé à la racine du projet.

### Types de pipelines

| Type | Description | Usage |
|---|---|---|
| **Declarative** | Syntaxe structurée, plus simple | ✅ Recommandé pour débutants |
| **Scripted** | Groovy pur, plus flexible | Pour cas avancés |

### Structure d'un pipeline Declarative

```groovy
pipeline {
    agent any                    // exécuter sur n'importe quel agent

    environment {                // variables d'environnement
        NODE_ENV = 'production'
    }

    stages {                     // liste des étapes
        stage('Checkout') {      // étape 1
            steps {
                git '...'
            }
        }
        stage('Build') {         // étape 2
            steps {
                sh 'npm install'
            }
        }
        stage('Test') {          // étape 3
            steps {
                sh 'npm test'
            }
        }
        stage('Deploy') {        // étape 4
            steps {
                sh 'docker compose up -d'
            }
        }
    }

    post {                       // actions après le pipeline
        success { echo 'Succès !' }
        failure { echo 'Échec !' }
    }
}
```

---

## 7. Intégration du dépôt Git

### Étape 1 — Créer un job Pipeline dans Jenkins

```
Jenkins → New Item
→ Nom : portfolio-v6-pipeline
→ Type : Pipeline
→ OK
```

### Étape 2 — Configurer la source Git

Dans la configuration du job :

```
Pipeline → Definition : Pipeline script from SCM
SCM : Git
Repository URL : https://github.com/MODONDIAYE/portfolio_Fil_Rouge.git
Branch : */main
Script Path : Express_MongoDB_V6/Jenkinsfile
```

### Étape 3 — Configurer le webhook GitHub

**Dans GitHub :**
```
Repository → Settings → Webhooks → Add webhook
Payload URL : http://<ton-ip>:8080/github-webhook/
Content type : application/json
Events : Just the push event
→ Add webhook
```

> ⚠️ Pour les tests en local, utilise **ngrok** pour exposer Jenkins :
> ```bash
> ngrok http 8080
> # → donne une URL publique ex: https://abc123.ngrok.io
> # Utilise cette URL dans le webhook GitHub
> ```

### Étape 4 — Activer le déclencheur dans Jenkins

```
Job → Configure → Build Triggers
→ ✅ GitHub hook trigger for GITScm polling
→ Save
```

---

## 8. Utilisation de Docker dans Jenkins

Jenkins peut construire et déployer les conteneurs Docker du projet V6.

### Prérequis

```bash
# Donner à Jenkins l'accès au socket Docker
# (déjà configuré dans docker-compose.jenkins.yml)
- /var/run/docker.sock:/var/run/docker.sock

# Installer Docker dans le conteneur Jenkins
docker exec -u root jenkins_portfolio sh -c "
  apt-get update &&
  apt-get install -y docker.io &&
  usermod -aG docker jenkins
"

# Redémarrer Jenkins
docker restart jenkins_portfolio
```

### Jenkinsfile complet pour le projet V6

Créer le fichier `Express_MongoDB_V6/Jenkinsfile` :

```groovy
pipeline {
    agent any

    environment {
        COMPOSE_FILE = 'Express_MongoDB_V6/docker-compose.yml'
        PROJECT_DIR  = 'Express_MongoDB_V6'
    }

    options {
        timeout(time: 20, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '5'))
    }

    stages {

        // ── ÉTAPE 1 : Récupérer le code ──────────────────
        stage('📥 Checkout') {
            steps {
                echo '=== Récupération du code source ==='
                checkout scm
            }
        }

        // ── ÉTAPE 2 : Vérifier l'environnement ───────────
        stage('🔍 Vérification') {
            steps {
                echo '=== Vérification des outils ==='
                sh 'node --version'
                sh 'npm --version'
                sh 'docker --version'
                sh 'docker compose version'
            }
        }

        // ── ÉTAPE 3 : Installer les dépendances ──────────
        stage('📦 Installation') {
            parallel {
                stage('Backend deps') {
                    steps {
                        dir("${PROJECT_DIR}/backend-expressJS") {
                            echo '=== npm install backend ==='
                            sh 'npm install --omit=dev'
                        }
                    }
                }
                stage('Frontend deps') {
                    steps {
                        dir("${PROJECT_DIR}/frontend-react") {
                            echo '=== npm install frontend ==='
                            sh 'npm install'
                        }
                    }
                }
            }
        }

        // ── ÉTAPE 4 : Build Frontend ──────────────────────
        stage('🏗️ Build Frontend') {
            steps {
                dir("${PROJECT_DIR}/frontend-react") {
                    echo '=== npm run build ==='
                    sh 'npm run build'
                    echo '=== Build React terminé ==='
                }
            }
        }

        // ── ÉTAPE 5 : Tests API ───────────────────────────
        stage('🧪 Tests') {
            steps {
                echo '=== Vérification syntaxe backend ==='
                dir("${PROJECT_DIR}/backend-expressJS") {
                    sh 'node --check server.js'
                    sh 'node --check controllers/projectController.js'
                    sh 'node --check controllers/memberController.js'
                    sh 'node --check controllers/contactController.js'
                }
                echo '=== Tests syntaxe OK ==='
            }
        }

        // ── ÉTAPE 6 : Build Docker ────────────────────────
        stage('🐳 Docker Build') {
            steps {
                dir("${PROJECT_DIR}") {
                    echo '=== Construction des images Docker ==='
                    sh 'docker compose build --no-cache'
                    echo '=== Images construites ==='
                }
            }
        }

        // ── ÉTAPE 7 : Déploiement ─────────────────────────
        stage('🚀 Déploiement') {
            steps {
                dir("${PROJECT_DIR}") {
                    echo '=== Arrêt des anciens conteneurs ==='
                    sh 'docker compose down || true'

                    echo '=== Démarrage des nouveaux conteneurs ==='
                    sh 'docker compose up -d'

                    echo '=== Attente démarrage (15s) ==='
                    sh 'sleep 15'
                }
            }
        }

        // ── ÉTAPE 8 : Vérification santé ──────────────────
        stage('✅ Health Check') {
            steps {
                echo '=== Vérification que l\'API répond ==='
                sh 'curl -f http://localhost:5000/api/health || exit 1'
                echo '=== API opérationnelle ==='

                echo '=== Vérification frontend ==='
                sh 'curl -f http://localhost:80 || exit 1'
                echo '=== Frontend opérationnel ==='
            }
        }

    }

    // ── ACTIONS POST-PIPELINE ─────────────────────────────
    post {
        success {
            echo '''
            ╔══════════════════════════════════════╗
            ║  ✅ PIPELINE RÉUSSI                  ║
            ║  Application déployée avec succès !  ║
            ║  Frontend : http://localhost         ║
            ║  API      : http://localhost:5000    ║
            ╚══════════════════════════════════════╝
            '''
        }
        failure {
            echo '''
            ╔══════════════════════════════════════╗
            ║  ❌ PIPELINE ÉCHOUÉ                  ║
            ║  Vérifiez les logs ci-dessus         ║
            ╚══════════════════════════════════════╝
            '''
        }
        always {
            echo '=== Nettoyage workspace ==='
            cleanWs()
        }
    }
}
```

---

## 9. Gestion des notifications

### Notifications par email

**Configuration SMTP dans Jenkins :**

```
Manage Jenkins → System → E-mail Notification
SMTP server   : smtp.gmail.com
Port          : 587
Use SSL       : ✅
Username      : modou2243@gmail.com
Password      : (mot de passe application Gmail)
```

**Ajouter dans le Jenkinsfile :**

```groovy
post {
    success {
        emailext(
            subject: "✅ [Portfolio V6] Build #${BUILD_NUMBER} réussi",
            body: """
                Le pipeline a réussi !
                
                Projet  : Portfolio Modou NDIAYE V6
                Build   : #${BUILD_NUMBER}
                Durée   : ${currentBuild.durationString}
                URL     : ${BUILD_URL}
                
                Application disponible sur : http://localhost
            """,
            to: 'modou2243@gmail.com'
        )
    }
    failure {
        emailext(
            subject: "❌ [Portfolio V6] Build #${BUILD_NUMBER} ÉCHOUÉ",
            body: """
                Le pipeline a échoué !
                
                Build   : #${BUILD_NUMBER}
                Étape   : ${currentBuild.currentResult}
                Logs    : ${BUILD_URL}console
            """,
            to: 'modou2243@gmail.com'
        )
    }
}
```

### Notifications Slack (optionnel)

```groovy
post {
    success {
        slackSend(
            channel: '#deployments',
            color: 'good',
            message: "✅ Portfolio V6 déployé avec succès ! Build #${BUILD_NUMBER}"
        )
    }
    failure {
        slackSend(
            channel: '#deployments',
            color: 'danger',
            message: "❌ Échec du déploiement Portfolio V6 ! Build #${BUILD_NUMBER} - ${BUILD_URL}"
        )
    }
}
```

---

## 10. Stratégies de déploiement

### Stratégie utilisée dans le projet V6 : Rolling Update

```groovy
stage('Déploiement') {
    steps {
        // 1. Arrêter uniquement le backend (MongoDB reste actif)
        sh 'docker compose stop backend frontend'

        // 2. Reconstruire les images
        sh 'docker compose build backend frontend'

        // 3. Redémarrer avec les nouvelles images
        sh 'docker compose up -d backend frontend'
    }
}
```

### Comparaison des stratégies

| Stratégie | Description | Avantage | Inconvénient |
|---|---|---|---|
| **Recreate** | Arrêter tout, redémarrer | Simple | Downtime |
| **Rolling Update** | Remplacer service par service | Peu de downtime | Complexité |
| **Blue/Green** | Deux environnements, basculer | Zéro downtime | Double ressources |
| **Canary** | Déployer sur un % d'utilisateurs | Risque minimal | Très complexe |

Pour la démo V6, on utilise **Rolling Update** : MongoDB reste actif pendant que backend et frontend sont mis à jour.

---

## 11. Comparaison avec GitHub Actions

| Critère | Jenkins | GitHub Actions |
|---|---|---|
| **Hébergement** | Auto-hébergé (ton serveur) | Cloud GitHub |
| **Configuration** | Jenkinsfile (Groovy) | YAML (.github/workflows/) |
| **Coût** | Gratuit (serveur requis) | Gratuit (2000 min/mois) |
| **Plugins** | 1800+ plugins | Marketplace d'actions |
| **Flexibilité** | Très haute | Haute |
| **Courbe d'apprentissage** | Élevée | Modérée |
| **Intégration Docker** | Via plugin + socket | Native |
| **Déclencheurs** | Webhook, cron, manuel | Push, PR, cron, manuel |
| **Interface** | Web (localhost:8080) | GitHub.com |
| **Secrets** | Jenkins Credentials | GitHub Secrets |

**Quand choisir Jenkins ?**
- Besoin de contrôle total sur l'infrastructure
- Pipelines complexes avec beaucoup de personnalisation
- Environnement d'entreprise avec serveurs dédiés

**Quand choisir GitHub Actions ?**
- Projet open-source sur GitHub
- Équipe petite, démarrage rapide
- Pas de serveur disponible

---

## 12. Démo — Intégration dans le projet fil rouge

### Vue d'ensemble de la démo

```
git push → GitHub → Webhook → Jenkins → Build → Test → Docker → Deploy
```

### Étapes de la démo pas à pas

---

#### 🔵 ÉTAPE 1 — Lancer Jenkins

```powershell
# Dans le dossier Jenkins
cd "C:\Users\modou\OneDrive\Documents\Portfolio_ModouNDIAYE-20260329T200354Z-1-001\Jenkins"

docker compose -f docker-compose.jenkins.yml up -d

# Vérifier
docker ps | grep jenkins
# → jenkins_portfolio   Up   0.0.0.0:8080->8080/tcp
```

Ouvrir **http://localhost:8080**

---

#### 🔵 ÉTAPE 2 — Créer le job Pipeline

```
Jenkins → New Item
→ Nom : portfolio-v6-pipeline
→ Pipeline
→ OK

Configuration :
→ Description : Pipeline CI/CD Portfolio Modou NDIAYE V6
→ Build Triggers : ✅ GitHub hook trigger for GITScm polling
→ Pipeline :
   Definition : Pipeline script from SCM
   SCM : Git
   URL : https://github.com/MODONDIAYE/portfolio_Fil_Rouge.git
   Branch : */main
   Script Path : Express_MongoDB_V6/Jenkinsfile
→ Save
```

---

#### 🔵 ÉTAPE 3 — Créer le Jenkinsfile dans le projet

Créer le fichier `Express_MongoDB_V6/Jenkinsfile` avec le contenu de la section 8.

```powershell
# Committer et pousser le Jenkinsfile
cd "C:\Users\modou\OneDrive\Documents\Portfolio_ModouNDIAYE-20260329T200354Z-1-001"
git add Express_MongoDB_V6/Jenkinsfile
git commit -m "ci: add Jenkinsfile for CI/CD pipeline"
git push origin main
```

---

#### 🔵 ÉTAPE 4 — Lancer le premier build manuellement

```
Jenkins → portfolio-v6-pipeline → Build Now
```

Suivre l'exécution en temps réel :
```
Jenkins → portfolio-v6-pipeline → #1 → Console Output
```

**Résultat attendu :**
```
=== Récupération du code source ===
=== Vérification des outils ===
node --version → v20.x.x
npm --version  → 10.x.x
docker --version → Docker version 29.x.x

=== npm install backend ===
added 120 packages in 8s

=== npm install frontend ===
added 164 packages in 12s

=== npm run build ===
✓ 78 modules transformed
✓ built in 1.3s

=== Tests syntaxe OK ===

=== Construction des images Docker ===
✓ backend  Built
✓ frontend Built

=== Démarrage des nouveaux conteneurs ===
✓ portfolio_mongodb   Running
✓ portfolio_backend   Started
✓ portfolio_frontend  Started

=== API opérationnelle ===
=== Frontend opérationnel ===

✅ PIPELINE RÉUSSI
```

---

#### 🔵 ÉTAPE 5 — Tester le déclenchement automatique

1. Modifier un fichier du projet (ex: changer un texte dans `Hero.jsx`)
2. `git add . && git commit -m "test: trigger Jenkins" && git push`
3. Jenkins détecte le push via webhook
4. Le pipeline se lance automatiquement
5. L'application est redéployée avec les modifications

---

#### 🔵 ÉTAPE 6 — Visualiser avec Blue Ocean

```
Jenkins → Open Blue Ocean (menu gauche)
→ Vue graphique du pipeline avec chaque stage
→ Logs colorés par étape
→ Historique des builds
```

---

#### 🔵 ÉTAPE 7 — Simuler un échec

Introduire volontairement une erreur dans `server.js` :

```javascript
// Ajouter une syntaxe invalide
const x = {;  // ← erreur volontaire
```

```bash
git add . && git commit -m "test: simulate failure" && git push
```

Jenkins détecte l'erreur au stage **Tests** et arrête le pipeline.
Le déploiement n'a pas lieu → l'application reste stable.

Corriger l'erreur et repousser → le pipeline repasse au vert.

---

### Résumé des fonctionnalités démontrées

| Fonctionnalité Jenkins | Démontré dans |
|---|---|
| Pipeline Declarative | Jenkinsfile complet |
| Stages parallèles | Installation backend + frontend en parallèle |
| Intégration Git | Checkout automatique depuis GitHub |
| Déclencheur webhook | Push → build automatique |
| Build Docker | `docker compose build` dans le pipeline |
| Déploiement | `docker compose up -d` automatisé |
| Health check | `curl` vers l'API après déploiement |
| Gestion des erreurs | `post { failure { ... } }` |
| Notifications | Email après succès/échec |
| Blue Ocean | Visualisation graphique |
| Nettoyage | `cleanWs()` après chaque build |

---

## 13. Références

| Ressource | URL |
|---|---|
| Documentation officielle Jenkins | https://www.jenkins.io/doc/ |
| Jenkins Pipeline Syntax | https://www.jenkins.io/doc/book/pipeline/syntax/ |
| Plugin Docker Pipeline | https://plugins.jenkins.io/docker-workflow/ |
| Plugin NodeJS | https://plugins.jenkins.io/nodejs/ |
| Blue Ocean | https://www.jenkins.io/doc/book/blueocean/ |
| Jenkins + Docker | https://www.jenkins.io/doc/book/installing/docker/ |
| GitHub Webhooks | https://docs.github.com/en/webhooks |
| ngrok (tunnel local) | https://ngrok.com/docs |
| Jenkinsfile examples | https://github.com/jenkinsci/pipeline-examples |

---

## 📁 Fichiers créés pour la démo

```
Portfolio_ModouNDIAYE-20260329T200354Z-1-001/
├── Jenkins/
│   ├── Demo-Jenkins.md                    ← ce fichier
│   └── docker-compose.jenkins.yml         ← lancer Jenkins
│
└── Express_MongoDB_V6/
    └── Jenkinsfile                        ← pipeline CI/CD
```

---

*Guide rédigé pour le projet Portfolio Modou NDIAYE — Express_MongoDB_V6*  
*Jenkins LTS · Docker 29.3.1 · Node.js 20 · React 19 · Express.js 4 · MongoDB 7*
