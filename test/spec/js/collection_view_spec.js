var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['jquery', 'chaplin/models/model', 'chaplin/models/collection', 'chaplin/views/view', 'chaplin/views/collection_view'], function(jQuery, Model, Collection, View, CollectionView) {
  'use strict';  return describe('CollectionView', function() {
    var ItemView, MixedCollectionView, TemplatedCollectionView, TestCollectionView, addOne, addThree, collection, collectionView, fillCollection, getAllChildren, getViewChildren, viewsMatchCollection;
    collection = collectionView = null;
    ItemView = (function(_super) {

      __extends(ItemView, _super);

      function ItemView() {
        ItemView.__super__.constructor.apply(this, arguments);
      }

      ItemView.prototype.tagName = 'li';

      ItemView.prototype.initialize = function() {
        ItemView.__super__.initialize.apply(this, arguments);
        return this.$el.attr({
          id: this.model.id,
          cid: this.model.cid
        });
      };

      ItemView.prototype.templateFunction = function(templateData) {
        return templateData.title;
      };

      ItemView.prototype.getTemplateFunction = function() {
        return this.templateFunction;
      };

      return ItemView;

    })(View);
    TestCollectionView = (function(_super) {

      __extends(TestCollectionView, _super);

      function TestCollectionView() {
        TestCollectionView.__super__.constructor.apply(this, arguments);
      }

      TestCollectionView.prototype.tagName = 'ul';

      TestCollectionView.prototype.animationDuration = 0;

      TestCollectionView.prototype.getView = function(model) {
        return new ItemView({
          model: model
        });
      };

      return TestCollectionView;

    })(CollectionView);
    TemplatedCollectionView = (function(_super) {

      __extends(TemplatedCollectionView, _super);

      function TemplatedCollectionView() {
        TemplatedCollectionView.__super__.constructor.apply(this, arguments);
      }

      TemplatedCollectionView.prototype.listSelector = '> ol';

      TemplatedCollectionView.prototype.fallbackSelector = '> .fallback';

      TemplatedCollectionView.prototype.loadingSelector = '> .loading';

      TemplatedCollectionView.prototype.templateFunction = function(templateData) {
        return "<ol></ol>\n<p class=\"loading\">Loading…</p>\n<p class=\"fallback\">This list is empty.</p>";
      };

      TemplatedCollectionView.prototype.getTemplateFunction = function() {
        return this.templateFunction;
      };

      return TemplatedCollectionView;

    })(TestCollectionView);
    MixedCollectionView = (function(_super) {

      __extends(MixedCollectionView, _super);

      function MixedCollectionView() {
        MixedCollectionView.__super__.constructor.apply(this, arguments);
      }

      MixedCollectionView.prototype.itemSelector = 'li';

      MixedCollectionView.prototype.templateFunction = function(templateData) {
        return "<p>foo</p>\n<div>bar</div>\n<article>qux</article>\n<ul>\n  <li>nested</li>\n</ul>";
      };

      MixedCollectionView.prototype.getTemplateFunction = function() {
        return this.templateFunction;
      };

      return MixedCollectionView;

    })(TestCollectionView);
    fillCollection = function() {
      var code, models;
      models = (function() {
        var _results;
        _results = [];
        for (code = 65; code <= 90; code++) {
          _results.push({
            id: String.fromCharCode(code),
            title: String(Math.random())
          });
        }
        return _results;
      })();
      return collection.reset(models);
    };
    addOne = function() {
      var model;
      model = new Model({
        id: 'one',
        title: 'one'
      });
      collection.add(model);
      return model;
    };
    addThree = function() {
      var model1, model2, model3;
      model1 = new Model({
        id: 'new1',
        title: 'new'
      });
      model2 = new Model({
        id: 'new2',
        title: 'new'
      });
      model3 = new Model({
        id: 'new3',
        title: 'new'
      });
      collection.add(model1, {
        at: 0
      });
      collection.add(model2, {
        at: 10
      });
      collection.add(model3);
      return [model1, model2, model3];
    };
    getViewChildren = function() {
      return collectionView.$list.children(collectionView.itemSelector);
    };
    getAllChildren = function() {
      return collectionView.$el.children();
    };
    viewsMatchCollection = function() {
      var children;
      children = getViewChildren();
      expect(children.length).toBe(collection.length);
      return collection.each(function(model, index) {
        var actual, expected;
        expected = model.id;
        actual = children.eq(index).attr('id');
        return expect(actual).toBe(expected);
      });
    };
    collection = new Collection();
    beforeEach(function() {
      return fillCollection();
    });
    it('should initialize', function() {
      return collectionView = new TestCollectionView({
        collection: collection
      });
    });
    it('should render item views', function() {
      return viewsMatchCollection();
    });
    it('should have a visibleItems array', function() {
      var visibleItems;
      visibleItems = collectionView.visibleItems;
      expect(_(visibleItems).isArray()).toBe(true);
      expect(visibleItems.length).toBe(collection.length);
      return collection.each(function(model, index) {
        return expect(visibleItems[index]).toBe(model);
      });
    });
    it('should fire visibilityChange events', function() {
      var visibilityChange;
      collection.reset();
      visibilityChange = jasmine.createSpy();
      collectionView.on('visibilityChange', visibilityChange);
      addOne();
      expect(visibilityChange).toHaveBeenCalledWith(collectionView.visibleItems);
      return expect(collectionView.visibleItems.length).toBe(1);
    });
    it('should add views when collection items are added', function() {
      var children, first, last, model1, model2, model3, tenth, _ref;
      _ref = addThree(), model1 = _ref[0], model2 = _ref[1], model3 = _ref[2];
      children = getViewChildren();
      first = children.first();
      expect(first.attr('id')).toBe(model1.id);
      expect(first.text()).toBe(model1.get('title'));
      tenth = children.eq(10);
      expect(tenth.attr('id')).toBe(model2.id);
      expect(tenth.text()).toBe(model2.get('title'));
      last = children.last();
      expect(last.attr('id')).toBe(model3.id);
      return expect(last.text()).toBe(model3.get('title'));
    });
    it('should remove views when collection items are removed', function() {
      var models;
      models = addThree();
      collection.remove(models);
      return viewsMatchCollection();
    });
    it('should remove all views when collection is emptied', function() {
      var children;
      collection.reset();
      children = getViewChildren();
      return expect(children.length).toBe(0);
    });
    it('should reuse views on reset', function() {
      var model1, model2, newView1, view1, view2;
      model1 = collection.at(0);
      view1 = collectionView.viewsByCid[model1.cid];
      expect(view1 instanceof ItemView).toBe(true);
      model2 = collection.at(1);
      view2 = collectionView.viewsByCid[model2.cid];
      expect(view2 instanceof ItemView).toBe(true);
      collection.reset(model1);
      expect(view1.disposed).toBe(false);
      expect(view2.disposed).toBe(true);
      newView1 = collectionView.viewsByCid[model1.cid];
      return expect(newView1).toBe(view1);
    });
    it('should append views in the right order', function() {
      collection.comparator = function(model) {
        return model.id;
      };
      collection.reset({
        id: '2'
      });
      collection.addAtomic([
        {
          id: '0'
        }, {
          id: '1'
        }, {
          id: '3'
        }, {
          id: '4'
        }
      ]);
      viewsMatchCollection();
      return delete collection.comparator;
    });
    it('should filter views', function() {
      var children, filterer;
      addThree();
      filterer = function(model, position) {
        expect(model instanceof Model).toBe(true);
        expect(typeof position).toBe('number');
        return model.get('title') === 'new';
      };
      collectionView.filter(filterer);
      expect(collectionView.visibleItems.length).toBe(3);
      children = getViewChildren();
      expect(children.length).toBe(collection.length);
      collection.each(function(model, index) {
        var $el, displayValue, visible;
        $el = children.eq(index);
        visible = model.get('title') === 'new';
        displayValue = $el.css('display');
        if (visible) {
          return expect(displayValue).not.toBe('none');
        } else {
          return expect(displayValue).toBe('none');
        }
      });
      collectionView.filter(null);
      return expect(collectionView.visibleItems.length).toBe(collection.length);
    });
    it('should be disposable and dispose all item views', function() {
      var cid, model, view, viewsByCid;
      expect(typeof collectionView.dispose).toBe('function');
      model = collection.at(0);
      viewsByCid = collectionView.viewsByCid;
      expect(collectionView.disposed).toBe(false);
      for (cid in viewsByCid) {
        view = viewsByCid[cid];
        expect(view.disposed).toBe(false);
      }
      collectionView.dispose();
      expect(collectionView.disposed).toBe(true);
      for (cid in viewsByCid) {
        view = viewsByCid[cid];
        expect(view.disposed).toBe(true);
      }
      expect(collectionView.viewsByCid).toBe(null);
      return expect(collectionView.visibleItems).toBe(null);
    });
    it('should initialize with a template', function() {
      collection.initSyncMachine();
      collectionView.dispose();
      return collectionView = new TemplatedCollectionView({
        collection: collection
      });
    });
    it('should render the template', function() {
      var children;
      children = getAllChildren();
      return expect(children.length).toBe(3);
    });
    it('should append views to the listSelector', function() {
      var $list, $list2, children;
      $list = collectionView.$list;
      expect($list instanceof jQuery).toBe(true);
      expect($list.length).toBe(1);
      $list2 = collectionView.$(collectionView.listSelector);
      expect($list.get(0) === $list2.get(0)).toBe(true);
      children = getViewChildren();
      return expect(children.length).toBe(collection.length);
    });
    it('should set the fallback element properly', function() {
      var $fallback, $fallback2;
      $fallback = collectionView.$fallback;
      expect($fallback instanceof jQuery).toBe(true);
      expect($fallback.length).toBe(1);
      $fallback2 = collectionView.$(collectionView.fallbackSelector);
      return expect($fallback.get(0) === $fallback2.get(0)).toBe(true);
    });
    it('should show the fallback element properly', function() {
      var $fallback;
      $fallback = collectionView.$fallback;
      collection.unsync();
      expect($fallback.css('display')).toBe('none');
      collection.beginSync();
      expect($fallback.css('display')).toBe('none');
      collection.finishSync();
      expect($fallback.css('display')).toBe('none');
      collection.reset();
      collection.unsync();
      expect($fallback.css('display')).toBe('none');
      collection.beginSync();
      expect($fallback.css('display')).toBe('none');
      collection.finishSync();
      expect($fallback.css('display')).toBe('block');
      addOne();
      return expect($fallback.css('display')).toBe('none');
    });
    it('should set the loading indicator properly', function() {
      var $loading, $loading2;
      $loading = collectionView.$loading;
      expect($loading instanceof jQuery).toBe(true);
      expect($loading.length).toBe(1);
      $loading2 = collectionView.$(collectionView.loadingSelector);
      return expect($loading.get(0) === $loading.get(0)).toBe(true);
    });
    it('should show the loading indicator properly', function() {
      var $loading;
      $loading = collectionView.$loading;
      collection.unsync();
      expect($loading.css('display')).toBe('none');
      collection.beginSync();
      expect($loading.css('display')).toBe('none');
      collection.finishSync();
      expect($loading.css('display')).toBe('none');
      collection.reset();
      collection.unsync();
      expect($loading.css('display')).toBe('none');
      collection.beginSync();
      expect($loading.css('display')).toBe('block');
      collection.finishSync();
      expect($loading.css('display')).toBe('none');
      addOne();
      return expect($loading.css('display')).toBe('none');
    });
    it('should also dispose when templated', function() {
      collectionView.dispose();
      expect(collectionView.$list).toBe(null);
      expect(collectionView.$fallback).toBe(null);
      return expect(collectionView.$loading).toBe(null);
    });
    it('should respect the render options', function() {
      var children;
      collectionView = new TemplatedCollectionView({
        collection: collection,
        render: false,
        renderItems: false
      });
      children = getAllChildren();
      expect(children.length).toBe(0);
      expect(collectionView.$list).toBe(null);
      collectionView.render();
      children = getAllChildren();
      expect(children.length).toBe(3);
      expect(collectionView.$list instanceof jQuery).toBe(true);
      expect(collectionView.$list.length).toBe(1);
      collectionView.renderAllItems();
      return viewsMatchCollection();
    });
    it('should respect the filterer option', function() {
      var children, filterer;
      filterer = function(model) {
        return model.id === 'A';
      };
      collectionView.dispose();
      collectionView = new TemplatedCollectionView({
        collection: collection,
        filterer: filterer
      });
      expect(collectionView.filterer).toBe(filterer);
      expect(collectionView.visibleItems.length).toBe(1);
      children = getViewChildren();
      return expect(children.length).toBe(collection.length);
    });
    return it('should respect the itemSelector property', function() {
      var additionalLength, allChildren, viewChildren;
      collectionView.dispose();
      collectionView = new MixedCollectionView({
        collection: collection
      });
      additionalLength = 4;
      allChildren = getAllChildren();
      expect(allChildren.length).toBe(collection.length + additionalLength);
      viewChildren = getViewChildren();
      expect(viewChildren.length).toBe(collection.length);
      expect(allChildren.eq(0).get(0) === viewChildren.get(0)).toBe(false);
      expect(allChildren.eq(additionalLength).get(0) === viewChildren.get(0)).toBe(true);
      return collectionView.dispose();
    });
  });
});
