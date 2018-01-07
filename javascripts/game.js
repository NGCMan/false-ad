//test
var Marathon = 0;
var auto = false;
var autoS = true;
var secretThemeKey = 0;
const MAX_DIMENSION = 16;

var initialDimCostMults = function () {
  var patt = [3, 4, 5, 3, 4, 5, 4, 3, 5, 4];
  var c = 3;
  var a = [];
  for (let i = 0; i < MAX_DIMENSION; i++) {
    a.push(new Decimal(10).pow(c));
    c = Math.round(c * (patt[i % patt.length] + 1) / patt[i % patt.length]);
  }
  return a;
}

var initialDimCosts = function () {
  var a = initialDimCostMults();
  var b = [new Decimal(10), new Decimal(100)];
  for (let i = 0; i < MAX_DIMENSION - 2; i++) {
    b.push(new Decimal(10).pow(b[i].e + a[i].e + Math.floor(i / 3)));
  }
  return b;
}

var initialDimBought = function () {
  var a = [];
  for (let i = 0; i < MAX_DIMENSION; i++) {
    a.push(0);
  }
  return a;
}

var initialDimAmount = function () {
  var a = [];
  for (let i = 0; i < MAX_DIMENSION; i++) {
    a.push(new Decimal(0));
  }
  return a;
}

var initialDimPow = function (total_resets, extra_starting_dimensions) {
  var a = [];
  for (let i = 0; i < MAX_DIMENSION; i++) {
    a.push(Decimal.pow(getDimensionBoostPower(),
        Math.max(0, total_resets + extra_starting_dimensions - i)));
  }
  return a;
}

var player = {
    money: new Decimal(10),
    tickSpeedCost: new Decimal(1000),
    tickspeed: new Decimal(1000),
    dimCosts: initialDimCosts(),
    dimBought: initialDimBought(),
    dimAmount: initialDimAmount(),
    dimPow: initialDimPow(0, 0),
    achievements: [],
    infinityUpgrades: [],
    challenges: [],
    currentChallenge: "",
    infinityPoints: new Decimal(0),
    infinitied: 0,
    totalTimePlayed: 0,
    bestInfinityTime: 9999999999,
    infTickspeedBoosts: 0,
    thisInfinityTime: 0,
    shiftResets: 0,
    boostResets: 0,
    extra_starting_dimensions: 0,
    tickDecrease: 0.9,
    totalmoney: new Decimal(0),
    achPow: 1,
    newsArray: [],
    interval: null,
    lastUpdate: new Date().getTime(),
    autobuyers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    costMultipliers: initialDimCostMults(),
    tickspeedMultiplier: new Decimal(10),
    chall2Pow: 1,
    chall3Pow: new Decimal(0.01),
    matter: new Decimal(0),
    chall11Pow: 1,
    partInfinityPoint: 0,
    partInfinitied: 0,
    break: false,
    challengeTimes: [600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31],
    infchallengeTimes: [600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31],
    lastTenRuns: [[600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1]],
    lastTenEternities: [[600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1]],
    infMult: new Decimal(1),
    infMultCost: new Decimal(10),
    tickspeedBoostCost: new Decimal(100),
    tickSpeedMultDecrease: 10,
    tickSpeedMultDecreaseCost: 3e6,
    dimensionMultDecrease: 10,
    dimensionMultDecreaseCost: 1e8,
    version: 7.01,
    infDimensionsUnlocked: [false, false, false, false, false, false, false, false],
    infinityPower: new Decimal(1),
    spreadingCancer: 0,
    postChallUnlocked: 0,
    postC4Tier: 0,
    postC3Reward: new Decimal(1),
    eternityPoints: new Decimal(0),
    eternities: 0,
    thisEternity: 0,
    bestEternity: 9999999999,
    eternityUpgrades: [],
    epmult: 1,
    epmultCost: new Decimal(500),
    infinityDimension1 : {
        cost: new Decimal(1e8),
        amount: new Decimal(0),
        bought: 0,
        power: new Decimal(1),
        baseAmount: 0
    },
    infinityDimension2 : {
        cost: new Decimal(1e9),
        amount: new Decimal(0),
        bought: 0,
        power: new Decimal(1),
        baseAmount: 0
    },
    infinityDimension3 : {
        cost: new Decimal(1e10),
        amount: new Decimal(0),
        bought: 0,
        power: new Decimal(1),
        baseAmount: 0
    },
    infinityDimension4 : {
        cost: new Decimal(1e20),
        amount: new Decimal(0),
        bought: 0,
        power: new Decimal(1),
        baseAmount: 0
    },
    infinityDimension5 : {
        cost: new Decimal(1e140),
        amount: new Decimal(0),
        bought: 0,
        power: new Decimal(1),
        baseAmount: 0
    },
    infinityDimension6 : {
        cost: new Decimal(1e200),
        amount: new Decimal(0),
        bought: 0,
        power: new Decimal(1),
        baseAmount: 0
    },
    infinityDimension7 : {
        cost: new Decimal(1e250),
        amount: new Decimal(0),
        bought: 0,
        power: new Decimal(1),
        baseAmount: 0
    },
    infinityDimension8 : {
        cost: new Decimal(1e280),
        amount: new Decimal(0),
        bought: 0,
        power: new Decimal(1),
        baseAmount: 0
    },
    infDimBuyers: [false, false, false, false, false, false, false, false],
    timeShards: new Decimal(0),
    tickThreshold: new Decimal(1),
    totalTickGained: 0,
    timeDimension1: {
        cost: 1,
        amount: new Decimal(0),
        power: 1,
        bought: 0
    },
    timeDimension2: {
        cost: 5,
        amount: new Decimal(0),
        power: 1,
        bought: 0
    },
    timeDimension3: {
        cost: 100,
        amount: new Decimal(0),
        power: 1,
        bought: 0
    },
    timeDimension4: {
        cost: 1000,
        amount: new Decimal(0),
        power: 1,
        bought: 0
    },
    offlineProd: 0,
    offlineProdCost: 1e7,
    challengeTarget: 0,
    timestudy: {
        theorem: 0,
        amcost: new Decimal("1e20000"),
        ipcost: new Decimal(1),
        epcost: new Decimal(1),
        studies: [],
    },
    autoIP: new Decimal(0),
    autoTime: 1e300,
    infMultBuyer: false,
    autoCrunchMode: "amount",
    respec: false,
    eternityBuyer: {
        limit: new Decimal(0),
        isOn: false
    },
    options: {
        newsHidden: false,
        notation: "Standard",
        //Standard = normal prefixed numbers, Scientific = standard form, Engineering = powers of 3.
        scientific: false,
        challConf: false,
        retryChallenge: false,
        bulkOn: true,
        cloud: true,
        hotkeys: true,
        theme: undefined,
        eternityconfirm: true,
        commas: true
    }

};

var defaultStart = $.extend(true, {}, player);
var tickSpeedButton = document.getElementById("tickSpeed");


if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
      'use strict';
      if (typeof start !== 'number') {
        start = 0;
      }

      if (start + search.length > this.length) {
        return false;
      } else {
        return this.indexOf(search, start) !== -1;
      }
    };
  }


  if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
      value: function(searchElement, fromIndex) {

        // 1. Let O be ? ToObject(this value).
        if (this == null) {
          throw new TypeError('"this" is null or not defined');
        }

        var o = Object(this);

        // 2. Let len be ? ToLength(? Get(O, "length")).
        var len = o.length >>> 0;

        // 3. If len is 0, return false.
        if (len === 0) {
          return false;
        }

        // 4. Let n be ? ToInteger(fromIndex).
        //    (If fromIndex is undefined, this step produces the value 0.)
        var n = fromIndex | 0;

        // 5. If n ≥ 0, then
        //  a. Let k be n.
        // 6. Else n < 0,
        //  a. Let k be len + n.
        //  b. If k < 0, let k be 0.
        var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

        function sameValueZero(x, y) {
          return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
        }

        // 7. Repeat, while k < len
        while (k < len) {
          // a. Let elementK be the result of ? Get(O, ! ToString(k)).
          // b. If SameValueZero(searchElement, elementK) is true, return true.
          // c. Increase k by 1.
          if (sameValueZero(o[k], searchElement)) {
            return true;
          }
          k++;
        }

        // 8. Return false
        return false;
      }
    });
  }

    if (!Math.log10) {
        Math.log10 = Math.log10 || function(x) {
            return Math.log(x) * Math.LOG10E;
        };
    }

    if (!Math.log2) {
        Math.log2 = Math.log2 || function(x) {
            return Math.log(x) * Math.LOG2E;
        };
    }

    if (window.NodeList && !NodeList.prototype.forEach) {
        NodeList.prototype.forEach = function (callback, thisArg) {
            thisArg = thisArg || window;
            for (var i = 0; i < this.length; i++) {
                callback.call(thisArg, this[i], i, this);
            }
        };
    }


function set_save(name, value) {
    localStorage.setItem(name, btoa(JSON.stringify(value, function(k, v) { return (v === Infinity) ? "Infinity" : v; })))
}

function get_save(name) {
    if (localStorage.getItem(name) !== null) {
        return JSON.parse(atob(localStorage.getItem(name), function(k, v) { return (v === Infinity) ? "Infinity" : v; }))
    }
}

var canvas = document.getElementById("studyTreeCanvas");
var ctx = canvas.getContext("2d");
window.addEventListener("resize", resizeCanvas)

function resizeCanvas() {
    canvas.width = document.body.scrollWidth;
    canvas.height = document.body.scrollHeight;
    drawStudyTree()
}

function drawTreeBranch(num1, num2) {
    var name1 = parseInt(num1)
    var name2 = parseInt(num2)
    var start = document.getElementById(num1).getBoundingClientRect()
    var end = document.getElementById(num2).getBoundingClientRect()
    var x1 = start.left + (start.width / 2) + document.documentElement.scrollLeft;
    var y1 = start.top + (start.height / 2) + document.documentElement.scrollTop;
    var x2 = end.left + (start.width / 2) + document.documentElement.scrollLeft;
    var y2 = end.top + (start.height / 2) + document.documentElement.scrollTop;
    ctx.lineWidth=15;
    ctx.beginPath();
    if (player.timestudy.studies.includes(name1) && player.timestudy.studies.includes(name2)) {
        if (name2 == 71 || name2 == 81 || name2 == 91 || name2 == 101 || name1 == 101) {
            ctx.strokeStyle="#22aa48";
        } else if (name2 == 72 || name2 == 82 || name2 == 92 || name2 == 102 || name1 == 102) {
            ctx.strokeStyle="#B67F33";
        } else if (name2 == 73 || name2 == 83 || name2 == 93 || name2 == 103 || name1 == 103) {
            ctx.strokeStyle="#B241E3";
        } else if (name2 == 121 || name2 == 131 || name2 == 141 || name1 == 141) {
            ctx.strokeStyle="#FF0100";
        } else if (name2 == 122 || name2 == 132 || name2 == 142 || name1 == 142) {
            ctx.strokeStyle="#5E33B6";
        } else if (name2 == 123 || name2 == 133 || name2 == 143 || name1 == 143) {
            ctx.strokeStyle="#0080ff";
        } else {
            ctx.strokeStyle="#000000";
        }
    } else {
        if (name2 == 71 || name2 == 81 || name2 == 91 || name2 == 101 || name1 == 101) {
            ctx.strokeStyle="#37533f";
        } else if (name2 == 72 || name2 == 82 || name2 == 92 || name2 == 102 || name1 == 102) {
            ctx.strokeStyle="#534737";
        } else if (name2 == 73 || name2 == 83 || name2 == 93 || name2 == 103 || name1 == 103) {
            ctx.strokeStyle="#4a3753";
        } else if (name2 == 121 || name2 == 131 || name2 == 141 || name1 == 141) {
            ctx.strokeStyle="#533737";
        } else if (name2 == 122 || name2 == 132 || name2 == 142 || name1 == 142) {
            ctx.strokeStyle="#403753";
        } else if (name2 == 123 || name2 == 133 || name2 == 143 || name1 == 143) {
            ctx.strokeStyle="#374553";
        } else {
            ctx.strokeStyle="#444";
        }
    }
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function drawStudyTree() {
    drawTreeBranch("11", "21");
    drawTreeBranch("11", "22");
    drawTreeBranch("21", "31");
    drawTreeBranch("22", "32");
    drawTreeBranch("31", "41");
    drawTreeBranch("32", "42");
    drawTreeBranch("41", "51");
    drawTreeBranch("42", "51");
    drawTreeBranch("51", "61");
    drawTreeBranch("61", "71");
    drawTreeBranch("61", "72");
    drawTreeBranch("61", "73");
    drawTreeBranch("71", "81");
    drawTreeBranch("72", "82");
    drawTreeBranch("73", "83");
    drawTreeBranch("81", "91");
    drawTreeBranch("82", "92");
    drawTreeBranch("83", "93");
    drawTreeBranch("91", "101");
    drawTreeBranch("92", "102");
    drawTreeBranch("93", "103");
    drawTreeBranch("101", "111");
    drawTreeBranch("102", "111");
    drawTreeBranch("103", "111");
    drawTreeBranch("111", "121");
    drawTreeBranch("111", "122");
    drawTreeBranch("111", "123");
    drawTreeBranch("121", "131");
    drawTreeBranch("122", "132");
    drawTreeBranch("123", "133");
    drawTreeBranch("131", "141");
    drawTreeBranch("132", "142");
    drawTreeBranch("133", "143");
    drawTreeBranch("141", "151");
    drawTreeBranch("142", "151");
    drawTreeBranch("143", "151");
    drawTreeBranch("151", "161");
    drawTreeBranch("151", "162");
    drawTreeBranch("161", "171");
    drawTreeBranch("162", "171");
}

function setTheme(name) {
    document.querySelectorAll("link").forEach( function(e) {
        if (e.href.includes("theme")) e.remove();
    });

    if(name === undefined) {
        document.getElementById("theme").innerHTML="Current theme: Normal";
    } else if(name === "S1") {
        document.getElementById("theme").innerHTML="Current theme: " + secretThemeKey;
    } else if(name === "S2") {
        document.getElementById("theme").innerHTML="Current theme: " + secretThemeKey;
    } else {
        document.getElementById("theme").innerHTML="Current theme: " + name;
    }

    if (name === undefined) return;

    var head = document.head;
    var link = document.createElement('link');

    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = "stylesheets/theme-" + name + ".css";

    head.appendChild(link);
}

document.getElementById("theme").onclick = function () {
    if (player.options.theme === undefined) {
        player.options.theme = "Metro";
    } else if (player.options.theme === "Metro") {
        player.options.theme = "Dark";
    } else if (player.options.theme === "Dark") {
        player.options.theme = "Dark Metro";
    } else if (player.options.theme === "Dark Metro") {
        player.options.theme = "Inverted";
    } else if (player.options.theme === "Inverted") {
        player.options.theme = "Inverted Metro";
    } else if (player.options.theme === "Inverted Metro") {
        player.options.theme = undefined;
    } else {
        player.options.theme = undefined;
    }

    setTheme(player.options.theme);
}

function dimDisplay () {
  for (let i = 1; i <= MAX_DIMENSION; i++) {
    let e = document.getElementById(getDimName(i).toLowerCase() + "Row");
    if (canBuyDimension(i)) {
      e.style.display = "table-row";
    } else {
      e.style.display = "none";
    }
  }
}

function onLoad() {
    if (player.totalmoney === undefined || isNaN(player.totalmoney)) player.totalmoney = player.money;
    if (player.options === undefined) {
        player.options = {
            scientific: false,
            animationOn: true
        }
    }
    if (player.options.invert === true) player.options.theme = "Inverted"; player.options.invert = undefined;
    if (player.options.notation === undefined) player.options.notation = "Standard"
    if (player.options.challConf === undefined) player.options.challConf = false
	if (player.options.notation === undefined) player.options.notation = "Standard";
    if (player.options.newsHidden === undefined) player.options.newsHidden = false;
    if (player.options.retryChallenge === undefined) player.options.retryChallenge = false;
    if (player.options.bulkOn === undefined) player.options.bulkOn = true
    if (player.options.cloud === undefined) player.options.cloud = true
    if (player.options.hotkeys === undefined) player.options.hotkeys = true
    if (player.options.eternityconfirm === undefined) player.options.eternityconfirm = true
    if (player.achievements === undefined) player.achievements = [];
    if (player.infinityUpgrades === undefined) player.infinityUpgrades = [];
    if (player.infinityPoints === undefined) player.infinityPoints = new Decimal(0);
    if (player.infinitied === undefined) player.infinitied = 0;
    if (player.totalTimePlayed === undefined) player.totalTimePlayed = 0;
    if (player.bestInfinityTime === undefined) player.bestInfinityTime = 9999999999;
    if (player.infTickspeedBoosts === undefined) player.infTickspeedBoosts = 0;
    if (player.thisInfinityTime === undefined) player.thisInfinityTime = 9999999999;
    if (player.lastUpdate === undefined) player.lastUpdate = new Date().getTime();
    if (player.achPow === undefined) player.achPow = 1;
    if (player.newsArray === undefined) player.newsArray = [];
    if (player.chall2Pow === undefined) player.chall2Pow = 1;
    if (player.chall3Pow === undefined) player.chall3Pow = 0.01;
    if (player.firstAmount !== 0) document.getElementById("secondRow").style.display = "table-row";
    if (player.challenges === undefined) player.challenges = []
    if (player.currentChallenge === undefined) player.currentChallenge = ""
    if (player.matter === undefined) player.matter = new Decimal(0)
    if (player.autobuyers === undefined) player.autobuyers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    if (player.costMultipliers === undefined) player.costMultipliers = initialDimCostMults()
    if (player.tickspeedMultiplier === undefined) player.tickspeedMultiplier = new Decimal(10)
    if (player.partInfinityPoint === undefined) player.partInfinityPoint = 0
    if (player.challengeTimes === undefined) player.challengeTimes = [600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31]
    if (player.infchallengeTimes === undefined) player.infchallengeTimes = [600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31]
    if (player.lastTenRuns === undefined) player.lastTenRuns = [[600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1]]
    if (player.infMult === undefined) player.infMult = new Decimal(1)
    if (player.infMultCost === undefined) player.infMultCost = new Decimal(10)
    if (player.tickspeedBoostCost === undefined) player.tickspeedBoostCost = new Decimal(100)
    if (player.tickSpeedMultDecrease === undefined) player.tickSpeedMultDecrease = 10
    if (player.tickSpeedMultDecreaseCost === undefined) player.tickSpeedMultDecreaseCost = 3e6
    if (player.dimensionMultDecrease === undefined) player.dimensionMultDecrease = 10
    if (player.dimensionMultDecreaseCost === undefined) player.dimensionMultDecreaseCost = 1e8
    if (player.partInfinitied === undefined) player.partInfinitied = 0
    if (player.spreadingCancer === undefined) player.spreadingCancer = 0
    if (player.postC4Tier === undefined) player.postC4Tier = 0
    if (player.postC3Reward === undefined) player.postC3Reward = new Decimal(1)
    if (player.offlineProd === undefined) player.offlineProd = 0
    if (player.offlineProdCost === undefined) player.offlineProdCost = 1e7
    if (player.postChallUnlocked === undefined) player.postChallUnlocked = 0
    if (player.infMultBuyer === undefined) player.infMultBuyer = false
    if (player.autoCrunchMode === undefined) player.autoCrunchMode = "amount"
    if (player.challengeTarget === undefined) {
        player.challengeTarget = 0
        if (player.currentChallenge != "") player.challengeTarget = Number.MAX_VALUE
    }
    if (player.lastTenEternities === undefined) player.lastTenEternities = [[600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1]]
    if (player.respec === undefined) player.respec = false
    if (player.options.commas === undefined) player.options.commas = true

    setTheme(player.options.theme);

    // Second dimension
    if (player.dimAmount[1] !== 0) {
        document.getElementById("thirdRow").style.display = "table-row";
        document.getElementById("tickSpeed").style.visibility = "visible";
        document.getElementById("tickSpeedMax").style.visibility = "visible";
        document.getElementById("tickLabel").style.visibility = "visible";
        document.getElementById("tickSpeedAmount").style.visibility = "visible";
    }
    if (player.options.notation == "Mixed") player.options.notation = "Mixed scientific"

    if (player.infinityPower === undefined) {
        player.infinityPower = new Decimal(1)
        player.infinityDimension1 = {
            cost: new Decimal(1e8),
            amount: new Decimal(0),
            bought: 0,
            power: new Decimal(1),
            baseAmount: 0
        }
        player.infinityDimension2 = {
            cost: new Decimal(1e9),
            amount: new Decimal(0),
            bought: 0,
            power: new Decimal(1),
            baseAmount: 0
        }
        player.infinityDimension3 = {
            cost: new Decimal(1e10),
            amount: new Decimal(0),
            bought: 0,
            power: new Decimal(1),
            baseAmount: 0
        }
        player.infinityDimension4 = {
            cost: new Decimal(1e20),
            amount: new Decimal(0),
            bought: 0,
            power: new Decimal(1),
            baseAmount: 0
        }
        player.infDimensionsUnlocked = [false, false, false, false]
    }

    if (player.timeShards === undefined) {
        player.timeShards = new Decimal(0)
        player.eternityPoints = new Decimal(0)
        player.tickThreshold = new Decimal(1)
        player.totalTickGained = 0
        player.eternities = 0
        player.timeDimension1 = {
            cost: 1,
            amount: new Decimal(0),
            power: 1,
            bought: 0
        }
        player.timeDimension2 = {
            cost: 5,
            amount: new Decimal(0),
            power: 1,
            bought: 0
        }
        player.timeDimension3 = {
            cost: 100,
            amount: new Decimal(0),
            power: 1,
            bought: 0
        }
        player.timeDimension4 = {
            cost: 1000,
            amount: new Decimal(0),
            power: 1,
            bought: 0
        }
    }

    if (player.infinityDimension1.baseAmount === undefined) {
        player.infinityDimension1.baseAmount = 0;
        player.infinityDimension2.baseAmount = 0;
        player.infinityDimension3.baseAmount = 0;
        player.infinityDimension4.baseAmount = 0;

        player.infinityDimension1.baseAmount = new Decimal(player.infinityDimension1.power).log(50).times(10).toNumber()
        player.infinityDimension2.baseAmount = new Decimal(player.infinityDimension2.power).log(30).times(10).toNumber()
        player.infinityDimension3.baseAmount = new Decimal(player.infinityDimension3.power).log(10).times(10).toNumber()
        player.infinityDimension4.baseAmount = new Decimal(player.infinityDimension4.power).log(5).times(10).toNumber()


    }
    if (player.autoIP === undefined) player.autoIP = new Decimal(0)
    if (player.autoTime === undefined) player.autoTime = 1e300;

    if (player.matter === null) player.matter = new Decimal(0)
    for (var i=0; i<12; i++) {
        if (player.autobuyers[i]%1 !== 0 && player.autobuyers[i].tier === undefined) {
            player.autobuyers[i].tier = i+1
        }
        if (player.autobuyers[i]%1 !== 0 && player.autobuyers[i].target%1 !== 0) {
            player.autobuyers[i].target = i+1
            if (i == 8) player.autobuyers[i].target = 1
        }

        if (player.autobuyers[i]%1 !== 0 && (player.autobuyers[i].bulk === undefined || isNaN(player.autobuyers[i].bulk) || player.autobuyers[i].bulk === null)) {
            player.autobuyers[i].bulk = 1
        }
    }
    if (player.autobuyers[8].tier == 10) player.autobuyers[8].tier = 9

    dimDisplay();

    document.getElementById("totaltickgained").innerHTML = "You've gained "+shortenDimensions(player.totalTickGained)+" tickspeed upgrades."

    if (player.autobuyers[9]%1 !== 0) {
        if (player.autobuyers[9].bulk === null || player.autobuyers[9].bulk === undefined) player.autobuyers[9].bulk = 1
    }

    if (player.version === undefined) { // value will need to be adjusted when update goes live
        for (var i = 0; i < player.autobuyers.length; i++) {
            if (player.autobuyers[i]%1 !== 0) player.infinityPoints = player.infinityPoints + player.autobuyers[i].cost - 1
        }
        player.autobuyers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        player.version = 1
    }
    if (player.version == 1) {
        if (player.dimensionMultDecrease != 10) {
            if (player.dimensionMultDecrease == 9) {
                player.dimensionMultDecrease = 10
                player.dimensionMultDecreaseCost = 1e8
                player.infinityPoints = player.infinityPoints.plus(1e8)
            }
            if (player.dimensionMultDecrease == 8) {
                player.dimensionMultDecrease = 10
                player.dimensionMultDecreaseCost = 1e8
                player.infinityPoints = player.infinityPoints.plus(2.1e9)
            }
            if (player.dimensionMultDecrease == 7) {
                player.dimensionMultDecrease = 10
                player.dimensionMultDecreaseCost = 1e8
                player.infinityPoints = player.infinityPoints.plus(4.21e10)
            }
        }
        player.version = 2
    }
	if (player.version < 5) {
		player.newsArray = []
		player.version = 5
    }

    if (player.infinityDimension5 === undefined) {
        player.infDimensionsUnlocked.push(false)
        player.infDimensionsUnlocked.push(false)
        player.infinityDimension5 = {
            cost: new Decimal(1e140),
            amount: new Decimal(0),
            bought: 0,
            power: new Decimal(1),
            baseAmount: 0
        }
        player.infinityDimension6 = {
            cost: new Decimal(1e200),
            amount: new Decimal(0),
            bought: 0,
            power: new Decimal(1),
            baseAmount: 0
        }
        player.version = 6
    }

    if (player.infinityDimension7 == undefined) {
        player.infDimensionsUnlocked.push(false)
        player.infDimensionsUnlocked.push(false)
        player.infinityDimension7 = {
            cost: new Decimal(1e250),
            amount: new Decimal(0),
            bought: 0,
            power: new Decimal(1),
            baseAmount: 0
        }
        player.infinityDimension8 = {
            cost: new Decimal(1e280),
            amount: new Decimal(0),
            bought: 0,
            power: new Decimal(1),
            baseAmount: 0
        }
    }

    if (player.bestEternity === undefined) {
        player.bestEternity = 9999999999
        player.thisEternity = player.totalTimePlayed
    }
    if (player.timestudy === undefined) {
        player.timestudy = {
            theorem: 0,
            amcost: new Decimal("1e20000"),
            ipcost: new Decimal(1),
            epcost: new Decimal(1),
            studies: [],
        }
    }

    if (player.eternities == 0) {
        document.getElementById("eternityPoints2").style.display = "none";
        document.getElementById("eternitystorebtn").style.display = "none";
    }

    if (player.eternityUpgrades === undefined) player.eternityUpgrades = []

    if (player.infDimBuyers === undefined) player.infDimBuyers = [false, false, false, false, false, false, false, false]

    if (player.eternityBuyer === undefined) {
        player.eternityBuyer = {
            limit: new Decimal(0),
            isOn: false
        }
    }

    transformSaveToDecimal();
    updateCosts();
    updateTickSpeed();
    updateAchPow();
    updateChallenges();
    updateCheckBoxes();
    toggleChallengeRetry()
    toggleChallengeRetry()
    toggleBulk()
    toggleBulk()
    respecToggle()
    respecToggle()
    toggleEternityConf()
    toggleEternityConf()
    toggleCommas()
    toggleCommas()
    loadAutoBuyerSettings();
    updateLastTenRuns()
    updateLastTenEternities()

    updateInfCosts()

    if (player.version < 7) {
        player.infMultCost = player.infMultCost.dividedBy(10)
        player.version = 7
    }

    if (player.currentChallenge == "challenge12" || player.currentChallenge == "challenge9" || player.currentChallenge == "challenge5" ||
        player.currentChallenge == "postc1" || player.currentChallenge == "postc4" || player.currentChallenge == "postc5" || player.currentChallenge == "postc6" || player.currentChallenge == "postc8") document.getElementById("quickReset").style.display = "inline-block";
    else document.getElementById("quickReset").style.display = "none";


    if (player.break == true) {
      document.getElementById("break").innerHTML = "FIX INFINITY";
    }
    document.getElementById("infiMult").innerHTML = "Multiply infinity points from all sources by 2 <br>currently: "+shortenDimensions(player.infMult) +"x<br>Cost: "+shortenCosts(player.infMultCost)+" IP"
    document.getElementById("tickspeedBoost").innerHTML = "Multiply infinity points from all sources by 2 <br>currently: "+ player.infTickspeedBoosts +"<br>Cost: "+shortenCosts(player.tickspeedBoostCost)+" IP"

    document.getElementById("notation").innerHTML = "Notation: " + player.options.notation

    if (player.infinitied == 0) document.getElementById("infinityPoints2").style.display = "none"

    if (player.currentChallenge == "challenge12" || player.currentChallenge == "postc1" || player.currentChallenge == "postc6") document.getElementById("matter").style.display = "inline-block";
    else document.getElementById("matter").style.display = "none";



    if (player.infMultBuyer !== undefined) {
        infMultAutoToggle()
        infMultAutoToggle()
    }

    if (player.epmult === undefined) {
        player.epmult = 1
        player.epmultCost = new Decimal(500)
    }

    clearOldAchieves()
    for (var i of player.achievements) {
        document.getElementById(allAchievements[i]).className = "achievementunlocked"
    }
    document.getElementById("epmult").innerHTML = "You gain 5 times more EP<p>Currently: "+shortenDimensions(player.epmult)+"x<p>Cost: "+shortenDimensions(player.epmultCost)+" EP"

    for (var i=0; i<player.timestudy.studies.length; i++) {
        if (player.timestudy.studies[i] == 71 || player.timestudy.studies[i] == 81 || player.timestudy.studies[i] == 91 || player.timestudy.studies[i] == 101) {
            document.getElementById(""+player.timestudy.studies[i]).className = "timestudybought normaldimstudy"
        } else if (player.timestudy.studies[i] == 72 || player.timestudy.studies[i] == 82 || player.timestudy.studies[i] == 92 || player.timestudy.studies[i] == 102) {
            document.getElementById(""+player.timestudy.studies[i]).className = "timestudybought infdimstudy"
        } else if (player.timestudy.studies[i] == 73 || player.timestudy.studies[i] == 83 || player.timestudy.studies[i] == 93 || player.timestudy.studies[i] == 103) {
            document.getElementById(""+player.timestudy.studies[i]).className = "timestudybought timedimstudy"
        } else if (player.timestudy.studies[i] == 121 || player.timestudy.studies[i] == 131 || player.timestudy.studies[i] == 141) {
            document.getElementById(""+player.timestudy.studies[i]).className = "timestudybought activestudy"
        } else if (player.timestudy.studies[i] == 122 || player.timestudy.studies[i] == 132 || player.timestudy.studies[i] == 142) {
            document.getElementById(""+player.timestudy.studies[i]).className = "timestudybought passivestudy"
        } else if (player.timestudy.studies[i] == 123 || player.timestudy.studies[i] == 133 || player.timestudy.studies[i] == 143) {
            document.getElementById(""+player.timestudy.studies[i]).className = "timestudybought idlestudy"
        } else {
            document.getElementById(""+player.timestudy.studies[i]).className = "timestudybought"
        }
    }

    toggleCrunchMode()
    toggleCrunchMode()
    toggleCrunchMode()


    if (player.options.newsHidden) {
        document.getElementById("game").style.display = "none";
    }
    if (player.options.challConf) {
        document.getElementById("challengeconfirmation").innerHTML = "Challenge confirmation off"
    } else {
        document.getElementById("challengeconfirmation").innerHTML = "Challenge confirmation on"
    }

    if (!player.options.hotkeys) document.getElementById("hotkeys").innerHTML = "Enable hotkeys"
    updateAutobuyers();
    setAchieveTooltip();
    updatePriorities()
    updateTheoremButtons()
    updateTimeStudyButtons()
    totalMult = Math.pow(player.totalmoney.e+1, 0.5)
    currentMult = Math.pow(player.money.e+1, 0.5)
    infinitiedMult = 1+Math.log10(player.infinitied+1)*10
    achievementMult = Math.max(Math.pow((player.achievements.length-30), 3)/40,1)
    challengeMult = Decimal.max(10*3000/worstChallengeTime, 1)
    unspentBonus = player.infinityPoints.dividedBy(2).pow(1.5).plus(1)
    transformSaveToDecimal();
    updateMilestones();
    updateEternityUpgrades()
    loadInfAutoBuyers()
    resizeCanvas()
    checkForEndMe()
}



function loadFromString(string) {
    var save = LZString.decompressFromEncodedURIComponent(string)
    console.log("Save length: "+save.length)
    if (save == "") player = JSON.parse(atob(string))
    else player = JSON.parse(save)
    onLoad()
}


function load_game() {
    var save_data = get_save('falseDimensionSave');
    if (!save_data) return;
    player = save_data;
    onLoad()
}


function save_game() {
    set_save('falseDimensionSave', player);
    $.notify("Game saved", "info")
}


function transformSaveToDecimal() {

    player.infinityPoints = new Decimal(player.infinityPoints)
    document.getElementById("eternitybtn").style.display = (player.infinityPoints.gte(Number.MAX_VALUE) || player.eternities > 0) ? "inline-block" : "none"

    player.money = new Decimal(player.money)
    player.tickSpeedCost = new Decimal(player.tickSpeedCost)
    player.tickspeed = new Decimal(player.tickspeed)
    player.dimCosts = player.dimCosts.map((i) => new Decimal(i));
    player.dimBought = player.dimBought.map((i) => new Decimal(i));
    player.dimAmount = player.dimAmount.map((i) => new Decimal(i));
    player.dimPow = player.dimPow.map((i) => new Decimal(i));
    player.totalmoney = new Decimal(player.totalmoney)
    player.chall3Pow = new Decimal(player.chall3Pow)
    player.costMultipliers = player.costMultipliers.map((i) => new Decimal(i));
    player.tickspeedMultiplier = new Decimal(player.tickspeedMultiplier)
    player.matter = new Decimal(player.matter)
    player.infinityPower = new Decimal(player.infinityPower)
    player.infinityDimension1.amount = new Decimal(player.infinityDimension1.amount)
    player.infinityDimension2.amount = new Decimal(player.infinityDimension2.amount)
    player.infinityDimension3.amount = new Decimal(player.infinityDimension3.amount)
    player.infinityDimension4.amount = new Decimal(player.infinityDimension4.amount)
    player.infinityDimension5.amount = new Decimal(player.infinityDimension5.amount)
    player.infinityDimension6.amount = new Decimal(player.infinityDimension6.amount)
    player.infinityDimension7.amount = new Decimal(player.infinityDimension7.amount)
    player.infinityDimension8.amount = new Decimal(player.infinityDimension8.amount)

    player.timeDimension1.amount = new Decimal(player.timeDimension1.amount)
    player.timeDimension2.amount = new Decimal(player.timeDimension2.amount)
    player.timeDimension3.amount = new Decimal(player.timeDimension3.amount)
    player.timeDimension4.amount = new Decimal(player.timeDimension4.amount)
    player.timeShards = new Decimal(player.timeShards)
    player.eternityPoints = new Decimal(player.eternityPoints)
    player.tickThreshold = new Decimal(player.tickThreshold)
    player.postC3Reward = new Decimal(player.postC3Reward)

    for (var i=0; i<10; i++) {
        player.lastTenRuns[i][1] = new Decimal(player.lastTenRuns[i][1])
        player.lastTenEternities[i][1] = new Decimal(player.lastTenEternities[i][1])
    }
    player.lastTenRuns = player.lastTenRuns.slice(0, 10).map((i) => [parseFloat(i[0]), i[1]]);
    for (var i=1; i<=8; i++) {
        player["infinityDimension"+i].cost = new Decimal(player["infinityDimension"+i].cost)
        player["infinityDimension"+i].power = new Decimal(player["infinityDimension"+i].power)
    }

    player.infMultCost = new Decimal(player.infMultCost)
    player.tickspeedBoostCost = new Decimal(player.tickspeedBoostCost)
    player.infMult = new Decimal(player.infMult)
    player.timestudy.amcost = new Decimal(player.timestudy.amcost)
    player.timestudy.ipcost = new Decimal(player.timestudy.ipcost)
    player.timestudy.epcost = new Decimal(player.timestudy.epcost)

    player.autoIP = new Decimal(player.autoIP)

    if (player.autobuyers[11].priority !== undefined && player.autobuyers[11].priority !== null && player.autobuyers[11].priority !== "undefined")player.autobuyers[11].priority = new Decimal(player.autobuyers[11].priority)

    player.epmultCost = new Decimal(player.epmultCost)
    player.eternityBuyer.limit = new Decimal(player.eternityBuyer.limit);
}


function loadAutoBuyerSettings() {
    for (var i=0; i<9; i++) {
        document.getElementById("priority" + (i+1)).selectedIndex = player.autobuyers[i].priority-1
        if (i == 8 && player.autobuyers[i].target == 10) document.getElementById("toggleBtnTickSpeed").innerHTML = "Buys max"
        else if (i == 8 && player.autobuyers[i].target !== 10) document.getElementById("toggleBtnTickSpeed").innerHTML = "Buys singles"
        else if (player.autobuyers[i].target > 10) document.getElementById("toggleBtn" + (i+1)).innerHTML = "Buys until 10"
        else document.getElementById("toggleBtn" + (i+1)).innerHTML = "Buys singles"

    }
    document.getElementById("priority10").value = player.autobuyers[9].priority
    document.getElementById("priority11").value = player.autobuyers[10].priority
    document.getElementById("priority12").value = player.autobuyers[11].priority
    document.getElementById("bulkDimboost").value = player.autobuyers[9].bulk
    document.getElementById("bulkgalaxy").value = player.autobuyers[10].bulk
    document.getElementById("priority13").value = player.eternityBuyer.limit

}




function showTab(tabName) {
    //iterate over all elements in div_tab class. Hide everything that's not tabName and show tabName
    var tabs = document.getElementsByClassName('tab');
    var tab;
    for (var i = 0; i < tabs.length; i++) {
        tab = tabs.item(i);
        if (tab.id === tabName) {
            tab.style.display = 'block';
        } else {
            tab.style.display = 'none';
        }
    }
}

var FormatList = ['', 'K', 'M', 'B', 'T', 'Qd', 'Qt', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 'UDc', 'DDc', 'TDc', 'QdDc', 'QtDc', 'SxDc', 'SpDc', 'ODc', 'NDc', 'Vg', 'UVg', 'DVg', 'TVg', 'QdVg', 'QtVg', 'SxVg', 'SpVg', 'OVg', 'NVg', 'Tg', 'UTg', 'DTg', 'TTg', 'QdTg', 'QtTg', 'SxTg', 'SpTg', 'OTg', 'NTg', 'Qa', 'UQa', 'DQa', 'TQa', 'QdQa', 'QtQa', 'SxQa', 'SpQa', 'OQa', 'NQa', 'Qi', 'UQi', 'DQi', 'TQi', 'QaQi', 'QtQi', 'SxQi', 'SpQi', 'OQi', 'NQi', 'Se', 'USe', 'DSe', 'TSe', 'QaSe', 'QtSe', 'SxSe', 'SpSe', 'OSe', 'NSe', 'St', 'USt', 'DSt', 'TSt', 'QaSt', 'QtSt', 'SxSt', 'SpSt', 'OSt', 'NSt', 'Og', 'UOg', 'DOg', 'TOg', 'QdOg', 'QtOg', 'SxOg', 'SpOg', 'OOg', 'NOg', 'Nn', 'UNn', 'DNn', 'TNn', 'QdNn', 'QtNn', 'SxNn', 'SpNn', 'ONn', 'NNn', 'Ce',];

var letterList1 = ['', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
var letterList2 = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

var emojiList1 = ['', '😠', '🎂', '🎄', '💀', '🍆', '👪', '🌈', '💯', '🍦', '🎃', '💋', '😂', '🌙', '⛔', '🐙', '💩', '❓', '☢️', '🙈', '👍', '☂️', '✌️', '⚠️', '❌', '😋', '⚡'];
var emojiList2 = ['😠', '🎂', '🎄', '💀', '🍆', '👪', '🌈', '💯', '🍦', '🎃', '💋', '😂', '🌙', '⛔', '🐙', '💩', '❓', '☢️', '🙈', '👍', '☂️', '✌️', '⚠️', '❌', '😋', '⚡'];

function letter(power) {
    var letterList = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    var len = letterList.length; //26

    function letterNumber(n) {
        var result = 1;
        for (var i = 0; i < n; ++i) {
            result = len*(result)+1;
        }
        return result;
    }

    if (power <= 5) return 'a';
    var power_modified = Math.floor(power / 3);
    if (power_modified < letterNumber(1))
    {
        return letterList[power_modified-1];
    }
    else if (power_modified < letterNumber(2))
    {
        power_modified = power_modified - letterNumber(1);
        return letterList[Math.floor(power_modified / len)] + letterList[power_modified % len];
    }
    else if (power_modified < letterNumber(3))
    {
        power_modified = power_modified - letterNumber(2);
        return letterList[Math.floor(power_modified / (len*len))] + letterList[Math.floor(power_modified / len) % len] + letterList[power_modified % len];
    }
    else if (power_modified < letterNumber(4))
    {
        power_modified = power_modified - letterNumber(3);
        return letterList[Math.floor(power_modified / (len*len*len))] + letterList[Math.floor(power_modified / (len*len)) % len] + letterList[Math.floor(power_modified / len) % len] + letterList[power_modified % len];
    }
    else if (power_modified < letterNumber(5))
    {
        power_modified = power_modified - letterNumber(4);
        return letterList[Math.floor(power_modified / (len*len*len*len))] + letterList[Math.floor(power_modified / (len*len*len)) % len] + letterList[Math.floor(power_modified / (len*len)) % len] + letterList[Math.floor(power_modified / len) % len] + letterList[power_modified % len];
    }
    //continue adding cases as needed
}

function cancer(power) {
    var letterList = ['😠', '🎂', '🎄', '💀', '🍆', '👪', '🌈', '💯', '🍦', '🎃', '💋', '😂', '🌙', '⛔', '🐙', '💩', '❓', '☢️', '🙈', '👍', '☂️', '✌️', '⚠️', '❌', '😋', '⚡'];
    var len = letterList.length; //26

    function letterNumber(n) {
        var result = 1;
        for (var i = 0; i < n; ++i) {
            result = len*(result)+1;
        }
        return result;
    }

    if (power <= 5) return '😠';
    var power_modified = Math.floor(power / 3);
    if (power_modified < letterNumber(1))
    {
        return letterList[power_modified-1];
    }
    else if (power_modified < letterNumber(2))
    {
        power_modified = power_modified - letterNumber(1);
        return letterList[Math.floor(power_modified / len)] + letterList[power_modified % len];
    }
    else if (power_modified < letterNumber(3))
    {
        power_modified = power_modified - letterNumber(2);
        return letterList[Math.floor(power_modified / (len*len))] + letterList[Math.floor(power_modified / len) % len] + letterList[power_modified % len];
    }
    else if (power_modified < letterNumber(4))
    {
        power_modified = power_modified - letterNumber(3);
        return letterList[Math.floor(power_modified / (len*len*len))] + letterList[Math.floor(power_modified / (len*len)) % len] + letterList[Math.floor(power_modified / len) % len] + letterList[power_modified % len];
    }
    else if (power_modified < letterNumber(5))
    {
        power_modified = power_modified - letterNumber(4);
        return letterList[Math.floor(power_modified / (len*len*len*len))] + letterList[Math.floor(power_modified / (len*len*len)) % len] + letterList[Math.floor(power_modified / (len*len)) % len] + letterList[Math.floor(power_modified / len) % len] + letterList[power_modified % len];
    }
}

function isDecimal(value) {
    return value instanceof Decimal
}



function getAbbreviation(e) {
    var prefixes = ['', 'U', 'D', 'T', 'Qd', 'Qt', 'Sx', 'Sp', 'O', 'N']
    var prefixes2 = ['', 'Dc', 'Vg', 'Tg', 'Qa', 'Qi', 'Se', 'St', 'Og', 'Nn']
    var prefixes3 = ['', 'Ce', 'Dn', 'Tc', 'Qe', 'Qu', 'Sc', 'Si', 'Oe', 'Ne']
    var prefixes4 = ['', 'U', 'D', 'T', 'Qd', 'Qt', 'Sx', 'Sp', 'O', 'N']
    var index = Math.floor(e/3)-1
    var index2 = Math.floor(index/10)
    var index3 = Math.floor(index2/10)
    var index4 = Math.floor(index3/10)
    var prefix = prefixes[index%10]
    var prefix2 = prefixes2[index2%10]
    var prefix3 = prefixes3[index3%10]
    if (e <= 3002) {
        return prefix + prefix2 + prefix3
    } else if(e>=6003) {
        var secondIndex = Math.floor(index/1000)
        var secondIndex2 = Math.floor(secondIndex/10)
        var secondIndex3 = Math.floor(secondIndex2/10)
        var secondIndex4 = Math.floor(secondIndex3/10)
        var secondPrefix = prefixes4[secondIndex%10]
        var secondPrefix2 = prefixes2[secondIndex2%10]
        var secondPrefix3 = prefixes3[secondIndex3%10]
        var x = "MI"
        if ((index)%1000 !== 0) x += "-"
        return secondPrefix + secondPrefix2 + secondPrefix3 + x + prefix + prefix2 + prefix3
    } else if (3003 <= e <= 6002) {
        if(index==1000) return "MI";
        return "MI-" + prefix + prefix2 + prefix3
    }
}



function formatValue(notation, value, places, placesUnder1000) {

    if ((value <= Number.MAX_VALUE || (player.break && (player.currentChallenge == "" || !new Decimal(Number.MAX_VALUE).equals(player.challengeTarget)) )) && (value >= 1000)) {
        if (isDecimal(value)) {
           var power = value.e
           var temp = value.toExponential(4).split("e")
           var matissa = parseFloat(temp[0])
           if (parseInt(temp[1]) != power) power++;
        } else {
            var matissa = value / Math.pow(10, Math.floor(Math.log10(value)));
            var power = Math.floor(Math.log10(value));
        }
        if (notation.includes("engineering") || notation.includes("Engineering")) pow = power - (power % 3)
        else pow = power
        if (power > 100000  && player.options.commas) pow = pow.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        if ((notation === "Standard")) {
            if (power <= 303) return (matissa * Decimal.pow(10, power % 3)).toFixed(places) + " " + FormatList[(power - (power % 3)) / 3];
            else return (matissa * Decimal.pow(10, power % 3)).toFixed(places) + " " + getAbbreviation(power)
        } else if (notation === "Mixed scientific") {
            if (power < 33) return (matissa * Decimal.pow(10, power % 3)).toFixed(places) + " " + FormatList[(power - (power % 3)) / 3];
            else return ((matissa).toFixed(places) + "e" + pow);
        } else if (notation === "Mixed engineering") {
            if (power < 33) return (matissa * Decimal.pow(10, power % 3)).toFixed(places) + " " + FormatList[(power - (power % 3)) / 3];
            else return ((matissa * Decimal.pow(10, power % 3)).toFixed(places) + "ᴇ" + pow);
        } else if (notation === "Scientific") {
            return ((matissa).toFixed(places) + "e" + pow);
        } else if (notation === "Engineering") {
            return ((matissa * Decimal.pow(10, power % 3)).toFixed(places) + "ᴇ" + pow);
        } else if (notation === "Letters") {
            return ((matissa * Decimal.pow(10, power % 3)).toFixed(places)) + letter(power)
        } else if (notation === "Emojis") {
            return ((matissa * Decimal.pow(10, power % 3)).toFixed(places)) + cancer(power)

        }else if (notation === "Logarithm") {
            if (power > 100000  && player.options.commas) return "e"+Decimal.log10(value).toFixed(places).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            else return "e"+Decimal.log10(value).toFixed(places)

        } else {
            if (power > 100000  && player.options.commas) power = power.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            return "1337 H4CK3R"
        }
    } else if (value < 1000) {
        return (value).toFixed(placesUnder1000);
    } else {
        return "Infinite";
    }
}


function updateMoney() {
    var element = document.getElementById("coinAmount");
    element.innerHTML = formatValue(player.options.notation, player.money, 2, 1);
    var element2 = document.getElementById("matter");
    if (player.currentChallenge == "challenge12" || player.currentChallenge == "postc1") element2.innerHTML = "There is " + formatValue(player.options.notation, player.matter, 2, 1) + " matter.";
    if (player.currentChallenge == "postc6") element2.innerHTML = "There is " + formatValue(player.options.notation, Decimal.pow(player.matter,20), 2, 1) + " matter."; //TODO
}

function updateCoinPerSec() {
    var element = document.getElementById("coinsPerSec");
    if (player.currentChallenge == "challenge3" || player.currentChallenge == "postc1") {
      element.innerHTML = 'You are getting ' + shortenDimensions(getDimensionProductionPerSecond(1).times(player.chall3Pow)) + ' antimatter per second.';
    } else if (player.currentChallenge == "challenge7") {
      element.innerHTML = 'You are getting ' + (shortenDimensions(getDimensionProductionPerSecond(1).plus(getDimensionProductionPerSecond(2)))) + ' antimatter per second.';
    } else {
      element.innerHTML = 'You are getting ' + shortenDimensions(getDimensionProductionPerSecond(1)) + ' antimatter per second.';
    }
}

function hasInfinityMult(tier) {
  if ((tier - 1) % 8 >= 4) {
    tier -= 2 * ((tier - 1) % 8 - 4) + 1;
  }

  return player.infinityUpgrades.includes(tier + 'InfStat');
}



function getDimensionFinalMultiplier(tier) {

    let multiplier = new Decimal(player.dimPow[tier - 1]);

    multiplier = multiplier.times(player.achPow);

    multiplier = multiplier.times(player.infinityPower.pow(7).max(1))

    if (player.infinityUpgrades.includes("totalMult")) multiplier = multiplier.times(totalMult)
    if (player.infinityUpgrades.includes("currentMult")) multiplier = multiplier.times(currentMult)
    if (player.infinityUpgrades.includes("infinitiedMult")) multiplier = multiplier.times(infinitiedMult)
    if (player.infinityUpgrades.includes("achievementMult")) multiplier = multiplier.times(achievementMult)
    if (player.infinityUpgrades.includes("challengeMult")) multiplier = multiplier.times(challengeMult)

    if (hasInfinityMult(tier)) multiplier = multiplier.times(dimMults());
    if (tier == 1) {
        if (player.infinityUpgrades.includes("unspentBonus")) multiplier = multiplier.times(unspentBonus);
        if (player.achievements.includes("r28")) multiplier = multiplier.times(1.1);
        if (player.achievements.includes("r31")) multiplier = multiplier.times(1.05);
        if (player.achievements.includes("r71")) multiplier = multiplier.times(3);
        if (player.achievements.includes("r68")) multiplier = multiplier.times(1.5);
    }

    multiplier = multiplier.times(timeMult());
    if (player.achievements.includes("r34")) multiplier = multiplier.times(1.02);
    if (tier <= 4 && player.achievements.includes("r43")) multiplier = multiplier.times(1.25);
    if (player.achievements.includes("r48")) multiplier = multiplier.times(1.1);
    if (player.achievements.includes("r72")) multiplier = multiplier.times(1.1); // tbd
    if (player.achievements.includes("r74") && player.currentChallenge != "") multiplier = multiplier.times(1.4);
    if (player.achievements.includes("r77")) multiplier = multiplier.times(1+tier/100);
    if (player.achievements.includes("r56") && player.thisInfinityTime < 1800) multiplier = multiplier.times(3600/(player.thisInfinityTime+1800));
    if (player.achievements.includes("r78") && player.thisInfinityTime < 3) multiplier = multiplier.times(3.3/(player.thisInfinityTime+0.3));
    if (player.achievements.includes("r65") && player.currentChallenge != "" && player.thisInfinityTime < 1800) multiplier = multiplier.times(Math.max(2400/(player.thisInfinityTime+600), 1))
    if (player.achievements.includes("r91") && player.thisInfinityTime < 50) multiplier = multiplier.times(Math.max(301-player.thisInfinityTime*6, 1))
    if (player.achievements.includes("r92") && player.thisInfinityTime < 600) multiplier = multiplier.times(Math.max(101-player.thisInfinityTime/6, 1));
    if (player.achievements.includes("r84")) multiplier = multiplier.times(player.money.pow(0.00004).plus(1));
    else if (player.achievements.includes("r73")) multiplier = multiplier.times(player.money.pow(0.00002).plus(1));


    if (player.timestudy.studies.includes(91)) multiplier = multiplier.times(Decimal.pow(10, Math.min(player.thisEternity, 18000)/60));
    if (player.timestudy.studies.includes(161)) multiplier = multiplier.times(new Decimal("1e616"))

    multiplier = multiplier.times(player.postC3Reward)
    if (player.challenges.includes("postc8") && tier < 8 && tier > 1) multiplier = multiplier.times(mult18);

    if (player.currentChallenge == "postc6") multiplier = multiplier.dividedBy(player.matter.max(1))
    if (player.currentChallenge == "postc8") multiplier = multiplier.times(postc8Mult)

    if (player.currentChallenge == "postc4" && player.postC4Tier != tier) multiplier = multiplier.pow(0.25)
    if (player.challenges.includes("postc4")) multiplier = multiplier.pow(1.05);

    return multiplier;
}

function getMoneyPerSecond() {
    return getDimensionFinalMultiplier(1)*Math.floor(player.firstAmount)/player.tickspeed;
}

function getDimensionDescription(tier) {

    let description = shortenDimensions(player.dimAmount[tier - 1]) + ' (' + player.dimBought[tier - 1] + ')';

    description += '  (+' + formatValue(player.options.notation, getDimensionRateOfChange(tier), 2, 2) + '%/s)';

    return description;
}

function getDimensionRateOfChange(tier) {

    let toGain = getDimensionProductionPerSecond(tier + 1)

    var name = TIER_NAMES[tier];
    if (player.currentChallenge == "challenge7") {
        toGain = getDimensionProductionPerSecond(tier + 2);
    }
    var current = player.dimAmount[tier - 1].max(1);
    var change  = toGain.times(10).dividedBy(current);

    return change;
}

function getETA(cost) {
    var a = 100;
    if (player.money.gte(cost)) return 0
    while (ETACalc(a).lt(cost)) {
        a *= 10;
        if (a > 1e20) return Infinity;
    }
    var b = a / 10;
    var q = ETACalc((a+b)/2);
    while (q.gt(cost.times(1.0001)) || q.lt(cost.dividedBy(1.0001))) {
        console.log("q = "+q)
        console.log("a = "+a)
        console.log("b = "+b)
        if (q.lt(cost)) a = (a+b)/2;
        else b = (a+b)/2;
        q = ETACalc((a+b)/2);
    }
    return (a+b)/2;
}

function ETACalc(t) {
    var value = player.money.plus(getDimensionProductionPerSecond(1).times(t));
    var div = 1;
    for (let tier = 2; tier <= 8; ++tier) {
        var name = TIER_NAMES[tier-1]
        div *= tier;
        value = value.plus(getDimensionProductionPerSecond(tier).times(getDimensionProductionPerSecond(tier-1)).times(Decimal.pow(t,tier)).dividedBy(Decimal.max(player[name+"Amount"].times(div).times(10), 1))) ;
    }
    return value
}



var worstChallengeTime = 1

function updateWorstChallengeTime() {
    worstChallengeTime = 1
    for (var i=0; i<10; i++) {
        if (player.challengeTimes[i] > worstChallengeTime) worstChallengeTime = player.challengeTimes[i]
    }
}

function extraStartingDimsAvailable () {
  return (player.currentChallenge === '') || player.infinityUpgrades.includes('fourthChallenge');
}


function getCurrentDimension () {
  let extra = extraStartingDimsAvailable() ?
    player.extra_starting_dimensions : 0;
  return player.shiftResets + extra + 4;
}

function getCurrentMaxDimension () {
  if (player.challenge === 'challenge-8') {
    return 8;
  } else if (player.challenge === 'challenge-bigcrunch') {
    return 16;
  } else if (player.challenge === 'challenge-12') {
    return 10;
  } else {
    return 12;
  }
}

function getNumForReset () {
  return 20;
}

function getCurrentBoostDimension () {
  return 8;
}

function getResetDimInfo (type, bulk) {
  if (!bulk) {
    bulk = 0;
  }

  var reset_num = getNumForReset();

  if (type === 'shift') {
    return {
      'num': reset_num,
      'dimNum': getCurrentDimension() + bulk
    };
  } else if (type === 'boost') {
    return {
      'num': (player.boostResets + bulk + 1) * reset_num,
      'dimNum': getCurrentBoostDimension()
    };
  }
}

function totalResets () {
  return player.shiftResets + player.boostResets;
}

function setShiftAndBoostDisplay () {
  var shiftRequirement = getResetDimInfo('shift');
  var boostRequirement = getResetDimInfo('boost');
  if (isNaN(shiftRequirement.dimNum) || isNaN(boostRequirement.dimNum)) {
    throw new Error('Shift or boost is broken!');
  }

  if (player.dimAmount[shiftRequirement.dimNum - 1].gte(shiftRequirement.num)) {
    document.getElementById("softResetShift").className = 'storebtn';
  } else {
    document.getElementById("softResetShift").className = 'unavailablebtn';
  }
  if (dimBoostsApplicable() &&
  player.dimAmount[boostRequirement.dimNum - 1].gte(boostRequirement.num)) {
    document.getElementById("softResetBoost").className = 'storebtn';
  } else {
    document.getElementById("softResetBoost").className = 'unavailablebtn';
  }
}

function dimBoostsApplicable () {
  return player.currentChallenge === 'challenge-8';
}

function doResetDisplayStuff () {
  if (getCurrentDimension() < getCurrentMaxDimension()) {
    document.getElementById("dimShift").style.display = 'inline';
    let info = getResetDimInfo('shift');
    document.getElementById("softResetShift").innerHTML = "Reset the game for a new Dimension";
    document.getElementById("resetLabelShift").innerHTML = 'Dimension Shift: requires ' +
    info.num + " " + getDimName(info.dimNum) + " Dimensions";
  } else {
    document.getElementById("dimShift").style.display = 'none';
  }
  if (dimBoostsApplicable()) {
    document.getElementById("dimBoost").style.display = 'inline';
    let info = getResetDimInfo('boost');
    document.getElementById("softResetBoost").innerHTML = "Reset the game for a Boost";
    document.getElementById("resetLabelBoost").innerHTML = 'Dimension Boost: requires ' +
    info.num + " " + getDimName(info.dimNum) + " Dimensions";
  } else {
    document.getElementById("dimBoost").style.display = 'none';
  }
}

function updateDimensions() {
    for (let tier = 1; tier <= MAX_DIMENSION; ++tier) {
        var name = TIER_NAMES[tier];
        if (!canBuyDimension(tier)) {
            break;
        }
        document.getElementById(name + "D").innerHTML = DISPLAY_NAMES[tier] + " Dimension x" + formatValue(player.options.notation, getDimensionFinalMultiplier(tier), 1, 1);
        document.getElementById(name + "Amount").innerHTML = getDimensionDescription(tier);
    }


    for (let tier = 1; tier <= MAX_DIMENSION; ++tier) {
        var name = TIER_NAMES[tier];
        if (!canBuyDimension(tier)) {
            break;
        }

        var elem = document.getElementById(name + "Row");

        elem.style.display = "table-row";
        elem.style.visibility = "visible";


    }

    if (canBuyTickSpeed()) {
        var tickmult = getTickSpeedMultiplier()
        var places = 0
        if (tickmult < 0.2) places = Math.floor(Math.log10(Math.round(1/tickmult)))
        document.getElementById("tickLabel").innerHTML = 'Reduce the tick interval by ' + ((1 - tickmult) * 100).toFixed(places) + '%.';

        document.getElementById("tickSpeed").style.visibility = "visible";
        document.getElementById("tickSpeedMax").style.visibility = "visible";
        document.getElementById("tickLabel").style.visibility = "visible";
        document.getElementById("tickSpeedAmount").style.visibility = "visible";
    }

    doResetDisplayStuff();

    document.getElementById("totalmoney").innerHTML = 'You have made a total of ' + shortenMoney(player.totalmoney) + ' antimatter.';
    document.getElementById("totalresets").innerHTML = 'You have done ' + totalResets() + ' soft resets.';
    document.getElementById("totalTime").innerHTML = "You have played for " + timeDisplay(player.totalTimePlayed) + ".";

    if (player.bestInfinityTime == 9999999999) {
        document.getElementById("bestInfinity").innerHTML = ""
        document.getElementById("infinitied").innerHTML = ""
        document.getElementById("thisInfinity").innerHTML = ""
    } else {
        document.getElementById("bestInfinity").innerHTML = "Your fastest Infinity is in " + timeDisplay(player.bestInfinityTime) + "."
        document.getElementById("thisInfinity").innerHTML = "You have spent " + timeDisplay(player.thisInfinityTime) + " in this Infinity."
        if (player.infinityPoints.equals(1)) {
            document.getElementById("infinityPoints1").innerHTML = "You have 1 Infinity point."
            document.getElementById("infinityPoints2").innerHTML = "You have 1 Infinity point."
        }
        else {
            document.getElementById("infinityPoints1").innerHTML = "You have <span class=\"IPAmount1\">"+shortenDimensions(player.infinityPoints)+"</span> Infinity points."
            document.getElementById("infinityPoints2").innerHTML = "You have <span class=\"IPAmount2\">"+shortenDimensions(player.infinityPoints)+"</span> Infinity points."
        }
        if (player.infinitied == 1) document.getElementById("infinitied").innerHTML = "You have infinitied 1 time."
        else document.getElementById("infinitied").innerHTML = "You have infinitied " + player.infinitied + " times."

    }

    if (player.eternities == 0) {
        document.getElementById("eternitied").innerHTML = ""
        document.getElementById("besteternity").innerHTML = ""
        document.getElementById("thiseternity").innerHTML = ""
    } else {
        document.getElementById("eternitied").innerHTML = "You have Eternitied "+player.eternities+" times."
        document.getElementById("besteternity").innerHTML = "You have spent "+timeDisplay(player.thisEternity)+" in this Eternity"
        document.getElementById("thiseternity").innerHTML = "Your fastest Eternity is in "+timeDisplay(player.bestEternity)+"."
    }

    infiWrite();

    document.getElementById("32").innerHTML = "You gain x"+Math.max(totalResets(), 1)+" more infinitied stat (based on soft resets)<p>Cost: 2 Time Theorems"

    document.getElementById("eter1").innerHTML = "Infinity Dimensions multiplier based on unspent EP (x+1)^3<br>Currently: "+shortenMoney(player.eternityPoints.plus(1).pow(3))+"x<br>Cost: 5 EP"
    document.getElementById("eter2").innerHTML = "Infinity Dimension multiplier based on eternities (x^log4(2x))<br>Currently: "+shortenMoney(Decimal.pow(player.eternities, Math.log(player.eternities*2)/Math.log(4)))+"x<br>Cost: 10 EP"
    document.getElementById("eter3").innerHTML = "Infinity Dimensions multiplier based on sum of Infinity Challenge times<br>Currently: "+shortenMoney(Decimal.pow(2,300/Math.max(infchallengeTimes, 7.5)))+"x<br>Cost: "+shortenCosts(50e3)+" EP"

    document.getElementById("82").innerHTML = "Dimension shifts affect Infinity Dimensions <span>Currently "+shortenMoney(Decimal.pow(1.0000109, Decimal.pow(totalResets(), 2)))+"x<span>Cost: 6 Time Theorems"
    document.getElementById("91").innerHTML = "Normal dimensions gain a multiplier based on time spent this eternity<span>Currently: "+shortenMoney(Decimal.pow(10, Math.min(player.thisEternity, 18000)/60))+"x<span>Cost: 4 Time Theorems"
    document.getElementById("92").innerHTML = "Infinity dimensions gain a multiplier based on fastest eternity time<span>Currently: "+shortenMoney(Decimal.pow(2, 600/Math.max(player.bestEternity, 20)))+"x<span>Cost: 5 Time Theorems"

    document.getElementById("93").innerHTML = "Time dimensions gain a multiplier based on tick upgrades gained<span>Currently: "+shortenMoney(Decimal.pow(player.totalTickGained, 0.25))+"x<span>Cost: 7 Time Theorems"
    document.getElementById("121").innerHTML = "The worse your average EP/min is, the more EP you get.<span>Currently: "+((253 - averageEp.dividedBy(player.epmult).dividedBy(10).min(248).max(3))/5).toFixed(1)+"x<span>Cost: 9 Time Theorems"
    document.getElementById("123").innerHTML = "You gain more EP based on time spent this eternity.<span>Currently: "+Math.sqrt(1.39*player.thisEternity/10).toFixed(1)+"x<span>Cost: 9 Time Theorems"
    document.getElementById("141").innerHTML = "Multiplier to IP, decaying over this infinity<span>Currently "+shortenMoney(new Decimal(1e45).dividedBy(Decimal.pow(15, Math.log(player.thisInfinityTime)*Math.pow(player.thisInfinityTime, 0.125))).max(1))+"x<span>Cost: 4 Time Theorems"
    document.getElementById("143").innerHTML = "Multiplier to IP, increasing over this infinity<span>Currently "+shortenMoney(Decimal.pow(15, Math.log(player.thisInfinityTime)*Math.pow(player.thisInfinityTime, 0.125)))+"x<span>Cost: 4 Time Theorems"
}

function updateCosts() {
  for (var i = 1; i <= 16; i++) {
    document.getElementById(getDimName(i).toLowerCase()).innerHTML = 'Cost: ' + shortenCosts(getTierCost(i, 1));
  }

  for (var i = 1; i <= 16; i++) {
    document.getElementById(getDimName(i).toLowerCase() + 'Max').innerHTML = 'Cost: ' + shortenCosts(getTierCost(i, getNumRemaining(i)));
  }

  document.getElementById("tickSpeed").innerHTML = 'Cost: ' + shortenCosts(player.tickSpeedCost);

  for (var i=1; i<=8; i++) {

      document.getElementById("infMax"+i).innerHTML = "Cost: " + shortenCosts(player["infinityDimension"+i].cost) + " IP"
  }

  for (var i=1; i<=4; i++) {

      document.getElementById("timeMax"+i).innerHTML = "Cost: " + shortenCosts(player["timeDimension"+i].cost) + " EP"
  }
}

function updateTickSpeed() {
    var exp = player.tickspeed.e;
    if (exp > 1) document.getElementById("tickSpeedAmount").innerHTML = 'Tickspeed: ' + player.tickspeed.toFixed(0);
    else {
        document.getElementById("tickSpeedAmount").innerHTML = 'Tickspeed: ' + player.tickspeed.times(new Decimal(100).dividedBy(Decimal.pow(10, exp))).toFixed(0) + ' / ' + shorten(new Decimal(100).dividedBy(Decimal.pow(10, exp)));
    }
    if (player.tickspeed.lt(1e-26)) giveAchievement("Faster than a potato");
    if (player.tickspeed.lt(1e-52)) giveAchievement("Faster than a squared potato");
}


function updateChallenges() {
    try {
        var buttons = Array.from(document.getElementsByClassName('onchallengebtn'))
        for (var i=0; i < buttons.length; i++) {
            buttons[i].className = "challengesbtn";
            buttons[i].innerHTML = "Start"
        }

        var buttonss = Array.from(document.getElementsByClassName('completedchallengesbtn'))
        for (var i=0; i < buttonss.length; i++) {
            buttonss[i].className = "challengesbtn";
            buttonss[i].innerHTML = "Start"
        }


        for (var i=0; i < player.challenges.length; i++) {
            document.getElementById(player.challenges[i]).className = "completedchallengesbtn";
            document.getElementById(player.challenges[i]).innerHTML = "Completed"
        }

        if (player.currentChallenge != "") {
            document.getElementById(player.currentChallenge).className = "onchallengebtn"
            document.getElementById(player.currentChallenge).innerHTML = "Running"
        }



    } catch (err) {
        updateChallenges()
    }




}


//infinity dimensions


function DimensionDescription(tier) {
    var name = TIER_NAMES[tier];

    let description = shortenDimensions(player['infinityDimension'+tier].amount) + ' (' + player['infinityDimension'+tier].bought + ')';

    if (tier < 8) {
        description += '  (+' + formatValue(player.options.notation, DimensionRateOfChange(tier), 2, 2) + '%/s)';
    }

    return description;
}


function DimensionRateOfChange(tier) {
    let toGain = DimensionProduction(tier+1)
    var current = Decimal.max(player["infinityDimension"+tier].amount, 1);
    var change  = toGain.times(10).dividedBy(current);
    return change;
}




function updateInfinityDimensions() {
    for (let tier = 1; tier <= 8; ++tier) {
        document.getElementById("infD"+tier).innerHTML = DISPLAY_NAMES[tier] + " Infinity Dimension x" + shortenDimensions(DimensionPower(tier));
        document.getElementById("infAmount"+tier).innerHTML = DimensionDescription(tier);
        var name = TIER_NAMES[tier];
        if (!player.infDimensionsUnlocked[tier-1]) {
            break;
        }

        document.getElementById("infRow"+tier).style.display = "table-row";
        document.getElementById("infRow"+tier).style.visibility = "visible";
    }
}

function DimensionProduction(tier) {
    var dim = player["infinityDimension"+tier]
    if (player.challenges.includes("postc6")) return dim.amount.times(DimensionPower(tier)).dividedBy(player.tickspeed.dividedBy(1000).pow(0.0005))
    else return dim.amount.times(DimensionPower(tier))
}

function DimensionPower(tier) {
    var dim = player["infinityDimension"+tier]
    var mult = dim.power.times(infDimPow)
    if (player.achievements.includes("r94") && tier == 1) mult = mult.times(2);

    if (player.timestudy.studies.includes(82)) {
        mult = mult.times(Decimal.pow(1.0000109,Math.pow(totalResets(), 2)))
    }

    if (player.eternityUpgrades.includes(1)) {
        mult = mult.times(player.eternityPoints.plus(1).pow(3))
    }

    if (player.eternityUpgrades.includes(2)) mult = mult.times(Decimal.pow(player.eternities, Math.log(player.eternities*2+1)/Math.log(4)))

    if (player.eternityUpgrades.includes(3)) mult = mult.times(Decimal.pow(2,300/Math.max(infchallengeTimes, 7.5)))

    if (player.timestudy.studies.includes(92)) mult = mult.times(Decimal.pow(2, 600/Math.max(player.bestEternity, 20)))
    if (player.timestudy.studies.includes(162)) mult = mult.times(1e11)

    return mult
}




function resetInfDimensions() {

    if (player.infDimensionsUnlocked[0]) {
        player.infinityPower = new Decimal(0)
    }
    if (player.infDimensionsUnlocked[7] && player.infinityDimension6.amount != 0){
        player.infinityDimension7.amount = new Decimal(player.infinityDimension7.baseAmount)
        player.infinityDimension6.amount = new Decimal(player.infinityDimension6.baseAmount)
        player.infinityDimension5.amount = new Decimal(player.infinityDimension5.baseAmount)
        player.infinityDimension4.amount = new Decimal(player.infinityDimension4.baseAmount)
        player.infinityDimension3.amount = new Decimal(player.infinityDimension3.baseAmount)
        player.infinityDimension2.amount = new Decimal(player.infinityDimension2.baseAmount)
        player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
    }
    if (player.infDimensionsUnlocked[6] && player.infinityDimension6.amount != 0){
        player.infinityDimension6.amount = new Decimal(player.infinityDimension6.baseAmount)
        player.infinityDimension5.amount = new Decimal(player.infinityDimension5.baseAmount)
        player.infinityDimension4.amount = new Decimal(player.infinityDimension4.baseAmount)
        player.infinityDimension3.amount = new Decimal(player.infinityDimension3.baseAmount)
        player.infinityDimension2.amount = new Decimal(player.infinityDimension2.baseAmount)
        player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
    }
    if (player.infDimensionsUnlocked[5] && player.infinityDimension6.amount != 0){
        player.infinityDimension5.amount = new Decimal(player.infinityDimension5.baseAmount)
        player.infinityDimension4.amount = new Decimal(player.infinityDimension4.baseAmount)
        player.infinityDimension3.amount = new Decimal(player.infinityDimension3.baseAmount)
        player.infinityDimension2.amount = new Decimal(player.infinityDimension2.baseAmount)
        player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
    }
    if (player.infDimensionsUnlocked[4] && player.infinityDimension5.amount != 0){
        player.infinityDimension4.amount = new Decimal(player.infinityDimension4.baseAmount)
        player.infinityDimension3.amount = new Decimal(player.infinityDimension3.baseAmount)
        player.infinityDimension2.amount = new Decimal(player.infinityDimension2.baseAmount)
        player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
    }
    if (player.infDimensionsUnlocked[3] && player.infinityDimension4.amount != 0){
        player.infinityDimension3.amount = new Decimal(player.infinityDimension3.baseAmount)
        player.infinityDimension2.amount = new Decimal(player.infinityDimension2.baseAmount)
        player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
    }
    else if (player.infDimensionsUnlocked[2] && player.infinityDimension3.amount != 0){
        player.infinityDimension2.amount = new Decimal(player.infinityDimension2.baseAmount)
        player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
    }
    else if (player.infDimensionsUnlocked[1] && player.infinityDimension2.amount != 0){
        player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
    }

}


var infCostMults = [null, 1e3, 1e6, 1e8, 1e10, 1e15, 1e20, 1e25, 1e30]
var infPowerMults = [null, 50, 30, 10, 5, 5, 5, 5, 5]
function buyManyInfinityDimension(tier) {

    var dim = player["infinityDimension"+tier]
    if (player.infinityPoints.lt(dim.cost)) return false
    if (!player.infDimensionsUnlocked[tier-1]) return false

    player.infinityPoints = player.infinityPoints.minus(dim.cost)
    dim.amount = dim.amount.plus(10);
    dim.cost = Decimal.round(dim.cost.times(infCostMults[tier]))
    dim.power = dim.power.times(infPowerMults[tier])
    dim.baseAmount += 10


}

function buyMaxInfDims(tier) {
    var dim = player["infinityDimension"+tier]

    if (player.infinityPoints.lt(dim.cost)) return false
    if (!player.infDimensionsUnlocked[tier-1]) return false

    var toBuy = Math.ceil((player.infinityPoints.e - dim.cost.e) / Math.log10(infCostMults[tier]))
    dim.cost = dim.cost.times(Decimal.pow(infCostMults[tier], toBuy-1))
    player.infinityPoints = player.infinityPoints.minus(dim.cost)
    dim.cost = dim.cost.times(infCostMults[tier])
    dim.amount = dim.amount.plus(10*toBuy);
    dim.power = dim.power.times(Decimal.pow(infPowerMults[tier], toBuy))
    dim.baseAmount += 10*toBuy
}

function switchAutoInf(tier) {
    if (player.infDimBuyers[tier-1]) {
        player.infDimBuyers[tier-1] = false
        document.getElementById("infauto"+tier).innerHTML = "Auto: OFF"
    } else {
        player.infDimBuyers[tier-1] = true
        document.getElementById("infauto"+tier).innerHTML = "Auto: ON"
    }
}

function toggleAllInfDims() {
    if (player.infDimBuyers[0]) {
        for (var i=1; i<9; i++) {
            player.infDimBuyers[i-1] = false
            document.getElementById("infauto"+i).innerHTML = "Auto: OFF"
        }
    } else {
        for (var i=1; i<9; i++) {
            if (player.eternities - 10>=i) {
                player.infDimBuyers[i-1] = true
                document.getElementById("infauto"+i).innerHTML = "Auto: ON"
            }
        }
    }
}

function loadInfAutoBuyers() {
    for (var i=1; i<9; i++) {
        if (player.infDimBuyers[i-1]) document.getElementById("infauto"+i).innerHTML = "Auto: ON"
        else document.getElementById("infauto"+i).innerHTML = "Auto: OFF"
    }
}



var infDimPow = 1


//time dimensions

function getTimeDimensionPower(tier) {
    var dim = player["timeDimension"+tier]
    var ret = new Decimal(dim.power)

    if (player.timestudy.studies.includes(11) && tier == 1) ret = ret.dividedBy(player.tickspeed.dividedBy(1000).pow(0.005).times(0.95).plus(player.tickspeed.dividedBy(1000).pow(0.0003).times(0.05)))
    if (player.timestudy.studies.includes(93)) ret = ret.times(Decimal.pow(player.totalTickGained, 0.25).max(1))
    if (player.timestudy.studies.includes(151)) ret = ret.times(1e4)
    //if (player.achievements.includes("r103")) ret = ret.times(Decimal.pow(player.totalTickGained,0.02).max(1))
    if (player.achievements.includes("r105")) ret = ret.div(player.tickspeed.div(1000).pow(0.000005))

    return ret

}


function getTimeDimensionProduction(tier) {
    var dim = player["timeDimension"+tier]
    var ret = dim.amount.times(dim.power)
    ret = ret.times(getTimeDimensionPower(tier))
    return ret
}


function getTimeDimensionRateOfChange(tier) {
    let toGain = getTimeDimensionProduction(tier+1)
    var current = Decimal.max(player["timeDimension"+tier].amount, 1);
    var change  = toGain.times(10).dividedBy(current);
    return change;
}

function getTimeDimensionDescription(tier) {
    var name = TIER_NAMES[tier];

    let description = shortenDimensions(player['timeDimension'+tier].amount);

    if (tier < 4) {
        description += '  (+' + formatValue(player.options.notation, getTimeDimensionRateOfChange(tier), 2, 2) + '%/s)';
    }

    return description;
}

function updateTimeDimensions() {
    for (let tier = 1; tier <= 4; ++tier) {
        document.getElementById("timeD"+tier).innerHTML = DISPLAY_NAMES[tier] + " Dimension x" + shortenMoney(getTimeDimensionPower(tier));
        document.getElementById("timeAmount"+tier).innerHTML = getTimeDimensionDescription(tier);
    }
}

var timeDimCostMults = [null, 3, 9, 27, 81]
function buyTimeDimension(tier) {

    var dim = player["timeDimension"+tier]
    if (player.eternityPoints.lt(dim.cost)) return false

    player.eternityPoints = player.eternityPoints.minus(dim.cost)
    dim.amount = dim.amount.plus(1);
    dim.bought += 1
    dim.cost *= timeDimCostMults[tier]
    dim.power *= 2
    updateEternityUpgrades()

}

function resetTimeDimensions() {
    for (var i=1; i<5; i++) {
        var dim = player["timeDimension"+i]
        dim.amount = new Decimal(dim.bought)
    }

}


// Time studies

function buyWithAntimatter() {
    if (player.money.gte(player.timestudy.amcost)) {
        player.money = player.money.minus(player.timestudy.amcost)
        player.timestudy.amcost = player.timestudy.amcost.times(new Decimal("1e20000"))
        player.timestudy.theorem += 1
        updateTheoremButtons()
        updateTimeStudyButtons()
    }
}

function buyWithIP() {
    if (player.infinityPoints.gte(player.timestudy.ipcost)) {
        player.infinityPoints = player.infinityPoints.minus(player.timestudy.ipcost)
        player.timestudy.ipcost = player.timestudy.ipcost.times(1e100)
        player.timestudy.theorem += 1
        updateTheoremButtons()
        updateTimeStudyButtons()
    }
}

function buyWithEP() {
    if (player.eternityPoints.gte(player.timestudy.epcost)) {
        player.eternityPoints = player.eternityPoints.minus(player.timestudy.epcost)
        player.timestudy.epcost = player.timestudy.epcost.times(2)
        player.timestudy.theorem += 1
        updateTheoremButtons()
        updateTimeStudyButtons()
        updateEternityUpgrades()
    }
}

function updateTheoremButtons() {
    document.getElementById("theoremam").className = player.money.gte(player.timestudy.amcost) ? "timetheorembtn" : "timetheorembtnlocked"
    document.getElementById("theoremip").className = player.infinityPoints.gte(player.timestudy.ipcost) ? "timetheorembtn" : "timetheorembtnlocked"
    document.getElementById("theoremep").className = player.eternityPoints.gte(player.timestudy.epcost) ? "timetheorembtn" : "timetheorembtnlocked"
    document.getElementById("theoremep").innerHTML = "Buy Time Theorems <br>Cost: "+shortenDimensions(player.timestudy.epcost)+" EP"
    document.getElementById("theoremip").innerHTML = "Buy Time Theorems <br>Cost: "+shortenCosts(player.timestudy.ipcost)+" IP"
    document.getElementById("theoremam").innerHTML = "Buy Time Theorems <br>Cost: "+shortenCosts(player.timestudy.amcost)
    document.getElementById("timetheorems").innerHTML = "You have <span style='display:inline' class=\"TheoremAmount\">"+player.timestudy.theorem+"</span> Time "+ (player.timestudy.theorem == 1 ? "Theorem." : "Theorems.")
}

function buyTimeStudy(name, cost) {
    if (player.timestudy.theorem >= cost && canBuyStudy(name) && !player.timestudy.studies.includes(name)) {
        player.timestudy.studies.push(name)
        player.timestudy.theorem -= cost
        if (name == 71 || name == 81 || name == 91 || name == 101) {
            document.getElementById(""+name).className = "timestudybought normaldimstudy"
        } else if (name == 72 || name == 82 || name == 92 || name == 102) {
            document.getElementById(""+name).className = "timestudybought infdimstudy"
        } else if (name == 73 || name == 83 || name == 93 || name == 103) {
            document.getElementById(""+name).className = "timestudybought timedimstudy"
        } else if (name == 121 || name == 131 || name == 141) {
            document.getElementById(""+name).className = "timestudybought activestudy"
        } else if (name == 122 || name == 132 || name == 142) {
            document.getElementById(""+name).className = "timestudybought passivestudy"
        } else if (name == 123 || name == 133 || name == 143) {
            document.getElementById(""+name).className = "timestudybought idlestudy"
        } else {
            document.getElementById(""+name).className = "timestudybought"
        }
        updateTheoremButtons()
        updateTimeStudyButtons()
        drawStudyTree()
    }
}

function hasRow(row) {
    for (var i=0; i<player.timestudy.studies.length; i++) {
        if (Math.floor(player.timestudy.studies[i]/10) == row) return true
    }
}

function canBuyStudy(name) {
    var row = Math.floor(name/10)
    var col = name%10

    switch(row) {

        case 1: return true
        break;

        case 2:
        case 5:
        case 6:
        case 11:
        case 15:
        case 16:
        case 17:
        if (hasRow(row-1)) return true; else return false
        break;

        case 3:
        case 4:
        case 8:
        case 9:
        case 10:
        case 13:
        case 14:
        if (player.timestudy.studies.includes((row-1)*10 + col)) return true; else return false
        break;

        case 7:
        case 12:
        if (hasRow(row-1) && !hasRow(row)) return true; else return false
        break;

    }
}
var all =      [11, 21, 22, 31, 32, 41, 42, 51, 61, 71, 72, 73, 81, 82 ,83, 91, 92, 93, 101, 102, 103, 111, 121, 122, 123, 131, 132, 133, 141, 142, 143, 151, 161, 162, 171]
var studyCosts = [1, 3, 2, 3, 2, 4, 6, 3, 3, 4, 6, 5, 4, 6, 5, 4, 5, 7, 4, 6, 6, 12, 9, 9, 9, 5, 5, 5, 4, 4, 4, 8, 7, 7, 15]
function updateTimeStudyButtons() {
    for (var i=0; i<all.length; i++) {
        if (!player.timestudy.studies.includes(all[i])) {
            if (canBuyStudy(all[i]) && studyCosts[i]<=player.timestudy.theorem) {
                if (all[i] == 71 || all[i] == 81 || all[i] == 91 || all[i] == 101) {
                    document.getElementById(all[i]).className = "timestudy normaldimstudy"
                } else if (all[i] == 72 || all[i] == 82 || all[i] == 92 || all[i] == 102) {
                    document.getElementById(all[i]).className = "timestudy infdimstudy"
                } else if (all[i] == 73 || all[i] == 83 || all[i] == 93 || all[i] == 103) {
                    document.getElementById(all[i]).className = "timestudy timedimstudy"
                }  else if (all[i] == 121 || all[i] == 131 || all[i] == 141) {
                    document.getElementById(all[i]).className = "timestudy activestudy"
                }  else if (all[i] == 122 || all[i] == 132 || all[i] == 142) {
                    document.getElementById(all[i]).className = "timestudy passivestudy"
                }  else if (all[i] == 123 || all[i] == 133 || all[i] == 143) {
                    document.getElementById(all[i]).className = "timestudy idlestudy"
                } else {
                    document.getElementById(all[i]).className = "timestudy"
                }
            }
            else {
                if (all[i] == 71 || all[i] == 81 || all[i] == 91 || all[i] == 101) {
                    document.getElementById(all[i]).className = "timestudylocked normaldimstudylocked"
                } else if (all[i] == 72 || all[i] == 82 || all[i] == 92 || all[i] == 102) {
                    document.getElementById(all[i]).className = "timestudylocked infdimstudylocked"
                } else if (all[i] == 73 || all[i] == 83 || all[i] == 93 || all[i] == 103) {
                    document.getElementById(all[i]).className = "timestudylocked timedimstudylocked"
                }  else if (all[i] == 121 || all[i] == 131 || all[i] == 141) {
                    document.getElementById(all[i]).className = "timestudylocked activestudylocked"
                }  else if (all[i] == 122 || all[i] == 132 || all[i] == 142) {
                    document.getElementById(all[i]).className = "timestudylocked passivestudylocked"
                }  else if (all[i] == 123 || all[i] == 133 || all[i] == 143) {
                    document.getElementById(all[i]).className = "timestudylocked idlestudylocked"
                } else {
                    document.getElementById(all[i]).className = "timestudylocked"
                }
            }
        }
    }
}

function respecTimeStudies() {
    for (var i=0; i<all.length; i++) {
        if (player.timestudy.studies.includes(all[i])) {
            player.timestudy.theorem += studyCosts[i]
        }
    }
    player.timestudy.studies = []
    updateTimeStudyButtons()
    updateTheoremButtons()
    drawStudyTree()
}



function getDimensionBoostPower() {
    if (!player) {
      return 2;
    }

    if (player.currentChallenge === "challenge11" || player.currentChallenge === "postc1") {
      return 1;
    }

    var ret = 2
    if (player.infinityUpgrades.includes("resetMult")) {
      ret = 2.5;
    }
    if (player.challenges.includes("postc7")) {
      ret = 4;
    }

    if (player.currentChallenge === "postc7" || player.timestudy.studies.includes(81)) {
      ret = 10;
    }

    if (player.achievements.includes("r101")) {
      ret = ret*1.01;
    }

    if (player.timestudy.studies.includes(83)) {
      ret = Decimal.pow(1.0001, player.totalTickGained).times(ret);
    }

    return ret;
}





function softReset (bulk, type) {
    if (type === 'shift') {
      player.shiftResets += bulk;
    } else if (type === 'boost') {
      player.boostResets += bulk;
    } else if (type === 'none') {
      // Do nothing. We could get rid of this case,
      // but I think I found a legitimate use for an
      // empty else if clause.
    } else {
      throw new Error('Unhandled case!');
    }
    player = {
        money: new Decimal(10),
        tickSpeedCost: new Decimal(1000),
        tickspeed: new Decimal(1000),
        dimCosts: initialDimCosts(),
        dimBought: initialDimBought(),
        dimAmount: initialDimAmount(),
        dimPow: initialDimPow(totalResets(), player.extra_starting_dimensions),
        achievements: player.achievements,
        challenges: player.challenges,
        currentChallenge: player.currentChallenge,
        infinityUpgrades: player.infinityUpgrades,
        infinityPoints: player.infinityPoints,
        infinitied: player.infinitied,
        totalTimePlayed: player.totalTimePlayed,
        bestInfinityTime: player.bestInfinityTime,
        infTickspeedBoosts: player.infTickspeedBoosts,
        thisInfinityTime: player.thisInfinityTime,
        shiftResets: player.shiftResets,
        boostResets: player.boostResets,
        extra_starting_dimensions: player.extra_starting_dimensions,
        tickDecrease: player.tickDecrease,
        totalmoney: player.totalmoney,
        interval: null,
        lastUpdate: player.lastUpdate,
        achPow: player.achPow,
	      newsArray: player.newsArray,
        autobuyers: player.autobuyers,
        costMultipliers: initialDimCostMults(),
        tickspeedMultiplier: new Decimal(10),
        chall2Pow: player.chall2Pow,
        chall3Pow: new Decimal(0.01),
        matter: new Decimal(0),
        chall11Pow: 1,
        partInfinityPoint: player.partInfinityPoint,
        partInfinitied: player.partInfinitied,
        break: player.break,
        challengeTimes: player.challengeTimes,
        infchallengeTimes: player.infchallengeTimes,
        lastTenRuns: player.lastTenRuns,
        lastTenEternities: player.lastTenEternities,
        infMult: player.infMult,
        infMultCost: player.infMultCost,
        tickspeedBoostCost: player.tickspeedBoostCost,
        tickSpeedMultDecrease: player.tickSpeedMultDecrease,
        tickSpeedMultDecreaseCost: player.tickSpeedMultDecreaseCost,
        dimensionMultDecrease: player.dimensionMultDecrease,
        dimensionMultDecreaseCost: player.dimensionMultDecreaseCost,
        version: player.version,
        infDimensionsUnlocked: player.infDimensionsUnlocked,
        infinityPower: player.infinityPower,
        spreadingCancer: player.spreadingCancer,
        postChallUnlocked: player.postChallUnlocked,
        postC4Tier: 1,
        postC3Reward: new Decimal(1),
        infinityDimension1: player.infinityDimension1,
        infinityDimension2: player.infinityDimension2,
        infinityDimension3: player.infinityDimension3,
        infinityDimension4: player.infinityDimension4,
        infinityDimension5: player.infinityDimension5,
        infinityDimension6: player.infinityDimension6,
        infinityDimension7: player.infinityDimension7,
        infinityDimension8: player.infinityDimension8,
        infDimBuyers: player.infDimBuyers,
        timeShards: player.timeShards,
        tickThreshold: player.tickThreshold,
        timeDimension1: player.timeDimension1,
        timeDimension2: player.timeDimension2,
        timeDimension3: player.timeDimension3,
        timeDimension4: player.timeDimension4,
        eternityPoints: player.eternityPoints,
        eternities: player.eternities,
        thisEternity: player.thisEternity,
        bestEternity: player.bestEternity,
        eternityUpgrades: player.eternityUpgrades,
        epmult: player.epmult,
        epmultCost: player.epmultCost,
        totalTickGained: player.totalTickGained,
        offlineProd: player.offlineProd,
        offlineProdCost: player.offlineProdCost,
        challengeTarget: player.challengeTarget,
        timestudy: player.timestudy,
        autoIP: player.autoIP,
        autoTime: player.autoTime,
        infMultBuyer: player.infMultBuyer,
        autoCrunchMode: player.autoCrunchMode,
        respec: player.respec,
        eternityBuyer: player.eternityBuyer,
        options: player.options
    };
    if (player.currentChallenge == "challenge10" || player.currentChallenge == "postc1") {
        player.thirdCost = new Decimal(100)
        player.fourthCost = new Decimal(500)
        player.fifthCost = new Decimal(2500)
        player.sixthCost = new Decimal(2e4)
        player.seventhCost = new Decimal(2e5)
        player.eightCost = new Decimal(4e6)
    }
    if (player.currentChallenge == "postc1") player.costMultipliers = [new Decimal(1e3),new Decimal(5e3),new Decimal(1e4),new Decimal(1.2e4),new Decimal(1.8e4),new Decimal(2.6e4),new Decimal(3.2e4),new Decimal(4.2e4)];
    if (extraStartingDimsAvailable()) {
      player.extra_starting_dimensions = 0;
      for (let i = 5; i <= MAX_DIMENSION; i++) {
        if (player.infinityUpgrades.includes(i + 'dim')) {
          player.extra_starting_dimensions = i - 4;
        }
      }
    }


    if (player.achievements.includes("r36")) player.tickspeed = player.tickspeed.times(0.98);
    if (player.achievements.includes("r45")) player.tickspeed = player.tickspeed.times(0.98);
    if (player.achievements.includes("r66")) player.tickspeed = player.tickspeed.times(0.98);






    clearInterval(player.interval);
    //updateInterval();

    document.getElementById("tickSpeed").style.visibility = "hidden";
    document.getElementById("tickSpeedMax").style.visibility = "hidden";
    document.getElementById("tickLabel").style.visibility = "hidden";
    document.getElementById("tickSpeedAmount").style.visibility = "hidden";


    player.tickspeed = player.tickspeed.times(Decimal.pow(getTickSpeedMultiplier(), player.totalTickGained))
    if (hasAchievement("To infinity!")) player.money = new Decimal(100)
    if (player.achievements.includes("r37")) player.money = new Decimal(1000);
    if (player.achievements.includes("r54")) player.money = new Decimal(2e5);
    if (player.achievements.includes("r55")) player.money = new Decimal(1e10);
    if (player.achievements.includes("r78")) player.money = new Decimal(1e25);

    dimDisplay();
}

MoneyFormat = ['K', 'M', 'B', 'T', 'Qd', 'Qt', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 'UDc', 'DDc', 'TDc', 'QdDc', 'QtDc', 'SxDc', 'SpDc', 'ODc', 'NDc', 'Vg', 'UVg', 'DVg', 'TVg', 'QdVg', 'QtVg', 'SxVg', 'SpVg', 'OVg', 'NVg', 'Tg', 'UTg', 'DTg', 'TTg', 'QdTg', 'QtTg', 'SxTg', 'SpTg', 'OTg', 'NTg', 'Qa', 'UQa', 'DQa', 'TQa', 'QdQa', 'QtQa', 'SxQa', 'SpQa', 'OQa', 'NQa', 'Qi', 'UQi', 'DQi', 'TQi', 'QaQi', 'QtQi', 'SxQi', 'SpQi', 'OQi', 'NQi', 'Se', 'USe', 'DSe', 'TSe', 'QaSe', 'QtSe', 'SxSe', 'SpSe', 'OSe', 'NSe', 'St', 'USt', 'DSt', 'TSt', 'QaSt', 'QtSt', 'SxSt', 'SpSt', 'OSt', 'NSt', 'Og', 'UOg', 'DOg', 'TOg', 'QdOg', 'QtOg', 'SxOg', 'SpOg', 'OOg', 'NOg', 'Nn', 'UNn', 'DNn', 'TNn', 'QdNn', 'QtNn', 'SxNn', 'SpNn', 'ONn', 'NNn', 'Ce', 'UCe'];
MoneyFormat.reverse();

shorten = function (money) {
    return formatValue(player.options.notation, money, 2, 2);
};

shortenCosts = function (money) {
    return formatValue(player.options.notation, money, 0, 0);
};

shortenDimensions = function (money) {
    return formatValue(player.options.notation, money, 2, 0);
};

shortenMoney = function (money) {
    return formatValue(player.options.notation, money, 2, 1);
};

function canBuyTickSpeed() {
    return canBuyDimension(3);
}

function getPerTickspeedBoost () {
  let perBoost = .01;
  if (player.infinityUpgrades.includes('tickspeedBoostInc1')) {
    perBoost *= 2;
  }
  if (player.infinityUpgrades.includes('tickspeedBoostInc2')) {
    perBoost *= 2;
  }
  return perBoost;
}

function getTickSpeedMultiplier() {
  let baseMultiplier = 0.9;
  if (player.currentChallenge == "challenge6") baseMultiplier = 0.95;
  let perBoost = getPerTickspeedBoost();
  let linear = baseMultiplier - player.infTickspeedBoosts * perBoost;
  let exponential = baseMultiplier * Math.pow(1 - perBoost / 10, player.infTickspeedBoosts);
  return Math.max(linear, exponential);
}

function buyTickSpeed() {
    if (!canBuyTickSpeed()) {
        return false;
    }

    if (!canAfford(player.tickSpeedCost)) {
        return false;
    }

    player.money = player.money.minus(player.tickSpeedCost);
    multiplyCostsTier('tickspeed');
    // Not changing multipliers. Just not.
    if (player.currentChallenge == "challenge2" || player.currentChallenge == "postc1") player.chall2Pow = 0
    player.tickspeed = player.tickspeed.times(getTickSpeedMultiplier());
    postc8Mult = new Decimal(1)
    return true;
}

document.getElementById("tickSpeed").onclick = function () {
    buyTickSpeed();

    updateTickSpeed();
};

function buyMaxTickSpeed() {
    if (!canBuyTickSpeed()) return false
    var mult = getTickSpeedMultiplier()
    if (player.currentChallenge == "challenge2" || player.currentChallenge == "postc1") player.chall2Pow = 0
    if (player.currentChallenge == "challenge5" || player.currentChallenge == "postc5" || player.tickSpeedCost.lt(Number.MAX_VALUE) || player.tickSpeedMultDecrease !== 2) {
        while (player.money.gt(player.tickSpeedCost)) {
            player.money = player.money.minus(player.tickSpeedCost);
            multiplyCostsTier('tickspeed');
            player.tickspeed = player.tickspeed.times(mult);
            postc8Mult = new Decimal(1)
        }
    } else {

        var a = Math.log10(Math.sqrt(2))
        var b = player.tickspeedMultiplier.dividedBy(Math.sqrt(2)).log10()
        var c = player.tickSpeedCost.dividedBy(player.money).log10()
        var discriminant = Math.pow(b, 2) - (c *a* 4)
        if (discriminant < 0) return false
        var buying = Math.floor((Math.sqrt(Math.pow(b, 2) - (c *a *4))-b)/(2 * a))+1
        if (buying <= 0) return false
        player.tickspeed = player.tickspeed.times(Decimal.pow(mult, buying));
        for (var i = 0; i<buying-1; i++) {
            player.tickSpeedCost = player.tickSpeedCost.times(player.tickspeedMultiplier)
            player.tickspeedMultiplier = player.tickspeedMultiplier.times(2)
        }
        player.money = player.money.minus(player.tickSpeedCost)
        player.tickSpeedCost = player.tickSpeedCost.times(player.tickspeedMultiplier)
        player.tickspeedMultiplier = player.tickspeedMultiplier.times(2)
    }


}

function timeDisplay(time) {
    if (time <= 100) return (time/10).toFixed(2) + " seconds"
    time = Decimal.floor(time / 10)



    if (time >= 31536000) {
        return Decimal.floor(time / 31536000) + " years, " + Decimal.floor((time % 31536000) / 86400) + " days, " + Decimal.floor((time % 86400) / 3600) + " hours, " + Decimal.floor((time % 3600) / 60) + " minutes and " + Decimal.floor(time % 60) + " seconds"
    } else if (time >= 86400) {
        return Decimal.floor(time / 86400) + " days, " + Decimal.floor((time % 86400) / 3600) + " hours, " + Decimal.floor((time % 3600) / 60) + " minutes and " + Decimal.floor(time % 60) + " seconds"
    } else if (time >= 3600) {
        return Decimal.floor(time / 3600) + " hours, " + Decimal.floor((time % 3600) / 60) + " minutes and " + Decimal.floor(time % 60) + " seconds"
    } else if (time >= 60) {
        return Decimal.floor(time / 60) + " minutes and " + Decimal.floor(time % 60) + " seconds"
    } else return Decimal.floor(time % 60) + " seconds"
}

function preformat(int) {
    if (int.toString().length == 1) return "0"+int
    else return int
}

function timeDisplayShort(time) {
    if (time <= 600) return (time/10).toFixed(2) + " seconds"
    time = Decimal.floor(time / 10)
    return preformat(Decimal.floor((time) / 3600)) + ":" + preformat(Decimal.floor((time % 3600) / 60)) + ":" + preformat(Decimal.floor(time % 60))
}


// to retrieve by value: Object.keys(allAchievements).find(key => allAchievements[key] === "L4D: Left 4 Dimensions");

function clearOldAchieves(){
    var toRemove = [];
    var achieveKey;
    var values = Object.keys(allAchievements).map(function(e) { return allAchievements[e] });
    for (var i = 0; i < player.achievements.length; i++) {
      if (values.indexOf(player.achievements[i]) !== -1 ) {  // does index[i] exist in allAchievements as a value?
        toRemove.push(i); // mark it for removal
        achieveKey = Object.keys(allAchievements).find(function(key){ return allAchievements[key] === player.achievements[i];});
        if (!player.achievements.includes(achieveKey)) { // check if new key already exists as well
            player.achievements.push(achieveKey); // if not... add it
        }
      } else if (allAchievements[player.achievements[i]] === undefined){
        toRemove.push(i);
      }
    }


    toRemove.reverse();
    for (var i = 0; i < toRemove.length; i++) {
      player.achievements.splice(toRemove[i], 1);
    }
}

function giveAchievement(name) {

    if (player.achievements.includes(name)){ clearOldAchieves(); }

    if (player.achievements.includes(Object.keys(allAchievements).find(function(key){ return allAchievements[key] === name;}))) {
        return
    }

    $.notify(name, "success");
    player.achievements.push((Object.keys(allAchievements).find(key => allAchievements[key] === name)));
    document.getElementById(name).className = "achievementunlocked";
    if (name == "All your IP are belong to us" || name == "MAXIMUM OVERDRIVE") {
        player.infMult = player.infMult.times(4);
        player.autoIP = player.autoIP.times(4);
        if (player.autoCrunchMode == "amount") player.autobuyers[11].priority = player.autobuyers[11].priority.times(4);
    }
    updateAchPow();
}

var TIER_NAMES = [ null, "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth" ];
var DISPLAY_NAMES = [ null, "First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth", "Ninth", "Tenth", "Eleventh", "Twelfth" ];

function canAfford(cost) {
    return ((cost.lt(new Decimal("1.79e308")) && !player.break) || player.break) && cost.lte(player.money);
}

function multiplySameCosts(cost) {
    var tiers = [ null, "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth" ];
    var tierCosts = [ null, new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e6), new Decimal(1e8), new Decimal(1e10), new Decimal(1e12), new Decimal(1e15) ];

    for (let i = 1; i <= 8; ++i) {
        if (player.dimCosts[i - 1].e == cost.e) {
          player.dimCosts[i - 1] = player.dimCosts[i - 1].times(tierCosts[i])
        }

    }
    if (player.tickSpeedCost.e == cost.e) player.tickSpeedCost = player.tickSpeedCost.times(player.tickspeedMultiplier)
}


function canBuyDimension(tier) {
    if (tier > getCurrentDimension()) {
        return false;
    }

    if (tier > 1 && player.dimAmount[tier - 2] == 0) {
        return false;
    }

    return true;
}

function getDimensionPowerMultiplier(tier) {
    let dimMult = 2;


    if (player.currentChallenge == "challenge9" || player.currentChallenge == "postc1") dimMult = Math.pow(10/0.30,Math.random())*0.30

    if (player.infinityUpgrades.includes('multIncrease')) dimMult *= 1.1;
    if (player.achievements.includes("r58")) dimMult *= 1.01;

    return dimMult;
}


function clearDimensions(amount) {
	var tiers = [ null, "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth" ];

    for (i = 1; i <= amount; i++) {
        player[tiers[i] + "Amount"] = new Decimal(0)
    }
}


function getDimensionCostMultiplier(tier) {
	var multiplier2 = [new Decimal(1e3),new Decimal(5e3),new Decimal(1e4),new Decimal(1.2e4),new Decimal(1.8e4),new Decimal(2.6e4),new Decimal(3.2e4),new Decimal(4.2e4)];
    if (player.currentChallenge == "challenge10") return multiplier2[tier - 1];
    else return player.costMultipliers[tier - 1];
}



function onBuyDimension(tier, type) {
    if (type === 'one') {
      giveAchievement(dimAchievements[tier]);
    }

    player.postC4Tier = tier;
    postc8Mult = new Decimal(1);
}

var multiplyCostsTier = function (tier) {
  if (tier == 'tickspeed') {
    if (player.currentChallenge !== "challenge5") {
      player.tickSpeedCost = player.tickSpeedCost.times(player.tickspeedMultiplier);
    } else {
      multiplySameCosts(player.tickSpeedCost);
    }
  } else {
    if (player.currentChallenge !== "challenge5") {
      player.dimCosts[tier - 1] = player.dimCosts[tier - 1].times(
        getDimensionCostMultiplier(tier));
    } else {
      multiplySameCosts(player.dimCosts[tier - 1]);
    }
  }
}

function getTierCost(tier, n) {
  return player.dimCosts[tier - 1].times(n)
}

function getNumRemaining(tier) {
  return 10 - player.dimBought[tier - 1];
}

function buyOneDimension(tier) {
    var cost = getTierCost(tier, 1);
    auto = false;

    if (player.currentChallenge != "challenge10" && player.currentChallenge != "postc1") {
        if (!canBuyDimension(tier)) {
            return false;
        }
    } else {
        if (tier >= 3) {
            // We're buying with a dimension.
            if (!canBuyDimension(tier)) {
              return false;
            }
            if (player.dimAmount[tier - 3].lt(cost)) {
              return false;
            }
        }
        else if (!canBuyDimension(tier)) {
            return false;
        } else if (tier < 3 && !canAfford(cost)){
            return false;
        }
    }



    if (player.currentChallenge != "challenge10" && player.currentChallenge != "postc1") {
        if (!canAfford(cost)) {
            return false;
        }
    }


    if ((player.currentChallenge != "challenge10" && player.currentChallenge != "postc1") || tier < 3) {
        player.money = player.money.minus(cost);
    } else {
        // Buy with dimension two earlier.
        player.dimAmount[tier - 3] = player.dimAmount[tier - 3].minus(cost);
    }

    // Buy one.
    player.dimAmount[tier - 1] = player.dimAmount[tier - 1].plus(1);
    player.dimBought[tier - 1]++;

    if (player.dimBought[tier - 1] === 10) {
        player.dimBought[tier - 1] = 0;
        // Increase power.
        player.dimPow[tier - 1] = player.dimPow[tier - 1].times(getDimensionPowerMultiplier(tier));
        multiplyCostsTier(tier);
    }

    if (player.currentChallenge == "challenge2" || player.currentChallenge == "postc1") player.chall2Pow = 0;
    if (player.currentChallenge == "challenge8" || player.currentChallenge == "postc1") clearDimensions(tier-1);

    onBuyDimension(tier, 'one');

    return true;
}

function buyManyDimension(tier) {
    var cost = getTierCost(tier, getNumRemaining(tier));
    auto = false;

    if ((player.currentChallenge == "challenge12" || player.currentChallenge == "postc1" || player.currentChallenge == "postc6") && player.matter.equals(0)) player.matter = new Decimal(1);
    if (player.currentChallenge != "challenge10" && player.currentChallenge != "postc1") {
        if (!canBuyDimension(tier)) {
            return false;
        }
    } else {
      if (tier >= 3) {
          // We're buying with a dimension.
          if (!canBuyDimension(tier)) {
            return false;
          }
          if (player.dimAmount[tier - 3].lt(cost)) {
            return false;
          }
      }
      else if (!canBuyDimension(tier)) {
          return false;
      } else if (tier < 3 && !canAfford(cost)){
          return false;
      }
    }

    if (player.currentChallenge != "challenge10" && player.currentChallenge != "postc1") {
        if (!canAfford(cost)) {
            return false;
        }
    }

    if ((player.currentChallenge != "challenge10" && player.currentChallenge != "postc1") || tier < 3) {
        player.money = player.money.minus(cost);
    } else {
      // Buy with dimension two earlier.
      player.dimAmount[tier - 3] = player.dimAmount[tier - 3].minus(cost);
    }

    addAmount(tier, getNumRemaining(tier));
    player.dimBought[tier - 1]  = 0;
    player.dimPow[tier - 1] = player.dimPow[tier - 1].times(getDimensionPowerMultiplier(tier));
    multiplyCostsTier(tier);
    if (player.currentChallenge == "challenge2" || player.currentChallenge == "postc1") player.chall2Pow = 0;
    if (player.currentChallenge == "challenge8" || player.currentChallenge == "postc1") clearDimensions(tier-1);

    onBuyDimension(tier, 'many');

    return true;
}

function buyManyDimensionAutobuyer(tier, bulk) {

        var name = TIER_NAMES[tier];
        var cost = player.dimCosts[tier - 1].times(10 - player.dimBought[tier - 1])
        if (tier >= 3 && (player.currentChallenge == "challenge10" || player.currentChallenge == "postc1")) {
            if (!canBuyDimension(tier)) return false
            if (player.dimAmount[tier - 3].lt(cost)) return false
                if (canBuyDimension(tier)) {
                    if (cost.lt(player.dimAmount[tier - 3]) && player.dimBought[tier] != 0) {
                        player.dimAmount[tier - 3] = player.dimAmount[tier - 3].minus(cost)
                        player.dimAmount[tier - 1] = Decimal.round(player.dimAmount[tier - 1].plus(getNumRemaining(tier)))
                        player.dimPow[tier - 1] = player.dimPow[tier - 1].times(getDimensionPowerMultiplier(tier))
                        player.dimCosts[tier - 1] = player.dimCosts[tier - 1].times(getDimensionCostMultiplier(tier))
                        player.dimBought[tier - 1] = 0
                    }
                    var x = bulk
                    while (player.dimAmount[tier - 3].gt(player.dimCosts[tier - 1].times(10)) && x > 0) {
                        player.dimAmount[tier - 3] = player.dimAmount[tier - 3].minus(player.dimCosts[tier - 1].times(10));
                        player.dimCosts[tier - 1] = player.dimCosts[tier - 1].times(getDimensionCostMultiplier(tier));
                        player.dimAmount[tier - 1] = Decimal.round(player.dimAmount[tier - 1].plus(10));
                        player.dimPow[tier - 1] = player.dimPow[tier - 1].times(getDimensionPowerMultiplier(tier));
                    }


                    onBuyDimension(tier, 'auto');
                }
        } else {
        if (!canBuyDimension(tier)) return false
            if (cost.lt(player.money) && player.dimBought[tier - 1] != 0) {
                player.money = player.money.minus(cost)
                player.dimAmount[tier - 1] = Decimal.round(player.dimAmount[tier - 1].plus(getNumRemaining(tier)))
                player.dimPow[tier - 1] = player.dimPow[tier - 1].times(getDimensionPowerMultiplier(tier))
                player.dimCosts[tier - 1] = player.dimCosts[tier - 1].times(getDimensionCostMultiplier(tier))
                player.dimBought[tier - 1] = 0
            }
            if (player.money.lt(player.dimCosts[tier - 1].times(10))) return false
            var x = bulk

        if ((player.dimensionMultDecrease !== 3 || player.currentChallenge == "postc5" || player.currentChallenge == "challenge5")) {
            while (player.money.gte(player.dimCosts[tier - 1].times(10)) && x > 0) {
                    player.money = player.money.minus(player.dimCosts[tier - 1].times(10))
                    multiplyCostsTier(tier);
                    player.dimAmount[tier - 1] = Decimal.round(player.dimAmount[tier - 1].plus(10))
                    player.dimPow[tier - 1] = player.dimPow[tier - 1].times(getDimensionPowerMultiplier(tier))
                    if (player.currentChallenge == "challenge8") clearDimensions(tier-1)
                    x--;
            }
        } else {
            if (player.dimCosts[tier - 1].lt(Number.MAX_VALUE)) {
                while (player.money.gte(player.dimCosts[tier - 1].times(10)) && x > 0 && player.dimCosts[tier - 1].lte(Number.MAX_VALUE)) {
                    player.money = player.money.minus(player.dimCosts[tier - 1].times(10))
                    multiplyCostsTier(tier);
                    player.dimAmount[tier - 1] = Decimal.round(player.dimAmount[tier - 1].plus(10))
                    player.dimPow[tier - 1] = player.dimPow[tier - 1].times(getDimensionPowerMultiplier(tier))
                    if (player.currentChallenge == "challenge8") clearDimensions(tier-1)
                    x--;
            }
            }
            var a = Math.log10(Math.sqrt(player.dimensionMultDecrease))
            var b = player.costMultipliers[tier-1].dividedBy(Math.sqrt(player.dimensionMultDecrease)).log10()
            var c = player.dimCosts[tier - 1].dividedBy(player.money).log10()
            var discriminant = Math.pow(b, 2) - (c *a* 4)
            if (discriminant < 0) return false
            var buying = Math.floor((Math.sqrt(Math.pow(b, 2) - (c *a *4))-b)/(2 * a))+1
            if (buying <= 0) return false
            if (buying > bulk) buying = bulk
            player.dimAmount[tier - 1] = Decimal.round(player.dimAmount[tier - 1].plus(10*buying))
            player.dimPow[tier - 1] = player.dimPow[tier - 1].times(Decimal.pow(getDimensionPowerMultiplier(tier), buying))
            for (var i = 0; i<buying-1; i++) {
                player.dimCosts[tier - 1] = player.dimCosts[tier - 1].times(player.costMultipliers[tier-1])
                player.costMultipliers[tier-1] = player.costMultipliers[tier-1].times(player.dimensionMultDecrease)
            }
            player.money = player.money.minus(player.dimCosts[tier - 1])
            player.dimCosts[tier - 1] = player.dimCosts[tier - 1].times(player.costMultipliers[tier-1])
            player.costMultipliers[tier-1] = player.costMultipliers[tier-1].times(player.dimensionMultDecrease)
        }
        }
        if ((player.currentChallenge == "challenge12" || player.currentChallenge == "postc1" || player.currentChallenge == "postc6") && player.matter.equals(0)) player.matter = new Decimal(1);
        if (player.currentChallenge == "challenge2" || player.currentChallenge == "postc1") player.chall2Pow = 0;
        if (player.currentChallenge == "postc1") clearDimensions(tier-1);
        player.postC4Tier = tier;
}












function toggleChallengeRetry() {
    if (player.options.retryChallenge) {
        player.options.retryChallenge = false
        document.getElementById("retry").innerHTML = "Automatically retry challenges OFF"
    } else {
        player.options.retryChallenge = true
        document.getElementById("retry").innerHTML = "Automatically retry challenges ON"
    }
}

function glowText(id) {
  var text = document.getElementById(id);
  text.style.setProperty("-webkit-animation", "glow 1s");
  text.style.setProperty("animation", "glow 1s");
}

function canReset (type, bulk) {
  if (bulk === undefined || bulk === null) {
    let requirement = getResetDimInfo(type);
    return player.dimAmount[requirement.dimNum - 1].gte(requirement.num);
  } else {
    for (let i = 0; i < bulk; i++) {
      let requirement = getResetDimInfo(type, bulk);
      if (!player.dimAmount[requirement.dimNum - 1].gte(requirement.num)) {
        return false;
      }
      return true;
    }
  }
}

document.getElementById("softResetShift").onclick = function () {
  auto = false;
  if (canReset('shift')) {
      softReset(1, 'shift');
  }
};

document.getElementById("softResetBoost").onclick = function () {
  auto = false;
  if (canReset('boost')) {
      softReset(1, 'boost');
  }
};

document.getElementById("maxall").onclick = function () {
    buyMaxTickSpeed();

    for (var tier=1; tier<=MAX_DIMENSION;tier++) {
        var cost = player.dimCosts[tier - 1].times(getNumRemaining(tier))
        if (tier >= 3 && (player.currentChallenge == "challenge10" || player.currentChallenge == "postc1")) {
            if (!canBuyDimension(tier)) continue
            if (player.dimAmount[tier - 3].lt(cost)) continue
                if (canBuyDimension(tier)) {
                    if (cost.lt(player.dimAmount[tier - 3]) && player.dimBought[tier - 1] != 0) {
                        player.dimAmount[tier - 3] = player.dimAmount[tier - 3].minus(cost)
                        player.dimAmount[tier - 1] = Decimal.round(player.dimAmount[tier - 1].plus(getNumRemaining(tier)))
                        player.dimPow[tier - 1]  = player.dimPow[tier - 1].times(getDimensionPowerMultiplier(tier))
                        player.dimCosts[tier - 1] = player.dimCosts[tier - 1].times(getDimensionCostMultiplier(tier))
                        player.dimBought[tier - 1] = 0
                    }
                    while (player.dimAmount[tier - 3].gt(player.dimCosts[tier - 1].times(10))) {
                        player.dimAmount[tier - 3] = player.dimAmount[tier - 3].minus(player.dimCosts[tier - 1].times(10))
                        player.dimCosts[tier - 1] = player.dimCosts[tier - 1].times(getDimensionCostMultiplier(tier))
                        player.dimAmount[tier - 1] = Decimal.round(player.dimAmount[tier - 1].plus(10))
                        player.dimPow[tier - 1] = player.dimPow[tier - 1].times(getDimensionPowerMultiplier(tier))
                    }


                    onBuyDimension(tier, 'many');
                }
        } else {
        if (!canBuyDimension(tier)) continue
            if (cost.lt(player.money) && player.dimBought[tier - 1] != 0) {
                player.money = player.money.minus(cost)
                player.dimAmount[tier - 1] = Decimal.round(player.dimAmount[tier - 1].plus(getNumRemaining(tier)))
                player.dimPow[tier - 1] = player.dimPow[tier - 1].times(getDimensionPowerMultiplier(tier))
                player.dimCosts[tier - 1] = player.dimCosts[tier - 1].times(getDimensionCostMultiplier(tier))
                player.dimBought[tier - 1] = 0
            }
            if (player.money.lt(player.dimCosts[tier - 1].times(10))) continue

            if ((player.dimensionMultDecrease !== 3 || player.currentChallenge == "postc5" || player.currentChallenge == "challenge5")) {
                while (player.money.gte(player.dimCosts[tier - 1].times(10))) {
                        player.money = player.money.minus(player.dimCosts[tier - 1].times(10))
                        multiplyCostsTier(tier);
                        player.dimAmount[tier - 1] = Decimal.round(player.dimAmount[tier - 1].plus(10))
                        player.dimPow[tier - 1] = player.dimPow[tier - 1].times(getDimensionPowerMultiplier(tier))
                        if (player.currentChallenge == "challenge8") clearDimensions(tier-1)
                }
            } else {
                if (player.dimCosts[tier - 1].lt(Number.MAX_VALUE)) {
                    while (player.money.gte(player.dimCosts[tier - 1].times(10)) && player.dimCosts[tier - 1].lte(Number.MAX_VALUE)) {
                        player.money = player.money.minus(player.dimCosts[tier - 1].times(10))
                        multiplyCostsTier(tier);
                        player.dimAmount[tier - 1] = Decimal.round(player.dimAmount[tier - 1].plus(getNumRemaining(tier)))
                        player.dimPow[tier - 1] = player.dimPow[tier - 1].times(getDimensionPowerMultiplier(tier))
                        if (player.currentChallenge == "challenge8") clearDimensions(tier-1)
                }
                }

            var a = Math.log10(Math.sqrt(player.dimensionMultDecrease))
            var b = player.costMultipliers[tier-1].dividedBy(Math.sqrt(player.dimensionMultDecrease)).log10()
            var c = player.dimCosts[tier - 1].dividedBy(player.money).log10()
            var discriminant = Math.pow(b, 2) - (c *a* 4)
            if (discriminant < 0) continue
            var buying = Math.floor((Math.sqrt(Math.pow(b, 2) - (c *a *4))-b)/(2 * a))+1
            if (buying <= 0) continue
            player.dimAmount[tier - 1] = Decimal.round(player.dimAmount[tier - 1].plus(10 * buying))
            player.dimPow[tier - 1] = player.dimPow[tier - 1].times(Decimal.pow(getDimensionPowerMultiplier(tier), buying))
            for (var i = 0; i<buying-1; i++) {
                player.dimCosts[tier - 1] = player.dimCosts[tier - 1].times(player.costMultipliers[tier-1])
                player.costMultipliers[tier-1] = player.costMultipliers[tier-1].times(player.dimensionMultDecrease)
            }
            player.money = player.money.minus(player.dimCosts[tier - 1])
            player.dimCosts[tier - 1] = player.dimCosts[tier - 1].times(player.costMultipliers[tier-1])
            player.costMultipliers[tier-1] = player.costMultipliers[tier-1].times(player.dimensionMultDecrease)
        }
        }
        if ((player.currentChallenge == "challenge12" || player.currentChallenge == "postc1" || player.currentChallenge == "postc6") && player.matter.equals(0)) player.matter = new Decimal(1);
        if (player.currentChallenge == "challenge2" || player.currentChallenge == "postc1") player.chall2Pow = 0;
        if (player.currentChallenge == "postc1") clearDimensions(tier-1);
        player.postC4Tier = tier;
    }
}




document.getElementById("challengeconfirmation").onclick = function () {
    if (!player.options.challConf) {
        player.options.challConf = true;
        document.getElementById("challengeconfirmation").innerHTML = "Challenge confirmation off"
    } else {
        player.options.challConf = false;
        document.getElementById("challengeconfirmation").innerHTML = "Challenge confirmation on"
    }
}




function buyInfinityUpgrade(name, cost) {
    if (player.infinityPoints.gte(cost) && !player.infinityUpgrades.includes(name)) {
        player.infinityUpgrades.push(name);
        player.infinityPoints = player.infinityPoints.minus(cost);
        return true
    } else return false
}

document.getElementById("infiMult").onclick = function() {
    if (player.infinityPoints.gte(player.infMultCost)) {
        player.infinityPoints = player.infinityPoints.minus(player.infMultCost)
        player.infMult = player.infMult.times(2);
        player.autoIP = player.autoIP.times(2);
        player.infMultCost = player.infMultCost.times(10)
        document.getElementById("infiMult").innerHTML = "Multiply infinity points from all sources by 2 <br>currently: "+shorten(player.infMult) +"x<br>Cost: "+shortenCosts(player.infMultCost)+" IP";
        if (player.autobuyers[11].priority !== undefined && player.autobuyers[11].priority !== null && player.autoCrunchMode == "amount") player.autobuyers[11].priority = player.autobuyers[11].priority.times(2);
        if (player.autoCrunchMode == "amount") document.getElementById("priority12").value = player.autobuyers[11].priority
    }
}

document.getElementById("tickspeedBoost").onclick = function() {
    if (player.infinityPoints.gte(player.tickspeedBoostCost)) {
        player.infinityPoints = player.infinityPoints.minus(player.tickspeedBoostCost)
        player.infTickspeedBoosts = player.infTickspeedBoosts + 1;
        player.tickspeedBoostCost = player.tickspeedBoostCost.times(100)
        document.getElementById("tickspeedBoost").innerHTML = "Get a Tickspeed Boost (persists between infinities) <br>currently: " + player.infTickspeedBoosts + "<br>Cost: " +shortenCosts(player.tickspeedBoostCost)+ " IP";
    }
}


function updateEternityUpgrades() {
    document.getElementById("eter1").className = (player.eternityUpgrades.includes(1)) ? "eternityupbtnbought" : (player.eternityPoints.gte(5)) ? "eternityupbtn" : "eternityupbtnlocked"
    document.getElementById("eter2").className = (player.eternityUpgrades.includes(2)) ? "eternityupbtnbought" : (player.eternityPoints.gte(10)) ? "eternityupbtn" : "eternityupbtnlocked"
    document.getElementById("eter3").className = (player.eternityUpgrades.includes(3)) ? "eternityupbtnbought" : (player.eternityPoints.gte(50e3)) ? "eternityupbtn" : "eternityupbtnlocked"
}


function buyEternityUpgrade(name, cost) {
    if (player.eternityPoints.gte(cost) && !player.eternityUpgrades.includes(name)) {
        player.eternityUpgrades.push(name)
        player.eternityPoints = player.eternityPoints.minus(cost)
        updateEternityUpgrades()
    }
}


function buyEPMult() {
    if (player.eternityPoints.gte(player.epmultCost)) {
        player.epmult *= 5
        player.eternityPoints = player.eternityPoints.minus(player.epmultCost)
        let count = Math.log(player.epmult)/Math.log(5)
        player.epmultCost = new Decimal(500).times(Decimal.pow(50, count))
        document.getElementById("epmult").innerHTML = "You gain 5 times more EP<p>Currently: "+shortenDimensions(player.epmult)+"x<p>Cost: "+shortenDimensions(player.epmultCost)+" EP"
        updateEternityUpgrades()
    }
}




function updateAchPow() {
    var amount = 0;
    for (var i = 0; i < AchievementsText.length; i++) {
      let row = true;
      for (var j = 0; j < AchievementsText[i].length; j++) {
        if (!player.achievements.includes("r" + (i + 1) + (j + 1))) {
          row = false;
          break;
        }
      }
      if (row) {
        amount++;
        document.getElementById('achRow' + (i + 1)).className = "completedrow";
      }
    }

    player.achPow = Decimal.pow(1.5, amount)

    document.getElementById("achmultlabel").innerHTML = "Current achievement multiplier on each Dimension: " + player.achPow.toFixed(1) + "x"
}



function timeMult() {
    var mult = new Decimal(1)
    if (player.infinityUpgrades.includes("timeMult")) mult = mult.times(Math.pow(player.totalTimePlayed / 1200, 0.15));
    if (player.infinityUpgrades.includes("timeMult2")) mult = mult.times(Decimal.max(Math.pow(player.thisInfinityTime / 2400, 0.25), 1));
    if (hasAchievement("One for each dimension")) mult = mult.times(Math.pow(player.totalTimePlayed / (10*60*60*24), 0.05));
    return mult;
}

function dimMults() {
    if (player.timestudy.studies.includes(31)) return Decimal.pow(1 + (player.infinitied * 0.2), 4)
    else return new Decimal(1 + (player.infinitied * 0.2))
}

function playerInfinityUpgradesOnEternity() {
    if (player.eternities < 4) player.infinityUpgrades = []
    else if (player.eternities < 20) player.infinityUpgrades = ["timeMult", "dimMult", "timeMult2", "skipReset1", "skipReset2", "unspentBonus", "27Mult", "18Mult", "36Mult", "resetMult", "skipReset3", "passiveGen", "45Mult", "resetBoost", "galaxyBoost", "skipResetGalaxy"]
    else player.infinityUpgrades = player.infinityUpgrades
}

function updateInfCosts() {
    document.getElementById("142").innerHTML = "You gain "+shortenCosts(1e20)+"x more IP<span>Cost: 4 Time Theorems"
    document.getElementById("161").innerHTML = shortenCosts(new Decimal("1e616"))+"x multiplier on all normal dimensions<span>Cost: 7 Time Theorems"
    document.getElementById("162").innerHTML = shortenCosts(1e11)+"x multiplier on all Infinity dimensions<span>Cost: 7 Time Theorems"
    document.getElementById("151").innerHTML = shortenCosts(1e4)+"x multiplier on all Time dimensions<span>Cost: 8 Time Theorems"


    document.getElementById("infiMult").innerHTML = "Multiply infinity points from all sources by 2 <br>currently: "+shorten(player.infMult) +"x<br>Cost: "+shortenCosts(player.infMultCost)+" IP";
    document.getElementById("tickspeedBoost").innerHTML = "Get a Tickspeed Boost (persists between infinities) <br>currently: " + player.infTickspeedBoosts + "<br>Cost: " +shortenCosts(player.tickspeedBoostCost)+ " IP";
}



function updateMilestones() {
    if (player.eternities > 0) document.getElementById("reward1").className = "milestonereward"
    if (player.eternities > 1) document.getElementById("reward2").className = "milestonereward"
    if (player.eternities > 2) document.getElementById("reward3").className = "milestonereward"
    if (player.eternities > 3) document.getElementById("reward3.5").className = "milestonereward"
    if (player.eternities > 4) document.getElementById("reward4").className = "milestonereward"
    if (player.eternities > 6) document.getElementById("reward5").className = "milestonereward"
    if (player.eternities > 8) document.getElementById("reward6").className = "milestonereward"
    if (player.eternities > 9) document.getElementById("reward7").className = "milestonereward"
    if (player.eternities > 10) document.getElementById("reward8").className = "milestonereward"
    if (player.eternities > 11) document.getElementById("reward9").className = "milestonereward"
    if (player.eternities > 12) document.getElementById("reward10").className = "milestonereward"
    if (player.eternities > 13) document.getElementById("reward11").className = "milestonereward"
    if (player.eternities > 14) document.getElementById("reward12").className = "milestonereward"
    if (player.eternities > 15) document.getElementById("reward13").className = "milestonereward"
    if (player.eternities > 16) document.getElementById("reward14").className = "milestonereward"
    if (player.eternities > 17) document.getElementById("reward15").className = "milestonereward"
    if (player.eternities > 19) document.getElementById("reward16").className = "milestonereward"
    if (player.eternities > 24) document.getElementById("reward17").className = "milestonereward"
    if (player.eternities >= 40) document.getElementById("reward18").className = "milestonereward"
    if (player.eternities >= 50) document.getElementById("reward19").className = "milestonereward"
    if (player.eternities >= 60) document.getElementById("reward20").className = "milestonereward"
    if (player.eternities >= 80) document.getElementById("reward21").className = "milestonereward"
    if (player.eternities >= 100) document.getElementById("reward22").className = "milestonereward"
}

function infMultAutoToggle() {
    if (player.infMultBuyer) {
        player.infMultBuyer = false
        document.getElementById("infmultbuyer").innerHTML = "Autobuy IP mult OFF"
    } else {
        player.infMultBuyer = true
        document.getElementById("infmultbuyer").innerHTML = "Autobuy IP mult ON"
    }
}


function toggleCrunchMode() {
    if (player.autoCrunchMode == "amount") {
        player.autoCrunchMode = "time"
        document.getElementById("togglecrunchmode").innerHTML = "Auto crunch mode: time"
        document.getElementById("limittext").innerHTML = "Seconds between crunches:"
    } else if (player.autoCrunchMode == "time"){
        player.autoCrunchMode = "relative"
        document.getElementById("togglecrunchmode").innerHTML = "Auto crunch mode: X times last crunch"
        document.getElementById("limittext").innerHTML = "X times since last crunch:"
    } else {
        player.autoCrunchMode = "amount"
        document.getElementById("togglecrunchmode").innerHTML = "Auto crunch mode: amount"
        document.getElementById("limittext").innerHTML = "Amount of IP to wait until reset:"
    }
}

function toggleEternityConf() {
    if (player.options.eternityconfirm) {
        player.options.eternityconfirm = false
        document.getElementById("eternityconf").innerHTML = "Eternity confimation OFF"
    } else {
        player.options.eternityconfirm = true
        document.getElementById("eternityconf").innerHTML = "Eternity confimation ON"
    }
}



function toggleCommas() {
    player.options.commas = !player.options.commas

    if (player.options.commas) document.getElementById("commas").innerHTML = "Commas on large exponents ON"
    else document.getElementById("commas").innerHTML = "Commas on large exponents OFF"
}






buyAutobuyer = function(id) {
    if (player.infinityPoints.lt(player.autobuyers[id].cost)) return false;
    if (player.autobuyers[id].bulk >= 1e100) return false;
    player.infinityPoints = player.infinityPoints.minus(player.autobuyers[id].cost);
    if (player.autobuyers[id].interval <= 100) {
        player.autobuyers[id].bulk = Math.min(player.autobuyers[id].bulk * 2, 1e100);
        player.autobuyers[id].cost = Math.ceil(2.4*player.autobuyers[id].cost);
        var b1 = true;
	    for (let i=0;i<8;i++) {
            if (player.autobuyers[i].bulk < 512) b1 = false;
        }
        if (b1) giveAchievement("Bulked up");
    } else {
        player.autobuyers[id].interval = Math.max(player.autobuyers[id].interval*0.6, 100);
        if (player.autobuyers[id].interval > 120) player.autobuyers[id].cost *= 2; //if your last purchase wont be very strong, dont double the cost
    }
    updateAutobuyers();
}

document.getElementById("buyerBtn1").onclick = function () {
    buyAutobuyer(0);
}

document.getElementById("buyerBtn2").onclick = function () {

    buyAutobuyer(1);
}

document.getElementById("buyerBtn3").onclick = function () {
    buyAutobuyer(2);
}

document.getElementById("buyerBtn4").onclick = function () {
    buyAutobuyer(3);
}

document.getElementById("buyerBtn5").onclick = function () {
    buyAutobuyer(4);
}

document.getElementById("buyerBtn6").onclick = function () {
    buyAutobuyer(5);
}

document.getElementById("buyerBtn7").onclick = function () {
    buyAutobuyer(6);
}

document.getElementById("buyerBtn8").onclick = function () {
    buyAutobuyer(7);
}

document.getElementById("buyerBtnTickSpeed").onclick = function () {
    buyAutobuyer(8);
}

document.getElementById("buyerBtnDimBoost").onclick = function () {
    buyAutobuyer(9);
}

document.getElementById("buyerBtnGalaxies").onclick = function () {
    buyAutobuyer(10);
}

document.getElementById("buyerBtnInf").onclick = function () {
    buyAutobuyer(11);
}

toggleAutobuyerTarget = function(id) {
    if (player.autobuyers[id-1].target == id) {
        player.autobuyers[id-1].target = 10 + id
        document.getElementById("toggleBtn" + id).innerHTML="Buys until 10"
    } else {
        player.autobuyers[id-1].target = id
        document.getElementById("toggleBtn" + id).innerHTML="Buys singles"
    }
}

document.getElementById("toggleBtn1").onclick = function () {
    toggleAutobuyerTarget(1)
}

document.getElementById("toggleBtn2").onclick = function () {
    toggleAutobuyerTarget(2)
}

document.getElementById("toggleBtn3").onclick = function () {
    toggleAutobuyerTarget(3)
}

document.getElementById("toggleBtn4").onclick = function () {
    toggleAutobuyerTarget(4)
}

document.getElementById("toggleBtn5").onclick = function () {
    toggleAutobuyerTarget(5)
}

document.getElementById("toggleBtn6").onclick = function () {
    toggleAutobuyerTarget(6)
}

document.getElementById("toggleBtn7").onclick = function () {
    toggleAutobuyerTarget(7)
}

document.getElementById("toggleBtn8").onclick = function () {
    toggleAutobuyerTarget(8)
}

document.getElementById("toggleBtnTickSpeed").onclick = function () {
    if (player.autobuyers[8].target == 1) {
        player.autobuyers[8].target = 10
        document.getElementById("toggleBtnTickSpeed").innerHTML="Buys max"
    } else {
        player.autobuyers[8].target = 1
        document.getElementById("toggleBtnTickSpeed").innerHTML="Buys singles"
    }
}

document.getElementById("exportbtn").onclick = function () {
    let output = document.getElementById('exportOutput');
    let parent = output.parentElement;

    parent.style.display = "";
    output.value = btoa(JSON.stringify(player, function(k, v) { return (v === Infinity) ? "Infinity" : v; }));

    output.onblur = function() {
        parent.style.display = "none";
    }

    output.focus();
    output.select();

    try {
        if (document.execCommand('copy')) {
            $.notify("exported to clipboard", "info");
            output.blur();
        }
    } catch(ex) {
        // well, we tried.
        console.log('Exception', ex);
        alert('Exception! Exception!');
    }
};


document.getElementById("save").onclick = function () {
    save_game();
};

function verify_save(obj) {
    if (typeof obj != 'object') return false;


    return true;
}

document.getElementById("importbtn").onclick = function () {
    var save_data = prompt("Input your save.");
    save_data = save_data.constructor !== String ? save_data = "":
    secretThemeKey = save_data;
    if (sha512_256(save_data) === "de24687ee7ba1acd8f5dc8f71d41a3d4b7f14432fff53a4d4166e7eea48a88c0") {
        player.options.theme = "S1";
        setTheme(player.options.theme);
    } else if (sha512_256(save_data) === "76269d18c05c9ebec8a990a096cee046dea042a0421f8ab81d17f34dd1cdbdbf") {
        player.options.theme = "S2";
        setTheme(player.options.theme);
    } else {
        save_data = JSON.parse(atob(save_data), function(k, v) { return (v === Infinity) ? "Infinity" : v; });
        if (!save_data || !verify_save(save_data)) {
            alert('could not load the save..');
            load_custom_game();
            return;
        }
        player = save_data;
        save_game();
        load_game();
        updateChallenges()
        transformSaveToDecimal()
    }
};




document.getElementById("reset").onclick = function () {
    if (confirm("Do you really want to erase all your progress?")) {
        set_save('falseDimensionSave', defaultStart);
        player = defaultStart
        save_game();
        load_game();
        updateCosts();
        clearInterval(player.interval);
        //updateInterval();

        for (var i = 2; i <= MAX_DIMENSION; i++) {
          document.getElementById(getDimName(i).toLowerCase() + "Row").style.display = "none";
        }
        document.getElementById("tickSpeed").style.visibility = "hidden";
        document.getElementById("tickSpeedMax").style.visibility = "hidden";
        document.getElementById("tickLabel").style.visibility = "hidden";
        document.getElementById("tickSpeedAmount").style.visibility = "hidden";
        updateTickSpeed();
        updateDimensions();
        updateChallenges();
        updateAutobuyers();
    }
};


function breakInfinity() {
    if (player.autobuyers[11]%1 === 0 || player.autobuyers[11].interval>100) return false
    if (player.break && !player.currentChallenge.includes("post")) {
        player.break = false
        document.getElementById("break").innerHTML = "BREAK INFINITY"
    } else {
        player.break = true
        document.getElementById("break").innerHTML = "FIX INFINITY"
        giveAchievement("Limit Break")
    }
}

function gainedInfinityPoints() {
    var ret = Decimal.floor(Decimal.pow(10, player.money.e/308 -0.75).times(player.infMult))
    if (player.achievements.includes("r103")) ret = Decimal.floor(Decimal.pow(10, player.money.e/307.8 -0.75).times(player.infMult))
    if (player.timestudy.studies.includes(111)) ret = Decimal.floor(Decimal.pow(10, player.money.e/290 -0.75).times(player.infMult))
    if (player.timestudy.studies.includes(41)) ret = ret.times(Decimal.pow(1.2, player.infTickspeedBoosts))
    if (player.timestudy.studies.includes(51)) ret = ret.times(1e15)
    if (player.timestudy.studies.includes(141)) ret = ret.times(new Decimal(1e45).dividedBy(Decimal.pow(15, Math.log(player.thisInfinityTime)*Math.pow(player.thisInfinityTime, 0.125))).max(1))
    if (player.timestudy.studies.includes(142)) ret = ret.times(1e25)
    if (player.timestudy.studies.includes(143)) ret = ret.times(Decimal.pow(15, Math.log(player.thisInfinityTime)*Math.pow(player.thisInfinityTime, 0.125)))
    return ret
}

function gainedEternityPoints() {
    var ret = Decimal.floor(Decimal.pow(5, player.infinityPoints.e/308 -0.7).times(player.epmult))
    if (player.timestudy.studies.includes(61)) ret = Decimal.floor(Decimal.pow(5, player.infinityPoints.e/308 -0.7).times(10).times(player.epmult))
    if (player.timestudy.studies.includes(121)) {
        ret = ret.times((253 - averageEp.dividedBy(player.epmult).dividedBy(10).min(248).max(3))/5)
    } else if (player.timestudy.studies.includes(122)) {
        ret = ret.times(35)
    } else if (player.timestudy.studies.includes(123)) {
        ret = ret.times(Math.sqrt(1.39*player.thisEternity/10))
    }
    return ret
}


function setAchieveTooltip() {
    var apocAchieve = document.getElementById("Antimatter Apocalypse");
    var noPointAchieve = document.getElementById("There's no point in doing that");
    var sanic = document.getElementById("Supersanic")
    var forgotAchieve = document.getElementById("I forgot to nerf that")
    var potato = document.getElementById("Faster than a potato")
    var dimensional = document.getElementById("Multidimensional")
    var IPBelongs = document.getElementById("All your IP are belong to us")

    apocAchieve.setAttribute('ach-tooltip', "Get over " + formatValue(player.options.notation, 1e80, 0, 0) + " antimatter");
    noPointAchieve.setAttribute('ach-tooltip', "Buy a single First Dimension when you have over " + formatValue(player.options.notation, 1e150, 0, 0) + " of them. Reward: First Dimensions are 10% stronger");
    forgotAchieve.setAttribute('ach-tooltip', "Get any Dimension multiplier over " + formatValue(player.options.notation, 1e31, 0, 0)) + ". Reward: First Dimensions are 5% stronger";
    sanic.setAttribute('ach-tooltip', "Have antimatter/sec exceed your current antimatter above " + formatValue(player.options.notation, 1e63, 0, 0));
    potato.setAttribute('ach-tooltip', "Get more than " + formatValue(player.options.notation, 1e26, 0, 0) + " ticks per second. Reward: Reduces starting tick interval by 2%");
    dimensional.setAttribute('ach-tooltip', "Reach " + formatValue(player.options.notation, 1e12, 0, 0) + " of all dimensions except 8th");
    IPBelongs.setAttribute('ach-tooltip', "Big Crunch for "+shortenCosts(1e150)+" IP. Reward: Additional 4x multiplier to IP")
}

document.getElementById("notation").onclick = function () {
    player.options.scientific = !player.options.scientific;
    if (player.options.notation === "Logarithm") {
        player.options.notation = "Scientific";
        document.getElementById("notation").innerHTML = ("Notation: Scientific")
    } else if (player.options.notation === "Scientific") {
        player.options.notation = "Engineering";
        document.getElementById("notation").innerHTML = ("Notation: Engineering")
    } else if (player.options.notation === "Engineering") {
        player.options.notation = "Letters";
        document.getElementById("notation").innerHTML = ("Notation: Letters")
    } else if (player.options.notation === "Letters") {
        player.options.notation = "Standard";
        document.getElementById("notation").innerHTML = ("Notation: Standard")
    } else if (player.options.notation === "Standard") {
        player.options.notation = "Emojis";
        document.getElementById("notation").innerHTML = ("Notation: Cancer")
    } else if (player.options.notation === "Emojis") {
        player.options.notation = "Mixed scientific";
        document.getElementById("notation").innerHTML = ("Notation: Mixed scientific")
    } else if (player.options.notation === "Mixed scientific") {
        player.options.notation = "Mixed engineering";
        document.getElementById("notation").innerHTML = ("Notation: Mixed engineering")
    } else if (player.options.notation === "Mixed engineering") {
        player.options.notation = "Logarithm";
        document.getElementById("notation").innerHTML = ("Notation: Logarithm")
    }
    setAchieveTooltip();
    updateCosts();

};


document.getElementById("newsbtn").onclick = function() {
  if (!player.options.newsHidden) {
    document.getElementById("game").style.display = "none";
    player.options.newsHidden = true
  } else {
    document.getElementById("game").style.display = "block";
    player.options.newsHidden = false
    scrollNextMessage()
  }
}


function resetDimensions() {
    var tiers = [ null, "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth" ];

    for (i = 1; i <= 8; i++) {
        player[tiers[i] + "Amount"] = new Decimal(0)
        player[tiers[i] + "Pow"] = new Decimal(1)
    }
    player.dimCosts = initialDimCosts();
    player.eightPow = new Decimal(player.chall11Pow)
}

function updateAutobuyers() {
    var autoBuyerDim1 = new Autobuyer (1)
    var autoBuyerDim2 = new Autobuyer (2)
    var autoBuyerDim3 = new Autobuyer (3)
    var autoBuyerDim4 = new Autobuyer (4)
    var autoBuyerDim5 = new Autobuyer (5)
    var autoBuyerDim6 = new Autobuyer (6)
    var autoBuyerDim7 = new Autobuyer (7)
    var autoBuyerDim8 = new Autobuyer (8)
    var autoBuyerDimBoost = new Autobuyer (9)
    var autoBuyerTickspeed = new Autobuyer (document.getElementById("tickSpeed"))
    var autoBuyerInf = new Autobuyer (document.getElementById("bigcrunch"))


    autoBuyerDim1.interval = 3000
    autoBuyerDim2.interval = 4000
    autoBuyerDim3.interval = 5000
    autoBuyerDim4.interval = 6000
    autoBuyerDim5.interval = 8000
    autoBuyerDim6.interval = 10000
    autoBuyerDim7.interval = 12000
    autoBuyerDim8.interval = 15000
    autoBuyerDimBoost.interval = 16000
    autoBuyerTickspeed.interval = 10000
    autoBuyerInf.interval = 300000

    autoBuyerDim1.tier = 1
    autoBuyerDim2.tier = 2
    autoBuyerDim3.tier = 3
    autoBuyerDim4.tier = 4
    autoBuyerDim5.tier = 5
    autoBuyerDim6.tier = 6
    autoBuyerDim7.tier = 7
    autoBuyerDim8.tier = 8
    autoBuyerTickSpeed.tier = 9

    if (player.challenges.includes("challenge1") && player.autobuyers[0] == 1) {
        player.autobuyers[0] = autoBuyerDim1
        document.getElementById("autoBuyer1").style.display = "inline-block"
    }
    if (player.challenges.includes("challenge2") && player.autobuyers[1] == 2) {
        player.autobuyers[1] = autoBuyerDim2
        document.getElementById("autoBuyer2").style.display = "inline-block"
    }
    if (player.challenges.includes("challenge3") && player.autobuyers[2] == 3) {
        player.autobuyers[2] = autoBuyerDim3
        document.getElementById("autoBuyer3").style.display = "inline-block"
    }
    if (player.challenges.includes("challenge4") && player.autobuyers[9] == 10) {
        player.autobuyers[9] = autoBuyerDimBoost
        document.getElementById("autoBuyerDimBoost").style.display = "inline-block"
    }
    if (player.challenges.includes("challenge5") && player.autobuyers[8] == 9) {
        player.autobuyers[8] = autoBuyerTickspeed
        document.getElementById("autoBuyerTickSpeed").style.display = "inline-block"
    }
    if (player.challenges.includes("challenge6") && player.autobuyers[4] == 5) {
        player.autobuyers[4] = autoBuyerDim5
        document.getElementById("autoBuyer5").style.display = "inline-block"
    }
    if (player.challenges.includes("challenge7") && player.autobuyers[11] == 12) {
        player.autobuyers[11] = autoBuyerInf
        document.getElementById("autoBuyerInf").style.display = "inline-block"
    }
    if (player.challenges.includes("challenge8") && player.autobuyers[3] == 4) {
        player.autobuyers[3] = autoBuyerDim4
        document.getElementById("autoBuyer4").style.display = "inline-block"
    }
    if (player.challenges.includes("challenge9") && player.autobuyers[6] == 7) {
        player.autobuyers[6] = autoBuyerDim7
        document.getElementById("autoBuyer7").style.display = "inline-block"
    }
    if (player.challenges.includes("challenge10") && player.autobuyers[5] == 6) {
        player.autobuyers[5] = autoBuyerDim6
        document.getElementById("autoBuyer6").style.display = "inline-block"
    }
    if (player.challenges.includes("challenge11") && player.autobuyers[7] == 8) {
        player.autobuyers[7] = autoBuyerDim8
        document.getElementById("autoBuyer8").style.display = "inline-block"
    }

    if (player.infinityUpgrades.includes("autoBuyerUpgrade")) {
        document.getElementById("interval1").innerHTML = "Current interval: " + (player.autobuyers[0].interval/2000).toFixed(2) + " seconds";
        document.getElementById("interval2").innerHTML = "Current interval: " + (player.autobuyers[1].interval/2000).toFixed(2) + " seconds";
        document.getElementById("interval3").innerHTML = "Current interval: " + (player.autobuyers[2].interval/2000).toFixed(2) + " seconds";
        document.getElementById("interval4").innerHTML = "Current interval: " + (player.autobuyers[3].interval/2000).toFixed(2) + " seconds";
        document.getElementById("interval5").innerHTML = "Current interval: " + (player.autobuyers[4].interval/2000).toFixed(2) + " seconds";
        document.getElementById("interval6").innerHTML = "Current interval: " + (player.autobuyers[5].interval/2000).toFixed(2) + " seconds";
        document.getElementById("interval7").innerHTML = "Current interval: " + (player.autobuyers[6].interval/2000).toFixed(2) + " seconds";
        document.getElementById("interval8").innerHTML = "Current interval: " + (player.autobuyers[7].interval/2000).toFixed(2) + " seconds";
        document.getElementById("intervalTickSpeed").innerHTML = "Current interval: " + (player.autobuyers[8].interval/2000).toFixed(2) + " seconds";
        document.getElementById("intervalDimBoost").innerHTML = "Current interval: " + (player.autobuyers[9].interval/2000).toFixed(2) + " seconds";
        document.getElementById("intervalGalaxies").innerHTML = "Current interval: " + (player.autobuyers[10].interval/2000).toFixed(2) + " seconds";
        document.getElementById("intervalInf").innerHTML = "Current interval: " + (player.autobuyers[11].interval/2000).toFixed(2) + " seconds";
    } else {
        document.getElementById("interval1").innerHTML = "Current interval: " + (player.autobuyers[0].interval/1000).toFixed(2) + " seconds";
        document.getElementById("interval2").innerHTML = "Current interval: " + (player.autobuyers[1].interval/1000).toFixed(2) + " seconds";
        document.getElementById("interval3").innerHTML = "Current interval: " + (player.autobuyers[2].interval/1000).toFixed(2) + " seconds";
        document.getElementById("interval4").innerHTML = "Current interval: " + (player.autobuyers[3].interval/1000).toFixed(2) + " seconds";
        document.getElementById("interval5").innerHTML = "Current interval: " + (player.autobuyers[4].interval/1000).toFixed(2) + " seconds";
        document.getElementById("interval6").innerHTML = "Current interval: " + (player.autobuyers[5].interval/1000).toFixed(2) + " seconds";
        document.getElementById("interval7").innerHTML = "Current interval: " + (player.autobuyers[6].interval/1000).toFixed(2) + " seconds";
        document.getElementById("interval8").innerHTML = "Current interval: " + (player.autobuyers[7].interval/1000).toFixed(2) + " seconds";
        document.getElementById("intervalTickSpeed").innerHTML = "Current interval: " + (player.autobuyers[8].interval/1000).toFixed(2) + " seconds";
        document.getElementById("intervalDimBoost").innerHTML = "Current interval: " + (player.autobuyers[9].interval/1000).toFixed(2) + " seconds";
        document.getElementById("intervalGalaxies").innerHTML = "Current interval: " + (player.autobuyers[10].interval/1000).toFixed(2) + " seconds";
        document.getElementById("intervalInf").innerHTML = "Current interval: " + (player.autobuyers[11].interval/1000).toFixed(2) + " seconds";
    }

    var maxedAutobuy = 0;
    for (let tier = 1; tier <= 8; ++tier) {
    document.getElementById("toggleBtn" + tier).style.display = "inline-block";
        if (player.autobuyers[tier-1].bulk >= 1e100) {
        player.autobuyers[tier-1].bulk = 1e100;
        document.getElementById("buyerBtn" + tier).innerHTML = shortenDimensions(player.autobuyers[tier-1].bulk)+"x bulk purchase";
        }
        else {
        if (player.autobuyers[tier-1].interval <= 100) {
            if (player.autobuyers[tier-1].bulk * 2 >= 1e100) {
                document.getElementById("buyerBtn" + tier).innerHTML = shortenDimensions(1e100)+"x bulk purchase<br>Cost: " + shortenDimensions(player.autobuyers[tier-1].cost) + " IP";
            }
            else {
                document.getElementById("buyerBtn" + tier).innerHTML = shortenDimensions(player.autobuyers[tier-1].bulk*2)+"x bulk purchase<br>Cost: " + shortenDimensions(player.autobuyers[tier-1].cost) + " IP";
            }
            maxedAutobuy++;
        }
        else document.getElementById("buyerBtn" + tier).innerHTML = "40% smaller interval <br>Cost: " + shortenDimensions(player.autobuyers[tier-1].cost) + " IP"
        }
    }

    if (player.autobuyers[8].interval <= 100) {
        document.getElementById("buyerBtnTickSpeed").style.display = "none"
        document.getElementById("toggleBtnTickSpeed").style.display = "inline-block"
        maxedAutobuy++;
    }
    if (player.autobuyers[9].interval <= 100) {
        document.getElementById("buyerBtnDimBoost").style.display = "none"
        maxedAutobuy++;
    }
    if (player.autobuyers[10].interval <= 100) {
        document.getElementById("buyerBtnGalaxies").style.display = "none"
        maxedAutobuy++;
    }
    if (player.autobuyers[11].interval <= 100) {
        document.getElementById("buyerBtnInf").style.display = "none"
        maxedAutobuy++;
    }
    if (maxedAutobuy >= 9) giveAchievement("Age of Automation");
    if (maxedAutobuy >= 12) giveAchievement("Definitely not worth it");

    document.getElementById("buyerBtnTickSpeed").innerHTML = "40% smaller interval <br>Cost: " + player.autobuyers[8].cost + " IP"
    document.getElementById("buyerBtnDimBoost").innerHTML = "40% smaller interval <br>Cost: " + player.autobuyers[9].cost + " IP"
    document.getElementById("buyerBtnGalaxies").innerHTML = "40% smaller interval <br>Cost: " + player.autobuyers[10].cost + " IP"
    document.getElementById("buyerBtnInf").innerHTML = "40% smaller interval <br>Cost: " + player.autobuyers[11].cost + " IP"


    for (var i=0; i<8; i++) {
        if (player.autobuyers[i]%1 !== 0) document.getElementById("autoBuyer"+(i+1)).style.display = "inline-block"
    }
    if (player.autobuyers[8]%1 !== 0) document.getElementById("autoBuyerTickSpeed").style.display = "inline-block"
    if (player.autobuyers[9]%1 !== 0) document.getElementById("autoBuyerDimBoost").style.display = "inline-block"
    if (player.autobuyers[11]%1 !== 0) document.getElementById("autoBuyerInf").style.display = "inline-block"

    for (var i=1; i<=12; i++) {
        player.autobuyers[i-1].isOn = document.getElementById(i + "ison").checked;
    }
    player.eternityBuyer.isOn = document.getElementById("eternityison").checked
    priorityOrder()
}


function autoBuyerArray() {
    var tempArray = []
    for (var i=0; i<player.autobuyers.length && i<9; i++) {
        if (player.autobuyers[i]%1 !== 0 ) {
            tempArray.push(player.autobuyers[i])
        }
    }
    return tempArray;
}


var priority = []


function priorityOrder() {
    var tempArray = []
    var i = 1;
    while(tempArray.length != autoBuyerArray().length) {

        for (var x=0 ; x< autoBuyerArray().length; x++) {
            if (autoBuyerArray()[x].priority == i) tempArray.push(autoBuyerArray()[x])
        }
        i++;
    }
    priority = tempArray;
}


function updatePriorities() {
    for (var x=0 ; x < autoBuyerArray().length; x++) {
        if (x < 9) autoBuyerArray()[x].priority = parseInt(document.getElementById("priority" + (x+1)).value)
    }
    player.autobuyers[9].priority = parseInt(document.getElementById("priority10").value)
    player.autobuyers[10].priority = parseInt(document.getElementById("priority11").value)
    var infvalue = document.getElementById("priority12").value
    if (infvalue !== undefined && infvalue !== "undefined") infvalue = new Decimal(infvalue)
    else infvalue = new Decimal(Infinity)
    player.autobuyers[11].priority = infvalue
    var bulk = Math.max(parseFloat(document.getElementById("bulkDimboost").value), 0.05)
    if (isNaN(bulk)) bulk = 1
    player.autobuyers[9].bulk = bulk
    var sacValue = document.getElementById("prioritySac").value
    if (sacValue.includes("e")) sacValue = parseFloat(sacValue.split("e")[0]) * Math.pow(10, parseInt(sacValue.split("e")[1]))
    else sacValue = parseFloat(sacValue)
    var eterValue = new Decimal(document.getElementById("priority13").value)
    if (!isNaN(eterValue)) player.eternityBuyer.limit = eterValue

    priorityOrder()
}

function updateCheckBoxes() {
    for (var i = 0; i < 12; i++) {
        if (player.autobuyers[i]%1 !== 0) {
            if (player.autobuyers[i].isOn) document.getElementById((i+1) + "ison").checked = "true";
            else document.getElementById((i+1) + "ison").checked = ""
        }
    }

    document.getElementById("eternityison").checked = player.eternityBuyer.isOn

}


function toggleAutoBuyers() {
    var bool = player.autobuyers[0].isOn
    for (var i = 0; i<12; i++) {
        if (player.autobuyers[i]%1 !== 0) {
            player.autobuyers[i].isOn = !bool
        }
    }
    player.eternityBuyer.isOn = !bool
    updateCheckBoxes()
    updateAutobuyers()
}

function toggleBulk() {

    if (player.options.bulkOn) {
        player.options.bulkOn = false
        document.getElementById("togglebulk").innerHTML = "Enable bulk buy"
    } else {
        player.options.bulkOn = true
        document.getElementById("togglebulk").innerHTML = "Disable bulk buy"
    }
}

function toggleHotkeys() {
    if (player.options.hotkeys) {
        player.options.hotkeys = false
        document.getElementById("hotkeys").innerHTML = "Enable hotkeys"
    } else {
        player.options.hotkeys = true
        document.getElementById("hotkeys").innerHTML = "Disable hotkeys"
    }
}








function updateChallengeTimes() {
    document.getElementById("challengetime2").innerHTML = "Challenge  " + 2 + " time record " + timeDisplayShort(player.challengeTimes[0])
    document.getElementById("challengetime3").innerHTML = "Challenge  " + 3 + " time record " + timeDisplayShort(player.challengeTimes[1])
    document.getElementById("challengetime4").innerHTML = "Challenge  " + 4 + " time record " + timeDisplayShort(player.challengeTimes[6])
    document.getElementById("challengetime5").innerHTML = "Challenge  " + 5 + " time record " + timeDisplayShort(player.challengeTimes[4])
    document.getElementById("challengetime6").innerHTML = "Challenge  " + 6 + " time record " + timeDisplayShort(player.challengeTimes[8])
    document.getElementById("challengetime7").innerHTML = "Challenge  " + 7 + " time record " + timeDisplayShort(player.challengeTimes[7])
    document.getElementById("challengetime8").innerHTML = "Challenge  " + 8 + " time record " + timeDisplayShort(player.challengeTimes[9])
    document.getElementById("challengetime9").innerHTML = "Challenge  " + 9 + " time record " + timeDisplayShort(player.challengeTimes[3])
    document.getElementById("challengetime10").innerHTML = "Challenge " + 10 + " time record " + timeDisplayShort(player.challengeTimes[2])
    document.getElementById("challengetime11").innerHTML = "Challenge " + 11 + " time record " + timeDisplayShort(player.challengeTimes[10])
    document.getElementById("challengetime12").innerHTML = "Challenge " + 12 + " time record " + timeDisplayShort(player.challengeTimes[5])

    for (var i=0; i<8; i++) {
        document.getElementById("infchallengetime"+(i+1)).innerHTML = "Infinity Challenge " + (i+1) + " time record " + timeDisplayShort(player.infchallengeTimes[i])
    }
    updateWorstChallengeTime();
}

var bestRunIppm = new Decimal(0)
function updateLastTenRuns() {
    let tempBest = 0
    var tempTime = new Decimal(0)
    var tempIP = new Decimal(0)
    for (var i=0; i<10;i++) {
        tempTime = tempTime.plus(player.lastTenRuns[i][0])
        tempIP = tempIP.plus(player.lastTenRuns[i][1])
    }
    tempTime = tempTime.dividedBy(10)
    tempIP = tempIP.dividedBy(10)
    for (var i=0; i<10; i++) {
        var ippm = player.lastTenRuns[i][1].dividedBy(player.lastTenRuns[i][0]/600)
        if (ippm.gt(tempBest)) tempBest = ippm
        var tempstring = shorten(ippm) + " IP/min"
        if (ippm<1) tempstring = shorten(ippm*60) + " IP/hour"
        document.getElementById("run"+(i+1)).innerHTML = "The infinity "+(i+1)+" infinities ago took " + timeDisplayShort(player.lastTenRuns[i][0]) + " and gave " + shortenDimensions(player.lastTenRuns[i][1]) +" IP. "+ tempstring
    }

    var ippm = tempIP.dividedBy(tempTime/600)
    var tempstring = shorten(ippm) + " IP/min"
    if (ippm<1) tempstring = shorten(ippm*60) + " IP/hour"
    document.getElementById("averagerun").innerHTML = "Last 10 infinities average time: "+ timeDisplayShort(tempTime)+" Average IP gain: "+shortenDimensions(tempIP)+" IP. "+tempstring

    if (tempBest.gte(1e8)) giveAchievement("Oh hey, you're still here");
    if (tempBest.gte(1e300)) giveAchievement("MAXIMUM OVERDRIVE");

    bestRunIppm = tempBest
}

var averageEp = new Decimal(0)
function updateLastTenEternities() {
    let tempBest = 0
    var tempTime = new Decimal(0)
    var tempEP = new Decimal(0)
    for (var i=0; i<10;i++) {
        tempTime = tempTime.plus(player.lastTenEternities[i][0])
        tempEP = tempEP.plus(player.lastTenEternities[i][1])
    }
    tempTime = tempTime.dividedBy(10)
    tempEP = tempEP.dividedBy(10)
    for (var i=0; i<10; i++) {
        var eppm = player.lastTenEternities[i][1].dividedBy(player.lastTenEternities[i][0]/600)
        if (eppm.gt(tempBest)) tempBest = eppm
        var tempstring = shorten(eppm) + " EP/min"
        if (eppm<1) tempstring = shorten(eppm*60) + " EP/hour"
        document.getElementById("eternityrun"+(i+1)).innerHTML = "The Eternity "+(i+1)+" eternities ago took " + timeDisplayShort(player.lastTenEternities[i][0]) + " and gave " + shortenDimensions(player.lastTenEternities[i][1]) +" EP. "+ tempstring
    }

    var eppm = tempEP.dividedBy(tempTime/600)
    var tempstring = shorten(eppm) + " IP/min"
    averageEp = tempEP
    if (eppm<1) tempstring = shorten(eppm*60) + " IP/hour"
    document.getElementById("averageEternityRun").innerHTML = "Last 10 eternities average time: "+ timeDisplayShort(tempTime)+" Average EP gain: "+shortenDimensions(tempEP)+" EP. "+tempstring
}

function addEternityTime(time, ep) {
    for (var i=player.lastTenEternities.length-1; i>0; i--) {
        player.lastTenEternities[i] = player.lastTenEternities[i-1]
    }
    player.lastTenEternities[0] = [time, ep]
}


document.getElementById("postInfinityButton").onclick = function() {document.getElementById("bigcrunch").click()}

function addTime(time, ip) {
    for (var i=player.lastTenRuns.length-1; i>0; i--) {
        player.lastTenRuns[i] = player.lastTenRuns[i-1]
    }
    player.lastTenRuns[0] = [time, ip]
}

var infchallengeTimes = 999999999

function checkForEndMe() {
    var temp = 0
    for (var i=0; i<11; i++) {
        temp += player.challengeTimes[i]
    }
    if (temp <= 1800) giveAchievement("Not-so-challenging")
    if (temp <= 50) giveAchievement("End me")
    var temp2 = 0
    for (var i=0; i<8;i++) {
        temp2 += player.infchallengeTimes[i]
    }
    infchallengeTimes = temp2
    if (temp2 <= 50) giveAchievement("Yes. This is hell.")
}

function hasAchievement(x) {
  if (!(x in revAchieveDict)) {
    throw new Error('Bad achievment ' + x);
  }
  return player.achievements.includes(revAchieveDict[x]);
}

function getHighestDim() {
  let highest = 0;
  for (var i = 1; i <= MAX_DIMENSION; i++) {
    if (player.dimAmount[i - 1].gt(0)) {
      highest = i;
    }
  }
  return highest;
}

document.getElementById("bigcrunch").onclick = function () {
    var challNumber = parseInt(player.currentChallenge[player.currentChallenge.length-1])
    if (player.currentChallenge.length == 11) challNumber = parseInt("1"+player.currentChallenge[player.currentChallenge.length-1])
    if ((player.money.gte(Number.MAX_VALUE) && !player.currentChallenge.includes("post")) || (player.currentChallenge !== "" && player.money.gte(player.challengeTarget))) {
        if (player.thisInfinityTime <= 72000) giveAchievement("That's fast!");
        if (player.thisInfinityTime <= 6000) giveAchievement("That's faster!")
        if (player.thisInfinityTime <= 600) giveAchievement("Forever isn't that long")
        if (player.thisInfinityTime <= 2) giveAchievement("Blink of an eye")
        let highest_dim = getHighestDim();
        if (highest_dim <= 12) {
          giveAchievement("You didn't need it anyway");
        }
        if (highest_dim <= 8) {
          giveAchievement("The 9th dimension can be a lie");
        }
        if (!player.achievements.includes("r43") && totalResets() === 0) giveAchievement("Zero Deaths")
        if (player.currentChallenge == "challenge2" && player.thisInfinityTime <= 1800) giveAchievement("Many Deaths")
        if (player.currentChallenge == "challenge11" && player.thisInfinityTime <= 1800) giveAchievement("Gift from the Gods")
        if (player.currentChallenge == "challenge5" && player.thisInfinityTime <= 1800) giveAchievement("Is this hell?")
        if (player.currentChallenge == "challenge3" && player.thisInfinityTime <= 100) giveAchievement("You did this again just for the achievement right?");
        if (player.firstAmount == 1 && totalResets() == 0 && player.currentChallenge == "challenge12") giveAchievement("ERROR 909: Dimension not found")
        if (player.currentChallenge != "" && player.challengeTimes[challNumber-2] > player.thisInfinityTime) player.challengeTimes[challNumber-2] = player.thisInfinityTime
        if (player.currentChallenge.includes("post") && player.infchallengeTimes[challNumber-1] > player.thisInfinityTime) player.infchallengeTimes[challNumber-1] = player.thisInfinityTime
        if (player.currentChallenge == "postc5" && player.thisInfinityTime <= 100) giveAchievement("Hevipelle did nothing wrong")
        if ((player.bestInfinityTime > 600 && !player.break) || (player.currentChallenge != "" && !player.options.retryChallenge)) showTab("dimensions")
        if (player.currentChallenge != "" && !player.challenges.includes(player.currentChallenge)) {
            player.challenges.push(player.currentChallenge);
        }
        if (player.challenges.length > 12) giveAchievement("Infinitely Challenging");
        if (player.challenges.length == 20) giveAchievement("Anti-antichallenged");
        if (!player.break || player.currentChallenge != "") {
            var add = new Decimal(player.infMult)
            if (player.timestudy.studies.includes(51)) add = add.times(1e15)
            player.infinityPoints = player.infinityPoints.plus(add);
            addTime(player.thisInfinityTime, add)
        }
        else {
            player.infinityPoints = player.infinityPoints.plus(gainedInfinityPoints())
            addTime(player.thisInfinityTime, gainedInfinityPoints())
            if (gainedInfinityPoints().gte(1e150)) giveAchievement("All your IP are belong to us")
            if (gainedInfinityPoints().gte(1e200) && player.thisInfinityTime <= 20) giveAchievement("Ludicrous Speed")
            if (gainedInfinityPoints().gte(1e250) && player.thisInfinityTime <= 200) giveAchievement("I brake for nobody")
        }
        if (player.thisInfinityTime > 50 && player.achievements.includes("r87")) {
          if (player.timestudy.studies.includes(32)) {
            player.infinitied += 250 * totalResets() - 1;
          } else {
            player.infinitied += 249;
          }
        }
        if (autoS && auto) {
          if (gainedInfinityPoints().dividedBy(player.thisInfinityTime).gt(player.autoIP)) player.autoIP = gainedInfinityPoints().dividedBy(player.thisInfinityTime);
          if (player.thisInfinityTime<player.autoTime) player.autoTime = player.thisInfinityTime;
        }
        auto = !autoS; //only allow autoing if prev crunch was autoed
        autoS = true;
        player = {
        money: new Decimal(10),
        tickSpeedCost: new Decimal(1000),
        tickspeed: new Decimal(1000),
        dimCosts: initialDimCosts(),
        dimBought: initialDimBought(),
        dimAmount: initialDimAmount(),
        dimPow: initialDimPow(0, player.extra_starting_dimensions),
        fifthBought: 0,
        sixthBought: 0,
        seventhBought: 0,
        eightBought: 0,
        achievements: player.achievements,
        challenges: player.challenges,
        currentChallenge: player.currentChallenge,
        infinityUpgrades: player.infinityUpgrades,
        infinityPoints: player.infinityPoints,
        infinitied: player.infinitied + 1,
        totalTimePlayed: player.totalTimePlayed,
        bestInfinityTime: Math.min(player.bestInfinityTime, player.thisInfinityTime),
        infTickspeedBoosts: player.infTickspeedBoosts,
        thisInfinityTime: 0,
        shiftResets: 0,
        boostResets: 0,
        extra_starting_dimensions: player.extra_starting_dimensions,
        tickDecrease: 0.9,
        totalmoney: player.totalmoney,
        interval: null,
        lastUpdate: player.lastUpdate,
        achPow: player.achPow,
        autobuyers: player.autobuyers,
        costMultipliers: [new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e6), new Decimal(1e8), new Decimal(1e10), new Decimal(1e12), new Decimal(1e15)],
        tickspeedMultiplier: new Decimal(10),
        chall2Pow: 1,
        chall3Pow: new Decimal(0.01),
        newsArray: player.newsArray,
        matter: new Decimal(0),
        chall11Pow: 1,
        partInfinityPoint: player.partInfinityPoint,
        partInfinitied: player.partInfinitied,
        break: player.break,
        challengeTimes: player.challengeTimes,
        infchallengeTimes: player.infchallengeTimes,
        lastTenRuns: player.lastTenRuns,
        lastTenEternities: player.lastTenEternities,
        infMult: player.infMult,
        infMultCost: player.infMultCost,
        tickspeedBoostCost: player.tickspeedBoostCost,
        tickSpeedMultDecrease: player.tickSpeedMultDecrease,
        tickSpeedMultDecreaseCost: player.tickSpeedMultDecreaseCost,
        dimensionMultDecrease: player.dimensionMultDecrease,
        dimensionMultDecreaseCost: player.dimensionMultDecreaseCost,
        version: player.version,
        postChallUnlocked: player.postChallUnlocked,
        postC4Tier: 1,
        postC3Reward: new Decimal(1),
        spreadingCancer: player.spreadingCancer,
        infDimensionsUnlocked: player.infDimensionsUnlocked,
        infinityPower: player.infinityPower,
        infinityDimension1: player.infinityDimension1,
        infinityDimension2: player.infinityDimension2,
        infinityDimension3: player.infinityDimension3,
        infinityDimension4: player.infinityDimension4,
        infinityDimension5: player.infinityDimension5,
        infinityDimension6: player.infinityDimension6,
        infinityDimension7: player.infinityDimension7,
        infinityDimension8: player.infinityDimension8,
        infDimBuyers: player.infDimBuyers,
        timeShards: player.timeShards,
        tickThreshold: player.tickThreshold,
        timeDimension1: player.timeDimension1,
        timeDimension2: player.timeDimension2,
        timeDimension3: player.timeDimension3,
        timeDimension4: player.timeDimension4,
        eternityPoints: player.eternityPoints,
        eternities: player.eternities,
        thisEternity: player.thisEternity,
        bestEternity: player.bestEternity,
        eternityUpgrades: player.eternityUpgrades,
        epmult: player.epmult,
        epmultCost: player.epmultCost,
        totalTickGained: player.totalTickGained,
        offlineProd: player.offlineProd,
        offlineProdCost: player.offlineProdCost,
        challengeTarget: player.challengeTarget,
        timestudy: player.timestudy,
        autoIP: player.autoIP,
        autoTime: player.autoTime,
        infMultBuyer: player.infMultBuyer,
        autoCrunchMode: player.autoCrunchMode,
        respec: player.respec,
        eternityBuyer: player.eternityBuyer,
        options: player.options
        };

        if (!player.options.retryChallenge) player.currentChallenge = ""

        if (extraStartingDimsAvailable()) {
          player.extra_starting_dimensions = 0;
          for (let i = 5; i <= MAX_DIMENSION; i++) {
            if (player.infinityUpgrades.includes(i + 'dim')) {
              player.extra_starting_dimensions = i - 4;
            }
          }
        }

        // I removed a +1 that used to be here in resets + 1
        player.dimPow = initialDimPow(totalResets(), player.extra_starting_dimensions);


        if (player.currentChallenge == "challenge12" || player.currentChallenge == "postc1" || player.currentChallenge == "postc6") document.getElementById("matter").style.display = "block";
        else document.getElementById("matter").style.display = "none";

        if (player.timestudy.studies.includes(32)) {
          player.infinitied += totalResets() - 1;
        }

        if (player.achievements.includes("r36")) player.tickspeed = player.tickspeed.times(0.98);
        if (player.achievements.includes("r45")) player.tickspeed = player.tickspeed.times(0.98);
        if (player.achievements.includes("r66")) player.tickspeed = player.tickspeed.times(0.98);
        clearInterval(player.interval);
        //updateInterval();
        for (var i = 2; i <= MAX_DIMENSION; i++) {
          document.getElementById(getDimName(i).toLowerCase() + "Row").style.display = "none";
        }
        document.getElementById("tickSpeed").style.visibility = "hidden";
        document.getElementById("tickSpeedMax").style.visibility = "hidden";
        document.getElementById("tickLabel").style.visibility = "hidden";
        document.getElementById("tickSpeedAmount").style.visibility = "hidden";
        document.getElementById("matter").style.display = "none";
        document.getElementById("quickReset").style.display = "none";

        checkForEndMe()
        if (!hasAchievement("To infinity!")) {
          giveAchievement("To infinity!");
        }
        if (!player.achievements.includes("r33") && player.infinitied >= 10) giveAchievement("That's a lot of infinites");


        updateAutobuyers();
        if (hasAchievement("To infinity!")) player.money = new Decimal(100)
        if (player.achievements.includes("r37")) player.money = new Decimal(1000);
        if (player.achievements.includes("r54")) player.money = new Decimal(2e5);
        if (player.achievements.includes("r55")) player.money = new Decimal(1e10);
        if (player.achievements.includes("r78")) player.money = new Decimal(1e25);
        if (player.challenges.length >= 2 && !player.achievements.includes("r47")) giveAchievement("Daredevil");
        if (player.challenges.length == 12 && !player.achievements.includes("r48")) giveAchievement("AntiChallenged");
        resetInfDimensions();
        player.tickspeed = player.tickspeed.times(Decimal.pow(getTickSpeedMultiplier(), player.totalTickGained))
        if (player.challenges.length == 20) giveAchievement("Anti-antichallenged");
        IPminpeak = new Decimal(0)


        if (player.eternities > 10) {
            for (var i=1;i<player.eternities-9 && i < 9; i++) {
                if (player.infDimBuyers[i-1]) {
                    buyMaxInfDims(i)
                    buyManyInfinityDimension(i)
                }
            }
        }
    }
  updateChallenges();
  updateChallengeTimes()
  updateLastTenRuns()


}


function respecToggle() {
    if (player.respec) {
        player.respec = false
        document.getElementById("respec").className = "storebtn"
    } else {
        player.respec = true
        document.getElementById("respec").className = "timestudybought"
    }
}

function eternity() {
    if (player.infinityPoints.gte(Number.MAX_VALUE) && (!player.options.eternityconfirm || confirm("Eternity will reset everything except achievements and challenge records. You will also gain an Eternity point and unlock various upgrades."))) {
        if (player.thisEternity<player.bestEternity) {
            player.bestEternity = player.thisEternity
            if (player.bestEternity < 300) giveAchievement("That wasn't an eternity");
        }
        if (player.infinitied < 10) giveAchievement("Do you really need a guide for this?");
        temp = []
        player.eternityPoints = player.eternityPoints.plus(gainedEternityPoints())
        addEternityTime(player.thisEternity, gainedEternityPoints())

        for (var i=0; i<player.challenges.length; i++) {

            if (!player.challenges[i].includes("post") && player.eternities > 1) temp.push(player.challenges[i])
        }
        player.challenges = temp
        player = {
            money: new Decimal(10),
            tickSpeedCost: new Decimal(1000),
            tickspeed: new Decimal(1000),
            dimCosts: initialDimCosts(),
            dimBought: initialDimBought(),
            dimAmount: initialDimAmount(),
            dimPow: initialDimPow(0, 0),
            achievements: player.achievements,
            challenges: (player.eternities > 0) ? ["challenge1", "challenge2", "challenge3", "challenge4", "challenge5", "challenge6", "challenge7", "challenge8", "challenge9", "challenge10", "challenge11", "challenge12"] : player.challenges,
            currentChallenge: "",
            infinityUpgrades: player.infinityUpgrades,
            infinityPoints: new Decimal(0),
            infinitied: 0,
            totalTimePlayed: player.totalTimePlayed,
            bestInfinityTime: 9999999999,
            infTickspeedBoosts: 0,
            thisInfinityTime: 0,
            shiftResets: 0,
            boostResets: 0,
            extra_starting_dimensions: 0,
            tickDecrease: 0.9,
            totalmoney: player.totalmoney,
            interval: null,
            lastUpdate: player.lastUpdate,
            achPow: player.achPow,
            autobuyers: (player.eternities > 0) ? player.autobuyers : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            partInfinityPoint: 0,
            partInfinitied: 0,
            break: player.eternities > 0 ? player.break : false,
            costMultipliers: [new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e6), new Decimal(1e8), new Decimal(1e10), new Decimal(1e12), new Decimal(1e15)],
            tickspeedMultiplier: new Decimal(10),
            chall2Pow: 1,
            chall3Pow: new Decimal(0.01),
            newsArray: player.newsArray,
            matter: new Decimal(0),
            chall11Pow: 1,
            challengeTimes: player.challengeTimes,
            infchallengeTimes: player.infchallengeTimes,
            lastTenRuns: [[600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)]],
            lastTenEternities: player.lastTenEternities,
            infMult: new Decimal(1),
            infMultCost: new Decimal(10),
            tickspeedBoostCost: new Decimal(100),
            tickSpeedMultDecrease: player.eternities > 18 ? player.tickSpeedMultDecrease : 10,
            tickSpeedMultDecreaseCost: player.eternities > 18 ? player.tickSpeedMultDecreaseCost : 3e6,
            dimensionMultDecrease: player.eternities > 18 ? player.dimensionMultDecrease : 10,
            dimensionMultDecreaseCost: player.eternities > 18 ? player.dimensionMultDecreaseCost : 1e8,
            version: player.version,
            postChallUnlocked: 0,
            postC4Tier: 1,
            postC3Reward: new Decimal(1),
            spreadingCancer: player.spreadingCancer,
            infDimensionsUnlocked: [false, false, false, false, false, false, false, false],
            infinityPower: new Decimal(1),
            infinityDimension1 : {
                cost: new Decimal(1e8),
                amount: new Decimal(0),
                bought: 0,
                power: new Decimal(1),
                baseAmount: 0
            },
            infinityDimension2 : {
                cost: new Decimal(1e9),
                amount: new Decimal(0),
                bought: 0,
                power: new Decimal(1),
                baseAmount: 0
            },
            infinityDimension3 : {
                cost: new Decimal(1e10),
                amount: new Decimal(0),
                bought: 0,
                power: new Decimal(1),
                baseAmount: 0
            },
            infinityDimension4 : {
                cost: new Decimal(1e20),
                amount: new Decimal(0),
                bought: 0,
                power: new Decimal(1),
                baseAmount: 0
            },
            infinityDimension5 : {
                cost: new Decimal(1e140),
                amount: new Decimal(0),
                bought: 0,
                power: new Decimal(1),
                baseAmount: 0
            },
            infinityDimension6 : {
                cost: new Decimal(1e200),
                amount: new Decimal(0),
                bought: 0,
                power: new Decimal(1),
                baseAmount: 0
            },
            infinityDimension7 : {
                cost: new Decimal(1e250),
                amount: new Decimal(0),
                bought: 0,
                power: new Decimal(1),
                baseAmount: 0
            },
            infinityDimension8 : {
                cost: new Decimal(1e280),
                amount: new Decimal(0),
                bought: 0,
                power: new Decimal(1),
                baseAmount: 0
            },
            infDimBuyers: player.infDimBuyers,
            timeShards: new Decimal(0),
            tickThreshold: new Decimal(1),
            totalTickGained: 0,
            timeDimension1: player.timeDimension1,
            timeDimension2: player.timeDimension2,
            timeDimension3: player.timeDimension3,
            timeDimension4: player.timeDimension4,
            eternityPoints: player.eternityPoints,
            eternities: player.eternities+1,
            thisEternity: 0,
            bestEternity: player.bestEternity,
            eternityUpgrades: player.eternityUpgrades,
            epmult: player.epmult,
            epmultCost: player.epmultCost,
            totalTickGained: 0,
            offlineProd: player.eternities > 18 ? player.offlineProd : 0,
            offlineProdCost: player.eternities > 18 ? player.offlineProdCost : 1e7,
            challengeTarget: 0,
            timestudy: player.timestudy,
            autoIP: new Decimal(0),
            autoTime: 1e300,
            infMultBuyer: player.infMultBuyer,
            autoCrunchMode: player.autoCrunchMode,
            respec: player.respec,
            eternityBuyer: player.eternityBuyer,
            options: player.options
        };
        if (player.respec) respecTimeStudies()
        player.respec = false
        giveAchievement("Time is relative")
        if (player.eternities >= 100) giveAchievement("This mile took an Eternity");
        document.getElementById("respec").className = "storebtn"
        if (player.achievements.includes("r36")) player.tickspeed = player.tickspeed.times(0.98);
        if (player.achievements.includes("r45")) player.tickspeed = player.tickspeed.times(0.98);
        clearInterval(player.interval);
        //updateInterval();
        for (var i = 2; i <= MAX_DIMENSION; i++) {
          document.getElementById(getDimName(i).toLowerCase() + "Row").style.display = "none";
        }
        document.getElementById("tickSpeed").style.visibility = "hidden";
        document.getElementById("tickSpeedMax").style.visibility = "hidden";
        document.getElementById("tickLabel").style.visibility = "hidden";
        document.getElementById("tickSpeedAmount").style.visibility = "hidden";
        document.getElementById("matter").style.display = "none";
        document.getElementById("quickReset").style.display = "none";
        var autobuyers = document.getElementsByClassName('autoBuyerDiv')
        if (player.eternities < 2) {
            for (var i=0; i<autobuyers.length;i++) autobuyers.item(i).style.display = "none"
            document.getElementById("buyerBtnDimBoost").style.display = "inline-block"
            document.getElementById("buyerBtnGalaxies").style.display = "inline-block"
            document.getElementById("buyerBtnInf").style.display = "inline-block"
            document.getElementById("buyerBtnTickSpeed").style.display = "inline-block"
        }
        updateAutobuyers();
        if (player.achievements.includes("r37")) player.money = new Decimal(1000);
        if (player.achievements.includes("r54")) player.money = new Decimal(2e5);
        if (player.achievements.includes("r55")) player.money = new Decimal(1e10);
        if (player.achievements.includes("r78")) player.money = new Decimal(1e25);
        if (player.achievements.includes("r85")) player.infMult = player.infMult.times(4);
        if (player.achievements.includes("r93")) player.infMult = player.infMult.times(4);
        if (player.achievements.includes("r104")) player.infinityPoints = new Decimal(2e25);
        resetInfDimensions();
        updateChallenges();
        updateChallengeTimes()
        updateLastTenRuns()
        updateLastTenEternities()
        var infchalls = Array.from(document.getElementsByClassName('infchallengediv'))
        for (var i = 0; i< infchalls.length; i++) infchalls[i].style.display = "none"
        IPminpeak = new Decimal(0)
        updateMilestones()
        resetTimeDimensions()
        if (player.eternities < 20) player.autobuyers[9].bulk = 1
        document.getElementById("bulkDimboost").value = player.autobuyers[9].bulk
        document.getElementById("infinityPoints1").innerHTML = "You have <span class=\"IPAmount1\">"+shortenDimensions(player.infinityPoints)+"</span> Infinity points."
        document.getElementById("infinityPoints2").innerHTML = "You have <span class=\"IPAmount2\">"+shortenDimensions(player.infinityPoints)+"</span> Infinity points."
        if (player.eternities < 2) document.getElementById("break").innerHTML = "BREAK INFINITY"
        document.getElementById("eternitybtn").style.display = player.infinityPoints.gte(Number.MAX_VALUE) ? "inline-block" : "none"
        document.getElementById("eternityPoints2").style.display = "inline-block"
        document.getElementById("eternitystorebtn").style.display = "inline-block"
        document.getElementById("infiMult").innerHTML = "Multiply infinity points from all sources by 2 <br>currently: "+shorten(player.infMult) +"x<br>Cost: "+shortenCosts(player.infMultCost)+" IP"
        document.getElementById("tickspeedBoost").innerHTML = "Get a Tickspeed Boost (persists between infinities) <br>currently: " + player.infTickspeedBoosts + "<br>Cost: " +shortenCosts(player.tickspeedBoostCost)+ " IP";
        updateEternityUpgrades()

        playerInfinityUpgradesOnEternity()
        document.getElementById("eternityPoints2").innerHTML = "You have <span class=\"EPAmount2\">"+shortenDimensions(player.eternityPoints)+"</span> Eternity points."
    }
}

function exitChallenge() {
    document.getElementById(player.currentChallenge).innerHTML = "Start"
    startChallenge("");
    updateChallenges();
}

function startChallenge(name, target) {
  if(player.options.challConf || name == "" ? true : confirm("You will start over with just your infinity upgrades and achievements. You need to reach infinity with special conditions. NOTE: The rightmost infinity upgrade column doesn't work on challenges.")) {
    if (player.currentChallenge != "") document.getElementById(player.currentChallenge).innerHTML = "Start"
    player = {
        money: new Decimal(10),
        tickSpeedCost: new Decimal(1000),
        tickspeed: new Decimal(1000),
        dimCosts: initialDimCosts(),
        dimBought: initialDimBought(),
        dimAmount: initialDimAmount(),
        dimPow: initialDimPow(0, (extraStartingDimsAvailable() ? player.extra_starting_dimensions : 0)),
      achievements: player.achievements,
      challenges: player.challenges,
      currentChallenge: name,
      infinityUpgrades: player.infinityUpgrades,
      infinityPoints: player.infinityPoints,
      infinitied: player.infinitied,
      totalTimePlayed: player.totalTimePlayed,
      bestInfinityTime: player.bestInfinityTime,
      infTickspeedBoosts: player.infTickspeedBoosts,
      thisInfinityTime: 0,
      shiftResets: 0,
      boostResets: 0,
      extra_starting_dimensions: 0,
      tickDecrease: 0.9,
      totalmoney: player.totalmoney,
      interval: null,
      lastUpdate: player.lastUpdate,
      achPow: player.achPow,
      autobuyers: player.autobuyers,
      costMultipliers: [new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e6), new Decimal(1e8), new Decimal(1e10), new Decimal(1e12), new Decimal(1e15)],
      tickspeedMultiplier: new Decimal(10),
      chall2Pow: 1,
      chall3Pow: new Decimal(0.01),
      matter: new Decimal(0),
      newsArray: player.newsArray,
      chall11Pow: 1,
      partInfinityPoint: player.partInfinityPoint,
      partInfinitied: player.partInfinitied,
      break: player.break,
      challengeTimes: player.challengeTimes,
      infchallengeTimes: player.infchallengeTimes,
      lastTenRuns: player.lastTenRuns,
      lastTenEternities: player.lastTenEternities,
      infMult: player.infMult,
      infMultCost: player.infMultCost,
      tickspeedBoostCost: player.tickspeedBoostCost,
      tickSpeedMultDecrease: player.tickSpeedMultDecrease,
      tickSpeedMultDecreaseCost: player.tickSpeedMultDecreaseCost,
      dimensionMultDecrease: player.dimensionMultDecrease,
      dimensionMultDecreaseCost: player.dimensionMultDecreaseCost,
      version: player.version,
      postChallUnlocked: 0,
      postC4Tier: 1,
      postC3Reward: new Decimal(1),
      spreadingCancer: player.spreadingCancer,
      infDimensionsUnlocked: player.infDimensionsUnlocked,
      infinityPower: player.infinityPower,
      infinityDimension1: player.infinityDimension1,
      infinityDimension2: player.infinityDimension2,
      infinityDimension3: player.infinityDimension3,
      infinityDimension4: player.infinityDimension4,
      infinityDimension5: player.infinityDimension5,
      infinityDimension6: player.infinityDimension6,
      infinityDimension7: player.infinityDimension7,
      infinityDimension8: player.infinityDimension8,
      infDimBuyers: player.infDimBuyers,
      timeShards: player.timeShards,
      tickThreshold: player.tickThreshold,
      timeDimension1: player.timeDimension1,
      timeDimension2: player.timeDimension2,
      timeDimension3: player.timeDimension3,
      timeDimension4: player.timeDimension4,
      eternityPoints: player.eternityPoints,
      eternities: player.eternities,
      thisEternity: player.thisEternity,
      bestEternity: player.bestEternity,
      eternityUpgrades: player.eternityUpgrades,
      epmult: player.epmult,
      epmultCost: player.epmultCost,
      totalTickGained: player.totalTickGained,
      offlineProd: player.offlineProd,
      offlineProdCost: player.offlineProdCost,
      challengeTarget: target,
      timestudy: player.timestudy,
      autoIP: player.autoIP,
      autoTime: player.autoTime,
      infMultBuyer: player.infMultBuyer,
      autoCrunchMode: player.autoCrunchMode,
      respec: player.respec,
      eternityBuyer: player.eternityBuyer,
      options: player.options
    };
	if (player.currentChallenge == "challenge10" || player.currentChallenge == "postc1") {
        player.thirdCost = new Decimal(100)
        player.fourthCost = new Decimal(500)
        player.fifthCost = new Decimal(2500)
        player.sixthCost = new Decimal(2e4)
        player.seventhCost = new Decimal(2e5)
        player.eightCost = new Decimal(4e6)
    }
    if (player.currentChallenge == "postc1") player.costMultipliers = [new Decimal(1e3),new Decimal(5e3),new Decimal(1e4),new Decimal(1.2e4),new Decimal(1.8e4),new Decimal(2.6e4),new Decimal(3.2e4),new Decimal(4.2e4)];

    IPminpeak = new Decimal(0)
    if (player.currentChallenge.includes("post")) player.break = true
    if (player.achievements.includes("r36")) player.tickspeed = player.tickspeed.times(0.98);
    if (player.achievements.includes("r45")) player.tickspeed = player.tickspeed.times(0.98);
    if (player.achievements.includes("r66")) player.tickspeed = player.tickspeed.times(0.98);
    clearInterval(player.interval);
    //updateInterval();
    for (var i = 2; i <= MAX_DIMENSION; i++) {
      document.getElementById(getDimName(i).toLowerCase() + "Row").style.display = "none";
    }
    document.getElementById("tickSpeed").style.visibility = "hidden";
    document.getElementById("tickSpeedMax").style.visibility = "hidden";
    document.getElementById("tickLabel").style.visibility = "hidden";
    document.getElementById("tickSpeedAmount").style.visibility = "hidden";
    if (name == "challenge12" || player.currentChallenge == "postc1" || player.currentChallenge == "postc6") document.getElementById("matter").style.display = "block";
    else document.getElementById("matter").style.display = "none";

    if (name == "challenge12" || name == "challenge9" || name == "challenge5" || player.currentChallenge == "postc1" || player.currentChallenge == "postc4" || player.currentChallenge == "postc5" || player.currentChallenge == "postc6" || player.currentChallenge == "postc8") document.getElementById("quickReset").style.display = "inline-block";
    else document.getElementById("quickReset").style.display = "none";

    showTab('dimensions');
    updateChallenges();
    if (hasAchievement("To infinity!")) {
      player.money = new Decimal(100);
    }
    if (hasAchievement("That's fast!")) {
      player.money = new Decimal(1000);
    }
    if (hasAchievement("That's faster!")) {
      player.money = new Decimal(2e5);
    }
    if (hasAchievement("Forever isn't that long")) {
      player.money = new Decimal(1e10);
    }
    if (hasAchievement("Blink of an eye")) {
      player.money = new Decimal(1e25);
    }
    showTab("dimensions")
    if (player.infinitied >= 10) giveAchievement("That's a lot of infinites");
  }
  resetInfDimensions();
  player.tickspeed = player.tickspeed.times(Decimal.pow(getTickSpeedMultiplier(), player.totalTickGained))

  if (extraStartingDimsAvailable()) {
    player.extra_starting_dimensions = 0;
    for (let i = 5; i <= MAX_DIMENSION; i++) {
      if (player.infinityUpgrades.includes(i + 'dim')) {
        player.extra_starting_dimensions++;
      }
    }
  }
}

function getDimensionProductionPerSecond(tier) {
    if (tier > MAX_DIMENSION) {
      return 0;
    }
    let ret = Decimal.floor(player.dimAmount[tier - 1]).times(getDimensionFinalMultiplier(tier)).times(1000).dividedBy(player.tickspeed)
    if (player.currentChallenge == "challenge2" || player.currentChallenge == "postc1") {
      ret = ret.times(player.chall2Pow);
    }
    return ret;
}




function calcPerSec(amount, pow, hasMult) {
    if (!hasMult) {
      return Decimal.floor(amount).times(pow).times(player.achPow).times(timeMult()).times(player.chall2Pow).dividedBy(player.tickspeed.dividedBy(1000));
    } else {
      return Decimal.floor(amount).times(pow).times(player.achPow).times(dimMults()).times(timeMult()).times(player.chall2Pow).dividedBy(player.tickspeed.dividedBy(1000));
    }
}

document.getElementById("quickReset").onclick = function () {
    // Ok, so this is tough. Do we take away shift resets or boost resets?
    // I think we take away the difficulty and don't revert a reset.
    // That was mean in the first place, and even if it makes challenge 7
    // a bit nicer, who cares? There are a ton of other hard challenges.
    softReset(0, 'none');
}


function updateInfPower() {
    document.getElementById("infPowAmount").innerHTML = shortenMoney(player.infinityPower)
    document.getElementById("infDimMultAmount").innerHTML = shortenMoney(player.infinityPower.pow(7))
    document.getElementById("infPowPerSec").innerHTML = "You are getting " +shortenDimensions(DimensionProduction(1))+" Infinity Power per second."
}

function updateTimeShards() {
    document.getElementById("timeShardAmount").innerHTML = shortenMoney(player.timeShards)
    document.getElementById("tickThreshold").innerHTML = shortenMoney(player.tickThreshold)
    document.getElementById("timeShardsPerSec").innerHTML = "You are getting "+shortenDimensions(getTimeDimensionProduction(1))+" Timeshards per second."
}


function getNewInfReq() {
    if (!player.infDimensionsUnlocked[0]) return new Decimal("1e1100")
    else if (!player.infDimensionsUnlocked[1]) return new Decimal("1e1900")
    else if (!player.infDimensionsUnlocked[2]) return new Decimal("1e2400")
    else if (!player.infDimensionsUnlocked[3]) return new Decimal("1e10500")
    else if (!player.infDimensionsUnlocked[4]) return new Decimal("1e30000")
    else if (!player.infDimensionsUnlocked[5]) return new Decimal("1e45000")
    else if (!player.infDimensionsUnlocked[6]) return new Decimal("1e54000")
    else return new Decimal("1e60000")
}


function newDimension() {
    if (player.money.gte(getNewInfReq())) {
        if (!player.infDimensionsUnlocked[0]) player.infDimensionsUnlocked[0] = true
        else if (!player.infDimensionsUnlocked[1]) player.infDimensionsUnlocked[1] = true
        else if (!player.infDimensionsUnlocked[2]) player.infDimensionsUnlocked[2] = true
        else if (!player.infDimensionsUnlocked[3]) {
            player.infDimensionsUnlocked[3] = true
            giveAchievement("NEW DIMENSIONS???")
        }
        else if (!player.infDimensionsUnlocked[4]) player.infDimensionsUnlocked[4] = true
        else if (!player.infDimensionsUnlocked[5]) player.infDimensionsUnlocked[5] = true
        else if (!player.infDimensionsUnlocked[6]) player.infDimensionsUnlocked[6] = true
        else if (!player.infDimensionsUnlocked[7]) {
            player.infDimensionsUnlocked[7] = true
            giveAchievement("0 degrees from infinity")
        }
    }
}
var blink = true;

setInterval(function() {
    updateDimensions()
}, 50)

var nextAt = [new Decimal("1e2000"), new Decimal("1e5000"), new Decimal("1e12000"), new Decimal("1e14000"), new Decimal("1e18000"), new Decimal("1e20000"), new Decimal("1e23000"), new Decimal("1e28000")]

var goals = [new Decimal("1e850"), new Decimal("1e10500"), new Decimal("1e5000"), new Decimal("1e13000"), new Decimal("1e11111"), new Decimal("2e22222"), new Decimal("1e10000"), new Decimal("1e27000")]
setInterval(function() {
    if (getDimensionFinalMultiplier(1).gte(new Decimal("1e308")) &&
        getDimensionFinalMultiplier(2).gte(new Decimal("1e308")) &&
        getDimensionFinalMultiplier(3).gte(new Decimal("1e308")) &&
        getDimensionFinalMultiplier(4).gte(new Decimal("1e308")) &&
        getDimensionFinalMultiplier(5).gte(new Decimal("1e308")) &&
        getDimensionFinalMultiplier(6).gte(new Decimal("1e308")) &&
        getDimensionFinalMultiplier(7).gte(new Decimal("1e308")) &&
        getDimensionFinalMultiplier(8).gte(new Decimal("1e308"))) giveAchievement("Can't hold all these infinities")

    if (getDimensionFinalMultiplier(1).lt(getDimensionFinalMultiplier(2)) &&
        getDimensionFinalMultiplier(2).lt(getDimensionFinalMultiplier(3)) &&
        getDimensionFinalMultiplier(3).lt(getDimensionFinalMultiplier(4)) &&
        getDimensionFinalMultiplier(4).lt(getDimensionFinalMultiplier(5)) &&
        getDimensionFinalMultiplier(5).lt(getDimensionFinalMultiplier(6)) &&
        getDimensionFinalMultiplier(6).lt(getDimensionFinalMultiplier(7)) &&
        getDimensionFinalMultiplier(7).lt(getDimensionFinalMultiplier(8))) giveAchievement("How the antitables have turned")



    if (player.infinitied == 0) document.getElementById("infinityPoints2").style.display = "none"
    else document.getElementById("infinityPoints2").style.display = "inline-block"

    if (blink && !player.achievements.includes("r78")) {
        document.getElementById("Blink of an eye").style.display = "none"
        blink = false
    }
    else {
        document.getElementById("Blink of an eye").style.display = "block"
        blink = true
    }
    if (nextAt[player.postChallUnlocked] === undefined) {
        document.getElementById("nextchall").innerHTML = ""
    }
    else {
        document.getElementById("nextchall").innerHTML = "Next challenge unlocks at "+ shortenCosts(nextAt[player.postChallUnlocked]) + " antimatter."
        if (player.money.gte(nextAt[player.postChallUnlocked])) {
            player.postChallUnlocked += 1
            if (player.eternities > 6) player.challenges.push("postc"+player.postChallUnlocked)
            updateChallenges()
        }
    }
    let temp = 1
    for (var i=0; i < player.challenges.length; i++) {
        if (player.challenges[i].includes("post")) {
            temp *= 1.3
            document.getElementById("infchallengesbtn").style.display = "inline-block"
        }
    }
    infDimPow = temp

    if (player.money.gte(new Decimal("1e2000"))) document.getElementById("challTabButtons").style.display = "table"
    document.getElementById("eternityPoints2").innerHTML = "You have <span class=\"EPAmount2\">"+shortenDimensions(player.eternityPoints)+"</span> Eternity points."

    document.getElementById("eternitybtn").style.display = (player.infinityPoints.gte(Number.MAX_VALUE) && player.infDimensionsUnlocked[7]) ? "inline-block" : "none"


    if (player.eternities !== 0)document.getElementById("eternitystorebtn").style.display = "inline-block"
    if (player.eternities > 0) document.getElementById("infmultbuyer").style.display = "inline-block"
    if (player.eternities > 4) document.getElementById("togglecrunchmode").style.display = "inline-block"

    updateTheoremButtons()

    if (getTickSpeedMultiplier() < 0.001) giveAchievement("Do you even bend time bro?")

    if (player.eternities > 9) document.getElementById("bulklabel").innerHTML="Max dimboost interval:"

    if (player.eternities > 10) {
        for (var i=1;i<player.eternities-9 && i < 9; i++) {
            document.getElementById("infauto"+i).style.visibility = "visible"
        }
        document.getElementById("toggleallinfdims").style.visibility = "visible"
    }

    if (player.eternities !== 0) document.getElementById("eternityconf").style.display = "inline-block"
    if (player.eternities >= 40) document.getElementById("replauto1").style.visibility = "visible"
    if (player.eternities >= 60) document.getElementById("replauto2").style.visibility = "visible"
    if (player.eternities >= 80) document.getElementById("replauto3").style.visibility = "visible"
    if (player.eternities >= 100) document.getElementById("autoBuyerEter").style.display = "inline-block"

    if (player.eternities == 0) document.getElementById("pasteternities").style.display = "none"
    else document.getElementById("pasteternities").style.display = "inline-block"
    if (player.challenges.length > 1) document.getElementById("challengetimesbtn").style.display = "inline-block"
    if (player.infinitied > 0) document.getElementById("pastinfs").style.display = "inline-block"

    if (player.eternities > 10) {
        for (var i=1;i<player.eternities-9 && i < 9; i++) {
            if (player.infDimBuyers[i-1]) {
                buyMaxInfDims(i)
                buyManyInfinityDimension(i)
            }
        }
    }
}, 1000)




var postC2Count = 0;
var IPminpeak = new Decimal(0)

function addAmount(tier, amount) {
  player.dimAmount[tier - 1] = player.dimAmount[tier - 1].plus(amount);
}

function inMatterIncreasingChallenge () {
  return player.currentChallenge = 'challenge-15';
}

function startInterval() {
    setInterval(function () {
        var thisUpdate = new Date().getTime();
        if (thisUpdate - player.lastUpdate >= 21600000) giveAchievement("Don't you dare sleep")
        var diff = Math.min(thisUpdate - player.lastUpdate, 21600000);
        diff = diff / 100;
        if (diff < 0) diff = 1;
        if (player.thisInfinityTime < -10) player.thisInfinityTime = Infinity
        if (player.bestInfinityTime < -10) player.bestInfinityTime = Infinity
        if (diff > player.autoTime && !player.break) player.infinityPoints = player.infinityPoints.plus(player.autoIP.times(diff -player.autoTime))
        /*if (player.currentChallenge == "postc6" && player.matter.gte(1)) player.matter = player.matter.plus(diff/10)
        else */
        player.matter = player.matter.times(Decimal.pow(1.03 + totalResets() /200, diff));
        if (player.matter.gt(player.money) && inMatterIncreasingChallenge()) {
            softReset(0, 'none');
        }

        if (player.currentChallenge == "postc8") postc8Mult = postc8Mult.times(Math.pow(0.000000046416, diff))

        if (player.currentChallenge == "challenge3" || player.matter.gte(1)) player.chall3Pow = player.chall3Pow.times(Decimal.pow(1.00038, diff));
        player.chall2Pow = Math.min(player.chall2Pow + diff/1800, 1);
        if (player.infinityUpgrades.includes("passiveGen")) player.partInfinityPoint += diff / player.bestInfinityTime;
        if (player.partInfinityPoint >= 100) {
            player.infinityPoints = player.infinityPoints.plus(player.infMult.times(player.partInfinityPoint/10));
            player.partInfinityPoint = 0;
        }

        if (player.partInfinityPoint >= 10) {
            player.partInfinityPoint -= 10;
            player.infinityPoints = player.infinityPoints.plus(player.infMult);
        }

        if (player.infinityPoints.gte('9.99999e999')) giveAchievement("This achievement doesn't exist II");

        if (player.infinityUpgrades.includes("infinitiedGeneration")) player.partInfinitied += diff / player.bestInfinityTime;
        if (player.partInfinitied >= 50) {
            player.infinitied += Math.floor(player.partInfinitied/5)
            player.partInfinitied = 0;
        }

        if (player.partInfinitied >= 5) {
            player.partInfinitied -= 5;
            player.infinitied ++;
        }
        if (player.infinitied > 2e6) giveAchievement("2 Million Infinities")
        player.infinityPoints = player.infinityPoints.plus(bestRunIppm.times(player.offlineProd/100).times(diff/600))



        if (player.money.lte(Number.MAX_VALUE) || (player.break && player.currentChallenge == "") || (player.currentChallenge != "" && player.money.lte(player.challengeTarget))) {

            if (player.currentChallenge != "challenge7") {
                for (let tier = MAX_DIMENSION - 1; tier >= 1; --tier) {
                    addAmount(tier, getDimensionProductionPerSecond(tier + 1).times(diff / 100));
                 }
            } else {
                for (let tier = MAX_DIMENSION - 2; tier >= 1; --tier) {
                    addAmount(tier, getDimensionProductionPerSecond(tier + 2).times(diff / 100));
                }
            }

            let money_prod = getDimensionProductionPerSecond(1).times(diff/10);

            if (player.currentChallenge == "challenge3") {
              money_prod = money_prod.times(player.chall3Pow);
            }

            if (player.currentChallenge == "challenge7") {
              // Reduced production.
              money_prod = dim1_prod.div(2);
              money_prod += getDimensionProductionPerSecond(2).times(diff/10);
            }

            player.money = player.money.plus(money_prod);
            player.totalmoney = player.totalmoney.plus(money_prod);
        }

        document.getElementById("dimTabButtons").style.display = "none"

        player.totalTimePlayed += diff
        player.thisInfinityTime += diff
        player.thisEternity += diff

        if (player.eternities > 0) document.getElementById("tdtabbtn").style.display = "inline-block"

        for (let tier=1;tier<9;tier++) {
            if (tier != 8 && player.infDimensionsUnlocked[tier-1]) player["infinityDimension"+tier].amount = player["infinityDimension"+tier].amount.plus(DimensionProduction(tier+1).times(diff/100))
            if (player.infDimensionsUnlocked[tier-1]) {
                document.getElementById("infRow"+tier).style.display = "inline-block"
                document.getElementById("dimTabButtons").style.display = "inline-block"
            }
            else document.getElementById("infRow"+tier).style.display = "none"

            if (tier <4) player["timeDimension"+tier].amount = player["timeDimension"+tier].amount.plus(getTimeDimensionProduction(tier+1).times(diff/100))
        }

        if (player.eternities > 0) document.getElementById("dimTabButtons").style.display = "inline-block"


        if (player.money.gte("9.9999e9999")) giveAchievement("This achievement doesn't exist")
        if (player.money.gte("1e35000")) giveAchievement("I got a few to spare")

        player.infinityPower = player.infinityPower.plus(DimensionProduction(1).times(diff/10))

        if (player.infinityPower.gt(1)) giveAchievement("A new beginning.");
        if (player.infinityPower.gt(1e6)) giveAchievement("1 million is a lot"); //TBD
        if (player.infinityPower.gt(1e260)) giveAchievement("Minute of infinity"); //TBD

        player.timeShards = player.timeShards.plus(getTimeDimensionProduction(1).times(diff/10))

        while (player.timeShards.gte(player.tickThreshold)) {
            player.tickspeed = player.tickspeed.times(getTickSpeedMultiplier())
            if (player.timestudy.studies.includes(171)) player.tickThreshold = player.tickThreshold.times(1.25)
            else player.tickThreshold = player.tickThreshold.times(1.33)
            player.totalTickGained++;
            if (player.totalTickGained >= 308) giveAchievement("Infinite time");
            document.getElementById("totaltickgained").innerHTML = "You've gained "+shortenDimensions(player.totalTickGained)+" tickspeed upgrades."

        }
        updateTickSpeed();

        if (player.eternities == 0) {
            document.getElementById("eternityPoints2").style.display = "none"
            document.getElementById("eternitystorebtn").style.display = "none"
          }


        if (player.money.gte(Number.MAX_VALUE) && (!player.break || (player.currentChallenge != "" && player.money.gte(player.challengeTarget)))) {
            document.getElementById("bigcrunch").style.display = 'inline-block';
            if ((player.currentChallenge == "" || player.options.retryChallenge) && (player.bestInfinityTime <= 600 || player.break)) {}
            else showTab('emptiness');
        } else document.getElementById("bigcrunch").style.display = 'none';

        if (player.break && player.money.gte(Number.MAX_VALUE) && player.currentChallenge == "") {
            document.getElementById("postInfinityButton").style.display = "inline-block"
        } else {
            document.getElementById("postInfinityButton").style.display = "none"
        }


        if (player.break) document.getElementById("iplimit").style.display = "inline"
        else document.getElementById("iplimit").style.display = "none"

        var currentIPmin = gainedInfinityPoints().dividedBy(player.thisInfinityTime/600)
        if (currentIPmin.gt(IPminpeak)) IPminpeak = currentIPmin
        document.getElementById("postInfinityButton").innerHTML = "<b>Big Crunch for "+shortenDimensions(gainedInfinityPoints())+" Infinity Points</b><br>"+shortenDimensions(currentIPmin) + " IP/min"+
                                                                    "<br>Peaked at "+shortenDimensions(IPminpeak)+" IP/min"

        if (player.infMultBuyer) {
            var diff = player.infinityPoints.e - player.infMultCost.e +1

            if (diff > 0) {
                player.infMult = player.infMult.times(Decimal.pow(2, diff))
                player.infMultCost = player.infMultCost.times(Decimal.pow(10, diff))
                document.getElementById("infiMult").innerHTML = "Multiply infinity points from all sources by 2 <br>currently: "+shorten(player.infMult) +"x<br>Cost: "+shortenCosts(player.infMultCost)+" IP";
                // No tickspeed boost needed here.
                player.infinityPoints = player.infinityPoints.minus(player.infMultCost.dividedBy(10))
                if (player.autobuyers[11].priority !== undefined && player.autobuyers[11].priority !== null && player.autoCrunchMode == "amount") player.autobuyers[11].priority = player.autobuyers[11].priority.times(Decimal.pow(2, diff));
                if (player.autoCrunchMode == "amount") document.getElementById("priority12").value = player.autobuyers[11].priority
            }
        }

        document.getElementById("eternitybtn").innerHTML = (player.eternities == 0) ? "Other times await.. I need to become Eternal" : "I need to become Eternal.<br>"+"Gain "+shortenDimensions(gainedEternityPoints())+" Eternity points."

        updateMoney();
        updateCoinPerSec();
        updateInfCosts()
        updateInfinityDimensions();
        updateInfPower();
        updateTimeDimensions()
        updateTimeShards()
        if (calcPerSec(player.firstAmount, player.dimPow[0], player.infinityUpgrades.includes("18Mult")).gt(player.money)) {
        if(player.money.gt(Math.pow(10,63)) && !player.achievements.includes("r42")) giveAchievement("Supersanic");
        Marathon++;

        if (Marathon >= 300 && !player.achievements.includes("r44")) giveAchievement("Over in 30 seconds");
        } else {
        Marathon = 0; }

        for (let tier = 1; tier <= MAX_DIMENSION; ++tier) {
          var name = getDimName(tier).toLowerCase();
          if ((player.currentChallenge != "challenge10" && player.currentChallenge != "postc1") ||
            tier < 3) {
            document.getElementById(name).className = canAfford(getTierCost(tier, 1)) ? 'storebtn' : 'unavailablebtn';
            document.getElementById(name + 'Max').className = canAfford(getTierCost(tier, getNumRemaining(tier))) ? 'storebtn' : 'unavailablebtn';
          } else {
            document.getElementById(name).className = player.dimAmount[tier - 3].gte(getTierCost(tier, 1)) ? 'storebtn' : 'unavailablebtn';
            document.getElementById(name + 'Max').className = player.dimAmount[tier - 3].gte(getTierCost(tier, getNumRemaining(tier))) ? 'storebtn' : 'unavailablebtn';
          }
        }

        for (var tier = 1; tier < 9; tier++) {
            if (player.infinityPoints.gte(player["infinityDimension"+tier].cost)) document.getElementById("infMax"+tier).className = "storebtn"
            else document.getElementById("infMax"+tier).className = "unavailablebtn"
        }

        for (var tier = 1; tier < 5; tier++) {
            if (player.eternityPoints.gte(player["timeDimension"+tier].cost)) document.getElementById("timeMax"+tier).className = "storebtn"
            else document.getElementById("timeMax"+tier).className = "unavailablebtn"
        }




        if (canAfford(player.tickSpeedCost)) {
            document.getElementById("tickSpeed").className = 'storebtn';
            document.getElementById("tickSpeedMax").className = 'storebtn';
        } else {
            document.getElementById("tickSpeed").className = 'unavailablebtn';
            document.getElementById("tickSpeedMax").className = 'unavailablebtn';
        }

        if (player.infinityPoints.gt(0) || player.eternities !== 0) {
            document.getElementById("infinitybtn").style.display = "block";
            checkAllInfiBtns();
            if (player.infinityPoints.gte(player.infMultCost)) {
              document.getElementById("infiMult").className = "infinimultbtn";
            } else {
              document.getElementById("infiMult").className = "infinistorebtnlocked";
            }
            if (player.infinityPoints.gte(player.tickspeedBoostCost)) {
              document.getElementById("tickspeedBoost").className = "infinimultbtn";
            } else {
              document.getElementById("tickspeedBoost").className = "infinistorebtnlocked";
            }
        }
        if (player.infinityPoints.equals(0)){
            lockAllInfiBtns();
            document.getElementById("infiMult").className = "infinistorebtnlocked"
            document.getElementById("tickspeedBoost").className = "infinistorebtnlocked"
        }

        if (player.autobuyers[11]%1 === 0 || player.autobuyers[11].interval>100) document.getElementById("break").className = "infinistorebtnlocked"
        else document.getElementById("break").className = "infinistorebtn2"

        if (player.autobuyers[11].interval == 100) document.getElementById("abletobreak").style.display = "none"


        document.getElementById("infinitybtn").style.display = "none";
        document.getElementById("challengesbtn").style.display = "none";

        if (player.money.gte(Number.MAX_VALUE) && (((player.currentChallenge != "" && player.money.gte(player.challengeTarget)) && !player.options.retryChallenge) || (player.bestInfinityTime > 600 && !player.break))) {
            document.getElementById("dimensionsbtn").style.display = "none";
            document.getElementById("optionsbtn").style.display = "none";
            document.getElementById("statisticsbtn").style.display = "none";
            document.getElementById("achievementsbtn").style.display = "none";
            document.getElementById("challengesbtn").style.display = "none";
            document.getElementById("infinitybtn").style.display = "none";
            document.getElementById("tickSpeed").style.visibility = "hidden";
            document.getElementById("tickSpeedMax").style.visibility = "hidden";
            document.getElementById("tickLabel").style.visibility = "hidden";
            document.getElementById("tickSpeedAmount").style.visibility = "hidden";
        } else {
            document.getElementById("dimensionsbtn").style.display = "inline-block";
            document.getElementById("optionsbtn").style.display = "inline-block";
            document.getElementById("statisticsbtn").style.display = "inline-block";
            document.getElementById("achievementsbtn").style.display = "inline-block";
            if (player.infinitied > 0) {
                document.getElementById("infinitybtn").style.display = "inline-block";
                document.getElementById("challengesbtn").style.display = "inline-block";
            }

        }

        document.getElementById("epmult").className = player.eternityPoints.gte(player.epmultCost) ? "eternityupbtn" : "eternityupbtnlocked"

        if (player.infinityUpgrades.includes("bulkBoost")) document.getElementById("bulkdimboost").style.display = "inline"
        else document.getElementById("bulkdimboost").style.display = "none"

        checkBoughtAllInfiBtns();

        if (player.currentChallenge !== "") {
            document.getElementById("progressbar").style.width = Decimal.min((Decimal.log10(player.money.plus(1)) / Decimal.log10(player.challengeTarget) * 100), 100).toFixed(2) + "%"
            document.getElementById("progressbar").innerHTML = Decimal.min((Decimal.log10(player.money.plus(1)) / Decimal.log10(player.challengeTarget) * 100), 100).toFixed(2) + "%"
            document.getElementById("progress").setAttribute('ach-tooltip',"Percentage to challenge goal")
        } else if (!player.break) {
            document.getElementById("progressbar").style.width = Decimal.min((Decimal.log10(player.money.plus(1)) / Decimal.log10(Number.MAX_VALUE) * 100), 100).toFixed(2) + "%"
            document.getElementById("progressbar").innerHTML = Decimal.min((Decimal.log10(player.money.plus(1)) / Decimal.log10(Number.MAX_VALUE) * 100), 100).toFixed(2) + "%"
            document.getElementById("progress").setAttribute('ach-tooltip',"Percentage to Infinity")
        } else if (player.infDimensionsUnlocked.includes(false)) {
            document.getElementById("progressbar").style.width = Decimal.min(player.money.e / getNewInfReq().e * 100, 100).toFixed(2) + "%"
            document.getElementById("progressbar").innerHTML = Decimal.min(player.money.e / getNewInfReq().e * 100, 100).toFixed(2) + "%"
            document.getElementById("progress").setAttribute('ach-tooltip',"Percentage to next dimension unlock")
        } else {
            document.getElementById("progressbar").style.width = Decimal.min(Decimal.log10(player.infinityPoints.plus(1)) / Decimal.log10(Number.MAX_VALUE)  * 100, 100).toFixed(2) + "%"
            document.getElementById("progressbar").innerHTML = Decimal.min(Decimal.log10(player.infinityPoints.plus(1)) / Decimal.log10(Number.MAX_VALUE)  * 100, 100).toFixed(2) + "%"
            document.getElementById("progress").setAttribute('ach-tooltip',"Percentage to Eternity")
        }

        if (player.eternities > 0) document.getElementById("infinitybtn").style.display = "inline-block";

        var scale1 = [2.82e-45,1e-42,7.23e-30,5e-21,9e-17,6.2e-11,5e-8,3.555e-6,7.5e-4,1,2.5e3,2.6006e6,3.3e8,5e12,4.5e17,1.08e21,1.53e24,1.41e27,5e32,8e36,1.7e45,1.7e48,3.3e55,3.3e61,5e68,1e73,3.4e80,1e113,Number.MAX_VALUE];
        var scale2 = [" protons."," nucleuses."," Hydrogen atoms."," viruses."," red blood cells."," grains of sand."," grains of rice."," teaspoons."," wine bottles."," fridge-freezers."," Olympic-sized swimming pools."," Great Pyramids of Giza."," Great Walls of China."," large asteroids.",
                    " dwarf planets."," Earths."," Jupiters."," Suns."," red giants."," hypergiant stars."," nebulas."," Oort clouds."," Local Bubbles."," galaxies."," Local Groups."," Sculptor Voids."," observable universes."," Dimensions.", " Infinity Dimensions."];
        var id = 0;
        if (player.money.times(4.22419e-105).gt(2.82e-45)) {
            if (player.money.times(4.22419e-105).gt(scale1[scale1.length - 1])) id = scale1.length - 1;
            else {
                while (player.money.times(4.22419e-105).gt(scale1[id])) id++;
                if (id > 0) id--;
            }
            if (id >= 7 && id < 11) document.getElementById("infoScale").innerHTML = "If every antimatter were a planck volume, you would have enough to fill " + formatValue(player.options.notation, player.money * 4.22419e-105 / scale1[id], 2, 1) + scale2[id];
            else document.getElementById("infoScale").innerHTML = "If every antimatter were a planck volume, you would have enough to make " + formatValue(player.options.notation, player.money.times(4.22419e-105).dividedBy(scale1[id]), 2, 1) + scale2[id];
        } else { //does this part work correctly? i doubt it does
            if (player.money.times(1e-54) < 2.82e-45) document.getElementById("infoScale").innerHTML = "If every antimatter were " + formatValue(player.options.notation,2.82e-45 / 1e-54 / player.money, 2, 1) + " attometers cubed, you would have enough to make a proton.";
            else if (player.money * 1e-63 < 2.82e-45) document.getElementById("infoScale").innerHTML = "If every antimatter were " + formatValue(player.options.notation,2.82e-45 / 1e-63 / player.money, 2, 1) + " zeptometers cubed, you would have enough to make a proton.";
            else if (player.money * 1e-72 < 2.82e-45) document.getElementById("infoScale").innerHTML = "If every antimatter were " + formatValue(player.options.notation,2.82e-45 / 1e-72 / player.money, 2, 1) + " yoctometers cubed, you would have enough to make a proton.";
            else document.getElementById("infoScale").innerHTML = "If every antimatter were " + formatValue(player.options.notation,2.82e-45 / 4.22419e-105 / player.money, 2, 1) + " planck volumes, you would have enough to make a proton.";
        }

        setShiftAndBoostDisplay();

        if (player.currentChallenge == "challenge2" || player.currentChallenge == "postc1") document.getElementById("chall2Pow").style.display = "inline-block"
        else document.getElementById("chall2Pow").style.display = "none"
        if (player.currentChallenge == "challenge3" || player.currentChallenge == "postc1") document.getElementById("chall3Pow").style.display = "inline-block"
        else document.getElementById("chall3Pow").style.display = "none"

        document.getElementById("chall2Pow").innerHTML = (player.chall2Pow*100).toFixed(2) + "%"
        document.getElementById("chall3Pow").innerHTML = shorten(player.chall3Pow*100) + "%"


        if (player.infDimensionsUnlocked[7] == false && player.break) {
            document.getElementById("newDimensionButton").style.display = "inline-block"
        } else document.getElementById("newDimensionButton").style.display = "none"

        if (player.money.gte(getNewInfReq())) document.getElementById("newDimensionButton").className = "newdim"
        else document.getElementById("newDimensionButton").className = "newdimlocked"

        if (player.eternities > 24 && getNewInfReq().lt(player.money)) newDimension()

        document.getElementById("newDimensionButton").innerHTML = "Get " + shortenCosts(getNewInfReq()) + " antimatter to unlock a new Dimension."

        if (player.dimPow[0] >= 10e30) giveAchievement("I forgot to nerf that")
        if (player.money >= 10e79) giveAchievement("Antimatter Apocalypse")
        if (player.totalTimePlayed >= 10 * 60 * 60 * 24 * 12) giveAchievement("One for each dimension")
        if (player.seventhAmount > 1e12) giveAchievement("Multidimensional");
        if (isNaN(player.totalmoney)) player.totalmoney = new Decimal(10)

        player.lastUpdate = thisUpdate;
    }, 50);
}


function dimBoolean() {
    if (!player.autobuyers[9].isOn) {
      return false;
    }
    if (player.autobuyers[9].ticks*100 < player.autobuyers[9].interval) {
      return false;
    }
    if (player.eternities < 10 && canReset('shift', player.autobuyers[9].bulk)) {
      return false;
    }
    // Removed some weird priority stuff here.
    return true
}

function maxBuyDimShifts () {
    while (canReset('shift')) {
        player.shiftResets++;
    }
    softReset(0, 'none');
}

var timer = 0
function autoBuyerTick() {

    if (player.eternities >= 100 && player.eternityBuyer.isOn && gainedEternityPoints().gte(player.eternityBuyer.limit)) eternity()

    if (player.autobuyers[11]%1 !== 0) {
    if (player.autobuyers[11].ticks*100 >= player.autobuyers[11].interval && player.money.gte(Number.MAX_VALUE)) {
        if (player.autobuyers[11].isOn) {
            if (player.autoCrunchMode == "amount") {
                if (!player.break || player.currentChallenge != "" || player.autobuyers[11].priority.lt(gainedInfinityPoints())) {
                    autoS = false;
                    document.getElementById("bigcrunch").click()
                }
            } else if (player.autoCrunchMode == "time"){
                if (!player.break || player.currentChallenge != "" || player.autobuyers[11].priority.lt(player.thisInfinityTime/10)) {
                    autoS = false;
                    document.getElementById("bigcrunch").click()
                }
            } else {
                if (!player.break || player.currentChallenge != "" || gainedInfinityPoints().gte(player.lastTenRuns[0][1].times(player.autobuyers[11].priority))) {
                    autoS = false;
                    document.getElementById("bigcrunch").click()
                }
            }
            player.autobuyers[11].ticks = 1;
        }
    } else player.autobuyers[11].ticks += 1;

    }


    if (player.autobuyers[9]%1 !== 0) {
        if (player.autobuyers[9].isOn && dimBoolean()) {
            softReset(player.autobuyers[9].bulk, 'shift');
            player.autobuyers[9].ticks = 0;
        }
        player.autobuyers[9].ticks += 1;
    }




    for (var i=0; i<priority.length; i++) {
        if (priority[i].ticks*100 >= priority[i].interval || priority[i].interval == 100) {
            if ((priority[i].isOn && canBuyDimension(priority[i].tier)) ) {
                if (priority[i] == player.autobuyers[8] ) {
                    if (priority[i].target == 10) buyMaxTickSpeed()
                    else buyTickSpeed()
                } else {
                    if (priority[i].target > 10) {

                        if (player.options.bulkOn) buyManyDimensionAutobuyer(priority[i].target-10, priority[i].bulk)
                        else buyManyDimensionAutobuyer(priority[i].target-10, 1)
                    }
                    else {
                        buyOneDimension(priority[i].target)
                    }
                }
                priority[i].ticks = 0;
            }
        } else priority[i].ticks += 1;
    }
    updateCosts()

}


setInterval(function() {
    timer += 0.05
    if (!player.infinityUpgrades.includes("autoBuyerUpgrade")) autoBuyerTick()
}, 100);

setInterval(function() {
    if (player.infinityUpgrades.includes("autoBuyerUpgrade")) autoBuyerTick()
}, 50);

// news in news.js

var s = document.getElementById('news');
document.addEventListener("visibilitychange", function() {if (!document.hidden) {scrollNextMessage();}}, false);
var scrollTimeouts = [];

function randomChoice (a) {
  let idx = Math.floor(Math.random() * a.length);
  return a[idx];
}

function scrollNextMessage() {
  //select a message at random
  let msg = randomChoice(newsArray);
  while (msg in specialNews) {
    msg = randomChoice(specialNews[msg]);
  }

  scrollTimeouts.forEach(function(v) {clearTimeout(v);});
  scrollTimeouts = [];

  //set the text
  s.innerHTML = msg;

  //get the parent width so we can start the message beyond it
  let parentWidth = s.parentElement.clientWidth;

  //set the transition to blank so the move happens immediately
  s.style.transition = '';
  //move div_text to the right, beyond the edge of the div_container
  s.style.transform = 'translateX('+parentWidth+'px)';

  //we need to use a setTimeout here to allow the browser time to move the div_text before we start the scrolling
  scrollTimeouts.push(setTimeout( function() {
    //distance to travel is s.parentElement.clientWidth + s.clientWidth + parent padding
    //we want to travel at rate pixels per second so we need to travel for (distance / rate) seconds
    let dist = s.parentElement.clientWidth + s.clientWidth + 20; //20 is div_container padding
    let rate = 100; //change this value to change the scroll speed
    let transformDuration = dist / rate;

    if (!player.options.newsHidden) {
        if (!player.newsArray.includes(msg)) {
          player.newsArray.push(msg);
        }
        if (player.newsArray.length >= 10 && !hasAchievement("Fake News")) {
          giveAchievement("Fake News");
        }
    }

    if (hasAchievement("Fake News")) {
      player.newsArray = [];
    }


    //set the transition duration
    s.style.transition = 'transform '+transformDuration+'s linear';
    let textWidth = s.clientWidth;
    //we need to move it to -(width+parent padding) before it won't be visible
    s.style.transform = 'translateX(-'+(textWidth+5)+'px)';
    //automatically start the next message scrolling after this one finishes
    //you could add more time to this timeout if you wanted to have some time between messages
    scrollTimeouts.push(setTimeout(scrollNextMessage, Math.ceil(transformDuration * 1000)));
  }, 100));
}

//start scrolling
scrollNextMessage();

for (var i of challengeList) {
  document.getElementById(i).onclick = function () {
    startChallenge(i, Number.MAX_VALUE)
  }
}

function showInfTab(tabName) {
    //iterate over all elements in div_tab class. Hide everything that's not tabName and show tabName
    var tabs = document.getElementsByClassName('inftab');
    var tab;
    for (var i = 0; i < tabs.length; i++) {
        tab = tabs.item(i);
        if (tab.id === tabName) {
            tab.style.display = 'block';
        } else {
            tab.style.display = 'none';
        }
    }
}

function showStatsTab(tabName) {
    //iterate over all elements in div_tab class. Hide everything that's not tabName and show tabName
    var tabs = document.getElementsByClassName('statstab');
    var tab;
    for (var i = 0; i < tabs.length; i++) {
        tab = tabs.item(i);
        if (tab.id === tabName) {
            tab.style.display = 'block';
        } else {
            tab.style.display = 'none';
        }
    }
}

function showDimTab(tabName) {
    //iterate over all elements in div_tab class. Hide everything that's not tabName and show tabName
    var tabs = document.getElementsByClassName('dimtab');
    var tab;
    for (var i = 0; i < tabs.length; i++) {
        tab = tabs.item(i);
        if (tab.id === tabName) {
            tab.style.display = 'block';
        } else {
            tab.style.display = 'none';
        }
    }
}

function showChallengesTab(tabName) {
    //iterate over all elements in div_tab class. Hide everything that's not tabName and show tabName
    var tabs = document.getElementsByClassName('challengeTab');
    var tab;
    for (var i = 0; i < tabs.length; i++) {
        tab = tabs.item(i);
        if (tab.id === tabName) {
            tab.style.display = 'block';
        } else {
            tab.style.display = 'none';
        }
    }
}

function showEternityTab(tabName) {
    //iterate over all elements in div_tab class. Hide everything that's not tabName and show tabName
    var tabs = document.getElementsByClassName('eternitytab');
    var tab;
    for (var i = 0; i < tabs.length; i++) {
        tab = tabs.item(i);
        if (tab.id === tabName) {
            tab.style.display = 'block';
        } else {
            tab.style.display = 'none';
        }
    }
    resizeCanvas();
    drawStudyTree();
}

const allAchievements = {};
const revAchieveDict = {};

function initAllAchievements () {
  for (var i = 0; i < AchievementsText.length; i++) {
    for (var j = 0; j < AchievementsText[i].length; j++) {
      allAchievements['r' + (i + 1) + (j + 1)] = AchievementsText[i][j].text
      revAchieveDict[AchievementsText[i][j].text] = 'r' + (i + 1) + (j + 1);
    }
  }
}

function loadAchievements () {
  var e = document.getElementById('ach-table');
  removeAllChildren(e);
  for (let index = 0; index < AchievementsText.length; index++) {
    let i = AchievementsText[index];
    let tr = document.createElement('tr');
    tr.id = 'achRow' + (index + 1);
    e.appendChild(tr);
    for (let j of i) {
      var td = document.createElement('td');
      var div = document.createElement('div');
      div.id = j.text;
      div.className = "achievement achievementlocked";
      div.style = "font-size: 100%;";
      div.setAttribute('ach-tooltip', j.tooltip);
      div.appendChild(document.createTextNode(j.text));
      div.appendChild(document.createElement('br'));
      td.appendChild(div);
      tr.appendChild(td);
    }
  }
}

var infiNameToId = {};

var infiIdToName = {};

var infiNameToText = {};

function infBuyClosure(i, j, cost) {
  let prereq = 'infi' + (j + 1) + i;
  let current = 'infi' + (j + 1) + (i + 1);
  return function () {
      if (i === 0 || player.infinityUpgrades.includes(infiIdToName[prereq])) {
        buyInfinityUpgrade(infiIdToName[current], cost);
      }
  }
}

function loadInfinityUpgrades () {
  var e = document.getElementById('infupgrades');
  removeAllChildren(e);
  for (let i = 0; i < infinityUpgrades.length; i++) {
    let tr = document.createElement('tr');
    for (let j = 0; j < infinityUpgrades[i].length; j++) {
      let td = document.createElement('td');
      let bt = document.createElement('button');
      bt.id = 'infi' + (j + 1) + (i + 1);
      bt.class = 'infinistorebtn' + (j + 1);
      bt.onclick = infBuyClosure(i, j, infinityUpgrades[i][j].cost);
      td.appendChild(bt);
      tr.appendChild(td);
      infiNameToId[infinityUpgrades[i][j].name] = 'infi' + (j + 1) + (i + 1);
      infiIdToName['infi' + (j + 1) + (i + 1)] = infinityUpgrades[i][j].name;
      infiNameToText[infinityUpgrades[i][j].name] = infinityUpgrades[i][j].text;
    }
    e.appendChild(tr);
  }
}

var hasDoubledTime = function () {
  return player.infinityUpgrades.includes('timeLonger');
}

var challengeBonus = function () {
  return Math.pow(1.1, player.challenges.length);
}

var achBonus = function () {
  return Math.pow(1.1, player.achievements.length);
}

var infInterpolDict = {
  infinitied: function () {
    return formatValue(player.options.notation, dimMults(), 1, 1);
  },
  lnLnInfinitied: function () {
    return Math.log(Math.log(player.infinitied)).toFixed(2);
  },
  timeProdIncrease: function () {
    let factor = hasDoubledTime() ? 1 : .5;
    return (Math.pow(factor * player.totalTimePlayed / 600, 0.15)).toFixed(2)
  },
  currProdIncrease: function () {
    let factor = hasDoubledTime() ? 2 : 1;
    return Decimal.max(Math.pow(factor * player.thisInfinityTime / 2400, 0.25), 1).toFixed(2)
  },
  unspentBonus: function () {
    return formatValue(player.options.notation, player.infinityPoints.dividedBy(2).pow(1.5).plus(1), 2, 2);
  },
  dimShiftPower: function () {
    return getDimensionBoostPower();
  },
  newDimShiftPower: function () {
    return getDimensionBoostPower() + 0.5;
  },
  tickspeedBoostPower: function () {
    return getPerTickspeedBoost();
  },
  twiceTickspeedBoostPower: function () {
    return getPerTickspeedBoost() * 2;
  },
  fastest: function () {
    return shortenDimensions(player.infMult) + " every " + timeDisplay(player.bestInfinityTime);
  },
  tenTimesFastest: function () {
    return shortenDimensions(player.infMult) + " every " + timeDisplay(player.bestInfinityTime * 10);
  },
  challengeBonus: function () {
    return challengeBonus().toFixed(2);
  },
  achBonus: function () {
    return achBonus().toFixed(2);
  }
}

var lockAllInfiBtns = function () {
  for (var i in infiIdToName) {
    document.getElementById(i).className = 'infinistorebtnlocked';
  }
}

var checkBoughtAllInfiBtns = function () {
  for (var i in infiNameToId) {
    if (player.infinityUpgrades.includes(i)) {
      document.getElementById(infiNameToId[i]).className = 'infinistorebtnbought';
    }
  }
}

var checkAllInfiBtns = function () {
  for (let i = 0; i < infinityUpgrades.length; i++) {
    for (let j = 0; j < infinityUpgrades[i].length; j++) {
      let e = document.getElementById('infi' + (j + 1) + (i + 1));
      if ((i === 0 || player.infinityUpgrades.includes(infinityUpgrades[i - 1][j].name)) &&
      player.infinityPoints.gte(infinityUpgrades[i][j].cost)) {
        e.className = 'infinistorebtn' + (j + 1);
      } else {
        e.className = 'infinistorebtnlocked';
      }
    }
  }
}

function infiWrite () {
  for (var i in infiNameToId) {
    let e = document.getElementById(infiNameToId[i]);
    e.innerHTML = infiNameToText[i].replace(/\{\w+\}/g, function (x) {
      x = x.slice(1, -1);
      if (!(x in infInterpolDict)) {
        throw new Error('Weird interpolation ' + x);
      }
      return infInterpolDict[x]();
    });
  }
}

function init () {
    //setup the onclick callbacks for the buttons
    document.getElementById('dimensionsbtn').onclick = function () {
        showTab('dimensions');
    };
    document.getElementById('optionsbtn').onclick = function () {
        showTab('options');
    };
    document.getElementById('statisticsbtn').onclick = function () {
        showTab('statistics');
    };
    document.getElementById('achievementsbtn').onclick = function () {
        showTab('achievements');
    };
    document.getElementById('challengesbtn').onclick=function () {
      showTab('challenges');
    };
    document.getElementById('infinitybtn').onclick = function () {
        showTab('infinity');
    };
    document.getElementById("eternitystorebtn").onclick = function () {
        showTab('eternitystore')
        resizeCanvas()
        drawStudyTree()
    }
    //show one tab during init or they'll all start hidden
    showTab('dimensions')
    showInfTab('preinf')
    showStatsTab('stats')
    showDimTab('antimatterdimensions')
    showChallengesTab('challenges')
    showEternityTab('timestudies')
    load_game();
    updateTickSpeed();
    updateAutobuyers();
    updateChallengeTimes();
}

setInterval(function () {
    save_game()
}, 30000);


document.getElementById("hiddenheader").style.display = "none";


window.onload = function() {
    startInterval();
    setTimeout(function() {
        document.getElementById("container").style.display = "block"
        document.getElementById("loading").style.display = "none"
    }, 1000);
}

function getDimName (i) {
  if (i <= 12) {
    return DISPLAY_NAMES[i];
  } else {
    // Works up to 20th.
    return i + 'th';
  }
}

function removeAllChildren (e) {
  while (e.children.length !== 0) {
    e.removeChild(e.children[0]);
  }
}

function reportBoughtOne(i) {
  if (i === 1 && player.dimAmount[0] >= 1e150) {
      giveAchievement("There's no point in doing that");
  }
}

function addDimension (i) {
  var d_name_title = getDimName(i);
  var d_name = d_name_title.toLowerCase();
  var tr = document.createElement('tr');
  tr.style = "font-size: 15px";
  tr.id = d_name + 'Row';
  if (i > 1) {
    tr.style.display = 'none';
  }
  var td1 = document.createElement('td');
  td1.id = d_name + 'D';
  td1.width = "32%";
  td1.appendChild(document.createTextNode(d_name_title + ' Dimension x1'));
  var td2 = document.createElement('td');
  var div = document.createElement('div');
  div.id = d_name + 'Amount';
  div.appendChild(document.createTextNode('0 (0)'));
  td2.appendChild(div);
  var td3 = document.createElement('td');
  td3.align = 'right';
  td3.width = '10%';
  var bt1 = document.createElement('button');
  bt1.id = d_name;
  bt1.style = "color:black; height: 25px; font-size: 10px; width: 135px";
  bt1['class'] = "storebtn";
  bt1.align = "right";
  bt1.onclick = function () {
      var r = buyOneDimension(i);
      if (r) {
        if ((player.currentChallenge == "challenge12" || player.currentChallenge == "postc1") && player.matter.equals(0)) {
          player.matter = new Decimal(1);
        }
        reportBoughtOne(i);
      }
  };
  bt1.appendChild(document.createTextNode('Cost: 10'));
  td3.appendChild(bt1);
  var td4 = document.createElement('td');
  td4.align = 'right';
  td4.width = '10%';
  var bt2 = document.createElement('button');
  bt2.id = d_name + 'Max';
  bt2.style = "color:black; width:210px; height: 25px; font-size: 10px";
  bt2['class'] = "storebtn";
  bt2.align = "right";
  bt2.onclick = function () {
      var r = buyManyDimension(i);
      if (r) {
        if ((player.currentChallenge == "challenge12" || player.currentChallenge == "postc1") && player.matter.equals(0)) {
          player.matter = new Decimal(1);
        }
      }
  };
  bt2.appendChild(document.createTextNode('Cost: 10'));
  td4.appendChild(bt2);
  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);
  tr.appendChild(td4);
  return tr;
}

function addDimensions () {
  var p = document.getElementById('parent');
  removeAllChildren(p);
  for (let i = 1; i <= 16; i++) {
    p.appendChild(addDimension(i));
  }
}

function setup () {
  initAllAchievements();
  loadAchievements();
  addDimensions();
  updateCosts();
  updateDimensions();
  loadInfinityUpgrades();
}

setup();

window.addEventListener('keydown', function(event) {
  if (!player.options.hotkeys) return false
  switch (event.keyCode) {
      // Toggling autobuyers has been removed. Do it like a normal person by using the autobuyers tab.

      // What the hell does g even do? REMOVING IT.
      // Looks like it buys galaxies, which is now USELESS.

      case 77: // M
          document.getElementById("maxall").onclick()
      break;

      case 83: // S = shift
          if (canReset('shift')) {
              softReset(1, 'shift');
          }
      break;

      case 84: // T
          buyMaxTickSpeed()
      break;

      case 49: // 1
          buyManyDimension(1)
      break;

      case 50: // 2
          buyManyDimension(2)
      break;

      case 51: // 3
          buyManyDimension(3)
      break;

      case 52: // 4
          buyManyDimension(4)
      break;

      case 53: // 5
          buyManyDimension(5)
      break;

      case 54: // 6
          buyManyDimension(6)
      break;

      case 55: // 7
          buyManyDimension(7)
      break;

      case 56: // 8
          buyManyDimension(8)
      break;

      case 57: // 9
          buyManyDimension(9)
      break;

      case 65: // A
          buyManyDimension(10);
      break;

      case 66: // B
          buyManyDimension(11);
      break;

      case 67: // C
          buyManyDimension(12);
      break;

      case 68: // D
          buyManyDimension(13);
      break;

      case 69: // E
          buyManyDimension(14);
      break;

      case 70: // F
          buyManyDimension(15);
      break;

      case 71: // G
          buyManyDimension(16);
      break;
  }
}, false);

window.addEventListener('keyup', function(event) {
  if (!player.options.hotkeys) return false
  switch (event.keyCode) {
      case 67: // C
          document.getElementById("bigcrunch").onclick()
      break;

      case 70: // F
          $.notify("Paying respects", "info")
      break;
  }
}, false);

init();
var totalMult = 1
var currentMult = 1
var infinitiedMult = 1
var achievementMult = 1
var challengeMult = 1
var unspentBonus = 1
var postc8Mult = new Decimal(0)
var mult18 = 1
setInterval( function() {
    totalMult = Math.pow(player.totalmoney.e+1, 0.5)
    currentMult = Math.pow(player.money.e+1, 0.5)
    if (player.timestudy.studies.includes(31)) infinitiedMult = 1 + Math.pow(Math.log10(player.infinitied+1)*10, 4)
    else infinitiedMult = 1+Math.log10(player.infinitied+1)*10
    achievementMult = Math.max(Math.pow((player.achievements.length-30), 3)/40,1)
    challengeMult = Decimal.max(10*3000/worstChallengeTime, 1)
    unspentBonus = player.infinityPoints.dividedBy(2).pow(1.5).plus(1)
    mult18 = getDimensionFinalMultiplier(1).times(getDimensionFinalMultiplier(8)).pow(0.02)
}, 500);

function generateLookUps(mode, amount) {
    if (mode == "tick") {
        let cost = new Decimal(1000)
        let multi = new Decimal(10)
        let string = "["
        for (var i=0; i<amount; i++) {
            string+= "'"+cost.toString()+"',"
            cost = cost.times(multi)
            if (cost.gte(Number.MAX_VALUE)) multi = multi.times(2)
        }
        string+= "]"
        console.log(string)
    } else if (mode == "dim") {
        let costs = [null, new Decimal(10),
        new Decimal(100),
        new Decimal(10000),
        new Decimal(1000000),
        new Decimal(1e9),
        new Decimal(1e13),
        new Decimal(1e18),
        new Decimal(1e24)]
        let multis = [null, new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e6), new Decimal(1e8), new Decimal(1e10), new Decimal(1e12), new Decimal(1e15)]
        let string = "["
        for (var tier=1; tier <9; tier++) {
            string+="["
            for (var i=0; i<amount; i++) {
                string+= "'"+costs[tier].toString()+"',"
                costs[tier] = costs[tier].times(multis[tier])
                if (costs[tier].gte(Number.MAX_VALUE)) multis[tier] = multis[tier].times(3)
            }
            string+="],"
        }
        string+= "]"
        console.log(string)
    } else console.log("Input either 'tick' or 'dim' to the first parameter")
}
