import pandas as pd
import json
from pathlib import Path

# ========= 文件路径 =========

# CSV 文件
csv_path = Path("data/hanju_finalmetadata_v3.csv")

# 输出 JSON 文件
json_path = Path("data/hanju.json")

# ========= 检查文件 =========

if not csv_path.exists():
    print(f"找不到 CSV 文件: {csv_path}")
    exit()

# ========= 读取 CSV =========

df = pd.read_csv(csv_path)

# 空值转为空字符串
df = df.fillna("")

# ========= 转换数据 =========

result = []

for _, row in df.iterrows():

    pdf_filename = str(row["剧本文件名"]).strip()

    item = {

        # 基础信息
        "id": row["剧本ID"],
        "title": row["剧目名称"],
        "alias": row["剧目别名"],

        # 来源
        "sourceSeries": row["全本出处"],
        "isExcerpt": row["是否折子戏"],

        # 时空背景
        "era": row["时代背景"],
        "location": row["故事地点"],

        # 主题
        "themes": row["主题关键词"],
        "themeCategory": row["主题分类"],

        # 文学来源
        "sourceMaterial": row["选材来源"],
        "specificSource": row["具体来源"],

        # 剧本形态
        "scriptType": row["剧本形态"],

        # 表演信息
        "hangdang": row["主要行当"],
        "roleMapping": row["角色-行当映射"],
        "protagonists": row["主角"],

        # 音乐信息
        "shengqiang": row["主要唱腔声腔"],
        "banshi": row["主要板式"],
        "performanceNote": row["唱法备注"],

        # 剧情
        "summary": row["剧情简介"],

        # 备注
        "remark": row["备注"],

        # PDF 路径
        "pdfUrl": f"/pdfs/{pdf_filename}"
    }

    result.append(item)

# ========= 输出 JSON =========

with open(json_path, "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

# ========= 完成提示 =========

print("===================================")
print("JSON 转换成功")
print(f"输出文件: {json_path}")
print(f"共转换 {len(result)} 条剧本数据")
print("===================================")
