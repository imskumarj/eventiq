import {
  getSponsors,
  createSponsor
} from "../services/sponsors.js";

/* ---------------- GET ---------------- */

export async function getSponsorsController(req, res) {

  try {

    const { search } = req.query;

    const data = await getSponsors({
      search,
      user: req.user   // ✅ IMPORTANT
    });

    res.json({
      success: true,
      data
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch sponsors"
    });

  }

}

/* ---------------- CREATE ---------------- */

export async function createSponsorController(req, res) {

  try {

    const result = await createSponsor(req.body);

    res.status(201).json(result);

  } catch (error) {

    console.error(error);

    res.status(400).json({
      success: false,
      message: error.message || "Failed to create sponsor"
    });

  }

}