---
layout: ../../layouts/Docs.astro
title: "Installation"
url: "/docs/installation.md"
---

# Installation and Maintenance
This page will cover the installation and maintenance of Velocity.

## Installation

#### Prerequisites
[Node.js](https://nodejs.org/en/) v12+, [git](https://git-scm.com/) and [pnpm](https://pnpm.io/).

---

### Clone the repository
```bash
git clone https://github.com/Velocity-Discord/Velocity.git
```

For the `v2` branch use `git clone -b v2 ...`

--- 

### Install dependencies
```bash
pnpm install
```

---

### Build the project
```bash
pnpm build
pnpm bundle
```

---

### Inject
```bash
pnpm inject <channel?>
```
