  # Installation
  
  #### 1. Node.js & npm installation
  
  1. Go to Node.js website [https://nodejs.org/en](https://nodejs.org/en)
    
    ![Download Node.js](node_1.png "Download")
  2. Download and run node.js installer
  3. Check "npm package manager" & "Add to PATH" (they should be checked by default.)
    
    ![Install](node_2.png "Install")

    
  #### 2. Downloading latest eForm Angular version
    
  1. Go go [https://github.com/microting/eform-angular-frontend](https://github.com/microting/eform-angular-frontend)
  2. Download ZIP-Archive with the latest version of application
    
    ![Download](git_1.png "Download")
  3. Extract the files
  
  #### 3. Build Angular application
  
  1. Go go Angular application folder
    
    ![Angular folder](file_1.png "Angular folder")
  2. Call **cmd** from your Angular folder
    
    ![Angular folder cmd](file_2.png "Angular folder cmd")
  3. Call **npm install**
    
    ![npm install](npm_1.png "npm install")
  4. Then call **npm run build**
    
    ![npm run build](npm_2.png "npm run build")
  5. Angular application has been built and extracted to **dist** folder
    
    ![dist folder](file_3.png "dist folder")
    
  #### 4. Build WEB API application
    
  1. Go to the API folder
    
    ![API folder](file_4.png "API folder")
  2. Open eFormAPI.sln in Visual Studio
    
    ![VS 2017](vs_1.png "VS 2017")
  3. Press CTRL+SHIFT+B to build and restore packages
  4. Click publish for .Web project
    
    ![Publish](vs_2.png "Publish")
  5. Select path and clich Publish
    
    ![Path](vs_3.png "Path")
  6. Now you have a compiled API application
    
    ![Compiled API](file_5.png "Compiled API")
  
    
  #### 5. Publish WEB API application
  
  1. Install Internet Information Services if not already installed.    
        1. Press the Windows Key and type Windows Features, select the first entry "Turn Windows Feature On of Off"
        2. Check "Internet Information Services" and click OK
  2. Copy compiled files to forlder in server
    
    ![web server](file_6.png "web server")
  3. Open Internet Information Services (IIS) Manager
    
    ![IIS Manager](iis_1.png "IIS Manager")
  4. Click Add Website
    
    ![IIS Manager](iis_2.png "IIS Manager")
  5. Fill all required settings
    
    ![IIS Manager](iis_3.png "IIS Manager")
    
  #### 6.1 Running Angular as a console application
    
  1. Go go the angular folder and run **cmd**
  2. If you did not build the application before call **npm install** and then **npm run build**
  3. Call **npm run server**
    
    ![npm run server](npm_3.png "npm run server")
  4. Now application is working, don't close the command prompt when app is working (if you want to stop it - press **CTRL+C** to times)
      
  #### 6.2 Running Angular as a Windows Service
      
  1. Go to the Angular folder and type **cmd**
    
    ![file](file_6.png "file")
  2. install node-windows with npm, unsing the global flag
    **npm install -g node-windows**
  3. Then call **npm link node-windows**
  4. If you want to install and start the service, call **npm run winserver-install**
    
    ![Install Windows Service](npm_4.png "Install Windows Service")
  5. Now you application has been started as a Windows Service
    
    ![IIS Manager](service_1.png "Windows Service")
  6. If you want to stop & uninstall, call **npm run winserver-uninstall**
    
    ![Uninstall Windows Service](npm_5.png "Uninstall Windows Service")
    
    
  #### 7. Binding host name to website
    
  1. Click Add Website and fill all fields in IIS Manager
    
    ![IIS Manager](iis_4.png "Windows Service")
  2. Install **URL Rewrite extension**
    [https://www.iis.net/downloads/microsoft/url-rewrite](https://www.iis.net/downloads/microsoft/url-rewrite)
  3. Install **APP Requst Routing** extension
    [https://www.iis.net/downloads/microsoft/application-request-routing](https://www.iis.net/downloads/microsoft/application-request-routing)
    
    ![IIS Manager](install_1.png "IIS Manager")
  4. Select Rewrite in your website section
    
    ![IIS Manager](iis_6.png "IIS Manager")
  5. Add new rule
    
    ![IIS Manager](iis_7.png "IIS Manager")  
  6. Click on Reverse Proxy
    
    ![IIS Manager](iis_8.png "IIS Manager")
  7. Add to rules localhost:300 (same as our angular app)
    
    ![IIS Manager](iis_9.png "IIS Manager")
  8. Then go to website  
  