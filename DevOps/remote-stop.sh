 #!/bin/bash
source DevOps/.bashEnv
echo "(3) Stopping remote server ${HOSTNAME}"
 # Read password from command line
read -sp 'Enter SSH password: ' PASSWORD

 # we need to load environments variables, specifically run "source ~/.nvm/nvm.sh" to run pm2 and node.  Check it with env command
 sshpass -p ${PASSWORD} ssh -l ${USERNAME} ${HOSTNAME} << EOF
  source ~/.profile
  source ~/.bashrc
  source ~/.nvm/nvm.sh
  npx pm2 stop index
  exit 
EOF