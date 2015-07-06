module.exports = function() {
  'use strict';

  DependencyInjection.service('$ShortcutsService', ['$i18nService', function($i18nService) {

    return new (function $ShortcutsService() {

      var _this = this,
          _shortcuts = {},
          _defaultGroup = $i18nService._('In the platform');

      this.shortcuts = function() {
        return _shortcuts;
      };

      this.defaultGroup = function() {
        return _defaultGroup;
      };

      this.descriptions = function() {
        var groups = {};

        $.each(_shortcuts, function(name, shortcut) {
          if (!shortcut) {
            return;
          }

          var group = shortcut.group || _defaultGroup;
          groups[group] = groups[group] || [];

          groups[group].push({
            keysDescription: shortcut.keysDescription,
            actionDescription: shortcut.actionDescription
          });
        });

        return groups;
      };

      this.register = function(group, name, keysDescription, actionDescription, filterFunc, actionFunc, activate) {
        activate = typeof activate == 'undefined' ? true : activate;

        _shortcuts[name] = {
          group: group,
          keysDescription: keysDescription,
          actionDescription: actionDescription,
          filterFunc: filterFunc,
          actionFunc: actionFunc,
          activated: false
        };

        if (activate) {
          _this.activate(name);
        }
      };

      this.unregister = function(name) {
        _this.deactivate(name);

        if (_shortcuts[name]) {
          delete _shortcuts[name];
        }

        return true;
      };

      this.unregisterGroup = function(group) {
        $.each(_shortcuts, function(name, shortcut) {
          if (!shortcut) {
            return;
          }

          if (shortcut.group == group) {
            _this.unregister(name);
          }
        });

        return true;
      };

      function _keyup(e, name) {
        if (!_shortcuts[name]) {
          return;
        }

        var $el = $(e.originalEvent.srcElement);

        if ($el.is('input') || $el.is('textarea')) {
          return;
        }

        if (_shortcuts[name].filterFunc(e, name)) {
          _shortcuts[name].actionFunc(name);
        }
      }

      this.activate = function(name) {
        if (!_shortcuts[name] || _shortcuts[name].activated) {
          return;
        }

        _shortcuts[name].activated = true;

        $(document).bind('keyup.' + name, function(e) {
          _keyup(e, name);
        });
      };

      this.deactivate = function(name) {
        if (!_shortcuts[name] || !_shortcuts[name].activated) {
          return;
        }

        _shortcuts[name].activated = false;

        $(document).unbind('.' + name);
      };

    })();

  }]);

};
