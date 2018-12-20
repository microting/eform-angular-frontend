#! /bin/bash

dialog_progress() {
    echo "$1" | dialog --guage "$2" 10 70 0
}

install_node() {
    apt update && apt install -y curl
    curl -sL https://deb.nodesource.com/setup_8.x | sudo bash -
    apt install -y nodejs
}

adding_mircosoft_cert() {
    wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.asc.gpg
    mv microsoft.asc.gpg /etc/apt/trusted.gpg.d/
    wget -q https://packages.microsoft.com/config/ubuntu/18.04/prod.list
    mv prod.list /etc/apt/sources.list.d/microsoft-prod.list
    chown root:root /etc/apt/trusted.gpg.d/microsoft.asc.gpg
    chown root:root /etc/apt/sources.list.d/microsoft-prod.list
}

install_dotnetcore() {
    apt install -y apt-transport-https &&\
     apt update &&\
      apt install -y aspnetcore-runtime-2.1 dotnet-sdk-2.1
}

setup_nginx_conf() {
    if [ -z "$SERVERNAME" ]; then
    cat > /etc/nginx/sites-available/default << EndOfConfig
server {
    listen $PORT;
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade \$http_upgrade;
        proxy_set_header   Connection keep-alive;
        proxy_set_header   Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header   X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto \$scheme;
    }
}
EndOfConfig
    else
    cat > /etc/nginx/sites-available/default << EndOfConfig
server {
    server_name $SERVERNAME;
    listen $PORT;
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade \$http_upgrade;
        proxy_set_header   Connection keep-alive;
        proxy_set_header   Host \$host;
        proxy_cache_bypass \$http_upgrad;
        proxy_set_header   X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto \$scheme;
    }
}
EndOfConfig
    fi
}

preparing_backend() {
    cd eform-angular-frontend/eform-client
    npm i -g @angular/cli
    su $CURENTUSER -c \
    "npm i && npm run build"

    #dialog_progress 70 "Building Web API"

    cd ../eFormAPI/eFormAPI.Web/
    su $CURENTUSER -c \
    "dotnet publish -o out"
    mkdir -p /opt/www/aspnetcore/eform-app
    mkdir -p /out/www/aspnetcore/eform-app/wwwroot

    #dialog_progress 80 "Copy WebAPI to /opt"

    rsync -aP out/* /opt/www/aspnetcore/eform-app

    #dialog_progress 85 "Copy Web Dashboard to /opt"

    cd ../../
    cd eform-client
    rsync -aP dist/* /opt/www/aspnetcore/eform-app/wwwroot  
    chown -R www-data:www-data /opt/www

    #dialog_progress 85 "Register eForm service in systemctl"

    cat > /etc/systemd/system/eform.service << EndOfUnitFile
[Unit]
Description=eForm application

[Service]
WorkingDirectory=/opt/www/aspnetcore/eform-app
ExecStart=/usr/bin/dotnet /opt/www/aspnetcore/eform-app/eFormAPI.Web.dll
Restart=always
RestartSec=10 # Restart service
SyslogIdentifier=dotnet-eform
User=www-data
Environment=ASPNETCORE_ENVIRONMENT=$ASPENV

[Install]
WantedBy=multi-user.target
EndOfUnitFile
}

## INIT
if [[ $EUID -ne 0 ]]; then
   echo "Run this script via sudo" 
   exit 1
fi

## Install dialog framework
apt update && apt install -y dialog

exec 3>&1
PARAMS=$(dialog --ok-label "Install" \
	  --backtitle "Microting eForm setup wizard" \
	  --title "Configuration" \
	  --form "Define installation parameters for eForm installer" 15 80 0 \
	"Username(Required):" 1 1	"" 	1 20 40 0 \
	"hostname(optional):"    2 1	""  	2 20 40 0 \
	"Launch environment:"    3 1	"Production"  	3 20 40 0 \
	"Port:"    4 1	"80"  	4 20 40 0 \
2>&1 1>&3)
exec 3>&-

ARRAY=($PARAMS)

if [[ ${#ARRAY[@]} < 3 ]]; then
    dialog --title "Error" --msgbox 'Not all required fields filed!' 6 20
    exit 1
fi

if [[ ${#ARRAY[@]} == 3 ]]; then
    CURENTUSER=${ARRAY[0,0]}
    SERVERNAME=""
    ASPENV=${ARRAY[0,1]}
    PORT=${ARRAY[0,2]}
else
    CURENTUSER=${ARRAY[0,0]}
    SERVERNAME=${ARRAY[0,1]}
    ASPENV=${ARRAY[0,2]}
    PORT=${ARRAY[0,3]}
fi

## Installing

dialog_progress 0 "Installing nodejs"
install_node >> logfile 2>> errlog

dialog_progress 10 "Installing .NET Core"
adding_mircosoft_cert
install_dotnetcore >> logfile 2>> errlog

dialog_progress 15 "Installing utilities"
apt install -y git rsync >> logfile 2>> errlog

dialog_progress 25 "Installing NGINX"
apt install -y nginx >> logfile 2>> errlog

dialog_progress 30 "Setting default host at default config"
setup_nginx_conf

dialog_progress 40 "Reloading nginx"
nginx -s reload >> logfile 2>> errlog

dialog_progress 50 "Cloning project"
su $CURENTUSER -c \
"git clone https://github.com/microting/eform-angular-frontend.git -b netcore" > logfile 2> errlog

dialog_progress 60 "Preparing WEB dashboard"
preparing_backend >> logfile 2>> errlog

dialog_progress 90 "Starting eForm"
systemctl daemon-reload >> logfile 2>> errlog
systemctl enable eform.service >> logfile 2>> errlog
systemctl start eform.service >> logfile 2>> errlog

dialog_progress 100 "Cleanup"
cd ../../
rm -rf eform-angular-frontend >> logfile 2>> errlog

clear
dialog --title "Ready" --msgbox 'eForms installed! Check logfile and errorfile if something wrong' 6 20

clear
