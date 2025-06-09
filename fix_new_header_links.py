import os
import re
from urllib.parse import urlparse

SITE_DIR = "."

# Маркер начала и конца нового header (уникальные строки)
NEW_HEADER_START = '<div class="header_wrap visible-lg visible-md title-v3 index">'
NEW_HEADER_END = "</header>"

# Регулярка для поиска атрибутов с относительными ссылками
# Поддерживаются href, src, action
ATTRS = ["href", "src", "action", "src-data"]
ATTR_REGEX = re.compile(r'({})="([^":#?][^"]*)"'.format("|".join(ATTRS)))


def is_relative_url(url):
    """Проверить, что ссылка относительная (не начинается с http://, https://, /, #, mailto: и т.п.)"""
    if url.startswith(("/", "http://", "https://", "#", "mailto:", "tel:")):
        return False
    # Можно добавить проверку на протоколы или абсолютные пути
    return True


def adjust_relative_url(url, depth):
    """
    Поправить относительный url, добавив ../ столько раз, сколько depth,
    чтобы путь стал корректным относительно файла.
    """
    prefix = "../" * depth
    return prefix + url


def update_header_links(header_html, depth):
    """
    В переданном html блока header найти все относительные ссылки и поправить их.
    """

    def repl(match):
        attr = match.group(1)
        url = match.group(2)
        if is_relative_url(url):
            new_url = adjust_relative_url(url, depth)
            return f'{attr}="{new_url}"'
        else:
            return match.group(0)  # без изменений

    return ATTR_REGEX.sub(repl, header_html)


def extract_header_block(content):
    """
    Найти в контенте блок нового header между NEW_HEADER_START и NEW_HEADER_END.
    Вернуть (header_block, start_index, end_index) или (None, None, None)
    """
    start_idx = content.find(NEW_HEADER_START)
    if start_idx == -1:
        return None, None, None
    end_idx = content.find(NEW_HEADER_END, start_idx)
    if end_idx == -1:
        return None, None, None
    end_idx += len(NEW_HEADER_END)
    header_block = content[start_idx:end_idx]
    return header_block, start_idx, end_idx


def update_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    header_block, start_idx, end_idx = extract_header_block(content)
    if not header_block:
        return False  # новый header не найден

    # Вычисляем глубину вложенности файла относительно SITE_DIR
    rel_path = os.path.relpath(file_path, SITE_DIR)
    depth = rel_path.count(os.sep)

    # Обновляем ссылки внутри header
    new_header = update_header_links(header_block, depth)

    # Заменяем старый header новым в контенте
    new_content = content[:start_idx] + new_header + content[end_idx:]

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"Обновлены ссылки в header файла: {file_path}")
    return True


def main():
    for root, dirs, files in os.walk(SITE_DIR):
        for file in files:
            if file.endswith((".htm", ".html", ".php")):
                full_path = os.path.join(root, file)
                update_file(full_path)


if __name__ == "__main__":
    main()
