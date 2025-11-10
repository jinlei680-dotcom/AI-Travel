// Simple local test to call /api/plan/create and print JSON
const url = "http://localhost:3000/api/plan/create";

const body = {
  destination: "上海",
  start_date: "2025-11-20",
  end_date: "2025-11-22",
  preferences: { pace: "standard", interests: ["美食", "历史"], budgetTotal: 3000 },
};

async function main() {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    console.log("STATUS:", res.status);
    try {
      const json = JSON.parse(text);
      console.log(JSON.stringify(json, null, 2));
    } catch {
      console.log(text);
    }
  } catch (err) {
    console.error("Request failed:", err);
  }
}

main();