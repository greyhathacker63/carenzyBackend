const { Types } = require("mongoose");
const followModel = require("../models/follow");
const { paginationAggregate } = require("../utilities/pagination");
const { clearSearch } = require("../utilities/Helper");

class followServices {
	static async details(_id) {
		const response = { data: {}, status: false };
		try {
			_id = Types.ObjectId(_id);
			response.data = await followModel.aggregate([
				{
					$match: {
						followerId: _id ? Types.ObjectId(_id) : "",
						isDeleted: false,
					},
				},
				{
					$lookup: {
						from: "dealers",
						localField: "followingId",
						foreignField: "_id",
						as: "followingDetails",
						pipeline: [
							{
								$project: {
									name: "$name",
								},
							},
						],
					},
				},
				{
					$project: {
						followerId: 1,
						followingId: 1,
						followingDetails: 1,
					},
				},
			]);
			response.status = true;
			return response;
		} catch (error) {
			throw error;
		}
	}

	static async list(query = {}) {
		const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
		let response = { data: [], extra: { ...$extra }, status: false };

		try {
			const search = {
				followerId: query.followerId ? Types.ObjectId(query.followerId) : "",
				followingId: query.followingId ? Types.ObjectId(query.followingId) : "",
				isDeleted: false,
			};

			clearSearch(search);

			let $aggregate;
			if (!query.followingId && query.followerId) {
				$aggregate = [
					{ $match: search },
					{
						$lookup: {
							from: "dealers",
							localField: "followingId",
							foreignField: "_id",
							as: "followingDetails",
							pipeline: [
								{
									$project: {
										name: "$dealershipName",
										avatar: 1
									}
								}
							]
						}
					},
					{ $unwind: { path: "$followingDetails" } },
					{
						$project: {
							_id: 0,
							followingDetails: 1,
						},
					},
				];
				response = await paginationAggregate(followModel, $aggregate, $extra);

				response.data = response.data?.map(v => v.followingDetails);
			} else {
				$aggregate = [
					{ $match: search },
					{
						$lookup: {
							from: "dealers",
							localField: "followerId",
							foreignField: "_id",
							as: "followerDetails",
							pipeline: [
								{
									$project: {
										name: "$dealershipName",
										avatar: 1
									}
								}
							]
						}
					},
					{ $unwind: { path: "$followerDetails" } },
					{
						$project: {
							_id: 0,
							followerDetails: 1,
						},
					},
				];
				response = await paginationAggregate(followModel, $aggregate, $extra);

				response.data = response.data?.map(v => v.followerDetails);
			}

			response.status = true;
			return response;
		} catch (err) {
			throw err;
		}
	}

	static async count(query = {}) {
		let response = { data: {}, status: false };

		try {
			const followingData = (await followModel.aggregate([
				{ $match: { followerId: query.dealerId, isDeleted: false } },
				{
					$group: {
						_id: "$followerId",
						followingCount: { $sum: 1 },
					},
				},
			]))?.[0];
			const followerData = (await followModel.aggregate([
				{ $match: { followingId: query.dealerId, isDeleted: false } },
				{
					$group: {
						_id: "$followingId",
						followerCount: { $sum: 1 },
					},
				},
			]))?.[0];

			response.data.followingCount = followingData?.followingCount || 0;
			response.data.followerCount = followerData?.followerCount || 0;

			response.status = true;

			return response;
		} catch (err) {
			throw err;
		}
	}

	static async checkIfFollowing(query = {}) {
		let response = { data: { following: false }, status: false };

		try {
			const data = await followModel.findOne({ followerId: Types.ObjectId(query.followerId), followingId: Types.ObjectId(query.followingId), isDeleted: false });

			if (data) {
				response.data.following = true;
			}

			response.status = true;

			return response;
		} catch (err) {
			throw err;
		}
	}

	static async save(data) {
		const response = { data: {}, status: false };
		try {
			const docData = await followModel.findOne({ followerId: Types.ObjectId(data.followerId), followingId: Types.ObjectId(data.followingId), isDeleted: false }) || new followModel();

			docData.followerId = data.followerId;
			docData.followingId = data.followingId;
			await docData.save();

			response.data = docData;
			response.status = true;
			return response;
		} catch (err) {
			throw err;
		}
	}

	static async delete(data) {
		const response = { status: false, ids: [] };
		try {
			await followModel.updateOne(
				{
					followerId: data.followerId,
					followingId: data.followingId,
					isDeleted: false,
				},
				{ isDeleted: true }
			);
			response.status = true;

			return response;
		} catch (error) {
			throw error;
		}
	}
}

module.exports = followServices;
