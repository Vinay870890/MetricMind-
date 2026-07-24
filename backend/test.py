import pandas as pd

df = pd.read_csv("uploads/Global Superstore.csv")

apac = df[df["Market"] == "APAC"]

print("APAC Rows:", len(apac))
print("APAC Sales:", apac["Sales"].sum())