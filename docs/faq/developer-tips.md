# Developer Tips

## Editors

There are a lots of editors to choose from. Here are some of our favorites:

* [Webstorm](https://www.jetbrains.com/webstorm/)
* [Rider](https://www.jetbrains.com/rider/)

## Using a Debugger

The `debugger` keyword can be used to debug an app. When most browsers encounters a `debugger` statement, running of JavaScript is stopped, and the browser will load its debugger. This can be used to set "breakpoints" in the app.

For example, if a function is not returning the correct value, the debugger can be used to step through the code and inspect variables.



```
function myBrokenFunction() { 
debugger;
 // do other stuff
  } 
```

When an app runs, it will pause at this function. From there, the developer tools can be used to run pieces of JavaScript, line by line, and inspect where exactly the function breaks.



