from __future__ import annotations
import httpx
import pandas as pd
from pathlib import Path
import json
from pprint import pprint


url = "https://raw.githubusercontent.com/openfoodfacts/openbeautyfacts/develop/cosing/COSING_Ingredients-Fragrance.Inventory_v2.csv"

df = pd.read_csv(
    "data/ingredients.csv",
    engine="python",
    on_bad_lines="skip"
)


print(df.columns.tolist())