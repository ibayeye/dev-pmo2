import UptRadio from "../../models/UptRadioModel.js";

export const editDataUptRadio = async(req, res) => {
    try {
        const { id, type, data } = req.body;
        const apiKey = req.headers["x-api-key"];
        if (!apiKey) {
            return res.status(401).json({
                status: "error",
                msg: "API Key is required",
            });
        }
        const uptradioItem = await UptRadio.findOne({
            where: {
                id: id,
            },
        });
        if (!uptradioItem) {
            return res.status(404).json({
                status: "error",
                msg: "Item not found",
            });
        }
        const convertData = JSON.parse(data);
        console.log(convertData);
        if (type === "validation") {
            if (convertData.status_validation === "Disetujui") {
                uptradioItem.submission_status = 4;
            } else if (convertData.status_validation === "Ditolak") {
                uptradioItem.submission_status = 3;
            }
            uptradioItem.on_validation = data;
        } else if (type === "validation_technique") {
            uptradioItem.on_validation_technique = data;
        } else if (type === "process") {
            uptradioItem.on_process = data;
        } else if (type === "finish") {
            if (
                convertData.submission_status === "Menyetujui" ||
                convertData.submission_status === "Disetujui"
            ) {
                uptradioItem.submission_status = 7;
            } else if (
                convertData.submission_status === "Tidak Menyetujui" ||
                convertData.submission_status === "Ditolak"
            ) {
                uptradioItem.submission_status = 8;
            }
            uptradioItem.on_finish = data;
        }
        await uptradioItem.save();
        return res.status(200).json({
            status: "ok",
            msg: "Item updated successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            msg: "Internal Server Error",
        });
    }
};