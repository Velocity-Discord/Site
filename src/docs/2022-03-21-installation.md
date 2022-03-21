---
title: Installation
date: 2022-03-21T00:14:26.279Z
---


# Installation
---

<div class="notice">
    Velocity is currently a beta project. the instructions labeled <a href="#a">here</a> will not work until it is Released.
</div>

# Required Programs
You will need to download [git](https://git-scm.com/download/). 
 (node install script implementation is planned)
<br />
# The Actual Installation

### MacOS
1. Open Terminal
2. Paste in 
`git clone https://github.com/velocity-discord/Velocity`
3. Open Finder and navigate to your `[Discord Version].app`
4. Right-Click on it and select "Show Package Contents"
5. Go to  `Contents/Resources`
6. Create a folder called `app`
7. Inside, create a `index.js` and a `package.json`
8. inside `package.json` enter:

```json
{
    "name": "velocity",
    "main": "./index.js"
}
```

9. inside `index.js` enter:
```
require("/FULL/PATH/TO/Velocity/FOLDER");
```
(replace `"/FULL/PATH/TO/Velocity/FOLDER"` with the path)

### Windows
1. Open Command Prompt
2. Paste in 
`git clone https://github.com/velocity-discord/Velocity`
3. Press `Win+R` and paste in `%appdata%` then open the folder for your discord version
4. Go down the file levels until you get into `Resources`
6. Create a folder called `app`
7. Inside, create a `index.js` and a `package.json`
8. inside `package.json` enter:
```
{
    "name": "velocity",
    "main": "./index.js"
}
```
9. inside `index.js` enter:
```
require("/FULL/PATH/TO/Velocity/FOLDER");
```
(replace `"/FULL/PATH/TO/Velocity/FOLDER"` with the path)


### Linux

Coming Soon