#!/bin/bash

PURPLE='\033[1;35m'
CYAN='\033[1;36m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
RESET='\033[0m'

while : 
do
    clear
    printf "${PURPLE}=========================================\n"
    printf "${CYAN}🤖 Iniciando o bot... Aguarde 15 segundos 🤖\n"
    printf "${PURPLE}=========================================\n\n"
    
    node connect.js sim

    sleep 1
    printf "${YELLOW}⚠️  Programa encerrado inesperadamente!\n"
    printf "${GREEN}🔄 Preparando para reiniciar...\n"
    printf "${PURPLE}-----------------------------------------\n\n"
    
    sleep 15
done