from __future__ import annotations
import pandas as pd
from pathlib import Path
import json
from pprint import pprint

from neo4j import GraphDatabase

"""
Cosmetic Ingredient Review (CIR)

PubChem

European Chemicals Agency (ECHA) / OECD eChemPortal

# edge labels:
# HAS_FUNCTION ; MAY_HELP_WITH ; MAY_CAUSE ;
# INTERACTS_WITH ;

"""

url = "https://raw.githubusercontent.com/openfoodfacts/openbeautyfacts/develop/cosing/COSING_Ingredients-Fragrance.Inventory_v2.csv"

df = pd.read_csv("data/ingredients.csv", engine="python", on_bad_lines="skip")

driver = GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "aurelia12345"))
driver.verify_connectivity()

ingredients = df[["INCI name", "Function"]].copy()

ingredients = ingredients.dropna(subset=["INCI name", "Function"])
duplicates = ingredients[ingredients["INCI name"].duplicated(keep=False)]

print(duplicates.sort_values("INCI name").to_string())

print(ingredients["INCI name"].duplicated().sum())


ingredients["Function"] = ingredients["Function"].str.split(",")

ingredients = (
    ingredients.explode("Function")
    .assign(Function=lambda x: x["Function"].str.strip())
    .query("Function != 'NOT REPORTED'")
    .groupby("INCI name")["Function"]
    .agg(lambda functions: list(set(functions)))
)


mapping = ingredients.to_dict()


mapped_ingredients = [
    {"name": name, "functions": functions} for name, functions in mapping.items()
]

records, summary, keys = driver.execute_query(
    """
    UNWIND $mapped_ingredients AS m_ingredient
    
    MERGE (i: Ingredient {name: m_ingredient.name})
    
    WITH i, m_ingredient
    UNWIND m_ingredient.functions as FUNCTION_NAME
    
    MERGE(f: Function {name: FUNCTION_NAME})
    
    MERGE (i)-[:HAS_FUNCTION]->(f)
    """,
    mapped_ingredients=mapped_ingredients,
    database_="neo4j",
)
