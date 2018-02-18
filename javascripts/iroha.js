function bin_log (n) {
  if (n.lt(1)) {
    return bin_log(bin_inv(n)).negate();
  }
  let r = Math.floor(n.log(2));
  let x = Decimal.pow(2, r);
  return Decimal.plus(r, n.div(x).sub(1));
}

function bin_inv (n) {
  let x = Decimal.pow(2, Math.ceil(n.log(2)));
  let diff = x.sub(n);
  return Decimal.div(1, x).plus(diff.div(x.pow(2)).times(2));
}

let iroha_zero = '日';

let iroha_one = '山';

let iroha_negate = function (x) {return '見' + x}

let iroha_invert = function (x) {return '世' + x}

let iroha_special = 'いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふこえてあさきゆめみしゑひもせアイウエオカキクケコ';

function iroha (n, depth) {
  n = new Decimal(n);
  if (isNaN(n.e)) {
    return '今';
  }
  if (depth === 0) {
    return '';
  }
  if (n.eq(0)) {
    return iroha_zero;
  }
  if (n.eq(1)) {
    return iroha_one;
  }
  if (n.lt(0)) {
    return iroha_negate(iroha(n.negate(), depth));
  }
  if (n.lt(1)) {
    return iroha_invert(iroha(bin_inv(n), depth));
  }
  let log = bin_log(bin_log(n));
  let prefix = (log.lt(0)) ? ((x) => x + 28) : ((x) => x);
  log = log.abs();
  let num = Math.round(log.floor().toNumber());
  let rem = log.sub(num);
  let rec = bin_inv(Decimal.sub(1, rem));
  return iroha_special[prefix(num)] + (rec.eq(1) ? '' : iroha(rec, depth - 1));
}
