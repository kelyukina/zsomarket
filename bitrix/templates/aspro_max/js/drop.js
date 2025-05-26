class DropZone {
  constructor(selector, option = {}) {
    this.setOption(option);
    this.el = document.querySelector(selector);
    this.inputFiles = this.el.querySelector('input[type="file"]');
    this.wrapper = this.el.querySelector(this.option.wrapperSelector);
    this.init();

  }

  init = () => {
    this.dt = new DataTransfer();
    this.bindEvents();
    this.insertTextNode();
  }

  setOption = (option) => {
    const optionDefault = {
      wrapperSelector: '.drop-zone__wrapper',
      maxImageCount: '10',
      type: 'image',
      countUploadImages: 0,
      className: {
        wrapperText: 'drop-zone__wrapper-text',
        images: 'drop-zone__images',
        image: 'drop-zone__image',
        imageClose: 'drop-zone__image-close',
        imagesIcon: 'drop-zone__image-icon',
        checkboxInput: 'drop_zone__images-input',
      },
    };
    this.option = this.deepMerge({}, optionDefault, option);
    this.option.text = BX.message('DROP_FILE').replace(/#COUNT_FILES#/, this.option.maxImageCount);
  }

  deepMerge = (target, ...objects) => {
    for (let obj of objects) {
      const props = Object.getOwnPropertyNames(obj)
      for (let prop of props) {
        let value = obj[prop]
        if (value && typeof value === 'object') {
          target[prop] = target[prop] || {}
          this.deepMerge(target[prop], value)
        } else {
          target[prop] = value
        }
      }
    }
    return target
  }

  insertTextNode = () => {
    const $block = BX.create('div', {
      attrs: {
        className: this.option.className.wrapperText,
      },
      html: this.option.text
    });
    this.wrapper.appendChild($block);
  }
  bindEvents = () => {
    this.inputFiles.addEventListener('change', e => this.addFileFromFileList(e.target.files));

    this.el.addEventListener(
      'click',
      e => {
        if (e.target.closest('.' + this.option.className.imageClose)) {
          this.removeFileFromFileList(e.target.closest('.' + this.option.className.image).dataset.name);

          const delImage = e.target.closest('.' + this.option.className.image).getAttribute('for');
          if (delImage) {
            if (this.el.querySelector('input#' + delImage)) {
              this.el.querySelector('input#' + delImage).checked = true;
            }
          }
          e.target.closest('.' + this.option.className.image).remove();
          if (this.el.querySelector('img') == null) {
            this.imagesWrapper.remove();
          }
        }
      }
    );

    this.el.addEventListener("drop",
      e => {
        e.preventDefault();
        let arrFile = [];
        arrFile = e.dataTransfer.files;

        this.addFileFromFileList(arrFile);
        this.el.classList.remove('dragover');
      });

    this.el.addEventListener("dragover", e => e.preventDefault());
    this.el.addEventListener("dragleave", e => this.el.classList.remove('dragover'));
    this.el.addEventListener("dragenter", e => this.el.classList.add('dragover'));
  }

  get imagesWrapper() {
    return this.el.getElementsByClassName(this.option.className.images)[0];
  }

  get countImages() {
    return this.option.countUploadImages;
  }

  set countImages(value) {

    this.option.countUploadImages += value;

    if (!value) {
      this.option.countUploadImages = Number(!!value);
    }
  }

  addFileFromFileList = arrFile => {

    let countImages = this.countImages = arrFile.length;
    const maxImageCount = this.option.maxImageCount;


    if (this.countImages > maxImageCount) {
      countImages = countImages - (this.countImages - maxImageCount);
      this.option.countUploadImages = maxImageCount;
    }

    if (countImages) {
      for (let i = 0; i < countImages; i++) {
        if (arrFile[i].type.indexOf(this.option.type) === 0) {
          this.dt.items.add(arrFile[i]);
        }
      }

      if (this.dt.items.length) {
        this.appendImagesBlock();
      }
      for (var i = 0; i < countImages; ++i) {
        if (arrFile[i].type.indexOf(this.option.type) === 0) {
          const reader = new FileReader();
          reader.readAsDataURL(arrFile[i]);
          reader.name = arrFile[i].name;
          reader.onloadend = e => {
            this.appendImageBlock(e);
          }
        }
      }
    }

    this.inputFiles.files = this.dt.files;
  }
  appendImagesBlock = () => {
    if (!this.imagesWrapper) {
      const $blockWrapper = BX.create('div', {
        attrs: {
          className: this.option.className.images,
        }
      });
      this.el.insertBefore($blockWrapper, this.wrapper);
    }
  }

  appendImageBlock = (object) => {
    let name, src, alt, title, delImg, $input;
    if (typeofExt(object) === 'progressevent') {
      name = alt = title = object.target.name;
      src = object.target.result;
    } else {
      name = alt = title = object.getAttribute('alt');
      src = object.getAttribute('src');
      delImg = object.dataset.id;

      $input = BX.create('input', {
        attrs: {
          type: 'checkbox',
          name: 'deleted_images[]',
          value: object.dataset.id,
          id: 'del-image-' + object.dataset.id,
          className: this.option.className.checkboxInput,
        },
      });
    }

    const $block = BX.create('label', {
      attrs: {
        className: this.option.className.image + ' bordered rounded3',
        for: 'del-image-' + delImg
      },
      dataset: {
        name: name,
      },
      children: [
        BX.create('span', {
          attrs: {
            className: this.option.className.imageClose,
            title: BX.message('BPC_MES_DELETE'),
          },
          children: [
            BX.create('span', {
              attrs: {
                className: this.option.className.imagesIcon + ' rounded3',
              },
            }),
          ]
        }),
        BX.create('img', {
          attrs: {
            src: src,
            alt: alt,
            title: title,
          },
        }),
      ]
    });
    if ($input) {
      this.el.appendChild($input);
    }
    this.imagesWrapper.appendChild($block);
  }

  removeFileFromFileList = fileName => {
    if (fileName) {

      this.countImages = -1;

      for (let i = 0; i < this.dt.files.length; i++) {
        if (this.dt.files[i].name == fileName) {
          this.dt.items.remove(i);
          break;
        }
      }
      this.inputFiles.files = this.dt.files;
    }
  }

  drawImagesFromColection = $images => {
    let countImages = $images.length;
    if (countImages) {
      this.appendImagesBlock();
      for (let i = 0; i < countImages; i++) {
        this.appendImageBlock($images[i]);
      }
      this.countImages = countImages;
    }
  }

  removeAllFiles = () => {

    if (this.imagesWrapper) {
      this.imagesWrapper.remove();
    }

    for (let i = this.dt.files.length; i--;) {
      this.dt.items.remove(i);
    }

    this.countImages = 0;
    this.inputFiles.files = this.dt.files;
  }
}
