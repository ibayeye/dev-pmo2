import ListToolsModel from "../../models/ListToolsInfra.js";

export const getListDataTools = async(req, res) => {
    try {
        const apiKey = req.headers["x-api-key"];
        if (!apiKey) {
            return res.status(401).json({
                status: "error",
                msg: "API Key is required",
            });
        } else {
            const infrastruktur = await ListToolsModel.findAll();
            infrastruktur.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            const totalItemsByStatus = {
                divalidasi: infrastruktur.filter(
                    (user) => user.submission_status === 2 || user.submission_status === 4
                ).length,
                diproses: infrastruktur.filter(
                    (user) => user.submission_status === 6
                ).length,
                ditolak: infrastruktur.filter(
                    (user) => user.submission_status === 3 || user.submission_status === 5 || user.submission_status === 8
                ).length,
                disetujui: infrastruktur.filter(
                    (user) => user.submission_status === 7
                ).length,
            };
            res.json({
                status: "ok",
                msg: "Data infrastruktur retrieved successfully",
                data: infrastruktur.map((item) => {
                    return {
                        id: item.id,
                        name_tools: item.name_tools,
                        type_tools: item.type_tools,
                        total_tools: item.total_tools,
                        spec_tools: item.spec_tools,
                        createdAt: item.createdAt,
                    };
                }),
                totalItems: infrastruktur.length,
                totalItemsByStatus: totalItemsByStatus,
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