const Client = require('ftp');
const fs = require('fs');

const chalk = require('chalk');
const log = console.log;

const deploy = '';
const login = '';
const pass = '';

const jsPath = './build/static/js';
const cssPath = './build/static/css';

const c = new Client();
c.on('ready', function () {
    console.clear();
    log(chalk.cyan('Соединение с сервером установлено'));

    /**
     * Удаление старой папки static
     */
    const removeOldBuild = () => {
        log(chalk.cyan('Удаление прошлого билда'));
        // Удаление папки ./default со всем содержимым
        c.rmdir('/comander/static', true, (err, res) => {
            if (err) {
                log(chalk.red('Прошлый билд не удален: ' + err.message))
            } else {
                log(chalk.green('Удаление прошлого билда завершено'));
            }
            removeOldTemplate();
        });
    };

    /**
     * Удаление старого template.php
     */
    const removeOldTemplate = () => {
        log(chalk.cyan('Удаление прошлого шаблона template.php'));
        c.delete('/comander/index.php', (err, res) => {
            if (err) {
                log(chalk.red('Прошлый index.php не удален: ' + err.message))
            } else {
                log(chalk.green('Удаление прошлого index.php завершено'));
            }
            uploadNewTemplate()
        });
    };

    /**
     * Загрузка нового шаблона
     */
    const uploadNewTemplate = () => {
        log(chalk.cyan('Загрузка нового билда'));
        log(chalk.cyan('Загрузка нового шаблона index.php'));
        c.put('./build/index.php', 'comander/index.php', (err, result) => {
            if (err) {
                log(chalk.red('Новый index.php не загружен: ' + err.message))
            } else {
                log(chalk.green('Загрузка нового index.php завершена'));
                createNewDirectories();
            }
        });
    };

    /**
     * Создание директорий для размещения файлов
     */
    const createNewDirectories = () => {
        log(chalk.cyan('Создание директорий js, css, media в папке static'));
        c.mkdir('/comander/static/css', true, (err) => {
            if (err) {
                log(chalk.red('Папка static/css не создана: ' + err.message))
            } else {
                log(chalk.green('Папка static/css создана'));

                c.mkdir('/comander/static/js', true, (err) => {
                    if (err) {
                        log(chalk.red('Папка static/js не создана: ' + err.message))
                    } else {
                        log(chalk.green('Папка static/js создана'));
                        c.mkdir('/comander/static/media', true, (err) => {
                            if (err) {
                                log(chalk.red('Папка static/media не создана: ' + err.message))
                            } else {
                                log(chalk.green('Папка static/media создана'));
                                uploadNewBuildFiles();
                                c.end();
                            }
                        })
                    }
                })
            }
        })
    };

    /**
     * Загрузка всех файлов билда
     */
    const uploadNewBuildFiles = () => {
        let jsFiles = [];
        let cssFiles = [];
        try {
            jsFiles = fs.readdirSync(jsPath);
            cssFiles = fs.readdirSync(cssPath);
        } catch (e) {
            throw new Error('Не найдена папка или неверный путь')
        }
        jsFiles.forEach(fileName => {
            c.put(jsPath + '/' + fileName, '/comander/static/js/' + fileName, (err) => {
                if (err) {
                    log(chalk.red(`Ошибка при загрузке файла ${fileName}:` + err.message))
                } else {
                    log(chalk.green(`Файл ${fileName} загружен`));
                }
            })
        });
        cssFiles.forEach(fileName => {
            c.put(cssPath + '/' + fileName, '/comander/static/css/' + fileName, (err) => {
                if (err) {
                    log(chalk.red(`Ошибка при загрузке файла ${fileName}:` + err.message))
                } else {
                    log(chalk.green(`Файл ${fileName} загружен`));
                }
            })
        });
        // mediaFiles.forEach(fileName => {
        //     c.put(mediaPath + '/' + fileName, '/comander/static/media/' + fileName, (err) => {
        //         if (err) {
        //             log(chalk.red(`Ошибка при загрузке файла ${fileName}:` + err.message))
        //         } else {
        //             log(chalk.green(`Файл ${fileName} загружен`));
        //         }
        //     })
        // });
    };

    /**
     * Точка запуска
     * Проверяется, есть ли папка ContainerSale-ProductPropEditor
     * Если есть, папка будет очищена от static и index.php
     * Если нет, выбросит ошибку
     */
    c.list('/', function (err, list) {
        if (err) throw err;
        const isDirAvailable = list.find(item => item.name === 'comander');
        if (isDirAvailable) {
            log(chalk.green('Корневая папка найдена'));
            removeOldBuild()
        } else {
            log(chalk.red('comander не найдена, нужно создать папку ContainerSale-ProductPropEditor'));
            c.end();
        }
    });
});

c.connect({
    host: deploy,
    user: login,
    password: pass
});
