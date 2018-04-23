var Point = (x, y) => {
  return {
    x: x,
    y: y,
    s: undefined
  };
};

var Segment = (p1, p2) => {
  return {
    p1: p1,
    p2: p2
  };
};

class Map {

  constructor() {
    this._points = [];
    this._segments = [];
    this._state = {
      isDrawing: undefined
    };
  }

  _less(a, b) {
    return (a < b ? a : b);
  }

  _greater(a, b) {
    return (a > b ? a : b);
  }

  _other(x, a, b) {
    if (x === a && x !== b) {
      return b;
    }
    if (x === b && x !== a) {
      return a;
    }
    return undefined;
  }

  _angle(p1, p2) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
  }

  _segmentNorm(segment, point) {
    if (segment.p1.x === segment.p2.x) {
      if (point.x < segment.p1.x) return Point(-1,0);
      return Point(1,0);
    }
    if (segment.p1.y === segment.p2.y) {
      if (point.y < segment.p1.y) return Point(0,-1);
      return Point(0,1);
    }
    var slope = (segment.p2.y - segment.p1.y) / (segment.p2.x - segment.p1.x);
    var b = segment.p1.y - slope*segment.p1.x;
    var newSlope = -1 / slope;
    var x = slope / Math.abs(slope);
    if (point.y > slope*point.x + b) x = -x;
    var y = newSlope*x;
    var norm = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    return Point(x/norm, y/norm);
  }

  _intersects(s1, s2) {
    var p = this._intersection(s1, s2);
    if (!p) return;

    if (p.x < this._less(s2.p1.x, s2.p2.x) || p.x > this._greater(s2.p1.x, s2.p2.x)) {
      return;
    } else if (p.x === s2.p1.x) {
      if (p.y < this._less(s2.p1.y, s2.p2.y) || p.y > this._greater(s2.p1.y, s2.p2.y)) return;
    }

    if (p.x < this._less(s1.p1.x, s1.p2.x) || p.x > this._greater(s1.p1.x, s1.p2.x)) {
      return;
    } else if (p.x === s1.p1.x) {
      if (p.y < this._less(s1.p1.y, s1.p2.y) || p.y > this._greater(s1.p1.y, s1.p2.y)) return;
    }

    return p;
  }

  _intersection(ray, seg) {
    // find the slope and intercept of ray
    var rayM = undefined;
    var rayB = undefined;
    if (ray.p1.x !== ray.p2.x) {
      rayM = (ray.p2.y - ray.p1.y) / (ray.p2.x - ray.p1.x);
      rayB = ray.p1.y - rayM*ray.p1.x;
    }

    // find slope and intercept of segment
    var segM = undefined;
    var segB = undefined;
    if (seg.p1.x !== seg.p2.x) {
      segM = (seg.p2.y - seg.p1.y) / (seg.p2.x - seg.p1.x);
      segB = seg.p1.y - segM*seg.p1.x;
    }

    // don't bother returning an intersection if slopes are the same
    if (rayM === segM) return;

    // the point at which the two instersect
    var p = {
      x: undefined,
      y: undefined
    };
    if (rayM === undefined) {
      p.x = ray.p1.x;
      p.y = segM*p.x + segB;
    } else if (segM === undefined) {
      p.x = seg.p1.x;
      p.y = rayM*p.x + rayB;
    } else {
      p.x = (rayB - segB)/(segM - rayM);
      p.y = rayM*p.x + rayB;
    }

    return p;
  }

  _rayIntersects(ray, seg) {
    var p = this._intersection(ray, seg);
    if (!p) return;

    // check if point is on segment
    if (p.x < this._less(seg.p1.x, seg.p2.x) || p.x > this._greater(seg.p1.x, seg.p2.x)) return;
    else if (p.x === seg.p1.x) {
      if (p.y < this._less(seg.p1.y, seg.p2.y) || p.y > this._greater(seg.p1.y, seg.p2.y)) return;
    }
    // and if point is in direction of ray
    if ((ray.p1.x - p.x) * (ray.p1.x - ray.p2.x) < 0) {
      return;
    } else if ((ray.p1.x - p.x) * (ray.p1.x - ray.p2.x) === 0) {
      if ((ray.p1.y - p.y) * (ray.p1.y - ray.p2.y) < 0) return;
    }

    return p;
  }

  addSegment(x1, y1, x2, y2) {
    var p1 = Point(x1, y1);
    var p2 = Point(x2, y2);
    this._points.push(p1);
    this._points.push(p2);
    var s = Segment(p1, p2);
    p1.s = s;
    p2.s = s;
    this._segments.push(s);
  }

  addRectangle(x, y, dx, dy) {
    this.addSegment(x, y, x+dx, y); // top
    this.addSegment(x+dx, y, x+dx, y+dy); // right
    this.addSegment(x+dx, y+dy, x, y+dy); // bottom
    this.addSegment(x, y+dy, x, y); // left
  }

  addPoint(x, y) {
    var p = Point(x, y);
    if (this._state.isDrawing) {
      this.addSegment(
        this._state.isDrawing.x,
        this._state.isDrawing.y,
        p.x,
        p.y
      );
      this._state.isDrawing = undefined;
    } else {
      this._state.isDrawing = p;
    }
  }

}
