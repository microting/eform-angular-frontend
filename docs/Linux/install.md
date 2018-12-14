# eFrom installation script

## Preparing

### Create non-root user

(node_2.png "Install")

Script should be launched via Non-root user via sudo.

Exec adduser to create new user in system

```bash
adduser username
```

Give sudo privileges to user

```bash
usermod -aG sudo newuser
```

logout and login to new created user

if you are root, you can run __su__ to login as new user

```bash
su - newuser
```

### Swapfile

If you have 1Gb and less RAM on server/PC, you need to configure swap on system

Run __cat__ to check does your system have a swap file

```bash
cat /proc/swaps
```

If no swap file or partition is available, you can create swapfile with commands below

```bash
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Downloading script

Use wget to download script (replace with download link from repo)

```bash
wget https://gist.githubusercontent.com/Keroosha/d9170bb11049c901584102eceb267357/raw/3cd3e8e79db5d5a181553132afe53093cdd117e5/install.sh
```

Make script executable

```bash
sudo chmod +x install.sh
```

## Running script

Launch script with command

```bash
sudo ./install.sh
```

Configuration wizard ask you a 4 parameters to setup

* Username
  * Non-root username who launched that script
    (used for building app at your home directory)
* Hostname
  * Hostname that NGINX should use as route to webapp
  * Leave blank for localhost path
  * __Example__: myeform.com
* Launch environment:
  * Which launching environment should use dotnet
  * __Available values__: _Development_, _Production_
  * __Default value__: _Production_
  * Leave default value, if you plan only working with eForm dashboard
* Port
  * Defines on which port application will be available
  * __Default value__: 80

## Installation process

All installation process is automated, after installation eFrom will be available on host and port that you specified in configuration

## Error solving

If app not launched, or something missing, check __errlog__ file for more info about installation process