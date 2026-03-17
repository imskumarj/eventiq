import { getSystemMetrics } from "../services/system-metrics.js";

export async function getSystemMetricsController(req, res) {

  try {

    const data = await getSystemMetrics();

    res.json(data);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch system metrics"
    });

  }

}