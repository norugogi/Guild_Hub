import requests
import json
import time

URL = "https://wp-api.nexon.com/v1/GameData/gcranking"

HEADERS = {
    "authorization": "Bearer 3E5C4287-849D-4EAA-A4EB-4528C9AB8E7D",
    "x-wp-api-key": "wp_fe_api_key",
    "content-type": "application/json",
    "origin": "https://wp.nexon.com",
    "referer": "https://wp.nexon.com/",
    "user-agent": "Mozilla/5.0"
}

classes = [
    "abyssrevenant",
    "solarsentinel",
    "mirageblade",
    "incensearcher",
    "runescribe",
    "enforcer"
]

all_players = {}

for c in classes:

    for page in range(1,4):   # 1~3 페이지 수집

        payload = {
            "world_group_id": "LIVE_W05",
            "world_id": "LIVE_W05_R5",
            "class": c,
            "page": page
        }

        print(f"{c} page {page} 수집중...")

        try:

            r = requests.post(URL, headers=HEADERS, json=payload)

            if r.status_code != 200:
                print("API 오류:", r.status_code)
                continue

            response = r.json()

            players = response.get("result", {}).get("gc", [])

            print("수집된 인원:", len(players))

            for p in players:

                name = p.get("gc_name")

                if not name:
                    continue

                if name not in all_players:

                    all_players[name] = {
                        "gc_name": name,
                        "gc_level": p.get("gc_level"),
                        "class": p.get("class"),
                        "grade": p.get("string_map", {}).get("grade"),
                        "guild_name": p.get("guild_name")
                    }

        except Exception as e:

            print("에러 발생:", e)

        time.sleep(0.3)

print("전체 플레이어:", len(all_players))


guild_members = [
    p for p in all_players.values()
    if (p.get("guild_name") or "").strip().upper() in ["DOG","CATT"]
]

print("결사원 수:", len(guild_members))


with open("catdog_all_in_one.json","w",encoding="utf8") as f:
    json.dump(guild_members,f,ensure_ascii=False,indent=2)

print("catdog_all_in_one.json 생성 완료")
