// Test.
var Marathon = 0;
var auto = false;
var autoS = true;
var secretThemeKey = 0;
const MAX_DIMENSION = 16;

const normal_infinity = Decimal.pow(2, Decimal.pow(2, 10));

const normal_corruption_start = Decimal.pow(2, Decimal.pow(2, 12));

function getChallId (chall) {
  if (typeof chall !== 'string') {
    throw new Error('Non-challenge ' + chall);
  }
  let parts = chall.split('-');
  let our_part = parts[Math.max(parts.length - 1, 0)];
  if (parseInt(our_part)) {
    return parseInt(our_part);
  } else {
    return our_part;
  }
}

function getChallName (chall) {
  let id = getChallId(chall);
  if (typeof id === 'number') {
    return 'Challenge ' + id;
  } else if (!(id in challNameDict)) {
    throw new Error('Weird challenge!');
  } else {
    return challNameDict[id];
  }
}

const autobuyerList = challengeList.map(function (i) {
  return getChallId(i);
});

var initialAutobuyers = function () {
  let d = {};
  for (let i of autobuyerList) {
    d[i] = null;
  }
  return d;
}

var initialDimCostMultLogs = function () {
  var patt = [3, 4, 5, 3, 4, 5, 4, 3, 5, 4];
  var c = 3;
  var a = [];
  for (let i = 0; i < MAX_DIMENSION; i++) {
    a.push(c);
    c = Math.round(c * (patt[i % patt.length] + 1) / patt[i % patt.length]);
  }
  return a;
}

var initialDimCostMults = function (name) {
  if (name === undefined || name === null) {
    throw new Error('Expected challenge name');
  }
  if (dimBoughtWithTwoBefore(name)) {
    return dimBoughtWithTwoBeforeCostMults(name);
  }
  let base = getCurrentBase(name);
  return initialDimCostMultLogs().map(function (x) {
    return Decimal.pow(base, x);
  })
}

function dimBoughtWithTwoBeforeCostMults(name) {
  if (name === undefined || name === null) {
    name = player.currentChallenge;
  }
  let a = [];
  for (let i = 1; i <= MAX_DIMENSION; i++) {
    a.push(new Decimal(i * (i + 1) *
      Math.pow(2, getCurrentBase(name)) / 2));
  }
  return a;
}

var initialDimCosts = function (name) {
  if (name === undefined || name === null) {
    throw new Error('Expected challenge name');
  }
  let mults = initialDimCostMults(name);
  let base = getCurrentBase(name);
  let b = [Decimal.pow(base, 1), Decimal.pow(base, 2)];
  for (let i = 0; i < MAX_DIMENSION - 2; i++) {
    b.push(b[i].times(mults[i]).times(Decimal.pow(base, Math.floor(i / 3))));
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

// same.
var initialDimTotalBought = function () {
  return initialDimBought();
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

var initialChallengeTimes = function () {
  let d = {};
  for (let i of challengeList) {
    d[i] = 600*60*24*31;
  }
  return d;
}

function get9Challenges () {
  let allChallenges = autobuyerList.filter((i) => i !== 1 && i !== 'hyper').map(
    (i) => i.toString());
  while (true) {
    alert('These are the challenges: ' + allChallenges.join(', '));
    let input = prompt('Which 9 challenges do you want to do first ' +
    '(separated by commas)? For example: ' +
    '2, 3, 4, 5, 6, 7, 8, shift, bigcrunch');
    let challenges = input.split(',').map((i) => i.trim());
    if (challenges.every((i) => allChallenges.includes(i)) &&
    challenges.every((i, index) => challenges.indexOf(i) === index) &&
    challenges.length === 9) {
      return challenges.map((i) => 'challenge-' + i);
    } else {
      alert('That was not an acceptable selection of challenges.');
    }
  }
}

const noChallenge = {'name': '', 'list': [], 'extra': {}};

function makeChallenge (challenge) {
  if (challenge === 'challenge-hyper') {
    return {'name': challenge, 'list': get9Challenges(), 'extra': {'part': 1}};
  } else {
    return {'name': challenge, 'list': [challenge], 'extra': {}};
  }
}

function inChallenge (x, challenge) {
  if (typeof x === 'string') {
    throw new Error('Bad challenge ' + x);
  }
  return x.list.includes(challenge)
}

var player = {
    money: new Decimal(10),
    tickSpeedCost: Decimal.pow(10, 3),
    tickspeed: new Decimal(1000),
    dimCosts: initialDimCosts(noChallenge),
    dimBought: initialDimBought(),
    dimTotalBought: initialDimTotalBought(),
    dimAmount: initialDimAmount(),
    dimPow: initialDimPow(0, 0),
    achievements: [],
    infinityUpgrades: [],
    challenges: [],
    currentChallenge: noChallenge,
    infinityPoints: new Decimal(0),
    infinitied: 0,
    totalTimePlayed: 0,
    bestInfinityTime: 9999999999,
    infTickspeedBoosts: 0,
    thisInfinityTime: 0,
    shiftResets: 0,
    boostResets: 0,
    dimBoostResets: 0,
    extra_starting_dimensions: 0,
    tickDecrease: 0.9,
    totalmoney: new Decimal(0),
    achPow: 1,
    newsArray: [],
    interval: null,
    lastUpdate: new Date().getTime(),
    autobuyers: initialAutobuyers(),
    costMultipliers: initialDimCostMults(noChallenge),
    chall2Pow: 1,
    chall3Pow: new Decimal(0.01),
    matter: new Decimal(0),
    partInfinityPoint: 0,
    partInfinityPoint2: 0,
    partInfinitied: 0,
    break: false,
    challengeTimes: [600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31],
    infchallengeTimes: [600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31],
    lastTenRuns: [[600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1]],
    lastTenEternities: [[600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1]],
    infMult: new Decimal(1),
    infMultCost: new Decimal(10),
    tickspeedBoostCost: new Decimal(10),
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
    challengeTarget: normal_infinity,
    corruptionStart: normal_corruption_start,
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

function getCurrentBase (x) {
  return useBase12(x) ? 12 : 10;
};

function useBase12 (x) {
  if (x === undefined || x === null) {
    throw new Error('Invalid parameter ' + x)
  }
  return inChallenge(x, 'challenge-12');
}

function getRealChallengeTarget (x) {
  if (x === undefined || x === null) {
    x = player.currentChallenge;
  }
  if (useBase12(x)) {
    return Decimal.pow(2, Decimal.pow(2, 12));
  } else {
    return normal_infinity;
  }
}

function getChallengeTarget (x) {
  if (x === undefined || x === null) {
    x = player.currentChallenge;
  }
  if (inChallenge(x, 'challenge-16')) {
    return new Decimal(2);
  }
  if (useBase12(x)) {
    return Decimal.pow(2, Decimal.pow(2, 12));
  } else {
    return normal_infinity;
  }
}

function getCorruptionStart (x) {
  if (x === undefined || x === null) {
    x = player.currentChallenge;
  }
  if (useBase12(x)) {
    return Decimal.pow(2, Decimal.pow(2, 10));
  } else {
    return normal_corruption_start;
  }
}

function needsQuickResetDisplayed(c) {
  return inChallenge(c, "challenge-7") || inChallenge(c, "challenge-9") ||
    inChallenge(c, "challenge-15") || inChallenge(c, "challenge-tickspeed");
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
    if (player.challenges === undefined) player.challenges = [];
    if (player.currentChallenge === undefined) player.currentChallenge = noChallenge;
    if (player.matter === undefined) player.matter = new Decimal(0)
    if (player.autobuyers === undefined) player.autobuyers = initialAutobuyers()
    if (player.costMultipliers === undefined) player.costMultipliers = initialDimCostMults(noChallenge)
    if (player.partInfinityPoint === undefined) player.partInfinityPoint = 0
    if (player.partInfinityPoint2 === undefined) player.partInfinityPoint2 = 0
    if (player.challengeTimes === undefined) player.challengeTimes = initialChallengeTimes();
    if (player.infchallengeTimes === undefined) player.infchallengeTimes = [600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31]
    if (player.lastTenRuns === undefined) player.lastTenRuns = [[600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1]]
    if (player.infMult === undefined) player.infMult = new Decimal(1)
    if (player.infMultCost === undefined) player.infMultCost = new Decimal(10)
    if (player.tickspeedBoostCost === undefined) player.tickspeedBoostCost = new Decimal(10)
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
        player.challengeTarget = getChallengeTarget();
    }
    if (player.corruptionStart === undefined) {
        player.corruptionStart = getCorruptionStart();
    }
    if (player.lastTenEternities === undefined) player.lastTenEternities = [[600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1]]
    if (player.respec === undefined) player.respec = false
    if (player.options.commas === undefined) player.options.commas = true

    if (typeof player.currentChallenge === 'string') {
      alert('Your save is being converted. If you were in a challenge, you now are not. ' +
      'If you were not in a challenge, you should be fine.');
      player.currentChallenge = noChallenge;
    }

    setTheme(player.options.theme);

    // First dimension
    if (player.dimAmount[0] !== 0) {
      document.getElementById("secondRow").style.display = "table-row";
    }

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
    for (var i in player.autobuyers) {
        if (player.autobuyers[i] !== null && player.autobuyers[i].target === undefined) {
          player.autobuyers[i].target = i;
        }

        if (player.autobuyers[i] !== null && player.autobuyers[i].mode === undefined) {
          player.autobuyers[i].mode = 'single';
        }

        if (player.autobuyers[i] !== null && player.autobuyers[i].priority === undefined) {
          player.autobuyers[i].priority = 1;
        }

        if (player.autobuyers[i] !== null && (player.autobuyers[i].bulk === undefined ||
          isNaN(player.autobuyers[i].bulk) || player.autobuyers[i].bulk === null)) {
          player.autobuyers[i].bulk = 1
        }
    }

    dimDisplay();

    document.getElementById("totaltickgained").innerHTML = "You've gained "+shortenDimensions(player.totalTickGained)+" tickspeed upgrades."

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

    setQuickResetDisplay();


    if (player.break == true) {
      document.getElementById("break").innerHTML = "FIX INFINITY";
    }
    document.getElementById("infiMult").innerHTML = "Multiply infinity points from all sources by 2 <br>currently: "+shortenDimensions(player.infMult) +"x<br>Cost: "+shortenCosts(player.infMultCost)+" IP"
    document.getElementById("tickspeedBoost").innerHTML = "Multiply infinity points from all sources by 2 <br>currently: "+ player.infTickspeedBoosts +"<br>Cost: "+shortenCosts(player.tickspeedBoostCost)+" IP"

    document.getElementById("notation").innerHTML = "Notation: " + player.options.notation

    if (player.infinitied == 0) document.getElementById("infinityPoints2").style.display = "none"

    setMatterDisplay();



    if (player.infMultBuyer !== undefined) {
        infMultAutoToggle()
        infMultAutoToggle()
    }

    if (player.epmult === undefined) {
        player.epmult = 1
        player.epmultCost = new Decimal(500)
    }

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
    document.getElementById("eternitybtn").style.display = (player.infinityPoints.gte(normal_infinity) || player.eternities > 0) ? "inline-block" : "none"

    player.money = new Decimal(player.money)
    player.tickSpeedCost = new Decimal(player.tickSpeedCost)
    player.tickspeed = new Decimal(player.tickspeed)
    player.dimCosts = player.dimCosts.map((i) => new Decimal(i));
    player.dimBought = player.dimBought.map((i) => new Decimal(i));
    player.dimTotalBought = player.dimTotalBought.map((i) => new Decimal(i));
    player.dimAmount = player.dimAmount.map((i) => new Decimal(i));
    player.dimPow = player.dimPow.map((i) => new Decimal(i));
    player.totalmoney = new Decimal(player.totalmoney)
    player.chall3Pow = new Decimal(player.chall3Pow)
    player.costMultipliers = player.costMultipliers.map((i) => new Decimal(i));
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
    player.postC3Reward = new Decimal(player.postC3Reward);

    player.challengeTarget = new Decimal(player.challengeTarget);
    player.corruptionStart = new Decimal(player.corruptionStart);

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

    player.epmultCost = new Decimal(player.epmultCost)
    player.eternityBuyer.limit = new Decimal(player.eternityBuyer.limit);
}


function loadAutoBuyerSettings() {
  for (let i of autobuyerList) {
    if (player.autobuyers[i]) {
      let e = document.getElementById("priority-" + i);
      if (e) {
        e.selectedIndex = player.autobuyers[i].priority - 1;
      }
      let btn = document.getElementById("toggleBtn-" + i);
      if (!btn) {
        continue;
      }
      if (i == 'tickspeed' && player.autobuyers[i].mode === 'max') {
        btn.innerHTML = "Buys max";
      } else if (i == 'tickspeed' && player.autobuyers[i].mode === 'single') {
        btn.innerHTML =  "Buys singles";
      } else if (player.autobuyers[i].mode === 'until-10') {
        btn.innerHTML = "Buys until 10";
      } else {
        btn.innerHTML = "Buys singles";
      }
    } else {
      let e = document.getElementById("priority-" + i);
      if (e) {
        e.selectedIndex = 1;
      }
    }
  }
  if (player.autobuyers['shift']) {
    document.getElementById("max-dim-shift").value = player.autobuyers['shift'].maxDimShift;
  }
  if (player.autobuyers['bigcrunch']) {
    document.getElementById("ip-bigcrunch").value = player.autobuyers['bigcrunch'].ip;
  }
  if (player.autobuyers['hyper']) {
    document.getElementById("commands-hyper").value = player.autobuyers['hyper'].commands;
  }
  document.getElementById("ep-num-eter").value = player.eternityBuyer.limit;
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

function infinityBrokenInCurrentChallenge () {
  return player.break && (player.currentChallenge.name === '' ||
  player.infinityUpgrades.includes('challengeBreak'));
}

function formatValue(notation, value, places, placesUnder1000) {
    if (((new Decimal(value)).lt(player.challengeTarget) || infinityBrokenInCurrentChallenge()) && (value >= 1000)) {
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
    if (inMatterIncreasingChallenge(player.currentChallenge)) {
      element2.innerHTML = "There is " + formatValue(player.options.notation, player.matter, 2, 1) + " matter.";
    }
}

function updateCoinPerSec() {
    var element = document.getElementById("coinsPerSec");
    element.innerHTML = 'You are getting ' + shortenDimensions(getMoneyProd()) + ' antimatter per second.';
}

function hasInfinityMult(tier) {
  if ((tier - 1) % 8 >= 4) {
    tier -= 2 * ((tier - 1) % 8 - 4) + 1;
  }

  return player.infinityUpgrades.includes(tier + 'infStat');
}



function getDimensionFinalMultiplier(tier) {

    let multiplier = new Decimal(player.dimPow[tier - 1]);

    multiplier = multiplier.times(player.achPow);

    multiplier = multiplier.times(player.infinityPower.pow(7).max(1))

    if (hasInfinityMult(tier)) multiplier = multiplier.times(dimMults());
    if (tier === 1) {
        if (player.infinityUpgrades.includes("1dimBonus")) multiplier = multiplier.times(unspentBonus);
        if (hasAchievement("There's no point in doing that")) multiplier = multiplier.times(1.1);
        if (hasAchievement("I forgot to nerf that")) multiplier = multiplier.times(1.05);
        if (hasAchievement("ERROR 909: Dimension not found")) multiplier = multiplier.times(3);
        if (hasAchievement("You did this again just for the achievement right?")) multiplier = multiplier.times(1.5);
    }

    multiplier = multiplier.times(timeMult());
    if (tier <= 11 && hasAchievement("You didn't need it anyway")) multiplier = multiplier.times(1.02);
    if (tier <= 8 && hasAchievement("The 9th dimension can be a lie")) multiplier = multiplier.times(1.02);
    if (tier <= 4 && hasAchievement("Zero Deaths")) multiplier = multiplier.times(1.25);
    if (hasAchievement("AntiChallenged")) multiplier = multiplier.times(1.1);
    if (hasAchievement("Can't hold all these infinities")) multiplier = multiplier.times(1.1); // tbd
    if (hasAchievement("End me") && player.currentChallenge.name !== "") multiplier = multiplier.times(1.4);
    if (hasAchievement("How the antitables have turned")) multiplier = multiplier.times(1+tier/100);
    if (hasAchievement("Many Deaths") && player.thisInfinityTime < 1800) multiplier = multiplier.times(3600/(player.thisInfinityTime+1800));
    if (hasAchievement("Blink of an eye") && player.thisInfinityTime < 3) multiplier = multiplier.times(3.3/(player.thisInfinityTime+0.3));
    if (hasAchievement("Not-so-challenging") && player.currentChallenge.name !== "" && player.thisInfinityTime < 1800) multiplier = multiplier.times(Math.max(2400/(player.thisInfinityTime+600), 1))
    if (hasAchievement("Ludicrous Speed") && player.thisInfinityTime < 50) multiplier = multiplier.times(Math.max(301-player.thisInfinityTime*6, 1))
    if (hasAchievement("I brake for nobody") && player.thisInfinityTime < 600) multiplier = multiplier.times(Math.max(101-player.thisInfinityTime/6, 1));
    if (hasAchievement("I got a few to spare")) {
      multiplier = multiplier.times(player.money.pow(0.00004).plus(1));
    } else if (hasAchievement("This achievement doesn't exist")) {
      multiplier = multiplier.times(player.money.pow(0.00002).plus(1));
    }


    if (player.timestudy.studies.includes(91)) multiplier = multiplier.times(Decimal.pow(10, Math.min(player.thisEternity, 18000)/60));
    if (player.timestudy.studies.includes(161)) multiplier = multiplier.times(new Decimal("1e616"))
    return multiplier;
}

function getMoneyPerSecond() {
    return getDimensionFinalMultiplier(1)*Math.floor(player.dimAmount[0])/player.tickspeed;
}

function getDimensionDescription(tier) {

    let description = shortenDimensions(player.dimAmount[tier - 1]) + ' (' + player.dimBought[tier - 1] + ')';

    description += '  (+' + formatValue(player.options.notation, getDimensionRateOfChange(tier), 2, 2) + '%/s)';

    return description;
}

function getDimensionRateOfChange(tier) {
    let toGain = getDimensionProductionPerSecond(tier + 1)
    if (inChallenge(player.currentChallenge, "challenge-bigcrunch")) {
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
    for (let tier = 2; tier <= MAX_DIMENSION; ++tier) {
        div *= tier;
        value = value.plus(getDimensionProductionPerSecond(tier).times(getDimensionProductionPerSecond(tier-1)).times(Decimal.pow(t,tier)).dividedBy(Decimal.max(player.dimAmount[tier - 1].times(div).times(10), 1))) ;
    }
    return value
}



var worstChallengeTime = 1

function updateWorstChallengeTime() {
    worstChallengeTime = 0;
    for (var i in player.challengeTimes) {
        if (player.challengeTimes[i] > worstChallengeTime) {
          worstChallengeTime = player.challengeTimes[i];
        }
    }
}

function extraStartingDimsAvailable () {
  return (player.currentChallenge.name === '') || player.infinityUpgrades.includes('fourthChallenge');
}


function getCurrentDimension () {
  let extra = extraStartingDimsAvailable() ?
    player.extra_starting_dimensions : 0;
  return player.shiftResets + extra + 4;
}

function getCurrentMaxDimension () {
  if (inChallenge(player.currentChallenge, 'challenge-8')) {
    return 8;
  } else if (inChallenge(player.currentChallenge, 'challenge-bigcrunch')) {
    return 16;
  } else if (useBase12(player.currentChallenge)) {
    return 10;
  } else {
    return 12;
  }
}

function getNumForReset (type, bulk) {
  let base = getCurrentBase(player.currentChallenge);
  let reset_num;
  if (inChallenge(player.currentChallenge, 'challenge-10')) {
    reset_num = base * base;
  } else {
    reset_num = 2 * base;
  }
  let result;
  if (type === 'shift') {
    result = reset_num;
  } else if (type === 'boost') {
    result = (player.dimBoostResets + bulk + 1) * reset_num;
  }
  if (player.infinityUpgrades.includes('dimResetDecrease1')) {
    result -= base - 1;
  }
  if (player.infinityUpgrades.includes('dimResetDecrease2')) {
    result -= 1;
  }
  return result;
}

function getCurrentBoostDimension () {
  return getCurrentDimension();
}

function getResetDimInfo (type, bulk) {
  if (!bulk) {
    bulk = 0;
  }

  if (type === 'shift') {
    return {
      'num': getNumForReset('shift', bulk),
      'dimNum': getCurrentDimension() + bulk
    };
  } else if (type === 'boost') {
    return {
      'num': getNumForReset('boost', bulk),
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

function resetAvailable (type) {
  if (type === 'shift') {
    return getCurrentDimension() < getCurrentMaxDimension();
  } else if (type === 'boost') {
    return dimBoostsApplicable();
  }
}

function dimBoostsApplicable () {
  return inChallenge(player.currentChallenge, 'challenge-8');
}

function doResetDisplayStuff () {
  if (resetAvailable('shift')) {
    document.getElementById("dimShift").style.display = 'inline';
    let info = getResetDimInfo('shift');
    document.getElementById("softResetShift").innerHTML = "Reset the game for a new Dimension";
    document.getElementById("resetLabelShift").innerHTML = 'Dimension Shift: requires ' +
    info.num + " " + getDimName(info.dimNum) + " Dimensions";
  } else {
    document.getElementById("dimShift").style.display = 'none';
  }
  if (resetAvailable('boost')) {
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
        var display_name = getDimName(tier);
        var name = display_name.toLowerCase();
        document.getElementById(name + "D").innerHTML = display_name + " Dimension x" + formatValue(player.options.notation, getDimensionFinalMultiplier(tier), 1, 1);
        document.getElementById(name + "Amount").innerHTML = getDimensionDescription(tier);
    }


    for (let tier = 1; tier <= MAX_DIMENSION; ++tier) {
        var name = getDimName(tier).toLowerCase();
        var elem = document.getElementById(name + "Row");
        if (canBuyDimension(tier)) {
          elem.style.display = "table-row";
          elem.style.visibility = "visible";
        } else {
          elem.style.display = "none";
          elem.style.visibility = "hidden";
        }
    }

    if (canBuyTickSpeed()) {
        var tickmult = getTickSpeedMultiplier(player.tickSpeedCost);
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
  for (var i = 1; i <= MAX_DIMENSION; i++) {
    document.getElementById(getDimName(i).toLowerCase()).innerHTML = 'Cost: ' + shortenCosts(getTierCost(i, 1));
  }

  for (var i = 1; i <= MAX_DIMENSION; i++) {
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
    if (player.tickspeed.lt(1e-26)) {
      giveAchievement("Faster than a potato");
    }
    if (player.tickspeed.lt(1e-52)) {
      giveAchievement("Faster than a squared potato");
    }
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

        if (player.currentChallenge.name !== "") {
            document.getElementById(player.currentChallenge.name).className = "onchallengebtn"
            document.getElementById(player.currentChallenge.name).innerHTML = "Running"
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
    // Irrelevant achievement thing here.

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
    if (hasAchievement("Infinite time")) ret = ret.div(player.tickspeed.div(1000).pow(0.000005))

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

    if (inChallenge(player.currentChallenge, "challenge-shift")) {
      return 1;
    }

    var ret = 2
    if (player.infinityUpgrades.includes('dimShiftInc1')) {
      ret += .5;
    }

    if (player.infinityUpgrades.includes('dimShiftInc2')) {
      ret += .5;
    }

    if (player.timestudy.studies.includes(81)) {
      ret = 10;
    }

    if (player.timestudy.studies.includes(83)) {
      ret = Decimal.pow(1.0001, player.totalTickGained).times(ret);
    }

    return ret;
}

function getInitialChall3Pow () {
  if (player.infinityUpgrades.includes('percentMultiply')) {
    return new Decimal(1);
  } else {
    return new Decimal(0.01);
  }
}

function setExtraStartingDims () {
  if (extraStartingDimsAvailable()) {
    player.extra_starting_dimensions = 0;
    for (let i = 5; i <= MAX_DIMENSION; i++) {
      if (player.infinityUpgrades.includes(i + 'dim') &&
      i <= getCurrentMaxDimension()) {
        player.extra_starting_dimensions = i - 4;
      }
    }
  }
}

function softReset (bulk, type) {
    if (type === 'shift') {
      player.shiftResets += bulk;
      player.dimBoostResets = 0;
    } else if (type === 'boost') {
      player.boostResets += bulk;
      player.dimBoostResets += bulk;
    } else if (type === 'none') {
      // Do nothing. We could get rid of this case,
      // but I think I found a legitimate use for an
      // empty else if clause.
    } else {
      throw new Error('Unhandled case!');
    }
    player = {
        money: new Decimal(10),
        tickSpeedCost: Decimal.pow(getCurrentBase(player.currentChallenge), 3),
        tickspeed: new Decimal(1000),
        dimCosts: initialDimCosts(player.currentChallenge),
        dimBought: initialDimBought(),
        dimTotalBought: initialDimTotalBought(),
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
        dimBoostResets: player.dimBoostResets,
        extra_starting_dimensions: player.extra_starting_dimensions,
        tickDecrease: player.tickDecrease,
        totalmoney: player.totalmoney,
        interval: null,
        lastUpdate: player.lastUpdate,
        achPow: player.achPow,
	      newsArray: player.newsArray,
        autobuyers: player.autobuyers,
        costMultipliers: initialDimCostMults(player.currentChallenge),
        chall2Pow: player.chall2Pow,
        chall3Pow: getInitialChall3Pow(),
        matter: new Decimal(0),
        partInfinityPoint: player.partInfinityPoint,
        partInfinityPoint2: player.partInfinityPoint2,
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
        corruptionStart: player.corruptionStart,
        timestudy: player.timestudy,
        autoIP: player.autoIP,
        autoTime: player.autoTime,
        infMultBuyer: player.infMultBuyer,
        autoCrunchMode: player.autoCrunchMode,
        respec: player.respec,
        eternityBuyer: player.eternityBuyer,
        options: player.options
    };
    setExtraStartingDims();

    if (hasAchievement("Faster than a potato")) {
      player.tickspeed = player.tickspeed.times(0.98);
    }
    if (hasAchievement("Faster than a squared potato")) {
      player.tickspeed = player.tickspeed.times(0.96);
    }

    clearInterval(player.interval);
    //updateInterval();

    document.getElementById("tickSpeed").style.visibility = "hidden";
    document.getElementById("tickSpeedMax").style.visibility = "hidden";
    document.getElementById("tickLabel").style.visibility = "hidden";
    document.getElementById("tickSpeedAmount").style.visibility = "hidden";


    player.tickspeed = player.tickspeed.times(Decimal.pow(getTickSpeedMultiplier(), player.totalTickGained))
    setAchInitialMoney();

    dimDisplay();

    setMatterDisplay();
    setQuickResetDisplay();
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
  let perBoost = 1 / Math.pow(getCurrentBase(player.currentChallenge), 2);
  if (player.infinityUpgrades.includes('tickspeedBoostInc1')) {
    perBoost *= 2;
  }
  if (player.infinityUpgrades.includes('tickspeedBoostInc2')) {
    perBoost *= 2;
  }
  return perBoost;
}

function alterByCorruption (result, cost) {
  return Math.pow(result, Math.min(1, Math.pow(
    player.corruptionStart.log2() / cost.log2(), 1.1)));
}

function getTickSpeedMultiplier (cost) {
  if (!cost) {
    cost = new Decimal(1);
  }
  let baseMultiplier = 1 - 1 / getCurrentBase(player.currentChallenge);
  if (inChallenge(player.currentChallenge, "challenge-5")) {
    baseMultiplier = 1 - 1 / (2 * getCurrentBase(player.currentChallenge));
  }
  let perBoost = getPerTickspeedBoost();
  let result = baseMultiplier * Math.pow(1 - perBoost, player.infTickspeedBoosts);
  let mod_result = alterByCorruption(result, cost);
  return mod_result;
}

function buyTickSpeed() {
    if (!canBuyTickSpeed()) {
        return false;
    }

    if (!canAfford(player.tickSpeedCost)) {
        return false;
    }

    let cost = player.tickSpeedCost;

    player.money = player.money.minus(cost);
    multiplyCostsTier('tickspeed');
    if (inChallenge(player.currentChallenge, "challenge-2")) {
      player.chall2Pow = 0;
    }
    player.tickspeed = player.tickspeed.times(getTickSpeedMultiplier(cost));
    postc8Mult = new Decimal(1)
    return true;
}

document.getElementById("tickSpeed").onclick = function () {
    buyTickSpeed();

    updateTickSpeed();
};

function buyMaxTickSpeed() {
  if (!canBuyTickSpeed()) return false
  var mult = getTickSpeedMultiplier(player.tickSpeedCost);
  if (inChallenge(player.currentChallenge, "challenge-2")) {
    player.chall2Pow = 0;
  }
  if (player.tickSpeedCost.lte(0)) {
    throw new Error('Too low tickspeed cost.')
  }
  while (player.money.gt(player.tickSpeedCost)) {
    player.money = player.money.minus(player.tickSpeedCost);
    multiplyCostsTier('tickspeed');
    player.tickspeed = player.tickspeed.times(mult);
    postc8Mult = new Decimal(1)
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

function giveAchievement(name) {
    if (player.achievements.includes(revAchieveDict[name])) {
        return;
    }

    if (!(name in revAchieveDict)) {
      throw new Error('Weird achievement ' + name)
    }

    $.notify(name, "success");
    player.achievements.push(revAchieveDict[name]);
    document.getElementById(name).className = "achievementunlocked";
    if (name == "All your IP are belong to us" || name == "MAXIMUM OVERDRIVE") {
        player.infMult = player.infMult.times(4);
        player.autoIP = player.autoIP.times(4);
        if (player.autoCrunchMode == "amount") {
          player.autobuyers['bigcrunch'].ip = player.autobuyers['bigcrunch'].ip.times(4);
        }
    }
    updateAchPow();
}

var TIER_NAMES = [ null, "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth" ];
var DISPLAY_NAMES = [ null, "First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth", "Ninth", "Tenth", "Eleventh", "Twelfth" ];

function canAfford(cost) {
    return ((cost.lt(player.challengeTarget) && !player.break) || player.break) && cost.lte(player.money);
}

function nearlyEqual (a, b) {
  return a.div(b).lt(1.0001) && b.div(a).lt(1.0001);
}

function multiplySameCosts(cost) {
  for (let i = 1; i <= MAX_DIMENSION; i++) {
    if (nearlyEqual(player.dimCosts[i - 1], cost)) {
      player.dimCosts[i - 1] = player.dimCosts[i - 1].times(
        getDimensionCostMultiplier(i))
    }
  }
  if (nearlyEqual(player.tickSpeedCost, cost)) {
    player.tickSpeedCost = player.tickSpeedCost.times(getCurrentBase(player.currentChallenge));
  }
}

function multiplyChall9Costs (tier) {
  let pairs = [[1, 1], [2, 4], [3, 9], [4, 16]];
  for (let [a, b] of pairs) {
    if (tier === a) {
      player.dimCosts[b - 1] = player.dimCosts[b - 1].times(
        getDimensionCostMultiplier(b));
    }
    if (tier === b) {
      player.dimCosts[a - 1] = player.dimCosts[a - 1].times(
        getDimensionCostMultiplier(a));
    }
  }
}


function canBuyDimension(tier) {
    if (tier > getCurrentDimension()) {
        return false;
    }

    if (player.dimAmount.some((i) => typeof i !== 'object')) {
      player.dimAmount = player.dimAmount.map((i) => new Decimal(i));
    }

    if (tier > 1 && player.dimAmount.slice(tier - 2).every((i) => i.equals(0))) {
        return false;
    }

    return true;
}

function getDimensionPowerMultiplier(tier, cost) {
    let dimMult = 2;

    if (inChallenge(player.currentChallenge, "challenge-7")) {
      dimMult = Math.pow(10 / 0.30, Math.random()) * 0.30
    }

    if (player.infinityUpgrades.includes('mulLn')) {
      dimMult = Math.max(dimMult, lnLnInfinitied());
    }

    if (player.infinityUpgrades.includes('multIncrease')) {
      dimMult *= 1.1;
    }
    if (hasAchievement("Is this hell?")) {
      dimMult *= 1.01;
    }

    dimMult = alterByCorruption(dimMult, cost);

    return dimMult;
}


function clearDimensions(amount) {
  for (i = 1; i <= amount; i++) {
    player.dimAmount[i - 1] = new Decimal(0);
  }
}


function getDimensionCostMultiplier(tier) {
  return player.costMultipliers[tier - 1];
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
    let oldCost = player.tickSpeedCost;
    player.tickSpeedCost = player.tickSpeedCost.times(getCurrentBase(player.currentChallenge));
    if (inChallenge(player.currentChallenge, "challenge-tickspeed")) {
      multiplySameCosts(oldCost);
    }
  } else {
    let oldCost = player.dimCosts[tier - 1];
    player.dimCosts[tier - 1] = player.dimCosts[tier - 1].times(
      getDimensionCostMultiplier(tier));
    if (inChallenge(player.currentChallenge, "challenge-9")) {
      multiplyChall9Costs(tier);
    }
    if (inChallenge(player.currentChallenge, "challenge-tickspeed")) {
      multiplySameCosts(oldCost);
    }
  }
}

function checkTier (tier) {
  if (typeof tier !== 'number' || tier <= 0 || tier > MAX_DIMENSION) {
    throw new Error('Bad tier ' + tier);
  }
}

function getTierCost(tier, n) {
  return player.dimCosts[tier - 1].times(n)
}

function getNumRemaining(tier) {
  return getCurrentBase(player.currentChallenge) - player.dimBought[tier - 1];
}

function maxAllowedTier () {
  if (inChallenge(player.currentChallenge, 'challenge-11')) {
    return 121;
  } else {
    return Infinity;
  }
}

function tooManyBought (tier, number) {
  return player.dimTotalBought[tier - 1] + number > maxAllowedTier();
}

function gotDimension (tier, boughtSomething) {
  if (inChallenge(player.currentChallenge, "challenge-2")) {
    player.chall2Pow = 0;
  }
  if (inChallenge(player.currentChallenge, "challenge-4") && boughtSomething) {
    clearDimensions(tier-1);
  }
}

function buyOneDimension(tier) {
    checkTier(tier);
    var cost = getTierCost(tier, 1);
    auto = false;

    if (!dimBoughtWithTwoBefore()) {
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



    if (!dimBoughtWithTwoBefore()) {
        if (!canAfford(cost)) {
            return false;
        }
    }

    if (tooManyBought(tier, 1)) {
      return false;
    }


    if (!dimBoughtWithTwoBefore() || tier < 3) {
        player.money = player.money.minus(cost);
    } else {
        // Buy with dimension two earlier.
        player.dimAmount[tier - 3] = player.dimAmount[tier - 3].minus(cost);
    }

    // Buy one.
    addAmount(tier, 1);
    player.dimBought[tier - 1]++;
    player.dimTotalBought[tier - 1]++;

    if (player.dimBought[tier - 1] === getCurrentBase(player.currentChallenge)) {
        player.dimBought[tier - 1] = 0;
        // Increase power.
        player.dimPow[tier - 1] = player.dimPow[tier - 1].times(getDimensionPowerMultiplier(tier, player.dimCosts[tier - 1]));
        multiplyCostsTier(tier);
    }

    gotDimension(tier, true);

    onBuyDimension(tier, 'one');

    return true;
}

function buyManyDimension(tier) {
    checkTier(tier);
    let one_cost = getTierCost(tier, 1);
    let cost = getTierCost(tier, getNumRemaining(tier));
    auto = false;

    if (inMatterIncreasingChallenge(player.currentChallenge) && player.matter.equals(0)) {
      player.matter = new Decimal(1);
    }
    if (!dimBoughtWithTwoBefore()) {
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

    if (!dimBoughtWithTwoBefore()) {
        if (!canAfford(cost)) {
            return false;
        }
    }

    let remaining = getNumRemaining(tier);

    if (tooManyBought(tier, remaining)) {
      return false;
    }

    if (!dimBoughtWithTwoBefore() || tier < 3) {
        player.money = player.money.minus(cost);
    } else {
      // Buy with dimension two earlier.
      player.dimAmount[tier - 3] = player.dimAmount[tier - 3].minus(cost);
    }

    addAmount(tier, remaining);
    player.dimBought[tier - 1] = 0;
    player.dimTotalBought[tier - 1] += remaining;
    player.dimPow[tier - 1] = player.dimPow[tier - 1].times(getDimensionPowerMultiplier(tier, player.dimCosts[tier - 1]));
    multiplyCostsTier(tier);
    gotDimension(tier, true);

    onBuyDimension(tier, 'many');

    return true;
}

function buyManyDimensionAutobuyer(tier, bulk) {
  let base = getCurrentBase(player.currentChallenge);
  let cost = player.dimCosts[tier - 1].times(getNumRemaining(tier));
  let boughtSomething = false;
  if (tier >= 3 && dimBoughtWithTwoBefore()) {
    if (!canBuyDimension(tier)) return false
    if (player.dimAmount[tier - 3].lt(cost)) return false
    if (canBuyDimension(tier)) {
      if (cost.lt(player.dimAmount[tier - 3]) && player.dimBought[tier] !== 0 &&
      !tooManyBought(tier, getNumRemaining(tier))) {
        player.dimAmount[tier - 3] = player.dimAmount[tier - 3].minus(cost)
        player.dimAmount[tier - 1] = Decimal.round(player.dimAmount[tier - 1].plus(getNumRemaining(tier)))
        player.dimPow[tier - 1] = player.dimPow[tier - 1].times(getDimensionPowerMultiplier(tier, player.dimCosts[tier - 1]))
        player.dimCosts[tier - 1] = player.dimCosts[tier - 1].times(getDimensionCostMultiplier(tier))
        player.dimBought[tier - 1] = 0;
        player.dimTotalBought[tier - 1] += getNumRemaining(tier);
        boughtSomething = true;
      }
      var x = bulk;
      if (player.dimCosts[tier - 1].lte(0)) {
        throw new Error('Too low dimension cost.')
      }
      while (player.dimAmount[tier - 3].gt(player.dimCosts[tier - 1].times(base)) &&
      !tooManyBought(tier, base) && x > 0) {
        player.dimAmount[tier - 3] = player.dimAmount[tier - 3].minus(player.dimCosts[tier - 1].times(base));
        player.dimPow[tier - 1] = player.dimPow[tier - 1].times(getDimensionPowerMultiplier(tier, player.dimCosts[tier - 1]));
        player.dimCosts[tier - 1] = player.dimCosts[tier - 1].times(getDimensionCostMultiplier(tier));
        player.dimAmount[tier - 1] = Decimal.round(player.dimAmount[tier - 1].plus(base));
        player.dimTotalBought[tier - 1] += base;
        boughtSomething = true;
        x--;
      }
    }
  } else {
    if (!canBuyDimension(tier)) return false
    if (cost.lt(player.money) && player.dimBought[tier - 1] !== 0 &&
    !tooManyBought(tier, getNumRemaining(tier))) {
      player.money = player.money.minus(cost)
      player.dimAmount[tier - 1] = Decimal.round(player.dimAmount[tier - 1].plus(getNumRemaining(tier)))
      player.dimPow[tier - 1] = player.dimPow[tier - 1].times(getDimensionPowerMultiplier(tier, player.dimCosts[tier - 1]));
      player.dimCosts[tier - 1] = player.dimCosts[tier - 1].times(getDimensionCostMultiplier(tier))
      player.dimBought[tier - 1] = 0;
      player.dimTotalBought[tier - 1] += getNumRemaining(tier);
      boughtSomething = true;
    }
    var x = bulk;
    if (player.dimCosts[tier - 1].lte(0)) {
      throw new Error('Too low dimension cost.')
    }
    while (player.money.gte(player.dimCosts[tier - 1].times(base)) &&
    !tooManyBought(tier, base) && x > 0) {
      player.money = player.money.minus(player.dimCosts[tier - 1].times(base))
      player.dimPow[tier - 1] = player.dimPow[tier - 1].times(getDimensionPowerMultiplier(tier, player.dimCosts[tier - 1]));
      multiplyCostsTier(tier);
      player.dimAmount[tier - 1] = Decimal.round(player.dimAmount[tier - 1].plus(base))
      player.dimTotalBought[tier - 1] += base;
      boughtSomething = true;
      x--;
    }
  }
  if (inMatterIncreasingChallenge(player.currentChallenge) && player.matter.equals(0)) {
    player.matter = new Decimal(1);
  }
  gotDimension(tier, boughtSomething);
  if (boughtSomething) {
    onBuyDimension(tier, 'many');
  }
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
    return player.dimAmount[requirement.dimNum - 1].gte(requirement.num) &&
    resetAvailable(type, bulk);
  } else {
    for (let i = 0; i < bulk; i++) {
      let requirement = getResetDimInfo(type, i);
      if (!(player.dimAmount[requirement.dimNum - 1].gte(requirement.num) &&
      resetAvailable(type, bulk))) {
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

function dimBoughtWithTwoBefore (challenge) {
  if (challenge === undefined || challenge === null) {
    challenge = player.currentChallenge;
  }
  return inChallenge(challenge, "challenge-6");
}

document.getElementById("maxall").onclick = function () {
  buyMaxTickSpeed();

  for (var tier=1; tier<=MAX_DIMENSION;tier++) {
    buyManyDimensionAutobuyer(tier, Infinity);
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
        if (player.autobuyers['bigcrunch'].ip !== undefined && player.autobuyers['bigcrunch'].ip !== null && player.autoCrunchMode === "amount") {
          player.autobuyers['bigcrunch'].ip = player.autobuyers['bigcrunch'].ip.times(2);
        }
        if (player.autoCrunchMode === "amount") {
          document.getElementById("ip-bigcrunch").value = player.autobuyers['bigcrunch'].ip;
        }
    }
}

document.getElementById("tickspeedBoost").onclick = function() {
    if (player.infinityPoints.gte(player.tickspeedBoostCost)) {
        player.infinityPoints = player.infinityPoints.minus(player.tickspeedBoostCost)
        player.infTickspeedBoosts = player.infTickspeedBoosts + 1;
        player.tickspeedBoostCost = player.tickspeedBoostCost.times(10)
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

function timeProdIncrease () {
  let factor = hasDoubledTime() ? 1 : .5;
  return Math.pow(factor * player.totalTimePlayed / 600, 0.15)
}

function currProdIncrease () {
  let factor = hasDoubledTime() ? 2 : 1;
  return Decimal.max(Math.pow(factor * player.thisInfinityTime / 2400, 0.25), 1);
}

function applyInfBonuses (mult) {
  if (player.infinityUpgrades.includes("prodIncrease")) {
    mult = mult.times(timeProdIncrease());
  }
  if (player.infinityUpgrades.includes("currProdIncrease")) {
    mult = mult.times(currProdIncrease());
  }
  if (player.infinityUpgrades.includes("challengeBonus")) {
    mult = mult.times(challengeBonus());
  }
  if (player.infinityUpgrades.includes("achBonus")) {
    mult = mult.times(achBonus());
  }
  return mult;
}

function timeMult() {
    var mult = new Decimal(1)
    mult = applyInfBonuses(mult);
    if (hasAchievement("One for each dimension")) {
      mult = mult.times(Math.pow(player.totalTimePlayed / (10*60*60*12), 0.05));
    }
    return mult;
}

function dimMults() {
    if (player.timestudy.studies.includes(31)) return Decimal.pow(1 + (player.infinitied * 0.2), 4)
    else return new Decimal(1 + (player.infinitied * 0.2))
}

function playerInfinityUpgradesOnEternity() {
    if (player.eternities < 4) {
      player.infinityUpgrades = []
    } else {
      player.infinityUpgrades = infinityUpgradesNameList;
    }
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




var canGetBulkedUp = function () {
  var b1 = true;
  for (let i = 1; i <= MAX_DIMENSION; i++) {
      if (!player.autobuyers[i] || player.autobuyers[i].bulk < 512) {
        b1 = false;
      }
  }
  return b1;
}

var buyAutobuyer = function (id) {
  let autobuyer = player.autobuyers[id];
  if (player.infinityPoints.lt(autobuyer.cost)) {
    return false;
  }
  if (autobuyer.bulk >= 1e100) {
    return false;
  }
  player.infinityPoints = player.infinityPoints.minus(autobuyer.cost);
  if (autobuyer.interval <= 100) {
    autobuyer.bulk = Math.min(autobuyer.bulk * 2, 1e100);
    autobuyer.cost = Math.ceil(2.4 * autobuyer.cost);
    if (canGetBulkedUp()) {
      giveAchievement("Bulked up");
    }
  } else {
    autobuyer.interval = Math.max(autobuyer.interval*0.6, 100);
    if (autobuyer.interval > 120) {
      // If your last purchase won't be very strong, don't double the cost.
      autobuyer.cost *= 2;
    }
  }
  updateAutobuyers();
}

var toggleAutobuyerTarget = function (id) {
  if (typeof id === 'number') {
    if (player.autobuyers[id].mode === 'single') {
      player.autobuyers[id].mode = 'until-10';
      document.getElementById("toggleBtn-" + id).innerHTML="Buys until 10"
    } else {
      player.autobuyers[id].mode = 'single';
      document.getElementById("toggleBtn-" + id).innerHTML="Buys singles"
    }
  } else if (id === 'tickspeed') {
    if (player.autobuyers[id].mode === 'single') {
        player.autobuyers[id].mode = 'max';
        document.getElementById("toggleBtn-tickSpeed").innerHTML="Buys max"
    } else {
        player.autobuyers[id].mode = 'single';
        document.getElementById("toggleBtn-tickSpeed").innerHTML="Buys singles"
    }
  } else {
    throw new Error('Impossible toggle: ' + is)
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

function canBreak () {
  return player.challenges.length === 20 && player.autobuyers['bigcrunch'].interval === 100;
}

function breakInfinity() {
    if (!canBreak()) {
      return false;
    }
    if (player.break && !player.currentChallenge.name.includes("post")) {
        player.break = false;
        document.getElementById("break").innerHTML = "BREAK INFINITY";
    } else {
        player.break = true;
        document.getElementById("break").innerHTML = "FIX INFINITY";
        giveAchievement("Limit Break");
    }
}

function gainedInfinityPoints() {
    var ret = Decimal.floor(Decimal.pow(2, Decimal.log2(player.money) / (3 * Decimal.log2(getChallengeTarget()))).times(player.infMult));
    if (hasAchievement("This achievement doesn't exist II")) {
      ret = Decimal.floor(1.1 * Decimal.pow(2, Decimal.log2(player.money) / (3 * Decimal.log2(getChallengeTarget()))).times(player.infMult))
    }
    return ret;
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
    dimensional.setAttribute('ach-tooltip', "Reach " + formatValue(player.options.notation, 1e12, 0, 0) + " of all dimensions except 16th");
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
    for (i = 1; i <= MAX_DIMENSION; i++) {
        player.dimAmount[i - 1] = new Decimal(0);
        player.dimPow[i - 1] = new Decimal(1);
        player.dimBought[i - 1] = 0;
        player.dimTotalBought[i - 1] = 0;
    }
    player.dimCosts = initialDimCosts(player.currentChallenge);
}

function buyAutobuyerCallback (i) {
  return function () {
    buyAutobuyer(i);
  }
}

function toggleAutobuyerCallback (i) {
  return function () {
    toggleAutobuyerTarget(i);
  }
}

function insertDimAutobuyers () {
  let row;
  let irregularRow = document.getElementById('irregularRow');
  for (let i = 1; i <= MAX_DIMENSION; i++) {
    if (i % 4 === 1) {
      let newId = 'row-' + ((i + 3) / 4);
      if (document.getElementById(newId)) {
        let removeThis = document.getElementById(newId);
        removeThis.parent.removeChild(removeThis);
      }
      row = document.createElement('tr');
      row.id = newId;
      irregularRow.parentNode.insertBefore(row, irregularRow);
    }
    let td = document.createElement('td');
    let div = document.createElement('div');
    div.id = 'autoBuyer-' + i;
    div.className = 'autoBuyerDiv';
    let name = document.createElement('div');
    name.innerHTML = getDimName(i) + ' Dimension Autobuyer';
    div.appendChild(name);
    let button1 = document.createElement('button');
    button1.id = 'buyerBtn-' + i;
    button1.className = 'autobuyerbtn';
    button1.innerHTML = '46% smaller interval<br>Cost: 2 points';
    div.appendChild(button1);
    let button2 = document.createElement('button');
    button2.id = 'toggleBtn-' + i;
    button2.className = 'autobuyerbtn';
    button2.innerHTML = 'Buys singles';
    div.appendChild(button2);
    let interval = document.createElement('div');
    interval.id = 'interval-' + i;
    interval.style = 'font-size: 80%';
    interval.innerHTML = 'Current interval: 5 seconds<br>';
    div.appendChild(interval);
    let span1 = document.createElement('span');
    span1.innerHTML = 'Priority';
    div.appendChild(span1);
    let priority = document.createElement('select');
    priority.id = 'priority-' + i;
    for (let j = 1; j <= 9; j++) {
      let option = document.createElement('option');
      option.value = j;
      option.innerHTML = j;
      priority.appendChild(option);
    }
    priority.onchange = updatePriorities;
    div.appendChild(priority);
    div.appendChild(document.createElement('br'));
    let span2 = document.createElement('span');
    span2.style = 'font-size: 80%';
    span2.innerHTML = 'Is active';
    div.appendChild(span2);
    let input = document.createElement('input');
    input.type = 'checkbox';
    input.onchange = updateAutobuyers;
    input.id = 'ison-' + i;
    div.appendChild(input);
    td.appendChild(div);
    row.appendChild(td);
  }
  for (let i of autobuyerList) {
    let e1 = document.getElementById('buyerBtn-' + i);
    if (e1) {
      e1.onclick = buyAutobuyerCallback(i);
    }
    let e2 = document.getElementById("toggleBtn-" + i);
    if (e2) {
      e2.onclick = toggleAutobuyerCallback(i);
    }
  }
}

function updateAutobuyers() {
    var autoBuyerDimBoost = new Autobuyer('shift');
    var autoBuyerTickspeed = new Autobuyer('tickspeed');
    var autoBuyerInf = new Autobuyer('bigcrunch');

    autoBuyerDimBoost.interval = 16000;
    autoBuyerTickspeed.interval = 10000;
    autoBuyerInf.interval = 300000;


    intervalDict = {
      'tickspeed': 10000,
      'shift': 16000,
      'bigcrunch': 300000,
      'hyper': 480000
    }

    let a = initialDimCostMultLogs();
    for (let i of autobuyerList) {
      autobuyers[i] = new Autobuyer(i);
      if (typeof i === 'number') {
        autobuyers[i].interval = a[i - 1] * 1000;
      } else {
        autobuyers[i].interval = intervalDict[i];
      }
      autobuyers[i].target = i;
      autobuyers[i].mode = 'single';
      autobuyers[i].priority = 1;
    }

    for (let i of challengeList) {
      let id = getChallId(i);
      if (player.challenges.includes(i) && player.autobuyers[id] === null) {
        player.autobuyers[id] = autobuyers[id];
        document.getElementById("autoBuyer-" + id).style.display = "inline-block";
      }
    }

    for (let i of autobuyerList) {
      if (player.autobuyers[i]) {
        document.getElementById("interval-" + i).innerHTML = "Current interval: " + (player.autobuyers[i].interval/1000).toFixed(2) + " seconds";
      }
    }

    var maxedAutobuy = 0;
    for (let tier = 1; tier <= MAX_DIMENSION; tier++) {
      document.getElementById("toggleBtn-" + tier).style.display = "inline-block";
      let buyerBtn = document.getElementById("buyerBtn-" + tier);
      let autobuyer = player.autobuyers[tier];
      if (!autobuyer) {
        continue;
      }
      if (autobuyer.bulk >= 1e100) {
        autobuyer.bulk = 1e100;
        buyerBtn.innerHTML = shortenDimensions(autobuyer.bulk)+"x bulk purchase";
      }
      else {
        if (autobuyer.interval <= 100) {
          if (autobuyer.bulk * 2 >= 1e100) {
            buyerBtn.innerHTML = shortenDimensions(1e100)+"x bulk purchase<br>Cost: " + shortenDimensions(autobuyer.cost) + " IP";
          } else {
            buyerBtn.innerHTML = shortenDimensions(autobuyer.bulk*2) + "x bulk purchase<br>Cost: " + shortenDimensions(autobuyer.cost) + " IP";
          }
          maxedAutobuy++;
        } else {
          document.getElementById("buyerBtn-" + tier).innerHTML = "40% smaller interval <br>Cost: " + shortenDimensions(autobuyer.cost) + " IP";
        }
      }
    }

    for (let i of ['tickspeed', 'shift', 'bigcrunch', 'hyper']) {
      if (player.autobuyers[i]) {
        if (player.autobuyers[i].interval <= 100) {
          document.getElementById("buyerBtn-" + i).style.display = "none";
          maxedAutobuy++;
        } else {
          document.getElementById("buyerBtn-" + i).innerHTML = "40% smaller interval <br>Cost: " + player.autobuyers[i].cost + " IP";
        }
        if (i === 'tickspeed') {
          document.getElementById("toggleBtn-" + i).style.display = "inline-block";
        }
      }
    }

    if (maxedAutobuy >= 10) {
      giveAchievement("Age of Automation");
    }
    if (maxedAutobuy === 20) {
      giveAchievement("Definitely not worth it");
    }

    for (let i of autobuyerList) {
      if (player.autobuyers[i]) {
        document.getElementById("autoBuyer-" + i).style.display = "inline-block";
        player.autobuyers[i].isOn = document.getElementById("ison-" + i).checked;
      }
    }

    player.eternityBuyer.isOn = document.getElementById("ison-eternity").checked
    priorityOrder()
}


var priority = [];

function hasPriority (x) {
  return x === 'tickspeed' || typeof x === 'number';
}

function priorityOrder () {
    var tempArray = []
    var localAutobuyerArray = autobuyerList.map(function (x) {
      return player.autobuyers[x];
    }).filter(function (x) {
      return x;
    });
    for (var i = 1; i <= 9; i++) {
      for (let j of localAutobuyerArray) {
          if (j && j.priority === i && hasPriority(j.target)) {
            tempArray.push(j);
          }
      }
    }
    priority = tempArray;
}


function updatePriorities() {
    for (let i of autobuyerList) {
      let e = document.getElementById("priority-" + i);
      if (e && player.autobuyers[i]) {
        let newPriority = parseInt(e.value);
        if (!isNaN(newPriority) && newPriority) {
          player.autobuyers[i].priority = newPriority;
        }
      }
    }
    if (player.autobuyers['shift']) {
      player.autobuyers['shift'].maxDimShift = parseInt(document.getElementById("max-dim-shift").value);
    }
    if (player.autobuyers['bigcrunch']) {
      var infValue = document.getElementById("ip-bigcrunch").value
      if (infValue !== undefined && infValue !== "undefined") {
        infValue = new Decimal(infValue);
      } else {
        infValue = new Decimal(1);
      }
      player.autobuyers['bigcrunch'].ip = infValue;
    }
    if (player.autobuyers['hyper']) {
      player.autobuyers['hyper'].commands = document.getElementById("commands-hyper").value;
    }
    var eterValue = new Decimal(document.getElementById("ep-num-eter").value)
    if (!isNaN(eterValue)) {
      player.eternityBuyer.limit = eterValue;
    }

    priorityOrder();
}

// end of code to look into

function updateCheckBoxes() {
    for (let i of challengeList) {
      let challId = getChallId(i);
        if (player.autobuyers[challId]) {
            if (player.autobuyers[challId].isOn) {
              document.getElementById("ison-" + challId).checked = "true";
            }
            else document.getElementById("ison-" + challId).checked = ""
        }
    }

    document.getElementById("ison-eternity").checked = player.eternityBuyer.isOn
}


function toggleAutoBuyers() {
    var bool = player.autobuyers[1].isOn
    for (var i of autobuyerList) {
        if (player.autobuyers[i]) {
            player.autobuyers[i].isOn = !bool;
        }
    }
    player.eternityBuyer.isOn = !bool;
    updateCheckBoxes();
    updateAutobuyers();
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


function initChallengeTimes () {
  let p = document.getElementById('challenge-times');
  removeAllChildren(p);
  p.appendChild(document.createElement('br'));
  for (let i of challengeList) {
    let e = document.createElement('div');
    e.id = i + '-time';
    p.appendChild(e);
  }
  p.appendChild(document.createElement('br'));
}

function updateChallengeTimes() {
  for (let i of challengeList) {
    document.getElementById(i + '-time').innerHTML = getChallName(i) + " time record " + timeDisplayShort(player.challengeTimes[i])
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
    for (var i in player.challengeTimes) {
        temp += player.challengeTimes[i];
    }
    if (temp <= 1800) {
      giveAchievement("Not-so-challenging");
    }
    if (temp <= 50) {
      giveAchievement("End me");
    }
    var temp2 = 0
    for (var i=0; i<8;i++) {
        temp2 += player.infchallengeTimes[i]
    }
    infchallengeTimes = temp2
    if (temp2 <= 50) giveAchievement("Yes. This is hell.")
}

function hasAchievement(x) {
  if (!(x in revAchieveDict)) {
    throw new Error('Bad achievement ' + x);
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

function onlyDimIsSingleFirstDim () {
  return player.dimAmount[0] === 1 && getHighestDim() === 1;
}

function setAchInitialMoney() {
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
}

document.getElementById("bigcrunch").onclick = function () {
    if (inChallenge(player.currentChallenge, 'challenge-16') && player.challengeTarget.lt(getRealChallengeTarget().div(1.01))) {
      player.challengeTarget = Decimal.pow(player.challengeTarget, 2);
      player.shiftResets = 0;
      player.boostResets = 0;
      softReset(0, 'none');
      return;
    }
    if (player.currentChallenge.name === 'challenge-hyper' && player.currentChallenge.extra.part === 1) {
      player.currentChallenge.extra.part = 2;
      player.currentChallenge.list = autobuyerList.filter(
        (i) => i !== 1 && i !== 'hyper' && !player.currentChallenge.list.includes('challenge-' + i.toString())).map(
        (i) => 'challenge-' + i.toString());
      player.challengeTarget = getChallengeTarget(player.currentChallenge);
      player.corruptionStart = getCorruptionStart(player.currentChallenge);
      player.shiftResets = 0;
      player.boostResets = 0;
      softReset(0, 'none');
      return;
    }

    var challFullName = player.currentChallenge.name;
    var challNumber = getChallId(challFullName);
    if (player.money.gte(player.challengeTarget)) {
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
        if (!hasAchievement("Zero Deaths") && totalResets() === 0) giveAchievement("Zero Deaths")
        if (challFullName === "challenge-2" && player.thisInfinityTime <= 1800) {
          giveAchievement("Many Deaths");
        }
        if (challFullName === "challenge-8" && player.thisInfinityTime <= 1800) {
          giveAchievement("Gift from the Gods");
        }
        if (challFullName === "challenge-tickspeed" && player.thisInfinityTime <= 1800) {
          giveAchievement("Is this hell?");
        }
        if (challFullName === "challenge-3" && player.thisInfinityTime <= 100) {
          giveAchievement("You did this again just for the achievement right?");
        }
        if (onlyDimIsSingleFirstDim() && totalResets() === 0) giveAchievement("ERROR 909: Dimension not found")
        if (challFullName !== "" && player.challengeTimes[challFullName] > player.thisInfinityTime) {
          player.challengeTimes[challFullName] = player.thisInfinityTime;
        }
        if ((player.bestInfinityTime > 600 && !player.break) || (challFullName !== "" && !player.options.retryChallenge)) {
          showTab("dimensions");
        }
        if (challFullName !== "" && !player.challenges.includes(challFullName)) {
            player.challenges.push(challFullName);
        }
        if (!player.break || challFullName !== "") {
            var add = new Decimal(player.infMult)
            if (player.timestudy.studies.includes(51)) add = add.times(1e15)
            player.infinityPoints = player.infinityPoints.plus(add);
            addTime(player.thisInfinityTime, add)
        } else {
            player.infinityPoints = player.infinityPoints.plus(gainedInfinityPoints())
            addTime(player.thisInfinityTime, gainedInfinityPoints())
            if (gainedInfinityPoints().gte(1e150)) {
              giveAchievement("All your IP are belong to us");
            }
            if (gainedInfinityPoints().gte(1e200) && player.thisInfinityTime <= 20) {
              giveAchievement("Ludicrous Speed");
            }
            if (gainedInfinityPoints().gte(1e250) && player.thisInfinityTime <= 200) {
              giveAchievement("I brake for nobody");
            }
        }
        if (player.thisInfinityTime > 50 && hasAchievement("2 Million Infinities")) {
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

        if (!player.options.retryChallenge) {
          player.currentChallenge = noChallenge;
        }

        player = {
        money: new Decimal(10),
        tickSpeedCost: Decimal.pow(getCurrentBase(player.currentChallenge), 3),
        tickspeed: new Decimal(1000),
        dimCosts: initialDimCosts(player.currentChallenge),
        dimBought: initialDimBought(),
        dimTotalBought: initialDimTotalBought(),
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
        dimBoostResets: 0,
        extra_starting_dimensions: player.extra_starting_dimensions,
        tickDecrease: 0.9,
        totalmoney: player.totalmoney,
        interval: null,
        lastUpdate: player.lastUpdate,
        achPow: player.achPow,
        autobuyers: player.autobuyers,
        costMultipliers: initialDimCostMults(player.currentChallenge),
        chall2Pow: 1,
        chall3Pow: getInitialChall3Pow(),
        newsArray: player.newsArray,
        matter: new Decimal(0),
        partInfinityPoint: player.partInfinityPoint,
        partInfinityPoint2: player.partInfinityPoint2,
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
        challengeTarget: normal_infinity,
        corruptionStart: normal_corruption_start,
        timestudy: player.timestudy,
        autoIP: player.autoIP,
        autoTime: player.autoTime,
        infMultBuyer: player.infMultBuyer,
        autoCrunchMode: player.autoCrunchMode,
        respec: player.respec,
        eternityBuyer: player.eternityBuyer,
        options: player.options
        };

        setExtraStartingDims();

        // I removed a +1 that used to be here in resets + 1
        player.dimPow = initialDimPow(totalResets(), player.extra_starting_dimensions);

        if (player.timestudy.studies.includes(32)) {
          player.infinitied += totalResets() - 1;
        }

        if (player.tickspeed.lt(1e-26)) {
          giveAchievement("Faster than a potato");
        }
        if (player.tickspeed.lt(1e-52)) {
          giveAchievement("Faster than a squared potato");
        }
        clearInterval(player.interval);
        //updateInterval();
        for (var i = 2; i <= MAX_DIMENSION; i++) {
          document.getElementById(getDimName(i).toLowerCase() + "Row").style.display = "none";
        }
        document.getElementById("tickSpeed").style.visibility = "hidden";
        document.getElementById("tickSpeedMax").style.visibility = "hidden";
        document.getElementById("tickLabel").style.visibility = "hidden";
        document.getElementById("tickSpeedAmount").style.visibility = "hidden";
        setMatterDisplay();
        setQuickResetDisplay();

        checkForEndMe()
        if (!hasAchievement("To infinity!")) {
          giveAchievement("To infinity!");
        }
        if (!hasAchievement("That's a lot of infinities") && player.infinitied >= 10) {
          giveAchievement("That's a lot of infinities");
        }


        updateAutobuyers();
        if (player.challenges.length >= 1 && !hasAchievement("Daredevil")) {
          giveAchievement("Daredevil");
        }
        if (player.challenges.length === 20 && !hasAchievement("AntiChallenged")) {
          giveAchievement("AntiChallenged");
        }
        setAchInitialMoney();
        resetInfDimensions();
        player.tickspeed = player.tickspeed.times(Decimal.pow(getTickSpeedMultiplier(), player.totalTickGained));
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
    if (player.infinityPoints.gte(normal_infinity) && (!player.options.eternityconfirm || confirm("Eternity will reset everything except achievements and challenge records. You will also gain an Eternity point and unlock various upgrades."))) {
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
            tickSpeedCost: Decimal.pow(10, 3),
            tickspeed: new Decimal(1000),
            dimCosts: initialDimCosts(noChallenge),
            dimBought: initialDimBought(),
            dimTotalBought: initialDimTotalBought(),
            dimAmount: initialDimAmount(),
            dimPow: initialDimPow(0, 0),
            achievements: player.achievements,
            challenges: (player.eternities > 0) ? challengeList : player.challenges,
            currentChallenge: noChallenge,
            infinityUpgrades: player.infinityUpgrades,
            infinityPoints: new Decimal(0),
            infinitied: 0,
            totalTimePlayed: player.totalTimePlayed,
            bestInfinityTime: 9999999999,
            infTickspeedBoosts: 0,
            thisInfinityTime: 0,
            shiftResets: 0,
            boostResets: 0,
            dimBoostResets: 0,
            extra_starting_dimensions: 0,
            tickDecrease: 0.9,
            totalmoney: player.totalmoney,
            interval: null,
            lastUpdate: player.lastUpdate,
            achPow: player.achPow,
            autobuyers: (player.eternities > 0) ? player.autobuyers: initialAutobuyers(),
            partInfinityPoint: 0,
            partInfinityPoint2: 0,
            partInfinitied: 0,
            break: player.eternities > 0 ? player.break : false,
            costMultipliers: initialDimCostMults(noChallenge),
            chall2Pow: 1,
            chall3Pow: new Decimal(0.01),
            newsArray: player.newsArray,
            matter: new Decimal(0),
            challengeTimes: player.challengeTimes,
            infchallengeTimes: player.infchallengeTimes,
            lastTenRuns: [[600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)]],
            lastTenEternities: player.lastTenEternities,
            infMult: new Decimal(1),
            infMultCost: new Decimal(10),
            tickspeedBoostCost: new Decimal(10),
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
            challengeTarget: normal_infinity,
            corruptionStart: normal_corruption_start,
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
        giveAchievement("Time is relative");
        if (player.eternities >= 100) giveAchievement("This mile took an Eternity");
        document.getElementById("respec").className = "storebtn"
        if (player.tickspeed.lt(1e-26)) {
          giveAchievement("Faster than a potato");
        }
        if (player.tickspeed.lt(1e-52)) {
          giveAchievement("Faster than a squared potato");
        }

        clearInterval(player.interval);
        //updateInterval();
        for (var i = 2; i <= MAX_DIMENSION; i++) {
          document.getElementById(getDimName(i).toLowerCase() + "Row").style.display = "none";
        }
        document.getElementById("tickSpeed").style.visibility = "hidden";
        document.getElementById("tickSpeedMax").style.visibility = "hidden";
        document.getElementById("tickLabel").style.visibility = "hidden";
        document.getElementById("tickSpeedAmount").style.visibility = "hidden";
        setMatterDisplay();
        setQuickResetDisplay();

        var autobuyers = document.getElementsByClassName('autoBuyerDiv')
        if (player.eternities < 2) {
            for (var i=0; i<autobuyers.length;i++) autobuyers.item(i).style.display = "none"
            document.getElementById("buyerBtnDimBoost").style.display = "inline-block"
            document.getElementById("buyerBtnGalaxies").style.display = "inline-block"
            document.getElementById("buyerBtnInf").style.display = "inline-block"
            document.getElementById("buyerBtnTickSpeed").style.display = "inline-block"
        }
        updateAutobuyers();
        setAchInitialMoney();
        if (hasAchievement("All your IP are belong to us")) player.infMult = player.infMult.times(4);
        if (hasAchievement("MAXIMUM OVERDRIVE")) player.infMult = player.infMult.times(4);
        if (hasAchievement("Fast is also relative")) player.infinityPoints = new Decimal(1e5);
        if (hasAchievement("That wasn't an eternity")) player.infinityPoints = new Decimal(2e25);
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
        if (player.eternities < 20) {
          player.autobuyers['shift'].bulk = 1
        }
        document.getElementById("infinityPoints1").innerHTML = "You have <span class=\"IPAmount1\">"+shortenDimensions(player.infinityPoints)+"</span> Infinity points."
        document.getElementById("infinityPoints2").innerHTML = "You have <span class=\"IPAmount2\">"+shortenDimensions(player.infinityPoints)+"</span> Infinity points."
        if (player.eternities < 2) document.getElementById("break").innerHTML = "BREAK INFINITY"
        document.getElementById("eternitybtn").style.display = player.infinityPoints.gte(normal_infinity) ? "inline-block" : "none"
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
    document.getElementById(player.currentChallenge.name).innerHTML = "Start"
    startChallenge('');
    updateChallenges();
}

function setMatterDisplay () {
  if (inMatterIncreasingChallenge(player.currentChallenge)) {
    document.getElementById("matter").style.display = 'inline-block';
    document.getElementById("matter").style.visibility = 'visible';
  } else {
    document.getElementById("matter").style.display = 'none';
    document.getElementById("matter").style.visibility = 'hidden';
  }
}

function setQuickResetDisplay () {
  if (needsQuickResetDisplayed(player.currentChallenge)) {
    document.getElementById("quickReset").style.display = 'inline-block';
    document.getElementById("quickReset").style.visibility = 'visible';
  } else {
    document.getElementById("quickReset").style.display = 'none';
    document.getElementById("quickReset").style.visibility = 'hidden';
  }
}

function startChallenge(name) {
  if (player.options.challConf || name === "" || confirm("You will start over with just your infinity upgrades and achievements. You need to reach infinity with special conditions. NOTE: The rightmost infinity upgrade column doesn't work on challenges.")) {
    if (player.currentChallenge.name !== "") {
      document.getElementById(player.currentChallenge.name).innerHTML = "Start"
    }
    let challenge = makeChallenge(name);
    let target = getChallengeTarget(challenge);
    let corruption = getCorruptionStart(challenge);
    player = {
      money: new Decimal(10),
      tickSpeedCost: Decimal.pow(getCurrentBase(challenge), 3),
      tickspeed: new Decimal(1000),
      dimCosts: initialDimCosts(challenge),
      dimBought: initialDimBought(),
      dimTotalBought: initialDimTotalBought(),
      dimAmount: initialDimAmount(),
      dimPow: initialDimPow(0, (extraStartingDimsAvailable() ? player.extra_starting_dimensions : 0)),
      achievements: player.achievements,
      challenges: player.challenges,
      currentChallenge: challenge,
      infinityUpgrades: player.infinityUpgrades,
      infinityPoints: player.infinityPoints,
      infinitied: player.infinitied,
      totalTimePlayed: player.totalTimePlayed,
      bestInfinityTime: player.bestInfinityTime,
      infTickspeedBoosts: player.infTickspeedBoosts,
      thisInfinityTime: 0,
      shiftResets: 0,
      boostResets: 0,
      dimBoostResets: 0,
      extra_starting_dimensions: 0,
      tickDecrease: 0.9,
      totalmoney: player.totalmoney,
      interval: null,
      lastUpdate: player.lastUpdate,
      achPow: player.achPow,
      autobuyers: player.autobuyers,
      costMultipliers: initialDimCostMults(challenge),
      chall2Pow: 1,
      chall3Pow: getInitialChall3Pow(),
      matter: new Decimal(0),
      newsArray: player.newsArray,
      partInfinityPoint: player.partInfinityPoint,
      partInfinityPoint2: player.partInfinityPoint2,
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
      corruptionStart: corruption,
      timestudy: player.timestudy,
      autoIP: player.autoIP,
      autoTime: player.autoTime,
      infMultBuyer: player.infMultBuyer,
      autoCrunchMode: player.autoCrunchMode,
      respec: player.respec,
      eternityBuyer: player.eternityBuyer,
      options: player.options
    };
    setExtraStartingDims();

    IPminpeak = new Decimal(0)
    if (player.currentChallenge.name.includes("post")) player.break = true
    if (hasAchievement("Faster than a potato")) {
      player.tickspeed = player.tickspeed.times(0.98);
    }
    if (hasAchievement("Faster than a squared potato")) {
      player.tickspeed = player.tickspeed.times(0.96);
    }
    clearInterval(player.interval);
    //updateInterval();
    document.getElementById("tickSpeed").style.visibility = "hidden";
    document.getElementById("tickSpeedMax").style.visibility = "hidden";
    document.getElementById("tickLabel").style.visibility = "hidden";
    document.getElementById("tickSpeedAmount").style.visibility = "hidden";
    setMatterDisplay();
    setQuickResetDisplay();

    showTab('dimensions');
    updateChallenges();
    setAchInitialMoney();
    dimDisplay();
    showTab("dimensions")
    if (player.infinitied >= 10) {
      giveAchievement("That's a lot of infinities");
    }
  }
  resetInfDimensions();
  player.tickspeed = player.tickspeed.times(Decimal.pow(getTickSpeedMultiplier(), player.totalTickGained))

  setExtraStartingDims();
}

function getDimensionProductionPerSecond (tier) {
    if (tier > MAX_DIMENSION) {
      return new Decimal(0);
    }
    let ret = Decimal.floor(player.dimAmount[tier - 1]).times(getDimensionFinalMultiplier(tier)).times(1000).dividedBy(player.tickspeed)
    if (inChallenge(player.currentChallenge, "challenge-2")) {
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

var blink = true;

setInterval(function() {
    updateDimensions()
}, 50)

var nextAt = [new Decimal("1e2000"), new Decimal("1e5000"), new Decimal("1e12000"), new Decimal("1e14000"), new Decimal("1e18000"), new Decimal("1e20000"), new Decimal("1e23000"), new Decimal("1e28000")]

var goals = [new Decimal("1e850"), new Decimal("1e10500"), new Decimal("1e5000"), new Decimal("1e13000"), new Decimal("1e11111"), new Decimal("2e22222"), new Decimal("1e10000"), new Decimal("1e27000")]

function canGetCantHoldAllThoseInfinities() {
  for (let i = 1; i <= MAX_DIMENSION; i++) {
    if (getDimensionFinalMultiplier(i).lt(new Decimal("1e308"))) {
      return false;
    }
  }
  return true;
}

function canGetHowTheAntiTablesHaveTurned() {
  for (let i = 1; i < MAX_DIMENSION; i++) {
    if (getDimensionFinalMultiplier(i).gte(
      getDimensionFinalMultiplier(i + 1))) {
      return false;
    }
  }
  return true;
}

function canGetMultidimensional() {
  for (let i = 1; i < MAX_DIMENSION; i++) {
    if (player.dimAmount[i - 1].lt(1e12)) {
      return false;
    }
  }
  return true;
}

setInterval(function() {
    if (canGetCantHoldAllThoseInfinities()) {
      giveAchievement("Can't hold all these infinities");
    }

    if (canGetHowTheAntiTablesHaveTurned()) {
      giveAchievement("How the antitables have turned");
    }



    if (player.infinitied == 0) document.getElementById("infinityPoints2").style.display = "none"
    else document.getElementById("infinityPoints2").style.display = "inline-block"

    if (blink && !hasAchievement("Blink of an eye")) {
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

    document.getElementById("eternitybtn").style.display = player.infinityPoints.gte(normal_infinity) ? "inline-block" : "none"


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

function inMatterIncreasingChallenge (c) {
  return inChallenge(c, 'challenge-15');
}

function getMoneyProd () {
  let money_prod = getDimensionProductionPerSecond(1);

  if (inChallenge(player.currentChallenge, "challenge-3")) {
    money_prod = money_prod.times(player.chall3Pow);
  }

  if (inChallenge(player.currentChallenge, "challenge-bigcrunch")) {
    // Reduced production.
    money_prod = money_prod.div(2);
    money_prod = money_prod.plus(getDimensionProductionPerSecond(2));
  }
  return money_prod;
}

function hasHappened (diff, n) {
  // Are we not in a world where it has not happened the last diff times?
  return Math.random() > Math.pow(1 - 1 / n, diff);
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
        if (diff > player.autoTime && !player.break) {
          player.infinityPoints = player.infinityPoints.plus(player.autoIP.times(diff -player.autoTime));
        }
        player.matter = player.matter.times(Decimal.pow(1.03 + totalResets() / 200, diff));
        if (player.matter.gt(player.money) && inMatterIncreasingChallenge(player.currentChallenge)) {
            softReset(0, 'none');
        }

        if (inChallenge(player.currentChallenge, 'challenge-13') && hasHappened(diff, 600)) {
          softReset(0, 'none');
        }

        if (inChallenge(player.currentChallenge, 'challenge-14') && hasHappened(diff, 6000)) {
          // I think this is OK? It's basically just the definition of
          // "reset without dimension shifts".
          player.shiftResets = 0;
          player.boostResets = 0;
          softReset(0, 'none');
        }

        if (inChallenge(player.currentChallenge, "challenge-3")) {
          player.chall3Pow = player.chall3Pow.times(Decimal.pow(1.00038, diff));
        }
        if (player.infinityUpgrades.includes('percentMultiply')) {
          player.chall2Pow = Math.min(player.chall2Pow + diff/18, 100);
        } else {
          player.chall2Pow = Math.min(player.chall2Pow + diff/1800, 1);
        }
        if (player.infinityUpgrades.includes("infAuto1")) {
          player.partInfinityPoint += diff / player.bestInfinityTime;
        }
        if (player.infinityUpgrades.includes("infAuto2")) {
          player.partInfinityPoint2 += diff / player.bestInfinityTime;
        }
        if (player.partInfinityPoint >= 10) {
            player.infinityPoints = player.infinityPoints.plus(
              player.infMult.times(Math.floor(player.partInfinityPoint/10)));
            player.partInfinityPoint %= 10;
        }
        if (player.partInfinityPoint2 >= 1) {
          player.infinityPoints = player.infinityPoints.plus(
            player.infMult.times(Math.floor(player.partInfinityPoint2)));
          player.partInfinityPoint2 %= 1;
        }

        if (player.infinityPoints.gte('17.1717e1717')) {
          giveAchievement("This achievement doesn't exist II");
        }

        if (player.infinitied > 2e6) giveAchievement("2 Million Infinities")
        player.infinityPoints = player.infinityPoints.plus(bestRunIppm.times(player.offlineProd/100).times(diff/600))



        if (player.money.lt(player.challengeTarget) || infinityBrokenInCurrentChallenge()) {

            if (!inChallenge(player.currentChallenge, "challenge-bigcrunch")) {
                for (let tier = MAX_DIMENSION - 1; tier >= 1; --tier) {
                    addAmount(tier, getDimensionProductionPerSecond(tier + 1).times(diff / 100));
                 }
            } else {
                for (let tier = MAX_DIMENSION - 2; tier >= 1; --tier) {
                    addAmount(tier, getDimensionProductionPerSecond(tier + 2).times(diff / 100));
                }
            }

            let money_prod = getMoneyProd().times(diff / 10)

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


        if (player.money.gte("17.1717e1717")) giveAchievement("This achievement doesn't exist")
        if (player.money.gte("1e35000")) giveAchievement("I got a few to spare")

        player.infinityPower = player.infinityPower.plus(DimensionProduction(1).times(diff/10));

        player.timeShards = player.timeShards.plus(getTimeDimensionProduction(1).times(diff/10))

        while (player.timeShards.gte(player.tickThreshold)) {
            player.tickspeed = player.tickspeed.times(getTickSpeedMultiplier());
            if (player.timestudy.studies.includes(171)) player.tickThreshold = player.tickThreshold.times(1.25)
            else player.tickThreshold = player.tickThreshold.times(1.33)
            player.totalTickGained++;
            if (player.totalTickGained >= 308) giveAchievement("Infinite time");
            document.getElementById("totaltickgained").innerHTML = "You've gained "+shortenDimensions(player.totalTickGained)+" tickspeed upgrades."

        }
        updateTickSpeed();

        if (player.eternities === 0) {
            document.getElementById("eternityPoints2").style.display = "none"
            document.getElementById("eternitystorebtn").style.display = "none"
          }


        if (player.money.gte(player.challengeTarget) && !infinityBrokenInCurrentChallenge()) {
            document.getElementById("bigcrunch").style.display = 'inline-block';
            if ((player.currentChallenge.name === "" || player.options.retryChallenge) && (player.bestInfinityTime <= 600 || player.break)) {}
            else showTab('emptiness');
        } else {
          document.getElementById("bigcrunch").style.display = 'none';
        }

        if (infinityBrokenInCurrentChallenge()) {
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
            var diff = player.infinityPoints.e - player.infMultCost.e + 1;

            if (diff > 0) {
                player.infMult = player.infMult.times(Decimal.pow(2, diff))
                player.infMultCost = player.infMultCost.times(Decimal.pow(10, diff))
                document.getElementById("infiMult").innerHTML = "Multiply infinity points from all sources by 2 <br>currently: "+shorten(player.infMult) +"x<br>Cost: "+shortenCosts(player.infMultCost)+" IP";
                // No tickspeed boost needed here.
                player.infinityPoints = player.infinityPoints.minus(player.infMultCost.dividedBy(10))
                if (player.autobuyers['bigcrunch'].ip !== undefined && player.autobuyers['bigcrunch'].ip !== null && player.autoCrunchMode === "amount") {
                  player.autobuyers['bigcrunch'].ip = player.autobuyers['bigcrunch'].ip.times(2);
                }
                if (player.autoCrunchMode === "amount") {
                  document.getElementById("ip-bigcrunch").value = player.autobuyers['bigcrunch'].ip;
                }
            }
        }

        document.getElementById("eternitybtn").innerHTML = (player.eternities === 0) ? "Other times await... I need to become Eternal" : "I need to become Eternal.<br>"+"Gain "+shortenDimensions(gainedEternityPoints())+" Eternity points."

        updateMoney();
        updateCoinPerSec();
        updateInfCosts()
        updateInfinityDimensions();
        updateInfPower();
        updateTimeDimensions()
        updateTimeShards()
        if (calcPerSec(player.dimAmount[0], player.dimPow[0], player.infinityUpgrades.includes("1infStat")).gt(player.money)) {
          if(player.money.gt(Math.pow(10,63)) && !hasAchievement("Supersanic")) {
            giveAchievement("Supersanic");
          }

          Marathon++;

          if (Marathon >= 300 && !hasAchievement("Over in 30 seconds")) {
            giveAchievement("Over in 30 seconds");
          }
        } else {
          Marathon = 0;
        }

        for (let tier = 1; tier <= MAX_DIMENSION; ++tier) {
          var name = getDimName(tier).toLowerCase();
          if (!dimBoughtWithTwoBefore() || tier < 3) {
            var canBuyOne = canAfford(getTierCost(tier, 1));
            var canBuyMany = canAfford(getTierCost(tier, getNumRemaining(tier)));
          } else {
            var canBuyOne = player.dimAmount[tier - 3].gte(getTierCost(tier, 1));
            var canBuyMany = player.dimAmount[tier - 3].gte(getTierCost(tier, getNumRemaining(tier)));
          }
          document.getElementById(name).className = (canBuyOne && !tooManyBought(tier, 1)) ?
          'storebtn' : 'unavailablebtn';
          document.getElementById(name + 'Max').className = (canBuyMany && !tooManyBought(tier, getNumRemaining(tier))) ?
          'storebtn' : 'unavailablebtn';
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

        if (canBreak()) {
          document.getElementById("break").className = "infinistorebtnlocked";
          document.getElementById("abletobreak").style.display = "none";
        } else {
          document.getElementById("break").className = "infinistorebtn2";
        }


        document.getElementById("infinitybtn").style.display = "none";
        document.getElementById("challengesbtn").style.display = "none";

        if (player.money.gte(player.challengeTarget) && (((player.currentChallenge.name !== "" && player.money.gte(player.challengeTarget)) && !player.options.retryChallenge) || (player.bestInfinityTime > 600 && !player.break))) {
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

        checkBoughtAllInfiBtns();

        if (player.currentChallenge.name !== "") {
            document.getElementById("progressbar").style.width = Decimal.min((Decimal.log10(player.money.plus(1)) / Decimal.log10(player.challengeTarget) * 100), 100).toFixed(2) + "%"
            document.getElementById("progressbar").innerHTML = Decimal.min((Decimal.log10(player.money.plus(1)) / Decimal.log10(player.challengeTarget) * 100), 100).toFixed(2) + "%"
            document.getElementById("progress").setAttribute('ach-tooltip',"Percentage to challenge goal")
        } else if (!player.break) {
            document.getElementById("progressbar").style.width = Decimal.min((Decimal.log10(player.money.plus(1)) / Decimal.log10(player.challengeTarget) * 100), 100).toFixed(2) + "%"
            document.getElementById("progressbar").innerHTML = Decimal.min((Decimal.log10(player.money.plus(1)) / Decimal.log10(player.challengeTarget) * 100), 100).toFixed(2) + "%"
            document.getElementById("progress").setAttribute('ach-tooltip',"Percentage to Infinity")
        } else {
            document.getElementById("progressbar").style.width = Decimal.min(Decimal.log10(player.infinityPoints.plus(1)) / Decimal.log10(player.challengeTarget)  * 100, 100).toFixed(2) + "%"
            document.getElementById("progressbar").innerHTML = Decimal.min(Decimal.log10(player.infinityPoints.plus(1)) / Decimal.log10(player.challengeTarget)  * 100, 100).toFixed(2) + "%"
            document.getElementById("progress").setAttribute('ach-tooltip',"Percentage to Eternity")
        }

        if (player.eternities > 0) document.getElementById("infinitybtn").style.display = "inline-block";

        var scale1 = [2.82e-45,1e-42,7.23e-30,5e-21,9e-17,6.2e-11,5e-8,3.555e-6,7.5e-4,1,2.5e3,2.6006e6,3.3e8,5e12,4.5e17,1.08e21,1.53e24,1.41e27,5e32,8e36,1.7e45,1.7e48,3.3e55,3.3e61,5e68,1e73,3.4e80,1e113,normal_infinity];
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

        if (inChallenge(player.currentChallenge, "challenge-2")) {
          document.getElementById("chall2Pow").style.display = "inline-block";
        } else {
          document.getElementById("chall2Pow").style.display = "none";
        }
        if (inChallenge(player.currentChallenge, "challenge-3")) {
          document.getElementById("chall3Pow").style.display = "inline-block";
        } else {
          document.getElementById("chall3Pow").style.display = "none";
        }

        document.getElementById("chall2Pow").innerHTML = (player.chall2Pow*100).toFixed(2) + "%"
        document.getElementById("chall3Pow").innerHTML = shorten(player.chall3Pow*100) + "%"

        if (player.dimPow[0] >= 10e30) giveAchievement("I forgot to nerf that")
        if (player.money >= 10e79) giveAchievement("Antimatter Apocalypse")
        if (player.totalTimePlayed >= 10 * 60 * 60 * 12) giveAchievement("One for each dimension")
        if (canGetMultidimensional()) {
          giveAchievement("Multidimensional");
        }
        if (isNaN(player.totalmoney)) player.totalmoney = new Decimal(10)

        player.lastUpdate = thisUpdate;
    }, 50);
}


function dimBoolean() {
    if (!player.autobuyers['shift'].isOn) {
      return false;
    }
    if (player.autobuyers['shift'].ticks*100 < player.autobuyers['shift'].interval) {
      return false;
    }
    if (player.eternities < 10 && !canReset('shift', player.autobuyers['shift'].bulk)) {
      return false;
    }
    // Removed some weird priority stuff here (maybe add it back).
    return true;
}

function maxBuyDimShifts () {
    while (canReset('shift')) {
        player.shiftResets++;
    }
    softReset(0, 'none');
}

function autoBuyerTick () {

    if (player.eternities >= 100 && player.eternityBuyer.isOn && gainedEternityPoints().gte(player.eternityBuyer.limit)) {
      eternity();
    }

    if (player.autobuyers['bigcrunch']) {
      var crunch = player.autobuyers['bigcrunch'];
      if (crunch.ticks * 100 >= crunch.interval && player.money.gte(player.challengeTarget)) {
        if (crunch.isOn) {
          if (player.autoCrunchMode == "amount") {
            if (!player.break || player.currentChallenge.name !== "" || crunch.ip.lt(gainedInfinityPoints())) {
              autoS = false;
              document.getElementById("bigcrunch").click()
            }
          } else if (player.autoCrunchMode == "time"){
            if (!player.break || player.currentChallenge.name !== "" || crunch.ip.lt(player.thisInfinityTime/10)) {
              autoS = false;
              document.getElementById("bigcrunch").click()
            }
          } else {
            if (!player.break || player.currentChallenge.name != "" || gainedInfinityPoints().gte(player.lastTenRuns[0][1].times(crunch.ip))) {
              autoS = false;
              document.getElementById("bigcrunch").click()
            }
          }
          crunch.ticks = 1;
        }
      } else {
        crunch.ticks += 1;
      }
    }


    if (player.autobuyers['shift']) {
      if (player.autobuyers['shift'].isOn && dimBoolean()) {
        softReset(player.autobuyers['shift'].bulk, 'shift');
        player.autobuyers['shift'].ticks = 0;
      }
      player.autobuyers['shift'].ticks += 1;
    }




    for (let i of priority) {
      if (i.ticks*100 >= i.interval || i.interval == 100) {
        if (i.isOn && canBuyDimension(i.tier)) {
          if (i.target === 'tickspeed' ) {
            if (i.mode === 'max') {
              buyMaxTickSpeed();
            } else {
              buyTickSpeed()
            }
          } else if (typeof i.target === 'number') {
            if (i.mode === 'until-10') {
              if (player.options.bulkOn) {
                buyManyDimensionAutobuyer(i.target, i.bulk);
              } else {
                buyManyDimensionAutobuyer(i.target, 1)
              }
            } else {
              buyOneDimension(i.target);
            }
          } else {
            throw new Error(i.target + ' should not be in priority.');
          }
          i.ticks = 0;
        }
      } else {
        i.ticks += 1;
      }
    }
    updateCosts()

}


setInterval(function() {
    autoBuyerTick();
}, 100);

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
        if (player.newsArray.length >= 50 && !hasAchievement("Fake News")) {
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

var startChallengeClosure = function (i) {
  return function () {
    startChallenge(i);
  }
}

for (let i of challengeList) {
  document.getElementById(i).onclick = startChallengeClosure(i);
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

var lnLnInfinitied = function () {
  return Math.log(Math.log(player.infinitied));
}

var infInterpolDict = {
  infinitied: function () {
    return formatValue(player.options.notation, dimMults(), 1, 1);
  },
  lnLnInfinitied: function () {
    return lnLnInfinitied().toFixed(2);
  },
  timeProdIncrease: function () {
    return timeProdIncrease().toFixed(2);
  },
  currProdIncrease: function () {
    return currProdIncrease().toFixed(2);
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
    return getPerTickspeedBoost().toFixed(2);
  },
  twiceTickspeedBoostPower: function () {
    return (getPerTickspeedBoost() * 2).toFixed(2);
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
  if (e === undefined || e === null) {
    throw new Error('Element does not exist!');
  }
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
        if (inMatterIncreasingChallenge(player.currentChallenge) && player.matter.equals(0)) {
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
        if (inMatterIncreasingChallenge(player.currentChallenge) && player.matter.equals(0)) {
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
  initChallengeTimes();
  insertDimAutobuyers();
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
