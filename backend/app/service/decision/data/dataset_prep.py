import pandas as pd
from pathlib import Path

from pandas.core.interchange.dataframe_protocol import DataFrame

from app.service.decision.data.schemas import NormalizedSkinOutput
from app.core.settings import settings
from openai import OpenAI
import json


def remap_df_names(df: DataFrame)-> DataFrame:
    df = df.rename(columns={
        "product-name": "product_name",
        "sub-category": "sub_category",
        "application-area": "application_area",
        "size[ml]": "size",
        "price[euro]": "price",
        "source-url": "source_url",
        "last-verified": "last_verified",
        "concentration-ingredient": "concentration_ingredient",
        "sutied-for": "suited_for",
        "review-count": "review_count",
    })
    return df

DATA_DIR = Path(__file__).resolve().parent
df = pd.read_excel(DATA_DIR / "aurelia-skincare-complete.xlsx")

df["review-count"] = df["review-count"].astype("Int64")
df["last-verified"] = pd.to_datetime(df["last-verified"], errors="coerce").dt.strftime(
    "%d-%m-%Y"
)
df["ingredients"] = (
    df["ingredients"]
    .str.lower()
    .str.split(",")
    .apply(lambda items: [s.strip() for s in items] if isinstance(items, list) else [])
)

df["ph"] = (
    df["ph"]
    .str.replace(",", ".")
    .str.split("-")
    .apply(
        lambda values: tuple(map(float, values)) if isinstance(values, list) else None
    )
)


string_cols = df.select_dtypes(include=["str", "string"]).columns

df[string_cols] = df[string_cols].apply(lambda col: col.str.lower())
df["features"] = df["features"].str.split(",")

print(df.head(5))
print(list(df.columns))
print(df.dtypes)

print("\n\n")

cols = df.columns

for col in cols:
    print(f"col: {col}\nhead: \n{df[col].sample(5, random_state=42)}\n")

#
# print(df[df['concentration'] > 1.0])
# print(df[df['concentration'] < 0.0])

df.to_parquet("skincare-products-clean.parquet", index=False)

word_dictionary = (
    df["targets"]
    .dropna()
    .str.lower()
    .str.split(",")
    .explode()
    .str.strip()
    .str.replace("-", " ", regex=False)
    .unique()
    .tolist()
)


print(word_dictionary)


client = OpenAI(api_key=settings.open_ai_key)

response = client.responses.parse(
    model=settings.open_ai_model,
    input=json.dumps(word_dictionary),
    instructions="""
        You are a dermatology terminology normalization assistant
        working on Aurelia, a personalized skincare recommendation system.
        
        Your task is to analyze a list of raw skincare product targets
        and create a consistent, clinically meaningful taxonomy.
        
        For each input term:
        
        1. Correct spelling mistakes and normalize terminology.
        2. Identify synonyms and semantically equivalent expressions.
        3. Map equivalent terms to the same canonical concept.
        4. Preserve clinically meaningful distinctions.
        5. Classify each concept into one of these categories:
           - SKIN_CONCERN
           - SKIN_GOAL
           - PRODUCT_FUNCTION
           - OTHER
        
        Normalization rules:
        - Use lowercase snake_case for canonical identifiers.
        - Use clear, concise English labels.
        - Do not invent conditions or effects not present in the input.
        - Do not automatically equate blemishes with acne.
        - Keep dry skin and dehydrated skin distinct.
        - Distinguish skin concerns from product functions.
        - Preserve the original input term for traceability.
        - Reuse the same canonical identifier for equivalent terms.
        - If a term is ambiguous, preserve its meaning and flag it
          for review rather than guessing.
        
        Return a mapping for every unique input term.
        """,
    text_format=NormalizedSkinOutput,
)

normalized_output = response.output_parsed

with open("normalized-targets.json", "w") as f:
    json.dump(normalized_output.model_dump(), f, indent=2)
