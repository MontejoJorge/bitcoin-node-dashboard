# Bitcoin Node Dashboard
![Docker Image Version](https://img.shields.io/docker/v/montejojorge/bitcoin-node-dashboard)
![Docker Image Size (tag)](https://img.shields.io/docker/image-size/montejojorge/bitcoin-node-dashboard/latest)
![Static Badge](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

Bitcoin Node Dashboard is a dashboard to see info about your Bitcoin Node.

![image](https://github.com/user-attachments/assets/d7dc4e30-7f24-4730-a7e7-7e0c86a5db26)

## Usage
```yml
services:
   bnd:
      image: ghcr.io/montejojorge/bitcoin-node-dashboard:latest
      container_name: bnd
      ports:
         - 1100:1101
      volumes:
         - ~/backup-stats:/data
         - ~/.bitcoin:~/.bitcoin:ro
      environment:
         LOGIN_PASSWORD: your-password
         BTC_HOST: 192.168.1.10
         BTC_PORT: 8332
         BITCOIND_DIR: ~/.bitcoin # Or you can use user/pass auth
         BTC_USERNAME: your-rpc-usern
         BTC_PASSWORD: your-rpc-password
      restart: unless-stopped
```
