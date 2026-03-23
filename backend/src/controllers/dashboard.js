import { getDashboardData } from "../services/dashboard.js";

export async function getDashboardController(req, res) {

  try {

    const data = await getDashboardData(req.user); // 🔥 PASS USER

    res.json(data);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch dashboard data"
    });

  }

}