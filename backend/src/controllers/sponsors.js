import {
  getSponsors,
  createSponsor
} from "../services/sponsors.js";

/* ---------------- GET ---------------- */

export async function getSponsorsController(req, res) {

  try {

    const { search } = req.query;

    const data = await getSponsors({ search });

    res.json(data);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch sponsors"
    });

  }

}

/* ---------------- CREATE ---------------- */

export async function createSponsorController(req, res) {

  try {

    const sponsor = await createSponsor(req.body);

    res.status(201).json(sponsor);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to create sponsor"
    });

  }

}