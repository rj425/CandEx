# Base Image
FROM ubuntu:latest

MAINTAINER Rishabh Jain <rishabh.jain@viasat.com>

# Setting the Right timezone
ENV TZ=Asia/Kolkata
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Updating local package index
RUN apt-get update -y
RUN apt-get upgrade -y --fix-missing

# Installing other packages
RUN apt-get install -y cron vim python python-dev python-pip python-mysqldb iputils-ping git
RUN apt-get install -y libxml2-dev libxslt-dev libffi-dev libssl-dev
RUN apt-get install -y libxslt1-dev antiword unrtf poppler-utils pstotext tesseract-ocr flac ffmpeg lame libmad0 libsox-fmt-mp3 sox libjpeg-dev swig libpulse-dev
RUN pip install textract

# Download and install uwsgi
RUN pip install uwsgi

# Download and install nginx
RUN apt-get install -y nginx

# Installing Maria DB packages
RUN apt-key adv --recv-keys --keyserver hkp://keyserver.ubuntu.com:80 0xF1656F24C74CD1D8
RUN apt-get update -y
RUN apt-get install -y mariadb-server
RUN service mysql start

# Installing Django
RUN pip install django==1.11
RUN pip install djangorestframework
RUN pip install django-cors-headers
RUN pip install django-filter
RUN pip install django-sslserver
RUN pip install markdown

# Installing Sphinx
RUN apt-get install -y sphinxsearch

# Installing textract
RUN apt-get install -y libxml2-dev libxslt1-dev antiword unrtf poppler-utils pstotext tesseract-ocr flac ffmpeg lame libmad0 libsox-fmt-mp3 sox libjpeg-dev swig libpulse-dev
RUN pip install textract 

# Copying the server side code into the container
COPY . /candex/server/

# Remove the default Nginx configuration file
RUN rm -v /etc/nginx/nginx.conf

# Copy a configuration file from the current directory
ADD nginx.conf /etc/nginx/

# Port for server app
EXPOSE 8000

# Making the start script exceutable
RUN chmod u+x /candex/server/start.sh

# Entrypoint
CMD cd /candex/server && ./start.sh
