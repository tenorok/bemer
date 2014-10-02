definer.export('bemer', /** @exports bemer */ function(
    Tag, Tree, Template, Pool, Selector, Node, Helpers, functions, object, is, modules
) {

    /**
     * Экземпляр для хранения списка шаблонов.
     *
     * @private
     * @type {Pool}
     */
    var pool = new Pool(),

        /**
         * Функции-помощники.
         *
         * @private
         * @type {object}
         */
        helpers = {};

    /**
     * Модуль обвязки для удобной работы с шаблонизатором.
     * Экспортируется в глобальный контекст.
     *
     * Шаблонизировать BEMJSON на основе имеющихся шаблонов.
     *
     * @class
     * @param {object} bemjson BEMJSON
     * @returns {string}
     */
    function bemer(bemjson) {
        return new Tree(bemjson, pool).toString();
    }

    /**
     * Добавить шаблон.
     *
     * @param {...string} pattern Шаблоны для матчинга
     * @param {object} modes Моды для преобразования узла
     * @returns {bemer}
     */
    bemer.match = function(pattern, modes) {
        pool.add(functions.apply(Template, arguments).helper(helpers));
        return this;
    };

    /**
     * Удалить все шаблоны и
     * сбросить порядковый номер для формирования идентификаторов.
     *
     * @returns {bemer}
     */
    bemer.clean = function() {
        pool.clean();
        Helpers.resetId();
        return this;
    };

    /**
     * Добавить пользовательскую функцию-помощник.
     *
     * @param {string} name Имя функции
     * @param {function} callback Тело функции
     * @returns {bemer}
     */
    bemer.helper = function(name, callback) {
        helpers[name] = callback;
        return this;
    };

    /**
     * Стандартные настройки шаблонизации.
     *
     * @private
     * @type {object}
     */
    var defaultConfig = {
        delimiters: {
            mod: Selector.delimiters.mod,
            elem: Selector.delimiters.elem
        },
        xhtml: {
            repeatBooleanAttr: Tag.repeatBooleanAttr,
            closeSingleTag: Tag.closeSingleTag
        },
        escape: {
            content: Tag.escapeContent,
            attr: Tag.escapeAttr
        },
        tag: Tag.defaultName,
        bemClass: Node.bemClass,
        bemAttr: Node.bemAttr,
        idPrefix: Helpers.idPrefix
    };

    /**
     * Установить/сбросить настройки шаблонизации.
     * При вызове без параметра настройки сбрасываются до стандартных.
     *
     * @param {object} [config] Настройки
     *
     * @param {object} [config.delimiters] Разделители имён
     * @param {string} [config.delimiters.mod=_] Разделитель блока и модификатора,
     * элемента и модификатора, модификатора и значения
     * @param {string} [config.delimiters.elem=__] Разделитель блока и элемента
     *
     * @param {boolean|object} [config.xhtml=false] Флаг формирования тегов в формате XHTML
     * @param {boolean} [config.xhtml.repeatBooleanAttr=false] Флаг автоповтора булева атрибута
     * @param {boolean} [config.xhtml.closeSingleTag=false] Флаг закрытия одиночного тега
     *
     * @param {boolean|object} [config.escape=true] Флаг экранирования спецсимволов
     * @param {boolean} [config.escape.content=true] Флаг экранирования содержимого
     * @param {boolean} [config.escape.attr=true] Флаг экранирования значений атрибутов
     *
     * @param {string} [config.tag=div] Стандартное имя тега
     * @param {string} [config.bemClass=i-bem] Имя класса для js-инициализации
     * @param {string} [config.bemAttr=data-bem] Имя атрибута для хранения параметров инициализации
     * @param {string} [config.idPrefix=i] Префикс для формируемых идентификаторов
     *
     * @returns {bemer}
     */
    bemer.config = function(config) {

        config = config || defaultConfig;

        if(config.delimiters) {
            object.extend(Selector.delimiters, config.delimiters);
        }

        if(config.xhtml !== undefined) {
            if(is.boolean(config.xhtml)) {
                Tag.repeatBooleanAttr = config.xhtml;
                Tag.closeSingleTag = config.xhtml;
            } else {
                if(is.boolean(config.xhtml.repeatBooleanAttr)) {
                    Tag.repeatBooleanAttr = config.xhtml.repeatBooleanAttr;
                }
                if(is.boolean(config.xhtml.closeSingleTag)) {
                    Tag.closeSingleTag = config.xhtml.closeSingleTag;
                }
            }
        }

        var escape = Node.resolveOptionEscape(config.escape);
        Tag.escapeContent = escape.content;
        Tag.escapeAttr = escape.attr;

        if(config.tag) {
            Tag.defaultName = config.tag;
        }

        if(config.bemClass) {
            Node.bemClass = config.bemClass;
        }

        if(config.bemAttr) {
            Node.bemAttr = config.bemAttr;
        }

        if(config.idPrefix) {
            Helpers.idPrefix = config.idPrefix;
        }

        return this;
    };

    /**
     * Получить заданный внутренний модуль или все модули.
     *
     * @param {string} [name] Имя модуля
     * @returns {object|*}
     */
    bemer.modules = function(name) {
        return modules.get(name);
    };

    return bemer;

});
