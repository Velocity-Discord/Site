---
title: Installation
author: TheCommieAxolotl
date: 2022-05-05T22:16:31.479Z
---
# Installation

---

Prerequisites: [Node.js](https://nodejs.org/en/) v12+, [git](https://git-scm.com/) and [npm](https://www.npmjs.com/).

### 1. Clone the repository.
```ps
git clone https://github.com/Velocity-Discord/Velocity.git
```

### 2 Run the install script.
(optionally add `--win` or `--mac` to install for Windows or Mac respectively)

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
Prerequisites: [Node.js](https://nodejs.org/en/) v12+, [git](https://git-scm.com/) and [npm](https://www.npmjs.com/).

### 1. Clone the repository.
```ps
git clone https://github.com/Velocity-Discord/Velocity.git
```

### 2. Run the install script.
(optionally add `--win` or `--mac` to install for Windows or Mac respectively)

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

### 3. Development. 
To automatically compile the asar, run 
```ps
npm run watch
```