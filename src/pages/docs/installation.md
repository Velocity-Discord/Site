---
layout: ../../layouts/Docs.astro
title: "Installation"
url: "/docs/installation.md"
---

# Installation and Maintenance
This page will cover the installation and maintenance of Velocity.

## Installation

#### Prerequisites
[Node.js](https://nodejs.org/en/) v12+, [git](https://git-scm.com/) and [npm](https://www.npmjs.com/).

---

### 1. Clone the repository.
```ps
git clone https://github.com/Velocity-Discord/Velocity.git
```

### 2. Run the install script.

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

### 1. Clone the repository.
```ps
git clone https://github.com/Velocity-Discord/Velocity.git
```

### 2. Run the install script.

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
### 3. Build.
To use latest changes, run
```ps
npm run dist
```

### 4. Watch.
To automatically compile the asar, run 
```ps
npm run watch
```