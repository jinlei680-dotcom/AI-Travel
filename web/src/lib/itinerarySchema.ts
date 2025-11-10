import { z } from "zod";

// ---------- Input Spec (camelCase or snake_case) ----------
export const PlanSpecInputSchema = z.object({
  destination: z.string().min(1, "destination required"),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  preferences: z
    .object({
      pace: z.enum(["relaxed", "standard", "tight"]).optional(),
      interests: z.array(z.string()).optional(),
      budgetTotal: z.number().optional(),
      partySize: z.number().int().positive().optional(),
    })
    .optional(),
});

export type PlanSpecInput = z.infer<typeof PlanSpecInputSchema>;

export function normalizeSpec(spec: PlanSpecInput) {
  function toISO(s: string): string {
    const t = (s || "").trim();
    if (!t) return "";
    // Already ISO YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return t.slice(0, 10);
    // Try native Date parse
    const d1 = new Date(t);
    if (!isNaN(d1.getTime())) return fmtDate(d1);
    // Chinese formats like 2025年12月3日 / 12月3号
    const m = t.match(/(?:(\d{4})年)?\s*(\d{1,2})月\s*(\d{1,2})[日号]?/);
    if (m) {
      const y = Number(m[1] || new Date().getFullYear());
      const mo = String(Number(m[2])).padStart(2, "0");
      const da = String(Number(m[3])).padStart(2, "0");
      return `${y}-${mo}-${da}`;
    }
    // Common compact forms: MM/DD, MM.DD, MM-DD
    const m2 = t.match(/^(\d{1,2})[./-](\d{1,2})(?:[./-](\d{2,4}))?$/);
    if (m2) {
      const curY = new Date().getFullYear();
      const mm = String(Number(m2[1])).padStart(2, "0");
      const dd = String(Number(m2[2])).padStart(2, "0");
      const yy = m2[3] ? Number(m2[3].length === 2 ? `20${m2[3]}` : m2[3]) : curY;
      return `${yy}-${mm}-${dd}`;
    }
    // Fallback: slice first 10 chars (may be invalid)
    return t.slice(0, 10);
  }
  const start_date = toISO(spec.start_date || spec.startDate || "");
  const end_date = toISO(spec.end_date || spec.endDate || "");
  return {
    destination: spec.destination,
    start_date,
    end_date,
    preferences: spec.preferences || {},
  } as {
    destination: string;
    start_date: string;
    end_date: string;
    preferences?: { pace?: "relaxed" | "standard" | "tight"; interests?: string[]; budgetTotal?: number; partySize?: number };
  };
}

// ---------- Utilities ----------
export function fmtDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function daysBetweenInclusive(start: Date, end: Date) {
  const out: Date[] = [];
  const cur = new Date(start);
  while (cur <= end) {
    out.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}

export function defaultSlots(pace: string | undefined) {
  const p = pace || "standard";
  if (p === "relaxed") return ["上午", "下午"];
  if (p === "tight") return ["早间", "上午", "下午", "傍晚", "夜间"];
  return ["上午", "下午", "夜间"];
}

export function defaultSlotTime(idx: number) {
  const t = ["09:00", "13:30", "18:00", "20:00", "22:00"];
  return t[idx] || "09:00";
}

// ---------- Day/Item Schemas ----------
export const PlanItemSchema = z.object({
  id: z.string().optional(),
  time: z.string().optional(),
  title: z.string(),
  note: z.string().optional(),
  // richer fields for frontend display
  place: z
    .object({
      name: z.string(),
      location: z.object({ lat: z.number(), lng: z.number() }).optional(),
      address: z.string().optional(),
      poiId: z.string().optional(),
      category: z.string().optional(),
    })
    .optional(),
  durationEstimate: z.number().optional(),
  costEstimate: z.number().optional(),
});
export type PlanItem = z.infer<typeof PlanItemSchema>;

export const TransportSchema = z.object({
  mode: z.string(),
  steps: z.array(z.string()).optional(),
  timeEstimate: z.number().optional(),
  priceEstimate: z.number().optional(),
});
export type Transport = z.infer<typeof TransportSchema>;

const LocationSchema = z.object({ lat: z.number(), lng: z.number() });

export const DiningItemSchema = z.object({
  name: z.string(),
  cuisine: z.string().optional(),
  priceRange: z.tuple([z.number(), z.number()]).optional(),
  rating: z.number().optional(),
  distance: z.number().optional(),
  booking: z.boolean().optional(),
  location: LocationSchema.optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  opening_hours: z.string().optional(),
  website: z.string().optional(),
  tags: z.array(z.string()).optional(),
});
export type DiningItem = z.infer<typeof DiningItemSchema>;

export const LodgingItemSchema = z.object({
  name: z.string(),
  area: z.string().optional(),
  price: z.number().optional(),
  rating: z.number().optional(),
  distanceToCore: z.number().optional(),
  amenities: z.array(z.string()).optional(),
  location: LocationSchema.optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  opening_hours: z.string().optional(),
  website: z.string().optional(),
  tags: z.array(z.string()).optional(),
  stars: z.number().optional(),
  checkin_time: z.string().optional(),
  checkout_time: z.string().optional(),
  room_types: z.array(z.string()).optional(),
});
export type LodgingItem = z.infer<typeof LodgingItemSchema>;

export const AttractionItemSchema = z.object({
  name: z.string(),
  ticket: z.union([z.number(), z.string()]).optional(),
  best_time: z.string().optional(),
  tips: z.string().optional(),
  photo_spots: z.array(z.string()).optional(),
  address: z.string().optional(),
  opening_hours: z.string().optional(),
  website: z.string().optional(),
  tags: z.array(z.string()).optional(),
  location: LocationSchema.optional(),
  durationEstimate: z.number().optional(),
});
export type AttractionItem = z.infer<typeof AttractionItemSchema>;

export const RoutePointSchema = z.object({ lat: z.number(), lng: z.number() });

export const PlanDaySchema = z.object({
  date: z.string(),
  items: z.array(PlanItemSchema),
  routePath: z.array(RoutePointSchema).optional(),
  transport: TransportSchema.optional(),
  dining: z.array(DiningItemSchema).optional(),
  lodging: z.array(LodgingItemSchema).optional(),
  attractions: z.array(AttractionItemSchema).optional(),
  markers: z
    .array(
      z.object({
        location: LocationSchema,
        title: z.string().optional(),
        category: z.string().optional(),
        id: z.string().optional(),
        dayIndex: z.number().optional(),
        poiId: z.string().optional(),
      })
    )
    .optional(),
});
export type PlanDay = z.infer<typeof PlanDaySchema>;

export const MarkerSchema = z.object({
  position: z.tuple([z.number(), z.number()]),
  title: z.string().optional(),
});

export const PlanDataSchema = z.object({
  id: z.string(),
  destination: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  days: z.array(PlanDaySchema),
  markers: z.array(MarkerSchema).optional(),
  source: z.enum(["llm", "fallback"]).optional(),
});

// ---------- Repair ----------
export function repairDays(args: {
  rawDays: any[];
  allDates: string[];
  destination: string;
  pace?: string;
}): PlanDay[] {
  const { rawDays, allDates, destination, pace } = args;
  const slots = defaultSlots(pace);
  const byDate: Record<string, PlanDay> = {};

  for (const rd of rawDays || []) {
    const date = String(rd?.date || "");
    if (!date) continue;
    const itemsArr = Array.isArray(rd.items) ? rd.items : [];
    const items: PlanItem[] = itemsArr.map((it: any, idx: number) => ({
      id: `${date}-${idx}`,
      time: String(it?.time || ""),
      title: String(it?.title || "待定"),
      note: it?.note ? String(it.note) : undefined,
    }));
    const day: PlanDay = {
      date,
      items,
      routePath: Array.isArray(rd.routePath)
        ? rd.routePath
            .map((p: any) => ({ lat: Number(p?.lat), lng: Number(p?.lng) }))
            .filter((p: any) => Number.isFinite(p.lat) && Number.isFinite(p.lng))
        : undefined,
      transport: rd.transport && typeof rd.transport === "object" ? {
        mode: String(rd.transport.mode || "transit"),
        steps: Array.isArray(rd.transport.steps) ? rd.transport.steps.map((s: any) => String(s)) : undefined,
        timeEstimate: rd.transport.timeEstimate ? Number(rd.transport.timeEstimate) : undefined,
        priceEstimate: rd.transport.priceEstimate ? Number(rd.transport.priceEstimate) : undefined,
      } : undefined,
      dining: Array.isArray(rd.dining)
        ? rd.dining.map((d: any) => ({
            name: String(d?.name || "当地餐馆"),
            cuisine: d?.cuisine ? String(d.cuisine) : undefined,
            priceRange: Array.isArray(d?.priceRange) && d.priceRange.length === 2 ? [Number(d.priceRange[0]), Number(d.priceRange[1])] : undefined,
            rating: d?.rating ? Number(d.rating) : undefined,
            distance: d?.distance ? Number(d.distance) : undefined,
            booking: typeof d?.booking === "boolean" ? d.booking : undefined,
            location: d?.location && typeof d.location === "object" ? { lat: Number(d.location.lat), lng: Number(d.location.lng) } : undefined,
          }))
        : undefined,
      lodging: Array.isArray(rd.lodging)
        ? rd.lodging.map((h: any) => ({
            name: String(h?.name || "酒店"),
            area: h?.area ? String(h.area) : undefined,
            price: h?.price ? Number(h.price) : undefined,
            rating: h?.rating ? Number(h.rating) : undefined,
            distanceToCore: h?.distanceToCore ? Number(h.distanceToCore) : undefined,
            amenities: Array.isArray(h?.amenities) ? h.amenities.map((a: any) => String(a)) : undefined,
            location: h?.location && typeof h.location === "object" ? { lat: Number(h.location.lat), lng: Number(h.location.lng) } : undefined,
          }))
        : undefined,
      attractions: Array.isArray(rd.attractions)
        ? rd.attractions.map((a: any) => ({
            name: String(a?.name || "景点"),
            ticket: typeof a?.ticket === "number" ? a.ticket : a?.ticket ? String(a.ticket) : undefined,
            best_time: a?.best_time ? String(a.best_time) : undefined,
            tips: a?.tips ? String(a.tips) : undefined,
            photo_spots: Array.isArray(a?.photo_spots) ? a.photo_spots.map((p: any) => String(p)) : undefined,
          }))
        : undefined,
    };
    byDate[date] = day;
  }

  const out: PlanDay[] = [];
  for (let i = 0; i < allDates.length; i++) {
    const date = allDates[i];
    const existing = byDate[date];
    if (existing) {
      out.push(existing);
    } else {
      const items: PlanItem[] = (slots || []).map((_, idx) => ({
        id: `${date}-${idx}`,
        time: defaultSlotTime(idx),
        title: `${destination} 行程建议`,
      }));
      out.push({ date, items });
    }
  }
  return out;
}
