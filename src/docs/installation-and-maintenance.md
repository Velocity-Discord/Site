---
title: "Installation "
index: 1
group: Intro
author: TheCommieAxolotl
date: 2022-07-15T01:47:13.427Z
---
<div class="notice">Prerequisites: <a href="https://nodejs.org/en/">Node.js</a> 12+, <a href="https://git-scm.com/">git</a> and <a href="https://www.npmjs.com/">npm</a>.</div>

### 1. Clone the repository.
```ps
git clone https://github.com/Velocity-Discord/Velocity.git
```

### 2 Run the install script.
Velocity should detect your operating system but if it doesn't you can add the `--mac` `--win` or `--linux` flags

#### Stable 
```ps
npm run install
```

#### PTB
```ps
npm run install -- --ptb
```

#### Canary
```ps
npm run install -- --canary
```

---
## Development
Follow the [Installation instructions](#clonetherepository) then to automatically compile the asar, run 
```ps
npm run watch
```