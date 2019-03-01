#!/bin/bash

################## START OF CONFIG PARAMETERS ##################
export INSTANCE_PROJECT_NAME=""
export DATABASE_NAME=""
export SWIFT_FOLDER_NAME=""
export MAX_NUMBER_OF_BACKUPS=288
export SHOULD_RESTORE_DATABASE=true
export SHOULD_SETUP_DB_BACKUP=true
export SHOULD_INSTALL_POSTFIX=true
export DOMAIN_NAME=""
export RELAY_HOST=""
##################  END OF CONFIG PARAMETERS  ##################

echo "################## BASIC SETUP ##################"
export DEBIAN_FRONTEND=noninteractive
export EC2_INSTANCE_ID=`curl --insecure http://169.254.169.254/openstack/2012-08-10/meta_data.json | cut -d '"' -f 4`
echo $EC2_INSTANCE_ID
export INSTANCE_HOSTNAME=`hostname`
if [ $SHOULD_INSTALL_POSTFIX = true ]
    then
    debconf-set-selections <<< "postfix postfix/mailname string $INSTANCE_HOSTNAME.$DOMAIN_NAME"
    debconf-set-selections <<< "postfix postfix/main_mailer_type string 'Internet Site'"
    apt-get install -y postfix
    sed -i "s/smtpd_use_tls=yes/smtpd_use_tls=no/g" /etc/postfix/main.cf
    sed -i "s/relayhost =/relayhost = $RELAY_HOST/g" /etc/postfix/main.cf
    sed -i "s/.$DOMAIN_NAME/$INSTANCE_HOSTNAME.$DOMAIN_NAME/g" /etc/postfix/main.cf
    sed -i "s/openstacklocal/$DOMAIN_NAME/g" /etc/postfix/main.cf
    echo "message_size_limit = 0" >> /etc/postfix/main.cf
    service postfix restart
fi
#sed -i -r 's/RREPLACE_M_CLOUD_DATA/#RREPLACE_M_CLOUD_DATA/' /opt/monit/conf/monitrc


export INSTANCE_IP=`ip address show eth0 | grep "inet " | cut -d " " -f6 | cut -d "/" -f1`
echo $INSTANCE_IP
echo $INSTANCE_HOSTNAME
echo "$INSTANCE_IP $INSTANCE_HOSTNAME" >> /etc/hosts
#sed -i "s/SERVER_NAME_REPLACE_ME/$INSTANCE_IP/g" /opt/nginx/conf/nginx.conf # > /opt/nginx/conf/nginx.conf



wget https://raw.githubusercontent.com/microting/eform-angular-frontend/master/install.sh
chmod +x install.sh
./install.sh --port=80 --hostname=_ --launch-env=Production --username=ubuntu --ssl --silent


debconf-set-selections <<< 'mysql-server mysql-server/root_password password your_password'
debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password your_password'

apt-get -y install mysql-server

if [ $SHOULD_SETUP_DB_BACKUP = true ]
    then
    echo '############# SETTING UP HOURLY BACKUP #############'
    echo 'export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/local/rvm/bin' >> /root/backup-mysql-hourly.sh
    echo 'HOST=localhost' >> /root/backup-mysql-hourly.sh
    echo 'USER=root' >> /root/backup-mysql-hourly.sh
    echo 'PASS=your_password' >> /root/backup-mysql-hourly.sh
    echo 'DATABASE=DATABASE_NAME' >> /root/backup-mysql-hourly.sh
    sed -i "s/DATABASE_NAME/$DATABASE_NAME/g" /root/backup-mysql-hourly.sh
    echo '' >> /root/backup-mysql-hourly.sh
    echo 'FILENAME=`date "+backup-%Y-%m-%d-%H-%M.sql.gz"`' >> /root/backup-mysql-hourly.sh
    echo '' >> /root/backup-mysql-hourly.sh
    echo '/usr/bin/mysqldump --host=$HOST --user=$USER --pass=$PASS $DATABASE | gzip > $FILENAME' >> /root/backup-mysql-hourly.sh
    echo 'swift upload SWIFT_FOLDER_NAME $FILENAME.gz' >> /root/backup-mysql-hourly.sh
    sed -i "s/SWIFT_FOLDER_NAME/$SWIFT_FOLDER_NAME/g" /root/backup-mysql-hourly.sh
    echo 'rm $FILENAME.gz' >> /root/backup-mysql-hourly.sh
    echo '############# DONE SETTING UP HOURLY BACKUP #############'
fi

if [ $SHOULD_RESTORE_DATABASE = true ]
	then
	export OS_USERNAME=admin
	export OS_TENANT_NAME=admin
	export OS_PASSWORD=your_passowrd
	export OS_AUTH_URL=http://172.16.4.4:5000/v2.0/
	export OS_NO_CACHE=1

	export LAST_BACKUP=`swift list $SWIFT_FOLDER_NAME | tail -1`
	swift download $SWIFT_FOLDER_NAME $LAST_BACKUP
	gunzip $LAST_BACKUP
	export LAST_BACKUP=`expr substr $LAST_BACKUP 1 27`
	echo "Creating DB"
	`time mysql -u root --pass=$OS_PASSWORD -e "create database $DATABASE_NAME"`
	echo "Restoring db from backup"
	`time mysql -u root --pass=$OS_PASSWORD $DATABASE_NAME < $LAST_BACKUP`
	echo "Restore complete"

	echo "Checking backup status"
	export NUM_BACKUPS=`swift list $SWIFT_FOLDER_NAME | wc -l`
	echo "Current number of backups : $NUM_BACKUPS max is $MAX_NUMBER_OF_BACKUPS"
	while (( $NUM_BACKUPS > $MAX_NUMBER_OF_BACKUPS ))
	do
		CURRENT_BACKUP_TO_DELETE=`swift list $SWIFT_FOLDER_NAME | head -1`
		echo "SHOULD DELETE $CURRENT_BACKUP_TO_DELETE."
		swift delete $SWIFT_FOLDER_NAME $CURRENT_BACKUP_TO_DELETE
		NUM_BACKUPS=`swift list $SWIFT_FOLDER_NAME | wc -l`
		echo "New number of backups : $NUM_BACKUPS max is $MAX_NUMBER_OF_BACKUPS"
	done
	echo "Done checking and cleaning backups"
fi