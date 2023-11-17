# PAP2023Z-Z13

## SKŁAD ZESPOŁU

- Aleksandra Buczma
- Julian Mossakowski
- Zofia Jasina

## TEMAT PROJEKTU

__The _CODENAMES_ Game__

Elektroniczna odsłona planszowej gry Tajniacy

## TECHNOLOGIE

- JavaScript / HTML / CSS
- Node.js (v20.9.0) - Express - Socket.io
- Oracle Database

## PLAN

Założenia funkcjonalne:

- przeglądarkowa aplikacja umożliwająca osobom na różnych urządzeniach podłączonych do wspólnej sieci lokalnej grę online na wspólnej planszy

- implementacja zasad oraz logiki gry planszowej Tajniacy
  - https://en.m.wikipedia.org/wiki/Codenames_(board_game)

- zewnętrznie realizowany, niewymuszany przez aplikację, podział na dwie drużyny
  - w obrębie drużyny wybór roli szefa lub zgadującego

- losowy dobór 25 słów i rozłożenie ich na planszy
  - baza danych dostępnych słów
  - wybór języka
     - podawanie własnych propozycji
     - podział na kategorie tematyczne

- pilnowanie poprawności udzielanych przez szefów wskazówek
  - tylko jedno słowo
  - nie występuje na planszy

- informatywne GUI
  - zachowanie historii udzielonych podczas gry podpowiedzi
  - pokazywanie aktualnego stanu gry poprzez opisy oraz wykorzystanie kolorów

- możliwość restartu rozgrywki

- podstrona z instrukcją gry


figma: https://www.figma.com/file/qS4lVIp6AI6GBxw0a8AccO/CODENAMES?type=design&node-id=0-1&mode=design&t=jmr3H47DsCwymCVb-0

