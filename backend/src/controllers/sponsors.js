import {
  getSponsors,
  createSponsor
} from "../services/sponsors.js";
import prisma from "../config/db.js";

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

export async function updateLeads(req, res) {
  try {
    const { leads, boothVisits } = req.body;

    const updated = await prisma.sponsorship.update({
      where: { id: req.params.id },
      data: {
        leads: Number(leads),
        boothVisits: Number(boothVisits)
      }
    });

    res.json({ success: true, data: updated });

  } catch {
    res.status(500).json({ message: "Failed to update leads" });
  }
}