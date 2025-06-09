import os
import re

SITE_DIR = "."  # корень сайта, где лежат html/php файлы
LOGO_ABS_PATH = (
    "/upload/CMax/7de/a5zzzr7oxd95dux98mdxu5xoycjlquue.png"  # путь от корня сайта
)


def make_relative_path(from_path, to_path):
    """Вычислить относительный путь от from_path к to_path"""
    from_dir = os.path.dirname(from_path)
    rel_path = os.path.relpath(to_path, start=from_dir)
    return rel_path.replace("\\", "/")  # на всякий случай заменить \ на /


def update_logo_paths_in_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Найдем все <img ... src="..." data-src="..."> с нашим логотипом по части пути "/upload/CMax/7de/..."
    # Чтобы не менять другие картинки
    pattern = r'(<img[^>]+(?:src|data-src)=")([^"]*/upload/CMax/7de/[^"]+)(")'

    def repl(match):
        prefix = match.group(1)
        old_path = match.group(2)
        suffix = match.group(3)

        # Посчитаем новый относительный путь от файла до абсолютного пути логотипа (от корня сайта)
        new_rel_path = make_relative_path(
            file_path, os.path.join(SITE_DIR, LOGO_ABS_PATH.lstrip("/"))
        )
        return prefix + new_rel_path + suffix

    new_content, count = re.subn(pattern, repl, content, flags=re.IGNORECASE)

    if count > 0:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Обновлено {count} путей в файле: {file_path}")
        return True
    return False


def main():
    for root, dirs, files in os.walk(SITE_DIR):
        for file in files:
            if file.endswith((".html", ".htm", ".php")):
                full_path = os.path.join(root, file)
                update_logo_paths_in_file(full_path)


if __name__ == "__main__":
    main()
