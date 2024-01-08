<em>A markdown file, updated each Sunday at 8:00pm at the latest. This file should contain a log for each week, showing what was achieved, what is planned for the following week, what are the blockers and risks. Do not drill down in the content details, this is just a status report, but fill it consistently and honestly. In addition, indicate a Red/Yellow/Green flag showing your perception of where you think you are compared to where you think you should be. Each week, you should add the status to this file, on top, with the date, but leave previous week statuses below, do not replace, so you can see the full history in the blink of an eye.</em>

## Week1

### What was achieved
Nous n'avons pas commencé à coder cette semaine, nous avons réfléchi à l'architecture de notre projet en commancant par les premiers scénarios que nous voulons implémenter. Dans architecture.pdf se trouvent donc les shémas de nos scénarios ; l'un représentant une opération simple avec un seul porte monnaie, le second dans lequel il faudrait rechercher, créer et remplir d'autres porte monnaie avec de nouvelles devises.

### What is planned
La semaine prochaine nous définirons les technologies que nous utiliserons ainsi que l'architecture générale du projet.

### What is the difference from last week : /

### What are the blokers and risks : /

### Red/Yellow/Green flag : Yellow

## Week2

### What was achieved
Nous avons défini le diagramme d'architecture du projet ainsi que les technologies que nous utiliserons. 

### What is planned 
La semaine prochaine nous allons donc suivre cette architecture afin de développer le MVP et d'avoir déjà une conversion de monnaie.

### What is the difference from last week 
Nous avons maintenant le diagramme d'architecture.

### What are the blokers and risks : /

### Red/Yellow/Green flag : Yellow

## Week3

### What was achieved
Nous avons mis à jour le diagramme d'architecture suite aux remarques faites en cours, et commencé à coder chacun de notre côté le front, la database avec utilisateurs et comptes, la database avec les transactions effectuées et les appels à la Bourse.

### What is planned
Réunir nos différentes parties afin d'avoir une transaction simple avec conversion la semaine prochaine. 

### What is the difference from last week
Nous avons revu le diagramme d'architecture et vraiment commencé le code.

### What are the blokers and risks
Nous avons du retravailler le diagramme d'architecture ; nous l'avons mis à jour lors de la séance précédente mais nous devrons probablement encore le retravailler.

### Red/Yellow/Green flag : Yellow

## Week4

### What was achieved
V1 du module Transaction avec un mock de la bourse et l'utilisation des taux de changes en direct

### What is planned
Fournir un v1 du module compte et paiement

### What is the difference from last week
Module transaction fonctionnel, modifier le diagramme d'architecture et revu la mise en place des databases.

### What are the blokers and risks
Nous avons eu des problèmes de databases, pour stocker les comptes et utilisateurs.

### Red/Yellow/Green flag : Yellow

## Week6

### What was achieved
Fin des modules Transaction, Payment, Comptes et User

### What is planned
Terminer le projet avec un paiement (et une conversion) de bout en bout

### What is the difference from last week 
Modules Transaction, Payment, Comptes et User

### What are the blokers and risks : /

### Red/Yellow/Green flag : Yellow

## Week7

### What was achieved
Les modules planifiés sont achevés et le scénario suivant est désormais fonctionnel :
 - Lorsqu'un client souhaite effectuer un paiement dans la devise X,
 - Et que son solde dans cette devise est insuffisant : un échange de devises est automatiquement effectué entre ses comptes pour permettre le paiement.
 - Cette opération est réalisée lorsque la bourse est fermée.

Par ailleurs, une interface utilisateur est actuellement en développement.

### What is planned : /

### What is the difference from last week 
Le front est relié aux composants, ajout du paiement "on the fly" et le scénario couvrant est fonctionnel.

### What are the blokers and risks : /

### Red/Yellow/Green flag : Green

## Week8

### What was achieved
Révision du schéma d'architecture selon les Architecture Decision Records (ADR) créés. Des ajustements ont été effectués pour mieux aligner avec les fonctionnalités et les flux de travail proposés pour le système.

### What is planned : /

Commencer le codage des modifications décrites dans les ADR pour mettre à jour l'architecture du système en conséquence.

### What is the difference from last week 
Nous avons maintenant une architecture améliorée par rapport à la semaine dernière, ce qui offre une base plus solide pour le développement.

### What are the blokers and risks : /

### Red/Yellow/Green flag : Yellow

## Week9

### What was achieved
Développement des différents services décrit dans le schéma d'architecture et l'ADR de la semaine précédente.

### What is planned:

Intégrer les services pour la démo.

### What is the difference from last week:

Nouvelle architecture et nouveau flow de données.

### What are the blokers and risks : 

Le principal risque est de prendre trop temps pour intégrer les services et ne pas avoir suffisamment de temps pour régler d'éventuels bugs.

### Red/Yellow/Green flag : Yellow

## Week10

### What was achieved
Nous avions revu l'architecture du projet afin de pouvoir repartir sur de bonnes bases avant de passer à la résilience.

### What is planned 

Améliorer la résilience et tester les flux maintenant que nous avons remis à jour l'architecture.

### What is the difference from last week :

Rien, nous avons privilégié d'autres matières cette semaine.

### What are the blokers and risks :

Le risque actuel serait du prendre du retard étant donné que nous n'avons pas codé cette semaine

### Red/Yellow/Green flag : Yellow

## Week11

### What was achieved

Migration du service transaction_manger en ts, resilience du service transaction_manager (nginx, hot-replica)  
Ajout du cache Redis pour la gestion de la bourse (stock exchange), Mise en place de la gestion et du stockage des simulations de transactions pour trader.

### What is planned

Resilience du service transaction_processor, integration

### What is the difference from last week :

Service transaction_manager avec haute disponibilité

### What are the blokers and risks :

/

### Red/Yellow/Green flag : Green

# Auto évaluation

## AYARI Hadil : 100 points
## GUIBLIN Nicolas : 100 points
## MOVSESSIAN Chahan : 100 points
## PARIS Floriane : 100 points 
