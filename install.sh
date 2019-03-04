#! /bin/bash

## Parameters parsing
for i in "$@"
do
case $i in
    -s|--silent)
    NODIALOG=1
    shift
    ;;
    -p=*|--port=*)
    PORT="${i#*=}"
    shift
    ;;
    -h=*|--hostname=*)
    SERVERNAME="${i#*=}"
    shift
    ;;
    -e=*|--launch-env=*)
    ASPENV="${i#*=}"
    shift
    ;;
    -u=*|--username=*)
    CURENTUSER="${i#*=}"
    shift
    ;;
    --ssl)
    SSL="y"
    shift
    ;;
    *)
          # unknown option
    ;;
esac
done

# Defaults

if [[ -z "$PORT" ]]; then
    PORT=80
fi

if [[ -z "$ASPENV" ]]; then
    ASPENV="Production"
fi

if [[ -z "$SSL" ]]; then
    SSL="n"
fi


dialog_progress() {
	if [[ -z "$NODIALOG" ]]; then
    	echo "$1" | dialog --guage "$2" 10 70 0
	else
        echo "[$1%] Installing: $2 "
	fi
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
      apt install -y dotnet-runtime-2.2 dotnet-sdk-2.2
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

    cd ../eFormAPI/eFormAPI.Web/
    su $CURENTUSER -c \
    "dotnet publish -o out"
    mkdir -p /var/www/aspnetcore/eform-app
    mkdir -p /out/www/aspnetcore/eform-app/wwwroot

    rsync -aP out/* /var/www/aspnetcore/eform-app

    cd ../../
    cd eform-client
    rsync -aP dist/* /var/www/aspnetcore/eform-app/wwwroot  
    chown -R www-data:www-data /var/www

    cat > /etc/systemd/system/eform.service << EndOfUnitFile
[Unit]
Description=eForm application

[Service]
WorkingDirectory=/var/www/aspnetcore/eform-app
ExecStart=/usr/bin/dotnet /var/www/aspnetcore/eform-app/eFormAPI.Web.dll
Restart=always
RestartSec=10 # Restart service
SyslogIdentifier=dotnet-eform
User=www-data
Environment=ASPNETCORE_ENVIRONMENT=$ASPENV

[Install]
WantedBy=multi-user.target
EndOfUnitFile
}

setup_ssl() {
    add-apt-repository -y ppa:certbot/certbot >> logfile 2>> errlog
    apt update >> logfile 2>> errlog &&\
    apt install -y python-certbot-nginx >> logfile 2>> errlog
    certbot --nginx -d $SERVERNAME --redirect --register-unsafely-without-email --agree-tos --non-interactive >> logfile 2>> errlog
    if [[ $? != 0 ]]; then
        showerror "SSL installing failed"
    fi
}

dialog_form() {
	## Install dialog framework
	apt update && apt install -y dialog
	
    exec 3>&1
    PARAMS=$(dialog --ok-label "Install" \
        --backtitle "Microting eForm setup wizard" \
        --title "Configuration" \
        --form "Define installation parameters for eForm installer" 15 80 0 \
        "Username(Required):" 1 1	"$CURENTUSER" 	1 20 40 0 \
        "hostname(optional):"    2 1	"$SERVERNAME"  	2 20 40 0 \
        "Launch environment:"    3 1	"$ASPENV"  	3 20 40 0 \
        "Port:"    4 1	"$PORT"  	4 20 40 0 \
        "SSL(y/n):"    5 1	"$SSL"  	5 20 40 0 \
    2>&1 1>&3)

    if [[ $? != 0 ]];
    then
        exit 0; # Cancel button pressed
    fi

    exec 3>&-

    ARRAY=($PARAMS)

    if [[ ${#ARRAY[@]} < 4 ]]; then
        showerror "Not all required fields filed!"
        exit 1
    fi

    if [[ ${#ARRAY[@]} == 4 ]]; then
        CURENTUSER=${ARRAY[0,0]}
        SERVERNAME=""
        ASPENV=${ARRAY[0,1]}
        PORT=${ARRAY[0,2]}
        SSL=${ARRAY[0,3]}
    else
        CURENTUSER=${ARRAY[0,0]}
        SERVERNAME=${ARRAY[0,1]}
        ASPENV=${ARRAY[0,2]}
        PORT=${ARRAY[0,3]}
        SSL=${ARRAY[0,4]}
    fi
}

showerror() {
    if [[ -z "$NODIALOG" ]]; then
        dialog --title "Error" --msgbox "'$1'" 10 50
        exit 1
    else
        echo "Error: $1"
        exit 1
    fi
}

## INIT
if [[ $EUID -ne 0 ]]; then
   echo "Error: Run this script via sudo" 
   exit 1
fi

# Windows CMD.exe dialog fix
export NCURSES_NO_UTF8_ACS=1

## Dialog/cmd params wizard switch
if [[ -z "$NODIALOG" ]]; then
    dialog_form
else
    echo "non-interactive installing started!"
fi

# Last validations
if [[ ( -z "$SERVERNAME" ) && ( "$SSL" == "y" ) ]]; then
    showerror "SSL require servername specified!"
fi

if [[ -z "$CURENTUSER" ]]; then
    showerror "Username not specified!"
fi

## Installing scenario

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
setup_nginx_conf >> logfile 2>> errlog

dialog_progress 40 "Reloading nginx"
nginx -s reload >> logfile 2>> errlog

dialog_progress 50 "Cloning project"
su $CURENTUSER -c \
"git clone https://github.com/microting/eform-angular-frontend.git -b master" > logfile 2> errlog

dialog_progress 60 "Preparing WEB dashboard"
preparing_backend >> logfile 2>> errlog

if [[ "$SSL" == "y" ]]; then
	dialog_progress 75 "Installing LetsEncrypt"
	setup_ssl
fi

dialog_progress 90 "Starting eForm"
systemctl daemon-reload >> logfile 2>> errlog
systemctl enable eform.service >> logfile 2>> errlog
systemctl start eform.service >> logfile 2>> errlog

dialog_progress 100 "Cleanup"
cd ../../
rm -rf eform-angular-frontend >> logfile 2>> errlog

if [[ -z "$NODIALOG" ]]; then
    dialog --title "Ready" --msgbox 'eForms installed! Check logfile and errorfile if something wrong' 6 20
else
    echo "eForms installed! Check logfile and errorfile if something wrong"
fi

exit 0
