FROM alpine:latest

# Exécution des commandes suivantes en tant qu'utilisateur root
USER root

# Installation de curl
RUN apk add --no-cache curl

# Installation de cronie
RUN apk add --no-cache cronie

# Copie du script dans l'image et mise en place des permissions appropriées
COPY updateSimulatedPayments.sh /updateSimulatedPayments.sh
RUN chmod +x /updateSimulatedPayments.sh

# Copie et configuration du fichier crontab
COPY my-crontab /etc/cron.d/my-crontab
RUN chmod 0644 /etc/cron.d/my-crontab

# Démarrage du service cron
CMD ["crond", "-f"]
