// videojs-speed-plugin

videojs.plugin('speed', function(options) {
  var player = this,
      items = [],
      selectedItem;

  function changeSpeed(item) {
    var opt = item.options();
    item.selected(true);
    player.playbackRate(opt.rate);

    var nodes = player.controlBar.speedButton.el().firstChild.children;
    for (var i = 0, l = nodes.length; i < l; i++) {
      if (nodes[i].className == 'vjs-current-speed') {
        nodes[i].innerHTML = opt.label;
      }
    }
  }

  videojs.SpeedMenuItem = videojs.MenuItem.extend({
    init: function(player, options) {
      videojs.MenuItem.call(this, player, options);
      this.on('click', this.onClick);
    }
  });
  videojs.SpeedMenuItem.prototype.onClick = function(e) {
    for (var i = 0, l = items.length; i < l; i++) {
      items[i].selected(false);
    }
    changeSpeed(this);
  };

  videojs.SpeedButton = videojs.MenuButton.extend({
    init: function(player, options){
      videojs.MenuButton.call(this, player, options);
    }
  });

  videojs.SpeedButton.prototype.createItems = function() {
    options.forEach(function(opt) {
      var item = new videojs.SpeedMenuItem(player, { label: opt.text, rate: opt.rate });
      if (opt.selected) {
        selectedItem = item;
      }
      items.push(item);
    });
    return items;
  };

  player.ready(function() {
    if (!player.controlBar.speedButton) {
      var button = new videojs.SpeedButton(player, {
        el: videojs.Component.prototype.createEl(null, {
          className: 'vjs-res-button vjs-menu-button vjs-control vjs-speed-button',
          innerHTML: '<div class="vjs-control-content"><span class="vjs-current-speed"></span></div>',
          role: 'button'
        })
      });
      player.controlBar.speedButton = player.controlBar.addChild(button);
      changeSpeed(selectedItem);
    }
  });
});
