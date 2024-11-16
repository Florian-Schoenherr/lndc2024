#!/bin/bash
source DevOps/.bashEnv

#On ssl errro use ssh-keygen -R "server-ip" to delte old ssh fingerprints and reconnect first classical via ssh.
echo "(1) Building app from ${APP_DIRECTORY}"
cd ${APP_DIRECTORY}
pnpm build
 
echo "(3) Stopping remote server at ${HOSTNAME}"
 # Read password from command line
read -sp 'Enter SSH password: ' PASSWORD

 # we need to load environments variables, specifically run "source ~/.nvm/nvm.sh" to run pm2 and node.  
 # On error Check all avaible environment variables it with env command
 sshpass -p ${PASSWORD} ssh -l ${USERNAME} ${HOSTNAME} << EOF
  source ~/.profile
  source ~/.bashrc
  source ~/.nvm/nvm.sh
  npx pm2 stop index
  exit 
EOF

#for pm2 i used the -- --port=80 which et pm2 stop parsing its other aguments option and uses the argument --port=80
echo "(4) Uploading files to ${REMOTE_DIRECTORY}@${HOSTNAME}"
sshpass -p ${PASSWORD} rsync -avzP ${APP_DIRECTORY_BUILD} ${USERNAME}@${HOSTNAME}:${REMOTE_DIRECTORY}
sshpass -p ${PASSWORD} rsync -avzP ${APP_DIRECTORY_DB} ${USERNAME}@${HOSTNAME}:${REMOTE_DIRECTORY}
sshpass -p ${PASSWORD} rsync -avzP ${APP_DIRECTORY}/package.json ${USERNAME}@${HOSTNAME}:${REMOTE_DIRECTORY}/build


sshpass -p ${PASSWORD} ssh -l ${USERNAME} ${HOSTNAME} << EOF

  echo "(6) Rebuilding node packages"
  cd ${REMOTE_DIRECTORY}/build
  npx yarn add package.json

  echo "(7) Starting pm2 server process"
  PORT=${NODE_PORT} HOST=${NODE_HOST} npx pm2 start index.js --update-env --name eventIdeaVoting
EOF


