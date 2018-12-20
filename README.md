# eform-angular-frontend 
C# Build Status:
![C# build status](https://microtingas2017.visualstudio.com/_apis/public/build/definitions/5f551ab2-01ab-4204-8efa-06be93328bc1/4/badge)

Angular 2 build status
![Angular2 status](https://microtingas2017.visualstudio.com/_apis/public/build/definitions/5f551ab2-01ab-4204-8efa-06be93328bc1/5/badge)

Node Dependencies
![Node Dependencies](https://david-dm.org/microting/eform-angular-frontend/eform-client.svg)

An Angular2 Frontend for integrating with the Microting eForm API v1.

## Support Platforms

| OS        | .Net Standard 2.0 | NET Framework 4.6.1 | MS SQL 2016+ | MySQL/MariaDB  |
| ------------- |:-----:|:-----:|:-----:|:-----:|
| OSX 10.14.2     | X |  | X | X |
| Windows 10     | X | X | X | X |
| Windows Server 2016     | X| X | X | X |
| Ubuntu 18.04     | X |  | X | X |
| Ubuntu 16.04     | X |  | X | X |

## Get access token

You need to create an account for Microting API and get your access credentials.

 - Call Microting at +45 66 11 10 66 to get started.

## Development recommendations

To work with back-end use <a href="https://www.visualstudio.com/vs/community/">**Visual Studio 2017 Community edition**</a>.

To work with Angular front-end code recommended to use <a href="https://www.jetbrains.com/webstorm/">**WebStorm**</a> or <a href="https://code.visualstudio.com">**VS Code**</a>. If you're going to use VS Code you're need to install several plugins.

1. <a href="https://marketplace.visualstudio.com/items?itemName=johnpapa.angular-essentials"> Angular Essentials</a>  - for Angular intellisense.
2. <a href="https://marketplace.visualstudio.com/items?itemName=Mikael.Angular-BeastCode">Angular Snippets</a>  - for Angular snippets.
3. <a href="https://marketplace.visualstudio.com/items?itemName=johnpapa.angular-essentials"> Angular Language Service</a> 
4. <a href="https://augury.angular.io/"> Chrome Augury extention</a> - to observe variables and changes in a real time.

After installing, run **cmd** navigate to front-end **eform-client** folder and type **npm i**, after that **npm start**. This will start **Webpack** development server that will reload on any change in the front-end code.

There is two ways how to debug Angular application. 
First way is to put breakpoints in the **Sources**. To do that Open **Chrome Dev Tools** and then navigate to **Sources** tab. Go down and open **webpack://** tab from left panel. After that open tab with *disk_name:/app_folder/eform-client* (for example *C:/Users/MyUser/eForm/eform-client/*). Here you will see an entire application as you see it in **VS Code** and put a **debugger** where you're need it.
The second way is simple, you can just put a **debugger** word dirrectly in code. After that app will reload and with open **Chrome Dev Tools** on the function call **debugger** will be triggered. 
For example **debugger** will be triggered on click *Logout* button:

```
logout(): Observable<any> {
debugger;
     return this.post(AuthMethods.Logout, {});
   }
```

To use **Augury** go to **Chrome Dev Tools** and navigate to this tab. 
The component tree displays a hierarchical relationship of the components. When a component is selected, Augury presents additional information about the selected component.

1) View Source — a link to the source code of the component.
2) Change Detection — displays whether or not Change Detection is in use for the component.
3) Object Properties — lists the properties of the component.
4) Dependencies - lists the dependencies of the component.

To view the source code of the selected component, click the **View Source** link. This will bring the **Sources** tab into focus and display the source code.
The major feature of Augury is the Router Tree, which displays the routing information for the application. The **Router Tree** tab is located next to the **Component Tree** tab along the top left side.
  
  
## Installation
  
[Download our latests release](https://github.com/microting/eform-angular-frontend/releases)


## Contributing

1. Do a fork
2. Clone your fork onto your own computer
3. Checkout/create a new branch for your relevant issue
4. Apply your changes and tests
5. Commit your changes and push to github
6. Create a pull-request

### Pull requests

To enable us to quickly review and accept your pull requests, always create one pull request per issue and link the issue in the pull request. Never merge multiple requests in one unless they have the same root cause. Be sure to follow our coding guidelines and keep code changes as small as possible. Avoid pure formatting changes to code that has not been modified otherwise. Pull requests should contain tests whenever possible.

Pull-reuqsts that do not pass tests, will not be accepted.

### Where to contribute

Check out the [full issues list](https://github.com/microting/eform-angular-frontend/issues) for a list of all potential areas for contributions.

To improve the chances to get a pull request merged you should select an issue that is labelled with the [help_wanted](https://github.com/microting/eform-angular-frontend/issues?q=is%3Aissue+is%3Aopen+label%3Ahelp_wanted) or [bug](https://github.com/microting/eform-angular-frontend/issues?q=is%3Aissue+is%3Aopen+label%3Abug) labels. If the issue you want to work on is not labelled with `help-wanted` or `bug`, you can start a conversation with the issue owner asking whether an external contribution will be considered.
	
### Suggestions

We're also interested in your feedback for the future of Microting eForm SDK. You can submit a suggestion or feature request through the issue tracker. To make this process more effective, we're asking that these include more information to help define them more clearly.

## Microting Open Source Code of Conduct

This project has adopted the [Microting Open Source Code of Conduct](https://www.microting.com/microting-open-source-code-of-conduct/). Contact opencode@microting.com with any additional questions or comments.
	

## License

The MIT License (MIT)

Copyright (c) 2007-2018 Microting A/S

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
