#!/bin/bash

################## START OF CONFIG PARAMETERS ##################
declare -A conf_parameters=(
["S3_SDK_BUCKET"]='"microting-sdk-backup"'
["S3_ANGULAR_BUCKET"]='"microting-angular-backup"'
["S3_ANGULAR_PLUGINS_BUCKET"]='"microting-angular-plugin-backups"'
["S3_CONNECTION_BUCKET"]='"microting-connection-backup"'
["S3_UPLOADED_DATA_FOLDER"]="'microting-uploaded-data'"
["S3_FOLDER_PREFIX"]='""'
["DOMAIN_NAME"]='"microting.com"'
["MYSQL_PASSWORD"]='"your_password"'
["MYSQL_USERNAME"]='"tester"'
["S3_KEY"]='"CloudCustomer"'
["S3_SECRET_ID"]='"your_password"'
["AWS_REGION"]='"eu-central-1"'
["MAX_NUMBER_OF_BACKUPS"]=289
["SHOULD_RESTORE_DATABASE"]=true
["SHOULD_SETUP_DB_BACKUP"]=true
["SHOULD_INSTALL_POSTFIX"]=false
["SHOULD_SETUP_LOCAL_SERVICE"]=true
["IS_PRODUCTION"]=true
["CURRENTUSER"]='"ubuntu"'
["DOTNET_SKIP_FIRST_TIME_EXPERIENCE"]=true
["GENERATE_SOURCEMAP"]=false
)
# WRITE CONFIG FILE
mkdir -p /var/www/microting
for conf_param in "${!conf_parameters[@]}"; do echo "export $conf_param=${conf_parameters["$conf_param"]}" >> /var/www/microting/openstack.conf; done
##################  END OF CONFIG PARAMETERS  ##################

# LOAD CONFIG
source /var/www/microting/openstack.conf

echo "################## BASIC SETUP ##################"

#apt-get -y install software-properties-common unzip
#apt-key adv --recv-keys --keyserver hkp://keyserver.ubuntu.com:80 0xF1656F24C74CD1D8
#add-apt-repository 'deb [arch=amd64,arm64,ppc64el] http://mirror.one.com/mariadb/repo/10.3/ubuntu bionic main'

#apt update

#debconf-set-selections <<< "mariadb-server-10.3 mysql-server/root_password password "$MYSQL_PASSWORD
#debconf-set-selections <<< "mariadb-server-10.3 mysql-server/root_password_again password "$MYSQL_PASSWORD

#apt-get -y install mariadb-server nginx curl python-pip

#mysql -uroot --password=$MYSQL_PASSWORD <<MYSQL_SCRIPT
#CREATE USER '$MYSQL_USERNAME'@'%' IDENTIFIED BY '$MYSQL_PASSWORD';
#GRANT ALL PRIVILEGES ON *.* TO '$MYSQL_USERNAME'@'%';
#MYSQL_SCRIPT

#curl -sL https://deb.nodesource.com/setup_11.x | sudo bash -
#apt install -y nodejs

#echo 'deb http://www.rabbitmq.com/debian/ testing main' | sudo tee /etc/apt/sources.list.d/rabbitmq.list
#wget -O- https://www.rabbitmq.com/rabbitmq-release-signing-key.asc | sudo apt-key add -
#apt-get update
#apt-get install rabbitmq-server
#systemctl enable rabbitmq-server
#systemctl start rabbitmq-server

rabbitmqctl add_user admin password
rabbitmqctl set_user_tags admin administrator
rabbitmqctl set_permissions -p / admin ".*" ".*" ".*"
./rabbitmqadmin declare queue name=eformsdk-input durable=true
#wget http://localhost:15672/cli/rabbitmqadmin
#chmod +x rabbitmqadmin

#./rabbitmqadmin declare queue name=eformsdk-input durable=true

#wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.asc.gpg
#mv microsoft.asc.gpg /etc/apt/trusted.gpg.d/
#wget -q https://packages.microsoft.com/config/ubuntu/18.04/prod.list
#mv prod.list /etc/apt/sources.list.d/microsoft-prod.list
#chown root:root /etc/apt/trusted.gpg.d/microsoft.asc.gpg
#chown root:root /etc/apt/sources.list.d/microsoft-prod.list

#apt install -y apt-transport-https &&\
#apt update &&\
#apt install -y dotnet-runtime-2.2 dotnet-sdk-2.2

chown -R ubuntu:ubuntu /var/www

cd /var/www/microting

echo "################## START CLONING ##################"
su ubuntu -c \
"git clone --progress --verbose https://github.com/microting/eform-angular-frontend.git -b stable"
echo "################## END CLONING ##################"

eform-angular-frontend/cloud/aws_script_step2.sh
