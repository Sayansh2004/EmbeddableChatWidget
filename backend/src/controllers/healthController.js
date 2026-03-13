
const getHealth = (req, res) => {
    res.json({
        success: true,
        message: "OK",
        data: {
            env: process.env.NODE_ENV || "development",
            time: new Date().toISOString(),
        },
    });
};

module.exports = { getHealth };

