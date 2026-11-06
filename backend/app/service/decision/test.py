import json

from app.core.settings import settings
import requests
from pydantic import BaseModel
from openai import OpenAI
from openai.types.responses import ToolChoiceFunctionParam
from openai.types.responses import FunctionToolParam
from openai.types.shared import Reasoning
from typing import Literal
import pandas as pd


def search_papers(queries: list[str], limit: int):
    papers = {}

    for query in queries[:3]:
        response = requests.get(
            "https://www.ebi.ac.uk/europepmc/webservices/rest/search",
            params={
                "query": query,
                "pageSize": limit,
                "format": "json",
                "resultType": "core",
            },
            timeout=30,
        )
        response.raise_for_status()

        for paper in response.json()["resultList"]["result"]:
            papers[(paper["source"], paper["id"])] = paper

    return list(papers.values())


OptionalStr = str | None


class IngredientRelation(BaseModel):

    ingredient: str
    target: str
    relation: Literal["MAY_HELP_WITH"]
    concentration: OptionalStr
    application: OptionalStr
    evidence: str
    source_doi: OptionalStr  # digital object identifier - science research
    source_pmid: OptionalStr  # pubmed identifier
    study_type: OptionalStr


class ExtractionResult(BaseModel):
    relations: list[IngredientRelation]


class IngredientAliases(BaseModel):
    aliases: list[str]


def research_ingredient(
    ingredient: str, aliases: list[str], skin_concern: str
) -> ExtractionResult:

    tools: list[FunctionToolParam] = [
        {
            "type": "function",
            "name": "search_papers",
            "description": (
                "Search Europe PMC. Generate exactly 3 distinct "
                "scientific search queries using the ingredient's "
                "verified names and relevant clinical terminology."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "queries": {"type": "array", "items": {"type": "string"}},
                    "limit": {"type": "integer"},
                },
                "required": ["queries", "limit"],
                "additionalProperties": False,
            },
            "strict": True,
        }
    ]

    reasoning = Reasoning(effort="high")
    tool_choice: ToolChoiceFunctionParam = {"type": "function", "name": "search_papers"}
    response = client.responses.create(
        model=settings.open_ai_model,
        input=(
            f"Find scientific studies about topical {ingredient} "
            f"and {skin_concern}. "
            f"Search using these possible aliases: {aliases}. "
            "Do not treat chemical derivatives as equivalent."
        ),
        tools=tools,
        tool_choice=tool_choice,
        reasoning=reasoning,
    )

    for call in response.output:
        if call.type == "function_call":
            args = json.loads(call.arguments)

            papers = search_papers(**args)
            papers = [
                {
                    "title": paper.get("title"),
                    "abstract": paper.get("abstractText"),
                    "doi": paper.get("doi"),
                    "pmid": paper.get("pmid"),
                }
                for paper in papers
            ]

            response = client.responses.parse(
                model=settings.open_ai_model,
                previous_response_id=response.id,
                input=[
                    {
                        "type": "function_call_output",
                        "call_id": call.call_id,
                        "output": json.dumps(papers),
                    }
                ],
                instructions=(
                    f"Evaluate whether topical {ingredient} or any of its aliases "
                    f"helps with {skin_concern}. "
                    "Return a MAY_HELP_WITH relation ONLY when the supplied "
                    "scientific studies provide direct evidence of improvement "
                    "for this specific ingredient and skin concern. "
                    "If evidence is missing, indirect, or insufficient, "
                    "return an empty relations list. "
                    "Never create relations to represent missing evidence. "
                    "Never invent DOI or PMID."
                ),
                text_format=ExtractionResult,
            )
            result = response.output_parsed or ExtractionResult(relations=[])

            print(result)
            return result


client = OpenAI(api_key=settings.open_ai_key)

df = pd.read_csv("data/ingredients.csv", on_bad_lines="skip")
ingredients = (
    df["INCI name"]
    .dropna()
    .drop_duplicates()
    .loc[
        lambda s: s.str.contains(
            "|".join(("RETINOL", "NIACINAMIDE", "SALICYLIC")), case=False, na=False
        )
    ]
    .tolist()
)


for ingredient in ingredients:
    print(f"Analyzing: {ingredient}")

    response = client.responses.parse(
        model=settings.open_ai_model,
        input=(
            f"Find scientific synonyms for {ingredient}. "
            "Only return alternative names for the EXACT same chemical substance. "
            "Do not include derivatives, salts, or related compounds. "
            "Return an empty list if unsure."
        ),
        text_format=IngredientAliases,
    )

    ingredient_aliases = [ingredient, *response.output_parsed.aliases]

    result = research_ingredient(ingredient, ingredient_aliases, skin_concern="acne")
    result.relations = [
        r
        for r in result.relations
        if r.ingredient.strip().casefold() == ingredient.strip().casefold()
    ]

    if result is not None:
        with open("results.jsonl", "a", encoding="utf-8") as f:
            f.write(
                json.dumps(
                    {
                        "ingredient": ingredient,
                        "skin_concern": "acne",
                        "relations": result.model_dump()["relations"],
                    }
                )
                + "\n"
            )
