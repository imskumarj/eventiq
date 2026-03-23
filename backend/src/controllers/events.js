import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
} from "../services/events.js";

/* ---------------- GET EVENTS ---------------- */

export async function getEventsController(req, res) {

  try {

    const { search, page, limit } = req.query;

    const data = await getEvents({
      search,
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      user: req.user // 🔥 IMPORTANT
    });

    res.json(data);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch events"
    });

  }

}

import { getEventById } from "../services/events.js";

/* ---------------- GET EVENT BY ID ---------------- */

export async function getEventByIdController(req, res) {

  try {

    const event = await getEventById(
      req.params.id,
      req.user   // 🔥 IMPORTANT
    );

    res.json({
      success: true,
      data: event
    });

  } catch (error) {

    console.error(error);

    res.status(403).json({
      success: false,
      message: error.message || "Failed to fetch event"
    });

  }

}

/* ---------------- CREATE EVENT ---------------- */

export async function createEventController(req, res) {

  try {

    const event = await createEvent(
      req.body,
      req.user.id
    );

    res.status(201).json(event);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to create event"
    });

  }

}

/* ---------------- UPDATE EVENT ---------------- */

export async function updateEventController(req, res) {

  try {

    const event = await updateEvent(
      req.params.id,
      req.body
    );

    res.json(event);

  } catch (error) {

    res.status(500).json({
      message: "Failed to update event"
    });

  }

}

/* ---------------- DELETE EVENT ---------------- */

export async function deleteEventController(req, res) {

  try {

    await deleteEvent(req.params.id);

    res.json({
      message: "Event deleted"
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to delete event"
    });

  }

}