definer.export('bemer', /** @exports bemer */ function(
    Tree, Template, Pool, functions, Name, Node, object, Helpers, modules
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
            mod: Name.delimiters.mod,
            elem: Name.delimiters.elem
        },
        tag: Template.tag,
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
            object.extend(Name.delimiters, config.delimiters);
        }

        if(config.tag) {
            Template.tag = config.tag;
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
