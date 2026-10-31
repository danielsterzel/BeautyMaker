"""
given a decision matrix:

product     Effectiveness       Tolerance       Price Availability
A               9                   4                   6
B               7                   8                   7
C               5                   9                   9


(0-10 ratings)

given these weights:
Effectiveness = .5
Tolerance     = .3
Price         = .2

hypothesis = Which product is the best?


Proposed approaches:
- Weighted Sum Model
    Si = sum([wj * xij, ... ,...]

    wj  - weight of criteria
    xij - rating of product i for criteria j

problem with approach:

higher effectiveness can be as valuable as high tolerance along with high price availability
possible solution: dynamic weights assignment

- TOPSIS: which alternative is closes to the perfect resolution and as far away
    from the worst solution as possible

    Ideal positive: A+ - best possible values for criteria
    Ideal negative: A- - worst possible values for criteria


    1. normalization of decision matrix
    2. multiple normalized value with weight -> vij
    3. A+ = max vij; A- = min vij
    4. calculate distance (depends on the data model, e.g. Euclidean distance)
        results in Di - distance
    5. Result Ci = Di- / (Di+ + Di-)

    the closer the value is to 1 the better it is
"""

import pandas as pd
from app.service.decision.data_prep import df

pd.set_option("display.max_columns", None)
pd.set_option("display.width", None)

print(df.info())


df = df[df["primary_category"] == "Skincare"]


print(df.head())

weights = [
    {
        "rating": 6.5,
        "reviews": 5,
        "size": 2,
        "price_usd": 7,
        "secondary_category": {
            "Moisturizers": 8,
            "Treatments": 9,
            "Sunscreen": 9,
        },
    },
    {
        "rating": 7.6,
        "reviews": 2,
        "size": 9,
        "price_usd": 1,
        "secondary_category": {
            "Eye Care": 9,
            "Lip Balms & Treatments": 9,
        },
    },
]
# normalise values
