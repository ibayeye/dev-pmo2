import PermohonanSI from "../../models/PermohonanSI.js";

export const getDetailDataPermohonanSI = async(req, res) => {
    try {
        const { id, role } = req.body;
        const apiKey = req.headers["x-api-key"];

        if (!apiKey) {
            return res.status(401).json({
                status: "error",
                msg: "API Key is required",
            });
        }

        const permohonanSIDetail = await PermohonanSI.findByPk(id);
        if (!permohonanSIDetail) {
            return res.status(404).json({
                status: "error",
                msg: "Item not found",
            });
        }

        const userHasPermission =
        permohonanSIDetail.dataValues.role.includes(role);
        if (!userHasPermission) {
            return res.status(403).json({
                status: "error",
                msg: "You don't have permission to view this detail",
            });
        }

        const fields = JSON.parse(permohonanSIDetail.fields);
        // Move specific properties to the top of the object
        const propertiesToMoveUp = [
            "createdAt",
            "submission_title",
            "submission_type",
        ];
        const rearrangeObject = (obj, props) => {
            const rearrangedObj = {};
            props.forEach((prop) => {
                if (obj[prop] !== undefined) {
                    rearrangedObj[prop] = obj[prop];
                    delete obj[prop];
                }
            });
            return {...rearrangedObj, ...obj };
        };

        // Add createdAt to fields before rearranging
        fields.createdAt = permohonanSIDetail.createdAt;
        const rearrangedData = rearrangeObject(fields, propertiesToMoveUp);
        res.json({
            status: "ok",
            msg: "Data retrieved successfully",
            data: {
                id: permohonanSIDetail.id,
                submission_status: permohonanSIDetail.submission_status,
                comment: permohonanSIDetail.comment,
                fileuploaded: permohonanSIDetail.fileuploaded,
                fields: rearrangedData,
                on_validation: permohonanSIDetail.on_validation,
                feasibility_analysis: permohonanSIDetail.feasibility_analysis,
                feasibility_validation: permohonanSIDetail.feasibility_validation,
                technical_analysis: permohonanSIDetail.technical_analysis,
                technical_validation: permohonanSIDetail.technical_validation,
                on_finish: permohonanSIDetail.on_finish,
            },
        });
    } catch (error) {
        console.error(error); // Log error for debugging purposes
        res.status(500).json({
            status: "error",
            msg: "Internal Server Error",
        });
    }
};