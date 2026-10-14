FROM php:8.4-fpm-alpine
RUN apk add --no-cache postgresql-dev \
 && docker-php-ext-install pdo_pgsql
WORKDIR /var/www/app
