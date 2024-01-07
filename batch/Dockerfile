FROM alpine:latest

# Installation de curl
RUN apk add --no-cache curl

# Installation de cron
RUN apk add --no-cache dcron

# Copie du script dans l'image
COPY deleteRealizedPaymentsFromManager.sh /deleteRealizedPaymentsFromManager.sh
RUN chmod +x /deleteRealizedPaymentsFromManager.sh

# Création d'une entrée cron pour exécuter le script toutes les 2 heures
RUN echo "0 */2 * * * /deleteRealizedPaymentsFromManager.sh" > /etc/crontabs/root

# Démarrage de cron
CMD ["crond", "-f"]
