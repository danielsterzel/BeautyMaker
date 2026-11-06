import networkx as nx
from black.trans import defaultdict
from neo4j import GraphDatabase
import json
from pprint import pprint
from app.service.decision.data.schemas import (
    NormalizedSkinOutput,
    NormalizedSkinTarget,
)
from enum import StrEnum


class SkincareGraphEdgeTypes(StrEnum):
    SKIN_CONCERN = "skin_concern"
    SKIN_GOAL = "skin_goal"
    PRODUCT_FUNCTION = "product_function"
    OTHER = "other"


with open("normalized-targets.json", "r") as f:
    normalized_targets = json.load(f)

pprint(normalized_targets)

normalized_targets = NormalizedSkinOutput.model_validate(normalized_targets)

target_mapping = defaultdict(list)


for target in normalized_targets.normalized_targets:
    target = NormalizedSkinTarget.model_validate(target)
    # print(f"Original name: {target.original_name}")
    # print(f"Normalised name: {target.normalised_name}")
    target_mapping[target.normalized_name].append(target.original_name)

pprint(target_mapping)

driver = GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "aurelia12345"))

rows = [{
    "normalized": target.normalized_name,
    "category": target.category

} for target in normalized_targets.normalized_targets]

constraints = [
    """
    CREATE CONSTRAINT product_id_unique IF NOT EXISTS
    FOR (p: Product)
    REQUIRE p.id is UNIQUE
    """,
    """
    CREATE CONSTRAINT target_key_unique IF NOT EXISTS
    FOR (s: SkinTarget)
    REQUIRE s.key IS UNIQUE
    """
]

records, summary, keys = driver.execute_query(
    """
""")
