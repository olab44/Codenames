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
- MySQL Database

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



## PROTOTYP

priorytetem była fukncjonalność, aby zapewnić przeprowadzenie podstawowej rozgrywki

# zrealizowane cele

- uruchamianie serwera
  - możliwość wspólnego grania po podłączeniu do sieci lokalnej
  - aktualizacja stanu gry na wielu urządzeniach

- tworzenie rozgrywki
  - pobieranie 25 kart z bazy
  - tworzenie planszy
  - możliwość zmiany ról (agent / mistrz)

- baza danych
  - server MYSQL (zmiana założeń początkowych - Oracle)
  - baza danych słów i ról

- rozgrywka
  - podawanie podpowiedzi oraz liczby ruchów
  - zaznaczanie kart
  - informacje o turze (czyja kolej, licznik pozostałych kart do odgadnięcia)
  - zmiana tur po błędnym odgadnięciu
  - zakończenie gry (informacja w konsoli)



# planowany rozwój aplikacji

- baza danych - ulepszenie serwera
- historia podpowiedzi
- liczba możliwych ruchów w turze zgodna z zasadami gry
- podstrona z instrukcją gry
- kontrola podpowiedzi dawanych przez szefów
- zakończenie gry po odgadnięciu wszystkich kart lub natrafieniu na czarną
- dołączenie do gry po wpisaniu gameID
- wybór języka słów


# APLIKACJA - FUNKCJONALNOŚĆ

# serwer
- możliwość wspólnego grania po podłączeniu do sieci lokalnej
- aktualizacja stanu gry na wielu urządzeniach

# tworzenie rozgrywki
- jedna gra na serwerze
- możliwość wyboru języka słów na planszy
- szczegółowa instrukcja gry w podstronie instructions
- możliwość restartu rozgrywki w dowolnym momencie

# rozgrywka
  - obsługa gry zgodnie z zasadami, w tym tej o dodatkowym ruchu.
  - historia podpowiedzi
  - licznik kart każdej z drużyn
  - menu (nowa gra, zmiana roli, powrót do menu głównego)
  - kontrola podpowiedzi szefów
    - tylko litery, brak liczb
    - jedno słowo, nie może występować na planszy, ani jego fragment

# zakończenie gry
- zgodne z zasadami
- po zakończeniu wyświetlane jest okienko (oraz puszczany sygnał dźwiękowy), które zawiera
    - informację, która drużyna wygrała
    - opcję nowej gry
    - pokazanie planszy z układem kart

# podział pracy

- Aleksandra Buczma
  - baza słów
  - tworzenie planszy

- Zofia Jasina
  - tworzenie serwera
  - synchronizacja między urządzeniami
  - implementacja GUI


- Julian Mossakowski
  - podpowiedzi