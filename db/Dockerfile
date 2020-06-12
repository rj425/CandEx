from mysql

ENV MYSQL_ROOT_PASSWORD=root

MAINTAINER Rishabh Jain <rishabh.jain@viasat.com>

# Updating local package index
RUN apt-get update -y
RUN apt-get install -y vim 

EXPOSE 3306

# Copying the DB side code into the container
COPY . /candex/db/

# Making the start script exceutable
RUN chmod u+x /candex/db/start.sh

# Entrypoint
CMD cd /candex/db && ./start.sh

