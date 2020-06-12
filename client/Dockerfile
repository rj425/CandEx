# Base Image
FROM ubuntu:latest

MAINTAINER Rishabh Jain <rishabh.jain@viasat.com>

# Setting the right time zone
ENV TZ=Asia/Kolkata
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Update the local package index
RUN apt-get update --fix-missing

# Installing other packages
RUN apt-get install -y nano wget dialog net-tools curl vim iputils-ping git

# Download and install nginx
RUN apt-get install -y nginx

# Downloading and installing Node
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs

# Installing @angular/cli
RUN npm install -g @angular/cli@latest

# Copying the application from host to container
COPY . /candex/client/

# Installing all the client dependencies
RUN cd /candex/client/; npm install

# Creating application build
RUN cd /candex/client/; ng build --prod

# Copying application build
RUN cp -rv /candex/client/dist/* /usr/share/nginx/html/

# Remove the default Nginx configuration file
RUN rm -v /etc/nginx/nginx.conf

# Copy a configuration file from the current directory
ADD nginx.conf /etc/nginx/

# Expose ports
EXPOSE 80
EXPOSE 443

# Set the default command to execute when creating a new container
CMD service nginx start
