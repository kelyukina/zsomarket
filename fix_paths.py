import os
from bs4 import BeautifulSoup


def convert_to_absolute(base_dir, href):
    """Преобразует ссылку в абсолютный путь относительно корня сайта."""
    combined = os.path.normpath(os.path.join(base_dir, href))
    return combined.replace("\\", "/")


def relative_path(from_dir, to_path):
    """Вычисляет относительный путь между двумя путями в рамках сайта."""
    from_parts = from_dir.split("/") if from_dir else []
    to_parts = to_path.split("/")

    # Найти общую часть пути
    common = 0
    for f, t in zip(from_parts, to_parts):
        if f == t:
            common += 1
        else:
            break

    up_levels = len(from_parts) - common
    down_parts = to_parts[common:]

    parts = [".." for _ in range(up_levels)] + down_parts
    return "/".join(parts)


def process_html_file(file_path, site_root):
    """Обрабатывает HTML-файл, обновляя ссылки внутри menu-item'ов."""
    with open(file_path, "r", encoding="utf-8") as f:
        html = f.read()

    soup = BeautifulSoup(html, "html.parser")
    menu_block = soup.find(class_="menu-row middle-block bgcolored")

    if not menu_block:
        print(f"[!] Пропущен (блок меню не найден): {file_path}")
        return

    base_dir = os.path.relpath(os.path.dirname(file_path), site_root).replace("\\", "/")
    if base_dir == ".":
        base_dir = ""

    print(f"[+] Обработка файла: {file_path}")
    changes = 0
    total_links = 0

    site_root_abs = os.path.abspath(site_root)

    for item in menu_block.find_all(class_="menu-item"):
        for a in item.find_all("a", href=True):
            href = a["href"]
            total_links += 1

            if not href or href.startswith(("#", "javascript:")) or "://" in href:
                continue

            # 1. Переводим href в абсолютный путь (с учетом ../)
            abs_target = convert_to_absolute(base_dir, href)
            full_abs_path = os.path.abspath(os.path.join(site_root_abs, abs_target))

            # 2. Проверка существования
            if not os.path.exists(full_abs_path):
                print(f"[!] Ошибочная ссылка: {href} → файл не найден")

                # Попробуем перестроить путь от корня сайта
                cleaned_href = os.path.basename(href)  # например, "page.html"
                abs_target = cleaned_href
                full_abs_path = os.path.join(site_root_abs, abs_target)

                if not os.path.exists(full_abs_path):
                    print(
                        f"    ✗ Даже после исправления '{cleaned_href}' файл не найден."
                    )
                    continue  # Нет смысла менять — всё равно битая ссылка

            # 3. Строим новый относительный путь
            rel_target = os.path.relpath(full_abs_path, site_root_abs).replace(
                "\\", "/"
            )
            new_href = relative_path(base_dir, rel_target)

            if href != new_href:
                print(f"    > {href} → {new_href}")
                a["href"] = new_href
                changes += 1

    if changes > 0:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(str(soup))
        print(f"[✓] Ссылки обновлены: {changes} из {total_links}\n")
    else:
        print(f"[=] Нет изменений (всего ссылок: {total_links})\n")
    """Обрабатывает HTML-файл, обновляя ссылки внутри menu-item'ов."""
    with open(file_path, "r", encoding="utf-8") as f:
        html = f.read()

    soup = BeautifulSoup(html, "html.parser")
    menu_block = soup.find(class_="menu-row middle-block bgcolored")

    if not menu_block:
        print(f"[!] Пропущен (блок меню не найден): {file_path}")
        return

    base_dir = os.path.relpath(os.path.dirname(file_path), site_root).replace("\\", "/")
    if base_dir == ".":
        base_dir = ""

    print(f"[+] Обработка файла: {file_path}")
    changes = 0
    total_links = 0

    site_root_abs = os.path.abspath(site_root)

    for item in menu_block.find_all(class_="menu-item"):
        for a in item.find_all("a", href=True):
            href = a["href"]
            total_links += 1

            if not href or href.startswith(("#", "javascript:")) or "://" in href:
                continue

            abs_target = convert_to_absolute(base_dir, href)
            abs_target = os.path.normpath(abs_target).replace("\\", "/")

            full_abs_path = os.path.abspath(os.path.join(site_root_abs, abs_target))

            # Обработка даже если путь вышел за пределы сайта
            rel_target = os.path.relpath(full_abs_path, site_root_abs).replace(
                "\\", "/"
            )
            new_href = relative_path(base_dir, rel_target)

            if href != new_href:
                print(f"    > {href} → {new_href}")
                a["href"] = new_href
                changes += 1

    if changes > 0:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(str(soup))
        print(f"[✓] Ссылки обновлены: {changes} из {total_links}\n")
    else:
        print(f"[=] Нет изменений (всего ссылок: {total_links})\n")


def main(site_root):
    """Основная функция: обрабатывает все HTML-файлы в директории сайта."""
    for root, _, files in os.walk(site_root):
        for file in files:
            if file.endswith((".htm", ".html")):
                file_path = os.path.join(root, file)
                process_html_file(file_path, site_root)


if __name__ == "__main__":
    SITE_ROOT = "."  # Путь к корню сайта
    main(SITE_ROOT)
