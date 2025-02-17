from os import listdir
import json

data = {}

images = listdir("images")
print(images)

# map names to path
for name in images:
    data[name[:-4]] = "images/" + name

with open("images.json", "w") as f:
    json.dump(data, f)
