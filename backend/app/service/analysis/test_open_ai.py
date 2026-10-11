"""
input tokens: tokeny które weszły do modelu: wiadomość użytkownika, instrukcje systemowe / deweloperskie, kontekst RAG
output tokens: tokeny wygenerowane przez model przy odpowiedzi

cached tokens: cached input tokens

prompt caching: ponowne wykorzystanie wcześniej przetworzonego początku promptu

Batch API - wiele zadan do async przetowrzenia
moderation - klasyfikacja tresci wejsciowych pod katem okreslonych kategorii bezpieczenstwa


openai sdk
structured outputs: model zwraca dane zgodne z jakims schemated danych
web search: wiadomo
file search / RAG: wiadomo
function calling: poprośić backend o użycie funkcji typu np: get_user_skin_story - jesli chcemy zeby model sam

    sobie szukal odpowiednich informacji: np uzytkownik pisze sprawdz moje ostatenie eksperymenty:
    model wtedy wie zeby uzyc odpowiednich funkcji

vision: analiza przeslanych zdjec
streaming: przesylanie odpowiedzi fragmentami zamiast czekania na caly tekst
converstation state: kontynuowanie rozmowy z wczesniejszym kontekstem


parametry modeli:

- temperature - losowosc generowanego tekstu
- top_p - alternatywna metoda kontroli tokenow
- reasoning.effort - naklad rozumowania
- max output tokens - limit tokenow odpowiedzi
- tools - narzedzia modelu
- tool choice - okresla czy model moze, musi albo nie moze uzywac narzedzi
- instructions - instrukcje odnosnie zadania i zachowania
- text.format - format odpoweidzi: structured output
- stream - wiadomo
- previous response id - kontynuowanie starej odpowiedzi
- store - przechowywanie odpoweidzi po stronie api
- text.verbosity


temperature - im nizsza tym model wybiera bardziej prawdopodobne odpowiedzi (self attention)
wyzsza tempertaura - bardziej zroznicowane odpowiedzi, nizsza tempertaura niekoniecznie
mowi o wiekszej poprawnosci odpowiedzi


np top_p 0.85 wybraloby wszystkie ktore sie sumuja do tego prawdopodobienstwa (1. 65% + 2. 20%)



evals - porownywanie jakosci promptow, prompt caching



porownac rozne konfiguracje modelow zeby ogarnac co dziala najlepiej dla beauty maker


metryki mierzenia modelu

safety pass rate - czhy model unika niebezpiecznych propozycji
groudness - czy twierdzenia wynikaja z badan
context adherence - czy uwzglednia ograniczenia kwiestionariusza
experiment quality -czy proponuje obserwowalna zmiane


potencjalne wartosci reasoning: none, low, medium, high, xhigh

komunikaty ladne: none
interpretacja kwestionariusza: low
dobor eksperymentu na podstawie RAG: medium
analizna sprzecznych zrodel i historii: high





usage = response.usage

print("Input:", usage.input_tokens)
print("Output:", usage.output_tokens)
print("Total:", usage.total_tokens)

print(
    "Cached:",
    usage.input_tokens_details.cached_tokens
)

"""

import asyncio
from openai import AsyncOpenAI

from app.core.settings import settings


async def main() -> None:
    async with AsyncOpenAI(
        api_key=settings.open_ai_key,
    ) as client:

        response = await client.responses.create(
            model=settings.open_ai_model,
            instructions="You are a skincare research assistant",
            input="Explain briefly what niacinamide does for human skin",
        )

        print(response.output_text)
        print(f"Tokens: {response.usage}")


if __name__ == "__main__":
    asyncio.run(main())
