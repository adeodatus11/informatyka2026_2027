# -*- coding: utf-8 -*-
# ==========================================================
#  BLOK 12 — plik startowy
#  Otwórz ten plik w Thonny (albo wklej do Replit) i wciśnij Uruchom.
# ==========================================================

print("Witaj! Ten program działa.")
print("-" * 40)


# ----------------------------------------------------------
# ZADANIE 1. Napraw błąd.
#
# Poniższy kod ma zapytać o cenę i policzyć rabat 10%.
# Uruchom go i wpisz jakąś liczbę. Program się wysypie.
# Przeczytaj czerwony komunikat na dole — on mówi, co jest nie tak.
#
# Podpowiedź: input() zawsze zwraca TEKST, nawet gdy wpisujesz liczbę.
# Żeby liczyć, trzeba zamienić tekst na liczbę funkcją int().
# ----------------------------------------------------------

cena = input("Podaj cenę usługi w złotych: ")
rabat = cena * 0.10                 # <-- tutaj jest błąd
print("Rabat wynosi:", rabat)


# ----------------------------------------------------------
# ZADANIE 2. Dopisz warunek.
#
# Zapytaj klientkę o liczbę wizyt w tym roku.
# Jeśli była 5 razy lub więcej — wypisz "Należy Ci się rabat stałej klientki".
# W przeciwnym razie — wypisz "Do rabatu brakuje jeszcze kilku wizyt".
#
# Szkielet do uzupełnienia (usuń znaki # z początku linii):
# ----------------------------------------------------------

# wizyty = int(input("Ile razy była Pani u nas w tym roku? "))
# if wizyty >= 5:
#     print(...)
# else:
#     print(...)


# ----------------------------------------------------------
# ZADANIE 3. Dopisz pętlę.
#
# Poniższa lista to cennik usług. Wypisz każdą pozycję w osobnej linii,
# a obok cenę po podwyżce o 8 zł.
#
# Szkielet do uzupełnienia:
# ----------------------------------------------------------

cennik = [45, 70, 90, 180, 260]

# for cena_uslugi in cennik:
#     print("Było:", cena_uslugi, "  Jest:", ...)


print("-" * 40)
print("Koniec programu.")
