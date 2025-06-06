import os
import re

TARGET_DIR = 'catalog'  # <- ЗАДАЙ свою папку здесь
ROOT_DIR = os.path.abspath('./')

pattern = re.compile(
    r'''(?P<attr>href|src|data-src)=["'](?P<path>(?!https?:|data:|mailto:|tel:|#)[^"']+)["']''',
    flags=re.IGNORECASE
)

def find_file_path_from_site_root(target_rel_path):
    """Ищет файл в структуре сайта, возвращает его абсолютный путь, если найден"""
    for dirpath, _, filenames in os.walk(ROOT_DIR):
        for filename in filenames:
            if os.path.normpath(os.path.join(dirpath, filename)).endswith(os.path.normpath(target_rel_path)):
                return os.path.join(dirpath, filename)
    return None

def resolve_correct_relative(source_file, link_path):
    """Формирует корректный относительный путь к файлу от source_file"""
    source_dir = os.path.dirname(source_file)
    abs_source_dir = os.path.abspath(source_dir)

    # 1. Сначала пробуем интерпретировать путь относительно текущего файла
    candidate_abs = os.path.abspath(os.path.join(abs_source_dir, link_path))
    if os.path.exists(candidate_abs):
        return os.path.relpath(candidate_abs, abs_source_dir).replace('\\', '/')

    # 2. Иначе ищем в структуре сайта
    found_abs = find_file_path_from_site_root(link_path)
    if found_abs:
        corrected = os.path.relpath(found_abs, abs_source_dir).replace('\\', '/')
        return corrected

    print(f"⚠ Не найден: {link_path} (в файле {source_file})")
    return link_path

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    def replace(match):
        attr = match.group('attr')
        path = match.group('path')
        new_path = resolve_correct_relative(filepath, path)
        if new_path != path:
            print(f"{filepath}: {path} → {new_path}")
        return f'{attr}="{new_path}"'

    new_content = pattern.sub(replace, content)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"✔ Обновлено: {filepath}")
    else:
        print(f"— Без изменений: {filepath}")

def process_target_folder(target_folder):
    abs_target = os.path.join(ROOT_DIR, target_folder)
    for dirpath, _, filenames in os.walk(abs_target):
        for filename in filenames:
            if filename.lower().endswith('.htm'):
                process_file(os.path.join(dirpath, filename))

# ▶ Запускаем обработку целевой папки
process_target_folder(TARGET_DIR)
