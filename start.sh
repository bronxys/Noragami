#!/bin/bash
PURPLE='\033[1;35m'
CYAN='\033[1;36m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
RESET='\033[0m'
while : 
do
printf "${PURPLE}=========================================\n"
printf "${PURPLE}• Esperando... apenas mais 15 segundos! ⏳\n"
printf "${PURPLE}=========================================\n"
sleep 5
node connect.js sim
sleep 2
printf "${GREEN}\n=========================================\n"
printf "${PURPLE}🔥 O programa foi fechado! 🔥 Reiniciando o bot... 🚀\n"
printf "${PURPLE}=========================================\n"
done