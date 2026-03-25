import requests
import json

url = "https://wp-api.nexon.com/v1/GameData/gcranking"

headers = {
    "Authorization": "Bearer 3E5C4287-849D-4EAA-A4EB-4528C9AB8E7D",
    "X-Wp-Api-Key": "wp_fe_api_key",
    "Content-Type": "application/json",
    "Origin": "https://wp.nexon.com",
    "Referer": "https://wp.nexon.com/"
}

worlds = [
"2-1","2-2","2-3","2-4","2-5",
"3-1","3-2","3-3","3-4","3-5",
"5-1","5-2","5-3","5-4","5-5",
"8-1","8-2","8-3","8-4","8-5",
"10-1","10-2","10-3","10-4","10-5",
"11-1","11-2","11-3","11-4","11-5",
"12-1","12-2","12-3","12-4","12-5",
"14-1","14-2","14-3","14-4","14-5",
"16-1","16-2","16-3","16-4","16-5",
"27-1","27-2","27-3","27-4","27-5"
]

all_data = []

for world in worlds:

    server, channel = world.split("-")

    world_group_id = f"LIVE_W{int(server):02d}"
    world_id = f"{world_group_id}_R{channel}"

    payload = {
        "world_group_id": world_group_id,
        "world_id": world_id
    }

    try:
        r = requests.post(url, headers=headers, json=payload)
        data = r.json()

        # 🔥 안전하게 접근
        players = data.get("result", {}).get("gc", [])

        for p in players:

            item = {
                "world": world,
                "name": p.get("gc_name"),
                "level": p.get("gc_level"),
                "grade": int(p.get("string_map", {}).get("grade", 0)),
                "class": p.get("class"),
                "guild": p.get("guild_name"),
                "ranking": p.get("ranking")
            }

            all_data.append(item)

        print(world, "완료:", len(players))

    except Exception as e:
        print(world, "에러:", e)

# 저장
with open("Who_are_you.json","w",encoding="utf-8") as f:
    json.dump(all_data, f, ensure_ascii=False, indent=2)

print("완료:", len(all_data), "명")
