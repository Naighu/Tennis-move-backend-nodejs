import { Row } from "./extract_trends_data";

export function computeWeightedMean(rows: Row[]) {
    const totalN = rows.reduce((sum, r) => sum + r.n, 0);
    const weightedSum = rows.reduce((sum, r) => sum + r.avg_feature * r.n, 0);
    return weightedSum / totalN;
}
export function computeCV(rows: Row[]) {
    const totalN = rows.reduce((sum, r) => sum + r.n, 0);
    const weightedMean =
        rows.reduce((s, r) => s + r.avg_feature * r.n, 0) / totalN;
    const pooledVariance =
        rows.reduce((s, r) => {
            return (
                s +
                (r.n - 1) * Math.pow(r.sd_feature, 2) +
                r.n * Math.pow(r.sd_feature - weightedMean, 2)
            );
        }, 0) / (totalN - 1);

    const pooledSD = Math.sqrt(pooledVariance);

    return {
        mean: weightedMean,
        sd: pooledSD,
        cv: weightedMean > 0 ? pooledSD / weightedMean : 0,
    };
}

export function groupByPlayerId(data: Row[]) {
    const grouped: Record<string, any> = {};

    for (const row of data) {
        const id = row.player_id;

        if (!grouped[id]) {
            grouped[id] = {
                ...row,
                totalN: 0,
                sumWeightedMean: 0,
                rows: [],
            };
        }

        grouped[id].totalN += row.n;
        grouped[id].sumWeightedMean += row.n * row.avg_feature;
        grouped[id].rows.push(row);
    }

    return grouped
}
export function mergeByPlayer(data: Row[]) {
    const grouped: Record<string, any> = groupByPlayerId(data);



    // 2️⃣ Compute weighted mean & pooled SD
    return Object.values(grouped).map((player) => {
        const weightedMean = player.sumWeightedMean / player.totalN;

        let varianceSum = 0;

        for (const r of player.rows) {
            const sd = r.sd_feature ?? 0;
            const n = r.n;

            // within-group variance
            varianceSum += (n - 1) * Math.pow(sd, 2);

            // between-group variance
            varianceSum += n * Math.pow(r.avg_feature - weightedMean, 2);
        }

        const pooledSD =
            player.totalN > 1
                ? Math.sqrt(varianceSum / (player.totalN - 1))
                : null;
        player.avg_feature = weightedMean
        player.sd_feature = pooledSD
        player.n = player.totalN

        delete player.rows
        delete player.totalN
        return player
    });
}
