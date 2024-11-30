const EventEmitter = require('events').EventEmitter
const emitter = new EventEmitter();
const { validateTokenSocketio } = require('../api/middlewares/auth');
const biddingLiveServices = require('../services/biddingLive');
module.exports = ({ server }) => {
    const io = require('socket.io')(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            // allowedHeaders: ["my-custom-header"],
            credentials: true,
        },
    });

    global.socketEmitter = emitter;

    let isFirst = true;

    try {
        io.on('connection', async function (socket) {
            socket.on('subscribe', async (rooms) => {
                // const res = await validateTokenSocketio(socket.handshake.auth.token);
                // if (res.status && res.__cuser?._id) {
                    if (rooms) {
                        if (typeof rooms === "string") {
                            const { data: [firstData] } = await biddingLiveServices.listLive({ _id: rooms })
                            if (firstData) {
                                socket.join(rooms);
                            }
                        } else if (Array.isArray(rooms)) {
                            rooms.forEach(async (room) => {
                                const { data: [firstData] } = await biddingLiveServices.listLive({ _id: rooms })
                                if (firstData) {
                                    socket.join(room);
                                }
                            });
                        }
                    }
                // }
            });

            socket.on('unsubscribe', async (rooms) => {
                if (rooms) {
                    if (typeof rooms === "string") {
                        socket.leave(rooms);
                    } else if (Array.isArray(rooms)) {
                        rooms.forEach(async (room) => {
                            socket.leave(room);
                        });
                    }
                }
            });

            if (isFirst) {
                emitter.removeAllListeners();
                emitter.on('new-bid', function (bidid, message) {
                    io.to(bidid.toString()).emit('new-bid', { bidid, ...message });
                });
            }
            isFirst = false;
        });
    } catch (err) {
    }
};