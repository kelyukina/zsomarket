import os
import re

BASE_PATH = 'bitrix/templates/aspro_max/images'  # Путь, который надо привести к относительному
ROOT_DIR = './'  # Папка, откуда начинается поиск .htm файлов (можно изменить)

# Регулярка ищет src="..." или data-src='...'
pattern = re.compile(r'''(?P<attr>src|data-src)=["'](/?''' + re.escape(BASE_PATH) + r'''[^"']+)["']''')

def get_relative_prefix(depth):
    return './' if depth == 0 else '../' * depth

def make_relative_path(abs_path, file_path):
    depth = len(os.path.relpath(file_path, ROOT_DIR).split(os.sep)) - 1
    rel_prefix = get_relative_prefix(depth)
    return rel_prefix + abs_path.lstrip('/')

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    def replace(match):
        attr = match.group('attr')
        abs_path = match.group(2)
        rel_path = make_relative_path(abs_path, filepath)
        return f'{attr}="{rel_path}"'

    new_content = pattern.sub(replace, content)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"✔ Обновлено: {filepath}")
    else:
        print(f"— Без изменений: {filepath}")

# Рекурсивный обход папок
for dirpath, _, filenames in os.walk(ROOT_DIR):
    for filename in filenames:
        if filename.endswith('.htm'):
            filepath = os.path.join(dirpath, filename)
            process_file(filepath)
