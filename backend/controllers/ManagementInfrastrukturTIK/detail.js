import ManagementInfrastrukturTIK from "../../models/ManagementInfrastrukturTIKModel.js";
import SekretariatModel from "../../models/SekretariatModel.js";

export const getDetailDataManagementInfrastrukturTIK = async(req, res) => {
    try {
        const { id, role } = req.body;
        const apiKey = req.headers["x-api-key"];

        if (!apiKey) {
            return res.status(401).json({
                status: "error",
                msg: "API Key is required",
            });
        }

        const managementinfrastrukturtikDetail = await ManagementInfrastrukturTIK.findByPk(id);
        if (!managementinfrastrukturtikDetail) {
            return res.status(404).json({
                status: "error",
                msg: "Item not found",
            });
        }

        const userHasPermission =
        managementinfrastrukturtikDetail.dataValues.role.includes(role);
        if (!userHasPermission) {
            return res.status(403).json({
                status: "error",
                msg: "You don't have permission to view this detail",
            });
        }

        const fields = JSON.parse(managementinfrastrukturtikDetail.fields);
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
        fields.createdAt = managementinfrastrukturtikDetail.createdAt;
        const rearrangedData = rearrangeObject(fields, propertiesToMoveUp);
        res.json({
            status: "ok",
            msg: "Data retrieved successfully",
            data: {
                id: managementinfrastrukturtikDetail.id,
                submission_status: managementinfrastrukturtikDetail.submission_status,
                comment: managementinfrastrukturtikDetail.comment,
                fileuploaded: managementinfrastrukturtikDetail.fileuploaded,
                fields: rearrangedData,
                on_validation: managementinfrastrukturtikDetail.on_validation,
                on_validation_technique: managementinfrastrukturtikDetail.on_validation_technique,
                on_process: managementinfrastrukturtikDetail.on_process,
                on_finish: managementinfrastrukturtikDetail.on_finish,
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