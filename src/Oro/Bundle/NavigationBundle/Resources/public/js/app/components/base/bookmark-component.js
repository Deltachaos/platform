/*jslint nomen:true*/
/*global define*/
define([
    'jquery',
    'underscore',
    'oroui/js/mediator',
    'oroui/js/app/components/base/component',
    'oroui/js/error'
], function ($, _, mediator, BaseComponent, error) {
    'use strict';

    var BaseBookmarkComponent;

    BaseBookmarkComponent = BaseComponent.extend({
        /**
         * Keeps separately extended options,
         * to prevent disposing the view each time by Composer
         */
        _options: {},

        listen: {
            'toAdd collection': 'toAdd',
            'toRemove collection': 'toRemove',

            'pagestate:change mediator': 'onPageStateChange',
            'page:beforeChange mediator': 'onPageChange'
        },

        initialize: function (options) {
            var data, extraOptions, $dataEl;

            $dataEl = $(options.dataSource);
            data = $dataEl.data('data');
            extraOptions = $dataEl.data('options');
            $dataEl.remove();

            // create own property _options (not spoil prototype)
            this._options = _.defaults({}, options || {}, extraOptions);

            BaseBookmarkComponent.__super__.initialize.call(this, options);

            this.collection.reset(data);
            this._createSubViews();
        },

        _createSubViews: function () {
            // should be implemented in descendants
        },

        toRemove: function (model) {
            model.destroy({
                wait: true,
                error: function (model, xhr) {
                    if (xhr.status === 404 && !mediator.execute('retrieveOption', 'debug')) {
                        // Suppress error if it's 404 response and not debug mode
                        model.unset('id').destroy();
                    } else {
                        error.handle({}, xhr, {enforce: true});
                    }
                }
            });
        },

        toAdd: function (model) {
            var collection;
            collection = this.collection;
            this.actualizeAttributes(model);
            model.save(null, {
                success: function () {
                    var item;
                    item = collection.find(function (item) {
                        return item.get('url') === model.get('url');
                    });
                    if (item) {
                        model.destroy();
                    } else {
                        collection.unshift(model);
                    }
                }
            });
        },

        actualizeAttributes: function (model) {
            // should be implemented in descendants
        },

        onPageStateChange: function () {
            var model, url;
            model = this.collection.getCurrentModel();
            if (model) {
                url = mediator.execute('currentUrl');
                model.set('url', url);
                model.save();
            }
        },

        /**
         * Handles page change
         *  - if there's related model in collection, updates route query
         * @param oldRoute
         * @param newRoute
         * @param options
         */
        onPageChange: function (oldRoute, newRoute, options) {
            var model, _ref;
            if (!newRoute || newRoute.query !== '') {
                return;
            }
            model = this.collection.find(function (model) {
                return mediator.execute('compareUrl', model.get('url'), newRoute.path);
            });
            if (model) {
                _ref = model.get('url').split('?');
                newRoute.query = _ref[1] || '';
            }
        }
    });

    return BaseBookmarkComponent;
});
