import { deleteFiles } from "../../components/UploadFile.js";
import { deleteImage } from "../../components/UploadImage.js";
import InfraModel from "../../models/InfraModel.js";

export const deleteDataInfrastruktur = async (req, res) => {
    try {
        const { id, layanan } = req.body;
        const apiKey = req.headers["x-api-key"];

        if (!apiKey) {
            return res.status(401).json({
                status: "error",
                msg: "API Key is required",
            });
        }

        const infrastrukturItem = await InfraModel.findOne({
            where: {
                id: id,
            },
        });

        if (!infrastrukturItem) {
            return res.status(404).json({
                status: "error",
                msg: "Item not found",
            });
        }

        const mergedDataProcess = {
            ...JSON.parse(infrastrukturItem.on_validation),
            ...JSON.parse(infrastrukturItem.on_process),
            ...JSON.parse(infrastrukturItem.on_finish),
            ...JSON.parse(infrastrukturItem.fields),
        };
        console.log("Merged Data:", mergedDataProcess);

        const findValueByTitle = (data, title) => data[title];

        const image_screenshootValue = findValueByTitle(mergedDataProcess, 'image_screenshoot');
        const upload_foto_alat_sebelum_di_relokasiValue = findValueByTitle(mergedDataProcess, 'upload_foto_alat_sebelum_di_relokasi');
        const upload_foto_alat_sesudah_di_relokasiValue = findValueByTitle(mergedDataProcess, 'upload_foto_alat_sesudah_di_relokasi');
        const upload_foto_alat_sebelum_di_tambahkanValue = findValueByTitle(mergedDataProcess, 'upload_foto_alat_sebelum_di_tambahkan');
        const upload_foto_alat_sesudah_di_tambahkanValue = findValueByTitle(mergedDataProcess, 'upload_foto_alat_sesudah_di_tambahkan');
        const upload_foto_kegiatanValue = findValueByTitle(mergedDataProcess, 'upload_foto_kegiatan');
        const file_submissionValue = findValueByTitle(mergedDataProcess, 'file_submission');
        const file_uploadValue = findValueByTitle(mergedDataProcess, 'file_upload');

        const foundValue = [
            image_screenshootValue,
            upload_foto_alat_sebelum_di_relokasiValue,
            upload_foto_alat_sesudah_di_relokasiValue,
            upload_foto_alat_sebelum_di_tambahkanValue,
            upload_foto_alat_sesudah_di_tambahkanValue,
            upload_foto_kegiatanValue,
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

        const deletedItem = await InfraModel.destroy({
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
        console.error("Error deleting infrastructure data:", error);
        return res.status(500).json({
            status: "error",
            msg: "Internal Server Error",
        });
    }
};
