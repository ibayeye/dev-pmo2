import PerencanaanTIK from "../../models/PerencanaanTIKModel.js";

export const getDetailDataPerencanaanTIK = async(req, res) => {
    try {
        const { id, role } = req.body;
        const apiKey = req.headers["x-api-key"];

        if (!apiKey) {
            return res.status(401).json({
                status: "error",
                msg: "API Key is required",
            });
        }

        const perencanaantikDetail = await PerencanaanTIK.findByPk(id);
        if (!perencanaantikDetail) {
            return res.status(404).json({
                status: "error",
                msg: "Item not found",
            });
        }

        const userHasPermission =
        perencanaantikDetail.dataValues.role.includes(role);
        if (!userHasPermission) {
            return res.status(403).json({
                status: "error",
                msg: "You don't have permission to view this detail",
            });
        }

        const fields = JSON.parse(perencanaantikDetail.fields);
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
        fields.createdAt = perencanaantikDetail.createdAt;
        const rearrangedData = rearrangeObject(fields, propertiesToMoveUp);
        res.json({
            status: "ok",
            msg: "Data retrieved successfully",
            data: {
                id: perencanaantikDetail.id,
                submission_status: perencanaantikDetail.submission_status,
                comment: perencanaantikDetail.comment,
                fileuploaded: perencanaantikDetail.fileuploaded,
                fields: rearrangedData,
                on_validation: perencanaantikDetail.on_validation,
                on_validation_technique: perencanaantikDetail.on_validation_technique,
                on_process: perencanaantikDetail.on_process,
                on_finish: perencanaantikDetail.on_finish,
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