type Row = {
  rank_group: string;
  n: number
  avg_mean: number
  sd_mean: number

};


export function computeCV(rows: Row[]) {
  const totalN = rows.reduce((s, r) => s + r.n, 0);

  const weightedMean =
    rows.reduce((s, r) => s + r.avg_mean * r.n, 0) / totalN;

  const pooledVariance =
    rows.reduce((s, r) => {
      return (
        s +
        (r.n - 1) * Math.pow(r.sd_mean, 2) +
        r.n * Math.pow(r.avg_mean - weightedMean, 2)
      );
    }, 0) / (totalN - 1);

  const pooledSD = Math.sqrt(pooledVariance);

  return {
    mean: weightedMean,
    sd: pooledSD,
    cv: weightedMean > 0 ? pooledSD / weightedMean : 0,
  };
}
