import PermohonanSI from "../../models/PermohonanSI.js";

export const setStatusDataPermohonanSI = async(req, res) => {
    try {
        let rawData = req.body;
        const apiKey = req.headers["x-api-key"];

        if (!apiKey) {
            return res.status(401).json({
                status: "error",
                msg: "API Key is required",
            });
        }
        let processedData = {...rawData };
        const notAllowedFields = ["role", "apiKey"];
        notAllowedFields.forEach((field) => {
            if (processedData.hasOwnProperty(field)) {
                delete processedData[field];
            }
        });

        console.log("Processed data:", processedData);
        console.log(1, rawData);

        if (Array.isArray(rawData.role) || typeof rawData.role === "object") {
            rawData.role = JSON.stringify(rawData.role);
        }
        rawData.apiKey = apiKey;
        rawData.fields = JSON.stringify(processedData);
        rawData.submission_status = 1;
        rawData.on_validation = JSON.stringify({});
        rawData.feasibility_analysis = JSON.stringify({});
        rawData.feasibility_validation = JSON.stringify({});
        rawData.technical_analysis = JSON.stringify({});
        rawData.technical_validation = JSON.stringify({});
        rawData.on_finish = JSON.stringify({ submission_status: "0" });

        await PermohonanSI.create(rawData);
        res.status(200).json({
            status: "ok",
            msg: "Item created successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            msg: "Internal Server Error",
        });
    }
};

export const editProcessDataPermohonanSI = async(req, res) => {
    try {
        const { id, status } = req.body;
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
        if (parseInt(permohonanSIItem.submission_status) === 1) {
            console.log("jalan");
            permohonanSIItem.submission_status = 2;
            await permohonanSIItem.save();
        } else if (parseInt(permohonanSIItem.submission_status) === 4) {
            console.log("jalan");
            if (status === "Ditolak") {
                permohonanSIItem.submission_status = 5;
            } else if (status === "Lanjutkan") {
                permohonanSIItem.submission_status = 6;
            } else {
                permohonanSIItem.submission_status = 4;
            }
            await permohonanSIItem.save();
        }
        else if (parseInt(permohonanSIItem.submission_status) === 6) {
            console.log("jalan");
            if (status === "Ditolak") {
                permohonanSIItem.submission_status = 7;
            } else if (status === "Lanjutkan") {
                permohonanSIItem.submission_status = 8;
            } else {
                permohonanSIItem.submission_status = 6;
            }
            await permohonanSIItem.save();
        }
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