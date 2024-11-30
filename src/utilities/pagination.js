module.exports.paginationAggregate = async function ($model, $aggregate, $extra) {
    const data = { data: [], extra: {} };

    data.extra = {
        page: $extra.page * 1 > 0 ? $extra.page * 1 : 1,
        limit: $extra.limit * 1 > 0 ? $extra.limit * 1 : 20,
        total: 0,
    };

    try {
        const counter = $extra.total ? [{ total: $extra.total }] : await $model.aggregate([...$aggregate, { $count: "total" }]);
        data.extra.total = counter[0]?.total;
        if ($extra.isAll) {
            data.extra.page = 1;
            data.extra.limit = data.extra.total;
        }
        data.extra.total = counter[0]?.total;
        if ($extra.isAll) {
            data.extra.page = 1;
            data.extra.limit = data.extra.total || 100;
        }

        data.data = await $model.aggregate(
            [
                ...$aggregate,
                { $limit: data.extra.limit + data.extra.limit * (data.extra.page - 1) },
                { $skip: data.extra.limit * (data.extra.page - 1) }
            ]);

        return data;
    } catch (err) {
        throw err;
    }
}

module.exports.paginationAggregate = async function ($model, $aggregate, $extra) {
    const data = { data: [], extra: {} };

    data.extra = {
        page: $extra.page * 1 > 0 ? $extra.page * 1 : 1,
        limit: $extra.limit * 1 > 0 ? $extra.limit * 1 : 20,
        total: 0,
    };

    try {
        const pipeline = [...$aggregate];

        if ($extra.isAll) {
            data.data = await $model.aggregate([...$aggregate]);
            data.extra = {
                page: 1,
                limit: data.data?.length || 0,
                total: data.data?.length || 0
            };
        } else if ($extra.total) {
            data.data = await $model.aggregate([
                ...$aggregate,
                { $limit: data.extra.limit + data.extra.limit * (data.extra.page - 1) },
                { $skip: data.extra.limit * (data.extra.page - 1) }
            ]);
            data.extra.total = $extra.total * 1;
        } else {
            pipeline.push({
                $facet: {
                    paginatedData: [
                        { $skip: data.extra.limit * (data.extra.page - 1) },
                        { $limit: data.extra.limit }
                    ],
                    totalCount: [
                        { $group: { _id: null, count: { $sum: 1 } } }
                    ]
                }
            });
            const result = await $model.aggregate(pipeline);

            data.data = result[0].paginatedData;

            data.extra.total = result[0].totalCount.length > 0 ? result[0].totalCount[0].count : 0;
        }

        return data;
    } catch (err) {
        throw err;
    }
}
