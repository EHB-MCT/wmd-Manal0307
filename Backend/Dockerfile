FROM php:8.3-apache
# System deps
RUN apt-get update \
  && apt-get install -y git unzip libzip-dev libpng-dev libonig-dev \
  && docker-php-ext-install pdo_mysql zip gd
# Apache config
RUN a2enmod rewrite
# Composer
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer
# Set working dir and Laravel public as DocumentRoot
WORKDIR /var/www/html
# Configure Apache to serve /public
RUN sed -i 's#DocumentRoot /var/www/html#DocumentRoot /var/www/html/public#g' \
  /etc/apache2/sites-available/000-default.conf \
  && sed -i 's#<Directory /var/www/>#<Directory /var/www/html/public/>#' \
     /etc/apache2/apache2.conf \
  && echo "<Directory /var/www/html/public/>\n AllowOverride All\n</Directory>" >> /etc/apache2/apache2.conf