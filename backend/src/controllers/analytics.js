import * as analyticsService from "../services/analytics.js";

export async function getAnalyticsDashboard(req, res, next) {
  try {

    const data = await analyticsService.getDashboardAnalytics();

    res.json({
      success: true,
      data
    });

  } catch (error) {
    next(error);
  }
}