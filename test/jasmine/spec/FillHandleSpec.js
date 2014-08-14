describe('FillHandle', function () {
  var id = 'testContainer';

  beforeEach(function () {
    this.$container = $('<div id="' + id + '"></div>').appendTo('body');
  });

  afterEach(function () {
    if (this.$container) {
      destroy();
      this.$container.remove();
    }
  });

  it('should appear when fillHandle equals true', function () {
    handsontable({
      fillHandle: true
    });

    selectCell(2, 2);

    expect(isFillHandleVisible()).toBe(true);
  });

  it('should not appear when fillHandle equals false', function () {
    handsontable({
      fillHandle: false
    });
    selectCell(2, 2);

    expect(isFillHandleVisible()).toBe(false);
  });

  it('should disappear when beginediting is triggered', function () {
    handsontable({
      fillHandle: true
    });
    selectCell(2, 2);

    keyDown('enter');

    expect(isFillHandleVisible()).toBe(false);
  });

  it('should appear when finishediting is triggered', function () {
    handsontable({
      fillHandle: true
    });
    selectCell(2, 2);

    keyDown('enter');
    keyDown('enter');

    expect(isFillHandleVisible()).toBe(true);
  });

  it('should not appear when fillHandle equals false and finishediting is triggered', function () {
    handsontable({
      fillHandle: false
    });
    selectCell(2, 2);

    keyDown('enter');
    keyDown('enter');

    expect(isFillHandleVisible()).toBe(false);
  });

  it('should add custom value after autofill', function () {
    var ev;

    handsontable({
      data: [
        [1, 2, 3, 4, 5, 6],
        [1, 2, 3, 4, 5, 6],
        [1, 2, 3, 4, 5, 6],
        [1, 2, 3, 4, 5, 6]
      ],
      beforeAutofill: function (start, end, data) {
        data[0][0] = "test";
      }
    });
    selectCell(0, 0);

    ev = jQuery.Event('mousedown');
    ev.target = this.$container.find('.wtBorder.corner')[0]; //fill handle

    this.$container.find('tr:eq(0) td:eq(0)').trigger(ev);

    this.$container.find('tr:eq(1) td:eq(0)').trigger('mouseenter');
    this.$container.find('tr:eq(2) td:eq(0)').trigger('mouseenter');

    ev = jQuery.Event('mouseup');
    ev.target = this.$container.find('.wtBorder.corner')[0]; //fill handle

    this.$container.find('tr:eq(2) td:eq(0)').trigger(ev);

    expect(getSelected()).toEqual([0, 0, 2, 0]);
    expect(getDataAtCell(1, 0)).toEqual("test");
  });

  it('should use correct cell coordinates also when Handsontable is used inside a TABLE (#355)', function () {
    var $table = $('<table><tr><td></td></tr></table>').appendTo('body');
    this.$container.appendTo($table.find('td'));

    var ev;

    handsontable({
      data: [
        [1, 2, 3, 4, 5, 6],
        [1, 2, 3, 4, 5, 6],
        [1, 2, 3, 4, 5, 6],
        [1, 2, 3, 4, 5, 6]
      ],
      beforeAutofill: function (start, end, data) {
        data[0][0] = "test";
      }
    });
    selectCell(1, 1);

    ev = jQuery.Event('mousedown');
    ev.target = this.$container.find('.wtBorder.corner')[0]; //fill handle

    this.$container.find('tr:eq(0) td:eq(0)').trigger(ev);

    this.$container.find('tr:eq(1) td:eq(0)').trigger('mouseenter');
    this.$container.find('tr:eq(2) td:eq(0)').trigger('mouseenter');

    ev = jQuery.Event('mouseup');
    ev.target = this.$container.find('.wtBorder.corner')[0]; //fill handle

    this.$container.find('tr:eq(2) td:eq(0)').trigger(ev);


    expect(getSelected()).toEqual([1, 1, 2, 1]);
    expect(getDataAtCell(2, 1)).toEqual("test");

    document.body.removeChild($table[0]);
  });

  it("should fill cells below until the end of content in the neighbouring column with current cell's data", function() {
    var hot = handsontable({
      data: [
        [1, 2, 3, 4, 5, 6],
        [1, 2, 3, 4, 5, 6],
        [1, 2, null, null, null, null],
        [1, 2, null, null, null, null]
      ]
    });

    selectCell(1,3);
    var fillHandle = this.$container.find('.wtBorder.current.corner')[0];
    mouseDoubleClick(fillHandle);

    expect(getDataAtCell(2,3)).toEqual(null);
    expect(getDataAtCell(3,3)).toEqual(null);

    selectCell(1,2);
    mouseDoubleClick(fillHandle);

    expect(getDataAtCell(2,2)).toEqual(3);
    expect(getDataAtCell(3,2)).toEqual(3);

  });

  it("should fill cells below until the end of content in the neighbouring column with the currently selected area's data", function() {
    var hot = handsontable({
      data: [
        [1, 2, 3, 4, 5, 6],
        [1, 2, 3, 4, 5, 6],
        [1, 2, null, null, null, null],
        [1, 2, null, null, null, null]
      ]
    });

    selectCell(1,3,1,4);
    var fillHandle = this.$container.find('.wtBorder.area.corner')[0];
    mouseDoubleClick(fillHandle);

    expect(getDataAtCell(2,3)).toEqual(null);
    expect(getDataAtCell(3,3)).toEqual(null);
    expect(getDataAtCell(2,4)).toEqual(null);
    expect(getDataAtCell(3,4)).toEqual(null);

    selectCell(1,2,1,3);
    mouseDoubleClick(fillHandle);

    expect(getDataAtCell(2,2)).toEqual(3);
    expect(getDataAtCell(3,2)).toEqual(3);
    expect(getDataAtCell(2,3)).toEqual(4);
    expect(getDataAtCell(3,3)).toEqual(4);

  });

});
