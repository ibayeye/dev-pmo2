import { deleteFiles } from "../../components/UploadFile.js";
import { deleteImage } from "../../components/UploadImage.js";
import PerencanaanTIK from "../../models/PerencanaanTIKModel.js";

export const deleteDataPerencanaanTIK = async (req, res) => {
    try {
        const { id, layanan } = req.body;
        const apiKey = req.headers["x-api-key"];

        if (!apiKey) {
            return res.status(401).json({
                status: "error",
                msg: "API Key is required",
            });
        }

        const perencanaantikItem = await PerencanaanTIK.findOne({
            where: {
                id: id,
            },
        });

        if (!perencanaantikItem) {
            return res.status(404).json({
                status: "error",
                msg: "Item not found",
            });
        }

        const mergedDataProcess = {
            ...JSON.parse(perencanaantikItem.on_validation),
            ...JSON.parse(perencanaantikItem.on_process),
            ...JSON.parse(perencanaantikItem.on_finish),
            ...JSON.parse(perencanaantikItem.fields),
        };
        console.log("Merged Data:", mergedDataProcess);

        const findValueByTitle = (data, title) => data[title];

        const upload_foto_alat_sebelum_di_relokasiValue = findValueByTitle(mergedDataProcess, 'upload_foto_alat_sebelum_di_relokasi');
        const upload_foto_alat_sesudah_di_relokasiValue = findValueByTitle(mergedDataProcess, 'upload_foto_alat_sesudah_di_relokasi');
        const file_submissionValue = findValueByTitle(mergedDataProcess, 'file_submission');
        const file_uploadValue = findValueByTitle(mergedDataProcess, 'file_upload');

        const foundValue = [
            upload_foto_alat_sebelum_di_relokasiValue,
            upload_foto_alat_sesudah_di_relokasiValue,
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

        const deletedItem = await PerencanaanTIK.destroy({
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
        console.error("Error deleting Perencanaan TIK data:", error);
        return res.status(500).json({
            status: "error",
            msg: "Internal Server Error",
        });
    }
};
