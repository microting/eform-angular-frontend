# Adding a menu item

### Step 1

In your preferred c\# IDEA open project &lt;YourPlugin&gt;/eFormAPI.

Open your plugin class example: &lt;YourPlugin&gt;.cs

In the method HeaderMenu: Add a new MenuItemModel.

```text
 new MenuItemModel()
                    {
                        Name = localizationService.GetString("<Your Menupoint>"),
                        E2EId = "trash-inspection-pn-<Your Menupoint>",
                        Link = "/plugins/trash-inspection-pn/<your Menupoint>",
                        Position = 6,
                    }
```

### Step 2

In your preferred TypeScript IDEA open project &lt;YourPlugin&gt;/eform-client. 

In your Plugin folder src/app/plugins/modules/&lt;yourpluginfolder&gt;/components Add a new folder called &lt;menupoint name&gt;

In your newly created folder. Create a new angular CLI Component called &lt;yourcomponent-view&gt;

### Step 3

In &lt;yourplugin.routing.module.ts&gt; file add your new path.

```text
      {
        path: '<yourRoute>',
        canActivate: [AdminGuard],
        component: <yourViewComponent>
      }
```

### Step 4

Add index.ts file to your &lt;yourcomponent&gt; folder

```text
export * from './<yourcomponent/<yourcomponent>.component';
```

### Step 5

in &lt;yourplugin&gt; folder there is a file named index.ts add this line in the file

```text
export * from './<yourcomponent>/index';
```

### Step 6

in &lt;yourplugin.module.ts&gt; file import &lt;yourcomponent&gt; 

```text
  import: {
    <YourViewComponent>
  },
```

### Step 7

In &lt;yourplugin.module.ts&gt; add view component to Declarations

```text
  declarations: [
    <YourViewComponent>
  ],
```



