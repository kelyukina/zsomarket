import os
import re

# Путь к папке с html-файлами сайта
SITE_DIR = "D:/on deskort/Ден/ВУЗ/Помощь/ВКР Елюкина"

# Старый header (для поиска) — в сокращённом виде, но желательно точный фрагмент
OLD_HEADER_START = '<div class="header_wrap visible-lg visible-md title-v3">'
OLD_HEADER_END = "</header>"

# Новый header, как строка (уже заменённые ссылки в нём — без ../, для удобства корректируем динамически)
NEW_HEADER_TEMPLATE = """
<div class="header_wrap visible-lg visible-md title-v3 index">
      <header id="header">
        <div class="header-wrapper header-v7">
          <div class="logo_and_menu-row header__top-part">
            <div class="maxwidth-theme logo-row">
              <div class="header__top-inner">
                <a href="index.htm" style="display: flex;
                    align-items: center;
                    text-decoration: none;">
                  <div class="logo-block floated header__top-item">
                    <div class="line-block line-block--16">
                      <div class="logo line-block__item no-shrinked">
                        <img alt="ЗСОмаркет" data-src="upload/CMax/7de/a5zzzr7oxd95dux98mdxu5xoycjlquue.png" src="upload/CMax/7de/a5zzzr7oxd95dux98mdxu5xoycjlquue.png" title="ЗСОмаркет">
                      </div>
                    </div>
                  </div>
                  <div class="header__top-item">
                    <div class="float_wrapper">
                      <div class="hidden-sm hidden-xs">
                        <div class="top-description addr">
                          Медицинские товары от производителя
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
                <div class="header__top-item flex1 fix-block">
                  <div class="search_wrap">
                    <div class="search-block inner-table-block">
                      <div class="search-wrapper">
                        <div id="title-search_fixed">
                          <form action="/catalog/" class="search">
                            <div class="search-input-div">
                              <input autocomplete="off" class="search-input" style="z-index: 1;" id="title-search-input_fixed" maxlength="50" name="q" placeholder="ПОИСК" size="20" type="text" value="">
                            </div>
                            <div class="search-button-div" style="z-index: 2;">
                              <button class="btn btn-search" name="s" type="submit" value="Найти">
                                <i aria-hidden="true" class="svg search2 inline"><svg height="17" width="17">
                                    <use xlink:href="bitrix/templates/aspro_max/images/svg/header_icons_srite.svg#search">
                                    </use>
                                  </svg></i>
                              </button>
                              <span class="close-block inline-search-hide"><i aria-hidden="true" class="svg inline svg-inline-search svg-close close-icons colored_theme_hover"><svg height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
                                    <path class="cccls-1" d="M334.411,138l6.3,6.3a1,1,0,0,1,0,1.414,0.992,0.992,0,0,1-1.408,0l-6.3-6.306-6.3,6.306a1,1,0,0,1-1.409-1.414l6.3-6.3-6.293-6.3a1,1,0,0,1,1.409-1.414l6.3,6.3,6.3-6.3A1,1,0,0,1,340.7,131.7Z" data-name="Rounded Rectangle 114 copy 3" transform="translate(-325 -130)"></path>
                                  </svg></i></span>
                            </div>
                          </form>
                        <div class="title-search-result title-search-input_fixed" style="display: none;"></div></div>
                      </div>
                      <script>
                        var jsControl = new JCTitleSearch4({
                          //'WAIT_IMAGE': '/bitrix/themes/.default/images/wait.gif',
                          AJAX_PAGE: "/",
                          CONTAINER_ID: "title-search_fixed",
                          INPUT_ID: "title-search-input_fixed",
                          INPUT_ID_TMP: "title-search-input_fixed",
                          MIN_QUERY_LEN: 2,
                        });
                      </script>
                    </div>
                  </div>
                </div>
                <div class="phone-block icons">
                  <div class="inline-block">
                    <!-- noindex -->
                    <div class="phone with_dropdown">
                      <i aria-hidden="true" class="svg svg-inline-phone inline"><svg height="13" width="5">
                          <use xlink:href="bitrix/templates/aspro_max/images/svg/header_icons_srite.svg#phone_black">
                          </use>
                        </svg></i><a href="tel:88003508983" rel="nofollow">8-800-350-89-83</a>
                    </div>
                    <!-- /noindex -->
                  </div>
                </div>
                <div class="line-block line-block--40 line-block--40-1200">
                  <div class="right-icons wb line-block__item header__top-item">
                    <div class="line-block line-block--40 line-block--40-1200">
                      <!--'start_frame_cache_header-basket-with-compare-block1'-->
                      <!-- noindex -->
                      <div class="wrap_icon wrap_basket baskets line-block__item top_basket">
                        <a class="basket-link basket big" href="basket/index.htm" rel="nofollow" title="Корзина пуста">
                          <span class="js-basket-block">
                            <i aria-hidden="true" class="svg basket big inline"><svg height="16" width="19">
                                <use xlink:href="bitrix/templates/aspro_max/images/svg/header_icons_srite.svg#basket">
                                </use>
                              </svg></i>
                            <span class="title dark_link">Корзина</span>
                            <span class="count">0</span>
                          </span>
                        </a>
                        <span class="basket_hover_block loading_block loading_block_content"></span>
                      </div>
                      <!-- /noindex -->
                      <!--'end_frame_cache_header-basket-with-compare-block1'-->
                    </div>
                  </div>
                  <div class="line-block__item no-shrinked">
                    <div class="show-fixed top-ctrl">
                      <div class="personal_wrap">
                        <div class="wrap_icon inner-table-block person">
                          <!--'start_frame_cache_header-auth-block2'-->
                          <!-- noindex -->
                          <div class="auth_wr_inner">
                            <a class="personal-link dark-color" href="auth/index.htm" rel="nofollow" title="Мой кабинет"><i aria-hidden="true" class="svg svg-inline-cabinet big inline"><svg height="18" width="18">
                                  <use xlink:href="bitrix/templates/aspro_max/images/svg/header_icons_srite.svg#user">
                                  </use>
                                </svg></i><span class="wrap"><span class="name">Войти</span></span></a>
                          </div>
                          <!-- /noindex -->
                          <!--'end_frame_cache_header-auth-block2'-->
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="menu-row middle-block bgcolored">
            <div class="maxwidth-theme">
              <div class="row">
                <div class="col-md-12">
                  <div class="menu-only">
                    <nav class="mega-menu sliced ovisible initied">
                      <div class="table-menu">
                        <table style="">
                          <tbody><tr>
                            <td class="menu-item catalog wide_menu" style="visibility: visible;">
                              <div class="wrap">
                                <a class="" href="catalog/index.htm">
                                  <div>
                                    Каталог
                                    <i aria-hidden="true" class="svg svg-inline-down"><svg height="3" width="5">
                                        <use xlink:href="bitrix/templates/aspro_max/images/svg/trianglearrow_sprite.svg#trianglearrow_down">
                                        </use>
                                      </svg></i>
                                  </div>
                                </a>
                              </div>
                            </td>
                            <td class="menu-item" style="visibility: visible;">
                              <div class="wrap">
                                <a class="" href="brands/index.htm">
                                  <div>Бренды</div>
                                </a>
                              </div>
                            </td>
                            <td class="menu-item" style="visibility: visible;">
                              <div class="wrap">
                                <a class="" href="dostavka-i-oplata/index.htm">
                                  <div>Доставка и оплата</div>
                                </a>
                              </div>
                            </td>
                            <td class="menu-item" style="visibility: visible;">
                              <div class="wrap">
                                <a class="" href="opt/index.htm">
                                  <div>Оптовикам</div>
                                </a>
                              </div>
                            </td>
                            <td class="menu-item" style="visibility: visible;">
                              <div class="wrap">
                                <a class="" href="service/index.htm">
                                  <div>Сервис</div>
                                </a>
                              </div>
                            </td>
                            <td class="menu-item" style="visibility: visible;">
                              <div class="wrap">
                                <a class="" href="faq/index.htm">
                                  <div>Вопрос - ответ</div>
                                </a>
                              </div>
                            </td>
                            <td class="menu-item" style="visibility: visible;">
                              <div class="wrap">
                                <a class="" href="news/index.htm">
                                  <div>Новости</div>
                                </a>
                              </div>
                            </td>
                            
                            <!--<td class="menu-item" style="visibility: visible;">
						<div class="wrap">
							<a class="" href="/vacancy/">
								<div>
																		Контакты																	</div>
							</a>
													</div>
					</td>-->
                            <td class="menu-item dropdown js-dropdown nosave" style="visibility: visible;">
                              <div class="wrap">
                                <a class="dropdown-toggle more-items" href="#">
                                  <span>+ &nbsp;ЕЩЕ</span>
                                </a>
                                <span class="tail"></span>
                                <ul class="dropdown-menu" style="left: -102.5px;"><li class="menu-item " data-hidewidth="1137.234375" data-class="menu-item">
                                <a class="" href="contacts/index.htm">
                                  <div>Контакты</div>
                                </a>
                              </li></ul>
                              </div>
                            </td>
                          </tr>
                        </tbody></table>
                      </div>
                      <script data-skip-moving="true">
                        CheckTopMenuDotted();
                      </script>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="line-row visible-xs"></div>
        </div>
      </header>
"""


def find_old_header_block(content):
    """
    Найти и вернуть весь блок старого header между OLD_HEADER_START и OLD_HEADER_END
    """
    pattern = re.escape(OLD_HEADER_START) + r".*?" + re.escape(OLD_HEADER_END)
    match = re.search(pattern, content, re.DOTALL)
    if match:
        return match.group(0)
    return None


def adjust_paths(new_header, file_path):
    """
    В новом header поправить пути, чтобы для текущего файла ссылки были корректны.
    Например, если файл в корне, пути без ../.
    Если файл в подпапке, добавить ../ перед путями upload/, basket/ и т.п.
    """
    # Определим глубину вложенности файла относительно SITE_DIR
    rel_path = os.path.relpath(file_path, SITE_DIR)
    depth = rel_path.count(os.sep)

    # Список путей для корректировки
    paths_to_fix = [
        "upload/",
        "basket/index.htm",
        "bitrix/templates/aspro_max/",
        "dostavka-i-oplata/index.htm",
        "opt/index.htm",
        "service/index.htm",
        "faq/index.htm",
        "news/index.htm",
    ]

    fixed_header = new_header

    # Для каждого пути добавим '../' * depth, если depth > 0
    for p in paths_to_fix:
        if depth > 0:
            fixed_path = ("../" * depth) + p
        else:
            fixed_path = p
        # Заменим в строке пути — учитывая, что в шаблоне пути без ../
        fixed_header = fixed_header.replace(p, fixed_path)

    return fixed_header


def update_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    old_header_block = find_old_header_block(content)
    if not old_header_block:
        return False  # старый header не найден

    # Подготовить новый header с правильными путями
    new_header = adjust_paths(NEW_HEADER_TEMPLATE, file_path)

    # Заменить старый header на новый
    new_content = content.replace(old_header_block, new_header)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"Обновлен файл: {file_path}")
    return True


def main():
    for root, dirs, files in os.walk(SITE_DIR):
        for file in files:
            if file.endswith((".htm", ".html", ".php")):
                full_path = os.path.join(root, file)
                update_file(full_path)


if __name__ == "__main__":
    main()
