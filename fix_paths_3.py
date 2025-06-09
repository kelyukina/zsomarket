import os
from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import unquote

ROOT_DIR = "."  # укажи корневую папку с файлами


def is_bottom_nav_block(tag):
    return tag.name == "div" and "bottom_nav" in tag.get("class", [])


def fix_links_in_bottom_nav(file_path: Path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    soup = BeautifulSoup(content, "html.parser")
    changed = False

    for bottom_nav in soup.find_all(is_bottom_nav_block):
        # ищем все ссылки внутри блока bottom_nav
        for a in bottom_nav.find_all("a", href=True):
            href = unquote(a["href"])

            # исправляем только ссылки, ведущие на ../../../index.htm (или с похожими переходами вверх)
            if href.endswith("index.htm") and ("../" in href or "..\\" in href):
                # заменяем на просто index.htm (без переходов в верх)
                new_href = "index.htm"
                if a["href"] != new_href:
                    print(
                        f"[+] {file_path.relative_to(ROOT_DIR)}: исправлена ссылка {a['href']} → {new_href}"
                    )
                    a["href"] = new_href
                    changed = True

    if changed:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(str(soup))
    return changed


def process_all_files(root_dir):
    for root, _, files in os.walk(root_dir):
        for file in files:
            if file.endswith(".htm") or file.endswith(".html"):
                file_path = Path(root) / file
                fix_links_in_bottom_nav(file_path)


if __name__ == "__main__":
    process_all_files(ROOT_DIR)
