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

if [ $SHOULD_SETUP_DB_BACKUP = true ]
    then
    echo '############# SETTING UP HOURLY BACKUP #############'
    echo '#!/bin/bash' >> /root/backup-mysql-hourly.sh
    echo "source /var/www/microting/openstack.conf" >> /root/backup-mysql-hourly.sh
    echo 'export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin' >> /root/backup-mysql-hourly.sh
    echo 'HOST=localhost' >> /root/backup-mysql-hourly.sh
    echo 'USER=root' >> /root/backup-mysql-hourly.sh
    echo 'PASS=MYSQL_PASSWORD' >> /root/backup-mysql-hourly.sh
    sed -i "s/MYSQL_PASSWORD/$MYSQL_PASSWORD/g" /root/backup-mysql-hourly.sh
		
    echo '' >> /root/backup-mysql-hourly.sh
    echo 'FILENAME=`date "+backup-%Y-%m-%d-%H-%M.sql"`' >> /root/backup-mysql-hourly.sh
    echo '' >> /root/backup-mysql-hourly.sh
    echo 'DATABASE_NAME="${S3_FOLDER_PREFIX}_SDK"' >> /root/backup-mysql-hourly.sh
    echo '/usr/bin/mysqldump --host=$HOST --user=$USER --password=$PASS $DATABASE_NAME | gzip > $FILENAME.gz' >> /root/backup-mysql-hourly.sh
    echo 'aws s3 cp $FILENAME.gz s3://$S3_SDK_BUCKET/$S3_FOLDER_PREFIX/$FILENAME.gz' >> /root/backup-mysql-hourly.sh
    echo 'rm $FILENAME.gz' >> /root/backup-mysql-hourly.sh
        
    echo '' >> /root/backup-mysql-hourly.sh
    echo 'export DATABASE_NAME=$S3_SDK_BUCKET/$S3_FOLDER_PREFIX' >> /root/backup-mysql-hourly.sh
    echo 'export NUM_BACKUPS=`aws s3 ls "${DATABASE_NAME}/" | wc -l`' >> /root/backup-mysql-hourly.sh
    echo 'echo "Checking backup status for $DATABASE_NAME/"' >> /root/backup-mysql-hourly.sh
    echo 'echo "Current number of backups : $NUM_BACKUPS max is $MAX_NUMBER_OF_BACKUPS"' >> /root/backup-mysql-hourly.sh
    echo 'while (( $NUM_BACKUPS > $MAX_NUMBER_OF_BACKUPS ))' >> /root/backup-mysql-hourly.sh
    echo 'do' >> /root/backup-mysql-hourly.sh
    echo 'CURRENT_BACKUP_TO_DELETE=`aws s3 ls $DATABASE_NAME/ | grep backup | awk '\'{print \$4}\'' | head -1`' >> /root/backup-mysql-hourly.sh
    echo 'echo "SHOULD DELETE $CURRENT_BACKUP_TO_DELETE."' >> /root/backup-mysql-hourly.sh
    echo 'aws s3 rm s3://$DATABASE_NAME/$CURRENT_BACKUP_TO_DELETE' >> /root/backup-mysql-hourly.sh
    echo 'NUM_BACKUPS=`aws s3 ls "${DATABASE_NAME}/" | wc -l`' >> /root/backup-mysql-hourly.sh
    echo 'echo "New number of backups : $NUM_BACKUPS max is $MAX_NUMBER_OF_BACKUPS"' >> /root/backup-mysql-hourly.sh
    echo 'done' >> /root/backup-mysql-hourly.sh
    echo 'echo "Done cleanup backup for $DATABASE_NAME"' >> /root/backup-mysql-hourly.sh

    echo '' >> /root/backup-mysql-hourly.sh
    echo 'DATABASE_NAME="${S3_FOLDER_PREFIX}_Angular"' >> /root/backup-mysql-hourly.sh
    echo '/usr/bin/mysqldump --host=$HOST --user=$USER --password=$PASS $DATABASE_NAME | gzip > $FILENAME.gz' >> /root/backup-mysql-hourly.sh
    echo 'aws s3 cp $FILENAME.gz s3://$S3_ANGULAR_BUCKET/$S3_FOLDER_PREFIX/$FILENAME.gz' >> /root/backup-mysql-hourly.sh
    echo 'rm $FILENAME.gz' >> /root/backup-mysql-hourly.sh
    
    echo '' >> /root/backup-mysql-hourly.sh
    echo 'export DATABASE_NAME=$S3_ANGULAR_BUCKET/$S3_FOLDER_PREFIX' >> /root/backup-mysql-hourly.sh
    echo 'export NUM_BACKUPS=`aws s3 ls "${DATABASE_NAME}/" | wc -l`' >> /root/backup-mysql-hourly.sh
    echo 'echo "Checking backup status for $DATABASE_NAME/"' >> /root/backup-mysql-hourly.sh
    echo 'echo "Current number of backups : $NUM_BACKUPS max is $MAX_NUMBER_OF_BACKUPS"' >> /root/backup-mysql-hourly.sh
    echo 'while (( $NUM_BACKUPS > $MAX_NUMBER_OF_BACKUPS ))' >> /root/backup-mysql-hourly.sh
    echo 'do' >> /root/backup-mysql-hourly.sh
    echo 'CURRENT_BACKUP_TO_DELETE=`aws s3 ls $DATABASE_NAME/ | grep backup | awk '\'{print \$4}\'' | head -1`' >> /root/backup-mysql-hourly.sh
    echo 'echo "SHOULD DELETE $CURRENT_BACKUP_TO_DELETE."' >> /root/backup-mysql-hourly.sh
    echo 'aws s3 rm s3://$DATABASE_NAME/$CURRENT_BACKUP_TO_DELETE' >> /root/backup-mysql-hourly.sh
    echo 'NUM_BACKUPS=`aws s3 ls "${DATABASE_NAME}/" | wc -l`' >> /root/backup-mysql-hourly.sh
    echo 'echo "New number of backups : $NUM_BACKUPS max is $MAX_NUMBER_OF_BACKUPS"' >> /root/backup-mysql-hourly.sh
    echo 'done' >> /root/backup-mysql-hourly.sh
    echo 'echo "Done cleanup backup for $DATABASE_NAME"' >> /root/backup-mysql-hourly.sh

    echo '' >> /root/backup-mysql-hourly.sh
		echo "cd /var/www/microting/eform-angular-frontend/eFormAPI/eFormAPI.Web/out/" >> /root/backup-mysql-hourly.sh
		echo 'aws s3 cp connection.json s3://"$S3_CONNECTION_BUCKET/${S3_FOLDER_PREFIX}/"' >> /root/backup-mysql-hourly.sh
		
    echo '' >> /root/backup-mysql-hourly.sh
		echo "cd /var/www/microting" >> /root/backup-mysql-hourly.sh
		echo "rm /var/www/microting/plugins-installed.txt" >> /root/backup-mysql-hourly.sh
		echo "for D in *;" >> /root/backup-mysql-hourly.sh
		echo "do" >> /root/backup-mysql-hourly.sh
		echo 'if [ -d "${D}" ]; then' >> /root/backup-mysql-hourly.sh
		echo 'if [ $D != "eform-angular-frontend" ]; then' >> /root/backup-mysql-hourly.sh
		echo 'if [ $D != "eform-debian-service" ]; then' >> /root/backup-mysql-hourly.sh
    echo 'if [[ $D == *"eform-angular"* ]]; then' >> /root/backup-mysql-hourly.sh
		echo 'echo "${D}" >> /var/www/microting/plugins-installed.txt' >> /root/backup-mysql-hourly.sh
		
		echo 'while read plugin; do' >> /root/backup-mysql-hourly.sh		
		echo 'DATABASE_NAME="${S3_FOLDER_PREFIX}_$plugin"' >> /root/backup-mysql-hourly.sh
    echo '/usr/bin/mysqldump --host=$HOST --user=$USER --password=$PASS $DATABASE_NAME | gzip > $FILENAME.gz' >> /root/backup-mysql-hourly.sh
    echo 'aws s3 cp $FILENAME.gz s3://$S3_ANGULAR_PLUGINS_BUCKET/$S3_FOLDER_PREFIX/$plugin/$FILENAME.gz' >> /root/backup-mysql-hourly.sh
    echo 'rm $FILENAME.gz' >> /root/backup-mysql-hourly.sh

    echo 'export DATABASE_NAME=$S3_ANGULAR_PLUGINS_BUCKET/$S3_FOLDER_PREFIX/$plugin' >> /root/backup-mysql-hourly.sh
    echo 'export NUM_BACKUPS=`aws s3 ls "${DATABASE_NAME}/" | wc -l`' >> /root/backup-mysql-hourly.sh
    echo 'echo "Checking backup status for $DATABASE_NAME/"' >> /root/backup-mysql-hourly.sh
    echo 'echo "Current number of backups : $NUM_BACKUPS max is $MAX_NUMBER_OF_BACKUPS"' >> /root/backup-mysql-hourly.sh
    echo 'while (( $NUM_BACKUPS > $MAX_NUMBER_OF_BACKUPS ))' >> /root/backup-mysql-hourly.sh
    echo 'do' >> /root/backup-mysql-hourly.sh
    echo 'CURRENT_BACKUP_TO_DELETE=`aws s3 ls $DATABASE_NAME/ | grep backup | awk '\'{print \$4}\'' | head -1`' >> /root/backup-mysql-hourly.sh
    echo 'echo "SHOULD DELETE $CURRENT_BACKUP_TO_DELETE."' >> /root/backup-mysql-hourly.sh
    echo 'aws s3 rm s3://$DATABASE_NAME/$CURRENT_BACKUP_TO_DELETE' >> /root/backup-mysql-hourly.sh
    echo 'NUM_BACKUPS=`aws s3 ls "${DATABASE_NAME}/" | wc -l`' >> /root/backup-mysql-hourly.sh
    echo 'echo "New number of backups : $NUM_BACKUPS max is $MAX_NUMBER_OF_BACKUPS"' >> /root/backup-mysql-hourly.sh
    echo 'done' >> /root/backup-mysql-hourly.sh
    echo 'echo "Done cleanup backup for $DATABASE_NAME"' >> /root/backup-mysql-hourly.sh				
		echo 'done <plugins-installed.txt' >> /root/backup-mysql-hourly.sh						
		
		echo 'fi' >> /root/backup-mysql-hourly.sh
		echo "fi" >> /root/backup-mysql-hourly.sh
		echo "fi" >> /root/backup-mysql-hourly.sh
		echo "fi" >> /root/backup-mysql-hourly.sh
		echo "done" >> /root/backup-mysql-hourly.sh
		echo "cat /var/www/microting/plugins-installed.txt" >> /root/backup-mysql-hourly.sh
		echo "cd /var/www/microting/" >> /root/backup-mysql-hourly.sh
		
    echo '' >> /root/backup-mysql-hourly.sh
		echo 'aws s3 cp plugins-installed.txt s3://"$S3_CONNECTION_BUCKET/${S3_FOLDER_PREFIX}/"' >> /root/backup-mysql-hourly.sh
    
    echo '' >> /root/backup-mysql-hourly.sh
		echo "cd /var/www/microting" >> /root/backup-mysql-hourly.sh
		echo "rm /var/www/microting/service-plugins-installed.txt" >> /root/backup-mysql-hourly.sh
		echo "for D in *;" >> /root/backup-mysql-hourly.sh
		echo "do" >> /root/backup-mysql-hourly.sh
		echo 'if [ -d "${D}" ]; then' >> /root/backup-mysql-hourly.sh
		echo 'if [ $D != "eform-angular-frontend" ]; then' >> /root/backup-mysql-hourly.sh
		echo 'if [ $D != "eform-debian-service" ]; then' >> /root/backup-mysql-hourly.sh
    echo 'if [[ $D == *"eform-service"* ]]; then' >> /root/backup-mysql-hourly.sh
		echo 'echo "${D}" >> /var/www/microting/service-plugins-installed.txt' >> /root/backup-mysql-hourly.sh		
		echo 'fi' >> /root/backup-mysql-hourly.sh
		echo "fi" >> /root/backup-mysql-hourly.sh
		echo "fi" >> /root/backup-mysql-hourly.sh
		echo "fi" >> /root/backup-mysql-hourly.sh
		echo "done" >> /root/backup-mysql-hourly.sh
		echo "cat /var/www/microting/service-plugins-installed.txt" >> /root/backup-mysql-hourly.sh
		echo "cd /var/www/microting/" >> /root/backup-mysql-hourly.sh
		
    echo '' >> /root/backup-mysql-hourly.sh
		echo 'aws s3 cp service-plugins-installed.txt s3://"$S3_CONNECTION_BUCKET/${S3_FOLDER_PREFIX}/"' >> /root/backup-mysql-hourly.sh
		
    echo '############# DONE SETTING UP HOURLY BACKUP #############'

		chmod +x /root/backup-mysql-hourly.sh	
fi

if [ $SHOULD_RESTORE_DATABASE = true ]
	then
	cd /var/www/microting/
	export DATABASE_NAME="${S3_FOLDER_PREFIX}_SDK"
	export DOWNLOAD_PATH="$S3_SDK_BUCKET/$S3_FOLDER_PREFIX/"

	export LAST_BACKUP=`aws s3 ls $DOWNLOAD_PATH | tail -1 | grep backup | head -1 | awk '{print $4}'`
	aws s3 cp s3://"$DOWNLOAD_PATH"$LAST_BACKUP $LAST_BACKUP
	gunzip $LAST_BACKUP
	export LAST_BACKUP=`expr substr $LAST_BACKUP 1 27`
	echo "Creating DB"
	`time mysql -u $MYSQL_USERNAME --password=$MYSQL_PASSWORD -e "create database $DATABASE_NAME"`
	echo "Restoring db from backup"
	`time mysql -u $MYSQL_USERNAME --password=$MYSQL_PASSWORD $DATABASE_NAME < $LAST_BACKUP`
	echo "Restore complete"
	rm $LAST_BACKUP
	
	export DATABASE_NAME="${S3_FOLDER_PREFIX}_Angular"
	export DOWNLOAD_PATH="$S3_ANGULAR_BUCKET/$S3_FOLDER_PREFIX/"

	export LAST_BACKUP=`aws s3 ls $DOWNLOAD_PATH | tail -1 | grep backup | head -1 | awk '{print $4}'`
	aws s3 cp s3://"$DOWNLOAD_PATH"$LAST_BACKUP $LAST_BACKUP
	gunzip $LAST_BACKUP
	export LAST_BACKUP=`expr substr $LAST_BACKUP 1 27`
	echo "Creating DB"
	`time mysql -u $MYSQL_USERNAME --password=$MYSQL_PASSWORD -e "create database $DATABASE_NAME"`
	echo "Restoring db from backup"
	`time mysql -u $MYSQL_USERNAME --password=$MYSQL_PASSWORD $DATABASE_NAME < $LAST_BACKUP`
	echo "Restore complete"
	rm $LAST_BACKUP
  
  aws s3 cp s3://"$S3_CONNECTION_BUCKET/${S3_FOLDER_PREFIX}/connection.json" connection.json
  
	mv connection.json /var/www/microting/eform-angular-frontend/eFormAPI/eFormAPI.Web/out/
	chown ubuntu:ubuntu /var/www/microting/eform-angular-frontend/eFormAPI/eFormAPI.Web/out/connection.json
	
  aws s3 cp s3://"$S3_CONNECTION_BUCKET/${S3_FOLDER_PREFIX}/plugins-installed.txt" plugins-installed.txt
	
  while read plugin; do
    cd /var/www/microting/
    su ubuntu -c \
      "git clone https://github.com/microting/$plugin.git -b stable"
    echo "$p"
    chmod +x /var/www/microting/$plugin/install.sh
    /var/www/microting/$plugin/install.sh

    export DATABASE_NAME="${S3_FOLDER_PREFIX}_$plugin"
	  export DOWNLOAD_PATH="$S3_ANGULAR_BUCKET/$S3_FOLDER_PREFIX/$plugin/"

  	export LAST_BACKUP=`aws s3 ls $DOWNLOAD_PATH | tail -1 | grep backup | head -1 | awk '{print $4}'`
    aws s3 cp s3://"$DOWNLOAD_PATH"$LAST_BACKUP $LAST_BACKUP
    gunzip $LAST_BACKUP
    export LAST_BACKUP=`expr substr $LAST_BACKUP 1 27`
    echo "Creating DB"
    `time mysql -u $MYSQL_USERNAME --password=$MYSQL_PASSWORD -e "create database $DATABASE_NAME"`
    echo "Restoring db from backup"
    `time mysql -u $MYSQL_USERNAME --password=$MYSQL_PASSWORD $DATABASE_NAME < $LAST_BACKUP`
    echo "Restore complete"
    rm $LAST_BACKUP    
    
    echo "Done restoring backup for $plugin"
  done <plugins-installed.txt
  
  mkdir -p /var/www/microting/eform-angular-frontend/eFormAPI/eFormAPI.Web/out/output/datafolder/reports/templates/zip-archives 
  cd /var/www/microting/eform-angular-frontend/eFormAPI/eFormAPI.Web/out/output/datafolder/reports/templates/zip-archives
  
	export REPORTSFOLDER="$S3_UPLOADED_DATA_FOLDER/$PREFIX_S3_FOLDER/"
#	export REPORTSFOLDER+=uploaded_data
  export REPORTS=`aws s3 ls $REPORTSFOLDER | grep .zip`
  for one_thing in $REPORTS; do
    export FOLDER=`echo $one_thing | cut -d "_" -f 1`
    echo $FOLDER
    mkdir -p /var/www/microting/eform-angular-frontend/eFormAPI/eFormAPI.Web/out/output/datafolder/reports/templates/$FOLDER

    mkdir -p /var/www/microting/eform-angular-frontend/eFormAPI/eFormAPI.Web/out/output/datafolder/reports/templates/zip-archives/$FOLDER
    cd /var/www/microting/eform-angular-frontend/eFormAPI/eFormAPI.Web/out/output/datafolder/reports/templates/zip-archives/$FOLDER
    aws s3 cp s3://$REPORTSFOLDER/$PREFIX_S3_FOLDER/$one_thing $one_thing
    unzip $one_thing -d /var/www/microting/eform-angular-frontend/eFormAPI/eFormAPI.Web/out/output/datafolder/reports/templates/$FOLDER/
    echo $one_thing | cut -d "_" -f 1
    echo $one_thing | cut -d "_" -f 2
  done
	
  chown -R ubuntu:ubuntu /var/www/microting/eform-angular-frontend/eFormAPI/eFormAPI.Web/out/output/
  
  echo "Done checking and cleaning backups"
fi

systemctl daemon-reload
systemctl enable eform.service
systemctl start eform.service
nginx -s reload

if [ $SHOULD_SETUP_LOCAL_SERVICE = true ]
then
	cd /var/www/microting
su ubuntu -c \
"git clone https://github.com/microting/eform-debian-service.git -b stable"
	cd /var/www/microting/eform-debian-service
	
	export GITVERSION=`git describe --abbrev=0 --tags | cut -d "v" -f 2`
	echo $GITVERSION
su ubuntu -c \
"dotnet publish -o out /p:Version=$GITVERSION --runtime linux-x64 --configuration Release"
	
	cp /var/www/microting/eform-angular-frontend/eFormAPI/eFormAPI.Web/out/connection.json /var/www/microting/eform-debian-service/MicrotingService/out/  
  
	aws s3 cp s3://"$S3_CONNECTION_BUCKET/${S3_FOLDER_PREFIX}/service-plugins-installed.txt" service-plugins-installed.txt
  while read plugin; do
    cd /var/www/microting/
    su ubuntu -c \
      "git clone https://github.com/microting/$plugin.git -b stable"
    echo "Restoring $p"
    chmod +x /var/www/microting/$plugin/install.sh
    /var/www/microting/$plugin/install.sh
  done <service-plugins-installed.txt
	
cat > /etc/systemd/system/eformbackend.service << EndOfUnitFile
[Unit]
Description=eForm service application
[Service]
WorkingDirectory=/var/www/microting/eform-debian-service/MicrotingService/out
ExecStart=/usr/bin/dotnet /var/www/microting/eform-debian-service/MicrotingService/out/MicrotingService.dll
Restart=always
RestartSec=10
slogIdentifier=dotnet-eform-backend
User=ubuntu
Environment=ASPNETCORE_ENVIRONMENT=Production
[Install]
WantedBy=multi-user.target
EndOfUnitFile
systemctl daemon-reload
systemctl enable eformbackend.service
systemctl start eformbackend.service
	
fi
echo "################## END SERVICE SETUP ##################"

VAR=$(shuf -i 1-50 -n 1)
echo "$VAR * * * * root /root/backup-mysql-hourly.sh" >> /etc/cron.d/eform-backup
