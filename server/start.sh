# Installing candex batch jobs
(crontab -l ; echo '*/5 * * * * cd /candex/server;/usr/bin/python manage.py candexDBUpdate') | crontab -
(crontab -l ; echo '0 5 * * * cd /candex/server;/usr/bin/python manage.py candexReminders') | crontab -
cron

# Adding smptp host to /etc/hosts
echo "10.8.202.53     vcasmtp.hq.corp.viasat.com" >> /etc/hosts

# Migrating Databases
cd /candex/server/
chmod a+x manage.py
python manage.py makemigrations
python manage.py migrate
python manage.py migrate --database=candexresumes

# Collecting static files
python manage.py collectstatic

mysqlUser="root"
mysqlPass="root"
# Use host="127.0.0.1" for running locally
host="10.137.89.7"

# Importing email templates dump
mysql --host=${host} --user=${mysqlUser} --password=${mysqlPass} candex < /candex/server/emailTemplates.sql

# Copying Sphinx Configuration file to /etc/sphinxsearch/sphinx.conf
cp /candex/server/sphinx.conf /etc/sphinxsearch/sphinx.conf

# Initial Indexing
indexer candexresumes --rotate

# Changing start var to YES
sed -i 's/START=no/START=yes/g' /etc/default/sphinxsearch

# Starting the sphinx daemon
service sphinxsearch start
service sphinxsearch status

# Running uWSGI server
cd /candex/server/
uwsgi --ini uwsgi.ini &

# Running nginx
service nginx start

/bin/bash
