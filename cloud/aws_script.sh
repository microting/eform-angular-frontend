#!/bin/bash

################## START OF CONFIG PARAMETERS ##################
declare -A conf_parameters=(
["S3_FOLDER_PREFIX"]='"_"'
["DOMAIN_NAME"]='"microting.com"'
["MYSQL_PASSWORD"]='"your_password"'
["MYSQL_USERNAME"]='"tester"'
["S3_KEY"]='"CloudCustomer"'
["S3_SECRET_ID"]='"your_password"'
["S3_ENDPOINT"]='"http://172.16.4.4:5000/v2.0/"'
["MAX_NUMBER_OF_BACKUPS"]=288
["SHOULD_RESTORE_DATABASE"]=true
["SHOULD_SETUP_DB_BACKUP"]=true
["SHOULD_INSTALL_POSTFIX"]=false
["IS_PRODUCTION"]=true
["CURRENTUSER"]='"ubuntu"'
["DOTNET_SKIP_FIRST_TIME_EXPERIENCE"]=true
)
# WRITE CONFIG FILE
mkdir -p /var/www/microting
for conf_param in "${!conf_parameters[@]}"; do echo "export $conf_param=${conf_parameters["$conf_param"]}" >> /var/www/microting/openstack.conf; done
##################  END OF CONFIG PARAMETERS  ##################

# LOAD CONFIG
source /var/www/microting/openstack.conf

echo "################## BASIC SETUP ##################"

apt-get -y install software-properties-common unzip
apt-key adv --recv-keys --keyserver hkp://keyserver.ubuntu.com:80 0xF1656F24C74CD1D8
add-apt-repository 'deb [arch=amd64,arm64,ppc64el] http://mirror.one.com/mariadb/repo/10.3/ubuntu bionic main'

#apt update

debconf-set-selections <<< "mariadb-server-10.3 mysql-server/root_password password "$MYSQL_PASSWORD
debconf-set-selections <<< "mariadb-server-10.3 mysql-server/root_password_again password "$MYSQL_PASSWORD

apt-get -y install mariadb-server nginx curl python-pip python-swiftclient

mysql -uroot --password=$MYSQL_PASSWORD <<MYSQL_SCRIPT
CREATE USER '$MYSQL_USERNAME'@'%' IDENTIFIED BY '$MYSQL_PASSWORD';
GRANT ALL PRIVILEGES ON *.* TO '$MYSQL_USERNAME'@'%';
MYSQL_SCRIPT

curl -sL https://deb.nodesource.com/setup_11.x | sudo bash -
apt install -y nodejs

rabbitmqctl add_user admin password 
rabbitmqctl set_user_tags admin administrator
rabbitmqctl set_permissions -p / admin ".*" ".*" ".*"
wget http://localhost:15672/cli/rabbitmqadmin
chmod +x rabbitmqadmin

./rabbitmqadmin declare queue name=eformsdk-input durable=true