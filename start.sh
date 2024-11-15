#!bin/bash
GREEN='\033[1;32m'
while : 
do
printf "${GREEN}• Aguarde 15 segundos..."
node connect.js sim
sleep 1
printf "${GREEN}\nPrograma fechado! Iniciando bot novamente...\n"
done