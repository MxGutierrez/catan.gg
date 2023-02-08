function getOffsets(e, t) {
  // DONE
  let r = 0.866 * e,
    s = e,
    a = [];
  board = ((e) => {
    switch (e) {
      case "normal":
        (board.tiles_per_row = [3, 4, 5, 4, 3]),
          (board.row_step = 0.73 * s),
          (board.center_row = Math.floor(board.tiles_per_row.length / 2)),
          (board.cell_step = 0.99 * r);
        break;
      case "expanded":
        (board.tiles_per_row = [1, 2, 3, 4, 3, 4, 3, 4, 3, 2, 1]),
          (board.center_row = Math.floor(board.tiles_per_row.length / 2)),
          (board.cell_step = 1.51 * s * 0.99),
          (board.row_step = r / 1.99);
    }
    return board;
  })(t);
  for (let e = 0; e < board.tiles_per_row.length; e++) {
    var o = e,
      d = board;
    (row_level = o - Number(d.center_row)),
      (y_coordinate = 50 + row_level * d.row_step),
      (x_is_even_shift = ((o % 2) * d.cell_step) / 2),
      (x_first_cell_shift = Math.floor(d.tiles_per_row[o] / 2) * d.cell_step);
    for (let e = 0; e < d.tiles_per_row[o]; e++)
      (x_coordinate =
        50 - x_first_cell_shift + x_is_even_shift + e * d.cell_step),
        a.push(`left:${x_coordinate}%;top:${y_coordinate}%`);
  }
  return a;
}
let getAdjList = (e) => {
    adjacencyList =
      "normal" == e
        ? {
            0: [1, 3, 4],
            1: [0, 2, 4, 5],
            2: [1, 5, 6],
            3: [0, 4, 7, 8],
            4: [0, 1, 3, 5, 8, 9],
            5: [1, 2, 4, 6, 9, 10],
            6: [2, 5, 10, 11],
            7: [3, 8, 12],
            8: [3, 4, 7, 9, 12, 13],
            9: [4, 5, 8, 10, 13, 14],
            10: [5, 6, 9, 11, 14, 15],
            11: [6, 10, 15],
            12: [7, 8, 13, 16],
            13: [8, 9, 12, 14, 16, 17],
            14: [9, 10, 13, 15, 17, 18],
            15: [10, 11, 14, 18],
            16: [12, 13, 17],
            17: [13, 14, 16, 18],
            18: [14, 15, 17],
          }
        : {
            0: [1, 2, 4],
            1: [3, 4, 7],
            2: [4, 5, 8],
            3: [6, 7, 10],
            4: [7, 8, 11],
            5: [8, 9, 12],
            6: [3, 10, 13],
            7: [1, 3, 4, 10, 11, 14],
            8: [2, 4, 5, 11, 12, 15],
            9: [5, 12, 16],
            10: [3, 6, 7, 13, 14, 17],
            11: [4, 7, 8, 14, 15, 18],
            12: [5, 8, 9, 15, 16, 19],
            13: [6, 10, 17, 20],
            14: [7, 10, 11, 17, 18, 21],
            15: [8, 11, 12, 18, 19, 22],
            16: [9, 12, 19, 23],
            17: [10, 13, 14, 20, 21, 24],
            18: [11, 14, 15, 21, 22, 25],
            19: [12, 15, 16, 22, 23, 26],
            20: [13, 17, 24],
            21: [14, 17, 18, 24, 25, 27],
            22: [15, 18, 19, 25, 26, 28],
            23: [16, 19, 26],
            24: [17, 20, 21, 27],
            25: [18, 21, 22, 27, 28, 29],
            26: [19, 22, 23, 28],
            27: [21, 24, 25, 29],
            28: [22, 25, 26, 29],
            29: [25, 27, 28],
          };
  },
  normalSize =
    ((state = {
      numArray: [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12],
      regNums: [, 3, 4, 5, 9, 10, 11],
      expandednumArray: [
        2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 8, 8, 8, 9, 9, 9, 10, 10, 10,
        11, 11, 11, 12, 12,
      ],
      resourceArray: [
        "ore",
        "ore",
        "ore",
        "brick",
        "brick",
        "brick",
        "sheep",
        "sheep",
        "sheep",
        "sheep",
        "wood",
        "wood",
        "wood",
        "wood",
        "wheat",
        "wheat",
        "wheat",
        "wheat",
      ],
      expandedresourceArray: [
        "ore",
        "ore",
        "ore",
        "ore",
        "ore",
        "brick",
        "brick",
        "brick",
        "brick",
        "brick",
        "sheep",
        "sheep",
        "sheep",
        "sheep",
        "sheep",
        "sheep",
        "wood",
        "wood",
        "wood",
        "wood",
        "wood",
        "wood",
        "wheat",
        "wheat",
        "wheat",
        "wheat",
        "wheat",
        "wheat",
      ],
      prob: [
        "",
        "",
        ".",
        "..",
        "...",
        "....",
        ".....",
        "",
        ".....",
        "....",
        "...",
        "..",
        ".",
      ],
    }),
    17.5),
  expandedSize = 16,
  resourceTypes = ["ore", "sheep", "brick", "wood", "wheat", "desert"],
  adjacencyList,
  size,
  modeElement = document.getElementById("selected-map"),
  mode,
  shuftype =
    ((mode = null == modeElement ? "normal" : modeElement.value),
    (size = "normal" == mode ? normalSize : expandedSize),
    "random"),
  adjacent_6_8 = !1,
  adjacent_2_12 = !0,
  adjacent_same_numbers = !0,
  adjacent_same_resource = !0,
  settingAdjusted = !1,
  setMenuValues = () => {
    (document.getElementById("adjacent_6_8_input").checked = adjacent_6_8),
      (document.getElementById("adjacent_2_12_input").checked = adjacent_2_12),
      (document.getElementById("adjacent_same_numbers_input").checked =
        adjacent_same_numbers),
      (document.getElementById("adjacent_same_resource_input").checked =
        adjacent_same_resource);
  },
  tileOffsetCSS = getOffsets(size, mode),
  shuffle = (t) => {
    for (let e = t.length - 1; 0 < e; e--) {
      var r = Math.floor(Math.random() * (e + 1));
      [t[e], t[r]] = [t[r], t[e]];
    }
    return t;
  },
  selectShuffle = () => {
    (shuftype = document.getElementById("pick-shuffle").value),
      console.log(shuftype),
      start();
  },
  selectMode = () => {
    (mode = document.getElementById("pick-mode").value),
      (size = "normal" == mode ? normalSize : expandedSize),
      flipSameResourceSetting(),
      (tileOffsetCSS = getOffsets(size, mode)),
      start();
  },
  toggleSetting = (e) => {
    switch (((settingAdjusted = !0), e)) {
      case "6_8":
        adjacent_6_8 = document.getElementById("adjacent_6_8_input").checked;
        break;
      case "2_12":
        adjacent_2_12 = document.getElementById("adjacent_2_12_input").checked;
        break;
      case "same_number":
        adjacent_same_numbers = document.getElementById(
          "adjacent_same_numbers_input"
        ).checked;
        break;
      case "same_resource":
        adjacent_same_resource = document.getElementById(
          "adjacent_same_resource_input"
        ).checked;
    }
  },
  passedAdjacencyTest = (e, t, r) => {
    for (var [s, a] of e.entries())
      if (a.chit == t || a.chit == r)
        for (adj of adjacencyList[s])
          if (e[adj].chit == t || e[adj].chit == r) return !1;
    return !0;
  },
  passedBalancedCheck = (e) => !0,
  passedResourceCheck = (t, r) => {
    for (var [s, a] of t.entries()) {
      var o = a.resource;
      let e = 1;
      for (adj of adjacencyList[s]) o == t[adj].resource && e++;
      if (e > r) return !1;
    }
    return !0;
  },
  generateTileContent = () => {
    // DONE
    let e, t;
    t =
      "normal" == mode
        ? ((e = shuffle(this.state.numArray)),
          shuffle(this.state.resourceArray))
        : ((e = shuffle(this.state.expandednumArray)),
          shuffle(this.state.expandedresourceArray));
    var r,
      s = this.state.prob,
      a = [];
    for (r in e) {
      var o = Object();
      (o.chit = e[r]),
        (o.resource = t[r]),
        (o.probability = s[o.chit]),
        a.push(o);
    }
    var d = Object();
    return (
      (d.resource = "desert"),
      (d.chit = ""),
      (d.probability = ""),
      a.push(d),
      "expanded" == mode && a.push(d),
      shuffle(a)
    );
  },
  buildTiles = () => {
    document.getElementById(
      "board"
    ).innerHTML = `<div class="${mode}BorderCommon border-${mode}"></div>`;
    for (var [e, t] of tileOffsetCSS.entries())
      document.getElementById(
        "board"
      ).innerHTML += `<div class="hex-${mode} hex-base" style="${t}" id="tile-${e}")>
                <div class="circle-${mode} circle-base font-size-wrap" id="circle-${e}">
                </div>
            </div>`;
  },
  shuffleIsValid = (e) => {
    let t = !0;
    if (
      ((t =
        adjacent_same_resource || "normal" != mode
          ? t && passedResourceCheck(e, 2)
          : t && passedResourceCheck(e, 1)),
      !adjacent_6_8 && !(t = t && passedAdjacencyTest(e, 6, 8)))
    )
      return !1;
    if (
      (adjacent_2_12 || (t = t && passedAdjacencyTest(e, 2, 12)),
      !adjacent_same_numbers)
    )
      for (var r of state.regNums)
        if (!(t = t && passedAdjacencyTest(e, r, r))) return !1;
    return t;
  },
  fillTiles = () => {
    let e;
    for (; (e = generateTileContent()), !shuffleIsValid(e); );
    for (var [t, r] of e.entries()) {
      var s,
        a = document.getElementById("tile-" + t),
        t = document.getElementById("circle-" + t);
      for (s of a.classList)
        if (resourceTypes.includes(s)) {
          a.classList.remove(s);
          break;
        }
      a.classList.add(r.resource),
        a.setAttribute("alt", r.resource),
        (t.innerHTML = `<div class="tile-chit-${mode} chit-number-base">${r.chit}</div>`),
        8 == r.chit || 6 == r.chit
          ? a.classList.add("high-prob")
          : a.classList.remove("high-prob"),
        "desert" == r.resource
          ? t.classList.add("desert-chit")
          : (t.classList.remove("desert-chit"),
            (t.innerHTML += `<div class="prob-dots-base small-font-size-wrap">${r.probability}<div/>`));
    }
  },
  generateBoard = () => {
    event.preventDefault(), fillTiles();
  },
  flipSameResourceSetting = () => {
    var e = document.getElementById("sameResourceSetting").classList;
    "normal" == mode
      ? e.remove("settingViewToggle")
      : e.add("settingViewToggle");
  },
  toggleOptions = () => {
    var e = document.getElementById("popmenu").classList,
      t = document.getElementById("btnOps");
    flipSameResourceSetting(),
      e.contains("menuToggle")
        ? (e.remove("menuToggle"),
          (t.innerHTML = "Close Options"),
          setMenuValues())
        : (e.add("menuToggle"),
          (t.innerHTML = "Options"),
          settingAdjusted && ((settingAdjusted = !1), generateBoard()));
  },
  start = () => {
    getAdjList(mode), buildTiles(mode), fillTiles();
  };
start();
