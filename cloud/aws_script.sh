#!/bin/bash

################## START OF CONFIG PARAMETERS ##################
declare -A conf_parameters=(
["S3_FOLDER_PREFIX"]='"_"'
["DOMAIN_NAME"]='"microting.com"'
["MYSQL_PASSWORD"]='"your_password"'
["MYSQL_USERNAME"]='"tester"'
["S3_KEY"]='"CloudCustomer"'
["S3_SECRET_ID"]='"your_password"'
["AWS_REGION"]='"eu-central-1"'
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

pip install --user awscli
echo 'deb http://www.rabbitmq.com/debian/ testing main' | sudo tee /etc/apt/sources.list.d/rabbitmq.list
wget -O- https://www.rabbitmq.com/rabbitmq-release-signing-key.asc | sudo apt-key add -
apt-get update
apt-get install rabbitmq-server
systemctl enable rabbitmq-server
systemctl start rabbitmq-server

rabbitmqctl add_user admin password 
rabbitmqctl set_user_tags admin administrator
rabbitmqctl set_permissions -p / admin ".*" ".*" ".*"
wget http://localhost:15672/cli/rabbitmqadmin
chmod +x rabbitmqadmin

./rabbitmqadmin declare queue name=eformsdk-input durable=true

wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.asc.gpg
mv microsoft.asc.gpg /etc/apt/trusted.gpg.d/
wget -q https://packages.microsoft.com/config/ubuntu/18.04/prod.list
mv prod.list /etc/apt/sources.list.d/microsoft-prod.list
chown root:root /etc/apt/trusted.gpg.d/microsoft.asc.gpg
chown root:root /etc/apt/sources.list.d/microsoft-prod.list

apt install -y apt-transport-https &&\
apt update &&\
apt install -y dotnet-runtime-2.2 dotnet-sdk-2.2

chown -R ubuntu:ubuntu /var/www

cd /var/www/microting

echo "################## START CLONING ##################"
su ubuntu -c \
"git clone --progress --verbose https://github.com/microting/eform-angular-frontend.git -b stable"
echo "################## END CLONING ##################"

cd eform-angular-frontend/eform-client
npm i -g @angular/cli
su ubuntu -c \
"npm i && npm run build"

cd ../eFormAPI/eFormAPI.Web/
echo "################## START GITVERSION ##################"
export GITVERSION=`git describe --abbrev=0 --tags | cut -d "v" -f 2`
echo $GITVERSION
echo "################## END GITVERSION ##################"
su ubuntu -c \
"dotnet publish -o out /p:Version=$GITVERSION --runtime linux-x64 --configuration Release"

cat > /etc/systemd/system/eform.service << EndOfUnitFile
[Unit]
Description=eForm application
[Service]
WorkingDirectory=/var/www/microting/eform-angular-frontend/eFormAPI/eFormAPI.Web/out
ExecStart=/usr/bin/dotnet /var/www/microting/eform-angular-frontend/eFormAPI/eFormAPI.Web/out/eFormAPI.Web.dll
Restart=always
RestartSec=10
SyslogIdentifier=dotnet-eform-frontend
User=ubuntu
Environment=ASPNETCORE_ENVIRONMENT=Production
[Install]
WantedBy=multi-user.target
EndOfUnitFile

cat > /etc/nginx/sites-available/default << EndOfConfig
server {
    server_name _;
    listen 80;
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade \$http_upgrade;
        proxy_set_header   Connection keep-alive;
        proxy_set_header   Host \$host;
        proxy_cache_bypass \$http_upgrad;
        proxy_set_header   X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto \$scheme;
	proxy_buffer_size   128k;
	proxy_buffers   4 256k;
	proxy_busy_buffers_size   256k;
	fastcgi_buffers 16 16k;
	fastcgi_buffer_size 32k;
    }
}
EndOfConfig

ln -s /var/www/microting/eform-angular-frontend/eform-client/dist /var/www/microting/eform-angular-frontend/eFormAPI/eFormAPI.Web/out/wwwroot

chown -R ubuntu:ubuntu /var/www
