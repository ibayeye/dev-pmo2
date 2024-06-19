import { deleteFiles } from "../../components/UploadFile.js";
import { deleteImage } from "../../components/UploadImage.js";
import Aplikasi from "../../models/Aplikasi.js";

export const deleteDataAplikasi = async (req, res) => {
    try {
        const { id, layanan } = req.body;
        const apiKey = req.headers["x-api-key"];

        if (!apiKey) {
            return res.status(401).json({
                status: "error",
                msg: "API Key is required",
            });
        }

        const aplikasiItem = await Aplikasi.findOne({
            where: {
                id: id,
            },
        });

        if (!aplikasiItem) {
            return res.status(404).json({
                status: "error",
                msg: "Item not found",
            });
        }

        const mergedDataProcess = {
            ...JSON.parse(aplikasiItem.on_validation),
            ...JSON.parse(aplikasiItem.on_process),
            ...JSON.parse(aplikasiItem.on_finish),
            ...JSON.parse(aplikasiItem.fields),
        };
        console.log("Merged Data:", mergedDataProcess);

        const findValueByTitle = (data, title) => data[title];

        const file_process_bisinessValue = findValueByTitle(mergedDataProcess, 'file_process_bisiness');
        const upload_dokumen_hasil_integrasiValue = findValueByTitle(mergedDataProcess, 'upload_dokumen_hasil_integrasi');
        const file_submissionValue = findValueByTitle(mergedDataProcess, 'file_submission');
        const upload_dokumen_laporan_modul_tteValue = findValueByTitle(mergedDataProcess, 'upload_dokumen_laporan_modul_tte');
        const file_uploadValue = findValueByTitle(mergedDataProcess, 'file_upload');

        const foundValues = [
            file_process_bisinessValue,
            upload_dokumen_hasil_integrasiValue,
            file_submissionValue,
            upload_dokumen_laporan_modul_tteValue,
            file_uploadValue
        ].filter(Boolean);

        if (foundValues.length > 0) {
            await Promise.all(foundValues.map(async value => {
                await deleteFiles(value, layanan);
                await deleteImage(value, layanan);
            }));
            console.log("Data ditemukan:", foundValues, layanan);
        }

        const deletedItem = await Aplikasi.destroy({
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
        console.error(error);
        res.status(500).json({
            status: "error",
            msg: "Internal Server Error",
        });
    }
};
