class Field {

  constructor({cellWidth, cellHeight, gridWidth, gridHeight}) {
    this.props = {
      cellWidth: cellWidth,
      cellHeight: cellHeight,
      gridWidth: gridWidth,
      gridHeight: gridHeight
    };

    this.cellData = [];
    for(let i = 0; i < this.props.gridWidth * this.props.gridHeight; i++) {
      this.cellData.push({});
    }
  }

  // func(ctx, obj, x_idx, y_idx)
  forEach(func) {

    this.cellData.forEach((obj, idx, arr) => {
      context.translate(
        this.props.cellWidth * (idx % this.props.gridWidth) + this.props.cellWidth/2,
        this.props.cellHeight * Math.floor(idx / this.props.gridHeight) + this.props.cellHeight/2
      );
      func(context, obj, idx % this.props.gridWidth, Math.floor(idx / this.props.gridHeight));
      context.setTransform(1, 0, 0, 1, 0, 0);
    });

  }

  // func(focalCell, frameCell, accumulator)
  applyFrame(frame, func, result, initial) {
    if (frame.gridWidth !== frame.gridHeight || frame.gridWidth % 2 === 1) {
      console.log('not a compatible square');
      throw {
        message: "Not a compatible square."
      };
    }

    let distance = Math.floor(frame.props.gridWidth/2);

    for (let x = 0; x < this.props.gridWidth; x++) {
      for (let y = 0; y < this.props.gridHeight; y++) {

        let accumulator = initial;
        for (let gx = 0; gx < frame.props.gridWidth; gx++) {
          for (let gy = 0; gy < frame.props.gridHeight; gy++) {
            /*if (
              x + gx - distance >= 0 &&
              y + gy - distance >= 0 &&
              x + gx - distance < this.props.gridWidth &&
              y + gy - distance < this.props.gridHeight
            ) {
              accumulator = func(
                this.cellData[(y+gy-distance)*this.props.gridWidth + (x+gx-distance)],
                frame.cellData[gy*frame.props.gridWidth + gx],
                accumulator
              );
            }*/

            accumulator = func(
              this._getCell(x+gx-distance, y+gy-distance),
              frame._getCell(gx, gy),
              accumulator
            );
          }
        }
        this.cellData[y*this.props.gridWidth + x][result] = accumulator;

      }
    }
  }

  _getCell(x, y) {
    let _x = x % this.props.gridWidth;
    let _y = y % this.props.gridHeight;
    if (_x < 0) {
      _x = this.props.gridWidth + _x;
    }
    if (_y < 0) {
      _y = this.props.gridHeight + _y;
    }
    return this.cellData[_y * this.props.gridHeight + _x];
  }

  // func(ctx, cell, agg)
  forWindow(func) {

    for (let i = 0; i < this.props.gridWidth; i++) {
      for (let j = 0; j < this.props.gridHeight; j++) {
        let agg = [];

        agg.push(this._getCell(i - 1, j - 1));
        agg.push(this._getCell(i, j - 1));
        agg.push(this._getCell(i + 1, j - 1));
        agg.push(this._getCell(i - 1, j));
        agg.push(this._getCell(i, j));
        agg.push(this._getCell(i + 1, j));
        agg.push(this._getCell(i - 1, j + 1));
        agg.push(this._getCell(i, j + 1));
        agg.push(this._getCell(i + 1, j + 1));

        context.translate(
          this.props.cellWidth * i + this.props.cellWidth/2,
          this.props.cellHeight * j + this.props.cellHeight/2
        );
        func(context, this._getCell(i, j), agg);
        context.setTransform(1, 0, 0, 1, 0, 0);
      }

    }

  }

}
