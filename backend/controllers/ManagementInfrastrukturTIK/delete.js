import { deleteFiles } from "../../components/UploadFile.js";
import { deleteImage } from "../../components/UploadImage.js";
import ManagementInfrastrukturTIK from "../../models/ManagementInfrastrukturTIKModel.js";

export const deleteDataManagementInfrastrukturTIK = async (req, res) => {
    try {
        const { id, layanan } = req.body;
        const apiKey = req.headers["x-api-key"];

        if (!apiKey) {
            return res.status(401).json({
                status: "error",
                msg: "API Key is required",
            });
        }

        const managementinfrastrukturtikItem = await ManagementInfrastrukturTIK.findOne({
            where: {
                id: id,
            },
        });

        if (!managementinfrastrukturtikItem) {
            return res.status(404).json({
                status: "error",
                msg: "Item not found",
            });
        }

        const mergedDataProcess = {
            ...JSON.parse(managementinfrastrukturtikItem.on_validation),
            ...JSON.parse(managementinfrastrukturtikItem.on_process),
            ...JSON.parse(managementinfrastrukturtikItem.on_finish),
            ...JSON.parse(managementinfrastrukturtikItem.fields),
        };
        console.log("Merged Data:", mergedDataProcess);

        const findValueByTitle = (data, title) => data[title];

        const upload_dokumen_hasil_integrasiValue = findValueByTitle(mergedDataProcess, 'upload_dokumen_hasil_integrasi');
        const upload_dokumen_laporan_modul_tteValue = findValueByTitle(mergedDataProcess, 'upload_dokumen_laporan_modul_tte');
        const upload_dokumen_laporan_pembuatan_akunValue = findValueByTitle(mergedDataProcess, 'upload_dokumen_laporan_pembuatan_akun');
        const file_submissionValue = findValueByTitle(mergedDataProcess, 'file_submission');
        const file_uploadValue = findValueByTitle(mergedDataProcess, 'file_upload');

        const foundValue = [
            upload_dokumen_hasil_integrasiValue,
            upload_dokumen_laporan_modul_tteValue,
            upload_dokumen_laporan_pembuatan_akunValue,
            file_submissionValue,
            file_uploadValue
        ].filter(Boolean);

        if (foundValue) {
            await Promise.all(foundValue.map(async value => {
                await deleteFiles(value, layanan);
                await deleteImage(value, layanan);
            }));
            console.log("Data ditemukan dan dihapus:", foundValue, layanan);
        } else {
            console.log("Data tidak ditemukan");
        }

        const deletedItem = await ManagementInfrastrukturTIK.destroy({
            where: {
                id: id,
            },
        });

        if (deletedItem) {
            return res.status(200).json({
                status: "ok",
                msg: "Item deleted successfully",
            });
        } else {
            return res.status(404).json({
                status: "error",
                msg: "Item not found",
            });
        }
    } catch (error) {
        console.error("Error deleting management infrastructure TIK data:", error);
        return res.status(500).json({
            status: "error",
            msg: "Internal Server Error",
        });
    }
};
