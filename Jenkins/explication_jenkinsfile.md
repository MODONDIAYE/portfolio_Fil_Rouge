# Explication ligne par ligne du Jenkinsfile
## Projet : Portfolio Modou NDIAYE - Express_MongoDB_V6

Ce document explique chaque ligne et chaque mot-cle du Jenkinsfile utilise pour
automatiser le deploiement du projet fullstack (Express.js + React + MongoDB + Docker).

---

## LIGNE 1 — pipeline {

```groovy
pipeline {
```

**pipeline** : mot-cle racine de tout Jenkinsfile en syntaxe Declarative Pipeline.
Il indique a Jenkins que ce fichier contient la definition d un pipeline automatise.
Tout le contenu est encapsule entre les accolades { } qui suivent.
Sans ce mot-cle, Jenkins ne sait pas comment interpreter le fichier.

---

## BLOC agent any

```groovy
agent any
```

**agent** : definit OU le pipeline va s executer (sur quelle machine).

**any** : signifie "execute sur n importe quel agent Jenkins disponible".
Dans notre cas, il n y a qu un seul agent : le serveur Jenkins lui-meme
(le conteneur Docker jenkins_portfolio qui tourne sur localhost:8080).

Autres valeurs possibles :
- agent none          : pas d agent global
- agent { docker '...' } : dans un conteneur Docker
- agent { label 'linux' } : sur un agent etiquete

---

## BLOC environment { }

```groovy
environment {
    PROJECT_DIR    = 'Express_MongoDB_V6'
    DOCKERHUB_USER = 'modoundiaye'
    BACKEND_IMAGE  = 'modoundiaye/portfolio-backend'
    FRONTEND_IMAGE = 'modoundiaye/portfolio-frontend'
}
```

**environment** : bloc qui declare des variables d environnement disponibles
dans TOUTES les etapes du pipeline. Equivalent des variables d environnement shell.

**PROJECT_DIR = 'Express_MongoDB_V6'** :
- Nom du sous-dossier contenant l application dans le depot Git.
- Utilise avec ${WORKSPACE}/${PROJECT_DIR}/ pour construire les chemins absolus.
- Evite de repeter 'Express_MongoDB_V6' partout dans le fichier.

**DOCKERHUB_USER = 'modoundiaye'** :
- Nom d utilisateur Docker Hub de Modou NDIAYE.
- Utilise pour tagger et pousser les images Docker.

**BACKEND_IMAGE = 'modoundiaye/portfolio-backend'** :
- Nom complet de l image Docker du backend sur Docker Hub.
- Format : username/nom-image.
- Permet de versionner et distribuer l image backend.

**FRONTEND_IMAGE = 'modoundiaye/portfolio-frontend'** :
- Nom complet de l image Docker du frontend sur Docker Hub.
- Meme logique que BACKEND_IMAGE.

---

## BLOC triggers { }

```groovy
triggers {
    githubPush()
}
```

**triggers** : definit CE QUI DECLENCHE automatiquement le pipeline.

**githubPush()** : declenche le pipeline a chaque git push sur le depot GitHub.
Fonctionne via un webhook configure dans GitHub (Settings -> Webhooks).
Quand tu fais "git push origin main", GitHub envoie une notification HTTP a Jenkins,
qui lance automatiquement le pipeline sans intervention manuelle.

Sans ce bloc, il faudrait cliquer "Build Now" manuellement a chaque fois.

---

## BLOC options { }

```groovy
options {
    timeout(time: 20, unit: 'MINUTES')
    buildDiscarder(logRotator(numToKeepStr: '5'))
}
```

**options** : configure des comportements globaux du pipeline.

**timeout(time: 20, unit: 'MINUTES')** :
- Arrete automatiquement le pipeline s il dure plus de 20 minutes.
- Evite les builds bloques indefiniment (ex: une commande qui ne repond plus).
- time: 20 = la valeur numerique.
- unit: 'MINUTES' = l unite (autres valeurs : 'SECONDS', 'HOURS').

**buildDiscarder(logRotator(numToKeepStr: '5'))** :
- buildDiscarder : active la suppression automatique des anciens builds.
- logRotator : strategie de rotation des logs.
- numToKeepStr: '5' : conserve uniquement les 5 DERNIERS builds.
- Les builds plus anciens sont supprimes automatiquement -> economise l espace disque.

---

## BLOC stages { }

```groovy
stages {
    ...
}
```

**stages** : contient la liste de toutes les etapes (stages) du pipeline.
Les stages s executent dans l ORDRE de declaration.
Si un stage echoue, les suivants sont automatiquement IGNORES (skipped).

---

## STAGE 1 — Checkout

```groovy
stage('Checkout') {
    steps {
        echo '=== ETAPE 1 : Recuperation du code source depuis GitHub ==='
        checkout scm
        echo "=== Commit : ${env.GIT_COMMIT?.take(7)} ==="
    }
}
```

**stage('Checkout')** :
- Declare une etape nommee "Checkout".
- Le nom entre guillemets apparait dans l interface Jenkins (barre de progression).

**steps { }** :
- Contient les ACTIONS CONCRETES a executer dans ce stage.
- Chaque ligne dans steps est une commande Jenkins ou shell.

**echo '...'** :
- Affiche un message dans les logs de la Console Output de Jenkins.
- Utile pour suivre l avancement et deboguer.

**checkout scm** :
- checkout : commande Jenkins qui clone/met a jour le depot Git.
- scm : (Source Control Management) utilise automatiquement la configuration Git
  definie dans le job Jenkins (URL du depot, branche main, credentials GitHub).
- Telecharge tout le code source dans le workspace Jenkins :
  /var/jenkins_home/workspace/portfolio-v6-pipeline/

**${env.GIT_COMMIT?.take(7)}** :
- env.GIT_COMMIT : variable Jenkins contenant le hash SHA complet du commit (40 caracteres).
- ?. : operateur "safe navigation" - evite une erreur si GIT_COMMIT est null.
- .take(7) : prend les 7 premiers caracteres du hash (format court, ex: b9442bc).
- Affiche dans les logs pour savoir exactement quel commit a ete deploye.

---

## STAGE 2 — Verification

```groovy
stage('Verification') {
    steps {
        echo '=== ETAPE 2 : Verification de l environnement Docker ==='
        sh 'docker --version'
        sh 'docker compose version'
        sh "ls -la ${WORKSPACE}//"
        sh 'docker ps --format "table {{.Names}}\\t{{.Status}}"'
    }
}
```

**sh '...'** :
- Execute une commande SHELL (bash/sh) sur l agent Jenkins.
- Guillemets simples '...' : pas d interpolation de variables.
- Guillemets doubles "..." : les variables ${VAR} sont remplacees par leur valeur.

**sh 'docker --version'** :
- Verifie que Docker CLI est installe dans le conteneur Jenkins.
- Affiche la version (ex: Docker version 29.4.3).
- Si Docker n est pas disponible -> le stage echoue immediatement.

**sh 'docker compose version'** :
- Verifie que Docker Compose est disponible.
- Affiche la version (ex: Docker Compose version v5.1.3).

**sh "ls -la ${WORKSPACE}//"** :
- ls -la : liste tous les fichiers avec details (permissions, taille, date).
- ${WORKSPACE} : variable Jenkins = chemin absolu du workspace.
- Permet de verifier que le code a bien ete clone et que docker-compose.yml est present.

**sh 'docker ps --format "table {{.Names}}\\t{{.Status}}"'** :
- docker ps : liste les conteneurs Docker en cours d execution.
- --format : formate la sortie en tableau avec le nom et le statut.
- \\t : caractere tabulation (separateur de colonnes).
- Permet de voir l etat des conteneurs AVANT le deploiement.

---

## STAGE 3 — Docker Build

```groovy
stage('Docker Build') {
    steps {
        echo '=== ETAPE 3 : Construction des images Docker ==='
        sh "docker compose -f ${WORKSPACE}/${PROJECT_DIR}/docker-compose.yml build"
        echo '=== Images construites avec succes ==='
    }
}
```

**docker compose** : outil qui orchestre plusieurs conteneurs Docker definis dans un fichier YAML.

**-f ${WORKSPACE}/${PROJECT_DIR}/docker-compose.yml** :
- -f : (file) specifie le CHEMIN ABSOLU vers le fichier docker-compose.yml.
- ${WORKSPACE} = /var/jenkins_home/workspace/portfolio-v6-pipeline
- ${PROJECT_DIR} = Express_MongoDB_V6
- Chemin complet = .../portfolio-v6-pipeline/Express_MongoDB_V6/docker-compose.yml
- POURQUOI LE CHEMIN ABSOLU ? Docker cherche le fichier depuis son propre contexte,
  pas depuis le repertoire courant du shell Jenkins. Sans -f, erreur "not found".

**build** : sous-commande qui construit les images Docker definies dans le fichier.
- Lit les Dockerfile du backend et du frontend.
- Backend  : node:20-alpine -> npm install --omit=dev -> node server.js
- Frontend : node:20-alpine (build React) -> nginx:alpine (sert les fichiers statiques)
- Utilise le CACHE Docker : si le code n a pas change, la couche est reutilisee -> plus rapide.

---

## STAGE 4 — Push Docker Hub

```groovy
stage('Push Docker Hub') {
    steps {
        withCredentials([usernamePassword(
            credentialsId: 'dockerhub-credentials',
            usernameVariable: 'DOCKER_USER',
            passwordVariable: 'DOCKER_PASS'
        )]) {
            sh '''
                echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                docker tag express_mongodb_v6-backend:latest ${BACKEND_IMAGE}:latest
                docker tag express_mongodb_v6-backend:latest ${BACKEND_IMAGE}:${BUILD_NUMBER}
                docker tag express_mongodb_v6-frontend:latest ${FRONTEND_IMAGE}:latest
                docker tag express_mongodb_v6-frontend:latest ${FRONTEND_IMAGE}:${BUILD_NUMBER}
                docker push ${BACKEND_IMAGE}:latest
                docker push ${BACKEND_IMAGE}:${BUILD_NUMBER}
                docker push ${FRONTEND_IMAGE}:latest
                docker push ${FRONTEND_IMAGE}:${BUILD_NUMBER}
                docker logout
            '''
        }
    }
}
```

**withCredentials([...])** :
- Injecte des SECRETS (credentials) stockes dans Jenkins de facon securisee.
- Les valeurs ne sont JAMAIS affichees dans les logs (masquees par ****).

**usernamePassword(...)** :
- Type de credential : couple identifiant + mot de passe.
- credentialsId: 'dockerhub-credentials' : ID du credential cree dans Jenkins
  (Manage Jenkins -> Credentials -> Add Credentials).
- usernameVariable: 'DOCKER_USER' : le nom d utilisateur est injecte dans $DOCKER_USER.
- passwordVariable: 'DOCKER_PASS' : le mot de passe est injecte dans $DOCKER_PASS.

**sh ''' ... '''** :
- Triple guillemets simples : bloc de commandes shell MULTI-LIGNES.
- Toutes les lignes s executent dans le meme shell.

**echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin** :
- echo "$DOCKER_PASS" : affiche le mot de passe dans stdout.
- | : pipe - redirige stdout vers stdin de la commande suivante.
- docker login : authentifie Docker aupres de Docker Hub.
- -u "$DOCKER_USER" : nom d utilisateur.
- --password-stdin : lit le mot de passe depuis stdin (plus securise que -p).

**docker tag express_mongodb_v6-backend:latest ${BACKEND_IMAGE}:latest** :
- docker tag : cree un ALIAS (tag) pour une image existante.
- express_mongodb_v6-backend:latest : nom LOCAL de l image construite a l etape 3.
- ${BACKEND_IMAGE}:latest = modoundiaye/portfolio-backend:latest : nom sur Docker Hub.

**docker tag express_mongodb_v6-backend:latest ${BACKEND_IMAGE}:${BUILD_NUMBER}** :
- ${BUILD_NUMBER} : variable Jenkins = numero du build actuel (ex: 12).
- Cree un tag versionne (ex: modoundiaye/portfolio-backend:12).
- Permet de revenir a une version precise en cas de probleme (ROLLBACK).

**docker push ${BACKEND_IMAGE}:latest** :
- Envoie l image taguee :latest vers Docker Hub.
- Accessible publiquement sur hub.docker.com/r/modoundiaye/portfolio-backend.

**docker push ${BACKEND_IMAGE}:${BUILD_NUMBER}** :
- Envoie l image taguee avec le numero de build.
- Conserve l historique de toutes les versions deployees.

**docker logout** :
- Deconnecte Docker de Docker Hub apres le push.
- Bonne pratique de securite : ne pas rester connecte inutilement.

---

## STAGE 5 — Deploiement

```groovy
stage('Deploiement') {
    steps {
        sh "docker compose -f ${WORKSPACE}/${PROJECT_DIR}/docker-compose.yml down || true"
        sh "docker compose -f ${WORKSPACE}/${PROJECT_DIR}/docker-compose.yml up -d"
        sh 'sleep 30'
    }
}
```

**docker compose ... down** :
- Arrete et SUPPRIME les conteneurs en cours d execution.
- Le VOLUME mongodb_data est conserve -> les donnees MongoDB ne sont pas perdues.
- Le RESEAU Docker est supprime et recree au prochain up.

**|| true** :
- || : operateur logique "OU" en shell.
- Si docker compose down retourne une erreur (ex: aucun conteneur ne tourne),
  true force le code de retour a 0 (succes).
- Evite que le pipeline echoue lors du PREMIER DEPLOIEMENT ou il n y a rien a arreter.

**docker compose ... up -d** :
- up : cree et demarre tous les conteneurs definis dans docker-compose.yml.
- -d : (detached) mode ARRIERE-PLAN - les conteneurs tournent sans bloquer le terminal.
- Demarre dans l ordre : mongodb -> (healthcheck OK) -> backend -> frontend.
- Le depends_on dans docker-compose.yml garantit cet ordre.

**sh 'sleep 30'** :
- sleep : commande shell qui attend N secondes.
- 30 : attend 30 secondes.
- POURQUOI ? MongoDB met ~10-15s a demarrer et passer le healthcheck.
  Le backend attend que MongoDB soit healthy avant de se connecter.
  On attend 30s pour etre sur que tout est operationnel avant le health check.

---

## STAGE 6 — Health Check

```groovy
stage('Health Check') {
    steps {
        sh 'docker exec portfolio_backend wget --spider -q http://127.0.0.1:5000/api/health'
        sh '''
            for i in 1 2 3 4 5; do
                docker exec portfolio_frontend wget --spider -q http://127.0.0.1:80 && exit 0
                echo "    Tentative $i echouee, retry dans 5s..."
                sleep 5
            done
            exit 1
        '''
    }
}
```

**docker exec portfolio_backend** :
- docker exec : execute une commande A L INTERIEUR d un conteneur en cours d execution.
- portfolio_backend : nom du conteneur cible (defini dans docker-compose.yml).
- POURQUOI PAS curl localhost:5000 directement ?
  Jenkins tourne dans son propre conteneur jenkins_portfolio.
  localhost dans Jenkins = le conteneur Jenkins lui-meme, PAS le backend.
  docker exec permet d executer la commande DANS le bon conteneur.

**wget --spider -q http://127.0.0.1:5000/api/health** :
- wget : outil de telechargement HTTP (disponible dans l image Alpine).
- --spider : mode "araignee" - verifie que l URL repond SANS telecharger le contenu.
- -q : (quiet) mode silencieux - n affiche pas la progression.
- http://127.0.0.1:5000/api/health : URL de la route de sante de l API Express.js.
- Retourne 0 (succes) si le serveur repond, 1 (erreur) sinon.

**for i in 1 2 3 4 5; do ... done** :
- Boucle shell qui itere 5 fois (valeurs : 1, 2, 3, 4, 5).
- i : variable de boucle contenant la valeur courante.
- Permet de REESSAYER si le frontend n est pas encore pret.

**docker exec portfolio_frontend wget --spider -q http://127.0.0.1:80 && exit 0** :
- Teste que Nginx sert bien les fichiers React sur le port 80.
- && : si wget reussit (code 0), execute exit 0 -> sort de la boucle avec SUCCES.

**echo "    Tentative $i echouee, retry dans 5s..."** :
- Affiche un message avec le numero de tentative.
- $i : valeur courante de la variable de boucle.

**sleep 5** : attend 5 secondes avant la prochaine tentative.

**exit 1** : si les 5 tentatives echouent -> retourne un code d erreur -> stage FAILURE.

---

## BLOC post { }

```groovy
post {
    success { ... }
    failure { ... }
    always  { ... }
}
```

**post** : bloc execute APRES la fin de tous les stages, quel que soit le resultat.

**success { }** : execute UNIQUEMENT si tous les stages ont reussi (code retour 0).

**failure { }** : execute UNIQUEMENT si au moins un stage a echoue (code retour != 0).

**always { }** : execute DANS TOUS LES CAS (succes ou echec).

---

## BLOC success — Notification email succes

```groovy
success {
    mail to: 'mn2243d@gmail.com',
         subject: "Jenkins - Build SUCCESS : ${env.JOB_NAME} #${env.BUILD_NUMBER}",
         body: """..."""
}
```

**mail to: '...'** :
- Envoie un EMAIL via le plugin Email Extension de Jenkins.
- to: : adresse email du destinataire.

**subject: "..."** :
- Objet de l email.
- ${env.JOB_NAME} : variable Jenkins = nom du job (ex: portfolio-v6-pipeline).
- ${env.BUILD_NUMBER} : numero du build (ex: 15).

**body: """..."""** :
- Corps de l email en texte multi-lignes (triple guillemets).
- ${env.GIT_COMMIT?.take(7)} : hash court du commit deploye.
- ${env.BUILD_URL} : URL directe vers ce build dans Jenkins.

---

## BLOC always — Etat final des conteneurs

```groovy
always {
    sh 'docker ps --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}" || true'
    echo '=== Fin du pipeline ==='
}
```

**docker ps --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}"** :
- Affiche l etat final de TOUS les conteneurs Docker.
- {{.Names}} : nom du conteneur.
- {{.Status}} : etat (Up, Exited, etc.).
- {{.Ports}} : ports exposes (ex: 0.0.0.0:5000->5000/tcp).
- \\t : tabulation pour aligner les colonnes.
- Execute meme en cas d echec -> permet de diagnostiquer quel conteneur n a pas demarre.

**|| true** : si docker ps echoue (Docker indisponible), ne pas faire echouer ce bloc.

---

## Tableau des variables Jenkins utilisees

| Variable | Valeur exemple | Description |
|---|---|---|
| ${WORKSPACE} | /var/jenkins_home/workspace/portfolio-v6-pipeline | Chemin absolu du workspace |
| ${PROJECT_DIR} | Express_MongoDB_V6 | Definie dans environment { } |
| ${BACKEND_IMAGE} | modoundiaye/portfolio-backend | Definie dans environment { } |
| ${FRONTEND_IMAGE} | modoundiaye/portfolio-frontend | Definie dans environment { } |
| ${env.GIT_COMMIT} | b9442bcb5dd3bd4fb1e41d405165723a09d44a78 | Hash SHA du commit |
| ${env.BUILD_NUMBER} | 15 | Numero du build Jenkins |
| ${env.JOB_NAME} | portfolio-v6-pipeline | Nom du job Jenkins |
| ${env.BUILD_URL} | http://localhost:8080/job/.../15/ | URL du build |

---

## Resume visuel du pipeline

```
git push
    |
    v (webhook GitHub)
Jenkins detecte le push
    |
    v
STAGE 1 : Checkout
  -> git clone depuis GitHub dans /var/jenkins_home/...
    |
    v
STAGE 2 : Verification
  -> docker --version, docker compose version, docker ps
    |
    v
STAGE 3 : Docker Build
  -> docker compose build (backend + frontend)
    |
    v
STAGE 4 : Push Docker Hub
  -> docker login, docker tag, docker push, docker logout
    |
    v
STAGE 5 : Deploiement
  -> docker compose down + docker compose up -d
    |
    v
STAGE 6 : Health Check
  -> docker exec wget sur API (port 5000) + Frontend (port 80)
    |
    v
POST
  -> Email succes/echec + docker ps final
```

---

Document cree pour le projet Portfolio Modou NDIAYE - Express_MongoDB_V6