module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/AI-Travel/web/src/lib/itinerarySchema.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AttractionItemSchema",
    ()=>AttractionItemSchema,
    "DiningItemSchema",
    ()=>DiningItemSchema,
    "LodgingItemSchema",
    ()=>LodgingItemSchema,
    "MarkerSchema",
    ()=>MarkerSchema,
    "PlanDataSchema",
    ()=>PlanDataSchema,
    "PlanDaySchema",
    ()=>PlanDaySchema,
    "PlanItemSchema",
    ()=>PlanItemSchema,
    "PlanSpecInputSchema",
    ()=>PlanSpecInputSchema,
    "RoutePointSchema",
    ()=>RoutePointSchema,
    "TransportSchema",
    ()=>TransportSchema,
    "daysBetweenInclusive",
    ()=>daysBetweenInclusive,
    "defaultSlotTime",
    ()=>defaultSlotTime,
    "defaultSlots",
    ()=>defaultSlots,
    "fmtDate",
    ()=>fmtDate,
    "normalizeSpec",
    ()=>normalizeSpec,
    "repairDays",
    ()=>repairDays
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/AI-Travel/web/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z>");
;
const PlanSpecInputSchema = __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    destination: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "destination required"),
    start_date: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    end_date: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    startDate: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    endDate: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    preferences: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        pace: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            "relaxed",
            "standard",
            "tight"
        ]).optional(),
        interests: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional(),
        budgetTotal: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional(),
        peopleCount: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().positive().optional()
    }).optional()
});
function normalizeSpec(spec) {
    const start_date = (spec.start_date || spec.startDate || "").slice(0, 10);
    const end_date = (spec.end_date || spec.endDate || "").slice(0, 10);
    return {
        destination: spec.destination,
        start_date,
        end_date,
        preferences: spec.preferences || {}
    };
}
function fmtDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}
function daysBetweenInclusive(start, end) {
    const out = [];
    const cur = new Date(start);
    while(cur <= end){
        out.push(new Date(cur));
        cur.setDate(cur.getDate() + 1);
    }
    return out;
}
function defaultSlots(pace) {
    const p = pace || "standard";
    if (p === "relaxed") return [
        "上午",
        "下午"
    ];
    if (p === "tight") return [
        "早间",
        "上午",
        "下午",
        "傍晚",
        "夜间"
    ];
    return [
        "上午",
        "下午",
        "夜间"
    ];
}
function defaultSlotTime(idx) {
    const t = [
        "09:00",
        "13:30",
        "18:00",
        "20:00",
        "22:00"
    ];
    return t[idx] || "09:00";
}
const PlanItemSchema = __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    time: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    title: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    note: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    // richer fields for frontend display
    place: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        name: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        location: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
            lat: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
            lng: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number()
        }).optional(),
        address: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
        poiId: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
        category: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
    }).optional(),
    durationEstimate: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional(),
    costEstimate: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional()
});
const TransportSchema = __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    mode: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    steps: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional(),
    timeEstimate: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional(),
    priceEstimate: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional()
});
const LocationSchema = __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    lat: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    lng: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number()
});
const DiningItemSchema = __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    name: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    cuisine: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    priceRange: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].tuple([
        __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
        __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number()
    ]).optional(),
    rating: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional(),
    distance: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional(),
    booking: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    location: LocationSchema.optional(),
    address: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    phone: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    opening_hours: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    website: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    tags: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional()
});
const LodgingItemSchema = __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    name: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    area: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    price: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional(),
    rating: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional(),
    distanceToCore: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional(),
    amenities: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional(),
    location: LocationSchema.optional(),
    address: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    phone: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    opening_hours: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    website: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    tags: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional(),
    stars: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional(),
    checkin_time: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    checkout_time: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    room_types: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional()
});
const AttractionItemSchema = __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    name: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    ticket: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].union([
        __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
        __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
    ]).optional(),
    best_time: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    tips: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    photo_spots: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional(),
    address: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    opening_hours: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    website: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    tags: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional(),
    location: LocationSchema.optional(),
    durationEstimate: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional()
});
const RoutePointSchema = __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    lat: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    lng: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number()
});
const PlanDaySchema = __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    date: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    items: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(PlanItemSchema),
    routePath: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(RoutePointSchema).optional(),
    transport: TransportSchema.optional(),
    dining: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(DiningItemSchema).optional(),
    lodging: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(LodgingItemSchema).optional(),
    attractions: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(AttractionItemSchema).optional(),
    markers: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        location: LocationSchema,
        title: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
        category: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
        id: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
        dayIndex: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional(),
        poiId: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
    })).optional()
});
const MarkerSchema = __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    position: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].tuple([
        __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
        __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number()
    ]),
    title: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
const PlanDataSchema = __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    destination: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    start_date: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    end_date: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    days: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(PlanDaySchema),
    markers: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(MarkerSchema).optional(),
    source: __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "llm",
        "fallback"
    ]).optional()
});
function repairDays(args) {
    const { rawDays, allDates, destination, pace } = args;
    const slots = defaultSlots(pace);
    const byDate = {};
    for (const rd of rawDays || []){
        const date = String(rd?.date || "");
        if (!date) continue;
        const itemsArr = Array.isArray(rd.items) ? rd.items : [];
        const items = itemsArr.map((it, idx)=>({
                id: `${date}-${idx}`,
                time: String(it?.time || ""),
                title: String(it?.title || "待定"),
                note: it?.note ? String(it.note) : undefined
            }));
        const day = {
            date,
            items,
            routePath: Array.isArray(rd.routePath) ? rd.routePath.map((p)=>({
                    lat: Number(p?.lat),
                    lng: Number(p?.lng)
                })).filter((p)=>Number.isFinite(p.lat) && Number.isFinite(p.lng)) : undefined,
            transport: rd.transport && typeof rd.transport === "object" ? {
                mode: String(rd.transport.mode || "transit"),
                steps: Array.isArray(rd.transport.steps) ? rd.transport.steps.map((s)=>String(s)) : undefined,
                timeEstimate: rd.transport.timeEstimate ? Number(rd.transport.timeEstimate) : undefined,
                priceEstimate: rd.transport.priceEstimate ? Number(rd.transport.priceEstimate) : undefined
            } : undefined,
            dining: Array.isArray(rd.dining) ? rd.dining.map((d)=>({
                    name: String(d?.name || "当地餐馆"),
                    cuisine: d?.cuisine ? String(d.cuisine) : undefined,
                    priceRange: Array.isArray(d?.priceRange) && d.priceRange.length === 2 ? [
                        Number(d.priceRange[0]),
                        Number(d.priceRange[1])
                    ] : undefined,
                    rating: d?.rating ? Number(d.rating) : undefined,
                    distance: d?.distance ? Number(d.distance) : undefined,
                    booking: typeof d?.booking === "boolean" ? d.booking : undefined,
                    location: d?.location && typeof d.location === "object" ? {
                        lat: Number(d.location.lat),
                        lng: Number(d.location.lng)
                    } : undefined
                })) : undefined,
            lodging: Array.isArray(rd.lodging) ? rd.lodging.map((h)=>({
                    name: String(h?.name || "酒店"),
                    area: h?.area ? String(h.area) : undefined,
                    price: h?.price ? Number(h.price) : undefined,
                    rating: h?.rating ? Number(h.rating) : undefined,
                    distanceToCore: h?.distanceToCore ? Number(h.distanceToCore) : undefined,
                    amenities: Array.isArray(h?.amenities) ? h.amenities.map((a)=>String(a)) : undefined,
                    location: h?.location && typeof h.location === "object" ? {
                        lat: Number(h.location.lat),
                        lng: Number(h.location.lng)
                    } : undefined
                })) : undefined,
            attractions: Array.isArray(rd.attractions) ? rd.attractions.map((a)=>({
                    name: String(a?.name || "景点"),
                    ticket: typeof a?.ticket === "number" ? a.ticket : a?.ticket ? String(a.ticket) : undefined,
                    best_time: a?.best_time ? String(a.best_time) : undefined,
                    tips: a?.tips ? String(a.tips) : undefined,
                    photo_spots: Array.isArray(a?.photo_spots) ? a.photo_spots.map((p)=>String(p)) : undefined
                })) : undefined
        };
        byDate[date] = day;
    }
    const out = [];
    for(let i = 0; i < allDates.length; i++){
        const date = allDates[i];
        const existing = byDate[date];
        if (existing) {
            out.push(existing);
        } else {
            const items = (slots || []).map((_, idx)=>({
                    id: `${date}-${idx}`,
                    time: defaultSlotTime(idx),
                    title: `${destination} 行程建议`
                }));
            out.push({
                date,
                items
            });
        }
    }
    return out;
}
}),
"[project]/AI-Travel/web/src/app/api/plan/create/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/AI-Travel/web/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$src$2f$lib$2f$itinerarySchema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/AI-Travel/web/src/lib/itinerarySchema.ts [app-route] (ecmascript)");
;
;
const runtime = "nodejs";
const PlanSpecSchema = __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$src$2f$lib$2f$itinerarySchema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PlanSpecInputSchema"];
function fmtDateLocal(d) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$src$2f$lib$2f$itinerarySchema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fmtDate"])(d);
}
async function findCityMarkers(city) {
    const key = process.env.AMAP_WEBSERVICE_KEY;
    if (!key) {
        return [
            {
                position: [
                    116.397428,
                    39.90923
                ],
                title: `${city} 地标A`
            },
            {
                position: [
                    116.384,
                    39.923
                ],
                title: `${city} 地标B`
            }
        ];
    }
    const params = new URLSearchParams({
        key,
        keywords: "景点",
        city,
        citylimit: "true",
        offset: "5"
    });
    const url = `https://restapi.amap.com/v3/place/text?${params.toString()}`;
    try {
        const resp = await fetch(url);
        const data = await resp.json();
        const pois = data?.pois || [];
        return pois.slice(0, 5).map((p)=>{
            const [lngStr, latStr] = String(p.location || "").split(",");
            const lng = Number(lngStr);
            const lat = Number(latStr);
            return {
                position: [
                    lng,
                    lat
                ],
                title: p.name
            };
        });
    } catch  {
        return [
            {
                position: [
                    116.397428,
                    39.90923
                ],
                title: `${city} 地标A`
            },
            {
                position: [
                    116.384,
                    39.923
                ],
                title: `${city} 地标B`
            }
        ];
    }
}
async function parseJsonRequest(req) {
    try {
        return await req.json();
    } catch  {
        try {
            const text = await req.text();
            return JSON.parse(text);
        } catch  {
            return {};
        }
    }
}
// --- Budget estimation helpers (server-side strong check) ---
function avgPrice(range) {
    if (!range || range.length !== 2) return 0;
    const a = Number(range[0]);
    const b = Number(range[1]);
    return Number.isFinite(a) && Number.isFinite(b) ? (a + b) / 2 : 0;
}
function ticketToNumber(t) {
    if (t == null) return 0;
    if (typeof t === "number" && Number.isFinite(t)) return t;
    const n = Number(t);
    return Number.isFinite(n) ? n : 0;
}
function estimateBudgetTotals(days, peopleCount = 1) {
    const byDay = [];
    let transport = 0, dining = 0, lodging = 0, tickets = 0, items = 0;
    for (const d of days || []){
        const t = Number(d.transport?.priceEstimate) || 0;
        const dinePerCapita = (d.dining || []).reduce((s, it)=>s + avgPrice(it.priceRange), 0);
        const dine = dinePerCapita * Math.max(1, peopleCount);
        const lodge = (d.lodging || []).reduce((s, it)=>s + (Number(it.price) || 0), 0);
        const ticketsPerCapita = (d.attractions || []).reduce((s, it)=>s + ticketToNumber(it.ticket), 0);
        const tick = ticketsPerCapita * Math.max(1, peopleCount);
        const its = (d.items || []).reduce((s, it)=>s + (Number(it.costEstimate) || 0), 0);
        const total = t + dine + lodge + tick + its;
        byDay.push({
            date: d.date,
            transport: t,
            dining: dine,
            lodging: lodge,
            tickets: tick,
            items: its,
            total
        });
        transport += t;
        dining += dine;
        lodging += lodge;
        tickets += tick;
        items += its;
    }
    const grand = transport + dining + lodging + tickets + items;
    return {
        byDay,
        totals: {
            transport,
            dining,
            lodging,
            tickets,
            items,
            grand
        }
    };
}
async function refinePlanToBudget(params) {
    const { originalDays, destination, start_date, end_date, budgetTotal, peopleCount = 1 } = params;
    const apiKey = process.env.DOUBAO_API_KEY;
    const model = process.env.DOUBAO_MODEL;
    const base = process.env.DOUBAO_API_BASE || "";
    if (!apiKey || !model || !base) return null;
    const url = base.replace(/\/$/, "") + "/chat/completions";
    // Keep the same schema as generation, but focus on budget adjustment
    const schemaSnippet = {
        type: "object",
        properties: {
            id: {
                type: "string"
            },
            destination: {
                type: "string"
            },
            start_date: {
                type: "string"
            },
            end_date: {
                type: "string"
            },
            days: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        date: {
                            type: "string"
                        },
                        items: {
                            type: "array"
                        },
                        routePath: {
                            type: "array"
                        },
                        transport: {
                            type: "object"
                        },
                        dining: {
                            type: "array"
                        },
                        lodging: {
                            type: "array"
                        },
                        attractions: {
                            type: "array"
                        }
                    },
                    required: [
                        "date",
                        "items"
                    ],
                    additionalProperties: false
                }
            },
            markers: {
                type: "array"
            }
        },
        required: [
            "destination",
            "start_date",
            "end_date",
            "days"
        ],
        additionalProperties: false
    };
    const sys = `只输出严格 JSON（不允许任何非JSON内容）。你将收到一个现有行程的 JSON；在不改变字段结构的前提下，优先通过更换住宿/餐饮/交通/门票等选项调整价格，使“估算总费用”与“预算 ¥${Math.round(budgetTotal)}”的差额不超过 ¥1000。必须覆盖从 ${start_date} 到 ${end_date} 的每一天，并保持地点在“${destination}”辖区内。每天必须返回三顿餐饮（早餐/午餐/晚餐），并在预算计算时将餐饮 priceRange 与景点 ticket 按人数 ${Math.max(1, peopleCount)} 倍计入总费用（人均×人数）。名称需为具体店名/景点名。所有价格字段请尽量给出可计算的数值（items.costEstimate、transport.priceEstimate、dining.priceRange、lodging.price、attractions.ticket）。最终输出为完整闭合 JSON，遵循 Schema：${JSON.stringify(schemaSnippet)}。`;
    const current = {
        destination,
        start_date,
        end_date,
        days: originalDays
    };
    const baseBody = {
        model,
        messages: [
            {
                role: "system",
                content: sys
            },
            {
                role: "user",
                content: JSON.stringify({
                    budgetTotal,
                    peopleCount,
                    currentPlan: current
                })
            }
        ],
        temperature: Number(process.env.DOUBAO_TEMPERATURE ?? 0.2),
        max_tokens: Math.min(Number(process.env.DOUBAO_MAX_TOKENS ?? 3500), 2500),
        response_format: {
            type: "json_object"
        }
    };
    try {
        const resp = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify(baseBody)
        });
        const data = await resp.json().catch(()=>null);
        if (!resp.ok || !data) return null;
        const content = data?.choices?.[0]?.message?.content ?? "";
        let obj = null;
        if (typeof content === "string") {
            try {
                obj = JSON.parse(content);
            } catch  {
                let s = content;
                s = s.replace(/```[a-zA-Z]*\n?/g, "").replace(/```/g, "");
                const m = s.match(/\{[\s\S]*\}/);
                if (m) {
                    let candidate = m[0];
                    candidate = candidate.replace(/,\s*([\}\]])/g, "$1");
                    try {
                        obj = JSON.parse(candidate);
                    } catch  {}
                }
            }
        } else {
            obj = content;
        }
        const rawDays = Array.isArray(obj?.days) ? obj.days : [];
        if (!rawDays.length) return null;
        const days = rawDays.map((d, di)=>({
                date: String(d.date || "").slice(0, 10) || originalDays[di]?.date || start_date,
                items: (Array.isArray(d.items) ? d.items : []).map((it, idx)=>({
                        id: `${String(d.date || start_date)}-${idx}`,
                        time: String(it.time || ""),
                        title: String(it.title || "待定"),
                        note: it.note ? String(it.note) : undefined,
                        place: it.place && typeof it.place === "object" ? {
                            name: String(it.place.name || ""),
                            location: it.place.location && typeof it.place.location === "object" ? {
                                lat: Number(it.place.location.lat),
                                lng: Number(it.place.location.lng)
                            } : undefined,
                            address: it.place.address ? String(it.place.address) : undefined,
                            poiId: it.place.poiId ? String(it.place.poiId) : undefined,
                            category: it.place.category ? String(it.place.category) : undefined
                        } : undefined,
                        durationEstimate: it.durationEstimate ? Number(it.durationEstimate) : undefined,
                        costEstimate: it.costEstimate ? Number(it.costEstimate) : undefined
                    })),
                routePath: Array.isArray(d.routePath) ? d.routePath.map((p)=>({
                        lat: Number(p?.lat),
                        lng: Number(p?.lng)
                    })).filter((p)=>Number.isFinite(p.lat) && Number.isFinite(p.lng)) : undefined,
                transport: d.transport && typeof d.transport === "object" ? {
                    mode: String(d.transport.mode || "transit"),
                    steps: Array.isArray(d.transport.steps) ? d.transport.steps.map((s)=>String(s)) : undefined,
                    timeEstimate: d.transport.timeEstimate ? Number(d.transport.timeEstimate) : undefined,
                    priceEstimate: d.transport.priceEstimate ? Number(d.transport.priceEstimate) : undefined
                } : undefined,
                dining: Array.isArray(d.dining) ? d.dining.map((r)=>({
                        name: String(r?.name || "餐馆"),
                        cuisine: r?.cuisine ? String(r.cuisine) : undefined,
                        priceRange: Array.isArray(r?.priceRange) && r.priceRange.length === 2 ? [
                            Number(r.priceRange[0]),
                            Number(r.priceRange[1])
                        ] : undefined,
                        rating: r?.rating ? Number(r.rating) : undefined,
                        distance: r?.distance ? Number(r.distance) : undefined,
                        booking: typeof r?.booking === "boolean" ? r.booking : undefined,
                        location: r?.location && typeof r.location === "object" ? {
                            lat: Number(r.location.lat),
                            lng: Number(r.location.lng)
                        } : undefined,
                        address: r?.address ? String(r.address) : undefined,
                        phone: r?.phone ? String(r.phone) : undefined,
                        opening_hours: r?.opening_hours ? String(r.opening_hours) : undefined,
                        website: r?.website ? String(r.website) : undefined,
                        tags: Array.isArray(r?.tags) ? r.tags.map((t)=>String(t)) : undefined
                    })) : undefined,
                lodging: Array.isArray(d.lodging) ? d.lodging.map((h)=>({
                        name: String(h?.name || "酒店"),
                        area: h?.area ? String(h.area) : undefined,
                        price: h?.price ? Number(h.price) : undefined,
                        rating: h?.rating ? Number(h.rating) : undefined,
                        distanceToCore: h?.distanceToCore ? Number(h.distanceToCore) : undefined,
                        amenities: Array.isArray(h?.amenities) ? h.amenities.map((a)=>String(a)) : undefined,
                        location: h?.location && typeof h.location === "object" ? {
                            lat: Number(h.location.lat),
                            lng: Number(h.location.lng)
                        } : undefined,
                        address: h?.address ? String(h.address) : undefined,
                        phone: h?.phone ? String(h.phone) : undefined,
                        opening_hours: h?.opening_hours ? String(h.opening_hours) : undefined,
                        website: h?.website ? String(h.website) : undefined,
                        tags: Array.isArray(h?.tags) ? h.tags.map((t)=>String(t)) : undefined,
                        stars: h?.stars ? Number(h.stars) : undefined,
                        checkin_time: h?.checkin_time ? String(h.checkin_time) : undefined,
                        checkout_time: h?.checkout_time ? String(h.checkout_time) : undefined,
                        room_types: Array.isArray(h?.room_types) ? h.room_types.map((rt)=>String(rt)) : undefined
                    })) : undefined,
                attractions: Array.isArray(d.attractions) ? d.attractions.map((a)=>({
                        name: String(a?.name || "景点"),
                        ticket: typeof a?.ticket === "number" ? a.ticket : a?.ticket ? String(a.ticket) : undefined,
                        best_time: a?.best_time ? String(a.best_time) : undefined,
                        tips: a?.tips ? String(a.tips) : undefined,
                        photo_spots: Array.isArray(a?.photo_spots) ? a.photo_spots.map((p)=>String(p)) : undefined,
                        address: a?.address ? String(a.address) : undefined,
                        opening_hours: a?.opening_hours ? String(a.opening_hours) : undefined,
                        website: a?.website ? String(a.website) : undefined,
                        tags: Array.isArray(a?.tags) ? a.tags.map((t)=>String(t)) : undefined,
                        location: a?.location && typeof a.location === "object" ? {
                            lat: Number(a.location.lat),
                            lng: Number(a.location.lng)
                        } : undefined,
                        durationEstimate: a?.durationEstimate ? Number(a.durationEstimate) : undefined
                    })) : undefined
            }));
        return days;
    } catch  {
        return null;
    }
}
async function POST(req) {
    const raw = await parseJsonRequest(req);
    // Fallback: read from query string if body is empty or missing fields
    let merged = raw;
    try {
        const u = new URL(req.url);
        const qs = {};
        for (const [k, v] of u.searchParams.entries())qs[k] = v;
        merged = {
            ...qs,
            ...raw
        };
        // If preferences comes from querystring, it will be a JSON string; try to parse it.
        if (typeof merged.preferences === "string") {
            try {
                merged.preferences = JSON.parse(merged.preferences);
            } catch  {}
        }
    } catch  {}
    const parsed = PlanSpecSchema.safeParse(merged);
    if (!parsed.success) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "invalid_spec",
            issues: parsed.error.issues
        }, {
            status: 400
        });
    }
    const { destination, start_date, end_date, preferences } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$src$2f$lib$2f$itinerarySchema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeSpec"])(parsed.data);
    const start = new Date(start_date);
    const end = new Date(end_date);
    const allDays = (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$src$2f$lib$2f$itinerarySchema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["daysBetweenInclusive"])(start, end);
    const pace = preferences?.pace || "standard";
    const slots = (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$src$2f$lib$2f$itinerarySchema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defaultSlots"])(pace);
    const interests = (preferences?.interests || []).slice(0, 6);
    const budgetTotal = typeof preferences?.budgetTotal === "number" ? preferences.budgetTotal : undefined;
    const peopleCount = typeof preferences?.peopleCount === "number" && preferences.peopleCount > 0 ? preferences.peopleCount : 1;
    // Prepare candidate POIs for context
    const candidateMarkers = await findCityMarkers(destination);
    const candidatePOIs = candidateMarkers.map((m)=>({
            name: m.title || "地标",
            lng: m.position[0],
            lat: m.position[1]
        }));
    // 生成完整计划（包含 days 与可选 markers），若不可用则返回 null
    async function generatePlanWithDoubao() {
        const apiKey = process.env.DOUBAO_API_KEY;
        const model = process.env.DOUBAO_MODEL;
        const base = process.env.DOUBAO_API_BASE || "";
        // 放宽提供方限制：允许任意 OpenAI 兼容端点（只要提供 base/model/key 即可）
        if (!apiKey || !model || !base) return null;
        const url = base.replace(/\/$/, "") + "/chat/completions";
        const schemaSnippet = {
            type: "object",
            properties: {
                id: {
                    type: "string"
                },
                destination: {
                    type: "string"
                },
                start_date: {
                    type: "string"
                },
                end_date: {
                    type: "string"
                },
                days: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            date: {
                                type: "string"
                            },
                            items: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        time: {
                                            type: "string"
                                        },
                                        title: {
                                            type: "string"
                                        },
                                        note: {
                                            type: "string"
                                        },
                                        place: {
                                            type: "object",
                                            properties: {
                                                name: {
                                                    type: "string"
                                                },
                                                location: {
                                                    type: "object",
                                                    properties: {
                                                        lat: {
                                                            type: "number"
                                                        },
                                                        lng: {
                                                            type: "number"
                                                        }
                                                    },
                                                    additionalProperties: false
                                                },
                                                address: {
                                                    type: "string"
                                                },
                                                poiId: {
                                                    type: "string"
                                                },
                                                category: {
                                                    type: "string"
                                                }
                                            },
                                            required: [
                                                "name"
                                            ],
                                            additionalProperties: false
                                        },
                                        durationEstimate: {
                                            type: "number"
                                        },
                                        costEstimate: {
                                            type: "number"
                                        }
                                    },
                                    required: [
                                        "time",
                                        "title",
                                        "place",
                                        "costEstimate"
                                    ],
                                    additionalProperties: false
                                }
                            },
                            routePath: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        lat: {
                                            type: "number"
                                        },
                                        lng: {
                                            type: "number"
                                        }
                                    },
                                    required: [
                                        "lat",
                                        "lng"
                                    ],
                                    additionalProperties: false
                                }
                            },
                            transport: {
                                type: "object",
                                properties: {
                                    mode: {
                                        type: "string"
                                    },
                                    steps: {
                                        type: "array",
                                        items: {
                                            type: "string"
                                        }
                                    },
                                    timeEstimate: {
                                        type: "number"
                                    },
                                    priceEstimate: {
                                        type: "number"
                                    }
                                },
                                required: [
                                    "mode",
                                    "timeEstimate",
                                    "priceEstimate"
                                ],
                                additionalProperties: false
                            },
                            dining: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        name: {
                                            type: "string"
                                        },
                                        cuisine: {
                                            type: "string"
                                        },
                                        priceRange: {
                                            type: "array",
                                            items: {
                                                type: "number"
                                            },
                                            minItems: 2,
                                            maxItems: 2
                                        },
                                        rating: {
                                            type: "number"
                                        },
                                        distance: {
                                            type: "number"
                                        },
                                        booking: {
                                            type: "boolean"
                                        },
                                        location: {
                                            type: "object",
                                            properties: {
                                                lat: {
                                                    type: "number"
                                                },
                                                lng: {
                                                    type: "number"
                                                }
                                            },
                                            additionalProperties: false
                                        },
                                        address: {
                                            type: "string"
                                        },
                                        phone: {
                                            type: "string"
                                        },
                                        opening_hours: {
                                            type: "string"
                                        },
                                        website: {
                                            type: "string"
                                        },
                                        tags: {
                                            type: "array",
                                            items: {
                                                type: "string"
                                            }
                                        }
                                    },
                                    required: [
                                        "name",
                                        "priceRange"
                                    ],
                                    additionalProperties: false
                                }
                            },
                            lodging: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        name: {
                                            type: "string"
                                        },
                                        area: {
                                            type: "string"
                                        },
                                        price: {
                                            type: "number"
                                        },
                                        rating: {
                                            type: "number"
                                        },
                                        distanceToCore: {
                                            type: "number"
                                        },
                                        amenities: {
                                            type: "array",
                                            items: {
                                                type: "string"
                                            }
                                        },
                                        location: {
                                            type: "object",
                                            properties: {
                                                lat: {
                                                    type: "number"
                                                },
                                                lng: {
                                                    type: "number"
                                                }
                                            },
                                            additionalProperties: false
                                        },
                                        address: {
                                            type: "string"
                                        },
                                        phone: {
                                            type: "string"
                                        },
                                        opening_hours: {
                                            type: "string"
                                        },
                                        website: {
                                            type: "string"
                                        },
                                        tags: {
                                            type: "array",
                                            items: {
                                                type: "string"
                                            }
                                        },
                                        stars: {
                                            type: "number"
                                        },
                                        checkin_time: {
                                            type: "string"
                                        },
                                        checkout_time: {
                                            type: "string"
                                        },
                                        room_types: {
                                            type: "array",
                                            items: {
                                                type: "string"
                                            }
                                        }
                                    },
                                    required: [
                                        "name",
                                        "price"
                                    ],
                                    additionalProperties: false
                                }
                            },
                            attractions: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        name: {
                                            type: "string"
                                        },
                                        ticket: {
                                            oneOf: [
                                                {
                                                    type: "number"
                                                },
                                                {
                                                    type: "string"
                                                }
                                            ]
                                        },
                                        best_time: {
                                            type: "string"
                                        },
                                        tips: {
                                            type: "string"
                                        },
                                        photo_spots: {
                                            type: "array",
                                            items: {
                                                type: "string"
                                            }
                                        },
                                        address: {
                                            type: "string"
                                        },
                                        opening_hours: {
                                            type: "string"
                                        },
                                        website: {
                                            type: "string"
                                        },
                                        tags: {
                                            type: "array",
                                            items: {
                                                type: "string"
                                            }
                                        },
                                        location: {
                                            type: "object",
                                            properties: {
                                                lat: {
                                                    type: "number"
                                                },
                                                lng: {
                                                    type: "number"
                                                }
                                            },
                                            additionalProperties: false
                                        },
                                        durationEstimate: {
                                            type: "number"
                                        }
                                    },
                                    required: [
                                        "name",
                                        "ticket"
                                    ],
                                    additionalProperties: false
                                }
                            }
                        },
                        required: [
                            "date",
                            "items"
                        ],
                        additionalProperties: false
                    }
                },
                markers: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            position: {
                                type: "array",
                                items: {
                                    type: "number"
                                },
                                minItems: 2,
                                maxItems: 2
                            },
                            title: {
                                type: "string"
                            }
                        },
                        required: [
                            "position"
                        ],
                        additionalProperties: false
                    }
                }
            },
            required: [
                "destination",
                "start_date",
                "end_date",
                "days"
            ],
            additionalProperties: false
        };
        const sys = `你是一位资深的旅游规划师，请根据用户偏好生成结构化行程。严格只输出 JSON（不要输出任何非JSON文字与代码块）。必须严格遵循以下 Schema：${JSON.stringify(schemaSnippet)}。字段名与层级必须完全一致：顶层仅允许 id、destination、start_date、end_date、days、markers；每天(day)仅允许 date、items、routePath、transport、dining、lodging、attractions。禁止使用任何替代字段名（如 schedule/accommodation/food/hotel 等）。生成要求：\n- 顶层必须包含 destination、start_date、end_date、days（尽量提供 id 与 markers）。\n- 覆盖从 ${start_date} 到 ${end_date} 的每一天；每天必须包含住宿(lodging)至少 1 条，且是具体酒店中文名。\n- 每天按节奏 ${pace} 生成 ${slots.length} 个活动；每个时段 items 必须给出具体去的地点(place.name)，不可使用泛化描述（如“城市核心景区打卡”）。\n- 所有餐饮/住宿/景点必须返回准确中文名字（如能提供地址/营业时间/电话/网站/标签请一并给出）；name 字段必须为具体店名/景点名，不能是类别或模糊词（如“本地餐厅”、“市中心酒店”、“核心景区”等）。\n- 严格的地域约束：餐饮/住宿/景点/活动地点必须位于“${destination}”及其辖区内，禁止返回其它城市（例如与 ${destination} 无关的店名，如出现跨城请改为本地等价选项）。\n- items.title 应含具体地点名称，并填写 time；如可估算请提供 durationEstimate 与 costEstimate。\n- 给出交通(方式/耗时/费用)、餐饮(价格区间/定位)、住宿(价格/定位/星级/入住退房)、景点(门票/最佳游览时间/提示/打卡点/定位等)。\n- 活动内容逐日保持差异化，避免重复。尽量匹配兴趣偏好：${interests.join("/") || "无"}。\n- 参考时间：${slots.map((_, i)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$src$2f$lib$2f$itinerarySchema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defaultSlotTime"])(i)).join("、")}。\n- 预算约束：${budgetTotal !== undefined ? `用户总预算为 ¥${Math.round(budgetTotal)}。请按照该预算安排交通、餐饮、住宿与门票等支出；最终估算总费用与用户预算的差额不得超过 ¥1000。若超出，请调整选项以满足约束。` : `若用户提供预算，请严格按照预算进行安排，并确保最终估算总费用与预算差额不超过 ¥1000。`}\n- 费用字段请尽量给出可计算的数值：items.costEstimate（元）、transport.priceEstimate（元）、dining.priceRange（两端为元）、lodging.price（元）、attractions.ticket（元或可解析的字符串）。\n- markers 如提供，请按照 [lng,lat] 与 title 输出，优先使用参考POI或景点/餐饮/住宿位置。`;
        const sys2 = `你是一位资深的旅游规划师，只输出严格 JSON（不允许任何非JSON内容）。必须严格遵循以下 Schema：${JSON.stringify(schemaSnippet)}。字段名与层级必须与 Schema 完全一致：\n- 顶层仅允许 id、destination、start_date、end_date、days、markers。\n- 每天(day)允许字段：date、items、routePath、transport、dining、lodging、attractions。\n- 禁止使用任何替代字段名（如 schedule/accommodation/food/hotel 等）。\n生成规则（务必遵守以保证预算展示完整）：\n- 覆盖 ${start_date} 到 ${end_date} 每天；每天 lodging 只给 1 条且是具体酒店中文名；dining 必须恰好 3 条（早餐/午餐/晚餐）；attractions ≤2。\n- 每天按节奏 ${pace} 生成 ${slots.length} 个活动；items 每条必须包含 place.name 与 time，并给出 costEstimate（元）。\n- transport 必须包含 mode、timeEstimate（分钟）、priceEstimate（元）；dining 必须给出 priceRange [min,max]（元）；lodging 必须给出 price（元）；attractions 必须给出 ticket（可为数值或可解析字符串）。\n- 名称必须为具体店名/景点名，禁止模糊词（如“本地餐厅”、“市中心酒店”、“核心景区”等）。\n- 严格地域约束：所有地点必须在“${destination}”辖区内，若跨城请改为本地等价选项。\n- 预算约束：${budgetTotal !== undefined ? `总预算 ¥${Math.round(budgetTotal)}，确保与预算差额不超过 ¥1000；餐饮为人均价，请按人数 ${Math.max(1, peopleCount)} 倍计入；门票同样按人数 ${Math.max(1, peopleCount)} 倍计入。` : `若提供预算，确保与预算差额不超过 ¥1000；餐饮/门票为人均价时按人数倍数计入。`}\n- markers 如提供，请按 [lng,lat] 与 title 输出。\n- 最终输出必须是完整闭合的 JSON，无尾逗号，无截断，无额外文本。`;
        const user = `目的地:${destination}; 日期范围:${start_date}~${end_date}; 人数:${Math.max(1, peopleCount)}; ${budgetTotal !== undefined ? `预算总额:¥${Math.round(budgetTotal)}; ` : ""}参考POI:${candidatePOIs.map((p)=>`${p.name}(${p.lng},${p.lat})`).join(";")}`;
        const baseBody = {
            model,
            messages: [
                {
                    role: "system",
                    content: sys2
                },
                {
                    role: "user",
                    content: user
                }
            ],
            temperature: Number(process.env.DOUBAO_TEMPERATURE ?? 0.2),
            max_tokens: Number(process.env.DOUBAO_MAX_TOKENS ?? 3500)
        };
        try {
            const tryCall = async (format)=>{
                const body = format === "schema" ? {
                    ...baseBody,
                    response_format: {
                        type: "json_schema",
                        json_schema: {
                            name: "plan_schema",
                            schema: schemaSnippet
                        }
                    }
                } : format === "object" ? {
                    ...baseBody,
                    response_format: {
                        type: "json_object"
                    }
                } : baseBody;
                const resp = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${apiKey}`
                    },
                    body: JSON.stringify(body)
                });
                const data = await resp.json().catch(()=>null);
                return {
                    resp,
                    data
                };
            };
            // First attempt: use json_object for structured output (更多端点支持此模式)
            let { resp, data } = await tryCall("object");
            if (!resp.ok) {
                console.warn("[plan/create] Doubao call #1 failed (json_object)", {
                    status: resp.status,
                    error: data?.error
                });
            }
            // If response_format.type not supported, try json_schema; if still not ok, try no format
            if (data && (data.error?.param === "response_format.type" || /response_format\.type/.test(String(data.error?.message || "")) || String(data.error?.param || "").startsWith("response_format."))) {
                ({ resp, data } = await tryCall("schema"));
                if (!resp.ok) {
                    console.warn("[plan/create] Doubao call #2 failed (json_schema)", {
                        status: resp.status,
                        error: data?.error
                    });
                    ({ resp, data } = await tryCall("none"));
                    if (!resp.ok) {
                        console.warn("[plan/create] Doubao call #3 failed (no format)", {
                            status: resp.status,
                            error: data?.error
                        });
                    }
                }
            }
            if (!resp.ok || !data) {
                console.warn("[plan/create] Doubao call failed: no ok response or empty data", {
                    ok: resp.ok,
                    status: resp.status
                });
                return null;
            }
            const content = data?.choices?.[0]?.message?.content ?? "";
            let obj = null;
            if (typeof content === "string") {
                try {
                    obj = JSON.parse(content);
                } catch  {
                    // 尝试更宽松的 JSON 提取：去除代码块围栏、截取花括号区域、移除可能的尾逗号
                    let s = content;
                    s = s.replace(/```[a-zA-Z]*\n?/g, "").replace(/```/g, "");
                    const m = s.match(/\{[\s\S]*\}/);
                    if (m) {
                        let candidate = m[0];
                        candidate = candidate.replace(/,\s*([\}\]])/g, "$1");
                        try {
                            obj = JSON.parse(candidate);
                        } catch  {}
                    }
                }
            } else {
                obj = content;
            }
            if (!obj) {
                console.warn("[plan/create] Doubao content parse failed or empty", {
                    preview: typeof content === "string" ? String(content).slice(0, 200) : typeof content
                });
                return null;
            }
            const rawDays = Array.isArray(obj?.days) ? obj.days : [];
            // First path: well-formed days
            if (rawDays.length && Array.isArray(rawDays[0]?.items)) {
                let days = rawDays.map((d)=>({
                        date: String(d.date || "").slice(0, 10) || fmtDateLocal(allDays[0]),
                        items: (Array.isArray(d.items) ? d.items : []).map((it, idx)=>({
                                id: `${String(d.date || fmtDateLocal(allDays[0]))}-${idx}`,
                                time: String(it.time || ""),
                                title: String(it.title || "待定"),
                                note: it.note ? String(it.note) : undefined,
                                place: it.place && typeof it.place === "object" ? {
                                    name: String(it.place.name || ""),
                                    location: it.place.location && typeof it.place.location === "object" ? {
                                        lat: Number(it.place.location.lat),
                                        lng: Number(it.place.location.lng)
                                    } : undefined,
                                    address: it.place.address ? String(it.place.address) : undefined,
                                    poiId: it.place.poiId ? String(it.place.poiId) : undefined,
                                    category: it.place.category ? String(it.place.category) : undefined
                                } : undefined,
                                durationEstimate: it.durationEstimate ? Number(it.durationEstimate) : undefined,
                                costEstimate: it.costEstimate ? Number(it.costEstimate) : undefined
                            })),
                        routePath: Array.isArray(d.routePath) ? d.routePath.map((p)=>({
                                lat: Number(p?.lat),
                                lng: Number(p?.lng)
                            })).filter((p)=>Number.isFinite(p.lat) && Number.isFinite(p.lng)) : undefined,
                        transport: d.transport && typeof d.transport === "object" ? {
                            mode: String(d.transport.mode || "transit"),
                            steps: Array.isArray(d.transport.steps) ? d.transport.steps.map((s)=>String(s)) : undefined,
                            timeEstimate: d.transport.timeEstimate ? Number(d.transport.timeEstimate) : undefined,
                            priceEstimate: d.transport.priceEstimate ? Number(d.transport.priceEstimate) : undefined
                        } : undefined,
                        dining: Array.isArray(d.dining) ? d.dining.map((r)=>({
                                name: String(r?.name || "餐馆"),
                                cuisine: r?.cuisine ? String(r.cuisine) : undefined,
                                priceRange: Array.isArray(r?.priceRange) && r.priceRange.length === 2 ? [
                                    Number(r.priceRange[0]),
                                    Number(r.priceRange[1])
                                ] : undefined,
                                rating: r?.rating ? Number(r.rating) : undefined,
                                distance: r?.distance ? Number(r.distance) : undefined,
                                booking: typeof r?.booking === "boolean" ? r.booking : undefined,
                                location: r?.location && typeof r.location === "object" ? {
                                    lat: Number(r.location.lat),
                                    lng: Number(r.location.lng)
                                } : undefined,
                                address: r?.address ? String(r.address) : undefined,
                                phone: r?.phone ? String(r.phone) : undefined,
                                opening_hours: r?.opening_hours ? String(r.opening_hours) : undefined,
                                website: r?.website ? String(r.website) : undefined,
                                tags: Array.isArray(r?.tags) ? r.tags.map((t)=>String(t)) : undefined
                            })) : undefined,
                        lodging: Array.isArray(d.lodging) ? d.lodging.map((h)=>({
                                name: String(h?.name || "酒店"),
                                area: h?.area ? String(h.area) : undefined,
                                price: h?.price ? Number(h.price) : undefined,
                                rating: h?.rating ? Number(h.rating) : undefined,
                                distanceToCore: h?.distanceToCore ? Number(h.distanceToCore) : undefined,
                                amenities: Array.isArray(h?.amenities) ? h.amenities.map((a)=>String(a)) : undefined,
                                location: h?.location && typeof h.location === "object" ? {
                                    lat: Number(h.location.lat),
                                    lng: Number(h.location.lng)
                                } : undefined,
                                address: h?.address ? String(h.address) : undefined,
                                phone: h?.phone ? String(h.phone) : undefined,
                                opening_hours: h?.opening_hours ? String(h.opening_hours) : undefined,
                                website: h?.website ? String(h.website) : undefined,
                                tags: Array.isArray(h?.tags) ? h.tags.map((t)=>String(t)) : undefined,
                                stars: h?.stars ? Number(h.stars) : undefined,
                                checkin_time: h?.checkin_time ? String(h.checkin_time) : undefined,
                                checkout_time: h?.checkout_time ? String(h.checkout_time) : undefined,
                                room_types: Array.isArray(h?.room_types) ? h.room_types.map((rt)=>String(rt)) : undefined
                            })) : undefined,
                        attractions: Array.isArray(d.attractions) ? d.attractions.map((a)=>({
                                name: String(a?.name || "景点"),
                                ticket: typeof a?.ticket === "number" ? a.ticket : a?.ticket ? String(a.ticket) : undefined,
                                best_time: a?.best_time ? String(a.best_time) : undefined,
                                tips: a?.tips ? String(a.tips) : undefined,
                                photo_spots: Array.isArray(a?.photo_spots) ? a.photo_spots.map((p)=>String(p)) : undefined,
                                address: a?.address ? String(a.address) : undefined,
                                opening_hours: a?.opening_hours ? String(a.opening_hours) : undefined,
                                website: a?.website ? String(a.website) : undefined,
                                tags: Array.isArray(a?.tags) ? a.tags.map((t)=>String(t)) : undefined,
                                location: a?.location && typeof a.location === "object" ? {
                                    lat: Number(a.location.lat),
                                    lng: Number(a.location.lng)
                                } : undefined,
                                durationEstimate: a?.durationEstimate ? Number(a.durationEstimate) : undefined
                            })) : undefined
                    }));
                // 目的地地域校验：过滤掉明显跨城的餐饮/住宿/景点/活动地点
                const cityKeywords = [
                    "北京",
                    "天津",
                    "上海",
                    "重庆",
                    "广州",
                    "深圳",
                    "杭州",
                    "苏州",
                    "南京",
                    "武汉",
                    "成都",
                    "西安",
                    "青岛",
                    "大连",
                    "沈阳",
                    "长春",
                    "哈尔滨",
                    "济南",
                    "郑州",
                    "佛山",
                    "宁波",
                    "无锡",
                    "厦门",
                    "福州",
                    "合肥",
                    "长沙",
                    "南昌",
                    "昆明",
                    "石家庄",
                    "太原",
                    "兰州",
                    "呼和浩特",
                    "贵阳",
                    "南宁",
                    "海口",
                    "唐山",
                    "保定"
                ];
                const destKey = cityKeywords.find((c)=>destination.includes(c)) || destination;
                const includesOtherCity = (s)=>{
                    if (!s) return false;
                    const hasDest = s.includes(destKey);
                    const other = cityKeywords.some((c)=>s.includes(c) && c !== destKey);
                    return !hasDest && other;
                };
                const bounds = (()=>{
                    if (!candidatePOIs.length) return null;
                    const lats = candidatePOIs.map((p)=>p.lat);
                    const lngs = candidatePOIs.map((p)=>p.lng);
                    const padLat = 1.5;
                    const padLng = 1.5;
                    return {
                        minLat: Math.min(...lats) - padLat,
                        maxLat: Math.max(...lats) + padLat,
                        minLng: Math.min(...lngs) - padLng,
                        maxLng: Math.max(...lngs) + padLng
                    };
                })();
                const inBounds = (loc)=>{
                    if (!bounds || !loc || !Number.isFinite(loc.lat) || !Number.isFinite(loc.lng)) return true;
                    return loc.lat >= bounds.minLat && loc.lat <= bounds.maxLat && loc.lng >= bounds.minLng && loc.lng <= bounds.maxLng;
                };
                const isLocal = (name, address, loc)=>{
                    if (includesOtherCity(name) || includesOtherCity(address)) return false;
                    if (!inBounds(loc)) return false;
                    return true;
                };
                days = days.map((d)=>({
                        ...d,
                        items: d.items.map((it)=>{
                            const loc = it.place?.location;
                            const nm = it.place?.name || it.title;
                            if (it.place && !isLocal(nm, it.place?.address, loc)) {
                                // 若地点明显跨城，保留标题但去掉 place 以避免误导
                                const { place, ...rest } = it;
                                return {
                                    ...rest
                                };
                            }
                            return it;
                        }),
                        dining: Array.isArray(d.dining) ? d.dining.filter((r)=>isLocal(r?.name, r?.address, r?.location)) : d.dining,
                        lodging: Array.isArray(d.lodging) ? d.lodging.filter((h)=>isLocal(h?.name, h?.address, h?.location)) : d.lodging,
                        attractions: Array.isArray(d.attractions) ? d.attractions.filter((a)=>isLocal(a?.name, a?.address, a?.location)) : d.attractions
                    }));
                // 解析 markers（若模型已提供）
                const rawMarkers = Array.isArray(obj?.markers) ? obj.markers : [];
                const markers = rawMarkers.map((m)=>{
                    const pos = Array.isArray(m?.position) ? m.position : null;
                    const lng = Number(pos?.[0]);
                    const lat = Number(pos?.[1]);
                    if (Number.isFinite(lng) && Number.isFinite(lat)) {
                        return {
                            position: [
                                lng,
                                lat
                            ],
                            title: m?.title ? String(m.title) : undefined
                        };
                    }
                    return null;
                }).filter(Boolean);
                return {
                    days,
                    markers
                };
            }
            // Second path: repair from flat or malformed structure
            const allDates = allDays.map((d)=>fmtDateLocal(d));
            const days = (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$src$2f$lib$2f$itinerarySchema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["repairDays"])({
                rawDays,
                allDates,
                destination,
                pace
            });
            const rawMarkers = Array.isArray(obj?.markers) ? obj.markers : [];
            const markers = rawMarkers.map((m)=>{
                const pos = Array.isArray(m?.position) ? m.position : null;
                const lng = Number(pos?.[0]);
                const lat = Number(pos?.[1]);
                if (Number.isFinite(lng) && Number.isFinite(lat)) {
                    return {
                        position: [
                            lng,
                            lat
                        ],
                        title: m?.title ? String(m.title) : undefined
                    };
                }
                return null;
            }).filter(Boolean);
            return {
                days,
                markers
            };
        } catch  {
            return null;
        }
    }
    // 针对较长日期范围的稳健策略：分日生成并合并。
    // 当一次性生成失败时，逐日调用模型，显著降低截断与结构不合规概率。
    async function generateByDaysIndividually() {
        const apiKey = process.env.DOUBAO_API_KEY;
        const model = process.env.DOUBAO_MODEL;
        const base = process.env.DOUBAO_API_BASE || "";
        if (!apiKey || !model || !base) return null;
        const url = base.replace(/\/$/, "") + "/chat/completions";
        const concurrency = Math.max(1, Number(process.env.PER_DAY_CONCURRENCY ?? 2));
        const outDays = new Array(allDays.length).fill(null);
        const outMarkers = new Array(allDays.length).fill([]);
        let idx = 0;
        const worker = async ()=>{
            while(true){
                const pos = idx++;
                if (pos >= allDays.length) break;
                const d = allDays[pos];
                const sd = fmtDateLocal(d);
                const ed = fmtDateLocal(d);
                const schemaSnippet = {
                    type: "object",
                    properties: {
                        id: {
                            type: "string"
                        },
                        destination: {
                            type: "string"
                        },
                        start_date: {
                            type: "string"
                        },
                        end_date: {
                            type: "string"
                        },
                        days: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    date: {
                                        type: "string"
                                    },
                                    items: {
                                        type: "array"
                                    }
                                },
                                required: [
                                    "date",
                                    "items"
                                ],
                                additionalProperties: false
                            }
                        },
                        markers: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    position: {
                                        type: "array",
                                        items: {
                                            type: "number"
                                        },
                                        minItems: 2,
                                        maxItems: 2
                                    },
                                    title: {
                                        type: "string"
                                    }
                                },
                                required: [
                                    "position"
                                ],
                                additionalProperties: false
                            }
                        }
                    },
                    required: [
                        "destination",
                        "start_date",
                        "end_date",
                        "days"
                    ],
                    additionalProperties: false
                };
                const sys2 = `只输出严格 JSON；字段与层级必须与 Schema 完全一致：${JSON.stringify(schemaSnippet)}。生成 ${sd} 到 ${ed} 的单日行程；每天：lodging 仅 1 条且为具体酒店；dining 恰好 3 条（早餐/午餐/晚餐）；attractions ≤2；items 必须含 place.name、time 与 costEstimate；transport 必填 mode/timeEstimate/priceEstimate；所有地点必须在“${destination}”。预算约束：${budgetTotal !== undefined ? `总预算 ¥${Math.round(budgetTotal)}，确保与预算差额不超过 ¥1000；餐饮/门票按人数 ${Math.max(1, peopleCount)} 倍计入。` : `若提供预算，确保与预算差额不超过 ¥1000；餐饮/门票按人数倍数计入。`}最终输出为完整闭合 JSON。`;
                const user = `目的地:${destination}; 日期范围:${sd}~${ed}; 人数:${Math.max(1, peopleCount)}; 参考POI:${candidatePOIs.map((p)=>`${p.name}(${p.lng},${p.lat})`).join(";")}`;
                const baseBody = {
                    model,
                    messages: [
                        {
                            role: "system",
                            content: sys2
                        },
                        {
                            role: "user",
                            content: user
                        }
                    ],
                    temperature: Number(process.env.DOUBAO_TEMPERATURE ?? 0.2),
                    // 单日生成不需要过高的 token 上限，降低可提升速度
                    max_tokens: Math.min(Number(process.env.DOUBAO_MAX_TOKENS ?? 3500), 1800)
                };
                const tryCall = async (format)=>{
                    const body = format === "schema" ? {
                        ...baseBody,
                        response_format: {
                            type: "json_schema",
                            json_schema: {
                                name: "plan_schema",
                                schema: schemaSnippet
                            }
                        }
                    } : format === "object" ? {
                        ...baseBody,
                        response_format: {
                            type: "json_object"
                        }
                    } : baseBody;
                    const resp = await fetch(url, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${apiKey}`
                        },
                        body: JSON.stringify(body)
                    });
                    const data = await resp.json().catch(()=>null);
                    return {
                        resp,
                        data
                    };
                };
                let { resp, data } = await tryCall("object");
                if (!resp.ok) {
                    ({ resp, data } = await tryCall("schema"));
                    if (!resp.ok) {
                        ({ resp, data } = await tryCall("none"));
                    }
                }
                if (!resp.ok || !data) {
                    outDays[pos] = null;
                    outMarkers[pos] = [];
                    continue;
                }
                const content = data?.choices?.[0]?.message?.content ?? "";
                let obj = null;
                if (typeof content === "string") {
                    try {
                        obj = JSON.parse(content);
                    } catch  {
                        let s = content;
                        s = s.replace(/```[a-zA-Z]*\n?/g, "").replace(/```/g, "");
                        const m = s.match(/\{[\s\S]*\}/);
                        if (m) {
                            let candidate = m[0];
                            candidate = candidate.replace(/,\s*([\}\]])/g, "$1");
                            try {
                                obj = JSON.parse(candidate);
                            } catch  {}
                        }
                    }
                } else {
                    obj = content;
                }
                const rawDays = Array.isArray(obj?.days) ? obj.days : [];
                if (rawDays.length && Array.isArray(rawDays[0]?.items)) {
                    const single = rawDays[0];
                    const parsed = {
                        date: String(single.date || sd).slice(0, 10) || sd,
                        items: (Array.isArray(single.items) ? single.items : []).map((it, idx2)=>({
                                id: `${sd}-${idx2}`,
                                time: String(it.time || ""),
                                title: String(it.title || "待定"),
                                note: it.note ? String(it.note) : undefined,
                                place: it.place && typeof it.place === "object" ? {
                                    name: String(it.place.name || ""),
                                    location: it.place.location && typeof it.place.location === "object" ? {
                                        lat: Number(it.place.location.lat),
                                        lng: Number(it.place.location.lng)
                                    } : undefined,
                                    address: it.place.address ? String(it.place.address) : undefined,
                                    poiId: it.place.poiId ? String(it.place.poiId) : undefined,
                                    category: it.place.category ? String(it.place.category) : undefined
                                } : undefined,
                                durationEstimate: it.durationEstimate ? Number(it.durationEstimate) : undefined,
                                costEstimate: it.costEstimate ? Number(it.costEstimate) : undefined
                            })),
                        routePath: Array.isArray(single.routePath) ? single.routePath.map((p)=>({
                                lat: Number(p?.lat),
                                lng: Number(p?.lng)
                            })).filter((p)=>Number.isFinite(p.lat) && Number.isFinite(p.lng)) : undefined,
                        transport: single.transport && typeof single.transport === "object" ? {
                            mode: String(single.transport.mode || "transit"),
                            steps: Array.isArray(single.transport.steps) ? single.transport.steps.map((s)=>String(s)) : undefined,
                            timeEstimate: single.transport.timeEstimate ? Number(single.transport.timeEstimate) : undefined,
                            priceEstimate: single.transport.priceEstimate ? Number(single.transport.priceEstimate) : undefined
                        } : undefined,
                        dining: Array.isArray(single.dining) ? single.dining.map((r)=>({
                                name: String(r?.name || "餐馆"),
                                cuisine: r?.cuisine ? String(r.cuisine) : undefined,
                                priceRange: Array.isArray(r?.priceRange) && r.priceRange.length === 2 ? [
                                    Number(r.priceRange[0]),
                                    Number(r.priceRange[1])
                                ] : undefined,
                                rating: r?.rating ? Number(r.rating) : undefined,
                                distance: r?.distance ? Number(r.distance) : undefined,
                                booking: typeof r?.booking === "boolean" ? r.booking : undefined,
                                location: r?.location && typeof r.location === "object" ? {
                                    lat: Number(r.location.lat),
                                    lng: Number(r.location.lng)
                                } : undefined,
                                address: r?.address ? String(r.address) : undefined,
                                phone: r?.phone ? String(r.phone) : undefined,
                                opening_hours: r?.opening_hours ? String(r.opening_hours) : undefined,
                                website: r?.website ? String(r.website) : undefined,
                                tags: Array.isArray(r?.tags) ? r.tags.map((t)=>String(t)) : undefined
                            })) : undefined,
                        lodging: Array.isArray(single.lodging) ? single.lodging.map((h)=>({
                                name: String(h?.name || "酒店"),
                                area: h?.area ? String(h.area) : undefined,
                                price: h?.price ? Number(h.price) : undefined,
                                rating: h?.rating ? Number(h.rating) : undefined,
                                distanceToCore: h?.distanceToCore ? Number(h.distanceToCore) : undefined,
                                amenities: Array.isArray(h?.amenities) ? h.amenities.map((a)=>String(a)) : undefined,
                                location: h?.location && typeof h.location === "object" ? {
                                    lat: Number(h.location.lat),
                                    lng: Number(h.location.lng)
                                } : undefined,
                                address: h?.address ? String(h.address) : undefined,
                                phone: h?.phone ? String(h.phone) : undefined,
                                opening_hours: h?.opening_hours ? String(h.opening_hours) : undefined,
                                website: h?.website ? String(h.website) : undefined,
                                tags: Array.isArray(h?.tags) ? h.tags.map((t)=>String(t)) : undefined,
                                stars: h?.stars ? Number(h.stars) : undefined,
                                checkin_time: h?.checkin_time ? String(h.checkin_time) : undefined,
                                checkout_time: h?.checkout_time ? String(h.checkout_time) : undefined,
                                room_types: Array.isArray(h?.room_types) ? h.room_types.map((rt)=>String(rt)) : undefined
                            })) : undefined,
                        attractions: Array.isArray(single.attractions) ? single.attractions.map((a)=>({
                                name: String(a?.name || "景点"),
                                ticket: typeof a?.ticket === "number" ? a.ticket : a?.ticket ? String(a.ticket) : undefined,
                                best_time: a?.best_time ? String(a.best_time) : undefined,
                                tips: a?.tips ? String(a.tips) : undefined,
                                photo_spots: Array.isArray(a?.photo_spots) ? a.photo_spots.map((p)=>String(p)) : undefined,
                                address: a?.address ? String(a.address) : undefined,
                                opening_hours: a?.opening_hours ? String(a.opening_hours) : undefined,
                                website: a?.website ? String(a.website) : undefined,
                                tags: Array.isArray(a?.tags) ? a.tags.map((t)=>String(t)) : undefined,
                                location: a?.location && typeof a.location === "object" ? {
                                    lat: Number(a.location.lat),
                                    lng: Number(a.location.lng)
                                } : undefined,
                                durationEstimate: a?.durationEstimate ? Number(a.durationEstimate) : undefined
                            })) : undefined
                    };
                    outDays[pos] = parsed;
                    const rawMarkers = Array.isArray(obj?.markers) ? obj.markers : [];
                    const markers = rawMarkers.map((m)=>{
                        const posi = Array.isArray(m?.position) ? m.position : null;
                        const lng = Number(posi?.[0]);
                        const lat = Number(posi?.[1]);
                        if (Number.isFinite(lng) && Number.isFinite(lat)) {
                            return {
                                position: [
                                    lng,
                                    lat
                                ],
                                title: m?.title ? String(m.title) : undefined
                            };
                        }
                        return null;
                    }).filter(Boolean);
                    outMarkers[pos] = markers;
                } else {
                    outDays[pos] = null;
                    outMarkers[pos] = [];
                }
            }
        };
        await Promise.all(Array.from({
            length: concurrency
        }, ()=>worker()));
        if (outDays.every((d)=>d !== null)) {
            const days = outDays.filter(Boolean);
            const merged = [];
            const seen = new Set();
            for (const arr of outMarkers){
                for (const m of arr){
                    const k = `${m.position[0].toFixed(6)}_${m.position[1].toFixed(6)}_${m.title || ""}`;
                    if (seen.has(k)) continue;
                    seen.add(k);
                    merged.push(m);
                }
            }
            return {
                days,
                markers: merged
            };
        }
        return null;
    }
    let generated = await generatePlanWithDoubao();
    let days = generated?.days || null;
    let source = days ? "llm" : "fallback";
    // 若一次性生成失败且日期超过2天，尝试分日生成以提升成功率
    if (!days && allDays.length > 2) {
        const perDay = await generateByDaysIndividually();
        if (perDay?.days?.length) {
            days = perDay.days;
            generated = perDay;
            source = "llm";
        }
    }
    if (!days) {
        // 本地回退生成
        days = allDays.map((d, i)=>{
            const dateStr = fmtDateLocal(d);
            const pick = (j)=>candidatePOIs[j % (candidatePOIs.length || 1)];
            const items = slots.map((slot, idx)=>{
                const poi = pick(i * 3 + idx);
                return {
                    id: `${dateStr}-${idx}`,
                    time: (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$src$2f$lib$2f$itinerarySchema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defaultSlotTime"])(idx),
                    title: `${poi.name} 深度体验 (${slot})`,
                    note: idx === 0 ? "推荐乘船或湖畔步行，拍摄经典机位" : idx === 1 ? "文化打卡与美食探店结合" : "夜游街区，品尝当地小吃",
                    place: {
                        name: poi.name,
                        location: {
                            lat: poi.lat,
                            lng: poi.lng
                        }
                    },
                    durationEstimate: 90,
                    costEstimate: idx === 0 ? 50 : idx === 1 ? 80 : 30
                };
            });
            const isWuhan = /武汉|Wuhan/i.test(destination);
            const isHangzhou = /杭州|Hangzhou/i.test(destination);
            const dining = isWuhan ? [
                {
                    name: "蔡林记(户部巷店)",
                    cuisine: "武汉小吃",
                    priceRange: [
                        20,
                        40
                    ],
                    rating: 4.5,
                    location: candidatePOIs[0] ? {
                        lat: candidatePOIs[0].lat,
                        lng: candidatePOIs[0].lng
                    } : undefined,
                    address: "武昌区户部巷",
                    phone: "027-xxx",
                    opening_hours: "06:30-21:30",
                    tags: [
                        "热干面",
                        "老字号"
                    ]
                },
                {
                    name: "四季美汤包(楚河汉街店)",
                    cuisine: "汤包/小吃",
                    priceRange: [
                        25,
                        60
                    ],
                    rating: 4.4,
                    location: candidatePOIs[1] ? {
                        lat: candidatePOIs[1].lat,
                        lng: candidatePOIs[1].lng
                    } : undefined,
                    address: "楚河汉街",
                    phone: "027-xxx",
                    opening_hours: "07:00-21:30",
                    tags: [
                        "人气",
                        "本地人"
                    ]
                },
                {
                    name: "周黑鸭(江汉路总店)",
                    cuisine: "卤味",
                    priceRange: [
                        30,
                        80
                    ],
                    rating: 4.3,
                    location: candidatePOIs[2] ? {
                        lat: candidatePOIs[2].lat,
                        lng: candidatePOIs[2].lng
                    } : undefined,
                    address: "江汉路步行街",
                    opening_hours: "10:00-22:00",
                    tags: [
                        "伴手礼"
                    ]
                }
            ] : isHangzhou ? [
                {
                    name: "楼外楼(西湖店)",
                    cuisine: "杭帮菜",
                    priceRange: [
                        80,
                        180
                    ],
                    rating: 4.6,
                    location: candidatePOIs[0] ? {
                        lat: candidatePOIs[0].lat,
                        lng: candidatePOIs[0].lng
                    } : undefined,
                    address: "西湖风景区孤山路30号",
                    phone: "0571-xxx",
                    opening_hours: "10:00-20:00",
                    tags: [
                        "老字号",
                        "湖景"
                    ]
                },
                {
                    name: "外婆家(湖滨银泰)",
                    cuisine: "家常菜",
                    priceRange: [
                        60,
                        120
                    ],
                    rating: 4.5,
                    location: candidatePOIs[1] ? {
                        lat: candidatePOIs[1].lat,
                        lng: candidatePOIs[1].lng
                    } : undefined,
                    address: "湖滨银泰in77",
                    phone: "0571-xxx",
                    opening_hours: "11:00-21:30",
                    tags: [
                        "人气",
                        "排队"
                    ]
                },
                {
                    name: "知味观(总店)",
                    cuisine: "小吃",
                    priceRange: [
                        20,
                        50
                    ],
                    rating: 4.3,
                    location: candidatePOIs[2] ? {
                        lat: candidatePOIs[2].lat,
                        lng: candidatePOIs[2].lng
                    } : undefined,
                    address: "延安路83号",
                    opening_hours: "07:00-21:00",
                    tags: [
                        "早点",
                        "本地人"
                    ]
                }
            ] : [
                {
                    name: `${destination} 当地菜馆 A`,
                    cuisine: "地方菜",
                    priceRange: [
                        50,
                        120
                    ],
                    rating: 4.4,
                    location: candidatePOIs[0] ? {
                        lat: candidatePOIs[0].lat,
                        lng: candidatePOIs[0].lng
                    } : undefined,
                    tags: [
                        "人气"
                    ]
                },
                {
                    name: `${destination} 小吃街 B`,
                    cuisine: "小吃",
                    priceRange: [
                        20,
                        60
                    ],
                    rating: 4.2,
                    location: candidatePOIs[1] ? {
                        lat: candidatePOIs[1].lat,
                        lng: candidatePOIs[1].lng
                    } : undefined,
                    tags: [
                        "本地人"
                    ]
                },
                {
                    name: `${destination} 特色餐厅 C`,
                    cuisine: "特色菜",
                    priceRange: [
                        80,
                        180
                    ],
                    rating: 4.3,
                    location: candidatePOIs[2] ? {
                        lat: candidatePOIs[2].lat,
                        lng: candidatePOIs[2].lng
                    } : undefined,
                    tags: [
                        "适合家庭"
                    ]
                }
            ];
            const lodgingArea = isWuhan ? "楚河汉街/东湖" : isHangzhou ? "湖滨/西湖" : "市中心";
            const lodging = [
                {
                    name: `${destination} 精品酒店·日${i + 1}`,
                    area: lodgingArea,
                    price: 420,
                    rating: 4.3,
                    amenities: [
                        "WiFi",
                        "早餐",
                        "空调"
                    ],
                    stars: 4,
                    checkin_time: "14:00",
                    checkout_time: "12:00",
                    location: candidatePOIs[i % (candidatePOIs.length || 1)] ? {
                        lat: candidatePOIs[i % (candidatePOIs.length || 1)].lat,
                        lng: candidatePOIs[i % (candidatePOIs.length || 1)].lng
                    } : undefined
                }
            ];
            const transport = {
                mode: "transit",
                steps: [
                    "地铁与公交组合",
                    "步行 10 分钟"
                ],
                timeEstimate: 30,
                priceEstimate: 20
            };
            const aPick = (j)=>candidatePOIs[j % (candidatePOIs.length || 1)];
            const attractions = [
                {
                    name: `${aPick(i * 2).name || destination} 景点`,
                    ticket: 60,
                    best_time: "上午",
                    tips: "提前购票，错峰入园",
                    photo_spots: [
                        "主入口",
                        "观景台"
                    ],
                    location: {
                        lat: aPick(i * 2).lat,
                        lng: aPick(i * 2).lng
                    }
                },
                {
                    name: `${aPick(i * 2 + 1).name || destination} 景点`,
                    ticket: 80,
                    best_time: "下午",
                    tips: "注意防晒，补水",
                    photo_spots: [
                        "湖畔",
                        "古街"
                    ],
                    location: {
                        lat: aPick(i * 2 + 1).lat,
                        lng: aPick(i * 2 + 1).lng
                    }
                }
            ];
            const routePath = candidatePOIs.length >= 2 ? [
                {
                    lat: pick(0).lat,
                    lng: pick(0).lng
                },
                {
                    lat: pick(1).lat,
                    lng: pick(1).lng
                }
            ] : undefined;
            return {
                date: dateStr,
                items,
                dining,
                lodging,
                transport,
                attractions,
                routePath
            };
        });
    }
    const markers = generated?.markers && generated.markers.length ? generated.markers : candidateMarkers.length ? candidateMarkers : await findCityMarkers(destination);
    // --- Strong budget enforcement: refine when outside ±1000 of user budget ---
    if (days && typeof budgetTotal === "number") {
        const { totals } = estimateBudgetTotals(days, peopleCount);
        const diff = Math.abs(totals.grand - budgetTotal);
        if (diff > 1000) {
            const refined = await refinePlanToBudget({
                originalDays: days,
                destination,
                start_date,
                end_date,
                budgetTotal,
                peopleCount
            });
            if (refined && refined.length) {
                const { totals: newTotals } = estimateBudgetTotals(refined, peopleCount);
                const newDiff = Math.abs(newTotals.grand - budgetTotal);
                if (newDiff <= diff) {
                    days = refined;
                }
            }
        }
    }
    // Ensure each day has exactly 3 dining entries by padding placeholders when missing
    if (Array.isArray(days)) {
        days = days.map((d)=>{
            const existing = Array.isArray(d.dining) ? d.dining.slice(0, 3) : [];
            if (existing.length >= 3) return d;
            const placeholders = [
                {
                    name: `${destination} 早餐推荐`,
                    priceRange: [
                        20,
                        50
                    ]
                },
                {
                    name: `${destination} 午餐推荐`,
                    priceRange: [
                        40,
                        80
                    ]
                },
                {
                    name: `${destination} 晚餐推荐`,
                    priceRange: [
                        60,
                        120
                    ]
                }
            ];
            const padded = [
                ...existing
            ];
            for(let i = existing.length; i < 3; i++)padded.push(placeholders[i]);
            return {
                ...d,
                dining: padded
            };
        });
    }
    const data = {
        id: `generated-${Math.random().toString(36).slice(2, 8)}`,
        destination,
        start_date,
        end_date,
        days: days,
        markers,
        source
    };
    // Validate final data strictly; if invalid, attempt minimal repair and return
    const validated = __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$src$2f$lib$2f$itinerarySchema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PlanDataSchema"].safeParse(data);
    if (!validated.success) {
        // Minimal repair: ensure dates coverage
        const allDates = allDays.map((d)=>fmtDateLocal(d));
        const repairedDays = (0, __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$src$2f$lib$2f$itinerarySchema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["repairDays"])({
            rawDays: data.days,
            allDates,
            destination,
            pace
        });
        const repaired = {
            ...data,
            days: repairedDays
        };
        const reparsed = __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$src$2f$lib$2f$itinerarySchema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PlanDataSchema"].safeParse(repaired);
        if (!reparsed.success) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "generation_failed",
                issues: reparsed.error.issues
            }, {
                status: 500
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(repaired);
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$AI$2d$Travel$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(validated.data);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__89eabb8f._.js.map