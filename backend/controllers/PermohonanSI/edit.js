import PermohonanSI from "../../models/PermohonanSI.js";

export const editDataPermohonanSI = async (req, res) => {
    try {
        const { id, type, data } = req.body;
        const apiKey = req.headers["x-api-key"];
        if (!apiKey) {
            return res.status(401).json({
                status: "error",
                msg: "API Key is required",
            });
        }
        const permohonanSIItem = await PermohonanSI.findOne({
            where: {
                id: id,
            },
        });
        if (!permohonanSIItem) {
            return res.status(404).json({
                status: "error",
                msg: "Item not found",
            });
        }
        const convertData = JSON.parse(data);
        console.log(convertData);
        if (type === "validation") {
            if (convertData.status_validation === "Disetujui") {
                permohonanSIItem.submission_status = 4;
            } else if (convertData.status_validation === "Ditolak") {
                permohonanSIItem.submission_status = 3;
            }
            permohonanSIItem.on_validation = data;
        } else if (type === "feasibility_analysis") {
            if (convertData.status_validation === "Disetujui") {
                permohonanSIItem.submission_status = 4;
            } else if (convertData.status_validation === "Ditolak") {
                permohonanSIItem.submission_status = 3;
            }
            permohonanSIItem.feasibility_analysis = data;
        }else if (type === "feasibility_validation") {
            if (convertData.status_validation === "Disetujui") {
                permohonanSIItem.submission_status = 4;
            } else if (convertData.status_validation === "Ditolak") {
                permohonanSIItem.submission_status = 3;
            }
            permohonanSIItem.feasibility_validation = data;
        }
        
        
        
         else if (type === "process") {
            permohonanSIItem.on_process = data;
        } else if (type === "finish") {
            if (
                convertData.submission_status === "Menyetujui" ||
                convertData.submission_status === "Disetujui"
            ) {
                permohonanSIItem.submission_status = 7;
            } else if (
                convertData.submission_status === "Tidak Menyetujui" ||
                convertData.submission_status === "Ditolak"
            ) {
                permohonanSIItem.submission_status = 8;
            }
            permohonanSIItem.on_finish = data;
        }
        await permohonanSIItem.save();
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