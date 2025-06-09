import os
from bs4 import BeautifulSoup

# Путь к корню сайта с .htm файлами
ROOT_DIR = '.'

# Абсолютный путь к файлу, который нужно обработать
TARGET_HREF = 'bitrix/templates/aspro_max/css/blocks/common.blocks/bottom-icons-panel/bottom-icons-panel.css'

def calc_depth(filepath):
    rel_path = os.path.relpath(filepath, ROOT_DIR)
    parts = rel_path.split(os.sep)
    return len(parts) - 1

def normalize_href(href):
    return os.path.normpath(href).replace('\\', '/')

def adjust_link(href, depth):
    up_path = '../' * depth
    normalized_href = normalize_href(href)

    if normalized_href.startswith('/'):
        normalized_href = normalized_href[1:]

    href_parts = normalized_href.split('/')
    while href_parts and href_parts[0] == '..':
        href_parts.pop(0)
    final_href = up_path + '/'.join(href_parts)
    final_href = final_href.replace('//', '/')
    return final_href or './'

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    soup = BeautifulSoup(content, 'html.parser')
    depth = calc_depth(filepath)

    changed = False
    # Ищем все <link> с нужным href
    for link in soup.find_all('link', href=True):
        href = normalize_href(link['href'])
        if TARGET_HREF in href:
            new_href = adjust_link(TARGET_HREF, depth)
            if link['href'] != new_href:
                link['href'] = new_href
                changed = True

    if changed:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(str(soup))
    return changed

def main():
    count = 0
    for root, dirs, files in os.walk(ROOT_DIR):
        for file in files:
            if file.endswith('.htm') or file.endswith('.html'):
                fullpath = os.path.join(root, file)
                if process_file(fullpath):
                    print(f'Обновлен файл: {fullpath}')
                    count += 1
    print(f'Обновлено файлов: {count}')

if __name__ == '__main__':
    main()
