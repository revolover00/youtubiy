const state = { route: { type: "home" } };
const next = { type: "home" };
console.log(JSON.stringify(state.route) === JSON.stringify(next));
