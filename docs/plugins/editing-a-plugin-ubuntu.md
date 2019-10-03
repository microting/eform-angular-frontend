# Editing a plugin - Ubuntu

### Step 1:

Make the edits you want to do.

### Step 2:

When you have finished your editing. Do this

```text
rm -Rf ~/Documents/workspace/microting/eform-angular-machinearea-plugin/eform-client/src/app/plugins/modules/machine-area-pn/
```

### Step 3:

```text
cp -av ~/Documents/workspace/miccp -av ~/Documents/workspace/microting/eform-angular-frontend/eform-client/src/app/plugins/modules/machine-area-pn ~/Documents/workspace/microting/eform-angular-machinearea-plugin/eform-client/src/app/plugins/modules/
roting/eform-angular-frontend/eform-client/src/app/plugins/modules/machine-area-pn eform-angular-machinearea-plugin/eform-client/src/app/plugins/modules/
```

### Step 4:

```text
rm -Rf ~/Documents/workspace/microting/eform-angular-machinearea-plugin/eFormAPI/Plugins/MachineArea.Pn/
```

### Step 5:

```text
cp -av ~/Documents/workspace/microting/eform-angular-frontend/eFormAPI/Plugins/MachineArea.Pn ~/Documents/workspace/microting/eform-angular-machinearea-plugin/eFormAPI/Plugins/
```

### Step 6:

```text
cd ~/Documents/workspace/microting/eform-angular-machinearea-plugin/

git status
```

#### OBS! IF CHANGES ARE MADE!

```text
git commit -a
```

Write your commit message

```text
git status
```

```text
git pull
```

```
git push 
```

#### Last but not least! Await for Microting to accept the changes

